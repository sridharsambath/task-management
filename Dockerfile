# syntax=docker/dockerfile:1
# Multi-stage: composer, dev, production

# -----------------------------------------------------------------------------
# Stage: composer (shared for production build)
# -----------------------------------------------------------------------------
FROM php:8.4-cli AS composer

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction

COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative

# -----------------------------------------------------------------------------
# Stage: dev (development - run migrate + serve)
# -----------------------------------------------------------------------------
FROM php:8.4-cli AS dev

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-interaction

COPY . .
RUN composer dump-autoload

# Entrypoint: migrate then serve (overridden by command in compose if needed)
COPY docker/entrypoint.dev.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# -----------------------------------------------------------------------------
# Stage: production (PHP-FPM)
# -----------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS production

RUN apk add --no-cache \
    libpq \
    postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apk del postgresql-dev

RUN addgroup -g 1000 www && adduser -u 1000 -G www -s /sbin/nologin -D www

WORKDIR /var/www/html

COPY --from=composer /app /var/www/html

RUN chown -R www:www /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

USER www

EXPOSE 9000

CMD ["php-fpm"]
