import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GradientBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = clock.getElapsedTime() * 0.1;
    }
  });

  const gradientShader = {
    uniforms: {
      color1: { value: new THREE.Color('#0b0b0b') },
      color2: { value: new THREE.Color('#1a1a1a') },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        float gradient = vUv.y + sin(vUv.x * 3.0 + time) * 0.1;
        vec3 color = mix(color1, color2, gradient);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  };

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        attach="material"
        args={[gradientShader]}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
