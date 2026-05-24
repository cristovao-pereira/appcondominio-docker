"use client";

import { useState } from "react";
import { mockBlocks, mockRecentMovements, mockActiveVisits } from "@/data/mockData";
import type { Block, Unit, UnitStatus } from "@/types";
import {
  Plus,
  Grid3X3,
  Search,
  ChevronRight,
  Home,
  X,
  Check,
  Edit2,
  Trash2,
  User,
  Clock,
  AlertCircle,
  FileText,
  Save,
  Building,
} from "lucide-react";

// Configuração estética para os status das unidades em pt-BR
const unitStatusConfig: Record<UnitStatus, { label: string; color: string; bg: string; dot: string; hoverBg: string }> = {
  occupied: {
    label: "Ocupado",
    color: "text-primary",
    bg: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
    dot: "bg-primary",
  },
  vacant: {
    label: "Vago",
    color: "text-muted-foreground",
    bg: "bg-muted",
    hoverBg: "hover:bg-muted/80",
    dot: "bg-muted-foreground/50",
  },
  maintenance: {
    label: "Em Manutenção",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    hoverBg: "hover:bg-amber-500/20",
    dot: "bg-amber-500",
  },
  reserved: {
    label: "Reservado",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    hoverBg: "hover:bg-blue-500/20",
    dot: "bg-blue-500",
  },
};

// Componente do Cartão de Unidade individual
interface UnitCardProps {
  unit: Unit;
  onClick: () => void;
}

