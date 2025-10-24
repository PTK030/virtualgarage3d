import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface EffectsState {
  neonMode: boolean;
  rainMode: boolean;
  discoMode: boolean;
  gravityOff: boolean;
}

interface EffectsContextType {
  effects: EffectsState;
  toggleNeon: () => void;
  toggleRain: () => void;
  toggleDisco: () => void;
  toggleGravity: () => void;
  setEffect: (effect: keyof EffectsState, value: boolean) => void;
}

const EffectsContext = createContext<EffectsContextType | undefined>(undefined);

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [effects, setEffects] = useState<EffectsState>({
    neonMode: false,
    rainMode: false,
    discoMode: false,
    gravityOff: false,
  });

  const toggleNeon = () => setEffects(prev => ({ ...prev, neonMode: !prev.neonMode }));
  const toggleRain = () => setEffects(prev => ({ ...prev, rainMode: !prev.rainMode }));
  const toggleDisco = () => setEffects(prev => ({ ...prev, discoMode: !prev.discoMode }));
  const toggleGravity = () => setEffects(prev => ({ ...prev, gravityOff: !prev.gravityOff }));
  
  const setEffect = (effect: keyof EffectsState, value: boolean) => {
    setEffects(prev => ({ ...prev, [effect]: value }));
  };

  return (
    <EffectsContext.Provider value={{ 
      effects, 
      toggleNeon, 
      toggleRain, 
      toggleDisco, 
      toggleGravity,
      setEffect 
    }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectsProvider');
  }
  return context;
}
