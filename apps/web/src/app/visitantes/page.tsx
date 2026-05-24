"use client";

import { useState, useEffect } from "react";
import { mockVisitors, mockDevices, mockActiveVisits } from "@/data/mockData";
import type { Visitor, ActiveVisit, GpsDevice } from "@/types";
import {
  Search,
  Plus,
  Star,
  Filter,
  User,
  Shield,
  ShieldCheck,
  Building,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Radio,
  LogOut,
} from "lucide-react";

const statusConfig: Record<Visitor["status"], { label: string; color: string; bg: string }> = {
  approved: { label: "APROVADO", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  pending: { label: "PENDENTE", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  refused: { label: "RECUSADO", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  "checked-in": { label: "NO CONDOMÍNIO", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  active: { label: "ATIVO", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  frequent: { label: "FREQUENTE", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
};

const typeLabel = {
  guest: "Visitante",
  frequent_guest: "Frequente",
  service: "Prestador",
  delivery: "Entregador",
};

export default function VisitantesPage() {
  // Estados principais
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | Visitor["type"] | "checked-in">("all");

  // Controle de Modais e Notificações
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Formulário de Cadastro de Visitante
  const [newName, setNewName] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [newNationality, setNewNationality] = useState("Brasileira");
  const [newType, setNewType] = useState<Visitor["type"]>("guest");
  const [newCompany, setNewCompany] = useState("");
  const [newHostUnit, setNewHostUnit] = useState("");
  const [newHostResident, setNewHostResident] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Formulário de Check-in Rápido
  const [checkInUnit, setCheckInUnit] = useState("");
  const [checkInGpsId, setCheckInGpsId] = useState("");

  // Inicializa a lista de visitantes
  useEffect(() => {
    setVisitors(mockVisitors);
  }, []);

  // Limpa alertas após 4 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Lista de Dispositivos GPS Disponíveis
  const availableGpsDevices = mockDevices.filter(
    (d) => d.status === "available" && !mockActiveVisits.some((v) => v.deviceId === d.deviceId)
  );

  // Cadastro de Novo Visitante
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim() || !newDocument.trim()) {
      setAlert({ type: "error", message: "Nome e Documento são campos obrigatórios." });
      return;
    }

    const initials = newName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newVisitor: Visitor = {
      id: `v_${Date.now()}`,
      name: newName,
      document: newDocument,
      nationality: newNationality,
      type: newType,
      company: newCompany || "Particular",
      hostUnit: newHostUnit || undefined,
      hostResident: newHostResident || undefined,
      visitCount: 0,
      notes: newNotes || undefined,
      status: newType === "frequent_guest" ? "frequent" : "active",
      initials: initials,
      isFrequent: newType === "frequent_guest",
      visitHistory: [],
    };

    // Atualiza a lista em tela e o mock em memória global
    setVisitors([newVisitor, ...visitors]);
    mockVisitors.unshift(newVisitor);

    setShowAddModal(false);
    resetAddForm();
    setAlert({ type: "success", message: `Visitante ${newName} cadastrado com sucesso!` });
  };

  // Abre o modal de check-in rápido
  const openCheckIn = () => {
    if (!selected) return;
    setCheckInUnit(selected.hostUnit || selected.unitVisited || "");
    setCheckInGpsId("");
    setShowCheckInModal(true);
  };

  // Confirmação de Check-in Rápido
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selected || !checkInUnit.trim()) {
      setAlert({ type: "error", message: "A Unidade de Destino é obrigatória." });
      return;
    }

    // Cria o objeto de ActiveVisit
    const newVisitId = `av_${Date.now()}`;
    const newActiveVisit: ActiveVisit = {
      id: newVisitId,
      name: selected.name,
      visitorName: selected.name,
      type: selected.type === "service" ? "maintenance" : selected.type === "delivery" ? "delivery" : "guest",
      unit: `Unidade ${checkInUnit}`,
      hostUnit: checkInUnit,
      timeIn: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      checkInTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      elapsed: "0h 01m",
      deviceId: checkInGpsId || undefined,
      location: checkInGpsId ? `Ala Norte • Unidade ${checkInUnit}` : "Portaria Central",
      initials: selected.initials,
    };

    // Adiciona na lista em memória compartilhada
    mockActiveVisits.unshift(newActiveVisit);

    // Altera o status do visitante na lista
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === selected.id) {
          const updated = {
            ...v,
            status: "checked-in" as const,
            lastVisit: `Hoje • ${newActiveVisit.timeIn}`,
            visitCount: (v.visitCount || 0) + 1,
            hostUnit: checkInUnit,
            visitHistory: [{ date: "Hoje", unit: `Unidade ${checkInUnit}` }, ...(v.visitHistory || [])],
          };
          setSelected(updated);
          return updated;
        }
        return v;
      })
    );

    // Atualiza o mock global
    const foundIndex = mockVisitors.findIndex((v) => v.id === selected.id);
    if (foundIndex > -1) {
      mockVisitors[foundIndex].status = "checked-in";
      mockVisitors[foundIndex].visitCount = (mockVisitors[foundIndex].visitCount || 0) + 1;
      mockVisitors[foundIndex].hostUnit = checkInUnit;
      mockVisitors[foundIndex].visitHistory = [
        { date: "Hoje", unit: `Unidade ${checkInUnit}` },
        ...(mockVisitors[foundIndex].visitHistory || []),
      ];
    }

    setShowCheckInModal(false);
    setAlert({ type: "success", message: `Check-in de ${selected.name} realizado na portaria!` });
  };

  // Função para dar Saída (Check-out) imediata do visitante no condomínio
  const handleCheckOut = () => {
    if (!selected) return;

    // Remove do mock global de visitas ativas
    const activeIndex = mockActiveVisits.findIndex(
      (v) => (v.visitorName || v.name) === selected.name
    );
    if (activeIndex > -1) {
      mockActiveVisits.splice(activeIndex, 1);
    }

    // Altera status de volta para ativo / frequente
    const nextStatus = selected.isFrequent ? "frequent" : "active";
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === selected.id) {
          const updated = { ...v, status: nextStatus as any };
          setSelected(updated);
          return updated;
        }
        return v;
      })
    );

    const foundIndex = mockVisitors.findIndex((v) => v.id === selected.id);
    if (foundIndex > -1) {
      mockVisitors[foundIndex].status = nextStatus as any;
    }

    setAlert({
      type: "success",
      message: `Saída do visitante ${selected.name} registrada. GPS recolhido!`,
    });
  };

  const resetAddForm = () => {
    setNewName("");
    setNewDocument("");
    setNewNationality("Brasileira");
    setNewType("guest");
    setNewCompany("");
    setNewHostUnit("");
    setNewHostResident("");
    setNewNotes("");
  };

  // Filtra os visitantes
  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.hostUnit || "").toLowerCase().includes(search.toLowerCase()) ||
      v.document.toLowerCase().includes(search.toLowerCase()) ||
      (v.company || "").toLowerCase().includes(search.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "checked-in") {
      return matchesSearch && v.status === "checked-in";
    }
    return matchesSearch && v.type === filterType;
  });

  return (
    <div className="p-8 min-h-full flex flex-col lg:flex-row gap-8">
      {/* Coluna Esquerda: Cadastro, Barra de Busca e Tabela */}
      <div className="flex-1 min-w-0">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
              CONTROLE OPERACIONAL
            </p>
            <h1
              className="text-3xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Base de Visitantes
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              {visitors.length} visitantes cadastrados • {visitors.filter((v) => v.status === "checked-in").length} no condomínio atualmente.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/10 self-start sm:self-auto"
          >
            <Plus size={14} />
            Registrar Visitante
          </button>
        </div>

        {/* Notificação temporária */}
        {alert && (
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3 duration-300 ${
              alert.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            {alert.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{alert.message}</span>
          </div>
        )}

        {/* Barra de Busca e Filtros Rápidos */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, documento ou unidade..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Chips Horizontais de Filtro por Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { id: "all", label: "Todos" },
              { id: "checked-in", label: "No Condomínio" },
              { id: "guest", label: "Visitantes" },
              { id: "frequent_guest", label: "Frequentes" },
              { id: "service", label: "Prestadores" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  filterType === chip.id
                    ? "bg-primary/10 text-primary border border-primary/35 shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Visitantes */}
        <div
          className="rounded-2xl border border-border overflow-hidden bg-card"
        >
          {/* Linha do Cabeçalho da Tabela */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-muted/20 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <p className="col-span-4 sm:col-span-4">Visitante / Tipo</p>
            <p className="col-span-3 sm:col-span-2">Unidade</p>
            <p className="col-span-3 sm:col-span-2">Documento</p>
            <p className="col-span-2 sm:col-span-2">Status</p>
            <p className="hidden sm:block col-span-2 text-right">Última Visita</p>
          </div>

          {/* Linhas da Tabela */}
          <div className="divide-y divide-border/40">
            {filteredVisitors.map((v) => {
              const sc = statusConfig[v.status] || statusConfig.active;
              const isSelected = selected?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Nome e Categoria */}
                  <div className="col-span-4 sm:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {v.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-semibold text-foreground truncate">{v.name}</p>
                        {v.isFrequent && <Star size={10} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {typeLabel[v.type]} {v.company ? `• ${v.company}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Unidade */}
                  <div className="col-span-3 sm:col-span-2 truncate text-xs text-foreground/80">
                    {v.hostUnit ? `Ap. ${v.hostUnit}` : "—"}
                  </div>

                  {/* Documento */}
                  <div className="col-span-3 sm:col-span-2 text-xs font-mono text-muted-foreground">
                    {v.document}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 sm:col-span-2">
                    <span className={`px-2 py-0.5 text-[8px] sm:text-[9px] font-bold rounded-md uppercase border ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Última Visita */}
                  <div className="hidden sm:block col-span-2 text-right text-[10px] text-muted-foreground">
                    {v.lastVisit ? v.lastVisit.split("•")[0] : "—"}
                  </div>
                </div>
              );
            })}

            {filteredVisitors.length === 0 && (
              <div className="text-center py-16 px-4">
                <Shield size={36} className="mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-foreground font-semibold">Nenhum visitante cadastrado.</p>
                <p className="text-xs text-muted-foreground mt-1">Ajuste seus filtros ou adicione um novo visitante.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coluna Direita: Painel Lateral Retrátil de Detalhes */}
      {selected && (
        <div
          className="w-full lg:w-85 border border-border p-6 flex flex-col gap-5 rounded-2xl shadow-xl overflow-y-auto animate-in slide-in-from-right-5 duration-300 bg-muted"
        >
          {/* Cabeçalho do Painel */}
          <div className="text-center relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-0 right-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary mx-auto mb-3">
              {selected.initials}
            </div>
            <h2
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {selected.name}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {typeLabel[selected.type]} {selected.company ? `• ${selected.company}` : ""}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase border ${
                statusConfig[selected.status]?.bg || ""
              } ${statusConfig[selected.status]?.color || ""}`}
            >
              {statusConfig[selected.status]?.label || selected.status}
            </span>
          </div>

          {/* Ficha de Dados */}
          <div className="space-y-3.5 bg-card/50 p-4 rounded-xl border border-border">
            {[
              { label: "Documento", value: selected.document, icon: Shield },
              { label: "Nacionalidade", value: selected.nationality || "Brasileira", icon: User },
              { label: "Unidade Vínculo", value: selected.hostUnit ? `Ap. ${selected.hostUnit}` : "Nenhuma", icon: Building },
              { label: "Anfitrião", value: selected.hostResident || "—", icon: User },
              { label: "Visitas Totais", value: `${selected.visitCount || 0} acessos`, icon: Clock },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <f.icon size={12} className="text-muted-foreground/60" />
                  {f.label}
                </span>
                <span className="font-semibold text-foreground text-[11px] truncate max-w-[150px]">
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline de Visitas Passadas */}
          <div className="flex-1 flex flex-col min-h-[160px]">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3 flex items-center gap-1.5">
              <Calendar size={12} />
              HISTÓRICO DE ACESSOS
            </p>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-48 pr-1 relative pl-4 border-l border-border">
              {selected.visitHistory && selected.visitHistory.map((h, i) => (
                <div key={i} className="relative text-xs">
                  {/* Ponto da linha do tempo */}
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border border-muted shadow-sm shadow-primary/20" />
                  <p className="font-bold text-foreground">{h.unit}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{h.date}</p>
                </div>
              ))}

              {(!selected.visitHistory || selected.visitHistory.length === 0) && (
                <div className="text-center py-6 text-[11px] text-muted-foreground italic bg-card/15 rounded-lg -ml-4">
                  Sem registros de acessos anteriores.
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          {selected.notes && (
            <div
              className="rounded-xl p-3 border border-border bg-card/30 text-xs"
            >
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Observações</p>
              <p className="text-foreground/80 leading-relaxed text-[11px]">{selected.notes}</p>
            </div>
          )}

          {/* Painel de Ações Rápidas */}
          <div className="space-y-2 mt-auto pt-3 border-t border-border">
            {selected.status === "checked-in" ? (
              <button
                onClick={handleCheckOut}
                className="w-full py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut size={13} />
                Registrar Saída (Check-out)
              </button>
            ) : (
              <button
                onClick={openCheckIn}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                Autorizar Entrada
              </button>
            )}
          </div>
        </div>
      )}

      {/* === MODAL 1: REGISTRAR NOVO VISITANTE === */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-lg rounded-2xl border border-border p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 bg-card"
          >
            {/* Fechar modal */}
            <button
              onClick={() => {
                setShowAddModal(false);
                resetAddForm();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">CADASTRO CONDOMINIAL</p>
              <h2
                className="text-xl font-bold text-foreground mt-0.5"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Registrar Novo Visitante
              </h2>
            </div>

            <form onSubmit={handleAddVisitor} className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do visitante..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Documento */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Documento (CPF / RG)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Número do documento..."
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                {/* Nacionalidade */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Nacionalidade
                  </label>
                  <input
                    type="text"
                    value={newNationality}
                    onChange={(e) => setNewNationality(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tipo de Visitante */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Tipo de Visitante
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="guest">Visitante (Social)</option>
                    <option value="frequent_guest">Visitante Frequente</option>
                    <option value="service">Prestador de Serviço</option>
                    <option value="delivery">Entregador</option>
                  </select>
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Empresa / Representação
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: FedEx, Enel, Uber..."
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Unidade do Anfitrião */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Unidade Vínculo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 402, Cobertura B..."
                    value={newHostUnit}
                    onChange={(e) => setNewHostUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                {/* Nome do Anfitrião */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Nome do Anfitrião / Morador
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do morador..."
                    value={newHostResident}
                    onChange={(e) => setNewHostResident(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Observações
                </label>
                <textarea
                  placeholder="Restrições, autorizações especiais..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
              </div>

              {/* Botões do Formulário */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer text-center"
                >
                  Salvar Cadastro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  className="px-5 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL 2: AUTORIZAR ENTRADA IMEDIATA (CHECK-IN RÁPIDO) === */}
      {showCheckInModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-md rounded-2xl border border-border p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 bg-card"
          >
            {/* Fechar modal */}
            <button
              onClick={() => setShowCheckInModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">CHECK-IN IMEDIATO</p>
              <h2
                className="text-xl font-bold text-foreground mt-0.5"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Autorizar Entrada
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Registrando check-in para o visitante <span className="font-bold text-foreground">{selected.name}</span>
              </p>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              {/* Unidade de Destino */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Unidade de Destino
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 402, Cobertura B..."
                  value={checkInUnit}
                  onChange={(e) => setCheckInUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Vincular Dispositivo GPS */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Entregar Chaveiro GPS (Opcional)
                </label>
                <select
                  value={checkInGpsId}
                  onChange={(e) => setCheckInGpsId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="">-- Sem Dispositivo GPS --</option>
                  {availableGpsDevices.map((dev) => (
                    <option key={dev.id} value={dev.deviceId}>
                      {dev.deviceId} ({dev.model} - Bat: {dev.batteryLevel}%)
                    </option>
                  ))}
                </select>
                {availableGpsDevices.length === 0 && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Sem chaveiros GPS livres no momento.</p>
                )}
              </div>

              {/* Botões do Formulário */}
              <div className="flex gap-3 pt-3 border-t border-border">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-500/90 transition-all shadow-md shadow-emerald-500/10 cursor-pointer text-center"
                >
                  Confirmar Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-5 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
