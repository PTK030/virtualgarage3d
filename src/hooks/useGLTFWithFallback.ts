import { useGLTF } from '@react-three/drei';
import { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { type CarData } from './useGarage';
import { useModelLoader } from './useModelLoader';
import { type GLTF } from 'three-stdlib';

// Hook that tries GLB first, then GLTF, then creates fallback geometry
export function useGLTFWithFallback(car: CarData, color: string) {
  const modelUrl = useModelLoader(car);
  const [loadError, setLoadError] = useState(false);
  
  // Try to load the model with error handling
  let gltf: GLTF | undefined;
  try {
    if (modelUrl && !loadError) {
      gltf = useGLTF(modelUrl);
    }
  } catch (error) {
    console.error('❌ Failed to load model for:', car.name, error);
    setLoadError(true);
  }
  
  const result = useMemo(() => {
    // If we have a successful GLTF load
    if (gltf && gltf.scene && !loadError) {
      console.log('✅ Model loaded successfully:', car.name);
      return { scene: gltf.scene, isError: false };
    }
    
    // Create fallback geometry
    console.log('🔧 Creating fallback geometry for:', car.name);
    return createFallbackScene(color, car.name);
  }, [gltf, loadError, color, car.name]);
  
  // Reset error state when model URL changes
  useEffect(() => {
    setLoadError(false);
  }, [modelUrl]);
  
  return result;
}

function createFallbackScene(color: string, carName: string) {
  console.log('🔧 Creating fallback geometry for:', carName);
  
  const scene = new THREE.Group();
  
  // Create a more detailed car-like fallback
  const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: color,
    emissive: new THREE.Color(0x222222),
    emissiveIntensity: 0.1,
    metalness: 0.4,
    roughness: 0.6
  });
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  bodyMesh.position.y = 0.4;
  scene.add(bodyMesh);
  
  // Add wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
  const wheelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const positions = [
    [-0.8, 0.3, 1.2],  // front left
    [0.8, 0.3, 1.2],   // front right
    [-0.8, 0.3, -1.2], // rear left
    [0.8, 0.3, -1.2]   // rear right
  ];
  
  positions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(x, y, z);
    wheel.rotation.z = Math.PI / 2;
    scene.add(wheel);
  });
  
  return { scene, isError: true };
}
