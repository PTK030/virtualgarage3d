import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { type CarData } from './useGarage';
import { useModelLoader } from './useModelLoader';

// Hook that tries GLB first, then GLTF, then creates fallback geometry
export function useGLTFWithFallback(car: CarData, color: string) {
  const modelUrl = useModelLoader(car);
  
  const result = useMemo(() => {
    if (!car.isCustom) {
      // For default models, use regular useGLTF
      try {
        const gltf = useGLTF(modelUrl);
        return { scene: gltf.scene, isError: false };
      } catch (error) {
        console.error('❌ Failed to load default model:', error);
        return createFallbackScene(color, car.name);
      }
    }
    
    // For custom models, try different approaches
    try {
      console.log('🎯 Attempting to load custom model:', car.name);
      
      // First try: Load as provided
      const gltf = useGLTF(modelUrl);
      console.log('✅ Custom model loaded successfully:', car.name);
      return { scene: gltf.scene, isError: false };
      
    } catch (error) {
      console.error('❌ Failed to load custom model:', car.name, error);
      
      // Create fallback geometry
      return createFallbackScene(color, car.name);
    }
  }, [modelUrl, car.isCustom, car.name, color]);
  
  return result;
}

function createFallbackScene(color: string, carName: string) {
  console.log('🔧 Creating fallback geometry for:', carName);
  
  const scene = new THREE.Group();
  const geometry = new THREE.BoxGeometry(2, 1, 4);
  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    emissive: new THREE.Color(0x444444),
    emissiveIntensity: 0.2,
    metalness: 0.3,
    roughness: 0.7
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  return { scene, isError: true };
}
