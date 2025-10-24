import { createContext, useContext, type ReactNode } from 'react';
import { useGarage } from '../hooks/useGarage';
import { useSceneMode } from '../hooks/useSceneMode';
import { useToast } from '../hooks/useToast';
import { useCameraMode } from '../hooks/useCameraMode';

type GarageContextType = ReturnType<typeof useGarage> & ReturnType<typeof useSceneMode> & ReturnType<typeof useToast> & ReturnType<typeof useCameraMode>;

const GarageContext = createContext<GarageContextType | null>(null);

export function GarageProvider({ children }: { children: ReactNode }) {
  const garage = useGarage();
  const sceneMode = useSceneMode();
  const toast = useToast();
  const cameraMode = useCameraMode();
  
  return (
    <GarageContext.Provider value={{ ...garage, ...sceneMode, ...toast, ...cameraMode }}>
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
