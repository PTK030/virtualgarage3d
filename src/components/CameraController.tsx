import { useRef, useEffect, useMemo } from 'react';
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
  const isTransitioningRef = useRef(false);
  const lastManualCarIndexRef = useRef(0);

  // Generate camera positions based on actual car positions
  const generateCameraPath = useMemo(() => {
    if (cars.length === 0) return [];
    
    console.log('🚗 Generating camera path for', cars.length, 'cars');
    
    return cars.map((car, index) => {
      const [x, y, z] = car.position;
      console.log(`Car ${index}: ${car.name} (ID: ${car.id}) at [${x}, ${y}, ${z}]`);
      return {
        position: [x + 6, y + 4, z + 6], // Slightly further offset for better view
        lookAt: [x, y + 0.5, z], // Look slightly above car center
        carIndex: index,
        carId: car.id, // Store actual car ID
        carName: car.name
      };
    });
  }, [cars]);

  const cameraPath = generateCameraPath;

  // Keyboard controls for manual explore mode
  useEffect(() => {
    if (mode === 'explore' && exploreSubMode === 'manual') {
      let keyPressed = false;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (cameraPath.length === 0 || keyPressed) return;
        
        // Prevent default to avoid page scrolling
        if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
          e.preventDefault();
          keyPressed = true;
        }
        
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
          case 'A':
            currentCarIndexRef.current = (currentCarIndexRef.current - 1 + cameraPath.length) % cameraPath.length;
            lastManualCarIndexRef.current = currentCarIndexRef.current;
            isTransitioningRef.current = true; // Force camera transition
            const leftCar = cameraPath[currentCarIndexRef.current];
            if (leftCar && leftCar.carName) {
              console.log('🎯 Manual switching to car:', leftCar.carName, 'Index:', currentCarIndexRef.current);
              onCarIndexChange?.(currentCarIndexRef.current);
            }
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            currentCarIndexRef.current = (currentCarIndexRef.current + 1) % cameraPath.length;
            lastManualCarIndexRef.current = currentCarIndexRef.current;
            isTransitioningRef.current = true; // Force camera transition
            const rightCar = cameraPath[currentCarIndexRef.current];
            if (rightCar && rightCar.carName) {
              console.log('🎯 Manual switching to car:', rightCar.carName, 'Index:', currentCarIndexRef.current);
              onCarIndexChange?.(currentCarIndexRef.current);
            }
            break;
        }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
          keyPressed = false;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [mode, exploreSubMode, cameraPath, onCarIndexChange]);

  useFrame((_, delta) => {
    if (mode === 'explore') {
      if (exploreSubMode === 'manual') {
        // Manual mode - smooth transitions between cars
        if (cameraPath && cameraPath.length > 0 && cameraPath[currentCarIndexRef.current]) {
          const currentCar = cameraPath[currentCarIndexRef.current];
          if (currentCar && currentCar.lookAt) {
            const [carX, carY, carZ] = currentCar.lookAt;
            
            // Set target position for current car
            const idealDistance = 8;
            const idealHeight = 5;
            const currentDistance = camera.position.distanceTo(new THREE.Vector3(carX, carY, carZ));
            
            // Check if we need to transition - only when manually switching or very far away
            const needsTransition = isTransitioningRef.current || currentDistance > 20;
            
            if (needsTransition) {
              // Update last manual car index
              lastManualCarIndexRef.current = currentCarIndexRef.current;
              
              // Set new target position
              targetPositionRef.current.set(carX + idealDistance, carY + idealHeight, carZ + idealDistance);
              targetLookAtRef.current.set(carX, carY + 0.5, carZ);
              
              // Smooth transition to new car
              camera.position.lerp(targetPositionRef.current, delta * 3);
              camera.lookAt(targetLookAtRef.current);
              
              // Check if transition is complete
              const newDistance = camera.position.distanceTo(targetPositionRef.current);
              if (newDistance < 1.5) {
                isTransitioningRef.current = false;
                console.log('✅ Transition complete to:', currentCar.carName);
                
                // Update OrbitControls target after transition
                if (orbitControlsRef.current) {
                  orbitControlsRef.current.target.set(carX, carY + 0.5, carZ);
                  orbitControlsRef.current.update();
                }
              }
            } else {
              // Update OrbitControls target when not transitioning
              if (orbitControlsRef.current && orbitControlsRef.current.enabled) {
                orbitControlsRef.current.target.set(carX, carY + 0.5, carZ);
                orbitControlsRef.current.update();
              }
            }
          } else {
            console.warn('⚠️ Invalid car data in manual mode:', currentCarIndexRef.current);
          }
        }
      } else {
        // Auto mode - OrbitControls is already disabled via enabled prop

        if (cameraPath && cameraPath.length > 0) {
          exploreTimeRef.current += delta * 0.4;
          
          const pathLength = cameraPath.length;
          const cycleDuration = 6; // 6 seconds per car
          const totalCycleDuration = pathLength * cycleDuration;
          const progress = (exploreTimeRef.current % totalCycleDuration) / totalCycleDuration;
          const scaledProgress = progress * pathLength;
          const currentIndex = Math.floor(scaledProgress) % pathLength;
          const t = scaledProgress - Math.floor(scaledProgress);
          
          // Ensure currentIndex is valid and car exists
          if (currentIndex >= 0 && currentIndex < cameraPath.length) {
            const currentCar = cameraPath[currentIndex];
            if (currentCar && currentCar.carName && currentCar.lookAt) {
              // Update current car index for display
              if (currentCarIndexRef.current !== currentIndex) {
                currentCarIndexRef.current = currentIndex;
                console.log('🎯 Auto viewing car:', currentCar.carName, 'ID:', currentCar.carId, 'Index:', currentIndex, 'Time:', exploreTimeRef.current.toFixed(2));
                onCarIndexChange?.(currentIndex);
              }
              
              // Get current car position
              const [carX, carY, carZ] = currentCar.lookAt;
              
              // Multi-phase camera movement for each car
              const phase1Duration = 0.3; // 30% - approach and circle
              const phase2Duration = 0.4; // 40% - detailed inspection
              const phase3Duration = 0.3; // 30% - departure
              
              let cameraX, cameraY, cameraZ;
              
              if (t < phase1Duration) {
                // Phase 1: Approach and start circling
                const phaseT = t / phase1Duration;
                const easeT = phaseT * phaseT * (3 - 2 * phaseT); // Smooth step
                
                const angle = easeT * Math.PI * 0.5; // Quarter circle approach
                const radius = 12 - easeT * 4; // Start far, get closer
                const height = 6 + easeT * 2; // Rise up
                
                cameraX = carX + Math.cos(angle) * radius;
                cameraY = carY + height;
                cameraZ = carZ + Math.sin(angle) * radius;
                
              } else if (t < phase1Duration + phase2Duration) {
                // Phase 2: Detailed inspection - slow orbit
                const phaseT = (t - phase1Duration) / phase2Duration;
                const angle = Math.PI * 0.5 + phaseT * Math.PI * 1.2; // Continue orbiting
                const radius = 8 + Math.sin(phaseT * Math.PI * 2) * 1; // Slight radius variation
                const height = 8 + Math.sin(phaseT * Math.PI * 3) * 0.8; // Gentle height variation
                
                cameraX = carX + Math.cos(angle) * radius;
                cameraY = carY + height;
                cameraZ = carZ + Math.sin(angle) * radius;
                
              } else {
                // Phase 3: Departure - move away smoothly
                const phaseT = (t - phase1Duration - phase2Duration) / phase3Duration;
                const easeT = 1 - (1 - phaseT) * (1 - phaseT); // Ease out
                
                const angle = Math.PI * 1.7 + easeT * Math.PI * 0.3; // Complete the circle
                const radius = 8 + easeT * 6; // Move away
                const height = 8 - easeT * 2; // Lower down
                
                cameraX = carX + Math.cos(angle) * radius;
                cameraY = carY + height;
                cameraZ = carZ + Math.sin(angle) * radius;
              }
              
              // Set target position
              targetPositionRef.current.set(cameraX, cameraY, cameraZ);
              targetLookAtRef.current.set(carX, carY + 0.5, carZ);
              
              // Smooth camera movement
              camera.position.lerp(targetPositionRef.current, delta * 1.5);
              camera.lookAt(targetLookAtRef.current);
            } else {
              console.warn('⚠️ Invalid car at index during update:', currentIndex, currentCar);
            }
          } else {
            console.warn('⚠️ Invalid camera path index:', currentIndex, 'Path length:', cameraPath.length);
          }
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
      lastManualCarIndexRef.current = 0;
      isTransitioningRef.current = false;
      
      // Set OrbitControls target for garage mode
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, 0, 0);
        orbitControlsRef.current.update();
      }
    } else if (mode === 'explore') {
      // Reset explore mode - start with a small delay to ensure first car is shown
      exploreTimeRef.current = -0.5; // Start slightly before 0 to ensure first car shows
      currentCarIndexRef.current = 0;
      lastManualCarIndexRef.current = 0;
      isTransitioningRef.current = true; // Force initial transition
      if (cameraPath.length > 0 && cameraPath[0] && cameraPath[0].carName) {
        console.log('🎯 Starting explore mode with car:', cameraPath[0].carName, 'Reset time to:', exploreTimeRef.current);
        // Immediately sync UI to first car
        onCarIndexChange?.(0);
      }
    }
  }, [mode, cameraPath, onCarIndexChange]);

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enabled={mode === 'garage' || (mode === 'explore' && exploreSubMode === 'manual' && !isTransitioningRef.current)}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        enableDamping={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
