import * as THREE from 'three';

/**
 * Procedural texture generation (Canvas-based, zero external 404 dependencies)
 * All color textures use THREE.SRGBColorSpace as required by Three.js skill
 */

export function createGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle metallic texture noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 600; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Grid lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
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

  // Glowing cyber corners and runic intersections
  ctx.fillStyle = '#06b6d4';
  for (let x = 0; x <= 512; x += 64) {
    for (let y = 0; y <= 512; y += 64) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCautionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#f59e0b';
  const stripeWidth = 28;
  for (let i = -256; i < 512; i += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + stripeWidth, 0);
    ctx.lineTo(i + stripeWidth + 256, 256);
    ctx.lineTo(i + 256, 256);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRuneTexture(colorHex: string = '#38bdf8'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 512);

  // Glowing Outer border
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 18;
  ctx.strokeRect(24, 24, 464, 464);

  // Concentric circuit rings
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 256, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Radiating circuit buses
  const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];
  angles.forEach((ang) => {
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(ang) * 80, 256 + Math.sin(ang) * 80);
    ctx.lineTo(256 + Math.cos(ang) * 220, 256 + Math.sin(ang) * 220);
    ctx.stroke();

    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(256 + Math.cos(ang) * 220, 256 + Math.sin(ang) * 220, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Center core glow
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.arc(256, 256, 36, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural cyber visor HUD eye texture with glowing digital pupils and reticle
 */
export function createRobotVisorTexture(glowColor: string = '#38bdf8'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dark glassy visor base
  ctx.fillStyle = '#050b14';
  ctx.fillRect(0, 0, 256, 128);

  // Digital scanlines
  ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
  for (let y = 0; y < 128; y += 4) {
    ctx.fillRect(0, y, 256, 2);
  }

  // Dual glowing futuristic eyes
  const eyeColor = glowColor || '#38bdf8';
  const drawEye = (cx: number) => {
    // Outer hexagonal/bracket eye glow
    ctx.save();
    ctx.shadowColor = eyeColor;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = eyeColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cx - 36, 42, 72, 44, 8);
    ctx.stroke();

    // Inner bright pupil core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cx - 24, 52, 48, 24, 4);
    ctx.fill();

    // High-tech pupil crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 14, 64);
    ctx.lineTo(cx + 14, 64);
    ctx.stroke();

    // Tech corners
    ctx.fillStyle = eyeColor;
    ctx.fillRect(cx - 32, 36, 12, 3);
    ctx.fillRect(cx + 20, 36, 12, 3);
    ctx.restore();
  };

  drawEye(74);
  drawEye(182);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 3D Robot Character Generator & Animation Rig
 */
export interface CharacterRig {
  root: THREE.Group;
  body: THREE.Group;
  head: THREE.Mesh;
  visor: THREE.Mesh;
  leftHand: THREE.Mesh;
  rightHand: THREE.Mesh;
  thrusterGlow: THREE.Mesh;
  jetFlame: THREE.Mesh;
  gyroRing: THREE.Mesh;
  antL: THREE.Mesh;
  antR: THREE.Mesh;
  tractorBeams: THREE.LineSegments;
  shadow: THREE.Mesh;
  primaryMaterial: THREE.MeshStandardMaterial;
  glowMaterial: THREE.MeshBasicMaterial;
  // Enhanced aesthetic components
  leftWing?: THREE.Mesh;
  rightWing?: THREE.Mesh;
  chestReactor?: THREE.Mesh;
  backpack?: THREE.Group;
}

export function createCharacterMesh(primaryColor: string = '#0284c7', glowColor: string = '#38bdf8'): CharacterRig {
  const root = new THREE.Group();
  root.name = 'Player_Robot';

  const body = new THREE.Group();
  root.add(body);

  // High-end PBR materials
  const primaryMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColor),
    metalness: 0.85,
    roughness: 0.22,
  });

  const darkTitaniumMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.95,
    roughness: 0.25,
  });

  const goldAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2,
  });

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(glowColor),
  });

  // -------------------------------------------------------------
  // 1. TORSO & LAYERED CHEST ARMOR
  // -------------------------------------------------------------
  // Inner mechanical chassis
  const innerChassisGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.65, 16);
  const innerChassis = new THREE.Mesh(innerChassisGeo, darkTitaniumMaterial);
  innerChassis.position.y = 0.6;
  innerChassis.castShadow = true;
  body.add(innerChassis);

  // Sculpted front breastplate with beveled cyber-chest
  const chestPlateGeo = new THREE.BoxGeometry(0.56, 0.44, 0.28);
  const chestPlate = new THREE.Mesh(chestPlateGeo, primaryMaterial);
  chestPlate.position.set(0, 0.68, 0.14);
  chestPlate.castShadow = true;
  body.add(chestPlate);

  // Gold accent trims on chest
  const trimGeo = new THREE.BoxGeometry(0.58, 0.05, 0.3);
  const trim = new THREE.Mesh(trimGeo, goldAccentMaterial);
  trim.position.set(0, 0.86, 0.14);
  body.add(trim);

  // Recessed glowing Arc-Reactor with multi-ring housing
  const reactorHousingGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 20);
  reactorHousingGeo.rotateX(Math.PI / 2);
  const reactorHousing = new THREE.Mesh(reactorHousingGeo, darkTitaniumMaterial);
  reactorHousing.position.set(0, 0.66, 0.28);
  body.add(reactorHousing);

  const chestReactor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.09, 20).rotateX(Math.PI / 2),
    glowMaterial
  );
  chestReactor.name = 'ChestReactor';
  chestReactor.position.set(0, 0.66, 0.30);
  body.add(chestReactor);

  // Armored Shoulder Pauldrons
  const pauldronGeo = new THREE.SphereGeometry(0.18, 14, 12);
  pauldronGeo.scale(1.2, 0.8, 1.0);
  const shoulderL = new THREE.Mesh(pauldronGeo, primaryMaterial);
  shoulderL.position.set(-0.46, 0.84, 0);
  shoulderL.castShadow = true;
  body.add(shoulderL);

  const shoulderR = new THREE.Mesh(pauldronGeo, primaryMaterial);
  shoulderR.position.set(0.46, 0.84, 0);
  shoulderR.castShadow = true;
  body.add(shoulderR);

  // -------------------------------------------------------------
  // 2. BACKPACK JETPACK & AERO FLIGHT WINGS
  // -------------------------------------------------------------
  const backpack = new THREE.Group();
  backpack.position.set(0, 0.68, -0.22);

  // Dual jetpack power tanks
  const tankGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.48, 12);
  const tankL = new THREE.Mesh(tankGeo, darkTitaniumMaterial);
  tankL.position.set(-0.16, 0, 0);
  const tankR = new THREE.Mesh(tankGeo, darkTitaniumMaterial);
  tankR.position.set(0.16, 0, 0);

  // Tank glowing power gauge strips
  const gaugeGeo = new THREE.BoxGeometry(0.02, 0.36, 0.04);
  const gaugeL = new THREE.Mesh(gaugeGeo, glowMaterial);
  gaugeL.position.set(-0.16, 0, -0.09);
  const gaugeR = new THREE.Mesh(gaugeGeo, glowMaterial);
  gaugeR.position.set(0.16, 0, -0.09);

  // Central jetpack heat exhaust manifold
  const manifoldGeo = new THREE.BoxGeometry(0.24, 0.28, 0.12);
  const manifold = new THREE.Mesh(manifoldGeo, primaryMaterial);
  manifold.position.set(0, 0.02, 0);

  backpack.add(tankL, tankR, gaugeL, gaugeR, manifold);

  // Aerodynamic Aero-Wings (flare open during sprint/jump)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(0.55, 0.15);
  wingShape.lineTo(0.45, -0.08);
  wingShape.lineTo(0, -0.12);
  wingShape.closePath();

  const wingGeo = new THREE.ShapeGeometry(wingShape);
  const wingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColor),
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });

  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.22, 0.12, 0);
  leftWing.rotation.y = 0.2;
  backpack.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(0.22, 0.12, 0);
  rightWing.rotation.y = Math.PI - 0.2;
  backpack.add(rightWing);

  body.add(backpack);

  // -------------------------------------------------------------
  // 3. SCULPTED CYBER HELMET & ANIMATED VISOR
  // -------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.15, 0);

  // Main cranial helmet (curved aerodynamic mecha shell)
  const helmetGeo = new THREE.SphereGeometry(0.32, 24, 20);
  helmetGeo.scale(1.0, 1.05, 1.1);
  const head = new THREE.Mesh(helmetGeo, darkTitaniumMaterial);
  head.castShadow = true;
  headGroup.add(head);

  // Helmet side ear sensor cowlings
  const earGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.08, 12);
  earGeo.rotateZ(Math.PI / 2);
  const earL = new THREE.Mesh(earGeo, primaryMaterial);
  earL.position.set(-0.33, 0.02, 0);
  const earR = new THREE.Mesh(earGeo, primaryMaterial);
  earR.position.set(0.33, 0.02, 0);
  headGroup.add(earL, earR);

  // Forehead sensor crest with gold accent
  const crestGeo = new THREE.BoxGeometry(0.12, 0.18, 0.16);
  const crest = new THREE.Mesh(crestGeo, goldAccentMaterial);
  crest.position.set(0, 0.24, 0.12);
  headGroup.add(crest);

  // High-Tech Curved Visor Display with Digital HUD Eyes
  const visorTexture = createRobotVisorTexture(glowColor);
  const visorMat = new THREE.MeshBasicMaterial({
    map: visorTexture,
    transparent: true,
  });
  const visorGeo = new THREE.BoxGeometry(0.42, 0.2, 0.16);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.01, 0.26);
  headGroup.add(visor);

  // Aerodynamic Fin Antennae
  const antGeo = new THREE.ConeGeometry(0.025, 0.32, 8);
  const antL = new THREE.Mesh(antGeo, primaryMaterial);
  antL.position.set(-0.25, 0.28, -0.06);
  antL.rotation.z = 0.4;
  antL.rotation.x = -0.2;
  headGroup.add(antL);

  const antR = new THREE.Mesh(antGeo, primaryMaterial);
  antR.position.set(0.25, 0.28, -0.06);
  antR.rotation.z = -0.4;
  antR.rotation.x = -0.2;
  headGroup.add(antR);

  // Glowing orb tips on antennae
  const orbGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const orbL = new THREE.Mesh(orbGeo, glowMaterial);
  orbL.position.set(0, 0.16, 0);
  antL.add(orbL);
  const orbR = new THREE.Mesh(orbGeo, glowMaterial);
  orbR.position.set(0, 0.16, 0);
  antR.add(orbR);

  body.add(headGroup);

  // -------------------------------------------------------------
  // 4. ARTICULATED CYBER HANDS
  // -------------------------------------------------------------
  const createHand = (isLeft: boolean) => {
    const hGroup = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.24), primaryMaterial);
    hGroup.castShadow = true;

    // Wrist cuff
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 12), darkTitaniumMaterial);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.z = -0.13;
    hGroup.add(cuff);

    // Glowing palm repulsor node
    const palm = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), glowMaterial);
    palm.rotation.x = -Math.PI / 2;
    palm.position.set(0, -0.082, 0.02);
    hGroup.add(palm);

    // 3 articulated robotic fingers
    const fingerGeo = new THREE.BoxGeometry(0.035, 0.035, 0.08);
    for (let f = -1; f <= 1; f++) {
      const finger = new THREE.Mesh(fingerGeo, darkTitaniumMaterial);
      finger.position.set(f * 0.045, 0, 0.15);
      hGroup.add(finger);
    }

    return hGroup;
  };

  const leftHand = createHand(true);
  leftHand.position.set(-0.52, 0.58, 0);
  body.add(leftHand);

  const rightHand = createHand(false);
  rightHand.position.set(0.52, 0.58, 0);
  body.add(rightHand);

  // -------------------------------------------------------------
  // 5. GYRO GIMBAL & DUAL TWIN HOVER THRUSTERS
  // -------------------------------------------------------------
  // Waist Gyroscope Gimbal Ring with 4 magnetic levitation power nodes
  const gyroGeo = new THREE.TorusGeometry(0.38, 0.035, 8, 24);
  gyroGeo.rotateX(Math.PI / 2);
  const gyroRing = new THREE.Mesh(gyroGeo, darkTitaniumMaterial);
  gyroRing.position.y = 0.38;

  // 4 magnetic glowing nodes on the ring
  for (let a = 0; a < 4; a++) {
    const ang = (a * Math.PI) / 2;
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), glowMaterial);
    node.position.set(Math.cos(ang) * 0.38, 0, Math.sin(ang) * 0.38);
    gyroRing.add(node);
  }
  body.add(gyroRing);

  // Lower chassis base
  const lowerChassis = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.22, 16).rotateX(Math.PI),
    darkTitaniumMaterial
  );
  lowerChassis.position.y = 0.22;
  body.add(lowerChassis);

  // Twin rocket thruster bells underneath
  const bellGeo = new THREE.CylinderGeometry(0.07, 0.12, 0.16, 12);
  const bellL = new THREE.Mesh(bellGeo, darkTitaniumMaterial);
  bellL.position.set(-0.11, 0.12, 0);
  const bellR = new THREE.Mesh(bellGeo, darkTitaniumMaterial);
  bellR.position.set(0.11, 0.12, 0);
  body.add(bellL, bellR);

  // Thruster glow disc
  const glowRingGeo = new THREE.RingGeometry(0.04, 0.26, 16);
  glowRingGeo.rotateX(Math.PI / 2);
  const thrusterGlow = new THREE.Mesh(glowRingGeo, glowMaterial);
  thrusterGlow.position.y = 0.08;
  body.add(thrusterGlow);

  // Multi-tier jet flame
  const flameGeo = new THREE.ConeGeometry(0.2, 0.75, 12);
  flameGeo.rotateX(Math.PI);
  const flameMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(glowColor),
    transparent: true,
    opacity: 0.85,
  });
  const jetFlame = new THREE.Mesh(flameGeo, flameMat);
  jetFlame.position.y = -0.2;
  jetFlame.scale.set(0.65, 0.65, 0.65);

  // Inner white-hot flame core
  const coreFlameGeo = new THREE.ConeGeometry(0.1, 0.5, 10);
  coreFlameGeo.rotateX(Math.PI);
  const coreFlameMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const coreFlame = new THREE.Mesh(coreFlameGeo, coreFlameMat);
  coreFlame.position.y = 0.08;
  jetFlame.add(coreFlame);

  body.add(jetFlame);

  // -------------------------------------------------------------
  // 6. TRACTOR BEAMS & CONTACT SHADOW
  // -------------------------------------------------------------
  const beamGeo = new THREE.BufferGeometry();
  const beamPositions = new Float32Array([
    -0.5, 0.58, 0.1,  0, 0.6, 1.3,
     0.5, 0.58, 0.1,  0, 0.6, 1.3,
    -0.5, 0.58, 0.1, -0.4, 0.6, 1.3,
     0.5, 0.58, 0.1,  0.4, 0.6, 1.3,
  ]);
  beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
  const beamMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(glowColor),
    transparent: true,
    opacity: 0.85,
    linewidth: 3,
  });
  const tractorBeams = new THREE.LineSegments(beamGeo, beamMat);
  tractorBeams.visible = false;
  body.add(tractorBeams);

  // Soft contact shadow underneath
  const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  root.add(shadow);

  return {
    root,
    body,
    head,
    visor,
    leftHand,
    rightHand,
    thrusterGlow,
    jetFlame,
    gyroRing,
    antL,
    antR,
    tractorBeams,
    shadow,
    primaryMaterial,
    glowMaterial,
    leftWing,
    rightWing,
    chestReactor,
    backpack,
  };
}

