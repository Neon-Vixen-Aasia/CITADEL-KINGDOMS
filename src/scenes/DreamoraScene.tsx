import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Box, Cylinder, Torus, Cone } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useGame } from '../game/state/store';
import { CosmicEnvironment } from './components/CosmicEnvironment';

interface HeartMeshProps {
  collected: boolean;
  onCollect: () => void;
  reducedMotion?: boolean;
}

const DreamoraHeartMesh: React.FC<HeartMeshProps> = ({
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
      meshRef.current.position.y = 4.2 + Math.sin(t * 2) * 0.2;
      meshRef.current.rotation.y = t * 1.5;
    }
  });

  if (collected) {
    return (
      <group position={[0, 4.2, 0]}>
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} wireframe />
        </mesh>
        <Text position={[0, 0.9, 0]} fontSize={0.25} color="#fbbf24" anchorX="center" anchorY="middle">
          Heart of Valor Claimed
        </Text>
      </group>
    );
  }

  return (
    <group
      ref={meshRef}
      position={[0, 4.2, 0]}
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
      {/* Imperial Golden Knight Heart Crest */}
      <mesh scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshPhysicalMaterial
          color="#f59e0b"
          emissive="#fbbf24"
          emissiveIntensity={1.4}
          roughness={0.15}
          metalness={0.8}
          transmission={0.5}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Orbiting Solar Crown Halo */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>

      <Text
        position={[0, 1.3, 0]}
        fontSize={0.34}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#78350f"
      >
        ✦ CLAIM ROYAL HEART OF VALOR ✦
      </Text>

      <pointLight color="#f59e0b" intensity={3.5} distance={12} />
    </group>
  );
};

