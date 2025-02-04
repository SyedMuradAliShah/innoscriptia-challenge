# Use official PHP 8.3 with Apache
FROM php:8.3-apache

# Update package lists and install required dependencies
RUN apt-get update --fix-missing \
    && apt-get install -y \
    zip unzip curl nodejs npm \
    libsqlite3-dev sqlite3 \
    && docker-php-ext-configure pdo_sqlite --with-pdo-sqlite=/usr \
    && docker-php-ext-install pdo pdo_sqlite \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set working directory
WORKDIR /var/www/html

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel application
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Install NPM dependencies
RUN npm install --legacy-peer-deps

# Ensure SQLite database file exists and is persisted
RUN mkdir -p database && touch database/database.sqlite \
    && chmod -R 777 database storage bootstrap/cache \
    && chown -R www-data:www-data database storage bootstrap/cache

# Migrate the database but only if the file is empty
RUN if [ ! -s database/database.sqlite ]; then php artisan migrate --force; fi

# Point Apache to the public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Restart Apache to apply changes
RUN service apache2 restart