/**
 * Quantum Cube 3D Mesh with inner Hypercube Core
 */
export function createQuantumCubeMesh(colorHex: string = '#38bdf8', size: [number, number, number] = [1.2, 1.2, 1.2]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'QuantumCube';

  const [w, h, d] = size;
  const runeTex = createRuneTexture(colorHex);

  // Main body
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x090e17,
    metalness: 0.8,
    roughness: 0.25,
    map: runeTex,
  });
  const cubeGeo = new THREE.BoxGeometry(w, h, d);
  const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
  cubeMesh.castShadow = true;
  cubeMesh.receiveShadow = true;
  group.add(cubeMesh);

  // Inner floating hypercube core
  const coreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    emissive: new THREE.Color(colorHex),
    emissiveIntensity: 0.9,
    metalness: 0.3,
    roughness: 0.1,
  });
  const coreGeo = new THREE.OctahedronGeometry(w * 0.32, 0);
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.name = 'InnerHypercube';
  group.add(coreMesh);

  // Outer orbital halo ring
  const haloGeo = new THREE.TorusGeometry(w * 0.72, 0.025, 8, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colorHex),
    transparent: true,
    opacity: 0.6,
  });
  const haloRing = new THREE.Mesh(haloGeo, haloMat);
  haloRing.name = 'HaloRing';
  group.add(haloRing);

  // Glowing wireframe corners
  const edges = new THREE.EdgesGeometry(cubeGeo);
  const lineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(colorHex),
    linewidth: 2,
  });
  const wireframe = new THREE.LineSegments(edges, lineMat);
  group.add(wireframe);

  // Soft contact shadow
  const shadowGeo = new THREE.PlaneGeometry(w * 1.5, d * 1.5);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = -h / 2 + 0.02;
  group.add(shadow);

  return group;
}

