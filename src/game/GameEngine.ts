import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  LevelDefinition,
  PlayerConfig,
  UnityGameObject,
  ConsoleLogItem,
  Vector3D,
  BiomeType
} from '../types/game';
import { soundSystem } from '../audio/soundSystem';
import {
  createGridTexture,
  createCautionTexture,
  createCharacterMesh,
  CharacterRig,
  createQuantumCubeMesh,
  createPressurePadMesh,
  createBarrierMesh,
  createJumpPadMesh,
  createEnergyCoreMesh,
  createPortalMesh
} from './models';
import {
  BIOMES,
  createBiomeSkyDome,
  createBiomeDistantScenery,
  createBiomeWeatherParticles,
  createBiomePlatformTexture
} from './biomeSystem';
import {
  createPlatformDecorations,
  createNearbyScenicIslands,
  createScenicWaterfall,
  ScenicWaterfallInstance
} from './environmentDetails';

// Pre-allocated math objects to avoid GC in the render loop (per Three.js skill directive)
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _box1 = new THREE.Box3();
const _box2 = new THREE.Box3();
const _ray = new THREE.Raycaster();

export interface EngineCallbacks {
  onCoresUpdate: (collected: number, total: number) => void;
  onTimeUpdate: (seconds: number) => void;
  onInteractPrompt: (prompt: string | null) => void;
  onConsoleLog: (log: ConsoleLogItem) => void;
  onVictory: (timeSeconds: number) => void;
  onGameObjectList: (objects: UnityGameObject[]) => void;
  onFpsUpdate: (fps: number, drawCalls: number, triangles: number) => void;
  onPointerLockChange?: (isLocked: boolean) => void;
  onCameraModeChange?: (mode: 'third' | 'close' | 'top') => void;
  onConfigChange?: (config: PlayerConfig) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private callbacks: EngineCallbacks;

  // Level & Game State
  private currentLevel!: LevelDefinition;
  private isPaused = false;
  private isGameOver = false;
  private isWon = false;
  private levelTime = 0;
  private collectedCores = 0;
  private totalCores = 0;

  // Player State
  public playerConfig: PlayerConfig = {
    moveSpeed: 9.0,
    sprintSpeed: 14.5,
    jumpForce: 12.0,
    gravity: 28.0,
    doubleJump: true,
    color: '#0284c7',
    glowColor: '#38bdf8',
    invulnerable: false,
    mouseSensitivity: 1.0,
    invertY: false,
    characterSkin: 'robot',
    slowMotion: false,
    particleQuality: 'epic',
    speedLines: true,
  };
  private playerPos = new THREE.Vector3(0, 1.5, 0);
  private playerVel = new THREE.Vector3(0, 0, 0);
  private isGrounded = false;
  private canDoubleJump = true;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private carriedCubeId: string | null = null;
  private characterRig!: CharacterRig;

  private footstepDustTimer = 0;
  private cubeTrailTimer = 0;

  // Controls input
  private inputMove = { x: 0, z: 0 };
  private inputJumpPressed = false;
  private isSprinting = false;
  public isPointerLocked = false;
  private cameraAngleH = 0;
  private cameraAngleV = 0.32;
  private cameraDistance = 7.5;
  private isDraggingCamera = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private viewPerspective: 'third' | 'close' | 'top' = 'third';

  // Scene entities
  private platformBoxes: { id: string; box: THREE.Box3; mesh: THREE.Mesh; friction: number }[] = [];
  private movingPlatforms: {
    id: string;
    mesh: THREE.Mesh;
    box: THREE.Box3;
    start: THREE.Vector3;
    end: THREE.Vector3;
    speed: number;
    prevPos: THREE.Vector3;
    curVel: THREE.Vector3;
    progress: number;
    dir: number;
  }[] = [];
  private cubes: {
    id: string;
    group: THREE.Group;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    size: [number, number, number];
    isCarried: boolean;
  }[] = [];
  private pressurePads: {
    id: string;
    group: THREE.Group;
    plateMesh: THREE.Mesh;
    pos: THREE.Vector3;
    size: [number, number, number];
    targetBarrierId: string;
    isPressed: boolean;
  }[] = [];
  private barriers: {
    id: string;
    group: THREE.Group;
    fieldMesh: THREE.Mesh;
    basePos: THREE.Vector3;
    size: [number, number, number];
    isOpen: boolean;
    currentSlide: number;
  }[] = [];
  private lasers: {
    id: string;
    group: THREE.Group;
    beamMesh: THREE.Mesh;
    emitter1: THREE.Mesh;
    emitter2: THREE.Mesh;
    start: THREE.Vector3;
    dir: THREE.Vector3;
    length: number;
    moving: boolean;
    moveRange: number;
    moveSpeed: number;
    moveAxis: 'x' | 'z';
    progress: number;
  }[] = [];
  private jumpPads: {
    id: string;
    group: THREE.Group;
    pos: THREE.Vector3;
    strength: number;
  }[] = [];
  private cores: {
    id: string;
    group: THREE.Group;
    pos: THREE.Vector3;
    collected: boolean;
  }[] = [];
  private portalMesh!: THREE.Group;
  private portalPos = new THREE.Vector3();
  private portalIsOpen = false;

  // Visual gizmo & selection
  private selectionWireframe: THREE.LineSegments | null = null;
  public selectedObjectId: string | null = null;
  public showGizmos = false;
  private colliderGizmosGroup = new THREE.Group();

  // Particles & Visual FX
  private particlesGroup = new THREE.Group();
  private activeParticles: {
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }[] = [];

  // Shockwaves & Screen Juice
  private shockwavesGroup = new THREE.Group();
  private activeShockwaves: {
    mesh: THREE.Mesh;
    maxRadius: number;
    life: number;
    duration: number;
  }[] = [];
  private flipTimer = 0;
  private squashStretch = new THREE.Vector3(1, 1, 1);
  private cameraShake = 0;
  private jetTrailTimer = 0;

  // Performance metrics
  private frameCount = 0;
  private lastFpsTime = 0;
  private currentFps = 60;

  // Animation frame id
  private animFrameId: number | null = null;

