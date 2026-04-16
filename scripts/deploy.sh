#!/bin/bash
# deploy.sh — Pull das imagens mais recentes e reinicia os containers
# Usado pelo GitHub Actions via SSH ou manualmente na VPS

set -euo pipefail

APP_DIR="/opt/condominio"

cd "$APP_DIR"

echo "==> Fazendo pull das imagens mais recentes..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull web backend

echo "==> Reiniciando serviços..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-build --remove-orphans

echo "==> Limpando imagens antigas..."
docker image prune -f

echo "==> Status dos containers:"
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo ""
echo "Deploy concluído!"
