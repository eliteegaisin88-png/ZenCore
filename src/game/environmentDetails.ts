import * as THREE from 'three';
import { BiomeType, PlatformDef } from '../types/game';

/**
 * Procedural Environmental Flora, Ponds, Snowdrifts, and Scenic Props
 * Tailored for seasonal biomes: Sakura, Spring, Summer, Autumn, Winter.
 */

// Shared reusable materials to avoid duplicate allocations
const trunkMat = new THREE.MeshStandardMaterial({
  color: 0x271c19,
  roughness: 0.9,
  metalness: 0.05,
});

const stoneMat = new THREE.MeshStandardMaterial({
  color: 0x334155,
  roughness: 0.85,
  metalness: 0.1,
});

const snowMat = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.95,
  metalness: 0.05,
});

const iceMat = new THREE.MeshStandardMaterial({
  color: 0xbae6fd,
  roughness: 0.15,
  metalness: 0.7,
  transparent: true,
  opacity: 0.85,
});

/**
 * 🌸 Sakura Cherry Blossom Tree
 */
export function createSakuraTree(scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Sakura_Tree';

  // Gnarled dark trunk
  const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.45 * scale, 3.2 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = (3.2 * scale) / 2;
  trunk.castShadow = true;
  group.add(trunk);

  // Curved secondary branches
  const b1Geo = new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 1.8 * scale, 6);
  const b1 = new THREE.Mesh(b1Geo, trunkMat);
  b1.position.set(0.4 * scale, 2.4 * scale, 0.2 * scale);
  b1.rotation.z = -0.55;
  b1.castShadow = true;
  group.add(b1);

  const b2 = new THREE.Mesh(b1Geo, trunkMat);
  b2.position.set(-0.4 * scale, 2.6 * scale, -0.2 * scale);
  b2.rotation.z = 0.55;
  b2.rotation.y = 0.6;
  b2.castShadow = true;
  group.add(b2);

  // Fluffy Pink Blossom Canopy (multiple organic clusters)
  const blossomMat1 = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.25,
    roughness: 0.85,
  });

  const blossomMat2 = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8,
    emissive: 0xf472b6,
    emissiveIntensity: 0.2,
    roughness: 0.9,
  });

  const folGeo = new THREE.DodecahedronGeometry(1.3 * scale, 1);
  const clusters = [
    { pos: [0, 3.6 * scale, 0], s: 1.25, m: blossomMat1 },
    { pos: [1.2 * scale, 3.3 * scale, 0.4 * scale], s: 1.0, m: blossomMat2 },
    { pos: [-1.1 * scale, 3.4 * scale, -0.3 * scale], s: 0.95, m: blossomMat1 },
    { pos: [0.3 * scale, 4.3 * scale, -0.2 * scale], s: 0.9, m: blossomMat2 },
    { pos: [-0.3 * scale, 3.8 * scale, 0.9 * scale], s: 0.85, m: blossomMat1 },
  ];

  clusters.forEach((c) => {
    const fol = new THREE.Mesh(folGeo, c.m);
    fol.position.set(c.pos[0], c.pos[1], c.pos[2]);
    fol.scale.set(c.s, c.s * 0.85, c.s);
    fol.castShadow = true;
    fol.receiveShadow = true;
    group.add(fol);
  });

  return group;
}

/**
 * ❄️ Snowy Pine Tree with Fluffy Snow Caps
 */
export function createSnowyPineTree(scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Snowy_Pine_Tree';

  // Pine trunk
  const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.45 * scale, 2.5 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = (2.5 * scale) / 2;
  trunk.castShadow = true;
  group.add(trunk);

  const pineMat = new THREE.MeshStandardMaterial({
    color: 0x164e63,
    roughness: 0.8,
  });

  // Layered conical tiers with white snow caps
  const tiers = [
    { y: 1.8 * scale, r: 2.2 * scale, h: 2.0 * scale },
    { y: 3.1 * scale, r: 1.7 * scale, h: 1.8 * scale },
    { y: 4.3 * scale, r: 1.2 * scale, h: 1.6 * scale },
    { y: 5.3 * scale, r: 0.7 * scale, h: 1.4 * scale },
  ];

  tiers.forEach((t) => {
    // Green pine tier
    const cGeo = new THREE.ConeGeometry(t.r, t.h, 7);
    const cone = new THREE.Mesh(cGeo, pineMat);
    cone.position.y = t.y;
    cone.castShadow = true;
    group.add(cone);

    // Thick fluffy snow cap on top of tier
    const snowCapGeo = new THREE.ConeGeometry(t.r * 0.95, t.h * 0.45, 7);
    const snowCap = new THREE.Mesh(snowCapGeo, snowMat);
    snowCap.position.y = t.y + t.h * 0.35;
    snowCap.castShadow = true;
    group.add(snowCap);
  });

  return group;
}

/**
 * 🍁 Golden Autumn Maple Tree
 */
