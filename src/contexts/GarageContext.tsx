import { createContext, useContext, type ReactNode } from 'react';
import { useGarage } from '../hooks/useGarage';

type GarageContextType = ReturnType<typeof useGarage>;

const GarageContext = createContext<GarageContextType | null>(null);

export function GarageProvider({ children }: { children: ReactNode }) {
  const garage = useGarage();
  
  return (
    <GarageContext.Provider value={garage}>
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
