"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockResidents, mockAuthorizations } from "@/data/mockData";
import type { Resident } from "@/types";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MoreHorizontal,
  Shield,
  User,
  Building,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldAlert,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

const statusConfig: Record<Resident["status"], { label: string; color: string; bg: string }> = {
  active: { label: "ATIVO", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  inactive: { label: "INATIVO", color: "text-muted-foreground", bg: "bg-muted" },
  suspended: { label: "SUSPENSO", color: "text-destructive", bg: "bg-destructive/10" },
  pending: { label: "PENDENTE", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function MoradoresPage() {
  const router = useRouter();

  // Estados principais
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selected, setSelected] = useState<Resident | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Resident["status"]>("all");

  // Controle de Modais e Alertas
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Estados do Formulário de Cadastro
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newBlock, setNewBlock] = useState("Bloco A");
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newVip, setNewVip] = useState(false);
  const [newStatus, setNewStatus] = useState<Resident["status"]>("active");

  // Inicializa lista de moradores
  useEffect(() => {
    setResidents(mockResidents);
  }, []);

  // Busca em tempo real no banco de dados PostgreSQL do backend (segura contra SQL Injection)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search.trim()) {
        setResidents(mockResidents);
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/support/search?q=${encodeURIComponent(search)}`);
        if (response.ok) {
          const data = await response.json();
          // Converte do formato do backend para o formato do Resident do frontend
          const mappedResidents: Resident[] = data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            unit: "402", // placeholder para fins de compatibilidade visual
            block: "Bloco A",
            company: u.role === "admin" ? "Administrador (Banco)" : "Morador (Banco)",
            contact: "—",
            vip: u.role === "admin",
            status: "active",
          }));
          
          setResidents(mappedResidents);
        }
      } catch (err) {
        console.error("Erro ao buscar moradores no banco real:", err);
      }
    };

    // Adiciona debouncer simples de 300ms para evitar sobrecarga
    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Fecha alertas automaticamente
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Função para cadastrar novo morador no banco real
  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim() || !newUnit.trim() || !newContact.trim() || !newEmail.trim()) {
      setAlert({ type: "error", message: "Nome, Unidade, Contato e E-mail são obrigatórios para a integração." });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: "Password@123", // Senha temporária compatível com a regex de força de senha
          role: "resident",
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setAlert({ type: "error", message: resData.message || "Erro ao cadastrar morador." });
        return;
      }

      const initials = newName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const newResident: Resident = {
        id: resData.id || `r_${Date.now()}`,
        name: newName,
        initials: initials,
        unit: newUnit,
        block: newBlock,
        company: newCompany || "Morador Cadastrado",
        contact: newContact,
        email: newEmail,
        vip: newVip,
        status: newStatus,
      };

      setResidents([newResident, ...residents]);
      setShowAddModal(false);
      resetForm();
      setAlert({ type: "success", message: `Morador ${newName} cadastrado no PostgreSQL com sucesso!` });
    } catch (err) {
      setAlert({ type: "error", message: "Erro de conexão ao salvar morador no servidor de banco de dados." });
    }
  };

  // Alternar Status do Morador selecionado
  const toggleResidentStatus = (id: string, currentStatus: Resident["status"]) => {
    const nextStatus: Resident["status"] = currentStatus === "active" ? "suspended" : "active";
    
    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, status: nextStatus };
          if (selected && selected.id === id) {
            setSelected(updated);
          }
          return updated;
        }
        return r;
      })
    );

    setAlert({
      type: "success",
      message: `Acesso do morador ${nextStatus === "active" ? "ATIVADO" : "SUSPENSO"} com sucesso!`,
    });
  };

  // Alternar VIP do Morador selecionado
  const toggleResidentVip = (id: string, currentVip: boolean) => {
    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, vip: !currentVip };
          if (selected && selected.id === id) {
            setSelected(updated);
          }
          return updated;
        }
        return r;
      })
    );
  };

  const resetForm = () => {
    setNewName("");
    setNewUnit("");
    setNewBlock("Bloco A");
    setNewCompany("");
    setNewContact("");
    setNewEmail("");
    setNewVip(false);
    setNewStatus("active");
  };

  // Cruzamento de dados de autorizações da unidade do morador selecionado
  const residentAuthorizations = selected
    ? mockAuthorizations.filter(
        (auth) =>
          auth.hostUnit === selected.unit ||
          auth.unit === selected.unit ||
          auth.authorizedBy === selected.name
      )
    : [];

  // Filtragem da lista
  const filteredResidents = residents.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.unit.toLowerCase().includes(search.toLowerCase()) ||
      (r.company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8 min-h-full flex flex-col lg:flex-row gap-8">
      {/* Coluna Esquerda: Listagem e Controles */}
      <div className="flex-1 min-w-0">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
              CONTROLE CONDOMINIAL
            </p>
            <h1
              className="text-3xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Base de Moradores
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              {residents.length} morador{residents.length === 1 ? "" : "es"} cadastrado{residents.length === 1 ? "" : "s"} no total.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/10 self-start sm:self-auto"
          >
            <Plus size={14} />
            Adicionar Morador
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

        {/* Filtros e Busca */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar morador, unidade ou empresa..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {[
              { id: "all", label: "Todos" },
              { id: "active", label: "Ativos" },
              { id: "suspended", label: "Suspensos" },
              { id: "pending", label: "Pendentes" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  filter === f.id
                    ? "bg-primary/10 text-primary border border-primary/35 shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Cartões de Moradores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResidents.map((r) => {
            const sc = statusConfig[r.status] || statusConfig.active;
            const isSelected = selected?.id === r.id;

            // Iniciais com fallback automático
            const initials =
              r.initials ||
              r.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

            const phone = r.phone || r.contact || "—";
            const block = r.block || "Bloco Principal";

            return (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/5 border-l-4 border-l-primary"
                    : "border-border/40 hover:border-border hover:bg-muted/30 bg-card"
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                  {initials}
                </div>

                {/* Info Identidade */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {r.name}
                    </p>
                    {r.vip && (
                      <span className="px-2 py-0.5 text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md uppercase tracking-wider">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{r.company}</p>
                </div>

                {/* Unidade / Bloco */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-foreground">Ap. {r.unit}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{block}</p>
                </div>

                {/* Status */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensagem se não houver moradores */}
        {filteredResidents.length === 0 && (
          <div className="text-center py-20 bg-card/40 rounded-2xl border border-border/40">
            <Shield size={36} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-foreground font-semibold">Nenhum morador encontrado.</p>
            <p className="text-xs text-muted-foreground mt-1">Tente ajustar seus termos de busca ou filtros.</p>
          </div>
        )}
      </div>

      {/* Coluna Direita: Painel Lateral Retrátil de Detalhes */}
      {selected && (
        <div
          className="w-full lg:w-85 border border-border p-6 flex flex-col gap-5 rounded-2xl shadow-xl overflow-y-auto animate-in slide-in-from-right-5 duration-300 bg-muted"
        >
          {/* Avatar e Nome Principal */}
          <div className="text-center relative">
            {/* Botão de Fechar */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-0 right-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary mx-auto mb-3">
              {selected.initials ||
                selected.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
            </div>
            <h2
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {selected.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-[11px] text-muted-foreground">{selected.company}</span>
              {selected.vip && (
                <>
                  <span className="text-border text-[9px]">·</span>
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Perfil VIP</span>
                </>
              )}
            </div>
          </div>

          {/* Badges de Status rápidos */}
          <div className="flex justify-center gap-2">
            <span
              className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                statusConfig[selected.status]?.bg || ""
              } ${statusConfig[selected.status]?.color || ""}`}
            >
              {statusConfig[selected.status]?.label || selected.status}
            </span>
          </div>

          {/* Campos de Informações Detalhadas */}
          <div className="space-y-3.5 bg-card/50 p-4 rounded-xl border border-border">
            {[
              { label: "Unidade", value: `Apartamento ${selected.unit}`, icon: Building },
              { label: "Bloco", value: selected.block || "Bloco Principal", icon: Building },
              { label: "Telefone", value: selected.phone || selected.contact || "—", icon: Phone },
              { label: "E-mail", value: selected.email || "não cadastrado", icon: Mail },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <f.icon size={12} className="text-muted-foreground/60" />
                  {f.label}
                </span>
                <span className="font-semibold text-foreground text-[11px] truncate max-w-[155px]">
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          {/* Listagem de Visitas Autorizadas pela Unidade */}
          <div className="flex-1 flex flex-col min-h-[160px]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
              <ClipboardList size={12} />
              <span>Autorizações da Unidade</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-48 pr-1">
              {residentAuthorizations.map((auth) => (
                <div
                  key={auth.id}
                  className="p-2.5 rounded-lg border border-border bg-card/30 text-xs flex justify-between items-center gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{auth.visitorName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {auth.visitDate} • {auth.visitTime || auth.scheduledFor || "agendado"}
                    </p>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      auth.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : auth.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {auth.status === "approved" ? "APROV." : auth.status === "pending" ? "PEND." : "RECUS."}
                  </span>
                </div>
              ))}

              {residentAuthorizations.length === 0 && (
                <div className="text-center py-6 text-[11px] text-muted-foreground italic bg-card/15 rounded-lg">
                  Nenhum visitante autorizado registrado.
                </div>
              )}
            </div>
          </div>

          {/* Painel de Ações Rápidas */}
          <div className="space-y-2 mt-auto pt-3 border-t border-border">
            <button
              onClick={() => toggleResidentStatus(selected.id, selected.status)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selected.status === "active"
                  ? "bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              <ShieldAlert size={13} />
              {selected.status === "active" ? "Suspender Acesso" : "Reativar Acesso"}
            </button>

            <button
              onClick={() => toggleResidentVip(selected.id, !!selected.vip)}
              className="w-full py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Star size={13} className={selected.vip ? "text-amber-500 fill-amber-500" : ""} />
              {selected.vip ? "Remover VIP" : "Marcar como VIP"}
            </button>

            <button
              onClick={() => router.push(`/autorizacao`)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              Nova Autorização
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* === MODAL: ADICIONAR NOVO MORADOR === */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-lg rounded-2xl border border-border p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 bg-card"
          >
            {/* Fechar modal */}
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">CADASTRO INTERNO</p>
              <h2
                className="text-xl font-bold text-foreground mt-0.5"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Cadastrar Novo Morador
              </h2>
            </div>

            <form onSubmit={handleAddResident} className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do morador..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bloco */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Bloco
                  </label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="Bloco A">Bloco A: Obsidian North</option>
                    <option value="Bloco B">Bloco B: Obsidian South</option>
                    <option value="Bloco C">Bloco C: Skyline Pavilion</option>
                  </select>
                </div>

                {/* Unidade */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Unidade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 402, Penthouse B..."
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Telefone/Contato */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Telefone / Celular
                </label>
                <input
                  type="text"
                  required
                  placeholder="+55 (11) 99999-9999"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  E-mail (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Empresa/Ocupação */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Empresa / Ocupação (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Empresa, cargo ou profissão..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* VIP e Status */}
              <div className="flex items-center justify-between gap-4 bg-background/60 p-3 rounded-lg border border-border">
                <label className="flex items-center gap-2.5 text-xs text-foreground font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newVip}
                    onChange={(e) => setNewVip(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Marcar como Perfil VIP</span>
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status Inicial:</span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="px-2.5 py-1 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none"
                  >
                    <option value="active">Ativo</option>
                    <option value="pending">Pendente</option>
                    <option value="suspended">Suspenso</option>
                  </select>
                </div>
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
                    resetForm();
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
    </div>
  );
}
