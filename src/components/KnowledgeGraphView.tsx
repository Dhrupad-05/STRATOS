import React, { useState } from 'react';
import { GitCommit, HelpCircle, Activity, Search, Power, Filter, ShieldAlert, Sparkles, X } from 'lucide-react';
import { GraphNode, GraphEdge } from '../types';

interface KnowledgeGraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (nodeLabel: string) => void;
  crisisMode: string;
}

// Fixed coordinates layout for the 20 nodes for clear, beautiful presentation
// Stages: 1. Suppliers (X=70), 2. Corridors (X=220), 3. Fleet (X=360), 4. Ports (X=500), 5. Refineries (X=640), 6. Products/Buffers (X=780), 7. Economics (X=910)
const NODE_COORDINATES: Record<string, { x: number, y: number }> = {
  // 1. Suppliers (X=70)
  'saudi': { x: 70, y: 70 },
  'russia': { x: 70, y: 150 },
  'nigeria': { x: 70, y: 230 },
  'uae': { x: 70, y: 310 },

  // 2. Corridors (X=220)
  'hormuz': { x: 220, y: 100 },
  'redsea': { x: 220, y: 190 },
  'cape': { x: 220, y: 280 },

  // 3. Fleet (X=360)
  'tankers': { x: 360, y: 190 },

  // 4. Ports (X=500)
  'port_jamnagar': { x: 500, y: 100 },
  'port_mundra': { x: 500, y: 190 },
  'port_kochi': { x: 500, y: 280 },

  // 5. Refineries (X=640)
  'refinery_reliance': { x: 640, y: 100 },
  'refinery_nayara': { x: 640, y: 190 },
  'refinery_kochi': { x: 640, y: 280 },

  // 6. Products & Buffers (X=780)
  'diesel_output': { x: 780, y: 110 },
  'gasoline_output': { x: 780, y: 200 },
  'power_grid': { x: 780, y: 290 },

  // 7. Economics (X=910)
  'national_gdp': { x: 910, y: 100 },
  'import_bill': { x: 910, y: 190 },
  'spr': { x: 910, y: 280 }
};

