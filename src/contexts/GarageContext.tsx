import { createContext, useContext, type ReactNode } from 'react';
import { useGarage } from '../hooks/useGarage';
import { useSceneMode } from '../hooks/useSceneMode';

type GarageContextType = ReturnType<typeof useGarage> & ReturnType<typeof useSceneMode>;

const GarageContext = createContext<GarageContextType | null>(null);

export function GarageProvider({ children }: { children: ReactNode }) {
  const garage = useGarage();
  const sceneMode = useSceneMode();
  
  return (
    <GarageContext.Provider value={{ ...garage, ...sceneMode }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarageContext() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarageContext must be used within GarageProvider');
  }
  return context;
}
