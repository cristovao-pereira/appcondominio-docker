"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  MapPin,
  Users,
  UserPlus,
  ShieldCheck,
  Grid3X3,
  AlertTriangle,
  Radio,
  ClipboardList,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";

const navGroups = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/portaria", label: "Portaria", icon: Shield },
      { href: "/rastreamento", label: "Map Tracking", icon: MapPin },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/moradores", label: "Residents", icon: Users },
      { href: "/visitantes", label: "Visitors", icon: UserPlus },
      { href: "/autorizacao", label: "Authorizations", icon: ShieldCheck },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/configuracoes", label: "Configurações", icon: Settings },
      { href: "/blocos", label: "Blocks & Units", icon: Grid3X3 },
      { href: "/alertas", label: "Security Alerts", icon: AlertTriangle },
      { href: "/dispositivos", label: "GPS Fleet", icon: Radio },
      { href: "/auditoria", label: "Audit Log", icon: ClipboardList },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50 border-r border-[#424754]/40"
      style={{ background: "#0b1326" }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-[#424754]/30">
        <p className="text-xs font-bold tracking-[0.2em] text-[#adc6ff]/60 uppercase mb-1">
          Concierge OS
        </p>
        <h1
          className="text-lg font-extrabold tracking-tight text-[#dae2fd]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          THE OBSIDIAN
        </h1>
        <p className="text-[11px] text-[#8c909f] mt-1">Unit 402 Concierge</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#8c909f]/70 uppercase px-3 mb-2">
              {group.label}
            </p>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium
                    transition-all duration-200 group relative
                    ${
                      active
                        ? "text-[#adc6ff] bg-[#adc6ff]/8"
                        : "text-[#8c909f] hover:text-[#dae2fd] hover:bg-[#222a3d]"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#adc6ff] rounded-r-full" />
                  )}
                  <Icon
                    size={16}
                    className={active ? "text-[#adc6ff]" : "text-[#8c909f] group-hover:text-[#c2c6d6]"}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 border-t border-[#424754]/30 pt-4">
        <button
          onClick={() => router.push("/perfil")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#8c909f] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-all duration-200 mb-1"
        >
          <User size={16} />
          Meu Perfil
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#8c909f] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-all duration-200 mb-1">
          <HelpCircle size={16} />
          Support
        </button>
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#ffb4ab]/70 hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/8 transition-all duration-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