/**
 * Pressure Pad 3D Mesh
 */
export function createPressurePadMesh(colorHex: string = '#06b6d4', size: [number, number, number] = [2.2, 0.2, 2.2]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PressurePad';

  const [w, , d] = size;

  // Heavy mechanical frame
  const frameGeo = new THREE.BoxGeometry(w + 0.35, 0.22, d + 0.35);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.92,
    roughness: 0.2,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.receiveShadow = true;
  group.add(frame);

  // Depressable plate
  const plateGeo = new THREE.BoxGeometry(w, 0.16, d);
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.7,
    roughness: 0.3,
    emissive: new THREE.Color(colorHex),
    emissiveIntensity: 0.25,
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.name = 'PlateSurface';
  plate.position.y = 0.08;
  plate.receiveShadow = true;
  group.add(plate);

  // Concentric holographic glyph rings
  const ringGeo1 = new THREE.RingGeometry(w * 0.18, w * 0.28, 24);
  ringGeo1.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colorHex),
    side: THREE.DoubleSide,
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat);
  ring1.name = 'RingIndicator';
  ring1.position.y = 0.17;
  group.add(ring1);

  const ringGeo2 = new THREE.RingGeometry(w * 0.36, w * 0.42, 24);
  ringGeo2.rotateX(-Math.PI / 2);
  const ring2 = new THREE.Mesh(ringGeo2, ringMat);
  ring2.name = 'OuterGlyphRing';
  ring2.position.y = 0.17;
  group.add(ring2);

  return group;
}

