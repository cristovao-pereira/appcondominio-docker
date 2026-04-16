# Especificação de Uso de Container no Projeto

## 1. Objetivo

Este documento define a padronização do uso de containers no projeto do sistema de portaria com rastreamento de visitantes por GPS.

O objetivo é garantir que o ambiente de desenvolvimento, teste e execução seja reproduzível, consistente e simples de operar em qualquer máquina ou pipeline de integração contínua.

---

## 2. Por que usar containers

O uso de containers será adotado para:

- padronizar o ambiente entre desenvolvedores
- evitar divergências entre máquina local e produção
- facilitar a instalação de dependências
- simplificar a execução do projeto
- facilitar testes automatizados
- melhorar a previsibilidade de deploy
- permitir escalabilidade futura

---

## 3. Escopo do uso de containers

A solução utilizará containers para os principais componentes do sistema:

- **Frontend**
- **Backend**
- **Banco de dados**
- **Serviços auxiliares**, se necessário

No momento inicial, a proposta contempla:

- aplicação frontend em container
- aplicação backend em container
- banco PostgreSQL em container

Opcionalmente, poderão ser adicionados no futuro:

- Redis
- Nginx
- serviço de filas
- workers assíncronos

---

## 4. Componentes containerizados

### 4.1 Frontend
O frontend será executado em container próprio.

Responsabilidades:
- servir a interface web
- consumir a API do backend
- exibir telas de login, dashboard, visitas, alertas e rastreamento

### 4.2 Backend
O backend será executado em container próprio.

Responsabilidades:
- expor APIs do sistema
- processar regras de negócio
- autenticar usuários
- registrar visitas
- receber localizações GPS
- emitir alertas
- persistir dados no banco

### 4.3 Banco de dados
O banco de dados será executado em container próprio.

Responsabilidades:
- armazenar dados estruturados do sistema
- manter histórico de visitas
- registrar eventos de rastreamento
- guardar auditoria e alertas

---

## 5. Ambiente de desenvolvimento

O ambiente local de desenvolvimento deverá ser iniciado preferencialmente com `docker compose`.

### Exemplo de fluxo esperado
1. clonar o repositório
2. configurar variáveis de ambiente
3. executar o comando de subida dos containers
4. acessar o frontend pelo navegador
5. acessar a API e o banco conforme configuração local

### Benefícios
- inicialização rápida
- ambiente replicável
- facilidade de onboarding para novos desenvolvedores

---

## 6. Ambiente de testes

Os containers também serão usados para:

- testes de integração
- testes automatizados
- validação de rotas da API
- validação de persistência no banco
- testes de execução do sistema completo

O uso de containers em testes reduz falhas causadas por diferenças de ambiente.

---

## 7. Ambiente de produção

Na produção, os containers deverão ser usados para manter a mesma estrutura lógica do ambiente de desenvolvimento.

Isso permite:

- consistência entre ambientes
- deploy previsível
- atualização controlada de serviços
- facilidade para rollback

---

## 8. Estrutura esperada do projeto

A estrutura sugerida para o repositório é:

```text
project/
├── frontend/
├── backend/
├── infra/
│   ├── docker/
│   └── compose/
├── docs/
├── .env.example
└── docker-compose.yml