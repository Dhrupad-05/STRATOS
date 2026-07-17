import React, { useState, useEffect } from 'react';
import { Play, Pause, Flame, RotateCcw, AlertTriangle, Plus, ShieldCheck, Activity, DollarSign, Clock, Check, Loader2, Sparkles } from 'lucide-react';

interface CrisisScenario {
  id: string;
  name: string;
  year: string;
  iconColor: string;
  description: string;
}

interface CrisisReplayProps {
  activeCrisis: string;
  onSelectCrisis: (id: string) => void;
  timelineValue: number;
  setTimelineValue: (val: number) => void;
  onCustomCrisisSubmit: (title: string, riskRating: number, note: string) => void;
}

const PRESET_SCENARIOS: CrisisScenario[] = [
  { id: 'hormuz', name: 'Hormuz Naval Crisis', year: '2025 Escalation', iconColor: 'text-brand-danger bg-brand-danger/10 border-brand-danger/30', description: 'Iran announces snap naval drills and mining of transit lanes. Spikes insurance by 300%.' },
  { id: 'redsea', name: 'Red Sea Logistical blockade', year: '25-26 Houthi Attacks', iconColor: 'text-brand-accent bg-brand-accent/10 border-brand-accent/30', description: 'Drone and missile threats off Yemen force Cape routes, delaying EU imports by 14 days.' },
  { id: 'russia', name: 'Siberian Pipeline / Shadow Fleet', year: 'Urals Cap Escalation', iconColor: 'text-brand-accent bg-brand-accent/10 border-brand-accent/30', description: 'Tightened maritime sanctions and settlement barriers disrupt Urals payments.' },
  { id: 'covid', name: 'COVID Demand Collapse', year: 'Lockdown Era', iconColor: 'text-brand-muted bg-brand-muted/10 border-brand-border', description: 'Sudden demand halt drops crude. Supertankers transition to floating storage reservoirs.' },
  { id: 'suez', name: 'Suez Canal Blockage', year: '2021 Ever Given', iconColor: 'text-brand-success bg-brand-success/10 border-brand-success/30', description: 'Mega-vessel wedged in Suez halts Europe-Asia refining product pipelines.' }
];

