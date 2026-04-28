# 🏢 Sistema de Portaria com Rastreamento GPS

> ⚠️ **PROJETO EDUCACIONAL — ESTÁGIO** — Sistema incompleto, desenvolvido para fins de aprendizagem. Não utilizar em produção.

[![NestJS](https://img.shields.io/badge/NestJS-11-red?style=flat-square&logo=nestjs)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)](https://docker.com)

---

## 📋 Visão Geral

Sistema robusto de **gestão de portaria condominial** com módulos de controle de visitantes, rastreamento GPS de veículos e trilha de auditoria completa. Construído sobre uma arquitetura moderna baseada em containers, projetado para deploy confiável em VPS.

---

## 🎬 Demonstração do Sistema

![Sistema de Portaria](docs/assets/condominio-gif.gif)

---

## 🧱 Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                        Nginx (Reverse Proxy)                  │
│                    porta 80/443 — SSL automático              │
└─────────────────────┬──────────────────────────────────────┘
                      │
         ┌───────────┴────────────┐
         │                        │
  ┌──────▼──────┐         ┌──────▼──────┐
  │  Next.js    │         │   NestJS    │
  │  Frontend   │         │   Backend   │
  │  porta 3000 │         │   porta 3001│
  └─────────────┘         └──────┬──────┘
                                │
                        ┌──────▼──────┐
                        │  PostgreSQL │
                        │   porta 5432│
                        └─────────────┘
```

---

## ⚙️ Stack Tecnológica

| Camada        | Tecnologia                                    |
|---------------|-----------------------------------------------|
| **Frontend**  | Next.js 16 · React 19 · TypeScript · Tailwind |
| **Backend**   | NestJS 11 · TypeScript · Prisma ORM            |
| **Banco**     | PostgreSQL 16                                 |
| **Infra**     | Docker Compose · Nginx · Certbot · GHCR       |
| **CI/CD**     | GitHub Actions · Deploy automatizado para VPS |

---

## 📁 Estrutura do Projeto

```
appcondominio-docker/
├── apps/
│   ├── backend/              # API REST — NestJS
│   │   ├── src/
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                 # Aplicação Web — Next.js
│       ├── src/
│       │   ├── app/          # Rotas (page.tsx, /login, /dashboard…)
│       │   ├── components/   # Componentes reutilizáveis
│       │   ├── hooks/        # Custom hooks (useAuth, useDashboard…)
│       │   ├── types/        # Definições TypeScript
│       │   └── data/         # Dados mock / fixtures
│       ├── Dockerfile
│       └── package.json
│
├── infra/
│   ├── nginx/                # Configuração do reverse proxy
│   │   ├── nginx.conf
│   │   └── conf.d/app.conf
│   └── postgres/             # Scripts de inicialização
│       ├── init.sql
│       └── postgres.conf
│
├── scripts/
│   ├── deploy.sh              # Script de deploy na VPS
│   ├── init-ssl.sh            # Setup SSL com Certbot
│   └── setup-vps.sh           # Provisionamento inicial
│
├── docs/                      # Documentação técnica e funcional
│   ├── Arquitetura-Tecnica-Recomendada.md
│   ├── Modelagem-Banco-de-Dados.md
│   ├── Api.md
│   └── releases/
│
├── docker-compose.yml         # Base dev
├── docker-compose.prod.yml    # Override produção
└── package.json               # Scripts de orquestração
```

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 20+
- **Docker** e **Docker Compose** v2
- **Git**

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/cristovao-pereira/appcondominio-docker.git
cd appcondominio-docker

# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# ↑ Edite o .env com suas senhas, chaves JWT e domínios
```

### Desenvolvimento — Apenas Frontend (rápido)

```bash
npm run dev
# → Acesse http://localhost:3000
```

### Desenvolvimento — Stack Completa com Docker _(recomendado)_

```bash
npm run dev:local
```

| Serviço    | URL                          |
|------------|------------------------------|
| Web        | http://localhost:3000        |
| Backend    | http://localhost:3001        |
| PostgreSQL | localhost:5432               |

Para remover os containers:

```bash
npm run dev:local:down
```

---

## 🐳 Deploy em Produção

O ambiente de produção utiliza um **compose override**:

```bash
docker compose -f docker-compose.prod.yml up -d
```

> As imagens Docker são pulladas do **GitHub Container Registry (GHCR)** usando as variáveis `GITHUB_REPOSITORY` e `IMAGE_TAG`.

---

## 🔄 Pipeline CI/CD

```
Push/Merge → GitHub Actions
    │
    ├── 1. Build & push imagens (web + backend) → GHCR
    ├── 2. Copia arquivos de infra para VPS (scp)
    └── 3. Executa deploy remoto (pull + restart controlado)
```

Consulte [`scripts/deploy.sh`](scripts/deploy.sh) para detalhes do processo.

---

## 📖 Documentação

| Documento                                                      | Descrição                                |
|---------------------------------------------------------------|------------------------------------------|
| [Arquitetura Técnica Recomendada](docs/Arquitetura-Tecnica-Recomendada.md) | Visão técnica da arquitetura |
| [Modelagem do Banco de Dados](docs/Modelagem-Banco-de-Dados.md)     | Diagrama ER e schema SQL             |
| [Api.md](docs/Api.md)                                         | Endpoints da API REST                   |
| [Telas Principais do Sistema](docs/Telas-Principais-do-Sistema.md)  | Wireframes e fluxo de telas         |
| [Checklist de Release](docs/Checklist-Release-Deploy.md)            | Passos para deploy de release      |
| [MCP Oracle OAuth Remoto](docs/MCP-Oracle-OAuth-Remoto.md)          | Configuração MCP para Codex/VS Code |

---

## 🔧 Troubleshooting Rápido

| Problema                              | Solução                                                |
|---------------------------------------|--------------------------------------------------------|
| `npm run dev:local` não encontrado     | Execute `npm install` na raiz para atualizar scripts  |
| Conflito de portas                    | Ajuste os mapeamentos de porta em `docker-compose.yml` |
| Erro de pull no GHCR                  | Valide login do Docker no registry e permissões do token |

---

## 📝 Repositório Remoto

```
https://github.com/cristovao-pereira/appcondominio-docker
```
