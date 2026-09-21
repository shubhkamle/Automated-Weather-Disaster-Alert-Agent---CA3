// AegisVortex AI - Unified Autonomous Weather Disaster Alert Agent Engine
// Compatible with both direct file:/// local opening and HTTP/HTTPS server environments

(function () {
  "use strict";

  // =========================================================================
  // 1. DISASTER SCENARIOS & METEOROLOGICAL TELEMETRY PRESETS
  // =========================================================================
  const DISASTER_SCENARIOS = {
    typhoon: {
      id: "typhoon",
      name: "Super Typhoon Kagami",
      category: "Category 5 Super Typhoon",
      type: "tropical_cyclone",
      location: "Tokyo Bay & Pacific Seaboard, Japan",
      coords: [35.6762, 139.6503],
      threatLevel: 5,
      threatLabel: "CATASTROPHIC - LEVEL 5",
      color: "#ef4444",
      telemetry: {
        pressure: 912,
        windSpeed: 275,
        windGust: 330,
        precipitationRate: 115,
        stormSurge: 4.8,
        satelliteTemp: -82,
        radarReflectivity: 68,
        movement: "NW at 22 km/h",
        evacRadius: 180
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
      threatLevel: 4,
      threatLabel: "CRITICAL - LEVEL 4",
      color: "#f59e0b",
      telemetry: {
        pressure: 994,
        windSpeed: 75,
        windGust: 105,
        precipitationRate: 145,
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
      threatLevel: 5,
      threatLabel: "CATASTROPHIC - LEVEL 5",
      color: "#ef4444",
      telemetry: {
        pressure: 968,
        windSpeed: 340,
        windGust: 410,
        precipitationRate: 85,
        stormSurge: 0,
        satelliteTemp: -72,
        radarReflectivity: 72,
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
      threatLevel: 4,
      threatLabel: "CRITICAL - LEVEL 4",
      color: "#f97316",
      telemetry: {
        pressure: 1018,
        windSpeed: 110,
        windGust: 145,
        precipitationRate: 0,
        stormSurge: 0,
        satelliteTemp: 450,
        radarReflectivity: 55,
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

  // =========================================================================
  // 2. GOOGLE GEMINI API DISASTER AGENT ENGINE
  // =========================================================================
  const DEFAULT_MODEL = "gemini-1.5-flash";
  const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

  class GeminiDisasterAgent {
    constructor() {
      this.apiKey = localStorage.getItem("aegis_gemini_api_key") || "";
      this.model = localStorage.getItem("aegis_gemini_model") || DEFAULT_MODEL;
    }

    setApiKey(key) {
      this.apiKey = (key || "").trim();
      if (this.apiKey) {
        localStorage.setItem("aegis_gemini_api_key", this.apiKey);
      } else {
        localStorage.removeItem("aegis_gemini_api_key");
      }
    }

    getApiKey() {
      return this.apiKey;
    }

    hasApiKey() {
      return Boolean(this.apiKey && this.apiKey.length > 10);
    }

    setModel(model) {
      this.model = model;
      localStorage.setItem("aegis_gemini_model", model);
    }

    async analyzeDisaster(scenario) {
      const prompt = `You are "AegisVortex AI", an Autonomous Weather Disaster Alert & Triage Agent deployed in an Emergency Operations Center (EOC).
Analyze the following active meteorological disaster event and provide a comprehensive operational briefing for incident commanders and public safety officials:

EVENT PROFILE:
- Name: ${scenario.name}
- Category: ${scenario.category} (${scenario.type})
- Location: ${scenario.location} (Lat/Lng: ${scenario.coords.join(", ")})
- Barometric Pressure: ${scenario.telemetry.pressure} hPa
- Sustained Winds: ${scenario.telemetry.windSpeed} km/h (Gusts: ${scenario.telemetry.windGust} km/h)
- Precipitation Rate: ${scenario.telemetry.precipitationRate} mm/hr
- Storm Surge: ${scenario.telemetry.stormSurge} meters
- Satellite Cloud-Top Temp: ${scenario.telemetry.satelliteTemp} °C
- Doppler Reflectivity: ${scenario.telemetry.radarReflectivity} dBZ
- Movement Vector: ${scenario.telemetry.movement}
- Recommended Evac Radius: ${scenario.telemetry.evacRadius} km

Please provide an in-depth, structured emergency assessment using the following format:
### 1. EXECUTIVE THREAT INDEX & SEVERITY
- Threat Level (Scale 1-5 with justification)
- Life-Peril Horizon (Hours remaining until catastrophic onset)
- Estimated Population Exposed in Primary Danger Cone

### 2. PRIMARY CASUALTY & INFRASTRUCTURE HAZARDS
- Bulleted critical failure modes (e.g. storm surge breach, grid collapse, bridge scour, flash mudslides)

### 3. MANDATORY CIVILIAN ACTION DIRECTIVES
- Immediate survival actions for citizens in evacuation zones
- What people in high-rise vs ground-level buildings must do immediately

### 4. FIRST RESPONDER & LOGISTICAL TACTICS
- Search and Rescue (SAR) staging locations
- Power grid, hospital generator, and hazardous material precautions

Keep the tone authoritative, urgent, professional, and precise.`;

      if (this.hasApiKey()) {
        try {
          const response = await this.callGemini(prompt);
          return { source: "gemini-api", content: response };
        } catch (err) {
          console.warn("Gemini API call failed, falling back to autonomous agent simulation:", err);
        }
      }

      return {
        source: "autonomous-agent-simulation",
        content: this.generateSimulatedAnalysis(scenario)
      };
    }

    async generateMultiLingualAlert(scenario, language = "English") {
      const prompt = `You are AegisVortex AI, the Automated Emergency Alert System (EAS).
Generate a localized emergency broadcast alert for the disaster:
Disaster: ${scenario.name} (${scenario.category})
Target Region: ${scenario.location}
Threat Level: ${scenario.threatLabel}
Key Hazard: ${scenario.hazards[0]}
Target Language: ${language}

Format your output with exactly these 3 components:
[CELL BROADCAST / WEA (Max 90 chars)]
(Urgent, uppercase, all-caps emergency text with clear action)

[EMERGENCY SIREN & RADIO SCRIPT (30 seconds)]
(Spoken script for automated broadcast sirens, radio interrupt, and TV crawl)

[CIVIC ACTION CHECKLIST]
1. (Action step)
2. (Action step)
3. (Action step)`;

      if (this.hasApiKey()) {
        try {
          const response = await this.callGemini(prompt);
          return { source: "gemini-api", content: response };
        } catch (err) {
          console.warn("Gemini API call failed for multi-lingual alert:", err);
        }
      }

      return {
        source: "autonomous-agent-simulation",
        content: this.generateSimulatedAlert(scenario, language)
      };
    }

    async askCopilot(userQuestion, scenario, conversationHistory = []) {
      const prompt = `You are AegisVortex Incident Copilot, an AI disaster response advisor.
Current Active Incident:
- Event: ${scenario.name} (${scenario.category})
- Location: ${scenario.location}
- Wind/Gust: ${scenario.telemetry.windSpeed} / ${scenario.telemetry.windGust} km/h
- Pressure: ${scenario.telemetry.pressure} hPa | Precip: ${scenario.telemetry.precipitationRate} mm/hr | Surge: ${scenario.telemetry.stormSurge}m
- Shelters: ${scenario.shelters.map(s => `${s.name} (${s.status}, Cap: ${s.capacity})`).join("; ")}
- Evacuation Routes: ${scenario.evacRoutes.map(r => `${r.name} (${r.status})`).join("; ")}

User question: "${userQuestion}"

Provide a concise, direct, life-saving response (max 3-4 paragraphs) with tactical advice, shelter guidance, or safety protocols. Be supportive, calm, yet clear about danger.`;

      if (this.hasApiKey()) {
        try {
          const response = await this.callGemini(prompt);
          return { source: "gemini-api", content: response };
        } catch (err) {
          console.warn("Gemini copilot query failed, fallback used:", err);
        }
      }

      return {
        source: "autonomous-agent-simulation",
        content: this.generateSimulatedCopilotResponse(userQuestion, scenario)
      };
    }

    async callGemini(promptText) {
      const url = `${API_BASE_URL}/${this.model}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1400
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Gemini API error ${res.status}: ${errorData.error?.message || res.statusText}`);
      }

      const data = await res.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) throw new Error("No response content from Gemini.");
      return textOutput;
    }

    generateSimulatedAnalysis(scenario) {
      if (scenario.id === "typhoon") {
        return `### 1. EXECUTIVE THREAT INDEX & SEVERITY
- **Threat Level**: Level 5 (Catastrophic) — Central barometric pressure has plunged to **${scenario.telemetry.pressure} hPa** with sustained eyewall winds of **${scenario.telemetry.windSpeed} km/h**.
- **Life-Peril Horizon**: Crucial impact window begins in **1.8 hours**. Peak storm surge inundation will coincide with the approaching astronomical high tide.
- **Estimated Population Exposed**: **4.2 Million residents** within the high-danger coastal zone (Tokyo Bay, Kanagawa, Chiba seaboard).

### 2. PRIMARY CASUALTY & INFRASTRUCTURE HAZARDS
- **4.8-Meter Storm Surge**: Rapid sea wall overtopping across Koto, Edogawa, and Minato lowlands; subterranean subway tunnels face immediate backflow flooding.
- **Structural Destruction**: Sustained winds exceeding 270 km/h will shred roofing, tear down scaffolding, and convert loose debris into lethal high-velocity projectiles.
- **Urban River Surges**: Upstream deluge (>115 mm/hr) threatens simultaneous crest breaches along the Arakawa and Tama river basins.

### 3. MANDATORY CIVILIAN ACTION DIRECTIVES
- **Zone A & B Residents (Coastal & Lowland)**: Execute immediate mandatory evacuation to designated reinforced high-ground structures.
- **Vertical Evacuation**: If egress routes are congested, shelter on the 4th floor or higher of steel-reinforced concrete buildings. Stay away from windward glass windows.
- **Emergency Utilities**: Disconnect main gas valves and breaker switches before leaving to prevent post-surge fires.

### 4. FIRST RESPONDER & LOGISTICAL TACTICS
- Stage Search & Rescue (SAR) amphibious units at **Ueno Park High-Ground Shelter Hub** and **Yoyogi Center**.
- Pre-deploy auxiliary diesel generators to Tokyo Medical Center and regional trauma triage stations.
- Halt all elevated train lines and seal floodgates along the waterfront perimeters immediately.`;
      }

      if (scenario.id === "hurricane") {
        return `### 1. EXECUTIVE THREAT INDEX & SEVERITY
- **Threat Level**: Level 5 (Catastrophic Major Hurricane) — Pressure **${scenario.telemetry.pressure} hPa**, eyewall winds **${scenario.telemetry.windSpeed} km/h**.
- **Life-Peril Horizon**: Eyewall landfall projected within **2.5 hours**. Dangerous outer bands already ashore.
- **Estimated Population Exposed**: **2.8 Million citizens** across Miami-Dade, Broward, and Monroe barrier islands.

### 2. PRIMARY CASUALTY & INFRASTRUCTURE HAZARDS
- **Catastrophic 4.2m Storm Surge**: Barrier island causeways are already underwater or at risk of structural undermining.
- **Power Grid Collapse**: 95%+ electrical blackout expected across South Florida; transmission towers and substations vulnerable to wind shear and saltwater flooding.
- **Potable Water Failure**: Municipal water treatment facilities risk sewage cross-contamination from floodback.

### 3. MANDATORY CIVILIAN ACTION DIRECTIVES
- **Mandatory Evacuees**: If still on barrier islands, seek immediate shelter in hardened public shelters. DO NOT attempt to drive on flooded causeways.
- **Interior Room Refuge**: Put as many closed walls between you and the outside. Enter windowless interior rooms, closets, or reinforced bathrooms with protective mattresses.
- **Drinking Water Reserves**: Fill bathtubs and clean containers with potable water immediately.

### 4. FIRST RESPONDER & LOGISTICAL TACTICS
- Activate mutual-aid urban search & rescue task forces staged at Hard Rock Stadium.
- Secure coastal bridges in open position to prevent hydraulic failure once winds exceed 65 km/h.`;
      }

      if (scenario.id === "flashflood") {
        return `### 1. EXECUTIVE THREAT INDEX & SEVERITY
- **Threat Level**: Level 4 (Extreme Flash Flood Emergency) — Torrential precipitation rate of **${scenario.telemetry.precipitationRate} mm/hr**.
- **Life-Peril Horizon**: Flash cresting occurring **NOW**. Water levels rising at 0.5 meters every 15 minutes in riverbed communities.
- **Estimated Population Exposed**: **1.9 Million residents** along the Pasig, Marikina, and Tullahan river systems.

### 2. PRIMARY CASUALTY & INFRASTRUCTURE HAZARDS
- **Violent Debris Torrents**: Uncontained runoff sweeping away vehicles, wooden structures, and electrical transformers.
- **Submerged Electrical Hazards**: Downed live powerlines charging standing water in urban alleyways.
- **Landslides & Escarpment Slumping**: Mountain slope destabilization threatening residential zones in eastern ridges.

### 3. MANDATORY CIVILIAN ACTION DIRECTIVES
- **Immediate High-Ground Ascent**: Move immediately to rooftops or second stories; do not linger to save personal possessions.
- **Never Walk or Drive in Floodwaters**: 15 cm of moving water can knock down an adult; 30 cm can float a passenger vehicle.
- **Children and Elderly Priority**: Move vulnerable persons first to designated high-ground assembly points at UP Diliman and Araneta Safe Zones.

### 4. FIRST RESPONDER & LOGISTICAL TACTICS
- Deploy motorized rubber rescue boats (Zodiacs) and high-clearance military transports.
- Establish triage points for hypothermia, contaminated water exposure, and laceration injuries.`;
      }

      return `### 1. EXECUTIVE THREAT INDEX & SEVERITY
- **Threat Level**: ${scenario.threatLabel} — Extreme meteorological anomaly detected at **${scenario.location}**.
- **Life-Peril Horizon**: Immediate hazard window active. Barometric pressure at **${scenario.telemetry.pressure} hPa**, wind gusts at **${scenario.telemetry.windGust} km/h**.
- **Estimated Population Exposed**: Severe danger zone spanning a **${scenario.telemetry.evacRadius} km** radius.

### 2. PRIMARY CASUALTY & INFRASTRUCTURE HAZARDS
- ${scenario.hazards.map(h => `**${h}**`).join("\n- ")}

### 3. MANDATORY CIVILIAN ACTION DIRECTIVES
- Take immediate protective shelter inside designated subterranean safe rooms or reinforced concrete structures.
- Monitor automated EAS sirens and local emergency frequency transmissions.
- Keep emergency go-bags, battery transceivers, and medical kits at hand.

### 4. FIRST RESPONDER & LOGISTICAL TACTICS
- Incident Command Post established. Maintain priority clear status on: ${scenario.evacRoutes.map(r => r.name).join(", ")}.
- Coordinate with emergency shelters: ${scenario.shelters.map(s => s.name).join(", ")}.`;
    }

    generateSimulatedAlert(scenario, language) {
      const langLower = (language || "").toLowerCase();

      if (langLower.includes("japan") || langLower.includes("jp")) {
        return `[CELL BROADCAST / WEA]
【緊急警報】大災害発生：${scenario.name}。直ちに高台または指定避難所へ避難してください！

[EMERGENCY SIREN & RADIO SCRIPT (30 seconds)]
（警報音：EASサイレン音）
こちらは気象災害自動緊急放送です。${scenario.location}周辺において、${scenario.category}に伴う命の危険が迫っています。最大瞬間風速${scenario.telemetry.windGust}km/h、猛烈な暴風雨と高潮が予想されます。沿岸部および低地にお住まいの方は、命を守るため直ちに頑丈な建物の上階または指定避難所へ垂直避難してください！

[CIVIC ACTION CHECKLIST]
1. 海岸、河川、急傾斜地から今すぐ離れてください。
2. ガスの元栓を締め、ブレーカーを落として避難してください。
3. エレベーターを使用せず、非常持ち出し袋を携行してください。`;
      }

      if (langLower.includes("span") || langLower.includes("es")) {
        return `[CELL BROADCAST / WEA]
ALERTA EXTREMA: ${scenario.name}. ¡EVACUACIÓN INMEDIATA OBLIGATORIA EN ${scenario.location.toUpperCase()}!

[EMERGENCY SIREN & RADIO SCRIPT (30 seconds)]
(TONO DE ALERTA EAS)
Atención: Esta es una transmisión de emergencia automatizada. Una amenaza meteorológica crítica por ${scenario.category} está impactando ${scenario.location}. Vientos destructivos de ${scenario.telemetry.windGust} km/h y marejadas mortales son inminentes. Si se encuentra en zona de peligro, evacúe inmediatamente hacia refugios oficiales autorizados. ¡Proteja su vida ahora!

[CIVIC ACTION CHECKLIST]
1. Diríjase de inmediato a refugios fortificados tierra adentro.
2. No cruce carreteras o puentes cubiertos por corrientes de agua.
3. Desconecte el suministro eléctrico y cierre las válvulas de gas.`;
      }

      if (langLower.includes("tagalog") || langLower.includes("filipino")) {
        return `[CELL BROADCAST / WEA]
MATINDING BABALA: ${scenario.name}! LUMIKAS AGAD SA MATAAS NA LUGAR O EVACUATION CENTER!

[EMERGENCY SIREN & RADIO SCRIPT (30 seconds)]
(TUNOG NG SIRENA EAS)
Mensahe ng Kagipitan mula sa AegisVortex Alert System: Ang inyong lugar sa ${scenario.location} ay nasa ilalim ng matinding banta dulot ng ${scenario.category}. Inaasahan ang matinding ragasa ng tubig-baha at hanging aabot sa ${scenario.telemetry.windGust} km/h. Lahat ng residente sa tabing-ilog at mabababang lugar ay inuutusang lumikas agad. Huwag nang mag-atubili!

[CIVIC ACTION CHECKLIST]
1. Lumikas agad sa pinakamalapit na ligtas na evacuation center.
2. Patayin ang main switch ng kuryente at tangke ng gas bago umalis.
3. Dalhin ang emergency go-bag na may tubig, gamot, at flashlight.`;
      }

      if (langLower.includes("hindi")) {
        return `[CELL BROADCAST / WEA]
आपातकालीन चेतावनी: ${scenario.name}! तुरंत सुरक्षित आश्रय या ऊंचे स्थानों पर जाएं!

[EMERGENCY SIREN & RADIO SCRIPT (30 seconds)]
(ईएएस सायरन टोन)
यह मौसम आपदा स्वचालित आपातकालीन प्रसारण है। ${scenario.location} में ${scenario.category} के कारण गंभीर खतरा उत्पन्न हो गया है। हवा की गति ${scenario.telemetry.windGust} किमी/घंटा और भारी जलभराव की चेतावनी है। सभी नागरिक तुरंत नजदीकी राहत शिविर में पहुंचें। अपनी जान की रक्षा करें!

[CIVIC ACTION CHECKLIST]
1. निचले इलाकों और नदियों के तट से तुरंत दूर हटें।
2. बिजली का मुख्य स्विच और गैस सिलेंडर तुरंत बंद करें।
3. आपातकालीन किट (दवाइयां, पानी, टॉर्च) साथ लेकर चलें।`;
      }

      return `[CELL BROADCAST / WEA (Max 90 chars)]
EMERGENCY ALERT: ${scenario.name}. CAT-5 CONDITIONS IMMINENT. MANDATORY EVACUATION NOW!

[EMERGENCY SIREN & RADIO SCRIPT (30 seconds)]
(EAS ATTENTION SIGNAL SOUNDS)
"This is an urgent civil emergency broadcast transmitted by the AegisVortex Automated Alert Agent. Extreme life-threatening conditions from ${scenario.category} are now impacting the ${scenario.location} area. Sustained violent winds exceeding ${scenario.telemetry.windSpeed} km/h with gusts over ${scenario.telemetry.windGust} km/h and catastrophic flooding are occurring. If you are in designated low-lying or exposed zones, execute immediate evacuation to reinforced shelters now. Do not wait. Your life is in immediate peril."

[CIVIC ACTION CHECKLIST]
1. Evacuate immediately to designated reinforced community shelters.
2. Avoid all coastal highways, bridges, and subterranean transit centers.
3. Shut off residential natural gas mains and central electrical breakers.`;
    }

    generateSimulatedCopilotResponse(question, scenario) {
      const q = question.toLowerCase();

      if (q.includes("shelter") || q.includes("safe") || q.includes("where to go")) {
        const openShelters = scenario.shelters.filter(s => s.status.includes("OPEN"));
        const shelterList = openShelters
          .map(s => `• **${s.name}**: Status ${s.status} (Current Capacity: ${s.capacity})`)
          .join("\n");

        return `Operational Shelter Briefing for **${scenario.name}**:\n\nThe following verified disaster-hardened safe sanctuaries are currently actively receiving evacuees:\n\n${shelterList}\n\n**Key Directive**: If traveling by vehicle, use authorized ingress routes only. Bring essential identification, required medication, and emergency food rations. All shelters have backup diesel generators and trauma first-aid stations.`;
      }

      if (q.includes("road") || q.includes("route") || q.includes("highway") || q.includes("drive") || q.includes("traffic")) {
        const routesList = scenario.evacRoutes
          .map(r => `• **${r.name}**: ${r.status}`)
          .join("\n");

        return `Current Evacuation Corridor Telemetry:\n\n${routesList}\n\n**CRITICAL ADVISORY**: Do not attempt to drive through moving water of any depth. Flash floods and storm surges can undermine bridge footings within minutes. Emergency vehicles have contraflow right-of-way.`;
      }

      if (q.includes("window") || q.includes("glass") || q.includes("high-rise") || q.includes("apartment")) {
        return `High-Rise & Structural Shelter Safety:\n\n1. **Move Down & Away**: Wind speeds increase significantly with altitude. If you are above the 10th floor, move down to floors 3–6 in an interior, windowless stairwell or hallway.\n2. **Stay Clear of Glass**: Severe atmospheric pressure fluctuations and airborne debris cause catastrophic window implosions.\n3. **Do Not Use Elevators**: Power grid disruptions will trigger immediate entrapment in elevator shafts.`;
      }

      return `Incident Commander AI Analysis for **${scenario.name}**:\n\nTelemetry confirms ${scenario.hazards[0]}. Barometric pressure is holding at **${scenario.telemetry.pressure} hPa** with sustained winds of **${scenario.telemetry.windSpeed} km/h**.\n\nRecommended tactical priority: Enforce immediate mandatory evacuation within the **${scenario.telemetry.evacRadius} km** danger perimeter. Priority search & rescue staging is operational. Keep monitoring live Doppler radar sweeps for eyewall boundary drift.`;
    }
  }

  // =========================================================================
  // 3. DOPPLER WEATHER RADAR CANVAS ENGINE
  // =========================================================================
  class DopplerRadar {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.angle = 0;
      this.sweepSpeed = 0.035;
      this.particles = [];
      this.showReflectivity = true;
      this.showRangeRings = true;
      this.showWindVectors = true;
      this.currentScenario = null;
      this.animationFrameId = null;

      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.initParticles();
      this.startLoop();
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width || 480;
      this.height = rect.height || 380;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.maxRadius = Math.min(this.width, this.height) * 0.45;
    }

    initParticles() {
      this.particles = [];
      const count = 120;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          r: Math.random() * (this.maxRadius || 160),
          theta: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.04,
          size: 1 + Math.random() * 2.5,
          alpha: 0.2 + Math.random() * 0.7
        });
      }
    }

    setScenario(scenario) {
      this.currentScenario = scenario;
    }

    startLoop() {
      const render = () => {
        this.draw();
        this.animationFrameId = requestAnimationFrame(render);
      };
      render();
    }

    draw() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const cx = this.centerX;
      const cy = this.centerY;
      const maxR = this.maxRadius;

      ctx.fillStyle = "#070b13";
      ctx.fillRect(0, 0, w, h);

      this.drawGrid(ctx, w, h);

      if (this.showRangeRings) {
        this.drawRangeRings(ctx, cx, cy, maxR);
      }

      if (this.showReflectivity && this.currentScenario) {
        this.drawStormPrecipitation(ctx, cx, cy, maxR);
      }

      if (this.showWindVectors) {
        this.drawCirculationParticles(ctx, cx, cy);
      }

      this.drawSweepBeam(ctx, cx, cy, maxR);
      this.drawCrosshairs(ctx, cx, cy, maxR);

      this.angle = (this.angle + this.sweepSpeed) % (Math.PI * 2);
    }

    drawGrid(ctx, w, h) {
      ctx.save();
      ctx.strokeStyle = "rgba(14, 165, 233, 0.07)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawRangeRings(ctx, cx, cy, maxR) {
      ctx.save();
      const rings = [0.25, 0.5, 0.75, 1.0];
      const distances = ["75 km", "150 km", "225 km", "300 km"];

      rings.forEach((ratio, i) => {
        const r = maxR * ratio;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = i === 3 ? "rgba(6, 182, 212, 0.5)" : "rgba(6, 182, 212, 0.18)";
        ctx.lineWidth = i === 3 ? 1.5 : 1;
        if (i % 2 === 1) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();

        ctx.font = "9px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
        ctx.fillText(distances[i], cx + 5, cy - r + 12);
      });

      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (maxR * 0.95);
        const y1 = cy + Math.sin(rad) * (maxR * 0.95);
        const x2 = cx + Math.cos(rad) * maxR;
        const y2 = cy + Math.sin(rad) * maxR;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.stroke();
      }
      ctx.restore();
    }

    drawStormPrecipitation(ctx, cx, cy, maxR) {
      ctx.save();
      const sc = this.currentScenario;
      const type = sc.type;

      if (type === "tropical_cyclone" || type === "hurricane") {
        const arms = 3;
        const eyeR = 26;

        const eyeGrad = ctx.createRadialGradient(cx, cy, eyeR * 0.7, cx, cy, eyeR * 2.2);
        eyeGrad.addColorStop(0, "rgba(225, 29, 72, 0.95)");
        eyeGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.85)");
        eyeGrad.addColorStop(0.8, "rgba(245, 158, 11, 0.6)");
        eyeGrad.addColorStop(1, "rgba(16, 185, 129, 0.0)");

        ctx.fillStyle = eyeGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, eyeR * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#070b13";
        ctx.beginPath();
        ctx.arc(cx, cy, eyeR * 0.65, 0, Math.PI * 2);
        ctx.fill();

        for (let a = 0; a < arms; a++) {
          const armOffset = (a * (Math.PI * 2)) / arms + (this.angle * 0.1);
          for (let t = 0; t < 1.4; t += 0.04) {
            const r = eyeR + t * (maxR * 0.75);
            const theta = armOffset + t * 4.2;
            const px = cx + Math.cos(theta) * r;
            const py = cy + Math.sin(theta) * r;

            const blobR = 12 + t * 18;
            const grad = ctx.createRadialGradient(px, py, 1, px, py, blobR);
            if (t < 0.3) {
              grad.addColorStop(0, "rgba(244, 63, 94, 0.65)");
              grad.addColorStop(1, "rgba(244, 63, 94, 0)");
            } else if (t < 0.7) {
              grad.addColorStop(0, "rgba(234, 179, 8, 0.5)");
              grad.addColorStop(1, "rgba(234, 179, 8, 0)");
            } else {
              grad.addColorStop(0, "rgba(16, 185, 129, 0.4)");
              grad.addColorStop(1, "rgba(16, 185, 129, 0)");
            }
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, blobR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (type === "tornado") {
        const hookCx = cx + 25;
        const hookCy = cy - 20;

        const debrisGrad = ctx.createRadialGradient(hookCx, hookCy, 2, hookCx, hookCy, 35);
        debrisGrad.addColorStop(0, "rgba(217, 70, 239, 0.95)");
        debrisGrad.addColorStop(0.4, "rgba(239, 68, 68, 0.9)");
        debrisGrad.addColorStop(0.8, "rgba(245, 158, 11, 0.5)");
        debrisGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.fillStyle = debrisGrad;
        ctx.beginPath();
        ctx.arc(hookCx, hookCy, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(hookCx - 10, hookCy - 10, 50, 0.2 * Math.PI, 1.2 * Math.PI);
        ctx.stroke();

        const rfdGrad = ctx.createRadialGradient(cx - 30, cy + 40, 5, cx - 30, cy + 40, 80);
        rfdGrad.addColorStop(0, "rgba(239, 68, 68, 0.7)");
        rfdGrad.addColorStop(0.6, "rgba(34, 197, 94, 0.5)");
        rfdGrad.addColorStop(1, "rgba(14, 165, 233, 0)");
        ctx.fillStyle = rfdGrad;
        ctx.beginPath();
        ctx.arc(cx - 30, cy + 40, 80, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === "flood") {
        for (let i = 0; i < 5; i++) {
          const offsetAng = (i * Math.PI * 0.4) + (this.angle * 0.05);
          const cellR = 40 + i * 25;
          const cellX = cx + Math.cos(offsetAng) * cellR;
          const cellY = cy + Math.sin(offsetAng) * cellR * 0.7;

          const floodGrad = ctx.createRadialGradient(cellX, cellY, 5, cellX, cellY, 65);
          floodGrad.addColorStop(0, "rgba(14, 165, 233, 0.85)");
          floodGrad.addColorStop(0.4, "rgba(16, 185, 129, 0.7)");
          floodGrad.addColorStop(0.7, "rgba(234, 179, 8, 0.5)");
          floodGrad.addColorStop(1, "rgba(14, 165, 233, 0)");

          ctx.fillStyle = floodGrad;
          ctx.beginPath();
          ctx.arc(cellX, cellY, 65, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === "wildfire") {
        const fireX = cx - 50;
        const fireY = cy + 40;
        for (let i = 0; i < 6; i++) {
          const plumeX = fireX + (i * 35);
          const plumeY = fireY - (i * 28);
          const plumeSize = 25 + i * 14;

          const fireGrad = ctx.createRadialGradient(plumeX, plumeY, 2, plumeX, plumeY, plumeSize);
          if (i === 0) {
            fireGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)");
            fireGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.7)");
          } else {
            fireGrad.addColorStop(0, "rgba(249, 115, 22, 0.75)");
            fireGrad.addColorStop(0.6, "rgba(100, 116, 139, 0.5)");
          }
          fireGrad.addColorStop(1, "rgba(15, 23, 42, 0)");

          ctx.fillStyle = fireGrad;
          ctx.beginPath();
          ctx.arc(plumeX, plumeY, plumeSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    drawCirculationParticles(ctx, cx, cy) {
      ctx.save();
      this.particles.forEach(p => {
        p.theta += p.speed;
        const px = cx + Math.cos(p.theta) * p.r;
        const py = cy + Math.sin(p.theta) * p.r;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.75})`;
        ctx.fill();
      });
      ctx.restore();
    }

    drawSweepBeam(ctx, cx, cy, maxR) {
      ctx.save();
      const sectorAngle = 0.55;
      const startAngle = this.angle - sectorAngle;
      const endAngle = this.angle;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, "rgba(6, 182, 212, 0.45)");
      grad.addColorStop(0.7, "rgba(6, 182, 212, 0.25)");
      grad.addColorStop(1, "rgba(6, 182, 212, 0.05)");

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(this.angle) * maxR, cy + Math.sin(this.angle) * maxR);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }

    drawCrosshairs(ctx, cx, cy, maxR) {
      ctx.save();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.font = "bold 11px 'Orbitron', monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "center";
      ctx.fillText("N 000°", cx, cy - maxR - 8);
      ctx.fillText("S 180°", cx, cy + maxR + 18);
      ctx.textAlign = "right";
      ctx.fillText("W 270°", cx - maxR - 8, cy + 4);
      ctx.textAlign = "left";
      ctx.fillText("E 090°", cx + maxR + 8, cy + 4);

      ctx.restore();
    }
  }

  // =========================================================================
  // 4. DISASTER CARTOGRAPHY ENGINE (LEAFLET)
  // =========================================================================
  class DisasterMap {
    constructor(containerId) {
      this.containerId = containerId;
      this.map = null;
      this.hazardCircle = null;
      this.epicenterMarker = null;
      this.shelterMarkers = [];
      this.initMap();
    }

    initMap() {
      if (typeof L === "undefined") return;
      const el = document.getElementById(this.containerId);
      if (!el) return;

      this.map = L.map(this.containerId, {
        zoomControl: true,
        attributionControl: false
      }).setView([35.6762, 139.6503], 9);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_3rvv_1_29b2c998bb133ba94832902c", {
        maxZoom: 19,
        subdomains: "abcd",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(this.map);
    }

    updateScenario(scenario) {
      if (!this.map || typeof L === "undefined") return;
      const [lat, lng] = scenario.coords;

      this.map.flyTo([lat, lng], scenario.type === "tornado" ? 11 : 9, {
        animate: true,
        duration: 1.5
      });

      if (this.hazardCircle) this.map.removeLayer(this.hazardCircle);
      if (this.epicenterMarker) this.map.removeLayer(this.epicenterMarker);
      this.shelterMarkers.forEach(m => this.map.removeLayer(m));
      this.shelterMarkers = [];

      const radiusMeters = (scenario.telemetry.evacRadius || 100) * 1000;
      this.hazardCircle = L.circle([lat, lng], {
        radius: radiusMeters,
        color: scenario.color || "#ef4444",
        weight: 2,
        dashArray: "6, 8",
        fillColor: scenario.color || "#ef4444",
        fillOpacity: 0.12
      }).addTo(this.map);

      this.hazardCircle.bindTooltip(
        `<strong>MANDATORY EVACUATION ZONE</strong><br>Radius: ${scenario.telemetry.evacRadius} km<br>Threat: ${scenario.threatLabel}`,
        { permanent: false, direction: "top" }
      );

      const epicenterIcon = L.divIcon({
        className: "tactical-epicenter-marker",
        html: `
          <div class="epicenter-pulse-ring" style="border-color: ${scenario.color}"></div>
          <div class="epicenter-dot" style="background-color: ${scenario.color}"></div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      this.epicenterMarker = L.marker([lat, lng], { icon: epicenterIcon }).addTo(this.map);
      this.epicenterMarker.bindPopup(`
        <div class="map-popup-card">
          <h4 style="color: ${scenario.color}">${scenario.name}</h4>
          <div class="popup-sub">${scenario.category}</div>
          <p><strong>Wind Velocity:</strong> ${scenario.telemetry.windSpeed} km/h (Gusts: ${scenario.telemetry.windGust} km/h)</p>
          <p><strong>Central Pressure:</strong> ${scenario.telemetry.pressure} hPa</p>
          <p><strong>Primary Hazard:</strong> ${scenario.hazards[0]}</p>
        </div>
      `);

      if (scenario.shelters) {
        scenario.shelters.forEach(shelter => {
          const shelterIcon = L.divIcon({
            className: "tactical-shelter-marker",
            html: `<div class="shelter-pin ${shelter.status.includes('OPEN') ? 'status-open' : 'status-crowded'}">🛡️</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon }).addTo(this.map);
          marker.bindPopup(`
            <div class="map-popup-card">
              <h4>${shelter.name}</h4>
              <div class="popup-status-badge ${shelter.status.includes('OPEN') ? 'badge-open' : 'badge-warn'}">${shelter.status}</div>
              <p><strong>Capacity:</strong> ${shelter.capacity}</p>
              <p class="shelter-note">Reinforced structure with emergency power, water filtration, and trauma care.</p>
            </div>
          `);
          this.shelterMarkers.push(marker);
        });
      }
    }
  }

  // =========================================================================
  // 5. AUDIO EAS ENGINE & VOICE BROADCASTER
  // =========================================================================
  class EmergencyAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.isMuted = false;
      this.speechSynth = window.speechSynthesis || null;
      this.currentUtterance = null;
    }

    initAudioContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted && this.speechSynth && this.speechSynth.speaking) {
        this.speechSynth.cancel();
      }
      return this.isMuted;
    }

    playEASTones(durationMs = 1800) {
      if (this.isMuted) return;
      this.initAudioContext();
      if (!this.audioCtx) return;

      try {
        const now = this.audioCtx.currentTime;
        const duration = durationMs / 1000;

        const masterGain = this.audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.05);
        masterGain.gain.setValueAtTime(0.28, now + duration - 0.08);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        masterGain.connect(this.audioCtx.destination);

        const osc1 = this.audioCtx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(853, now);
        osc1.connect(masterGain);

        const osc2 = this.audioCtx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(960, now);
        osc2.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
      } catch (err) {
        console.warn("EAS audio error:", err);
      }
    }

    playSirenSound(durationSeconds = 4) {
      if (this.isMuted) return;
      this.initAudioContext();
      if (!this.audioCtx) return;

      try {
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sawtooth";
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.2);

        const cycles = Math.floor(durationSeconds / 1.2);
        for (let i = 0; i < cycles; i++) {
          const cycleStart = now + (i * 1.2);
          osc.frequency.setValueAtTime(450, cycleStart);
          osc.frequency.linearRampToValueAtTime(780, cycleStart + 0.6);
          osc.frequency.linearRampToValueAtTime(450, cycleStart + 1.2);
        }

        gain.gain.setValueAtTime(0.18, now + durationSeconds - 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + durationSeconds);
      } catch (err) {
        console.warn("Siren synthesis error:", err);
      }
    }

    speakAlert(text, onEndCallback) {
      if (this.isMuted || !this.speechSynth) return;
      this.speechSynth.cancel();

      const cleanText = text
        .replace(/[\*#\[\]_]/g, "")
        .replace(/\(.*?EAS.*?\)/gi, "")
        .trim();

      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance.rate = 1.05;
      this.currentUtterance.pitch = 0.95;
      this.currentUtterance.volume = 1.0;

      const voices = this.speechSynth.getVoices();
      if (voices.length > 0) {
        const preferred = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("David") || v.name.includes("Zira")));
        if (preferred) this.currentUtterance.voice = preferred;
      }

      if (onEndCallback) {
        this.currentUtterance.onend = onEndCallback;
        this.currentUtterance.onerror = onEndCallback;
      }

      this.speechSynth.speak(this.currentUtterance);
    }
  }

  // =========================================================================
  // 6. MASTER APP COORDINATOR
  // =========================================================================
  class AegisVortexApp {
    constructor() {
      this.currentScenarioId = "typhoon";
      this.currentScenario = DISASTER_SCENARIOS[this.currentScenarioId];
      this.currentLanguage = "English";

      this.agent = new GeminiDisasterAgent();
      this.audio = new EmergencyAudioEngine();
      this.radar = new DopplerRadar("radarCanvas");
      this.map = new DisasterMap("disasterMap");

      this.copilotHistory = [];
      this.lastBroadcastScript = "";

      this.initDOM();
      this.initEvents();
      this.startClocks();
      this.loadScenario(this.currentScenarioId);
      this.startTelemetryStream();
    }

    initDOM() {
      this.clockLocalEl = document.getElementById("clockLocal");
      this.clockUTCEl = document.getElementById("clockUTC");
      this.headerThreatTextEl = document.getElementById("headerThreatText");
      this.headerThreatBadgeEl = document.getElementById("headerThreatBadge");
      this.agentStatusTextEl = document.getElementById("agentStatusText");
      this.apiStatusBadgeEl = document.getElementById("apiStatusBadge");
      this.geminiModelLabelEl = document.getElementById("geminiModelLabel");
      this.agentSourcePillEl = document.getElementById("agentSourcePill");

      this.tickNameEl = document.getElementById("tickName");
      this.tickPressureEl = document.getElementById("tickPressure");
      this.tickWindEl = document.getElementById("tickWind");
      this.tickGustEl = document.getElementById("tickGust");
      this.tickPrecipEl = document.getElementById("tickPrecip");
      this.tickSurgeEl = document.getElementById("tickSurge");
      this.tickDbzEl = document.getElementById("tickDbz");
      this.tickEvacEl = document.getElementById("tickEvac");

      this.radarAzimuthEl = document.getElementById("radarAzimuth");
      this.radarMaxDbzEl = document.getElementById("radarMaxDbz");
      this.cardMovementEl = document.getElementById("cardMovement");
      this.cardSatTempEl = document.getElementById("cardSatTemp");
      this.cardEyeRadiusEl = document.getElementById("cardEyeRadius");

      this.sensorPressureEl = document.getElementById("sensorPressure");
      this.sensorSurgeEl = document.getElementById("sensorSurge");
      this.sensorWindEl = document.getElementById("sensorWind");
      this.sensorRadiusEl = document.getElementById("sensorRadius");

      this.triageOutputEl = document.getElementById("triageOutput");
      this.broadcastOutputEl = document.getElementById("broadcastOutput");
      this.selectBroadcastLangEl = document.getElementById("selectBroadcastLang");
      this.routesListContainerEl = document.getElementById("routesListContainer");
      this.sheltersListContainerEl = document.getElementById("sheltersListContainer");

      this.copilotMessagesEl = document.getElementById("copilotMessages");
      this.copilotFormEl = document.getElementById("copilotForm");
      this.copilotInputEl = document.getElementById("copilotInput");

      this.modalApiKey = document.getElementById("modalApiKey");
      this.modalMobileAlert = document.getElementById("modalMobileAlert");
      this.modalCustomDisaster = document.getElementById("modalCustomDisaster");
      this.modalDossier = document.getElementById("modalDossier");

      this.inputGeminiApiKey = document.getElementById("inputGeminiApiKey");
      this.selectGeminiModel = document.getElementById("selectGeminiModel");
      this.btnToggleKeyVisibility = document.getElementById("btnToggleKeyVisibility");

      this.updateApiStatusUI();
    }

    initEvents() {
      // Scenario Quick-Bar
      document.querySelectorAll(".scenario-btn[data-scenario]").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".scenario-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.loadScenario(btn.dataset.scenario);
        });
      });

      // Custom Disaster Injector
      document.getElementById("btnCustomDisaster").addEventListener("click", () => {
        this.openModal(this.modalCustomDisaster);
      });
      document.getElementById("btnCloseCustomModal").addEventListener("click", () => {
        this.closeModal(this.modalCustomDisaster);
      });
      document.getElementById("btnCancelCustom").addEventListener("click", () => {
        this.closeModal(this.modalCustomDisaster);
      });
      document.getElementById("btnDeployCustom").addEventListener("click", () => {
        this.deployCustomScenario();
      });

      // EAS Siren
      document.getElementById("btnTriggerEAS").addEventListener("click", () => {
        this.triggerEASAlert();
      });

      // Audio Mute
      document.getElementById("btnAudioMute").addEventListener("click", () => {
        const isMuted = this.audio.toggleMute();
        const icon = document.getElementById("audioMuteIcon");
        if (isMuted) {
          icon.className = "fa-solid fa-volume-xmark";
          icon.style.color = "#ef4444";
        } else {
          icon.className = "fa-solid fa-volume-high";
          icon.style.color = "";
        }
      });

      // Mobile Phone Alert
      document.getElementById("btnMobileAlert").addEventListener("click", () => {
        this.updateMobileLockscreen();
        this.openModal(this.modalMobileAlert);
      });
      document.getElementById("btnCloseMobileAlert").addEventListener("click", () => {
        this.closeModal(this.modalMobileAlert);
      });
      document.getElementById("btnPhoneSoundAlarm").addEventListener("click", () => {
        this.audio.playEASTones(2200);
      });

      // API Key Modal
      document.getElementById("btnOpenApiKeyModal").addEventListener("click", () => {
        this.inputGeminiApiKey.value = this.agent.getApiKey();
        this.selectGeminiModel.value = this.agent.model;
        this.openModal(this.modalApiKey);
      });
      document.getElementById("btnCloseApiKeyModal").addEventListener("click", () => {
        this.closeModal(this.modalApiKey);
      });
      document.getElementById("btnSaveApiKey").addEventListener("click", () => {
        this.saveApiKeySettings();
      });
      document.getElementById("btnClearApiKey").addEventListener("click", () => {
        this.agent.setApiKey("");
        this.inputGeminiApiKey.value = "";
        this.updateApiStatusUI();
        this.closeModal(this.modalApiKey);
      });
      this.btnToggleKeyVisibility.addEventListener("click", () => {
        if (this.inputGeminiApiKey.type === "password") {
          this.inputGeminiApiKey.type = "text";
          this.btnToggleKeyVisibility.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
          this.inputGeminiApiKey.type = "password";
          this.btnToggleKeyVisibility.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
      });

      // Re-Analyze Threat
      document.getElementById("btnReanalyze").addEventListener("click", () => {
        this.runAgentThreatTriage();
      });

      // Tabs Navigation
      document.querySelectorAll(".agent-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".agent-tab").forEach(t => t.classList.remove("active"));
          document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
          tab.classList.add("active");
          const paneId = `tabPane${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`;
          const targetPane = document.getElementById(paneId);
          if (targetPane) targetPane.classList.add("active");
        });
      });

      // Language Select
      this.selectBroadcastLangEl.addEventListener("change", (e) => {
        this.currentLanguage = e.target.value;
        this.runAgentBroadcastGeneration();
      });

      // Voice Broadcast
      document.getElementById("btnSpeakBroadcast").addEventListener("click", () => {
        this.speakActiveBroadcast();
      });

      // Radar Canvas Controls
      document.getElementById("toggleReflectivity").addEventListener("change", (e) => {
        this.radar.showReflectivity = e.target.checked;
      });
      document.getElementById("toggleRangeRings").addEventListener("change", (e) => {
        this.radar.showRangeRings = e.target.checked;
      });
      document.getElementById("toggleWindVectors").addEventListener("change", (e) => {
        this.radar.showWindVectors = e.target.checked;
      });

      // Copilot Form
      this.copilotFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = this.copilotInputEl.value.trim();
        if (!query) return;
        this.handleCopilotQuery(query);
        this.copilotInputEl.value = "";
      });

      // Copilot Quick Chips
      document.querySelectorAll(".chip-btn").forEach(chip => {
        chip.addEventListener("click", () => {
          this.handleCopilotQuery(chip.dataset.query);
        });
      });

      // Dossier Modal
      document.getElementById("btnExportDossier").addEventListener("click", () => {
        this.generateDossier();
        this.openModal(this.modalDossier);
      });
      document.getElementById("btnCloseDossierModal").addEventListener("click", () => {
        this.closeModal(this.modalDossier);
      });
      document.getElementById("btnPrintDossier").addEventListener("click", () => {
        window.print();
      });
      document.getElementById("btnCopyDossier").addEventListener("click", () => {
        const text = document.getElementById("dossierPrintArea").innerText;
        navigator.clipboard.writeText(text).then(() => {
          alert("Incident Situation Report (SITREP) copied to clipboard!");
        });
      });
    }

    startClocks() {
      const update = () => {
        const now = new Date();
        if (this.clockLocalEl) this.clockLocalEl.textContent = now.toLocaleTimeString();
        if (this.clockUTCEl) this.clockUTCEl.textContent = now.toISOString().slice(11, 19) + "Z";
        const phoneClockTime = document.getElementById("phoneClockTime");
        if (phoneClockTime) {
          phoneClockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      };
      update();
      setInterval(update, 1000);
    }

    loadScenario(scenarioId) {
      const sc = DISASTER_SCENARIOS[scenarioId] || DISASTER_SCENARIOS.typhoon;
      this.currentScenarioId = scenarioId;
      this.currentScenario = sc;

      this.headerThreatTextEl.textContent = sc.threatLabel;
      this.headerThreatBadgeEl.style.borderColor = sc.color;

      this.tickNameEl.textContent = sc.name;
      this.tickPressureEl.textContent = `${sc.telemetry.pressure} hPa`;
      this.tickWindEl.textContent = `${sc.telemetry.windSpeed} km/h`;
      this.tickGustEl.textContent = `${sc.telemetry.windGust} km/h`;
      this.tickPrecipEl.textContent = `${sc.telemetry.precipitationRate} mm/hr`;
      this.tickSurgeEl.textContent = `+${sc.telemetry.stormSurge} m`;
      this.tickDbzEl.textContent = `${sc.telemetry.radarReflectivity} dBZ`;
      this.tickEvacEl.textContent = `${sc.telemetry.evacRadius} km`;

      this.radar.setScenario(sc);
      this.radarMaxDbzEl.textContent = `${sc.telemetry.radarReflectivity}.2 dBZ`;
      this.cardMovementEl.textContent = sc.telemetry.movement;
      this.cardSatTempEl.textContent = `${sc.telemetry.satelliteTemp}°C (IR Top)`;
      this.cardEyeRadiusEl.textContent = `${Math.round(sc.telemetry.evacRadius * 0.22)} km (Core)`;

      this.sensorPressureEl.textContent = `${sc.telemetry.pressure} hPa`;
      this.sensorSurgeEl.textContent = `+${sc.telemetry.stormSurge.toFixed(2)} m`;
      this.sensorWindEl.textContent = `${sc.telemetry.windSpeed} km/h`;
      this.sensorRadiusEl.textContent = `${sc.telemetry.evacRadius} km`;

      this.map.updateScenario(sc);
      this.renderSheltersAndRoutes(sc);

      this.runAgentThreatTriage();
      this.runAgentBroadcastGeneration();
    }

    renderSheltersAndRoutes(sc) {
      this.routesListContainerEl.innerHTML = sc.evacRoutes.map(r => {
        const isClosed = r.status.includes("CLOSED") || r.status.includes("FLOODED") || r.status.includes("DANGEROUS");
        const isWarn = r.status.includes("HEAVY") || r.status.includes("RESTRICTED") || r.status.includes("WARNING");
        const statusClass = isClosed ? "closed" : (isWarn ? "warn" : "");
        return `
          <div class="route-item">
            <span class="route-name">${r.name}</span>
            <span class="route-status-badge ${statusClass}">${r.status}</span>
          </div>
        `;
      }).join("");

      this.sheltersListContainerEl.innerHTML = sc.shelters.map(s => {
        const isOpen = s.status.includes("OPEN");
        const statusClass = isOpen ? "route-status-badge" : "route-status-badge warn";
        return `
          <div class="shelter-item">
            <div>
              <div class="shelter-name">${s.name}</div>
              <small style="color: #64748b; font-family: monospace;">Capacity: ${s.capacity}</small>
            </div>
            <span class="${statusClass}">${s.status}</span>
          </div>
        `;
      }).join("");
    }

    async runAgentThreatTriage() {
      const spinner = document.getElementById("reanalyzeSpinner");
      if (spinner) spinner.classList.add("fa-spin");

      this.triageOutputEl.innerHTML = `
        <div class="loading-state">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <p>AegisVortex AI analyzing atmospheric telemetry and danger perimeters...</p>
        </div>
      `;

      try {
        const result = await this.agent.analyzeDisaster(this.currentScenario);
        this.agentSourcePillEl.textContent = result.source === "gemini-api" ? "GEMINI LIVE API" : "SIMULATION AGENT";
        this.agentSourcePillEl.style.color = result.source === "gemini-api" ? "var(--color-cyan)" : "var(--color-emerald)";

        if (window.marked) {
          this.triageOutputEl.innerHTML = window.marked.parse(result.content);
        } else {
          this.triageOutputEl.innerHTML = `<pre>${result.content}</pre>`;
        }
      } catch (err) {
        this.triageOutputEl.innerHTML = `<div style="color: #ef4444;">Error assessing threat: ${err.message}</div>`;
      } finally {
        if (spinner) spinner.classList.remove("fa-spin");
      }
    }

    async runAgentBroadcastGeneration() {
      this.broadcastOutputEl.innerHTML = `
        <div class="loading-state">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <p>Generating localized EAS scripts in ${this.currentLanguage}...</p>
        </div>
      `;

      try {
        const result = await this.agent.generateMultiLingualAlert(this.currentScenario, this.currentLanguage);
        if (window.marked) {
          this.broadcastOutputEl.innerHTML = window.marked.parse(result.content);
        } else {
          this.broadcastOutputEl.innerHTML = `<pre>${result.content}</pre>`;
        }
        this.lastBroadcastScript = result.content;
      } catch (err) {
        this.broadcastOutputEl.innerHTML = `<div style="color: #ef4444;">Broadcast generation error: ${err.message}</div>`;
      }
    }

    speakActiveBroadcast() {
      this.audio.playEASTones(1600);
      setTimeout(() => {
        const script = this.lastBroadcastScript || `${this.currentScenario.name}. Mandatory evacuation ordered.`;
        this.audio.speakAlert(script);
      }, 1700);
    }

    triggerEASAlert() {
      this.audio.playEASTones(2000);
      setTimeout(() => {
        this.audio.playSirenSound(3);
      }, 2100);
    }

    async handleCopilotQuery(question) {
      this.appendCopilotMessage("user", question);

      const typingId = "typing-" + Date.now();
      const typingEl = document.createElement("div");
      typingEl.className = "chat-msg msg-agent";
      typingEl.id = typingId;
      typingEl.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">
          <strong>AegisVortex Incident Copilot</strong>
          <p><i class="fa-solid fa-circle-notch fa-spin"></i> Synthesizing tactical assessment...</p>
        </div>
      `;
      this.copilotMessagesEl.appendChild(typingEl);
      this.copilotMessagesEl.scrollTop = this.copilotMessagesEl.scrollHeight;

      try {
        const response = await this.agent.askCopilot(question, this.currentScenario, this.copilotHistory);
        const typingNode = document.getElementById(typingId);
        if (typingNode) typingNode.remove();

        this.appendCopilotMessage("agent", response.content);
        this.copilotHistory.push({ role: "user", text: question });
        this.copilotHistory.push({ role: "assistant", text: response.content });
      } catch (err) {
        const typingNode = document.getElementById(typingId);
        if (typingNode) typingNode.remove();
        this.appendCopilotMessage("agent", `Tactical query failed: ${err.message}`);
      }
    }

    appendCopilotMessage(sender, text) {
      const msgEl = document.createElement("div");
      msgEl.className = `chat-msg msg-${sender}`;
      const icon = sender === "agent" ? "fa-robot" : "fa-user";
      const title = sender === "agent" ? "AegisVortex Incident Copilot" : "Incident Commander";

      let formattedText = text;
      if (window.marked) {
        formattedText = window.marked.parse(text);
      } else {
        formattedText = `<p>${text}</p>`;
      }

      msgEl.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid ${icon}"></i></div>
        <div class="msg-bubble">
          <strong>${title}</strong>
          ${formattedText}
        </div>
      `;

      this.copilotMessagesEl.appendChild(msgEl);
      this.copilotMessagesEl.scrollTop = this.copilotMessagesEl.scrollHeight;
    }

    updateMobileLockscreen() {
      const sc = this.currentScenario;
      const phoneEasTitle = document.getElementById("phoneEasTitle");
      const phoneEasBody = document.getElementById("phoneEasBody");

      if (phoneEasTitle) {
        phoneEasTitle.textContent = `CRITICAL WEATHER EMERGENCY: ${sc.threatLabel}`;
      }
      if (phoneEasBody) {
        phoneEasBody.textContent = `MANDATORY EVACUATION ORDERED: ${sc.name} (${sc.category}) in ${sc.location}. Severe hazard: ${sc.hazards[0]}. Maximum gusts: ${sc.telemetry.windGust} km/h. Evacuate to reinforced shelters immediately!`;
      }
    }

    deployCustomScenario() {
      const name = document.getElementById("customName").value || "Custom Meteorological Anomaly";
      const type = document.getElementById("customType").value;
      const location = document.getElementById("customLocation").value || "Custom Sector";
      const threatLevel = parseInt(document.getElementById("customThreatLevel").value, 10);
      const lat = parseFloat(document.getElementById("customLat").value) || 0;
      const lng = parseFloat(document.getElementById("customLng").value) || 0;
      const wind = parseInt(document.getElementById("customWind").value, 10) || 200;
      const pressure = parseInt(document.getElementById("customPressure").value, 10) || 940;

      const customScenario = {
        id: "custom_" + Date.now(),
        name: name,
        category: `${type.toUpperCase()} HAZARD`,
        type: type,
        location: location,
        coords: [lat, lng],
        threatLevel: threatLevel,
        threatLabel: threatLevel === 5 ? "CATASTROPHIC - LEVEL 5" : `CRITICAL - LEVEL ${threatLevel}`,
        color: threatLevel === 5 ? "#ef4444" : "#f59e0b",
        telemetry: {
          pressure: pressure,
          windSpeed: wind,
          windGust: Math.round(wind * 1.25),
          precipitationRate: 110,
          stormSurge: 3.5,
          satelliteTemp: -75,
          radarReflectivity: 66,
          movement: "Tracking North at 25 km/h",
          evacRadius: 120
        },
        hazards: [
          "Dangerous extreme wind shear exceeding structural design limits",
          "Flash inundation and debris flows in low elevation areas",
          "Widespread power distribution collapse"
        ],
        shelters: [
          { name: `${location} Civic Safehouse Alpha`, lat: lat + 0.05, lng: lng + 0.05, capacity: "4,000 / 5,000", status: "OPEN" },
          { name: `${location} Regional Stadium Sanctuary`, lat: lat - 0.04, lng: lng - 0.03, capacity: "7,500 / 10,000", status: "OPEN" }
        ],
        evacRoutes: [
          { name: "Primary Northward Evacuation Route", status: "CLEAR" },
          { name: "Secondary Coastal Bypass", status: "FLOOD DANGER - CLOSED" }
        ]
      };

      DISASTER_SCENARIOS[customScenario.id] = customScenario;
      this.closeModal(this.modalCustomDisaster);
      this.loadScenario(customScenario.id);
      this.audio.playEASTones(1400);
    }

    saveApiKeySettings() {
      const key = this.inputGeminiApiKey.value.trim();
      const model = this.selectGeminiModel.value;

      this.agent.setApiKey(key);
      this.agent.setModel(model);

      this.updateApiStatusUI();
      this.closeModal(this.modalApiKey);
      this.runAgentThreatTriage();
    }

    updateApiStatusUI() {
      const hasKey = this.agent.hasApiKey();
      this.geminiModelLabelEl.textContent = `MODEL: ${this.agent.model}`;

      if (hasKey) {
        this.apiStatusBadgeEl.textContent = "CONNECTED";
        this.apiStatusBadgeEl.className = "api-status-badge status-connected";
      } else {
        this.apiStatusBadgeEl.textContent = "MOCK SIMULATION";
        this.apiStatusBadgeEl.className = "api-status-badge";
      }
    }

    generateDossier() {
      const sc = this.currentScenario;
      const now = new Date();

      document.getElementById("dossierMeta").textContent = `INCIDENT BRIEFING ID: AEGIS-${Date.now().toString().slice(-6)} | GENERATED: ${now.toUTCString()} | THREAT: ${sc.threatLabel}`;

      document.getElementById("dossierTelemetryTable").innerHTML = `
        <div><strong>Disaster:</strong> ${sc.name}</div>
        <div><strong>Category:</strong> ${sc.category}</div>
        <div><strong>Location:</strong> ${sc.location}</div>
        <div><strong>Pressure:</strong> ${sc.telemetry.pressure} hPa</div>
        <div><strong>Sustained Wind:</strong> ${sc.telemetry.windSpeed} km/h</div>
        <div><strong>Peak Gusts:</strong> ${sc.telemetry.windGust} km/h</div>
        <div><strong>Precipitation:</strong> ${sc.telemetry.precipitationRate} mm/hr</div>
        <div><strong>Storm Surge:</strong> ${sc.telemetry.stormSurge} m</div>
        <div><strong>Evacuation Radius:</strong> ${sc.telemetry.evacRadius} km</div>
      `;

      document.getElementById("dossierTriageContent").innerHTML = this.triageOutputEl.innerHTML;
      document.getElementById("dossierBroadcastContent").innerHTML = this.broadcastOutputEl.innerHTML;
    }

    startTelemetryStream() {
      setInterval(() => {
        if (!this.currentScenario) return;
        const sc = this.currentScenario;
        const windJitter = (Math.random() * 4 - 2).toFixed(0);
        const currentWind = sc.telemetry.windSpeed + parseInt(windJitter, 10);
        this.sensorWindEl.textContent = `${currentWind} km/h`;
        this.tickWindEl.textContent = `${currentWind} km/h`;

        const azimuthDeg = Math.floor(Math.random() * 360);
        if (this.radarAzimuthEl) {
          this.radarAzimuthEl.textContent = `${String(azimuthDeg).padStart(3, "0")}°`;
        }
      }, 2800);
    }

    openModal(modalEl) {
      if (modalEl) modalEl.classList.add("open");
    }

    closeModal(modalEl) {
      if (modalEl) modalEl.classList.remove("open");
    }
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.aegisApp = new AegisVortexApp();
    });
  } else {
    window.aegisApp = new AegisVortexApp();
  }
})();
