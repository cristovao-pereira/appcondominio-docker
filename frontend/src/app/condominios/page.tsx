"use client";

import { useState } from "react";
import { mockCondos } from "@/data/mockData";
import type { Condo } from "@/types";
import { Search, SlidersHorizontal, Building2, Plus, ArrowUpDown, MoreHorizontal, MapPin } from "lucide-react";

const statusConfig: Record<Condo["status"], { label: string; color: string; bg: string }> = {
  active: { label: "ACTIVE", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
  partial: { label: "PARTIAL", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
  inactive: { label: "INACTIVE", color: "text-[#8c909f]", bg: "bg-[#8c909f]/10" },
  maintenance: { label: "MAINT.", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
};

export default function CondominiosPage() {
  const [search, setSearch] = useState("");

  const filtered = mockCondos.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalUnits = mockCondos.reduce((a, b) => a + (b.totalUnits ?? 0), 0);
  const occupiedUnits = mockCondos.reduce((a, b) => a + (b.occupiedUnits ?? 0), 0);
  const totalResidents = mockCondos.reduce((a, b) => a + (b.residents ?? 0), 0);
  const activeCondos = mockCondos.filter((c) => c.status === "active").length;

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Portfolio Management
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Condo Portfolio
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            Manage and monitor all residential properties under Concierge OS.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
          <Plus size={14} />
          Add Property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Properties", value: mockCondos.length, icon: Building2, color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
          { label: "Total Units", value: totalUnits, icon: MapPin, color: "text-[#b1c6f9]", bg: "bg-[#b1c6f9]/10" },
          { label: "Occupied Units", value: occupiedUnits, icon: Building2, color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
          { label: "Total Residents", value: totalResidents, icon: Building2, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
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

      {/* Filters */}
      <div
        className="rounded-2xl border border-[#424754]/20 overflow-hidden"
        style={{ background: "#171f33" }}
      >
        <div className="flex items-center gap-3 p-4 border-b border-[#424754]/20">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#424754]/30 text-[11px] font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
            <SlidersHorizontal size={12} />
            Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#424754]/30 text-[11px] font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
            <ArrowUpDown size={12} />
            Sort
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#424754]/10">
          {[
            { label: "Property", span: "col-span-4" },
            { label: "Location", span: "col-span-2" },
            { label: "Units", span: "col-span-2" },
            { label: "Residents", span: "col-span-2" },
            { label: "Status", span: "col-span-1" },
            { label: "", span: "col-span-1" },
          ].map((h) => (
            <p key={h.label} className={`text-[10px] font-bold uppercase tracking-widest text-[#8c909f]/60 ${h.span}`}>
              {h.label}
            </p>
          ))}
        </div>

        {/* Table rows */}
        {filtered.map((condo) => {
          const occupancy = Math.round(((condo.occupiedUnits ?? 0) / (condo.totalUnits ?? 1)) * 100);
          const sc = statusConfig[condo.status];
          return (
            <div
              key={condo.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#424754]/10 hover:bg-[#222a3d]/40 transition-all cursor-pointer"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center flex-shrink-0">
                  <Building2 size={15} className="text-[#adc6ff]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#dae2fd]">{condo.name}</p>
                  <p className="text-[11px] text-[#8c909f]">{condo.blocks} blocks • {condo.totalUnits} units</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-sm text-[#c2c6d6]">{condo.city}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <div>
                  <p className="text-sm text-[#dae2fd]">{condo.occupiedUnits}/{condo.totalUnits}</p>
                  <div className="mt-1 h-1 w-20 bg-[#424754]/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#adc6ff] rounded-full transition-all"
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-sm text-[#c2c6d6]">{condo.residents}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${sc.bg} ${sc.color}`}>
                  {sc.label}
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button className="w-7 h-7 rounded-lg hover:bg-[#424754]/30 flex items-center justify-center text-[#8c909f] hover:text-[#dae2fd] transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-[11px] text-[#8c909f]">
            Showing {filtered.length} of {mockCondos.length} properties
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold ${
                  n === 1
                    ? "bg-[#adc6ff]/10 text-[#adc6ff]"
                    : "text-[#8c909f] hover:bg-[#424754]/20 hover:text-[#dae2fd]"
                } transition-all`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
