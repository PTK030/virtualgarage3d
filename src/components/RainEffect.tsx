import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainEffectProps {
  enabled: boolean;
  count?: number;
}

export function RainEffect({ enabled, count = 1000 }: RainEffectProps) {
  const particlesRef = useRef<THREE.Points>(null!);
  const opacityRef = useRef(0);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(0));

  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random positions in a box above the scene
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      // Random velocities
      velocities[i] = Math.random() * 0.3 + 0.2;
    }

    velocitiesRef.current = velocities;
    return { positions, velocities };
  }, [count]);

  useFrame((_, delta) => {
    // Smooth opacity transition
    const targetOpacity = enabled ? 0.6 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * delta * 3;

    if (opacityRef.current < 0.01 && !enabled) return;

    if (particlesRef.current && velocitiesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = velocitiesRef.current;

      for (let i = 0; i < count; i++) {
        // Update Y position (falling)
        positions[i * 3 + 1] -= velocities[i] * delta * 50;

        // Reset to top when hitting ground
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 30 + Math.random() * 10;
          positions[i * 3] = (Math.random() - 0.5) * 60;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Update material opacity
      if (particlesRef.current.material instanceof THREE.PointsMaterial) {
        particlesRef.current.material.opacity = opacityRef.current;
      }
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.15,
      color: '#88ccff',
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  return <points ref={particlesRef} geometry={geometry} material={material} />;
}
