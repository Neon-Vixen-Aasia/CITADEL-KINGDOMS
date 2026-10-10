import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Box, Cylinder, Cone } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useGame } from '../game/state/store';
import { CosmicEnvironment } from './components/CosmicEnvironment';

interface PixelHeartProps {
  collected: boolean;
  onCollect: () => void;
  reducedMotion?: boolean;
}

const VanguardiaHeartMesh: React.FC<PixelHeartProps> = ({
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
      meshRef.current.position.y = 5.2 + Math.sin(t * 2) * 0.2;
      meshRef.current.rotation.y = t * 1.5;
    }
  });

  if (collected) {
    return (
      <group position={[0, 5.2, 0]}>
        <mesh>
          <octahedronGeometry args={[0.6, 0]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} wireframe />
        </mesh>
        <Text position={[0, 0.9, 0]} fontSize={0.25} color="#38bdf8" anchorX="center" anchorY="middle">
          Heart of Tactics Claimed
        </Text>
      </group>
    );
  }

  return (
    <group
      ref={meshRef}
      position={[0, 5.2, 0]}
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
      {/* Sapphire-Faceted Knight Seal of Tactics */}
      <mesh scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshPhysicalMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={1.5}
          roughness={0.15}
          metalness={0.7}
          transmission={0.6}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Orbiting Steel Vanguard Rings */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <torusGeometry args={[1.2, 0.05, 12, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      <Text
        position={[0, 1.35, 0]}
        fontSize={0.34}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0c4a6e"
      >
        ✦ CLAIM HEART OF TACTICS ✦
      </Text>

      <pointLight color="#38bdf8" intensity={3.5} distance={12} />
    </group>
  );
};

export const PixeliaScene: React.FC = () => {
  const { 
    state, 
    openModal, 
    collectPixeliaHeart, 
    cameraResetSignal 
  } = useGame();

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const satisfiesChecklist = state.pixelia.checklistSatisfied;
  const hasExported = state.pixelia.hasExportedArtifact;
  const heartAvailable = satisfiesChecklist && hasExported;
  const heartCollected = state.hearts.pixelia;

  // Handle camera reset
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

        {/* High War Citadel lighting */}
        <ambientLight intensity={0.85} color="#1e293b" />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#e0f2fe" />
        <pointLight position={[0, 6, 0]} intensity={2.5} color="#0284c7" distance={25} />
        <pointLight position={[-6, 4, -4]} intensity={1.8} color="#f97316" distance={18} />
        <pointLight position={[6, 4, 4]} intensity={1.8} color="#38bdf8" distance={18} />

        {/* ========================================================
            VANGUARDIA HIGH WAR CITADEL BATTLEMENTS
           ======================================================== */}
        <group position={[0, 0, 0]}>
          {/* Main Fortified Rampart Platform */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <cylinderGeometry args={[8.0, 9.0, 1.2, 8]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.8}
              metalness={0.25}
            />
          </mesh>

          {/* Heavy Stone Foundation */}
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[9.0, 4.5, 8]} />
            <meshStandardMaterial
              color="#090d16"
              roughness={0.9}
              emissive="#0369a1"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Stone Battlements around edges */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const angle = (idx * Math.PI * 2) / 8 + Math.PI / 8;
            const radius = 7.7;
            const px = Math.sin(angle) * radius;
            const pz = Math.cos(angle) * radius;
            return (
              <group key={idx} position={[px, 0.9, pz]} rotation={[0, -angle, 0]}>
                <Box args={[2.0, 0.7, 0.4]}>
                  <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </Box>
              </group>
            );
          })}

          {/* Central High Commander's Spire (Elevates Heart of Tactics) */}
          <group position={[0, 0.6, 0]}>
            {/* Square Stone Keep Tower */}
            <mesh position={[0, 1.4, 0]}>
              <boxGeometry args={[2.0, 2.8, 2.0]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.3} />
            </mesh>
            {/* Tower Crenellations */}
            {[-0.8, 0.8].map((ox) =>
              [-0.8, 0.8].map((oz) => (
                <Box key={`${ox}-${oz}`} args={[0.5, 0.4, 0.5]} position={[ox, 3.0, oz]}>
                  <meshStandardMaterial color="#334155" />
                </Box>
              ))
            )}
            {/* Crown Platform */}
            <mesh position={[0, 2.9, 0]}>
              <boxGeometry args={[2.2, 0.2, 2.2]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          </group>

          {/* Four Stone Sentry Watchtowers */}
          {[
            { pos: [-5.2, 1.5, -4.5], angle: 0.2 },
            { pos: [5.2, 1.5, -4.5], angle: -0.2 },
            { pos: [-5.2, 1.5, 4.5], angle: -0.2 },
            { pos: [5.2, 1.5, 4.5], angle: 0.2 },
          ].map((tw, i) => (
            <group key={i} position={tw.pos as [number, number, number]}>
              {/* Tower Cylinder */}
              <Cylinder args={[0.9, 1.1, 3.2, 12]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </Cylinder>
              {/* Roof Cone */}
              <Cone args={[1.2, 1.2, 12]} position={[0, 2.2, 0]}>
                <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
              </Cone>
              {/* Sentry Torch */}
              <pointLight color="#f97316" intensity={1.8} distance={6} position={[0, 1.2, 1.1]} />
            </group>
          ))}

          {/* ========================================================
              WAR COUNCIL MAP TABLE (Click opens PixelStudio Workshop)
             ======================================================== */}
          <group
            position={[0, 0.6, 3.8]}
            onClick={(e) => {
              e.stopPropagation();
              openModal('pixelstudio');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Oak & Iron War Council Table */}
            <Box args={[2.4, 0.7, 1.4]} position={[0, 0.35, 0]}>
              <meshStandardMaterial color="#451a03" roughness={0.8} metalness={0.2} />
            </Box>
            {/* Parchment Campaign Map */}
            <Box args={[2.0, 0.05, 1.1]} position={[0, 0.73, 0]}>
              <meshStandardMaterial color="#fef3c7" roughness={0.9} />
            </Box>
            {/* Floating Royal Call-to-Arms Decree Seal */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <mesh position={[0, 1.5, 0]}>
                <octahedronGeometry args={[0.35]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={1.4}
                  metalness={0.8}
                />
              </mesh>
            </Float>
            <Text
              position={[0, 2.2, 0]}
              fontSize={0.26}
              color="#38bdf8"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#082f49"
            >
              ✦ WAR COUNCIL: CALL-TO-ARMS WORKSHOP ✦
            </Text>
          </group>

          {/* ========================================================
              HEART OF TACTICS
              Appears levitating when checklist satisfied & decree exported
             ======================================================== */}
          {heartAvailable && (
            <VanguardiaHeartMesh
              collected={heartCollected}
              onCollect={collectPixeliaHeart}
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
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
};
