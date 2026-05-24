"use client";

import { useState } from "react";
import {
  HelpCircle,
  Activity,
  Wrench,
  Phone,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  FileText,
  X,
  MessageSquare,
  LifeBuoy,
  Send,
  Server,
  Wifi,
  Database,
  Camera,
  AlertTriangle,
} from "lucide-react";

// Tipo para os tickets
interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  description: string;
  status: "open" | "in_progress" | "resolved";
  protocol: string;
  timestamp: string;
  eta: string;
}

// Configuração estética para prioridades em pt-BR
const priorityConfig = {
  low: { label: "Baixa", color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
  medium: { label: "Média", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  high: { label: "Alta", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

// Configuração estética para status de chamados em pt-BR
const statusConfig = {
  open: { label: "Aguardando Triagem", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", dot: "bg-sky-500" },
  in_progress: { label: "Técnico a Caminho", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-500" },
  resolved: { label: "Encerrado", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
};

export default function SuportePage() {
  // Diagnósticos de conexões da guarita
  const [diagnostics, setDiagnostics] = useState([
    { name: "Servidores Nuvem (Cloud OS)", status: "online", details: "Latência: 24ms (Excelente)", icon: Server },
    { name: "Rede LoraWAN (Chaveiros GPS)", status: "online", details: "Antena ativa • 98% sinal", icon: Wifi },
    { name: "Serviço CFTV (Câmeras IP)", status: "warning", details: "Instável • 1 câmera offline (NC-402)", icon: Camera },
    { name: "Banco de Dados Local", status: "online", details: "Conectado • Replicação OK", icon: Database },
  ]);

  // Lista de tíquetes abertos na sessão
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "tk1",
      subject: "Chaveiro OBX-1120 com bateria viciada",
      category: "Hardware GPS",
      priority: "medium",
      description: "Chaveiro GPS descarrega completamente em menos de 1 hora de uso ativo na portaria.",
      status: "in_progress",
      protocol: "TK-1082",
      timestamp: "Hoje, 09:30 AM",
      eta: "Técnico estimado às 17:30",
    },
  ]);

  // Estado de carregamento do auto-teste
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // FAQ colapsável (index ativo)
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Estado do Toast de Notificação
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Executa auto-teste de hardware e conexões prediais
  const handleRunSelfTest = () => {
    setIsScanning(true);
    setScanProgress(10);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            // Atualiza os pings ligeiramente no mock para reatividade
            setDiagnostics([
              { name: "Servidores Nuvem (Cloud OS)", status: "online", details: `Latência: ${Math.floor(Math.random() * 15) + 12}ms (Excelente)`, icon: Server },
              { name: "Rede LoraWAN (Chaveiros GPS)", status: "online", details: "Antena ativa • 99% sinal", icon: Wifi },
              { name: "Serviço CFTV (Câmeras IP)", status: "online", details: "Conectado • Todas as câmeras online", icon: Camera },
              { name: "Banco de Dados Local", status: "online", details: "Conectado • Replicação OK", icon: Database },
            ]);
            showToast("Auto-teste concluído! CFTV NC-402 reconectada com sucesso.");
          }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // Registra novo chamado técnico
  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const subject = (data.get("subject") as string).trim();
    const category = data.get("category") as string;
    const priority = data.get("priority") as "low" | "medium" | "high";
    const description = (data.get("description") as string).trim();

    if (!subject || !description) {
      showToast("Assunto e descrição são obrigatórios!");
      return;
    }

    const randomProtocol = `TK-${Math.floor(Math.random() * 9000) + 1000}`;
    const nowTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const newTicket: SupportTicket = {
      id: `tk_${Date.now()}`,
      subject,
      category,
      priority,
      description,
      status: "open",
      protocol: randomProtocol,
      timestamp: `Hoje, ${nowTime}`,
      eta: priority === "high" ? "15 minutos" : priority === "medium" ? "1 hora" : "4 horas",
    };

    setTickets([newTicket, ...tickets]);
    showToast(`Chamado ${randomProtocol} aberto com sucesso!`);
    (e.currentTarget as HTMLFormElement).reset();
  };

  // FAQs estruturados para portaria
  const faqs = [
    {
      q: "Como re-sincronizar um chaveiro GPS que ficou offline?",
      a: "Coloque o chaveiro no rack de carga física da guarita por 5 segundos. O LED azul piscará indicando reinicialização de rádio. Depois, acesse o menu 'Dispositivos' e clique em 'Sincronizar Satélite' para re-sinalizar o sinal GPS.",
    },
    {
      q: "Invasão de perímetro confirmada por sensor. Como proceder?",
      a: "Acione o botão vermelho 'SOS Alerta' na barra de detalhes da ocorrência na tela de Rastreamento. Isso disparará um sinal de sirene na guarita e acionará a patrulha física de moto do condomínio. Caso esteja sob ameaça na guarita, digite o PIN de coação configurado no seu Perfil.",
    },
    {
      q: "O leitor de tags ou chaveiros da portaria de entrada não responde.",
      a: "Vá em Configurações, desative o toggle 'Rastreamento GPS' por 10 segundos e reative para limpar a fila de eventos do gateway. Caso persista, execute o Auto-teste de Guarita no painel ao lado para testar a comunicação.",
    },
    {
      q: "Como cadastrar encomendas se os escaninhos inteligentes estiverem cheios?",
      a: "Cadastre a encomenda na tela de Portaria normalmente. No campo de observações, especifique 'Recebimento guarita física - Prateleira B' para triagem manual de retirada do morador.",
    },
  ];

  return (
    <div className="p-8 min-h-full text-foreground relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl border border-border bg-card/90 backdrop-blur text-foreground flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
          Suporte Técnico &amp; Diagnóstico • Concierge OS
        </p>
        <h1
          className="text-4xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Central de Suporte
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifique a integridade da infraestrutura da guarita, acesse guias rápidos de contingência ou abra chamados de suporte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Diagnósticos e Chamados */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Painel de Diagnóstico do Sistema */}
          <div
            className="rounded-2xl border border-border p-5 shadow-lg bg-card relative overflow-hidden text-card-foreground"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-primary" />
                <h2 className="text-sm font-bold text-foreground">Diagnóstico de Conexão da Guarita</h2>
              </div>
              
              {!isScanning && (
                <button
                  onClick={handleRunSelfTest}
                  className="flex items-center gap-1 text-[10px] font-bold text-foreground hover:bg-muted/85 transition-all uppercase tracking-wider bg-muted border border-border px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <RefreshCw size={12} />
                  Auto-teste
                </button>
              )}
            </div>

            {/* Progresso de varredura do auto-teste */}
            {isScanning && (
              <div className="mb-4 bg-muted/50 border border-border p-4 rounded-xl">
                <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-foreground">
                  <span>VARRENDO DISPOSITIVOS E REDES...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Listagem de Diagnósticos */}
            <div className="space-y-3">
              {diagnostics.map((d) => {
                const Icon = d.icon;
                const isWarning = d.status === "warning";
                
                return (
                  <div
                    key={d.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{d.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{d.details}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full border uppercase ${
                        isWarning
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {isWarning ? "Instável" : "Online"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulário de Abertura de Chamado */}
          <div
            className="rounded-2xl border border-border p-6 shadow-lg bg-card text-card-foreground"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Wrench size={15} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Abrir Chamado com Suporte Obsidian</h2>
            </div>

            <form onSubmit={handleOpenTicket} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Assunto da Ocorrência *
                </label>
                <input
                  name="subject"
                  required
                  placeholder="Ex: Câmera CFTV Guarita com falha de vídeo"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="Hardware GPS">Hardware GPS / Tags</option>
                    <option value="Câmeras/CFTV">Câmeras / CFTV</option>
                    <option value="Dúvida de Sistema">Dúvida de Sistema</option>
                    <option value="Rede/Internet">Rede / Conectividade</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Urgência Operacional
                  </label>
                  <select
                    name="priority"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="low">Baixa (Problemas menores)</option>
                    <option value="medium">Média (Pane parcial)</option>
                    <option value="high">Alta (Interrupção de controle)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Descrição Detalhada do Problema *
                </label>
                <textarea
                  name="description"
                  required
                  placeholder="Relate os detalhes técnicos ou erros exibidos na tela para ajudar a equipe técnica a adiantar o diagnóstico..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 cursor-pointer"
              >
                <Send size={12} />
                Abrir Chamado Técnico
              </button>
            </form>
          </div>
        </div>

        {/* COLUNA DIREITA: Tíquetes ativos, FAQ e Contato */}
        <div className="space-y-4">
          
          {/* Contatos Emergenciais do Integrador */}
          <div
            className="rounded-2xl border border-border p-5 shadow-lg bg-card text-card-foreground"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Contatos de Suporte Técnico
            </p>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone size={13} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Central Obsidian Corp (Suporte 24h)</p>
                  <p className="text-muted-foreground mt-0.5">0800 400 9800 (Ligação gratuita)</p>
                  <p className="text-[10px] text-muted-foreground/60 font-semibold mt-0.5">Suporte remoto imediato para software.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <Wrench size={13} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Integrador Físico (Segurança Predial)</p>
                  <p className="text-muted-foreground mt-0.5">(11) 3300-8800 • Ramal 42</p>
                  <p className="text-[10px] text-muted-foreground/60 font-semibold mt-0.5">Visitas técnicas locais em hardware/gateways.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chamados Técnicos Ativos */}
          <div
            className="rounded-2xl border border-border p-5 shadow-lg bg-card text-card-foreground"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Chamados em Andamento
            </p>

            <div className="space-y-3">
              {tickets.map((t) => {
                const pc = priorityConfig[t.priority];
                const sc = statusConfig[t.status];
                
                return (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-foreground truncate">{t.subject}</p>
                        <span className="text-[9px] font-mono text-muted-foreground">{t.protocol}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] font-semibold text-muted-foreground">
                        <span className={`px-1.5 py-0.5 rounded border ${pc.bg} ${pc.color} ${pc.border}`}>
                          Urgência: {pc.label}
                        </span>
                        <span>•</span>
                        <span>Cat: {t.category}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`font-bold ${sc.color}`}>{sc.label}</span>
                      </div>
                      <span className="text-muted-foreground font-medium">SLA: {t.eta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Colapsável */}
          <div
            className="rounded-2xl border border-border p-5 shadow-lg bg-card text-card-foreground"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Perguntas Frequentes (FAQ)
            </p>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpened = activeFaq === idx;
                
                return (
                  <div
                    key={idx}
                    className="border border-border/50 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpened ? null : idx)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-muted/20 hover:bg-muted/45 text-left transition-all cursor-pointer"
                    >
                      <span className="text-xs font-bold text-foreground leading-snug">{faq.q}</span>
                      <ChevronRight
                        size={14}
                        className={`text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                          isOpened ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    
                    {isOpened && (
                      <div className="p-3.5 bg-muted/10 border-t border-border/50">
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
