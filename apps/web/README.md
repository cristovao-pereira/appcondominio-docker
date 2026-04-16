# App Web (Next.js)

Aplicacao frontend do Sistema de Portaria com Rastreamento GPS.

Para arquitetura global e operacao da plataforma, consulte [README.md](../../README.md).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Pre-requisitos

- Node.js 20+
- npm 10+

## Configuracao

Este app utiliza variaveis definidas no arquivo `.env` da raiz do monorepo.

Variaveis principais para o frontend:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

## Execucao

### Modo 1 - Desenvolvimento isolado (somente web)

Na pasta `apps/web`:

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### Modo 2 - Stack completa com Docker (recomendado no projeto)

Na raiz do repositorio:

```bash
npm run dev:local
```

Esse modo sobe `web`, `backend` e `postgres` via Docker Compose.

## Scripts locais (apps/web)

- `npm run dev` inicia servidor de desenvolvimento
- `npm run build` gera build de producao
- `npm run start` sobe app em modo producao
- `npm run lint` executa lint

## Integracao com backend

- Em desenvolvimento com Docker, o backend responde na porta `3001`.
- Garanta que `NEXT_PUBLIC_API_URL` aponte para o endpoint correto da API.

## Estrutura interna

```text
apps/web/
  src/
    app/              # Rotas e paginas
    components/       # Layout e componentes reutilizaveis
    data/             # Dados mockados
    hooks/            # Hooks de estado e comportamento
    lib/              # Utilitarios
    types/            # Tipagens de dominio
```

## Troubleshooting rapido

- Erro de conexao com API: revise `NEXT_PUBLIC_API_URL` no `.env`.
- Porta 3000 ocupada: altere porta no comando de execucao ou encerre processo em conflito.
- Erro de dependencia: remova `node_modules` e reinstale com `npm install`.
