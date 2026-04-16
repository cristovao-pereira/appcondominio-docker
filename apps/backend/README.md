# Backend API (NestJS)

API do Sistema de Portaria com Rastreamento GPS.

Para contexto geral de arquitetura, operacao Docker e deploy, consulte [README.md](../../README.md).

## Stack

- NestJS 11
- Node.js 20
- TypeScript
- PostgreSQL (via Docker Compose no ambiente local/producao)

## Pre-requisitos

- Node.js 20+
- npm 10+

## Configuracao

O backend usa variaveis do arquivo .env na raiz do monorepo.

Variaveis principais:

- PORT (padrao 3001)
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET

## Execucao

### Modo 1 - Desenvolvimento isolado (somente backend)

Na pasta apps/backend:

```bash
npm install
npm run start:dev
```

Servidor em http://localhost:3001.

### Modo 2 - Stack completa com Docker (recomendado no projeto)

Na raiz do repositorio:

```bash
npm run dev:local
```

Esse modo sobe web, backend e postgres com rede integrada.

## Scripts locais (apps/backend)

- npm run start:dev inicia backend em desenvolvimento
- npm run build gera build de producao
- npm run start executa versao compilada (dist/main.js)

## Endpoints atuais

- GET /api/health

Resposta esperada:

- status: ok
- service: backend
- timestamp: ISO string

## Integracao e rede

- Prefixo global da API: /api
- Porta padrao no container: 3001
- No Compose local, o backend depende do postgres com healthcheck

## Troubleshooting rapido

- Porta 3001 ocupada: altere PORT no .env ou finalize processo em conflito.
- Falha de conexao com banco: valide DATABASE_URL e status do container postgres.
- Erro de build TypeScript: execute npm install e rode npm run build para validar antes do deploy.
