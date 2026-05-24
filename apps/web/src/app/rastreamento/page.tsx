"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockDevices } from "@/data/mockData";
import type { GpsDevice } from "@/types";
import {
  Radio,
  RefreshCw,
  Layers,
  ZoomIn,
  ZoomOut,
  Search,
  Filter,
  ShieldAlert,
  Battery,
  User,
  Building,
  Clock,
  Compass,
  MapPin,
  CheckCircle2,
} from "lucide-react";

// Definição dos tipos estendidos para coordenadas em percentual na tela
interface ExtendedGpsDevice extends GpsDevice {
  x: number; // posição horizontal em %
  y: number; // posição vertical em %
  trail: { x: number; y: number }[]; // histórico de posições
}

const statusDot: Record<GpsDevice["status"], string> = {
  active: "bg-[#10B981]",
  idle: "bg-[#ffb786]",
  offline: "bg-[#8c909f]/50",
  charging: "bg-[#b1c6f9]",
  in_use: "bg-[#10B981]",
  available: "bg-[#adc6ff]/50",
  maintenance: "bg-[#ffb786]",
};

const statusLabel: Record<GpsDevice["status"], { label: string; color: string }> = {
  active: { label: "ATIVO", color: "text-[#10B981]" },
  idle: { label: "OCIOSO", color: "text-[#ffb786]" },
  offline: { label: "OFFLINE", color: "text-[#8c909f]" },
  charging: { label: "CARREGANDO", color: "text-[#b1c6f9]" },
  in_use: { label: "EM USO", color: "text-[#10B981]" },
  available: { label: "DISPONÍVEL", color: "text-[#adc6ff]" },
  maintenance: { label: "MANUT.", color: "text-[#ffb786]" },
};

function BatteryBar({ level }: { level: number }) {
  const color =
    level > 60 ? "bg-[#10B981]" : level > 25 ? "bg-[#ffb786]" : "bg-[#ffb4ab]";
  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      <div className="w-12 h-1.5 bg-[#424754]/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-[10px] text-[#8c909f] font-mono">{level}%</span>
    </div>
  );
}

