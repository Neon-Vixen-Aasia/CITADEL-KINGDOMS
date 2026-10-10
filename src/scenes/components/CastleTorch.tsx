import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Cylinder, Cone, Box, Sphere } from '@react-three/drei';

interface CastleTorchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  type?: 'sconce' | 'brazier' | 'pole';
  reducedMotion?: boolean;
}

export const CastleTorch: React.FC<CastleTorchProps> = ({
  position,
  rotation = [0, 0, 0],
  type = 'sconce',
  reducedMotion = false,
}) => {
  const innerFlameRef = useRef<THREE.Mesh>(null);
  const outerFlameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    // Unique phase based on position
    const phase = position[0] * 3.1 + position[2] * 7.3;

    // Organic chaotic flame flicker
    const f1 = Math.sin(t * 14 + phase) * 0.12 + Math.cos(t * 23 + phase) * 0.08;
    const f2 = Math.sin(t * 18 + phase * 1.5) * 0.15;

    if (innerFlameRef.current) {
      innerFlameRef.current.scale.set(1 + f1 * 0.6, 1 + f1 * 1.2, 1 + f1 * 0.6);
      innerFlameRef.current.rotation.y = t * 2;
    }

    if (outerFlameRef.current) {
      outerFlameRef.current.scale.set(1 + f2, 1 + f2 * 1.5, 1 + f2);
    }

    if (lightRef.current) {
      // Natural fire luminosity breathing
      lightRef.current.intensity = 2.4 + (f1 + f2) * 1.2;
    }
  });

  if (type === 'brazier') {
    return (
      <group position={position} rotation={rotation}>
        {/* Carved Stone Pedestal */}
        <Cylinder args={[0.42, 0.58, 1.1, 8]} position={[0, 0.55, 0]}>
          <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
        </Cylinder>

        {/* Heavy Wrought Iron Fire Cauldron */}
        <Cylinder args={[0.7, 0.45, 0.5, 8]} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#0b0f19" roughness={0.6} metalness={0.8} />
        </Cylinder>

        {/* 4 Iron Cauldron Claw Brackets */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
          <group key={i} rotation={[0, ang, 0]}>
            <Box args={[0.08, 0.45, 0.2]} position={[0.62, 1.2, 0]}>
              <meshStandardMaterial color="#020617" metalness={0.9} />
            </Box>
          </group>
        ))}

        {/* Glowing Red-Hot Charcoal Bed */}
        <Cylinder args={[0.6, 0.4, 0.1, 8]} position={[0, 1.35, 0]}>
          <meshStandardMaterial
            color="#991b1b"
            emissive="#ea580c"
            emissiveIntensity={1.4}
            roughness={0.9}
          />
        </Cylinder>

        {/* Outer Amber Flame Teardrop */}
        <mesh ref={outerFlameRef} position={[0, 1.7, 0]}>
          <coneGeometry args={[0.38, 0.75, 8]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.85} />
        </mesh>

        {/* Inner Brilliant Gold Core Flame */}
        <mesh ref={innerFlameRef} position={[0, 1.6, 0]}>
          <coneGeometry args={[0.22, 0.55, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Torch Point Light */}
        <pointLight
          ref={lightRef}
          color="#f97316"
          intensity={2.6}
          distance={10}
          decay={2}
          position={[0, 1.85, 0]}
        />
      </group>
    );
  }

  // Wall-mounted iron sconce torch
  return (
    <group position={position} rotation={rotation}>
      {/* Iron Wall Mount Plate */}
      <Box args={[0.18, 0.45, 0.05]} position={[0, 0, -0.05]}>
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.4} />
      </Box>

      {/* Curved Iron Sconce Arm */}
      <Box args={[0.06, 0.06, 0.35]} position={[0, 0, 0.14]}>
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.4} />
      </Box>

      {/* Iron Torch Holder Ring */}
      <Cylinder args={[0.14, 0.1, 0.2, 8]} position={[0, 0.12, 0.28]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.5} />
      </Cylinder>

      {/* Wooden Torch Shaft with Pitch Wrapping */}
      <Cylinder args={[0.07, 0.06, 0.6, 8]} position={[0, 0.22, 0.28]}>
        <meshStandardMaterial color="#451a03" roughness={0.85} />
      </Cylinder>

      {/* Pitch-soaked Linen Head */}
      <Sphere args={[0.1, 8, 8]} position={[0, 0.5, 0.28]}>
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </Sphere>

      {/* Outer Dancing Flame */}
      <mesh ref={outerFlameRef} position={[0, 0.65, 0.28]}>
        <coneGeometry args={[0.18, 0.45, 7]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
      </mesh>

      {/* Inner Golden Core */}
      <mesh ref={innerFlameRef} position={[0, 0.6, 0.28]}>
        <coneGeometry args={[0.1, 0.3, 7]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* Warm Torchlight */}
      <pointLight
        ref={lightRef}
        color="#fb923c"
        intensity={2.2}
        distance={8}
        decay={2}
        position={[0, 0.7, 0.3]}
      />
    </group>
  );
};
