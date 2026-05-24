"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  Moon, 
  Sun,
  Search, 
  Zap, 
  X, 
  FileText, 
  Package, 
  Car, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  Clock, 
  User, 
  Home, 
  MessageSquare,
  Volume2,
  VolumeX,
  Shield,
  Trash2,
  BellRing
} from "lucide-react";
import { mockResidents } from "@/data/mockData";

// Títulos das páginas para exibição local
const pageTitles: Record<string, string> = {
  "/dashboard": "Painel de Controle",
  "/portaria": "Guarita Principal",
  "/rastreamento": "Rastreamento GPS",
  "/moradores": "Cadastro de Moradores",
  "/visitantes": "Controle de Visitantes",
  "/autorizacao": "Autorizações de Entrada",
  "/configuracoes": "Ajustes do Sistema",
  "/blocos": "Blocos & Unidades",
  "/alertas": "Alertas de Segurança",
  "/dispositivos": "Ativos & Dispositivos",
  "/auditoria": "Logs de Auditoria",
  "/perfil": "Perfil do Operador",
  "/suporte": "Suporte Técnico",
};

// Dados Mock locais para a Barra Superior
const initialDirectives = [
  { id: 1, title: "Mudança Apto 104-A", description: "Mudança agendada da família Marcus das 08h às 12h. Elevador de serviço bloqueado para uso exclusivo.", time: "Hoje • Período da Manhã", category: "Mudança" },
  { id: 2, title: "Manutenção Elevador Bloco B", description: "Elevador de serviço do Bloco B inoperante das 14h às 16h para manutenção corretiva pela Elevatech.", time: "Hoje • 14:00 às 16:00", category: "Manutenção" },
  { id: 3, title: "Dedetização Áreas Comuns", description: "Dedetização preventiva do subsolo e garagem de veículos. Evitar tráfego de pedestres no local.", time: "Quarta-feira • 09:00", category: "Serviço" }
];

const initialPackages = [
  { id: 1, recipient: "Alexandra Vance", unit: "402-A", courier: "Amazon Logistics", type: "Caixa Média", trackingCode: "AMZ-99823-BR", timeReceived: "Hoje, 14:20" },
  { id: 2, recipient: "Marcus Holloway", unit: "1204", courier: "FedEx Express", type: "Envelope de Documento", trackingCode: "FDX-77281-US", timeReceived: "Hoje, 14:22" },
  { id: 3, recipient: "Evelyn Sterling", unit: "812", courier: "Mercado Livre", type: "Pacote Padrão", trackingCode: "MEL-00381-BR", timeReceived: "Hoje, 10:15" }
];

const initialValet = [
  { id: 1, resident: "Dr. Elias Vance", unit: "402-A", car: "Audi R8 - Preto", plate: "EVO-0402", requestedTime: "Há 5 min", status: "preparing" },
  { id: 2, resident: "Julian Thorne", unit: "Penthouse B", car: "Porsche 911 - Cinza", plate: "JUT-0911", requestedTime: "Há 12 min", status: "delayed" }
];

const initialAlerts = [
  { id: 1, type: "critical", title: "Violação de Perímetro", message: "Sensor da Doca Norte disparou. Possível abertura forçada.", time: "2 min atrás" },
  { id: 2, type: "warning", title: "Bateria Crítica", message: "Sensor sem fio da Guarita 2 opera com menos de 10% de carga.", time: "15 min atrás" }
];

const initialMessages = [
  { id: 1, sender: "Alexandra Vance (402-A)", text: "Por favor, não autorizar nenhum visitante hoje após as 21h.", time: "Há 8 min" },
  { id: 2, sender: "Lois Miclsen (B-1200)", text: "Encomendei mantimentos frios. Assim que chegar, favor interfonar urgente.", time: "Há 1h" }
];

