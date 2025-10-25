import { useState } from 'react';

export type CameraMode = 'garage' | 'explore';
export type ExploreSubMode = 'auto' | 'manual';

export function useCameraMode() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('garage');
  const [exploreSubMode, setExploreSubMode] = useState<ExploreSubMode>('auto');
  
  return {
    cameraMode,
    setCameraMode,
    exploreSubMode,
    setExploreSubMode
  };
}
