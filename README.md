# Sistema de Portaria com Rastreamento GPS

Projeto para gestao de portaria em condominios com controle de visitantes e monitoramento por GPS.

## Visao Geral

A solucao contempla:

- Controle de acesso por perfil (administrador, sindico, portaria e morador)
- Gestao de condominios, blocos, unidades, moradores e visitantes
- Fluxo completo de autorizacao de visita, check-in e check-out
- Rastreamento em tempo real de visitantes com dispositivo GPS
- Central de alertas de seguranca e auditoria de eventos

## Arquitetura Recomendada

- Frontend: Next.js + React + TypeScript
- Backend: NestJS + Node.js + TypeScript
- Banco de dados: PostgreSQL
- Tempo real: WebSocket/Socket.IO
- Mapas: OpenStreetMap/Leaflet, Mapbox ou Google Maps
- Autenticacao: JWT + refresh token

## Estrutura do Repositorio

```text
appcondominio/
  apps/
    web/              # Aplicacao web (Next.js)
  docs/                # Especificacoes funcionais e tecnicas
  skills/              # Recursos auxiliares
  telas_arquivos/      # Referencias visuais e prototipos
```

## Documentacao de Especificacao

Os requisitos e direcionamentos estao em:

- [docs/Arquitetura-Tecnica-Recomendada.md](docs/Arquitetura-Tecnica-Recomendada.md)
- [docs/Telas-Principais-do-Sistema.md](docs/Telas-Principais-do-Sistema.md)
- [docs/Modelagem-Banco-de-Dados.md](docs/Modelagem-Banco-de-Dados.md)
- [docs/Api.md](docs/Api.md)
- [docs/Plano-de-Implementacao.md](docs/Plano-de-Implementacao.md)

## Aplicacao Web

A aplicacao web esta na pasta [apps/web](apps/web) e possui documentacao propria em [apps/web/README.md](apps/web/README.md).

Para executar:

1. Acesse a pasta da aplicacao web:

```bash
cd apps/web
```

2. Instale as dependencias:

```bash
npm install
```

3. Rode em desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador: `http://localhost:3000`

## Status

- Aplicacao web com estrutura de telas e navegacao pronta para evolucao
- Integracao com backend, tempo real e provedor de mapas planejada para as proximas fases
