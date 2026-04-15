# Modelagem Completa do Banco de Dados

Sistema de Portaria com Rastreamento de Visitantes por GPS

## Objetivo

Estruturar as tabelas e relacionamentos do sistema de portaria com rastreamento de visitantes por GPS, considerando:
- Múltiplos condomínios
- Controle de usuários por perfil
- Fluxo de visita
- Dispositivo físico com GPS
- Rastreamento em tempo real
- Alertas
- Auditoria

---

## 1. Tabelas Principais

### 1.1 `condominios`

Armazena os condomínios cadastrados no sistema.

| Campo       | Tipo    | Descrição                |
|-------------|---------|--------------------------|
| `id`        | INTEGER | Chave primária           |
| `nome`      | STRING  | Nome do condomínio       |
| `cnpj`      | STRING  | CNPJ do condomínio       |
| `endereco`  | STRING  | Endereço completo        |
| `cidade`    | STRING  | Cidade                   |
| `estado`    | STRING  | Estado (UF)              |
| `cep`       | STRING  | CEP                      |
| `ativo`     | BOOLEAN | Se está ativo            |
| `created_at`| DATETIME| Data de criação           |
| `updated_at`| DATETIME| Data de atualização       |

---

### 1.2 `blocos`

Representa blocos, torres ou setores do condomínio.

| Campo          | Tipo    | Descrição                |
|----------------|---------|--------------------------|
| `id`           | INTEGER | Chave primária           |
| `condominio_id`| INTEGER | FK para condomínios      |
| `nome`         | STRING  | Nome do bloco/torre      |
| `descricao`    | STRING  | Descrição adicional      |
| `ativo`        | BOOLEAN | Se está ativo            |
| `created_at`   | DATETIME| Data de criação          |
| `updated_at`   | DATETIME| Data de atualização      |

**Relacionamento:** um condomínio possui vários blocos

---

### 1.3 `unidades`

Representa apartamentos, casas ou unidades.

| Campo          | Tipo    | Descrição                |
|----------------|---------|--------------------------|
| `id`           | INTEGER | Chave primária           |
| `condominio_id`| INTEGER | FK para condomínios      |
| `bloco_id`     | INTEGER | FK para blocos (opcional)|
| `numero`       | STRING  | Número da unidade        |
| `andar`        | INTEGER | Andar                    |
| `tipo`         | STRING  | Tipo da unidade          |
| `ativo`        | BOOLEAN | Se está ativo            |
| `created_at`   | DATETIME| Data de criação          |
| `updated_at`   | DATETIME| Data de atualização      |

**Relacionamentos:**
- Uma unidade pertence a um condomínio
- Uma unidade pode pertencer a um bloco

---

### 1.4 `usuarios`

Armazena os usuários autenticados do sistema.

| Campo         | Tipo    | Descrição                |
|---------------|---------|--------------------------|
| `id`          | INTEGER | Chave primária           |
| `nome`        | STRING  | Nome completo            |
| `email`       | STRING  | E-mail (único)           |
| `senha_hash`  | STRING  | Hash da senha            |
| `telefone`    | STRING  | Telefone de contato      |
| `ativo`       | BOOLEAN | Se está ativo            |
| `created_at`  | DATETIME| Data de criação          |
| `updated_at`  | DATETIME| Data de atualização      |

---

### 1.5 `perfis`

Define os tipos de acesso.

| Campo       | Tipo    | Descrição                |
|-------------|---------|--------------------------|
| `id`        | INTEGER | Chave primária           |
| `nome`      | STRING  | Nome do perfil           |
| `descricao` | STRING  | Descrição do perfil      |

**Exemplos de perfis:**
- `administrador`
- `sindico`
- `portaria`
- `morador`

---

### 1.6 `usuario_perfis`

Tabela de associação entre usuário e perfil.