export function createAutumnMapleTree(scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Autumn_Maple_Tree';

  const trunkGeo = new THREE.CylinderGeometry(0.32 * scale, 0.5 * scale, 3.4 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = (3.4 * scale) / 2;
  trunk.castShadow = true;
  group.add(trunk);

  const colors = [0xf59e0b, 0xea580c, 0xb91c1c, 0xfbbf24];
  const folGeo = new THREE.DodecahedronGeometry(1.3 * scale, 1);

  const clusters = [
    { pos: [0, 3.8 * scale, 0], s: 1.3, c: colors[0] },
    { pos: [1.2 * scale, 3.5 * scale, 0.3 * scale], s: 1.05, c: colors[1] },
    { pos: [-1.2 * scale, 3.3 * scale, -0.4 * scale], s: 1.0, c: colors[2] },
    { pos: [0.2 * scale, 4.6 * scale, -0.2 * scale], s: 0.9, c: colors[3] },
    { pos: [-0.3 * scale, 4.0 * scale, 1.0 * scale], s: 0.95, c: colors[0] },
  ];

  clusters.forEach((c) => {
    const mat = new THREE.MeshStandardMaterial({
      color: c.c,
      roughness: 0.85,
      emissive: c.c,
      emissiveIntensity: 0.15,
    });
    const fol = new THREE.Mesh(folGeo, mat);
    fol.position.set(c.pos[0], c.pos[1], c.pos[2]);
    fol.scale.set(c.s, c.s * 0.85, c.s);
    fol.castShadow = true;
    group.add(fol);
  });

  return group;
}

/**
 * 🌿 Spring Willow / Blooming Tree
 */
export function createSpringWillowTree(scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Spring_Willow_Tree';

  const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.45 * scale, 3.0 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = (3.0 * scale) / 2;
  trunk.castShadow = true;
  group.add(trunk);

  const matEmerald = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.2,
    roughness: 0.85,
  });

  const matLime = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.85,
  });

  const folGeo = new THREE.DodecahedronGeometry(1.25 * scale, 1);
  const clusters = [
    { pos: [0, 3.5 * scale, 0], s: 1.25, m: matEmerald },
    { pos: [1.1 * scale, 3.2 * scale, 0.2 * scale], s: 1.0, m: matLime },
    { pos: [-1.0 * scale, 3.0 * scale, -0.2 * scale], s: 0.95, m: matEmerald },
    { pos: [0, 4.2 * scale, -0.3 * scale], s: 0.9, m: matLime },
  ];

  clusters.forEach((c) => {
    const fol = new THREE.Mesh(folGeo, c.m);
    fol.position.set(c.pos[0], c.pos[1], c.pos[2]);
    fol.scale.set(c.s, c.s * 0.9, c.s);
    fol.castShadow = true;
    group.add(fol);
  });

  return group;
}

/**
 * ☀️ Summer Tropical / Lush Tree
 */
export function createSummerTree(scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Summer_Tree';

  const trunkGeo = new THREE.CylinderGeometry(0.32 * scale, 0.5 * scale, 3.5 * scale, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = (3.5 * scale) / 2;
  trunk.castShadow = true;
  group.add(trunk);

  const mat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const mat2 = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.85 });

  const folGeo = new THREE.DodecahedronGeometry(1.3 * scale, 1);
  const clusters = [
    { pos: [0, 3.8 * scale, 0], s: 1.3, m: mat1 },
    { pos: [1.2 * scale, 3.4 * scale, 0.3 * scale], s: 1.0, m: mat2 },
    { pos: [-1.2 * scale, 3.2 * scale, -0.3 * scale], s: 0.95, m: mat1 },
    { pos: [0, 4.6 * scale, -0.2 * scale], s: 0.85, m: mat2 },
  ];

  clusters.forEach((c) => {
    const fol = new THREE.Mesh(folGeo, c.m);
    fol.position.set(c.pos[0], c.pos[1], c.pos[2]);
    fol.scale.set(c.s, c.s * 0.85, c.s);
    fol.castShadow = true;
    group.add(fol);
  });

  return group;
}

/**
 * Universal tree dispatcher
 */
export function createTreeForBiome(biome: BiomeType, scale = 1.0): THREE.Group {
  switch (biome) {
    case 'sakura':
      return createSakuraTree(scale);
    case 'winter':
      return createSnowyPineTree(scale);
    case 'autumn':
      return createAutumnMapleTree(scale);
    case 'spring':
      return createSpringWillowTree(scale);
    case 'summer':
      return createSummerTree(scale);
    default:
      return createSakuraTree(scale);
  }
}

/**
 * 🌊 Scenic Biome Pond / Lake with Shimmering Water and Flora
 */
export function createScenicPond(biome: BiomeType, radius = 2.4): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Scenic_Pond';

  // Surrounding stone basin ring
  const ringGeo = new THREE.TorusGeometry(radius, 0.35, 8, 24);
  const ring = new THREE.Mesh(ringGeo, stoneMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  ring.receiveShadow = true;
  group.add(ring);

  // Translucent water surface
  let waterColor = 0x06b6d4;
  if (biome === 'sakura') waterColor = 0x38bdf8;
  else if (biome === 'spring') waterColor = 0x10b981;
  else if (biome === 'summer') waterColor = 0x0284c7;
  else if (biome === 'autumn') waterColor = 0x0369a1;
  else if (biome === 'winter') waterColor = 0x7dd3fc;

  const waterMat = new THREE.MeshStandardMaterial({
    color: waterColor,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8,
  });

  const waterGeo = new THREE.CircleGeometry(radius * 0.95, 24);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.05;
  water.receiveShadow = true;
  group.add(water);

  // Biome-specific water decorations
  if (biome === 'sakura' || biome === 'spring') {
    // Floating Lilypads with Lotus Blossoms
    const padMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const lotusMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });

    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3 + 0.4;
      const dist = radius * 0.5;
      const lx = Math.cos(ang) * dist;
      const lz = Math.sin(ang) * dist;

      // Lilypad
      const padGeo = new THREE.CircleGeometry(0.35, 12);
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(lx, 0.06, lz);
      group.add(pad);

      // Lotus Flower center
      const lotusGeo = new THREE.ConeGeometry(0.18, 0.22, 6);
      const lotus = new THREE.Mesh(lotusGeo, lotusMat);
      lotus.position.set(lx, 0.16, lz);
      group.add(lotus);
    }
  } else if (biome === 'winter') {
    // Floating Ice Floes
    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const dist = radius * 0.45;
      const iceFloeGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.08, 6);
      const iceFloe = new THREE.Mesh(iceFloeGeo, iceMat);
      iceFloe.position.set(Math.cos(ang) * dist, 0.08, Math.sin(ang) * dist);
      group.add(iceFloe);
    }
  } else if (biome === 'autumn') {
    // Fallen floating leaves
    const leafMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI * 2) / 4 + 0.3;
      const dist = radius * 0.55;
      const leafGeo = new THREE.CircleGeometry(0.2, 5);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.rotation.x = -Math.PI / 2;
      leaf.position.set(Math.cos(ang) * dist, 0.06, Math.sin(ang) * dist);
      group.add(leaf);
    }
  }

  return group;
}

