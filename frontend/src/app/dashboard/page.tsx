"use client";

import { mockDashboardStats, mockRecentMovements } from "@/data/mockData";
import { UserPlus, Calendar, AlertTriangle, Radio, Download, MapPin } from "lucide-react";

const statIcons = [UserPlus, Calendar, AlertTriangle, Radio];

const statColors = [
  { icon: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
  { icon: "text-[#b1c6f9]", bg: "bg-[#b1c6f9]/10" },
  { icon: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10" },
  { icon: "text-[#ffb786]", bg: "bg-[#ffb786]/10" },
];

function StatusBadge({ status }: { status: "entry" | "exit" }) {
  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${
        status === "entry"
          ? "bg-[#adc6ff]/10 text-[#adc6ff]"
          : "bg-[#c2c6d6]/10 text-[#c2c6d6]"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 min-h-full">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
          Operations Overview • The Obsidian Tower
        </p>
        <h1
          className="text-4xl font-extrabold text-[#dae2fd]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Evening, Marcus.
        </h1>
        <p className="text-sm text-[#8c909f] mt-1">
          Everything at <span className="text-[#dae2fd]">The Obsidian</span> is running smoothly. You have 3
          pending directives and 14 arrivals scheduled for today.
        </p>
      </div>

      {/* Stats bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockDashboardStats.map((stat, i) => {
          const Icon = statIcons[i];
          const colors = statColors[i];
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-6 border border-[#424754]/20 hover:border-[#424754]/40 transition-all"
              style={{ background: "#171f33" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#8c909f]">
                  {stat.label}
                </p>
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon size={15} className={colors.icon} />
                </div>
              </div>
              <p
                className="text-3xl font-extrabold text-[#dae2fd] mb-2"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {stat.value}
              </p>
              <p className={`text-[11px] ${stat.alert ? "text-[#ffb4ab]" : "text-[#8c909f]"}`}>
                {stat.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Movements */}
        <div
          className="lg:col-span-2 rounded-2xl border border-[#424754]/20 overflow-hidden"
          style={{ background: "#171f33" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#424754]/20">
            <div>
              <h2
                className="text-base font-bold text-[#dae2fd]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Recent Movements
              </h2>
            </div>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#adc6ff]/70 hover:text-[#adc6ff] transition-colors uppercase tracking-wide">
              <Download size={12} />
              Export Logs
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#424754]/10">
            {["Identity", "Destination", "Time", "Status"].map((h, idx) => (
              <p
                key={h}
                className={`text-[10px] font-bold uppercase tracking-widest text-[#8c909f]/60 ${
                  idx === 0 ? "col-span-5" : idx === 1 ? "col-span-3" : idx === 2 ? "col-span-2" : "col-span-2"
                }`}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {mockRecentMovements.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#424754]/10 hover:bg-[#222a3d]/50 transition-all group"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center text-[10px] font-bold text-[#adc6ff] flex-shrink-0">
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#dae2fd] truncate">{m.name}</p>
                  <p className="text-[11px] text-[#8c909f] truncate">{m.badge}</p>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <p className="text-sm text-[#c2c6d6] truncate">{m.destination}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-sm text-[#8c909f]">{m.time}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <StatusBadge status={m.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Unit Tracking */}
          <div
            className="rounded-2xl border border-[#424754]/20 overflow-hidden"
            style={{ background: "#171f33" }}
          >
            <div className="px-5 py-4 border-b border-[#424754]/20">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f]">
                  Unit 1402 Tracking
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] status-pulse" />
                  <span className="text-[10px] text-[#10B981] font-semibold">Live</span>
                </div>
              </div>
            </div>
            <div
              className="aspect-video relative overflow-hidden"
              style={{ background: "#131b2e" }}
            >
              {/* Map placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-[#adc6ff] glow-pulse" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#131b2e]">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#adc6ff]" />
                  <span className="text-[11px] text-[#dae2fd]/80 font-medium">
                    Level 14 - Sky Lounge
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Alerts */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f] mb-4">
              Service Alerts
            </p>
            {[
              { icon: "📦", title: "Amazon Fresh Delivery", desc: "Pending refrigerated locker 04.", time: "04 MIN AGO", iconBg: "bg-[#ffb786]/10" },
              { icon: "🚗", title: "Uber Black — Arrival", desc: "Guest of Unit 3105 at front gate.", time: "12 MIN AGO", iconBg: "bg-[#b1c6f9]/10" },
              { icon: "🏨", title: "Housekeeping Complete", desc: "Unit 1102 maintenance check cleared.", time: "38 MIN AGO", iconBg: "bg-[#adc6ff]/10" },
            ].map((a) => (
              <div key={a.title} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className={`w-8 h-8 rounded-lg ${a.iconBg} flex items-center justify-center flex-shrink-0 text-base`}>
                  {a.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[#dae2fd] truncate">{a.title}</p>
                  <p className="text-[11px] text-[#8c909f]">{a.desc}</p>
                </div>
                <span className="text-[9px] font-bold tracking-wide text-[#8c909f]/60 uppercase whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
