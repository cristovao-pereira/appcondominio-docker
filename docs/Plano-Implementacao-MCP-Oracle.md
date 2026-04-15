# Plano de Implementacao - MCP Oracle

## 1. Objetivo
Implementar um MCP Oracle para conectar o ecossistema do sistema de condominio a servicos Oracle (OCI e/ou Oracle Database), com foco em:
- seguranca por perfil e menor privilegio
- operacao em stdio e HTTP streamable
- observabilidade e governanca de ferramentas
- rollout gradual por dominio de negocio

Base tecnica analisada: repositorio Oracle MCP (oracle/mcp, pasta src).

## 2. Padrao tecnico observado no projeto Oracle
Padroes recorrentes nos servidores Oracle MCP:
- servidor em FastMCP (Python) ou MCP Java Toolkit
- ferramentas declaradas com @mcp.tool e schemas tipados (Pydantic/JSON Schema)
- transporte duplo: stdio (padrao) e HTTP quando ORACLE_MCP_HOST + ORACLE_MCP_PORT estao definidos
- autenticacao via perfil OCI (OCI_CONFIG_PROFILE) com suporte frequente a security token signer
- deploy container com Containerfile e uv
- guias de cliente para Cline/Cursor/MCPHost com configuracao de mcpServers
- testes unitarios + e2e com mocks de OCI

## 3. Decisoes de arquitetura para este projeto
### 3.1 Escopo inicial (MVP)
Adotar o servidor generico OCI para acelerar entrega:
- opcao 1 (mais rapida): usar oracle.oci-cloud-mcp-server para chamadas OCI SDK genericas
- opcao 2 (mais controlada): combinar servidores especificos (identity, monitoring, resource-search, object-storage)

Recomendacao: iniciar na opcao 2 para menor superficie de risco e melhor governanca.

### 3.2 Topologia
- MCP Oracle executando como servico isolado (container proprio)
- app backend (NestJS futuro) consumindo MCP via cliente MCP/bridge
- frontend nao chama OCI direto; trafego passa pelo backend
- segredos em variaveis de ambiente + secret manager

### 3.3 Transporte
- dev local: stdio
- homolog/prod: HTTP streamable em /mcp com TLS e token de acesso

## 4. Plano por fases
### Fase 0 - Descoberta e desenho (1 semana)
- mapear casos de uso Oracle no dominio do condominio
- escolher 6 a 10 ferramentas MCP iniciais (somente leitura no inicio)
- definir IAM policies minimas por compartimento

Entregaveis:
- matriz de casos de uso x ferramenta x permissao
- decisao de servidores Oracle MCP adotados no MVP

### Fase 1 - Bootstrap tecnico (1 semana)
- criar repositorio/monorepo do MCP Oracle local
- padronizar pyproject + uv + lint + testes
- adicionar entrypoint unico em server.py
- habilitar stdio e HTTP por variavel de ambiente

Entregaveis:
- servidor sobe em stdio e HTTP
- health-check funcional (tool ping)

### Fase 2 - Autenticacao e seguranca (1 semana)
- configurar OCI_CONFIG_PROFILE e OCI_CONFIG_FILE
- suportar security token signer e fallback para API key signer
- bloquear logs de segredo e payload sensivel
- implementar validacao de parametros e mensagens de erro seguras

Entregaveis:
- checklist de seguranca aprovado
- runbook de credenciais e rotacao

### Fase 3 - Ferramentas MVP (2 semanas)
Implementar e expor ferramentas:
- identidade: tenancy atual, compartments, regioes
- inventario: busca de recursos
- observabilidade: metricas/alarmes (read-only)
- storage: namespaces e buckets (read-only)

Padroes obrigatorios por ferramenta:
- schema de entrada claro
- timeout/retry/backoff
- retorno estruturado + texto curto

Entregaveis:
- pacote de tools MVP com testes unitarios
- catalogo de tools com descricao de uso

### Fase 4 - Integracao com app condominio (1 semana)
- criar camada de orquestracao no backend para chamadas MCP
- mapear RBAC interno (admin/sindico/portaria) para conjunto de tools permitidas
- adicionar auditoria por chamada (quem, quando, qual tool, resultado)

Entregaveis:
- endpoints backend integrados
- trilha de auditoria ponta a ponta

### Fase 5 - Confiabilidade e operacao (1 semana)
- limites de taxa e concorrencia por tool
- circuit breaker e fallback para indisponibilidade OCI
- metricas de latencia/sucesso/erro por ferramenta
- dashboards e alertas operacionais

Entregaveis:
- SLO inicial definido
- painel de monitoramento e alarmes

### Fase 6 - QA, hardening e go-live (1 semana)
- testes e2e com mocks e com tenancy real controlada
- pentest basico de superficie MCP
- revisao final de IAM e segregacao de ambiente
- rollout canario e plano de rollback

Entregaveis:
- relatorio de teste e risco residual
- release notes + plano de rollback aprovado

## 5. Estrutura recomendada de pastas
- mcp-oracle/server.py
- mcp-oracle/models.py
- mcp-oracle/clients/oci_clients.py
- mcp-oracle/tools/identity_tools.py
- mcp-oracle/tools/monitoring_tools.py
- mcp-oracle/tools/resource_tools.py
- mcp-oracle/tools/storage_tools.py
- mcp-oracle/tests/unit/
- mcp-oracle/tests/e2e/
- mcp-oracle/Containerfile
- mcp-oracle/README.md

## 6. Variaveis de ambiente recomendadas
- OCI_CONFIG_PROFILE
- OCI_CONFIG_FILE
- TENANCY_ID_OVERRIDE
- ORACLE_MCP_HOST
- ORACLE_MCP_PORT
- FASTMCP_LOG_LEVEL
- ORACLE_MCP_LOG_DIR
- ORACLE_MCP_AUTH_TOKEN (se usar autenticacao por bearer)

## 7. Criterios de aceite
- servidor responde em stdio e HTTP streamable
- 100% das tools MVP com validacao de entrada e tratamento de erro
- cobertura minima de testes em caminho critico
- auditoria completa por chamada MCP
- nenhuma credencial exposta em log
- documentacao de operacao e incidente publicada

## 8. Riscos principais e mitigacao
- risco: permissao OCI excessiva
  mitigacao: IAM por compartimento + politica de menor privilegio
- risco: dependencia de sessao OCI expirada
  mitigacao: health-check de autenticacao e alerta de expiracao
- risco: uso indevido de tools destrutivas
  mitigacao: iniciar read-only, allowlist por perfil, aprovacao explicita para write
- risco: divergencia entre ambiente local e prod
  mitigacao: mesma imagem container e pipeline unica de promote

## 9. Proximos passos imediatos
1. decidir servidores do MVP (identity, monitoring, resource-search, object-storage)
2. criar esqueleto do servidor MCP Oracle no workspace
3. configurar perfil OCI de homologacao com IAM minima
4. implementar 2 tools de identidade e 2 de observabilidade como prova de valor
