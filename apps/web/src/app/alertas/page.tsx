"use client";

import { useState } from "react";
import { mockAlerts } from "@/data/mockData";
import type { SecurityAlert } from "@/types";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  XCircle,
  CheckCircle2,
  Clock,
  Bell,
  ChevronRight,
} from "lucide-react";

const severityConfig: Record<SecurityAlert["severity"], { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  critical: { label: "CRITICAL", color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/8", border: "border-[#ffb4ab]/40", icon: XCircle },
  high: { label: "HIGH", color: "text-[#ffb786]", bg: "bg-[#ffb786]/8", border: "border-[#ffb786]/30", icon: AlertTriangle },
  medium: { label: "MEDIUM", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/8", border: "border-[#adc6ff]/30", icon: ShieldAlert },
  low: { label: "LOW", color: "text-[#8c909f]", bg: "bg-[#8c909f]/8", border: "border-[#8c909f]/20", icon: Info },
  warning: { label: "WARNING", color: "text-[#ffb786]", bg: "bg-[#ffb786]/8", border: "border-[#ffb786]/30", icon: AlertTriangle },
  info: { label: "INFO", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/8", border: "border-[#adc6ff]/20", icon: Info },
  resolved: { label: "RESOLVED", color: "text-[#8c909f]", bg: "bg-[#8c909f]/8", border: "border-[#8c909f]/20", icon: CheckCircle2 },
};

export default function AlertasPage() {
  const [selected, setSelected] = useState<SecurityAlert | null>(mockAlerts[0] ?? null);
  const [filter, setFilter] = useState<"all" | SecurityAlert["severity"]>("all");

  const filtered =
    filter === "all" ? mockAlerts : mockAlerts.filter((a) => a.severity === filter);

  const criticalCount = mockAlerts.filter((a) => a.severity === "critical").length;
  const unresolved = mockAlerts.filter((a) => !a.resolved).length;

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Security Center
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Security Alerts
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            {unresolved} unresolved alerts {criticalCount > 0 && (
              <span className="text-[#ffb4ab]">• {criticalCount} critical</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20">
          <Bell size={14} className="text-[#ffb4ab]" />
          <span className="text-[12px] font-bold text-[#ffb4ab]">{unresolved} Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert feed */}
        <div className="lg:col-span-2">
          {/* Filter pills */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(["all", "critical", "high", "medium", "low"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                  filter === f
                    ? "bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20"
                    : "text-[#8c909f] hover:text-[#dae2fd] border border-transparent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Alert list */}
          <div className="space-y-2">
            {filtered.map((alert) => {
              const sc = severityConfig[alert.severity];
              const Icon = sc.icon;
              const isSelected = selected?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelected(alert)}
                  className={`flex items-start gap-4 px-5 py-4 rounded-2xl border-l-4 border cursor-pointer transition-all ${sc.border} ${sc.bg} ${
                    isSelected ? "ring-1 ring-[#adc6ff]/20" : "hover:opacity-90"
                  }`}
                  style={{ background: "#171f33" }}
                >
                  <div className={`w-9 h-9 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className={sc.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#dae2fd]">{alert.title}</p>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${sc.bg} ${sc.color} uppercase flex-shrink-0`}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#8c909f] mt-0.5">{alert.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-[#8c909f]">
                        <Clock size={10} />
                        {alert.timestamp}
                      </span>
                      <span className="text-[10px] text-[#8c909f]">{alert.location}</span>
                      {alert.resolved && (
                        <span className="flex items-center gap-1 text-[10px] text-[#10B981]">
                          <CheckCircle2 size={10} />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#8c909f]/50 flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail view */}
        {selected && (
          <div
            className="rounded-2xl border border-[#424754]/20 p-6 h-fit"
            style={{ background: "#171f33" }}
          >
            {(() => {
              const sc = severityConfig[selected.severity];
              const Icon = sc.icon;
              return (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center`}>
                      <Icon size={18} className={sc.color} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>

                  <h2
                    className="text-base font-bold text-[#dae2fd] mb-2"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {selected.title}
                  </h2>
                  <p className="text-sm text-[#8c909f] mb-5">{selected.description}</p>

                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Location", value: selected.location },
                      { label: "Triggered", value: selected.timestamp },
                      { label: "Assigned To", value: selected.assignedTo ?? "Unassigned" },
                      { label: "Status", value: selected.resolved ? "Resolved" : "Open" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-0.5">{f.label}</p>
                        <p className="text-sm font-medium text-[#dae2fd]">{f.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  {selected.timeline && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-3">Timeline</p>
                    <div className="space-y-3">
                      {selected.timeline.map((t, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[#adc6ff]/60 mt-1" />
                            {i < selected.timeline!.length - 1 && (
                              <div className="w-px flex-1 bg-[#424754]/30 mt-1" />
                            )}
                          </div>
                          <div className="pb-3 min-w-0">
                            <p className="text-[12px] font-medium text-[#dae2fd]">{t.event}</p>
                            <p className="text-[10px] text-[#8c909f]">{t.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  {!selected.resolved && (
                    <button className="w-full mt-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
                      Mark as Resolved
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
