import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Box, Cylinder, Torus } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useGame } from '../game/state/store';
import { CosmicEnvironment } from './components/CosmicEnvironment';

interface LogicHeartProps {
  collected: boolean;
  onCollect: () => void;
  reducedMotion?: boolean;
}

interface QuantumNodeProps {
  allSolved: boolean;
  solvedCount: number;
  onOpenModal: () => void;
  reducedMotion?: boolean;
}

const BastionSiegeNode: React.FC<QuantumNodeProps> = ({
  allSolved,
  solvedCount,
  onOpenModal,
  reducedMotion = false,
}) => {
  const rotatingPolyRef = useRef<THREE.Mesh>(null);

  useFrame((st) => {
    if (reducedMotion) return;
    const t = st.clock.getElapsedTime();
    if (rotatingPolyRef.current) {
      rotatingPolyRef.current.rotation.x = t * 0.4;
      rotatingPolyRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group
      position={[0, 0.6, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Stone & Iron Siege Dais */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.6, 2.0, 1.2, 8]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#312e81"
          emissiveIntensity={0.5}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Central Fortress Gear / Octahedral Core */}
      <mesh ref={rotatingPolyRef} position={[0, 2.0, 0]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={allSolved ? 1.8 : 0.8}
          wireframe
        />
      </mesh>

      {/* Transfiguration light beam when all 4 are solved */}
      {allSolved && (
        <mesh position={[0, 6, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 12, 16]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <Text
        position={[0, 3.2, 0]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#1e1b4b"
      >
        {allSolved
          ? '✦ BASTION PROTOCOLS: CONQUERED (4/4) ✦'
          : `✦ SIEGECRAFT PROTOCOL (${solvedCount}/4 SOLVED) ✦`}
      </Text>
    </group>
  );
};

const BastionHeartMesh: React.FC<LogicHeartProps> = ({
  collected,
  onCollect,
  reducedMotion = false,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = 5.0 + Math.sin(t * 2) * 0.2;
      meshRef.current.rotation.y = t * 1.5;
    }
  });

  if (collected) {
    return (
      <group position={[0, 5.0, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.3} wireframe />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.25} color="#818cf8" anchorX="center" anchorY="middle">
          Heart of Command Claimed
        </Text>
      </group>
    );
  }

  return (
    <group
      ref={meshRef}
      position={[0, 5.0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onCollect();
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
      {/* Iridescent Steel & Amethyst Fortress Heart */}
      <mesh scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshPhysicalMaterial
          color="#6366f1"
          emissive="#a855f7"
          emissiveIntensity={1.4}
          roughness={0.15}
          metalness={0.8}
          transmission={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Fortified silver rings */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <torusGeometry args={[1.15, 0.04, 16, 48]} />
        <meshStandardMaterial color="#e0e7ff" emissive="#c7d2fe" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>

      <Text
        position={[0, 1.3, 0]}
        fontSize={0.34}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#312e81"
      >
        ✦ CLAIM HEART OF COMMAND ✦
      </Text>

      <pointLight color="#818cf8" intensity={3.5} distance={12} />
    </group>
  );
};

export const LogicoreScene: React.FC = () => {
  const { 
    state, 
    openModal, 
    collectLogicoreHeart, 
    cameraResetSignal 
  } = useGame();

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const solvedCount = state.logicore.solvedPuzzles.length;
  const allSolved = solvedCount >= 4;
  const heartCollected = state.hearts.logicore;

  // Handle camera reset signal
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.5, 0);
    }
  }, [cameraResetSignal]);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 10, 18], fov: 46, near: 0.1, far: 200 }}
        dpr={[1, Math.min(2, window.devicePixelRatio)]}
        className="w-full h-full"
      >
        <CosmicEnvironment reducedMotion={state.settings.reducedMotion} />

        {/* Bastion Fortress Illumination */}
        <ambientLight intensity={0.85} color="#1e1b4b" />
        <directionalLight position={[10, 18, 10]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[0, 6, 0]} intensity={allSolved ? 3.5 : 2.0} color="#818cf8" distance={25} />
        <pointLight position={[-6, 4, -4]} intensity={1.6} color="#c084fc" distance={18} />
        <pointLight position={[6, 4, 4]} intensity={1.6} color="#38bdf8" distance={18} />

        {/* ========================================================
            BASTION MOUNTAIN FORTRESS BASE
           ======================================================== */}
        <group position={[0, 0, 0]}>
          {/* Main Octagonal Stone Base */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <cylinderGeometry args={[8.0, 8.8, 1.2, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.4} />
          </mesh>

          {/* Glowing bottom inverted pyramid */}
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[8.8, 4.5, 8]} />
            <meshStandardMaterial
              color="#090d16"
              roughness={0.9}
              emissive="#4338ca"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Iron Circuit Rings on Ground */}
          <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.2, 8]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#818cf8"
              emissiveIntensity={allSolved ? 1.4 : 0.6}
            />
          </mesh>
          <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5.2, 5.5, 8]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#c084fc"
              emissiveIntensity={allSolved ? 1.4 : 0.5}
            />
          </mesh>

          {/* ========================================================
              CENTRAL SIEGECRAFT NODE (Click opens Bastion puzzles)
             ======================================================== */}
          <BastionSiegeNode
            allSolved={allSolved}
            solvedCount={solvedCount}
            onOpenModal={() => openModal('logicore-puzzles')}
            reducedMotion={state.settings.reducedMotion}
          />

          {/* ========================================================
              FOUR FORTIFIED PORTCULLIS GATES
             ======================================================== */}
          {[
            { pos: [-4.5, 1.6, -2.5], rot: 0.3, color: '#6366f1' },
            { pos: [4.5, 1.6, -2.5], rot: -0.3, color: '#a855f7' },
            { pos: [-4.0, 1.6, 3.0], rot: -0.4, color: '#38bdf8' },
            { pos: [4.0, 1.6, 3.0], rot: 0.4, color: '#c084fc' },
          ].map((door, idx) => (
            <group key={idx} position={door.pos as [number, number, number]} rotation={[0, door.rot, 0]}>
              {/* Heavy Stone Gate Posts */}
              <Box args={[0.3, 2.6, 0.3]} position={[-0.8, 0.8, 0]}>
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </Box>
              <Box args={[0.3, 2.6, 0.3]} position={[0.8, 0.8, 0]}>
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </Box>
              <Box args={[1.9, 0.4, 0.35]} position={[0, 2.0, 0]}>
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
              </Box>

              {/* Iron Portcullis Grate Bars */}
              {[-0.5, -0.2, 0.1, 0.4].map((bx, bi) => (
                <Cylinder key={bi} args={[0.03, 0.03, 2.0, 8]} position={[bx, 0.8, 0]}>
                  <meshStandardMaterial color="#334155" metalness={0.9} />
                </Cylinder>
              ))}

              {/* Energy Barrier Field */}
              <mesh position={[0, 0.8, 0.05]}>
                <planeGeometry args={[1.3, 2.0]} />
                <meshStandardMaterial
                  color={door.color}
                  emissive={door.color}
                  emissiveIntensity={allSolved ? 1.2 : 0.4}
                  transparent
                  opacity={0.65}
                />
              </mesh>
            </group>
          ))}

          {/* ========================================================
              HEART OF COMMAND
              Appears levitating when all 4 puzzles solved
             ======================================================== */}
          {allSolved && (
            <BastionHeartMesh
              collected={heartCollected}
              onCollect={collectLogicoreHeart}
              reducedMotion={state.settings.reducedMotion}
            />
          )}
        </group>

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 + 0.12}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
};
