import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { SceneContent } from './SceneContent';
import { useGarageContext } from '../contexts/GarageContext';

function SceneBackground() {
  const { sceneMode } = useGarageContext();
  
  const backgrounds = {
    explore: '#0b0b0b',
    neon: '#0a0a1a',
    rain: '#0d1520',
    showroom: '#1a1a1a'
  };
  
  const fogColors = {
    explore: '#0b0b0b',
    neon: '#0a0a1a',
    rain: '#1a2532',
    showroom: '#1a1a1a'
  };
  
  return (
    <>
      <color attach="background" args={[backgrounds[sceneMode]]} />
      <fog attach="fog" args={[fogColors[sceneMode], 10, 50]} />
    </>
  );
}

export function Scene3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        className="w-full h-full"
        gl={{ alpha: false, antialias: true }}
      >
      <SceneBackground />
      
      {/* Lighting is now handled by SceneLighting component based on mode */}
      
      <SceneContent />
      
      <Environment preset="night" />
    </Canvas>
    </div>
  );
}
