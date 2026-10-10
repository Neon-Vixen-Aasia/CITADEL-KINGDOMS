import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Torus, Cylinder, Cone, Box } from '@react-three/drei';

interface BubbleCoreProps {
  reducedMotion?: boolean;
}

export const BubbleCore: React.FC<BubbleCoreProps> = ({ reducedMotion = false }) => {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const weaponsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(t * 0.8) * 0.25;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.35;
      ring1Ref.current.rotation.y = t * 0.45;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.z = t * 0.35;
    }

    if (weaponsRef.current) {
      weaponsRef.current.rotation.y = t * 0.5;
    }

    if (innerSphereRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      innerSphereRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={coreRef} position={[0, 1.8, 0]}>
      {/* Outer translucent Royal Sunstone Aegis */}
      <Sphere args={[2.0, 32, 32]}>
        <meshPhysicalMaterial
          color="#f59e0b"
          roughness={0.15}
          metalness={0.4}
          transmission={0.8}
          thickness={1.4}
          transparent
          opacity={0.85}
          emissive="#d97706"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Inner pulsating Golden Lion Heart of the Citadel */}
      <Sphere ref={innerSphereRef} args={[1.2, 24, 24]}>
        <meshStandardMaterial
          color="#fef08a"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Orbiting Chivalric Steel & Brass Armor Rings */}
      <Torus ref={ring1Ref} args={[2.5, 0.06, 16, 64]}>
        <meshStandardMaterial 
          color="#d97706" 
          emissive="#b45309"
          emissiveIntensity={0.6}
          metalness={0.9} 
          roughness={0.2} 
        />
      </Torus>

      <Torus ref={ring2Ref} args={[2.8, 0.05, 16, 64]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial 
          color="#94a3b8" 
          emissive="#64748b" 
          emissiveIntensity={0.4}
          metalness={0.95} 
          roughness={0.15} 
        />
      </Torus>

      {/* Sovereign Royal Crown atop the Core */}
      <group position={[0, 1.9, 0]}>
        {/* Crown Rim */}
        <Cylinder args={[0.9, 0.9, 0.25, 16]}>
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </Cylinder>
        {/* Crown Spikes */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI * 2) / 6;
          const px = Math.sin(angle) * 0.85;
          const pz = Math.cos(angle) * 0.85;
          return (
            <Cone 
              key={i} 
              args={[0.16, 0.45, 8]} 
              position={[px, 0.3, pz]}
              rotation={[0, 0, 0]}
            >
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
            </Cone>
          );
        })}
      </group>

      {/* Orbiting Crossed Broadswords / Halberds Emblem */}
      <group ref={weaponsRef}>
        {/* Sword 1 */}
        <group rotation={[0, 0, Math.PI / 4]}>
          <Box args={[0.08, 3.2, 0.04]}>
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </Box>
          {/* Crossguard */}
          <Box args={[0.65, 0.1, 0.08]} position={[0, -1.0, 0]}>
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </Box>
        </group>
        {/* Sword 2 */}
        <group rotation={[0, 0, -Math.PI / 4]}>
          <Box args={[0.08, 3.2, 0.04]}>
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </Box>
          {/* Crossguard */}
          <Box args={[0.65, 0.1, 0.08]} position={[0, -1.0, 0]}>
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </Box>
        </group>
      </group>

      {/* Sovereign Warm Hearth & Forge Lights */}
      <pointLight color="#f59e0b" intensity={3.5} distance={18} />
      <pointLight color="#ef4444" intensity={1.8} distance={12} />
    </group>
  );
};
