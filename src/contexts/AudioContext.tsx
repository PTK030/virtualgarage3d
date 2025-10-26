import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface AudioContextType {
  isEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  playSound: (soundType: 'click' | 'select' | 'hover') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleAudio = () => {
    setIsEnabled(prev => !prev);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  // Generate UI sound effects using Web Audio API
  const playSound = (soundType: 'click' | 'select' | 'hover') => {
    if (!isEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = volume * 0.5; // Reduced overall

    switch (soundType) {
      case 'click': {
        // Modern UI click - short sine wave
        const oscillator = ctx.createOscillator();
        const clickGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.02);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        
        clickGain.gain.setValueAtTime(0.2, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        
        oscillator.connect(filter);
        filter.connect(clickGain);
        clickGain.connect(gainNode);
        
        oscillator.start(now);
        oscillator.stop(now + 0.02);
        break;
      }
      
      case 'select': {
        // Pleasant selection sound - single rising tone
        const oscillator = ctx.createOscillator();
        const selectGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, now);
        
        selectGain.gain.setValueAtTime(0.15, now);
        selectGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        oscillator.connect(filter);
        filter.connect(selectGain);
        selectGain.connect(gainNode);
        
        oscillator.start(now);
        oscillator.stop(now + 0.08);
        break;
      }
      
      case 'hover': {
        // Disabled hover sound - was too frequent and annoying
        // Only click and select sounds are used
        break;
      }
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isEnabled, 
      volume, 
      toggleAudio, 
      setVolume,
      playSound
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
