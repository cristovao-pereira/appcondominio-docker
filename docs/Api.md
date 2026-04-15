# APIs / Endpoints do Sistema

## 1. Autenticação

### POST /auth/login
Autentica o usuário no sistema.

**Entrada**
- `email`
- `senha`

**Saída**
- `token de acesso`
- `refresh token`
- `dados do usuário`
- `perfis`

### POST /auth/refresh
Renova o token de acesso.

### POST /auth/logout
Encerra a sessão do usuário.

### GET /auth/me
Retorna os dados do usuário autenticado.

---

## 2. Condomínios

### GET /condominios
Lista os condomínios do sistema.

### POST /condominios
Cria um novo condomínio.

### GET /condominios/:id
Exibe os dados de um condomínio específico.

### PUT /condominios/:id
Atualiza os dados de um condomínio.

### DELETE /condominios/:id
Inativa ou remove um condomínio.

---

## 3. Blocos

### GET /condominios/:condominioId/blocos
Lista os blocos de um condomínio.

### POST /condominios/:condominioId/blocos
Cria um bloco.

### PUT /blocos/:id
Atualiza um bloco.

### DELETE /blocos/:id
Inativa um bloco.

---

## 4. Unidades

### GET /condominios/:condominioId/unidades
Lista as unidades de um condomínio.

### POST /condominios/:condominioId/unidades
Cria uma unidade.

### GET /unidades/:id
Exibe uma unidade específica.

### PUT /unidades/:id
Atualiza uma unidade.

### DELETE /unidades/:id
Inativa uma unidade.

---

## 5. Usuários e Perfis

### GET /usuarios
Lista usuários.

### POST /usuarios
Cria um usuário.

### GET /usuarios/:id
Exibe um usuário.

### PUT /usuarios/:id
Atualiza um usuário.

### DELETE /usuarios/:id
Inativa um usuário.

### GET /perfis
Lista perfis disponíveis.

### POST /usuarios/:id/perfis
Vincula perfis a um usuário.

### DELETE /usuarios/:id/perfis/:perfilId
Remove um perfil do usuário.

---

## 6. Moradores

### GET /condominios/:condominioId/moradores
Lista moradores de um condomínio.

### POST /condominios/:condominioId/moradores
Cria um morador.

### GET /moradores/:id
Exibe um morador.

### PUT /moradores/:id
Atualiza um morador.

### DELETE /moradores/:id
Inativa um morador.

---

## 7. Visitantes

### GET /visitantes
Lista visitantes.

### POST /visitantes
Cria um visitante.

### GET /visitantes/:id
Exibe um visitante.

### PUT /visitantes/:id
Atualiza um visitante.

### DELETE /visitantes/:id
Inativa um visitante.

---

## 8. Autorizações de Visita

### GET /autorizacoes-visita
Lista autorizações.

### POST /autorizacoes-visita
Cria uma autorização de visita.

### GET /autorizacoes-visita/:id
Exibe uma autorização.

### PUT /autorizacoes-visita/:id
Atualiza uma autorização.

### PATCH /autorizacoes-visita/:id/aprovar
Aprova a autorização.

### PATCH /autorizacoes-visita/:id/recusar
Recusa a autorização.

### PATCH /autorizacoes-visita/:id/cancelar
Cancela a autorização.

---

## 9. Visitas

### GET /visitas
Lista visitas.

### POST /visitas
Cria uma visita.

### GET /visitas/:id
Exibe uma visita específica.

### PUT /visitas/:id
Atualiza uma visita.

### PATCH /visitas/:id/iniciar
Inicia a visita.

### PATCH /visitas/:id/finalizar
Finaliza a visita.

### PATCH /visitas/:id/cancelar
Cancela a visita.

---

## 10. Dispositivos GPS

### GET /dispositivos-gps
Lista dispositivos GPS.

### POST /dispositivos-gps
Cadastra um dispositivo GPS.

### GET /dispositivos-gps/:id
Exibe um dispositivo específico.

### PUT /dispositivos-gps/:id
Atualiza um dispositivo.

### PATCH /dispositivos-gps/:id/ativar
Ativa o dispositivo.

### PATCH /dispositivos-gps/:id/inativar
Inativa o dispositivo.

### PATCH /dispositivos-gps/:id/uso
Marca o dispositivo como em uso.

### PATCH /dispositivos-gps/:id/disponibilizar
Marca o dispositivo como disponível.

---

## 11. Localizações GPS

### GET /visitas/:visitaId/localizacoes
Lista as localizações de uma visita.

### POST /localizacoes-gps
Registra uma nova localização.

### GET /dispositivos-gps/:id/ultima-localizacao
Retorna a última posição registrada do dispositivo.

---

## 12. Áreas do Condomínio

### GET /condominios/:condominioId/areas
Lista as áreas do condomínio.

### POST /condominios/:condominioId/areas
Cria uma área.

### PUT /areas/:id
Atualiza uma área.

### DELETE /areas/:id
Inativa uma área.

---

## 13. Alertas

### GET /alertas
Lista os alertas.

### GET /alertas/:id
Exibe um alerta específico.

### PATCH /alertas/:id/resolver
Marca o alerta como resolvido.

### PATCH /alertas/:id/ignorar
Marca o alerta como ignorado.

---

## 14. Consentimentos

### POST /consentimentos
Registra o aceite do visitante.

### GET /visitas/:visitaId/consentimento
Consulta o consentimento de uma visita.

---

## 15. Auditoria

### GET /auditoria
Lista eventos de auditoria.

### GET /auditoria/:id
Exibe um evento específico.

### GET /condominios/:condominioId/auditoria
Lista auditoria por condomínio.

---

## Estrutura de Módulos no Backend

| Módulo | Funcionalidades |
|--------|-----------------|
| **auth** | login, refresh, logout, me |
| **condominios** | condomínios, blocos, unidades, áreas |
| **usuarios** | usuários, perfis, vinculações |
| **moradores** | cadastro, atualização, consulta |
| **visitantes** | cadastro, atualização, consulta |
| **visitas** | autorizações, início, término, histórico |
| **gps** | dispositivos, localizações, posição atual |
| **alertas** | geração, consulta, resolução |
| **auditoria** | logs de ações, trilha de eventos |
