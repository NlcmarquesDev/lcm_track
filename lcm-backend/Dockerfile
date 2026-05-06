FROM php:8.4-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl \
    && docker-php-ext-install pdo pdo_mysql zip

# Ativar mod_rewrite (IMPORTANTE para Laravel)
RUN a2enmod rewrite

# Definir ServerName (remove warning Apache)
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Mudar DocumentRoot para Laravel /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf

RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Workdir
WORKDIR /var/www/html

# Copiar projeto
COPY . .

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar dependências PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissões Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]