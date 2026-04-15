"use client";

import { useState } from "react";
import { mockVisitors } from "@/data/mockData";
import type { Visitor } from "@/types";
import {
  Search,
  Plus,
  Star,
  Filter,
} from "lucide-react";

const statusConfig: Record<Visitor["status"], { label: string; color: string; bg: string }> = {
  approved: { label: "APPROVED", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
  pending: { label: "PENDING", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
  refused: { label: "REFUSED", color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10" },
  "checked-in": { label: "IN PREMISES", color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
  active: { label: "ACTIVE", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
  frequent: { label: "FREQUENT", color: "text-[#b1c6f9]", bg: "bg-[#b1c6f9]/10" },
};

export default function VisitantesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Visitor | null>(mockVisitors[0] ?? null);

  const filtered = mockVisitors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.hostUnit ?? "").toLowerCase().includes(search.toLowerCase()) ||
      v.document.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full min-h-[calc(100vh-64px)]">
      {/* Main list */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
              Visitor Management
            </p>
            <h1
              className="text-3xl font-extrabold text-[#dae2fd]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Visitor Database
            </h1>
            <p className="text-sm text-[#8c909f] mt-1">
              {mockVisitors.length} registered visitors • {mockVisitors.filter((v) => v.status === "checked-in").length} currently on premises.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
            <Plus size={14} />
            Register Visitor
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search visitors..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#171f33] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#424754]/30 text-[11px] font-semibold text-[#8c909f] hover:text-[#dae2fd] transition-all">
            <Filter size={12} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border border-[#424754]/20 overflow-hidden"
          style={{ background: "#171f33" }}
        >
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#424754]/10">
            {[
              { label: "Visitor", span: "col-span-4" },
              { label: "Host Unit", span: "col-span-2" },
              { label: "Document", span: "col-span-2" },
              { label: "Last Visit", span: "col-span-2" },
              { label: "Status", span: "col-span-2" },
            ].map((h) => (
              <p key={h.label} className={`text-[10px] font-bold uppercase tracking-widest text-[#8c909f]/60 ${h.span}`}>
                {h.label}
              </p>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((v) => {
            const sc = statusConfig[v.status];
            const isSelected = selected?.id === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#424754]/10 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#adc6ff]/5 border-l-2 border-l-[#adc6ff]"
                    : "hover:bg-[#222a3d]/40"
                }`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center text-[10px] font-bold text-[#adc6ff] flex-shrink-0">
                    {v.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-[#dae2fd]">{v.name}</p>
                      {v.isFrequent && <Star size={10} className="text-[#ffb786]" />}
                    </div>
                    <p className="text-[11px] text-[#8c909f]">{v.company}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-[#c2c6d6]">{v.hostUnit}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-[#8c909f] font-mono text-xs">{v.document}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-[#8c909f]">{v.lastVisit}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className={`px-2 py-1 text-[9px] font-bold rounded-full ${sc.bg} ${sc.color} uppercase`}>
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="w-80 border-l border-[#424754]/20 p-6 flex flex-col gap-5 overflow-y-auto flex-shrink-0"
          style={{ background: "#131b2e" }}
        >
          {/* Avatar */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center text-xl font-bold text-[#adc6ff] mx-auto mb-3">
              {selected.initials}
            </div>
            <h2
              className="text-lg font-bold text-[#dae2fd]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {selected.name}
            </h2>
            <p className="text-[12px] text-[#8c909f]">{selected.company}</p>
          </div>

          {/* Status badge */}
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}
            >
              {statusConfig[selected.status].label}
            </span>
          </div>

          {/* Info fields */}
          <div className="space-y-4">
            {[
              { label: "Host Unit", value: selected.hostUnit },
              { label: "Host Resident", value: selected.hostResident },
              { label: "Document", value: selected.document },
              { label: "Visits (total)", value: `${selected.visitCount} visits` },
              { label: "Last Visit", value: selected.lastVisit },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-0.5">{f.label}</p>
                <p className="text-sm font-medium text-[#dae2fd]">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          {selected.notes && (
            <div
              className="rounded-xl p-3 border border-[#424754]/20"
              style={{ background: "#171f33" }}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-1.5">Notes</p>
              <p className="text-[12px] text-[#c2c6d6]">{selected.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 mt-auto">
            <button className="w-full py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
              Authorize Visit
            </button>
            <button className="w-full py-2.5 rounded-xl border border-[#424754]/30 text-sm font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
              View History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
