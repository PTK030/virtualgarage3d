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

    // Master gain for volume control - significantly reduced
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(volume * 0.02, now); // Much more subtle to avoid buzzing

    switch (mode) {
      case 'garage': {
        // Low hum - garage ambient with filter
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        const bassFilter = ctx.createBiquadFilter();
        
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(55, now); // Lower frequency
        
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(200, now);
        bassFilter.Q.setValueAtTime(1, now);
        
        bassGain.gain.setValueAtTime(0.15, now); // Reduced
        
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(masterGain);
        bassOsc.start(now);
        
        oscillatorsRef.current.push(bassOsc);
        gainNodesRef.current.push(bassGain);
        break;
      }

      case 'showroom': {
        // Cinematic synth pad - simplified and filtered
        const pad1 = ctx.createOscillator();
        const pad2 = ctx.createOscillator();
        const padGain = ctx.createGain();
        const padFilter = ctx.createBiquadFilter();
        
        pad1.type = 'sine';
        pad1.frequency.setValueAtTime(220, now); // A3
        
        pad2.type = 'sine';
        pad2.frequency.setValueAtTime(277.18, now); // C#4
        
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(800, now);
        padFilter.Q.setValueAtTime(0.5, now);
        
        padGain.gain.setValueAtTime(0.12, now); // Much reduced
        
        pad1.connect(padFilter);
        pad2.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(masterGain);
        
        pad1.start(now);
        pad2.start(now);
        
        oscillatorsRef.current.push(pad1, pad2);
        gainNodesRef.current.push(padGain);
        break;
      }

      case 'explore': {
        // Atmospheric ambient - smooth and filtered
        const atmo1 = ctx.createOscillator();
        const atmoGain = ctx.createGain();
        const atmoFilter = ctx.createBiquadFilter();
        
        atmo1.type = 'sine'; // Changed to sine for smoother sound
        atmo1.frequency.setValueAtTime(110, now); // A2
        
        atmoFilter.type = 'lowpass';
        atmoFilter.frequency.setValueAtTime(400, now);
        atmoFilter.Q.setValueAtTime(0.7, now);
        
        atmoGain.gain.setValueAtTime(0.1, now); // Much reduced
        
        atmo1.connect(atmoFilter);
        atmoFilter.connect(atmoGain);
        atmoGain.connect(masterGain);
        
        atmo1.start(now);
        
        oscillatorsRef.current.push(atmo1);
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
