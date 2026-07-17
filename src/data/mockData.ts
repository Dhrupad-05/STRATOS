import { Chokepoint, Tanker, Port, Pipeline, ConflictZone, GlobalMarketStats, GraphNode, GraphEdge } from '../types';

// Global choke points
export const CHOKEPOINTS: Chokepoint[] = [
  {
    id: 'hormuz',
    name: 'Strait of Hormuz',
    lat: 26.56,
    lng: 56.25,
    description: 'The world\'s most critical oil transit choke point, handling 21M barrels per day (20% of global consumption).',
    normalFlow: '21.0M bpd',
    currentRisk: 15,
    status: 'nominal'
  },
  {
    id: 'bab',
    name: 'Bab-el-Mandeb',
    lat: 12.58,
    lng: 43.33,
    description: 'Strategic link between the Indian Ocean and the Red Sea, vulnerable to localized regional threats.',
    normalFlow: '8.8M bpd',
    currentRisk: 18,
    status: 'nominal'
  },
  {
    id: 'suez',
    name: 'Suez Canal',
    lat: 30.60,
    lng: 32.33,
    description: 'Artificial sea-level waterway in Egypt connecting the Mediterranean Sea to the Red Sea.',
    normalFlow: '9.0M bpd',
    currentRisk: 10,
    status: 'nominal'
  },
  {
    id: 'malacca',
    name: 'Strait of Malacca',
    lat: 1.43,
    lng: 102.80,
    description: 'Primary shipping channel between Indian Ocean and Pacific Ocean, connecting East Asia to Middle East/Africa.',
    normalFlow: '16.0M bpd',
    currentRisk: 12,
    status: 'nominal'
  },
  {
    id: 'panama',
    name: 'Panama Canal',
    lat: 9.12,
    lng: -79.91,
    description: 'Vital canal connecting the Atlantic and Pacific Oceans, highly sensitive to weather and drought levels.',
    normalFlow: '1.2M bpd',
    currentRisk: 8,
    status: 'nominal'
  }
];

// Major energy ports
export const PORTS: Port[] = [
  { id: 'jamnagar', name: 'Jamnagar Port', country: 'India', lat: 22.47, lng: 70.03, capacity: '1.4M bpd', congestionScore: 14, status: 'nominal', details: 'Site of the world\'s largest refining complex owned by Reliance Industries.' },
  { id: 'mundra', name: 'Mundra Port', country: 'India', lat: 22.75, lng: 69.70, capacity: '1.1M bpd', congestionScore: 18, status: 'nominal', details: 'Primary multi-cargo port handling major crude imports for northern India.' },
  { id: 'kochi', name: 'Kochi Port', country: 'India', lat: 9.97, lng: 76.22, capacity: '0.4M bpd', congestionScore: 10, status: 'nominal', details: 'Hosts Kochi Refinery and provides crucial coastal distribution access.' },
  { id: 'ras_tanura', name: 'Ras Tanura', country: 'Saudi Arabia', lat: 26.63, lng: 50.17, capacity: '3.4M bpd', congestionScore: 22, status: 'nominal', details: 'The world\'s largest offshore oil loading port facility, operated by Saudi Aramco.' },
  { id: 'rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', lat: 51.92, lng: 4.14, capacity: '2.8M bpd', congestionScore: 15, status: 'nominal', details: 'Deepwater port serving as the gate of entry for Northern Europe refining centers.' },
  { id: 'singapore', name: 'Port of Singapore', country: 'Singapore', lat: 1.26, lng: 103.83, capacity: '4.5M bpd', congestionScore: 32, status: 'nominal', details: 'Global bunkering capital and transshipment hub for all Asia-Pacific trade.' },
  { id: 'houston', name: 'Port of Houston', country: 'United States', lat: 29.74, lng: -95.09, capacity: '2.5M bpd', congestionScore: 25, status: 'nominal', details: 'Primary loading zone for US shale oil exports and Gulf Coast refinery complex.' },
  { id: 'bonny', name: 'Bonny Terminal', country: 'Nigeria', lat: 4.43, lng: 7.17, capacity: '1.2M bpd', congestionScore: 11, status: 'nominal', details: 'Strategic offshore loading platform for premium Nigerian Bonny Light sweet crude.' },
  { id: 'primorsk', name: 'Primorsk Port', country: 'Russia', lat: 60.33, lng: 28.61, capacity: '1.5M bpd', congestionScore: 20, status: 'nominal', details: 'Major Baltic export terminal for Russian Urals crude heading into global markets.' }
];

