import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Cylinder, Sphere, Box } from '@react-three/drei';
import { createHeraldicBannerTexture } from './CastleTextures';

interface CastleBannerProps {
  theme: 'suncrest' | 'vanguard' | 'chronicler' | 'bastion';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  reducedMotion?: boolean;
}

export const CastleBanner: React.FC<CastleBannerProps> = ({
  theme,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  reducedMotion = false,
}) => {
  const bannerGroupRef = useRef<THREE.Group>(null);
  const clothRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => createHeraldicBannerTexture(theme), [theme]);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const phase = position[0] * 1.7 + position[2] * 2.3;

    // Gentle banner cloth fluttering in the fortress rampart breeze
    if (clothRef.current) {
      clothRef.current.rotation.x = Math.sin(t * 1.8 + phase) * 0.05 + 0.02;
      clothRef.current.rotation.z = Math.cos(t * 1.2 + phase) * 0.03;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone Wall Mount Bracket */}
      <Box args={[0.2, 0.4, 0.3]} position={[0, 0, -0.15]}>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </Box>

      {/* Heavy Horizontal Wrought Iron Crossbar */}
      <Cylinder args={[0.04, 0.04, 1.8, 8]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#020617" metalness={0.85} roughness={0.3} />
      </Cylinder>

      {/* Brass Spearhead Finials at Crossbar Ends */}
      {[-0.92, 0.92].map((x, i) => (
        <group key={i} position={[x, 0, 0]} rotation={[0, 0, i === 0 ? Math.PI / 2 : -Math.PI / 2]}>
          <Sphere args={[0.08, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </Sphere>
          <mesh position={[0, 0.12, 0]}>
            <coneGeometry args={[0.07, 0.22, 6]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Hanging Iron Rings supporting the tapestry */}
      {[-0.6, -0.2, 0.2, 0.6].map((rx, idx) => (
        <mesh key={idx} position={[rx, -0.05, 0]}>
          <torusGeometry args={[0.055, 0.015, 6, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      ))}

      {/* The Heraldic Tapestry Cloth */}
      <mesh
        ref={clothRef}
        position={[0, -1.5, 0.02]}
      >
        <planeGeometry args={[1.5, 2.9, 8, 16]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom Weight Rod & Gold Tassels */}
      <Cylinder args={[0.025, 0.025, 1.5, 8]} rotation={[0, 0, Math.PI / 2]} position={[0, -2.95, 0.02]}>
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
      </Cylinder>
    </group>
  );
};
