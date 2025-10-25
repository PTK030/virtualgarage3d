import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { type CameraMode, type ExploreSubMode } from '../hooks/useCameraMode';
import { type CarData } from '../hooks/useGarage';

interface CameraControllerProps {
  mode: CameraMode;
  exploreSubMode: ExploreSubMode;
  cars: CarData[];
}

export function CameraController({ mode, exploreSubMode, cars }: CameraControllerProps) {
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const exploreTimeRef = useRef(0);
  const currentCarIndexRef = useRef(0);
  const targetPositionRef = useRef(new THREE.Vector3(0, 3, 12));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Generate camera positions based on actual car positions
  const generateCameraPath = () => {
    if (cars.length === 0) return [];
    
    console.log('🚗 Generating camera path for', cars.length, 'cars');
    
    return cars.map((car, index) => {
      const [x, y, z] = car.position;
      console.log(`Car ${index}: ${car.name} at [${x}, ${y}, ${z}]`);
      return {
        position: [x + 4, y + 3, z + 4], // Offset from car position
        lookAt: [x, y, z], // Look at the car
        carIndex: index,
        carName: car.name
      };
    });
  };

  const cameraPath = generateCameraPath();

  // Keyboard controls for manual explore mode
  useEffect(() => {
    if (mode === 'explore' && exploreSubMode === 'manual') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (cameraPath.length === 0) return;
        
        // Prevent default to avoid page scrolling
        if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
          e.preventDefault();
        }
        
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
          case 'A':
            currentCarIndexRef.current = (currentCarIndexRef.current - 1 + cameraPath.length) % cameraPath.length;
            console.log('🎯 Manual switching to car:', cameraPath[currentCarIndexRef.current].carName, 'Index:', currentCarIndexRef.current);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            currentCarIndexRef.current = (currentCarIndexRef.current + 1) % cameraPath.length;
            console.log('🎯 Manual switching to car:', cameraPath[currentCarIndexRef.current].carName, 'Index:', currentCarIndexRef.current);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mode, exploreSubMode, cameraPath]);

  useFrame((_, delta) => {
    if (mode === 'explore') {
      if (exploreSubMode === 'manual') {
        // Manual mode - OrbitControls enabled but constrained to current car
        if (orbitControlsRef.current && cameraPath.length > 0) {
          orbitControlsRef.current.enabled = true;
          const currentCar = cameraPath[currentCarIndexRef.current];
          orbitControlsRef.current.target.set(...currentCar.lookAt);
          
          // Position camera near the current car if not already positioned
          const [carX, carY, carZ] = currentCar.lookAt;
          const distance = camera.position.distanceTo(new THREE.Vector3(carX, carY, carZ));
          if (distance > 20) {
            // Move camera closer to the car
            targetPositionRef.current.set(carX + 5, carY + 3, carZ + 5);
            camera.position.lerp(targetPositionRef.current, delta * 3);
          }
        }
      } else {
        // Auto mode - disable OrbitControls and animate
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }

        if (cameraPath.length > 0) {
          exploreTimeRef.current += delta;
          
          const pathLength = cameraPath.length;
          const cycleDuration = 4; // 4 seconds per car
          const totalCycleDuration = pathLength * cycleDuration;
          const progress = (exploreTimeRef.current % totalCycleDuration) / totalCycleDuration;
          const scaledProgress = progress * pathLength;
          const currentIndex = Math.floor(scaledProgress) % pathLength;
          const t = scaledProgress - Math.floor(scaledProgress);
          
          // Update current car index for display
          if (currentCarIndexRef.current !== currentIndex) {
            currentCarIndexRef.current = currentIndex;
            console.log('🎯 Auto viewing car:', cameraPath[currentIndex].carName, 'at position:', cameraPath[currentIndex].lookAt);
          }
          
          // Get current car position and create camera position around it
          const currentCar = cameraPath[currentIndex];
          const [carX, carY, carZ] = currentCar.lookAt;
          
          // Create circular motion around the car
          const angle = t * Math.PI * 2; // Full rotation per car
          const radius = 8;
          const height = 4;
          
          const cameraX = carX + Math.cos(angle) * radius;
          const cameraY = carY + height + Math.sin(exploreTimeRef.current * 0.5) * 1; // Gentle up/down
          const cameraZ = carZ + Math.sin(angle) * radius;
          
          // Set camera position and look at car
          targetPositionRef.current.set(cameraX, cameraY, cameraZ);
          targetLookAtRef.current.set(carX, carY, carZ);
          
          // Apply smooth camera movement
          camera.position.lerp(targetPositionRef.current, delta * 2);
          camera.lookAt(targetLookAtRef.current);
        }
      }
    } else {
      // Garage mode - enable OrbitControls
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
        orbitControlsRef.current.target.set(0, 0, 0);
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
      currentCarIndexRef.current = 0;
    } else if (mode === 'explore') {
      // Reset explore mode
      exploreTimeRef.current = 0;
      currentCarIndexRef.current = 0;
      if (cameraPath.length > 0) {
        console.log('🎯 Starting explore mode with car:', cameraPath[0].carName);
      }
    }
  }, [mode, cameraPath]);

  return (
    <>
      {(mode === 'garage' || (mode === 'explore' && exploreSubMode === 'manual')) && (
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          enableDamping={true}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2}
          target={mode === 'garage' ? [0, 0, 0] : undefined}
        />
      )}
    </>
  );
}
