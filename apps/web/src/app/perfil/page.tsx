"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Key,
  Camera,
  CheckCircle2,
  Edit3,
} from "lucide-react";

const quickStats = [
  { label: "Active Sessions", value: "2" },
  { label: "Access Level", value: "Admin" },
  { label: "Last Login", value: "Today, 08:41" },
  { label: "Days Active", value: "248" },
];

export default function PerfilPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 min-h-full max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
          Account Settings
        </p>
        <h1
          className="text-3xl font-extrabold text-[#dae2fd]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          User Profile
        </h1>
        <p className="text-sm text-[#8c909f] mt-1">
          Manage your personal information, security, and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-6 text-center"
            style={{ background: "#171f33" }}
          >
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-2xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center text-2xl font-bold text-[#adc6ff] mx-auto">
                MC
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#adc6ff] text-[#0b1326] flex items-center justify-center hover:bg-[#adc6ff]/90 transition-all">
                <Camera size={11} />
              </button>
            </div>
            <h2
              className="text-base font-bold text-[#dae2fd]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Marcus Caldwell
            </h2>
            <p className="text-[12px] text-[#8c909f] mt-0.5">Head Concierge</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] status-pulse" />
              <span className="text-[11px] text-[#10B981] font-medium">Online</span>
            </div>
          </div>

          {/* Permission role card */}
          <div
            className="rounded-2xl border border-[#adc6ff]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-[#adc6ff]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f]">
                Permission Role
              </p>
            </div>
            <p
              className="text-lg font-bold text-[#adc6ff] mb-1"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Administrator
            </p>
            <p className="text-[11px] text-[#8c909f] mb-4">
              Full access to all system modules.
            </p>
            <div className="space-y-2">
              {[
                "Resident Management",
                "Visitor Control",
                "GPS Tracking",
                "Audit Logs",
                "System Config",
              ].map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle2 size={11} className="text-[#10B981]" />
                  <span className="text-[11px] text-[#c2c6d6]">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-5"
            style={{ background: "#171f33" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f] mb-4">
              Quick Stats
            </p>
            <div className="space-y-3">
              {quickStats.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-[12px] text-[#8c909f]">{s.label}</p>
                  <p className="text-[12px] font-semibold text-[#dae2fd]">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal info */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-6"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <User size={15} className="text-[#adc6ff]" />
              <h2
                className="text-base font-bold text-[#dae2fd]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Personal Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name", value: "Marcus", icon: User },
                { label: "Last Name", value: "Caldwell", icon: User },
                { label: "Email", value: "m.caldwell@theobsidian.com", icon: Mail },
                { label: "Phone", value: "+55 11 99999-0000", icon: Phone },
                { label: "Department", value: "Concierge & Operations", icon: Shield },
                { label: "Employee ID", value: "OBS-2024-0042", icon: Key },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-1.5">
                    {f.label}
                  </p>
                  <div className="relative">
                    <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]/50" />
                    <input
                      defaultValue={f.value}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] focus:outline-none focus:border-[#adc6ff]/50 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-6"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Key size={15} className="text-[#adc6ff]" />
              <h2
                className="text-base font-bold text-[#dae2fd]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Security
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Current Password", ph: "••••••••" },
                { label: "New Password", ph: "Min. 12 chars" },
                { label: "Confirm Password", ph: "Repeat new password" },
              ].map((f) => (
                <div key={f.label} className={f.label === "Current Password" ? "sm:col-span-2" : ""}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/60 mb-1.5">
                    {f.label}
                  </p>
                  <input
                    type="password"
                    placeholder={f.ph}
                    className="w-full px-3 py-2 text-sm bg-[#131b2e] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div
            className="rounded-2xl border border-[#424754]/20 p-6"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Bell size={15} className="text-[#adc6ff]" />
              <h2
                className="text-base font-bold text-[#dae2fd]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Notifications
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Security Alerts", desc: "Critical events and breaches", on: true },
                { label: "Visitor Check-ins", desc: "When visitors arrive on premises", on: true },
                { label: "GPS Offline Alerts", desc: "Device connectivity issues", on: false },
                { label: "System Updates", desc: "Platform maintenance and updates", on: false },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-[#424754]/10 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#dae2fd]">{n.label}</p>
                    <p className="text-[11px] text-[#8c909f]">{n.desc}</p>
                  </div>
                  <button
                    className={`relative w-10 h-5 rounded-full transition-all ${
                      n.on ? "bg-[#adc6ff]" : "bg-[#424754]/40"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white/90 shadow-sm transition-all ${
                        n.on ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                saved
                  ? "bg-[#10B981] text-white"
                  : "bg-[#adc6ff] text-[#0b1326] hover:bg-[#adc6ff]/90"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={14} />
                  Saved!
                </>
              ) : (
                <>
                  <Edit3 size={14} />
                  Save Changes
                </>
              )}
            </button>
            <button className="px-6 py-2.5 rounded-xl border border-[#424754]/30 text-sm font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#424754]/60 transition-all">
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
