import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CarModelProps {
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  isSelected: boolean;
}

export function CarModel({ modelPath, position, rotation, color, isSelected }: CarModelProps) {
  const carRef = useRef<THREE.Group>(null);
  const ledLightRef = useRef<THREE.PointLight>(null);
  
  const { scene } = useGLTF(modelPath);
  
  // Calculate appropriate scale based on model size
  const modelScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    console.log('✅ Model loaded:', modelPath, 'at position:', position[0], position[1], position[2]);
    console.log('Model size:', size.x.toFixed(2), 'x', size.y.toFixed(2), 'x', size.z.toFixed(2));
    
    // Target size: around 6 units long (increased for better visibility)
    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetSize = 6;
    const calculatedScale = maxDimension > 0 ? targetSize / maxDimension : 1;
    
    console.log('Calculated scale:', calculatedScale.toFixed(2));
    
    return calculatedScale * 1.0; // Apply 1.0 multiplier for final adjustment
  }, [scene, modelPath, position]);

  useFrame(({ clock }) => {
    if (carRef.current) {
      const time = clock.getElapsedTime();
      carRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
      carRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.05;
    }
    
    if (ledLightRef.current) {
      const time = clock.getElapsedTime();
      const baseIntensity = isSelected ? 40 : 15;
      const pulseAmount = isSelected ? 15 : 8;
      ledLightRef.current.intensity = baseIntensity + Math.sin(time * 2) * pulseAmount;
    }
  });

  // Make sure model materials receive light and are visible
  const clonedScene = scene.clone();
  clonedScene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Force material to be visible
      if (child.material) {
        child.material.transparent = false;
        child.material.opacity = 1;
        child.material.visible = true;
        child.material.side = THREE.DoubleSide;
        
        // If it's too dark, add emissive
        if (!child.material.emissive) {
          child.material.emissive = new THREE.Color(0x222222);
          child.material.emissiveIntensity = 0.2;
        }
        
        child.material.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={carRef} position={position} rotation={rotation}>
      <primitive 
        object={clonedScene} 
        scale={modelScale}
      />
      
      {/* LED light under car - pulsates when selected */}
      <pointLight
        ref={ledLightRef}
        position={[0, -1, 0]}
        color={isSelected ? '#fbbf24' : color}
        intensity={isSelected ? 40 : 15}
        distance={isSelected ? 8 : 5}
      />
    </group>
  );
}
