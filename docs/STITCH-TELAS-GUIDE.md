# Guia de Criação de Telas - Stitch
## Sistema de Portaria para Condomínios com Rastreamento de Visitantes por GPS

> Este documento contém instruções passo a passo para criar cada tela no Stitch. Use este guia durante a criação dos protótipos.

---

## Como Usar Este Guia

1. **Abra o Stitch** e navegue até o projeto
2. **Siga as instruções** da tela desejada na ordem indicada
3. **Consulte os tips** para boas práticas
4. **Anote o nome da tela** criada para referência na implementação React

---

## Categoria: Autenticação

---

### Tela 1: Login

**Objetivo:** Permitir acesso ao sistema conforme perfil do usuário.

#### Layout
- Container centralizado (max-width: 400px)
- Logo do sistema no topo
- Formulário com campos verticais
- Botão de ação primário

#### Campos
| Campo | Tipo | Validação |
|-------|------|-----------|
| E-mail | Input (texto) | Formato de e-mail |
| Senha | Input (senha) | Mínimo 6 caracteres |

#### Componentes Recomendados (shadcn/ui)
- `Input` - para campos de texto
- `Button` - para ações
- `Card` - para container do formulário

#### Ações
- **Entrar** → Botão primário (type: submit)
- **Recuperar senha** → Link secundário

#### Estados
- Default: campos vazios
- Filled: campos preenchidos
- Error: borda vermelha + mensagem
- Loading: botão desabilitado com spinner

#### Dicas Stitch
- Use frame de 375x667 (mobile-first para portaria)
- Inclua ícone de olho para toggle de senha
- Adicione mensagem de erro abaixo do campo

---

## Categoria: Visão Geral

---

### Tela 2: Dashboard Inicial

**Objetivo:** Exibir resumo da operação com métricas e alertas.

#### Layout
- Header com saudação e notifications
- Grid de cards com métricas (2 colunas)
- Lista de últimas movimentações
- Quick actions flutuante

#### Cards de Métricas (6 items)
| Métrica | Ícone | Cor |
|---------|-------|-----|
| Visitantes em andamento | Users | blue |
| Visitas agendadas | Calendar | green |
| Alertas ativos | AlertTriangle | red |
| Dispositivos disponíveis | Smartphone | green |
| Condomínios cadastrados | Building | purple |
| Últimas movimentações | Activity | gray |

#### Componentes Recomendados (shadcn/ui)
- `Card` - para métricas
- `Badge` - para status
- `Avatar` - para fotos de perfil
- `Progress` - para indicadores

#### Perfis que acessam
- Administrador
- Síndico
- Portaria

#### Dicas Stitch
- Use grid responsivo (2x3 para desktop, 1x6 para mobile)
- Ícones devem ser consistentes (Lucide React)
- Cards devem ter hover state sutil

---

## Categoria: Gestão

---

### Tela 3: Gestão de Condomínios

**Objetivo:** Cadastrar e administrar condomínios.

#### Layout
- Header com título + botão "Novo Condomínio"
- Tabela ou lista de condomínios
- Search/filter bar
- Modal ou slide-over para edição

#### Campos do Formulário
| Campo | Tipo |
|-------|------|
| Nome do condomínio | Input (texto) |
| Endereço | Input (texto) |
| CNPJ | Input (máscara) |
| Telefone | Input (tel) |
| Quantidade de blocos | Input (number) |
| Status | Toggle (ativo/inativo) |

#### Ações por Item
- **Editar** → Ícone de lápis
- **Ativar/Inativar** → Toggle
- **Visualizar detalhes** → Clique na linha

#### Componentes Recomendados (shadcn/ui)
- `Table` - para listagem
- `Dialog` - para modal de criação/edição
- `Form` - para validação
- `Switch` - para toggle status

#### Dicas Stitch
- Tabela com colunas: Nome, Endereço, Blocos, Status, Ações
- Adicione confirm dialog para inativar
- Status ativo = badge verde, inativo = badge cinza

---

### Tela 4: Gestão de Blocos e Unidades

**Objetivo:** Organizar estrutura física do condomínio.

#### Layout
- Seletor de condomínio no topo
- Tabs: Blocos | Unidades
- Lista hierárquica (blocos → unidades)
- Botão de adicionar em cada tab

#### Campos - Blocos
| Campo | Tipo |
|-------|------|
| Nome do bloco | Input (texto) |
| Quantidade de andares | Input (number) |
| Unidades por andar | Input (number) |

#### Campos - Unidades
| Campo | Tipo |
|-------|------|
| Número da unidade | Input (texto) |
| Andar | Input (number) |
| Bloco | Select |
| Tipo | Select (residencial/comercial) |

