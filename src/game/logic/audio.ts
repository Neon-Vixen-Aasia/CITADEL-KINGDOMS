/**
 * Web Audio API synthesizer for Citadel of Kingdoms (Castle & Soldier theme).
 * Features:
 * - Medieval sound effects: metallic gauntlet clanks, royal fanfare brass, drawbridge rumbles, cathedral chimes.
 * - Procedural "Castle Vibes" Background Soundtrack:
 *   Atmospheric medieval lute arpeggios, warm cathedral stone drone pad,
 *   soft minstrel flute melodies, and distant keep bell tolls.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isSfxMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private musicVolume: number = 0.45;
  private isPlayingMusic: boolean = false;

  // Music scheduler state
  private musicIntervalId: number | null = null;
  private currentStep: number = 0;
  private nextNoteTime: number = 0;
  private masterMusicGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isSfxMuted = muted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (this.masterMusicGain && this.ctx) {
      this.masterMusicGain.gain.setValueAtTime(
        muted ? 0 : this.musicVolume,
        this.ctx.currentTime
      );
    }
    if (!muted && !this.isPlayingMusic) {
      this.startCastleMusic();
    }
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterMusicGain && this.ctx && !this.isMusicMuted) {
      this.masterMusicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlayingMusic && !this.isMusicMuted;
  }

  // =========================================================================
  // MEDIEVAL CASTLE SOUND EFFECTS (Gauntlet, Fanfare, Drawbridge, Chime)
  // =========================================================================

  public playClick() {
    if (this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Metallic gauntlet clank / sword hilt tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio safety
    }
  }

  public playSuccessChime() {
    if (this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Royal Brass Fanfare Triad (D4, F#4, A4, D5)
      const notes = [293.66, 369.99, 440.0, 587.33];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.09;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch {
      // Audio safety
    }
  }

  public playPortalWarp() {
    if (this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Heavy iron portcullis & drawbridge resonance
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.3);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.3);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio safety
    }
  }

  public playHeartCollect() {
    if (this.isSfxMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Imperial Coronation Cathedral Chime
      const chords = [329.63, 440.0, 554.37, 659.25, 880.0];
      const now = ctx.currentTime;

      chords.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0004, now + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.45);
      });
    } catch {
      // Audio safety
    }
  }

  // =========================================================================
  // CASTLE VIBES PROCEDURAL BACKGROUND SOUNDTRACK
  // =========================================================================

  /**
   * Starts the procedural castle soundtrack (lute, drone, flute, bell)
   */
  public startCastleMusic() {
    if (this.isPlayingMusic) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Master music bus
      const master = ctx.createGain();
      master.gain.setValueAtTime(
        this.isMusicMuted ? 0 : this.musicVolume,
        ctx.currentTime
      );
      master.connect(ctx.destination);
      this.masterMusicGain = master;

      // 1. Warm Cathedral Stone Drone Pad (D2 + A2 low ambient resonance)
      this.startCathedralDrone(ctx, master);

      // 2. Scheduler clock for medieval lute arpeggios & flute lead
      this.currentStep = 0;
      this.nextNoteTime = ctx.currentTime + 0.15;
      this.isPlayingMusic = true;

      // Lookahead loop (runs every 100ms, schedules 250ms ahead)
      this.musicIntervalId = window.setInterval(() => {
        this.scheduleCastleMusicSlice();
      }, 100);
    } catch (e) {
      console.warn('Failed to start castle music context:', e);
    }
  }

  public stopCastleMusic() {
    if (!this.isPlayingMusic) return;
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }

    if (this.ctx && this.droneGain) {
      this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
        } catch {
          // safe
        }
      }, 600);
    }

    this.isPlayingMusic = false;
  }

  public toggleCastleMusic(): boolean {
    if (this.isPlayingMusic && !this.isMusicMuted) {
      this.setMusicMuted(true);
      return false;
    } else {
      this.setMusicMuted(false);
      this.startCastleMusic();
      return true;
    }
  }

  private startCathedralDrone(ctx: AudioContext, destination: GainNode) {
    try {
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.0);

      // Low stone filter (muffled cathedral acoustic space)
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(320, ctx.currentTime);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(73.42, ctx.currentTime); // D2

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.0, ctx.currentTime); // A2
      osc2.detune.setValueAtTime(5, ctx.currentTime); // subtle natural beating

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(destination);

      osc1.start();
      osc2.start();

      this.droneOsc1 = osc1;
      this.droneOsc2 = osc2;
      this.droneGain = droneGain;
    } catch {
      // Audio safety
    }
  }

  /**
   * Procedural Medieval Lute + Flute + Bell Scheduler
   * In 6/8 medieval ballad tempo: ~68 BPM (each eighth note = ~0.29s)
   */
  private scheduleCastleMusicSlice() {
    if (!this.ctx || !this.masterMusicGain || !this.isPlayingMusic) return;

    const lookahead = 0.25; // seconds
    const stepDuration = 0.29; // ~68 BPM eighth-note pulse in 6/8 meter

    // 4 Chords in D Dorian Medieval Progression:
    // Bar 1: Dm (D3, A3, D4, F4, A4, F4)
    // Bar 2: Fmaj (F3, C4, F4, A4, C5, A4)
    // Bar 3: Cmaj (C3, G3, C4, E4, G4, E4)
    // Bar 4: G / Am (B2, G3, D4, G4, B4, D5)
    const chordsNotes = [
      // Bar 1: Dm
      [146.83, 220.0, 293.66, 349.23, 440.0, 349.23],
      // Bar 2: F
      [174.61, 261.63, 349.23, 440.0, 523.25, 440.0],
      // Bar 3: C
      [130.81, 196.0, 261.63, 329.63, 392.0, 329.63],
      // Bar 4: G/Am
      [123.47, 196.0, 293.66, 392.0, 493.88, 392.0],
    ];

    // Medieval Minstrel Flute Melody (plays lyrical phrases on specific steps)
    const fluteMelody: Record<number, number> = {
      0: 587.33,  // D5
      2: 659.25,  // E5
      4: 698.46,  // F5
      6: 659.25,  // E5
      8: 587.33,  // D5
      12: 523.25, // C5
      14: 587.33, // D5
      16: 659.25, // E5
      18: 440.0,  // A4
      20: 587.33, // D5
    };

    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      const barIndex = Math.floor(this.currentStep / 6) % 4;
      const noteInBar = this.currentStep % 6;
      const noteFreq = chordsNotes[barIndex][noteInBar];

      // 1. Pluck Medieval Lute Note
      this.playLutePluck(noteFreq, this.nextNoteTime, noteInBar === 0 ? 0.16 : 0.09);

      // 2. Play Medieval Minstrel Flute Note if mapped
      const fluteStep = this.currentStep % 24;
      if (fluteMelody[fluteStep]) {
        this.playMinstrelFlute(fluteMelody[fluteStep], this.nextNoteTime, 0.05);
      }

      // 3. Keep Bell Toll on the downbeat of every 24-step cycle (once every 4 bars)
      if (fluteStep === 0) {
        this.playCastleBell(587.33, this.nextNoteTime, 0.08); // High D sanctuary bell
      }

      this.currentStep++;
      this.nextNoteTime += stepDuration;
    }
  }

  /**
   * Synthesizes an acoustic lute pluck (Karplus-Strong style decay + warm wooden filter)
   */
  private playLutePluck(freq: number, time: number, volume: number) {
    if (!this.ctx || !this.masterMusicGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Triangle with slight rich harmonics
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Wooden body resonance filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1900, time);
      filter.frequency.exponentialRampToValueAtTime(380, time + 0.6);
      filter.Q.setValueAtTime(3.0, time);

      // Pluck amplitude envelope: fast attack, realistic acoustic decay
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0005, time + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + 1.15);
    } catch {
      // Audio safety
    }
  }

  /**
   * Synthesizes a gentle medieval woodwind / recorder lead
   */
  private playMinstrelFlute(freq: number, time: number, volume: number) {
    if (!this.ctx || !this.masterMusicGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Breath filter
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, time);
      filter.Q.setValueAtTime(1.2, time);

      // Soft wind swell
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.08);
      gain.gain.linearRampToValueAtTime(volume * 0.7, time + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0005, time + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + 0.7);
    } catch {
      // Audio safety
    }
  }

  /**
   * Distant Sanctuary Keep Bell chime tolling with rich inharmonic overtones
   */
  private playCastleBell(fundamentalFreq: number, time: number, volume: number) {
    if (!this.ctx || !this.masterMusicGain) return;

    try {
      // Church bell overtones: 1.0, 1.5, 2.0, 2.76
      const ratios = [1.0, 1.51, 2.0, 2.76];
      ratios.forEach((r, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamentalFreq * r, time);

        const v = volume / (i + 1);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(v, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

        osc.connect(gain);
        gain.connect(this.masterMusicGain!);

        osc.start(time);
        osc.stop(time + 2.9);
      });
    } catch {
      // Audio safety
    }
  }
}

export const soundFx = new SoundSynthesizer();
