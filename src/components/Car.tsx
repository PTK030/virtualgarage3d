import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CarModel } from './CarModel';
import { LoadingCar } from './LoadingCar';
import { ErrorBoundary } from './ErrorBoundary';

import { type CarData } from '../hooks/useGarage';

interface CarProps {
  car: CarData;
  isSelected?: boolean;
}

export function Car({ 
  car,
  isSelected = false
}: CarProps) {
  const { color = '#3b82f6', position = [0, 0, 0], modelPath } = car;
  const rotation: [number, number, number] = [0, 0, 0]; // Default rotation
  const carRef = useRef<THREE.Group>(null);
  const ledLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (carRef.current) {
      const time = clock.getElapsedTime();
      carRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
      carRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.05;
    }
    
    if (ledLightRef.current) {
      const time = clock.getElapsedTime();
      ledLightRef.current.intensity = 15 + Math.sin(time * 2) * 8;
    }
  });

  // If model path provided, try to load it with Suspense fallback
  if (modelPath) {
    return (
      <ErrorBoundary fallback={<LowPolyCar carRef={null} ledLightRef={null} color={color} position={position} rotation={rotation} isSelected={isSelected} />}>
        <Suspense fallback={<LoadingCar />}>
          <CarModel 
            car={car}
            position={position}
            rotation={rotation}
            color={color}
            isSelected={isSelected}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Default: Low-poly car geometry
  return <LowPolyCar carRef={carRef} ledLightRef={ledLightRef} color={color} position={position} rotation={rotation} isSelected={isSelected} />;
}

// Low-poly fallback component
function LowPolyCar({ carRef, ledLightRef, color, position, rotation, isSelected }: any) {
  return (
    <group ref={carRef} position={position} rotation={rotation}>
      {/* Car Body */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={isSelected ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      
      {/* Car Roof/Cabin */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <boxGeometry args={[1.2, 0.6, 0.9]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.7}
          roughness={0.2}
          emissive={isSelected ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>

      {/* Wheels - Front Left */}
      <mesh castShadow position={[-0.7, 0.2, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Wheels - Front Right */}
      <mesh castShadow position={[-0.7, 0.2, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Wheels - Rear Left */}
      <mesh castShadow position={[0.7, 0.2, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Wheels - Rear Right */}
      <mesh castShadow position={[0.7, 0.2, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Pulsating LED light under car */}
      <pointLight
        ref={ledLightRef}
        position={[0, -0.5, 0]}
        color={isSelected ? '#fbbf24' : color}
        intensity={15}
        distance={5}
      />
      
      {/* Selection glow */}
      {isSelected && (
        <pointLight
          position={[0, 1, 0]}
          color={color}
          intensity={5}
          distance={8}
        />
      )}
    </group>
  );
}
