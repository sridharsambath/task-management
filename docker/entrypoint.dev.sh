#!/bin/sh
set -e
# Ensure Laravel uses container env (e.g. DB_HOST=postgres), not cached config from host
php artisan config:clear
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
  php artisan key:generate --force
fi
php artisan migrate --force
exec "$@"
