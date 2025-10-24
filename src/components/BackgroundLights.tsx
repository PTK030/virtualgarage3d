import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BackgroundLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const light4Ref = useRef<THREE.PointLight>(null);
  const light5Ref = useRef<THREE.PointLight>(null);
  const light6Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Pulsating LED lights with different rhythms and phases
    if (light1Ref.current) {
      light1Ref.current.intensity = 30 + Math.sin(time * 1.5) * 20;
    }
    
    if (light2Ref.current) {
      light2Ref.current.intensity = 25 + Math.sin(time * 2.2 + 1) * 15;
    }
    
    if (light3Ref.current) {
      light3Ref.current.intensity = 35 + Math.sin(time * 1.8 + 2) * 25;
    }
    
    if (light4Ref.current) {
      light4Ref.current.intensity = 20 + Math.sin(time * 2.5 + 3) * 15;
    }
    
    if (light5Ref.current) {
      light5Ref.current.intensity = 40 + Math.sin(time * 1.3 + 4) * 30;
    }
    
    if (light6Ref.current) {
      light6Ref.current.intensity = 28 + Math.sin(time * 2.0 + 5) * 18;
    }
  });

  return (
    <group>
      {/* Futuristic background LED lights */}
      <pointLight
        ref={light1Ref}
        position={[-15, 8, -10]}
        color="#00ffff"
        intensity={30}
        distance={20}
      />
      
      <pointLight
        ref={light2Ref}
        position={[15, 6, -8]}
        color="#ff00ff"
        intensity={25}
        distance={18}
      />
      
      <pointLight
        ref={light3Ref}
        position={[-12, 4, 12]}
        color="#ffff00"
        intensity={35}
        distance={22}
      />
      
      <pointLight
        ref={light4Ref}
        position={[12, 10, 8]}
        color="#00ff00"
        intensity={20}
        distance={16}
      />
      
      <pointLight
        ref={light5Ref}
        position={[0, 12, -15]}
        color="#ff3300"
        intensity={40}
        distance={25}
      />
      
      <pointLight
        ref={light6Ref}
        position={[-8, 3, 15]}
        color="#3300ff"
        intensity={28}
        distance={20}
      />
    </group>
  );
}
