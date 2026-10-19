import * as THREE from 'three';
import { BiomeType } from '../types/game';

export interface BiomeConfig {
  id: BiomeType;
  name: string;
  badge: string;
  icon: string;
  description: string;
  skyTopColor: number;
  skyHorizonColor: number;
  skyBottomColor: number;
  fogColor: number;
  fogDensity: number;
  hemiSkyColor: number;
  hemiGroundColor: number;
  sunColor: number;
  sunIntensity: number;
  rimColor: number;
  accentGlow: string;
  platformColor: string;
  recommendedTrackId: string;
}

export const BIOMES: Record<BiomeType, BiomeConfig> = {
  sakura: {
    id: 'sakura',
    name: 'Цветущая Сакура',
    badge: 'Сакура Биом',
    icon: '🌸',
    description: 'Медитативный сад цветущей сакуры, мягкие сумерки, тории и парящие лепестки',
    skyTopColor: 0x160f29,
    skyHorizonColor: 0x3d1d3d,
    skyBottomColor: 0x12091c,
    fogColor: 0x22132e,
    fogDensity: 0.012,
    hemiSkyColor: 0xf472b6,
    hemiGroundColor: 0x1e102a,
    sunColor: 0xffd6e8,
    sunIntensity: 1.35,
    rimColor: 0xf43f5e,
    accentGlow: '#f43f5e',
    platformColor: '#1c1328',
    recommendedTrackId: 'zen-garden',
  },
  spring: {
    id: 'spring',
    name: 'Изумрудная Весна',
    badge: 'Весенний Биом',
    icon: '🌿',
    description: 'Пробуждение природы, свежие изумрудные островки, утренняя заря и цветочная пыльца',
    skyTopColor: 0x0c2538,
    skyHorizonColor: 0x115e59,
    skyBottomColor: 0x061a24,
    fogColor: 0x0d333b,
    fogDensity: 0.011,
    hemiSkyColor: 0x34d399,
    hemiGroundColor: 0x062820,
    sunColor: 0xecfdf5,
    sunIntensity: 1.45,
    rimColor: 0x10b981,
    accentGlow: '#10b981',
    platformColor: '#132822',
    recommendedTrackId: 'cosmic-chill',
  },
  summer: {
    id: 'summer',
    name: 'Солнечный Каньон',
    badge: 'Летний Биом',
    icon: '☀️',
    description: 'Яркий солнечный зенит, тёплые золотые скалы, лазурный горизонт и солнечные светлячки',
    skyTopColor: 0x0369a1,
    skyHorizonColor: 0x38bdf8,
    skyBottomColor: 0x082f49,
    fogColor: 0x0e3a59,
    fogDensity: 0.010,
    hemiSkyColor: 0xfde047,
    hemiGroundColor: 0x075985,
    sunColor: 0xffedd5,
    sunIntensity: 1.6,
    rimColor: 0x0284c7,
    accentGlow: '#0ea5e9',
    platformColor: '#182b3d',
    recommendedTrackId: 'starlight-lofi',
  },
  autumn: {
    id: 'autumn',
    name: 'Золотая Осень',
    badge: 'Осенний Биом',
    icon: '🍁',
    description: 'Багряно-золотой закат, туманные дали, медленно опадающие кленовые листья и уют',
    skyTopColor: 0x2e1065,
    skyHorizonColor: 0x9a3412,
    skyBottomColor: 0x1c0c24,
    fogColor: 0x2b151e,
    fogDensity: 0.013,
    hemiSkyColor: 0xfb923c,
    hemiGroundColor: 0x1f101d,
    sunColor: 0xffedd5,
    sunIntensity: 1.4,
    rimColor: 0xd97706,
    accentGlow: '#f59e0b',
    platformColor: '#281a17',
    recommendedTrackId: 'starlight-lofi',
  },
  winter: {
    id: 'winter',
    name: 'Ледяной Шпиль',
    badge: 'Зимний Биом',
    icon: '❄️',
    description: 'Полярное сияние, искрящийся морозный лёд, парящие кристаллы и танцующие снежинки',
    skyTopColor: 0x020f26,
    skyHorizonColor: 0x083344,
    skyBottomColor: 0x010817,
    fogColor: 0x06182c,
    fogDensity: 0.012,
    hemiSkyColor: 0x38bdf8,
    hemiGroundColor: 0x02172b,
    sunColor: 0xe0f2fe,
    sunIntensity: 1.3,
    rimColor: 0x38bdf8,
    accentGlow: '#38bdf8',
    platformColor: '#0f1f33',
    recommendedTrackId: 'aurora-borealis',
  },
};