| Campo           | Tipo    | Descrição                |
|-----------------|---------|--------------------------|
| `id`            | INTEGER | Chave primária           |
| `usuario_id`    | INTEGER | FK para usuários         |
| `perfil_id`     | INTEGER | FK para perfis           |
| `condominio_id` | INTEGER | FK para condomínios      |
| `created_at`    | DATETIME| Data de criação           |

**Observação:** Permite múltiplos perfis por usuário, se necessário

---

### 1.7 `moradores`

Armazena moradores vinculados às unidades.

| Campo       | Tipo    | Descrição                |
|-------------|---------|--------------------------|
| `id`        | INTEGER | Chave primária           |
| `usuario_id`| INTEGER | FK para usuários         |
| `unidade_id`| INTEGER | FK para unidades         |
| `nome`      | STRING  | Nome do morador          |
| `documento` | STRING  | CPF ou RG                |
| `telefone`  | STRING  | Telefone de contato      |
| `email`     | STRING  | E-mail                   |
| `titular`   | BOOLEAN | Se é o titular           |
| `ativo`     | BOOLEAN | Se está ativo            |
| `created_at`| DATETIME| Data de criação           |
| `updated_at`| DATETIME| Data de atualização       |

---

### 1.8 `visitantes`

Armazena visitantes cadastrados.

| Campo        | Tipo    | Descrição                |
|--------------|---------|--------------------------|
| `id`         | INTEGER | Chave primária           |
| `nome`       | STRING  | Nome do visitante        |
| `documento`  | STRING  | CPF ou RG                |
| `telefone`   | STRING  | Telefone de contato      |
| `foto`       | BLOB    | Foto do visitante        |
| `observacao` | STRING  | Observações              |
| `created_at` | DATETIME| Data de criação           |
| `updated_at` | DATETIME| Data de atualização       |

---

### 1.9 `autorizacoes_visita`

Registra as autorizações de visita.

| Campo                | Tipo    | Descrição                |
|---------------------|---------|--------------------------|
| `id`                | INTEGER | Chave primária           |
| `condominio_id`     | INTEGER | FK para condomínios      |
| `unidade_id`        | INTEGER | FK para unidades         |
| `morador_id`        | INTEGER | FK para moradores        |
| `visitante_id`      | INTEGER | FK para visitantes       |
| `data_prevista`     | DATE    | Data prevista da visita  |
| `hora_prevista`     | TIME    | Hora prevista            |
| `status`            | STRING  | Status da autorização    |
| `motivo`            | STRING  | Motivo da visita         |
| `aprovado_por`      | INTEGER | FK para usuários        |
| `created_at`        | DATETIME| Data de criação           |
| `updated_at`        | DATETIME| Data de atualização       |

**Status possíveis:**
- `pendente`
- `aprovada`
- `recusada`
- `cancelada`
- `expirada`

---

### 1.10 `dispositivos_gps`

Armazena os dispositivos físicos com GPS.

| Campo                      | Tipo    | Descrição                     |
|---------------------------|---------|-------------------------------|
| `id`                      | INTEGER | Chave primária                |
| `condominio_id`           | INTEGER | FK para condomínios           |
| `numero_serie`            | STRING  | Número de série do dispositivo|
| `codigo_interno`          | STRING  | Código interno de registro    |
| `status`                  | STRING  | Status do dispositivo          |
| `bateria_nivel`           | INTEGER | Nível de bateria (%)          |
| `ultima_localizacao_lat`  | DECIMAL | Última latitude known         |
| `ultima_localizacao_lng`  | DECIMAL | Última longitude known        |
| `ultima_comunicacao_em`   | DATETIME| Última comunicação            |
| `ativo`                   | BOOLEAN | Se está ativo                 |
| `created_at`              | DATETIME| Data de criação                |
| `updated_at`              | DATETIME| Data de atualização            |

**Status possíveis:**
- `disponível`
- `em_uso`
- `manutenção`
- `inativo`

---

### 1.11 `visitas`

Representa a visita efetiva.

