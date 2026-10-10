import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Torus, Sphere, Text, Box, Cylinder, Cone } from '@react-three/drei';
import { UniverseConfig } from '../../game/config/universes';

interface PortalMeshProps {
  universe: UniverseConfig;
  isUnlocked: boolean;
  hasHeart: boolean;
  isSelected: boolean;
  onSelect: () => void;
  reducedMotion?: boolean;
}

export const PortalMesh: React.FC<PortalMeshProps> = ({
  universe,
  isUnlocked,
  hasHeart,
  isSelected,
  onSelect,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const torchFlameRef1 = useRef<THREE.Mesh>(null);
  const torchFlameRef2 = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Compute position on the orbital perimeter
  const x = Math.sin(universe.orbitAngle) * universe.orbitRadius;
  const z = Math.cos(universe.orbitAngle) * universe.orbitRadius;

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle subtle breathing
      groupRef.current.position.y = Math.sin(t * 1.0 + universe.orbitAngle) * 0.15;
      // Face toward central core
      groupRef.current.rotation.y = universe.orbitAngle + Math.PI;
    }

    if (ringRef.current && isUnlocked) {
      ringRef.current.rotation.z = t * 0.6;
    }

    // Torch flame flicker
    if (torchFlameRef1.current && torchFlameRef2.current) {
      const fl = 1 + Math.sin(t * 10) * 0.15;
      torchFlameRef1.current.scale.set(fl, fl * 1.1, fl);
      torchFlameRef2.current.scale.set(fl * 0.9, fl, fl * 0.9);
    }
  });

  const portalColor = isUnlocked ? universe.primaryColor : '#475569';
  const emissiveColor = isUnlocked ? universe.primaryColor : '#1e293b';

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* ========================================================
          MEDIEVAL STONE GATEHOUSE ARCH & PILLARS
         ======================================================== */}
      {/* Left Stone Pillar */}
      <Box args={[0.5, 3.8, 0.5]} position={[-1.7, 0.4, 0]}>
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
      </Box>
      {/* Right Stone Pillar */}
      <Box args={[0.5, 3.8, 0.5]} position={[1.7, 0.4, 0]}>
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
      </Box>

      {/* Top Stone Arch Lintel */}
      <Box args={[4.0, 0.6, 0.7]} position={[0, 2.4, 0]}>
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
      </Box>

      {/* Castle Battlement Merlons on Top of Gatehouse */}
      {[-1.6, -0.8, 0, 0.8, 1.6].map((bx, i) => (
        <Box key={i} args={[0.45, 0.45, 0.6]} position={[bx, 2.9, 0]}>
          <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
        </Box>
      ))}

      {/* Wall Torches on Pillars */}
      {/* Left Torch Sconce & Flame */}
      <group position={[-1.7, 1.2, 0.35]}>
        {/* Metal Sconce */}
        <Cylinder args={[0.08, 0.05, 0.4]} rotation={[0.4, 0, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
        </Cylinder>
        {/* Flame Cone */}
        <mesh ref={torchFlameRef1} position={[0, 0.25, 0.1]}>
          <coneGeometry args={[0.14, 0.35, 8]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
        <pointLight color="#f97316" intensity={isUnlocked ? 1.4 : 0.4} distance={4} />
      </group>

      {/* Right Torch Sconce & Flame */}
      <group position={[1.7, 1.2, 0.35]}>
        <Cylinder args={[0.08, 0.05, 0.4]} rotation={[0.4, 0, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
        </Cylinder>
        <mesh ref={torchFlameRef2} position={[0, 0.25, 0.1]}>
          <coneGeometry args={[0.14, 0.35, 8]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
        <pointLight color="#f97316" intensity={isUnlocked ? 1.4 : 0.4} distance={4} />
      </group>

      {/* Heraldic Banners Hanging on Pillars */}
      {/* Left Banner */}
      <Box args={[0.4, 1.8, 0.04]} position={[-1.7, -0.4, 0.28]}>
        <meshStandardMaterial
          color={isUnlocked ? universe.primaryColor : '#475569'}
          emissive={isUnlocked ? universe.primaryColor : '#0f172a'}
          emissiveIntensity={isUnlocked ? 0.3 : 0}
          roughness={0.6}
        />
      </Box>
      {/* Right Banner */}
      <Box args={[0.4, 1.8, 0.04]} position={[1.7, -0.4, 0.28]}>
        <meshStandardMaterial
          color={isUnlocked ? universe.accentColor : '#334155'}
          emissive={isUnlocked ? universe.accentColor : '#0f172a'}
          emissiveIntensity={isUnlocked ? 0.3 : 0}
          roughness={0.6}
        />
      </Box>

      {/* ========================================================
          RUNIC PORTAL FIELD / EVENT HORIZON
         ======================================================== */}
      {/* Outer Runic Portal Ring */}
      <Torus
        ref={ringRef}
        args={[1.5, 0.1, 16, 48]}
        position={[0, 0.5, 0]}
        scale={hovered || isSelected ? [1.12, 1.12, 1.12] : [1, 1, 1]}
      >
        <meshStandardMaterial
          color={portalColor}
          emissive={emissiveColor}
          emissiveIntensity={hovered || isSelected ? 1.5 : 0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </Torus>

      {/* Dimensional Event Horizon (Translucent membrane) */}
      <Sphere args={[1.4, 24, 24]} position={[0, 0.5, 0]} scale={[1, 1, 0.12]}>
        <meshStandardMaterial
          color={isUnlocked ? universe.accentColor : '#334155'}
          emissive={isUnlocked ? universe.accentColor : '#0f172a'}
          emissiveIntensity={isUnlocked ? 0.8 : 0.1}
          transparent
          opacity={isUnlocked ? 0.7 : 0.35}
          roughness={0.15}
        />
      </Sphere>

      {/* Floating Castle Stronghold Name Label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.44}
        color={hovered || isSelected ? '#fbbf24' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#090d16"
      >
        {universe.name}
      </Text>

      {/* Subtitle / Castle Stronghold Domain */}
      <Text
        position={[0, 3.15, 0]}
        fontSize={0.2}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#090d16"
      >
        {universe.castleName}
      </Text>

      {/* Status Label (Banner Ribbon) */}
      <Text
        position={[0, -1.0, 0]}
        fontSize={0.22}
        color={isUnlocked ? (hasHeart ? '#fbbf24' : '#38bdf8') : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#090d16"
      >
        {isUnlocked ? (hasHeart ? '⚔ CONQUERED (HEART CLAIMED)' : '🛡 GATE OPEN · READY FOR SQUIRE') : '🔒 FORTRESS LOCKED'}
      </Text>

      {/* Fortified Stone Threshold Pedestal */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.5, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Local gateway light */}
      {isUnlocked && (
        <pointLight
          color={universe.primaryColor}
          intensity={hovered || isSelected ? 2.5 : 1.2}
          distance={8}
          position={[0, 0.5, 0.5]}
        />
      )}
    </group>
  );
};
