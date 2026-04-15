"use client";

import { useState } from "react";
import { mockDevices } from "@/data/mockData";
import type { GpsDevice } from "@/types";
import {
  Radio,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Filter,
  MoreHorizontal,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";

const statusConfig: Record<GpsDevice["status"], { label: string; color: string; bg: string; dot: string }> = {
  active: { label: "ACTIVE", color: "text-[#10B981]", bg: "bg-[#10B981]/10", dot: "bg-[#10B981]" },
  idle: { label: "IDLE", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10", dot: "bg-[#ffb786]" },
  offline: { label: "OFFLINE", color: "text-[#8c909f]", bg: "bg-[#8c909f]/10", dot: "bg-[#8c909f]/50" },
  charging: { label: "CHARGING", color: "text-[#b1c6f9]", bg: "bg-[#b1c6f9]/10", dot: "bg-[#b1c6f9]" },
  in_use: { label: "IN USE", color: "text-[#10B981]", bg: "bg-[#10B981]/10", dot: "bg-[#10B981]" },
  available: { label: "AVAILABLE", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10", dot: "bg-[#adc6ff]/60" },
  maintenance: { label: "MAINT.", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10", dot: "bg-[#ffb786]" },
};

function BatteryIndicator({ level }: { level: number }) {
  const color = level > 60 ? "text-[#10B981]" : level > 30 ? "text-[#ffb786]" : "text-[#ffb4ab]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-[2px]">
        {[25, 50, 75, 100].map((threshold) => (
          <div
            key={threshold}
            className={`w-1.5 rounded-sm transition-all ${
              level >= threshold ? color.replace("text-", "bg-") : "bg-[#424754]/30"
            }`}
            style={{ height: `${(threshold / 100) * 14 + 4}px` }}
          />
        ))}
      </div>
      <span className={`text-[11px] font-semibold ${color}`}>{level}%</span>
    </div>
  );
}

export default function DispositivosPage() {
  const [selected, setSelected] = useState<GpsDevice | null>(mockDevices[0] ?? null);

  const activeCount = mockDevices.filter((d) => d.status === "active").length;
  const offlineCount = mockDevices.filter((d) => d.status === "offline").length;
  const avgBattery = Math.round(mockDevices.reduce((a, b) => a + (b.battery ?? b.batteryLevel ?? 0), 0) / mockDevices.length);

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Device Management
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            GPS Fleet
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            {mockDevices.length} devices registered • {activeCount} active
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
          <Plus size={14} />
          Register Device
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Devices", value: mockDevices.length, icon: Radio, color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
          { label: "Online", value: activeCount, icon: Wifi, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
          { label: "Offline", value: offlineCount, icon: WifiOff, color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10" },
          { label: "Avg. Battery", value: `${avgBattery}%`, icon: Zap, color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border border-[#424754]/20"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f]">{s.label}</p>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={13} className={s.color} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#dae2fd]" style={{ fontFamily: "var(--font-manrope)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device list */}
        <div
          className="lg:col-span-2 rounded-2xl border border-[#424754]/20 overflow-hidden"
          style={{ background: "#171f33" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#424754]/20">
            <h2 className="text-sm font-bold text-[#dae2fd]" style={{ fontFamily: "var(--font-manrope)" }}>
              Device Inventory
            </h2>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8c909f] hover:text-[#dae2fd] transition-all">
              <RefreshCw size={12} />
              Sync All
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#424754]/10">
            {[
              { label: "Device", span: "col-span-4" },
              { label: "Assigned To", span: "col-span-3" },
              { label: "Location", span: "col-span-2" },
              { label: "Battery", span: "col-span-2" },
              { label: "Status", span: "col-span-1" },
            ].map((h) => (
              <p key={h.label} className={`text-[10px] font-bold uppercase tracking-widest text-[#8c909f]/60 ${h.span}`}>
                {h.label}
              </p>
            ))}
          </div>

          {mockDevices.map((device) => {
            const sc = statusConfig[device.status];
            const isSelected = selected?.id === device.id;
            return (
              <div
                key={device.id}
                onClick={() => setSelected(device)}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#424754]/10 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#adc6ff]/5 border-l-2 border-l-[#adc6ff]"
                    : "hover:bg-[#222a3d]/40"
                }`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
                      <Radio size={14} className="text-[#adc6ff]" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#171f33] ${sc.dot}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#dae2fd]">{device.deviceId}</p>
                    <p className="text-[11px] text-[#8c909f]">{device.model}</p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <p className="text-sm text-[#c2c6d6]">{device.assignedTo ?? "—"}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-[12px] text-[#8c909f] truncate">{device.location}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <BatteryIndicator level={device.battery ?? device.batteryLevel ?? 0} />
                </div>
                <div className="col-span-1 flex items-center">
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right insights panel */}
        <div className="space-y-4">
          {/* Selected device detail */}
          {selected && (
            <div
              className="rounded-2xl border border-[#424754]/20 p-5"
              style={{ background: "#171f33" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
                  <Radio size={16} className="text-[#adc6ff]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#dae2fd]">{selected.deviceId}</p>
                  <p className="text-[11px] text-[#8c909f]">{selected.model}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Status", value: selected.status.toUpperCase() },
                  { label: "Assigned", value: selected.assignedTo ?? "Unassigned" },
                  { label: "Location", value: selected.location },
                  { label: "Last Update", value: selected.lastUpdate },
                  { label: "Signal", value: `${selected.signal}% signal` },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between">
                    <p className="text-[11px] text-[#8c909f]">{f.label}</p>
                    <p className="text-[11px] font-medium text-[#dae2fd]">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#424754]/20">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-2">Battery</p>
                <BatteryIndicator level={selected.battery ?? selected.batteryLevel ?? 0} />
                <div className="mt-2 h-1.5 w-full bg-[#424754]/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (selected.battery ?? 0) > 60 ? "bg-[#10B981]" : (selected.battery ?? 0) > 30 ? "bg-[#ffb786]" : "bg-[#ffb4ab]"
                    }`}
                    style={{ width: `${selected.battery ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] text-[11px] font-bold hover:bg-[#adc6ff]/20 transition-all">
                  Track Live
                </button>
                <button className="flex-1 py-2 rounded-xl border border-[#424754]/30 text-[11px] font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
                  History
                </button>
              </div>
            </div>
          )}

          {/* Fleet health */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f] mb-4">
              Fleet Health
            </p>
            <div className="space-y-3">
              {[
                { label: "Devices Online", value: `${activeCount}/${mockDevices.length}`, pct: Math.round((activeCount / mockDevices.length) * 100), color: "bg-[#10B981]" },
                { label: "Avg. Battery", value: `${avgBattery}%`, pct: avgBattery, color: avgBattery > 60 ? "bg-[#10B981]" : avgBattery > 30 ? "bg-[#ffb786]" : "bg-[#ffb4ab]" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] text-[#8c909f]">{s.label}</p>
                    <p className="text-[11px] font-semibold text-[#dae2fd]">{s.value}</p>
                  </div>
                  <div className="h-1.5 w-full bg-[#424754]/30 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
