// High-Performance Doppler Weather Radar & Storm Sweep Canvas Simulator

export class DopplerRadar {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.angle = 0;
    this.sweepSpeed = 0.035; // radians per frame
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
    this.height = rect.height || 420;
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
        r: Math.random() * (this.maxRadius || 180),
        theta: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.04,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.7,
        hueOffset: Math.random() * 30
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

  stopLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = this.centerX;
    const cy = this.centerY;
    const maxR = this.maxRadius;

    // Tactical Radar background
    ctx.fillStyle = "#070b13";
    ctx.fillRect(0, 0, w, h);

    // Subtle radar grid background
    this.drawGrid(ctx, w, h);

    // Draw Range Rings
    if (this.showRangeRings) {
      this.drawRangeRings(ctx, cx, cy, maxR);
    }

    // Draw Storm Cells & Precipitation Reflectivity
    if (this.showReflectivity && this.currentScenario) {
      this.drawStormPrecipitation(ctx, cx, cy, maxR);
    }

    // Draw Wind vectors / rotating circulation particles
    if (this.showWindVectors) {
      this.drawCirculationParticles(ctx, cx, cy);
    }

    // Draw Phosphor Sweep Beam
    this.drawSweepBeam(ctx, cx, cy, maxR);

    // Center Crosshairs & Telemetry Overlay
    this.drawCrosshairs(ctx, cx, cy, maxR);

    // Update Sweep angle
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

      // Range ring distance labels
      ctx.font = "9px 'Orbitron', monospace";
      ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
      ctx.fillText(distances[i], cx + 5, cy - r + 12);
    });

    // Azimuth Angle ticks (0°, 90°, 180°, 270°)
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
      // Draw spiral cyclone arms with dBZ reflectivity colors
      const arms = 3;
      const eyeR = 26;

      // Eyewall - high intensity magenta & crimson
      const eyeGrad = ctx.createRadialGradient(cx, cy, eyeR * 0.7, cx, cy, eyeR * 2.2);
      eyeGrad.addColorStop(0, "rgba(225, 29, 72, 0.95)"); // Deep crimson 65 dBZ
      eyeGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.85)"); // Intense Red
      eyeGrad.addColorStop(0.8, "rgba(245, 158, 11, 0.6)"); // Amber
      eyeGrad.addColorStop(1, "rgba(16, 185, 129, 0.0)");

      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, eyeR * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Clear eye center (calm inside eyewall)
      ctx.fillStyle = "#070b13";
      ctx.beginPath();
      ctx.arc(cx, cy, eyeR * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Spiral precipitation bands
      for (let a = 0; a < arms; a++) {
        const armOffset = (a * (Math.PI * 2)) / arms + (this.angle * 0.1);
        ctx.beginPath();
        for (let t = 0; t < 1.4; t += 0.03) {
          const r = eyeR + t * (maxR * 0.75);
          const theta = armOffset + t * 4.2;
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;

          // Band thickness blob
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
      // Classic Hook Echo & Debris Ball Signature
      const hookCx = cx + 25;
      const hookCy = cy - 20;

      // Debris ball (catastrophic pink/purple 70+ dBZ)
      const debrisGrad = ctx.createRadialGradient(hookCx, hookCy, 2, hookCx, hookCy, 35);
      debrisGrad.addColorStop(0, "rgba(217, 70, 239, 0.95)"); // Violent Purple
      debrisGrad.addColorStop(0.4, "rgba(239, 68, 68, 0.9)");
      debrisGrad.addColorStop(0.8, "rgba(245, 158, 11, 0.5)");
      debrisGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

      ctx.fillStyle = debrisGrad;
      ctx.beginPath();
      ctx.arc(hookCx, hookCy, 35, 0, Math.PI * 2);
      ctx.fill();

      // Hook echo arc
      ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(hookCx - 10, hookCy - 10, 50, 0.2 * Math.PI, 1.2 * Math.PI);
      ctx.stroke();

      // Rear Flank Downdraft rain core
      const rfdGrad = ctx.createRadialGradient(cx - 30, cy + 40, 5, cx - 30, cy + 40, 80);
      rfdGrad.addColorStop(0, "rgba(239, 68, 68, 0.7)");
      rfdGrad.addColorStop(0.6, "rgba(34, 197, 94, 0.5)");
      rfdGrad.addColorStop(1, "rgba(14, 165, 233, 0)");
      ctx.fillStyle = rfdGrad;
      ctx.beginPath();
      ctx.arc(cx - 30, cy + 40, 80, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "flood") {
      // Broad atmospheric river / torrential convective multicells
      for (let i = 0; i < 5; i++) {
        const offsetAng = (i * Math.PI * 0.4) + (this.angle * 0.05);
        const cellR = 40 + i * 25;
        const cellX = cx + Math.cos(offsetAng) * cellR;
        const cellY = cy + Math.sin(offsetAng) * cellR * 0.7;

        const floodGrad = ctx.createRadialGradient(cellX, cellY, 5, cellX, cellY, 65);
        floodGrad.addColorStop(0, "rgba(14, 165, 233, 0.85)"); // Heavy rain core
        floodGrad.addColorStop(0.4, "rgba(16, 185, 129, 0.7)");
        floodGrad.addColorStop(0.7, "rgba(234, 179, 8, 0.5)");
        floodGrad.addColorStop(1, "rgba(14, 165, 233, 0)");

        ctx.fillStyle = floodGrad;
        ctx.beginPath();
        ctx.arc(cellX, cellY, 65, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === "wildfire") {
      // Dense smoke/ash pyrocumulonimbus plume
      const fireX = cx - 50;
      const fireY = cy + 40;
      for (let i = 0; i < 6; i++) {
        const plumeX = fireX + (i * 35);
        const plumeY = fireY - (i * 28);
        const plumeSize = 25 + i * 14;

        const fireGrad = ctx.createRadialGradient(plumeX, plumeY, 2, plumeX, plumeY, plumeSize);
        if (i === 0) {
          fireGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)"); // Fire front
          fireGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.7)");
        } else {
          fireGrad.addColorStop(0, "rgba(249, 115, 22, 0.75)"); // Ash & Ember plume
          fireGrad.addColorStop(0.6, "rgba(100, 116, 139, 0.5)"); // Dense Smoke
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
    // Sweeping sector glow
    const sectorAngle = 0.55; // width of phosphor trail
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

    // Sharp leading sweep line
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

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.stroke();

    // Center pulse dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 6;
    ctx.fill();

    // Compass headings
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
