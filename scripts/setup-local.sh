#!/bin/bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"
source "$ROOT/scripts/node-env.sh"
existing=$(git config --get core.hooksPath || true)
if [ -n "$existing" ] && [ "$existing" != .githooks ]; then
  printf '已有 core.hooksPath=%s，请先合并现有 hooks，再启用 .githooks。\n' "$existing" >&2
  exit 1
fi
if [ -z "$existing" ] && [ -f "$(git rev-parse --git-path hooks/post-commit)" ]; then
  printf '已有 post-commit hook，请先合并到 .githooks/post-commit。\n' >&2
  exit 1
fi
chmod +x .githooks/post-commit scripts/deploy.sh scripts/setup-local.sh
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
  printf '找不到现有 ~/.ssh/id_rsa；请先按实际密钥更新 deploy/ssh_config。\n' >&2
  exit 1
fi
# Include the managed file before broad Host * rules. Preserve other SSH hosts.
managed="$HOME/.ssh/normal-www.conf"
config="$HOME/.ssh/config"
if [ -L "$config" ] || [ -L "$managed" ]; then
  printf 'SSH 配置是符号链接，请手动合并 deploy/ssh_config，避免覆盖链接。\n' >&2
  exit 1
fi
if [ -f "$config" ]; then
  cp -p "$config" "$config.normal-www-backup-$(date +%Y%m%d%H%M%S)-$$"
fi
cp deploy/ssh_config "$managed"
chmod 600 "$managed"
if ! grep -Fqx 'Include ~/.ssh/normal-www.conf' "$config" 2>/dev/null; then
  temporary=$(mktemp "$HOME/.ssh/config.XXXXXX")
  printf 'Include ~/.ssh/normal-www.conf\n\n' > "$temporary"
  if [ -f "$config" ]; then cat "$config" >> "$temporary"; fi
  mv "$temporary" "$config"
fi
chmod 600 "$config"
ssh -o BatchMode=yes normal-www 'printf "SSH connected: "; id -un'
git config --local core.hooksPath .githooks
printf '已启用 main 分支 post-commit 自动部署。手动发布：npm run deploy\n'
