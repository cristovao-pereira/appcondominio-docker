"use client";

import { useState } from "react";
import { mockAuditEvents } from "@/data/mockData";
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
  Volume2,
  VolumeX,
  AlertTriangle,
  Clock,
  Briefcase,
  Terminal,
  Play,
  X,
  ShieldAlert,
} from "lucide-react";

// Definição dos postos de trabalho da portaria
const WORKSTATIONS = [
  "Portaria Principal (Guarita A)",
  "Portaria de Serviços & Cargas (Guarita B)",
  "Acesso Garagem Sul (Guarita C)",
  "Central de Monitoramento (CVD)",
];

export default function PerfilPage() {
  // Dados do operador
  const [firstName, setFirstName] = useState("Marcus");
  const [lastName, setLastName] = useState("Caldwell");
  const [email, setEmail] = useState("m.caldwell@theobsidian.com");
  const [phone, setPhone] = useState("+55 11 99999-0000");
  const [workstation, setWorkstation] = useState(WORKSTATIONS[0]);
  
  // PIN de Coação e Senha
  const [coercionPin, setCoercionPin] = useState("9999");
  const [password, setPassword] = useState("••••••••••••");
  
  // Preferências de som
  const [soundAlerts, setSoundAlerts] = useState({
    sirenAlerts: true,
    beepCheckins: true,
    doorbellPackages: false,
    voicePanic: true,
  });

  // Controle de estados de modais e ações
  const [saved, setSaved] = useState(false);
  const [isTestPinOpen, setIsTestPinOpen] = useState(false);
  const [inputTestPin, setInputTestPin] = useState("");
  const [coercionTriggered, setCoercionTriggered] = useState(false);
  const [coercionError, setCoercionError] = useState(false);

  // Notificações temporárias (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    setSaved(true);
    showToast("Informações do operador salvas com sucesso!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleSound = (key: keyof typeof soundAlerts) => {
    setSoundAlerts((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`Som de "${getSoundLabel(key)}" ${next[key] ? "ativado" : "desativado"}`);
      return next;
    });
  };

  const getSoundLabel = (key: keyof typeof soundAlerts) => {
    switch (key) {
      case "sirenAlerts":
        return "Sirene de Alerta Crítico";
      case "beepCheckins":
        return "Bip de Novos Check-ins";
      case "doorbellPackages":
        return "Campainha de Encomendas";
      case "voicePanic":
        return "Voz para Alerta de Pânico";
    }
  };

  const handleWorkstationChange = (val: string) => {
    setWorkstation(val);
    showToast(`Posto alterado para: ${val}`);
  };

  const handleTestCoercionPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTestPin === coercionPin) {
      setCoercionTriggered(true);
      setCoercionError(false);
    } else {
      setCoercionError(true);
      setTimeout(() => setCoercionError(false), 2000);
    }
  };

  const closeCoercionModal = () => {
    setIsTestPinOpen(false);
    setCoercionTriggered(false);
    setInputTestPin("");
  };

  return (
    <div className="p-8 min-h-full max-w-6xl text-foreground relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl border border-primary/40 bg-primary/15 text-primary flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
          Identificação Operacional • Concierge OS
        </p>
        <h1
          className="text-4xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Perfil do Operador
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas credenciais de plantão, posto de trabalho ativo, preferências auditivas de alarme e segurança da guarita.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Crachá Funcional */}
        <div className="space-y-4">
          
          {/* Card Crachá */}
          <div
            className="rounded-2xl border border-border p-6 text-center relative overflow-hidden bg-gradient-to-br from-card via-muted/20 to-card"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-primary/60" />
            
            {/* Foto / Iniciais */}
            <div className="relative inline-block mb-4 mt-2">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-3xl font-extrabold text-primary mx-auto shadow-inner shadow-black/30">
                MC
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shadow-md"
                title="Alterar foto"
              >
                <Camera size={13} />
              </button>
            </div>

            {/* Identidade */}
            <h2
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {firstName} {lastName}
            </h2>
            <p className="text-xs text-primary font-semibold mt-0.5 uppercase tracking-wider">
              Chefe de Portaria / Operador Sênior
            </p>
            
            <div className="flex items-center justify-center gap-1.5 mt-3 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full w-fit mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Plantão Ativo</span>
            </div>

            {/* Divisor */}
            <div className="my-5 border-t border-border" />

            {/* Informações de Shift */}
            <div className="space-y-3 text-left">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Posto Atual</p>
                <select
                  value={workstation}
                  onChange={(e) => handleWorkstationChange(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40 cursor-pointer transition-colors"
                >
                  {WORKSTATIONS.map((w) => (
                    <option key={w} value={w} className="bg-card text-foreground">
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Matrícula</p>
                  <p className="text-xs font-mono font-bold text-foreground">OBS-2024-0042</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Escala</p>
                  <p className="text-xs font-semibold text-foreground">12x36 - Diurno</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Entrada Shift</p>
                  <p className="text-xs font-semibold text-foreground">Hoje, 07:00 AM</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">Nível de Acesso</p>
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Nível 4 (Admin)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Estatísticas de Turno */}
          <div
            className="rounded-2xl border border-border p-5 bg-card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Produtividade do Plantão
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Check-ins Efetuados", value: "18", desc: "Visitantes liberados" },
                { label: "Encomendas Registradas", value: "9", desc: "Logística triada" },
                { label: "Alertas Atendidos", value: "3", desc: "Eventos solucionados" },
                { label: "Tempo Restante", value: "02h 45m", desc: "Fim do shift", highlight: true },
              ].map((s) => (
                <div key={s.label} className="bg-muted/60 border border-border rounded-xl p-3">
                  <p className="text-[9px] text-muted-foreground font-semibold leading-tight">{s.label}</p>
                  <p className={`text-xl font-extrabold mt-1 ${s.highlight ? "text-primary" : "text-foreground"}`}>
                    {s.value}
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Formulários e Ajustes */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Dados Pessoais / Funcionais */}
          <div
            className="rounded-2xl border border-border p-6 bg-card"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <User size={15} className="text-primary" />
              <h2
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Informações do Funcionário
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Nome
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Sobrenome
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  E-mail Funcional
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Telefone de Contato
                </label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Departamento
                </label>
                <div className="relative">
                  <Briefcase size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    defaultValue="Operações & Portaria"
                    disabled
                    className="w-full pl-9 pr-4 py-2 text-xs bg-muted/40 border border-border rounded-xl text-muted-foreground focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Empresa Contratante
                </label>
                <div className="relative">
                  <Shield size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    defaultValue="Obsidian Security Corp"
                    disabled
                    className="w-full pl-9 pr-4 py-2 text-xs bg-muted/40 border border-border rounded-xl text-muted-foreground focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Segurança Crítica & PIN de Coação */}
          <div
            className="rounded-2xl border border-border p-6 bg-card"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Shield size={15} className="text-orange-600 dark:text-orange-400" />
              <h2
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Segurança Física &amp; Coação
              </h2>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Configurações críticas de segurança física. O **PIN de Coação** é uma senha secreta para uso sob coação física de invasores. Digitar este PIN em qualquer terminal de liberação desbloqueará a fechadura normalmente, mas gerará um chamado de pânico silencioso e discreto para a polícia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Senha do Terminal (Acesso)
                </label>
                <div className="relative">
                  <Key size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 block mb-1.5">
                  PIN de Coação Silenciosa (4 dígitos)
                </label>
                <div className="relative">
                  <AlertTriangle size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500/70" />
                  <input
                    type="password"
                    maxLength={4}
                    value={coercionPin}
                    onChange={(e) => setCoercionPin(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-orange-500/30 text-orange-600 dark:text-orange-400 placeholder:text-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500/60 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsTestPinOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Play size={12} />
              Testar PIN de Coação
            </button>
          </div>

          {/* Preferências de Alertas Sonoros de Guarita */}
          <div
            className="rounded-2xl border border-border p-6 bg-card"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Bell size={15} className="text-primary" />
              <h2
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Preferências de Áudio &amp; Notificações
              </h2>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Ative ou desative o feedback sonoro de eventos. Operadores de portaria utilizam estes bips para responder rapidamente a eventos sem olhar para a tela.
            </p>

            <div className="space-y-3">
              {(Object.keys(soundAlerts) as Array<keyof typeof soundAlerts>).map((key) => {
                const isOn = soundAlerts[key];
                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-xs font-bold text-foreground">{getSoundLabel(key)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {key === "sirenAlerts" && "Dispara um som de sirene para zonas de segurança violadas."}
                        {key === "beepCheckins" && "Toca um bip discreto a cada visitante liberado na entrada."}
                        {key === "doorbellPackages" && "Toca uma campainha curta quando a portaria registrar encomenda."}
                        {key === "voicePanic" && "Usa sintetizador de voz para narrar a guarita violada."}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleToggleSound(key)}
                      className={`flex items-center justify-center p-2 rounded-xl border transition-all ${
                        isOn
                          ? "bg-primary/15 border-primary/40 text-primary shadow-md shadow-primary/5"
                          : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {isOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Histórico Simplificado do Operador */}
          <div
            className="rounded-2xl border border-border p-6 bg-card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={15} className="text-primary" />
              <h2
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Log de Operações do Plantão
              </h2>
            </div>
            
            <div className="space-y-4">
              {mockAuditEvents.slice(0, 3).map((e) => (
                <div key={e.id} className="flex gap-3 relative">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <div className="w-px flex-1 bg-border mt-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground">
                        {e.action}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground">{e.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{e.details}</p>
                    <p className="text-[9px] text-primary/60 mt-0.5 font-semibold">Unidade: {e.condoUnit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/95 active:scale-95 transition-all shadow-lg shadow-primary/10"
            >
              <Edit3 size={13} />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: TESTE DO PIN DE COAÇÃO                                              */}
      {/* ========================================================================= */}
      {isTestPinOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={closeCoercionModal}
            className="absolute inset-0 bg-black/85 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div
            className={`relative w-full max-w-md border rounded-2xl p-6 shadow-2xl transition-all ${
              coercionTriggered
                ? "bg-red-950 border-red-500 animate-pulse text-white"
                : "bg-card border-border"
            }`}
          >
            {/* Fechar */}
            <button
              onClick={closeCoercionModal}
              className="absolute top-5 right-5 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>

            {coercionTriggered ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <ShieldAlert size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-red-500 uppercase tracking-wide">
                  [ALERTA SILENCIOSO DISPARADO]
                </h3>
                <p className="text-xs text-red-300 mt-3 font-semibold leading-relaxed">
                  O sinal silencioso de pânico foi transmitido secretamente para a Central de Segurança Metropolitana e Polícia Militar.
                </p>
                <div className="mt-5 bg-black/40 border border-red-500/20 p-4 rounded-xl text-left text-[11px] font-mono text-red-400 space-y-1">
                  <p>&gt; IP do Dispositivo: 192.168.10.42</p>
                  <p>&gt; Posto: {workstation}</p>
                  <p>&gt; Status Guarita: Fechadura Liberada (Bypass)</p>
                  <p>&gt; Alerta: Nível 5 (Ameaça Física Operador)</p>
                  <p>&gt; Localização GPS enviada com sucesso.</p>
                </div>
                <button
                  onClick={closeCoercionModal}
                  className="mt-6 w-full py-2.5 rounded-xl bg-red-600 dark:bg-red-500 text-white dark:text-black text-xs font-extrabold hover:bg-red-600/90 dark:hover:bg-red-500/90 active:scale-95 transition-all uppercase tracking-wider"
                >
                  Finalizar Simulação
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
                  <ShieldAlert size={18} className="text-orange-600 dark:text-orange-400" />
                  <h2 className="text-base font-bold text-foreground">Simular PIN de Coação</h2>
                </div>
                
                <p className="text-xs text-muted-foreground mb-4">
                  Digite seu **PIN de Coação Silenciosa** configurado para simular o comportamento de um alerta secreto de pânico no terminal de segurança da guarita.
                </p>

                <form onSubmit={handleTestCoercionPin} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                      Inserir PIN de Coação
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={inputTestPin}
                      onChange={(e) => setInputTestPin(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center tracking-[0.6em] py-3 bg-background border border-border rounded-xl text-lg text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 font-mono"
                    />
                  </div>

                  {coercionError && (
                    <p className="text-xs text-red-600 dark:text-red-400 text-center font-bold animate-pulse">
                      PIN Incorreto. Simulação não disparada.
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeCoercionModal}
                      className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border transition-all text-center"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-orange-600 dark:bg-orange-500 text-white dark:text-black text-xs font-extrabold hover:bg-orange-600/95 dark:hover:bg-orange-500/95 active:scale-95 transition-all text-center"
                    >
                      Testar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
