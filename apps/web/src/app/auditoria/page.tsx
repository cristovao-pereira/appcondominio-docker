"use client";

import { useState } from "react";
import { mockAuditEvents } from "@/data/mockData";
import type { AuditCategory } from "@/types";
import {
  Search,
  Download,
  Filter,
  LogIn,
  LogOut,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AuditCategoryConfig = Record<AuditCategory, { color: string; bg: string }>;

const actionIcons: Record<string, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  checkin: CheckCircle2,
  checkout: LogOut,
  settings: Settings,
  alert: AlertTriangle,
};

const categoryConfig: AuditCategoryConfig = {
  auth: { color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
  access: { color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
  system: { color: "text-[#b1c6f9]", bg: "bg-[#b1c6f9]/10" },
  security: { color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10" },
  data: { color: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
};

export default function AuditoriaPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | AuditCategory>("all");

  const filtered = mockAuditEvents.filter((e) => {
    const matchSearch =
      !search ||
      (e.user ?? e.userName).toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      (e.description ?? e.details).toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Compliance & Governance
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            System Audit
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            Full activity trail across all Concierge OS operations.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#424754]/30 text-sm font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
          <Download size={14} />
          Export Log
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {(["auth", "access", "system", "security", "data"] as const).map((cat) => {
          const count = mockAuditEvents.filter((e) => e.category === cat).length;
          const cc = categoryConfig[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? "all" : cat)}
              className={`rounded-2xl p-4 border transition-all text-left ${
                category === cat
                  ? `border-[#adc6ff]/30 ${cc.bg}`
                  : "border-[#424754]/20 hover:border-[#424754]/40"
              }`}
              style={{ background: category === cat ? undefined : "#171f33" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f] mb-1">
                {cat}
              </p>
              <p className={`text-xl font-extrabold ${cc.color}`} style={{ fontFamily: "var(--font-manrope)" }}>
                {count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
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
              placeholder="Search events, users, actions..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#424754]/30 text-[11px] font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
            <Filter size={12} />
            Date Range
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#424754]/10">
          {[
            { label: "Event", span: "col-span-4" },
            { label: "User", span: "col-span-2" },
            { label: "Category", span: "col-span-2" },
            { label: "IP Address", span: "col-span-2" },
            { label: "Timestamp", span: "col-span-2" },
          ].map((h) => (
            <p key={h.label} className={`text-[10px] font-bold uppercase tracking-widest text-[#8c909f]/60 ${h.span}`}>
              {h.label}
            </p>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((event) => {
          const cc = categoryConfig[event.category ?? "system"];
          const Icon = actionIcons[event.action] ?? Shield;
          return (
            <div
              key={event.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#424754]/10 hover:bg-[#222a3d]/40 transition-all"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#4d8eff]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={12} className="text-[#adc6ff]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#dae2fd]">{event.description ?? event.details}</p>
                  <p className="text-[11px] text-[#8c909f] capitalize">{event.action}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#4d8eff]/10 flex items-center justify-center text-[9px] font-bold text-[#adc6ff]">
                    {(event.user ?? event.userName).split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <p className="text-sm text-[#c2c6d6] truncate">{event.user ?? event.userName}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${cc.bg} ${cc.color}`}>
                  {event.category ?? "system"}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-[12px] font-mono text-[#8c909f]">{event.ipAddress ?? "—"}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <div>
                  <p className="text-[12px] text-[#c2c6d6]">{event.timestamp.split(" ")[0]}</p>
                  <p className="text-[11px] text-[#8c909f]">{event.timestamp.split(" ")[1]}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-[11px] text-[#8c909f]">
            Showing {filtered.length} of {mockAuditEvents.length} events
          </p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8c909f] hover:bg-[#424754]/30 hover:text-[#dae2fd] transition-all">
              <ChevronLeft size={14} />
            </button>
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
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8c909f] hover:bg-[#424754]/30 hover:text-[#dae2fd] transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
