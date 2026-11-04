#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
    printf 'Run this script as root (sudo).\n' >&2
    exit 1
fi

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
DEPLOY_USER=wangrq
SITE_ROOT=/var/www/normal-www
SITE_CONFIG=/etc/nginx/sites-available/normal-www.conf
SITE_LINK=/etc/nginx/sites-enabled/normal-www.conf
CERTBOT_EMAIL=${CERTBOT_EMAIL:-wrq142857@gmail.com}
BACKUP_DIR=/var/backups/normal-www/$(date -u +%Y%m%dT%H%M%SZ)-$$

id "$DEPLOY_USER" >/dev/null
for file in nginx-http.conf nginx-https.conf renew-certificate.sh reload-nginx.sh; do
    [[ -f "$SCRIPT_DIR/$file" ]] || { printf 'Missing %s\n' "$SCRIPT_DIR/$file" >&2; exit 1; }
done

# Install only the packages needed to serve the site and renew its certificate.
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install --no-install-recommends -y nginx certbot rsync

install -d -m 755 -o "$DEPLOY_USER" -g "$(id -gn "$DEPLOY_USER")" "$SITE_ROOT" "$SITE_ROOT/releases"
install -d -m 755 /var/www/letsencrypt/.well-known/acme-challenge
install -d -m 700 "$BACKUP_DIR"
install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy

if [[ -L "$SITE_CONFIG" ]]; then
    printf 'Refusing to overwrite an Nginx configuration symlink: %s\n' "$SITE_CONFIG" >&2
    exit 1
fi

if [[ -L "$SITE_LINK" ]]; then
    if [[ $(readlink "$SITE_LINK") != "$SITE_CONFIG" ]]; then
        printf 'Refusing to replace an unrelated Nginx symlink: %s\n' "$SITE_LINK" >&2
        exit 1
    fi
elif [[ -e "$SITE_LINK" ]]; then
    printf 'Refusing to replace an existing non-symlink Nginx config: %s\n' "$SITE_LINK" >&2
    exit 1
fi

config_sequence=0
apply_nginx_config() {
    local source=$1
    config_sequence=$((config_sequence + 1))
    local previous="$BACKUP_DIR/$config_sequence-$(basename "$source").previous"
    local had_config=0
    local had_link=0
    if [[ -e "$SITE_CONFIG" ]]; then
        cp -a "$SITE_CONFIG" "$previous"
        had_config=1
    fi
    [[ -L "$SITE_LINK" ]] && had_link=1
    install -m 644 "$source" "$SITE_CONFIG"
    if [[ $had_link -eq 0 ]]; then
        ln -s "$SITE_CONFIG" "$SITE_LINK"
    fi
    if ! nginx -t; then
        if [[ $had_config -eq 1 ]]; then
            cp -a "$previous" "$SITE_CONFIG"
        else
            rm -f "$SITE_CONFIG"
        fi
        [[ $had_link -eq 1 ]] || rm -f "$SITE_LINK"
        printf 'Nginx config failed validation; previous config restored.\n' >&2
        return 1
    fi
    systemctl enable --now nginx
    systemctl reload nginx
}

# An existing valid installation keeps HTTPS available during a repeat setup.
if [[ -s /etc/letsencrypt/live/wangrq.cn/fullchain.pem && -s /etc/letsencrypt/live/wangrq.cn/privkey.pem ]]; then
    apply_nginx_config "$SCRIPT_DIR/nginx-https.conf"
else
    apply_nginx_config "$SCRIPT_DIR/nginx-http.conf"
fi

for target in /etc/letsencrypt/renewal-hooks/deploy/normal-www-nginx /usr/local/sbin/normal-www-renew; do
    if [[ -e "$target" ]]; then
        cp -a "$target" "$BACKUP_DIR/$(basename "$target").previous"
    fi
done
install -m 755 "$SCRIPT_DIR/reload-nginx.sh" /etc/letsencrypt/renewal-hooks/deploy/normal-www-nginx
install -m 755 "$SCRIPT_DIR/renew-certificate.sh" /usr/local/sbin/normal-www-renew

# DNS must point here and public TCP 80/443 must be reachable before this step.
certbot certonly --non-interactive --agree-tos \
    --email "$CERTBOT_EMAIL" --cert-name wangrq.cn \
    --webroot --webroot-path /var/www/letsencrypt \
    --domain wangrq.cn --keep-until-expiring

apply_nginx_config "$SCRIPT_DIR/nginx-https.conf"

# Ubuntu's package supplies a twice-daily timer. Do not add a duplicate cron job.
systemctl enable --now certbot.timer
systemctl is-active --quiet nginx
systemctl is-active --quiet certbot.timer
printf '\nConfigured https://wangrq.cn; Nginx root: %s/current\n' "$SITE_ROOT"
printf 'Certificate renewal: certbot.timer; backups: %s\n' "$BACKUP_DIR"
printf 'Test renewal: sudo /usr/local/sbin/normal-www-renew --dry-run\n'