export function TopBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Concierge OS";

  // Estado do Tema (Dark/Light)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Sincronizar estado inicial com a classe configurada no HTML pelo script antiflash
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Estados dos Modais
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDirectivesOpen, setIsDirectivesOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isValetOpen, setIsValetOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isPanicConfirmOpen, setIsPanicConfirmOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Estados dos dados reativos
  const [directives] = useState(initialDirectives);
  const [packages, setPackages] = useState(initialPackages);
  const [valetRequests, setValetRequests] = useState(initialValet);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [messages, setMessages] = useState(initialMessages);

  // Audio e Pânico
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Estados da Busca
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focar input do spotlight quando abre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Teclas de atalho (Cmd+K ou Ctrl+K abre a busca)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Controlar o áudio do alarme de pânico
  useEffect(() => {
    if (isPanicActive && !isMuted) {
      startSiren();
    } else {
      stopSiren();
    }
    return () => stopSiren();
  }, [isPanicActive, isMuted]);

  const startSiren = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      let high = true;
      const interval = setInterval(() => {
        if (oscRef.current && ctx.state === "running") {
          oscRef.current.frequency.exponentialRampToValueAtTime(
            high ? 880 : 440,
            ctx.currentTime + 0.4
          );
          high = !high;
        } else {
          clearInterval(interval);
        }
      }, 500);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.error("Erro no Web Audio API:", e);
    }
  };

  const stopSiren = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // Funções de Ação Reativas
  const handleDeliverPackage = (id: number) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeliverValet = (id: number) => {
    setValetRequests((prev) => prev.filter((v) => v.id !== id));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
    setMessages([]);
  };

  const triggerPanic = () => {
    setIsPanicConfirmOpen(false);
    setIsPanicActive(true);
    setIsMuted(false); // Ativar com som por padrão ao acionar pânico real
  };

  const deactivatePanic = () => {
    setIsPanicActive(false);
    stopSiren();
  };

  // Filtragem de busca global
  const filteredResidents = searchQuery.trim()
    ? mockResidents.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.unit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredDirectives = searchQuery.trim()
    ? directives.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Banner de Emergência quando o Pânico estiver Ativo */}
      {isPanicActive && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#ef4444] text-white flex items-center justify-between px-6 z-[9999] animate-pulse shadow-[0_4px_30px_rgba(239,68,68,0.5)]">
          <div className="flex items-center gap-3">
            <ShieldAlert className="animate-spin text-white" size={24} />
            <span className="font-extrabold tracking-wide uppercase text-sm sm:text-base">
              ⚠️ ALERTA DE PÂNICO GERAL DA PORTARIA ATIVADO — CENTRAL NOTIFICADA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-all text-xs font-bold flex items-center gap-2 border border-white/20"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isMuted ? "Ligar Áudio" : "Mutar Sirene"}
            </button>
            <button
              onClick={deactivatePanic}
              className="bg-white text-[#ef4444] px-4 py-1.5 rounded-lg text-xs font-black uppercase hover:bg-neutral-100 transition-all border border-transparent shadow-lg shadow-black/20"
            >
              Desarmar Pânico
            </button>
          </div>
        </div>
      )}

      {/* Header Principal */}
      <header
        className={`fixed top-0 right-0 left-64 h-16 z-40 flex items-center justify-between px-6 border-b border-border bg-background/85 backdrop-blur-xl transition-all duration-300 ${
          isPanicActive ? "top-14" : ""
        }`}
        style={{
          background: isPanicActive ? "rgba(239, 68, 68, 0.15)" : undefined,
          boxShadow: isPanicActive ? "0 4px 30px rgba(239, 68, 68, 0.1) inset" : "none",
        }}
      >
        {/* Esquerda: Título da Rota + Campo de Busca Simulador */}
        <div className="flex items-center gap-4">
          <span
            className="text-sm font-bold tracking-widest text-foreground/90 uppercase hidden lg:block"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {title}
          </span>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="relative hidden md:flex items-center text-left bg-card/75 hover:bg-accent border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground text-xs px-3 py-2 rounded-xl w-64 transition-all group"
          >
            <Search size={14} className="mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>Buscar moradores ou unidades...</span>
            <kbd className="absolute right-2 top-2 bg-muted text-[10px] text-muted-foreground px-1.5 py-0.5 rounded border border-border/40 font-mono hidden sm:inline-block">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Centro: Três Menus do Meio (Diretrizes, Encomendas, Valet) */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Diretrizes */}
          <button
            onClick={() => setIsDirectivesOpen(true)}
            className="relative px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent border border-transparent hover:border-border/30 transition-all flex items-center gap-1.5"
          >
            <FileText size={13} />
            <span>Diretrizes</span>
            {directives.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[9px] text-primary font-bold border border-primary/30">
                {directives.length}
              </span>
            )}
          </button>

          {/* Encomendas */}
          <button
            onClick={() => setIsPackagesOpen(true)}
            className="relative px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent border border-transparent hover:border-border/30 transition-all flex items-center gap-1.5"
          >
            <Package size={13} />
            <span>Encomendas</span>
            {packages.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[9px] text-amber-600 dark:text-amber-200 font-bold border border-amber-500/30 animate-pulse">
                {packages.length}
              </span>
            )}
          </button>

          {/* Valet */}
          <button
            onClick={() => setIsValetOpen(true)}
            className="relative px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent border border-transparent hover:border-border/30 transition-all flex items-center gap-1.5"
          >
            <Car size={13} />
            <span>Valet</span>
            {valetRequests.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] text-emerald-600 dark:text-emerald-200 font-bold border border-emerald-500/30">
                {valetRequests.length}
              </span>
            )}
          </button>
        </nav>

        {/* Direita: Notificações (Sininho) | DarkMode | SOS Pânico */}
        <div className="flex items-center gap-2">
          {/* Sininho */}
          <button
            onClick={() => setIsBellOpen(true)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border/25 transition-all"
          >
            <Bell size={18} />
            {(alerts.length > 0 || messages.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background animate-pulse" />
            )}
          </button>

          {/* Alternância de Tema Dark/Light Premium com micro-animação */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border/25 transition-all active:scale-95 duration-300"
            title={theme === "dark" ? "Ativar Tema Claro" : "Ativar Tema Escuro"}
          >
            <div className="relative w-[18px] h-[18px] flex items-center justify-center">
              <Moon 
                size={18} 
                className={`absolute transition-all duration-500 transform ${
                  theme === "dark" 
                    ? "rotate-0 scale-100 opacity-100" 
                    : "rotate-90 scale-0 opacity-0"
                }`} 
              />
              <Sun 
                size={18} 
                className={`absolute text-amber-500 transition-all duration-500 transform ${
                  theme === "light" 
                    ? "rotate-0 scale-100 opacity-100" 
                    : "-rotate-90 scale-0 opacity-0"
                }`} 
              />
            </div>
          </button>

          {/* SOS Pânico */}
          <button
            onClick={() => {
              if (isPanicActive) {
                deactivatePanic();
              } else {
                setIsPanicConfirmOpen(true);
              }
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center ml-1 border transition-all duration-300 ${
              isPanicActive
                ? "bg-[#ef4444] border-white text-white animate-ping"
                : "bg-[#ef4444]/10 hover:bg-[#ef4444]/35 border-[#ef4444]/30 hover:border-[#ef4444]/60 text-[#ef4444] animate-pulse"
            }`}
            title={isPanicActive ? "Desativar Pânico" : "Disparar Pânico da Portaria"}
          >
            <ShieldAlert size={16} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. MODAL BUSCA GLOBAL (SPOTLIGHT MODAL)                                   */}
      {/* ========================================================================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-start justify-center pt-24 px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            {/* Header Busca */}
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-primary w-full mr-4">
                <Search size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Pesquise moradores (ex: Vance), blocos, ou diretrizes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-foreground text-sm focus:outline-none w-full placeholder-muted-foreground"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>

            {/* Resultados */}
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-4">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground">Digite algo para iniciar a pesquisa predial.</p>
                  <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    {["Vance", "Apto 402", "Mudança", "Visitantes"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="bg-card hover:bg-accent border border-border/65 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Categoria Moradores */}
                  {filteredResidents.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={10} className="text-primary" /> Moradores Encontrados
                      </h4>
                      <div className="space-y-1.5">
                        {filteredResidents.map((r) => (
                          <div
                            key={r.id}
                            className="bg-card hover:bg-accent border border-border/40 p-2.5 rounded-xl flex items-center justify-between text-xs transition-all"
                          >
                            <div>
                              <p className="font-bold text-foreground">{r.name}</p>
                              <p className="text-[10px] text-muted-foreground">{r.company}</p>
                            </div>
                            <div className="text-right">
                              <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono text-[10px]">
                                Apto {r.unit}
                              </span>
                              <p className="text-[9px] text-muted-foreground mt-1">{r.contact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categoria Diretrizes */}
                  {filteredDirectives.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={10} className="text-amber-500" /> Diretrizes Relacionadas
                      </h4>
                      <div className="space-y-1.5">
                        {filteredDirectives.map((d) => (
                          <div
                            key={d.id}
                            className="bg-card hover:bg-accent border border-border/40 p-2.5 rounded-xl text-xs transition-all"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-bold text-foreground">{d.title}</p>
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-200 border border-amber-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                                {d.category}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-[10px]">{d.description}</p>
                            <p className="text-[9px] text-primary mt-1">{d.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nenhum Resultado */}
                  {filteredResidents.length === 0 && filteredDirectives.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground">Nenhum registro encontrado para "{searchQuery}".</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-3 bg-muted/40 border-t border-border/40 flex justify-between text-[10px] text-muted-foreground">
              <span>Dica: Use as setas para navegar (em breve)</span>
              <span>Pressione [ESC] para fechar</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL DIRETRIZES                                                       */}
      {/* ========================================================================= */}
      {isDirectivesOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground">
                <FileText size={18} className="text-primary" />
                <h3 className="font-bold text-sm">Diretrizes da Administração</h3>
              </div>
              <button
                onClick={() => setIsDirectivesOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 max-h-[380px] overflow-y-auto space-y-3">
              {directives.map((d) => (
                <div
                  key={d.id}
                  className="bg-card border border-border/40 p-3 rounded-xl space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-foreground">{d.title}</h4>
                    <span className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold">
                      {d.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{d.description}</p>
                  <div className="flex items-center gap-1 text-[9px] text-primary pt-1">
                    <Clock size={10} />
                    <span>{d.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-muted/40 border-t border-border/40 text-center">
              <button
                onClick={() => setIsDirectivesOpen(false)}
                className="text-xs text-primary hover:text-foreground font-bold transition-colors"
              >
                Entendido, Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL ENCOMENDAS (PACKAGES)                                            */}
      {/* ========================================================================= */}
      {isPackagesOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground">
                <Package size={18} className="text-amber-500" />
                <h3 className="font-bold text-sm">Encomendas Recebidas na Portaria</h3>
              </div>
              <button
                onClick={() => setIsPackagesOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 max-h-[380px] overflow-y-auto space-y-3">
              {packages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">Nenhuma encomenda pendente de retirada.</p>
                </div>
              ) : (
                packages.map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-border/40 p-3 rounded-xl flex items-center justify-between transition-all hover:border-amber-500/35"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-200 px-2 py-0.5 rounded font-mono text-[10px] border border-amber-500/25 font-bold">
                          Apto {p.unit}
                        </span>
                        <h4 className="font-bold text-xs text-foreground">{p.recipient}</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{p.courier} • {p.type}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">{p.trackingCode}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-[9px] text-muted-foreground">{p.timeReceived}</span>
                      <button
                        onClick={() => handleDeliverPackage(p.id)}
                        className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-transparent text-amber-600 dark:text-amber-200 hover:text-white dark:hover:text-black font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Check size={10} />
                        <span>Entregar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-muted/40 border-t border-border/40 text-center">
              <p className="text-[9.5px] text-muted-foreground">
                Ao dar baixa em "Entregar", o morador é automaticamente notificado via aplicativo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL VALET                                                            */}
      {/* ========================================================================= */}
      {isValetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground">
                <Car size={18} className="text-emerald-500" />
                <h3 className="font-bold text-sm">Fila de Espera de Veículos (Valet)</h3>
              </div>
              <button
                onClick={() => setIsValetOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 max-h-[380px] overflow-y-auto space-y-3">
              {valetRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">Nenhuma solicitação de veículo ativa no momento.</p>
                </div>
              ) : (
                valetRequests.map((v) => (
                  <div
                    key={v.id}
                    className="bg-card border border-border/40 p-3 rounded-xl flex items-center justify-between hover:border-emerald-500/35 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-200 px-2 py-0.5 rounded font-mono text-[10px] border border-emerald-500/25 font-bold">
                          Apto {v.unit}
                        </span>
                        <h4 className="font-bold text-xs text-foreground">{v.resident}</h4>
                      </div>
                      <p className="text-[11px] text-foreground font-medium">{v.car}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">Placa: {v.plate}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Clock size={9} />
                        {v.requestedTime}
                      </span>
                      <button
                        onClick={() => handleDeliverValet(v.id)}
                        className="bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-transparent text-emerald-600 dark:text-emerald-200 hover:text-white dark:hover:text-black font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Check size={10} />
                        <span>Entregue</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-muted/40 border-t border-border/40 text-center">
              <p className="text-[9.5px] text-muted-foreground">
                Lista de veículos solicitados para estacionamento frontal/manobrista.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. POPOVER/MODAL DO SININHO (NOTIFICAÇÕES E MENSAGENS)                     */}
      {/* ========================================================================= */}
      {isBellOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4">
          <div className="bg-background/95 border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/30 animate-[scaleIn_0.15s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground">
                <BellRing size={18} className="text-primary" />
                <h3 className="font-bold text-sm">Notificações da Portaria</h3>
              </div>
              <button
                onClick={() => setIsBellOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 max-h-[380px] overflow-y-auto space-y-4">
              {/* Seção Alertas de Segurança */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert size={11} className="text-[#ef4444]" /> Alertas Críticos
                </h4>
                {alerts.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic pl-2">Nenhum alerta de segurança ativo.</p>
                ) : (
                  <div className="space-y-1.5">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className="bg-[#ef4444]/5 border border-[#ef4444]/15 p-2.5 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-[#ef4444] dark:text-[#fca5a5]">{a.title}</p>
                          <span className="text-[9px] text-[#ef4444] font-semibold">{a.time}</span>
                        </div>
                        <p className="text-foreground text-[10px]">{a.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seção Mensagens de Moradores */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare size={11} className="text-primary" /> Mensagens dos Apartamentos
                </h4>
                {messages.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic pl-2">Nenhuma mensagem recente.</p>
                ) : (
                  <div className="space-y-1.5">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className="bg-card border border-border/40 p-2.5 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-foreground">{m.sender}</p>
                          <span className="text-[9px] text-primary">{m.time}</span>
                        </div>
                        <p className="text-muted-foreground text-[10px] italic">"{m.text}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-muted/40 border-t border-border/40 flex justify-between items-center">
              <button
                onClick={handleClearAlerts}
                className="text-[10px] text-[#ef4444] hover:text-[#fca5a5] font-semibold flex items-center gap-1"
              >
                <Trash2 size={11} />
                <span>Limpar Notificações</span>
              </button>
              <button
                onClick={() => setIsBellOpen(false)}
                className="text-xs text-primary hover:text-foreground font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL DE CONFIRMAÇÃO DE PÂNICO                                         */}
      {/* ========================================================================= */}
      {isPanicConfirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center px-4 animate-[fadePlay_0.15s_ease-out]">
          <div className="bg-[#1a0a0f] border border-[#ef4444]/40 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_15px_50px_rgba(239,68,68,0.3)] p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/40 flex items-center justify-center mx-auto text-[#ef4444] animate-bounce">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-white tracking-wide uppercase">
                ⚠️ Confirmar Disparo de Pânico?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Esta ação notificará a central administrativa, ativará os alertas em tela e iniciará o sinal sonoro de emergência do Concierge OS.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsPanicConfirmOpen(false)}
                className="w-1/2 bg-[#171f33] hover:bg-[#222a3d] border border-[#424754]/40 text-neutral-300 rounded-xl py-2.5 text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={triggerPanic}
                className="w-1/2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wide transition-all shadow-lg shadow-[#ef4444]/20 border border-transparent"
              >
                Confirmar Disparo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
