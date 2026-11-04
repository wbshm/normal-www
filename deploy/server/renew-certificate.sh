#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
    printf 'Run this script as root (sudo).\n' >&2
    exit 1
fi

case "${1:-}" in
    '')
        exec /usr/bin/certbot renew --cert-name wangrq.cn --quiet
        ;;
    --dry-run)
        # Validate both ACME renewal and the deploy hook without replacing the live cert.
        exec /usr/bin/certbot renew --cert-name wangrq.cn --dry-run --run-deploy-hooks
        ;;
    *)
        printf 'Usage: %s [--dry-run]\n' "$0" >&2
        exit 2
        ;;
esac
