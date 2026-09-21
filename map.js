// Tactical Interactive Disaster Cartography using Leaflet

export class DisasterMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.hazardCircle = null;
    this.epicenterMarker = null;
    this.shelterMarkers = [];
    this.routeLayers = [];
    this.initMap();
  }

  initMap() {
    if (typeof L === "undefined") {
      console.warn("Leaflet library not loaded yet.");
      return;
    }

    // Initialize map centered by default
    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([35.6762, 139.6503], 9);

    // Tactical CartoDB DarkMatter tiles with CARTO API key
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_3rvv_1_29b2c998bb133ba94832902c", {
      maxZoom: 19,
      subdomains: "abcd",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);
  }

  updateScenario(scenario) {
    if (!this.map || typeof L === "undefined") return;

    const [lat, lng] = scenario.coords;

    // Smooth fly to disaster region
    this.map.flyTo([lat, lng], scenario.type === "tornado" ? 11 : 9, {
      animate: true,
      duration: 1.5
    });

    // Clear previous layers
    if (this.hazardCircle) {
      this.map.removeLayer(this.hazardCircle);
    }
    if (this.epicenterMarker) {
      this.map.removeLayer(this.epicenterMarker);
    }
    this.shelterMarkers.forEach(m => this.map.removeLayer(m));
    this.shelterMarkers = [];
    this.routeLayers.forEach(r => this.map.removeLayer(r));
    this.routeLayers = [];

    // Draw Hazard Danger Perimeter Circle
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
      { permanent: false, direction: "top", className: "tactical-tooltip" }
    );

    // Custom Epicenter Marker
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

    // Add Emergency Shelters
    if (scenario.shelters && scenario.shelters.length > 0) {
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
