// Disaster Scenarios and Live Weather Telemetry Simulation
export const DISASTER_SCENARIOS = {
  typhoon: {
    id: "typhoon",
    name: "Super Typhoon Kagami",
    category: "Category 5 Super Typhoon",
    type: "tropical_cyclone",
    location: "Tokyo Bay & Pacific Seaboard, Japan",
    coords: [35.6762, 139.6503],
    radarCenter: { x: 300, y: 300 },
    threatLevel: 5,
    threatLabel: "CATASTROPHIC - LEVEL 5",
    color: "#ef4444",
    telemetry: {
      pressure: 912, // hPa
      windSpeed: 275, // km/h sustained
      windGust: 330, // km/h
      precipitationRate: 115, // mm/hr
      stormSurge: 4.8, // meters
      satelliteTemp: -82, // °C cloud top
      radarReflectivity: 68, // dBZ
      movement: "NW at 22 km/h",
      evacRadius: 180 // km
    },
    hazards: [
      "Severe 4.8m Coastal Storm Surge inundating low-lying districts",
      "Catastrophic structural wind damage (sustained >260 km/h)",
      "High probability of urban river overflow (Arakawa & Sumida basins)",
      "Wide-scale grid disruption and subterranean transit flooding"
    ],
    shelters: [
      { name: "Tokyo Metropolitan Gymnasium Evac Center", lat: 35.6795, lng: 139.7126, capacity: "8,500 / 10,000", status: "OPEN" },
      { name: "Yoyogi National Stadium Sector Safehouse", lat: 35.6672, lng: 139.6997, capacity: "11,200 / 15,000", status: "OPEN" },
      { name: "Ueno Park High-Ground Shelter Hub", lat: 35.7148, lng: 139.7744, capacity: "5,400 / 6,000", status: "FILLING FAST" }
    ],
    evacRoutes: [
      { name: "Route 1: Chuo Expressway Inland Corridor", status: "CLEAR - EMERGENCY TRAFFIC ONLY" },
      { name: "Route 2: Kan-Etsu Inbound Highground Vector", status: "CLEAR" },
      { name: "Coastal Bayshore Route Wangan", status: "CLOSED - SURGE INUNDATION" }
    ]
  },
  hurricane: {
    id: "hurricane",
    name: "Hurricane Helena",
    category: "Category 5 Major Hurricane",
    type: "hurricane",
    location: "Miami & Biscayne Bay Corridor, Florida, USA",
    coords: [25.7617, -80.1918],
    radarCenter: { x: 300, y: 300 },
    threatLevel: 5,
    threatLabel: "CATASTROPHIC - LEVEL 5",
    color: "#ef4444",
    telemetry: {
      pressure: 924,
      windSpeed: 260,
      windGust: 310,
      precipitationRate: 98,
      stormSurge: 4.2,
      satelliteTemp: -78,
      radarReflectivity: 65,
      movement: "WNW at 18 km/h",
      evacRadius: 160
    },
    hazards: [
      "Deadly 4.2m storm surge along Biscayne Bay barrier islands",
      "Widespread projectile structural damage to residential dwellings",
      "Total electrical grid failure across Dade & Broward counties",
      "Saltwater intrusion into freshwater pumping stations"
    ],
    shelters: [
      { name: "Miami Beach Convention Center Reinforced Hub", lat: 25.7946, lng: -80.1332, capacity: "9,000 / 12,000", status: "OPEN" },
      { name: "FIU Arena Inland Fortress", lat: 25.7538, lng: -80.3739, capacity: "7,400 / 8,000", status: "OPEN" },
      { name: "Hard Rock Stadium Logistics & Shelter Zone", lat: 25.9580, lng: -80.2389, capacity: "14,000 / 20,000", status: "OPEN" }
    ],
    evacRoutes: [
      { name: "Florida Turnpike Northbound Evac Contraflow", status: "OPEN - SPEED RESTRICTED" },
      { name: "I-95 Northbound Emergency Corridor", status: "HEAVY CONGESTION" },
      { name: "A1A Coastal Causeway", status: "MANDATORY EVACUATION COMPLETE - CLOSED" }
    ]
  },
  flashflood: {
    id: "flashflood",
    name: "Monsoon Surge & Flash Flood",
    category: "Extreme Flash Flood Emergency",
    type: "flood",
    location: "Metro Manila & Pasig River Basin, Philippines",
    coords: [14.5995, 120.9842],
    radarCenter: { x: 300, y: 300 },
    threatLevel: 4,
    threatLabel: "CRITICAL - LEVEL 4",
    color: "#f59e0b",
    telemetry: {
      pressure: 994,
      windSpeed: 75,
      windGust: 105,
      precipitationRate: 145, // Extreme torrential downpour
      stormSurge: 1.8,
      satelliteTemp: -68,
      radarReflectivity: 62,
      movement: "Stationary / Slow Meandering",
      evacRadius: 90
    },
    hazards: [
      "Rapid water cresting 3.5m above critical flood stage in Pasig River",
      "Immediate life safety peril for informal settlements along waterways",
      "Severe mudslides and debris flows in eastern perimeter ridges",
      "Major highway underpasses submerged up to 2.2 meters"
    ],
    shelters: [
      { name: "Araneta Coliseum Evacuation Base", lat: 14.6206, lng: 121.0526, capacity: "6,200 / 8,000", status: "OPEN" },
      { name: "Marikina Sports Complex Safe Zone", lat: 14.6366, lng: 121.0984, capacity: "4,100 / 5,000", status: "FILLING FAST" },
      { name: "UP Diliman High-Ground Relief Camp", lat: 14.6538, lng: 121.0685, capacity: "9,000 / 10,000", status: "OPEN" }
    ],
    evacRoutes: [
      { name: "C-5 Northbound Elevated Artery", status: "CLEAR" },
      { name: "EDSA Main Transit Route", status: "PARTIALLY IMPASSABLE - DEEP WATER" },
      { name: "Marikina Valley Lowland Access", status: "COMPLETELY FLOODED" }
    ]
  },
  tornado: {
    id: "tornado",
    name: "Tornado Supercell Outbreak",
    category: "EF-5 Violent Multi-Vortex Tornado",
    type: "tornado",
    location: "Oklahoma City Metro Corridor, USA",
    coords: [35.4676, -97.5164],
    radarCenter: { x: 300, y: 300 },
    threatLevel: 5,
    threatLabel: "CATASTROPHIC - LEVEL 5",
    color: "#ef4444",
    telemetry: {
      pressure: 968,
      windSpeed: 340, // Violent rotational velocity
      windGust: 410,
      precipitationRate: 85,
      stormSurge: 0,
      satelliteTemp: -72,
      radarReflectivity: 72, // Severe Hook Echo & Debris Ball
      movement: "NE at 70 km/h",
      evacRadius: 65
    },
    hazards: [
      "Direct hit confirmed on urban population center with massive debris ball",
      "Complete ground scouring and total obliteration of standard structures",
      "Airborne debris ballistic missile hazards up to 30,000 feet",
      "Secondary tornadogenesis spinning up along rear flank downdraft"
    ],
    shelters: [
      { name: "Norman Reinforced Subterranean Storm Bunker", lat: 35.2226, lng: -97.4395, capacity: "3,200 / 3,500", status: "FILLING FAST" },
      { name: "State Capitol Deep Basement Safe Sanctuary", lat: 35.4922, lng: -97.5033, capacity: "5,000 / 5,000", status: "AT CAPACITY" },
      { name: "Will Rogers Airport Sub-terminal Safe Area", lat: 35.3931, lng: -97.6007, capacity: "4,500 / 6,000", status: "OPEN" }
    ],
    evacRoutes: [
      { name: "I-35 Southbound Egress", status: "DANGEROUS - DIRECT PATH CROSSING" },
      { name: "I-40 Eastbound Vector", status: "CLEAR FOR VEHICULAR EGRESS" },
      { name: "Kilpatrick Turnpike West", status: "HIGH DEBRIS WARNING" }
    ]
  },
  wildfire: {
    id: "wildfire",
    name: "Diablo Wind Firestorm Megafire",
    category: "Extreme Fire Weather & Megafire",
    type: "wildfire",
    location: "Napa & Sonoma Mountain Corridor, California, USA",
    coords: [38.2975, -122.2869],
    radarCenter: { x: 300, y: 300 },
    threatLevel: 4,
    threatLabel: "CRITICAL - LEVEL 4",
    color: "#f97316",
    telemetry: {
      pressure: 1018,
      windSpeed: 110, // Dry offshore gale
      windGust: 145,
      precipitationRate: 0,
      stormSurge: 0,
      satelliteTemp: 450, // Pyrocumulus thermal hotspot °C
      radarReflectivity: 55, // Dense Smoke & Ash Plume
      movement: "SW at 45 km/h",
      evacRadius: 75
    },
    hazards: [
      "Pyrocumulonimbus cloud generating erratic lightning and ember spot fires 5km ahead",
      "Extreme forward spread rate consuming 2,000 acres per hour",
      "Toxic particulate matter (PM2.5 > 650 µg/m³) causing immediate respiratory failure",
      "Single-lane mountain canyon roads becoming trapped fire tunnels"
    ],
    shelters: [
      { name: "Santa Rosa Veterans Memorial Evacuation Hub", lat: 38.4358, lng: -122.7042, capacity: "2,800 / 4,000", status: "OPEN" },
      { name: "Sonoma County Fairgrounds Air-Filtered Center", lat: 38.4285, lng: -122.7001, capacity: "5,000 / 7,000", status: "OPEN" },
      { name: "Napa Valley College Gymnasium Sanctuary", lat: 38.2742, lng: -122.2748, capacity: "1,900 / 3,000", status: "OPEN" }
    ],
    evacRoutes: [
      { name: "US-101 Southward Evacuation Channel", status: "HEAVY SMOKE - ACTIVE ESCORTS" },
      { name: "Highway 29 Valley Route", status: "WARNING - EMBER SPOTTING HAZARD" },
      { name: "Mountain Canyon Pass 128", status: "CLOSED - FLAMES ON ROADWAY" }
    ]
  }
};