function UnitCard({ unit, onClick }: UnitCardProps) {
  const sc = unitStatusConfig[unit.status];
  const isPenthouse = unit.type === "penthouse";

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-3 border transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] ${
        isPenthouse
          ? "border-primary/30 bg-primary/5 hover:border-primary/50 shadow-md shadow-primary/5"
          : "border-border/40 hover:border-border/80 bg-card"
      }`}
    >
      {isPenthouse && (
        <p className="text-[9px] font-extrabold tracking-widest text-primary uppercase mb-1">
          ★ COBERTURA
        </p>
      )}
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-bold ${isPenthouse ? "text-primary" : "text-foreground"}`}>
          {unit.number}
        </p>
        <div className={`w-2 h-2 rounded-full ${sc.dot} shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
      </div>
      <p className="text-[11px] text-muted-foreground truncate font-medium">
        {unit.resident ? (
          <span className="text-foreground/80 flex items-center gap-1">
            <User size={10} className="inline text-muted-foreground" />
            {unit.resident}
          </span>
        ) : (
          <span className="italic text-muted-foreground/60">Vago</span>
        )}
      </p>
      <span className={`mt-2 inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${sc.bg} ${sc.color}`}>
        {sc.label}
      </span>
    </div>
  );
}

export default function BlocosPage() {
  // Estado local para os blocos (sincronizado com o mock global)
  const [blocks, setBlocks] = useState<Block[]>(() => [...mockBlocks]);

  // Estados de modais e gaveta lateral
  const [selectedUnit, setSelectedUnit] = useState<{ unit: Unit; blockId: string } | null>(null);
  const [addingUnitToBlockId, setAddingUnitToBlockId] = useState<string | null>(null);
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  // Estados dos filtros e busca
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UnitStatus>("all");

  // Estado das seções abertas (colapsáveis)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    mockBlocks.forEach((b) => {
      initial[b.id] = true;
    });
    return initial;
  });

  // Notificações temporárias (Toast)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sincroniza estado local com o mockData para persistir durante a navegação
  const updateBlocksState = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    mockBlocks.length = 0;
    mockBlocks.push(...newBlocks);
  };

  // Alterna colapso das seções
  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Alterna status do bloco (Ativo / Planejamento)
  const toggleBlockStatus = (blockId: string) => {
    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        const nextStatus: "active" | "planning" = b.status === "active" ? "planning" : "active";
        // Se colocar em planejamento, avisa
        showToast(
          `Bloco ${b.name} alterado para status ${nextStatus === "active" ? "Ativo" : "Planejamento"}`
        );
        return { ...b, status: nextStatus };
      }
      return b;
    });
    updateBlocksState(updated);
  };

  // Adiciona novo bloco predial
  const handleAddBlock = (blockName: string, fullName: string, floors: number, totalUnits: number, status: "active" | "planning") => {
    if (blocks.some((b) => b.name.toLowerCase() === blockName.toLowerCase())) {
      showToast("Já existe um bloco com este nome!", "error");
      return;
    }

    const newBlock: Block = {
      id: `b_${Date.now()}`,
      name: blockName,
      fullName: fullName || `Bloco ${blockName}`,
      totalUnits,
      floors,
      status,
      units: [],
    };

    const updated = [...blocks, newBlock];
    updateBlocksState(updated);
    setOpenSections((prev) => ({ ...prev, [newBlock.id]: true }));
    setIsAddBlockOpen(false);
    showToast(`Bloco ${blockName} criado com sucesso!`);
  };

  // Adiciona nova unidade predial
  const handleAddUnit = (blockId: string, unitNumber: string, type: "standard" | "penthouse" | "suite", status: UnitStatus, residentName: string, notes: string) => {
    const targetBlock = blocks.find((b) => b.id === blockId);
    if (!targetBlock) return;

    if (targetBlock.units.some((u) => u.number.toLowerCase() === unitNumber.toLowerCase())) {
      showToast(`A unidade ${unitNumber} já existe no Bloco ${targetBlock.name}!`, "error");
      return;
    }

    const newUnit: Unit = {
      id: `u_${Date.now()}`,
      number: unitNumber,
      status,
      type,
      resident: status === "occupied" || status === "reserved" ? residentName : undefined,
      note: notes || undefined,
    };

    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          units: [...b.units, newUnit].sort((x, y) => x.number.localeCompare(y.number, undefined, { numeric: true })),
        };
      }
      return b;
    });

    updateBlocksState(updated);
    setAddingUnitToBlockId(null);
    showToast(`Unidade ${unitNumber} adicionada ao Bloco ${targetBlock.name}!`);
  };

  // Salva alterações da unidade selecionada na gaveta lateral
  const handleSaveUnitDetails = (updatedUnit: Unit) => {
    if (!selectedUnit) return;

    const updated = blocks.map((b) => {
      if (b.id === selectedUnit.blockId) {
        return {
          ...b,
          units: b.units.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)),
        };
      }
      return b;
    });

    updateBlocksState(updated);
    setSelectedUnit({ unit: updatedUnit, blockId: selectedUnit.blockId });
    showToast(`Dados da Unidade ${updatedUnit.number} atualizados!`);
  };

  // Exclui uma unidade predial
  const handleDeleteUnit = (blockId: string, unitId: string, unitNumber: string) => {
    if (!confirm(`Tem certeza de que deseja excluir a unidade ${unitNumber}?`)) return;

    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          units: b.units.filter((u) => u.id !== unitId),
        };
      }
      return b;
    });

    updateBlocksState(updated);
    setSelectedUnit(null);
    showToast(`Unidade ${unitNumber} excluída.`);
  };

  // Métricas superiores consolidadas
  const totalBlocks = blocks.length;
  const totalUnits = blocks.reduce((a, b) => a + (b.units?.length || 0), 0);
  const occupiedUnits = blocks.reduce((a, b) => a + b.units.filter((u) => u.status === "occupied").length, 0);
  const vacantUnits = blocks.reduce((a, b) => a + b.units.filter((u) => u.status === "vacant").length, 0);
  const maintenanceUnits = blocks.reduce((a, b) => a + b.units.filter((u) => u.status === "maintenance").length, 0);
  const reservedUnits = blocks.reduce((a, b) => a + b.units.filter((u) => u.status === "reserved").length, 0);

  // Busca e Filtros de unidades nos blocos
  const filterAndSearchUnits = (units: Unit[]) => {
    return units.filter((u) => {
      const matchesSearch =
        !search ||
        u.number.toLowerCase().includes(search.toLowerCase()) ||
        (u.resident && u.resident.toLowerCase().includes(search.toLowerCase())) ||
        (u.note && u.note.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || u.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="p-8 min-h-full relative text-foreground">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl border flex items-center gap-2 shadow-2xl animate-fade-in ${
            toastMessage.type === "error"
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {toastMessage.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            Gestão Estrutural • Condomínio Obsidian
          </p>
          <h1
            className="text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Blocos &amp; Unidades
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize e gerencie a distribution de unidades, moradores e estados de ocupação de forma reativa.
          </p>
        </div>
        <button
          onClick={() => setIsAddBlockOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold hover:bg-primary/95 active:scale-95 transition-all shadow-lg shadow-primary/10 self-start md:self-auto"
        >
          <Plus size={16} />
          Adicionar Bloco
        </button>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total de Unidades", value: totalUnits, icon: Home, color: "text-primary", bg: "bg-primary/10" },
          { label: "Ocupadas", value: occupiedUnits, icon: User, color: "text-primary", bg: "bg-primary/10" },
          { label: "Vagas (Livres)", value: vacantUnits, icon: Check, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Em Manutenção", value: maintenanceUnits, icon: AlertCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
          { label: "Reservadas", value: reservedUnits, icon: Clock, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border border-border/40 shadow-md bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={13} className={s.color} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-manrope)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Barra de Filtros e Busca */}
      <div
        className="rounded-2xl p-4 border border-border/40 flex flex-col md:flex-row items-center gap-4 mb-8 bg-card"
      >
        {/* Busca */}
        <div className="relative w-full md:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar unidade, morador ou nota..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Chips de Status */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
              statusFilter === "all"
                ? "bg-primary/10 text-primary border-primary/40"
                : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/40"
            }`}
          >
            Todas
          </button>
          {Object.entries(unitStatusConfig).map(([statusKey, config]) => (
            <button
              key={statusKey}
              onClick={() => setStatusFilter(statusKey as UnitStatus)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                statusFilter === statusKey
                  ? `${config.bg} ${config.color} border-current/40`
                  : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/40"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Renderização dos Blocos */}
      <div className="space-y-6">
        {blocks.map((block) => {
          const isOpened = !!openSections[block.id];
          const filteredUnits = filterAndSearchUnits(block.units);
          const occupiedCount = block.units.filter((u) => u.status === "occupied").length;
          const occupancyRate = block.units.length
            ? Math.round((occupiedCount / block.units.length) * 100)
            : 0;

          return (
            <div
              key={block.id}
              className="rounded-2xl border border-border/40 overflow-hidden shadow-lg transition-all bg-card"
            >
              {/* Header do Bloco */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 gap-4 bg-muted/20">
                <div
                  onClick={() => toggleSection(block.id)}
                  className="flex items-center gap-3 cursor-pointer select-none group flex-1 min-w-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Grid3X3 size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {block.fullName}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                          block.status === "active"
                            ? "bg-[#10B981]/15 text-[#10B981]"
                            : "bg-[#ffb786]/15 text-[#ffb786]"
                        }`}
                      >
                        {block.status === "active" ? "ATIVO" : "PLANEJAMENTO"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {occupiedCount} de {block.units.length} ocupadas • {block.floors || 0} andares
                    </p>
                  </div>
                </div>

                {/* Controles do Bloco */}
                <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                  <button
                    onClick={() => toggleBlockStatus(block.id)}
                    className="px-3 py-1.5 rounded-lg border border-border text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all uppercase tracking-wider"
                  >
                    Alternar Status
                  </button>
                  {block.status === "active" && (
                    <button
                      onClick={() => setAddingUnitToBlockId(block.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-extrabold text-primary hover:bg-primary/20 transition-all uppercase tracking-wider"
                    >
                      <Plus size={12} />
                      Nova Unidade
                    </button>
                  )}
                  <button
                    onClick={() => toggleSection(block.id)}
                    className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  >
                    <ChevronRight
                      size={18}
                      className={`transition-transform duration-200 ${isOpened ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Corpo do Bloco (Grade de Unidades) */}
              {isOpened && (
                <div className="p-6">
                  {block.status === "planning" ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-background/40 border border-border/40 rounded-xl">
                      <AlertCircle size={28} className="text-amber-500 mb-2" />
                      <p className="text-sm font-semibold text-foreground">Bloco em Planejamento</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Este bloco está listado apenas para planejamento futuro de implantação física. Nenhuma unidade está disponível para moradores ou portaria no momento.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Barra de Progresso de Ocupação */}
                      {block.units.length > 0 && (
                        <div className="flex items-center gap-4 mb-6 bg-background/30 p-4 border border-border/40 rounded-xl">
                          <div className="flex-1 h-2 bg-border/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                          <p className="text-xs font-bold text-primary flex-shrink-0">
                            {occupancyRate}% Ocupação
                          </p>
                        </div>
                      )}

                      {/* Lista de Unidades */}
                      {filteredUnits.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                          {filteredUnits.map((unit) => (
                            <UnitCard
                              key={unit.id}
                              unit={unit}
                              onClick={() => setSelectedUnit({ unit, blockId: block.id })}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-sm italic">
                            {block.units.length === 0
                              ? "Nenhuma unidade cadastrada neste bloco."
                              : "Nenhuma unidade corresponde aos filtros ativos."}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. DRAWER LATERAL: DETALHES DA UNIDADE                                     */}
      {/* ========================================================================= */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay escuro */}
          <div
            onClick={() => setSelectedUnit(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer Container */}
          <div
            className="relative w-full max-w-md h-full bg-card border-l border-border p-6 flex flex-col justify-between shadow-2xl animate-slide-in overflow-y-auto"
            style={{ animationDuration: "250ms" }}
          >
            {/* Fechar do Drawer */}
            <button
              onClick={() => setSelectedUnit(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={18} />
            </button>

            {/* Conteúdo Principal */}
            <div>
              {/* Cabeçalho */}
              <div className="flex items-center gap-3 mb-6 pt-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Home size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Apto. {selectedUnit.unit.number}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Bloco {blocks.find((b) => b.id === selectedUnit.blockId)?.name}
                  </p>
                </div>
              </div>

              {/* Status de Ocupação */}
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Status de Ocupação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(unitStatusConfig).map(([statusKey, config]) => {
                    const isCurrent = selectedUnit.unit.status === statusKey;
                    return (
                      <button
                        key={statusKey}
                        onClick={() => {
                          const updatedUnit = {
                            ...selectedUnit.unit,
                            status: statusKey as UnitStatus,
                            // Se mudar para vago ou manutenção, remove morador por padrão
                            resident:
                              statusKey === "vacant" || statusKey === "maintenance"
                                ? undefined
                                : selectedUnit.unit.resident || "",
                          };
                          setSelectedUnit({ unit: updatedUnit, blockId: selectedUnit.blockId });
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                          isCurrent
                            ? `${config.bg} ${config.color} border-current/40 font-bold shadow-md shadow-[#000]/10`
                            : "bg-background/40 border border-border text-muted-foreground hover:bg-background"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formulário Interativo */}
              <div className="space-y-4">
                {/* Morador Responsável */}
                {(selectedUnit.unit.status === "occupied" || selectedUnit.unit.status === "reserved") && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                      Morador Responsável
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={selectedUnit.unit.resident || ""}
                        onChange={(e) => {
                          const updatedUnit = { ...selectedUnit.unit, resident: e.target.value };
                          setSelectedUnit({ unit: updatedUnit, blockId: selectedUnit.blockId });
                        }}
                        placeholder="Nome do residente principal"
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Tipo de Unidade */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                    Tipo de Unidade
                  </label>
                  <select
                    value={selectedUnit.unit.type || "standard"}
                    onChange={(e) => {
                      const updatedUnit = {
                        ...selectedUnit.unit,
                        type: e.target.value as "standard" | "penthouse" | "suite",
                      };
                      setSelectedUnit({ unit: updatedUnit, blockId: selectedUnit.blockId });
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="standard">Padrão</option>
                    <option value="penthouse">Cobertura (Penthouse)</option>
                    <option value="suite">Suíte Executiva</option>
                  </select>
                </div>

                {/* Notas Internas */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                    Notas Prediais / Observações
                  </label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <textarea
                      value={selectedUnit.unit.note || ""}
                      onChange={(e) => {
                        const updatedUnit = { ...selectedUnit.unit, note: e.target.value };
                        setSelectedUnit({ unit: updatedUnit, blockId: selectedUnit.blockId });
                      }}
                      placeholder="Observações internas (ex: reformas, restrições, vazamentos...)"
                      rows={3}
                      className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Histórico Integrado (Timeline) */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Movimentações Recentes na Unidade
                </p>
                {(() => {
                  const movements = mockRecentMovements.filter((m) =>
                    m.destination.toLowerCase().includes(selectedUnit.unit.number.toLowerCase())
                  );
                  const active = mockActiveVisits.filter((v) =>
                    v.unit.toLowerCase().includes(selectedUnit.unit.number.toLowerCase())
                  );

                  const allHistory = [
                    ...active.map((a) => ({
                      id: a.id,
                      name: a.visitorName || a.name,
                      type: a.type,
                      time: a.checkInTime || a.timeIn,
                      status: "Ativo" as const,
                      initials: a.initials || "V",
                    })),
                    ...movements.map((m) => ({
                      id: m.id,
                      name: m.name,
                      type: m.type,
                      time: m.time,
                      status: m.status === "entry" ? ("Entrada" as const) : ("Saída" as const),
                      initials: m.initials || "V",
                    })),
                  ];

                  if (allHistory.length === 0) {
                    return (
                      <p className="text-xs italic text-muted-foreground/60 bg-background/20 p-4 border border-border/40 rounded-xl text-center">
                        Nenhum registro de acesso recente nesta unidade.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {allHistory.slice(0, 4).map((h, i) => (
                        <div key={h.id + i} className="flex gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5" />
                            {i < allHistory.length - 1 && (
                              <div className="w-px flex-1 bg-border mt-1" />
                            )}
                          </div>
                          <div className="pb-2 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-foreground truncate">{h.name}</p>
                              <span
                                className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                                  h.status === "Ativo"
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                    : h.status === "Entrada"
                                    ? "bg-primary/15 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {h.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {h.type === "guest"
                                  ? "Visitante"
                                  : h.type === "maintenance"
                                  ? "Manutenção"
                                  : "Entrega"}{" "}
                              • {h.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Ações Inferiores do Drawer */}
            <div className="mt-8 pt-4 border-t border-border flex gap-2">
              <button
                onClick={() => handleSaveUnitDetails(selectedUnit.unit)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Save size={13} />
                Salvar
              </button>
              <button
                onClick={() =>
                  handleDeleteUnit(selectedUnit.blockId, selectedUnit.unit.id, selectedUnit.unit.number)
                }
                className="px-3.5 py-2.5 rounded-xl border border-destructive/40 text-destructive text-xs font-bold hover:bg-destructive/10 active:scale-95 transition-all"
                title="Excluir Unidade"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: ADICIONAR BLOCO PREDIAL                                          */}
      {/* ========================================================================= */}
      {isAddBlockOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddBlockOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsAddBlockOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>

            {/* Título */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <Building size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Adicionar Novo Bloco</h2>
            </div>

            {/* Formulário */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const name = (data.get("name") as string).toUpperCase().trim();
                const desc = data.get("desc") as string;
                const floors = Number(data.get("floors"));
                const capacity = Number(data.get("capacity"));
                const status = data.get("status") as "active" | "planning";

                if (!name) {
                  showToast("Nome do bloco é obrigatório!", "error");
                  return;
                }

                handleAddBlock(name, desc, floors, capacity, status);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Nome Curto do Bloco *
                </label>
                <input
                  name="name"
                  required
                  maxLength={5}
                  placeholder="Ex: D, E, F"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Descrição Completa
                </label>
                <input
                  name="desc"
                  placeholder="Ex: Bloco D: Obsidian East"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Nº de Andares
                  </label>
                  <input
                    name="floors"
                    type="number"
                    min={1}
                    defaultValue={5}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Capacidade Prevista
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    min={1}
                    defaultValue={40}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Status de Implantação
                </label>
                <select
                  name="status"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="active">Ativo (Pronto para Uso)</option>
                  <option value="planning">Em Planejamento (Inativo)</option>
                </select>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBlockOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all text-center"
                >
                  Criar Bloco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: ADICIONAR UNIDADE PREDIAL EM UM BLOCO ESPECÍFICO                  */}
      {/* ========================================================================= */}
      {addingUnitToBlockId && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setAddingUnitToBlockId(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setAddingUnitToBlockId(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>

            {/* Título */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <Home size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Nova Unidade no Bloco {blocks.find((b) => b.id === addingUnitToBlockId)?.name}
              </h2>
            </div>

            {/* Formulário */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const num = (data.get("number") as string).trim();
                const type = data.get("type") as "standard" | "penthouse" | "suite";
                const status = data.get("status") as UnitStatus;
                const resident = (data.get("resident") as string).trim();
                const notes = (data.get("notes") as string).trim();

                if (!num) {
                  showToast("O número da unidade é obrigatório!", "error");
                  return;
                }

                handleAddUnit(addingUnitToBlockId, num, type, status, resident, notes);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Número da Unidade *
                </label>
                <input
                  name="number"
                  required
                  placeholder="Ex: 101, A-102, 502"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Tipo de Unidade
                  </label>
                  <select
                    name="type"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="standard">Padrão</option>
                    <option value="penthouse">Cobertura</option>
                    <option value="suite">Suíte</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                    Status Inicial
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="occupied">Ocupada</option>
                    <option value="vacant">Vaga</option>
                    <option value="maintenance">Em Manutenção</option>
                    <option value="reserved">Reservada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Morador Responsável
                </label>
                <input
                  name="resident"
                  placeholder="Nome do residente principal (se ocupada)"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  Necessário apenas se o status inicial for &quot;Ocupada&quot; ou &quot;Reservada&quot;.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  Notas / Observações
                </label>
                <textarea
                  name="notes"
                  placeholder="Instruções ou notas específicas"
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddingUnitToBlockId(null)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all text-center"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