/**
 * Creates a beautiful procedural gradient Skydome tailored to the active biome
 */
export function createBiomeSkyDome(biomeType: BiomeType): THREE.Mesh {
  const config = BIOMES[biomeType] || BIOMES.sakura;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth vertical celestial gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);

  const topHex = '#' + config.skyTopColor.toString(16).padStart(6, '0');
  const horizonHex = '#' + config.skyHorizonColor.toString(16).padStart(6, '0');
  const bottomHex = '#' + config.skyBottomColor.toString(16).padStart(6, '0');

  grad.addColorStop(0, topHex);
  grad.addColorStop(0.55, horizonHex);
  grad.addColorStop(0.8, bottomHex);
  grad.addColorStop(1, topHex);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Biome-specific celestial accents
  if (biomeType === 'sakura') {
    // Crescent glowing moon
    ctx.save();
    ctx.shadowColor = 'rgba(255, 214, 232, 0.9)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#fff0f5';
    ctx.beginPath();
    ctx.arc(380, 110, 36, 0, Math.PI * 2);
    ctx.fill();
    // Inner shadow cutout for crescent
    ctx.shadowBlur = 0;
    ctx.fillStyle = topHex;
    ctx.beginPath();
    ctx.arc(395, 102, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Gentle stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 90; i++) {
      const sx = (i * 137) % 512;
      const sy = (i * 83) % 220;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
  } else if (biomeType === 'winter') {
    // Aurora Borealis luminous curtains
    ctx.save();
    const auroraGrad = ctx.createLinearGradient(0, 100, 512, 180);
    auroraGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
    auroraGrad.addColorStop(0.3, 'rgba(52, 211, 153, 0.35)');
    auroraGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.45)');
    auroraGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.3)');
    auroraGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = auroraGrad;
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.bezierCurveTo(140, 120, 260, 210, 512, 130);
    ctx.lineTo(512, 70);
    ctx.bezierCurveTo(280, 140, 150, 60, 0, 120);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Bright polar stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 120; i++) {
      const sx = (i * 97) % 512;
      const sy = (i * 71) % 240;
      ctx.fillRect(sx, sy, (i % 5 === 0 ? 2.5 : 1.5), (i % 5 === 0 ? 2.5 : 1.5));
    }
  } else if (biomeType === 'summer') {
    // Radiant glowing sun
    ctx.save();
    const sunGrad = ctx.createRadialGradient(256, 120, 10, 256, 120, 90);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.8)');
    sunGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
    sunGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(256, 120, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (biomeType === 'autumn') {
    // Rich warm sunset orb & dusk twilight
    ctx.save();
    const duskGrad = ctx.createRadialGradient(340, 160, 15, 340, 160, 110);
    duskGrad.addColorStop(0, 'rgba(255, 237, 213, 0.95)');
    duskGrad.addColorStop(0.4, 'rgba(251, 146, 60, 0.7)');
    duskGrad.addColorStop(0.8, 'rgba(154, 52, 18, 0.3)');
    duskGrad.addColorStop(1, 'rgba(46, 16, 101, 0)');
    ctx.fillStyle = duskGrad;
    ctx.beginPath();
    ctx.arc(340, 160, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (biomeType === 'spring') {
    // Morning golden sunlight corona
    ctx.save();
    const morningGrad = ctx.createRadialGradient(180, 140, 12, 180, 140, 85);
    morningGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    morningGrad.addColorStop(0.4, 'rgba(167, 243, 208, 0.7)');
    morningGrad.addColorStop(1, 'rgba(12, 37, 56, 0)');
    ctx.fillStyle = morningGrad;
    ctx.beginPath();
    ctx.arc(180, 140, 85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const skyGeo = new THREE.SphereGeometry(450, 32, 24);
  const skyMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    depthWrite: false,
  });

  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  skyMesh.name = 'Biome_SkyDome';
  return skyMesh;
}

/**
 * Creates scenic background scenery (distant floating islands, torii gates, mountain spires)
 */
export function createBiomeDistantScenery(biomeType: BiomeType): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Biome_Distant_Scenery';

  const config = BIOMES[biomeType] || BIOMES.sakura;

  if (biomeType === 'sakura') {
    // Distant floating Pagoda / Torii island
    const islandGeo = new THREE.ConeGeometry(24, 32, 6);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x1f142b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.rotation.x = Math.PI;
    island.position.set(-60, 5, 95);
    group.add(island);

    // Torii Gate on distant island
    const toriiMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      emissive: 0x881337,
      emissiveIntensity: 0.4,
    });
    const postGeo = new THREE.CylinderGeometry(0.8, 0.8, 14, 8);
    const p1 = new THREE.Mesh(postGeo, toriiMat);
    p1.position.set(-66, 12, 95);
    const p2 = new THREE.Mesh(postGeo, toriiMat);
    p2.position.set(-54, 12, 95);

    const beamGeo = new THREE.BoxGeometry(18, 1.2, 1.2);
    const beam = new THREE.Mesh(beamGeo, toriiMat);
    beam.position.set(-60, 19, 95);

    const subBeamGeo = new THREE.BoxGeometry(14, 0.8, 0.8);
    const subBeam = new THREE.Mesh(subBeamGeo, toriiMat);
    subBeam.position.set(-60, 16.5, 95);

    group.add(p1, p2, beam, subBeam);

    // Distant floating mountain silhouettes
    const peakGeo = new THREE.ConeGeometry(38, 70, 5);
    const peakMat = new THREE.MeshStandardMaterial({
      color: 0x180f24,
      roughness: 0.9,
    });
    const peak1 = new THREE.Mesh(peakGeo, peakMat);
    peak1.position.set(90, 15, 130);
    const peak2 = new THREE.Mesh(peakGeo, peakMat);
    peak2.position.set(-110, 10, 120);
    peak2.scale.set(0.8, 0.8, 0.8);
    group.add(peak1, peak2);

    // Glowing Sakura lanterns in distance
    for (let i = 0; i < 5; i++) {
      const lanternGeo = new THREE.BoxGeometry(1.2, 2.2, 1.2);
      const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffa4c8 });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.set(-40 + i * 20, 4 + Math.sin(i) * 3, 70 + (i % 2) * 20);
      group.add(lantern);
    }
  } else if (biomeType === 'winter') {
    // Giant Ice Crystals & Glacial Mountains
    const crystalGeo = new THREE.OctahedronGeometry(18, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
    });
    const c1 = new THREE.Mesh(crystalGeo, crystalMat);
    c1.position.set(-80, 25, 110);
    c1.scale.set(1, 2.5, 1);

    const c2 = new THREE.Mesh(crystalGeo, crystalMat);
    c2.position.set(75, 20, 100);
    c2.scale.set(0.8, 2.2, 0.8);

    group.add(c1, c2);

    // Snowy peaks
    const snowPeakGeo = new THREE.ConeGeometry(45, 80, 6);
    const snowPeakMat = new THREE.MeshStandardMaterial({
      color: 0x0a2238,
      roughness: 0.6,
      metalness: 0.2,
    });
    const sp1 = new THREE.Mesh(snowPeakGeo, snowPeakMat);
    sp1.position.set(0, 15, 150);
    const sp2 = new THREE.Mesh(snowPeakGeo, snowPeakMat);
    sp2.position.set(-120, 8, 140);
    sp2.scale.set(0.7, 0.7, 0.7);
    group.add(sp1, sp2);
  } else if (biomeType === 'autumn') {
    // Golden autumn cliffs & sunset monoliths
    const spireGeo = new THREE.ConeGeometry(28, 65, 5);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x2d131f,
      roughness: 0.8,
    });
    const s1 = new THREE.Mesh(spireGeo, spireMat);
    s1.position.set(-75, 15, 100);
    const s2 = new THREE.Mesh(spireGeo, spireMat);
    s2.position.set(85, 22, 110);
    group.add(s1, s2);

    // Amber glowing cyber lanterns
    for (let i = 0; i < 6; i++) {
      const g = new THREE.SphereGeometry(1.6, 8, 8);
      const m = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const orb = new THREE.Mesh(g, m);
      orb.position.set(-50 + i * 22, 6 + Math.cos(i) * 4, 65 + (i % 2) * 15);
      group.add(orb);
    }
  } else if (biomeType === 'spring') {
    // Verdant emerald spires and waterfalls
    const spireGeo = new THREE.CylinderGeometry(4, 18, 60, 6);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x0f3329,
      roughness: 0.7,
      metalness: 0.2,
    });
    const sp1 = new THREE.Mesh(spireGeo, spireMat);
    sp1.position.set(-70, 10, 105);
    const sp2 = new THREE.Mesh(spireGeo, spireMat);
    sp2.position.set(70, 15, 95);
    group.add(sp1, sp2);

    // Glowing green energy crystals atop the spires
    const crysGeo = new THREE.OctahedronGeometry(6, 0);
    const crysMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const cr1 = new THREE.Mesh(crysGeo, crysMat);
    cr1.position.set(-70, 43, 105);
    const cr2 = new THREE.Mesh(crysGeo, crysMat);
    cr2.position.set(70, 48, 95);
    group.add(cr1, cr2);
  } else if (biomeType === 'summer') {
    // Sunken golden arches & azure monoliths
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x1c3854,
      roughness: 0.4,
      metalness: 0.7,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
    });
    const colGeo = new THREE.BoxGeometry(4, 45, 4);
    const c1 = new THREE.Mesh(colGeo, archMat);
    c1.position.set(-55, 15, 85);
    const c2 = new THREE.Mesh(colGeo, archMat);
    c2.position.set(-35, 15, 85);
    const beamGeo = new THREE.BoxGeometry(26, 3, 4);
    const beam = new THREE.Mesh(beamGeo, archMat);
    beam.position.set(-45, 38, 85);
    group.add(c1, c2, beam);

    const col3 = new THREE.Mesh(colGeo, archMat);
    col3.position.set(65, 18, 95);
    group.add(col3);
  }

  return group;
}

