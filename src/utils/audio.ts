/**
 * Web Audio API synthesizer for interactive birthday experience.
 * Features:
 * - Continuous Music Box "Happy Birthday" Background Music (BGM) with chords & melody
 * - High-clarity sound effects: Keypad chimes, unlock harp, balloon pop, candle blow, typewriter, gift sparkle
 * - Auto-unlocks AudioContext on first user interaction
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isBgMusicPlaying: boolean = false;
  private bgMusicTimer: number | null = null;
  private activeNodes: (AudioNode | OscillatorNode)[] = [];

  constructor() {
    // Listen for any first interaction to resume/unlock AudioContext
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initCtx();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Keypad click / soft marimba chime
  playKeypad(index: number = 0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const freqs = [329.63, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50];
      const freq = freqs[index % freqs.length];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  // Unlock / Magical Harp chord
  playUnlock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C Major + high E & G
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.35, this.ctx!.currentTime + i * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.07 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + i * 0.07);
        osc.stop(this.ctx!.currentTime + i * 0.07 + 0.75);
      });
    } catch {}
  }

  // Balloon pop sound: noise burst + low thud
  playBalloonPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Pop transient (thump)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      oscGain.gain.setValueAtTime(0.65, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Noise burst for the "snap"
      const bufferSize = this.ctx.sampleRate * 0.09;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Candle blowing whoosh
  playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.9;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.linearRampToValueAtTime(120, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Typewriter key click
  playTypewriter() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 500, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  // Gift open sparkle
  playGiftOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [659, 784, 988, 1175, 1318, 1568, 1760];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.3, this.ctx!.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.06);
        osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.55);
      });
    } catch {}
  }

  // Continuous background music box playing Happy Birthday melody & harmony
  startBgMusic() {
    if (this.isBgMusicPlaying || this.isMuted) return;
    this.initCtx();
    this.isBgMusicPlaying = true;
    this.loopBirthdayTune();
  }

  stopBgMusic() {
    this.isBgMusicPlaying = false;
    if (this.bgMusicTimer) {
      clearTimeout(this.bgMusicTimer);
      this.bgMusicTimer = null;
    }
  }

  private loopBirthdayTune() {
    if (!this.isBgMusicPlaying || this.isMuted) return;
    this.playBirthdayTune();
    // Happy Birthday song is ~12-13 seconds long, loop seamlessly
    this.bgMusicTimer = window.setTimeout(() => {
      if (this.isBgMusicPlaying && !this.isMuted) {
        this.loopBirthdayTune();
      }
    }, 13000);
  }

  // Cute music box "Happy Birthday" melody + accompaniment chords
  playBirthdayTune() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Note, duration in beats
      const melody: [number, number][] = [
        [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2],
        [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [392.00, 1], [349.23, 2],
        [261.63, 0.75], [261.63, 0.25], [523.25, 1], [440.00, 1], [349.23, 1], [329.63, 1], [293.66, 1],
        [466.16, 0.75], [466.16, 0.25], [440.00, 1], [349.23, 1], [392.00, 1], [349.23, 2.5],
      ];

      // Bass accompaniment notes: [bassFreq, atBeat]
      const bassChords: [number, number][] = [
        [174.61, 0], [174.61, 3], // F major
        [196.00, 6], [174.61, 9], // C / F
        [174.61, 12], [220.00, 15], // F / Dm
        [233.08, 18], [174.61, 21] // Bb / F
      ];

      let t = this.ctx.currentTime + 0.1;
      const beatLen = 0.48;

      // Play melody (kalimba / music box tone)
      melody.forEach(([freq, dur]) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * beatLen * 0.95);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + dur * beatLen);
        t += dur * beatLen;
      });

      // Play soft warm bass chords
      bassChords.forEach(([freq, atBeat]) => {
        const chordTime = this.ctx!.currentTime + 0.1 + atBeat * beatLen;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        gain.gain.setValueAtTime(0.12, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + beatLen * 2.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(chordTime);
        osc.stop(chordTime + beatLen * 2.6);
      });
    } catch {}
  }

  toggleMusic(): boolean {
    if (this.isBgMusicPlaying) {
      this.stopBgMusic();
      return false;
    } else {
      this.isMuted = false;
      this.startBgMusic();
      return true;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgMusic();
    } else {
      this.startBgMusic();
    }
    return this.isMuted;
  }
}

export const sounds = new SoundController();
