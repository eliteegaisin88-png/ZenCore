/**
 * Web Audio API procedural sound synthesizer
 * 100% procedural, zero external audio asset dependencies
 */

export interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  description: string;
  mood: string;
  icon: string;
}

export const RELAXING_TRACKS: MusicTrack[] = [
  {
    id: 'cosmic-chill',
    title: 'Космический Чилл',
    genre: 'Space Ambient',
    description: 'Тёплые пэды, мерцающие звёздные колокольчики и мягкий бархатный бас',
    mood: 'Спокойствие и полёт',
    icon: '✨',
  },
  {
    id: 'zen-garden',
    title: 'Дзен Сад',
    genre: 'Meditative Chime',
    description: 'Восточные колокола, медитативные поющие чаши и бамбуковый ветер',
    mood: 'Гармония и медитация',
    icon: '🎋',
  },
  {
    id: 'starlight-lofi',
    title: 'Звёздный Лоу-фай',
    genre: 'Warm Lo-Fi Keys',
    description: 'Уютные винтажные аккорды Rhodes, мягкое тремоло и ламповое тепло',
    mood: 'Уют и ночной покой',
    icon: '☕',
  },
  {
    id: 'aurora-borealis',
    title: 'Северное Сияние',
    genre: 'Ethereal Shimmer',
    description: 'Глубокая космическая невесомость, кристальные гармоники и сияние',
    mood: 'Глубокий релакс',
    icon: '🌌',
  },
];

class SoundSystem {
  private ctx: AudioContext | null = null;
  private sfxVolume = 0.6;
  private musicVolume = 0.25;
  private isMuted = false;

  // Music state & nodes
  private currentTrackIndex = 0;
  private musicPlaying = false;
  private musicGainNode: GainNode | null = null;
  private masterMusicFilter: BiquadFilterNode | null = null;
  private reverbConvolver: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;

