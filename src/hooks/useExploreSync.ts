import { useEffect } from 'react';
import { type CarData } from './useGarage';

// Hook to sync explore mode camera with selected car in UI
export function useExploreSync(
  cars: CarData[],
  cameraMode: 'garage' | 'explore',
  exploreSubMode: 'auto' | 'manual',
  currentCarIndex: number,
  onSelectCar: (id: number) => void
) {
  useEffect(() => {
    // Only sync in explore mode
    if (cameraMode === 'explore' && cars.length > 0) {
      const currentCar = cars[currentCarIndex];
      if (currentCar) {
        onSelectCar(currentCar.id);
        console.log('🔄 Syncing UI selection with camera:', currentCar.name);
      }
    }
  }, [cameraMode, currentCarIndex, cars, onSelectCar]);
}
