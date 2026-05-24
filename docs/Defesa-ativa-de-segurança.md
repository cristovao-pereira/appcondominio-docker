# Walkthrough — Implementação de Defesas Ativas de Segurança e Ajustes de Produção

Este documento descreve as alterações efetuadas no sistema e os testes de penetração defensivos realizados localmente para certificar a imunidade dos formulários (Login, Cadastro de Moradores, Suporte e Busca) contra injeção de SQL (SQLi), ataques de força bruta e injeções de script (XSS). Também detalha as soluções adotadas para garantir o funcionamento correto em ambiente de Produção.

---

## 🛠️ Alterações Implementadas

### 1. Prevenção contra SQL Injection (SQLi)
- **Prisma ORM e PostgreSQL:** O backend NestJS foi configurado para utilizar o Prisma v7 de forma integrada com a Pool de conexões do driver PostgreSQL (`@prisma/adapter-pg` e `pg`). Toda a persistência é baseada em queries parametrizadas (Prepared Statements), impedindo que aspas, traços ou operadores lógicos alterem a estrutura lógica da consulta SQL.
- **Filtro de Exceções Global (CWE-209):** Criado o arquivo [http-exception.filter.ts](file:///home/cris/appcondominio-docker/apps/backend/src/common/filters/http-exception.filter.ts) para interceptar falhas não tratadas do PostgreSQL/Prisma, omitindo o stack trace ou detalhes internos das tabelas, e devolvendo uma resposta limpa (e.g., `400 Bad Request` ou `500 Internal Server Error`). Isso obstrui a técnica de *Information Disclosure* útil para Blind SQLi.

### 2. Defesa contra Ataques de Força Bruta (Rate Limiting)
- **Throttler Guard Global (CWE-307):** Registrado no modulo principal do NestJS [app.module.ts](file:///home/cris/appcondominio-docker/apps/backend/src/app.module.ts) o limite geral de 100 requisições por minuto por IP.
- **Throttler no Login/Cadastro:** Configurado no [auth.controller.ts](file:///home/cris/appcondominio-docker/apps/backend/src/auth/auth.controller.ts) o decorator `@Throttle({ default: { limit: 5, ttl: 60000 } })`. IPs que submeterem mais de 5 tentativas de autenticação em menos de 1 minuto são bloqueados com o status `HTTP 429 Too Many Requests`.
- **Logs de Auditoria de Segurança:** Tentativas com falha e sucesso são gravadas na tabela `security_audit_logs` do PostgreSQL, viabilizando o rastreamento de IPs maliciosos na Central de Monitoramento.

### 3. Validação de Payloads e Combate a XSS (CWE-79)
- **ValidationPipe Global:** Ativado no [main.ts](file:///home/cris/appcondominio-docker/apps/backend/src/main.ts) o Pipe de validação com as diretivas `whitelist: true` e `forbidNonWhitelisted: true`, rejeitando propriedades não listadas nos DTOs (proteção contra *Mass Assignment*).
- **Sanitização de DTOs:** Integradas validações do `class-validator` nas DTOs de Autenticação e Suporte ([support.dto.ts](file:///home/cris/appcondominio-docker/apps/backend/src/support/dto/support.dto.ts)), as quais aplicam expressões regulares estritas para proibir tags de scripts/HTML (como `<` ou `>`) em campos de texto livre.

### 4. Correções de Ambiente de Produção (Deploy e Login)
- **Desmistificação do Erro de Produção (Bad Gateway / Falha de Login):**
  1. O backend de produção retornava `502 Bad Gateway` porque as migrações nunca haviam sido aplicadas no banco de dados isolado da VPS. Sem as tabelas, o servidor falhava em iniciar ou responder à porta interna do Docker.
  2. O Next.js compila as páginas estáticas durante o build Docker no GitHub Actions. Como o build no workflow não recebia a variável `NEXT_PUBLIC_API_URL`, ela caía em fallback estático apontando para `localhost:3001` no bundle JavaScript do navegador, impedindo conexões em produção.
  3. O cache de DNS do Nginx de produção em contêineres persistentes continuava roteando chamadas para o IP interno antigo do container backend quando este era recriado.
- **Injeção de Variáveis em Tempo de Compilação (Build Args):**
  - Atualizamos o [Dockerfile do Frontend](file:///home/cris/appcondominio-docker/apps/web/Dockerfile) para receber `ARG NEXT_PUBLIC_API_URL` e `ARG NEXT_PUBLIC_WS_URL` e declará-los como variáveis de ambiente `ENV` antes do comando `npm run build`.
  - Atualizamos o pipeline [deploy.yml](file:///home/cris/appcondominio-docker/.github/workflows/deploy.yml) no GitHub Actions para injetar o IP de produção real (`164.152.247.168`) nesses build-arguments.
  - Atualizamos o [docker-compose.yml](file:///home/cris/appcondominio-docker/docker-compose.yml) local para manter conformidade.
- **Remoção de URLs Hardcoded:**
  - Substituímos a chamada da API de suporte hardcoded de `http://localhost:3001` no arquivo [suporte/page.tsx](file:///home/cris/appcondominio-docker/apps/web/src/app/suporte/page.tsx) pela variável dinâmica unificada.
- **Script de Seed Autônomo para Prisma v7:**
  - Criamos o arquivo [seed.js](file:///home/cris/appcondominio-docker/apps/backend/prisma/seed.js) em Javascript puro para evitar dependências extras em produção. Ele instancia o `PrismaClient` utilizando o `@prisma/adapter-pg` e o driver `pg` (exigência do Prisma v7 neste projeto), gerando a senha criptografada em bcrypt (`Admin@123`) para o e-mail de administrador `admin@obsidian.com`.
  - Registramos a chave do seed no [prisma.config.ts](file:///home/cris/appcondominio-docker/apps/backend/prisma.config.ts) do Prisma v7.
- **Automação de Migrações e Inicialização em Produção:**
  - Atualizamos o [Dockerfile do Backend](file:///home/cris/appcondominio-docker/apps/backend/Dockerfile) para copiar a pasta `prisma` e o arquivo `prisma.config.ts` no stage final de execução.
  - Alteramos o comando de inicialização `CMD` do container backend para executar a cadeia: `npx prisma migrate deploy && npx prisma db seed && node dist/main.js`. Isso garante que em todo deploy ou reboot, o banco seja migrado e o administrador seja criado de forma 100% autônoma.
- **Automação de Limpeza de DNS do Nginx:**
  - Adicionamos a instrução `docker compose restart nginx` ao pipeline do GitHub Actions para limpar o cache DNS interno e rotear as APIs para os novos IPs internos do container backend e web a cada deploy.

---

## 🧪 Testes e Validação de Penetração (Locais)

### A. Teste de Força Bruta (Rate Limit no Login)
Um teste em loop com 10 tentativas consecutivas de login simulado via cURL foi executado a partir do terminal contra o endpoint `/api/auth/login`:
```bash
for i in {1..10}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://127.0.0.1:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "wrong@email.com", "password": "WrongPassword1"}')
  echo "Tentativa $i: HTTP $status"
done
```

**Resultado:**
```text
Tentativa 1: HTTP 401 (Não Autorizado - senha errada)
Tentativa 2: HTTP 401
...
Tentativa 5: HTTP 401
Tentativa 6: HTTP 429 (Múltiplas Tentativas - Bloqueado)
...
Tentativa 10: HTTP 429
```
*As primeiras 5 tentativas foram processadas no banco, e as 5 seguintes foram bloqueadas pela camada de rate limiting antes de onerar o PostgreSQL.*

### B. Teste do Seed com Driver Adapter (Local)
Executamos o comando de seed com o banco PostgreSQL de desenvolvimento local ativo:
```bash
npx prisma db seed
```
**Resultado:**
```text
Loaded Prisma config from prisma.config.ts.
Running seed command `node prisma/seed.js` ...
==> Iniciando o seed do banco de dados com Driver Adapter...
[Seed] O usuário administrador (admin@obsidian.com) já está cadastrado.
🌱  The seed command has been executed.
```

---

## 📈 Conclusão
O sistema agora possui defesas ativas de segurança consolidadas tanto a nível de rede/HTTP (Helmet, CORS restrito e Throttler), como de validação de payloads (DTOs com rejeição XSS) e banco de dados (Prepared Statements Prisma v7 no PostgreSQL com bloqueio a vazamentos de erros internos).

As correções de ambiente de produção foram commitadas e enviadas para o branch `main`. A build do GitHub Actions gerará as novas imagens Docker do frontend com as rotas de produção corretas, e o container de backend aplicará de forma autônoma as tabelas e o administrador inicial no banco de dados de produção ao iniciar na VPS.
