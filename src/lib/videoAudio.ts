// Audio Synthesis & Web Speech API Voice Controller for SkillSpire AI Micro-Learning Videos

class VideoAudioEngine {
  private audioCtx: AudioContext | null = null;
  private ambientGainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isMusicPlaying = false;
  private musicVolume = 0.08; // Subtle background music volume
  private narrationMuted = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play subtle ambient futuristic background music using Web Audio API
  public startAmbientMusic(volume = 0.08) {
    if (this.isMusicPlaying) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      this.musicVolume = volume;
      this.ambientGainNode = this.audioCtx.createGain();
      this.ambientGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);

      this.ambientGainNode.connect(filter);
      filter.connect(this.audioCtx.destination);

      // Chords: Cmaj9 ambient cluster frequencies: C3 (130.81Hz), G3 (196.00Hz), B3 (246.94Hz), E4 (329.63Hz)
      const freqs = [130.81, 196.00, 246.94, 329.63];
      this.oscillators = freqs.map((f, i) => {
        const osc = this.audioCtx!.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, this.audioCtx!.currentTime);

        // Subtle LFO detune for lush space sound
        const lfo = this.audioCtx!.createOscillator();
        const lfoGain = this.audioCtx!.createGain();
        lfo.frequency.setValueAtTime(0.2 + i * 0.05, this.audioCtx!.currentTime);
        lfoGain.gain.setValueAtTime(2.0, this.audioCtx!.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start();

        const oscGain = this.audioCtx!.createGain();
        oscGain.gain.setValueAtTime(0.25, this.audioCtx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.ambientGainNode!);
        osc.start();
        return osc;
      });

      this.isMusicPlaying = true;
    } catch (e) {
      console.warn('Could not start ambient synthesizer:', e);
    }
  }

  public stopAmbientMusic() {
    if (!this.isMusicPlaying) return;
    try {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.oscillators = [];
      if (this.ambientGainNode) {
        this.ambientGainNode.disconnect();
        this.ambientGainNode = null;
      }
      this.isMusicPlaying = false;
    } catch (e) {
      console.warn('Error stopping ambient music:', e);
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.ambientGainNode && this.audioCtx) {
      this.ambientGainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    }
  }

  // Trigger professional English narration using Web Speech API
  public speakNarration(text: string, onEnd?: () => void) {
    if (this.narrationMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.96; // Moderate, clear educational speed
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick best English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('Guy')))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  public stopNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public setNarrationMuted(muted: boolean) {
    this.narrationMuted = muted;
    if (muted) {
      this.stopNarration();
    }
  }

  public isMuted() {
    return this.narrationMuted;
  }

  public getAudioStream(): MediaStream | null {
    this.initAudioContext();
    if (!this.audioCtx) return null;
    try {
      const dest = this.audioCtx.createMediaStreamDestination();
      if (this.ambientGainNode) {
        this.ambientGainNode.connect(dest);
      }
      return dest.stream;
    } catch (e) {
      console.warn('Could not create MediaStreamDestination:', e);
      return null;
    }
  }

  public stopAll() {
    this.stopNarration();
    this.stopAmbientMusic();
  }
}

export const videoAudioEngine = new VideoAudioEngine();