  // Biome & Seasonal Atmosphere
  private currentBiomeType: BiomeType = 'sakura';
  private skyDomeMesh: THREE.Mesh | null = null;
  private distantSceneryGroup: THREE.Group | null = null;
  private weatherParticlesGroup: THREE.Group | null = null;
  private weatherParticleUpdater: ((delta: number, playerPos: THREE.Vector3) => void) | null = null;
  private hemiLight: THREE.HemisphereLight | null = null;
  private dirLight: THREE.DirectionalLight | null = null;
  private rimLight: THREE.DirectionalLight | null = null;
  private platformDecorationsGroup: THREE.Group | null = null;
  private nearbyScenicIslandsGroup: THREE.Group | null = null;
  private waterfallInstance: ScenicWaterfallInstance | null = null;

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060913);
    this.scene.fog = new THREE.FogExp2(0x060913, 0.015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // WebGL Renderer with High-Fidelity PBR Configuration (per Three.js skill)
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Mandatory Studio Environment Reflection (RoomEnvironment + PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig
    this.setupLighting();

    // Character (Procedural Sci-Fi Robot)
    this.characterRig = createCharacterMesh(this.playerConfig.color, this.playerConfig.glowColor);
    this.characterRig.root.visible = true;
    this.scene.add(this.characterRig.root);

    // Helpers & Gizmos
    this.scene.add(this.colliderGizmosGroup);
    this.scene.add(this.particlesGroup);
    this.scene.add(this.shockwavesGroup);

    // Input handlers
    this.setupInputListeners();

    // Window resize
    window.addEventListener('resize', this.onWindowResize);

    // Start render loop
    this.lastFpsTime = performance.now();
    this.tick = this.tick.bind(this);
    this.animFrameId = requestAnimationFrame(this.tick);
  }

  private setupLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xf472b6, 0x1e102a, 0.55);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    this.dirLight.position.set(25, 45, 25);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 120;
    const d = 35;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);

    // Soft rim backlight
    this.rimLight = new THREE.DirectionalLight(0xf43f5e, 0.6);
    this.rimLight.position.set(-20, 20, -20);
    this.scene.add(this.rimLight);
  }

  private applyBiomeEnvironment(biomeType: BiomeType) {
    this.currentBiomeType = biomeType;
    const config = BIOMES[biomeType] || BIOMES.sakura;

    // 1. Scene Background & Fog
    this.scene.background = new THREE.Color(config.skyHorizonColor);
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.setHex(config.fogColor);
      this.scene.fog.density = config.fogDensity;
    } else {
      this.scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);
    }

    // 2. Lighting adaptation
    if (this.hemiLight) {
      this.hemiLight.color.setHex(config.hemiSkyColor);
      this.hemiLight.groundColor.setHex(config.hemiGroundColor);
    }
    if (this.dirLight) {
      this.dirLight.color.setHex(config.sunColor);
      this.dirLight.intensity = config.sunIntensity;
    }
    if (this.rimLight) {
      this.rimLight.color.setHex(config.rimColor);
    }

    // 3. Sky Dome
    if (this.skyDomeMesh) {
      this.scene.remove(this.skyDomeMesh);
    }
    this.skyDomeMesh = createBiomeSkyDome(biomeType);
    this.scene.add(this.skyDomeMesh);

    // 4. Distant Scenery (Floating Islands, Torii, Snowy Peaks, Pagodas)
    if (this.distantSceneryGroup) {
      this.scene.remove(this.distantSceneryGroup);
    }
    this.distantSceneryGroup = createBiomeDistantScenery(biomeType);
    this.scene.add(this.distantSceneryGroup);

    // 5. Ambient Weather Particles (Sakura petals, snow, autumn leaves, etc.)
    if (this.weatherParticlesGroup) {
      this.scene.remove(this.weatherParticlesGroup);
    }
    const weather = createBiomeWeatherParticles(biomeType);
    this.weatherParticlesGroup = weather.group;
    this.weatherParticleUpdater = weather.update;
    this.scene.add(this.weatherParticlesGroup);

    // Seamlessly transition soundtrack to harmonize with the biome
    if (config.recommendedTrackId) {
      soundSystem.selectTrack(config.recommendedTrackId);
    }
  }

  public loadLevel(levelDef: LevelDefinition) {
    this.currentLevel = levelDef;
    this.isWon = false;
    this.isGameOver = false;
    this.levelTime = 0;
    this.collectedCores = 0;
    this.totalCores = levelDef.targetCoresCount;
    this.portalIsOpen = false;
    this.carriedCubeId = null;

    // Reset player position
    this.playerPos.set(levelDef.spawnPoint[0], levelDef.spawnPoint[1], levelDef.spawnPoint[2]);
    this.playerVel.set(0, 0, 0);
    this.characterRig.root.position.copy(this.playerPos);

    // Clear dynamic entities from scene
    this.cleanupLevel();

    // Apply Biome Environment & Background
    const biomeType: BiomeType = levelDef.biome || 'sakura';
    this.applyBiomeEnvironment(biomeType);

    // 1. Build Static Platforms with Biome-specific custom textures
    const platTex = createBiomePlatformTexture(biomeType);
    platTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const biomeConfig = BIOMES[biomeType] || BIOMES.sakura;
    levelDef.platforms.forEach(plat => {
      const geo = new THREE.BoxGeometry(plat.size[0], plat.size[1], plat.size[2]);
      const mat = new THREE.MeshStandardMaterial({
        color: plat.color ? new THREE.Color(plat.color) : new THREE.Color(biomeConfig.platformColor),
        metalness: biomeType === 'winter' ? 0.75 : 0.52,
        roughness: biomeType === 'winter' ? 0.22 : 0.42,
        map: platTex,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = plat.id;
      mesh.position.set(plat.position[0], plat.position[1], plat.position[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      const box = new THREE.Box3();
      box.setFromObject(mesh);
      this.platformBoxes.push({
        id: plat.id,
        box,
        mesh,
        friction: plat.friction || (biomeType === 'winter' ? 0.78 : 0.9),
      });
    });

    // Add Platform Decor (Trees, ponds, snowdrifts, lanterns, flowerbeds)
    this.platformDecorationsGroup = createPlatformDecorations(levelDef.platforms, biomeType);
    this.scene.add(this.platformDecorationsGroup);

    // Add Nearby Floating Islands with Trees & Ponds
    this.nearbyScenicIslandsGroup = createNearbyScenicIslands(biomeType);
    this.scene.add(this.nearbyScenicIslandsGroup);

    // Add Scenic Animated Waterfall plunging in the canyon abyss (off platforms!)
    if (this.waterfallInstance) {
      this.scene.remove(this.waterfallInstance.group);
      this.waterfallInstance.dispose();
      this.waterfallInstance = null;
    }
    this.waterfallInstance = createScenicWaterfall(biomeType);
    this.scene.add(this.waterfallInstance.group);

    // 2. Build Moving Platforms
    const cautionTex = createCautionTexture();
    levelDef.movingPlatforms.forEach(mp => {
      const geo = new THREE.BoxGeometry(mp.size[0], mp.size[1], mp.size[2]);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.8,
        roughness: 0.25,
        map: cautionTex,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = mp.id;
      mesh.position.set(mp.position[0], mp.position[1], mp.position[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      const start = new THREE.Vector3(...mp.position);
      const end = new THREE.Vector3(...mp.endPosition);
      const box = new THREE.Box3().setFromObject(mesh);

      this.movingPlatforms.push({
        id: mp.id,
        mesh,
        box,
        start,
        end,
        speed: mp.speed,
        prevPos: start.clone(),
        curVel: new THREE.Vector3(),
        progress: 0,
        dir: 1,
      });
    });

    // 3. Build Quantum Cubes
    levelDef.cubes.forEach(c => {
      const group = createQuantumCubeMesh(c.color || '#38bdf8', c.size);
      group.name = c.id;
      group.position.set(c.position[0], c.position[1], c.position[2]);
      this.scene.add(group);

      this.cubes.push({
        id: c.id,
        group,
        pos: new THREE.Vector3(...c.position),
        vel: new THREE.Vector3(0, 0, 0),
        size: c.size,
        isCarried: false,
      });
    });

    // 4. Build Pressure Pads
    levelDef.pressurePads.forEach(pad => {
      const group = createPressurePadMesh(pad.color || '#06b6d4', pad.size);
      group.name = pad.id;
      group.position.set(pad.position[0], pad.position[1], pad.position[2]);
      this.scene.add(group);

      const plateMesh = group.getObjectByName('PlateSurface') as THREE.Mesh;
      this.pressurePads.push({
        id: pad.id,
        group,
        plateMesh,
        pos: new THREE.Vector3(...pad.position),
        size: pad.size,
        targetBarrierId: pad.targetBarrierId,
        isPressed: false,
      });
    });

    // 5. Build Barriers
    levelDef.barriers.forEach(bar => {
      const group = createBarrierMesh(bar.color || '#3b82f6', bar.size);
      group.name = bar.id;
      group.position.set(bar.position[0], bar.position[1], bar.position[2]);
      this.scene.add(group);

      const fieldMesh = group.getObjectByName('ForceField') as THREE.Mesh;
      this.barriers.push({
        id: bar.id,
        group,
        fieldMesh,
        basePos: new THREE.Vector3(...bar.position),
        size: bar.size,
        isOpen: false,
        currentSlide: 0,
      });
    });

    // 6. Build Lasers
    levelDef.lasers.forEach(laser => {
      const laserGroup = new THREE.Group();
      laserGroup.name = laser.id;

      // Laser emitters (towers)
      const emitterGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 12);
      const emitterMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
      });

      const emitter1 = new THREE.Mesh(emitterGeo, emitterMat);
      emitter1.position.set(laser.start[0], laser.start[1], laser.start[2]);
      laserGroup.add(emitter1);

      const endPos = new THREE.Vector3(
        laser.start[0] + laser.direction[0] * laser.length,
        laser.start[1] + laser.direction[1] * laser.length,
        laser.start[2] + laser.direction[2] * laser.length
      );
      const emitter2 = new THREE.Mesh(emitterGeo, emitterMat);
      emitter2.position.copy(endPos);
      laserGroup.add(emitter2);

      // Beam cylinder
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, laser.length, 12);
      beamGeo.rotateZ(Math.PI / 2); // align along X by default
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(
        (laser.start[0] + endPos.x) / 2,
        laser.start[1],
        (laser.start[2] + endPos.z) / 2
      );
      laserGroup.add(beamMesh);

      this.scene.add(laserGroup);

      this.lasers.push({
        id: laser.id,
        group: laserGroup,
        beamMesh,
        emitter1,
        emitter2,
        start: new THREE.Vector3(...laser.start),
        dir: new THREE.Vector3(...laser.direction).normalize(),
        length: laser.length,
        moving: !!laser.moving,
        moveRange: laser.moveRange || 3,
        moveSpeed: laser.moveSpeed || 2,
        moveAxis: laser.moveAxis || 'z',
        progress: 0,
      });
    });

    // 7. Build Jump Pads
    levelDef.jumpPads.forEach(jp => {
      const group = createJumpPadMesh(jp.strength);
      group.name = jp.id;
      group.position.set(jp.position[0], jp.position[1], jp.position[2]);
      this.scene.add(group);

      this.jumpPads.push({
        id: jp.id,
        group,
        pos: new THREE.Vector3(...jp.position),
        strength: jp.strength,
      });
    });

    // 8. Build Energy Cores
    levelDef.cores.forEach(c => {
      const group = createEnergyCoreMesh();
      group.name = c.id;
      group.position.set(c.position[0], c.position[1], c.position[2]);
      this.scene.add(group);

      this.cores.push({
        id: c.id,
        group,
        pos: new THREE.Vector3(...c.position),
        collected: false,
      });
    });

    // 9. Build Warp Portal
    this.portalMesh = createPortalMesh();
    this.portalPos.set(levelDef.portal.position[0], levelDef.portal.position[1], levelDef.portal.position[2]);
    this.portalMesh.position.copy(this.portalPos);
    this.scene.add(this.portalMesh);

    // Initial callbacks
    this.callbacks.onCoresUpdate(0, this.totalCores);
    this.logConsole('info', `Загружен уровень: ${levelDef.title}`);
    this.updateGameObjectList();
  }

  private cleanupLevel() {
    this.platformBoxes.forEach(p => this.scene.remove(p.mesh));
    this.platformBoxes = [];

    this.movingPlatforms.forEach(p => this.scene.remove(p.mesh));
    this.movingPlatforms = [];

    this.cubes.forEach(c => this.scene.remove(c.group));
    this.cubes = [];

    this.pressurePads.forEach(p => this.scene.remove(p.group));
    this.pressurePads = [];

    this.barriers.forEach(b => this.scene.remove(b.group));
    this.barriers = [];

    this.lasers.forEach(l => this.scene.remove(l.group));
    this.lasers = [];

    this.jumpPads.forEach(j => this.scene.remove(j.group));
    this.jumpPads = [];

    this.cores.forEach(c => this.scene.remove(c.group));
    this.cores = [];

    if (this.portalMesh) {
      this.scene.remove(this.portalMesh);
    }

    if (this.skyDomeMesh) {
      this.scene.remove(this.skyDomeMesh);
      this.skyDomeMesh = null;
    }
    if (this.distantSceneryGroup) {
      this.scene.remove(this.distantSceneryGroup);
      this.distantSceneryGroup = null;
    }
    if (this.weatherParticlesGroup) {
      this.scene.remove(this.weatherParticlesGroup);
      this.weatherParticlesGroup = null;
      this.weatherParticleUpdater = null;
    }
    if (this.platformDecorationsGroup) {
      this.scene.remove(this.platformDecorationsGroup);
      this.platformDecorationsGroup = null;
    }
    if (this.nearbyScenicIslandsGroup) {
      this.scene.remove(this.nearbyScenicIslandsGroup);
      this.nearbyScenicIslandsGroup = null;
    }
    if (this.waterfallInstance) {
      this.scene.remove(this.waterfallInstance.group);
      this.waterfallInstance.dispose();
      this.waterfallInstance = null;
    }
  }

  public requestPointerLock() {
    const dom = this.renderer.domElement;
    if (document.pointerLockElement !== dom) {
      try {
        dom.requestPointerLock();
      } catch {
        // Pointer lock rejected or not permitted
      }
    }
  }

  public exitPointerLock() {
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  }

  private setupInputListeners() {
    const keys: Record<string, boolean> = {};

    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in an input
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'SELECT') {
        return;
      }

      keys[e.code] = true;
      if (e.code === 'Space' && !e.repeat) {
        this.inputJumpPressed = true;
      }
      if (e.code === 'KeyE' && !e.repeat) {
        this.handleInteract();
      }
      if (e.code === 'KeyF' && !e.repeat) {
        this.throwCube();
      }
      if (e.code === 'KeyQ' && !e.repeat) {
        this.toggleSlowMotion();
      }
      if (e.code === 'KeyR' && !e.repeat) {
        this.resetPlayerToCheckpoint();
      }
      if (e.code === 'KeyC' && !e.repeat) {
        this.cycleCameraMode();
      }
      if (e.code === 'KeyM' && !e.repeat) {
        const next = soundSystem.nextTrack();
        this.logConsole('info', `🎵 Музыка [${next.icon}]: ${next.title} (${next.genre})`);
      }

      this.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);
      this.updateMovement(keys);
    });

    window.addEventListener('keyup', (e) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'SELECT') {
        return;
      }

      keys[e.code] = false;
      if (e.code === 'Space') {
        // Variable jump height
        if (this.playerVel.y > 2.5) {
          this.playerVel.y *= 0.55;
        }
      }

      this.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);
      this.updateMovement(keys);
    });

    // Pointer lock state changes
    const dom = this.renderer.domElement;
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === dom;
      this.callbacks.onPointerLockChange?.(this.isPointerLocked);
      if (this.isPointerLocked) {
        this.logConsole('info', 'Режим мыши активирован (Esc - выход)');
      }
    });

    dom.addEventListener('pointerdown', (e) => {
      // If locked, mouse buttons act as primary actions
      if (this.isPointerLocked) {
        if (e.button === 0) {
          if (this.carriedCubeId) {
            this.throwCube();
          } else {
            this.handleInteract();
          }
        }
        return;
      }

      // If not locked and clicked with left button, request pointer lock
      if (e.button === 0 && !e.shiftKey) {
        this.requestPointerLock();
      }

      // Dragging support (for users who prefer drag or when pointer lock isn't active)
      this.isDraggingCamera = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      const sens = (this.playerConfig.mouseSensitivity || 1.0);
      const invertY = this.playerConfig.invertY ? -1 : 1;

      // Mouse look when pointer locked
      if (document.pointerLockElement === dom) {
        this.cameraAngleH -= e.movementX * 0.0032 * sens;
        this.cameraAngleV = Math.max(0.08, Math.min(1.42, this.cameraAngleV + e.movementY * 0.0032 * sens * invertY));
        return;
      }

      // Mouse look when dragging
      if (this.isDraggingCamera) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        this.cameraAngleH -= dx * 0.005 * sens;
        this.cameraAngleV = Math.max(0.08, Math.min(1.42, this.cameraAngleV + dy * 0.005 * sens * invertY));
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDraggingCamera = false;
    });

    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    // Wheel zoom
    dom.addEventListener('wheel', (e) => {
      this.cameraDistance = Math.max(3.2, Math.min(16, this.cameraDistance + e.deltaY * 0.008));
    }, { passive: true });
  }

  private updateMovement(keys: Record<string, boolean>) {
    let x = 0;
    let z = 0;
    if (keys['KeyW'] || keys['ArrowUp']) z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) x += 1;

    // Normalize
    const len = Math.hypot(x, z);
    if (len > 0) {
      this.inputMove.x = x / len;
      this.inputMove.z = z / len;
    } else {
      this.inputMove.x = 0;
      this.inputMove.z = 0;
    }
  }

  public setVirtualJoystick(x: number, z: number) {
    this.inputMove.x = x;
    this.inputMove.z = z;
  }

  public setSprinting(sprint: boolean) {
    this.isSprinting = sprint;
  }

  public triggerJump() {
    this.inputJumpPressed = true;
  }

  public throwCube() {
    if (!this.carriedCubeId) return;
    const cube = this.cubes.find(c => c.id === this.carriedCubeId);
    if (!cube) return;

    cube.isCarried = false;
    // Calculate forward vector from camera orientation
    const fwdX = -Math.sin(this.cameraAngleH);
    const fwdZ = -Math.cos(this.cameraAngleH);

    cube.pos.set(
      this.playerPos.x + fwdX * 1.3,
      this.playerPos.y + 1.0,
      this.playerPos.z + fwdZ * 1.3
    );
    cube.vel.set(
      fwdX * 13.0,
      5.5,
      fwdZ * 13.0
    );

    this.carriedCubeId = null;
    this.characterRig.tractorBeams.visible = false;
    soundSystem.playThrowCube();

    // Spectacular recoil, shockwave, and camera punch
    this.addCameraShake(0.3);
    this.spawnShockwave(this.playerPos, '#38bdf8', 1.6, 0.25);
    this.spawnVaporizeParticles(cube.pos, '#38bdf8', 16);
    this.squashStretch.set(1.2, 0.85, 1.2);

    this.logConsole('info', `Квантовый куб метнут вперед: ${cube.id}`);
  }

  public handleInteract() {
    // If currently carrying a cube, place it gently down in front of player
    if (this.carriedCubeId) {
      const cube = this.cubes.find(c => c.id === this.carriedCubeId);
      if (cube) {
        cube.isCarried = false;
        const fwdX = -Math.sin(this.cameraAngleH);
        const fwdZ = -Math.cos(this.cameraAngleH);
        cube.pos.set(
          this.playerPos.x + fwdX * 1.2,
          this.playerPos.y + 0.4,
          this.playerPos.z + fwdZ * 1.2
        );
        cube.vel.set(0, 0, 0);
        this.carriedCubeId = null;
        this.characterRig.tractorBeams.visible = false;
        soundSystem.playDropCube();
        this.logConsole('info', `Игрок аккуратно поставил QuantumCube: ${cube.id}`);
      }
      return;
    }

    // Otherwise, check for nearest cube to pick up
    let nearestDist = 2.8;
    let targetCube: typeof this.cubes[0] | null = null;

    for (const c of this.cubes) {
      const dist = this.playerPos.distanceTo(c.pos);
      if (dist < nearestDist) {
        nearestDist = dist;
        targetCube = c;
      }
    }

    if (targetCube) {
      targetCube.isCarried = true;
      this.carriedCubeId = targetCube.id;
      this.characterRig.tractorBeams.visible = true;
      soundSystem.playPickUpCube();
      this.logConsole('info', `Игрок захватил QuantumCube: ${targetCube.id}`);
    }
  }

  public resetPlayerToCheckpoint() {
    if (!this.currentLevel) return;
    this.playerPos.set(
      this.currentLevel.spawnPoint[0],
      this.currentLevel.spawnPoint[1],
      this.currentLevel.spawnPoint[2]
    );
    this.playerVel.set(0, 0, 0);
    this.characterRig.root.position.copy(this.playerPos);

    // Drop any carried cube
    if (this.carriedCubeId) {
      const cube = this.cubes.find(c => c.id === this.carriedCubeId);
      if (cube) {
        cube.isCarried = false;
        cube.pos.set(this.playerPos.x + 1, this.playerPos.y + 0.5, this.playerPos.z);
        cube.vel.set(0, 0, 0);
      }
      this.carriedCubeId = null;
      this.characterRig.tractorBeams.visible = false;
    }

    this.spawnVaporizeParticles(this.playerPos, '#38bdf8', 25);
    this.logConsole('warning', 'Игрок возрожден на контрольной точке');
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
  }

  public cycleCameraMode() {
    if (this.viewPerspective === 'third') {
      this.setViewPerspective('close');
    } else if (this.viewPerspective === 'close') {
      this.setViewPerspective('top');
    } else {
      this.setViewPerspective('third');
    }
  }

  public setViewPerspective(mode: 'third' | 'close' | 'top') {
    this.viewPerspective = mode;
    if (mode === 'third') {
      this.cameraDistance = 7.5;
      this.cameraAngleV = 0.32;
    } else if (mode === 'close') {
      this.cameraDistance = 4.0;
      this.cameraAngleV = 0.25;
    }
    this.callbacks.onCameraModeChange?.(mode);
    this.logConsole('info', `Режим камеры изменен: ${mode}`);
  }

  public selectGameObject(id: string | null) {
    this.selectedObjectId = id;
    if (this.selectionWireframe) {
      this.scene.remove(this.selectionWireframe);
      this.selectionWireframe = null;
    }

    if (!id) return;

    const obj = this.scene.getObjectByName(id);
    if (obj) {
      const box = new THREE.Box3().setFromObject(obj);
      const helper = new THREE.Box3Helper(box, new THREE.Color('#38bdf8'));
      this.selectionWireframe = helper as unknown as THREE.LineSegments;
      this.scene.add(this.selectionWireframe);
    }
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /**
   * Main Engine Loop (60 FPS)
   */
  private tick() {
    this.animFrameId = requestAnimationFrame(this.tick);

    const rawDelta = Math.min(this.clock.getDelta(), 0.05);
    const timeFactor = this.playerConfig.slowMotion ? 0.3 : 1.0;
    const delta = rawDelta * timeFactor;

    if (!this.isPaused && !this.isGameOver && !this.isWon) {
      this.levelTime += delta;
      this.callbacks.onTimeUpdate(this.levelTime);

      // Physics & Entities
      this.updateMovingPlatforms(delta);
      this.updatePlayerPhysics(delta);
      this.updateCubesPhysics(delta);
      this.updatePressurePads();
      this.updateBarriers(delta);
      this.updateLasers(delta);
      this.updateJumpPads(delta);
      this.updateCollectibles(delta);
      this.updatePortal();
      this.updateParticles(delta);
      this.updateShockwaves(delta);

      // Biome Weather Particles & Sky Canopy Animation
      this.weatherParticleUpdater?.(delta, this.playerPos);
      this.waterfallInstance?.update(delta);
      if (this.skyDomeMesh) {
        this.skyDomeMesh.rotation.y += delta * 0.015;
      }

      // Check Fall Out of bounds
      if (this.playerPos.y < -15) {
        soundSystem.playLaserZap();
        this.resetPlayerToCheckpoint();
      }
    }

    // Camera follow
    this.updateCamera(delta);

    // Render Scene
    this.renderer.render(this.scene, this.camera);

    // Performance metrics
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
      const info = this.renderer.info;
      this.callbacks.onFpsUpdate(this.currentFps, info.render.calls, info.render.triangles);
    }
  }

  private updateMovingPlatforms(delta: number) {
    for (const mp of this.movingPlatforms) {
      mp.progress += delta * (mp.speed / mp.start.distanceTo(mp.end)) * mp.dir;
      if (mp.progress >= 1) {
        mp.progress = 1;
        mp.dir = -1;
      } else if (mp.progress <= 0) {
        mp.progress = 0;
        mp.dir = 1;
      }

      mp.prevPos.copy(mp.mesh.position);
      mp.mesh.position.lerpVectors(mp.start, mp.end, mp.progress);

      // Compute platform velocity vector
      mp.curVel.subVectors(mp.mesh.position, mp.prevPos).divideScalar(delta);
      mp.box.setFromObject(mp.mesh);
    }
  }

  private updatePlayerPhysics(delta: number) {
    // 1. Calculate World-Relative Movement Direction from Camera Angle
    // Forward vector on horizontal plane from camera to player
    const fwdX = -Math.sin(this.cameraAngleH);
    const fwdZ = -Math.cos(this.cameraAngleH);
    // Right vector (perpendicular to forward, 90 deg clockwise)
    const rightX = -fwdZ;
    const rightZ = fwdX;

    // inputMove: x is strafe (-1 for A, +1 for D), z is forward (-1 for W, +1 for S)
    const moveDirX = rightX * this.inputMove.x - fwdX * this.inputMove.z;
    const moveDirZ = rightZ * this.inputMove.x - fwdZ * this.inputMove.z;

    const currentSpeed = this.isSprinting ? this.playerConfig.sprintSpeed : this.playerConfig.moveSpeed;
    const targetVelX = moveDirX * currentSpeed;
    const targetVelZ = moveDirZ * currentSpeed;

    // Snappy responsiveness: 24 when moving, 28 when stopping on ground, 14 in air
    const isMovingInput = Math.hypot(this.inputMove.x, this.inputMove.z) > 0.05;
    const dampFactor = this.isGrounded ? (isMovingInput ? 24 : 28) : 14;
    this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, targetVelX, dampFactor, delta);
    this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, targetVelZ, dampFactor, delta);

    // 2. Gravity
    this.playerVel.y -= this.playerConfig.gravity * delta;

    // 3. Ground detection & Jump
    if (this.isGrounded) {
      this.coyoteTimer = 0.15;
      this.canDoubleJump = true;
    } else {
      this.coyoteTimer -= delta;
    }

    if (this.inputJumpPressed) {
      this.jumpBufferTimer = 0.18;
      this.inputJumpPressed = false;
    } else {
      this.jumpBufferTimer -= delta;
    }

    const prevVerticalVel = this.playerVel.y;
    const wasGrounded = this.isGrounded;

    // Execute Ground Jump
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.playerVel.y = this.playerConfig.jumpForce;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.isGrounded = false;
      soundSystem.playJump();
      this.squashStretch.set(0.78, 1.38, 0.78);
      this.spawnShockwave(this.playerPos, '#38bdf8', 1.6, 0.25);
    }
    // Execute Double Jump with aerial front flip, spiral halo & shockwave
    else if (this.jumpBufferTimer > 0 && this.playerConfig.doubleJump && this.canDoubleJump && !this.isGrounded) {
      this.playerVel.y = this.playerConfig.jumpForce * 0.95;
      this.canDoubleJump = false;
      this.jumpBufferTimer = 0;
      soundSystem.playDoubleJump();
      soundSystem.playFlip();
      this.flipTimer = 0.42;
      this.addCameraShake(0.24);
      this.squashStretch.set(0.85, 1.25, 0.85);
      this.spawnShockwave(this.playerPos, '#06b6d4', 3.0, 0.35);
      this.spawnDoubleJumpSpiral(this.playerPos, '#38bdf8');
      this.spawnVaporizeParticles(this.playerPos, '#38bdf8', 16);
    }

    // 4. Collision Detection with Platforms & Moving Platforms
    const playerHalfW = 0.35;
    const playerHeight = 1.35;

    // Predicted new position
    const nextPos = _v1.copy(this.playerPos).addScaledVector(this.playerVel, delta);

    // Player bounding box for tests
    _box1.min.set(nextPos.x - playerHalfW, nextPos.y, nextPos.z - playerHalfW);
    _box1.max.set(nextPos.x + playerHalfW, nextPos.y + playerHeight, nextPos.z + playerHalfW);

    this.isGrounded = false;
    let standingOnMovingPlatform: typeof this.movingPlatforms[0] | null = null;

    // Check static platforms with smooth step-up
    for (const plat of this.platformBoxes) {
      if (_box1.intersectsBox(plat.box)) {
        const prevBottom = this.playerPos.y;
        const topSurface = plat.box.max.y;

        // Vertical landing on top
        if (prevBottom >= topSurface - 0.28 && this.playerVel.y <= 0) {
          nextPos.y = topSurface;
          this.playerVel.y = 0;
          this.isGrounded = true;
        }
        // Smooth step-up (ledge auto-climb for low obstacles <= 0.45m)
        else if (topSurface - prevBottom > 0 && topSurface - prevBottom <= 0.45 && this.playerVel.y <= 0.5) {
          nextPos.y = topSurface;
          this.playerVel.y = 0;
          this.isGrounded = true;
        }
        // Ceiling hit
        else if (this.playerPos.y + playerHeight <= plat.box.min.y + 0.25 && this.playerVel.y > 0) {
          nextPos.y = plat.box.min.y - playerHeight;
          this.playerVel.y = 0;
        }
        // Horizontal wall collision
        else {
          nextPos.x = this.playerPos.x;
          nextPos.z = this.playerPos.z;
        }
      }
    }

    // Check moving platforms
    for (const mp of this.movingPlatforms) {
      if (_box1.intersectsBox(mp.box)) {
        const prevBottom = this.playerPos.y;
        const topSurface = mp.box.max.y;

        if (prevBottom >= topSurface - 0.35 && this.playerVel.y <= 0) {
          nextPos.y = topSurface;
          this.playerVel.y = 0;
          this.isGrounded = true;
          standingOnMovingPlatform = mp;
        } else {
          nextPos.x = this.playerPos.x;
          nextPos.z = this.playerPos.z;
        }
      }
    }

    // Inherit moving platform velocity
    if (standingOnMovingPlatform) {
      nextPos.x += standingOnMovingPlatform.curVel.x * delta;
      nextPos.z += standingOnMovingPlatform.curVel.z * delta;
      nextPos.y = standingOnMovingPlatform.box.max.y;
    }

    // Landing impact shockwave & particles
    if (!wasGrounded && this.isGrounded && prevVerticalVel < -3.5) {
      this.squashStretch.set(1.26, 0.7, 1.26);
      this.spawnShockwave(this.playerPos, '#38bdf8', 1.8, 0.26);
      this.addCameraShake(Math.min(0.35, Math.abs(prevVerticalVel) * 0.024));
      soundSystem.playLand();
      this.spawnVaporizeParticles(this.playerPos, '#94a3b8', 8);
    }

    // Check Energy Barriers collision
    for (const bar of this.barriers) {
      if (!bar.isOpen) {
        _box2.setFromObject(bar.fieldMesh);
        if (_box1.intersectsBox(_box2)) {
          nextPos.x = this.playerPos.x;
          nextPos.z = this.playerPos.z;
        }
      }
    }

    // Apply resolved position
    this.playerPos.copy(nextPos);
    this.characterRig.root.position.copy(this.playerPos);

    // 5. Update character animation & rotation
    const actualSpeed = Math.hypot(this.playerVel.x, this.playerVel.z);
    const isMoving = actualSpeed > 0.35;
    if (isMoving) {
      const targetAngle = Math.atan2(this.playerVel.x, this.playerVel.z);
      this.characterRig.root.rotation.y = THREE.MathUtils.damp(
        this.characterRig.root.rotation.y,
        targetAngle,
        20,
        delta
      );
    }

    // Apply Squash & Stretch to robot rig
    this.squashStretch.x = THREE.MathUtils.damp(this.squashStretch.x, 1.0, 14, delta);
    this.squashStretch.y = THREE.MathUtils.damp(this.squashStretch.y, 1.0, 14, delta);
    this.squashStretch.z = THREE.MathUtils.damp(this.squashStretch.z, 1.0, 14, delta);
    this.characterRig.body.scale.copy(this.squashStretch);

    // Aerial front flip on double jump
    if (this.flipTimer > 0) {
      this.flipTimer -= delta;
      const flipAngle = (Math.PI * 2) * (delta / 0.42);
      this.characterRig.body.rotation.x += flipAngle;
    } else {
      const runTilt = isMoving ? (this.isSprinting ? 0.38 : 0.22) : 0;
      this.characterRig.body.rotation.x = THREE.MathUtils.damp(
        this.characterRig.body.rotation.x,
        runTilt,
        14,
        delta
      );
    }

    // Dynamic banking into lateral turns
    const targetRoll = -this.inputMove.x * (this.isSprinting ? 0.35 : 0.2);
    this.characterRig.body.rotation.z = THREE.MathUtils.damp(
      this.characterRig.body.rotation.z,
      targetRoll,
      14,
      delta
    );

    // Footstep dust puffs when moving on ground
    if (this.isGrounded && isMoving) {
      this.footstepDustTimer += delta;
      const dustInterval = this.isSprinting ? 0.08 : 0.16;
      if (this.footstepDustTimer >= dustInterval) {
        this.footstepDustTimer = 0;
        this.spawnFootstepDust(this.playerPos, this.isSprinting ? '#38bdf8' : '#94a3b8');
      }
    }

    // Gyroscope ring spinning
    this.characterRig.gyroRing.rotation.z += delta * (actualSpeed * 3.5 + 2.0);

    // Dynamic Jet Thruster Flame
    let flameScaleY = 0.45;
    let flameScaleXZ = 0.5;
    if (!this.isGrounded) {
      flameScaleY = 2.0 + Math.sin(this.levelTime * 20) * 0.3;
      flameScaleXZ = 1.1;
    } else if (this.isSprinting && isMoving) {
      flameScaleY = 2.4 + Math.sin(this.levelTime * 25) * 0.3;
      flameScaleXZ = 1.3;
    } else if (isMoving) {
      flameScaleY = 1.3 + Math.sin(this.levelTime * 15) * 0.2;
      flameScaleXZ = 0.85;
    } else {
      flameScaleY = 0.45 + Math.sin(this.levelTime * 10) * 0.08;
      flameScaleXZ = 0.5;
    }
    this.characterRig.jetFlame.scale.set(flameScaleXZ, flameScaleY, flameScaleXZ);

    // Antennae spring sway
    this.characterRig.antL.rotation.x = Math.sin(this.levelTime * 8) * 0.12 - (actualSpeed * 0.04);
    this.characterRig.antR.rotation.x = Math.sin(this.levelTime * 8 + 1) * 0.12 - (actualSpeed * 0.04);

    // Hands posing & animation
    if (this.carriedCubeId) {
      // Hands held forward to channel tractor beam
      this.characterRig.leftHand.position.set(-0.38, 0.62, 0.55);
      this.characterRig.rightHand.position.set(0.38, 0.62, 0.55);
      this.characterRig.leftHand.rotation.set(0.4, 0.2, 0);
      this.characterRig.rightHand.rotation.set(0.4, -0.2, 0);
    } else if (this.isSprinting && isMoving) {
      // Hands swept backward in supersonic dive
      this.characterRig.leftHand.position.set(-0.48, 0.45, -0.25);
      this.characterRig.rightHand.position.set(0.48, 0.45, -0.25);
      this.characterRig.leftHand.rotation.set(-0.6, 0.1, 0);
      this.characterRig.rightHand.rotation.set(-0.6, -0.1, 0);
    } else if (isMoving) {
      // Rhythmic arm bobbing
      const armSwing = Math.sin(this.levelTime * 14) * 0.2;
      this.characterRig.leftHand.position.set(-0.48, 0.56 + armSwing * 0.2, armSwing * 0.4);
      this.characterRig.rightHand.position.set(0.48, 0.56 - armSwing * 0.2, -armSwing * 0.4);
      this.characterRig.leftHand.rotation.set(armSwing * 0.5, 0, 0);
      this.characterRig.rightHand.rotation.set(-armSwing * 0.5, 0, 0);
    } else {
      // Idle floating
      const idleFloat = Math.sin(this.levelTime * 3.5) * 0.05;
      this.characterRig.leftHand.position.set(-0.48, 0.56 + idleFloat, 0);
      this.characterRig.rightHand.position.set(0.48, 0.56 - idleFloat, 0);
      this.characterRig.leftHand.rotation.set(0, 0, 0);
      this.characterRig.rightHand.rotation.set(0, 0, 0);
    }

    // Continuous Jet Exhaust Trail
    if (isMoving || !this.isGrounded) {
      this.jetTrailTimer += delta;
      const trailInterval = this.isSprinting ? 0.025 : 0.05;
      if (this.jetTrailTimer >= trailInterval) {
        this.jetTrailTimer = 0;
        this.spawnJetSpark(this.playerPos, this.isSprinting ? '#06b6d4' : '#38bdf8');
      }
    }

    // Floating idle oscillation
    this.characterRig.body.position.y = Math.sin(this.levelTime * 5) * 0.04;

    // Update interact prompt
    this.checkInteractPrompt();
  }

  private updateCubesPhysics(delta: number) {
    for (const cube of this.cubes) {
      if (cube.isCarried) {
        // Position cube in front of player
        const forward = _v1.set(
          Math.sin(this.characterRig.root.rotation.y),
          0,
          Math.cos(this.characterRig.root.rotation.y)
        );
        const carryTarget = _v2.copy(this.playerPos).addScaledVector(forward, 1.5);
        carryTarget.y += 0.8;

        cube.pos.lerp(carryTarget, 16 * delta);
        cube.vel.set(0, 0, 0);
        cube.group.position.copy(cube.pos);
        continue;
      }

      // Cube gravity
      cube.vel.y -= this.playerConfig.gravity * delta;
      cube.vel.x = THREE.MathUtils.damp(cube.vel.x, 0, 6, delta);
      cube.vel.z = THREE.MathUtils.damp(cube.vel.z, 0, 6, delta);

      const nextCubePos = _v1.copy(cube.pos).addScaledVector(cube.vel, delta);
      const halfS = cube.size[0] / 2;
      _box1.min.set(nextCubePos.x - halfS, nextCubePos.y - halfS, nextCubePos.z - halfS);
      _box1.max.set(nextCubePos.x + halfS, nextCubePos.y + halfS, nextCubePos.z + halfS);

      // Check collision with static platforms
      for (const plat of this.platformBoxes) {
        if (_box1.intersectsBox(plat.box)) {
          if (cube.pos.y - halfS >= plat.box.max.y - 0.25 && cube.vel.y <= 0) {
            nextCubePos.y = plat.box.max.y + halfS;
            cube.vel.y = 0;
          } else {
            nextCubePos.x = cube.pos.x;
            nextCubePos.z = cube.pos.z;
          }
        }
      }

      // Check collision with moving platforms
      for (const mp of this.movingPlatforms) {
        if (_box1.intersectsBox(mp.box)) {
          if (cube.pos.y - halfS >= mp.box.max.y - 0.25 && cube.vel.y <= 0) {
            nextCubePos.y = mp.box.max.y + halfS;
            nextCubePos.x += mp.curVel.x * delta;
            nextCubePos.z += mp.curVel.z * delta;
            cube.vel.y = 0;
          }
        }
      }

      // Player pushing cube
      const distToPlayer = this.playerPos.distanceTo(nextCubePos);
      if (distToPlayer < 1.4 && !cube.isCarried) {
        const pushDir = _v2.subVectors(nextCubePos, this.playerPos).setY(0).normalize();
        cube.vel.x = pushDir.x * 3.5;
        cube.vel.z = pushDir.z * 3.5;
      }

      // Animate inner hypercube core & halo ring
      const innerCore = cube.group.getObjectByName('InnerHypercube');
      const halo = cube.group.getObjectByName('HaloRing');
      if (innerCore) {
        innerCore.rotation.x += delta * 1.8;
        innerCore.rotation.y += delta * 2.4;
      }
      if (halo) {
        halo.rotation.z += delta * 1.4;
      }

      // Tumble cube when airborne with momentum
      if (!cube.isCarried && Math.hypot(cube.vel.x, cube.vel.z) > 1.2) {
        cube.group.rotation.x += delta * cube.vel.z * 0.8;
        cube.group.rotation.z -= delta * cube.vel.x * 0.8;
      }

      // Spectacular glowing trajectory trail when flying
      if (!cube.isCarried && Math.hypot(cube.vel.x, cube.vel.y, cube.vel.z) > 1.8) {
        this.cubeTrailTimer += delta;
        if (this.cubeTrailTimer >= 0.035) {
          this.cubeTrailTimer = 0;
          this.spawnCubeTrail(cube.pos, '#38bdf8');
        }
      }

      cube.pos.copy(nextCubePos);
      cube.group.position.copy(cube.pos);
    }
  }

  private updatePressurePads() {
    for (const pad of this.pressurePads) {
      _box1.min.set(pad.pos.x - pad.size[0] / 2, pad.pos.y, pad.pos.z - pad.size[2] / 2);
      _box1.max.set(pad.pos.x + pad.size[0] / 2, pad.pos.y + 0.8, pad.pos.z + pad.size[2] / 2);

      let triggered = false;

      // Check player on pad
      if (_box1.containsPoint(this.playerPos)) {
        triggered = true;
      }

      // Check any cube on pad
      for (const cube of this.cubes) {
        if (!cube.isCarried && _box1.containsPoint(cube.pos)) {
          triggered = true;
          break;
        }
      }

      // Pulse glyph rings
      const outerGlyph = pad.group.getObjectByName('OuterGlyphRing');
      if (outerGlyph) {
        outerGlyph.rotation.z += 0.02;
      }

      if (triggered !== pad.isPressed) {
        pad.isPressed = triggered;
        if (triggered) {
          pad.plateMesh.position.y = -0.05;
          soundSystem.playPadActivated();
          this.spawnShockwave(pad.pos, '#06b6d4', 2.4, 0.35);
          this.addCameraShake(0.14);
          this.logConsole('info', `Плита активирована: [${pad.id}] -> отключает ${pad.targetBarrierId}`);
        } else {
          pad.plateMesh.position.y = 0.08;
          soundSystem.playPadDeactivated();
          this.logConsole('info', `Плита отпущена: [${pad.id}]`);
        }
      }
    }
  }

  private updateBarriers(delta: number) {
    for (const bar of this.barriers) {
      // Find pressure pads pointing to this barrier
      const connectedPads = this.pressurePads.filter(p => p.targetBarrierId === bar.id);
      const shouldOpen = connectedPads.length > 0 && connectedPads.every(p => p.isPressed);

      bar.isOpen = shouldOpen;

      const targetSlide = shouldOpen ? -bar.size[1] : 0;
      bar.currentSlide = THREE.MathUtils.damp(bar.currentSlide, targetSlide, 6, delta);
      bar.group.position.y = bar.basePos.y + bar.currentSlide;

      // Adjust opacity
      const mat = bar.fieldMesh.material as THREE.MeshStandardMaterial;
      mat.opacity = shouldOpen ? 0.15 : 0.65;
    }
  }

  private updateLasers(delta: number) {
    for (const laser of this.lasers) {
      // Dynamic moving laser
      if (laser.moving) {
        laser.progress += delta * laser.moveSpeed;
        const offset = Math.sin(laser.progress) * laser.moveRange;
        if (laser.moveAxis === 'z') {
          laser.group.position.z = offset;
        } else {
          laser.group.position.x = offset;
        }
      }

      // Compute beam world coordinates
      const currentStart = _v1.copy(laser.start).add(laser.group.position);
      const beamEnd = _v2.copy(currentStart).addScaledVector(laser.dir, laser.length);

      // Check if any cube intercepts the beam!
      let effectiveLength = laser.length;
      for (const cube of this.cubes) {
        const halfS = cube.size[0] / 2;
        _box1.min.set(cube.pos.x - halfS, cube.pos.y - halfS, cube.pos.z - halfS);
        _box1.max.set(cube.pos.x + halfS, cube.pos.y + halfS, cube.pos.z + halfS);

        _ray.set(currentStart, laser.dir);
        const intersect = _ray.ray.intersectBox(_box1, _v3);
        if (intersect) {
          const distToCube = currentStart.distanceTo(_v3);
          if (distToCube < effectiveLength) {
            effectiveLength = distToCube;
          }
        }
      }

      // Continuous sparks when laser is intercepted by cube
      if (effectiveLength < laser.length && Math.random() < 0.45) {
        const sparkPos = _v3.set(
          currentStart.x + laser.dir.x * effectiveLength,
          currentStart.y + laser.dir.y * effectiveLength,
          currentStart.z + laser.dir.z * effectiveLength
        );
        this.spawnLaserSparks(sparkPos, laser.dir, '#ef4444');
        if (Math.random() < 0.12) {
          soundSystem.playLaserDeflect();
        }
      }

      // Adjust laser beam visual mesh length
      laser.beamMesh.scale.set(1, 1, effectiveLength / laser.length);
      laser.beamMesh.position.set(
        currentStart.x + laser.dir.x * (effectiveLength / 2) - laser.group.position.x,
        currentStart.y - laser.group.position.y,
        currentStart.z + laser.dir.z * (effectiveLength / 2) - laser.group.position.z
      );

      // Check player collision with active unblocked beam
      if (!this.playerConfig.invulnerable) {
        // Player cylinder/box distance to ray segment
        const playerCenter = _v3.copy(this.playerPos).add(new THREE.Vector3(0, 0.7, 0));
        const lineSeg = new THREE.Line3(currentStart, _v2.copy(currentStart).addScaledVector(laser.dir, effectiveLength));
        const closestPoint = _v1;
        lineSeg.closestPointToPoint(playerCenter, true, closestPoint);

        if (closestPoint.distanceTo(playerCenter) < 0.65) {
          soundSystem.playLaserZap();
          this.addCameraShake(0.45);
          this.spawnShockwave(this.playerPos, '#ef4444', 2.5, 0.3);
          this.spawnVaporizeParticles(this.playerPos, '#ef4444', 35);
          this.resetPlayerToCheckpoint();
        }
      }
    }
  }

  private updateJumpPads(delta: number) {
    for (const jp of this.jumpPads) {
      // Animate levitation energy rings
      const ring1 = jp.group.getObjectByName('EnergyRing1');
      const ring2 = jp.group.getObjectByName('EnergyRing2');
      if (ring1) {
        ring1.rotation.z += delta * 4.5;
        ring1.position.y = 0.28 + Math.sin(this.levelTime * 6) * 0.06;
      }
      if (ring2) {
        ring2.rotation.z -= delta * 3.5;
        ring2.position.y = 0.48 + Math.cos(this.levelTime * 6) * 0.06;
      }

      if (this.playerPos.distanceTo(jp.pos) < 1.3 && Math.abs(this.playerPos.y - jp.pos.y) < 0.6) {
        this.playerVel.y = jp.strength;
        soundSystem.playSuperLaunch();
        this.addCameraShake(0.38);
        this.spawnShockwave(jp.pos, '#10b981', 3.8, 0.45);
        this.spawnVaporizeParticles(jp.pos, '#10b981', 30);
        this.squashStretch.set(0.65, 1.55, 0.65);
        this.logConsole('info', `Джамп-пад ускорил игрока с силой: ${jp.strength}`);
      }
    }
  }

  private updateCollectibles(delta: number) {
    for (const core of this.cores) {
      if (core.collected) continue;

      // Spin crystal gem & dual gyroscopic orbit rings
      const gem = core.group.getObjectByName('Gem');
      const ring1 = core.group.getObjectByName('OrbitRing1');
      const ring2 = core.group.getObjectByName('OrbitRing2');
      if (gem) {
        gem.rotation.y += delta * 2.8;
        gem.position.y = Math.sin(this.levelTime * 4) * 0.12;
      }
      if (ring1) ring1.rotation.x += delta * 2.2;
      if (ring2) ring2.rotation.y += delta * 1.8;

      // Check collection
      if (this.playerPos.distanceTo(core.pos) < 1.4) {
        core.collected = true;
        core.group.visible = false;
        this.collectedCores++;
        soundSystem.playCoreCollect();
        this.addCameraShake(0.24);
        this.spawnShockwave(core.pos, '#facc15', 2.8, 0.35);
        this.spawnVaporizeParticles(core.pos, '#facc15', 26);
        this.callbacks.onCoresUpdate(this.collectedCores, this.totalCores);
        this.logConsole('info', `Энергоядро собрано! (${this.collectedCores}/${this.totalCores})`);
      }
    }
  }

  private updatePortal() {
    if (!this.portalMesh) return;

    // Check if portal is ready
    const isUnlocked = this.collectedCores >= this.totalCores;
    if (isUnlocked !== this.portalIsOpen) {
      this.portalIsOpen = isUnlocked;
      if (isUnlocked) {
        soundSystem.playPadActivated();
        this.spawnShockwave(this.portalPos, '#00f0ff', 5.0, 0.6);
        this.spawnVaporizeParticles(this.portalPos, '#38bdf8', 35);
        this.addCameraShake(0.35);
        this.logConsole('info', '✨ Варп-портал активирован! Пройдите в него для завершения уровня.');
      }
    }

    const t = this.levelTime;

    // 1. Dual Stargate Vortex Discs
    const vortex = this.portalMesh.getObjectByName('Vortex') as THREE.Mesh | undefined;
    const innerVortex = this.portalMesh.getObjectByName('InnerVortex') as THREE.Mesh | undefined;

    if (vortex && vortex.material) {
      vortex.rotation.z += (this.portalIsOpen ? 0.05 : 0.02);
      const vMat = vortex.material as THREE.MeshBasicMaterial;
      vMat.color.setHex(this.portalIsOpen ? 0x00f0ff : 0x6366f1);
      vMat.opacity = this.portalIsOpen ? 0.94 : 0.72;
    }
    if (innerVortex && innerVortex.material) {
      innerVortex.rotation.z -= (this.portalIsOpen ? 0.07 : 0.03);
      const ivMat = innerVortex.material as THREE.MeshBasicMaterial;
      ivMat.color.setHex(this.portalIsOpen ? 0xffffff : 0x4f46e5);
      ivMat.opacity = this.portalIsOpen ? 0.88 : 0.55;
    }

    // 2. Middle Counter-Rotating Dial Ring
    const dial = this.portalMesh.getObjectByName('MiddleDialRing');
    if (dial) {
      dial.rotation.z += (this.portalIsOpen ? 0.025 : 0.008);
    }

    // 3. Floating 3D Singularity Core
    const singularity = this.portalMesh.getObjectByName('SingularityCore');
    if (singularity) {
      singularity.rotation.x += 0.04;
      singularity.rotation.y += 0.06;
      const corePulse = 1.0 + Math.sin(t * (this.portalIsOpen ? 10 : 3.5)) * (this.portalIsOpen ? 0.22 : 0.1);
      singularity.scale.set(corePulse, corePulse, corePulse);
      const sMat = (singularity as THREE.Mesh).material as THREE.MeshBasicMaterial;
      sMat.color.setHex(this.portalIsOpen ? 0xffffff : 0xa5b4fc);
    }

    // 4. Accretion Ripples
    const acc1 = this.portalMesh.getObjectByName('AccretionRing1');
    const acc2 = this.portalMesh.getObjectByName('AccretionRing2');
    if (acc1) {
      acc1.rotation.z -= 0.035;
      const s = 1.0 + Math.sin(t * 4) * 0.12;
      acc1.scale.set(s, s, 1);
    }
    if (acc2) {
      acc2.rotation.z += 0.05;
      const s = 1.0 + Math.cos(t * 5) * 0.15;
      acc2.scale.set(s, s, 1);
    }

    // 5. 8 Chevrons - illuminated progressively by collected cores
    const activeChevrons = this.portalIsOpen
      ? 8
      : Math.floor((this.collectedCores / Math.max(1, this.totalCores)) * 8);

    for (let i = 0; i < 8; i++) {
      const crystal = this.portalMesh.getObjectByName(`ChevronCrystal_${i}`) as THREE.Mesh | undefined;
      if (crystal && crystal.material) {
        const mat = crystal.material as THREE.MeshBasicMaterial;
        if (this.portalIsOpen) {
          mat.color.setHex(0x00f0ff);
          mat.opacity = 0.95 + Math.sin(t * 12 + i) * 0.05;
        } else if (i < activeChevrons) {
          mat.color.setHex(0xfacc15); // amber power conduit
          mat.opacity = 0.9;
        } else {
          mat.color.setHex(0x334155); // dormant dark slate
          mat.opacity = 0.4;
        }
        crystal.rotation.x += 0.02;
        crystal.rotation.y += 0.03;
      }
    }

    // 6. Orbital Quantum Energy Motes
    const motesGroup = this.portalMesh.getObjectByName('OrbitalMotes');
    if (motesGroup) {
      motesGroup.rotation.z += (this.portalIsOpen ? 0.04 : 0.015);
      motesGroup.children.forEach((child, idx) => {
        const mote = child as THREE.Mesh;
        const ang = (idx * Math.PI * 2) / 24 + t * (this.portalIsOpen ? 2.5 : 1.0);
        const radius = 1.82 + Math.sin(t * 3 + idx) * 0.12;
        mote.position.x = Math.cos(ang) * radius;
        mote.position.y = Math.sin(ang) * radius;
        mote.position.z = Math.cos(t * 4 + idx) * 0.25;
      });
    }

    // 7. Celestial Light Beacon Shafts
    const beacon = this.portalMesh.getObjectByName('Beacon') as THREE.Mesh | undefined;
    const innerBeacon = this.portalMesh.getObjectByName('InnerBeacon') as THREE.Mesh | undefined;
    if (beacon && beacon.material) {
      (beacon.material as THREE.MeshBasicMaterial).opacity =
        this.portalIsOpen ? 0.28 + Math.sin(t * 4) * 0.1 : 0.06;
      (beacon.material as THREE.MeshBasicMaterial).color.setHex(
        this.portalIsOpen ? 0x00f0ff : 0x6366f1
      );
    }
    if (innerBeacon && innerBeacon.material) {
      (innerBeacon.material as THREE.MeshBasicMaterial).opacity =
        this.portalIsOpen ? 0.45 + Math.sin(t * 6) * 0.15 : 0.08;
    }

    // 8. Gate Dynamic Point Light
    const portalLight = this.portalMesh.getObjectByName('PortalLight') as THREE.PointLight | undefined;
    if (portalLight) {
      portalLight.intensity = this.portalIsOpen ? 5.0 + Math.sin(t * 8) * 0.8 : 1.5;
      portalLight.color.setHex(this.portalIsOpen ? 0x00f0ff : 0x6366f1);
    }

    // 9. Win condition: enter portal when unlocked
    if (this.portalIsOpen && this.playerPos.distanceTo(this.portalPos) < 2.2 && !this.isWon) {
      this.isWon = true;
      soundSystem.playVictory();
      this.addCameraShake(0.55);
      this.spawnShockwave(this.portalPos, '#00f0ff', 7.0, 0.85);
      this.spawnVaporizeParticles(this.portalPos, '#00f0ff', 60);
      this.logConsole('info', `Уровень завершен за ${this.levelTime.toFixed(1)}с!`);
      this.callbacks.onVictory(this.levelTime);
    }
  }

  private checkInteractPrompt() {
    if (this.carriedCubeId) {
      this.callbacks.onInteractPrompt('[E] Поставить аккуратно | [ЛКМ / F] Метнуть куб');
      return;
    }

    // Portal proximity check
    const distToPortal = this.playerPos.distanceTo(this.portalPos);
    if (distToPortal < 3.8) {
      if (this.portalIsOpen) {
        this.callbacks.onInteractPrompt('✨ ВАРП-ПОРТАЛ АКТИВЕН! ВОЙДИТЕ ДЛЯ ПЕРЕХОДА');
        return;
      } else {
        const remaining = this.totalCores - this.collectedCores;
        this.callbacks.onInteractPrompt(`🔒 ВАРП-ПОРТАЛ ЗАБЛОКИРОВАН: Соберите ещё ${remaining} ${remaining === 1 ? 'ядро' : remaining < 5 ? 'ядра' : 'ядер'}`);
        return;
      }
    }

    for (const c of this.cubes) {
      if (this.playerPos.distanceTo(c.pos) < 2.8) {
        this.callbacks.onInteractPrompt('[E / ЛКМ] Захватить Квантовый Куб');
        return;
      }
    }

    this.callbacks.onInteractPrompt(null);
  }

  private spawnVaporizeParticles(pos: THREE.Vector3, colorHex: string, count: number) {
    const geo = new THREE.SphereGeometry(0.08, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex) });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.position.x += (Math.random() - 0.5) * 0.4;
      mesh.position.y += Math.random() * 0.6;
      mesh.position.z += (Math.random() - 0.5) * 0.4;

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 4.5,
        Math.random() * 4.0 + 1.0,
        (Math.random() - 0.5) * 4.5
      );

      this.particlesGroup.add(mesh);
      this.activeParticles.push({
        mesh,
        vel,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      });
    }
  }

  private updateParticles(delta: number) {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life += delta;
      p.mesh.position.addScaledVector(p.vel, delta);
      p.vel.y -= 9.8 * delta;
      const progress = p.life / p.maxLife;
      p.mesh.scale.setScalar(Math.max(0.01, 1 - progress));

      if (p.life >= p.maxLife) {
        this.particlesGroup.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.activeParticles.splice(i, 1);
      }
    }
  }

  public spawnJetSpark(pos: THREE.Vector3, colorHex: string) {
    const geo = new THREE.SphereGeometry(0.06, 4, 4);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex) });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.15,
      pos.y + 0.12,
      pos.z + (Math.random() - 0.5) * 0.15
    );

    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.8,
      -Math.random() * 1.5 - 0.5,
      (Math.random() - 0.5) * 0.8
    );

    this.particlesGroup.add(mesh);
    this.activeParticles.push({
      mesh,
      vel,
      life: 0,
      maxLife: 0.35 + Math.random() * 0.2,
    });
  }

  public spawnFootstepDust(pos: THREE.Vector3, colorHex: string) {
    const count = 3;
    const geo = new THREE.SphereGeometry(0.08, 4, 4);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.65,
    });
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        pos.x + (Math.random() - 0.5) * 0.35,
        pos.y + 0.05,
        pos.z + (Math.random() - 0.5) * 0.35
      );
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        Math.random() * 0.5 + 0.1,
        (Math.random() - 0.5) * 0.8
      );
      this.particlesGroup.add(mesh);
      this.activeParticles.push({
        mesh,
        vel,
        life: 0,
        maxLife: 0.28 + Math.random() * 0.15,
      });
    }
  }

  public spawnDoubleJumpSpiral(pos: THREE.Vector3, colorHex: string) {
    const count = 16;
    const geo = new THREE.SphereGeometry(0.09, 4, 4);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex) });
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.7;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        pos.x + Math.cos(angle) * radius,
        pos.y + 0.15 + (i / count) * 0.5,
        pos.z + Math.sin(angle) * radius
      );
      const vel = new THREE.Vector3(
        Math.cos(angle) * 3.4,
        Math.random() * 2.5 + 2.0,
        Math.sin(angle) * 3.4
      );
      this.particlesGroup.add(mesh);
      this.activeParticles.push({
        mesh,
        vel,
        life: 0,
        maxLife: 0.45,
      });
    }
  }

  public spawnCubeTrail(pos: THREE.Vector3, colorHex: string) {
    const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.8,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.2,
      pos.y + (Math.random() - 0.5) * 0.2,
      pos.z + (Math.random() - 0.5) * 0.2
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 0.5 - 0.2,
      (Math.random() - 0.5) * 0.5
    );
    this.particlesGroup.add(mesh);
    this.activeParticles.push({
      mesh,
      vel,
      life: 0,
      maxLife: 0.35,
    });
  }

  public spawnLaserSparks(pos: THREE.Vector3, dir: THREE.Vector3, colorHex: string) {
    const count = 5;
    const geo = new THREE.SphereGeometry(0.06, 4, 4);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex) });
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      const vel = new THREE.Vector3(
        -dir.x * 2.5 + (Math.random() - 0.5) * 3.0,
        Math.random() * 3.5 + 1.2,
        -dir.z * 2.5 + (Math.random() - 0.5) * 3.0
      );
      this.particlesGroup.add(mesh);
      this.activeParticles.push({
        mesh,
        vel,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.2,
      });
    }
  }

  public addCameraShake(amount: number) {
    this.cameraShake = Math.min(1.0, this.cameraShake + amount);
  }

  public spawnShockwave(pos: THREE.Vector3, colorHex: string, maxRadius = 2.0, duration = 0.35, isVertical = false) {
    const geo = new THREE.RingGeometry(0.12, 0.32, 32);
    if (!isVertical) {
      geo.rotateX(-Math.PI / 2);
    }
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    if (!isVertical) mesh.position.y += 0.05;

    this.shockwavesGroup.add(mesh);
    this.activeShockwaves.push({
      mesh,
      maxRadius,
      life: 0,
      duration,
    });
  }

  private updateShockwaves(delta: number) {
    for (let i = this.activeShockwaves.length - 1; i >= 0; i--) {
      const sw = this.activeShockwaves[i];
      sw.life += delta;
      const progress = sw.life / sw.duration;
      const currentScale = 1 + progress * (sw.maxRadius / 0.32);
      sw.mesh.scale.set(currentScale, currentScale, currentScale);

      const mat = sw.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.95 * (1 - progress));

      if (sw.life >= sw.duration) {
        this.shockwavesGroup.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        mat.dispose();
        this.activeShockwaves.splice(i, 1);
      }
    }
  }

  private updateCamera(delta: number) {
    // Dynamic sprint FOV widening
    const targetFov = this.isSprinting ? 63 : 55;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 8, delta);
      this.camera.updateProjectionMatrix();
    }

    if (this.viewPerspective === 'top') {
      const targetPos = _v1.copy(this.playerPos).add(new THREE.Vector3(0, 18, 0.1));
      this.camera.position.lerp(targetPos, 10 * delta);
      this.camera.lookAt(this.playerPos.x, this.playerPos.y, this.playerPos.z);
      return;
    }

    // Third-person spherical orbit around player
    const targetH = this.cameraAngleH;
    const targetV = this.cameraAngleV;
    let dist = this.cameraDistance;

    // Shoulder offset for close view
    let shoulderOffset = 0;
    let heightOffset = 1.2;
    if (this.viewPerspective === 'close') {
      dist = Math.min(this.cameraDistance, 3.8);
      shoulderOffset = 0.65;
      heightOffset = 1.35;
    }

    const rightX = Math.cos(targetH);
    const rightZ = -Math.sin(targetH);

    const offsetX = Math.sin(targetH) * Math.cos(targetV) * dist + rightX * shoulderOffset;
    const offsetY = Math.sin(targetV) * dist + heightOffset;
    const offsetZ = Math.cos(targetH) * Math.cos(targetV) * dist + rightZ * shoulderOffset;

    const desiredCamPos = _v1.set(
      this.playerPos.x + offsetX,
      this.playerPos.y + offsetY,
      this.playerPos.z + offsetZ
    );

    // Smooth exponential damping
    this.camera.position.lerp(desiredCamPos, 14 * delta);

    // Apply dynamic camera shake
    if (this.cameraShake > 0) {
      this.cameraShake = Math.max(0, this.cameraShake - delta * 3.5);
      const shakeX = (Math.random() - 0.5) * this.cameraShake * 0.4;
      const shakeY = (Math.random() - 0.5) * this.cameraShake * 0.4;
      const shakeZ = (Math.random() - 0.5) * this.cameraShake * 0.4;
      this.camera.position.x += shakeX;
      this.camera.position.y += shakeY;
      this.camera.position.z += shakeZ;
    }

    // Look slightly above player center
    const lookTarget = _v2.set(
      this.playerPos.x + rightX * (shoulderOffset * 0.4),
      this.playerPos.y + (this.viewPerspective === 'close' ? 1.05 : 0.85),
      this.playerPos.z + rightZ * (shoulderOffset * 0.4)
    );
    this.camera.lookAt(lookTarget);
  }

  private logConsole(type: 'info' | 'warning' | 'error', message: string) {
    const time = new Date().toLocaleTimeString('ru-RU', { hour12: false });
    this.callbacks.onConsoleLog({
      id: Math.random().toString(36).substring(2, 9),
      type,
      time,
      message,
    });
  }

  public updateGameObjectList() {
    const list: UnityGameObject[] = [
      {
        id: 'Player_Robot',
        name: 'Player_Robot',
        tag: 'Player',
        type: 'player',
        position: [this.playerPos.x, this.playerPos.y, this.playerPos.z],
        rotation: [0, this.characterRig.root.rotation.y, 0],
        scale: [1, 1, 1],
        isStatic: false,
        hasRigidbody: true,
        mass: 75,
      },
    ];

    for (const c of this.cubes) {
      list.push({
        id: c.id,
        name: `QuantumCube_${c.id}`,
        tag: 'Interactable',
        type: 'cube',
        position: [c.pos.x, c.pos.y, c.pos.z],
        rotation: [0, 0, 0],
        scale: [c.size[0], c.size[1], c.size[2]],
        isStatic: false,
        hasRigidbody: true,
        mass: 30,
      });
    }

    for (const p of this.pressurePads) {
      list.push({
        id: p.id,
        name: `PressurePad_${p.id}`,
        tag: 'Trigger',
        type: 'pressure_pad',
        position: [p.pos.x, p.pos.y, p.pos.z],
        rotation: [0, 0, 0],
        scale: [p.size[0], p.size[1], p.size[2]],
        isStatic: true,
        hasRigidbody: false,
        isTrigger: true,
      });
    }

    for (const b of this.barriers) {
      list.push({
        id: b.id,
        name: `EnergyBarrier_${b.id}`,
        tag: 'Obstacle',
        type: 'barrier',
        position: [b.basePos.x, b.basePos.y, b.basePos.z],
        rotation: [0, 0, 0],
        scale: [b.size[0], b.size[1], b.size[2]],
        isStatic: true,
        hasRigidbody: false,
      });
    }

    for (const mp of this.movingPlatforms) {
      list.push({
        id: mp.id,
        name: `MovingPlatform_${mp.id}`,
        tag: 'Platform',
        type: 'moving_platform',
        position: [mp.mesh.position.x, mp.mesh.position.y, mp.mesh.position.z],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        isStatic: false,
        hasRigidbody: true,
      });
    }

    for (const l of this.lasers) {
      list.push({
        id: l.id,
        name: `LaserEmitter_${l.id}`,
        tag: 'Hazard',
        type: 'laser',
        position: [l.start.x, l.start.y, l.start.z],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        isStatic: !l.moving,
        hasRigidbody: false,
      });
    }

    for (const jp of this.jumpPads) {
      list.push({
        id: jp.id,
        name: `JumpPad_${jp.id}`,
        tag: 'Trigger',
        type: 'jumppad',
        position: [jp.pos.x, jp.pos.y, jp.pos.z],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        isStatic: true,
        hasRigidbody: false,
        isTrigger: true,
      });
    }

    this.callbacks.onGameObjectList(list);
  }

  public updatePlayerConfig(newConfig: Partial<PlayerConfig>) {
    Object.assign(this.playerConfig, newConfig);
    if (newConfig.color) {
      this.characterRig.primaryMaterial.color.set(newConfig.color);
    }
    if (newConfig.glowColor) {
      this.characterRig.glowMaterial.color.set(newConfig.glowColor);
    }
    if (newConfig.characterSkin) {
      this.setPlayerSkin(newConfig.characterSkin);
    }
    if (newConfig.slowMotion !== undefined) {
      soundSystem.playSlowMo(newConfig.slowMotion);
    }
    this.logConsole('info', 'Конфигурация PlayerController обновлена в инспекторе');
  }

  public toggleSlowMotion() {
    this.playerConfig.slowMotion = !this.playerConfig.slowMotion;
    soundSystem.playSlowMo(this.playerConfig.slowMotion);
    this.callbacks.onConfigChange?.(this.playerConfig);
    this.logConsole('info', this.playerConfig.slowMotion ? '⚡ Режим Слоу-мо (0.3x) включен' : '⚡ Обычная скорость времени');
  }

  public setSlowMotion(active: boolean) {
    if (this.playerConfig.slowMotion !== active) {
      this.playerConfig.slowMotion = active;
      soundSystem.playSlowMo(active);
      this.callbacks.onConfigChange?.(this.playerConfig);
    }
  }

  public toggleCharacterSkin() {
    this.playerConfig.characterSkin = 'robot';
    this.characterRig.root.visible = true;
  }

  public setPlayerSkin(_skin: 'humanoid' | 'robot') {
    this.playerConfig.characterSkin = 'robot';
    this.characterRig.root.visible = true;
    this.callbacks.onConfigChange?.(this.playerConfig);
  }

  public dispose() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }
}