| Campo                    | Tipo    | Descrição                |
|-------------------------|---------|--------------------------|
| `id`                    | INTEGER | Chave primária           |
| `condominio_id`         | INTEGER | FK para condomínios      |
| `unidade_id`            | INTEGER | FK para unidades         |
| `morador_id`            | INTEGER | FK para moradores        |
| `visitante_id`          | INTEGER | FK para visitantes       |
| `autorizacao_visita_id` | INTEGER | FK para autorizações     |
| `dispositivo_gps_id`    | INTEGER | FK para dispositivos GPS|
| `data_entrada`          | DATETIME| Data/hora de entrada     |
| `data_saida`            | DATETIME| Data/hora de saída       |
| `status`                | STRING  | Status da visita         |
| `observacao`            | STRING  | Observações              |
| `created_at`            | DATETIME| Data de criação           |
| `updated_at`            | DATETIME| Data de atualização       |

**Status possíveis:**
- `aguardando`
- `em_andamento`
- `finalizada`
- `cancelada`

---

### 1.12 `localizacoes_gps`

Registra o histórico de posições do dispositivo GPS.

| Campo             | Tipo    | Descrição                |
|-------------------|---------|--------------------------|
| `id`              | INTEGER | Chave primária           |
| `visita_id`       | INTEGER | FK para visitas          |
| `dispositivo_gps_id` | INTEGER | FK para dispositivos GPS|
| `latitude`        | DECIMAL | Latitude                 |
| `longitude`       | DECIMAL | Longitude                |
| `precisao`        | DECIMAL | Precisão (metros)       |
| `velocidade`      | DECIMAL | Velocidade (km/h)       |
| `altitude`        | DECIMAL | Altitude (metros)       |
| `registrado_em`   | DATETIME| Data/hora do registro    |

---

### 1.13 `areas_condominio`

Define áreas do condomínio.

| Campo          | Tipo    | Descrição                |
|----------------|---------|--------------------------|
| `id`           | INTEGER | Chave primária           |
| `condominio_id`| INTEGER | FK para condomínios      |
| `nome`         | STRING  | Nome da área             |
| `tipo`         | STRING  | Tipo da área             |
| `descricao`    | STRING  | Descrição                |
| `ativo`        | BOOLEAN | Se está ativo            |
| `created_at`   | DATETIME| Data de criação           |
| `updated_at`   | DATETIME| Data de atualização      |

**Tipos:**
- `permitida`
- `restrita`
- `comum`
- `monitorada`

---

### 1.14 `alertas`

Registra alertas do sistema.

| Campo           | Tipo    | Descrição                |
|-----------------|---------|--------------------------|
| `id`            | INTEGER | Chave primária           |
| `condominio_id` | INTEGER | FK para condomínios      |
| `visita_id`     | INTEGER | FK para visitas          |
| `dispositivo_gps_id` | INTEGER | FK para dispositivos |
| `tipo`          | STRING  | Tipo do alerta           |
| `descricao`     | STRING  | Descrição do alerta      |
| `nivel`         | STRING  | Nível de severidade       |
| `status`        | STRING  | Status do alerta         |
| `criado_em`     | DATETIME| Data de criação          |
| `resolvido_em`  | DATETIME| Data de resolução         |

**Tipos de alerta:**
- `area_restrita`
- `perda_sinal`
- `tempo_excedido`
- `dispositivo_fora`
- `baixa_bateria`

---

### 1.15 `consentimentos`

Registra o aceite do visitante (LGPD).

| Campo        | Tipo    | Descrição                |
|--------------|---------|--------------------------|
| `id`         | INTEGER | Chave primária           |
| `visitante_id` | INTEGER | FK para visitantes       |
| `visita_id`  | INTEGER | FK para visitas           |
| `tipo`       | STRING  | Tipo do consentimento    |
| `aceito`     | BOOLEAN | Se foi aceito             |
| `data_aceite`| DATETIME| Data do aceite           |
| `ip_origem`  | STRING  | IP de origem             |
| `observacao` | STRING  | Observações              |