/**
 * ❄️ Fluffy Snowdrifts & Snow Mounds for Winter Biome
 */
export function createSnowDrift(size = [2.2, 0.7, 2.2]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Snow_Drift';

  // Smooth squashed hemisphere
  const moundGeo = new THREE.SphereGeometry(1, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const mound = new THREE.Mesh(moundGeo, snowMat);
  mound.scale.set(size[0], size[1], size[2]);
  mound.castShadow = true;
  mound.receiveShadow = true;
  group.add(mound);

  // Secondary smaller overlapping snow hump for natural variation
  const mound2 = new THREE.Mesh(moundGeo, snowMat);
  mound2.scale.set(size[0] * 0.65, size[1] * 0.85, size[2] * 0.65);
  mound2.position.set(size[0] * 0.35, 0, -size[2] * 0.25);
  mound2.castShadow = true;
  mound2.receiveShadow = true;
  group.add(mound2);

  return group;
}

/**
 * ❄️ Hanging Icicle Clusters for Winter Platform Edges
 */
export function createHangingIcicles(width = 4.0): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Hanging_Icicles';

  const count = Math.floor(width * 2.5);
  const coneGeo = new THREE.ConeGeometry(0.08, 0.8, 5);

  for (let i = 0; i < count; i++) {
    const icicle = new THREE.Mesh(coneGeo, iceMat);
    const x = -width / 2 + (i / count) * width + (Math.random() - 0.5) * 0.15;
    const len = 0.5 + Math.random() * 0.7;
    icicle.scale.set(1, len, 1);
    icicle.rotation.x = Math.PI; // point down
    icicle.position.set(x, -len * 0.4, 0);
    group.add(icicle);
  }

  return group;
}

/**
 * 🌸 Japanese Stone Lantern (Kasuga Toro) for Sakura Biome
 */
export function createStoneLantern(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Stone_Lantern';

  // Base pedestal
  const baseGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
  const base = new THREE.Mesh(baseGeo, stoneMat);
  base.position.y = 0.15;
  base.castShadow = true;
  group.add(base);

  // Column shaft
  const colGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 6);
  const col = new THREE.Mesh(colGeo, stoneMat);
  col.position.y = 0.9;
  col.castShadow = true;
  group.add(col);

  // Middle shelf
  const shelfGeo = new THREE.BoxGeometry(0.9, 0.2, 0.9);
  const shelf = new THREE.Mesh(shelfGeo, stoneMat);
  shelf.position.y = 1.6;
  shelf.castShadow = true;
  group.add(shelf);

  // Glowing lantern flame chamber
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const lightGeo = new THREE.BoxGeometry(0.45, 0.5, 0.45);
  const light = new THREE.Mesh(lightGeo, lightMat);
  light.position.y = 1.95;
  group.add(light);

  // Pagoda roof
  const roofGeo = new THREE.ConeGeometry(0.85, 0.5, 4);
  const roof = new THREE.Mesh(roofGeo, stoneMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 2.4;
  roof.castShadow = true;
  group.add(roof);

  return group;
}

/**
 * 🌿 Colorful Flowerbed for Spring Biome
 */
export function createFlowerbed(radius = 1.5): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Flowerbed';

  // Moss patch base
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const mossGeo = new THREE.CircleGeometry(radius, 12);
  const moss = new THREE.Mesh(mossGeo, mossMat);
  moss.rotation.x = -Math.PI / 2;
  moss.position.y = 0.02;
  group.add(moss);

  // Wild flowers
  const colors = [0x38bdf8, 0xf43f5e, 0xfacc15, 0xa855f7, 0xffffff];
  const flowerGeo = new THREE.SphereGeometry(0.12, 6, 6);

  for (let i = 0; i < 16; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.random() * (radius * 0.85);
    const fx = Math.cos(ang) * r;
    const fz = Math.sin(ang) * r;

    const fMat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
    const flower = new THREE.Mesh(flowerGeo, fMat);
    flower.position.set(fx, 0.2 + Math.random() * 0.15, fz);
    group.add(flower);

    // Green stem
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 4);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(fx, 0.1, fz);
    group.add(stem);
  }

  return group;
}

/**
 * Automatically populates the platforms with rich contextual biome props
 * (trees on platform corners, lakes/ponds, snowdrifts, lanterns, flowers)
 */
export function createPlatformDecorations(platforms: PlatformDef[], biome: BiomeType): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Platform_Decorations';

  platforms.forEach((plat, pIdx) => {
    const [w, h, d] = plat.size;
    const [px, py, pz] = plat.position;
    const topY = py + h / 2;

    // A. Winter Icicles along edges
    if (biome === 'winter' && w >= 4) {
      const iciclesFront = createHangingIcicles(w * 0.85);
      iciclesFront.position.set(px, topY - h, pz + d / 2 + 0.05);
      group.add(iciclesFront);
    }

    // B. Large Courtyard Platforms (>= 7x7) get small corner accents ONLY (no lakes/ponds on platforms!)
    if (w >= 7 && d >= 7) {
      if (biome === 'winter') {
        // Small snowdrifts strictly tucked into outer corner
        const s1 = createSnowDrift([1.4, 0.5, 1.4]);
        s1.position.set(px + w / 2 - 1.0, topY, pz + d / 2 - 1.0);
        group.add(s1);

        // Snowy pine tree strictly in back corner
        const pine = createSnowyPineTree(0.95);
        pine.position.set(px + w / 2 - 1.2, topY, pz - d / 2 + 1.2);
        group.add(pine);
      } else if (biome === 'sakura') {
        // Beautiful blooming Sakura tree tucked on back corner
        const tree = createSakuraTree(1.0);
        tree.position.set(px + w / 2 - 1.2, topY, pz - d / 2 + 1.2);
        group.add(tree);

        // Small decorative stone lantern on opposite corner
        const lantern = createStoneLantern();
        lantern.position.set(px - w / 2 + 1.0, topY, pz - d / 2 + 1.0);
        group.add(lantern);
      } else if (biome === 'autumn') {
        // Golden Maple Tree on corner
        const tree = createAutumnMapleTree(1.0);
        tree.position.set(px + w / 2 - 1.2, topY, pz - d / 2 + 1.2);
        group.add(tree);
      } else if (biome === 'spring') {
        // Spring Willow Tree on corner
        const tree = createSpringWillowTree(1.0);
        tree.position.set(px + w / 2 - 1.2, topY, pz - d / 2 + 1.2);
        group.add(tree);

        // Small corner flowerbed
        const fb1 = createFlowerbed(1.1);
        fb1.position.set(px - w / 2 + 1.2, topY, pz + d / 2 - 1.2);
        group.add(fb1);
      } else if (biome === 'summer') {
        // Summer Tree on corner
        const tree = createSummerTree(1.0);
        tree.position.set(px + w / 2 - 1.2, topY, pz - d / 2 + 1.2);
        group.add(tree);
      }
    }
  });

  return group;
}

