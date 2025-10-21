import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CarProps {
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
  isSelected?: boolean;
  modelPath?: string;
}

export function Car({ 
  color = '#3b82f6', 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  isSelected = false,
  modelPath
}: CarProps) {
  const carRef = useRef<THREE.Group>(null);
  const ledLightRef = useRef<THREE.PointLight>(null);
  
  // Try to load GLTF model if path provided
  let model = null;
  try {
    if (modelPath) {
      model = useGLTF(modelPath);
    }
  } catch (error) {
    console.warn('Failed to load model, using fallback geometry', error);
  }

  useFrame(({ clock }) => {
    if (carRef.current) {
      const time = clock.getElapsedTime();
      
      // Floating animation (up and down)
      carRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
      
      // Subtle rotation
      carRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.05;
    }
    
    // Pulsating LED light
    if (ledLightRef.current) {
      const time = clock.getElapsedTime();
      ledLightRef.current.intensity = 15 + Math.sin(time * 2) * 8;
    }
  });

  // If model loaded successfully, use it
  if (model && model.scene) {
    return (
      <group ref={carRef} position={position}>
        <primitive 
          object={model.scene.clone()} 
          scale={1}
        />
        
        {/* LED light effect under car */}
        <pointLight
          ref={ledLightRef}
          position={[0, -0.5, 0]}
          color={isSelected ? '#fbbf24' : color}
          intensity={15}
          distance={5}
        />
      </group>
    );
  }

  // Fallback: Low-poly car geometry
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
