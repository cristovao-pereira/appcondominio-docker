# Walkthrough — Implementação de Defesas Ativas de Segurança

Este documento descreve as alterações efetuadas no sistema e os testes de penetração defensivos realizados localmente para certificar a imunidade dos formulários (Login, Cadastro de Moradores, Suporte e Busca) contra injeção de SQL (SQLi), ataques de força bruta e injeções de script (XSS).

---

## 🛠️ Alterações Implementadas

### 1. Prevenção contra SQL Injection (SQLi)
- **Prisma ORM e PostgreSQL:** O backend NestJS foi configurado para utilizar o Prisma v7 de forma integrada com a Pool de conexões do driver PostgreSQL (`@prisma/adapter-pg` e `pg`). Toda a persistência é baseada em queries parametrizadas (Prepared Statements), impedindo que aspas, traços ou operadores lógicos alterem a estrutura lógica da consulta SQL.
- **Filtro de Exceções Global (CWE-209):** Criado o arquivo http-exception.filter.ts para interceptar falhas não tratadas do PostgreSQL/Prisma, omitindo o stack trace ou detalhes internos das tabelas, e devolvendo uma resposta limpa (e.g., `400 Bad Request` ou `500 Internal Server Error`). Isso obstrui a técnica de *Information Disclosure* útil para Blind SQLi.

### 2. Defesa contra Ataques de Força Bruta (Rate Limiting)
- **Throttler Guard Global (CWE-307):** Registrado no modulo principal do NestJS app.module.ts o limite geral de 100 requisições por minuto por IP.
- **Throttler no Login/Cadastro:** Configurado no auth.controller.ts o decorator `@Throttle({ default: { limit: 5, ttl: 60000 } })`. IPs que submeterem mais de 5 tentativas de autenticação em menos de 1 minuto são bloqueados com o status `HTTP 429 Too Many Requests`.
- **Logs de Auditoria de Segurança:** Tentativas com falha e sucesso são gravadas na tabela `security_audit_logs` do PostgreSQL, viabilizando o rastreamento de IPs maliciosos na Central de Monitoramento.

### 3. Validação de Payloads e Combate a XSS (CWE-79)
- **ValidationPipe Global:** Ativado no main.ts o Pipe de validação com as diretivas `whitelist: true` e `forbidNonWhitelisted: true`, rejeitando propriedades não listadas nos DTOs (proteção contra *Mass Assignment*).
- **Sanitização de DTOs:** Integradas validações do `class-validator` nas DTOs de Autenticação e Suporte, as quais aplicam expressões regulares estritas para proibir tags de scripts/HTML (como `<` ou `>`) em campos de texto livre.

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
Tentativa 3: HTTP 401
Tentativa 4: HTTP 401
Tentativa 5: HTTP 401
Tentativa 6: HTTP 429 (Múltiplas Tentativas - Bloqueado)
Tentativa 7: HTTP 429
Tentativa 8: HTTP 429
Tentativa 9: HTTP 429
Tentativa 10: HTTP 429
```
*As primeiras 5 tentativas chegaram a processar no banco, e as 5 seguintes foram abortadas instantaneamente pela camada HTTP antes de impactar o PostgreSQL.*

### B. Teste de Logs de Auditoria de Segurança
Executada a rota de auditoria de logs `/api/auth/audit-logs`:
```bash
curl -s http://localhost:3001/api/auth/audit-logs
```

**Resultado (JSON retornado pelo Postgres):**
```json
[
  {
    "id": "4b033f2a-2a3d-4ce2-843e-fbab3f9e037a",
    "ip": "172.21.0.1",
    "event": "login_failed",
    "username": "wrong@email.com",
    "details": "Usuário inexistente ou senha incorreta.",
    "createdAt": "2026-05-24T20:38:55.517Z"
  },
  ...
]
```

### C. Teste de Injeção de SQL (SQLi no campo de busca)
Uma query com payload de SQL Injection (`' OR '1'='1`) foi submetida no campo de busca de moradores (/moradores) que faz fetch direto no backend `/api/support/search?q=...`:
```bash
curl -s "http://localhost:3001/api/support/search?q=test'+OR+'1'='1"
```

**Resultado:**
```json
[]
```
*O sistema retornou um array vazio com sucesso, em vez de retornar todos os moradores do condomínio ou dar erros de sintaxe do PostgreSQL, provando que o payload foi tratado como literal e filtrado com Prepared Statements.*

### D. Teste de Validação contra XSS (Tags Script)
Envio de payload com tag de script maliciosa no formulário de suporte:
```bash
curl -s -X POST http://127.0.0.1:3001/api/support \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacker XSS", "email": "hacker@xss.com", "subject": "Test XSS", "message": "<script>alert(1)</script>"}'
```

**Resultado:**
```json
{
  "statusCode": 400,
  "timestamp": "2026-05-24T20:39:07.230Z",
  "path": "/api/support",
  "message": "A mensagem não deve conter tags HTML. Por favor, envie apenas texto plano.",
  "error": "Bad Request"
}
```
*A requisição foi rejeitada imediatamente pela validação estrita com retorno `HTTP 400`, eliminando qualquer risco de persistência de tags HTML invasivas no banco.*

---

## 📈 Conclusão
O sistema agora possui defesas ativas de segurança consolidadas tanto a nível de rede/HTTP (Helmet, CORS restrito e Throttler), como de validação de payloads (DTOs com rejeição XSS e Mass Assignment) e banco de dados (Prepared Statements Prisma v7 no PostgreSQL com bloqueio a vazamentos de erros internos).
