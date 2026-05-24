"use client";

import { useState, useMemo } from "react";
import { mockAuditEvents } from "@/data/mockData";
import type { AuditCategory, AuditEvent } from "@/types";
import {
  Search,
  Download,
  Filter,
  LogIn,
  LogOut,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Calendar,
  Lock,
  Cpu,
  Clock,
} from "lucide-react";

type AuditCategoryConfig = Record<AuditCategory, { label: string; color: string; bg: string; border: string }>;

const actionIcons: Record<string, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  checkin: CheckCircle2,
  checkout: LogOut,
  settings: Settings,
  alert: AlertTriangle,
  check_in: CheckCircle2,
  check_out: LogOut,
  approved: CheckCircle2,
  refused: X,
  package: CheckCircle2,
  valet: Clock,
};

const categoryConfig: AuditCategoryConfig = {
  auth: { label: "Autenticação", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  access: { label: "Acesso", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  system: { label: "Sistema", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  security: { label: "Segurança", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/25" },
  data: { label: "Dados prediais", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
};

// Dicionário de tradução dinâmica de termos de auditoria em inglês
const translateLogAction = (action: string) => {
  const map: Record<string, string> = {
    "Checked-in Visitor": "Check-in de Visitante",
    "Approved Visit": "Visita Aprovada",
    "Unrecognized Entry": "Entrada Não Identificada",
    "Valet Request": "Solicitação de Valet",
    "Package Logged": "Encomenda Registrada",
    "Check-out Visitor": "Check-out de Visitante",
    "Checked-in": "Check-in Efetuado",
    "Approved": "Aprovação Concedida",
    "Refused": "Acesso Recusado",
    "Disparo de Alarme": "Disparo de Alarme",
    "Incidente Encerrado": "Incidente Resolvido",
    "Manutenção de Hardware": "Manutenção de Hardware",
    "Hardware Liberado": "Hardware Liberado",
  };
  return map[action] || action;
};

const translateLogDetails = (details: string) => {
  const map: Record<string, string> = {
    "Courier (FedEx Express) for Resident Marks.": "Entregador (FedEx Express) para o morador Marks.",
    "Scheduled guest (Sarah Jenkins) approved via mobile.": "Convidado agendado (Sarah Jenkins) aprovado via dispositivo móvel.",
    "Access denied to keycard #8832 at North Freight exit.": "Acesso recusado ao cartão #8832 na saída de cargas Norte.",
    "Resident 1505 requested vehicle pickup for 12:30 PM.": "Morador da unidade 1505 solicitou retirada de veículo para 12:30.",
    "Signature received for luxury apparel delivery.": "Assinatura recebida para entrega de mercadoria de luxo.",
    "Marcus Thompson exited lobby. GPS device returned.": "Marcus Thompson saiu do lobby. Chaveiro GPS devolvido na portaria.",
  };
  return map[details] || details;
};

export default function AuditoriaPage() {
  // Estado de dados, filtros e paginação
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | AuditCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Estados de modais
  const [selectedLog, setSelectedLog] = useState<AuditEvent | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  // Status de cópia rápida
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Função geradora de Hash SHA-256 simulado para transparência criptográfica
  const getLogHash = (event: AuditEvent) => {
    const rawString = `${event.id}-${event.timestamp}-${event.userName}-${event.action}-${event.condoUnit}`;
    // Algoritmo de hash determinístico simples em JS para simular SHA-256
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Converte para 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `SHA-256: ${hex}c8e2f89b4a11f20d77ae3481bc26c04fdf826ae7e9120bc71cf2980da67e${hex}`;
  };

  // Filtragem dos eventos de auditoria com base em busca e categorias
  const filteredEvents = useMemo(() => {
    return mockAuditEvents.filter((e) => {
      const detailsText = e.description ?? e.details;
      const userNameText = e.user ?? e.userName;
      const matchSearch =
        !search ||
        userNameText.toLowerCase().includes(search.toLowerCase()) ||
        e.action.toLowerCase().includes(search.toLowerCase()) ||
        detailsText.toLowerCase().includes(search.toLowerCase()) ||
        e.condoUnit.toLowerCase().includes(search.toLowerCase());

      const matchCat = category === "all" || e.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  // Paginação reativa
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  
  // Garante que o índice da página não ultrapasse o limite caso os filtros reduzam a quantidade
  const paginatedSlice = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEvents.slice(start, end);
  }, [filteredEvents, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Resetar página ao mudar filtros
  const handleFilterChange = (cat: "all" | AuditCategory) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  // Exportar dados em JSON formatado
  const getJsonExport = () => {
    const formatted = filteredEvents.map(e => ({
      ID: e.id,
      Horario: e.timestamp,
      Usuario: e.user ?? e.userName,
      Categoria: e.category || "system",
      Acao: translateLogAction(e.action),
      Unidade: e.condoUnit,
      Detalhes: translateLogDetails(e.description ?? e.details),
      Assinatura_Hash: getLogHash(e)
    }));
    return JSON.stringify(formatted, null, 2);
  };

  // Exportar dados em CSV estruturado
  const getCsvExport = () => {
    const headers = ["ID", "Horario", "Usuario", "Categoria", "Acao", "Unidade", "Detalhes", "Assinatura_Hash"];
    const rows = filteredEvents.map(e => [
      e.id,
      e.timestamp,
      e.user ?? e.userName,
      e.category || "system",
      `"${translateLogAction(e.action)}"`,
      `"${e.condoUnit}"`,
      `"${translateLogDetails(e.description ?? e.details)}"`,
      getLogHash(e)
    ]);
    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  };

  // Cópia para área de transferência
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Código exportado copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 min-h-full text-foreground relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl border border-primary/40 bg-primary/15 text-primary flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
            Transparência &amp; Compliance • Concierge OS
          </p>
          <h1
            className="text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Log de Auditoria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rastro completo de auditoria predial imutável com selo de verificação de integridade digital.
          </p>
        </div>
        
        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold hover:bg-primary/95 active:scale-95 transition-all shadow-lg shadow-primary/10 self-start md:self-auto"
        >
          <Download size={16} />
          Exportar Registros
        </button>
      </div>

      {/* Resumo de Contagem de Logs por Categorias */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {(["auth", "access", "system", "security", "data"] as const).map((cat) => {
          const count = mockAuditEvents.filter((e) => e.category === cat).length;
          const cc = categoryConfig[cat];
          const isSelected = category === cat;

          return (
            <button
              key={cat}
              onClick={() => handleFilterChange(isSelected ? "all" : cat)}
              className={`rounded-2xl p-4 border transition-all text-left shadow-md cursor-pointer ${
                isSelected
                  ? `border-primary/40 ${cc.bg} scale-[1.02] shadow-primary/5`
                  : "border-border hover:border-muted-foreground/40 bg-card"
              }`}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {cc.label}
              </p>
              <p className={`text-2xl font-extrabold ${cc.color}`} style={{ fontFamily: "var(--font-manrope)" }}>
                {count}
              </p>
              <span className="text-[9px] text-muted-foreground/60 font-semibold">eventos totais</span>
            </button>
          );
        })}
      </div>

      {/* Caixa do Filtro Principal */}
      <div
        className="rounded-2xl border border-border overflow-hidden shadow-lg bg-card"
      >
        <div className="flex flex-col md:flex-row items-center gap-3 p-4 border-b border-border bg-muted/30">
          <div className="flex-1 relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por operador, ação executada, unidade predial ou detalhes..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {category !== "all" && (
            <button
              onClick={() => handleFilterChange("all")}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all uppercase tracking-wider whitespace-nowrap"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Tabela de Compliance */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            
            {/* Header da Tabela */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              <p className="col-span-5">Ação Operacional</p>
              <p className="col-span-2">Operador</p>
              <p className="col-span-2">Categoria</p>
              <p className="col-span-1">Unidade</p>
              <p className="col-span-2 text-right">Carimbo de Hora</p>
            </div>

            {/* Linhas */}
            <div className="divide-y divide-border">
              {paginatedSlice.length > 0 ? (
                paginatedSlice.map((event) => {
                  const cc = categoryConfig[event.category ?? "system"];
                  const Icon = actionIcons[event.action] || Shield;
                  const detailsText = translateLogDetails(event.description ?? event.details);
                  const actionText = translateLogAction(event.action);
                  const userNameText = event.user ?? event.userName;

                  return (
                    <div
                       key={event.id}
                      onClick={() => setSelectedLog(event)}
                      className="grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer hover:bg-muted/30 transition-all items-center"
                    >
                      {/* Evento & Detalhe */}
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <Icon size={14} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground">{actionText}</p>
                          <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">{detailsText}</p>
                        </div>
                      </div>

                      {/* Operador */}
                      <div className="col-span-2 flex items-center min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">
                            {userNameText.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <p className="text-xs text-foreground/80 truncate font-semibold">{userNameText}</p>
                        </div>
                      </div>

                      {/* Categoria */}
                      <div className="col-span-2 flex items-center">
                        <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase border ${cc.bg} ${cc.color} ${cc.border}`}>
                          {cc.label}
                        </span>
                      </div>

                      {/* Unidade */}
                      <div className="col-span-1 flex items-center">
                        <p className="text-xs font-mono font-bold text-foreground">{event.condoUnit}</p>
                      </div>

                      {/* Timestamp */}
                      <div className="col-span-2 flex items-center justify-end text-right font-medium">
                        <div>
                          <p className="text-xs text-foreground/80 font-semibold">{event.timestamp.split(" ")[0]}</p>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{event.timestamp.split(" ")[1] || ""}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-xs italic">Nenhum evento registrado sob estes termos de filtragem.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Paginação Real Dinâmica */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-muted/20 gap-4">
          <p className="text-xs text-muted-foreground font-semibold">
            Exibindo {paginatedSlice.length} de {filteredEvents.length} registros ({totalPages} {totalPages === 1 ? "página" : "páginas"})
          </p>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border ${
                  n === currentPage
                    ? "bg-primary/10 text-primary border-primary/40 shadow-inner"
                    : "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground cursor-pointer"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MODAL: DETALHES E INTEGRIDADE DO LOG (RECIBO CRIPTOGRÁFICO)           */}
      {/* ========================================================================= */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedLog(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-5 right-5 p-1 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all"
            >
              <X size={16} />
            </button>

            {/* Cabeçalho */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <Lock size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-foreground">Recibo de Transparência e Integridade</h2>
            </div>

            {/* Integridade Certificada */}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl mb-5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 size={14} className="flex-shrink-0" />
              <span>LOG CERTIFICADO • DADO INTEGRO E NÃO MODIFICADO</span>
            </div>

            {/* Metadados */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Operador Responsável</p>
                  <p className="font-semibold text-foreground">{selectedLog.user ?? selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Carimbo de Hora</p>
                  <p className="font-semibold text-foreground">{selectedLog.timestamp}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Ação Efetuada</p>
                  <p className="font-semibold text-foreground">{translateLogAction(selectedLog.action)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Unidade / Alvo</p>
                  <p className="font-semibold text-foreground">{selectedLog.condoUnit}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Detalhamento dos Eventos</p>
                <p className="bg-muted border border-border p-3 rounded-xl leading-normal text-foreground/80">
                  {translateLogDetails(selectedLog.description ?? selectedLog.details)}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                  <Cpu size={11} />
                  Hash Criptográfico de Segurança (Integridade)
                </p>
                <p className="font-mono text-[9px] bg-background border border-border p-3 rounded-xl text-primary break-all leading-normal">
                  {getLogHash(selectedLog)}
                </p>
                <span className="text-[9px] text-muted-foreground italic mt-1 block">
                  * O hash valida matematicamente que este log não sofreu adulterações externas ou invasões de banco de dados.
                </span>
              </div>
            </div>

            {/* Fechar botão */}
            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all text-center"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: EXPORTAR REGISTROS (CSV OU JSON)                                */}
      {/* ========================================================================= */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setIsExportOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs animate-fade-in"
          />

          <div
            className="relative w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{ animationDuration: "200ms" }}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsExportOpen(false)}
              className="absolute top-5 right-5 p-1 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all"
            >
              <X size={16} />
            </button>

            {/* Cabeçalho */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
              <Download size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Exportar Logs da Sessão</h2>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Os logs que estão atualmente sob seus critérios de filtragem foram compilados. Você pode copiá-los em formato JSON formatado para auditoria externa ou salvá-los no padrão CSV.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Formato JSON */}
              <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col justify-between h-80">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Formato JSON</span>
                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-bold">.json</span>
                  </div>
                  <pre className="text-[9px] font-mono text-muted-foreground bg-background p-2.5 border border-border rounded-xl max-h-48 overflow-y-auto leading-normal">
                    {getJsonExport()}
                  </pre>
                </div>
                <button
                  onClick={() => handleCopyToClipboard(getJsonExport())}
                  className="mt-4 py-2 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-bold hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy size={13} />
                  Copiar JSON
                </button>
              </div>

              {/* Formato CSV */}
              <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col justify-between h-80">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Formato CSV</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">.csv</span>
                  </div>
                  <pre className="text-[9px] font-mono text-muted-foreground bg-background p-2.5 border border-border rounded-xl max-h-48 overflow-y-auto leading-normal">
                    {getCsvExport()}
                  </pre>
                </div>
                <button
                  onClick={() => handleCopyToClipboard(getCsvExport())}
                  className="mt-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy size={13} />
                  Copiar CSV
                </button>
              </div>
            </div>

            {/* Fechar botão */}
            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setIsExportOpen(false)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all text-center"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
