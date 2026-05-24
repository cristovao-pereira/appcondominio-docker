"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockActiveVisits, mockAuthorizations, mockDevices } from "@/data/mockData";
import type { ActiveVisit, Authorization, GpsDevice } from "@/types";
import {
  LogIn,
  LogOut,
  MapPin,
  Search,
  Package,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react";

// Componente para exibir cada linha de visita ativa
function ActiveVisitRow({
  visit,
  onCheckOut,
}: {
  visit: ActiveVisit;
  onCheckOut: (id: string) => void;
}) {
  const router = useRouter();

  // Tratamento de fallbacks para garantir que nenhum campo fique em branco
  const visitorName = visit.visitorName || visit.name || "Visitante";
  const initials =
    visit.initials ||
    visitorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  const hostUnit = visit.hostUnit || visit.unit || "—";
  const checkInTime = visit.checkInTime || visit.timeIn || "—";
  const location = visit.location || (visit.deviceId ? `GPS Ativo (${visit.deviceId})` : "Portaria Central");

  // Configuração visual do Badge de acordo com o tipo de visitante
  const badgeConfig = {
    guest: { label: "Visitante", bg: "bg-primary/10 border-primary/20 text-primary" },
    maintenance: { label: "Serviço", bg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-200" },
    delivery: { label: "Entrega", bg: "bg-secondary border border-border text-foreground" },
  };

  const typeConfig = badgeConfig[visit.type as keyof typeof badgeConfig] || badgeConfig.guest;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Iniciais/Foto do visitante */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
          {initials}
        </div>

        {/* Informações da Visita */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">{visitorName}</p>
            <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-md border ${typeConfig.bg}`}>
              {typeConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-[11px] text-muted-foreground font-medium">Unidade {hostUnit}</span>
            <span className="text-border text-[9px]">·</span>
            <span className="text-[11px] text-muted-foreground font-medium">Entrada: {checkInTime}</span>
            {visit.elapsed && (
              <>
                <span className="text-border text-[9px]">·</span>
                <span className="text-[11px] text-muted-foreground">Tempo: {visit.elapsed}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 justify-end self-end sm:self-auto">
        {/* Indicador de localização / GPS */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <MapPin size={12} className="text-primary" />
          <span className="text-[11px] font-semibold text-primary">{location}</span>
        </div>

        {/* Link Ver no Mapa (apenas se tiver GPS associado) */}
        {visit.deviceId && (
          <button
            onClick={() => router.push(`/rastreamento?device=${visit.deviceId}`)}
            title="Ver localização no mapa de rastreamento"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer"
          >
            <Eye size={14} />
          </button>
        )}

        {/* Botão de Check-out */}
        <button
          onClick={() => onCheckOut(visit.id)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-bold hover:bg-destructive/20 hover:border-destructive/50 transition-all cursor-pointer"
        >
          <LogOut size={12} />
          Saída
        </button>
      </div>
    </div>
  );
}

export default function PortariaPage() {
  const [visits, setVisits] = useState<ActiveVisit[]>([]);
  const [stats, setStats] = useState({
    entries: 24,
    exits: 19,
    deliveries: 7,
    vehicles: 11,
  });

  // Estado da busca
  const [search, setSearch] = useState("");

  // Modos de ação: 'none' | 'checkin' | 'checkout' | 'delivery'
  const [scanMode, setScanMode] = useState<"none" | "checkin" | "checkout" | "delivery">("none");

  // Alerta de Notificação Temporária
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Estados dos Formulários
  const [visitorName, setVisitorName] = useState("");
  const [document, setDocument] = useState("");
  const [hostUnit, setHostUnit] = useState("");
  const [visitorType, setVisitorType] = useState<"guest" | "maintenance" | "delivery">("guest");
  const [selectedAuthId, setSelectedAuthId] = useState("");
  const [selectedGpsId, setSelectedGpsId] = useState("");

  // Formulário de Encomendas
  const [deliveryUnit, setDeliveryUnit] = useState("");
  const [deliveryCarrier, setDeliveryCarrier] = useState("");
  const [deliveryDescription, setDeliveryDescription] = useState("");

  // Inicializa o estado com as visitas ativas mockadas
  useEffect(() => {
    setVisits(mockActiveVisits);
  }, []);

  // Limpa alertas após 4 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Lista de Autorizações Aprovadas (para o Check-in Inteligente)
  const approvedAuthorizations = mockAuthorizations.filter((a) => a.status === "approved");

  // Lista de Dispositivos GPS Disponíveis (para associar ao visitante)
  const availableGpsDevices = mockDevices.filter(
    (d) => d.status === "available" && !visits.some((v) => v.deviceId === d.deviceId)
  );

  // Manipulador de Seleção de Autorização
  const handleAuthChange = (authId: string) => {
    setSelectedAuthId(authId);
    if (!authId) {
      setVisitorName("");
      setHostUnit("");
      setVisitorType("guest");
      return;
    }

    const auth = mockAuthorizations.find((a) => a.id === authId);
    if (auth) {
      setVisitorName(auth.visitorName);
      setHostUnit(auth.hostUnit || auth.unit || "");
      // Determina o tipo com base no tipo da autorização
      if (auth.type === "delivery") setVisitorType("delivery");
      else if (auth.type === "maintenance") setVisitorType("maintenance");
      else setVisitorType("guest");
    }
  };

  // Função para Registrar Entrada (Check-in)
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorName.trim() || !hostUnit.trim()) {
      setAlert({ type: "error", message: "Por favor, preencha o Nome e a Unidade do visitante." });
      return;
    }

    const newVisitId = `av_${Date.now()}`;
    const newVisit: ActiveVisit = {
      id: newVisitId,
      name: visitorName,
      visitorName: visitorName,
      type: visitorType,
      unit: `Unidade ${hostUnit}`,
      hostUnit: hostUnit,
      timeIn: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      checkInTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      elapsed: "0h 01m",
      deviceId: selectedGpsId || undefined,
      location: selectedGpsId ? `Ala Norte • Unidade ${hostUnit}` : "Portaria Central",
      initials: visitorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };

    // Adiciona à lista de visitas ativas em memória
    setVisits([newVisit, ...visits]);

    // Atualiza estatísticas do dia
    setStats((prev) => ({
      ...prev,
      entries: prev.entries + 1,
    }));

    // Se selecionou uma autorização, poderíamos removê-la ou mudá-la de status em um fluxo completo
    // Limpa campos e fecha formulário
    resetCheckInForm();
    setScanMode("none");
    setAlert({ type: "success", message: `Entrada registrada com sucesso para ${visitorName}!` });
  };

  // Função para Registrar Saída (Check-out)
  const handleCheckOut = (visitId: string) => {
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) return;

    // Remove das visitas ativas
    setVisits(visits.filter((v) => v.id !== visitId));

    // Atualiza estatísticas do dia
    setStats((prev) => ({
      ...prev,
      exits: prev.exits + 1,
    }));

    setAlert({
      type: "success",
      message: `Saída registrada para ${visit.visitorName || visit.name}. Chaveiro GPS ${
        visit.deviceId ? visit.deviceId + " " : ""
      }liberado!`,
    });
  };

  // Função para Registrar Encomenda
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryUnit.trim() || !deliveryCarrier.trim()) {
      setAlert({ type: "error", message: "Preencha a Unidade de Destino e a Transportadora." });
      return;
    }

    // Atualiza estatísticas de entregas
    setStats((prev) => ({
      ...prev,
      deliveries: prev.deliveries + 1,
    }));

    setDeliveryUnit("");
    setDeliveryCarrier("");
    setDeliveryDescription("");
    setScanMode("none");
    setAlert({
      type: "success",
      message: `Encomenda para Unidade ${deliveryUnit} registrada! Morador notificado.`,
    });
  };

  // Resetar campos do Check-in
  const resetCheckInForm = () => {
    setVisitorName("");
    setDocument("");
    setHostUnit("");
    setVisitorType("guest");
    setSelectedAuthId("");
    setSelectedGpsId("");
  };

  // Filtra as visitas com base na barra de busca
  const filteredVisits = visits.filter(
    (v) =>
      !search ||
      (v.visitorName || v.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.hostUnit || v.unit || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.deviceId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-full">
      {/* Header com Informações Gerais da Estação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            ESTAÇÃO DE CONTROLE DE ACESSO
          </p>
          <h1
            className="text-3xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Portaria Principal
          </h1>
          <div className="flex items-center gap-2.5 mt-1.5">
            <div className="w-2 h-2 rounded-full bg-[#10B981] status-pulse" />
            <p className="text-xs text-[#10B981] font-semibold">Portaria Online</p>
            <span className="text-[#424754]">·</span>
            <p className="text-xs text-[#8c909f]">
              {visits.length} visitante{visits.length === 1 ? "" : "s"} no condomínio
            </p>
          </div>
        </div>

        {/* Notificações/Alertas no Header */}
        {alert && (
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-300 ${
              alert.type === "success"
                ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                : "bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]"
            }`}
          >
            {alert.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{alert.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Esquerdo: Ações e Formulários */}
        <div className="lg:col-span-1 space-y-6">
          {/* Menu de Ações Rápidas */}
          <div
            className="rounded-2xl border border-border bg-card p-5 transition-colors duration-300"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              AÇÕES RÁPIDAS
            </p>
            <div className="space-y-3">
              {/* Botão Registrar Entrada */}
              <button
                onClick={() => {
                  setScanMode(scanMode === "checkin" ? "none" : "checkin");
                  resetCheckInForm();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all duration-200 group cursor-pointer ${
                  scanMode === "checkin"
                    ? "border-primary/50 bg-primary/10 shadow-md shadow-primary/5"
                    : "border-border/50 hover:border-border/80 hover:bg-accent/40"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                  <LogIn size={16} className="text-primary" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-foreground">Registrar Entrada</p>
                  <p className="text-[11px] text-muted-foreground truncate">Liberar acesso + vincular chaveiro GPS</p>
                </div>
              </button>

              {/* Botão Registrar Saída Rápida */}
              <button
                onClick={() => setScanMode(scanMode === "checkout" ? "none" : "checkout")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all duration-200 group cursor-pointer ${
                  scanMode === "checkout"
                    ? "border-destructive/50 bg-destructive/10 shadow-md shadow-destructive/5"
                    : "border-border/50 hover:border-border/80 hover:bg-accent/40"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                  <LogOut size={16} className="text-destructive" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-foreground">Registrar Saída</p>
                  <p className="text-[11px] text-muted-foreground truncate">Encerrar visita e recolher dispositivo GPS</p>
                </div>
              </button>

              {/* Botão Registrar Encomenda */}
              <button
                onClick={() => {
                  setScanMode(scanMode === "delivery" ? "none" : "delivery");
                  setDeliveryUnit("");
                  setDeliveryCarrier("");
                  setDeliveryDescription("");
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all duration-200 group cursor-pointer ${
                  scanMode === "delivery"
                    ? "border-amber-500/50 bg-amber-500/15 shadow-md shadow-amber-500/5"
                    : "border-border/50 hover:border-border/80 hover:bg-accent/40"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                  <Package size={16} className="text-amber-500" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-foreground">Registrar Encomenda</p>
                  <p className="text-[11px] text-muted-foreground truncate">Registrar encomendas e notificar morador</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form 1: Registrar Entrada (Check-in) */}
          {scanMode === "checkin" && (
            <form
              onSubmit={handleCheckInSubmit}
              className="rounded-2xl border border-primary/20 p-5 space-y-4 animate-in fade-in duration-300 bg-card transition-colors duration-300"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
                  REGISTRAR ENTRADA
                </p>
                <button
                  type="button"
                  onClick={resetCheckInForm}
                  className="text-[9px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase"
                >
                  Limpar
                </button>
              </div>

              {/* Check-in Inteligente: Selecionar Autorização Aprovada */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Autorização Aprovada (Opcional)
                </label>
                <select
                  value={selectedAuthId}
                  onChange={(e) => handleAuthChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="">-- Preencher Manualmente --</option>
                  {approvedAuthorizations.map((auth) => (
                    <option key={auth.id} value={auth.id}>
                      {auth.visitorName} (Ap. {auth.hostUnit}) - {auth.visitorCompany || "Social"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nome do Visitante */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do visitante..."
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* CPF / Documento */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Documento (CPF / RG)
                </label>
                <input
                  type="text"
                  placeholder="Apenas números..."
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Bloco/Unidade de Destino */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                    Unidade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 402"
                    value={hostUnit}
                    onChange={(e) => setHostUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                    Tipo de Visita
                  </label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="guest">Visitante</option>
                    <option value="maintenance">Serviço</option>
                    <option value="delivery">Entrega</option>
                  </select>
                </div>
              </div>

              {/* Chaveiro GPS / Dispositivo */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Vincular Dispositivo GPS
                </label>
                <select
                  value={selectedGpsId}
                  onChange={(e) => setSelectedGpsId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="">-- Sem Rastreamento por GPS --</option>
                  {availableGpsDevices.map((dev) => (
                    <option key={dev.id} value={dev.deviceId}>
                      {dev.deviceId} ({dev.model} - Bat: {dev.batteryLevel}%)
                    </option>
                  ))}
                </select>
                {availableGpsDevices.length === 0 && (
                  <p className="text-[10px] text-amber-500 mt-1">Nenhum chaveiro GPS livre no estoque.</p>
                )}
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-white dark:text-black text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                Confirmar Entrada
              </button>
            </form>
          )}

          {/* Form 2: Registrar Saída (Check-out) */}
          {scanMode === "checkout" && (
            <div
              className="rounded-2xl border border-destructive/20 p-5 space-y-4 animate-in fade-in duration-300 bg-card transition-colors duration-300"
            >
              <div className="border-b border-border pb-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-destructive">
                  REGISTRAR SAÍDA
                </p>
              </div>

              {visits.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">Não há visitantes ativos no condomínio atualmente.</p>
              ) : (
                <div className="space-y-2">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1">
                    Selecione o Visitante que está saindo
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                    {visits.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          handleCheckOut(v.id);
                          if (visits.length === 1) setScanMode("none");
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg border border-border hover:border-destructive/40 hover:bg-destructive/5 flex items-center justify-between text-xs transition-all group cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-destructive transition-colors">
                            {v.visitorName || v.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Unidade {v.hostUnit || v.unit}</p>
                        </div>
                        {v.deviceId ? (
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold">
                            GPS {v.deviceId}
                          </span>
                        ) : (
                          <span className="text-[9px] text-muted-foreground">Sem GPS</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form 3: Registrar Encomenda */}
          {scanMode === "delivery" && (
            <form
              onSubmit={handleDeliverySubmit}
              className="rounded-2xl border border-amber-500/20 p-5 space-y-4 animate-in fade-in duration-300 bg-card transition-colors duration-300"
            >
              <div className="border-b border-border pb-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-amber-500">
                  REGISTRAR ENCOMENDA
                </p>
              </div>

              {/* Unidade de Destino */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Unidade de Destino
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 1204"
                  value={deliveryUnit}
                  onChange={(e) => setDeliveryUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Transportadora */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Transportadora / Entregador
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mercado Livre, Correios, DHL..."
                  value={deliveryCarrier}
                  onChange={(e) => setDeliveryCarrier(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
                  Descrição do Pacote (Opcional)
                </label>
                <textarea
                  placeholder="Ex: Caixa média, envelope de documento..."
                  value={deliveryDescription}
                  onChange={(e) => setDeliveryDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                />
              </div>

              {/* Confirmar Encomenda */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-white dark:text-black text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                Registrar Encomenda
              </button>
            </form>
          )}

          {/* Estatísticas diárias da Portaria */}
          <div
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                ESTATÍSTICAS DE HOJE
              </p>
              <button
                onClick={() => setStats({ entries: 24, exits: 19, deliveries: 7, vehicles: 11 })}
                title="Reiniciar estatísticas simuladas"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <RefreshCw size={10} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Entradas", value: stats.entries, color: "text-primary", bg: "bg-primary/5 border-primary/10" },
                { label: "Saídas", value: stats.exits, color: "text-muted-foreground", bg: "bg-muted/10 border-border" },
                { label: "Entregas", value: stats.deliveries, color: "text-amber-500", bg: "bg-amber-500/5 border-amber-500/10" },
                { label: "Veículos", value: stats.vehicles, color: "text-blue-500 dark:text-blue-300", bg: "bg-blue-500/5 border-blue-500/10" },
              ].map((s) => (
                <div key={s.label} className={`p-3 rounded-xl border ${s.bg}`}>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
                  <p
                    className={`text-xl font-extrabold mt-1.5 ${s.color}`}
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Direito: Lista de Visitas Ativas */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-2xl border border-border overflow-hidden bg-card transition-colors duration-300"
          >
            {/* Header da Tabela */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-border/60 bg-muted/20">
              <div>
                <h2
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Visitas Ativas no Condomínio
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Operando com rastreamento GPS integrado</p>
              </div>

              {/* Filtro de Busca */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar visitante ou unidade..."
                  className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Linhas das Visitas Ativas */}
            <div className="p-5 space-y-3">
              {filteredVisits.map((v) => (
                <ActiveVisitRow key={v.id} visit={v} onCheckOut={handleCheckOut} />
              ))}

              {filteredVisits.length === 0 && (
                <div className="text-center py-16 px-4">
                  <CheckCircle2 size={36} className="mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-foreground font-semibold">Nenhum visitante ativo encontrado.</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    {search ? "Tente buscar usando outros termos de pesquisa." : "Use o painel ao lado para registrar uma nova entrada."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
