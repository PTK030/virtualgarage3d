import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { type CameraMode } from '../hooks/useCameraMode';
import { type CarData } from '../hooks/useGarage';

interface CameraControllerProps {
  mode: CameraMode;
  cars: CarData[];
}

export function CameraController({ mode }: CameraControllerProps) {
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const exploreTimeRef = useRef(0);
  const targetPositionRef = useRef(new THREE.Vector3(0, 3, 12));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Explore mode camera path points
  const cameraPath = [
    { position: [-8, 4, 8], lookAt: [-6, -1, 0] },   // Look at car 1
    { position: [0, 6, 10], lookAt: [0, -1, 0] },    // Look at car 2  
    { position: [8, 4, 8], lookAt: [6, -1, 0] },     // Look at car 3
    { position: [0, 8, -8], lookAt: [0, -1, 0] },    // Overview from behind
    { position: [-10, 3, 0], lookAt: [0, -1, 0] },   // Side view
    { position: [10, 3, 0], lookAt: [0, -1, 0] },    // Other side
    { position: [0, 2, 15], lookAt: [0, -1, 0] },    // Front view
  ];

  useFrame((_, delta) => {
    if (mode === 'explore') {
      // Disable OrbitControls in explore mode
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }

      exploreTimeRef.current += delta * 0.3; // Slow down the animation
      
      const pathLength = cameraPath.length;
      const progress = (exploreTimeRef.current % (pathLength * 2)) / (pathLength * 2);
      const scaledProgress = progress * pathLength;
      const currentIndex = Math.floor(scaledProgress) % pathLength;
      const nextIndex = (currentIndex + 1) % pathLength;
      const t = scaledProgress - Math.floor(scaledProgress);
      
      // Smooth easing function (cubic bezier)
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const easedT = easeInOutCubic(t);
      
      const current = cameraPath[currentIndex];
      const next = cameraPath[nextIndex];
      
      // Lerp camera position
      targetPositionRef.current.lerpVectors(
        new THREE.Vector3(...current.position),
        new THREE.Vector3(...next.position),
        easedT
      );
      
      // Lerp look-at target
      targetLookAtRef.current.lerpVectors(
        new THREE.Vector3(...current.lookAt),
        new THREE.Vector3(...next.lookAt),
        easedT
      );
      
      // Apply smooth camera movement
      camera.position.lerp(targetPositionRef.current, delta * 2);
      camera.lookAt(targetLookAtRef.current);
      
    } else {
      // Enable OrbitControls in garage mode
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
    }
  });

  // Reset camera when switching modes
  useEffect(() => {
    if (mode === 'garage') {
      // Reset to default garage position
      targetPositionRef.current.set(0, 3, 12);
      targetLookAtRef.current.set(0, 0, 0);
      exploreTimeRef.current = 0;
    }
  }, [mode]);

  return (
    <>
      {mode === 'garage' && (
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          enableDamping={true}
          minDistance={5}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      )}
    </>
  );
}