function RastreamentoContent() {
  const searchParams = useSearchParams();
  const deviceParam = searchParams ? searchParams.get("device") : null;

  // Estado dos dispositivos com coordenadas de simulação e rastro
  const [devices, setDevices] = useState<ExtendedGpsDevice[]>([]);
  const [selected, setSelected] = useState<ExtendedGpsDevice | null>(null);

  // Estados dos controles do mapa
  const [zoom, setZoom] = useState(1.0);
  const [mapStyle, setMapStyle] = useState<"schema" | "blueprint">("schema"); // 'schema' = radar/grade, 'blueprint' = satélite/esquema técnico
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "in_use" | "available" | "low_battery">("all");

  // Estado para disparar alerta sonoro/visual de emergência
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  // Inicializa os dispositivos com posições iniciais simuladas
  useEffect(() => {
    const initialCoordinates: Record<string, { x: number; y: number }> = {
      d1: { x: 32, y: 25 },  // Perto do Bloco A
      d3: { x: 74, y: 40 },  // Perto do Bloco B
      d6: { x: 55, y: 35 },  // Perto da Piscina
      d2: { x: 28, y: 80 },  // Guardado na Portaria (afastado do card para não sobrepor)
      d4: { x: 30, y: 85 },  // Guardado na Portaria (afastado do card para não sobrepor)
      d5: { x: 32, y: 80 },  // Guardado na Portaria (afastado do card para não sobrepor)
    };

    const extended = mockDevices.map((d) => {
      const coords = initialCoordinates[d.id] || { x: 50, y: 50 };
      return {
        ...d,
        x: coords.x,
        y: coords.y,
        trail: [
          { x: coords.x - 4, y: coords.y + 4 },
          { x: coords.x - 2, y: coords.y - 2 },
          { x: coords.x, y: coords.y }
        ],
      };
    });

    setDevices(extended);
  }, []);

  // Seleciona o dispositivo enviado por query param (URL)
  useEffect(() => {
    if (deviceParam && devices.length > 0) {
      const found = devices.find((d) => d.deviceId === deviceParam);
      if (found) {
        setSelected(found);
      }
    }
  }, [deviceParam, devices]);

  // Rotina de simulação de movimento em tempo real (setInterval a cada 4 segundos)
  useEffect(() => {
    if (devices.length === 0) return;

    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((d) => {
          // Apenas dispositivos em uso ou ativos se movem
          if (d.status !== "in_use" && d.status !== "active") return d;

          // Gera deslocamento sutil de -3% a +3%
          const deltaX = (Math.random() - 0.5) * 6;
          const deltaY = (Math.random() - 0.5) * 6;

          // Garante que o dispositivo fique dentro de limites do mapa (15% a 85%)
          const newX = Math.min(Math.max(d.x + deltaX, 15), 85);
          const newY = Math.min(Math.max(d.y + deltaY, 15), 85);

          // Atualiza histórico do rastro (mantém as últimas 5 posições)
          const newTrail = [...d.trail, { x: newX, y: newY }].slice(-5);

          const updated = {
            ...d,
            x: Number(newX.toFixed(2)),
            y: Number(newY.toFixed(2)),
            trail: newTrail,
          };

          // Se for o selecionado, atualiza o estado também
          if (selected && selected.id === d.id) {
            setSelected(updated);
          }

          return updated;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [devices, selected]);

  // Funções de Zoom
  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 1.8));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.6));
  const resetZoom = () => setZoom(1.0);

  // Manipulador de pings de emergência
  const triggerEmergency = (deviceId: string) => {
    setEmergencyAlert(deviceId);
    setTimeout(() => setEmergencyAlert(null), 5000);
  };

  // Filtragem dos dispositivos
  const filteredDevices = devices.filter((d) => {
    // Busca por texto (nome do visitante ou ID do dispositivo)
    const matchesSearch =
      (d.assignedTo || "").toLowerCase().includes(search.toLowerCase()) ||
      d.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      (d.location || "").toLowerCase().includes(search.toLowerCase());

    // Filtro rápido de status
    if (statusFilter === "in_use") {
      return matchesSearch && (d.status === "in_use" || d.status === "active");
    }
    if (statusFilter === "available") {
      return matchesSearch && d.status === "available";
    }
    if (statusFilter === "low_battery") {
      return matchesSearch && d.batteryLevel < 25;
    }

    return matchesSearch;
  });

  const activeCount = devices.filter((d) => d.status === "in_use" || d.status === "active").length;

  return (
    <div className="flex h-full" style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Área Principal do Mapa */}
      <div className="flex-1 relative overflow-hidden select-none bg-muted transition-colors duration-300">
        {/* Planta Baixa e Grade do Mapa */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Fundo do Mapa (Blueprint / Schema) */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              mapStyle === "schema"
                ? "bg-background dark:bg-[#0c1424] opacity-100"
                : "bg-muted/60 dark:bg-[#090f1a] opacity-90"
            }`}
          >
            {/* Grade Técnica Dinâmica */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `
                  linear-gradient(var(--border) 1px, transparent 1px),
                  linear-gradient(90deg, var(--border) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
            {mapStyle === "blueprint" && (
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, #4d8eff 2px, transparent 2px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            )}
          </div>

          {/* === Estruturas Físicas Simuladas (Planta Baixa) === */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Bloco A (Obsidian North) */}
            <div
              className="absolute w-[220px] h-[130px] rounded-xl border-2 border-dashed border-primary/20 bg-card/40 flex flex-col justify-between p-3"
              style={{ top: "15%", left: "20%" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Obsidian North</span>
                <span className="text-[9px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Bloco A</span>
              </div>
              <p className="text-[9px] text-muted-foreground">Zona Residencial (Aps 101 - 604)</p>
            </div>

            {/* Bloco B (Obsidian South) */}
            <div
              className="absolute w-[220px] h-[130px] rounded-xl border-2 border-dashed border-primary/20 bg-card/40 flex flex-col justify-between p-3"
              style={{ top: "35%", left: "62%" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Obsidian South</span>
                <span className="text-[9px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Bloco B</span>
              </div>
              <p className="text-[9px] text-muted-foreground">Coberturas e Área Executiva</p>
            </div>

            {/* Piscina & Área de Lazer */}
            <div
              className="absolute w-[140px] h-[100px] rounded-full border border-sky-500/30 bg-sky-500/5 flex items-center justify-center p-2 text-center"
              style={{ top: "30%", left: "47%" }}
            >
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 tracking-widest uppercase">Lazer & Piscina</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80 mt-1 status-pulse" />
              </div>
            </div>

            {/* Portaria Central */}
            <div
              className="absolute w-[160px] h-[80px] rounded-xl border border-orange-500/20 bg-orange-500/10 flex flex-col justify-between p-2.5"
              style={{ top: "78%", left: "10%" }}
            >
              <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 tracking-widest uppercase">Portaria Principal</span>
              <p className="text-[8px] text-muted-foreground">Estação de Check-in e Entrada Principal</p>
            </div>

            {/* Estacionamento de Visitantes */}
            <div
              className="absolute w-[180px] h-[100px] rounded-xl border border-border bg-card/40 flex flex-col justify-between p-2.5"
              style={{ top: "68%", left: "38%" }}
            >
              <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Estacionamento</span>
              <div className="grid grid-cols-4 gap-1 opacity-40">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 border-r border-muted-foreground/30 border-dashed" />
                ))}
              </div>
            </div>

            {/* Trajetória de Rastro do GPS Selecionado */}
            {selected && selected.trail && selected.status !== "offline" && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                  points={selected.trail.map((t) => `${t.x}%,${t.y}%`).join(" ")}
                  fill="none"
                  stroke="#adc6ff"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className="transition-all duration-1000"
                />
                {/* Indicador no rastro inicial */}
                <circle
                  cx={`${selected.trail[0].x}%`}
                  cy={`${selected.trail[0].y}%`}
                  r="3"
                  fill="#adc6ff"
                  opacity="0.6"
                />
              </svg>
            )}
          </div>

          {/* === PINS DOS CHAVEIROS GPS NO MAPA === */}
          {filteredDevices
            .filter((d) => d.status !== "offline") // Esconde da tela se estiver desligado/offline
            .map((device) => {
              const isSelected = selected?.id === device.id;
              const hasAlert = emergencyAlert === device.deviceId;
              const inUse = device.status === "in_use" || device.status === "active";

              return (
                <button
                  key={device.id}
                  onClick={() => setSelected(device)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-30 transition-all duration-1000 ease-out"
                  style={{ top: `${device.y}%`, left: `${device.x}%` }}
                >
                  <div
                    className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/20"
                        : "border-border/80 bg-card hover:scale-110 hover:border-primary/60"
                    } ${inUse ? "glow-pulse" : ""} ${
                      hasAlert ? "border-red-500 bg-red-950/40 animate-bounce scale-125" : ""
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        hasAlert ? "bg-red-500 animate-ping" : statusDot[device.status]
                      }`}
                    />

                    {/* Alerta de SOS visual no Pin */}
                    {hasAlert && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 items-center justify-center text-[8px] font-bold text-white">!</span>
                      </span>
                    )}
                  </div>

                  {/* Nome do Visitante / ID Tooltip */}
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg px-2 py-1 text-[9px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                    {device.assignedTo || `Dispositivo ${device.deviceId}`}
                  </div>
                </button>
              );
            })}
        </div>

        {/* Indicador de Status dos Dispositivos no Topo Esquerdo */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div
            className="rounded-xl border border-border px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md shadow-2xl bg-card/85 text-foreground transition-colors duration-300"
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981] status-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-foreground uppercase">
              {activeCount} Dispositivo{activeCount === 1 ? "" : "s"} em Uso
            </span>
          </div>

          {/* Notificação de Emergência Simulada */}
          {emergencyAlert && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-[10px] font-bold tracking-wide uppercase animate-bounce shadow-lg">
              <ShieldAlert size={12} className="text-red-400 animate-pulse" />
              <span>Padrão Alerta: SOS no dispositivo {emergencyAlert}!</span>
            </div>
          )}
        </div>

        {/* Painel Flutuante de Controles do Mapa */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={zoomIn}
            title="Aumentar Zoom"
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border/80 transition-all backdrop-blur-md cursor-pointer bg-card/85"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={zoomOut}
            title="Diminuir Zoom"
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border/80 transition-all backdrop-blur-md cursor-pointer bg-card/85"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetZoom}
            title="Redefinir Zoom para 100%"
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border/80 transition-all backdrop-blur-md cursor-pointer bg-card/85"
          >
            1:1
          </button>
          <button
            onClick={() => setMapStyle(mapStyle === "schema" ? "blueprint" : "schema")}
            title="Alternar Modo do Mapa"
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all backdrop-blur-md cursor-pointer bg-card/85 ${
              mapStyle === "blueprint"
                ? "border-primary/50 text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Layers size={15} />
          </button>
        </div>
      </div>

      {/* Painel Lateral: Frota de Dispositivos GPS */}
      <div
        className="w-80 border-l border-border flex flex-col overflow-hidden flex-shrink-0 bg-card transition-colors duration-300"
      >
        {/* Cabeçalho do Painel */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[9px] font-bold tracking-[0.2em] text-[#8c909f] uppercase">
            MONITORAMENTO LIVE
          </p>
          <h2
            className="text-lg font-bold text-foreground mt-0.5"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Frota de GPS
          </h2>
          <p className="text-xs text-[#8c909f] mt-1">
            {filteredDevices.length} dispositivo{filteredDevices.length === 1 ? "" : "s"} listados
          </p>
        </div>

        {/* Busca e Chips de Filtro */}
        <div className="p-4 border-b border-border/60 space-y-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar visitante ou ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Chips Horizontais de Filtro */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "Todos" },
              { id: "in_use", label: "Em uso" },
              { id: "available", label: "Livre" },
              { id: "low_battery", label: "Bat. Baixa" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === chip.id
                    ? "bg-primary/10 border border-primary/35 text-primary"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Dispositivos */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredDevices.map((device) => {
            const sl = statusLabel[device.status];
            const isSelected = selected?.id === device.id;
            const hasAlert = emergencyAlert === device.deviceId;

            return (
              <button
                key={device.id}
                onClick={() => setSelected(device)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary/40 bg-primary/5 border-l-2 border-l-primary shadow-md shadow-primary/5"
                    : "border-border/30 hover:border-border/60 hover:bg-accent/40"
                } ${hasAlert ? "border-red-500/40 bg-red-950/15" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Radio size={15} className={hasAlert ? "text-red-400 animate-pulse" : "text-primary"} />
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-card ${
                      hasAlert ? "bg-red-500 animate-ping" : statusDot[device.status]
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {device.assignedTo || `Chaveiro ${device.deviceId}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {device.location || "Armazenamento"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-[8px] font-extrabold tracking-wider uppercase ${hasAlert ? "text-red-400 font-bold" : sl.color}`}>
                    {hasAlert ? "SOS ALERTA" : sl.label}
                  </p>
                  <BatteryBar level={device.battery ?? device.batteryLevel ?? 0} />
                </div>
              </button>
            );
          })}

          {filteredDevices.length === 0 && (
            <div className="text-center py-10 px-2">
              <Compass size={24} className="mx-auto mb-2 text-[#8c909f]/30" />
              <p className="text-xs text-[#8c909f]">Nenhum dispositivo encontrado.</p>
            </div>
          )}
        </div>

        {/* Detalhes do Dispositivo Selecionado */}
        {selected && (
          <div
            className="border-t border-border p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-300 bg-card/95 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
                DETALHES DO GPS
              </p>
              <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-primary/10 border border-primary/20 text-primary`}>
                {selected.deviceId}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Informações detalhadas */}
              {[
                { label: "Modelo", value: selected.model, icon: Radio },
                { label: "Portador", value: selected.assignedTo || "Nenhum (Disponível)", icon: User },
                { label: "Localização", value: selected.location || "Armário Portaria", icon: MapPin },
                { label: "Bateria", value: `${selected.battery ?? selected.batteryLevel ?? 0}%`, icon: Battery },
                { label: "Último Sinal", value: selected.lastSync || "Ativo", icon: Clock },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <f.icon size={11} className="text-muted-foreground/60" />
                    {f.label}
                  </span>
                  <span className="font-semibold text-foreground text-[11px] truncate max-w-[150px]">{f.value}</span>
                </div>
              ))}
            </div>

            {/* Ações adicionais para dispositivos em uso */}
            {(selected.status === "in_use" || selected.status === "active") && (
              <div className="flex gap-2 pt-2 border-t border-[#424754]/20">
                {/* Botão de PING SOS (Simulado) */}
                <button
                  onClick={() => triggerEmergency(selected.deviceId)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-950/40 hover:border-red-500/60 transition-all cursor-pointer"
                >
                  <ShieldAlert size={12} />
                  Ping Emergência
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RastreamentoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#8c909f]">Carregando painel de rastreamento...</div>}>
      <RastreamentoContent />
    </Suspense>
  );
}
