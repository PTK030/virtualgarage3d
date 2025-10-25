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
  onCarIndexChange?: (index: number) => void;
}

export function CameraController({ mode, exploreSubMode, cars, onCarIndexChange }: CameraControllerProps) {
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
        position: [x + 6, y + 4, z + 6], // Slightly further offset for better view
        lookAt: [x, y + 0.5, z], // Look slightly above car center
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
            onCarIndexChange?.(currentCarIndexRef.current);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            currentCarIndexRef.current = (currentCarIndexRef.current + 1) % cameraPath.length;
            console.log('🎯 Manual switching to car:', cameraPath[currentCarIndexRef.current].carName, 'Index:', currentCarIndexRef.current);
            onCarIndexChange?.(currentCarIndexRef.current);
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
          exploreTimeRef.current += delta * 0.3; // Much slower progression
          
          const pathLength = cameraPath.length;
          const cycleDuration = 8; // 8 seconds per car (doubled)
          const totalCycleDuration = pathLength * cycleDuration;
          const progress = (exploreTimeRef.current % totalCycleDuration) / totalCycleDuration;
          const scaledProgress = progress * pathLength;
          const currentIndex = Math.floor(scaledProgress) % pathLength;
          const t = scaledProgress - Math.floor(scaledProgress);
          
          // Update current car index for display
          if (currentCarIndexRef.current !== currentIndex) {
            currentCarIndexRef.current = currentIndex;
            console.log('🎯 Auto viewing car:', cameraPath[currentIndex].carName, 'at position:', cameraPath[currentIndex].lookAt);
            onCarIndexChange?.(currentIndex);
          }
          
          // Get current car position and create camera position around it
          const currentCar = cameraPath[currentIndex];
          const [carX, carY, carZ] = currentCar.lookAt;
          
          // Create smoother circular motion around the car
          const baseAngle = t * Math.PI * 1.5; // Slower rotation (3/4 circle per car)
          const radius = 10; // Slightly larger radius
          const height = 5; // Higher camera position
          
          // Add smooth easing to the angle for more natural movement
          const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // Ease in-out quad
          const smoothAngle = easedT * Math.PI * 1.5;
          
          const cameraX = carX + Math.cos(smoothAngle) * radius;
          const cameraY = carY + height + Math.sin(exploreTimeRef.current * 0.2) * 0.5; // Gentler up/down
          const cameraZ = carZ + Math.sin(smoothAngle) * radius;
          
          // Set camera position and look at car
          targetPositionRef.current.set(cameraX, cameraY, cameraZ);
          targetLookAtRef.current.set(carX, carY, carZ);
          
          // Much smoother camera movement with slower lerp
          camera.position.lerp(targetPositionRef.current, delta * 0.8);
          
          // Smooth look-at with slight delay for more natural feel
          const lookAtTarget = new THREE.Vector3(carX, carY, carZ);
          const currentLookAt = new THREE.Vector3();
          camera.getWorldDirection(currentLookAt);
          currentLookAt.multiplyScalar(-1).add(camera.position);
          
          currentLookAt.lerp(lookAtTarget, delta * 1.2);
          camera.lookAt(currentLookAt);
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
