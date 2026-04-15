"use client";

import { useState } from "react";
import { mockResidents } from "@/data/mockData";
import type { Resident } from "@/types";
import { Search, Plus, Phone, Mail, MoreHorizontal, Shield } from "lucide-react";

const statusConfig: Record<Resident["status"], { label: string; color: string; bg: string }> = {
  active: { label: "ACTIVE", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
  inactive: { label: "INACTIVE", color: "text-[#8c909f]", bg: "bg-[#8c909f]/10" },
  suspended: { label: "SUSPENDED", color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10" },
  pending: { label: "PENDING", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
};

export default function MoradoresPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Resident["status"]>("all");

  const filtered = mockResidents.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.unit.toLowerCase().includes(search.toLowerCase()) ||
      (r.company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Resident Management
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Residents
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            {mockResidents.length} registered residents across all properties.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
          <Plus size={14} />
          Add Resident
        </button>
      </div>

      {/* Filter pills + search */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search residents..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#171f33] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive", "suspended"] as const).map((f) => (
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
      </div>

      {/* Resident cards */}
      <div className="space-y-2">
        {filtered.map((r) => {
          const sc = statusConfig[r.status];
          return (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#424754]/20 hover:border-[#424754]/40 hover:bg-[#1a2236] transition-all cursor-pointer group"
              style={{ background: "#171f33" }}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#adc6ff]">
                {r.initials}
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#dae2fd]">{r.name}</p>
                  {r.vip && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold bg-[#ffb786]/10 text-[#ffb786] rounded-full uppercase tracking-wider">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8c909f]">{r.company}</p>
              </div>

              {/* Unit */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-[#dae2fd]">Unit {r.unit}</p>
                <p className="text-[11px] text-[#8c909f]">{r.block}</p>
              </div>

              {/* Contact */}
              <div className="hidden lg:flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#424754]/30 text-[11px] font-medium text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
                  <Phone size={11} />
                  {r.phone}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#424754]/30 text-[11px] font-medium text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
                  <Mail size={11} />
                  Message
                </button>
              </div>

              {/* Status */}
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${sc.bg} ${sc.color} uppercase`}>
                {sc.label}
              </span>

              {/* Actions */}
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8c909f]/50 hover:text-[#dae2fd] hover:bg-[#424754]/30 transition-all opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Shield size={32} className="mx-auto mb-3 text-[#8c909f]/30" />
          <p className="text-sm text-[#8c909f]">No residents found.</p>
        </div>
      )}
    </div>
  );
}
