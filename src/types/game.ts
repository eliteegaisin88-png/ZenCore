export type GameStatus = 'playing' | 'paused' | 'victory' | 'gameover';

export type ViewMode = 'game' | 'editor';

export interface PlayerConfig {
  moveSpeed: number;
  sprintSpeed: number;
  jumpForce: number;
  gravity: number;
  doubleJump: boolean;
  color: string;
  glowColor: string;
  invulnerable: boolean;
  mouseSensitivity: number;
  invertY: boolean;
  characterSkin: 'humanoid' | 'robot';
  slowMotion: boolean;
  particleQuality: 'epic' | 'standard';
  speedLines: boolean;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlatformDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  type?: 'standard' | 'glass' | 'metal' | 'danger' | 'ice';
  friction?: number;
}

export interface MovingPlatformDef extends PlatformDef {
  endPosition: [number, number, number];
  speed: number;
  axis?: 'x' | 'y' | 'z';
  pauseTime?: number;
}

export interface CubeDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  weight?: number;
}

export interface PressurePadDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  targetBarrierId: string;
  requiredWeight?: number;
  color?: string;
}

export interface BarrierDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  initiallyOpen?: boolean;
}

export interface LaserDef {
  id: string;
  start: [number, number, number];
  direction: [number, number, number];
  length: number;
  moving?: boolean;
  moveRange?: number;
  moveSpeed?: number;
  moveAxis?: 'x' | 'z';
}

export interface JumpPadDef {
  id: string;
  position: [number, number, number];
  strength: number;
}

export interface CoreDef {
  id: string;
  position: [number, number, number];
}
export type EnergyCoreDef = CoreDef;

export interface PortalDef {
  position: [number, number, number];
}

export type BiomeType =
  | 'sakura'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'neon'
  | 'crystal'
  | 'volcanic'
  | 'celestial'
  | 'desert';

export interface LevelDefinition {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  hint: string;
  biome?: BiomeType;
  spawnPoint: [number, number, number];
  targetCoresCount: number;
  platforms: PlatformDef[];
  movingPlatforms: MovingPlatformDef[];
  cubes: CubeDef[];
  pressurePads: PressurePadDef[];
  barriers: BarrierDef[];
  lasers: LaserDef[];
  jumpPads: JumpPadDef[];
  cores: CoreDef[];
  portal: PortalDef;
  targetTimeSeconds: number;
}

export interface UnityGameObject {
  id: string;
  name: string;
  tag: string;
  type: 'player' | 'cube' | 'platform' | 'moving_platform' | 'pressure_pad' | 'barrier' | 'laser' | 'core' | 'portal' | 'jumppad' | 'light';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isStatic: boolean;
  hasRigidbody: boolean;
  mass?: number;
  isTrigger?: boolean;
}

export interface ConsoleLogItem {
  id: string;
  type: 'info' | 'warning' | 'error';
  time: string;
  message: string;
}
