import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ParticleField } from './ParticleField';
import { GradientBackground } from './GradientBackground';
import { Garage } from './Garage';
import { useGarageContext } from '../contexts/GarageContext';

export function SceneContent() {
  const { cars, selectedCar, setSelectedCar } = useGarageContext();
  const cameraOffset = useRef({ x: 0, y: 0 });
  
  useFrame(({ camera, clock }) => {
    // Smooth sinusoidal camera movement
    const time = clock.getElapsedTime();
    cameraOffset.current.x = Math.sin(time * 0.3) * 0.5;
    cameraOffset.current.y = Math.cos(time * 0.2) * 0.3;
    
    camera.position.x = cameraOffset.current.x;
    camera.position.y = 2 + cameraOffset.current.y;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <GradientBackground />
      <ParticleField />
      
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
