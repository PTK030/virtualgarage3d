import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  
  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in 3D space
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;
      
      // Cool colors (blue, cyan, purple)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 0.23; // Blue
        colors[i3 + 1] = 0.51;
        colors[i3 + 2] = 0.96;
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.54; // Purple
        colors[i3 + 1] = 0.36;
        colors[i3 + 2] = 0.96;
      } else {
        colors[i3] = 0.02; // Cyan
        colors[i3 + 1] = 0.71;
        colors[i3 + 2] = 0.83;
      }
      
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    
    return { positions, colors, speeds };
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Floating movement
        positions[i3 + 1] += Math.sin(time * speeds[i]) * 0.01;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotate particle field slowly
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
