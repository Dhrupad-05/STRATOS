import React, { useState, useEffect } from 'react';
import { User, Shield, Zap, Sparkles, MessageSquare, Flame, Activity, Check, Cpu, Database, Heart, Terminal, Layers } from 'lucide-react';
import { AgentDebateMessage } from '../types';

interface AgentDashboardProps {
  debate: AgentDebateMessage[];
  overallRisk: number;
  confidence: number;
  onRunDeliberation: () => void;
  isLoading: boolean;
}

const AGENT_META: Record<string, { role: string; iconColor: string; bg: string; border: string; memory: string; source: string; defaultTask: string; cpu: number }> = {
  "News Agent": { role: "Geopolitical Intel", iconColor: "text-brand-accent", bg: "bg-brand-accent/5", border: "border-brand-border/40", memory: "84 MB", source: "GDELT Incident Live Feed", defaultTask: "Scanning 300+ regional conflict tickers", cpu: 8 },
  "Shipping Agent": { role: "AIS & Port Congestion", iconColor: "text-brand-accent", bg: "bg-brand-accent/5", border: "border-brand-border/40", memory: "112 MB", source: "AIS MarineTraffic API Gateway", defaultTask: "Calculating vessel speed & ETA variances", cpu: 18 },
  "Market Agent": { role: "Commodities & Spreads", iconColor: "text-brand-accent", bg: "bg-brand-accent/5", border: "border-brand-border/40", memory: "95 MB", source: "S&P Platts Energy Index Tickers", defaultTask: "Monitoring Brent physical crude index splits", cpu: 12 },
  "Risk Agent": { role: "Vulnerability Scoring", iconColor: "text-brand-danger", bg: "bg-brand-danger/5", border: "border-brand-danger/30", memory: "74 MB", source: "Sovereign Surcharge Ledger V2", defaultTask: "Recalculating corridor exposure multipliers", cpu: 5 },
  "Simulation Agent": { role: "Refinery & SPR cover", iconColor: "text-brand-accent", bg: "bg-brand-accent/5", border: "border-brand-border/40", memory: "145 MB", source: "ISPRL Strategic Storage Telemetry", defaultTask: "Replaying SPR inventory run rates", cpu: 28 },
  "Optimization Agent": { role: "Procurement & Trade routing", iconColor: "text-brand-success", bg: "bg-brand-success/5", border: "border-brand-success/30", memory: "210 MB", source: "Simplex Route Solver Core", defaultTask: "Formulating multi-objective Pareto allocations", cpu: 35 },
  "Coordinator Agent": { role: "Command Synthesis", iconColor: "text-brand-muted", bg: "bg-brand-bg/40", border: "border-brand-border", memory: "60 MB", source: "STRATOS Contradiction Registry", defaultTask: "Synthesizing and resolving agent dissent", cpu: 4 }
};

// Precise 8-stage AI Thinking Pipeline stages (Priority 4)
const THINKING_STAGES = [
  { name: "RECEIVING CRISIS EVENT", agent: "News Agent", desc: "Receiving breaking GDELT maritime conflict markers & sovereign news signals.", conf: 98 },
  { name: "EXTRACTING ENTITY POSTURES", agent: "Shipping Agent", desc: "Extracting vessel IDs, regional naval postures, and physical cargo tonnages.", conf: 96 },
  { name: "UPDATING DIGITAL K-GRAPH", agent: "Risk Agent", desc: "Updating Digital Twin dependency knowledge graph and recalculating edge weights.", conf: 94 },
  { name: "RUNNING PREDICTIVE IMPACTS", agent: "Simulation Agent", desc: "Projecting downstream refinery intake load rates & SPR depletion velocities.", conf: 95 },
  { name: "REPLAYING MONTE CARLO ALTERNATES", agent: "Simulation Agent", desc: "Replaying alternate futures under active shipping blockage scenarios.", conf: 93 },
  { name: "FORMULATING PARETO SOLUTIONS", agent: "Optimization Agent", desc: "Formulating multi-objective Pareto optimization frontier for alternate trade routes.", conf: 97 },
  { name: "ASSEMBLING DIRECTIVES", agent: "Coordinator Agent", desc: "Assembling strategic directives with feasibility and sovereign clearing offsets.", conf: 96 },
  { name: "PUBLISHING ADVISORY BRIEF", agent: "Coordinator Agent", desc: "Publishing executive briefing document logs and signing encrypted hash block.", conf: 99 }
];