export const DreamoraScene: React.FC = () => {
  const { 
    state, 
    openModal, 
    collectDreamoraHeart, 
    cameraResetSignal 
  } = useGame();

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const anvilRef = useRef<THREE.Group>(null);

  const allPuzzlesSolved = state.dreamora.solvedPuzzles.length >= 3;
  const hasExported = state.dreamora.hasExportedArtifact;
  const heartAvailable = allPuzzlesSolved && hasExported;
  const heartCollected = state.hearts.dreamora;

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
        camera={{ position: [0, 9, 18], fov: 46, near: 0.1, far: 200 }}
        dpr={[1, Math.min(2, window.devicePixelRatio)]}
        className="w-full h-full"
      >
        <CosmicEnvironment reducedMotion={state.settings.reducedMotion} />

        {/* Ambient fortress illumination */}
        <ambientLight intensity={0.85} color="#94a3b8" />
        <directionalLight position={[12, 22, 10]} intensity={1.5} color="#fef08a" />
        <pointLight position={[0, 6, 0]} intensity={allPuzzlesSolved ? 3.5 : 2.0} color="#f59e0b" distance={25} />
        <pointLight position={[-6, 4, -4]} intensity={1.5} color="#ef4444" distance={15} />
        <pointLight position={[6, 4, 4]} intensity={1.5} color="#fbbf24" distance={15} />

        {/* ========================================================
            VALORIA CASTLE MOUNTAIN BASTION
           ======================================================== */}
        <group position={[0, 0, 0]}>
          {/* Main Stone Fortress Plateau */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <cylinderGeometry args={[8.5, 9.5, 1.4, 32]} />
            <meshStandardMaterial
              color={allPuzzlesSolved ? '#27272a' : '#18181b'}
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>

          {/* Castle Rock Foundation / Inverted mountain base */}
          <mesh position={[0, -2.8, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[9.5, 5.0, 16]} />
            <meshStandardMaterial
              color="#090d16"
              roughness={0.95}
              emissive={allPuzzlesSolved ? '#b45309' : '#451a03'}
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Castle Battlement Merlons around Ramparts */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => {
            const angle = (idx * Math.PI * 2) / 12;
            const radius = 8.2;
            const px = Math.sin(angle) * radius;
            const pz = Math.cos(angle) * radius;
            return (
              <group key={idx} position={[px, 1.0, pz]} rotation={[0, -angle, 0]}>
                <Box args={[1.5, 0.7, 0.4]}>
                  <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0.2} />
                </Box>
              </group>
            );
          })}

          {/* Concentric Golden Inlay Path on the Ground */}
          <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.4, 32]} />
            <meshStandardMaterial
              color={allPuzzlesSolved ? '#fbbf24' : '#d97706'}
              emissive={allPuzzlesSolved ? '#fbbf24' : '#b45309'}
              emissiveIntensity={allPuzzlesSolved ? 1.2 : 0.5}
            />
          </mesh>

          <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5.2, 5.6, 32]} />
            <meshStandardMaterial
              color={allPuzzlesSolved ? '#ef4444' : '#991b1b'}
              emissive={allPuzzlesSolved ? '#ef4444' : '#7f1d1d'}
              emissiveIntensity={allPuzzlesSolved ? 1.0 : 0.4}
            />
          </mesh>

          {/* ========================================================
              GRAND ANVIL OF THE SUNCREST KNIGHTS (Opens Crest Riddles)
             ======================================================== */}
          <group
            ref={anvilRef}
            position={[0, 0.7, 0]}
            onClick={(e) => {
              e.stopPropagation();
              openModal('dreamora-puzzle');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Stone Anvil Dais */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[1.6, 2.0, 0.8, 16]} />
              <meshStandardMaterial
                color="#292524"
                roughness={0.8}
                metalness={0.3}
              />
            </mesh>

            {/* Blacksmith Anvil Body */}
            <Box args={[1.6, 0.6, 0.8]} position={[0, 0.9, 0]}>
              <meshStandardMaterial
                color="#1c1917"
                metalness={0.9}
                roughness={0.2}
              />
            </Box>
            {/* Anvil Horn */}
            <Cone args={[0.3, 0.8, 12]} position={[1.1, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <meshStandardMaterial color="#1c1917" metalness={0.9} roughness={0.2} />
            </Cone>

            {/* Floating Forged Crest of Valor */}
            <Float speed={allPuzzlesSolved ? 4 : 2} rotationIntensity={0.8} floatIntensity={1.2}>
              <group position={[0, 2.1, 0]}>
                {/* Shield shape */}
                <Box args={[0.9, 1.2, 0.1]}>
                  <meshStandardMaterial
                    color={allPuzzlesSolved ? '#fbbf24' : '#f59e0b'}
                    emissive={allPuzzlesSolved ? '#fbbf24' : '#d97706'}
                    emissiveIntensity={allPuzzlesSolved ? 1.6 : 0.8}
                    metalness={0.9}
                    roughness={0.2}
                  />
                </Box>
              </group>
            </Float>

            {/* Vertical transfiguration light beam when solved */}
            {allPuzzlesSolved && (
              <mesh position={[0, 6, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 12, 16]} />
                <meshBasicMaterial
                  color="#fbbf24"
                  transparent
                  opacity={0.35}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}

            <Text
              position={[0, 3.0, 0]}
              fontSize={0.28}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#451a03"
            >
              {allPuzzlesSolved ? '✦ GRAND ANVIL: CONSECRATED (3/3) ✦' : '✦ GRAND ANVIL (CLICK TO DECIPHER CRESTS) ✦'}
            </Text>
          </group>

          {/* ========================================================
              SURROUNDING KNIGHT WEAPON STANDS & SHIELDS
             ======================================================== */}
          {[
            { pos: [-4.2, 0.7, -2.5], rot: 0.3, color: '#ef4444' },
            { pos: [4.2, 0.7, -2.5], rot: -0.3, color: '#f59e0b' },
            { pos: [-3.8, 0.7, 3.5], rot: -0.4, color: '#d97706' },
            { pos: [3.8, 0.7, 3.5], rot: 0.4, color: '#b91c1c' },
          ].map((rack, idx) => (
            <group key={idx} position={rack.pos as [number, number, number]} rotation={[0, rack.rot, 0]}>
              {/* Wooden Rack post */}
              <Box args={[0.15, 1.6, 0.15]} position={[-0.4, 0.8, 0]}>
                <meshStandardMaterial color="#451a03" roughness={0.9} />
              </Box>
              <Box args={[0.15, 1.6, 0.15]} position={[0.4, 0.8, 0]}>
                <meshStandardMaterial color="#451a03" roughness={0.9} />
              </Box>
              <Box args={[1.1, 0.12, 0.12]} position={[0, 1.3, 0]}>
                <meshStandardMaterial color="#451a03" roughness={0.9} />
              </Box>
              {/* Mounted Knight Shield */}
              <Box args={[0.7, 0.9, 0.08]} position={[0, 0.8, 0.1]}>
                <meshStandardMaterial
                  color={rack.color}
                  emissive={rack.color}
                  emissiveIntensity={allPuzzlesSolved ? 0.9 : 0.3}
                  metalness={0.7}
                  roughness={0.3}
                />
              </Box>
            </group>
          ))}

          {/* ========================================================
              ROYAL ARMORY FORGE BEACON (Click opens Studio)
             ======================================================== */}
          <group
            position={[5.5, 0.7, -0.8]}
            onClick={(e) => {
              e.stopPropagation();
              openModal('dreamlab');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Stone Furnace Base */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.8, 1.1, 1.2, 12]} />
              <meshStandardMaterial color="#1c1917" roughness={0.9} metalness={0.2} />
            </mesh>
            {/* Glowing Furnace Fire Hearth */}
            <mesh position={[0, 0.6, 0.45]}>
              <boxGeometry args={[0.5, 0.4, 0.1]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <pointLight position={[0, 0.6, 0.6]} color="#f97316" intensity={2.5} distance={5} />

            <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
              <mesh position={[0, 1.8, 0]}>
                <octahedronGeometry args={[0.45]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#f59e0b"
                  emissiveIntensity={1.4}
                  metalness={0.9}
                />
              </mesh>
            </Float>
            <Text
              position={[0, 2.7, 0]}
              fontSize={0.26}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#451a03"
            >
              ✦ ROYAL ARMORY FORGE ✦
            </Text>
          </group>

          {/* ========================================================
              HEART OF VALOR
              Appears only after all 3 puzzles solved AND shield exported
             ======================================================== */}
          {heartAvailable && (
            <DreamoraHeartMesh
              collected={heartCollected}
              onCollect={collectDreamoraHeart}
              reducedMotion={state.settings.reducedMotion}
            />
          )}

          {/* Mountain Clouds / Fog under cliff */}
          <group position={[0, -5, 0]}>
            {[
              { x: -5, z: -3, s: 3.8 },
              { x: 5, z: 2, s: 4.2 },
              { x: 0, z: 6, s: 3.5 },
              { x: -4, z: 4, s: 3.2 },
            ].map((cloud, i) => (
              <mesh key={i} position={[cloud.x, 0, cloud.z]} scale={[cloud.s, 1.2, cloud.s]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color="#1e293b"
                  emissive="#0f172a"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            ))}
          </group>
        </group>

        {/* Orbit Controls with dampening and boundaries */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={5}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 + 0.12}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
};