/**
 * Creates dynamic ambient weather particle system for the biome
 * (Sakura petals, winter snowflakes, autumn leaves, spring pollen, summer fireflies)
 */
export function createBiomeWeatherParticles(biomeType: BiomeType): {
  group: THREE.Group;
  update: (delta: number, playerPos: THREE.Vector3) => void;
} {
  const group = new THREE.Group();
  group.name = 'Biome_Weather_Particles';

  const particleCount = biomeType === 'winter' ? 600 : biomeType === 'sakura' ? 500 : 400;

  // Particle positions, velocities, and rotation speeds
  const positions = new Float32Array(particleCount * 3);
  const velocities: Array<{ vx: number; vy: number; vz: number; rotSpeed: number; phase: number }> = [];

  const spreadX = 70;
  const spreadY = 35;
  const spreadZ = 70;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * spreadX;
    positions[i * 3 + 1] = Math.random() * spreadY;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

    if (biomeType === 'sakura') {
      // Petals drift diagonally with gentle wind gusts
      velocities.push({
        vx: 0.8 + Math.random() * 1.2,
        vy: -(0.9 + Math.random() * 0.7),
        vz: 0.5 + Math.random() * 0.9,
        rotSpeed: 1.5 + Math.random() * 2.0,
        phase: Math.random() * Math.PI * 2,
      });
    } else if (biomeType === 'winter') {
      // Snow flakes fall slowly with horizontal sway
      velocities.push({
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(1.2 + Math.random() * 0.9),
        vz: (Math.random() - 0.5) * 0.4,
        rotSpeed: 0.8 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      });
    } else if (biomeType === 'autumn') {
      // Golden leaves sway and descend
      velocities.push({
        vx: 1.1 + Math.random() * 1.0,
        vy: -(1.0 + Math.random() * 0.8),
        vz: -0.6 + Math.random() * 1.2,
        rotSpeed: 2.0 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
      });
    } else if (biomeType === 'spring') {
      // Pollen spores float lazily and upward/downward
      velocities.push({
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.6,
        rotSpeed: 1.0 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    } else {
      // Summer fireflies float upward and glow
      velocities.push({
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.4 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        rotSpeed: 1.2 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Procedural canvas particle sprite
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const pctx = canvas.getContext('2d')!;

  if (biomeType === 'sakura') {
    // Sakura petal shape
    pctx.fillStyle = '#ff6b9d';
    pctx.beginPath();
    pctx.ellipse(32, 32, 22, 12, Math.PI / 4, 0, Math.PI * 2);
    pctx.fill();
    // Inner softer pink
    pctx.fillStyle = '#ffd1e1';
    pctx.beginPath();
    pctx.ellipse(32, 32, 14, 7, Math.PI / 4, 0, Math.PI * 2);
    pctx.fill();
  } else if (biomeType === 'winter') {
    // Soft crystalline snow circle with halo
    const rad = pctx.createRadialGradient(32, 32, 2, 32, 32, 28);
    rad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    rad.addColorStop(0.4, 'rgba(224, 242, 254, 0.8)');
    rad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    pctx.fillStyle = rad;
    pctx.beginPath();
    pctx.arc(32, 32, 28, 0, Math.PI * 2);
    pctx.fill();
  } else if (biomeType === 'autumn') {
    // Maple leaf golden-amber ellipse
    pctx.fillStyle = '#f97316';
    pctx.beginPath();
    pctx.ellipse(32, 32, 20, 14, Math.PI / 6, 0, Math.PI * 2);
    pctx.fill();
    pctx.fillStyle = '#fde047';
    pctx.beginPath();
    pctx.ellipse(32, 32, 12, 7, Math.PI / 6, 0, Math.PI * 2);
    pctx.fill();
  } else if (biomeType === 'spring') {
    // Glowing emerald dandelion/pollen mote
    const rad = pctx.createRadialGradient(32, 32, 2, 32, 32, 26);
    rad.addColorStop(0, 'rgba(236, 253, 245, 1)');
    rad.addColorStop(0.5, 'rgba(52, 211, 153, 0.7)');
    rad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    pctx.fillStyle = rad;
    pctx.beginPath();
    pctx.arc(32, 32, 26, 0, Math.PI * 2);
    pctx.fill();
  } else {
    // Summer warm firefly
    const rad = pctx.createRadialGradient(32, 32, 2, 32, 32, 26);
    rad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    rad.addColorStop(0.4, 'rgba(253, 224, 71, 0.85)');
    rad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    pctx.fillStyle = rad;
    pctx.beginPath();
    pctx.arc(32, 32, 26, 0, Math.PI * 2);
    pctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.PointsMaterial({
    size: biomeType === 'winter' ? 0.9 : 1.2,
    map: texture,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: biomeType === 'winter' || biomeType === 'summer' ? THREE.AdditiveBlending : THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);
  group.add(points);

  let time = 0;

  const update = (delta: number, playerPos: THREE.Vector3) => {
    time += delta;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const v = velocities[i];
      let px = posArr[i * 3 + 0];
      let py = posArr[i * 3 + 1];
      let pz = posArr[i * 3 + 2];

      // Oscillatory motion
      const flutter = Math.sin(time * v.rotSpeed + v.phase);

      if (biomeType === 'sakura') {
        px += (v.vx + flutter * 0.4) * delta * 4.0;
        py += v.vy * delta * 3.5;
        pz += (v.vz + Math.cos(time + v.phase) * 0.3) * delta * 4.0;
      } else if (biomeType === 'winter') {
        px += (v.vx + flutter * 0.3) * delta * 3.0;
        py += v.vy * delta * 4.0;
        pz += (v.vz + flutter * 0.2) * delta * 3.0;
      } else if (biomeType === 'autumn') {
        px += (v.vx + flutter * 0.5) * delta * 3.5;
        py += v.vy * delta * 3.2;
        pz += (v.vz + flutter * 0.4) * delta * 3.5;
      } else if (biomeType === 'summer') {
        px += (v.vx + flutter * 0.3) * delta * 2.5;
        py += v.vy * delta * 3.0;
        pz += (v.vz + Math.cos(time * 0.8) * 0.3) * delta * 2.5;
      } else {
        // Spring
        px += (v.vx + flutter * 0.4) * delta * 2.5;
        py += (v.vy + flutter * 0.3) * delta * 2.5;
        pz += (v.vz + Math.cos(time * 1.1) * 0.4) * delta * 2.5;
      }

      // Recycle particles relative to player
      const halfX = spreadX / 2;
      const halfZ = spreadZ / 2;

      if (py < playerPos.y - 4 || py > playerPos.y + spreadY + 4) {
        py = biomeType === 'summer' ? playerPos.y - 2 : playerPos.y + spreadY;
        px = playerPos.x + (Math.random() - 0.5) * spreadX;
        pz = playerPos.z + (Math.random() - 0.5) * spreadZ;
      }
      if (Math.abs(px - playerPos.x) > halfX) {
        px = playerPos.x - Math.sign(px - playerPos.x) * halfX;
      }
      if (Math.abs(pz - playerPos.z) > halfZ) {
        pz = playerPos.z - Math.sign(pz - playerPos.z) * halfZ;
      }

      posArr[i * 3 + 0] = px;
      posArr[i * 3 + 1] = py;
      posArr[i * 3 + 2] = pz;
    }

    posAttr.needsUpdate = true;
  };

  return { group, update };
}

/**
 * Creates custom seasonal grid and platform textures with glowing runic trims
 */
export function createBiomePlatformTexture(biomeType: BiomeType): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const config = BIOMES[biomeType] || BIOMES.sakura;

  // Base platform fill
  ctx.fillStyle = config.platformColor;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle metallic texture noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let i = 0; i < 700; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Grid line styles
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Outer glowing decorative border
  ctx.strokeStyle = config.accentGlow;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 496);

  // Corner runic emblems
  ctx.fillStyle = config.accentGlow;
  for (let x = 64; x <= 448; x += 128) {
    for (let y = 64; y <= 448; y += 128) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Biome-specific center emblem
  ctx.save();
  ctx.strokeStyle = config.accentGlow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 32, 0, Math.PI * 2);
  ctx.stroke();

  if (biomeType === 'sakura') {
    // 5-petal flower outline in center
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const px = 256 + Math.cos(angle) * 18;
      const py = 256 + Math.sin(angle) * 18;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.fill();
    }
  } else if (biomeType === 'winter') {
    // Snowflake 6-ray cross
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const ang = (a * Math.PI) / 3;
      ctx.moveTo(256, 256);
      ctx.lineTo(256 + Math.cos(ang) * 26, 256 + Math.sin(ang) * 26);
    }
    ctx.stroke();
  } else if (biomeType === 'summer') {
    // Sun rays circle
    ctx.beginPath();
    for (let a = 0; a < 8; a++) {
      const ang = (a * Math.PI) / 4;
      ctx.moveTo(256 + Math.cos(ang) * 36, 256 + Math.sin(ang) * 36);
      ctx.lineTo(256 + Math.cos(ang) * 44, 256 + Math.sin(ang) * 44);
    }
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