export default function KnowledgeGraphView({
  nodes,
  edges,
  onSelectNode,
  crisisMode
}: KnowledgeGraphViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [blockedNodes, setBlockedNodes] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'risk' | 'asset'>('all');

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    onSelectNode(`${node.label} [Value: ${node.value}]`);
  };

  const toggleBlockage = (nodeId: string) => {
    setBlockedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'risk') {
      return node.riskLevel === 'danger' || node.riskLevel === 'warning' || blockedNodes[node.id];
    }
    if (activeFilter === 'asset') {
      return node.type === 'refinery' || node.type === 'port' || node.type === 'corridor';
    }
    return true;
  });

  const getNodeColor = (node: GraphNode) => {
    if (blockedNodes[node.id]) {
      return { fill: '#ef4444', stroke: '#ef4444', glow: '' };
    }
    if (node.riskLevel === 'danger') return { fill: '#ef4444', stroke: '#ef4444', glow: '' };
    if (node.riskLevel === 'warning') return { fill: '#d97706', stroke: '#d97706', glow: '' };
    return { fill: '#10b981', stroke: '#10b981', glow: '' };
  };

  const getEdgeColor = (from: string, to: string) => {
    // If either node is blocked, color the edge deep red warning
    if (blockedNodes[from] || blockedNodes[to]) return '#ef4444';
    
    const sourceNode = nodes.find(n => n.id === from);
    if (sourceNode?.riskLevel === 'danger') return '#ef4444';
    if (sourceNode?.riskLevel === 'warning') return '#d97706';
    return '#1f2937';
  };

  const getEdgeDash = (from: string, to: string) => {
    if (blockedNodes[from] || blockedNodes[to]) return '3 3';
    const sourceNode = nodes.find(n => n.id === from);
    if (sourceNode?.riskLevel === 'danger') return '4 4';
    return 'none';
  };

  return (
    <div className="w-full bg-brand-surface border border-brand-border rounded-lg p-4 font-mono select-none space-y-3.5" id="knowledge_graph_panel">
      {/* 1. Header with search & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
        <div className="flex items-center gap-1.5">
          <GitCommit className="w-4 h-4 text-brand-accent rotate-45" />
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dependency Knowledge Graph</h4>
        </div>
        
        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          {/* Node Search Bar */}
          <div className="relative flex items-center bg-brand-bg border border-brand-border rounded px-2 py-1 max-w-[150px]">
            <Search className="w-3 h-3 text-brand-muted shrink-0 mr-1.5" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-[9.5px] text-white focus:outline-none w-full"
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex bg-brand-bg rounded border border-brand-border p-0.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-1.5 py-0.5 rounded ${activeFilter === 'all' ? 'bg-brand-surface text-brand-accent font-bold' : 'text-brand-muted'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('risk')}
              className={`px-1.5 py-0.5 rounded ${activeFilter === 'risk' ? 'bg-brand-surface text-brand-accent font-bold' : 'text-brand-muted'}`}
            >
              Risks
            </button>
            <button
              onClick={() => setActiveFilter('asset')}
              className={`px-1.5 py-0.5 rounded ${activeFilter === 'asset' ? 'bg-brand-surface text-brand-accent font-bold' : 'text-brand-muted'}`}
            >
              Assets
            </button>
          </div>
        </div>
      </div>

      {/* 2. SVG Canvas Graph */}
      <div className="w-full h-[320px] bg-brand-bg border border-brand-border rounded-md relative overflow-hidden" id="graph_viewport_container">
        {/* Stage Titles labels */}
        <div className="absolute top-2 left-0 right-0 px-2 flex justify-between text-[8px] text-brand-muted font-bold uppercase select-none pointer-events-none">
          <span className="w-20 text-center">1. Source</span>
          <span className="w-24 text-center">2. Corridor</span>
          <span className="w-20 text-center">3. Fleet</span>
          <span className="w-20 text-center">4. Port</span>
          <span className="w-20 text-center">5. Refinery</span>
          <span className="w-24 text-center">6. Output</span>
          <span className="w-24 text-center">7. Impact</span>
        </div>

        <svg viewBox="0 0 980 320" className="w-full h-full p-2 select-none">
          {/* Draw Connection Links (Edges) */}
          <g strokeWidth="1.5" opacity="0.8">
            {edges.map((edge, idx) => {
              const start = NODE_COORDINATES[edge.from];
              const end = NODE_COORDINATES[edge.to];
              if (!start || !end) return null;

              const stroke = getEdgeColor(edge.from, edge.to);
              const dash = getEdgeDash(edge.from, edge.to);

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={start.x}
                    y1={start.y - 15} // Offset slightly to line up nicely with node heights
                    x2={end.x}
                    y2={end.y - 15}
                    stroke={stroke}
                    strokeDasharray={dash}
                    className={dash !== 'none' ? 'animate-[dash_6s_linear_infinite]' : ''}
                  />
                  {/* Small directional connector arrow midpoint */}
                  <circle
                    cx={(start.x + end.x) / 2}
                    cy={(start.y - 15 + end.y - 15) / 2}
                    r="2"
                    fill={stroke}
                  />
                </g>
              );
            })}
          </g>

          {/* Draw Entities (Nodes) */}
          <g>
            {nodes.map(node => {
              const pos = NODE_COORDINATES[node.id];
              if (!pos) return null;

              const isHighlightedBySearch = searchQuery !== '' && node.label.toLowerCase().includes(searchQuery.toLowerCase());
              const isFilteredOut = !filteredNodes.some(fn => fn.id === node.id);
              const styles = getNodeColor(node);
              const isSupplier = node.type === 'country';
              const isBlocked = blockedNodes[node.id];

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y - 15})`}
                  className={`cursor-pointer transition-all duration-300 ${isFilteredOut ? 'opacity-15 pointer-events-none' : 'opacity-100'}`}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Outer Pulsing Glow */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isHighlightedBySearch ? "16" : "12"}
                    fill="none"
                    stroke={styles.stroke}
                    strokeWidth={isHighlightedBySearch ? "2" : "1"}
                    opacity="0.3"
                    className="group-hover:scale-125 transition-transform duration-300"
                  />

                  {/* Blocked Red Cross Background */}
                  {isBlocked && (
                    <circle
                      cx="0"
                      cy="0"
                      r="10"
                      fill="#ff4444"
                      opacity="0.1"
                    />
                  )}

                  {/* Core Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSupplier ? "7" : "5.5"}
                    fill="#050507"
                    stroke={styles.stroke}
                    strokeWidth={isBlocked ? "3.5" : "2"}
                  />

                  {/* Blockage Visual X indicator */}
                  {isBlocked && (
                    <g stroke="#ff4444" strokeWidth="2">
                      <line x1="-4" y1="-4" x2="4" y2="4" />
                      <line x1="-4" y1="4" x2="4" y2="-4" />
                    </g>
                  )}

                  {/* Node Label Text */}
                  <text
                    x="0"
                    y="-16"
                    textAnchor="middle"
                    fill={selectedNode?.id === node.id ? "#f27d26" : "#334155"}
                    fontSize="8.5"
                    fontWeight="bold"
                    className="group-hover:fill-brand-accent transition-colors"
                  >
                    {node.label}
                  </text>

                  {/* Secondary spec value */}
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    fill="#8e9299"
                    fontSize="7.5"
                    className="group-hover:fill-slate-300"
                  >
                    {isBlocked ? "BLOCKED" : node.value}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 3. Node Inspector Drawer Panel */}
      <div className="bg-brand-bg/40 border border-brand-border p-3 rounded-lg" id="node_inspector_drawer">
        {selectedNode ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px]">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-brand-accent font-bold text-xs">{selectedNode.label.toUpperCase()}</span>
                <span className="text-brand-muted">|</span>
                <span className="text-slate-300">Type: <strong className="text-white capitalize">{selectedNode.type}</strong></span>
                <span className="text-brand-muted">|</span>
                <span className="text-slate-300">Capacity: <strong className="text-white">{selectedNode.value}</strong></span>
                <span className="text-brand-muted">|</span>
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[8px] border ${
                  blockedNodes[selectedNode.id] 
                    ? 'bg-brand-danger/10 text-brand-danger border-brand-danger/30' 
                    : (selectedNode.riskLevel === 'danger' ? 'bg-brand-danger/10 text-brand-danger border-brand-danger/30' : (selectedNode.riskLevel === 'warning' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30' : 'bg-brand-success/10 text-brand-success border-brand-success/30'))
                }`}>
                  {blockedNodes[selectedNode.id] ? "BLOCKED (SIMULATION)" : `${selectedNode.riskLevel.toUpperCase()} RISK`}
                </span>
              </div>
              
              <p className="text-[9.5px] text-brand-muted leading-tight font-sans">
                {blockedNodes[selectedNode.id] 
                  ? "Operational flow halted. Connected edges have been flagged as disrupted. Strategic pipeline algorithms are simulating cascading failure loads to adjacent refinery buffers."
                  : `Active asset verifying continuous AIS data streams. Real-time downstream dependencies maps verified through Jamnagar ledger heights.`
                }
              </p>
            </div>

            {/* Blockage simulation trigger */}
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                onClick={() => toggleBlockage(selectedNode.id)}
                className={`px-3 py-1.5 rounded border font-bold flex items-center gap-1.5 cursor-pointer text-xs transition-all ${
                  blockedNodes[selectedNode.id]
                    ? 'bg-brand-success/10 text-brand-success border-brand-success/40'
                    : 'bg-brand-danger/10 text-brand-danger border-brand-danger/40 hover:bg-brand-danger/20'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {blockedNodes[selectedNode.id] ? "Restore Node Operations" : "Toggle Simulated Blockage"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-brand-muted text-[10px] font-sans flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-accent" />
            <span>Click any node in the dependency graph to inspect telemetry KPIs, search paths, or trigger a custom simulated blockage.</span>
          </div>
        )}
      </div>

      {/* Legend indicators */}
      <div className="flex items-center gap-4 text-[9px] text-brand-muted justify-between font-sans">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
          <span>GEOGRAPHIC-TEMPORAL MAPPING ACTIVE</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-success" /> NOMINAL (SAFE)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-alert" /> ELEVATED RISK (WARNING)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-danger" /> CRITICAL (DANGER/BLOCKED)
          </span>
        </div>
      </div>
    </div>
  );
}
