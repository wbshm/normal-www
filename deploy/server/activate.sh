#!/bin/bash
set -euo pipefail
release=${1:?Release name required}
[[ "$release" =~ ^[0-9]{8}T[0-9]{6}Z-[a-f0-9]{12}-[0-9]+$ ]] || exit 2
root=/var/www/normal-www
exec 9>"$root/.activate.lock"
flock -w 120 9
test -s "$root/releases/$release/index.html"
test "$(cat "$root/releases/$release/deploy-version.txt")" = "$release"
previous=$(readlink "$root/current" || true)
if [ -e "$root/current" ] && [ ! -L "$root/current" ]; then
  printf 'Refusing to replace a non-symlink current directory.\n' >&2
  exit 1
fi
temporary="$root/.current-$release"
trap 'rm -f -- "$temporary"' EXIT
ln -s "releases/$release" "$temporary"
mv -Tf "$temporary" "$root/current"
if ! actual=$(curl --fail --silent --show-error --max-time 20 --resolve wangrq.cn:443:127.0.0.1 \
  https://wangrq.cn/deploy-version.txt) || [ "$actual" != "$release" ] || \
  ! curl --fail --silent --show-error --max-time 20 --resolve wangrq.cn:443:127.0.0.1 \
  https://wangrq.cn/ >/dev/null; then
  if [ -n "$previous" ]; then
    ln -s "$previous" "$temporary"
    mv -Tf "$temporary" "$root/current"
    printf 'Health check failed; previous release restored: %s\n' "$previous" >&2
  else
    rm -f "$root/current"
    printf 'Health check failed; initial release deactivated.\n' >&2
  fi
  exit 1
fi
printf 'Activated %s; previous: %s\n' "$release" "${previous:-none}"