#### Componentes Recomendados (shadcn/ui)
- `Tabs` - para alternar Blocos/Unidades
- `Select` - para dropdowns
- `Popover` - para seleção de condomínio
- `Sheet` - para slide-over de criação

#### Dicas Stitch
- Ao criar bloco, permitir gerar unidades automaticamente
- Mostrar occupied/vacant status das unidades
- Hierarquia visual: bloco com suas unidades expansíveis

---

### Tela 5: Gestão de Moradores

**Objetivo:** Cadastrar moradores vinculados às unidades.

#### Layout
- Header com search e filtros
- Lista de moradores (cards ou tabela)
- Quick view panel à direita
- Modal para adicionar/editar

#### Campos do Formulário
| Campo | Tipo |
|-------|------|
| Nome completo | Input (texto) |
| CPF | Input (máscara) |
| Telefone | Input (tel) |
| E-mail | Input (email) |
| Unidade | Select (vinculado ao bloco) |
| Tipo | Select (proprietário/inquilino/familiar) |
| Foto | Upload |
| Status | Toggle |

#### Relacionamentos
- Morador ↔ Unidade (1:1)
- Morador ↔ Usuário (1:1) - para app

#### Ações
- Adicionar morador
- Vincular usuário
- Editar dados
- Inativar cadastro

#### Componentes Recomendados (shadcn/ui)
- `Card` - para cards de morador
- `Avatar` - para foto
- `Select` - para unidade e tipo
- `Dialog` - para formulário

#### Dicas Stitch
- Avatar com iniciais se não houver foto
- Badge colorido por tipo (proprietário=blue, inquilino=green, familiar=purple)
- Campo de busca por nome, CPF ou unidade

---

### Tela 6: Gestão de Visitantes

**Objetivo:** Cadastrar e consultar visitantes.

#### Layout
- Header com search
- Lista de visitantes recentes
- Card expandível com detalhes
- Modal de cadastro rápido

#### Campos do Formulário
| Campo | Tipo |
|-------|------|
| Nome completo | Input (texto) |
| CPF | Input (máscara) |
| Telefone | Input (tel) |
| Foto | Upload |
| Observação | Textarea |

#### Funcionalidades
- Cadastrar visitante
- Editar visitante
- Consultar histórico
- Localizar visitas anteriores

#### Componentes Recomendados (shadcn/ui)
- `Card` - para cards de visitante
- `Avatar` - para foto
- `ScrollArea` - para lista
- `Dialog` - para modal

#### Dicas Stitch
- Buscar por nome ou CPF
- Mostrar foto grande no card expandido
- Histórico de visitas com timeline

---

### Tela 7: Dispositivos GPS

**Objetivo:** Controlar dispositivos físicos de rastreamento.

#### Layout
- Header com stats (disponíveis/em uso)
- Grid de cards de dispositivos
- Filtros por status
- Modal de cadastro

#### Campos do Formulário
| Campo | Tipo |
|-------|------|
| Código do dispositivo | Input (texto) |
| IMEI | Input (texto) |
| Modelo | Select |
| Status | Select (disponível/em uso/manutenção) |
| Battery | Input (number) % |

#### Card de Dispositivo
- Ícone de celular
- Código do dispositivo
- Status badge
- Nível de bateria (ícone)
- Última localização (mini mapa opcional)

#### Componentes Recomendados (shadcn/ui)
- `Card` - para card de dispositivo
- `Progress` - para bateria
- `Badge` - para status
- `Select` - para modelo/status

#### Dicas Stitch
- Indicador visual de bateria (verde/amarelo/vermelho)
- Ícone diferente por status
- Click no card → detalhes completos

---

## Categoria: Operacional

---

### Tela 8: Autorização de Visita ⭐

**Objetivo:** Permitir morador solicitar ou aprovar visita.

#### Layout
- Header com tabs: Criar | Pendentes | Histórico
- Formulário de criação (quando selecionado)
- Lista de autorizações pendentes
- Card de preview da autorização

#### Campos - Criar Autorização
| Campo | Tipo |
|-------|------|
| Visitante | Select (autocomplete) ou novo |
| Unidade | Select |
| Data de entrada | DatePicker |
| Hora de entrada | Input (time) |
| Data de saída | DatePicker |
| Hora de saída | Input (time) |
| Observação | Textarea |

#### Estados da Autorização
| Estado | Cor | Badge |
|--------|-----|-------|
| `pendente` | Amarelo | Pending |
| `aprovada` | Verde | Approved |
| `recusada` | Vermelho | Rejected |
| `cancelada` | Cinza | Cancelled |
| `expirada` | Laranja | Expired |

