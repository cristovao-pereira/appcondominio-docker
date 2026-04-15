# Telas Principais do Sistema

Sistema de Portaria para Condomínios com Rastreamento de Visitantes por GPS

---

## 1. Tela de Login

**Objetivo:** Permitir acesso ao sistema conforme perfil do usuário.

| Campo | Tipo |
|-------|------|
| E-mail | Input |
| Senha | Input (oculto) |

**Ações:**
- Entrar
- Recuperar senha

---

## 2. Dashboard Inicial

**Objetivo:** Exibir um resumo da operação.

**Informações exibidas:**
- Visitantes em andamento
- Visitas agendadas
- Alertas ativos
- Dispositivos disponíveis
- Condomínios cadastrados
- Últimas movimentações

**Perfis que acessam:**
- Administrador
- Síndico
- Portaria

---

## 3. Gestão de Condomínios

**Objetivo:** Cadastrar e administrar condomínios.

**Funcionalidades:**
- Listar condomínios
- Criar condomínio
- Editar condomínio
- Ativar/inativar condomínio
- Acessar detalhes

---

## 4. Gestão de Blocos e Unidades

**Objetivo:** Organizar a estrutura física do condomínio.

**Funcionalidades:**
- Cadastrar blocos
- Cadastrar unidades
- Vincular unidades aos blocos
- Editar informações
- Consultar ocupação

---

## 5. Gestão de Moradores

**Objetivo:** Cadastrar os moradores vinculados às unidades.

**Funcionalidades:**
- Listar moradores
- Adicionar morador
- Vincular usuário ao morador
- Editar dados
- Inativar cadastro

---

## 6. Gestão de Visitantes

**Objetivo:** Cadastrar e consultar visitantes.

**Funcionalidades:**
- Cadastrar visitante
- Editar visitante
- Consultar histórico
- Localizar visitas anteriores

---

## 7. Autorização de Visita

**Objetivo:** Permitir que o morador solicite ou aprove a visita.

**Funcionalidades:**
- Criar autorização
- Selecionar visitante
- Escolher unidade
- Definir data e hora
- Aprovar ou recusar

**Estados da autorização:**

| Estado | Descrição |
|--------|-----------|
| `pendente` | Aguardando aprovação |
| `aprovada` | Aprovada pelo morador/síndico |
| `recusada` | Recusada |
| `cancelada` | Cancelada pelo solicitante |
| `expirada` | Expirou sem ser utilizada |

---

## 8. Tela da Portaria

**Objetivo:** Executar o fluxo operacional do atendimento.

**Funcionalidades:**
- Buscar visitante
- Validar autorização
- Registrar entrada
- Entregar dispositivo GPS
- Iniciar visita
- Encerrar visita

> **Destaque:** Essa é uma das telas mais importantes do sistema.

---

## 9. Tela de Rastreamento em Tempo Real

**Objetivo:** Exibir a localização atual do visitante no mapa.

**Elementos exibidos:**
- Mapa
- Posição atual do visitante
- Status da visita
- Tempo de permanência
- Última atualização
- Trajeto percorrido
- Alertas ativos

**Perfis que acessam:**
- Portaria
- Morador
- Síndico
- Administrador

---

## 10. Tela de Alertas

**Objetivo:** Mostrar ocorrências de segurança.

**Tipos de alertas:**

| Tipo | Descrição |
|------|-----------|
| `area_restrita` | Visitante entrou em área restrita |
| `tempo_excedido` | Tempo de visita excedido |
| `perda_sinal` | Perda de sinal do dispositivo GPS |
| `bateria_baixa` | Bateria do dispositivo baixa |
| `dispositivo_fora` | Dispositivo fora de uso |

**Funcionalidades:**
- Listar alertas
- Filtrar por tipo
- Marcar como resolvido
- Visualizar detalhes

---

## 11. Tela de Dispositivos GPS

**Objetivo:** Controlar os dispositivos físicos.

**Funcionalidades:**
- Listar dispositivos
- Cadastrar novo dispositivo
- Marcar como disponível
- Marcar como em uso
- Visualizar bateria
- Consultar última localização

---

## 12. Tela de Auditoria

**Objetivo:** Consultar o histórico de ações no sistema.

**Funcionalidades:**
- Listar eventos
- Filtrar por usuário
- Filtrar por condomínio
- Visualizar detalhes do evento

---

## 13. Tela de Perfil do Usuário

**Objetivo:** Permitir gestão de dados pessoais e credenciais.

**Funcionalidades:**
- Editar nome
- Alterar senha
- Visualizar permissões
- Acessar histórico próprio

---

## 14. Fluxo de Navegação Sugerido

### Organização por Perfil

#### Administrador
- Dashboard
- Condomínios
- Usuários
- Dispositivos
- Auditoria
- Relatórios

#### Síndico
- Dashboard
- Visitantes autorizados
- Rastreamento
- Alertas
- Auditoria limitada

#### Portaria
- Dashboard
- Visitantes
- Autorizações
- Check-in / Check-out
- Rastreamento
- Dispositivos

#### Morador
- Suas autorizações
- Visitantes autorizados
- Acompanhamento em tempo real
- Histórico de visitas

---

## Resumo das Telas por Categoria

| Categoria | Telas |
|-----------|-------|
| **Autenticação** | Login |
| **Visão Geral** | Dashboard Inicial |
| **Gestão** | Condomínios, Blocos/Unidades, Moradores, Visitantes, Dispositivos GPS |
| **Operacional** | Autorização de Visita, Tela da Portaria |
| **Monitoramento** | Rastreamento em Tempo Real, Alertas |
| **Suporte** | Auditoria, Perfil do Usuário |