/**
 * Creates rich floating islands and natural scenery immediately around the level
 * (within 15-35 units of the play arena) so the world feels lush, deep, and alive!
 */
export function createNearbyScenicIslands(biome: BiomeType, levelLength = 40): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Nearby_Scenic_Islands';

  const islandPositions = [
    { x: -18, y: -2, z: 10, r: 6, h: 8 },
    { x: 19, y: 1, z: 18, r: 7, h: 9 },
    { x: -22, y: 3, z: 28, r: 8, h: 10 },
    { x: 21, y: 4, z: 36, r: 7, h: 9 },
  ];

  const islandMat = new THREE.MeshStandardMaterial({
    color: biome === 'winter' ? 0x0f2742 : biome === 'sakura' ? 0x22132e : 0x1e293b,
    roughness: 0.9,
    metalness: 0.1,
  });

  islandPositions.forEach((pos, idx) => {
    // Floating inverted cone rock
    const rockGeo = new THREE.ConeGeometry(pos.r, pos.h, 7);
    const rock = new THREE.Mesh(rockGeo, islandMat);
    rock.rotation.x = Math.PI;
    rock.position.set(pos.x, pos.y, pos.z);
    rock.receiveShadow = true;
    group.add(rock);

    // Top surface disk
    const topGeo = new THREE.CylinderGeometry(pos.r, pos.r * 0.95, 0.4, 8);
    const topMat = new THREE.MeshStandardMaterial({
      color:
        biome === 'winter'
          ? 0xf8fafc
          : biome === 'sakura'
          ? 0x3b1d3d
          : biome === 'spring'
          ? 0x166534
          : biome === 'autumn'
          ? 0x451a03
          : 0x1e3a8a,
      roughness: 0.85,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.set(pos.x, pos.y + 0.2, pos.z);
    topMesh.receiveShadow = true;
    group.add(topMesh);

    const surfaceY = pos.y + 0.4;

    // Props on the floating island
    if (biome === 'winter') {
      // Pine tree + snowdrift
      const tree = createSnowyPineTree(1.2);
      tree.position.set(pos.x - 1.5, surfaceY, pos.z - 1.0);
      const drift = createSnowDrift([2.2, 0.8, 2.2]);
      drift.position.set(pos.x + 1.2, surfaceY, pos.z + 1.2);
      group.add(tree, drift);

      // Distant frozen pool on island 2
      if (idx === 1) {
        const pond = createScenicPond(biome, 2.2);
        pond.position.set(pos.x, surfaceY, pos.z);
        group.add(pond);
      }
    } else if (biome === 'sakura') {
      // Sakura tree + stone lantern
      const tree = createSakuraTree(1.3);
      tree.position.set(pos.x + 1.0, surfaceY, pos.z - 1.0);
      const lantern = createStoneLantern();
      lantern.position.set(pos.x - 2.0, surfaceY, pos.z + 1.0);
      group.add(tree, lantern);

      // Lotus pond on island 0
      if (idx === 0) {
        const pond = createScenicPond(biome, 2.2);
        pond.position.set(pos.x - 1.2, surfaceY, pos.z + 0.8);
        group.add(pond);
      }
    } else if (biome === 'autumn') {
      const tree = createAutumnMapleTree(1.3);
      tree.position.set(pos.x - 1.0, surfaceY, pos.z + 1.0);
      group.add(tree);

      if (idx === 2) {
        const pond = createScenicPond(biome, 2.4);
        pond.position.set(pos.x + 0.5, surfaceY, pos.z - 0.5);
        group.add(pond);
      }
    } else if (biome === 'spring') {
      const tree = createSpringWillowTree(1.25);
      tree.position.set(pos.x + 1.0, surfaceY, pos.z - 1.0);
      const fb = createFlowerbed(2.0);
      fb.position.set(pos.x - 1.2, surfaceY, pos.z + 1.2);
      group.add(tree, fb);

      if (idx === 1) {
        const pond = createScenicPond(biome, 2.2);
        pond.position.set(pos.x, surfaceY, pos.z);
        group.add(pond);
      }
    } else {
      // Summer
      const tree = createSummerTree(1.3);
      tree.position.set(pos.x - 1.0, surfaceY, pos.z - 1.0);
      group.add(tree);

      if (idx === 0 || idx === 3) {
        const pond = createScenicPond(biome, 2.4);
        pond.position.set(pos.x + 1.0, surfaceY, pos.z + 1.0);
        group.add(pond);
      }
    }
  });

  return group;
}

/**
 * 🌊 High-Graphic Animated Scenic Waterfall in Empty Surrounding Space
 * Positioned in the scenic canyon abyss (x: -24, z: 22) plunging from y: +15 down to y: -12.
 * Completely off platforms, featuring animated multi-layered water torrents,
 * rising misty fog particles, splash droplets, expanding lake ripple rings,
 * biome-specific coloring, cliff crags, and an iridescent mist rainbow!
 */

export interface ScenicWaterfallInstance {
  group: THREE.Group;
  update: (delta: number) => void;
  dispose: () => void;
}

/**
 * Creates a high-fidelity procedural canvas texture for cascading rushing water
 */
function createWaterfallTexture(biome: BiomeType): {
  curtainTex: THREE.CanvasTexture;
  rapidsTex: THREE.CanvasTexture;
  rippleTex: THREE.CanvasTexture;
  mistTex: THREE.CanvasTexture;
  rainbowTex: THREE.CanvasTexture;
} {
  // 1. Cascading Curtain Texture (256x512)
  const cCanvas = document.createElement('canvas');
  cCanvas.width = 256;
  cCanvas.height = 512;
  const cCtx = cCanvas.getContext('2d')!;

  let baseColor = 'rgba(56, 189, 248, 0.45)'; // cyan-azure
  let deepColor = 'rgba(3, 105, 161, 0.65)';
  if (biome === 'sakura') {
    baseColor = 'rgba(125, 211, 252, 0.5)';
    deepColor = 'rgba(14, 116, 144, 0.7)';
  } else if (biome === 'spring') {
    baseColor = 'rgba(52, 211, 153, 0.5)';
    deepColor = 'rgba(4, 120, 87, 0.7)';
  } else if (biome === 'winter') {
    baseColor = 'rgba(186, 230, 253, 0.6)';
    deepColor = 'rgba(7, 89, 133, 0.75)';
  } else if (biome === 'autumn') {
    baseColor = 'rgba(56, 189, 248, 0.45)';
    deepColor = 'rgba(30, 64, 175, 0.65)';
  }

  // Base translucent water background
  cCtx.fillStyle = baseColor;
  cCtx.fillRect(0, 0, 256, 512);

  // Vertical rushing water flumes & caustics
  for (let x = 0; x < 256; x += 3) {
    const streamGrad = cCtx.createLinearGradient(x, 0, x + 4, 512);
    streamGrad.addColorStop(0, deepColor);
    streamGrad.addColorStop(0.3, baseColor);
    streamGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
    streamGrad.addColorStop(1, deepColor);
    cCtx.fillStyle = streamGrad;
    cCtx.fillRect(x, 0, 2, 512);
  }

  // Frothing white foam streaks
  cCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 48; i++) {
    const rx = Math.random() * 240 + 8;
    const ry = Math.random() * 480;
    const rw = 2 + Math.random() * 5;
    const rh = 25 + Math.random() * 70;
    cCtx.fillRect(rx, ry, rw, rh);
  }

  const curtainTex = new THREE.CanvasTexture(cCanvas);
  curtainTex.wrapS = THREE.RepeatWrapping;
  curtainTex.wrapT = THREE.RepeatWrapping;
  curtainTex.repeat.set(1, 2.5);

  // 2. High-speed Rapids Core Texture (128x256)
  const rCanvas = document.createElement('canvas');
  rCanvas.width = 128;
  rCanvas.height = 256;
  const rCtx = rCanvas.getContext('2d')!;
  rCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  rCtx.fillRect(0, 0, 128, 256);
  // Torrent turbulence
  for (let i = 0; i < 60; i++) {
    const rx = Math.random() * 128;
    const ry = Math.random() * 256;
    rCtx.fillStyle = i % 2 === 0 ? 'rgba(224, 242, 254, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    rCtx.fillRect(rx, ry, 3 + Math.random() * 6, 20 + Math.random() * 50);
  }
  const rapidsTex = new THREE.CanvasTexture(rCanvas);
  rapidsTex.wrapS = THREE.RepeatWrapping;
  rapidsTex.wrapT = THREE.RepeatWrapping;
  rapidsTex.repeat.set(1, 3);

  // 3. Lake Ripples Texture (256x256)
  const ripCanvas = document.createElement('canvas');
  ripCanvas.width = 256;
  ripCanvas.height = 256;
  const ripCtx = ripCanvas.getContext('2d')!;
  ripCtx.clearRect(0, 0, 256, 256);
  for (let r = 20; r < 120; r += 16) {
    ripCtx.beginPath();
    ripCtx.arc(128, 128, r, 0, Math.PI * 2);
    ripCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ripCtx.lineWidth = 3.5;
    ripCtx.stroke();
  }
  const rippleTex = new THREE.CanvasTexture(ripCanvas);

  // 4. Soft Mist Particle Texture (64x64)
  const mCanvas = document.createElement('canvas');
  mCanvas.width = 64;
  mCanvas.height = 64;
  const mCtx = mCanvas.getContext('2d')!;
  const mGrad = mCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
  mGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  mGrad.addColorStop(0.4, 'rgba(224, 242, 254, 0.45)');
  mGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  mCtx.fillStyle = mGrad;
  mCtx.fillRect(0, 0, 64, 64);
  const mistTex = new THREE.CanvasTexture(mCanvas);

  // 5. Iridescent Rainbow Texture (128x128)
  const rbCanvas = document.createElement('canvas');
  rbCanvas.width = 128;
  rbCanvas.height = 128;
  const rbCtx = rbCanvas.getContext('2d')!;
  const rbGrad = rbCtx.createRadialGradient(64, 64, 30, 64, 64, 60);
  rbGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  rbGrad.addColorStop(0.4, 'rgba(244, 63, 94, 0.45)');  // red/pink
  rbGrad.addColorStop(0.55, 'rgba(234, 179, 8, 0.5)'); // yellow
  rbGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.5)'); // green
  rbGrad.addColorStop(0.85, 'rgba(56, 189, 248, 0.5)'); // blue
  rbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  rbCtx.fillStyle = rbGrad;
  rbCtx.fillRect(0, 0, 128, 128);
  const rainbowTex = new THREE.CanvasTexture(rbCanvas);

  return { curtainTex, rapidsTex, rippleTex, mistTex, rainbowTex };
}

