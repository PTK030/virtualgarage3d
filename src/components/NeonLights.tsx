import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NeonLightsProps {
  enabled: boolean;
}

export function NeonLights({ enabled }: NeonLightsProps) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    const time = performance.now() * 0.001;
    
    // Smooth opacity transition
    const targetOpacity = enabled ? 1 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * delta * 3;
    
    if (opacityRef.current < 0.01 && !enabled) return;

    // Animate light colors and positions
    if (light1Ref.current) {
      // Blue light
      const blue = Math.sin(time * 0.5) * 0.3 + 0.7;
      light1Ref.current.color.setRGB(0.2, 0.5, blue);
      light1Ref.current.intensity = (5 + Math.sin(time * 0.7) * 2) * opacityRef.current;
      light1Ref.current.position.x = Math.cos(time * 0.3) * 15;
      light1Ref.current.position.z = Math.sin(time * 0.3) * 15;
    }

    if (light2Ref.current) {
      // Pink light
      const pink = Math.sin(time * 0.7 + Math.PI / 3) * 0.3 + 0.7;
      light2Ref.current.color.setRGB(pink, 0.2, 0.6);
      light2Ref.current.intensity = (5 + Math.sin(time * 0.5 + 1) * 2) * opacityRef.current;
      light2Ref.current.position.x = Math.cos(time * 0.4 + 2) * 15;
      light2Ref.current.position.z = Math.sin(time * 0.4 + 2) * 15;
    }

    if (light3Ref.current) {
      // Purple light
      const purple = Math.sin(time * 0.6 + Math.PI * 2 / 3) * 0.3 + 0.7;
      light3Ref.current.color.setRGB(purple, 0.3, purple);
      light3Ref.current.intensity = (5 + Math.sin(time * 0.6 + 2) * 2) * opacityRef.current;
      light3Ref.current.position.x = Math.cos(time * 0.5 + 4) * 15;
      light3Ref.current.position.z = Math.sin(time * 0.5 + 4) * 15;
    }
  });

  return (
    <>
      <pointLight
        ref={light1Ref}
        position={[10, 8, 10]}
        intensity={0}
        distance={30}
        decay={2}
      />
      <pointLight
        ref={light2Ref}
        position={[-10, 8, 10]}
        intensity={0}
        distance={30}
        decay={2}
      />
      <pointLight
        ref={light3Ref}
        position={[0, 8, -10]}
        intensity={0}
        distance={30}
        decay={2}
      />
    </>
  );
}
