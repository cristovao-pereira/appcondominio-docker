"use client";

import { useState } from "react";
import { mockDevices } from "@/data/mockData";
import type { GpsDevice } from "@/types";
import { MapPin, Battery, Wifi, Radio, RefreshCw, Layers, ZoomIn, ZoomOut, ChevronRight } from "lucide-react";

const statusDot: Record<GpsDevice["status"], string> = {
  active: "bg-[#10B981]",
  idle: "bg-[#ffb786]",
  offline: "bg-[#8c909f]/50",
  charging: "bg-[#b1c6f9]",
  in_use: "bg-[#10B981]",
  available: "bg-[#adc6ff]/60",
  maintenance: "bg-[#ffb786]",
};

const statusLabel: Record<GpsDevice["status"], { label: string; color: string }> = {
  active: { label: "ACTIVE", color: "text-[#10B981]" },
  idle: { label: "IDLE", color: "text-[#ffb786]" },
  offline: { label: "OFFLINE", color: "text-[#8c909f]" },
  charging: { label: "CHARGING", color: "text-[#b1c6f9]" },
  in_use: { label: "IN USE", color: "text-[#10B981]" },
  available: { label: "AVAILABLE", color: "text-[#adc6ff]" },
  maintenance: { label: "MAINT.", color: "text-[#ffb786]" },
};

function BatteryBar({ level }: { level: number }) {
  const color =
    level > 60 ? "bg-[#10B981]" : level > 30 ? "bg-[#ffb786]" : "bg-[#ffb4ab]";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-[#424754]/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-[10px] text-[#8c909f]">{level}%</span>
    </div>
  );
}

export default function RastreamentoPage() {
  const [selected, setSelected] = useState<GpsDevice | null>(mockDevices.find(d => d.status === "active") ?? null);
  const activeCount = mockDevices.filter((d) => d.status === "active").length;

  return (
    <div className="flex h-full" style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Map area (fullscreen bg) */}
      <div className="flex-1 relative overflow-hidden" style={{ background: "#0d1525" }}>
        {/* Simulated map grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(#adc6ff 1px, transparent 1px),
              linear-gradient(90deg, #adc6ff 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* GPS pins */}
        {mockDevices.filter(d => d.status !== "offline").map((device, i) => {
          const positions = [
            { top: "30%", left: "35%" },
            { top: "55%", left: "50%" },
            { top: "40%", left: "65%" },
            { top: "70%", left: "40%" },
            { top: "25%", left: "58%" },
          ];
          const pos = positions[i % positions.length];
          const isSelected = selected?.id === device.id;
          return (
            <button
              key={device.id}
              onClick={() => setSelected(device)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ top: pos.top, left: pos.left }}
            >
              <div
                className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "border-[#adc6ff] bg-[#adc6ff]/20 scale-110"
                    : "border-[#adc6ff]/60 bg-[#4d8eff]/10 hover:scale-110"
                } ${device.status === "active" ? "glow-pulse" : ""}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${statusDot[device.status]}`} />
              </div>
              {/* Label tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#171f33] border border-[#424754]/40 rounded-lg px-2 py-1 text-[10px] font-semibold text-[#dae2fd] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {device.assignedTo ?? device.deviceId}
              </div>
            </button>
          );
        })}

        {/* Top-left controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div
            className="rounded-xl border border-[#424754]/30 px-3 py-2 flex items-center gap-2 backdrop-blur-sm"
            style={{ background: "rgba(23,31,51,0.85)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] status-pulse" />
            <span className="text-[11px] font-semibold text-[#dae2fd]">
              {activeCount} Active Devices
            </span>
          </div>
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-[340px] flex flex-col gap-2">
          {[
            { icon: ZoomIn, label: "Zoom in" },
            { icon: ZoomOut, label: "Zoom out" },
            { icon: Layers, label: "Layers" },
            { icon: RefreshCw, label: "Refresh" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="w-8 h-8 rounded-lg border border-[#424754]/30 flex items-center justify-center text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all backdrop-blur-sm"
              style={{ background: "rgba(23,31,51,0.85)" }}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div
        className="w-80 border-l border-[#424754]/20 flex flex-col overflow-hidden flex-shrink-0"
        style={{ background: "#131b2e" }}
      >
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-[#424754]/20">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f]">
            Live Tracking
          </p>
          <h2
            className="text-base font-bold text-[#dae2fd] mt-0.5"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            GPS Fleet
          </h2>
        </div>

        {/* Device list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {mockDevices.map((device) => {
            const sl = statusLabel[device.status];
            const isSelected = selected?.id === device.id;
            return (
              <button
                key={device.id}
                onClick={() => setSelected(device)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[#adc6ff]/30 bg-[#adc6ff]/5 border-l-2 border-l-[#adc6ff]"
                    : "border-[#424754]/20 hover:border-[#424754]/40 hover:bg-[#222a3d]/40"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
                    <Radio size={14} className="text-[#adc6ff]" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#131b2e] ${statusDot[device.status]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#dae2fd] truncate">
                    {device.assignedTo ?? device.deviceId}
                  </p>
                  <p className="text-[11px] text-[#8c909f] truncate">{device.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-[9px] font-bold uppercase ${sl.color}`}>{sl.label}</p>
                  <BatteryBar level={device.battery ?? device.batteryLevel ?? 0} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected device detail */}
        {selected && (
          <div
            className="border-t border-[#424754]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-3">
              Device Detail
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Device ID", value: selected.deviceId },
                { label: "Assigned To", value: selected.assignedTo ?? "—" },
                { label: "Location", value: selected.location },
                { label: "Battery", value: `${selected.battery ?? 0}%` },
                { label: "Last Update", value: selected.lastUpdate },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between">
                  <p className="text-[11px] text-[#8c909f]">{f.label}</p>
                  <p className="text-[11px] font-medium text-[#dae2fd]">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
