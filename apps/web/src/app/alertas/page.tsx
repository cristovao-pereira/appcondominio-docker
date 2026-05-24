"use client";

import { useState, useEffect } from "react";
import { mockAlerts, mockAuditEvents } from "@/data/mockData";
import type { SecurityAlert, AlertSeverity, AuditEvent } from "@/types";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  XCircle,
  CheckCircle2,
  Clock,
  Bell,
  ChevronRight,
  Plus,
  User,
  MessageSquare,
  Activity,
  UserPlus,
  Play,
  X,
  Camera,
  CornerDownRight,
  RotateCcw,
} from "lucide-react";

// Configuração de cores e ícones estéticos por severidade em pt-BR
const severityConfig: Record<AlertSeverity | "resolved", { label: string; color: string; bg: string; border: string; icon: React.ElementType; glow: string }> = {
  critical: {
    label: "Crítico",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20 dark:border-red-500/35",
    icon: XCircle,
    glow: "shadow-red-500/10",
  },
  high: {
    label: "Alto",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20 dark:border-orange-500/30",
    icon: AlertTriangle,
    glow: "shadow-orange-500/10",
  },
  warning: {
    label: "Aviso",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20 dark:border-amber-500/30",
    icon: AlertTriangle,
    glow: "shadow-amber-500/10",
  },
  medium: {
    label: "Médio",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20 dark:border-blue-500/30",
    icon: ShieldAlert,
    glow: "shadow-blue-500/10",
  },
  low: {
    label: "Baixo",
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
    icon: Info,
    glow: "shadow-muted/5",
  },
  info: {
    label: "Info",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20 dark:border-blue-500/30",
    icon: Info,
    glow: "shadow-blue-500/5",
  },
  resolved: {
    label: "Resolvido",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20 dark:border-emerald-500/35",
    icon: CheckCircle2,
    glow: "shadow-emerald-500/5",
  },
};

// Lista de operadores disponíveis para designação
const AVAILABLE_OPERATORS = [
  "Não Designado",
  "Marcus Caldwell (Guarita A)",
  "Lydia Moon (CVD)",
  "Patrulha Portaria Sul (M-01)",
  "Patrulha Garagem (M-02)",
  "Equipe de Apoio Predial (A-01)",
];

