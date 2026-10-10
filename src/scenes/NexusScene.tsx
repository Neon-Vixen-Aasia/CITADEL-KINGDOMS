import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useGame } from '../game/state/store';
import { UNIVERSES, UniverseId } from '../game/config/universes';
import { isUniverseUnlocked } from '../game/logic/progression';
import { BubbleCore } from './components/BubbleCore';
import { PortalMesh } from './components/PortalMesh';
import { CosmicEnvironment } from './components/CosmicEnvironment';
import { CastleCourtyard } from './components/CastleCourtyard';

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 8, 22];

export const NexusScene: React.FC = () => {
  const { state, selectPortal, cameraResetSignal } = useGame();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Handle camera reset signal
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.2, 0);
    }
  }, [cameraResetSignal]);

  const universeKeys: UniverseId[] = ['dreamora', 'pixelia', 'loreland', 'logicore'];

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POS, fov: 48, near: 0.1, far: 200 }}
        dpr={[1, Math.min(2, window.devicePixelRatio)]}
        className="w-full h-full"
      >
        {/* Fortress Night Sky, Fog & Embers */}
        <CosmicEnvironment reducedMotion={state.settings.reducedMotion} />

        {/* Ambient Fortress Lighting */}
        <ambientLight intensity={0.9} color="#94a3b8" />
        {/* Golden Sun & Moon Directional Rays */}
        <directionalLight position={[18, 28, 16]} intensity={1.6} color="#fef3c7" castShadow />
        <directionalLight position={[-16, 12, -16]} intensity={0.7} color="#38bdf8" />
        {/* Overhead Citadel Sky Fill */}
        <pointLight position={[0, 14, 0]} intensity={1.2} color="#fed7aa" distance={35} />

        {/* ========================================================
            MEDIEVAL CITADEL COURTYARD (Stone Flagstones, Banners & Torches)
           ======================================================== */}
        <CastleCourtyard reducedMotion={state.settings.reducedMotion} />

        {/* Central Sovereign Citadel Core */}
        <BubbleCore reducedMotion={state.settings.reducedMotion} />

        {/* 4 Medieval Fortress Portals */}
        {universeKeys.map((uId) => {
          const config = UNIVERSES[uId];
          const unlocked = isUniverseUnlocked(uId, state);
          const hasHeart = state.hearts[uId];
          const isSelected = state.selectedPortal === uId;

          return (
            <PortalMesh
              key={uId}
              universe={config}
              isUnlocked={unlocked}
              hasHeart={hasHeart}
              isSelected={isSelected}
              onSelect={() => selectPortal(uId)}
              reducedMotion={state.settings.reducedMotion}
            />
          );
        })}

        {/* Orbit Controls with polar/azimuth/distance limits and smooth damping */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={32}
          maxPolarAngle={Math.PI / 2 + 0.08} // Keep within upper fortress hemisphere
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
};
