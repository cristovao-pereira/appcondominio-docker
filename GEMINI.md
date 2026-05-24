---
trigger: always_on
---

# GEMINI.md — AppCondomínio Docker

> Arquivo de configuração do Antigravity Kit para este projeto.
> Lido automaticamente em cada sessão de desenvolvimento.

---

## 🚀 BOOTSTRAP OBRIGATÓRIO (LEIA PRIMEIRO)

> 🔴 **MANDATORY:** Ao iniciar qualquer sessão neste projeto, você DEVE:
> 1. Ler `.agent/ARCHITECTURE.md` para entender os agentes, skills e scripts disponíveis
> 2. Ler `.agent/rules/GEMINI.md` para carregar todas as regras do sistema
> 3. Carregar `CODEBASE.md` para entender as dependências de arquivos deste projeto

```
SESSION START PROTOCOL:
  1. read(.agent/ARCHITECTURE.md)
  2. read(.agent/rules/GEMINI.md)   ← Regras completas aqui
  3. read(CODEBASE.md)              ← Mapa de dependências
```

---

## 📌 PROJETO: AppCondomínio

| Campo         | Valor                                  |
|---------------|----------------------------------------|
| **Nome**      | AppCondomínio — Concierge OS           |
| **Stack**     | Next.js 15 (frontend) + NestJS (backend) + PostgreSQL |
| **Monorepo**  | `apps/web` (Next.js) + `apps/backend` (NestJS) |
| **Infra**     | Docker Compose (dev) + Docker Compose Prod |
| **ORM**       | Prisma v7 com `PrismaPg` adapter + `pg` pool |
| **Auth**      | bcrypt + JWT (NestJS AuthModule)       |
| **Segurança** | Helmet, CORS, ThrottlerGuard, ValidationPipe |

---

## 🗂️ ESTRUTURA RÁPIDA

```
appcondominio-docker/
├── apps/
│   ├── web/                    # Next.js 15 App Router
│   │   └── src/app/
│   │       ├── login/          # Autenticação real (bcrypt)
│   │       ├── dashboard/      # Painel principal
│   │       ├── moradores/      # CRUD de moradores (POST /api/auth/register)
│   │       ├── portaria/       # Controle de acesso
│   │       ├── visitantes/     # Gestão de visitas
│   │       ├── autorizacao/    # Autorizações de entrada
│   │       ├── suporte/        # Tickets de suporte
│   │       ├── perfil/         # Perfil do operador (indicador de força de senha)
│   │       └── ...
│   └── backend/                # NestJS API
│       └── src/
│           ├── auth/           # AuthModule (login + register com bcrypt)
│           ├── support/        # SupportModule (busca segura parametrizada)
│           ├── prisma/         # PrismaService (PrismaPg adapter)
│           └── common/
│               └── filters/    # HttpExceptionFilter
├── .agent/                     # Antigravity Kit
│   ├── agents/                 # 20 agentes especialistas
│   ├── skills/                 # 37 skills modulares
│   ├── scripts/                # checklist.py, verify_all.py
│   └── rules/GEMINI.md         # Regras completas do sistema
├── GEMINI.md                   # ← Este arquivo (bootstrap)
└── CODEBASE.md                 # Mapa de dependências de arquivos
```

---

## 🤖 AGENTES ATIVOS NESTE PROJETO

| Agente                 | Quando usar                                     |
|------------------------|-------------------------------------------------|
| `frontend-specialist`  | Componentes Next.js, UI/UX, Tailwind            |
| `backend-specialist`   | NestJS, APIs REST, guards, middlewares          |
| `database-architect`   | Prisma schema, migrations, queries              |
| `security-auditor`     | Auth, bcrypt, rate limiting, OWASP              |
| `debugger`             | Erros 401, 500, crashes, comportamento errado   |
| `devops-engineer`      | Docker Compose, variáveis de ambiente, deploy   |
| `orchestrator`         | Tarefas multi-domínio (ex: nova feature completa) |

---

## ⚡ COMANDOS DISPONÍVEIS

| Slash Command    | O que faz                                 |
|------------------|-------------------------------------------|
| `/brainstorm`    | Descoberta socrática antes de implementar |
| `/create`        | Criar nova feature completa               |
| `/debug`         | Modo debug sistemático (4 fases)          |
| `/deploy`        | Checklist de deploy                       |
| `/enhance`       | Melhorar funcionalidade existente         |
| `/plan`          | Criar plano de tarefa detalhado           |
| `/preview`       | Gerenciar servidor de preview local       |
| `/status`        | Status do projeto e tarefas               |
| `/test`          | Gerar e rodar testes                      |
| `/ui-ux-pro-max` | Design UI premium (50 estilos, 21 paletas)|

---

## 🔒 CONTEXTO DE SEGURANÇA ATUAL

O projeto passou por auditoria de segurança. Implementações ativas:

- ✅ **Rate Limiting** — `@nestjs/throttler` (10 req/60s)  
- ✅ **Helmet** — headers HTTP de segurança  
- ✅ **CORS** — configurado para `localhost:3000`  
- ✅ **ValidationPipe** — sanitização de inputs  
- ✅ **bcrypt** — hashing de senhas (rounds: 10)  
- ✅ **Prisma parametrizado** — sem SQL injection  
- ✅ **HttpExceptionFilter** — sem information disclosure  
- ✅ **Indicador de força de senha** — em `/perfil`

**Credenciais de desenvolvimento:**
- Email: `admin@obsidian.com`
- Senha: `Admin@123`

---

## 📋 CHECKLIST FINAL

Para validar o projeto antes de deploy:

```bash
# Validação rápida de desenvolvimento
python .agent/scripts/checklist.py .

# Validação completa com performance (requer app rodando)
python .agent/scripts/checklist.py . --url http://localhost:3000
```

---

> Todas as regras detalhadas de comportamento do agente estão em `.agent/rules/GEMINI.md`
