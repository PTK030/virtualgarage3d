import { useState, useEffect } from 'react';

export interface CarData {
  id: number;
  color: string;
  position: [number, number, number];
  name: string;
  modelPath: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'virtualgarage3d_state';

const defaultCars: CarData[] = [
  { 
    id: 0, 
    color: '#3b82f6', 
    position: [-6, -1.5, 0], 
    name: 'Mercedes W204 63 AMG',
    modelPath: '/models/car1.glb'
  },
  { 
    id: 1, 
    color: '#8b5cf6', 
    position: [0, -1.5, 0], 
    name: 'Porsche 911 Turbo S',
    modelPath: '/models/car2.glb'
  },
  { 
    id: 2, 
    color: '#06b6d4', 
    position: [6, -1.5, 0], 
    name: 'BMW M4 Competition',
    modelPath: '/models/car3.glb'
  },
];

export function useGarage() {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [customModelCounter, setCustomModelCounter] = useState(1);
  const [cars, setCars] = useState<CarData[]>(defaultCars);

  // Load garage state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cars && Array.isArray(parsed.cars)) {
          setCars(parsed.cars);
          setCustomModelCounter(parsed.customModelCounter || 1);
          console.log('✅ Garage loaded from localStorage');
        }
      }
    } catch (error) {
      console.warn('Failed to load garage from localStorage:', error);
    }
  }, []);

  // Save garage state to localStorage whenever cars change
  useEffect(() => {
    try {
      const state = {
        cars,
        customModelCounter,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save garage to localStorage:', error);
    }
  }, [cars, customModelCounter]);

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
      const originalData: { [key: number]: { position: [number, number, number], name: string } } = {
        0: { position: [-6, -1.5, 0], name: 'Mercedes W204 63 AMG' },
        1: { position: [0, -1.5, 0], name: 'Porsche 911 Turbo S' },
        2: { position: [6, -1.5, 0], name: 'BMW M4 Competition' },
      };
      if (originalData[id]) {
        updateCar(id, { 
          position: originalData[id].position,
          name: originalData[id].name
        });
      }
    }
  };

  const saveGarage = () => {
    try {
      const state = {
        cars,
        customModelCounter,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Failed to save garage:', error);
      return false;
    }
  };

  const clearGarage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCars(defaultCars);
      setCustomModelCounter(1);
      setSelectedCar(null);
      return true;
    } catch (error) {
      console.error('Failed to clear garage:', error);
      return false;
    }
  };

  return {
    cars,
    selectedCar,
    setSelectedCar,
    handleFileUpload,
    updateCar,
    deleteCar,
    resetPosition,
    saveGarage,
    clearGarage
  };
}
