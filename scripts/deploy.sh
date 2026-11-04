#!/bin/bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"
case "${1:-}" in
  ''|--hook) ;;
  *) printf 'Usage: %s [--hook]\n' "$0" >&2; exit 2 ;;
esac
if [ "${1:-}" = --hook ]; then
  branch=$(git symbolic-ref --short -q HEAD || true)
  if [ "$branch" != main ]; then
    printf '[deploy] 分支 %s 不自动发布（仅 main）。\n' "${branch:-detached HEAD}"
    exit 0
  fi
  for state in rebase-merge rebase-apply; do
    if [ -d "$(git rev-parse --git-path "$state")" ]; then
      printf '[deploy] rebase 期间跳过发布；结束后运行 npm run deploy。\n'
      exit 0
    fi
  done
fi

source "$ROOT/scripts/node-env.sh"
HOST=${DEPLOY_HOST:-normal-www}
REMOTE_ROOT=/var/www/normal-www
COMMIT=$(git rev-parse --verify HEAD)
RELEASE="$(date -u +%Y%m%dT%H%M%SZ)-${COMMIT:0:12}-$$"
SSH=(ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=15)
LOCK=$(git rev-parse --git-path normal-www-deploy.lock)
if ! mkdir "$LOCK" 2>/dev/null; then
  printf '[deploy] 已有发布运行或残留锁：%s。确认没有发布进程后可删除该目录。\n' "$LOCK" >&2
  exit 1
fi
WORK=''
cleanup() {
  [ -z "$WORK" ] || rm -rf -- "$WORK"
  rmdir "$LOCK" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
WORK=$(mktemp -d "${TMPDIR:-/tmp}/normal-www-deploy.XXXXXX")

printf '[deploy] 构建已提交版本 %s（%s）\n' "$COMMIT" "$(node --version)"
# Build an immutable snapshot so unstaged files and untracked secrets never ship.
git archive "$COMMIT" | tar -x -C "$WORK"
if [ ! -f "$WORK/deploy/server/activate.sh" ]; then
  printf '[deploy] HEAD 尚未包含部署文件；请先将部署脚本和主站构建配置一起提交。\n' >&2
  exit 1
fi
(
  cd "$WORK"
  export ASTRO_SITE=https://wangrq.cn ASTRO_BASE=/ ASTRO_TELEMETRY_DISABLED=1
  unset SITE_ORIGIN
  npm ci --prefer-offline --no-audit --no-fund
  npm run check
  npm run build
  npm run verify
  node --input-type=module -e 'import { readFileSync } from "node:fs"; if (!readFileSync("dist/index.html", "utf8").includes("rel=\"canonical\" href=\"https://wangrq.cn/\"")) throw new Error("HEAD must include the wangrq.cn build configuration");'
)
printf '%s\n' "$RELEASE" > "$WORK/dist/deploy-version.txt"

printf '[deploy] 上传到 %s:%s/releases/%s\n' "$HOST" "$REMOTE_ROOT" "$RELEASE"
"${SSH[@]}" "$HOST" "mkdir -p '$REMOTE_ROOT/releases/$RELEASE'"
rsync -az --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r -e 'ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=15' \
  "$WORK/dist/" "$HOST:$REMOTE_ROOT/releases/$RELEASE/"

# Serialize activation on the server, keep the previous release for rollback,
# and restore it automatically if the HTTPS health check fails.
"${SSH[@]}" "$HOST" "bash -s -- '$RELEASE'" < "$WORK/deploy/server/activate.sh"
printf '[deploy] 已发布 https://wangrq.cn/ （%s）\n' "$COMMIT"
