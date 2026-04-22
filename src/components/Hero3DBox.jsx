import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';

function GlassicOrb() {
  const outerRef = useRef();
  const innerRef = useRef();
  
  useFrame((state, delta) => {
    if (outerRef.current && innerRef.current) {
        outerRef.current.rotation.x += delta * 0.15;
        outerRef.current.rotation.y += delta * 0.2;
        
        innerRef.current.rotation.x -= delta * 0.4;
        innerRef.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group>
      {/* Outer Glass Sphere */}
      <mesh ref={outerRef} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial 
          transmission={1}
          opacity={1}
          metalness={0.1}
          roughness={0.05}
          ior={1.5}
          thickness={2.0}
          specularIntensity={1}
          specularColor="#ffffff"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#ffffff"
        />
      </mesh>
      
      {/* Inner Glowing Core - Luxury Gold */}
      <mesh ref={innerRef} scale={0.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#d9b360"
          emissive="#d9b360"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          wireframe={true}
        />
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
          <GlassicOrb />
        </Float>
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
