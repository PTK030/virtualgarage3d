import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import { CarModel } from './CarModel';
import type { CarData } from '../hooks/useGarage';

interface CarThumbnailProps {
  car: CarData;
  isSelected: boolean;
  onClick: () => void;
}

function ThumbnailScene({ car }: { car: CarData }) {
  return (
    <>
      {/* Lighting for thumbnail */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
      
      {/* Car model at origin */}
      <CarModel 
        car={car}
        position={[0, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        color={car.color}
        isSelected={false}
      />
    </>
  );
}

export function CarThumbnail({ car, isSelected, onClick }: CarThumbnailProps) {
  // Memoize canvas to prevent unnecessary re-renders
  const canvasKey = useMemo(() => `${car.id}-${car.color}`, [car.id, car.color]);

  return (
    <div
      onClick={onClick}
      className="thumbnail-container"
      style={{
        width: '100%',
        height: '80px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))'
          : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: isSelected 
          ? '2px solid rgba(16, 185, 129, 0.6)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isSelected
          ? '0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = isSelected 
          ? 'rgba(16, 185, 129, 0.6)'
          : 'rgba(255, 255, 255, 0.1)';
      }}
    >
      <Canvas
        key={canvasKey}
        camera={{ 
          position: [3, 2, 3], 
          fov: 50,
          near: 0.1,
          far: 100
        }}
        gl={{ 
          alpha: true, 
          antialias: true,
          preserveDrawingBuffer: true 
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        <Suspense fallback={null}>
          <ThumbnailScene car={car} />
        </Suspense>
      </Canvas>
      
      {/* Glassmorphism overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
