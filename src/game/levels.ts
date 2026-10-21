import { LevelDefinition, BiomeType, PlatformDef, MovingPlatformDef, CubeDef, PressurePadDef, BarrierDef, LaserDef, JumpPadDef, EnergyCoreDef } from '../types/game';

export interface WorldInfo {
  worldId: number;
  biome: BiomeType;
  name: string;
  theme: string;
  levelRange: [number, number];
  color: string;
  accent: string;
}

export const WORLDS_INFO: WorldInfo[] = [
  { worldId: 1, biome: 'sakura', name: 'Сакура Дзен', theme: 'Медитативный сад и основы квантовой гравитации', levelRange: [1, 6], color: '#f43f5e', accent: '#fda4af' },
  { worldId: 2, biome: 'spring', name: 'Весенний Луг', theme: 'Свежие ветра, парящие лифты и цветущие долины', levelRange: [7, 12], color: '#10b981', accent: '#6ee7b7' },
  { worldId: 3, biome: 'summer', name: 'Лазурное Лето', theme: 'Ослепительное солнце, рифы и скоростной паркур', levelRange: [13, 18], color: '#0ea5e9', accent: '#7dd3fc' },
  { worldId: 4, biome: 'autumn', name: 'Осенний Закат', theme: 'Багряный листопад, синхронные платформы и туман', levelRange: [19, 24], color: '#f97316', accent: '#fdba74' },
  { worldId: 5, biome: 'winter', name: 'Ледяной Пик', theme: 'Полярное сияние, кристальный иней и метели', levelRange: [25, 30], color: '#38bdf8', accent: '#bae6fd' },
  { worldId: 6, biome: 'neon', name: 'Кибер Неон', theme: 'Синтвейв шоссе, лазерные сетки и матричные мосты', levelRange: [31, 36], color: '#06b6d4', accent: '#f43f5e' },
  { worldId: 7, biome: 'crystal', name: 'Аметистовая Призма', theme: 'Геоды, преломление лучей и парящие кварцы', levelRange: [37, 42], color: '#c084fc', accent: '#e879f9' },
  { worldId: 8, biome: 'volcanic', name: 'Вулканический Горн', theme: 'Лавовые разломы, базальт и огненные наковальни', levelRange: [43, 48], color: '#ef4444', accent: '#f59e0b' },
  { worldId: 9, biome: 'celestial', name: 'Космическая Орбита', theme: 'Звездные врата, гипер-прыжки и нуль-гравитация', levelRange: [49, 54], color: '#6366f1', accent: '#a855f7' },
  { worldId: 10, biome: 'desert', name: 'Золотые Дюны', theme: 'Древние обелиски, оазисы и Великий Апекс Вселенной', levelRange: [55, 60], color: '#eab308', accent: '#fde047' },
];

/**
 * Procedural generator for 60 diverse, exciting levels across the 10 worlds
 */
