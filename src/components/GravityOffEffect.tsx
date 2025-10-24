import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { CarData } from '../hooks/useGarage';

interface GravityOffEffectProps {
  enabled: boolean;
  cars: CarData[];
  onPositionUpdate: (id: number, newY: number) => void;
}

export function GravityOffEffect({ enabled, cars, onPositionUpdate }: GravityOffEffectProps) {
  const opacityRef = useRef(0);
  const timeRef = useRef(0);
  const baseHeightsRef = useRef<Map<number, number>>(new Map());
  const driftOffsetsRef = useRef<Map<number, { x: number; z: number; speed: number }>>(new Map());

  // Initialize base heights and drift patterns
  useEffect(() => {
    cars.forEach((car) => {
      if (!baseHeightsRef.current.has(car.id)) {
        baseHeightsRef.current.set(car.id, car.position[1]);
        driftOffsetsRef.current.set(car.id, {
          x: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4,
        });
      }
    });
  }, [cars]);

  useFrame((_, delta) => {
    // Smooth opacity transition
    const targetOpacity = enabled ? 1 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * delta * 2;
    
    if (opacityRef.current < 0.01 && !enabled) {
      // Reset to ground when disabled
      cars.forEach((car) => {
        const baseHeight = baseHeightsRef.current.get(car.id) || 0;
        if (car.position[1] !== baseHeight) {
          onPositionUpdate(car.id, baseHeight);
        }
      });
      return;
    }

    timeRef.current += delta;

    cars.forEach((car) => {
      const baseHeight = baseHeightsRef.current.get(car.id) || 0;
      const drift = driftOffsetsRef.current.get(car.id);
      
      if (!drift) return;

      // Calculate floating height with varied patterns
      const floatHeight = 3 + Math.sin(timeRef.current * drift.speed + drift.x) * 1.5;
      const verticalBob = Math.sin(timeRef.current * 0.8 + drift.z) * 0.3;
      
      // Smooth transition to/from floating
      const targetY = baseHeight + (floatHeight + verticalBob) * opacityRef.current;
      
      // Update car position
      onPositionUpdate(car.id, targetY);
    });
  });

  return null;
}
