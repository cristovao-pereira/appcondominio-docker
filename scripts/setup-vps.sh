#!/bin/bash
# setup-vps.sh — Prepara Ubuntu 22.04/24.04 para rodar o sistema de portaria
# Executar como root ou usuário com sudo: bash scripts/setup-vps.sh

set -euo pipefail

echo "==> Atualizando pacotes..."
apt-get update -qq && apt-get upgrade -y -qq

echo "==> Instalando dependências base..."
apt-get install -y -qq \
  ca-certificates curl gnupg lsb-release \
  git ufw fail2ban unzip

echo "==> Instalando Docker Engine..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Habilitando Docker no boot..."
systemctl enable docker
systemctl start docker

echo "==> Configurando firewall (ufw)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

echo "==> Criando diretório da aplicação..."
mkdir -p /opt/condominio
chown -R "${SUDO_USER:-$USER}:${SUDO_USER:-$USER}" /opt/condominio

echo ""
echo "===================================================="
echo " Setup completo!"
echo " Próximos passos:"
echo "  1. Copie o arquivo .env para /opt/condominio/.env"
echo "  2. Execute: bash scripts/init-ssl.sh <dominio> <email>"
echo "  3. Execute: bash scripts/deploy.sh"
echo "===================================================="