// Major pipelines
export const PIPELINES: Pipeline[] = [
  {
    id: 'espo',
    name: 'East Siberia-Pacific Ocean (ESPO) Pipeline',
    source: 'Taishet, Russia',
    destination: 'Kozmino, Russia',
    flowVolume: '1.6M bpd',
    status: 'operational',
    latlngs: [
      [56.12, 98.01],
      [52.02, 104.30],
      [51.83, 107.58],
      [50.25, 127.52],
      [48.48, 135.08],
      [43.11, 131.88]
    ]
  },
  {
    id: 'east_west',
    name: 'East-West Petroline',
    source: 'Abqaiq, Saudi Arabia',
    destination: 'Yanbu, Saudi Arabia',
    flowVolume: '5.0M bpd',
    status: 'operational',
    latlngs: [
      [26.21, 49.68],
      [24.71, 46.67],
      [24.08, 42.12],
      [24.09, 38.08]
    ]
  },
  {
    id: 'kirkuk',
    name: 'Kirkuk-Ceyhan Pipeline',
    source: 'Kirkuk, Iraq',
    destination: 'Ceyhan, Turkey',
    flowVolume: '0.6M bpd',
    status: 'operational',
    latlngs: [
      [35.46, 44.39],
      [37.07, 42.44],
      [37.03, 37.37],
      [36.88, 35.81]
    ]
  }
];

// Active Conflict/Sanction zones
export const CONFLICT_ZONES: ConflictZone[] = [
  {
    id: 'yemen_threat',
    name: 'Bab-el-Mandeb Hostilities',
    lat: 13.0,
    lng: 43.1,
    riskScore: 20,
    radius: 350,
    details: 'Heightened threat of surface drone and anti-ship missile attacks originating from coastal areas.'
  },
  {
    id: 'gulf_naval',
    name: 'Persian Gulf Patrol Zone',
    lat: 27.5,
    lng: 52.0,
    riskScore: 15,
    radius: 400,
    details: 'Escalated surveillance boarding and tactical maneuvers around regional maritime corridors.'
  },
  {
    id: 'baltic_border',
    name: 'Baltic Sanctions Inspection Area',
    lat: 56.5,
    lng: 20.0,
    riskScore: 10,
    radius: 250,
    details: 'Sovereign boardings and secondary financial compliance inspections on non-compliant registry vessels.'
  }
];

// Major Trade Lanes for 47 tankers
const ROUTE_MIDDLE_EAST_TO_INDIA: [number, number][] = [
  [26.6, 50.17], // Ras Tanura
  [26.56, 56.25], // Strait of Hormuz
  [23.5, 60.5], // Sea of Oman
  [22.47, 70.03] // Jamnagar
];

const ROUTE_WEST_AFRICA_TO_INDIA: [number, number][] = [
  [4.43, 7.17], // Bonny Terminal
  [-34.3, 18.5], // Cape of Good Hope
  [-25.0, 45.0], // South Madagascar
  [0.0, 60.0], // Equatorial Indian Ocean
  [9.97, 76.22] // Kochi Port
];

const ROUTE_RUSSIA_BALTIC_TO_INDIA: [number, number][] = [
  [60.33, 28.61], // Primorsk Port
  [56.5, 20.0], // Baltic Sea
  [50.0, -5.0], // Celtic Sea
  [37.0, -10.0], // Gibraltar
  [35.0, 20.0], // Mediterranean Sea
  [30.6, 32.3], // Suez Canal
  [12.58, 43.33], // Bab-el-Mandeb
  [11.0, 58.0], // Arabian Sea
  [22.75, 69.7] // Mundra Port
];

const ROUTE_RUSSIA_BALTIC_AROUND_AFRICA: [number, number][] = [
  [60.33, 28.61], // Primorsk
  [56.5, 20.0], // Baltic
  [50.0, -5.0], // Celtic Sea
  [20.0, -20.0], // West Sahara Atlantic
  [-34.3, 18.5], // Cape of Good Hope
  [-25.0, 45.0], // Madagascar
  [10.0, 65.0], // Central Indian Ocean
  [22.75, 69.7] // Mundra
];

const ROUTE_US_GULF_TO_INDIA: [number, number][] = [
  [29.74, -95.09], // Houston
  [20.0, -75.0], // Caribbean
  [0.0, -40.0], // Equatorial Atlantic
  [-34.3, 18.5], // Cape of Good Hope
  [-20.0, 50.0], // Madagascar East
  [22.47, 70.03] // Jamnagar
];