/**
 * Energy Barrier / Light Bridge 3D Mesh
 */
export function createBarrierMesh(colorHex: string = '#3b82f6', size: [number, number, number] = [6, 3, 0.5]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EnergyBarrier';

  const [w, h, d] = size;

  // Emitter pylons
  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.45, h, 16);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x090e17,
    metalness: 0.95,
    roughness: 0.15,
  });

  const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
  pillarL.position.set(-w / 2 - 0.25, h / 2, 0);
  pillarL.castShadow = true;
  group.add(pillarL);

  const pillarR = new THREE.Mesh(pillarGeo, pillarMat);
  pillarR.position.set(w / 2 + 0.25, h / 2, 0);
  pillarR.castShadow = true;
  group.add(pillarR);

  // Top arch emitter
  const topGeo = new THREE.BoxGeometry(w + 1.0, 0.3, 0.5);
  const topMesh = new THREE.Mesh(topGeo, pillarMat);
  topMesh.position.set(0, h + 0.15, 0);
  group.add(topMesh);

  // Holographic forcefield grid
  const fieldGeo = new THREE.BoxGeometry(w, h * 0.98, d * 0.5);
  const fieldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    emissive: new THREE.Color(colorHex),
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    metalness: 0.1,
  });
  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.name = 'ForceField';
  field.position.y = h / 2;
  group.add(field);

  return group;
}