export function createScenicWaterfall(biome: BiomeType): ScenicWaterfallInstance {
  const group = new THREE.Group();
  group.name = 'Scenic_Waterfall_Environment';

  const textures = createWaterfallTexture(biome);

  // Geographic anchor in empty void to the flank of platforms
  const originX = -25;
  const originZ = 22;
  const cliffTopY = 15.0;
  const lakeSurfaceY = -11.8;
  const waterfallHeight = cliffTopY - lakeSurfaceY; // 26.8 units sheer drop!

  // -------------------------------------------------------------
  // 1. CLIFF ROCK FORMATION (High precipice & rugged gorge)
  // -------------------------------------------------------------
  const rockMat = new THREE.MeshStandardMaterial({
    color: biome === 'winter' ? 0x1e293b : biome === 'sakura' ? 0x22132a : 0x1e293b,
    roughness: 0.92,
    metalness: 0.12,
  });

  // Upper mountain cliff plateau (where water originates)
  const upperCliffGeo = new THREE.ConeGeometry(9.0, 10.0, 8);
  const upperCliff = new THREE.Mesh(upperCliffGeo, rockMat);
  upperCliff.rotation.x = Math.PI; // inverted cone cliff
  upperCliff.position.set(originX - 3.5, cliffTopY - 4.5, originZ);
  upperCliff.receiveShadow = true;
  group.add(upperCliff);

  // Cliff top plateau surface
  const plateauGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.8, 8);
  const plateauMat = new THREE.MeshStandardMaterial({
    color:
      biome === 'winter'
        ? 0xf8fafc
        : biome === 'sakura'
        ? 0x3d1a3c
        : biome === 'spring'
        ? 0x14532d
        : biome === 'autumn'
        ? 0x451a03
        : 0x1e3a5f,
    roughness: 0.88,
  });
  const plateau = new THREE.Mesh(plateauGeo, plateauMat);
  plateau.position.set(originX - 3.5, cliffTopY, originZ);
  plateau.receiveShadow = true;
  group.add(plateau);

  // Natural Overhanging Lip Rock where water shoots out into the air
  const lipRockGeo = new THREE.BoxGeometry(7.0, 1.6, 3.5);
  const lipRock = new THREE.Mesh(lipRockGeo, rockMat);
  lipRock.position.set(originX, cliffTopY - 0.7, originZ);
  lipRock.receiveShadow = true;
  group.add(lipRock);

  // Intermediate protruding crags (where secondary water splashes)
  const crag1Geo = new THREE.DodecahedronGeometry(3.0, 1);
  const crag1 = new THREE.Mesh(crag1Geo, rockMat);
  crag1.position.set(originX - 2.8, 4.0, originZ + 3.2);
  crag1.receiveShadow = true;
  group.add(crag1);

  const crag2 = new THREE.Mesh(crag1Geo, rockMat);
  crag2.position.set(originX - 2.5, 0.0, originZ - 3.4);
  crag2.receiveShadow = true;
  group.add(crag2);

  // Cliff-side Trees & Flora
  if (biome === 'sakura') {
    const cliffSakura = createSakuraTree(1.25);
    cliffSakura.position.set(originX - 4.5, cliffTopY + 0.4, originZ - 2.5);
    group.add(cliffSakura);

    const lantern = createStoneLantern();
    lantern.position.set(originX - 1.2, cliffTopY + 0.4, originZ + 3.0);
    group.add(lantern);
  } else if (biome === 'winter') {
    const pine = createSnowyPineTree(1.35);
    pine.position.set(originX - 4.5, cliffTopY + 0.4, originZ - 2.5);
    group.add(pine);

    // Large hanging crystal icicles along the cliff lip
    const icicleCascade = createHangingIcicles(8.0);
    icicleCascade.position.set(originX, cliffTopY - 1.5, originZ + 2.0);
    icicleCascade.scale.set(1.4, 2.2, 1.4);
    group.add(icicleCascade);
  } else if (biome === 'spring') {
    const willow = createSpringWillowTree(1.3);
    willow.position.set(originX - 4.5, cliffTopY + 0.4, originZ - 2.5);
    group.add(willow);
    const fb = createFlowerbed(2.0);
    fb.position.set(originX - 2.0, cliffTopY + 0.4, originZ + 2.0);
    group.add(fb);
  } else if (biome === 'autumn') {
    const maple = createAutumnMapleTree(1.3);
    maple.position.set(originX - 4.5, cliffTopY + 0.4, originZ - 2.5);
    group.add(maple);
  } else {
    const summerT = createSummerTree(1.3);
    summerT.position.set(originX - 4.5, cliffTopY + 0.4, originZ - 2.5);
    group.add(summerT);
  }

  // -------------------------------------------------------------
  // 2. WATERFALL WATER CURTAINS (Multi-layered animated meshes)
  // -------------------------------------------------------------
  const waterColor =
    biome === 'winter'
      ? 0xbae6fd
      : biome === 'sakura'
      ? 0x7dd3fc
      : biome === 'spring'
      ? 0x34d399
      : biome === 'autumn'
      ? 0x38bdf8
      : 0x0284c7;

  // A. Main Waterfall Cascade Curtain
  const curtainMat = new THREE.MeshStandardMaterial({
    map: textures.curtainTex,
    color: waterColor,
    emissive: waterColor,
    emissiveIntensity: 0.25,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const curtainWidth = 5.8;
  const curtainGeo = new THREE.PlaneGeometry(curtainWidth, waterfallHeight, 10, 24);

  // Add subtle organic curve along width so curtain isn't flat sheet
  const posAttr = curtainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const zCurve = Math.cos((x / curtainWidth) * Math.PI) * 0.45;
    posAttr.setZ(i, zCurve);
  }
  curtainGeo.computeVertexNormals();

  const mainCurtain = new THREE.Mesh(curtainGeo, curtainMat);
  // Center halfway between top and lake surface
  const midY = (cliffTopY + lakeSurfaceY) / 2;
  mainCurtain.position.set(originX + 1.2, midY, originZ);
  mainCurtain.rotation.y = Math.PI / 2; // facing toward play arena
  group.add(mainCurtain);

  // B. Fast Inner Rapids Core (high-intensity white foam core)
  const rapidsMat = new THREE.MeshBasicMaterial({
    map: textures.rapidsTex,
    color: 0xffffff,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const rapidsGeo = new THREE.PlaneGeometry(3.6, waterfallHeight * 0.98, 6, 16);
  const rapidsCore = new THREE.Mesh(rapidsGeo, rapidsMat);
  rapidsCore.position.set(originX + 1.25, midY, originZ);
  rapidsCore.rotation.y = Math.PI / 2;
  group.add(rapidsCore);

  // C. Curved Crest Lip (horizontal stream spilling smoothly over rock)
  const lipGeo = new THREE.CylinderGeometry(curtainWidth * 0.5, curtainWidth * 0.5, 1.8, 12, 1, true, 0, Math.PI);
  const lipMesh = new THREE.Mesh(lipGeo, curtainMat);
  lipMesh.rotation.z = Math.PI / 2;
  lipMesh.rotation.y = Math.PI / 2;
  lipMesh.position.set(originX + 0.6, cliffTopY - 0.2, originZ);
  group.add(lipMesh);

  // D. Secondary Twin Flumes splashing on side crags
  const flumeGeo = new THREE.PlaneGeometry(1.6, waterfallHeight * 0.65, 4, 12);
  const flume1 = new THREE.Mesh(flumeGeo, curtainMat);
  flume1.position.set(originX + 0.8, midY - 3.5, originZ + 3.2);
  flume1.rotation.y = Math.PI / 2 + 0.2;
  group.add(flume1);

  const flume2 = new THREE.Mesh(flumeGeo, curtainMat);
  flume2.position.set(originX + 0.8, midY - 4.5, originZ - 3.2);
  flume2.rotation.y = Math.PI / 2 - 0.2;
  group.add(flume2);

  // -------------------------------------------------------------
  // 3. LOWER GORGE LAKE BASIN (Down in empty canyon at y: -12)
  // -------------------------------------------------------------
  const lakeRadius = 13.5;
  const basinRockGeo = new THREE.CylinderGeometry(lakeRadius * 1.15, lakeRadius * 0.95, 4.0, 16);
  const basinRock = new THREE.Mesh(basinRockGeo, rockMat);
  basinRock.position.set(originX + 2.5, lakeSurfaceY - 2.0, originZ);
  basinRock.receiveShadow = true;
  group.add(basinRock);

  // Shimmering lower lake surface
  const lakeGeo = new THREE.CircleGeometry(lakeRadius, 28);
  const lakeMat = new THREE.MeshStandardMaterial({
    color: waterColor,
    roughness: 0.1,
    metalness: 0.35,
    transparent: true,
    opacity: 0.85,
  });
  const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
  lakeMesh.rotation.x = -Math.PI / 2;
  lakeMesh.position.set(originX + 2.5, lakeSurfaceY, originZ);
  lakeMesh.receiveShadow = true;
  group.add(lakeMesh);

  // Impact zone expanding concentric ripples
  const rippleGeo = new THREE.PlaneGeometry(8.0, 8.0);
  const rippleMat = new THREE.MeshBasicMaterial({
    map: textures.rippleTex,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
  rippleMesh.rotation.x = -Math.PI / 2;
  rippleMesh.position.set(originX + 1.4, lakeSurfaceY + 0.05, originZ);
  group.add(rippleMesh);

  // Secondary outer ripple ring
  const rippleMesh2 = new THREE.Mesh(rippleGeo, rippleMat);
  rippleMesh2.rotation.x = -Math.PI / 2;
  rippleMesh2.position.set(originX + 1.4, lakeSurfaceY + 0.04, originZ);
  group.add(rippleMesh2);

  // Surrounding shoreline boulders around lower lake
  const boulderGeo = new THREE.DodecahedronGeometry(1.6, 1);
  for (let b = 0; b < 10; b++) {
    const ang = (b * Math.PI * 2) / 10 + Math.random() * 0.2;
    const dist = lakeRadius * 0.95;
    const bx = originX + 2.5 + Math.cos(ang) * dist;
    const bz = originZ + Math.sin(ang) * dist;
    const boulder = new THREE.Mesh(boulderGeo, rockMat);
    boulder.position.set(bx, lakeSurfaceY + 0.5, bz);
    boulder.scale.set(1 + Math.random() * 0.6, 0.7 + Math.random() * 0.5, 1 + Math.random() * 0.6);
    boulder.receiveShadow = true;
    group.add(boulder);
  }

  // Biome-specific props in lower lake
  if (biome === 'sakura') {
    // Floating water lilies and lotus petals
    const lotusMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
    const petalGeo = new THREE.CircleGeometry(0.35, 6);
    for (let p = 0; p < 8; p++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 7;
      const petal = new THREE.Mesh(petalGeo, lotusMat);
      petal.rotation.x = -Math.PI / 2;
      petal.position.set(originX + 2.5 + Math.cos(ang) * r, lakeSurfaceY + 0.06, originZ + Math.sin(ang) * r);
      group.add(petal);
    }
  } else if (biome === 'winter') {
    // Floating ice floes
    for (let i = 0; i < 6; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 7;
      const iceFloeGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.2, 6);
      const iceFloe = new THREE.Mesh(iceFloeGeo, iceMat);
      iceFloe.position.set(originX + 2.5 + Math.cos(ang) * r, lakeSurfaceY + 0.1, originZ + Math.sin(ang) * r);
      group.add(iceFloe);
    }
  }

  // -------------------------------------------------------------
  // 4. MIST & SPRAY PARTICLE SYSTEM (Bottom plunge impact zone)
  // -------------------------------------------------------------
  const mistCount = 50;
  const mistParticles: {
    mesh: THREE.Mesh;
    basePos: THREE.Vector3;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
    baseScale: number;
  }[] = [];

  const mistMat = new THREE.MeshBasicMaterial({
    map: textures.mistTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mistPlaneGeo = new THREE.PlaneGeometry(2.5, 2.5);

  for (let i = 0; i < mistCount; i++) {
    const mMesh = new THREE.Mesh(mistPlaneGeo, mistMat);
    const startX = originX + 1.2 + (Math.random() - 0.5) * 3.5;
    const startZ = originZ + (Math.random() - 0.5) * 4.5;
    const startY = lakeSurfaceY + 0.4 + Math.random() * 1.5;

    mMesh.position.set(startX, startY, startZ);
    group.add(mMesh);

    mistParticles.push({
      mesh: mMesh,
      basePos: new THREE.Vector3(startX, lakeSurfaceY + 0.4, startZ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8 + 0.3,
        1.2 + Math.random() * 1.6, // upward draft
        (Math.random() - 0.5) * 0.8
      ),
      life: Math.random() * 2.0,
      maxLife: 2.2 + Math.random() * 1.5,
      baseScale: 1.0 + Math.random() * 1.2,
    });
  }

  // Splash droplets leaping out
  const dropletCount = 28;
  const droplets: {
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }[] = [];

  const dropGeo = new THREE.SphereGeometry(0.12, 4, 4);
  const dropMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });

  for (let i = 0; i < dropletCount; i++) {
    const dMesh = new THREE.Mesh(dropGeo, dropMat);
    dMesh.position.set(originX + 1.2, lakeSurfaceY + 0.5, originZ);
    group.add(dMesh);
    droplets.push({
      mesh: dMesh,
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 4.0 + 1.2,
        Math.random() * 4.5 + 2.5,
        (Math.random() - 0.5) * 4.5
      ),
      life: Math.random() * 0.8,
      maxLife: 0.8 + Math.random() * 0.6,
    });
  }

  // -------------------------------------------------------------
  // 5. IRIDESCENT MIST RAINBOW ARC (Sunlit biomes)
  // -------------------------------------------------------------
  let rainbowMesh: THREE.Mesh | null = null;
  if (biome === 'sakura' || biome === 'spring' || biome === 'summer') {
    const rbMat = new THREE.MeshBasicMaterial({
      map: textures.rainbowTex,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const rbGeo = new THREE.RingGeometry(4.0, 7.5, 32, 1, 0, Math.PI);
    rainbowMesh = new THREE.Mesh(rbGeo, rbMat);
    rainbowMesh.position.set(originX + 3.8, lakeSurfaceY + 4.5, originZ);
    rainbowMesh.rotation.y = Math.PI / 2 - 0.25;
    rainbowMesh.rotation.z = -0.15;
    group.add(rainbowMesh);
  }

  // -------------------------------------------------------------
  // 6. ANIMATION & UPDATE CONTROLLER
  // -------------------------------------------------------------
  let timeAccum = 0;

  const update = (delta: number) => {
    timeAccum += delta;

    // 1. Scroll cascading water textures
    textures.curtainTex.offset.y -= delta * 2.4;
    textures.rapidsTex.offset.y -= delta * 3.8;

    // 2. Animate lake ripples
    const rippleScale = 1.0 + (timeAccum % 2.5) * 0.8;
    rippleMesh.scale.set(rippleScale, rippleScale, 1);
    (rippleMat as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.75 * (1 - (timeAccum % 2.5) / 2.5));

    const rippleScale2 = 1.0 + ((timeAccum + 1.25) % 2.5) * 0.8;
    rippleMesh2.scale.set(rippleScale2, rippleScale2, 1);

    // 3. Animate rising mist particles
    for (let i = 0; i < mistCount; i++) {
      const p = mistParticles[i];
      p.life += delta;
      if (p.life >= p.maxLife) {
        p.life = 0;
        p.mesh.position.copy(p.basePos);
        p.mesh.position.x += (Math.random() - 0.5) * 3.0;
        p.mesh.position.z += (Math.random() - 0.5) * 4.0;
      }
      p.mesh.position.x += p.vel.x * delta;
      p.mesh.position.y += p.vel.y * delta;
      p.mesh.position.z += p.vel.z * delta;

      const progress = p.life / p.maxLife;
      const s = p.baseScale * (1.0 + progress * 2.5);
      p.mesh.scale.set(s, s, s);

      // Camera facing billboard
      p.mesh.rotation.y = Math.PI / 2 + Math.sin(timeAccum + i) * 0.15;
    }

    // 4. Animate splashing droplets
    for (let i = 0; i < dropletCount; i++) {
      const d = droplets[i];
      d.life += delta;
      d.vel.y -= 14.0 * delta; // gravity
      d.mesh.position.x += d.vel.x * delta;
      d.mesh.position.y += d.vel.y * delta;
      d.mesh.position.z += d.vel.z * delta;

      if (d.mesh.position.y <= lakeSurfaceY || d.life >= d.maxLife) {
        d.life = 0;
        d.mesh.position.set(originX + 1.2, lakeSurfaceY + 0.4, originZ + (Math.random() - 0.5) * 2.0);
        d.vel.set(
          (Math.random() - 0.5) * 3.5 + 1.2,
          Math.random() * 4.2 + 2.5,
          (Math.random() - 0.5) * 4.0
        );
      }
    }

    // 5. Subtle rainbow shimmer
    if (rainbowMesh) {
      const rMat = rainbowMesh.material as THREE.MeshBasicMaterial;
      rMat.opacity = 0.32 + Math.sin(timeAccum * 1.5) * 0.08;
    }
  };

  const dispose = () => {
    textures.curtainTex.dispose();
    textures.rapidsTex.dispose();
    textures.rippleTex.dispose();
    textures.mistTex.dispose();
    textures.rainbowTex.dispose();
    group.clear();
  };

  return { group, update, dispose };
}
