import React, { useState, useEffect, useRef } from 'react';
import { Radio, Activity, Terminal, Shield, RefreshCw, Cpu, Database, Navigation, Sliders, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface IntelligenceEvent {
  id: string;
  timestamp: string;
  category: 'GDELT' | 'AIS' | 'K-GRAPH' | 'SPR' | 'SOLVER' | 'DIRECTIVE' | 'GRID' | 'MARKET';
  agent?: string;
  message: string;
  level: 'info' | 'warning' | 'danger' | 'success';
}

interface LiveIntelligenceFeedProps {
  activeCrisis: string;
  onSelectNode: (nodeId: string) => void;
}

// Preset sequences for each crisis that playback in real-time when selected
const SCENARIO_EVENTS: Record<string, Omit<IntelligenceEvent, 'id' | 'timestamp'>[]> = {
  hormuz: [
    { category: 'GDELT', agent: 'News Agent', message: 'FLASH: Iran announces snap naval drills inside coordinates 26°N 56°E.', level: 'danger' },
    { category: 'AIS', agent: 'Shipping Agent', message: 'ALERT: 15 VLCC supertankers stalling and entering holding patterns outside Strait of Hormuz.', level: 'warning' },
    { category: 'MARKET', agent: 'Market Agent', message: 'Spike detected: Mid-East insurance premiums surge +300% (Implied Brent Risk premium: +$5.80/bbl).', level: 'danger' },
    { category: 'K-GRAPH', agent: 'Risk Agent', message: 'Digital Twin Graph re-weighted: Hormuz node vulnerability indexed to 84%. Choke threat propagation ACTIVE.', level: 'danger' },
    { category: 'SPR', agent: 'Simulation Agent', message: 'Running 90-day depletion model: Partial Hormuz closure depletes SPR import cover to 48 days.', level: 'warning' },
    { category: 'SOLVER', agent: 'Optimization Agent', message: 'Pareto solver optimized: Recommending immediate 14% Middle-East diversion to Nigerian sweet-grade swap.', level: 'success' },
    { category: 'DIRECTIVE', agent: 'Coordinator Agent', message: 'DIRECTIVE_01: Establish UAE non-dollar clearing; initiate naval escort routes for tankers.', level: 'success' }
  ],
  redsea: [
    { category: 'GDELT', agent: 'News Agent', message: 'Reuters: Multiple anti-ship drone strikes reported off Bab-el-Mandeb corridor.', level: 'danger' },
    { category: 'AIS', agent: 'Shipping Agent', message: 'Suez-bound vessels MSC, Maersk initiate Cape of Good Hope detours. Transit queue backed up.', level: 'warning' },
    { category: 'K-GRAPH', agent: 'Risk Agent', message: 'Bab-el-Mandeb node flagged as HIGH HAZARD. Downstream delays projected at +12-14 days.', level: 'danger' },
    { category: 'MARKET', agent: 'Market Agent', message: 'Freight rates Rotterdam-to-Mumbai double. Spread index widening. High volatility warning.', level: 'warning' },
    { category: 'SPR', agent: 'Simulation Agent', message: 'Product refined stocks buffer evaluated. East Coast diesel backup holds sufficient coverage for 28 days.', level: 'info' },
    { category: 'SOLVER', agent: 'Optimization Agent', message: 'Sourcing solver run: Adjusting coastal refinery slate prioritized for local agrarian diesel allocation.', level: 'success' },
    { category: 'DIRECTIVE', agent: 'Coordinator Agent', message: 'DIRECTIVE_02: Implement mandatory 15-day steaming fuel buffer for all chartered VLCC fleets.', level: 'success' }
  ],
  russia: [
    { category: 'GDELT', agent: 'News Agent', message: 'EU announces 14th package of maritime sanctions targeting shadow-fleet crude tankers.', level: 'warning' },
    { category: 'MARKET', agent: 'Market Agent', message: 'Urals-to-Brent discount narrows to $11.20/bbl. Financial arbitrage threshold shrinking.', level: 'info' },
    { category: 'SOLVER', agent: 'Risk Agent', message: 'Financial settlement clearing risk reaches critical ceiling. Secondary sanctions probability: 55%.', level: 'danger' },
    { category: 'K-GRAPH', agent: 'Simulation Agent', message: 'Updating sovereign ledger node: Restructured Urals payments routing to Dirham clearing pipeline.', level: 'warning' },
    { category: 'SPR', agent: 'Simulation Agent', message: 'Sovereign GDP simulation models complete. Projected unmitigated pricing impact: -0.15% GDP growth.', level: 'warning' },
    { category: 'SOLVER', agent: 'Optimization Agent', message: 'Simplex allocation solved: Diversifying crude base with Iraq Basra Light spot purchases (+10%).', level: 'success' },
    { category: 'DIRECTIVE', agent: 'Coordinator Agent', message: 'DIRECTIVE_03: Launch Abu Dhabi Dirham clearing framework to bypass G7 secondary transaction risks.', level: 'success' }
  ],
  covid: [
    { category: 'GDELT', agent: 'News Agent', message: 'Global lock-down containment protocols active. Commercial travel drops to near-zero.', level: 'danger' },
    { category: 'MARKET', agent: 'Market Agent', message: 'CRASH: Prompt physical WTI crude futures contract falls to -$37.63/bbl. Record demand shock.', level: 'danger' },
    { category: 'AIS', agent: 'Shipping Agent', message: 'Storage capacity exhausted. 42 supertankers transition to stationary floating reservoirs off Singapore.', level: 'warning' },
    { category: 'SPR', agent: 'Simulation Agent', message: 'Refineries ordered to cut throughput runs to 40% loading to prevent pipeline blockages.', level: 'warning' },
    { category: 'SOLVER', agent: 'Optimization Agent', message: 'Sourcing solver identifies massive arbitrage: Maximize SPR filling and lock in historical futures.', level: 'success' },
    { category: 'DIRECTIVE', agent: 'Coordinator Agent', message: 'DIRECTIVE_04: Order immediate spot buying of floating crude to saturate state strategic reserves to 100%.', level: 'success' }
  ],
  suez: [
    { category: 'GDELT', agent: 'News Agent', message: 'FLASH: Ultra-large container carrier wedged diagonally inside Suez Canal coordinates 30°N 32°E.', level: 'danger' },
    { category: 'AIS', agent: 'Shipping Agent', message: 'Suez bottleneck locks 300+ commercial vessels. LNG and refined product transits completely frozen.', level: 'danger' },
    { category: 'MARKET', agent: 'Market Agent', message: 'Prompt refined product spot rates jump 4.2% across Mediterranean complexes. Spreads volatile.', level: 'warning' },
    { category: 'K-GRAPH', agent: 'Risk Agent', message: 'Red Sea-to-Mediterranean trade route edges disabled. Rerouting algorithms active on Digital Twin.', level: 'danger' },
    { category: 'SPR', agent: 'Simulation Agent', message: 'India refined export pipelines delayed. Impact localized to revenue margins rather than crude supply.', level: 'info' },
    { category: 'SOLVER', agent: 'Optimization Agent', message: 'Trade balance optimized: Directing Jamnagar outbound shipments to Southeast Asian spot markets.', level: 'success' },
    { category: 'DIRECTIVE', agent: 'Coordinator Agent', message: 'DIRECTIVE_05: Pivot refinery exports to Singapore and Western Pacific hubs to avoid Europe late penalties.', level: 'success' }
  ],
  normal: [
    { category: 'GDELT', agent: 'News Agent', message: 'Baseline global energy corridors monitoring active. News sentiment indexes: NOMINAL.', level: 'info' },
    { category: 'AIS', agent: 'Shipping Agent', message: '47 supertankers reporting stable steaming metrics. No route/speed deviations flagged.', level: 'info' },
    { category: 'MARKET', agent: 'Market Agent', message: 'Brent steady at $78.40/bbl (Spread index narrow at $4.20). Volatility markers standard.', level: 'info' },
    { category: 'K-GRAPH', agent: 'Risk Agent', message: 'Digital Twin knowledge nodes executing nominal ledger handshakes. Choke point risk scores static.', level: 'success' }
  ]
};

const BACKGROUND_EVENTS: Omit<IntelligenceEvent, 'id' | 'timestamp'>[] = [
  { category: 'AIS', message: 'VLCC INDIRA logged port clearing at Jamnagar. Flow rate: 1.8M bbls discharging.', level: 'info' },
  { category: 'GRID', message: 'National refinery ledger synced. padur vault pressure verified at 42 bar (stable).', level: 'success' },
  { category: 'AIS', message: 'Sentinel satellite verifies GPS tracks for tanker Tagor. Zero corridor deviation.', level: 'info' },
  { category: 'MARKET', message: 'Platts Index Feed: Brent crude futures adjusted to $78.42/bbl (Spread: $4.18).', level: 'info' },
  { category: 'GDELT', message: 'GDELT monitor scans Malacca Strait corridor. Regional incident density: low.', level: 'info' },
  { category: 'AIS', message: 'Vessel VLCC CHOLA reported weather routing change. Steaming velocity adjusted to 15.2 kts.', level: 'info' },
  { category: 'GRID', message: 'Sovereign supply reserve buffer audited: 74 days cover intact.', level: 'success' },
  { category: 'K-GRAPH', message: 'Digital Twin handshake successful. Multi-stage state registers compiled.', level: 'success' }
];

export default function LiveIntelligenceFeed({ activeCrisis, onSelectNode }: LiveIntelligenceFeedProps) {
  const [events, setEvents] = useState<IntelligenceEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventCounter = useRef(0);

  // Helper to get formatted millisecond timestamp
  const getFormattedTime = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
  };

  // When crisis changes, wipe and playback the scenario sequence
  useEffect(() => {
    const rawSequence = SCENARIO_EVENTS[activeCrisis] || SCENARIO_EVENTS.normal;
    setEvents([]); // Reset
    eventCounter.current = 0;

    let timeoutId: any;
    // Playback sequence
    let currentIdx = 0;
    const playNext = () => {
      if (currentIdx < rawSequence.length) {
        const item = rawSequence[currentIdx];
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const newEv: IntelligenceEvent = {
          ...item,
          id: `scen_${activeCrisis}_${currentIdx}_${Date.now()}_${randomSuffix}`,
          timestamp: getFormattedTime()
        };
        setEvents(prev => [newEv, ...prev].slice(0, 40)); // Keep last 40
        currentIdx++;
        timeoutId = setTimeout(playNext, 600); // Quick sequential streaming
      }
    };
    playNext();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeCrisis]);

  // Ambient background events generator to make the terminal feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random background event
      const randIdx = Math.floor(Math.random() * BACKGROUND_EVENTS.length);
      const randEvent = BACKGROUND_EVENTS[randIdx];
      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const newEv: IntelligenceEvent = {
        ...randEvent,
        id: `ambient_${Date.now()}_${randomSuffix}`,
        timestamp: getFormattedTime()
      };
      // Insert with a small delay so it sparkles in
      setEvents(prev => [newEv, ...prev].slice(0, 40));
    }, 12000); // Add background event every 12s

    return () => clearInterval(interval);
  }, []);

  // Category specific styles
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'GDELT': return 'bg-brand-danger/10 text-brand-danger border-brand-danger/30';
      case 'AIS': return 'bg-brand-accent/10 text-brand-accent border-brand-accent/30';
      case 'K-GRAPH': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'SPR': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'SOLVER': return 'bg-brand-success/10 text-brand-success border-brand-success/30';
      case 'DIRECTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-brand-surface text-brand-muted border-brand-border';
    }
  };

  const getLevelDot = (level: string) => {
    switch (level) {
      case 'danger': return 'bg-brand-danger';
      case 'warning': return 'bg-brand-alert';
      case 'success': return 'bg-brand-success';
      default: return 'bg-brand-accent';
    }
  };

  // Node selector matching helpers
  const handleEventClick = (msg: string) => {
    if (msg.includes('Jamnagar')) onSelectNode('Jamnagar');
    else if (msg.includes('Kochi')) onSelectNode('Kochi');
    else if (msg.includes('Mundra')) onSelectNode('Mundra');
    else if (msg.includes('Hormuz')) onSelectNode('hormuz');
    else if (msg.includes('Bab-el-Mandeb')) onSelectNode('redsea');
    else if (msg.includes('Suez')) onSelectNode('suez');
    else if (msg.includes('Indira')) onSelectNode('VLCC Indira');
    else if (msg.includes('Tagor')) onSelectNode('VLCC Tagore');
    else if (msg.includes('Chola')) onSelectNode('VLCC Chola');
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 font-mono flex flex-col h-[280px]" id="live_intelligence_feed">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-brand-border/50 pb-2 mb-2 select-none">
        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-brand-accent animate-pulse" /> Living Event Bus & Intelligence Wire
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-ping" />
          <span className="text-[8px] text-brand-muted uppercase">SYS_STREAMING: OK</span>
        </div>
      </div>

      {/* Subtitle / Description */}
      <p className="text-[9px] text-brand-muted font-sans leading-tight mb-2 select-none">
        Real-time telemetry and decision-cascade events generated dynamically. Click on log rows to focus corresponding Digital Twin assets.
      </p>

      {/* Live scroll stream area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 select-text scrollbar-thin"
        id="live_feed_scroll_area"
      >
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-brand-muted text-[10px] italic">
            Connecting and handshaking with STRATOS ledger node...
          </div>
        ) : (
          events.map((ev) => (
            <div 
              key={ev.id}
              onClick={() => handleEventClick(ev.message)}
              className="p-1.5 bg-brand-bg/40 border border-brand-border/60 hover:border-brand-accent/40 rounded transition-all cursor-pointer flex items-start gap-2 text-[10px] leading-normal animate-fadeIn"
            >
              {/* Timing and Status Column */}
              <div className="flex flex-col items-start shrink-0 text-[8px] text-brand-muted">
                <span>{ev.timestamp}</span>
                <span className={`px-1 rounded border text-[7.5px] font-bold mt-0.5 uppercase tracking-wide border-brand-border/50 ${getBadgeStyle(ev.category)}`}>
                  {ev.category}
                </span>
              </div>

              {/* Message Body Column */}
              <div className="flex-1">
                <p className="text-slate-200">
                  {ev.agent && <strong className="text-brand-accent text-[9.5px] block">{ev.agent}</strong>}
                  <span className="font-sans leading-tight text-slate-300">{ev.message}</span>
                </p>
              </div>

              {/* Action Pulse Dot Column */}
              <div className="shrink-0 pt-1">
                <span className={`w-1.5 h-1.5 rounded-full block ${getLevelDot(ev.level)} animate-pulse`} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
