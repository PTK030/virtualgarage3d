import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CarModel } from './CarModel';
import type { CarData } from '../hooks/useGarage';

interface ShowroomSceneProps {
  car: CarData | null;
}

export function ShowroomScene({ car }: ShowroomSceneProps) {
  const cameraTimeRef = useRef(0);

  // Orbit camera around the car
  useFrame(({ camera }, delta) => {
    if (!car) return;
    
    cameraTimeRef.current += delta * 0.15; // Slow orbit
    
    const radius = 10;
    const height = 4;
    const [carX, carY, carZ] = car.position;
    
    camera.position.x = carX + Math.cos(cameraTimeRef.current) * radius;
    camera.position.y = carY + height;
    camera.position.z = carZ + Math.sin(cameraTimeRef.current) * radius;
    camera.lookAt(carX, carY + 0.5, carZ);
  });

  if (!car) return null;

  return (
    <>
      {/* Dark gradient background */}
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 10, 50]} />
      
      {/* Dramatic spotlight */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill lights for better visibility */}
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ffffff" />
      
      {/* Rim light for edge glow */}
      <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#667eea" />
      
      {/* Ambient for base visibility */}
      <ambientLight intensity={0.1} />
      
      {/* The featured car */}
      <CarModel
        car={car}
        position={car.position}
        rotation={[0, 0, 0]}
        color={car.color}
        isSelected={true}
      />
      
      {/* Reflective floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[car.position[0], car.position[1] - 2, car.position[2]]} 
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Subtle circular platform */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[car.position[0], car.position[1] - 1.95, car.position[2]]}
      >
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.5}
          roughness={0.5}
          emissive="#667eea"
          emissiveIntensity={0.1}
        />
      </mesh>
    </>
  );
}