export default function AgentDashboard({
  debate,
  overallRisk,
  confidence,
  onRunDeliberation,
  isLoading
}: AgentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'deliberation' | 'profiles' | 'activity'>('deliberation');
  const [activeStage, setActiveStage] = useState(0);

  // Stepping driver for the AI Thinking Pipeline when loading
  useEffect(() => {
    if (isLoading) {
      setActiveStage(0);
      const interval = setInterval(() => {
        setActiveStage(prev => {
          if (prev >= THINKING_STAGES.length - 1) {
            return prev; // Stop on the last stage until load finishes
          }
          return prev + 1;
        });
      }, 700); // Fast, beautiful transition sequence
      return () => clearInterval(interval);
    } else {
      setActiveStage(0);
    }
  }, [isLoading]);

  const getSentimentStyle = (sentiment: string) => {
    if (sentiment === 'positive') return 'bg-brand-success/10 text-brand-success border-brand-success/30';
    if (sentiment === 'negative') return 'bg-brand-danger/10 text-brand-danger border-brand-danger/30';
    return 'bg-brand-surface text-brand-muted border-brand-border';
  };

  return (
    <div className="w-full bg-brand-surface border border-brand-border rounded-lg overflow-hidden font-mono select-none" id="agent_dashboard_panel">
      {/* Tab Header & Quick Stats */}
      <div className="bg-brand-surface border-b border-brand-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-accent" /> Swarm Intelligence OS
          </h4>
          <div className="flex bg-brand-bg p-0.5 rounded border border-brand-border text-[10px]">
            <button
              onClick={() => setActiveTab('deliberation')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                activeTab === 'deliberation' ? 'bg-brand-accent/15 text-brand-accent font-bold' : 'text-brand-muted hover:text-white'
              }`}
            >
              Debate Log
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                activeTab === 'profiles' ? 'bg-brand-accent/15 text-brand-accent font-bold' : 'text-brand-muted hover:text-white'
              }`}
            >
              Profiles
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                activeTab === 'activity' ? 'bg-brand-accent/15 text-brand-accent font-bold' : 'text-brand-muted hover:text-white'
              }`}
            >
              Swarm Activity
            </button>
          </div>
        </div>

        {/* Overall Indicators & Confidence Sparkline */}
        <div className="flex items-center gap-3.5 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-brand-muted text-[10px] uppercase">SYS_RISK:</span>
            <span className={`font-bold px-1.5 rounded text-[10px] ${
              overallRisk > 60 ? 'text-brand-danger bg-brand-danger/10 border border-brand-danger/20' : (overallRisk > 30 ? 'text-brand-accent bg-brand-accent/10 border border-brand-accent/20' : 'text-brand-success bg-brand-success/10 border border-brand-success/20')
            }`}>
              {overallRisk}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-brand-border/60 pl-3">
            <span className="text-brand-muted text-[10px] uppercase">CONFIDENCE:</span>
            <span className="text-white font-bold">{confidence}%</span>
          </div>
        </div>
      </div>

      {/* Main Body content */}
      <div className="p-4 h-[350px] overflow-y-auto bg-brand-bg/25" id="agent_dashboard_scroller">
        
        {/* Priority 4: Dynamic State-driven AI Thinking Pipeline */}
        {isLoading && (
          <div className="mb-4 bg-brand-bg/65 border border-brand-border p-3.5 rounded-lg space-y-3 font-mono text-[10.5px]">
            <div className="flex items-center justify-between border-b border-brand-border/40 pb-1.5">
              <span className="text-brand-accent font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-accent" /> STRATOS AI COGNITIVE THINKING PIPELINE
              </span>
              <span className="text-[8.5px] text-brand-muted uppercase">Stage: {activeStage + 1} of 8</span>
            </div>
            
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {THINKING_STAGES.map((stage, idx) => {
                const isActive = activeStage === idx;
                const isCompleted = idx < activeStage;
                
                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded border flex items-center justify-between gap-2.5 transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-accent/10 border-brand-accent' 
                        : (isCompleted ? 'bg-brand-success/5 border-brand-success/20 opacity-60' : 'bg-brand-surface border-brand-border/20 opacity-30')
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <Check className="w-3 h-3 text-brand-success shrink-0" />
                        ) : (
                          <div className={`w-3 h-3 rounded-full border flex items-center justify-center text-[7px] ${isActive ? 'border-brand-accent text-brand-accent animate-spin' : 'border-brand-muted text-brand-muted'}`}>
                            {isActive ? "●" : "○"}
                          </div>
                        )}
                        <span className={`font-bold text-[9.5px] ${isActive ? 'text-brand-accent' : (isCompleted ? 'text-brand-success' : 'text-brand-muted')}`}>
                          {stage.name}
                        </span>
                      </div>
                      {isActive && <p className="text-[8.5px] text-brand-muted font-sans pl-5 leading-normal text-slate-300">{stage.desc}</p>}
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[8px] text-brand-muted font-bold uppercase">{stage.agent.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'deliberation' && (
          /* Live Agent Debate feed */
          <div className="space-y-3">
            {debate.length === 0 ? (
              <div className="h-full py-20 flex items-center justify-center text-brand-muted text-[11px] italic text-center font-sans">
                No active deliberations inside pipeline. Adjust scenarios inside the Crisis Lab or click 'Trigger Multi-Agent Deliberation' below to spin up the cognitive swarm.
              </div>
            ) : (
              debate.map((msg, idx) => {
                const meta = AGENT_META[msg.agent] || AGENT_META["Coordinator Agent"];
                return (
                  <div
                    key={`${msg.agent}-${idx}`}
                    className={`p-3 rounded border flex gap-3 leading-relaxed ${meta.bg} ${meta.border}`}
                    id={`debate_message_${idx}`}
                  >
                    {/* Left Column: Icon Profile */}
                    <div className="flex flex-col items-center justify-start shrink-0">
                      <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center bg-brand-bg border border-brand-border ${meta.iconColor}`}>
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[8px] text-brand-muted font-bold mt-1 uppercase text-center block max-w-[50px] truncate font-mono">
                        {msg.agent.split(' ')[0]}
                      </span>
                    </div>

                    {/* Right Column: Statement content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${meta.iconColor}`}>
                          {msg.agent} <span className="text-[8.5px] text-brand-muted font-normal">({meta.role})</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] px-1 rounded border font-bold uppercase ${getSentimentStyle(msg.sentiment)}`}>
                            {msg.sentiment}
                          </span>
                          <span className="text-[9.5px] text-brand-muted font-bold">C: {msg.confidence}%</span>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-slate-200 leading-normal font-sans">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'profiles' && (
          /* Agent Profiles/Postures */
          <div className="space-y-2.5" id="agent_profiles_grid">
            {Object.keys(AGENT_META).map(name => {
              const meta = AGENT_META[name];
              const matchedMsg = debate.find(m => m.agent === name);
              const assessmentText = matchedMsg?.content || "Sovereign model idle. Monitoring global real-time energy transits and news events.";

              return (
                <div key={name} className={`p-2.5 bg-brand-bg/40 border border-brand-border rounded-lg flex items-start gap-3 ${meta.bg} ${meta.border}`}>
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center bg-brand-surface border border-brand-border shrink-0 mt-0.5 ${meta.iconColor}`}>
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-[10px] font-bold ${meta.iconColor}`}>{name}</h5>
                      <span className="text-[8.5px] text-brand-muted uppercase font-mono">ROLE: {meta.role}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-300 font-sans mt-1 leading-normal">
                      {assessmentText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Priority 3: Agent Swarm Activity & Resource Metrics */}
        {activeTab === 'activity' && (
          <div className="space-y-3" id="agent_activity_center">
            <div className="grid grid-cols-2 gap-2 text-[9px] mb-2 select-none border-b border-brand-border/40 pb-2">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-accent" />
                <span>TOTAL ALLOCATED MEM: <strong className="text-white">795 MB</strong></span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Heart className="w-3.5 h-3.5 text-brand-success" />
                <span>SWARM HEALTH: <strong className="text-brand-success">100% NOMINAL</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              {Object.keys(AGENT_META).map(name => {
                const meta = AGENT_META[name];
                return (
                  <div key={name} className="p-2.5 bg-brand-bg/50 border border-brand-border/60 rounded flex flex-col gap-2">
                    {/* Swarm Core Header */}
                    <div className="flex items-center justify-between text-[9.5px] border-b border-brand-border/30 pb-1">
                      <span className={`font-bold flex items-center gap-1.5 ${meta.iconColor}`}>
                        <Shield className="w-3.5 h-3.5" /> {name}
                      </span>
                      <span className="bg-brand-success/15 border border-brand-success/30 text-brand-success text-[7.5px] px-1.5 rounded font-bold uppercase">
                        MONITORING
                      </span>
                    </div>

                    {/* Operational telemetry */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px] font-mono leading-none">
                      <div>
                        <span className="text-brand-muted block uppercase mb-1">Active Sourcing Feed:</span>
                        <strong className="text-slate-300 block truncate">{meta.source}</strong>
                      </div>
                      <div>
                        <span className="text-brand-muted block uppercase mb-1">Memory Allocation:</span>
                        <strong className="text-slate-300 block">{meta.memory}</strong>
                      </div>
                      <div>
                        <span className="text-brand-muted block uppercase mb-1">Compute Capacity:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 bg-brand-bg h-1.5 rounded-full overflow-hidden border border-brand-border/50">
                            <div className="h-full bg-brand-accent" style={{ width: `${meta.cpu}%` }} />
                          </div>
                          <span className="text-slate-300 font-bold">{meta.cpu}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Console actions */}
                    <div className="p-1.5 bg-brand-surface rounded border border-brand-border/40 font-mono text-[8px] text-slate-400 flex items-center gap-1.5 leading-tight">
                      <Terminal className="w-3 h-3 text-brand-accent shrink-0" />
                      <span className="text-brand-muted">[SYS_OS]</span>
                      <span className="truncate text-slate-300">Task: {meta.defaultTask} | SHA-256 OK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Footer trigger button */}
      <div className="bg-brand-surface border-t border-brand-border px-4 py-2.5 flex items-center justify-between gap-4">
        <span className="text-[9.5px] text-brand-muted flex items-center gap-1 font-sans select-none">
          <MessageSquare className="w-3.5 h-3.5 text-brand-accent" />
          <span>Deliberating and computing alternative routes</span>
        </span>
        <button
          onClick={onRunDeliberation}
          disabled={isLoading}
          className="bg-brand-accent/15 border border-brand-accent/40 hover:bg-brand-accent/25 text-brand-accent text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
              Sourcing...
            </span>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5 text-brand-danger" /> Deliberate Posture
            </>
          )}
        </button>
      </div>
    </div>
  );
}
