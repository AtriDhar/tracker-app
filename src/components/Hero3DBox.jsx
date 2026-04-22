import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';

function AbstractInfinityCore() {
  const coreRef = useRef();
  const ringRef = useRef();
  
  useFrame((state, delta) => {
    if (coreRef.current && ringRef.current) {
        coreRef.current.rotation.x += delta * 0.2;
        coreRef.current.rotation.y += delta * 0.3;
        
        ringRef.current.rotation.x -= delta * 0.1;
        ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Outer abstract ring */}
      <mesh ref={ringRef} scale={1.2}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#d9b360" metalness={1} roughness={0.15} />
      </mesh>
      
      {/* Inner premium poly core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#2d2d38" 
          metalness={0.8} 
          roughness={0.2} 
          wireframe={false}
        />
        {/* Subtle wireframe overlay for tech feel */}
        <mesh>
           <icosahedronGeometry args={[1.01, 1]} />
           <meshBasicMaterial color="#d9b360" wireframe={true} opacity={0.2} transparent={true} />
        </mesh>
      </mesh>
    </group>
  );
}

export default function Hero3DBox() {
  return (
    <div style={{ height: '380px', width: '100%', position: 'relative', marginTop: '-40px', marginBottom: '-20px' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#46345d" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
          <AbstractInfinityCore />
        </Float>
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
