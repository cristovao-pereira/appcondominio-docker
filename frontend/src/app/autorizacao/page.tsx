"use client";

import { useState } from "react";
import { mockAuthorizations } from "@/data/mockData";
import type { Authorization } from "@/types";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Calendar,
  User,
  Building2,
  ChevronRight,
} from "lucide-react";

const statusConfig: Record<Authorization["status"], { label: string; color: string; bg: string; icon: React.ElementType }> = {
  approved: { label: "APPROVED", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10", icon: CheckCircle2 },
  pending: { label: "PENDING", color: "text-[#ffb786]", bg: "bg-[#ffb786]/10", icon: Clock },
  refused: { label: "REFUSED", color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10", icon: XCircle },
  expired: { label: "EXPIRED", color: "text-[#8c909f]", bg: "bg-[#8c909f]/10", icon: Clock },
  cancelled: { label: "CANCELLED", color: "text-[#8c909f]", bg: "bg-[#8c909f]/10", icon: XCircle },
};

function AuthCard({ auth }: { auth: Authorization }) {
  const sc = statusConfig[auth.status];
  const Icon = sc.icon;
  return (
    <div
      className={`rounded-2xl border p-5 transition-all hover:border-[#424754]/40 group cursor-pointer ${
        auth.status === "pending"
          ? "border-[#ffb786]/30"
          : "border-[#424754]/20"
      }`}
      style={{ background: "#171f33" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center text-sm font-bold text-[#adc6ff]">
            {auth.visitorInitials}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#dae2fd]">{auth.visitorName}</p>
            <p className="text-[11px] text-[#8c909f]">{auth.visitorCompany}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full ${sc.bg} ${sc.color}`}>
          <Icon size={10} />
          {sc.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-[12px]">
        <div className="flex items-center gap-2 text-[#8c909f]">
          <Building2 size={12} />
          <span>Host: <span className="text-[#c2c6d6]">Unit {auth.hostUnit} — {auth.hostResident}</span></span>
        </div>
        <div className="flex items-center gap-2 text-[#8c909f]">
          <Calendar size={12} />
          <span>{auth.visitDate} • {auth.visitTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[#8c909f]">
          <User size={12} />
          <span>Authorized by: <span className="text-[#c2c6d6]">{auth.authorizedBy}</span></span>
        </div>
      </div>

      {/* Purpose */}
      <div
        className="mt-4 px-3 py-2 rounded-lg text-[11px] text-[#8c909f] border border-[#424754]/20"
        style={{ background: "#131b2e" }}
      >
        {auth.purpose}
      </div>

      {/* Actions for pending */}
      {auth.status === "pending" && (
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 rounded-lg bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] text-[11px] font-bold hover:bg-[#adc6ff]/20 transition-all">
            ✓ Approve
          </button>
          <button className="flex-1 py-2 rounded-lg bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] text-[11px] font-bold hover:bg-[#ffb4ab]/20 transition-all">
            ✕ Refuse
          </button>
        </div>
      )}
    </div>
  );
}

export default function AutorizacaoPage() {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | Authorization["status"]>("all");

  const pending = mockAuthorizations.filter((a) => a.status === "pending").length;
  const approved = mockAuthorizations.filter((a) => a.status === "approved").length;

  const filtered =
    filterStatus === "all"
      ? mockAuthorizations
      : mockAuthorizations.filter((a) => a.status === filterStatus);

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Access Control
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Visit Authorization
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            {pending} pending • {approved} approved today
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all"
        >
          <Plus size={14} />
          New Authorization
        </button>
      </div>

      {/* Form slide-down */}
      {showForm && (
        <div
          className="rounded-2xl border border-[#adc6ff]/20 p-6 mb-8"
          style={{ background: "#171f33" }}
        >
          <h2
            className="text-base font-bold text-[#dae2fd] mb-5"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            New Visit Authorization
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Visitor Name", placeholder: "Full name..." },
              { label: "Host Unit", placeholder: "e.g. 1402" },
              { label: "Visit Date", placeholder: "DD/MM/YYYY" },
              { label: "Visit Time", placeholder: "HH:MM" },
              { label: "Purpose", placeholder: "Reason for visit..." },
              { label: "Document", placeholder: "CPF / RG..." },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f] mb-1.5">{f.label}</p>
                <input
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button className="px-5 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
              Create Authorization
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-[#424754]/30 text-sm font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "approved", "refused", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
              filterStatus === f
                ? "bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20"
                : "text-[#8c909f] hover:text-[#dae2fd] border border-transparent hover:border-[#424754]/30"
            }`}
          >
            {f} {f === "pending" && pending > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#ffb786]/10 text-[#ffb786]">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((auth) => (
          <AuthCard key={auth.id} auth={auth} />
        ))}
      </div>
    </div>
  );
}
