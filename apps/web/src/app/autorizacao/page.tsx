"use client";

import { useState, useEffect } from "react";
import { mockAuthorizations, mockVisitors, mockResidents } from "@/data/mockData";
import type { Authorization, Visitor } from "@/types";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  Building2,
  X,
  AlertCircle,
  Eye,
  QrCode,
  Share2,
  Search,
} from "lucide-react";

const statusConfig: Record<
  Authorization["status"],
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  approved: { label: "APROVADO", color: "text-primary", bg: "bg-primary/10 border-primary/20", icon: CheckCircle2 },
  pending: { label: "PENDENTE", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Clock },
  refused: { label: "RECUSADO", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", icon: XCircle },
  expired: { label: "EXPIRADO", color: "text-muted-foreground", bg: "bg-muted border-border/20", icon: Clock },
  cancelled: { label: "CANCELADO", color: "text-muted-foreground", bg: "bg-muted border-border/20", icon: XCircle },
};

function AuthCard({
  auth,
  onApprove,
  onRefuse,
  onViewQr,
}: {
  auth: Authorization;
  onApprove: (id: string) => void;
  onRefuse: (id: string) => void;
  onViewQr: (auth: Authorization) => void;
}) {
  const sc = statusConfig[auth.status] || statusConfig.pending;
  const Icon = sc.icon;

  // Fallbacks para campos inconsistentes
  const hostUnit = auth.hostUnit || auth.unit || "—";
  const hostResident = auth.hostResident || "Morador Principal";
  const visitDate = auth.visitDate || auth.scheduledFor || "Hoje";
  const visitTime = auth.visitTime || auth.entryTime || "Qualquer horário";
  const authorizedBy = auth.authorizedBy || hostResident;
  const visitorCompany = auth.visitorCompany || "Social / Particular";
  const initials = auth.visitorInitials || auth.visitorName.slice(0, 2).toUpperCase();

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:border-border/80 hover:shadow-lg group flex flex-col justify-between ${
        auth.status === "pending"
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-border/40 bg-card"
      }`}
    >
      <div>
        {/* Topo do Cartão */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{auth.visitorName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{visitorCompany}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-md border uppercase ${sc.bg} ${sc.color} flex-shrink-0`}>
            <Icon size={10} />
            {sc.label}
          </span>
        </div>

        {/* Detalhes de Local / Data */}
        <div className="space-y-2 text-[12px] bg-muted/40 p-3 rounded-lg border border-border/40 mb-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 size={12} className="text-muted-foreground/60" />
            <span className="truncate">
              Anfitrião: <span className="text-foreground font-medium">Ap. {hostUnit} — {hostResident}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={12} className="text-muted-foreground/60" />
            <span>{visitDate} às {visitTime}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={12} className="text-muted-foreground/60" />
            <span className="truncate">
              Autorizado por: <span className="text-foreground font-medium">{authorizedBy}</span>
            </span>
          </div>
        </div>

        {/* Motivo */}
        {auth.purpose && (
          <div
            className="px-3 py-2 rounded-lg text-[11px] text-muted-foreground border border-border/40 bg-muted/30 italic"
          >
            &ldquo;{auth.purpose}&rdquo;
          </div>
        )}
      </div>

      {/* Ações do Cartão */}
      <div className="mt-4 pt-3 border-t border-border flex gap-2">
        {auth.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(auth.id)}
              className="flex-1 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/20 transition-all cursor-pointer text-center"
            >
              ✓ Aprovar
            </button>
            <button
              onClick={() => onRefuse(auth.id)}
              className="flex-1 py-2 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-[11px] font-bold hover:bg-destructive/20 transition-all cursor-pointer text-center"
            >
              ✕ Recusar
            </button>
          </>
        )}

        {auth.status === "approved" && (
          <button
            onClick={() => onViewQr(auth)}
            className="w-full py-2 rounded-lg bg-primary/10 border border-primary/25 text-primary text-[11px] font-bold hover:bg-primary/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <QrCode size={12} />
            Ver QR Code
          </button>
        )}

        {auth.status !== "approved" && auth.status !== "pending" && (
          <div className="w-full text-center text-[10px] text-muted-foreground py-1">
            Nenhuma ação disponível
          </div>
        )}
      </div>
    </div>
  );
}

