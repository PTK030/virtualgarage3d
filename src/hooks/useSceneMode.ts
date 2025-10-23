import { useState } from 'react';

export type SceneMode = 'explore' | 'neon' | 'rain' | 'showroom';

export function useSceneMode() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('explore');
  
  return {
    sceneMode,
    setSceneMode
  };
}
