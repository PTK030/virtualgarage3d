import { useState } from 'react';
import { Car } from './Car';

export function Garage() {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);

  const cars = [
    { id: 0, color: '#3b82f6', position: [-4, 0, 0] as [number, number, number], name: 'Blue Racer' },
    { id: 1, color: '#8b5cf6', position: [0, 0, 0] as [number, number, number], name: 'Purple Storm' },
    { id: 2, color: '#06b6d4', position: [4, 0, 0] as [number, number, number], name: 'Cyan Flash' },
  ];

  return (
    <group>
      {cars.map((car) => (
        <group
          key={car.id}
          onClick={() => setSelectedCar(car.id)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <Car
            color={car.color}
            position={car.position}
            name={car.name}
            isSelected={selectedCar === car.id}
          />
        </group>
      ))}
    </group>
  );
}
