import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type SceneMode } from '../hooks/useSceneMode';

interface SceneLightingProps {
  mode: SceneMode;
}

export function SceneLighting({ mode }: SceneLightingProps) {
  const neonLight1 = useRef<THREE.PointLight>(null);
  const neonLight2 = useRef<THREE.PointLight>(null);
  const neonLight3 = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (mode === 'neon') {
      // Pulsating neon lights
      if (neonLight1.current) {
        neonLight1.current.intensity = 100 + Math.sin(time * 2) * 50;
      }
      if (neonLight2.current) {
        neonLight2.current.intensity = 100 + Math.sin(time * 3 + 1) * 50;
      }
      if (neonLight3.current) {
        neonLight3.current.intensity = 100 + Math.sin(time * 2.5 + 2) * 50;
      }
    }
  });

  // EXPLORE MODE - Default atmospheric lighting
  if (mode === 'explore') {
    return (
      <>
        <ambientLight intensity={1.5} />
        <spotLight
          position={[10, 20, 10]}
          angle={0.3}
          penumbra={1}
          intensity={500}
          castShadow
        />
        <directionalLight position={[0, 10, 5]} intensity={2} />
        
        <pointLight position={[-10, 5, -10]} intensity={50} color="#3b82f6" />
        <pointLight position={[10, 3, -5]} intensity={40} color="#8b5cf6" />
        <pointLight position={[0, -2, 5]} intensity={30} color="#06b6d4" />
        <pointLight position={[-5, 8, 10]} intensity={35} color="#6366f1" />
      </>
    );
  }

  // NEON MODE - Intense colorful lights
  if (mode === 'neon') {
    return (
      <>
        <ambientLight intensity={0.5} />
        
        {/* Pulsating neon lights */}
        <pointLight
          ref={neonLight1}
          position={[-8, 3, 0]}
          color="#ff00ff"
          intensity={100}
          distance={20}
        />
        <pointLight
          ref={neonLight2}
          position={[8, 3, 0]}
          color="#00ffff"
          intensity={100}
          distance={20}
        />
        <pointLight
          ref={neonLight3}
          position={[0, 5, -10]}
          color="#ff0080"
          intensity={100}
          distance={20}
        />
        
        {/* Additional accent lights */}
        <pointLight position={[-5, 1, 8]} color="#ffff00" intensity={80} distance={15} />
        <pointLight position={[5, 1, 8]} color="#00ff00" intensity={80} distance={15} />
        <pointLight position={[0, 8, 5]} color="#ff3300" intensity={60} distance={18} />
        
        <spotLight
          position={[0, 15, 0]}
          angle={0.8}
          penumbra={1}
          intensity={200}
          color="#ff00ff"
        />
      </>
    );
  }

  // RAIN MODE - Cool, moody blue lighting
  if (mode === 'rain') {
    return (
      <>
        <ambientLight intensity={0.3} color="#4a5f7f" />
        
        <directionalLight 
          position={[0, 20, 0]} 
          intensity={0.8}
          color="#6b8cae"
        />
        
        {/* Blue/cyan atmospheric lights */}
        <pointLight position={[-10, 8, -5]} color="#1e3a5f" intensity={60} distance={25} />
        <pointLight position={[10, 8, -5]} color="#2c5f7f" intensity={60} distance={25} />
        <pointLight position={[0, 5, 10]} color="#4a7ba7" intensity={50} distance={20} />
        
        {/* Ground reflection simulation */}
        <pointLight position={[0, 0.5, 0]} color="#5f8fb4" intensity={40} distance={15} />
        
        <spotLight
          position={[5, 15, 5]}
          angle={0.5}
          penumbra={1}
          intensity={150}
          color="#4a7ba7"
        />
      </>
    );
  }

  // SHOWROOM MODE - Clean, bright studio lighting
  if (mode === 'showroom') {
    return (
      <>
        <ambientLight intensity={2} />
        
        {/* Key light */}
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={3}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Fill light */}
        <directionalLight 
          position={[-10, 15, 5]} 
          intensity={1.5}
        />
        
        {/* Back light */}
        <directionalLight 
          position={[0, 10, -10]} 
          intensity={2}
        />
        
        {/* Ground lights for subtle accent */}
        <pointLight position={[-8, 1, 8]} intensity={100} color="#ffffff" distance={15} />
        <pointLight position={[8, 1, 8]} intensity={100} color="#ffffff" distance={15} />
        <pointLight position={[0, 1, -8]} intensity={80} color="#f0f0f0" distance={15} />
        
        {/* Top spot for dramatic effect */}
        <spotLight
          position={[0, 25, 0]}
          angle={0.6}
          penumbra={0.8}
          intensity={800}
          castShadow
        />
      </>
    );
  }

  return null;
}
