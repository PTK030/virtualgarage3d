import { useState } from 'react';

export interface CarData {
  id: number;
  color: string;
  position: [number, number, number];
  name: string;
  modelPath: string;
  isCustom?: boolean;
}

export function useGarage() {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [customModelCounter, setCustomModelCounter] = useState(1);
  const [cars, setCars] = useState<CarData[]>([
    { 
      id: 0, 
      color: '#3b82f6', 
      position: [-6, -1.5, 0], 
      name: 'Blue Racer',
      modelPath: '/models/car1.glb'
    },
    { 
      id: 1, 
      color: '#8b5cf6', 
      position: [0, -1.5, 0], 
      name: 'Purple Storm',
      modelPath: '/models/car2.glb'
    },
    { 
      id: 2, 
      color: '#06b6d4', 
      position: [6, -1.5, 0], 
      name: 'Cyan Flash',
      modelPath: '/models/car3.glb'
    },
  ]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const blob = new Blob([event.target?.result as ArrayBuffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      
      // Generate random position
      const randomX = (Math.random() - 0.5) * 10;
      const randomZ = (Math.random() - 0.5) * 8;
      
      const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8c94'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newCar: CarData = {
        id: Date.now(),
        color: randomColor,
        position: [randomX, -1.5, randomZ],
        name: `Custom Model #${customModelCounter}`,
        modelPath: url,
        isCustom: true
      };
      
      setCars(prev => [...prev, newCar]);
      setCustomModelCounter(prev => prev + 1);
      
      console.log('✅ Custom model uploaded:', file.name);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const updateCar = (id: number, updates: Partial<CarData>) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
  };

  const deleteCar = (id: number) => {
    setCars(prev => prev.filter(car => car.id !== id));
    if (selectedCar === id) {
      setSelectedCar(null);
    }
  };

  const resetPosition = (id: number) => {
    const car = cars.find(c => c.id === id);
    if (car && car.isCustom) {
      // Generate new random position for custom models
      const randomX = (Math.random() - 0.5) * 10;
      const randomZ = (Math.random() - 0.5) * 8;
      updateCar(id, { position: [randomX, -1.5, randomZ] });
    } else {
      // Reset to original position for default models
      const originalPositions: { [key: number]: [number, number, number] } = {
        0: [-6, -1.5, 0],
        1: [0, -1.5, 0],
        2: [6, -1.5, 0],
      };
      if (originalPositions[id]) {
        updateCar(id, { position: originalPositions[id] });
      }
    }
  };

  return {
    cars,
    selectedCar,
    setSelectedCar,
    handleFileUpload,
    updateCar,
    deleteCar,
    resetPosition
  };
}
