"use client";

import { usePathname } from "next/navigation";
import { Bell, Moon, Search, Zap } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/portaria": "Portaria",
  "/rastreamento": "Map Tracking",
  "/moradores": "Residents",
  "/visitantes": "Visitors",
  "/autorizacao": "Authorizations",
  "/condominios": "Properties",
  "/blocos": "Blocks & Units",
  "/alertas": "Security Alerts",
  "/dispositivos": "GPS Fleet",
  "/auditoria": "Audit Log",
  "/perfil": "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Concierge OS";

  return (
    <header
      className="fixed top-0 right-0 h-16 z-40 flex items-center justify-between px-6 border-b border-[#424754]/40 backdrop-blur-xl"
      style={{
        left: "16rem", // 256px = w-64
        background: "rgba(11, 19, 38, 0.85)",
      }}
    >
      {/* Left: brand + search */}
      <div className="flex items-center gap-4">
        <span
          className="text-sm font-bold tracking-widest text-[#dae2fd]/80 uppercase hidden lg:block"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {title}
        </span>
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-[#8c909f]" />
          <input
            type="text"
            placeholder="Search residents, units, or logs..."
            className="bg-[#171f33] border-none text-sm text-[#dae2fd] placeholder-[#8c909f] rounded-xl pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-[#4d8eff]/40 focus:bg-[#222a3d] transition-all"
          />
        </div>
      </div>

      {/* Center: nav tabs */}
      <nav className="hidden lg:flex items-center gap-1">
        {["Directives", "Packages", "Valet"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-1.5 text-xs font-semibold tracking-wide text-[#8c909f] hover:text-[#dae2fd] rounded-lg hover:bg-[#222a3d] transition-all"
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-[#8c909f] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#adc6ff] rounded-full" />
        </button>
        <button className="p-2 rounded-lg text-[#8c909f] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-all">
          <Moon size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#4d8eff]/20 border border-[#4d8eff]/30 flex items-center justify-center ml-1 cursor-pointer hover:border-[#adc6ff]/50 transition-all">
          <Zap size={14} className="text-[#adc6ff]" />
        </div>
      </div>
    </header>
  );
}
