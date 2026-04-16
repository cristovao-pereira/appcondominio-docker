#!/bin/bash
# init-ssl.sh — Emite o certificado Let's Encrypt pela primeira vez
# Uso: bash scripts/init-ssl.sh <dominio> <email>
# Executar na VPS depois de subir o Nginx com docker compose

set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Uso: bash scripts/init-ssl.sh <dominio> <email>"
  exit 1
fi

APP_DIR="/opt/condominio"

echo "==> Subindo Nginx para desafio ACME (HTTP)..."
cd "$APP_DIR"
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx

echo "==> Aguardando Nginx ficar pronto..."
sleep 5

echo "==> Emitindo certificado para $DOMAIN..."
docker run --rm \
  -v "${APP_DIR}/infra/certbot/www:/var/www/certbot" \
  -v "${APP_DIR}/infra/certbot/certs:/etc/letsencrypt" \
  certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

echo "==> Recarregando Nginx com SSL ativo..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload

echo ""
echo "===================================================="
echo " Certificado emitido com sucesso!"
echo " Renovação automática gerenciada pelo container certbot."
echo "===================================================="
