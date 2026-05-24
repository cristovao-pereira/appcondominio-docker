"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockDevices, mockAuditEvents } from "@/data/mockData";
import type { GpsDevice, DeviceStatus, AuditEvent } from "@/types";
import {
  Radio,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  MapPin,
  Clock,
  Battery,
  Shield,
  Trash2,
  User,
} from "lucide-react";

// Configurações visuais dos status dos dispositivos em pt-BR
const statusConfig: Record<DeviceStatus, { label: string; color: string; bg: string; dot: string }> = {
  in_use: { label: "EM USO", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
  available: { label: "DISPONÍVEL", color: "text-primary", bg: "bg-primary/10", dot: "bg-primary/60" },
  maintenance: { label: "MANUTENÇÃO", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-500" },
  offline: { label: "OFFLINE", color: "text-muted-foreground", bg: "bg-muted", dot: "bg-muted-foreground/50" },
  charging: { label: "CARREGANDO", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-500" },
  active: { label: "ATIVO", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
  idle: { label: "OCIOSO", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-500" },
};

// Componente gráfico do indicador de bateria (células)
function BatteryIndicator({ level }: { level: number }) {
  const color = level > 60 ? "text-emerald-600 dark:text-emerald-400" : level > 25 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400";
  const isCritical = level <= 20;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-[2px]">
        {[25, 50, 75, 100].map((threshold) => (
          <div
            key={threshold}
            className={`w-1.5 rounded-sm transition-all ${
              level >= threshold ? color.replace("text-", "bg-") : "bg-border"
            }`}
            style={{ height: `${(threshold / 100) * 12 + 4}px` }}
          />
        ))}
      </div>
      <span className={`text-[11px] font-bold ${color} ${isCritical ? "animate-pulse" : ""}`}>
        {level}%
      </span>
    </div>
  );
}

export default function DispositivosPage() {
  const router = useRouter();

  // Estado local para a frota de dispositivos GPS
  const [devices, setDevices] = useState<GpsDevice[]>(() => [...mockDevices]);

  // Dispositivo selecionado
  const [selected, setSelected] = useState<GpsDevice | null>(null);

  // Modal de cadastro
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Estados de simulação de ping
  const [isPingin, setIsPingin] = useState(false);
  const [pingResult, setPingResult] = useState<{ latency: number; signal: number } | null>(null);

  // Notificações temporárias (Toast)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Define o dispositivo selecionado inicial
  useEffect(() => {
    if (devices.length > 0 && !selected) {
      setSelected(devices[0]);
    }
  }, [devices, selected]);

  // Sincroniza estado local com o mockData global para manter a consistência nas rotas
  const updateDevicesState = (newDevices: GpsDevice[]) => {
    setDevices(newDevices);
    mockDevices.length = 0;
    mockDevices.push(...newDevices);
  };

  // Handler de sincronização da frota (Simulada)
  const handleSyncAll = () => {
    showToast("Telemetria da frota sincronizada com o satélite!");
  };

  // Redireciona para o mapa com filtro de dispositivo
  const handleTrackLive = (deviceId: string) => {
    router.push(`/rastreamento?device=${deviceId}`);
  };

  // Dispara o ping de teste de rádio frequência
  const handlePingDevice = () => {
    if (!selected) return;
    setIsPingin(true);
    setPingResult(null);

    setTimeout(() => {
      setIsPingin(false);
      const randomLatency = Math.floor(Math.random() * 60) + 15; // 15ms a 75ms
      const randomSignal = Math.floor(Math.random() * 30) + 70; // 70% a 100%
      setPingResult({ latency: randomLatency, signal: randomSignal });
      showToast(`Ping respondido: ${randomLatency}ms • Sinal em ${randomSignal}%`);
    }, 1200);
  };

  // Transições de carga e manutenção
  const handleSendToMaintenance = () => {
    if (!selected) return;

    const updatedDevice: GpsDevice = {
      ...selected,
      status: "maintenance",
      batteryLevel: 0,
      battery: 0,
      location: "Bancada de Manutenção / Lab",
      assignedTo: undefined,
    };

    const updated = devices.map((d) => (d.id === selected.id ? updatedDevice : d));
    updateDevicesState(updated);
    setSelected(updatedDevice);
    showToast(`Dispositivo ${selected.deviceId} enviado para manutenção.`);

    // Registra auditoria
    const audit: AuditEvent = {
      id: `ae_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      userInitials: "MC",
      userName: "Marcus Caldwell",
      action: "Manutenção de Hardware",
      actionType: "check_out",
      condoUnit: "Laboratório",
      details: `Dispositivo GPS ${selected.deviceId} desvinculado e enviado para manutenção/reparo.`,
      category: "system",
    };
    mockAuditEvents.unshift(audit);
  };

  const handleChargeDevice = () => {
    if (!selected) return;

    const updatedDevice: GpsDevice = {
      ...selected,
      status: "charging",
      batteryLevel: 45, // Inicia recarregando
      battery: 45,
      location: "Rack de Carga Principal",
      assignedTo: undefined,
    };

    const updated = devices.map((d) => (d.id === selected.id ? updatedDevice : d));
    updateDevicesState(updated);
    setSelected(updatedDevice);
    showToast(`Dispositivo ${selected.deviceId} conectado ao carregador.`);
  };

  const handleCompleteMaintenance = () => {
    if (!selected) return;

    const updatedDevice: GpsDevice = {
      ...selected,
      status: "available",
      batteryLevel: 100,
      battery: 100,
      location: "Gaveteiro de Dispositivos Livres",
      assignedTo: undefined,
      lastSync: "Agora mesmo",
    };

    const updated = devices.map((d) => (d.id === selected.id ? updatedDevice : d));
    updateDevicesState(updated);
    setSelected(updatedDevice);
    showToast(`Manutenção concluída! Dispositivo ${selected.deviceId} liberado com 100% de bateria.`);

    // Registra auditoria
    const audit: AuditEvent = {
      id: `ae_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      userInitials: "MC",
      userName: "Marcus Caldwell",
      action: "Hardware Liberado",
      actionType: "check_in",
      condoUnit: "Estoque",
      details: `Dispositivo GPS ${selected.deviceId} calibrado, carregado a 100% e retornado ao estoque livre.`,
      category: "system",
    };
    mockAuditEvents.unshift(audit);
  };

  // Excluir dispositivo
  const handleDeleteDevice = (id: string, deviceId: string) => {
    if (!confirm(`Tem certeza de que deseja excluir o dispositivo ${deviceId}?`)) return;

    const updated = devices.filter((d) => d.id !== id);
    updateDevicesState(updated);
    setSelected(updated[0] || null);
    showToast(`Dispositivo ${deviceId} removido do inventário.`);
  };

  // Cadastra novo dispositivo
  const handleRegisterDevice = (deviceId: string, model: string, batteryLevel: number, status: DeviceStatus) => {
    if (devices.some((d) => d.deviceId.toLowerCase() === deviceId.toLowerCase())) {
      showToast("Já existe um dispositivo registrado com este ID!", "error");
      return;
    }

    const newDevice: GpsDevice = {
      id: `d_${Date.now()}`,
      deviceId,
      model,
      status,
      batteryLevel,
      battery: batteryLevel,
      lastSync: "Aguardando sincronização",
      location: status === "maintenance" ? "Bancada de Manutenção" : "Gaveteiro de Dispositivos Livres",
    };

    const updated = [...devices, newDevice];
    updateDevicesState(updated);
    setSelected(newDevice);
    setIsRegisterOpen(false);
    showToast(`Dispositivo ${deviceId} registrado com sucesso!`);
  };

  // Métricas superiores consolidadas
  const activeCount = devices.filter((d) => d.status === "in_use" || d.status === "active").length;
  const offlineCount = devices.filter((d) => d.status === "offline").length;
  const maintenanceCount = devices.filter((d) => d.status === "maintenance").length;
  const availableCount = devices.filter((d) => d.status === "available" || d.status === "charging").length;
  
  const avgBattery = devices.length
    ? Math.round(devices.reduce((a, b) => a + (b.battery ?? b.batteryLevel ?? 0), 0) / devices.length)
    : 0;

  return (
    <div className="p-8 min-h-full relative text-foreground">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl border flex items-center gap-2 shadow-2xl animate-fade-in ${
            toastMessage.type === "error"
              ? "bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400"
              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {toastMessage.type === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            Controle de Ativos • Concierge OS
          </p>
          <h1
            className="text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Frotas GPS / Dispositivos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitore o estoque de chaveiros GPS, níveis de carga, integridade de sinal e vinculação ativa de visitantes.
          </p>
        </div>
        
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold hover:bg-primary/95 active:scale-95 transition-all shadow-lg shadow-primary/10 self-start md:self-auto"
        >
          <Plus size={16} />
          Registrar Dispositivo
        </button>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Dispositivos Totais", value: devices.length, icon: Radio, color: "text-primary", bg: "bg-primary/10" },
          { label: "Em Uso (Ativos)", value: activeCount, icon: Wifi, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Disponíveis / Carga", value: availableCount, icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
          { label: "Bateria Média", value: `${avgBattery}%`, icon: Zap, color: avgBattery > 50 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400", bg: avgBattery > 50 ? "bg-emerald-500/10" : "bg-red-500/10" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Inventário de Dispositivos */}
        <div
          className="lg:col-span-2 rounded-2xl border border-border overflow-hidden shadow-lg bg-card"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-manrope)" }}>
              Inventário de Rastreadores
            </h2>
            <button
              onClick={handleSyncAll}
              className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-all uppercase tracking-wider bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg"
            >
              <RefreshCw size={12} />
              Sincronizar Satélite
            </button>
          </div>

          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            <p className="col-span-3">Dispositivo</p>
            <p className="col-span-3">Vinculado A</p>
            <p className="col-span-3">Última Posição</p>
            <p className="col-span-2">Bateria</p>
            <p className="col-span-1 text-right">Status</p>
          </div>

          {/* Linhas da Tabela */}
          <div className="divide-y divide-border">
            {devices.map((device) => {
              const sc = statusConfig[device.status];
              const isSelected = selected?.id === device.id;
              const batteryLvl = device.battery ?? device.batteryLevel ?? 0;

              return (
                <div
                  key={device.id}
                  onClick={() => {
                    setSelected(device);
                    setPingResult(null);
                  }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all items-center ${
                    isSelected
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-muted/30"
                  }`}
                >
                  {/* Identificador / Modelo */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Radio size={14} className="text-primary" />
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${sc.dot} shadow-sm`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">{device.deviceId}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{device.model}</p>
                    </div>
                  </div>

                  {/* Portador */}
                  <div className="col-span-3 flex items-center">
                    {device.assignedTo ? (
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <User size={11} className="text-muted-foreground" />
                        {device.assignedTo}
                      </span>
                    ) : (
                      <span className="text-[11px] italic text-muted-foreground/50">Livre</span>
                    )}
                  </div>

                  {/* Última Localização */}
                  <div className="col-span-3 flex items-center min-w-0">
                    <span className="text-xs text-muted-foreground truncate font-medium flex items-center gap-1">
                      <MapPin size={11} className="text-muted-foreground/60" />
                      {device.location || "Guarita"}
                    </span>
                  </div>

                  {/* Bateria */}
                  <div className="col-span-2 flex items-center">
                    <BatteryIndicator level={batteryLvl} />
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1 flex items-center justify-end">
                    <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase border ${sc.bg} ${sc.color} border-border whitespace-nowrap`}>
                      {sc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: Detalhes do Dispositivo */}
        <div className="space-y-4">
          {selected ? (
            <div
              className="rounded-2xl border border-border p-5 shadow-lg bg-card"
            >
              {/* Cabeçalho de detalhes */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Radio size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selected.deviceId}</h3>
                    <p className="text-[10px] text-muted-foreground">{selected.model}</p>
                  </div>
                </div>
                
                {/* Excluir */}
                <button
                  onClick={() => handleDeleteDevice(selected.id, selected.deviceId)}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
                  title="Remover Dispositivo"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Status e Info Grid */}
              <div className="space-y-3 mb-5">
                {[
                  { label: "Status Operacional", value: statusConfig[selected.status].label, highlight: true },
                  { label: "Portador Atual", value: selected.assignedTo ?? "Livre / Disponível" },
                  { label: "Última Posição Registrada", value: selected.location || "Armazenado" },
                  { label: "Última Sincronização", value: selected.lastSync },
                  { label: "Sinal do Satélite (GPS)", value: selected.signal ? `${selected.signal}` : "95% (Excelente)" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between text-xs py-1 border-b border-border last:border-0 pb-1.5 last:pb-0">
                    <span className="text-muted-foreground font-medium">{f.label}</span>
                    <span className={`font-semibold ${f.highlight ? "text-primary" : "text-foreground"}`}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Telemetria da Bateria */}
              <div className="bg-muted/60 border border-border rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Capacidade de Bateria</span>
                  <span className="text-xs font-bold text-foreground">
                    {selected.battery ?? selected.batteryLevel ?? 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      (selected.battery ?? selected.batteryLevel ?? 0) > 60
                        ? "bg-emerald-500"
                        : (selected.battery ?? selected.batteryLevel ?? 0) > 25
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${selected.battery ?? selected.batteryLevel ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Ping Console (Comando Técnico de Rádio) */}
              <div className="bg-muted/60 border border-border rounded-xl p-4 mb-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Comando Técnico de Rádio</p>
                
                {isPingin ? (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <RefreshCw size={16} className="text-primary animate-spin mb-1" />
                    <span className="text-[10px] text-muted-foreground font-mono">ENVIANDO SINAL DE PING...</span>
                  </div>
                ) : pingResult ? (
                  <div className="space-y-1.5 font-mono text-[10px] text-primary">
                    <p>&gt; PING RESPONDIDO COM SUCESSO</p>
                    <p>&gt; Latência: {pingResult.latency}ms (Estável)</p>
                    <p>&gt; Integridade de Rádio: {pingResult.signal}%</p>
                    <button
                      onClick={handlePingDevice}
                      className="mt-2 text-[9px] text-muted-foreground hover:text-foreground underline block"
                    >
                      Testar Novamente
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handlePingDevice}
                    className="w-full py-2 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Wifi size={13} />
                    Testar Conexão (Ping)
                  </button>
                )}
              </div>

              {/* Botões de Ação de Carga e Rastreamento */}
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                
                {selected.status === "in_use" && (
                  <button
                    onClick={() => handleTrackLive(selected.deviceId)}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                  >
                    <MapPin size={13} />
                    Rastrear ao Vivo no Mapa
                  </button>
                )}

                {selected.status === "maintenance" ? (
                  <button
                    onClick={handleCompleteMaintenance}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black text-xs font-extrabold hover:bg-emerald-600/90 dark:hover:bg-emerald-500/90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap size={13} />
                    Concluir Manutenção / Carga
                  </button>
                ) : (
                  <>
                    {selected.status !== "in_use" && selected.status !== "charging" && (
                      <button
                        onClick={handleChargeDevice}
                        className="w-full py-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Zap size={13} />
                        Conectar ao Carregador
                      </button>
                    )}
                    {selected.status !== "in_use" && (
                      <button
                        onClick={handleSendToMaintenance}
                        className="w-full py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border active:scale-95 transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <AlertTriangle size={13} />
                        Enviar para Manutenção
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border p-5 text-center text-muted-foreground bg-card/50 py-12">
              <p className="text-xs italic">Selecione um chaveiro GPS para ver telemetria em tempo real.</p>
            </div>
          )}

          {/* Fleet Health Panel */}
          <div
            className="rounded-2xl border border-border p-5 shadow-lg bg-card"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Saúde de Conexão da Frota
            </p>
            <div className="space-y-4">
              {[
                {
                  label: "Taxa de Disponibilidade",
                  value: `${availableCount + activeCount}/${devices.length} online`,
                  pct: devices.length ? Math.round(((availableCount + activeCount) / devices.length) * 100) : 0,
                  color: "bg-emerald-500",
                },
                {
                  label: "Média de Carga das Baterias",
                  value: `${avgBattery}%`,
                  pct: avgBattery,
                  color: avgBattery > 60 ? "bg-emerald-500" : avgBattery > 25 ? "bg-orange-500" : "bg-red-500",
                },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-muted-foreground font-medium">{s.label}</span>
                    <span className="font-bold text-foreground">{s.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR NOVO DISPOSITIVO GPS                                     */}
      {/* ========================================================================= */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setIsRegisterOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>

            {/* Título */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <Radio size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Registrar Dispositivo GPS</h2>
            </div>

            {/* Formulário */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const deviceId = (data.get("deviceId") as string).trim().toUpperCase();
                const model = data.get("model") as string;
                const battery = Number(data.get("battery"));
                const status = data.get("status") as DeviceStatus;

                if (!deviceId) {
                  showToast("O identificador do dispositivo é obrigatório!", "error");
                  return;
                }

                handleRegisterDevice(deviceId, model, battery, status);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  ID do Dispositivo (Código Único) *
                </label>
                <input
                  name="deviceId"
                  required
                  placeholder="Ex: OBX-3105, OBX-9042"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Modelo de Chaveiro
                </label>
                <select
                  name="model"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="Ultra-Narrowband V4" className="bg-card text-foreground">Ultra-Narrowband V4 (Alta Fidelidade)</option>
                  <option value="Asset Tag Mini" className="bg-card text-foreground">Asset Tag Mini (Discreto)</option>
                  <option value="Standard Hub V3" className="bg-card text-foreground">Standard Hub V3 (Padrão)</option>
                  <option value="Nano-Tag V1" className="bg-card text-foreground">Nano-Tag V1 (Micro Chaveiro)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Carga Inicial de Bateria (%)
                  </label>
                  <input
                    name="battery"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={100}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Status Inicial
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="available" className="bg-card text-foreground">Disponível (Estoque)</option>
                    <option value="maintenance" className="bg-card text-foreground">Em Manutenção</option>
                  </select>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border transition-all text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all text-center"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
