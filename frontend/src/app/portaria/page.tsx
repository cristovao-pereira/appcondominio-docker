"use client";

import { useState } from "react";
import { mockActiveVisits } from "@/data/mockData";
import type { ActiveVisit } from "@/types";
import {
  LogIn,
  LogOut,
  Clock,
  Shield,
  MapPin,
  Search,
  Camera,
  Car,
  Package,
  User,
  CheckCircle2,
} from "lucide-react";

function ActiveVisitRow({ visit }: { visit: ActiveVisit }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[#424754]/20 hover:border-[#424754]/40 transition-all"
      style={{ background: "#1a2236" }}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center text-sm font-bold text-[#adc6ff] flex-shrink-0">
        {visit.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#dae2fd]">{visit.visitorName}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] text-[#8c909f]">Unit {visit.hostUnit}</span>
          <span className="text-[#424754]">·</span>
          <span className="text-[11px] text-[#8c909f]">{visit.checkInTime}</span>
        </div>
      </div>

      {/* Location badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#adc6ff]/8 border border-[#adc6ff]/15">
        <MapPin size={10} className="text-[#adc6ff]" />
        <span className="text-[10px] font-semibold text-[#adc6ff]">{visit.location}</span>
      </div>

      {/* Check-out button */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ffb4ab]/20 bg-[#ffb4ab]/5 text-[#ffb4ab] text-[11px] font-bold hover:bg-[#ffb4ab]/10 transition-all">
        <LogOut size={11} />
        Check-out
      </button>
    </div>
  );
}

export default function PortariaPage() {
  const [search, setSearch] = useState("");
  const [scanMode, setScanMode] = useState<"none" | "checkin" | "checkout">("none");

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
          Access Control Station
        </p>
        <h1
          className="text-3xl font-extrabold text-[#dae2fd]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Portaria Norte
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] status-pulse" />
          <p className="text-sm text-[#10B981] font-medium">Station Online</p>
          <span className="text-[#424754]">·</span>
          <p className="text-sm text-[#8c909f]">{mockActiveVisits.length} visitors on premises</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Action buttons */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick actions */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f] mb-4">
              Quick Actions
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setScanMode(scanMode === "checkin" ? "none" : "checkin")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all group ${
                  scanMode === "checkin"
                    ? "border-[#adc6ff]/40 bg-[#adc6ff]/5"
                    : "border-[#424754]/20 hover:border-[#424754]/40 hover:bg-[#222a3d]/40"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#adc6ff]/10 flex items-center justify-center">
                  <LogIn size={16} className="text-[#adc6ff]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#dae2fd]">Check-in Visitor</p>
                  <p className="text-[11px] text-[#8c909f]">Register entry + capture photo</p>
                </div>
              </button>

              <button
                onClick={() => setScanMode(scanMode === "checkout" ? "none" : "checkout")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all group ${
                  scanMode === "checkout"
                    ? "border-[#ffb4ab]/40 bg-[#ffb4ab]/5"
                    : "border-[#424754]/20 hover:border-[#424754]/40 hover:bg-[#222a3d]/40"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#ffb4ab]/10 flex items-center justify-center">
                  <LogOut size={16} className="text-[#ffb4ab]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#dae2fd]">Check-out Visitor</p>
                  <p className="text-[11px] text-[#8c909f]">Register exit + log timestamp</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#424754]/20 hover:border-[#424754]/40 hover:bg-[#222a3d]/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[#ffb786]/10 flex items-center justify-center">
                  <Package size={16} className="text-[#ffb786]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#dae2fd]">Register Delivery</p>
                  <p className="text-[11px] text-[#8c909f]">Log parcel + notify resident</p>
                </div>
              </button>
            </div>
          </div>

          {/* Check-in form */}
          {scanMode !== "none" && (
            <div
              className={`rounded-2xl border p-5 ${
                scanMode === "checkin" ? "border-[#adc6ff]/20" : "border-[#ffb4ab]/20"
              }`}
              style={{ background: "#171f33" }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f] mb-4">
                {scanMode === "checkin" ? "Check-in Registration" : "Check-out Registration"}
              </p>
              <div className="space-y-3">
                {[
                  { label: "Visitor Name", ph: "Full name..." },
                  { label: "Document", ph: "CPF / RG..." },
                  { label: "Host Unit", ph: "e.g. 1402" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-1">{f.label}</p>
                    <input
                      placeholder={f.ph}
                      className="w-full px-3 py-2 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
                    />
                  </div>
                ))}
                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    scanMode === "checkin"
                      ? "bg-[#adc6ff] text-[#0b1326] hover:bg-[#adc6ff]/90"
                      : "bg-[#ffb4ab] text-[#0b1326] hover:bg-[#ffb4ab]/90"
                  }`}
                >
                  {scanMode === "checkin" ? "Confirm Check-in" : "Confirm Check-out"}
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8c909f] mb-4">
              Today&#39;s Stats
            </p>
            <div className="space-y-3">
              {[
                { label: "Entries", value: "24", color: "text-[#adc6ff]" },
                { label: "Exits", value: "19", color: "text-[#c2c6d6]" },
                { label: "Deliveries", value: "7", color: "text-[#ffb786]" },
                { label: "Vehicles", value: "11", color: "text-[#b1c6f9]" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-[12px] text-[#8c909f]">{s.label}</p>
                  <p className={`text-lg font-extrabold ${s.color}`} style={{ fontFamily: "var(--font-manrope)" }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active visits */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border border-[#424754]/20 overflow-hidden"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#424754]/20">
              <div>
                <h2
                  className="text-base font-bold text-[#dae2fd]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Active Visits
                </h2>
                <p className="text-[11px] text-[#8c909f]">Currently on premises</p>
              </div>
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50 w-40"
                />
              </div>
            </div>

            <div className="p-4 space-y-2">
              {mockActiveVisits
                .filter(
                  (v) =>
                    !search ||
                    (v.visitorName ?? v.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                    (v.hostUnit ?? v.unit ?? "").includes(search)
                )
                .map((v) => (
                  <ActiveVisitRow key={v.id} visit={v} />
                ))}

              {mockActiveVisits.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 size={28} className="mx-auto mb-3 text-[#8c909f]/30" />
                  <p className="text-sm text-[#8c909f]">No active visits right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
