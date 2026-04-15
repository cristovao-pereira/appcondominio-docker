# Diagrama Lógico Visual do Sistema

Sistema de Portaria para Condomínios com Rastreamento de Visitantes por GPS

| Info | Valor |
|------|-------|
| **Versão** | 1.0 |
| **Data** | 2026-04-13 |

---

## 1. Visão Geral

O sistema é estruturado em quatro blocos principais:

| Bloco | Descrição |
|-------|-----------|
| **Estrutura do Condomínio** | Organização física do condomínio |
| **Controle de Visitas** | Fluxo de visitantes e autorizações |
| **Rastreamento e Segurança** | GPS, localizações e alertas |
| **Usuários e Auditoria** | Perfis de acesso e logs |

Cada bloco representa uma área funcional essencial da solução.

---

## 2. Estrutura do Condomínio

```
CONDOMINIO
├── BLOCO
│   └── UNIDADE
│       └── MORADOR
└── AREA_CONDOMINIO
```

### Descrição
- Um condomínio possui **blocos**
- Cada bloco possui **unidades**
- Cada unidade possui **moradores**
- O condomínio possui **áreas** cadastradas para controle e monitoramento

---

## 3. Controle de Visitas

```
MORADOR
└── AUTORIZACAO_VISITA
    └── VISITA
        ├── VISITANTE
        └── CONSENTIMENTO
```

### Descrição
- O **morador** solicita ou aprova a visita
- A **autorização** gera uma visita
- O **visitante** é vinculado à visita
- O **consentimento** formaliza o aceite para rastreamento e uso dos dados

---

## 4. Rastreamento e Segurança

```
DISPOSITIVO_GPS
└── VISITA
    ├── LOCALIZACAO_GPS
    └── ALERTA
```

### Descrição
- O **dispositivo GPS** é entregue ao visitante
- A visita passa a gerar registros de **localização**
- O sistema dispara **alertas** em caso de evento suspeito ou violação de regra

---

## 5. Usuários do Sistema

```
USUARIO
├── USUARIO_PERFIL
│   └── PERFIL
└── MORADOR
```

### Descrição
- O **usuário** do sistema pode ter um ou mais perfis
- O **perfil** define permissões como administrador, portaria, síndico ou morador
- O **morador** pode ser vinculado a um usuário autenticado

---

## 6. Auditoria

```
USUARIO
└── AUDITORIA_EVENTOS
```

### Descrição
- Toda ação importante é registrada
- A auditoria garante rastreabilidade e segurança operacional

---

## 7. Diagrama Consolidado

```
┌───────────────┐
│  CONDOMINIO   │
└───────┬───────┘
        │
        ├───┬──────────────────┬──────────────────┐
        │   │                  │                  │
┌───────▼───┐ │  ┌──────────────▼┐  ┌────────────▼────────┐
│   BLOCO   │ │  │    AREA       │  │    DISPOSITIVO      │
└───────┬───┘ │  │  CONDOMINIO   │  │       GPS           │
        │     │  └───────────────┘  └──────────┬─────────┘
┌───────▼───┐ │                               │
│  UNIDADE  │ │                     ┌──────────▼─────────┐
└───────┬───┘ │                     │       VISITA        │
        │     │                     └──────────┬─────────┘
┌───────▼───┐ │                               │
│  MORADOR  │ │              ┌────────────────┼────────────────┐
└───────┬───┘ │              │                │                │
        │     │    ┌─────────▼────────┐  ┌───▼────────────┐  │
        │     │    │AUTORIZACAO_VISITA│  │ LOCALIZACAO_GPS │  │
        │     │    └─────────┬────────┘  └────────────────┘  │
        │     │              │                                  │
        │     │    ┌─────────▼────────┐        ┌────────────▼──┐
        │     │    │    VISITANTE     │        │     ALERTA     │
        │     │    └─────────┬────────┘        └────────────────┘
        │     │              │
        │     │    ┌─────────▼────────┐
        │     │    │  CONSENTIMENTO   │
        │     │    └──────────────────┘
        │     │
        │     │
        │     │
        └──┴──┴─────────────────────────────────────┐
                                                   │
                    USUARIO ─── USUARIO_PERFIL ──── PERFIL
                      │
                      └────────── MORADOR
                      │
                      └────────── AUDITORIA_EVENTOS
```

---

## 8. Legenda

| Categoria | Entidades |
|-----------|-----------|
| **Estrutura do condomínio** | `condominio`, `bloco`, `unidade`, `morador`, `area_condominio` |
| **Controle de visitas** | `visitante`, `autorizacao_visita`, `visita`, `consentimento` |
| **Rastreamento e segurança** | `dispositivo_gps`, `localizacao_gps`, `alerta` |
| **Usuários e acesso** | `usuario`, `perfil`, `usuario_perfil` |
| **Auditoria** | `auditoria_eventos` |

---

## 9. Resumo dos Módulos

| Módulo | Entidades | Relacionamento |
|--------|-----------|----------------|
| **Estrutura** | Condomínio → Bloco → Unidade → Morador | Hierárquico |
| **Visitas** | Morador → Autorização → Visita → Visitante | Fluxo |
| **GPS** | Dispositivo → Visita → Localização + Alerta | Temporal |
| **Usuários** | Usuário ↔ Perfil (many-to-many) | Associação |
| **Auditoria** | Usuário → Eventos | Log |

---

## 10. Conclusão

Este diagrama representa a estrutura lógica inicial do sistema de portaria para condomínios com rastreamento de visitantes por GPS.

Ele pode ser utilizado como base para:
- Apresentação do projeto
- Documentação técnica
- Evolução e planejamento do sistema
