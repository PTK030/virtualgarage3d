import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ParticleField } from './ParticleField';
import { GradientBackground } from './GradientBackground';
import { Garage } from './Garage';
import { SceneLighting } from './SceneLighting';
import { CameraController } from './CameraController';
import { BackgroundLights } from './BackgroundLights';
import { NeonLights } from './NeonLights';
import { RainEffect } from './RainEffect';
import { DiscoLights } from './DiscoLights';
import { GravityOffEffect } from './GravityOffEffect';
import { ShowroomScene } from './ShowroomScene';
import { useGarageContext } from '../contexts/GarageContext';
import { useEffects } from '../contexts/EffectsContext';

export function SceneContent() {
  const { cars, selectedCar, setSelectedCar, sceneMode, cameraMode, exploreSubMode, updateCar } = useGarageContext();
  const { effects } = useEffects();
  
  // Handle camera car index changes in explore mode
  const handleCarIndexChange = (index: number) => {
    if (cameraMode === 'explore' && cars[index]) {
      const car = cars[index];
      console.log('🔄 Syncing UI selection - Index:', index, 'Car:', car.name, 'ID:', car.id);
      setSelectedCar(car.id);
    }
  };

  // Handle gravity off position updates
  const handleGravityPositionUpdate = (carId: number, newY: number) => {
    const car = cars.find(c => c.id === carId);
    if (car && car.position[1] !== newY) {
      updateCar(carId, { position: [car.position[0], newY, car.position[2]] });
    }
  };

  const cameraOffset = useRef({ x: 0, y: 0 });
  
  useFrame(({ camera, clock }) => {
    // Only apply default camera movement in garage mode
    if (cameraMode === 'garage') {
      // Smooth sinusoidal camera movement
      const time = clock.getElapsedTime();
      cameraOffset.current.x = Math.sin(time * 0.3) * 0.5;
      cameraOffset.current.y = Math.cos(time * 0.2) * 0.3;
      
      camera.position.x = cameraOffset.current.x;
      camera.position.y = 2 + cameraOffset.current.y;
      camera.lookAt(0, 0, 0);
    }
  });

  // Showroom Mode - single car presentation
  if (sceneMode === 'showroom') {
    const selectedCarData = cars.find(car => car.id === selectedCar);
    return (
      <ShowroomScene car={selectedCarData || cars[0] || null} />
    );
  }

  // Normal garage mode
  return (
    <>
      <GradientBackground />
      <ParticleField />
      
      {/* Camera controller for different modes */}
      <CameraController 
        mode={cameraMode} 
        exploreSubMode={exploreSubMode} 
        cars={cars} 
        onCarIndexChange={handleCarIndexChange}
      />
      
      {/* Dynamic lighting based on scene mode */}
      <SceneLighting mode={sceneMode} />
      
      {/* Pulsating background LED lights */}
      <BackgroundLights />
      
      {/* Special effects */}
      <NeonLights enabled={effects.neonMode} />
      <RainEffect enabled={effects.rainMode} count={1000} />
      <DiscoLights enabled={effects.discoMode} />
      <GravityOffEffect 
        enabled={effects.gravityOff} 
        cars={cars} 
        onPositionUpdate={handleGravityPositionUpdate} 
      />
      
      {/* Garage with cars */}
      <Garage cars={cars} selectedCar={selectedCar} onSelectCar={setSelectedCar} />
      
      {/* Ground plane for reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
    </>
  );
}
