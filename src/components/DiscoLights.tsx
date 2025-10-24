import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DiscoLightsProps {
  enabled: boolean;
}

export function DiscoLights({ enabled }: DiscoLightsProps) {
  const spotLight1Ref = useRef<THREE.SpotLight>(null!);
  const spotLight2Ref = useRef<THREE.SpotLight>(null!);
  const spotLight3Ref = useRef<THREE.SpotLight>(null!);
  const spotLight4Ref = useRef<THREE.SpotLight>(null!);
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    const time = performance.now() * 0.001;
    
    // Smooth opacity transition
    const targetOpacity = enabled ? 1 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * delta * 3;
    
    if (opacityRef.current < 0.01 && !enabled) return;

    // Different frequencies for rhythm
    const freq1 = Math.sin(time * 2) * 0.5 + 0.5;
    const freq2 = Math.sin(time * 2.5 + Math.PI / 2) * 0.5 + 0.5;
    const freq3 = Math.sin(time * 1.8 + Math.PI) * 0.5 + 0.5;
    const freq4 = Math.sin(time * 2.2 + Math.PI * 1.5) * 0.5 + 0.5;

    // Spotlight 1 - Red to Yellow
    if (spotLight1Ref.current) {
      const hue = freq1 * 60 / 360; // 0-60 degrees (red to yellow)
      spotLight1Ref.current.color.setHSL(hue, 1, 0.6);
      spotLight1Ref.current.intensity = (freq1 * 20 + 10) * opacityRef.current;
      spotLight1Ref.current.angle = Math.PI / 6 + freq1 * Math.PI / 12;
    }

    // Spotlight 2 - Green to Cyan
    if (spotLight2Ref.current) {
      const hue = (120 + freq2 * 60) / 360; // 120-180 degrees
      spotLight2Ref.current.color.setHSL(hue, 1, 0.6);
      spotLight2Ref.current.intensity = (freq2 * 20 + 10) * opacityRef.current;
      spotLight2Ref.current.angle = Math.PI / 6 + freq2 * Math.PI / 12;
    }

    // Spotlight 3 - Blue to Purple
    if (spotLight3Ref.current) {
      const hue = (240 + freq3 * 60) / 360; // 240-300 degrees
      spotLight3Ref.current.color.setHSL(hue, 1, 0.6);
      spotLight3Ref.current.intensity = (freq3 * 20 + 10) * opacityRef.current;
      spotLight3Ref.current.angle = Math.PI / 6 + freq3 * Math.PI / 12;
    }

    // Spotlight 4 - Magenta to Red
    if (spotLight4Ref.current) {
      const hue = (300 + freq4 * 60) / 360; // 300-360 degrees
      spotLight4Ref.current.color.setHSL(hue, 1, 0.6);
      spotLight4Ref.current.intensity = (freq4 * 20 + 10) * opacityRef.current;
      spotLight4Ref.current.angle = Math.PI / 6 + freq4 * Math.PI / 12;
    }
  });

  return (
    <>
      <spotLight
        ref={spotLight1Ref}
        position={[15, 15, 15]}
        target-position={[0, 0, 0]}
        intensity={0}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={40}
        decay={2}
        castShadow
      />
      <spotLight
        ref={spotLight2Ref}
        position={[-15, 15, 15]}
        target-position={[0, 0, 0]}
        intensity={0}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={40}
        decay={2}
        castShadow
      />
      <spotLight
        ref={spotLight3Ref}
        position={[15, 15, -15]}
        target-position={[0, 0, 0]}
        intensity={0}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={40}
        decay={2}
        castShadow
      />
      <spotLight
        ref={spotLight4Ref}
        position={[-15, 15, -15]}
        target-position={[0, 0, 0]}
        intensity={0}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={40}
        decay={2}
        castShadow
      />
    </>
  );
}
