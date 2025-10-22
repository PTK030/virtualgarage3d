import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { SceneContent } from './SceneContent';

export function Scene3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        className="w-full h-full"
        gl={{ alpha: false, antialias: true }}
      >
      {/* Gradient Background */}
      <color attach="background" args={['#0b0b0b']} />
      
      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={['#0b0b0b', 10, 50]} />
      
      {/* Lighting Setup */}
      <ambientLight intensity={1.5} />
      <spotLight
        position={[10, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={500}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[0, 10, 5]} intensity={2} />
      
      {/* Point Lights with cool tones */}
      <pointLight position={[-10, 5, -10]} intensity={50} color="#3b82f6" />
      <pointLight position={[10, 3, -5]} intensity={40} color="#8b5cf6" />
      <pointLight position={[0, -2, 5]} intensity={30} color="#06b6d4" />
      <pointLight position={[-5, 8, 10]} intensity={35} color="#6366f1" />
      
      <SceneContent />
      
      <Environment preset="night" />
    </Canvas>
    </div>
  );
}
