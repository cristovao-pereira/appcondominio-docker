# Sistema de Portaria com Rastreamento GPS

Monorepo para gestao de portaria em condominios com controle de visitantes, trilha de auditoria e rastreamento por GPS.

Repositorio remoto atual: https://github.com/cristovao-pereira/appcondominio-docker

## Stack

- Frontend: Next.js 16 + React 19 + TypeScript
- Backend: NestJS 11 + TypeScript
- Banco de dados: PostgreSQL 16
- Infra: Docker Compose (dev e prod), Nginx, Certbot, GHCR
- CI/CD: GitHub Actions com deploy para VPS

## Estrutura

```text
appcondominio/
  apps/
    backend/           # API NestJS
    web/               # Aplicacao Next.js
  infra/
    nginx/             # Reverse proxy
    postgres/          # Init e config do Postgres
  scripts/             # Scripts de deploy e setup
  docs/                # Especificacoes funcionais e tecnicas
```

## Pre-requisitos

- Node.js 20+
- Docker e Docker Compose v2
- Git

## Configuracao de ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Ajuste os valores de seguranca em `.env` (senhas, JWT, dominio, email).

## Desenvolvimento local

### Opcao 1 - Somente frontend (rapido)

```bash
npm install
npm run dev
```

Aplicacao em `http://localhost:3000`.

### Opcao 2 - Stack completa com Docker (recomendado)

```bash
npm run dev:local
```

Servicos:

- Web: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Postgres: `localhost:5432`

Para parar:

```bash
npm run dev:local:down
```

## Producao (compose override)

O ambiente de producao combina:

- `docker-compose.yml` (base)
- `docker-compose.prod.yml` (override prod)

As imagens da aplicacao sao lidas do GHCR usando:

- `GITHUB_REPOSITORY` (ex.: `cristovao-pereira/appcondominio-docker`)
- `IMAGE_TAG` (ex.: `latest` ou SHA do commit)

Exemplo de subida:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## CI/CD e deploy

Pipeline em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

- Build e push de `web` e `backend` para GHCR
- Copia arquivos de infra para VPS
- Executa deploy remoto com pull de imagens e restart controlado

Script de apoio na VPS: [`scripts/deploy.sh`](scripts/deploy.sh).

## Documentacao

- [apps/backend/README.md](apps/backend/README.md)
- [apps/web/README.md](apps/web/README.md)
- [docs/Checklist-Release-Deploy.md](docs/Checklist-Release-Deploy.md)
- [docs/Template-Release-Notes.md](docs/Template-Release-Notes.md)
- [docs/releases/README.md](docs/releases/README.md)
- [docs/releases/2026-04-16-release-r0.md](docs/releases/2026-04-16-release-r0.md)
- [docs/Arquitetura-Tecnica-Recomendada.md](docs/Arquitetura-Tecnica-Recomendada.md)
- [docs/Telas-Principais-do-Sistema.md](docs/Telas-Principais-do-Sistema.md)
- [docs/Modelagem-Banco-de-Dados.md](docs/Modelagem-Banco-de-Dados.md)
- [docs/Api.md](docs/Api.md)
- [docs/Plano-de-Implementacao.md](docs/Plano-de-Implementacao.md)

## Troubleshooting rapido

- `npm run dev:local` nao encontrado:
  execute `npm install` na raiz para atualizar os scripts.
- Conflito de portas locais:
  ajuste portas em `docker-compose.yml`.
- Erro de pull no GHCR em producao:
  valide login do Docker no registro e permissoes do token.