const ROUTE_SINGAPORE_TO_EAST_INDIA: [number, number][] = [
  [1.26, 103.83], // Singapore
  [5.0, 95.0], // Malacca entrance
  [15.0, 85.0], // Bay of Bengal
  [22.47, 70.03] // Mundra/Jamnagar (long trip)
];

// Dynamic calculation helper to interpolate points for tankers
export function getPositionAlongPath(path: [number, number][], progress: number): { lat: number, lng: number } {
  if (path.length === 0) return { lat: 0, lng: 0 };
  if (path.length === 1) return { lat: path[0][0], lng: path[0][1] };
  if (progress <= 0) return { lat: path[0][0], lng: path[0][1] };
  if (progress >= 1) return { lat: path[path.length - 1][0], lng: path[path.length - 1][1] };

  const totalSegments = path.length - 1;
  const rawSegment = progress * totalSegments;
  const segmentIndex = Math.floor(rawSegment);
  const segmentProgress = rawSegment - segmentIndex;

  const startNode = path[segmentIndex];
  const endNode = path[segmentIndex + 1];

  const lat = startNode[0] + (endNode[0] - startNode[0]) * segmentProgress;
  const lng = startNode[1] + (endNode[1] - startNode[1]) * segmentProgress;

  return { lat, lng };
}

// Generate exactly 47 vessels distributed over the corridors
const TANKER_NAMES = [
  "Stratos Horizon", "Abqaiq Spirit", "Kochi Star", "Hormuz Raider", "Yamal Venture",
  "Reliance Splendour", "Cape Pioneer", "Siberian Titan", "Urals Legend", "Mundra Scepter",
  "Pacific Navigator", "Atlantic Voyager", "Bonny Express", "Fujairah Crown", "Aramco Valor",
  "Sentinel Guardian", "Ocean Sovereign", "Kozmino Monarch", "Poseidon Carrier", "Baltic Giant",
  "Malacca Swift", "Rotterdam Crest", "Galleon Gold", "Neptune Explorer", "Vanguard Diesel",
  "Meridian LNG", "Triton Tanker", "Pioneer Petroleum", "Ranger Refined", "Ganges Trader",
  "Bay of Bengal Star", "Persian Gulf Glory", "Delta Titan", "Polar Star", "Cape Agulhas",
  "Eldorado Crude", "Viking Urals", "Falcon Express", "Astraea Energy", "Helios Scepter",
  "Titan Fueler", "Valiant Voyager", "Pegasus LNG", "Stratos Pride", "Phoenix Tanker",
  "Aurora Venture", "Apex Carrier"
];

const CARGO_TYPES: ('Crude Oil' | 'LNG' | 'Diesel' | 'Refined Products')[] = [
  'Crude Oil', 'Crude Oil', 'Crude Oil', 'LNG', 'Diesel', 'Refined Products'
];

export const TANKERS: Tanker[] = Array.from({ length: 47 }, (_, i) => {
  const name = TANKER_NAMES[i] || `Tanker VLCC-${i}`;
  const cargo = CARGO_TYPES[i % CARGO_TYPES.length];
  
  // Distribute over routes
  let routePoints: [number, number][] = ROUTE_MIDDLE_EAST_TO_INDIA;
  let source = "Ras Tanura";
  let destination = "Jamnagar";
  
  if (i % 5 === 0) {
    routePoints = ROUTE_WEST_AFRICA_TO_INDIA;
    source = "Bonny Terminal";
    destination = "Kochi Port";
  } else if (i % 5 === 1) {
    // Some Russian shipments go through Suez, some around Africa
    routePoints = (i % 2 === 0) ? ROUTE_RUSSIA_BALTIC_TO_INDIA : ROUTE_RUSSIA_BALTIC_AROUND_AFRICA;
    source = "Primorsk Port";
    destination = "Mundra Port";
  } else if (i % 5 === 2) {
    routePoints = ROUTE_US_GULF_TO_INDIA;
    source = "Port of Houston";
    destination = "Jamnagar Port";
  } else if (i % 5 === 3) {
    routePoints = ROUTE_SINGAPORE_TO_EAST_INDIA;
    source = "Port of Singapore";
    destination = "Mundra Port";
  }

  // Create a pseudo-random stable offset progress (0.05 to 0.95)
  const progress = 0.05 + ((i * 13) % 91) / 100;
  const { lat, lng } = getPositionAlongPath(routePoints, progress);

  return {
    id: `vessel_${i + 1}`,
    name,
    lat,
    lng,
    speed: 12.5 + ((i * 3) % 40) / 10, // knots
    capacity: 1000000 + ((i * 100000) % 2000000), // barrels capacity
    status: progress > 0.8 ? 'anchored' : (progress < 0.2 ? 'anchored' : 'steaming'),
    cargo,
    source,
    destination,
    etaDays: Math.ceil((1 - progress) * (routePoints.length * 3)),
    vulnerabilityIndex: Math.round(10 + ((i * 7) % 60)),
    routePoints,
    currentRouteIndex: Math.floor(progress * (routePoints.length - 1))
  };
});

