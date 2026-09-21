// AegisVortex AI - Master Application Controller & Orchestration

import { DISASTER_SCENARIOS } from "./scenarios.js";
import { GeminiDisasterAgent } from "./gemini.js";
import { DopplerRadar } from "./radar.js";
import { DisasterMap } from "./map.js";
import { EmergencyAudioEngine } from "./audio.js";

class AegisVortexApp {
  constructor() {
    this.currentScenarioId = "typhoon";
    this.currentScenario = DISASTER_SCENARIOS[this.currentScenarioId];
    this.currentLanguage = "English";

    // Initialize sub-systems
    this.agent = new GeminiDisasterAgent();
    this.audio = new EmergencyAudioEngine();
    this.radar = new DopplerRadar("radarCanvas");
    this.map = new DisasterMap("disasterMap");

    this.telemetryInterval = null;
    this.clockInterval = null;
    this.copilotHistory = [];

    this.initDOM();
    this.initEvents();
    this.startClocks();
    this.loadScenario(this.currentScenarioId);
    this.startTelemetryStream();
  }

  initDOM() {
    // Top Bar & Clocks
    this.clockLocalEl = document.getElementById("clockLocal");
    this.clockUTCEl = document.getElementById("clockUTC");
    this.headerThreatTextEl = document.getElementById("headerThreatText");
    this.headerThreatBadgeEl = document.getElementById("headerThreatBadge");
    this.agentStatusTextEl = document.getElementById("agentStatusText");
    this.apiStatusBadgeEl = document.getElementById("apiStatusBadge");
    this.geminiModelLabelEl = document.getElementById("geminiModelLabel");
    this.agentSourcePillEl = document.getElementById("agentSourcePill");

    // Ticker Elements
    this.tickNameEl = document.getElementById("tickName");
    this.tickPressureEl = document.getElementById("tickPressure");
    this.tickWindEl = document.getElementById("tickWind");
    this.tickGustEl = document.getElementById("tickGust");
    this.tickPrecipEl = document.getElementById("tickPrecip");
    this.tickSurgeEl = document.getElementById("tickSurge");
    this.tickDbzEl = document.getElementById("tickDbz");
    this.tickEvacEl = document.getElementById("tickEvac");

    // Radar Overlay Stats
    this.radarAzimuthEl = document.getElementById("radarAzimuth");
    this.radarMaxDbzEl = document.getElementById("radarMaxDbz");
    this.cardMovementEl = document.getElementById("cardMovement");
    this.cardSatTempEl = document.getElementById("cardSatTemp");
    this.cardEyeRadiusEl = document.getElementById("cardEyeRadius");

    // Center Map Sensors
    this.sensorPressureEl = document.getElementById("sensorPressure");
    this.sensorSurgeEl = document.getElementById("sensorSurge");
    this.sensorWindEl = document.getElementById("sensorWind");
    this.sensorRadiusEl = document.getElementById("sensorRadius");

    // Right AI Panel
    this.triageOutputEl = document.getElementById("triageOutput");
    this.broadcastOutputEl = document.getElementById("broadcastOutput");
    this.selectBroadcastLangEl = document.getElementById("selectBroadcastLang");
    this.routesListContainerEl = document.getElementById("routesListContainer");
    this.sheltersListContainerEl = document.getElementById("sheltersListContainer");

    // Copilot
    this.copilotMessagesEl = document.getElementById("copilotMessages");
    this.copilotFormEl = document.getElementById("copilotForm");
    this.copilotInputEl = document.getElementById("copilotInput");

    // Modals
    this.modalApiKey = document.getElementById("modalApiKey");
    this.modalMobileAlert = document.getElementById("modalMobileAlert");
    this.modalCustomDisaster = document.getElementById("modalCustomDisaster");
    this.modalDossier = document.getElementById("modalDossier");

    // API Key inputs
    this.inputGeminiApiKey = document.getElementById("inputGeminiApiKey");
    this.selectGeminiModel = document.getElementById("selectGeminiModel");
    this.btnToggleKeyVisibility = document.getElementById("btnToggleKeyVisibility");

    this.updateApiStatusUI();
  }

