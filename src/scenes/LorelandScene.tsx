import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Box, Cylinder, Cone } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useGame } from '../game/state/store';
import { CosmicEnvironment } from './components/CosmicEnvironment';

interface LoreHeartProps {
  collected: boolean;
  onCollect: () => void;
  reducedMotion?: boolean;
}

const LorelandHeartMesh: React.FC<LoreHeartProps> = ({
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
      meshRef.current.rotation.y = t * 1.4;
    }
  });

  if (collected) {
    return (
      <group position={[0, 5.0, 0]}>
        <mesh>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.3} wireframe />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.25} color="#34d399" anchorX="center" anchorY="middle">
          Heart of Chronicles Claimed
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
      {/* Radiant Emerald & Gold Heart */}
      <mesh scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial
          color="#0d9488"
          emissive="#10b981"
          emissiveIntensity={1.3}
          roughness={0.15}
          metalness={0.5}
          transmission={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orbiting golden rune halo */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[1.05, 0.04, 16, 32]} />
        <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.8} />
      </mesh>

      <Text
        position={[0, 1.25, 0]}
        fontSize={0.32}
        color="#fef08a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#064e3b"
      >
        ✦ CLAIM HEART OF CHRONICLES ✦
      </Text>

      <pointLight color="#10b981" intensity={3} distance={12} />
    </group>
  );
};