// Live Market Price Indices
export const BASELINE_MARKET: GlobalMarketStats = {
  brent: 78.40,
  wti: 74.20,
  gas: 2.85,
  diesel: 2.38,
  spread: 4.20,
  changeBrent: 0.12
};

// --------------------------------------------------------
// KNOWLEDGE GRAPH DESIGN
// --------------------------------------------------------

export const GRAPH_NODES: GraphNode[] = [
  { id: 'saudi', label: 'Saudi Arabia', type: 'country', value: '4.2M bpd Export', riskLevel: 'safe' },
  { id: 'russia', label: 'Russia (Urals)', type: 'country', value: '1.6M bpd Export', riskLevel: 'warning' },
  { id: 'nigeria', label: 'Nigeria (Bonny)', type: 'country', value: '1.2M bpd Export', riskLevel: 'safe' },
  { id: 'uae', label: 'UAE (Murban)', type: 'country', value: '1.4M bpd Export', riskLevel: 'safe' },
  
  { id: 'hormuz', label: 'Strait of Hormuz', type: 'corridor', value: '78% Transited', riskLevel: 'safe' },
  { id: 'redsea', label: 'Bab-el-Mandeb / Red Sea', type: 'corridor', value: '12% Transited', riskLevel: 'safe' },
  { id: 'cape', label: 'Cape of Good Hope Route', type: 'corridor', value: '10% Transited', riskLevel: 'safe' },
  
  { id: 'tankers', label: 'India Crude Tanker Fleet', type: 'vessel', value: '47 Active Carriers', riskLevel: 'safe' },
  
  { id: 'port_jamnagar', label: 'Jamnagar Import Gate', type: 'port', value: '1.4M bpd Cap', riskLevel: 'safe' },
  { id: 'port_mundra', label: 'Mundra Terminal', type: 'port', value: '1.1M bpd Cap', riskLevel: 'safe' },
  { id: 'port_kochi', label: 'Kochi Terminal', type: 'port', value: '0.4M bpd Cap', riskLevel: 'safe' },
  
  { id: 'refinery_reliance', label: 'Reliance complex (Jamnagar)', type: 'refinery', value: '1.2M bpd refining', riskLevel: 'safe' },
  { id: 'refinery_kochi', label: 'Kochi Refinery (BPCL)', type: 'refinery', value: '310K bpd refining', riskLevel: 'safe' },
  { id: 'refinery_nayara', label: 'Nayara complex (Vadinar)', type: 'refinery', value: '400K bpd refining', riskLevel: 'safe' },
  
  { id: 'diesel_output', label: 'Diesel Fuels Output', type: 'product', value: 'High Domestic Demand', riskLevel: 'safe' },
  { id: 'gasoline_output', label: 'Gasoline & LPG Output', type: 'product', value: 'Standard Domestic Supply', riskLevel: 'safe' },
  
  { id: 'power_grid', label: 'National Power Grid (Backups)', type: 'economic', value: 'Peak load buffer', riskLevel: 'safe' },
  { id: 'national_gdp', label: 'GDP Growth Target (7.2%)', type: 'economic', value: 'Sensitive to oil +$10', riskLevel: 'safe' },
  { id: 'import_bill', label: 'Sovereign Import Bill', type: 'economic', value: 'Current: $12.4B/mo', riskLevel: 'safe' },
  { id: 'spr', label: 'Strategic Petroleum Reserves', type: 'economic', value: '74 Days cover (100%)', riskLevel: 'safe' }
];

