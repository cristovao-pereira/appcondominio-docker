"use client";

import { mockCondo } from "@/data/mockData";
import { mockBlocks } from "@/data/mockData";
import {
  Building2,
  MapPin,
  Home,
  Users,
  Grid3X3,
  CheckCircle2,
  Pencil,
  Wifi,
  Bell,
  Shield,
  Clock,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const occupancy = Math.round(
    ((mockCondo.occupiedUnits ?? 0) / (mockCondo.totalUnits ?? 1)) * 100
  );

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Configurações do Sistema
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {mockCondo.name}
          </h1>
          <p className="text-sm text-[#8c909f] mt-1 flex items-center gap-1.5">
            <MapPin size={12} />
            {mockCondo.address}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-[11px] font-bold rounded-full bg-[#adc6ff]/10 text-[#adc6ff]">
            ATIVO
          </span>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#424754]/40 text-sm font-semibold text-[#8c909f] hover:text-[#dae2fd] hover:border-[#adc6ff]/40 transition-all">
            <Pencil size={13} />
            Editar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total de Unidades",
            value: mockCondo.totalUnits ?? 0,
            sub: `${mockCondo.occupiedUnits} ocupadas`,
            icon: Home,
            color: "text-[#adc6ff]",
            bg: "bg-[#adc6ff]/10",
          },
          {
            label: "Moradores",
            value: mockCondo.residents ?? 0,
            sub: "residentes ativos",
            icon: Users,
            color: "text-[#10B981]",
            bg: "bg-[#10B981]/10",
          },
          {
            label: "Blocos",
            value: mockBlocks.length,
            sub: `${mockBlocks.filter((b) => b.status === "active").length} ativos`,
            icon: Grid3X3,
            color: "text-[#ffb786]",
            bg: "bg-[#ffb786]/10",
          },
          {
            label: "Ocupação",
            value: `${occupancy}%`,
            sub: `${mockCondo.occupiedUnits}/${mockCondo.totalUnits} unidades`,
            icon: Building2,
            color: "text-[#b1c6f9]",
            bg: "bg-[#b1c6f9]/10",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border border-[#424754]/20"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f]">
                {s.label}
              </p>
              <div
                className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}
              >
                <s.icon size={13} className={s.color} />
              </div>
            </div>
            <p
              className="text-2xl font-extrabold text-[#dae2fd]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-[#8c909f] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Gerais */}
        <div
          className="rounded-2xl border border-[#424754]/20 p-6"
          style={{ background: "#171f33" }}
        >
          <h2 className="text-sm font-bold text-[#dae2fd] mb-4 flex items-center gap-2">
            <Building2 size={15} className="text-[#adc6ff]" />
            Informações Gerais
          </h2>
          <dl className="space-y-4">
            {[
              { label: "Nome", value: mockCondo.name },
              { label: "Tipo", value: mockCondo.type },
              { label: "Endereço", value: mockCondo.address },
              { label: "Bairro", value: mockCondo.neighborhood },
              { label: "Cidade", value: mockCondo.city ?? "—" },
              {
                label: "Capacidade",
                value: `${mockCondo.unitCapacity} unidades`,
              },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-start">
                <dt className="text-xs text-[#8c909f] font-medium w-28 flex-shrink-0">
                  {item.label}
                </dt>
                <dd className="text-sm text-[#c2c6d6] text-right">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Configurações Operacionais */}
        <div
          className="rounded-2xl border border-[#424754]/20 p-6"
          style={{ background: "#171f33" }}
        >
          <h2 className="text-sm font-bold text-[#dae2fd] mb-4 flex items-center gap-2">
            <Shield size={15} className="text-[#adc6ff]" />
            Configurações Operacionais
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: Wifi,
                label: "Rastreamento GPS",
                desc: "Dispositivos ativos em tempo real",
                enabled: true,
              },
              {
                icon: Bell,
                label: "Alertas de Segurança",
                desc: "Notificações críticas habilitadas",
                enabled: true,
              },
              {
                icon: CheckCircle2,
                label: "Autorização Prévia",
                desc: "Exigir aprovação para visitantes",
                enabled: true,
              },
              {
                icon: Clock,
                label: "Log de Auditoria",
                desc: "Registro completo de eventos",
                enabled: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] border border-[#424754]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#adc6ff]/10 flex items-center justify-center">
                    <item.icon size={14} className="text-[#adc6ff]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#dae2fd]">{item.label}</p>
                    <p className="text-[11px] text-[#8c909f]">{item.desc}</p>
                  </div>
                </div>
                <div
                  className={`w-8 h-4 rounded-full relative transition-all ${
                    item.enabled ? "bg-[#adc6ff]/40" : "bg-[#424754]/40"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
                      item.enabled
                        ? "right-0.5 bg-[#adc6ff]"
                        : "left-0.5 bg-[#8c909f]"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