// Interactive 3D Lore Object with floating label & pointer
interface LoreObjectProps {
  position: [number, number, number];
  title: string;
  isDiscovered: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const LoreObject: React.FC<LoreObjectProps> = ({
  position,
  title,
  isDiscovered,
  onClick,
  children,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
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
      {children}

      <Text
        position={[0, 2.2, 0]}
        fontSize={0.22}
        color={isDiscovered ? '#34d399' : hovered ? '#fef08a' : '#cbd5e1'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#022c22"
      >
        {isDiscovered ? `✓ ${title}` : `✦ ${title} ✦`}
      </Text>

      {/* Pulsing discovery aura */}
      <pointLight
        color={isDiscovered ? '#34d399' : '#facc15'}
        intensity={hovered ? 2.0 : isDiscovered ? 0.8 : 1.2}
        distance={4.5}
        position={[0, 1.2, 0]}
      />
    </group>
  );
};

export const LorelandScene: React.FC = () => {
  const { 
    state, 
    openModal, 
    collectLorelandHeart, 
    inspectLoreFragment,
    cameraResetSignal 
  } = useGame();

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const fragments = state.loreland.fragmentsFound;
  const allFragmentsFound = fragments.length >= 4;
  const storySaved = state.loreland.storySaved;
  const heartAvailable = storySaved;
  const heartCollected = state.hearts.loreland;

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
        camera={{ position: [0, 9, 18], fov: 46, near: 0.1, far: 200 }}
        dpr={[1, Math.min(2, window.devicePixelRatio)]}
        className="w-full h-full"
      >
        <CosmicEnvironment reducedMotion={state.settings.reducedMotion} />

        {/* Ambient Cloister Illumination */}
        <ambientLight intensity={0.85} color="#064e3b" />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fef08a" />
        <pointLight position={[0, 6, 0]} intensity={2.5} color="#10b981" distance={25} />
        <pointLight position={[-6, 4, -4]} intensity={1.6} color="#facc15" distance={18} />
        <pointLight position={[6, 4, 4]} intensity={1.6} color="#34d399" distance={18} />

        {/* ========================================================
            CHRONICLER'S KEEP SANCTUARY PLATFORM
           ======================================================== */}
        <group position={[0, 0, 0]}>
          {/* Main Stone Island Plateau */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <cylinderGeometry args={[8.0, 9.0, 1.2, 32]} />
            <meshStandardMaterial color="#062d27" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Glowing bottom earthen rock */}
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[9.0, 4.5, 16]} />
            <meshStandardMaterial
              color="#041a17"
              roughness={0.9}
              emissive="#0d9488"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Concentric gold and emerald path rings on courtyard */}
          <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3.2, 32]} />
            <meshStandardMaterial
              color="#14b8a6"
              emissive="#0d9488"
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.8, 5.2, 32]} />
            <meshStandardMaterial
              color="#eab308"
              emissive="#ca8a04"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* ========================================================
              CENTRAL SCRIBE'S SCRIPTING HALL (Opens StoryStudio)
             ======================================================== */}
          <group
            position={[0, 0.6, -1]}
            onClick={(e) => {
              e.stopPropagation();
              openModal('storystudio');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Temple Base */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[2.5, 2.8, 0.8, 8]} />
              <meshStandardMaterial color="#0b3732" roughness={0.4} metalness={0.4} />
            </mesh>
            {/* 4 Gothic Pillars */}
            {[
              { x: -1.6, z: -1.6 },
              { x: 1.6, z: -1.6 },
              { x: -1.6, z: 1.6 },
              { x: 1.6, z: 1.6 },
            ].map((p, i) => (
              <mesh key={i} position={[p.x, 2.0, p.z]}>
                <cylinderGeometry args={[0.2, 0.25, 2.8, 12]} />
                <meshStandardMaterial color="#0f4a43" roughness={0.3} metalness={0.5} />
              </mesh>
            ))}
            {/* Temple Dome / Roof */}
            <mesh position={[0, 3.6, 0]}>
              <coneGeometry args={[2.6, 1.4, 8]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#ca8a04"
                emissiveIntensity={0.6}
                roughness={0.3}
              />
            </mesh>

            {/* Central Lectern & Golden Flame */}
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[0.7, 1.0, 0.7]} />
              <meshStandardMaterial color="#134e4a" />
            </mesh>
            <Float speed={2} floatIntensity={1} rotationIntensity={0.5}>
              <mesh position={[0, 2.0, 0]}>
                <octahedronGeometry args={[0.35, 0]} />
                <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={1.2} />
              </mesh>
            </Float>

            <Text
              position={[0, 4.6, 0]}
              fontSize={0.28}
              color="#fef08a"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#042f2e"
            >
              ✦ SCRIBE’S CLOISTER (CLICK TO WRITE CHRONICLE) ✦
            </Text>
          </group>

          {/* ========================================================
              FOUR SCATTERED SOLDIER BATTLE CHRONICLE OBJECTS
             ======================================================== */}

          {/* 1. Illuminated War Tome (Fragment 0) */}
          <LoreObject
            position={[-4.5, 0.6, 1.5]}
            title="Illuminated War Tome"
            isDiscovered={fragments.includes(0)}
            onClick={() => inspectLoreFragment(0)}
          >
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 0.8, 12]} />
              <meshStandardMaterial color="#0f3d38" />
            </mesh>
            <Float speed={3} rotationIntensity={0.6} floatIntensity={0.8}>
              <mesh position={[0, 1.2, 0]} rotation={[0.4, 0.2, 0]}>
                <boxGeometry args={[0.6, 0.8, 0.15]} />
                <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.7} />
              </mesh>
            </Float>
          </LoreObject>

          {/* 2. Knight's Oath Monolith (Fragment 1) */}
          <LoreObject
            position={[4.8, 0.6, 1.0]}
            title="Knight's Oath Monolith"
            isDiscovered={fragments.includes(1)}
            onClick={() => inspectLoreFragment(1)}
          >
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.6, 2.4, 0.6]} />
              <meshStandardMaterial
                color="#064e3b"
                emissive="#059669"
                emissiveIntensity={0.6}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 1.2, 0.32]}>
              <planeGeometry args={[0.2, 1.8]} />
              <meshBasicMaterial color="#34d399" />
            </mesh>
          </LoreObject>

          {/* 3. Memorial Wellspring (Fragment 2) */}
          <LoreObject
            position={[0, 0.6, 4.8]}
            title="Memorial Wellspring"
            isDiscovered={fragments.includes(2)}
            onClick={() => inspectLoreFragment(2)}
          >
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[1.2, 1.3, 0.4, 24]} />
              <meshStandardMaterial color="#042f2e" roughness={0.4} />
            </mesh>
            {/* Glowing Water pool */}
            <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.05, 24]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#22d3ee"
                emissiveIntensity={1.0}
                roughness={0.1}
              />
            </mesh>
          </LoreObject>

          {/* 4. Memorial Oak Tree (Fragment 3) */}
          <LoreObject
            position={[-3.5, 0.6, -4.0]}
            title="Memorial Oak of the Knights"
            isDiscovered={fragments.includes(3)}
            onClick={() => inspectLoreFragment(3)}
          >
            {/* Tree Trunk */}
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[0.3, 0.45, 2.0, 8]} />
              <meshStandardMaterial color="#292524" roughness={0.9} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 2.2, 0]}>
              <dodecahedronGeometry args={[1.1, 0]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#059669"
                emissiveIntensity={0.5}
                roughness={0.4}
              />
            </mesh>
          </LoreObject>

          {/* ========================================================
              HEART OF CHRONICLES
              Appears levitating when story is bound
             ======================================================== */}
          {heartAvailable && (
            <LorelandHeartMesh
              collected={heartCollected}
              onCollect={collectLorelandHeart}
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