#### Ações por Estado
- **Pendente**: Aprovar | Recusar | Cancelar
- **Aprovada**: Cancelar | Usar
- **Recusada/Cancelada/Expirada**: Ver detalhes apenas

#### Componentes Recomendados (shadcn/ui)
- `Tabs` - para navegação
- `Select` - para visitante e unidade
- `Calendar` / `DatePicker` - para datas
- `Badge` - para status
- `Button` - para ações (variants: approve/reject)

#### Dicas Stitch
- QR Code preview após aprovação
- Countdown para autorizações pendentes
- Notificação visual ao síndico de nova pendência

---

### Tela 9: Tela da Portaria ⭐⭐

**Objetivo:** Executar fluxo operacional de atendimento (a mais importante).

#### Layout
- 3 colunas: Buscar | Autorização | Ações
- Ou layout em etapas (wizard/stepper)
- Search bar proeminente
- Área de status da visita atual

#### Seção 1: Buscar Visitante/Autorização
| Campo | Tipo |
|-------|------|
| Busca | Input com ícone (CPF ou nome) |
| QR Code | Scanner (se mobile) |

#### Seção 2: Validação da Autorização
- Dados do visitante (foto, nome, documento)
- Dados da autorização (unidade, horário)
- Status da autorização
- Validade (data/hora)

#### Seção 3: check-in/Checkout
| Ação | Descrição |
|------|-----------|
| Validar | Verificar se autorização é válida |
| Entregar dispositivo | Selecionar GPS disponível |
| Registrar entrada | Timestamp + device |
| Iniciar rastreamento | Ativar GPS |
| Encerrar visita | check-out + devolver device |

#### Estados Visuais
- Aguardando busca
- Autorização válida (verde)
- Autorização inválida (vermelho)
- Visita em andamento (azul)
- Visita finalizada (cinza)

#### Componentes Recomendados (shadcn/ui)
- `Stepper` - para fluxo de check-in
- `Card` - para exibição de dados
- `Input` - para busca
- `Button` - para ações
- `Alert` - para status/mensagens
- `Avatar` - para foto do visitante

#### Dicas Stitch
- Design mobile-first (uso no tablet da portaria)
- Botões grandes para toque fácil
- Feedback sonoro/haptic ao escanear
- Visor inteiro para fácil leitura à distância

---

## Categoria: Monitoramento

---

### Tela 10: Rastreamento em Tempo Real

**Objetivo:** Exibir localização do visitante no mapa.

#### Layout
- Mapa grande (70% da tela)
- Sidebar colapsável com detalhes
- Header com controles do mapa
- Bottom sheet para informações

#### Elementos do Mapa
- Posição atual do visitante (pin)
- Área do condomínio (polygon)
- Trajeto percorrido (polyline)
- Áreas restritas (marcadores)
- Dispositivo (se em uso)

#### Sidebar/Painel de Detalhes
| Informação | Descrição |
|------------|-----------|
| Visitante | Nome + foto |
| Status da visita | Badge colorido |
| Tempo de permanência | Cronômetro |
| Última atualização | Timestamp |
| Trajeto | Distância total |
| Alertas | Lista de alertas ativos |

#### Controles do Mapa
- Zoom in/out
- Recentralizar
- Toggle trajeto
- Toggle áreas restritas
- Modo satélite/mapa

#### Perfis que acessam
- Portaria
- Morador
- Síndico
- Administrador

#### Componentes Recomendados (shadcn/ui)
- `Card` - para painel lateral
- `Badge` - para status
- `Button` - para controles
- `Sheet` - para bottom sheet mobile

#### Dicas Stitch
- Mapa deve ocupar tela cheia (sem scroll)
- Pin do visitante com avatar
- Animação suave ao atualizar posição
- Trajeto com gradiente de cor (mais antigo = mais fade)

---

### Tela 11: Tela de Alertas

**Objetivo:** Mostrar ocorrências de segurança.

#### Layout
- Header com contagem de alertas
- Filtros por tipo (chips horizontais)
- Lista de alertas (cards)
- Modal de detalhes

#### Tipos de Alertas
| Tipo | Ícone | Cor | Descrição |
|------|-------|-----|-----------|
| `area_restrita` | MapPin | red | Visitante em área restrita |
| `tempo_excedido` | Clock | orange | Tempo de visita excedido |
| `perda_sinal` | WifiOff | red | Perda de sinal GPS |
| `bateria_baixa` | BatteryLow | yellow | Bateria dispositivo baixa |
| `dispositivo_fora` | SmartphoneOff | gray | Dispositivo fora de uso |

