// Google Gemini API Client & Autonomous Disaster Intelligence Agent

const DEFAULT_MODEL = "gemini-1.5-flash";
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export class GeminiDisasterAgent {
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

  /**
   * Performs an autonomous disaster threat assessment and triage calculation.
   */
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
        console.warn("Gemini API call failed, falling back to built-in simulation agent:", err);
      }
    }

    // High-Fidelity Autonomous Agent Simulation Fallback
    return {
      source: "autonomous-agent-simulation",
      content: this.generateSimulatedAnalysis(scenario)
    };
  }

  /**
   * Generates localized emergency alert broadcasts in various languages.
   */
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

  /**
   * Interactive Disaster Copilot assistant.
   */
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

  /**
   * Internal REST fetch to Google Gemini API
   */
  async callGemini(promptText) {
    const url = `${API_BASE_URL}/${this.model}:generateContent?key=${this.apiKey}`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1400
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Gemini API error ${res.status}: ${errorData.error?.message || res.statusText}`
      );
    }

    const data = await res.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) {
      throw new Error("No response content received from Gemini model.");
    }

    return textOutput;
  }

  /**
   * High-fidelity fallbacks when user hasn't configured an API key yet
   */
  generateSimulatedAnalysis(scenario) {
    if (scenario.id === "typhoon") {
      return `### 1. EXECUTIVE THREAT INDEX & SEVERITY
- **Threat Level**: Level 5 (Catastrophic) — Central barometric pressure has plummeted to **${scenario.telemetry.pressure} hPa** with sustained eyewall winds of **${scenario.telemetry.windSpeed} km/h**.
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
- **Life-Peril Horizon**: Tropical storm-force winds already arriving; eyewall landfall projected within **2.5 hours**.
- **Estimated Population Exposed**: **2.8 Million citizens** across Miami-Dade, Broward, and Monroe barrier islands.

### 2. PRIMARY CASUALTY & INFRASTRUCTURE HAZARDS
- **Catastrophic 4.2m Storm Surge**: Barrier island causeways are already underwater or at risk of structural collapse.
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

    // Default generic emergency response for other scenarios
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

    // Default English
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
