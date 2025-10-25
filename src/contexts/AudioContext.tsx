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

  // Generate synthetic sounds using Web Audio API
  const playSound = (soundType: 'click' | 'select' | 'hover') => {
    if (!isEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = volume;

    switch (soundType) {
      case 'click': {
        // Sharp, quick click sound
        const oscillator = ctx.createOscillator();
        const clickGain = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        
        clickGain.gain.setValueAtTime(0.3, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        oscillator.connect(clickGain);
        clickGain.connect(gainNode);
        
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;
      }
      
      case 'select': {
        // Soft, warm selection sound
        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const selectGain = ctx.createGain();
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(440, now);
        oscillator1.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(554, now);
        oscillator2.frequency.exponentialRampToValueAtTime(1108, now + 0.15);
        
        selectGain.gain.setValueAtTime(0.2, now);
        selectGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        oscillator1.connect(selectGain);
        oscillator2.connect(selectGain);
        selectGain.connect(gainNode);
        
        oscillator1.start(now);
        oscillator2.start(now);
        oscillator1.stop(now + 0.2);
        oscillator2.stop(now + 0.2);
        break;
      }
      
      case 'hover': {
        // Very subtle hover sound
        const oscillator = ctx.createOscillator();
        const hoverGain = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        
        hoverGain.gain.setValueAtTime(0.05, now);
        hoverGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        oscillator.connect(hoverGain);
        hoverGain.connect(gainNode);
        
        oscillator.start(now);
        oscillator.stop(now + 0.08);
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
