export interface Chokepoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  normalFlow: string; // e.g. "21M bpd"
  currentRisk: number; // 0-100
  status: 'nominal' | 'elevated' | 'critical';
}

export interface Tanker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  speed: number; // knots
  capacity: number; // barrels or tons
  status: 'steaming' | 'anchored' | 'congested' | 'diverting';
  cargo: 'Crude Oil' | 'LNG' | 'Diesel' | 'Refined Products';
  source: string;
  destination: string;
  etaDays: number;
  vulnerabilityIndex: number; // 0-100
  routePoints: [number, number][]; // path coordinates
  currentRouteIndex: number;
}

export interface Port {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  capacity: string; // e.g., "5.2M bpd"
  congestionScore: number; // 0-100
  status: 'nominal' | 'congested' | 'critical';
  details: string;
}

export interface Pipeline {
  id: string;
  name: string;
  source: string;
  destination: string;
  flowVolume: string; // e.g. "1.5M bpd"
  status: 'operational' | 'disrupted' | 'reduced';
  latlngs: [number, number][];
}

export interface ConflictZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskScore: number;
  radius: number; // km on map visual
  details: string;
}

export interface GlobalMarketStats {
  brent: number;
  wti: number;
  gas: number;
  diesel: number;
  spread: number;
  changeBrent: number;
}

export interface AgentDebateMessage {
  agent: 'News Agent' | 'Shipping Agent' | 'Market Agent' | 'Risk Agent' | 'Simulation Agent' | 'Optimization Agent' | 'Coordinator Agent';
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface Recommendation {
  action: string;
  impact: string;
  feasibility: string;
}

export interface SimulationResult {
  overallRisk: number;
  confidence: number;
  briefing: string;
  debate: AgentDebateMessage[];
  recommendations: Recommendation[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'country' | 'corridor' | 'vessel' | 'port' | 'refinery' | 'product' | 'economic';
  value: string;
  riskLevel: 'safe' | 'warning' | 'danger';
}

export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
}