export default function CrisisReplay({
  activeCrisis,
  onSelectCrisis,
  timelineValue,
  setTimelineValue,
  onCustomCrisisSubmit
}: CrisisReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customRisk, setCustomRisk] = useState(50);
  const [customNote, setCustomNote] = useState('');

  // What-If Interventions
  const [navalEscort, setNavalEscort] = useState(false);
  const [sprDrawdown, setSprDrawdown] = useState(false);
  const [capeReroute, setCapeReroute] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'compiling' | 'ready'>('idle');

  // Autoplay fast-forward simulation engine
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (timelineValue >= 60) {
          setIsPlaying(false);
          setTimelineValue(60);
        } else {
          setTimelineValue(timelineValue + 5);
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timelineValue, setTimelineValue]);

  const handlePresetClick = (id: string) => {
    onSelectCrisis(id);
    // Rewind timeline to historical start for the replay story
    setTimelineValue(-15);
    setIsPlaying(true); // Auto start fast-forward replay
  };

  const handleCustomCrisisClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onCustomCrisisSubmit(customTitle, customRisk, customNote);
    setShowCustomModal(false);
    setTimelineValue(0);
    setIsPlaying(true);
  };

  const handleResetMode = () => {
    onSelectCrisis('normal');
    setTimelineValue(0);
    setIsPlaying(false);
    // Reset sandbox
    setNavalEscort(false);
    setSprDrawdown(false);
    setCapeReroute(false);
    setExportStatus('idle');
  };

  // Run simulated report generation
  const handleExportSandbox = () => {
    if (exportStatus !== 'idle') return;
    setExportStatus('compiling');
    setTimeout(() => {
      setExportStatus('ready');
    }, 1500);
  };

  // Live sandbox delta calculation
  const getSandboxDeltas = () => {
    let baseRisk = activeCrisis === 'normal' ? 12 : (activeCrisis === 'hormuz' ? 82 : (activeCrisis === 'redsea' ? 68 : (activeCrisis === 'russia' ? 52 : (activeCrisis === 'suez' ? 44 : 40))));
    let riskReduction = 0;
    let costOffset = 0;
    let delayShift = 0;

    if (navalEscort) {
      riskReduction += 20;
      costOffset += 40; // $40M Op cost
    }
    if (sprDrawdown) {
      riskReduction += 15;
      costOffset -= 120; // -$120M (drawdown offsets immediate price spikes)
    }
    if (capeReroute) {
      riskReduction += 45;
      costOffset += 320; // +$320M Sourcing routing overheads
      delayShift += 14;  // +14 days delay
    }

    const modifiedRisk = Math.max(10, baseRisk - riskReduction);

    return {
      modifiedRisk,
      costOffset,
      delayShift,
      riskReduction
    };
  };

  const deltas = getSandboxDeltas();

  return (
    <div className="w-full bg-brand-surface border border-brand-border rounded-lg p-4 font-mono select-none space-y-4" id="crisis_replay_panel">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-brand-border pb-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-brand-danger" /> Crisis Replay Matrix & Strategic Lab
        </h4>
        <div className="flex gap-1.5">
          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-2 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-brand-accent/20 cursor-pointer"
            >
              <Pause className="w-3 h-3" /> PAUSE REPLAY
            </button>
          ) : (
            activeCrisis !== 'normal' && (
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-brand-accent/15 border border-brand-accent/40 text-brand-accent px-2 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-brand-accent/25 cursor-pointer"
              >
                <Play className="w-3 h-3" /> REPLAY FAST-FORWARD
              </button>
            )
          )}
          {activeCrisis !== 'normal' && (
            <button
              onClick={handleResetMode}
              className="bg-brand-bg border border-brand-border text-brand-muted px-2 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-brand-surface cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> RESET SYSTEM
            </button>
          )}
        </div>
      </div>

      {/* Grid of presets */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3" id="crisis_presets_grid">
        {PRESET_SCENARIOS.map(scenario => {
          const isActive = activeCrisis === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => handlePresetClick(scenario.id)}
              className={`p-2.5 rounded border text-left flex flex-col justify-between h-28 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group ${
                isActive ? 'bg-brand-accent/10 border-brand-accent ring-1 ring-brand-accent/30' : 'bg-brand-bg border-brand-border'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${scenario.iconColor}`}>
                    {scenario.year}
                  </span>
                  {isActive && <AlertTriangle className="w-3.5 h-3.5 text-brand-danger" />}
                </div>
                <h5 className="text-[11px] font-bold text-slate-200 truncate group-hover:text-brand-accent">
                  {scenario.name}
                </h5>
              </div>
              <p className="text-[9px] text-brand-muted leading-tight line-clamp-3 font-sans">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive What-If Intervention Lab */}
      {activeCrisis !== 'normal' && (
        <div className="bg-brand-bg/40 border border-brand-border p-3 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-4" id="what_if_lab">
          
          {/* Controls column */}
          <div className="md:col-span-6 space-y-2.5 border-r border-brand-border/30 pr-3">
            <span className="text-[10px] font-bold text-brand-accent flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Strategic Intervention Lab (What-If)
            </span>
            <p className="text-[9px] text-brand-muted leading-tight font-sans">
              Deploy parallel tactical countermeasures to see instantaneous system risk mitigation recalculations:
            </p>
            
            <div className="space-y-2">
              {[
                { state: navalEscort, set: setNavalEscort, label: "Deploy Indian Navy Escorts", effect: "-20% Risk | +$40M Fleet Operating Cost" },
                { state: sprDrawdown, set: setSprDrawdown, label: "Drawdown Strategic Reserves (+15%)", effect: "-15% Risk | -$120M Spillover Offset" },
                { state: capeReroute, set: setCapeReroute, label: "Reroute 100% via Cape of Good Hope", effect: "-45% Risk | +$320M Sourcing Cost | +14d Delay" }
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => opt.set(!opt.state)}
                  className={`w-full p-2 rounded border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    opt.state
                      ? 'bg-brand-accent/15 border-brand-accent'
                      : 'bg-brand-surface border-brand-border hover:border-brand-border/75'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] shrink-0 mt-0.5 ${opt.state ? 'border-brand-accent text-brand-accent bg-brand-bg' : 'border-brand-muted text-brand-muted'}`}>
                    {opt.state && "✓"}
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-200 block">{opt.label}</span>
                    <span className="text-[8px] text-brand-muted leading-none font-sans block mt-0.5">{opt.effect}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox metrics outcome display */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-3 pl-1">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-300 uppercase block">Sandbox Simulation Outcome</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-brand-surface p-2 rounded border border-brand-border text-center">
                  <span className="text-[8px] text-brand-muted block uppercase font-bold">Modified Risk</span>
                  <span className={`text-sm font-extrabold block py-0.5 ${deltas.modifiedRisk > 50 ? 'text-brand-danger' : (deltas.modifiedRisk > 25 ? 'text-brand-accent' : 'text-brand-success')}`}>
                    {deltas.modifiedRisk}%
                  </span>
                  <span className="text-[8px] text-brand-muted leading-none font-sans block">
                    {deltas.riskReduction > 0 ? `-${deltas.riskReduction}% offset` : "baseline"}
                  </span>
                </div>

                <div className="bg-brand-surface p-2 rounded border border-brand-border text-center">
                  <span className="text-[8px] text-brand-muted block uppercase font-bold">Fiscal Impact</span>
                  <span className={`text-sm font-extrabold block py-0.5 ${deltas.costOffset > 0 ? 'text-brand-danger' : (deltas.costOffset < 0 ? 'text-brand-success' : 'text-slate-300')}`}>
                    {deltas.costOffset > 0 ? `+$${deltas.costOffset}M` : (deltas.costOffset < 0 ? `-$${Math.abs(deltas.costOffset)}M` : "$0.00")}
                  </span>
                  <span className="text-[8px] text-brand-muted leading-none font-sans block">
                    budget variance
                  </span>
                </div>

                <div className="bg-brand-surface p-2 rounded border border-brand-border text-center">
                  <span className="text-[8px] text-brand-muted block uppercase font-bold">Schedule Shift</span>
                  <span className="text-sm font-extrabold text-white block py-0.5">
                    +{deltas.delayShift}d
                  </span>
                  <span className="text-[8px] text-brand-muted leading-none font-sans block">
                    average latency
                  </span>
                </div>
              </div>
            </div>

            {/* Sandbox Export Trigger */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportSandbox}
                className="flex-1 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent border border-brand-accent/35 text-[10.5px] font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {exportStatus === 'idle' && (
                  <>
                    <Activity className="w-3.5 h-3.5" /> Export Sandbox Report...
                  </>
                )}
                {exportStatus === 'compiling' && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying nodes...
                  </>
                )}
                {exportStatus === 'ready' && (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-success" /> Export Ready! Download File
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Custom & Baseline Posture Trigger */}
      <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-4">
        <button
          onClick={() => setShowCustomModal(true)}
          className="bg-brand-bg hover:bg-brand-surface border border-brand-border text-slate-200 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-brand-accent" /> Construct Custom Posture Event...
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-brand-muted">SYSTEM STATE:</span>
          {activeCrisis === 'normal' ? (
            <span className="bg-brand-success/10 border border-brand-success/30 text-brand-success text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> STEADY BASELINE (SECURE)
            </span>
          ) : (
            <span className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" /> ACTIVE CRISIS ({activeCrisis.toUpperCase()})
            </span>
          )}
        </div>
      </div>

      {/* Simple Modal overlay for custom scenarios */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCustomCrisisClick}
            className="w-full max-w-md bg-brand-surface border border-brand-border p-5 rounded-lg shadow-2xl font-mono text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-2">
              <h3 className="text-sm font-bold text-brand-accent flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-brand-danger" /> Build Custom Geopolitical Posture
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-brand-muted hover:text-white text-xs bg-brand-bg px-2 py-0.5 border border-brand-border rounded cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-brand-muted block">Scenario Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g., South China Sea blockade"
                required
                className="w-full bg-brand-bg border border-brand-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="text-brand-muted">Target Geopolitical Risk Score</label>
                <span className="text-brand-danger font-bold">{customRisk}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={customRisk}
                onChange={(e) => setCustomRisk(Number(e.target.value))}
                className="w-full h-1 bg-brand-bg rounded accent-brand-danger cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-brand-muted block">Strategic Intel Directives (Impacts)</label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Describe logistics, payment halts, or navy maneuvers to guide multi-agent reasoning models..."
                rows={3}
                className="w-full bg-brand-bg border border-brand-border px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25 resize-none font-sans"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="bg-brand-bg border border-brand-border text-slate-300 text-xs px-4 py-2 rounded hover:bg-brand-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-accent/15 border border-brand-accent/40 text-brand-accent text-xs px-4 py-2 rounded hover:bg-brand-accent/25 font-bold cursor-pointer"
              >
                Launch Simulation Playback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