export const GRAPH_EDGES: GraphEdge[] = [
  // Supply to Corridors
  { from: 'saudi', to: 'hormuz', relationship: 'exports_via' },
  { from: 'uae', to: 'hormuz', relationship: 'exports_via' },
  { from: 'russia', to: 'redsea', relationship: 'exports_via' },
  { from: 'nigeria', to: 'cape', relationship: 'exports_via' },
  
  // Corridors to Fleet
  { from: 'hormuz', to: 'tankers', relationship: 'traversed_by' },
  { from: 'redsea', to: 'tankers', relationship: 'traversed_by' },
  { from: 'cape', to: 'tankers', relationship: 'traversed_by' },
  
  // Fleet to Ports
  { from: 'tankers', to: 'port_jamnagar', relationship: 'discharges_at' },
  { from: 'tankers', to: 'port_mundra', relationship: 'discharges_at' },
  { from: 'tankers', to: 'port_kochi', relationship: 'discharges_at' },
  
  // Ports to Refineries
  { from: 'port_jamnagar', to: 'refinery_reliance', relationship: 'supplies_crude' },
  { from: 'port_jamnagar', to: 'refinery_nayara', relationship: 'supplies_crude' },
  { from: 'port_kochi', to: 'refinery_kochi', relationship: 'supplies_crude' },
  { from: 'port_mundra', to: 'refinery_reliance', relationship: 'supplies_crude' },
  
  // Refineries to Products
  { from: 'refinery_reliance', to: 'diesel_output', relationship: 'produces' },
  { from: 'refinery_nayara', to: 'diesel_output', relationship: 'produces' },
  { from: 'refinery_kochi', to: 'diesel_output', relationship: 'produces' },
  { from: 'refinery_reliance', to: 'gasoline_output', relationship: 'produces' },
  
  // Products/Buffer to Economics & Security
  { from: 'diesel_output', to: 'power_grid', relationship: 'fuels_backup' },
  { from: 'power_grid', to: 'national_gdp', relationship: 'supports' },
  { from: 'spr', to: 'national_gdp', relationship: 'buffers' },
  
  // Inputs to sovereign metrics
  { from: 'refinery_reliance', to: 'import_bill', relationship: 'drives_cost' },
  { from: 'import_bill', to: 'national_gdp', relationship: 'impacts_fiscal' }
];

// Helper to calculate dynamic state updates based on crisis active
export function getUpdatedKnowledgeGraph(crisis: string): { nodes: GraphNode[], edges: GraphEdge[] } {
  const nodes = GRAPH_NODES.map(node => {
    const updated = { ...node };
    
    if (crisis === 'hormuz') {
      if (['hormuz', 'saudi', 'uae'].includes(node.id)) {
        updated.riskLevel = 'danger';
        updated.value = node.id === 'hormuz' ? 'BLOCKED 50%' : 'Transit halted';
      } else if (['cape', 'nigeria', 'spr'].includes(node.id)) {
        updated.riskLevel = 'warning';
        updated.value = node.id === 'spr' ? 'DEPLETING (48 days cover)' : node.value;
      }
    } else if (crisis === 'redsea') {
      if (['redsea', 'russia'].includes(node.id)) {
        updated.riskLevel = 'danger';
        updated.value = node.id === 'redsea' ? 'MISSILE THREAT (92%)' : 'Payment bottleneck';
      } else if (['cape', 'port_mundra'].includes(node.id)) {
        updated.riskLevel = 'warning';
        updated.value = node.id === 'cape' ? 'VOLUME UP +180%' : 'Bottleneck delays';
      }
    } else if (crisis === 'russia') {
      if (node.id === 'russia') {
        updated.riskLevel = 'danger';
        updated.value = 'Sanctions payment blocks';
      } else if (['import_bill', 'national_gdp'].includes(node.id)) {
        updated.riskLevel = 'warning';
        updated.value = node.id === 'import_bill' ? '+$1.4B/mo' : 'Growth strain (-0.15%)';
      }
    } else if (crisis === 'covid') {
      if (['national_gdp', 'import_bill', 'refinery_reliance'].includes(node.id)) {
        updated.riskLevel = 'danger';
        updated.value = node.id === 'refinery_reliance' ? 'Refinery cuts (40%)' : node.value;
      } else if (node.id === 'spr') {
        updated.riskLevel = 'safe';
        updated.value = 'FULL (100% capacity)';
      }
    } else if (crisis === 'suez') {
      if (node.id === 'redsea') {
        updated.riskLevel = 'danger';
        updated.value = 'Suez fully blocked';
      } else if (['refinery_reliance', 'import_bill'].includes(node.id)) {
        updated.riskLevel = 'warning';
        updated.value = 'Export logistics frozen';
      }
    }
    
    return updated;
  });

  return { nodes, edges: GRAPH_EDGES };
}