/**
 * Jump Pad 3D Mesh with Dual Spinning Levitation Rings
 */
export function createJumpPadMesh(strength: number): THREE.Group {
  const group = new THREE.Group();
  group.name = `JumpPad_${strength}`;

  const baseGeo = new THREE.CylinderGeometry(1.25, 1.45, 0.22, 20);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.9,
    roughness: 0.25,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.receiveShadow = true;
  group.add(base);

  // Inner vortex pad
  const padGeo = new THREE.RingGeometry(0.1, 0.95, 32);
  padGeo.rotateX(-Math.PI / 2);
  const padMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    side: THREE.DoubleSide,
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.y = 0.13;
  pad.name = 'PadGlow';
  group.add(pad);

  // Floating sonic energy rings
  const ringGeo = new THREE.TorusGeometry(0.8, 0.03, 8, 24);
  ringGeo.rotateX(Math.PI / 2);
  const ringMesh1 = new THREE.Mesh(ringGeo, padMat);
  ringMesh1.position.y = 0.28;
  ringMesh1.name = 'EnergyRing1';
  group.add(ringMesh1);

  const ringMesh2 = new THREE.Mesh(ringGeo, padMat);
  ringMesh2.position.y = 0.48;
  ringMesh2.scale.set(0.7, 0.7, 0.7);
  ringMesh2.name = 'EnergyRing2';
  group.add(ringMesh2);

  return group;
}