export default function AutorizacaoPage() {
  // Estados principais
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | Authorization["status"]>("all");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Modais e Alertas
  const [selectedAuthForQr, setSelectedAuthForQr] = useState<Authorization | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Estados do Formulário de Cadastro
  const [selectedVisitorId, setSelectedVisitorId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [hostUnit, setHostUnit] = useState("");
  const [hostResident, setHostResident] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitorCompany, setVisitorCompany] = useState("");
  const [visitorDocument, setVisitorDocument] = useState("");
  const [initialStatus, setInitialStatus] = useState<Authorization["status"]>("approved");

  // Inicializa lista
  useEffect(() => {
    setAuthorizations(mockAuthorizations);
  }, []);

  // Limpa alertas automaticamente
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Manipulador de Mudança de Visitante Cadastrado (Preenchimento Inteligente)
  const handleVisitorSelectChange = (visitorId: string) => {
    setSelectedVisitorId(visitorId);
    if (!visitorId) {
      setVisitorName("");
      setVisitorCompany("");
      setVisitorDocument("");
      return;
    }

    const visitor = mockVisitors.find((v) => v.id === visitorId);
    if (visitor) {
      setVisitorName(visitor.name);
      setVisitorCompany(visitor.company || "Social");
      setVisitorDocument(visitor.document);
      if (visitor.hostUnit) {
        setHostUnit(visitor.hostUnit);
      }
      if (visitor.hostResident) {
        setHostResident(visitor.hostResident);
      }
    }
  };

  // Manipulador de Unidade para descobrir o morador automaticamente
  const handleUnitChange = (unitVal: string) => {
    setHostUnit(unitVal);
    // Tenta encontrar o morador da unidade no mock de moradores
    const resident = mockResidents.find((r) => r.unit === unitVal);
    if (resident) {
      setHostResident(resident.name);
    }
  };

  // Cadastro de nova autorização
  const handleCreateAuthorization = (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorName.trim() || !hostUnit.trim()) {
      setAlert({ type: "error", message: "Nome do Visitante e Unidade são obrigatórios." });
      return;
    }

    const initials = visitorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newAuth: Authorization = {
      id: `a_${Date.now()}`,
      visitorName: visitorName,
      visitorInitials: initials,
      visitorCompany: visitorCompany || "Social / Particular",
      unit: `Unit ${hostUnit}`,
      hostUnit: hostUnit,
      hostResident: hostResident || "Morador Principal",
      visitDate: visitDate || "Hoje",
      visitTime: visitTime || "Livre",
      authorizedBy: hostResident || "Morador Principal",
      purpose: purpose || "Visita cadastrada na administração",
      status: initialStatus,
    };

    // Atualiza estado local e mock global em memória
    setAuthorizations([newAuth, ...authorizations]);
    mockAuthorizations.unshift(newAuth);

    setShowForm(false);
    resetForm();
    setAlert({
      type: "success",
      message: `Autorização criada com sucesso para ${visitorName}! Status: ${
        initialStatus === "approved" ? "Aprovado" : "Pendente"
      }`,
    });
  };

  // Lógica de Aprovar Autorização
  const handleApprove = (id: string) => {
    setAuthorizations((prev) =>
      prev.map((auth) => (auth.id === id ? { ...auth, status: "approved" as const } : auth))
    );

    // Sincroniza no mock global
    const foundIndex = mockAuthorizations.findIndex((a) => a.id === id);
    if (foundIndex > -1) {
      mockAuthorizations[foundIndex].status = "approved";
    }

    setAlert({ type: "success", message: "Autorização de visita APROVADA com sucesso!" });
  };

  // Lógica de Recusar Autorização
  const handleRefuse = (id: string) => {
    setAuthorizations((prev) =>
      prev.map((auth) => (auth.id === id ? { ...auth, status: "refused" as const } : auth))
    );

    // Sincroniza no mock global
    const foundIndex = mockAuthorizations.findIndex((a) => a.id === id);
    if (foundIndex > -1) {
      mockAuthorizations[foundIndex].status = "refused";
    }

    setAlert({ type: "success", message: "Autorização de visita RECUSADA e arquivada." });
  };

  const resetForm = () => {
    setSelectedVisitorId("");
    setVisitorName("");
    setHostUnit("");
    setHostResident("");
    setVisitDate("");
    setVisitTime("");
    setPurpose("");
    setVisitorCompany("");
    setVisitorDocument("");
    setInitialStatus("approved");
  };

  // Contagem para badges de filtros
  const pendingCount = authorizations.filter((a) => a.status === "pending").length;
  const approvedCount = authorizations.filter((a) => a.status === "approved").length;

  // Filtra as autorizações com base no status e busca por texto
  const filteredAuths = authorizations.filter((a) => {
    const matchesSearch =
      a.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      (a.hostUnit || a.unit || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.visitorCompany || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "all" || a.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 min-h-full">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            CONTROLE DE ACESSOS
          </p>
          <h1
            className="text-3xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Autorizações de Visita
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{pendingCount} pendente{pendingCount === 1 ? "" : "s"}</p>
            <span className="text-border">·</span>
            <p className="text-xs text-muted-foreground">{approvedCount} aprovada{approvedCount === 1 ? "" : "s"} hoje</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/10 self-start sm:self-auto"
        >
          <Plus size={14} />
          Nova Autorização
        </button>
      </div>

      {/* Alerta temporário */}
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

      {/* Regulamento do Formulário expansível de Nova Autorização */}
      {showForm && (
        <form
          onSubmit={handleCreateAuthorization}
          className="rounded-2xl border border-border p-6 mb-8 space-y-5 animate-in slide-in-from-top-5 duration-300 bg-card"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Nova Autorização de Visita
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Escolher Visitante Cadastrado (Preenchimento Inteligente) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Visitante Cadastrado (Dropdown)
              </label>
              <select
                value={selectedVisitorId}
                onChange={(e) => handleVisitorSelectChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">-- Cadastrar Manualmente --</option>
                {mockVisitors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.company || "Social"})
                  </option>
                ))}
              </select>
            </div>

            {/* Nome do Visitante */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Nome do Visitante
              </label>
              <input
                type="text"
                required
                placeholder="Nome completo..."
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* CPF / Documento */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Documento (CPF / RG)
              </label>
              <input
                type="text"
                placeholder="CPF ou RG..."
                value={visitorDocument}
                onChange={(e) => setVisitorDocument(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Empresa / Categoria
              </label>
              <input
                type="text"
                placeholder="Ex: Particular, Uber, Enel..."
                value={visitorCompany}
                onChange={(e) => setVisitorCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Unidade */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Unidade de Destino
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 402, Penthouse B..."
                value={hostUnit}
                onChange={(e) => handleUnitChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Nome do Morador / Anfitrião */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Morador Responsável
              </label>
              <input
                type="text"
                placeholder="Preenchido automaticamente se unidade cadastrada..."
                value={hostResident}
                onChange={(e) => setHostResident(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Data da Visita */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Data da Visita
              </label>
              <input
                type="text"
                placeholder="Ex: Hoje, Amanhã ou DD/MM"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Horário da Visita */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Horário da Entrada
              </label>
              <input
                type="text"
                placeholder="Ex: 14:30 ou Livre"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Status Inicial da Autorização */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Status Inicial
              </label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="approved">Aprovado pelo Morador (Direto)</option>
                <option value="pending">Pendente de Análise (Portaria)</option>
              </select>
            </div>
          </div>

          {/* Finalidade */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Motivo / Finalidade da Visita
            </label>
            <input
              type="text"
              placeholder="Ex: Reunião social, reparo de pia vazando, entrega de mantimentos..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/10"
            >
              Criar Autorização
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Busca e Barra de Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Filtros Status */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(["all", "pending", "approved", "refused", "expired"] as const).map((f) => {
            const labelMap = {
              all: "Todas",
              pending: "Pendentes",
              approved: "Aprovadas",
              refused: "Recusadas",
              expired: "Expiradas",
            };
            return (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === f
                    ? "bg-primary/10 text-primary border border-primary/35 shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {labelMap[f]}
                {f === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] border border-amber-500/20">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Busca por Texto */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por visitante, unidade ou empresa..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Feed de Cartões */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAuths.map((auth) => (
          <AuthCard
            key={auth.id}
            auth={auth}
            onApprove={handleApprove}
            onRefuse={handleRefuse}
            onViewQr={setSelectedAuthForQr}
          />
        ))}
      </div>

      {/* Mensagem se lista filtrada vazia */}
      {filteredAuths.length === 0 && (
        <div className="text-center py-20 bg-card/40 rounded-2xl border border-border/40">
          <AlertCircle size={36} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-foreground font-semibold">Nenhuma autorização de visita encontrada.</p>
          <p className="text-xs text-muted-foreground mt-1">Experimente remover os termos de busca ou mudar o filtro selecionado.</p>
        </div>
      )}

      {/* === MODAL: VISUALIZADOR DE PASSE DIGITAL / QR CODE === */}
      {selectedAuthForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-sm rounded-2xl border border-border p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 bg-card"
          >
            {/* Fechar modal */}
            <button
              onClick={() => setSelectedAuthForQr(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center">
              <p className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">CONVITE DIGITAL CONDOMINIAL</p>
              <h2
                className="text-lg font-bold text-foreground mt-0.5"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Passe de Acesso
              </h2>
            </div>

            {/* Cartão de Passe Físico simulado */}
            <div className="p-5 rounded-xl border border-primary/30 bg-muted/60 flex flex-col items-center gap-4 relative overflow-hidden">
              {/* Efeito luminoso de fundo */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

              {/* QR Code Simulado */}
              <div className="w-40 h-40 bg-white rounded-xl p-3 shadow-lg flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#0b1326]">
                  {/* Grid estético simulando padrão de QR Code */}
                  <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                  <rect x="3" y="3" width="19" height="19" fill="white" />
                  <rect x="7" y="7" width="11" height="11" fill="currentColor" />

                  <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                  <rect x="78" y="3" width="19" height="19" fill="white" />
                  <rect x="82" y="7" width="11" height="11" fill="currentColor" />

                  <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                  <rect x="3" y="78" width="19" height="19" fill="white" />
                  <rect x="7" y="82" width="11" height="11" fill="currentColor" />

                  {/* Detalhes de dados aleatórios simulados */}
                  <rect x="30" y="5" width="10" height="5" fill="currentColor" />
                  <rect x="45" y="10" width="20" height="5" fill="currentColor" />
                  <rect x="35" y="20" width="5" height="15" fill="currentColor" />
                  <rect x="10" y="35" width="15" height="5" fill="currentColor" />
                  <rect x="5" y="45" width="5" height="10" fill="currentColor" />
                  <rect x="30" y="50" width="25" height="10" fill="currentColor" />
                  <rect x="60" y="40" width="10" height="20" fill="currentColor" />
                  <rect x="70" y="70" width="20" height="5" fill="currentColor" />
                  <rect x="80" y="80" width="10" height="10" fill="currentColor" />
                  <rect x="45" y="75" width="15" height="15" fill="currentColor" />
                  <rect x="5" y="60" width="10" height="5" fill="currentColor" />
                </svg>
              </div>

              {/* Informações Resumidas do Passe */}
              <div className="text-center space-y-1 text-xs">
                <p className="font-extrabold text-sm text-foreground">{selectedAuthForQr.visitorName}</p>
                <p className="text-muted-foreground text-[11px]">{selectedAuthForQr.visitorCompany || "Social"}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-md text-[10px] text-primary font-bold tracking-wider">
                  <span>UNIDADE {selectedAuthForQr.hostUnit || selectedAuthForQr.unit || "—"}</span>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="text-[11px] text-muted-foreground space-y-1.5 p-3 rounded-lg border border-border/40 bg-muted/40">
              <p>
                <span className="font-semibold text-foreground">Validade: </span>
                {selectedAuthForQr.visitDate || "Hoje"} • {selectedAuthForQr.visitTime || "Qualquer horário"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Autorizado por: </span>
                {selectedAuthForQr.authorizedBy || selectedAuthForQr.hostResident || "Residente"}
              </p>
            </div>

            {/* Ações do Passe */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAlert({ type: "success", message: "Link de convite copiado para área de transferência!" });
                  setSelectedAuthForQr(null);
                }}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
              >
                <Share2 size={13} />
                Compartilhar
              </button>
              <button
                onClick={() => setSelectedAuthForQr(null)}
                className="px-4 py-3 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
