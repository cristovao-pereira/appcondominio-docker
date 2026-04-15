# Frontend - Sistema de Portaria com Rastreamento GPS

Este frontend implementa o painel web do sistema de controle de portaria para condominios, com foco em cadastro, operacao de visitas e monitoramento de visitantes via dispositivo GPS.

## Objetivo do Projeto

Entregar uma interface administrativa e operacional para:

- Autenticacao por perfis (administrador, sindico, portaria e morador)
- Gestao de condominios, blocos, unidades e moradores
- Fluxo de visitantes (autorizacao, check-in, check-out)
- Acompanhamento de rastreamento em tempo real
- Central de alertas e trilha de auditoria

## Stack Tecnica

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Componentes utilitarios com padrao `ui/*`

## Status Atual

Este repositorio contem o frontend com telas e estrutura de navegacao da plataforma, usando dados simulados para evolucao de UX e fluxo funcional.

## Principais Rotas de Tela

- `/login`
- `/dashboard`
- `/condominios`
- `/blocos`
- `/moradores`
- `/visitantes`
- `/autorizacao`
- `/portaria`
- `/rastreamento`
- `/alertas`
- `/dispositivos`
- `/auditoria`
- `/perfil`
- `/configuracoes`

## Estrutura de Pastas (Resumo)

```text
frontend/
	src/
		app/              # Rotas e paginas
		components/       # Layout, navegacao e componentes reutilizaveis
		data/             # Dados mockados
		hooks/            # Regras de estado e integracao de tela
		types/            # Tipagens de dominio
```

## Como Executar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

`http://localhost:3000`

## Scripts Disponiveis

- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de producao
- `npm run start` - executar build em producao
- `npm run lint` - analise estatica com ESLint

## Base de Especificacao (Documentos)

As decisoes de produto e arquitetura deste frontend seguem os documentos em `../docs`:

- `Arquitetura-Tecnica-Recomendada.md`
- `Telas-Principais-do-Sistema.md`
- `Modelagem-Banco-de-Dados.md`
- `Api.md`
- `Plano-de-Implementacao.md`

## Integracoes Planejadas

Evolucao prevista para proximas fases:

- Integracao com API backend (NestJS)
- Autenticacao JWT com refresh token
- Tempo real para rastreamento e alertas
- Integracao com provedor de mapas (OpenStreetMap/Leaflet, Mapbox ou Google Maps)
- Registro de auditoria e observabilidade
