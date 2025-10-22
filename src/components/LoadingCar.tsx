export function LoadingCar() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial 
          color="#333333"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={5} color="#ffffff" />
    </group>
  );
}