export default function AlertasPage() {
  // Estado local dos alertas (sincronizado com o mock global)
  const [alerts, setAlerts] = useState<SecurityAlert[]>(() => [...mockAlerts]);
  
  // Alerta selecionado ativo para visualização detalhada
  const [selected, setSelected] = useState<SecurityAlert | null>(null);
  
  // Seletor de filtros
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low" | "resolved">("all");
  
  // Modais de Simulação e Resolução
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  
  // Nota de acompanhamento de timeline e nota de resolução
  const [timelineNote, setTimelineNote] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // Notificações temporárias (Toast)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "alert" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "alert" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sincroniza o estado local com o mockData global para manter a consistência nas rotas
  const updateAlertsState = (newAlerts: SecurityAlert[]) => {
    setAlerts(newAlerts);
    mockAlerts.length = 0;
    mockAlerts.push(...newAlerts);
  };

  // Define o alerta selecionado padrão (primeiro não resolvido, ou o primeiro da lista)
  useEffect(() => {
    if (alerts.length > 0 && !selected) {
      const unresolved = alerts.find((a) => a.status === "active");
      setSelected(unresolved || alerts[0]);
    }
  }, [alerts, selected]);

  // Handler de simulação de disparo de alarme
  const handleSimulateAlert = (
    title: string,
    type: SecurityAlert["type"],
    severity: AlertSeverity,
    location: string,
    description: string
  ) => {
    const newAlert: SecurityAlert = {
      id: `al_${Date.now()}`,
      type,
      badge: severity.toUpperCase(),
      title,
      description,
      severity,
      timestamp: "Agora",
      location,
      status: "active",
      resolved: false,
      timeline: [
        { time: "Agora", event: "Sensor violado. Alarme de segurança transmitido ao terminal." },
      ],
    };

    const updated = [newAlert, ...alerts];
    updateAlertsState(updated);
    setSelected(newAlert);
    setIsSimulateOpen(false);
    showToast(`NOVO ALERTA DISPARADO: ${title} no(a) ${location}!`, "alert");

    // Adiciona evento no log de auditoria global
    const newAuditLog: AuditEvent = {
      id: `ae_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      userInitials: "SYS",
      userName: "Central Automatizada",
      action: "Disparo de Alarme",
      actionType: "alert",
      condoUnit: location,
      details: `${title}: ${description}`,
      category: "security",
    };
    mockAuditEvents.unshift(newAuditLog);
  };

  // Handler para designar responsável
  const handleAssignOperator = (operatorName: string) => {
    if (!selected) return;

    const assigned = operatorName === "Não Designado" ? undefined : operatorName;
    const nowTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    
    const updatedTimeline = [
      ...(selected.timeline || []),
      { time: nowTime, event: `Ocorrência designada para: ${operatorName}` },
    ];

    const updatedAlert: SecurityAlert = {
      ...selected,
      assignedTo: assigned,
      timeline: updatedTimeline,
    };

    const updated = alerts.map((a) => (a.id === selected.id ? updatedAlert : a));
    updateAlertsState(updated);
    setSelected(updatedAlert);
    showToast(`Ocorrência designada para ${operatorName}`);
  };

  // Handler para adicionar nota de andamento à timeline
  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !timelineNote.trim()) return;

    const nowTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const updatedTimeline = [
      ...(selected.timeline || []),
      { time: nowTime, event: `Operador: ${timelineNote.trim()}` },
    ];

    const updatedAlert: SecurityAlert = {
      ...selected,
      timeline: updatedTimeline,
    };

    const updated = alerts.map((a) => (a.id === selected.id ? updatedAlert : a));
    updateAlertsState(updated);
    setSelected(updatedAlert);
    setTimelineNote("");
    showToast("Anotação adicionada à ocorrência.");
  };

  // Handler para resolver o alarme com justificativa
  const handleResolveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !resolutionNote.trim()) return;

    const nowTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const updatedTimeline = [
      ...(selected.timeline || []),
      { time: nowTime, event: `Resolução: ${resolutionNote.trim()}` },
      { time: nowTime, event: "Ocorrência dada como resolvida e arquivada." },
    ];

    const updatedAlert: SecurityAlert = {
      ...selected,
      resolved: true,
      status: "resolved",
      timeline: updatedTimeline,
    };

    const updated = alerts.map((a) => (a.id === selected.id ? updatedAlert : a));
    updateAlertsState(updated);
    setSelected(updatedAlert);
    setIsResolveOpen(false);
    setResolutionNote("");
    showToast("Incidente marcado como resolvido e encerrado.");

    // Adiciona evento no log de auditoria global
    const newAuditLog: AuditEvent = {
      id: `ae_${Date.now()}`,
      timestamp: nowTime,
      userInitials: "MC",
      userName: "Marcus Caldwell",
      action: "Incidente Encerrado",
      actionType: "approved",
      condoUnit: selected.location || "Guarita A",
      details: `Alerta #${selected.id.slice(0, 5)} resolvido: ${resolutionNote.trim()}`,
      category: "security",
    };
    mockAuditEvents.unshift(newAuditLog);
  };

  // Métricas de ocorrências
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const criticalCount = unresolvedAlerts.filter((a) => a.severity === "critical").length;
  const highCount = unresolvedAlerts.filter((a) => a.severity === "high").length;
  const warningCount = unresolvedAlerts.filter((a) => a.severity === "warning").length;
  const activeCount = unresolvedAlerts.length;

  // Filtragem dos alertas exibidos no feed
  const filteredAlerts = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "resolved") return a.status === "resolved";
    return a.severity === filter && a.status === "active";
  });

  return (
    <div className="p-8 min-h-full text-foreground relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[100] px-4 py-3.5 rounded-xl border flex items-center gap-2.5 shadow-2xl animate-fade-in ${
            toastMessage.type === "alert"
              ? "bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-400 shadow-red-500/10"
              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10"
          }`}
        >
          {toastMessage.type === "alert" ? (
            <ShieldAlert size={18} className="animate-bounce" />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span className="text-sm font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* BANNER DE ALERTA CRÍTICO ATIVO */}
      {criticalCount > 0 && (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 dark:bg-red-950/20 p-4 flex items-center justify-between gap-4 shadow-lg shadow-red-500/5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-500/35">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-xs font-black tracking-widest text-red-600 dark:text-red-400 uppercase">
                Aviso Crítico de Segurança
              </p>
              <p className="text-[11px] text-red-700 dark:text-red-300 mt-0.5 font-medium">
                Existe(m) {criticalCount} violação(ões) crítica(s) de perímetro pendente(s) de ação corretiva. Verifique imediatamente!
              </p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest bg-red-600 dark:bg-red-400 text-white dark:text-black px-2.5 py-1 rounded-lg">
            Ação Exigida
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            Central de Operações de Segurança • SOC
          </p>
          <h1
            className="text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Controle de Alertas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe disparos de sensores, integridade da rede de guarita, alarmes de baterias e ordens de serviço pendentes.
          </p>
        </div>
        
        <button
          onClick={() => setIsSimulateOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold hover:bg-primary/95 active:scale-95 transition-all shadow-lg shadow-primary/10 self-start md:self-auto"
        >
          <Plus size={16} />
          Simular Novo Alerta
        </button>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Alertas Ativos", value: activeCount, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", icon: Bell },
          { label: "Ocorrências Críticas", value: criticalCount, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", icon: ShieldAlert },
          { label: "Altas / Avisos", value: highCount + warningCount, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", icon: AlertTriangle },
          { label: "Casos Solucionados", value: alerts.filter((a) => a.resolved).length, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border border-border shadow-md bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={13} className={s.color} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-manrope)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Visualização de Comandos Duplos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Feed de Ocorrências */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Barra de Filtros rápidos */}
          <div className="flex gap-2 flex-wrap bg-card border border-border p-2.5 rounded-xl">
            {[
              { id: "all", label: "Todos os Alertas" },
              { id: "critical", label: "Crítico" },
              { id: "high", label: "Alto" },
              { id: "medium", label: "Médio" },
              { id: "low", label: "Baixo" },
              { id: "resolved", label: "Arquivados (Resolvidos)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${
                  filter === f.id
                    ? "bg-primary/10 text-primary border-primary/30 font-extrabold"
                    : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Lista de Alertas */}
          <div className="space-y-3.5">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const isResolved = alert.status === "resolved" || alert.resolved;
                const sc = severityConfig[isResolved ? "resolved" : alert.severity];
                const Icon = sc.icon;
                const isSelected = selected?.id === alert.id;

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelected(alert)}
                    className={`flex items-start gap-4 px-5 py-4 rounded-2xl border-l-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/5 border-l-primary ring-1 ring-primary/20 shadow-md"
                        : "hover:bg-muted/40 border-l-border bg-card/70"
                    } border border-border`}
                  >
                    {/* Ícone de Severidade */}
                    <div className={`w-9 h-9 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center flex-shrink-0 shadow-inner ${sc.glow}`}>
                      <Icon size={16} className={sc.color} />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-bold text-foreground leading-snug">{alert.title}</p>
                        <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase tracking-wider ${sc.bg} ${sc.color} flex-shrink-0 border ${sc.border}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-normal font-medium">{alert.description}</p>
                      
                      <div className="flex items-center flex-wrap gap-4 mt-3 text-[10px] text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {alert.timestamp}
                        </span>
                        <span>•</span>
                        <span>Posto: {alert.location}</span>
                        {alert.assignedTo && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-primary">
                              <User size={11} />
                              Resp: {alert.assignedTo.split(" ")[0]}
                            </span>
                          </>
                        )}
                        {isResolved && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 size={11} />
                              Resolvido
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/40 flex-shrink-0 mt-2 self-start" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-card/40 border border-border rounded-2xl text-muted-foreground">
                <p className="text-sm italic">Nenhum alerta ativo nesta categoria.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: Painel de Análise Detalhada */}
        <div className="space-y-4">
          {selected ? (
            <div
              className="rounded-2xl border border-border p-5 shadow-lg bg-card"
            >
              {/* Status Header */}
              {(() => {
                const isResolved = selected.status === "resolved" || selected.resolved;
                const sc = severityConfig[isResolved ? "resolved" : selected.severity];
                const Icon = sc.icon;

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center`}>
                          <Icon size={16} className={sc.color} />
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-bold">Ocorrência #{selected.id.slice(3, 8)}</span>
                    </div>

                    <h2
                      className="text-base font-black text-foreground mb-1.5 leading-snug"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      {selected.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4 leading-normal">{selected.description}</p>

                    {/* CCTV Placeholder */}
                    <div className="rounded-xl overflow-hidden border border-border relative mb-4 bg-black aspect-video flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/95 flex flex-col justify-between p-3 select-none">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono text-white">
                            <Camera size={9} />
                            CAM-102
                          </div>
                          {!isResolved && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                              <span className="text-[8px] font-bold tracking-widest text-red-500 uppercase">REC</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(#151e33_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                        <div className="text-[9px] font-mono text-white/60 bg-black/60 px-2 py-0.5 rounded w-fit self-end">
                          {selected.location} • LIVE
                        </div>
                      </div>
                      <p className="text-[11px] font-bold text-white/40 z-10">Câmera indisponível no mock</p>
                    </div>

                    {/* Informações Estruturais */}
                    <div className="grid grid-cols-2 gap-4 bg-muted/60 border border-border rounded-xl p-3.5 mb-5 text-xs">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Posto / Local</p>
                        <p className="font-semibold text-foreground">{selected.location}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Registro</p>
                        <p className="font-semibold text-foreground">{selected.timestamp}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Designação (Responsável)</p>
                        <select
                          value={selected.assignedTo ?? "Não Designado"}
                          onChange={(e) => handleAssignOperator(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40 cursor-pointer transition-colors"
                        >
                          {AVAILABLE_OPERATORS.map((op) => (
                             <option key={op} value={op} className="bg-card text-foreground">
                              {op}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Timeline de Incidentes */}
                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
                        <Activity size={12} />
                        Histórico da Ocorrência
                      </p>

                      <div className="space-y-3.5 mb-4">
                        {selected.timeline && selected.timeline.map((t, idx) => (
                          <div key={idx} className="flex gap-2">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5" />
                              {idx < selected.timeline!.length - 1 && (
                                <div className="w-px flex-1 bg-border mt-1.5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-foreground leading-normal font-medium">{t.event}</p>
                              <span className="text-[9px] text-muted-foreground/70 font-semibold block mt-0.5">{t.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Caixa para adicionar nota de andamento */}
                      {!isResolved && (
                        <form onSubmit={handleAddTimelineNote} className="flex gap-2">
                          <input
                            value={timelineNote}
                            onChange={(e) => setTimelineNote(e.target.value)}
                            placeholder="Adicionar nota de andamento..."
                            className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
                          />
                          <button
                            type="submit"
                            className="p-2 rounded-xl bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 active:scale-95 transition-all text-xs font-bold flex items-center justify-center"
                            title="Adicionar Nota"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Botão Resolver Ocorrência */}
                    {!isResolved && (
                      <button
                        onClick={() => setIsResolveOpen(true)}
                        className="w-full mt-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 size={13} />
                        Marcar como Resolvido
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-2xl border border-border p-6 text-center text-muted-foreground bg-card/50 py-12">
              <p className="text-xs italic">Selecione uma ocorrência para inspecionar os detalhes.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MODAL: SIMULAR DISPARO DE NOVO ALERTA                                  */}
      {/* ========================================================================= */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setIsSimulateOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsSimulateOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>

            {/* Título */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <ShieldAlert size={18} className="text-red-600 dark:text-red-400" />
              <h2 className="text-base font-bold text-foreground">Simular Disparo de Alarme</h2>
            </div>

            {/* Formulário */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const title = (data.get("title") as string).trim();
                const type = data.get("type") as SecurityAlert["type"];
                const severity = data.get("severity") as AlertSeverity;
                const location = (data.get("location") as string).trim();
                const desc = (data.get("desc") as string).trim();

                if (!title || !location) {
                  showToast("Título e Localização são obrigatórios!", "error");
                  return;
                }

                handleSimulateAlert(title, type, severity, location, desc);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Título do Alerta *
                </label>
                <input
                  name="title"
                  required
                  placeholder="Ex: Sensor Infravermelho Ativado"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Categoria
                  </label>
                  <select
                    name="type"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="perimeter" className="bg-card text-foreground">Perímetro</option>
                    <option value="mechanical" className="bg-card text-foreground">Mecânico</option>
                    <option value="signal_lost" className="bg-card text-foreground">Perda de Sinal</option>
                    <option value="low_battery" className="bg-card text-foreground">Bateria Fraca</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Criticidade (Severidade)
                  </label>
                  <select
                    name="severity"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="critical" className="bg-card text-foreground">Crítico</option>
                    <option value="high" className="bg-card text-foreground">Alto</option>
                    <option value="medium" className="bg-card text-foreground">Médio</option>
                    <option value="low" className="bg-card text-foreground">Baixo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Localização / Posto *
                </label>
                <input
                  name="location"
                  required
                  placeholder="Ex: Cerca Divisória Leste, Elevador B"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Descrição dos Fatos
                </label>
                <textarea
                  name="desc"
                  placeholder="Detalhes observados na notificação automática do sensor..."
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border transition-all text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all text-center"
                >
                  Confirmar Disparo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: RESOLVER OCORRÊNCIA COM JUSTIFICATIVA                           */}
      {/* ========================================================================= */}
      {isResolveOpen && selected && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setIsResolveOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsResolveOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>

            {/* Título */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-foreground">Encerrar Incidente</h2>
            </div>

            {/* Ocorrência a resolver */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 mb-4 text-xs">
              <p className="font-bold text-foreground">{selected.title}</p>
              <p className="text-muted-foreground mt-1">{selected.location} • {selected.timestamp}</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleResolveAlert} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Solução Aplicada (Justificativa) *
                </label>
                <textarea
                  required
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Relate como o incidente foi resolvido (ex: Patrulha enviada e falso alarme confirmado / Botão de emergência reiniciado / Equipe técnica acionada)..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border transition-all text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black text-xs font-extrabold hover:bg-emerald-600/90 dark:hover:bg-emerald-500/90 active:scale-95 transition-all text-center"
                >
                  Resolver e Arquivar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