/**
 * Energy Core Collectible 3D Mesh with Dual Gyro Rings
 */
export function createEnergyCoreMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EnergyCore';

  // Inner faceted pulsing crystal gem
  const gemGeo = new THREE.OctahedronGeometry(0.48, 0);
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.0,
    metalness: 0.2,
    roughness: 0.05,
  });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.name = 'Gem';
  group.add(gem);

  // Gyro Ring 1 (Gold)
  const ringGeo1 = new THREE.TorusGeometry(0.75, 0.035, 8, 28);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.name = 'OrbitRing1';
  group.add(ring1);

  // Gyro Ring 2 (Cyan)
  const ringGeo2 = new THREE.TorusGeometry(0.88, 0.035, 8, 28);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.name = 'OrbitRing2';
  group.add(ring2);

  // Radiant point light
  const light = new THREE.PointLight(0xfacc15, 2.0, 7);
  group.add(light);

  return group;
}

/**
 * High-Resolution Procedural Canvas Texture for Portal Event Horizon
 */
function createPortalVortexTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  // Deep cosmic nebulous glow
  const radGrad = ctx.createRadialGradient(256, 256, 8, 256, 256, 250);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  radGrad.addColorStop(0.18, 'rgba(0, 240, 255, 0.95)');
  radGrad.addColorStop(0.42, 'rgba(14, 165, 233, 0.72)');
  radGrad.addColorStop(0.72, 'rgba(99, 102, 241, 0.42)');
  radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // 6 Sharp Logarithmic Spiral Plasma Arms
  for (let arm = 0; arm < 6; arm++) {
    const baseAngle = (arm * Math.PI * 2) / 6;
    ctx.beginPath();
    for (let step = 0; step < 160; step++) {
      const r = (step / 160) * 238 + 6;
      const theta = baseAngle + Math.pow(r / 238, 0.65) * 4.5;
      const x = 256 + Math.cos(theta) * r;
      const y = 256 + Math.sin(theta) * r;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = arm % 2 === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 4.5 + (arm % 3) * 2;
    ctx.stroke();
  }

  // Concentric event-horizon accretion wave rings (razor-sharp)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2.5;
  [45, 95, 155, 215].forEach((r) => {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Cosmic stardust quantum spark clusters
  for (let i = 0; i < 90; i++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = Math.random() * 225 + 12;
    const sx = 256 + Math.cos(ang) * dist;
    const sy = 256 + Math.sin(ang) * dist;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(125, 211, 252, 0.9)';
    ctx.fillRect(sx, sy, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Warp Portal 3D Mesh with Cosmic Stargate Architecture & Event Horizon
 */
export function createPortalMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'WarpPortal';

  const portalCenterY = 2.1;

  // -------------------------------------------------------------
  // 1. STEPPED OCTAGONAL DAIS / PLATFORM BASE
  // -------------------------------------------------------------
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    metalness: 0.92,
    roughness: 0.18,
  });

  const chromeTrimMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.98,
    roughness: 0.1,
  });

  const baseGeo = new THREE.CylinderGeometry(2.7, 3.0, 0.35, 8);
  const base = new THREE.Mesh(baseGeo, titaniumMat);
  base.position.y = 0.175;
  base.receiveShadow = true;
  group.add(base);

  // Upper dais step
  const upperDaisGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.18, 8);
  const upperDais = new THREE.Mesh(upperDaisGeo, titaniumMat);
  upperDais.position.y = 0.35 + 0.09;
  upperDais.receiveShadow = true;
  group.add(upperDais);

  // Glowing concentric circuit conduits inlaid into dais floor
  const conduitMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    side: THREE.DoubleSide,
  });
  const conduitGeo = new THREE.RingGeometry(1.6, 1.74, 32);
  const conduit = new THREE.Mesh(conduitGeo, conduitMat);
  conduit.rotation.x = -Math.PI / 2;
  conduit.position.y = 0.54;
  conduit.name = 'BaseConduit';
  group.add(conduit);

  const innerConduitGeo = new THREE.RingGeometry(0.8, 0.9, 32);
  const innerConduit = new THREE.Mesh(innerConduitGeo, conduitMat);
  innerConduit.rotation.x = -Math.PI / 2;
  innerConduit.position.y = 0.541;
  innerConduit.name = 'BaseInnerConduit';
  group.add(innerConduit);

  // 4 Radial energy feeder channels from edge to center
  for (let c = 0; c < 4; c++) {
    const ang = (c * Math.PI * 2) / 4 + Math.PI / 4;
    const channelGeo = new THREE.BoxGeometry(0.12, 0.04, 1.6);
    const channel = new THREE.Mesh(channelGeo, conduitMat);
    channel.position.set(Math.cos(ang) * 1.3, 0.54, Math.sin(ang) * 1.3);
    channel.rotation.y = -ang;
    channel.name = `BaseChannel_${c}`;
    group.add(channel);
  }

  // -------------------------------------------------------------
  // 2. STARGATE ARCH CHASSIS & CONCENTRIC RINGS
  // -------------------------------------------------------------
  // Outer Arch Torus Chassis
  const archGeo = new THREE.TorusGeometry(2.1, 0.18, 24, 48);
  const arch = new THREE.Mesh(archGeo, titaniumMat);
  arch.position.y = portalCenterY;
  arch.castShadow = true;
  group.add(arch);

  // Outer polished silver-chrome beveled trim
  const archTrimGeo = new THREE.TorusGeometry(2.28, 0.04, 16, 48);
  const archTrim = new THREE.Mesh(archTrimGeo, chromeTrimMat);
  archTrim.position.y = portalCenterY;
  group.add(archTrim);

  // Middle Counter-Rotating Dial Ring (with 12 notch teeth)
  const dialGroup = new THREE.Group();
  dialGroup.name = 'MiddleDialRing';
  dialGroup.position.y = portalCenterY;

  const dialRingGeo = new THREE.TorusGeometry(1.92, 0.045, 16, 40);
  const dialRing = new THREE.Mesh(dialRingGeo, chromeTrimMat);
  dialGroup.add(dialRing);

  // 12 precision dial teeth around middle ring
  const toothGeo = new THREE.BoxGeometry(0.08, 0.18, 0.12);
  for (let t = 0; t < 12; t++) {
    const ang = (t * Math.PI * 2) / 12;
    const tooth = new THREE.Mesh(toothGeo, titaniumMat);
    tooth.position.set(Math.cos(ang) * 1.92, Math.sin(ang) * 1.92, 0);
    tooth.rotation.z = ang;
    dialGroup.add(tooth);
  }
  group.add(dialGroup);

  // Inner Razor-Sharp Event-Horizon Neon Rim
  const rimGeo = new THREE.TorusGeometry(1.72, 0.04, 16, 40);
  const rimMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  const eventHorizonRim = new THREE.Mesh(rimGeo, rimMat);
  eventHorizonRim.name = 'EventHorizonLip';
  eventHorizonRim.position.y = portalCenterY;
  group.add(eventHorizonRim);

  // -------------------------------------------------------------
  // 3. 8 CHEVRON HOUSINGS & FLOATING RUNIC CRYSTALS
  // -------------------------------------------------------------
  const chevronCount = 8;
  const chevronGroup = new THREE.Group();
  chevronGroup.name = 'Chevrons';
  chevronGroup.position.y = portalCenterY;

  const chevronHousingGeo = new THREE.BoxGeometry(0.34, 0.34, 0.42);
  const chevronCrystalGeo = new THREE.OctahedronGeometry(0.18, 0);

  for (let i = 0; i < chevronCount; i++) {
    const ang = (i * Math.PI * 2) / chevronCount;
    const chX = Math.cos(ang) * 2.1;
    const chY = Math.sin(ang) * 2.1;

    // Outer bracket clamp
    const housing = new THREE.Mesh(chevronHousingGeo, titaniumMat);
    housing.position.set(chX, chY, 0);
    housing.rotation.z = ang;
    chevronGroup.add(housing);

    // Glowing Runic Crystal prism nestled inside bracket
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85,
    });
    const crystal = new THREE.Mesh(chevronCrystalGeo, crystalMat);
    crystal.position.set(chX, chY, 0.1);
    crystal.name = `ChevronCrystal_${i}`;
    chevronGroup.add(crystal);
  }
  group.add(chevronGroup);

  // -------------------------------------------------------------
  // 4. RAZOR-SHARP EVENT HORIZON PLASMA VORTEX
  // -------------------------------------------------------------
  const vortexTex = createPortalVortexTexture();

  // Primary Event Horizon Disc
  const vortexGeo = new THREE.CircleGeometry(1.7, 48);
  const vortexMat = new THREE.MeshBasicMaterial({
    map: vortexTex,
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const vortex = new THREE.Mesh(vortexGeo, vortexMat);
  vortex.name = 'Vortex';
  vortex.position.set(0, portalCenterY, 0);
  group.add(vortex);

  // Counter-swirling inner plasma ribbon
  const innerVortexGeo = new THREE.CircleGeometry(1.35, 36);
  const innerVortexMat = new THREE.MeshBasicMaterial({
    map: vortexTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const innerVortex = new THREE.Mesh(innerVortexGeo, innerVortexMat);
  innerVortex.name = 'InnerVortex';
  innerVortex.position.set(0, portalCenterY, 0.03);
  group.add(innerVortex);

  // Levitating 3D Singularity Core Crystal in dead center
  const coreGeo = new THREE.OctahedronGeometry(0.32, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });
  const singularityCore = new THREE.Mesh(coreGeo, coreMat);
  singularityCore.name = 'SingularityCore';
  singularityCore.position.set(0, portalCenterY, 0);
  group.add(singularityCore);

  // Accretion Ripple Rings
  const accRingMat1 = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const accRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.02, 8, 32), accRingMat1);
  accRing1.name = 'AccretionRing1';
  accRing1.position.set(0, portalCenterY, 0.01);
  group.add(accRing1);

  const accRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.02, 8, 32), accRingMat1);
  accRing2.name = 'AccretionRing2';
  accRing2.position.set(0, portalCenterY, 0.02);
  group.add(accRing2);

  // -------------------------------------------------------------
  // 5. 24 ORBITAL QUANTUM ENERGY MOTES
  // -------------------------------------------------------------
  const motesGroup = new THREE.Group();
  motesGroup.name = 'OrbitalMotes';
  motesGroup.position.set(0, portalCenterY, 0);

  const moteGeo = new THREE.OctahedronGeometry(0.065, 0);
  const moteMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const moteCount = 24;
  for (let m = 0; m < moteCount; m++) {
    const mote = new THREE.Mesh(moteGeo, moteMat);
    const ang = (m * Math.PI * 2) / moteCount;
    const rad = 1.85 + (m % 3) * 0.15;
    mote.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, (Math.random() - 0.5) * 0.35);
    mote.name = `Mote_${m}`;
    motesGroup.add(mote);
  }
  group.add(motesGroup);

  // -------------------------------------------------------------
  // 6. CELESTIAL BEACON OF LIGHT (Sky pillar)
  // -------------------------------------------------------------
  // Outer semi-transparent energy sheath
  const beaconGeo = new THREE.CylinderGeometry(0.85, 0.85, 24, 20, 1, true);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.y = 12;
  beacon.name = 'Beacon';
  group.add(beacon);

  // Inner intense core light shaft
  const innerBeaconGeo = new THREE.CylinderGeometry(0.25, 0.25, 24, 16, 1, true);
  const innerBeaconMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const innerBeacon = new THREE.Mesh(innerBeaconGeo, innerBeaconMat);
  innerBeacon.position.y = 12;
  innerBeacon.name = 'InnerBeacon';
  group.add(innerBeacon);

  // -------------------------------------------------------------
  // 7. RADIANT GATE LIGHT
  // -------------------------------------------------------------
  const light = new THREE.PointLight(0x00f0ff, 4.0, 14);
  light.position.set(0, portalCenterY, 0.6);
  light.name = 'PortalLight';
  group.add(light);

  return group;
}

