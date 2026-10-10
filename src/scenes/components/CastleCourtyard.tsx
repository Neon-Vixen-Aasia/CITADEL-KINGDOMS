import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Cylinder, Cone, Sphere } from '@react-three/drei';
import {
  createStonePaverTexture,
  createStoneWallTexture,
  createStoneBumpTexture,
} from './CastleTextures';
import { CastleTorch } from './CastleTorch';
import { CastleBanner } from './CastleBanner';

interface CastleCourtyardProps {
  reducedMotion?: boolean;
}

export const CastleCourtyard: React.FC<CastleCourtyardProps> = ({ reducedMotion = false }) => {
  // Generate high quality procedural stone textures
  const paverTexture = useMemo(() => createStonePaverTexture(), []);
  const wallTexture = useMemo(() => createStoneWallTexture(), []);
  const bumpTexture = useMemo(() => createStoneBumpTexture(), []);

  // 8 Perimeter battlement positions
  const merlonAngles = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (idx * Math.PI * 2) / 8 + Math.PI / 8);
  }, []);

  // 4 Watchtower corner coordinates
  const towerPositions: Array<{ pos: [number, number, number]; angle: number }> = useMemo(() => {
    const r = 13.2;
    return [
      { pos: [Math.sin(Math.PI / 4) * r, 0, Math.cos(Math.PI / 4) * r], angle: Math.PI / 4 },
      { pos: [Math.sin((3 * Math.PI) / 4) * r, 0, Math.cos((3 * Math.PI) / 4) * r], angle: (3 * Math.PI) / 4 },
      { pos: [Math.sin((5 * Math.PI) / 4) * r, 0, Math.cos((5 * Math.PI) / 4) * r], angle: (5 * Math.PI) / 4 },
      { pos: [Math.sin((7 * Math.PI) / 4) * r, 0, Math.cos((7 * Math.PI) / 4) * r], angle: (7 * Math.PI) / 4 },
    ];
  }, []);

  // 4 Grand Regiment Banners flanking the courtyard entrances
  const bannerConfigs: Array<{
    theme: 'suncrest' | 'vanguard' | 'chronicler' | 'bastion';
    pos: [number, number, number];
    rot: [number, number, number];
  }> = useMemo(() => {
    const dist = 9.8;
    return [
      {
        theme: 'suncrest',
        pos: [0, 3.2, dist],
        rot: [0, Math.PI, 0],
      },
      {
        theme: 'vanguard',
        pos: [dist, 3.2, 0],
        rot: [0, -Math.PI / 2, 0],
      },
      {
        theme: 'chronicler',
        pos: [0, 3.2, -dist],
        rot: [0, 0, 0],
      },
      {
        theme: 'bastion',
        pos: [-dist, 3.2, 0],
        rot: [0, Math.PI / 2, 0],
      },
    ];
  }, []);

  return (
    <group position={[0, -1.8, 0]}>
      {/* ========================================================
          1. MAIN COURTYARD FLAGSTONE GROUND (Stone Paver Material)
         ======================================================== */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[12.2, 13.5, 1.5, 8]} />
        <meshStandardMaterial
          map={paverTexture}
          bumpMap={bumpTexture}
          bumpScale={0.07}
          roughness={0.88}
          metalness={0.12}
          color="#94a3b8"
        />
      </mesh>

      {/* Outer Sloped Foundation Stone Base */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[13.5, 15.0, 1.2, 8]} />
        <meshStandardMaterial
          map={wallTexture}
          bumpMap={bumpTexture}
          bumpScale={0.08}
          roughness={0.92}
          metalness={0.15}
          color="#475569"
        />
      </mesh>

      {/* ========================================================
          2. CENTRAL SOVEREIGN DAIS (Raised Imperial Stone Platform)
         ======================================================== */}
      {/* Lower Tier */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[5.2, 5.6, 0.4, 8]} />
        <meshStandardMaterial
          map={paverTexture}
          bumpMap={bumpTexture}
          bumpScale={0.06}
          roughness={0.82}
          color="#64748b"
        />
      </mesh>

      {/* Upper Octagonal Dais */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[4.2, 4.6, 0.35, 8]} />
        <meshStandardMaterial
          map={wallTexture}
          bumpMap={bumpTexture}
          bumpScale={0.06}
          roughness={0.8}
          color="#475569"
        />
      </mesh>

      {/* Carved Royal Brass Compass Rose & Runic Ring */}
      <mesh position={[0, 1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.8, 8]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#b45309"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      <mesh position={[0, 1.34, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
        <ringGeometry args={[2.0, 2.3, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#78350f"
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* 8 Stone Corbels supporting the central dais step */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const ang = (i * Math.PI * 2) / 8;
        return (
          <group key={`corbel-${i}`} position={[Math.sin(ang) * 4.9, 0.7, Math.cos(ang) * 4.9]} rotation={[0, -ang, 0]}>
            <Box args={[0.4, 0.35, 0.6]}>
              <meshStandardMaterial map={wallTexture} roughness={0.9} color="#334155" />
            </Box>
          </group>
        );
      })}

      {/* ========================================================
          3. FORTIFIED STONE RAMPARTS & CRENELLATIONS
         ======================================================== */}
      {merlonAngles.map((angle, idx) => {
        const radius = 12.1;
        const px = Math.sin(angle) * radius;
        const pz = Math.cos(angle) * radius;
        return (
          <group key={`merlon-${idx}`} position={[px, 1.3, pz]} rotation={[0, -angle, 0]}>
            {/* Main Battlement Merlon Stone */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.6, 1.3, 0.8]} />
              <meshStandardMaterial
                map={wallTexture}
                bumpMap={bumpTexture}
                bumpScale={0.08}
                roughness={0.88}
                color="#64748b"
              />
            </mesh>

            {/* Chiseled Capstone Slab on top */}
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[2.8, 0.16, 0.95]} />
              <meshStandardMaterial
                map={paverTexture}
                roughness={0.85}
                color="#94a3b8"
              />
            </mesh>

            {/* Vertical Arrow Loop / Embrasures in the Merlon */}
            <mesh position={[0, 0, 0.42]}>
              <boxGeometry args={[0.22, 0.8, 0.05]} />
              <meshBasicMaterial color="#020617" />
            </mesh>

            {/* Wall-Mounted Sconce Torch on Merlon Walkway */}
            {idx % 2 === 0 && (
              <CastleTorch
                position={[0, 0.3, -0.42]}
                rotation={[0, Math.PI, 0]}
                type="sconce"
                reducedMotion={reducedMotion}
              />
            )}
          </group>
        );
      })}

      {/* Parapet Lower Machicolations Ring under the battlements */}
      {merlonAngles.map((angle, idx) => {
        const radius = 12.5;
        const px = Math.sin(angle) * radius;
        const pz = Math.cos(angle) * radius;
        return (
          <group key={`machic-${idx}`} position={[px, 0.5, pz]} rotation={[0, -angle, 0]}>
            <Box args={[0.6, 0.6, 0.5]}>
              <meshStandardMaterial map={wallTexture} roughness={0.9} color="#1e293b" />
            </Box>
          </group>
        );
      })}

      {/* ========================================================
          4. FOUR MEDIEVAL CORNER WATCHTOWERS (Stone Bastions)
         ======================================================== */}
      {towerPositions.map((tower, idx) => (
        <group key={`tower-${idx}`} position={tower.pos}>
          {/* Main Tower Cylindrical Stone Bastion */}
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[1.6, 1.9, 5.0, 10]} />
            <meshStandardMaterial
              map={wallTexture}
              bumpMap={bumpTexture}
              bumpScale={0.09}
              roughness={0.88}
              color="#64748b"
            />
          </mesh>

          {/* Overhanging Parapet Walkway with Corbels */}
          <mesh position={[0, 5.2, 0]}>
            <cylinderGeometry args={[2.0, 1.7, 0.6, 10]} />
            <meshStandardMaterial
              map={paverTexture}
              bumpMap={bumpTexture}
              bumpScale={0.07}
              roughness={0.85}
              color="#475569"
            />
          </mesh>

          {/* Watchtower Crenellations */}
          {[0, 1, 2, 3, 4, 5].map((cIdx) => {
            const cAng = (cIdx * Math.PI * 2) / 6;
            return (
              <group key={`tc-${cIdx}`} position={[Math.sin(cAng) * 1.85, 5.8, Math.cos(cAng) * 1.85]}>
                <Box args={[0.65, 0.7, 0.35]} rotation={[0, -cAng, 0]}>
                  <meshStandardMaterial map={wallTexture} roughness={0.88} color="#334155" />
                </Box>
              </group>
            );
          })}

          {/* Conical Slate Watchtower Roof */}
          <mesh position={[0, 7.3, 0]}>
            <coneGeometry args={[2.1, 2.8, 10]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>

          {/* Tower Iron Spire Finial */}
          <Cylinder args={[0.04, 0.05, 1.4, 6]} position={[0, 9.2, 0]}>
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </Cylinder>
          <Sphere args={[0.1, 8, 8]} position={[0, 9.9, 0]}>
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </Sphere>

          {/* Narrow Watchman Arrow Slits */}
          {[0.2, -0.6].map((slitY, sIdx) => (
            <mesh key={`slit-${sIdx}`} position={[0, 3.2 + slitY * 1.5, 1.7]}>
              <boxGeometry args={[0.18, 0.9, 0.1]} />
              <meshBasicMaterial color="#020617" />
            </mesh>
          ))}

          {/* Wall Torch on Tower Face */}
          <CastleTorch
            position={[0, 2.8, 1.8]}
            rotation={[0, 0, 0]}
            type="sconce"
            reducedMotion={reducedMotion}
          />
        </group>
      ))}

      {/* ========================================================
          5. FOUR GRAND FIRE BRAZIERS (Warm Flickering Fire)
         ======================================================== */}
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((ang, i) => {
        const bx = Math.sin(ang) * 7.2;
        const bz = Math.cos(ang) * 7.2;
        return (
          <CastleTorch
            key={`brazier-${i}`}
            position={[bx, 0.7, bz]}
            type="brazier"
            reducedMotion={reducedMotion}
          />
        );
      })}

      {/* ========================================================
          6. FOUR HERALDIC REGIMENT GONFALONS (Banners of the Realm)
         ======================================================== */}
      {bannerConfigs.map((b, idx) => (
        <group key={`banner-${idx}`}>
          {/* Stone Pillar Stanchion for Banner */}
          <mesh position={[b.pos[0], b.pos[1] - 1.2, b.pos[2]]}>
            <boxGeometry args={[0.6, 3.2, 0.6]} />
            <meshStandardMaterial
              map={wallTexture}
              bumpMap={bumpTexture}
              bumpScale={0.06}
              roughness={0.9}
              color="#475569"
            />
          </mesh>

          {/* Carved Stone Pillar Capital */}
          <mesh position={[b.pos[0], b.pos[1] + 0.5, b.pos[2]]}>
            <boxGeometry args={[0.85, 0.3, 0.85]} />
            <meshStandardMaterial
              map={paverTexture}
              roughness={0.85}
              color="#64748b"
            />
          </mesh>

          {/* The Heraldic Banner Mesh */}
          <CastleBanner
            theme={b.theme}
            position={[b.pos[0], b.pos[1] + 0.35, b.pos[2]]}
            rotation={b.rot}
            scale={1.15}
            reducedMotion={reducedMotion}
          />
        </group>
      ))}

      {/* ========================================================
          7. SOLDIER WEAPON RACKS & ARMORY GEAR
         ======================================================== */}
      {[
        { pos: [5.2, 0.7, 5.2] as [number, number, number], rot: -Math.PI / 4 },
        { pos: [-5.2, 0.7, 5.2] as [number, number, number], rot: Math.PI / 4 },
        { pos: [5.2, 0.7, -5.2] as [number, number, number], rot: (-3 * Math.PI) / 4 },
        { pos: [-5.2, 0.7, -5.2] as [number, number, number], rot: (3 * Math.PI) / 4 },
      ].map((rack, rIdx) => (
        <group key={`rack-${rIdx}`} position={rack.pos} rotation={[0, rack.rot, 0]}>
          {/* Heavy Dark Oak A-Frame Weapon Stand */}
          <Box args={[1.8, 0.12, 0.5]} position={[0, 0.06, 0]}>
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </Box>
          <Box args={[0.1, 1.4, 0.1]} position={[-0.8, 0.7, 0]} rotation={[0, 0, -0.1]}>
            <meshStandardMaterial color="#361502" roughness={0.8} />
          </Box>
          <Box args={[0.1, 1.4, 0.1]} position={[0.8, 0.7, 0]} rotation={[0, 0, 0.1]}>
            <meshStandardMaterial color="#361502" roughness={0.8} />
          </Box>
          <Box args={[1.7, 0.08, 0.08]} position={[0, 1.1, 0]}>
            <meshStandardMaterial color="#361502" roughness={0.8} />
          </Box>

          {/* Two Knight Halberds (Polearms) leaning on rack */}
          {[-0.45, 0.45].map((hx, hIdx) => (
            <group key={`halb-${hIdx}`} position={[hx, 0.9, 0.05]} rotation={[0.12, 0, (hIdx - 0.5) * 0.1]}>
              {/* Ash Wood Shaft */}
              <Cylinder args={[0.035, 0.035, 2.0, 6]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#78350f" roughness={0.7} />
              </Cylinder>
              {/* Halberd Axe Head & Spike */}
              <Box args={[0.25, 0.28, 0.02]} position={[0.12, 0.95, 0]}>
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
              </Box>
              <Cone args={[0.06, 0.35, 4]} position={[0, 1.15, 0]}>
                <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} />
              </Cone>
              {/* Rear Armor Hook */}
              <Box args={[0.12, 0.08, 0.02]} position={[-0.08, 0.92, 0]}>
                <meshStandardMaterial color="#94a3b8" metalness={0.85} />
              </Box>
            </group>
          ))}

          {/* Center Knight Kite Shield */}
          <group position={[0, 0.65, 0.12]} rotation={[-0.1, 0, 0]}>
            {/* Curved Steel / Wood Shield */}
            <mesh>
              <boxGeometry args={[0.65, 0.95, 0.06]} />
              <meshStandardMaterial
                color={rIdx % 2 === 0 ? '#991b1b' : '#1e3a8a'}
                metalness={0.3}
                roughness={0.6}
              />
            </mesh>
            {/* Polished Iron Rim */}
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.69, 0.99, 0.02]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Center Boss Rivet */}
            <Sphere args={[0.1, 8, 8]} position={[0, 0.1, 0.04]}>
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
            </Sphere>
          </group>
        </group>
      ))}

      {/* ========================================================
          8. STONE BUTTRESSES FLANKING WALLS
         ======================================================== */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, bIdx) => {
        const br = 13.8;
        return (
          <group key={`buttress-${bIdx}`} position={[Math.sin(ang) * br, 0.2, Math.cos(ang) * br]} rotation={[0, -ang, 0]}>
            <Box args={[0.9, 2.2, 1.4]}>
              <meshStandardMaterial map={wallTexture} roughness={0.9} color="#334155" />
            </Box>
            <Box args={[0.7, 1.5, 0.8]} position={[0, 1.2, -0.2]}>
              <meshStandardMaterial map={wallTexture} roughness={0.9} color="#475569" />
            </Box>
          </group>
        );
      })}
    </group>
  );
};
