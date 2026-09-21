// Tactical Audio Alert Engine & Speech Synthesis Broadcast

export class EmergencyAudioEngine {
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
    if (this.isMuted) {
      this.stopAllAudio();
    }
    return this.isMuted;
  }

  stopAllAudio() {
    if (this.speechSynth && this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }
  }

  /**
   * Generates authentic US/Global Emergency Alert System (EAS) Dual-Frequency Warning Tones
   * (853 Hz and 960 Hz simultaneous sine waves)
   */
  playEASTones(durationMs = 1800) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const duration = durationMs / 1000;

      // Master gain node
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.05);
      masterGain.gain.setValueAtTime(0.28, now + duration - 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(this.audioCtx.destination);

      // Tone 1: 853 Hz
      const osc1 = this.audioCtx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(853, now);
      osc1.connect(masterGain);

      // Tone 2: 960 Hz
      const osc2 = this.audioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(960, now);
      osc2.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (err) {
      console.warn("EAS audio generation error:", err);
    }
  }

  /**
   * Tactical Civil Defense Siren (Wailing siren sweep)
   */
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

      // Wailing frequency envelope
      const cycles = Math.floor(durationSeconds / 1.2);
      for (let i = 0; i < cycles; i++) {
        const cycleStart = now + (i * 1.2);
        osc.frequency.setValueAtTime(450, cycleStart);
        osc.frequency.linearRampToValueAtTime(780, cycleStart + 0.6);
        osc.frequency.linearRampToValueAtTime(450, cycleStart + 1.2);
      }

      gain.gain.setValueAtTime(0.18, now + durationSeconds - 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      // Add a lowpass filter for body
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

  /**
   * Synthesizes automated speech emergency announcement using Web Speech API
   */
  speakAlert(text, onEndCallback) {
    if (this.isMuted || !this.speechSynth) return;

    this.speechSynth.cancel(); // Stop any pending speech

    const cleanText = text
      .replace(/[\*#\[\]_]/g, "") // remove markdown
      .replace(/\(.*?EAS.*?\)/gi, "")
      .trim();

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.rate = 1.05; // Urgent cadence
    this.currentUtterance.pitch = 0.95; // Authoritative lower pitch
    this.currentUtterance.volume = 1.0;

    // Pick standard English or local language voice if available
    const voices = this.speechSynth.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("David") || v.name.includes("Zira")));
      if (preferredVoice) {
        this.currentUtterance.voice = preferredVoice;
      }
    }

    if (onEndCallback) {
      this.currentUtterance.onend = onEndCallback;
      this.currentUtterance.onerror = onEndCallback;
    }

    this.speechSynth.speak(this.currentUtterance);
  }
}