---

### 1.16 `auditoria_eventos`

Registra ações relevantes no sistema.

| Campo           | Tipo    | Descrição                |
|-----------------|---------|--------------------------|
| `id`            | INTEGER | Chave primária           |
| `condominio_id` | INTEGER | FK para condomínios      |
| `usuario_id`    | INTEGER | FK para usuários         |
| `entidade`      | STRING  | Nome da entidade         |
| `entidade_id`   | INTEGER | ID da entidade afetada  |
| `acao`          | STRING  | Ação realizada           |
| `descricao`     | STRING  | Descrição do evento      |
| `criado_em`     | DATETIME| Data/hora do evento      |
| `ip_origem`     | STRING  | IP de origem             |

---

## 2. Relacionamentos Principais

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ condominios │───────│   blocos    │       │  unidades   │
└─────────────┘       └─────────────┘       └─────────────┘
       │                                           │
       │              ┌─────────────┐             │
       └──────────────│   visitas   │◄────────────┘
                      └─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ dispositivos│───────│localizacoes │       │   alertas   │
│    _gps    │       └─────────────┘       └─────────────┘
└─────────────┘
```

**Resumo dos relacionamentos:**
- **Condomínio** possui vários blocos, unidades, dispositivos, áreas, visitas, alertas e auditorias
- **Bloco** pertence a um condomínio
- **Unidade** pertence a um condomínio e, opcionalmente, a um bloco
- **Usuário** pode ter vários perfis
- **Morador** pertence a uma unidade e pode estar vinculado a um usuário
- **Visitante** participa de autorizações, visitas e consentimentos
- **Autorização de visita** gera uma visita
- **Visita** pode estar vinculada a um dispositivo GPS
- **Dispositivo GPS** gera localizações
- **Visita** pode gerar alertas
- **Consentimento** é vinculado ao visitante e à visita
- **Auditoria** registra ações dos usuários

---

## 3. Estrutura Resumida do Modelo

| Módulo          | Tabelas                                      |
|-----------------|----------------------------------------------|
| **Condomínio**  | `condominios`, `blocos`, `unidades`, `areas_condominio` |
| **Usuários**    | `usuarios`, `perfis`, `usuario_perfis`, `moradores` |
| **Visitas**     | `visitantes`, `autorizacoes_visita`, `visitas`, `consentimentos` |
| **GPS**         | `dispositivos_gps`, `localizacoes_gps`      |
| **Sistema**     | `alertas`, `auditoria_eventos`               |

---

## 4. Tabelas Mínimas para o MVP

Para iniciar de forma enxuta, o MVP pode usar:

| Prioridade | Tabela                | Descrição                        |
|------------|----------------------|----------------------------------|
| 1          | `condominios`        | Cadastro de condomínios          |
| 1          | `blocos`             | Blocos do condomínio              |
| 1          | `unidades`           | Unidades do condomínio            |
| 1          | `usuarios`            | Usuários do sistema               |
| 1          | `perfis`             | Perfis de acesso                  |
| 1          | `usuario_perfis`     | Associação usuário-perfil         |
| 2          | `moradores`           | Moradores vinculados às unidades  |
| 2          | `visitantes`          | Cadastro de visitantes             |
| 2          | `autorizacoes_visita` | Autorizações de visita            |
| 2          | `dispositivos_gps`    | Dispositivos GPS                  |
| 2          | `visitas`             | Visitas efetivas                  |
| 2          | `localizacoes_gps`    | Histórico de posições GPS        |
| 3          | `alertas`             | Alertas do sistema                |
| 3          | `consentimentos`       | Consentimento LGPD                |
| 3          | `auditoria_eventos`   | Logs de auditoria                  |

**Legenda:**
- **Prioridade 1:** Essenciais para funcionamento básico
- **Prioridade 2:** Importantes para o fluxo de visitas
- **Prioridade 3:** Complementares mas recomendados