#### Campos do Card de Alerta
- Ícone do tipo
- Descrição breve
- Visitante involucrado
- Local/hora do evento
- Status (ativo/resolvido)

#### Ações
- Listar alertas
- Filtrar por tipo
- Marcar como resolvido
- Visualizar detalhes
- Acionar resposta

#### Componentes Recomendados (shadcn/ui)
- `Card` - para cards de alerta
- `Badge` - para tipo e status
- `Chip` - para filtros
- `Dialog` - para detalhes
- `Button` - para ações

#### Dicas Stitch
- Badge vermelho com contador no header
- Filtros como chips selecionáveis
- Prioridade visual: vermelho > laranja > amarelo
- Ação rápida: deslizar para resolver

---

## Categoria: Suporte

---

### Tela 12: Tela de Auditoria

**Objetivo:** Consultar histórico de ações no sistema.

#### Layout
- Filtros avançados no topo
- Tabela de eventos
- Linha do tempo expandível
- Exportar para CSV/PDF

#### Filtros
| Filtro | Tipo |
|--------|------|
| Período | Date range picker |
| Usuário | Select (autocomplete) |
| Condomínio | Select |
| Tipo de evento | Select |
| Ação | Select |

#### Colunas da Tabela
| Coluna | Descrição |
|--------|-----------|
| Data/Hora | Timestamp do evento |
| Usuário | Quem realizou |
| Ação | O que foi feito |
| Módulo | Onde ocorreu |
| Detalhes | IP/dispositivo |

#### Tipos de Evento
- Login/Logout
- CRUD de entidades
- check-in/Checkout
- Alertas Triggerados
- Alterações de status

#### Componentes Recomendados (shadcn/ui)
- `Table` - para listagem
- `Select` - para filtros
- `DatePicker` - para período
- `Card` - para detalhes expandidos

#### Dicas Stitch
- Timeline visual para eventos relacionados
- Cores por tipo de ação (criar=green, editar=blue, excluir=red)
- Highlighting para eventos importantes

---

### Tela 13: Perfil do Usuário

**Objetivo:** Permitir gestão de dados pessoais e credenciais.

#### Layout
- Avatar grande com upload
- Formulário de dados pessoais
- Seção de segurança (senha)
- Card de permissões
- Histórico de acessos

#### Campos
| Campo | Tipo |
|-------|------|
| Nome | Input (texto) |
| E-mail | Input (email) |
| Telefone | Input (tel) |
| Cargo | Input (texto) |
| Foto | Upload |

#### Seção Segurança
- Alterar senha atual
- Nova senha
- Confirmar nova senha
- 2FA (futuro)

#### Card de Permissões
- Lista de módulos acessíveis
- Badge de tipo de acesso
- last login info

#### Componentes Recomendados (shadcn/ui)
- `Avatar` - para foto
- `Input` - para campos
- `Card` - para seções
- `Button` - para ações
- `Switch` - para 2FA

#### Dicas Stitch
- Preview da foto antes de upload
- Validação de senha forte
- Link para "Esqueci minha senha"

---

## Resumo de Componentes shadcn/ui por Tela

| Tela | Componentes Principais |
|------|----------------------|
| Login | Input, Button, Card |
| Dashboard | Card, Badge, Avatar, Progress |
| Condomínios | Table, Dialog, Switch, Form |
| Blocos/Unidades | Tabs, Select, Sheet |
| Moradores | Card, Avatar, Select, Dialog |
| Visitantes | Card, Avatar, ScrollArea |
| Dispositivos GPS | Card, Progress, Badge |
| Autorização | Tabs, Select, Calendar, Badge |
| Portaria | Stepper, Card, Alert, Button |
| Rastreamento | Sheet, Card, Badge |
| Alertas | Card, Badge, Chip, Dialog |
| Auditoria | Table, Select, DatePicker |
| Perfil | Avatar, Input, Card, Switch |

---

## Checklist de Qualidade Stitch

- [ ] Todos os campos têm labels
- [ ] Todos os botões têm texto
- [ ] Estados (default, hover, active, disabled) definidos
- [ ] Validações visuais (erro, sucesso)
- [ ] Responsivo (mobile-first para Portaria)
- [ ] Acessibilidade (alt em imagens, aria labels)
- [ ] Ícones consistentes (Lucide)
- [ ] Cores seguem o design system
- [ ] Espaçamentos consistentes
- [ ] Touch targets mínimo 44x44px

---

## Próximos Passos

Após criar as telas no Stitch:

1. **Exportar designs** via MCP Stitch
2. **Converter para React** usando skill `react-components`
3. **Implementar com shadcn/ui** seguindo este guia
4. **Testar fluxos** de usuário completos

---

*Documento gerado em: 14/04/2026*