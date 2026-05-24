# CODEBASE.md — AppCondomínio

> Mapa de dependências de arquivos do projeto.
> Lido pelo agente antes de modificar qualquer arquivo para garantir que todos os afetados sejam atualizados juntos.

---

## 🗺️ Mapa de Dependências

### Frontend (apps/web)

#### Autenticação
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/web/src/app/login/page.tsx` | `hooks/useAuth.ts` | Nenhum |
| `apps/web/src/hooks/useAuth.ts` | `app/login/page.tsx` | Todas as páginas protegidas |

#### Páginas
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/web/src/app/moradores/page.tsx` | `data/mockData.ts`, `types/index.ts`, `/api/auth/register`, `/api/support/search` | Nenhum |
| `apps/web/src/app/perfil/page.tsx` | `data/mockData.ts` | Nenhum |
| `apps/web/src/app/portaria/page.tsx` | `data/mockData.ts`, `types/index.ts` | Nenhum |
| `apps/web/src/app/suporte/page.tsx` | `/api/support/*` | Nenhum |
| `apps/web/src/app/dashboard/page.tsx` | `data/mockData.ts` | Nenhum |

#### Dados e Tipos
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/web/src/data/mockData.ts` | Nenhum | Todas as páginas que o importam |
| `apps/web/src/types/index.ts` | Nenhum | `moradores/page.tsx`, `portaria/page.tsx`, `visitantes/page.tsx` |

#### Layout e Global
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/web/src/app/layout.tsx` | `globals.css` | Todas as páginas |
| `apps/web/src/app/globals.css` | Nenhum | Toda a aplicação |

---

### Backend (apps/backend)

#### Módulos
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/backend/src/app.module.ts` | `AuthModule`, `SupportModule`, `PrismaModule`, `ThrottlerModule` | Toda a aplicação |
| `apps/backend/src/main.ts` | `app.module.ts`, `HttpExceptionFilter` | Toda a API |

#### Auth
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/backend/src/auth/auth.module.ts` | `AuthService`, `AuthController`, `PrismaModule` | `app.module.ts` |
| `apps/backend/src/auth/auth.service.ts` | `PrismaService`, `bcrypt`, `dto/login.dto.ts`, `dto/register.dto.ts` | `auth.controller.ts` |
| `apps/backend/src/auth/auth.controller.ts` | `AuthService` | Rotas `/api/auth/*` |
| `apps/backend/src/auth/dto/login.dto.ts` | `class-validator` | `auth.service.ts` |
| `apps/backend/src/auth/dto/register.dto.ts` | `class-validator` | `auth.service.ts` |

#### Support
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/backend/src/support/support.module.ts` | `SupportService`, `SupportController`, `PrismaModule` | `app.module.ts` |
| `apps/backend/src/support/support.service.ts` | `PrismaService` | `support.controller.ts` |
| `apps/backend/src/support/support.controller.ts` | `SupportService` | Rotas `/api/support/*` |

#### Infraestrutura
| Arquivo | Depende de | Afetados se modificado |
|---------|-----------|----------------------|
| `apps/backend/src/prisma/prisma.service.ts` | `@prisma/client`, `PrismaPg`, `pg` | Todos os services que usam Prisma |
| `apps/backend/src/prisma/prisma.module.ts` | `PrismaService` | `auth.module.ts`, `support.module.ts` |
| `apps/backend/src/common/filters/http-exception.filter.ts` | `@nestjs/common` | `main.ts` |

---

## 🗄️ Schema Prisma (PostgreSQL)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String   // bcrypt hash
  role      String   @default("resident") // "admin" | "resident" | "operator"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SupportTicket {
  id          String   @id @default(uuid())
  title       String
  description String
  status      String   @default("open")
  priority    String   @default("medium")
  userId      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

> ⚠️ Ao modificar o schema, **sempre** rodar `prisma migrate dev` e atualizar os services afetados.

---

## 🌐 Endpoints de API

| Método | Rota | Serviço | Validação |
|--------|------|---------|-----------|
| `POST` | `/api/auth/register` | `AuthService.register` | `RegisterDto` (class-validator) |
| `POST` | `/api/auth/login` | `AuthService.login` | `LoginDto` (class-validator) |
| `GET`  | `/api/support/search?q=` | `SupportService.search` | Parametrizado (Prisma) |
| `POST` | `/api/support/tickets` | `SupportService.createTicket` | Body validation |

---

## 🔗 Convenções de Código

### Frontend (Next.js + Tailwind)
- **Componentes**: `"use client"` apenas quando necessário
- **Estilo**: Tailwind utility classes + CSS variables (`--font-manrope`)
- **Estado**: `useState` + `useEffect` (sem biblioteca externa de estado)
- **Fetch**: `fetch()` nativo com `encodeURIComponent()` para query params

### Backend (NestJS)
- **Padrão**: Module → Controller → Service → Prisma
- **DTOs**: `class-validator` decorators para validação
- **Erros**: `HttpException` com mensagens genéricas (sem information disclosure)
- **Banco**: Sempre usar Prisma parametrizado — **nunca** string interpolation em queries

### Segurança Obrigatória
- Senhas: mínimo 8 chars, 1 maiúscula, 1 minúscula, 1 número, 1 especial (`@$!%*?&`)
- Rate limiting: 10 req / 60s por IP
- CORS: apenas `localhost:3000` em dev
- Secrets: nunca hardcoded — usar `.env`

---

## 📦 Dependências Principais

### Frontend
```json
{
  "next": "^15",
  "react": "^19",
  "tailwindcss": "^4",
  "lucide-react": "latest"
}
```

### Backend
```json
{
  "@nestjs/core": "^11",
  "@nestjs/throttler": "^6",
  "@prisma/client": "^7",
  "bcrypt": "^5",
  "helmet": "^8",
  "class-validator": "^0.14",
  "pg": "^8"
}
```

---

## 🐳 Docker Compose

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| `web` | `3000` | Next.js frontend |
| `backend` | `3001` | NestJS API |
| `postgres` | `5432` | PostgreSQL 16 |

```bash
# Iniciar ambiente local
npm run dev:local

# Ver logs
npm run dev:local:logs

# Parar
npm run dev:local:down
```

---

> Última atualização: 2026-05-24
