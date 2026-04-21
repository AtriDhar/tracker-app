import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

function Dumbbell() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.15;
        meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Handle */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 2.5, 32]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Left Weights */}
      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[-1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Right Weights */}
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Hero3DBox() {
  return (
    <div style={{ height: '350px', width: '100%', position: 'relative', marginTop: '-40px', marginBottom: '-20px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Dumbbell />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