  private activeMusicOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private activeMusicIntervals: number[] = [];
  private trackChangeListeners: Array<(track: MusicTrack) => void> = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(muted ? 0 : this.musicVolume, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGainNode && this.ctx && !this.isMuted) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playDoubleJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);

    gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.27);
  }

  public playLand() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playFootstep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);

    gain.gain.setValueAtTime(this.sfxVolume * 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playPickUpCube() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(520, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.24);
    osc2.stop(now + 0.24);
  }

  public playDropCube() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playThrowCube() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playPadActivated() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [329.63, 440.0, 659.25].forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.32);
    });
  }

  public playPadDeactivated() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playCoreCollect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const startTime = now + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  public playJumpPadLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playLaserZap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });
  }

  public playSlowMo(enter: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    if (enter) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
    } else {
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
    }

    gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (enter ? 0.4 : 0.3));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + (enter ? 0.42 : 0.32));
  }

  public playLaserDeflect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSuperLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

    gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playFlip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.12);
    osc.frequency.linearRampToValueAtTime(400, now + 0.25);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // -------------------------------------------------------------
  // RELAXING MUSIC ENGINE (4 Procedural Tracks with Web Audio API)
  // -------------------------------------------------------------

  public getTracks(): MusicTrack[] {
    return RELAXING_TRACKS;
  }

  public getCurrentTrack(): MusicTrack {
    return RELAXING_TRACKS[this.currentTrackIndex] || RELAXING_TRACKS[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public addTrackChangeListener(cb: (track: MusicTrack) => void) {
    this.trackChangeListeners.push(cb);
  }

  public removeTrackChangeListener(cb: (track: MusicTrack) => void) {
    this.trackChangeListeners = this.trackChangeListeners.filter((l) => l !== cb);
  }

  private notifyTrackChange() {
    const track = this.getCurrentTrack();
    this.trackChangeListeners.forEach((cb) => {
      try {
        cb(track);
      } catch {
        // ignore listener errors
      }
    });
  }

  private getOrCreateReverb(): ConvolverNode | null {
    if (!this.ctx) return null;
    if (this.reverbConvolver) return this.reverbConvolver;

    try {
      const convolver = this.ctx.createConvolver();
      const rate = this.ctx.sampleRate;
      const length = Math.floor(rate * 2.8);
      const buffer = this.ctx.createBuffer(2, length, rate);
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const decay = Math.exp(-3.2 * (i / length));
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
      }

      convolver.buffer = buffer;
      this.reverbConvolver = convolver;
      return convolver;
    } catch {
      return null;
    }
  }

  private setupMusicBus() {
    if (!this.ctx) return;

    if (!this.musicGainNode) {
      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      this.musicGainNode.connect(this.ctx.destination);

      // Master lowpass filter to maintain warm, soothing, non-fatiguing tone
      this.masterMusicFilter = this.ctx.createBiquadFilter();
      this.masterMusicFilter.type = 'lowpass';
      this.masterMusicFilter.frequency.value = 2400;
      this.masterMusicFilter.connect(this.musicGainNode);

      // Master Dry Gain
      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.value = 0.75;
      this.dryGain.connect(this.masterMusicFilter);

      // Master Wet/Reverb Gain
      const reverb = this.getOrCreateReverb();
      if (reverb) {
        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = 0.4;
        reverb.connect(this.reverbGain);
        this.reverbGain.connect(this.masterMusicFilter);
      }
    }
  }

  public startAmbient(trackId?: string) {
    this.initCtx();
    if (!this.ctx) return;

    if (trackId) {
      const foundIdx = RELAXING_TRACKS.findIndex((t) => t.id === trackId);
      if (foundIdx !== -1) {
        this.currentTrackIndex = foundIdx;
      }
    }

    this.setupMusicBus();
    this.clearCurrentTrackNodes();

    this.musicPlaying = true;
    if (this.musicGainNode) {
      const targetGain = this.isMuted ? 0 : this.musicVolume;
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }

    this.playTrackInternal(this.currentTrackIndex);
    this.notifyTrackChange();
  }

  public stopAmbient() {
    this.clearCurrentTrackNodes();
    this.musicPlaying = false;
  }

  public toggleMusic() {
    if (this.musicPlaying) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.musicPlaying;
  }

  public selectTrack(trackId: string) {
    const idx = RELAXING_TRACKS.findIndex((t) => t.id === trackId);
    if (idx === -1) return;
    this.currentTrackIndex = idx;
    if (this.musicPlaying) {
      this.startAmbient();
    } else {
      this.notifyTrackChange();
    }
  }

  public nextTrack(): MusicTrack {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % RELAXING_TRACKS.length;
    if (this.musicPlaying) {
      this.startAmbient();
    } else {
      this.notifyTrackChange();
    }
    return this.getCurrentTrack();
  }

  public prevTrack(): MusicTrack {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + RELAXING_TRACKS.length) % RELAXING_TRACKS.length;
    if (this.musicPlaying) {
      this.startAmbient();
    } else {
      this.notifyTrackChange();
    }
    return this.getCurrentTrack();
  }

  private clearCurrentTrackNodes() {
    // Clear recurring generators
    this.activeMusicIntervals.forEach((intervalId) => window.clearInterval(intervalId));
    this.activeMusicIntervals = [];

    // Stop active oscillators
    this.activeMusicOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.activeMusicOscillators = [];
  }

  private connectToBus(source: AudioNode, reverbSend = 0.5) {
    if (!this.ctx || !this.dryGain) return;
    source.connect(this.dryGain);
    if (this.reverbConvolver && reverbSend > 0) {
      const sendGain = this.ctx.createGain();
      sendGain.gain.value = reverbSend;
      source.connect(sendGain);
      sendGain.connect(this.reverbConvolver);
    }
  }

  private playTrackInternal(index: number) {
    if (!this.ctx) return;

    switch (index) {
      case 0:
        this.generateCosmicChill();
        break;
      case 1:
        this.generateZenGarden();
        break;
      case 2:
        this.generateStarlightLofi();
        break;
      case 3:
        this.generateAuroraBorealis();
        break;
      default:
        this.generateCosmicChill();
    }
  }

  // TRACK 1: "Космический Чилл" (Cosmic Chill)
  // Lush warm pads (Fmaj9 - Cmaj9 - Dm9 - Bbmaj7) + sparkling star kalimba chimes
  private generateCosmicChill() {
    if (!this.ctx) return;

    const chords = [
      [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9
      [130.81, 196.0, 246.94, 293.66, 329.63], // Cmaj9
      [146.83, 220.0, 261.63, 349.23, 392.0], // Dm9
      [116.54, 174.61, 220.0, 293.66, 349.23], // Bbmaj7
    ];

    let chordIdx = 0;
    const padOscs: OscillatorNode[] = [];
    const padGains: GainNode[] = [];

    // Create 5 pad voices
    for (let v = 0; v < 5; v++) {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = v % 2 === 0 ? 'sine' : 'triangle';
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      gain.gain.value = 0.07;

      // Soft LFO chorus
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.12 + v * 0.04;
      lfoGain.gain.value = 2.0;
      lfo.connect(osc.frequency);
      lfo.start();
      this.activeMusicOscillators.push(lfo);

      osc.connect(filter);
      filter.connect(gain);
      this.connectToBus(gain, 0.45);

      osc.start();
      padOscs.push(osc);
      padGains.push(gain);
      this.activeMusicOscillators.push(osc);
    }

    const applyChord = (idx: number) => {
      if (!this.ctx) return;
      const notes = chords[idx];
      const now = this.ctx.currentTime;
      notes.forEach((freq, v) => {
        if (padOscs[v]) {
          padOscs[v].frequency.setTargetAtTime(freq, now, 1.2);
        }
      });
    };

    applyChord(chordIdx);

    // Chord progression interval (every 5.5s)
    const chordInterval = window.setInterval(() => {
      chordIdx = (chordIdx + 1) % chords.length;
      applyChord(chordIdx);
    }, 5500);
    this.activeMusicIntervals.push(chordInterval);

    // Star Kalimba / Bell sparkle generator
    const bellScale = [349.23, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
    const bellInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicPlaying) return;
      if (Math.random() < 0.25) return; // natural breathing pause

      const now = this.ctx.currentTime;
      const noteFreq = bellScale[Math.floor(Math.random() * bellScale.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      this.connectToBus(gain, 0.7);

      osc.start(now);
      osc.stop(now + 1.7);
    }, 1400);
    this.activeMusicIntervals.push(bellInterval);
  }

  // TRACK 2: "Дзен Сад" (Zen Garden)
  // Meditative Tibetan singing bowl strikes, deep grounded drone & peaceful bamboo chimes
  private generateZenGarden() {
    if (!this.ctx) return;

    // Grounded peaceful root drone: D2 (73.42Hz) + A2 (110.0Hz)
    const droneFreqs = [73.42, 110.0, 146.83];
    droneFreqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      gain.gain.value = 0.08;

      // Slow harmonic breathing
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 0.08 + i * 0.03;
      lfoGain.gain.value = 0.02;
      lfo.connect(gain.gain);
      lfo.start();
      this.activeMusicOscillators.push(lfo);

      osc.connect(filter);
      filter.connect(gain);
      this.connectToBus(gain, 0.4);

      osc.start();
      this.activeMusicOscillators.push(osc);
    });

    // Tibetan Singing Bowl strikes (every 4.8s)
    const bowlPartials = [1.0, 2.76, 5.4];
    const bowlBases = [216, 288, 324, 432];

    const playSingingBowl = () => {
      if (!this.ctx || !this.musicPlaying) return;
      const now = this.ctx.currentTime;
      const base = bowlBases[Math.floor(Math.random() * bowlBases.length)];

      bowlPartials.forEach((mul, pIdx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(base * mul, now);

        const amp = (0.07 / (pIdx + 1)) * (pIdx === 0 ? 1.0 : 0.45);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(amp, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        this.connectToBus(gain, 0.8);

        osc.start(now);
        osc.stop(now + 3.9);
      });
    };

    playSingingBowl();
    const bowlInterval = window.setInterval(playSingingBowl, 4800);
    this.activeMusicIntervals.push(bowlInterval);

    // Bamboo wind chime ripples
    const zenScale = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46];
    const chimeInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicPlaying) return;
      if (Math.random() < 0.3) return;

      const now = this.ctx.currentTime;
      const freq = zenScale[Math.floor(Math.random() * zenScale.length)];

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.value = 650;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      this.connectToBus(gain, 0.65);

      osc.start(now);
      osc.stop(now + 2.3);
    }, 2400);
    this.activeMusicIntervals.push(chimeInterval);
  }

  // TRACK 3: "Звёздный Лоу-фай" (Starlight Lo-Fi)
  // Warm neo-soul electric piano chords (Ebm9 - Ab13 - Dbmaj9 - Bbm9) with gentle Rhodes tremolo
  private generateStarlightLofi() {
    if (!this.ctx) return;

    const chords = [
      [155.56, 233.08, 277.18, 349.23, 369.99], // Ebm9
      [103.83, 261.63, 349.23, 369.99, 466.16], // Ab13
      [138.59, 207.65, 261.63, 311.13, 349.23], // Dbmaj9
      [116.54, 174.61, 207.65, 261.63, 277.18], // Bbm9
    ];

    let chordIdx = 0;
    const rhodesOscs: OscillatorNode[] = [];
    const rhodesGains: GainNode[] = [];

    // Master Tremolo LFO for vintage Rhodes sound
    const tremoloLfo = this.ctx.createOscillator();
    const tremoloGain = this.ctx.createGain();
    tremoloLfo.frequency.value = 3.6; // gentle 3.6Hz wobble
    tremoloGain.gain.value = 0.025;

    for (let v = 0; v < 5; v++) {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = v === 0 ? 'sine' : 'triangle';
      filter.type = 'lowpass';
      filter.frequency.value = 850;
      gain.gain.value = 0.065;

      tremoloLfo.connect(gain.gain);

      osc.connect(filter);
      filter.connect(gain);
      this.connectToBus(gain, 0.4);

      osc.start();
      rhodesOscs.push(osc);
      rhodesGains.push(gain);
      this.activeMusicOscillators.push(osc);
    }

    tremoloLfo.start();
    this.activeMusicOscillators.push(tremoloLfo);

    const applyChord = (idx: number) => {
      if (!this.ctx) return;
      const notes = chords[idx];
      const now = this.ctx.currentTime;
      notes.forEach((freq, v) => {
        if (rhodesOscs[v]) {
          rhodesOscs[v].frequency.setTargetAtTime(freq, now, 0.9);
        }
      });
    };

    applyChord(chordIdx);

    // Progression cycle (every 5.2s)
    const chordInterval = window.setInterval(() => {
      chordIdx = (chordIdx + 1) % chords.length;
      applyChord(chordIdx);
    }, 5200);
    this.activeMusicIntervals.push(chordInterval);

    // Mellow lo-fi jazz note sparkles
    const lofiPentatonic = [277.18, 311.13, 349.23, 415.3, 466.16, 554.37, 622.25];
    const leadInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicPlaying) return;
      if (Math.random() < 0.3) return;

      const now = this.ctx.currentTime;
      const noteFreq = lofiPentatonic[Math.floor(Math.random() * lofiPentatonic.length)];

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      filter.type = 'lowpass';
      filter.frequency.value = 1100;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      this.connectToBus(gain, 0.55);

      osc.start(now);
      osc.stop(now + 1.5);
    }, 1800);
    this.activeMusicIntervals.push(leadInterval);
  }

  // TRACK 4: "Северное Сияние" (Aurora Borealis)
  // Deep ethereal ambient, breathing harmonic filter sweeps & crystalline shimmer droplets
  private generateAuroraBorealis() {
    if (!this.ctx) return;

    // Harmonic chords
    const auroraChords = [
      [130.81, 196.0, 293.66, 369.99, 493.88], // Cmaj7(#11)
      [98.0, 146.83, 220.0, 246.94, 369.99],   // Gmaj9
      [82.41, 123.47, 196.0, 293.66, 369.99],  // Em9
      [110.0, 146.83, 220.0, 329.63, 440.0],   // Dsus2/A
    ];

    let chordIdx = 0;
    const oscs: OscillatorNode[] = [];
    const filters: BiquadFilterNode[] = [];

    // Slow sweeping filter LFO simulating breathing curtains of lights
    const auroraLfo = this.ctx.createOscillator();
    const auroraLfoGain = this.ctx.createGain();
    auroraLfo.frequency.value = 0.07; // 14-second slow breath cycle
    auroraLfoGain.gain.value = 450; // modulates filter cutoff

    for (let v = 0; v < 5; v++) {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = 650;
      gain.gain.value = 0.07;

      auroraLfo.connect(filter.frequency);

      osc.connect(filter);
      filter.connect(gain);
      this.connectToBus(gain, 0.6);

      osc.start();
      oscs.push(osc);
      filters.push(filter);
      this.activeMusicOscillators.push(osc);
    }

    auroraLfo.start();
    this.activeMusicOscillators.push(auroraLfo);

    const applyChord = (idx: number) => {
      if (!this.ctx) return;
      const notes = auroraChords[idx];
      const now = this.ctx.currentTime;
      notes.forEach((freq, v) => {
        if (oscs[v]) {
          oscs[v].frequency.setTargetAtTime(freq, now, 1.8);
        }
      });
    };

    applyChord(chordIdx);

    const chordInterval = window.setInterval(() => {
      chordIdx = (chordIdx + 1) % auroraChords.length;
      applyChord(chordIdx);
    }, 7000);
    this.activeMusicIntervals.push(chordInterval);

    // Crystalline starlight droplets
    const crystalNotes = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0];
    const crystalInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicPlaying) return;
      if (Math.random() < 0.35) return;

      const now = this.ctx.currentTime;
      const freq = crystalNotes[Math.floor(Math.random() * crystalNotes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      this.connectToBus(gain, 0.85);

      osc.start(now);
      osc.stop(now + 2.6);
    }, 1700);
    this.activeMusicIntervals.push(crystalInterval);
  }
}

export const soundSystem = new SoundSystem();

