#!/bin/bash
# init-ssl.sh — Emite o certificado Let's Encrypt pela primeira vez
# Uso: bash scripts/init-ssl.sh <dominio> <email>
# Fluxo atual:
# 1) sobe apenas nginx em modo HTTP (prod.http) para desafio ACME
# 2) executa certbot em container avulso
# 3) sobe nginx em modo HTTPS (prod.https)

set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Uso: bash scripts/init-ssl.sh <dominio> <email>"
  exit 1
fi

APP_DIR="/opt/condominio"
HTTP_COMPOSE="docker-compose.prod.http.yml"
HTTPS_COMPOSE="docker-compose.prod.https.yml"

echo "==> Subindo Nginx em modo HTTP para desafio ACME..."
cd "$APP_DIR"
docker compose -f "$HTTP_COMPOSE" up -d nginx

echo "==> Aguardando Nginx ficar pronto..."
sleep 5

echo "==> Emitindo certificado para $DOMAIN..."
docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/www/certbot:/var/www/certbot \
  certbot/certbot:latest certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "==> Recarregando Nginx com SSL ativo..."
docker compose -f "$HTTPS_COMPOSE" up -d nginx

echo ""
echo "===================================================="
echo " Certificado emitido com sucesso!"
echo " Nginx alterado para modo HTTPS."
echo " Dica: configure renovação via cron/systemd executando certbot periodicamente."
echo "===================================================="
