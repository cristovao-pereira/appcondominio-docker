"use client";

import { useState, useEffect } from "react";
import { mockCondo, mockBlocks } from "@/data/mockData";
import type { Condo, Block } from "@/types";
import {
  Building2,
  MapPin,
  Home,
  Users,
  Grid3X3,
  CheckCircle2,
  Pencil,
  Wifi,
  Bell,
  Shield,
  Clock,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react";

export default function ConfiguracoesPage() {
  // Estados principais reativos
  const [condo, setCondo] = useState<Condo | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Estados de Configurações Operacionais
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [preAuthEnabled, setPreAuthEnabled] = useState(true);
  const [auditLogEnabled, setAuditLogEnabled] = useState(true);

  // Controle de Modais e Alertas
  const [showEditModal, setShowEditModal] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Campos do Formulário de Edição do Condomínio
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editNeighborhood, setEditNeighborhood] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCapacity, setEditCapacity] = useState(480);

  // Inicializa dados do mock
  useEffect(() => {
    setCondo(mockCondo);
    setBlocks(mockBlocks);
  }, []);

  // Limpa alertas após 4 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (!condo) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Carregando configurações...
      </div>
    );
  }

  const occupancy = Math.round(((condo.occupiedUnits ?? 0) / (condo.totalUnits ?? 1)) * 100);

  // Abre modal preenchendo os dados atuais
  const openEditModal = () => {
    setEditName(condo.name);
    setEditType(condo.type);
    setEditAddress(condo.address);
    setEditNeighborhood(condo.neighborhood);
    setEditCity(condo.city || "");
    setEditCapacity(condo.unitCapacity);
    setShowEditModal(true);
  };

  // Salvar informações do Condomínio
  const handleSaveCondo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim() || !editAddress.trim()) {
      setAlert({ type: "error", message: "Nome e Endereço são obrigatórios." });
      return;
    }

    const updatedCondo: Condo = {
      ...condo,
      name: editName,
      type: editType,
      address: editAddress,
      neighborhood: editNeighborhood,
      city: editCity,
      unitCapacity: editCapacity,
    };

    setCondo(updatedCondo);
    // Sincroniza no mock global
    mockCondo.name = editName;
    mockCondo.type = editType;
    mockCondo.address = editAddress;
    mockCondo.neighborhood = editNeighborhood;
    mockCondo.city = editCity;
    mockCondo.unitCapacity = editCapacity;

    setShowEditModal(false);
    setAlert({ type: "success", message: "Informações do condomínio atualizadas com sucesso!" });
  };

  // Alternar status do Bloco (Ativo / Planejamento)
  const toggleBlockStatus = (blockId: string) => {
    const updatedBlocks = blocks.map((b) => {
      if (b.id === blockId) {
        const nextStatus: "active" | "planning" = b.status === "active" ? "planning" : "active";
        return { ...b, status: nextStatus };
      }
      return b;
    });

    setBlocks(updatedBlocks);
    
    // Sincroniza no mock global
    const foundIndex = mockBlocks.findIndex((b) => b.id === blockId);
    if (foundIndex > -1) {
      mockBlocks[foundIndex].status = mockBlocks[foundIndex].status === "active" ? "planning" : "active";
    }

    const block = updatedBlocks.find((b) => b.id === blockId);
    setAlert({
      type: "success",
      message: `Status do Bloco ${block?.name} alterado para: ${
        block?.status === "active" ? "ATIVO" : "PLANEJAMENTO"
      }!`,
    });
  };

  // Notificador auxiliar de chaveamento
  const notifyToggle = (label: string, enabled: boolean) => {
    setAlert({
      type: "success",
      message: `Configuração de "${label}" foi ${enabled ? "DESATIVADA" : "ATIVADA"}!`,
    });
  };

  return (
    <div className="p-8 min-h-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            CONFIGURAÇÕES DO SISTEMA
          </p>
          <h1
            className="text-3xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {condo.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <MapPin size={13} className="text-muted-foreground/60" />
            {condo.address} {condo.city ? `• ${condo.city}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="px-3 py-1.5 text-[9px] font-extrabold tracking-wider rounded-md bg-[#10B981]/15 border border-[#10B981]/25 text-[#10B981] uppercase">
            ATIVO
          </span>
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/40 bg-card/40 text-xs font-bold text-foreground hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm"
          >
            <Pencil size={12} />
            Editar Condomínio
          </button>
        </div>
      </div>

      {/* Alerta temporário */}
      {alert && (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-300 ${
            alert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          {alert.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Cartões Estatísticos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total de Unidades",
            value: condo.totalUnits ?? 0,
            sub: `${condo.occupiedUnits} ocupadas`,
            icon: Home,
            color: "text-primary",
            bg: "bg-primary/10 border-primary/15",
          },
          {
            label: "Moradores",
            value: condo.residents ?? 0,
            sub: "cadastros ativos",
            icon: Users,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/15",
          },
          {
            label: "Blocos Cadastrados",
            value: blocks.length,
            sub: `${blocks.filter((b) => b.status === "active").length} blocos ativos`,
            icon: Grid3X3,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/15",
          },
          {
            label: "Taxa de Ocupação",
            value: `${occupancy}%`,
            sub: `${condo.occupiedUnits}/${condo.totalUnits} ocupações`,
            icon: Building2,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/15",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border border-border/40 bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
              <div
                className={`w-8 h-8 rounded-xl ${s.bg} border flex items-center justify-center`}
              >
                <s.icon size={14} className={s.color} />
              </div>
            </div>
            <p
              className="text-2xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Estrutura principal de dois painéis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel 1: Informações Gerais */}
        <div
          className="rounded-2xl border border-border/40 p-6 flex flex-col justify-between bg-card"
        >
          <div>
            <h2 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2 border-b border-border/40 pb-2">
              <Building2 size={16} className="text-primary" />
              Informações Gerais do Condomínio
            </h2>
            <dl className="space-y-4">
              {[
                { label: "Nome", value: condo.name },
                { label: "Tipo de Imóvel", value: condo.type },
                { label: "Endereço Físico", value: condo.address },
                { label: "Bairro", value: condo.neighborhood },
                { label: "Cidade / UF", value: condo.city || "—" },
                {
                  label: "Capacidade Geral",
                  value: `${condo.unitCapacity} unidades máximas`,
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start text-xs">
                  <dt className="text-muted-foreground font-semibold w-32 flex-shrink-0">
                    {item.label}
                  </dt>
                  <dd className="text-foreground/80 text-right font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Painel 2: Configurações Operacionais */}
        <div
          className="rounded-2xl border border-border/40 p-6 bg-card"
        >
          <h2 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2 border-b border-border/40 pb-2">
            <Shield size={16} className="text-primary" />
            Configurações e Segurança Operacional
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: Wifi,
                label: "Rastreamento GPS",
                desc: "Habilita rastreamento de chaveiros ativos no mapa",
                enabled: gpsEnabled,
                toggle: () => {
                  setGpsEnabled(!gpsEnabled);
                  notifyToggle("Rastreamento GPS", gpsEnabled);
                },
              },
              {
                icon: Bell,
                label: "Alertas de Segurança",
                desc: "Notificações críticas para desvios de rotas e pânicos",
                enabled: alertsEnabled,
                toggle: () => {
                  setAlertsEnabled(!alertsEnabled);
                  notifyToggle("Alertas de Segurança", alertsEnabled);
                },
              },
              {
                icon: CheckCircle2,
                label: "Exigir Autorização Prévia",
                desc: "Apenas visitantes com agendamento podem ingressar",
                enabled: preAuthEnabled,
                toggle: () => {
                  setPreAuthEnabled(!preAuthEnabled);
                  notifyToggle("Autorização Prévia", preAuthEnabled);
                },
              },
              {
                icon: Clock,
                label: "Log de Auditoria Completo",
                desc: "Registro de auditoria redundante habilitado localmente",
                enabled: auditLogEnabled,
                toggle: () => {
                  setAuditLogEnabled(!auditLogEnabled);
                  notifyToggle("Log de Auditoria", auditLogEnabled);
                },
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border/40"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-xs">{item.desc}</p>
                  </div>
                </div>

                {/* Switch Toggle Animado */}
                <button
                  type="button"
                  onClick={item.toggle}
                  className="focus:outline-none cursor-pointer flex-shrink-0"
                >
                  {item.enabled ? (
                    <ToggleRight size={28} className="text-primary transition-all" />
                  ) : (
                    <ToggleLeft size={28} className="text-muted-foreground transition-all" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel 3: Gestão de Estrutura de Blocos */}
      <div
        className="rounded-2xl border border-border/40 p-6 bg-card"
      >
        <h2 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2 border-b border-border/40 pb-2">
          <Grid3X3 size={16} className="text-primary" />
          Gestão de Blocos do Condomínio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-border/40 bg-background/60 flex flex-col justify-between gap-4 transition-all hover:border-border"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">{b.fullName}</p>
                  <span
                    className={`px-2 py-0.5 text-[8px] font-extrabold uppercase rounded ${
                      b.status === "active"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {b.status === "active" ? "ATIVO" : "PLANEJAMENTO"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {b.units ? b.units.length : 0} unidades integradas
                </p>
              </div>

              {/* Ação de status do Bloco */}
              <button
                onClick={() => toggleBlockStatus(b.id)}
                className="w-full py-1.5 rounded-lg border border-border text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer text-center"
              >
                Alternar Status do Bloco
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* === MODAL: EDITAR INFORMAÇÕES DO CONDOMÍNIO === */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-lg rounded-2xl border border-border p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 bg-card"
          >
            {/* Fechar modal */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">CADASTRO ADMINISTRATIVO</p>
              <h2
                className="text-xl font-bold text-foreground mt-0.5"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Editar Informações do Condomínio
              </h2>
            </div>

            <form onSubmit={handleSaveCondo} className="space-y-4">
              {/* Nome do Condomínio */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Nome do Condomínio
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tipo de Condomínio */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Tipo do Condomínio
                  </label>
                  <input
                    type="text"
                    required
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                {/* Capacidade máxima */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Capacidade de Unidades
                  </label>
                  <input
                    type="number"
                    required
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Endereço Físico
                </label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bairro */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    required
                    value={editNeighborhood}
                    onChange={(e) => setEditNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Cidade / UF
                  </label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Botões do Formulário */}
              <div className="flex gap-3 pt-3 border-t border-border">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer text-center"
                >
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