function generate60Levels(): LevelDefinition[] {
  const levels: LevelDefinition[] = [];

  WORLDS_INFO.forEach((world) => {
    const [startLvl, endLvl] = world.levelRange;

    for (let lvlNum = startLvl; lvlNum <= endLvl; lvlNum++) {
      const stageInWorld = lvlNum - startLvl + 1; // 1 to 6
      const isBossStage = stageInWorld === 6;

      // Platform styles
      const platformColor =
        world.biome === 'sakura' ? '#26182f' :
        world.biome === 'spring' ? '#132822' :
        world.biome === 'summer' ? '#0f2942' :
        world.biome === 'autumn' ? '#2c1810' :
        world.biome === 'winter' ? '#0f2742' :
        world.biome === 'neon' ? '#0a0f1d' :
        world.biome === 'crystal' ? '#1f132e' :
        world.biome === 'volcanic' ? '#210d0d' :
        world.biome === 'celestial' ? '#0b112c' : '#2d1f11';

      const accentColor = world.color;

      // Dynamic stage titles
      let titleName = '';
      let subtitle = '';
      let hint = '';

      if (stageInWorld === 1) {
        titleName = `Пролог: ${world.name}`;
        subtitle = `Первые шаги в стихии [${world.name}]`;
        hint = `Пройдите по платформам и активируйте портал.`;
      } else if (stageInWorld === 2) {
        titleName = `Путь ветра: Ступени`;
        subtitle = `Разминка на парящих островах`;
        hint = `Точно рассчитывайте дистанцию прыжка! Удерживайте [Shift] для спринта.`;
      } else if (stageInWorld === 3) {
        titleName = `Динамика лифтов`;
        subtitle = `Синхронное перемещение над бездной`;
        hint = `Дождитесь подвижную платформу и запрыгните на неё.`;
      } else if (stageInWorld === 4) {
        titleName = `Квантовый ключ и барьер`;
        subtitle = `Головоломка с кубом и сенсорной плитой`;
        hint = `Нажмите [E], чтобы взять куб, перенесите его на нажимную плиту, чтобы снять барьер!`;
      } else if (stageInWorld === 5) {
        titleName = `Высотный трамплин`;
        subtitle = `Катапульта сквозь лазерную завесу`;
        hint = `Встаньте на джамп-пад, чтобы взлететь высоко в воздух над опасностью!`;
      } else {
        titleName = `👑 Кульминация: Врата ${world.name}`;
        subtitle = `Испытание мастера мира ${world.worldId}`;
        hint = `Используйте всё мастерство: лифты, джамп-пады, кубы и ловкость против лазеров!`;
      }

      // Build level geometry
      const platforms: PlatformDef[] = [];
      const movingPlatforms: MovingPlatformDef[] = [];
      const cubes: CubeDef[] = [];
      const pressurePads: PressurePadDef[] = [];
      const barriers: BarrierDef[] = [];
      const lasers: LaserDef[] = [];
      const jumpPads: JumpPadDef[] = [];
      const cores: EnergyCoreDef[] = [];

      // Starting platform
      platforms.push({
        id: `w${world.worldId}_l${lvlNum}_p0`,
        position: [0, 0, 0],
        size: [8, 1, 8],
        color: platformColor,
      });

      // Layout variations depending on stage
      let currentZ = 0;
      let currentY = 0;
      let currentX = 0;

      // Difficulty scaling factor based on world (0 to 1)
      const worldScale = (world.worldId - 1) / 9;
      const speedScale = 1.0 + worldScale * 0.7; // speeds up to 1.7x in later worlds
      const platSizeScale = Math.max(0.75, 1.0 - worldScale * 0.2); // platforms slightly more precise

      // Stage-specific mechanics:
      if (stageInWorld === 1) {
        // Linear stepping stones
        for (let s = 1; s <= 4; s++) {
          currentZ += 7.5;
          currentY += 0.5;
          platforms.push({
            id: `w${world.worldId}_l${lvlNum}_step_${s}`,
            position: [currentX + (s % 2 === 0 ? 1.5 : -1.5), currentY, currentZ],
            size: [5 * platSizeScale, 1, 5 * platSizeScale],
            color: platformColor,
          });
          cores.push({
            id: `w${world.worldId}_l${lvlNum}_c_${s}`,
            position: [currentX + (s % 2 === 0 ? 1.5 : -1.5), currentY + 1.8, currentZ],
          });
        }
        currentZ += 9;
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_exit`,
          position: [0, currentY + 0.5, currentZ],
          size: [8, 1, 8],
          color: platformColor,
        });
      } else if (stageInWorld === 2) {
        // Zigzag jumps + moving platform + laser hazard in worlds 2+
        for (let s = 1; s <= 3; s++) {
          currentZ += 8.2;
          currentX = (s % 2 === 1 ? -4.2 : 4.2);
          currentY += 0.9;
          platforms.push({
            id: `w${world.worldId}_l${lvlNum}_zig_${s}`,
            position: [currentX, currentY, currentZ],
            size: [4.2 * platSizeScale, 1, 4.2 * platSizeScale],
            color: platformColor,
          });
          cores.push({
            id: `w${world.worldId}_l${lvlNum}_c_${s}`,
            position: [currentX, currentY + 1.8, currentZ],
          });
        }
        // Moving platform to cross center
        movingPlatforms.push({
          id: `w${world.worldId}_l${lvlNum}_mp_1`,
          position: [-3.5, currentY + 0.5, currentZ + 7],
          endPosition: [3.5, currentY + 1.5, currentZ + 7],
          size: [3.4 * platSizeScale, 0.6, 3.4 * platSizeScale],
          speed: 2.3 * speedScale,
          axis: 'x',
          color: accentColor,
        });

        // Laser obstacle over the moving platform gap in worlds 3+
        if (world.worldId >= 3) {
          lasers.push({
            id: `w${world.worldId}_l${lvlNum}_lz_zig`,
            start: [-7, currentY + 1.9, currentZ + 7],
            direction: [1, 0, 0],
            length: 14,
            moving: world.worldId >= 6,
            moveRange: 2.5,
            moveSpeed: 2.0,
            moveAxis: 'z',
          });
        }

        currentZ += 14;
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_exit`,
          position: [0, currentY + 1.8, currentZ],
          size: [7, 1, 7],
          color: platformColor,
        });
        cores.push({
          id: `w${world.worldId}_l${lvlNum}_c_exit`,
          position: [0, currentY + 3.2, currentZ],
        });
      } else if (stageInWorld === 3) {
        // Elevator moving platforms sequence with cross-laser timing
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_mid1`,
          position: [0, 1.0, 10],
          size: [6 * platSizeScale, 1, 6 * platSizeScale],
          color: platformColor,
        });
        movingPlatforms.push({
          id: `w${world.worldId}_l${lvlNum}_mp_1`,
          position: [0, 1.2, 17],
          endPosition: [0, 4.8, 24],
          size: [3.2 * platSizeScale, 0.6, 3.2 * platSizeScale],
          speed: 2.5 * speedScale,
          axis: 'y',
          color: accentColor,
        });
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_mid2`,
          position: [0, 5.0, 31],
          size: [5.5 * platSizeScale, 1, 5.5 * platSizeScale],
          color: platformColor,
        });
        movingPlatforms.push({
          id: `w${world.worldId}_l${lvlNum}_mp_2`,
          position: [-4.5, 5.5, 39],
          endPosition: [4.5, 5.5, 39],
          size: [3.2 * platSizeScale, 0.6, 3.2 * platSizeScale],
          speed: 2.8 * speedScale,
          axis: 'x',
          color: accentColor,
        });

        // Patrolling laser beam over mid platform in worlds 2+
        if (world.worldId >= 2) {
          lasers.push({
            id: `w${world.worldId}_l${lvlNum}_lz_elev`,
            start: [-7, 6.4, 31],
            direction: [1, 0, 0],
            length: 14,
            moving: true,
            moveRange: 2.2,
            moveSpeed: 2.2 * speedScale,
            moveAxis: 'z',
          });
        }

        currentZ = 48;
        currentY = 6.2;
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_exit`,
          position: [0, currentY, currentZ],
          size: [8, 1, 8],
          color: platformColor,
        });
        cores.push(
          { id: `w${world.worldId}_l${lvlNum}_c1`, position: [0, 2.5, 10] },
          { id: `w${world.worldId}_l${lvlNum}_c2`, position: [0, 6.5, 31] },
          { id: `w${world.worldId}_l${lvlNum}_c3`, position: [0, 7.6, currentZ] }
        );
      } else if (stageInWorld === 4) {
        // Puzzle: Cube + Pressure Pad + Barrier + Patrolling Laser
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_island_puzzle`,
          position: [0, 1.5, 14],
          size: [12, 1, 12],
          color: platformColor,
        });
        cubes.push({
          id: `w${world.worldId}_l${lvlNum}_cube_1`,
          position: [3.8, 2.8, 14],
          size: [1.3, 1.3, 1.3],
          color: accentColor,
        });
        pressurePads.push({
          id: `w${world.worldId}_l${lvlNum}_pad_1`,
          position: [-3.8, 2.05, 14],
          size: [2.5, 0.2, 2.5],
          targetBarrierId: `w${world.worldId}_l${lvlNum}_bar_1`,
          color: accentColor,
        });
        barriers.push({
          id: `w${world.worldId}_l${lvlNum}_bar_1`,
          position: [0, 3.8, 20.5],
          size: [8, 4, 0.6],
          color: accentColor,
        });

        // Laser hazard across puzzle room - blocking with cube required!
        lasers.push({
          id: `w${world.worldId}_l${lvlNum}_lz_1`,
          start: [-7, 2.7, 14],
          direction: [1, 0, 0],
          length: 14,
          moving: true,
          moveRange: 3.2,
          moveSpeed: 2.0 * speedScale,
          moveAxis: 'z',
        });

        // Second laser in higher worlds
        if (world.worldId >= 5) {
          lasers.push({
            id: `w${world.worldId}_l${lvlNum}_lz_2`,
            start: [-7, 2.8, 8],
            direction: [1, 0, 0],
            length: 14,
            moving: false,
          });
        }

        currentZ = 29;
        currentY = 2.0;
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_exit`,
          position: [0, currentY, currentZ],
          size: [8, 1, 8],
          color: platformColor,
        });
        cores.push(
          { id: `w${world.worldId}_l${lvlNum}_c1`, position: [0, 3.2, 14] },
          { id: `w${world.worldId}_l${lvlNum}_c2`, position: [0, 3.8, currentZ] }
        );
      } else if (stageInWorld === 5) {
        // Jump Pad across huge void + moving mid-air laser scanner
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_pad_isle`,
          position: [0, 1.0, 10],
          size: [7 * platSizeScale, 1, 7 * platSizeScale],
          color: platformColor,
        });
        jumpPads.push({
          id: `w${world.worldId}_l${lvlNum}_jp_1`,
          position: [0, 1.55, 11],
          strength: 19.0,
        });
        // Dynamic moving laser scanner in the mid-air gorge
        lasers.push({
          id: `w${world.worldId}_l${lvlNum}_lz_dyn`,
          start: [-8, 6.0, 22],
          direction: [1, 0, 0],
          length: 16,
          moving: true,
          moveRange: 4.8,
          moveSpeed: 2.8 * speedScale,
          moveAxis: 'z',
        });

        // In worlds 5+, moving platform at the landing zone
        if (world.worldId >= 5) {
          movingPlatforms.push({
            id: `w${world.worldId}_l${lvlNum}_mp_midair`,
            position: [-3.5, 7.8, 25],
            endPosition: [3.5, 7.8, 25],
            size: [3.2 * platSizeScale, 0.6, 3.2 * platSizeScale],
            speed: 2.6 * speedScale,
            axis: 'x',
            color: accentColor,
          });
        }

        currentZ = 34;
        currentY = 8.5;
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_exit`,
          position: [0, currentY, currentZ],
          size: [8 * platSizeScale, 1, 8 * platSizeScale],
          color: platformColor,
        });
        cores.push(
          { id: `w${world.worldId}_l${lvlNum}_c1`, position: [0, 2.8, 10] },
          { id: `w${world.worldId}_l${lvlNum}_c2`, position: [0, 9.2, 22] },
          { id: `w${world.worldId}_l${lvlNum}_c3`, position: [0, 10.5, currentZ] }
        );
      } else {
        // BOSS APEX STAGE: High intensity multi-hazard gauntlet
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_p1`,
          position: [0, 1.2, 12],
          size: [8 * platSizeScale, 1, 8 * platSizeScale],
          color: platformColor,
        });
        movingPlatforms.push({
          id: `w${world.worldId}_l${lvlNum}_mp_1`,
          position: [-5, 2.0, 20],
          endPosition: [5, 3.8, 20],
          size: [3.2 * platSizeScale, 0.6, 3.2 * platSizeScale],
          speed: 3.0 * speedScale,
          axis: 'x',
          color: accentColor,
        });
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_courtyard`,
          position: [0, 4.0, 31],
          size: [13, 1, 13],
          color: platformColor,
        });

        // Puzzle cube & barrier
        cubes.push({
          id: `w${world.worldId}_l${lvlNum}_boss_cube`,
          position: [3.8, 5.2, 31],
          size: [1.4, 1.4, 1.4],
          color: accentColor,
        });
        pressurePads.push({
          id: `w${world.worldId}_l${lvlNum}_boss_pad`,
          position: [-3.8, 4.55, 31],
          size: [2.6, 0.2, 2.6],
          targetBarrierId: `w${world.worldId}_l${lvlNum}_boss_bar`,
          color: accentColor,
        });
        jumpPads.push({
          id: `w${world.worldId}_l${lvlNum}_boss_jp`,
          position: [0, 4.55, 34],
          strength: 21.0,
        });
        barriers.push({
          id: `w${world.worldId}_l${lvlNum}_boss_bar`,
          position: [0, 10.5, 45],
          size: [7, 4.5, 0.6],
          color: accentColor,
        });

        // Dual Boss Lasers
        lasers.push({
          id: `w${world.worldId}_l${lvlNum}_boss_lz1`,
          start: [-8, 5.8, 31],
          direction: [1, 0, 0],
          length: 16,
          moving: true,
          moveRange: 3.8,
          moveSpeed: 3.2 * speedScale,
          moveAxis: 'z',
        });

        lasers.push({
          id: `w${world.worldId}_l${lvlNum}_boss_lz2`,
          start: [-7, 9.8, 41],
          direction: [1, 0, 0],
          length: 14,
          moving: true,
          moveRange: 2.5,
          moveSpeed: 2.6 * speedScale,
          moveAxis: 'x',
        });

        // Second moving platform in boss stages
        movingPlatforms.push({
          id: `w${world.worldId}_l${lvlNum}_mp_boss`,
          position: [-4, 7.8, 39],
          endPosition: [4, 7.8, 39],
          size: [3.2 * platSizeScale, 0.6, 3.2 * platSizeScale],
          speed: 3.2 * speedScale,
          axis: 'x',
          color: accentColor,
        });

        currentZ = 51;
        currentY = 10.2;
        platforms.push({
          id: `w${world.worldId}_l${lvlNum}_exit`,
          position: [0, currentY, currentZ],
          size: [10, 1, 10],
          color: platformColor,
        });
        cores.push(
          { id: `w${world.worldId}_l${lvlNum}_c1`, position: [0, 2.8, 12] },
          { id: `w${world.worldId}_l${lvlNum}_c2`, position: [0, 4.8, 20] },
          { id: `w${world.worldId}_l${lvlNum}_c3`, position: [3.8, 6.0, 31] },
          { id: `w${world.worldId}_l${lvlNum}_c4`, position: [0, 9.8, 39] },
          { id: `w${world.worldId}_l${lvlNum}_c5`, position: [0, 11.8, currentZ] }
        );
      }

      // Final level 60 special touch
      if (lvlNum === 60) {
        titleName = '👑 Уровень 60: ВЕЛИКИЙ АПЕКС МИРОЗДАНИЯ';
        subtitle = 'Грандиозный триумф всех 10 измерений!';
        hint = 'Финальное абсолютное испытание! Пройдите через все испытания десяти миров и станьте Мастером Вселенной!';
      }

      const targetCores = cores.length;
      const targetTimeSeconds = Math.max(30, 25 + stageInWorld * 12);

      levels.push({
        id: lvlNum,
        title: `Уровень ${lvlNum}: ${titleName}`,
        subtitle,
        description: `${world.theme}. Уровень ${stageInWorld} из 6 в мире [${world.name}]. Соберите все ${targetCores} квантовых ядер и активируйте финальный портал!`,
        hint,
        biome: world.biome,
        spawnPoint: [0, 1.5, 0],
        targetCoresCount: targetCores,
        targetTimeSeconds,
        platforms,
        movingPlatforms,
        cubes,
        pressurePads,
        barriers,
        lasers,
        jumpPads,
        cores,
        portal: { position: [0, currentY + 1.8, currentZ + 1.5] },
      });
    }
  });

  return levels;
}

export const LEVELS: LevelDefinition[] = generate60Levels();