  initEvents() {
    // Scenario Quick-Bar Buttons
    document.querySelectorAll(".scenario-btn[data-scenario]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".scenario-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.loadScenario(btn.dataset.scenario);
      });
    });

    // Custom Disaster Trigger
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

    // EAS Siren & Audio Alarm Button
    document.getElementById("btnTriggerEAS").addEventListener("click", () => {
      this.triggerEASAlert();
    });

    // Audio Mute Button
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

    // Mobile Phone Alert Preview
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

    // Re-Analyze Threat Button
    document.getElementById("btnReanalyze").addEventListener("click", () => {
      this.runAgentThreatTriage();
    });

    // Agent Tabs
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

    // Multi-Lingual Broadcast Language Select
    this.selectBroadcastLangEl.addEventListener("change", (e) => {
      this.currentLanguage = e.target.value;
      this.runAgentBroadcastGeneration();
    });

    // Voice Broadcast Button
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
        const query = chip.dataset.query;
        this.handleCopilotQuery(query);
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
      if (this.clockLocalEl) {
        this.clockLocalEl.textContent = now.toLocaleTimeString();
      }
      if (this.clockUTCEl) {
        this.clockUTCEl.textContent = now.toISOString().slice(11, 19) + "Z";
      }

      // Update phone clock if visible
      const phoneClockTime = document.getElementById("phoneClockTime");
      if (phoneClockTime) {
        phoneClockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  loadScenario(scenarioId) {
    const sc = DISASTER_SCENARIOS[scenarioId] || DISASTER_SCENARIOS.typhoon;
    this.currentScenarioId = scenarioId;
    this.currentScenario = sc;

    // Update Header
    this.headerThreatTextEl.textContent = sc.threatLabel;
    this.headerThreatBadgeEl.style.borderColor = sc.color;

    // Update Ticker
    this.tickNameEl.textContent = sc.name;
    this.tickPressureEl.textContent = `${sc.telemetry.pressure} hPa`;
    this.tickWindEl.textContent = `${sc.telemetry.windSpeed} km/h`;
    this.tickGustEl.textContent = `${sc.telemetry.windGust} km/h`;
    this.tickPrecipEl.textContent = `${sc.telemetry.precipitationRate} mm/hr`;
    this.tickSurgeEl.textContent = `+${sc.telemetry.stormSurge} m`;
    this.tickDbzEl.textContent = `${sc.telemetry.radarReflectivity} dBZ`;
    this.tickEvacEl.textContent = `${sc.telemetry.evacRadius} km`;

    // Update Radar
    this.radar.setScenario(sc);
    this.radarMaxDbzEl.textContent = `${sc.telemetry.radarReflectivity}.2 dBZ`;
    this.cardMovementEl.textContent = sc.telemetry.movement;
    this.cardSatTempEl.textContent = `${sc.telemetry.satelliteTemp}°C (IR Top)`;
    this.cardEyeRadiusEl.textContent = `${Math.round(sc.telemetry.evacRadius * 0.22)} km (Core)`;

    // Update Sensors
    this.sensorPressureEl.textContent = `${sc.telemetry.pressure} hPa`;
    this.sensorSurgeEl.textContent = `+${sc.telemetry.stormSurge.toFixed(2)} m`;
    this.sensorWindEl.textContent = `${sc.telemetry.windSpeed} km/h`;
    this.sensorRadiusEl.textContent = `${sc.telemetry.evacRadius} km`;

    // Update Map
    this.map.updateScenario(sc);

    // Update Evac Routes & Shelters Tab
    this.renderSheltersAndRoutes(sc);

    // Run AI Agent Triage and Broadcast Generation
    this.runAgentThreatTriage();
    this.runAgentBroadcastGeneration();
  }

  renderSheltersAndRoutes(sc) {
    // Evac Routes
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

    // Shelters
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
        <p>AegisVortex AI analyzing atmospheric telemetry and population danger cones...</p>
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
    // Play EAS two-tone alert first, then voice speech
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
    // Append User Message
    this.appendCopilotMessage("user", question);

    // Create temporary agent typing indicator
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

    // Play Alert chime
    this.audio.playEASTones(1400);
  }

  saveApiKeySettings() {
    const key = this.inputGeminiApiKey.value.trim();
    const model = this.selectGeminiModel.value;

    this.agent.setApiKey(key);
    this.agent.setModel(model);

    this.updateApiStatusUI();
    this.closeModal(this.modalApiKey);

    // Run test reanalysis with the new key
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
    // Subtle realistic telemetry fluctuations
    this.telemetryInterval = setInterval(() => {
      if (!this.currentScenario) return;

      const sc = this.currentScenario;
      // Micro-jitter in wind speed (+/- 2 km/h)
      const windJitter = (Math.random() * 4 - 2).toFixed(0);
      const currentWind = sc.telemetry.windSpeed + parseInt(windJitter, 10);
      this.sensorWindEl.textContent = `${currentWind} km/h`;
      this.tickWindEl.textContent = `${currentWind} km/h`;

      // Azimuth rotation
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

// Instantiate application once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.aegisApp = new AegisVortexApp();
});
