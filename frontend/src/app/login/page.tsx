"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { AtSign, KeyRound, ArrowRight, Loader2, Globe, HelpCircle } from "lucide-react";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#0b1326" }}
    >
      {/* Background glow orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(77, 142, 255, 0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(173, 198, 255, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="mb-10 text-center z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#4d8eff]/20 border border-[#4d8eff]/30 flex items-center justify-center">
            <KeyRound size={16} className="text-[#adc6ff]" />
          </div>
          <span
            className="text-sm font-bold tracking-[0.2em] text-[#adc6ff]/80 uppercase"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Concierge OS
          </span>
        </div>
        <h1
          className="text-5xl font-light text-[#dae2fd]/70 mb-1"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Welcome to
        </h1>
        <h2
          className="text-5xl font-extrabold text-[#dae2fd]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          The Obsidian
        </h2>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#8c909f] uppercase mt-3">
          Authentication Required
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm z-10 rounded-2xl p-8 border border-[#424754]/40"
        style={{
          background: "rgba(23, 31, 51, 0.85)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8c909f]">
              Email Address
            </label>
            <div className="relative">
              <AtSign
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@obsidian-residences.com"
                className="w-full bg-[#2a3347] border-none rounded-xl text-sm text-[#dae2fd] placeholder-[#8c909f]/60 pl-10 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#4d8eff]/40 focus:bg-[#222a3d] transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8c909f]">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-semibold tracking-wide text-[#adc6ff]/70 hover:text-[#adc6ff] uppercase transition-colors"
              >
                Forgot Access?
              </button>
            </div>
            <div className="relative">
              <KeyRound
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#2a3347] border-none rounded-xl text-sm text-[#dae2fd] placeholder-[#8c909f]/60 pl-10 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#4d8eff]/40 focus:bg-[#222a3d] transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-[#ffb4ab] bg-[#ffb4ab]/8 border border-[#ffb4ab]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#4d8eff] hover:bg-[#6a9fff] disabled:opacity-50 text-[#0b1326] text-xs font-bold tracking-[0.18em] uppercase rounded-xl py-4 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Enter Workspace
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer status */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#424754]/30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] status-pulse" />
            <span className="text-[10px] font-semibold tracking-widest text-[#8c909f] uppercase">
              Network Secure
            </span>
          </div>
          <div className="flex items-center gap-3">
            <HelpCircle size={14} className="text-[#8c909f]/60 hover:text-[#8c909f] cursor-pointer transition-colors" />
            <Globe size={14} className="text-[#8c909f]/60 hover:text-[#8c909f] cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <p className="mt-8 text-[10px] tracking-widest text-[#8c909f]/40 uppercase z-10">
        © 2024 Obsidian Luxury Residences • Concierge OS V4.2.0
      </p>

      {/* Terminal access */}
      <div className="fixed bottom-4 right-6">
        <span className="text-[10px] tracking-widest text-[#8c909f]/30 uppercase cursor-pointer hover:text-[#8c909f]/60 transition-colors">
          Terminal Access
        </span>
      </div>
    </div>
  );
}
