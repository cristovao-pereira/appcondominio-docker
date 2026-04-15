# App Web (Next.js)

Aplicacao web do Sistema de Portaria com Rastreamento GPS.

Para contexto funcional e arquitetura geral, consulte o README raiz em [../../README.md](../../README.md) e os documentos de especificacao em [../../docs](../../docs).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Executar Localmente

1. Instalar dependencias:

```bash
npm install
```

2. Subir ambiente de desenvolvimento:

```bash
npm run dev
```

3. Acessar no navegador:

`http://localhost:3000`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Estrutura Interna

```text
apps/web/
  src/
    app/              # Rotas e paginas
    components/       # Layout e componentes reutilizaveis
    data/             # Dados mockados
    hooks/            # Hooks de estado e comportamento
    types/            # Tipagens de dominio
```
