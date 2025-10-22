import { Car } from './Car';
import { useGLTF } from '@react-three/drei';
import { type CarData } from '../hooks/useGarage';

// Preload models
useGLTF.preload('/models/car1.glb');
useGLTF.preload('/models/car2.glb');
useGLTF.preload('/models/car3.glb');

interface GarageProps {
  cars: CarData[];
  selectedCar: number | null;
  onSelectCar: (id: number) => void;
}

export function Garage({ cars, selectedCar, onSelectCar }: GarageProps) {

  return (
    <group>
      {cars.map((car) => (
        <group
          key={car.id}
          onClick={() => onSelectCar(car.id)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <Car
            color={car.color}
            position={car.position}
            name={car.name}
            isSelected={selectedCar === car.id}
            modelPath={car.modelPath}
          />
        </group>
      ))}
    </group>
  );
}
