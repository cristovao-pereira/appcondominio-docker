"use client";

import { useState } from "react";
import { 
  UserPlus, 
  Calendar, 
  AlertTriangle, 
  Radio, 
  Download, 
  MapPin, 
  Package, 
  X, 
  Check, 
  Eye, 
  Clock, 
  Plus,
  ShieldCheck,
  Activity,
  FileText
} from "lucide-react";
import { mockDashboardStats, mockRecentMovements } from "@/data/mockData";

// Tipagem local para os movimentos do feed
interface DashboardMovement {
  id: string;
  name: string;
  type: string;
  badge: string;
  destination: string;
  time: string;
  status: "entry" | "exit";
  initials: string;
  document?: string;
  hostResident?: string;
  visitCount?: number;
  lastVisit?: string;
  deviceId?: string;
}

export default function DashboardPage() {
  // Estado local das movimentações recentes do feed
  const [movements, setMovements] = useState<DashboardMovement[]>([
    { id: "1", name: "Julianne DeSilva", type: "visitor", badge: "Visitante • Convite #8540", destination: "Unidade 1402 (Sky Loft)", time: "19:42 PM", status: "entry", initials: "JD", document: "RG 44.512.923-X", hostResident: "Julian Thorne", visitCount: 3, lastVisit: "Ontem, 18:30" },
    { id: "2", name: "Dr. Elias Vance", type: "resident", badge: "Morador • Unidade 0402", destination: "Portaria Principal", time: "19:28 PM", status: "exit", initials: "EV", document: "CPF 112.902.392-11", hostResident: "Residente Principal", visitCount: 120, lastVisit: "Hoje, 07:15" },
    { id: "3", name: "Seamless Delivery", type: "delivery", badge: "Serviço • Courier #99", destination: "Sala de Correspondência", time: "19:15 PM", status: "entry", initials: "SD", document: "Passaporte EU-98213", hostResident: "Administração", visitCount: 14, lastVisit: "Anteontem, 14:00" },
    { id: "4", name: "Sarah Jenkins", type: "visitor", badge: "Convidada • Unidade 2201", destination: "Cobertura / Lounge", time: "18:55 PM", status: "entry", initials: "SJ", document: "RG 22.019.222-1", hostResident: "Sarah Jenkins", visitCount: 2, lastVisit: "Semana passada" },
  ]);

  // Estados dos Modais de Cadastro Rápido
  const [isNewVisitorOpen, setIsNewVisitorOpen] = useState(false);
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  const [isNewAuthOpen, setIsNewAuthOpen] = useState(false);

  // Estado do Modal de Detalhes
  const [selectedMovement, setSelectedMovement] = useState<DashboardMovement | null>(null);

  // Estados de formulário para novos cadastros
  const [visitorForm, setVisitorForm] = useState({ name: "", document: "", unit: "", type: "visitor" });
  const [packageForm, setPackageForm] = useState({ unit: "", recipient: "", courier: "", type: "Caixa" });
  const [authForm, setAuthForm] = useState({ name: "", unit: "", reason: "", date: "" });

  // Contadores globais reativos baseados nos estados
  const activeVisitorsCount = movements.filter((m) => m.status === "entry" && m.type !== "resident").length;
  const [stats, setStats] = useState({
    activeVisitors: 14,
    pendingInvites: 8,
    activeAlerts: 2,
    gpsDevices: 42
  });

  // Ações de alteração de estado reativo
  const handleRegisterExit = (id: string) => {
    setMovements((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, status: "exit", time: "Agora" };
        }
        return m;
      })
    );
    // Decrementa o contador de visitantes ativos simulado
    setStats((prev) => ({
      ...prev,
      activeVisitors: Math.max(0, prev.activeVisitors - 1)
    }));
  };

  const handleSaveVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.name || !visitorForm.unit) return;

    const newMov: DashboardMovement = {
      id: String(Date.now()),
      name: visitorForm.name,
      type: visitorForm.type,
      badge: `${visitorForm.type === "visitor" ? "Visitante" : visitorForm.type === "delivery" ? "Serviço" : "Manutenção"} • Unidade ${visitorForm.unit}`,
      destination: `Unidade ${visitorForm.unit}`,
      time: "Agora",
      status: "entry",
      initials: visitorForm.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      document: visitorForm.document || "Não Informado",
      hostResident: `Morador Apto ${visitorForm.unit}`,
      visitCount: 1,
      lastVisit: "Primeira visita registrada"
    };

    setMovements((prev) => [newMov, ...prev]);
    setStats((prev) => ({
      ...prev,
      activeVisitors: prev.activeVisitors + 1
    }));

    // Resetar form e fechar modal
    setVisitorForm({ name: "", document: "", unit: "", type: "visitor" });
    setIsNewVisitorOpen(false);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewPackageOpen(false);
    setPackageForm({ unit: "", recipient: "", courier: "", type: "Caixa" });
    alert("Encomenda registrada com sucesso e guardada no escaninho!");
  };

  const handleSaveAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.name || !authForm.unit) return;

    setStats((prev) => ({
      ...prev,
      pendingInvites: prev.pendingInvites + 1
    }));
    
    setIsNewAuthOpen(false);
    setAuthForm({ name: "", unit: "", reason: "", date: "" });
    alert("Nova pré-autorização gerada com sucesso!");
  };

  return (
    <div className="p-8 min-h-full space-y-8 text-foreground transition-colors duration-300">
      
      {/* ─── HERO DE SAUDAÇÃO E STATUS ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            Visão Geral das Operações • The Obsidian Tower
          </p>
          <h1
            className="text-3xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Olá, Operador Marcus
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            O fluxo do condomínio está estável. Existem <span className="text-primary font-bold">{activeVisitorsCount}</span> visitantes ativos registrados no seu painel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
          </span>
          <span className="text-xs text-muted-foreground font-semibold">Portaria Conectada e Operando</span>
        </div>
      </div>

      {/* ─── SEÇÃO DE AÇÕES RÁPIDAS ───────────────────────────────────────────── */}
      <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-5">
        <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
          <Activity size={12} className="text-primary" /> Ações Rápidas de Portaria
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setIsNewVisitorOpen(true)}
            className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Novo Visitante</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Cadastrar e liberar acesso</p>
            </div>
          </button>

          <button
            onClick={() => setIsNewPackageOpen(true)}
            className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-200 group-hover:scale-105 transition-transform flex-shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Nova Encomenda</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Logar chegada de pacotes</p>
            </div>
          </button>

          <button
            onClick={() => setIsNewAuthOpen(true)}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-200 group-hover:scale-105 transition-transform flex-shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Nova Autorização</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Agendar convites de moradores</p>
            </div>
          </button>
        </div>
      </div>

      {/* ─── BENTO DE ESTATÍSTICAS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Visitantes Ativos", value: stats.activeVisitors, trend: "Pessoas sem cadastro permanente", color: "text-primary", bg: "bg-primary/10", icon: UserPlus },
          { label: "Convites Pendentes", value: stats.pendingInvites, trend: "Pré-autorizações agendadas", color: "text-blue-500 dark:text-blue-300", bg: "bg-blue-500/10", icon: Calendar },
          { label: "Alertas Ativos", value: stats.activeAlerts, trend: "Verificar mapa de segurança", color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle, alert: true },
          { label: "Dispositivos GPS", value: stats.gpsDevices, trend: "Chaveiros rastreadores livres", color: "text-amber-500 dark:text-amber-300", bg: "bg-amber-500/10", icon: Radio },
        ].map((s) => {
          const IconComponent = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl p-5 border border-border bg-card transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  {s.label}
                </p>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <IconComponent size={15} className={s.color} />
                </div>
              </div>
              <p
                className="text-3xl font-extrabold text-foreground mb-1"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {s.value}
              </p>
              <p className={`text-[10px] ${s.alert ? "text-destructive font-semibold animate-pulse" : "text-muted-foreground"}`}>
                {s.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* ─── GRÁFICOS PREMIUM NATIVOS (SVG) ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico Donut: Ocupação do Condomínio */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Distribuição de Presença</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Pessoas presentes dentro do complexo predial agora.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Donut SVG */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  className="stroke-secondary"
                  strokeWidth="3.2"
                />
                {/* Circle Segment 1: Moradores (76%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  className="stroke-primary transition-all duration-1000 ease-out"
                  strokeWidth="3.2"
                  strokeDasharray="76 24"
                  strokeDashoffset="100"
                />
                {/* Circle Segment 2: Visitantes (24%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  className="stroke-blue-300 dark:stroke-primary-foreground/30 transition-all duration-1000 ease-out"
                  strokeWidth="3.2"
                  strokeDasharray="24 76"
                  strokeDashoffset="24"
                />
              </svg>
              {/* Text Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-foreground">148</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
              </div>
            </div>
            
            {/* Legendas */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Moradores (76%)</p>
                  <p className="text-[10px] text-muted-foreground">112 Ativos no complexo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-blue-300 dark:bg-primary-foreground/30" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Visitantes (24%)</p>
                  <p className="text-[10px] text-muted-foreground">36 Convidados/Serviços</p>
                </div>
              </div>
              <div className="border-t border-border/50 pt-2 flex justify-between gap-6 text-[10px] text-muted-foreground">
                <span>Último censo há 5m</span>
                <span className="text-[#10b981] font-bold">Capacidade 31%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras: Fluxo de Acesso por Hora */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Fluxo de Tráfego de Entrada</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Volume de checagem de portaria nas últimas horas.</p>
          </div>
          <div className="flex items-end justify-between gap-2 pt-6 h-32 relative">
            {/* Linhas de Grade de Fundo */}
            <div className="absolute inset-x-0 top-0 border-t border-border/10 text-[9px] text-muted-foreground/40 text-right pr-1">Alta</div>
            <div className="absolute inset-x-0 top-1/2 border-t border-border/10 text-[9px] text-muted-foreground/40 text-right pr-1">Média</div>

            {/* Barra 08h */}
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full max-w-[28px] bg-gradient-to-t from-primary/30 to-primary rounded-t-md h-12 group-hover:scale-y-105 transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border text-[9px] text-foreground px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">12</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">08:00</span>
            </div>

            {/* Barra 12h */}
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full max-w-[28px] bg-gradient-to-t from-primary/30 to-primary rounded-t-md h-24 group-hover:scale-y-105 transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border text-[9px] text-foreground px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">26</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">12:00</span>
            </div>

            {/* Barra 16h */}
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full max-w-[28px] bg-gradient-to-t from-blue-300/35 to-blue-500 rounded-t-md h-28 group-hover:scale-y-105 transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border text-[9px] text-foreground px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">34</span>
              </div>
              <span className="text-[10px] text-primary font-bold font-mono">16:00</span>
            </div>

            {/* Barra 20h */}
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full max-w-[28px] bg-gradient-to-t from-primary/30 to-primary rounded-t-md h-16 group-hover:scale-y-105 transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border text-[9px] text-foreground px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">18</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">20:00</span>
            </div>

            {/* Barra 24h */}
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full max-w-[28px] bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-md h-8 group-hover:scale-y-105 transition-all duration-300 relative">
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border text-[9px] text-foreground px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">6</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">24:00</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── DOIS PAINÉIS DE CONTEÚDO (FEED E BARRA LATERAL) ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Esquerda: Feed Cronológico de Movimentações */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div>
              <h3 className="font-bold text-sm text-foreground">Linha do Tempo de Acessos</h3>
              <p className="text-[10.5px] text-muted-foreground mt-0.5">Últimos registros de entradas e saídas na guarita.</p>
            </div>
            <button className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-foreground transition-colors uppercase tracking-wider">
              <Download size={11} />
              <span>Exportar Logs</span>
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
            {movements.map((m) => (
              <div
                key={m.id}
                className="relative pl-6 border-l-2 border-border/50 last:border-transparent group"
              >
                {/* Indicador de Status na Linha do Tempo */}
                <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ${
                  m.status === "entry" 
                    ? "bg-primary border-background" 
                    : "bg-muted-foreground border-background"
                }`} />

                {/* Card de Informação */}
                <div className="bg-background/40 hover:bg-accent border border-border/40 rounded-xl p-3.5 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                      {m.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-foreground">{m.name}</span>
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
                          m.status === "entry" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {m.status === "entry" ? "Entrada" : "Saída"}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.badge}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] text-foreground">{m.destination}</p>
                      <p className="text-[9px] text-muted-foreground font-mono mt-0.5 flex items-center justify-end gap-1">
                        <Clock size={9} /> {m.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedMovement(m)}
                        className="p-1.5 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground border border-border/40 transition-all"
                        title="Ver Detalhes do Acesso"
                      >
                        <Eye size={12} />
                      </button>
                      {m.status === "entry" && (
                        <button
                          onClick={() => handleRegisterExit(m.id)}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-200 hover:text-white dark:hover:text-black border border-emerald-500/20 hover:border-transparent text-[10px] px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1"
                          title="Registrar Saída"
                        >
                          <Check size={11} />
                          <span className="hidden sm:inline">Dar Saída</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direita: Rastreamento Ativo e Alertas Secundários */}
        <div className="space-y-4">
          
          {/* Tracking do Rastreador Predial */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                  Monitoramento de Dispositivo
                </p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Tag GPS: OBX-9942</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[10px] text-[#10b981] font-bold">Ativo</span>
              </div>
            </div>
            
            <div className="aspect-video relative overflow-hidden bg-muted/40 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4d8eff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-[11px] text-foreground font-semibold">
                      Doca de Carga Norte
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono">Último sinal há 12s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas de Serviços Rápidos */}
          <div className="bg-card border border-border p-5 rounded-2xl transition-colors duration-300">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Alertas de Serviços Recebidos
            </p>
            <div className="space-y-4">
              {[
                { icon: "📦", title: "Amazon Prime - Portaria", desc: "Entrega de volume volumoso no Apto 402-A.", time: "05 min atrás", bg: "bg-amber-500/10" },
                { icon: "🚗", title: "Uber Solicitado - Valet", desc: "Visitante da unidade 1204 aguarda veículo.", time: "12 min atrás", bg: "bg-primary/10" },
                { icon: "🛠️", title: "Manutenção Concluída", desc: "Varredura do portão da garagem finalizada.", time: "38 min atrás", bg: "bg-secondary/20" },
              ].map((a) => (
                <div key={a.title} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0 text-base`}>
                    {a.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-semibold text-foreground truncate">{a.title}</p>
                    <p className="text-[10.5px] text-muted-foreground">{a.desc}</p>
                  </div>
                  <span className="text-[8.5px] font-bold text-muted-foreground/60 uppercase whitespace-nowrap pt-1">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CADASTRAR NOVO VISITANTE                                         */}
      {/* ========================================================================= */}
      {isNewVisitorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground">
                <UserPlus size={18} className="text-primary" />
                <h3 className="font-bold text-sm">Registrar Acesso de Visitante</h3>
              </div>
              <button
                onClick={() => setIsNewVisitorOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveVisitor} className="p-4 space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do visitante ou prestador..."
                  value={visitorForm.name}
                  onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })}
                  className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Documento (RG/CPF)
                  </label>
                  <input
                    type="text"
                    placeholder="Documento de id..."
                    value={visitorForm.document}
                    onChange={(e) => setVisitorForm({ ...visitorForm, document: e.target.value })}
                    className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Unidade Destino
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 402-A"
                    value={visitorForm.unit}
                    onChange={(e) => setVisitorForm({ ...visitorForm, unit: e.target.value })}
                    className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Tipo de Visita
                </label>
                <select
                  value={visitorForm.type}
                  onChange={(e) => setVisitorForm({ ...visitorForm, type: e.target.value })}
                  className="w-full bg-card border border-border text-xs text-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors duration-200"
                >
                  <option value="visitor">Convidado Social</option>
                  <option value="delivery">Entrega / Courier</option>
                  <option value="maintenance">Manutenção Predial</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewVisitorOpen(false)}
                  className="w-1/2 bg-transparent hover:bg-muted text-muted-foreground py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-primary hover:bg-primary-foreground text-white dark:text-black py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent"
                >
                  Autorizar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REGISTRAR NOVA ENCOMENDA                                         */}
      {/* ========================================================================= */}
      {isNewPackageOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-[#dae2fd]">
                <Package size={18} className="text-amber-500" />
                <h3 className="font-bold text-sm text-foreground">Logar Entrada de Encomenda</h3>
              </div>
              <button
                onClick={() => setIsNewPackageOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSavePackage} className="p-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Unidade Destino
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 812"
                    value={packageForm.unit}
                    onChange={(e) => setPackageForm({ ...packageForm, unit: e.target.value })}
                    className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Destinatário
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do morador..."
                    value={packageForm.recipient}
                    onChange={(e) => setPackageForm({ ...packageForm, recipient: e.target.value })}
                    className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Empresa Transportadora
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: FedEx, DHL, Mercado Livre..."
                  value={packageForm.courier}
                  onChange={(e) => setPackageForm({ ...packageForm, courier: e.target.value })}
                  className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Tipo de Embrulho
                </label>
                <select
                  value={packageForm.type}
                  onChange={(e) => setPackageForm({ ...packageForm, type: e.target.value })}
                  className="w-full bg-card border border-border text-xs text-foreground rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="Caixa">Caixa / Fardo</option>
                  <option value="Envelope">Envelope / Papel</option>
                  <option value="Sacola">Sacola de Mercado</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPackageOpen(false)}
                  className="w-1/2 bg-transparent hover:bg-muted text-muted-foreground py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white dark:text-black py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent"
                >
                  Registrar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: GERAR PRÉ-AUTORIZAÇÃO                                            */}
      {/* ========================================================================= */}
      {isNewAuthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar size={18} className="text-emerald-500" />
                <h3 className="font-bold text-sm">Criar Pré-Autorização Rápida</h3>
              </div>
              <button
                onClick={() => setIsNewAuthOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAuth} className="p-4 space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Nome do Convidado / Prestador
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome de quem irá acessar..."
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Unidade Solicitante
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 1204"
                    value={authForm.unit}
                    onChange={(e) => setAuthForm({ ...authForm, unit: e.target.value })}
                    className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Data do Acesso
                  </label>
                  <input
                    type="text"
                    placeholder="Hoje, Amanhã, 28/05..."
                    value={authForm.date}
                    onChange={(e) => setAuthForm({ ...authForm, date: e.target.value })}
                    className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                  Motivo da Autorização
                </label>
                <input
                  type="text"
                  placeholder="ex: Visita social, Serviço de encanamento..."
                  value={authForm.reason}
                  onChange={(e) => setAuthForm({ ...authForm, reason: e.target.value })}
                  className="w-full bg-card border border-border text-xs text-foreground placeholder-muted-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAuthOpen(false)}
                  className="w-1/2 bg-transparent hover:bg-muted text-muted-foreground py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent"
                >
                  Criar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DETALHES DE AUDITORIA DO VISITANTE                                */}
      {/* ========================================================================= */}
      {selectedMovement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/20">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck size={18} className="text-primary" />
                <h3 className="font-bold text-sm">Auditoria Técnica de Acesso</h3>
              </div>
              <button
                onClick={() => setSelectedMovement(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Header de Perfil */}
              <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                  {selectedMovement.initials}
                </div>
                <div>
                  <h4 className="font-black text-sm text-foreground">{selectedMovement.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedMovement.badge}</p>
                </div>
              </div>

              {/* Informações da Ficha */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted/50 p-2.5 rounded-xl border border-border/40">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Identificação</p>
                  <p className="text-foreground font-semibold">{selectedMovement.document || "Não Informado"}</p>
                </div>
                <div className="bg-muted/50 p-2.5 rounded-xl border border-border/40">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Autorizado Por</p>
                  <p className="text-foreground font-semibold">{selectedMovement.hostResident || "Portaria"}</p>
                </div>
                <div className="bg-muted/50 p-2.5 rounded-xl border border-border/40">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Total de Acessos</p>
                  <p className="text-foreground font-semibold">{selectedMovement.visitCount ?? 1} visitas</p>
                </div>
                <div className="bg-muted/50 p-2.5 rounded-xl border border-border/40">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Última Entrada</p>
                  <p className="text-foreground font-semibold">{selectedMovement.lastVisit || "N/A"}</p>
                </div>
              </div>

              {/* Histórico e Status Técnico */}
              <div className="bg-muted/50 border border-border/40 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground font-bold">Status do Acesso:</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                    selectedMovement.status === "entry" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                  }`}>
                    {selectedMovement.status === "entry" ? "Dentro do Condomínio" : "Saída Confirmada"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground font-bold">Horário Último Registro:</span>
                  <span className="text-foreground font-mono">{selectedMovement.time}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground font-bold">Rastreador GPS Vinculado:</span>
                  <span className="text-primary font-mono">{selectedMovement.deviceId || "Sem dispositivo ativado"}</span>
                </div>
              </div>

              {/* Ações Internas do Modal */}
              <div className="flex gap-2 pt-2 border-t border-border/30">
                {selectedMovement.status === "entry" && (
                  <button
                    onClick={() => {
                      handleRegisterExit(selectedMovement.id);
                      setSelectedMovement(null);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Registrar Saída do Condomínio</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedMovement(null)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedMovement.status === "entry" ? "w-1/3 bg-muted hover:bg-accent text-muted-foreground" : "w-full bg-muted hover:bg-accent text-muted-foreground"
                  }`}
                >
                  Fechar Ficha
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
