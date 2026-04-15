"use client";

import { useState } from "react";
import { mockBlocks } from "@/data/mockData";
import type { Block, Unit } from "@/types";
import { Plus, Grid3x3, Search, ChevronRight, Home } from "lucide-react";

const unitStatusConfig: Record<Unit["status"], { label: string; color: string; bg: string; dot: string }> = {
  occupied: { label: "Occupied", color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/8", dot: "bg-[#adc6ff]" },
  vacant: { label: "Vacant", color: "text-[#8c909f]", bg: "bg-[#8c909f]/8", dot: "bg-[#8c909f]/50" },
  maintenance: { label: "Maint.", color: "text-[#ffb786]", bg: "bg-[#ffb786]/8", dot: "bg-[#ffb786]" },
  reserved: { label: "Reserved", color: "text-[#b1c6f9]", bg: "bg-[#b1c6f9]/8", dot: "bg-[#b1c6f9]" },
};

function UnitCard({ unit }: { unit: Unit }) {
  const sc = unitStatusConfig[unit.status];
  const isPenthouse = unit.type === "penthouse";
  return (
    <div
      className={`rounded-xl p-3 border transition-all cursor-pointer hover:scale-[1.02] ${
        isPenthouse
          ? "border-[#adc6ff]/30 bg-[#4d8eff]/5 hover:border-[#adc6ff]/50"
          : "border-[#424754]/20 hover:border-[#424754]/40"
      }`}
      style={{ background: isPenthouse ? undefined : "#1a2236" }}
    >
      {isPenthouse && (
        <p className="text-[9px] font-bold tracking-widest text-[#adc6ff]/60 uppercase mb-1">
          ★ PENTHOUSE
        </p>
      )}
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-bold ${isPenthouse ? "text-[#adc6ff]" : "text-[#dae2fd]"}`}>
          {unit.number}
        </p>
        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
      </div>
      <p className="text-[11px] text-[#8c909f] truncate">{unit.resident ?? "Vacant"}</p>
      <span className={`mt-2 inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${sc.bg} ${sc.color}`}>
        {sc.label}
      </span>
    </div>
  );
}

function BlockSection({ block }: { block: Block }) {
  const [open, setOpen] = useState(true);
  const occupied = block.units.filter((u) => u.status === "occupied").length;

  return (
    <div
      className="rounded-2xl border border-[#424754]/20 overflow-hidden mb-6"
      style={{ background: "#171f33" }}
    >
      {/* Block header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#222a3d]/40 transition-all border-b border-[#424754]/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
            <Grid3x3 size={15} className="text-[#adc6ff]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#dae2fd]">{block.name}</p>
            <p className="text-[11px] text-[#8c909f]">
              {occupied}/{block.units.length} occupied • {block.floors} floors
            </p>
          </div>
        </div>
        <ChevronRight
          size={16}
          className={`text-[#8c909f] transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {/* Units grid */}
      {open && (
        <div className="p-5">
          {/* Occupancy bar */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1.5 bg-[#424754]/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#adc6ff] rounded-full"
                style={{ width: `${Math.round((occupied / block.units.length) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-[#8c909f]">
              {Math.round((occupied / block.units.length) * 100)}% Occupancy
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {block.units.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlocosPage() {
  const [search, setSearch] = useState("");
  const totalUnits = mockBlocks.reduce((a, b) => a + b.units.length, 0);
  const occupied = mockBlocks.reduce((a, b) => a + b.units.filter((u) => u.status === "occupied").length, 0);
  const vacant = mockBlocks.reduce((a, b) => a + b.units.filter((u) => u.status === "vacant").length, 0);

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c909f] uppercase mb-1">
            Structure Management
          </p>
          <h1
            className="text-3xl font-extrabold text-[#dae2fd]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Blocks &amp; Units
          </h1>
          <p className="text-sm text-[#8c909f] mt-1">
            Visualize and manage the complete unit layout across all residential blocks.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#adc6ff] text-[#0b1326] text-sm font-bold hover:bg-[#adc6ff]/90 transition-all">
          <Plus size={14} />
          Add Block
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Units", value: totalUnits, color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10" },
          { label: "Occupied", value: occupied, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
          { label: "Vacant", value: vacant, color: "text-[#8c909f]", bg: "bg-[#8c909f]/10" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border border-[#424754]/20"
            style={{ background: "#171f33" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Home size={13} className={s.color} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f]">{s.label}</p>
            </div>
            <p className="text-2xl font-extrabold text-[#dae2fd]" style={{ fontFamily: "var(--font-manrope)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blocks or units..."
          className="w-full max-w-sm pl-9 pr-4 py-2 text-sm bg-[#171f33] border border-[#424754]/30 rounded-lg text-[#dae2fd] placeholder:text-[#8c909f]/60 focus:outline-none focus:border-[#adc6ff]/50"
        />
      </div>

      {/* Blocks */}
      {mockBlocks.map((block) => (
        <BlockSection key={block.id} block={block} />
      ))}
    </div>
  );
}
