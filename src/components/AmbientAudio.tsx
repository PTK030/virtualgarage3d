import { useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';

interface AmbientAudioProps {
  mode: 'garage' | 'showroom' | 'explore';
}

export function AmbientAudio({ mode }: AmbientAudioProps) {
  const { isEnabled, volume } = useAudio();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  useEffect(() => {
    // Initialize Audio Context
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      // Cleanup
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!audioContextRef.current || !isEnabled) {
      // Stop all oscillators when disabled
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];
      return;
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Stop previous oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];

    // Master gain for volume control
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(volume * 0.15, now); // Very subtle

    switch (mode) {
      case 'garage': {
        // Low hum - garage ambient
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(60, now);
        
        bassGain.gain.setValueAtTime(0.3, now);
        
        bassOsc.connect(bassGain);
        bassGain.connect(masterGain);
        bassOsc.start(now);
        
        oscillatorsRef.current.push(bassOsc);
        gainNodesRef.current.push(bassGain);

        // Subtle high frequency for neon buzz
        const neonOsc = ctx.createOscillator();
        const neonGain = ctx.createGain();
        
        neonOsc.type = 'sawtooth';
        neonOsc.frequency.setValueAtTime(120, now);
        
        neonGain.gain.setValueAtTime(0.05, now);
        
        neonOsc.connect(neonGain);
        neonGain.connect(masterGain);
        neonOsc.start(now);
        
        oscillatorsRef.current.push(neonOsc);
        gainNodesRef.current.push(neonGain);
        break;
      }

      case 'showroom': {
        // Cinematic synth pad
        const pad1 = ctx.createOscillator();
        const pad2 = ctx.createOscillator();
        const pad3 = ctx.createOscillator();
        const padGain = ctx.createGain();
        
        pad1.type = 'sine';
        pad1.frequency.setValueAtTime(220, now); // A3
        
        pad2.type = 'sine';
        pad2.frequency.setValueAtTime(277.18, now); // C#4
        
        pad3.type = 'sine';
        pad3.frequency.setValueAtTime(329.63, now); // E4
        
        padGain.gain.setValueAtTime(0.4, now);
        
        pad1.connect(padGain);
        pad2.connect(padGain);
        pad3.connect(padGain);
        padGain.connect(masterGain);
        
        pad1.start(now);
        pad2.start(now);
        pad3.start(now);
        
        oscillatorsRef.current.push(pad1, pad2, pad3);
        gainNodesRef.current.push(padGain);

        // Subtle bass pulse
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(55, now); // A1
        
        bassGain.gain.setValueAtTime(0.2, now);
        
        bassOsc.connect(bassGain);
        bassGain.connect(masterGain);
        bassOsc.start(now);
        
        oscillatorsRef.current.push(bassOsc);
        gainNodesRef.current.push(bassGain);
        break;
      }

      case 'explore': {
        // Atmospheric ambient
        const atmo1 = ctx.createOscillator();
        const atmo2 = ctx.createOscillator();
        const atmoGain = ctx.createGain();
        
        atmo1.type = 'triangle';
        atmo1.frequency.setValueAtTime(110, now); // A2
        
        atmo2.type = 'sine';
        atmo2.frequency.setValueAtTime(165, now); // E3
        
        atmoGain.gain.setValueAtTime(0.25, now);
        
        atmo1.connect(atmoGain);
        atmo2.connect(atmoGain);
        atmoGain.connect(masterGain);
        
        atmo1.start(now);
        atmo2.start(now);
        
        oscillatorsRef.current.push(atmo1, atmo2);
        gainNodesRef.current.push(atmoGain);
        break;
      }
    }

    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
    };
  }, [mode, isEnabled, volume]);

  return null;
}
