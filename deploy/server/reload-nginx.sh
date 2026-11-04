#!/bin/sh
set -eu

# Certbot invokes deploy hooks only after a successful certificate issuance/renewal.
/usr/sbin/nginx -t
/usr/bin/systemctl reload nginx
