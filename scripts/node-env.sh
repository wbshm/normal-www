#!/bin/bash
# Git GUI clients may not load the interactive shell's Node version manager.
normal_node_supported() {
  "$1" -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major >= 24 || (major === 22 && minor >= 12) ? 0 : 1)' >/dev/null 2>&1
}

if [ -n "${DEPLOY_NODE_BIN:-}" ]; then
  export PATH="$DEPLOY_NODE_BIN:$PATH"
fi
if ! command -v node >/dev/null || ! normal_node_supported "$(command -v node)"; then
  for normal_bin in \
    "$HOME/Library/Application Support/fnm/node-versions/"*/installation/bin \
    "${XDG_DATA_HOME:-$HOME/.local/share}/fnm/node-versions/"*/installation/bin \
    "$HOME/.nvm/versions/node/"*/bin \
    /opt/homebrew/opt/node@24/bin /opt/homebrew/opt/node@22/bin /opt/homebrew/bin /usr/local/bin; do
    if [ -x "$normal_bin/node" ] && normal_node_supported "$normal_bin/node"; then
      export PATH="$normal_bin:$PATH"
      break
    fi
  done
fi
if ! command -v node >/dev/null || ! normal_node_supported "$(command -v node)"; then
  printf '[deploy] 需要 Node.js 22.12+（22 LTS）或 24+；可设置 DEPLOY_NODE_BIN。\n' >&2
  return 1
fi
command -v npm >/dev/null || return 1
