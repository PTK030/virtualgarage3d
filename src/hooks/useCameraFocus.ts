import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function useCameraFocus() {
  const { camera } = useThree();
  const targetPositionRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);
  const isAnimatingRef = useRef(false);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current || !targetPositionRef.current || !targetLookAtRef.current) {
      return;
    }

    // Smooth lerp to target position
    camera.position.lerp(targetPositionRef.current, delta * 2);
    camera.lookAt(targetLookAtRef.current);

    // Check if close enough to target
    const distance = camera.position.distanceTo(targetPositionRef.current);
    if (distance < 0.1) {
      isAnimatingRef.current = false;
      targetPositionRef.current = null;
      targetLookAtRef.current = null;
    }
  });

  const focusOnPosition = (position: [number, number, number]) => {
    const [x, y, z] = position;
    
    // Calculate camera position - offset from car
    const cameraDistance = 8;
    const cameraHeight = 4;
    const angle = Math.PI / 4; // 45 degrees
    
    const camX = x + Math.cos(angle) * cameraDistance;
    const camY = y + cameraHeight;
    const camZ = z + Math.sin(angle) * cameraDistance;
    
    targetPositionRef.current = new THREE.Vector3(camX, camY, camZ);
    targetLookAtRef.current = new THREE.Vector3(x, y + 0.5, z);
    isAnimatingRef.current = true;
  };

  return { focusOnPosition, isAnimating: isAnimatingRef.current };
}
