import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

interface CosmicEnvironmentProps {
  reducedMotion?: boolean;
}

export const CosmicEnvironment: React.FC<CosmicEnvironmentProps> = ({ reducedMotion = false }) => {
  // Floating glowing torch embers & forge sparks
  const emberCount = reducedMotion ? 40 : 130;
  const positions = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 30; // Tend upwards like fire embers
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    return pos;
  }, [emberCount]);

  return (
    <>
      {/* Citadel Mountain Twilight Fog & Lighting */}
      <fog attach="fog" args={['#0c0f17', 15, 65]} />
      <ambientLight intensity={0.9} color="#cbd5e1" />
      <directionalLight position={[15, 22, 12]} intensity={1.4} color="#fef08a" />
      <directionalLight position={[-15, -10, -12]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0, 4, 0]} intensity={2.2} distance={25} color="#f59e0b" />

      {/* Medieval Night Sky & Constellations */}
      <Stars
        radius={65}
        depth={40}
        count={reducedMotion ? 700 : 1800}
        factor={3.8}
        saturation={0.5}
        fade
        speed={reducedMotion ? 0 : 0.4}
      />

      {/* Floating Forge & Hearth Sparks (Golden & Amber Embers) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#f59e0b"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
