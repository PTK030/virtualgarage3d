import { useState } from 'react';

export type CameraMode = 'garage' | 'explore';

export function useCameraMode() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('garage');
  
  return {
    cameraMode,
    setCameraMode
  };
}
