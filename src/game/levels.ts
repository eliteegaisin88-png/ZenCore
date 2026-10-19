import { LevelDefinition } from '../types/game';

export const LEVELS: LevelDefinition[] = [
  // -------------------------------------------------------------
  // LEVEL 1: SAKURA BIOME (🌸 Сакура)
  // -------------------------------------------------------------
  {
    id: 1,
    title: 'Уровень 1: 🌸 Сакура — Цветение Дзен',
    subtitle: 'Медитативный сад и основы квантовых кубов',
    description: 'Добро пожаловать в небесный сад цветущей сакуры. Изучите основы паркура: прыгайте по каменным островкам, поднимите Квантовый Куб на [E] и положите его на сенсорную плиту у врат Тории.',
    hint: 'Нажмите [E], чтобы взять куб, перенесите его на розовую плиту, чтобы отключить энергобарьер!',
    biome: 'sakura',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 2,
    targetTimeSeconds: 45,
    platforms: [
      // Starting pagoda platform
      { id: 's1_start', position: [0, 0, 0], size: [8, 1, 8], color: '#26182f' },
      // Stepping stones over pink mist
      { id: 's1_step1', position: [0, 0.8, 8], size: [4.5, 1, 4.5], color: '#3b2046' },
      { id: 's1_step2', position: [0, 1.5, 15], size: [4.5, 1, 4.5], color: '#3b2046' },
      // Puzzle courtyard
      { id: 's1_court', position: [0, 2.0, 24], size: [11, 1, 11], color: '#26182f' },
      // Exit shrine
      { id: 's1_exit', position: [0, 2.2, 36], size: [7, 1, 7], color: '#180e20' }
    ],
    movingPlatforms: [],
    cubes: [
      { id: 's1_cube_1', position: [2.5, 3.2, 24], size: [1.2, 1.2, 1.2], color: '#fb7185' }
    ],
    pressurePads: [
      { id: 's1_pad_1', position: [-2.5, 2.55, 24], size: [2.4, 0.2, 2.4], targetBarrierId: 's1_bar_1', color: '#f43f5e' }
    ],
    barriers: [
      { id: 's1_bar_1', position: [0, 3.8, 30], size: [7, 3.5, 0.5], color: '#f43f5e' }
    ],
    lasers: [],
    jumpPads: [],
    cores: [
      { id: 's1_core_1', position: [0, 3.2, 15] },
      { id: 's1_core_2', position: [0, 3.8, 33] }
    ],
    portal: { position: [0, 3.6, 37] }
  },

  // -------------------------------------------------------------
  // LEVEL 2: SPRING BIOME (🌿 Весна)
  // -------------------------------------------------------------
  {
    id: 2,
    title: 'Уровень 2: 🌿 Весна — Изумрудное Пробуждение',
    subtitle: 'Парящие лифты и свежие утренние ветра',
    description: 'Весеннее пробуждение кибер-островов. Используйте подвижные платформы-лифты, чтобы преодолеть изумрудные пропасти, и соберите ядра энергии среди цветущих трав.',
    hint: 'Дождитесь приближения лифта, прыгайте на него и перемещайтесь через пропасти!',
    biome: 'spring',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 3,
    targetTimeSeconds: 60,
    platforms: [
      { id: 'sp2_start', position: [0, 0, 0], size: [7, 1, 7], color: '#132822' },
      { id: 'sp2_mid1', position: [0, 0.8, 12], size: [6, 1, 6], color: '#1b3f36' },
      { id: 'sp2_bridge', position: [0, 1.8, 23], size: [5, 1, 9], color: '#132822' },
      { id: 'sp2_exit', position: [0, 2.8, 41], size: [8, 1, 8], color: '#091c17' }
    ],
    movingPlatforms: [
      {
        id: 'sp2_mp_1',
        position: [0, 0.4, 6],
        endPosition: [0, 0.6, 9.5],
        size: [3.5, 0.6, 3],
        speed: 2.2,
        axis: 'z',
        color: '#10b981'
      },
      {
        id: 'sp2_mp_2',
        position: [0, 1.8, 30],
        endPosition: [0, 2.6, 37],
        size: [3.5, 0.6, 3],
        speed: 2.6,
        axis: 'z',
        color: '#10b981'
      }
    ],
    cubes: [
      { id: 'sp2_cube_1', position: [1.2, 1.8, 12], size: [1.3, 1.3, 1.3], color: '#34d399' }
    ],
    pressurePads: [
      { id: 'sp2_pad_1', position: [0, 2.35, 25], size: [2.2, 0.2, 2.2], targetBarrierId: 'sp2_bar_1', color: '#10b981' }
    ],
    barriers: [
      { id: 'sp2_bar_1', position: [0, 3.5, 27.5], size: [5, 3, 0.5], color: '#10b981' }
    ],
    lasers: [
      {
        id: 'sp2_laser_1',
        start: [-6, 2.6, 20],
        direction: [1, 0, 0],
        length: 12,
        moving: false
      }
    ],
    jumpPads: [],
    cores: [
      { id: 'sp2_c1', position: [0, 2.2, 6] },
      { id: 'sp2_c2', position: [-2, 3.2, 23] },
      { id: 'sp2_c3', position: [0, 4.2, 35] }
    ],
    portal: { position: [0, 4.2, 42] }
  },

  // -------------------------------------------------------------
  // LEVEL 3: SUMMER BIOME (☀️ Лето)
  // -------------------------------------------------------------
  {
    id: 3,
    title: 'Уровень 3: ☀️ Лето — Солнечный Каньон',
    subtitle: 'Кинетические Джамп-пады и солнечный зенит',
    description: 'Жаркий летний каньон с высокой гравитационной активностью. Наступайте на золотистые джамп-пады, чтобы взмывать ввысь на парящие цитадели под лучами полуденного солнца!',
    hint: 'Наступите на зелено-золотой джамп-пад, чтобы взлететь высоко к парящему плато!',
    biome: 'summer',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 3,
    targetTimeSeconds: 60,
    platforms: [
      { id: 'sm3_p0', position: [0, 0, 0], size: [7, 1, 7], color: '#182b3d' },
      { id: 'sm3_p1', position: [0, 0.5, 11], size: [6, 1, 6], color: '#182b3d' },
      // High solar plateau
      { id: 'sm3_p_high', position: [0, 7.0, 22], size: [9, 1, 9], color: '#274461' },
      { id: 'sm3_p_pil1', position: [-6, 8.0, 30], size: [4, 1, 4], color: '#182b3d' },
      { id: 'sm3_p_pil2', position: [6, 9.0, 30], size: [4, 1, 4], color: '#182b3d' },
      // Final solar apex
      { id: 'sm3_p_peak', position: [0, 10.5, 39], size: [9, 1, 9], color: '#0e1c28' }
    ],
    movingPlatforms: [
      {
        id: 'sm3_mp_1',
        position: [-4, 7.5, 26],
        endPosition: [4, 7.5, 26],
        size: [3, 0.5, 3],
        speed: 2.6,
        axis: 'x',
        color: '#0ea5e9'
      }
    ],
    cubes: [
      { id: 'sm3_cube_1', position: [2, 8.0, 22], size: [1.2, 1.2, 1.2], color: '#facc15' }
    ],
    pressurePads: [
      { id: 'sm3_pad_1', position: [-2, 7.55, 22], size: [2.2, 0.2, 2.2], targetBarrierId: 'sm3_bar_1', color: '#0ea5e9' }
    ],
    barriers: [
      { id: 'sm3_bar_1', position: [0, 11.8, 35], size: [6, 3, 0.5], color: '#0ea5e9' }
    ],
    lasers: [],
    jumpPads: [
      { id: 'sm3_jp_1', position: [0, 1.05, 11], strength: 16 },
      { id: 'sm3_jp_2', position: [0, 7.55, 24], strength: 14 }
    ],
    cores: [
      { id: 'sm3_c1', position: [0, 4.5, 16] },
      { id: 'sm3_c2', position: [-6, 9.6, 30] },
      { id: 'sm3_c3', position: [6, 10.6, 30] }
    ],
    portal: { position: [0, 12.0, 40] }
  },

  // -------------------------------------------------------------
  // LEVEL 4: AUTUMN BIOME (🍁 Осень)
  // -------------------------------------------------------------
  {
    id: 4,
    title: 'Уровень 4: 🍁 Осень — Золотой Листопад',
    subtitle: 'Патрульные лазеры и двойные янтарные ключи',
    description: 'Вечерний золотой закат осени. Чтобы отключить барьеры реактора, необходимо синхронизировать два квантовых куба на разных крыльях, уворачиваясь от движущегося лазера.',
    hint: 'Поставьте оба куба на обе плиты! Остерегайтесь движущегося лазера в центре.',
    biome: 'autumn',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 4,
    targetTimeSeconds: 85,
    platforms: [
      { id: 'au4_start', position: [0, 0, 0], size: [8, 1, 8], color: '#281a17' },
      { id: 'au4_hub', position: [0, 1, 14], size: [12, 1, 10], color: '#281a17' },
      { id: 'au4_wing_l', position: [-9, 2.5, 14], size: [6, 1, 6], color: '#3d251f' },
      { id: 'au4_wing_r', position: [9, 2.5, 14], size: [6, 1, 6], color: '#3d251f' },
      { id: 'au4_back', position: [0, 3, 26], size: [8, 1, 8], color: '#1c100c' }
    ],
    movingPlatforms: [
      {
        id: 'au4_mp_l',
        position: [-5, 1.5, 14],
        endPosition: [-7, 2.2, 14],
        size: [2.5, 0.5, 2.5],
        speed: 2.0,
        axis: 'x',
        color: '#f59e0b'
      },
      {
        id: 'au4_mp_r',
        position: [5, 1.5, 14],
        endPosition: [7, 2.2, 14],
        size: [2.5, 0.5, 2.5],
        speed: 2.0,
        axis: 'x',
        color: '#f59e0b'
      }
    ],
    cubes: [
      { id: 'au4_cube_1', position: [-2, 2.2, 14], size: [1.2, 1.2, 1.2], color: '#f59e0b' },
      { id: 'au4_cube_2', position: [2, 2.2, 14], size: [1.2, 1.2, 1.2], color: '#ea580c' }
    ],
    pressurePads: [
      { id: 'au4_pad_l', position: [-9, 3.05, 14], size: [2.2, 0.2, 2.2], targetBarrierId: 'au4_bar_1', color: '#f59e0b' },
      { id: 'au4_pad_r', position: [9, 3.05, 14], size: [2.2, 0.2, 2.2], targetBarrierId: 'au4_bar_2', color: '#ea580c' }
    ],
    barriers: [
      { id: 'au4_bar_1', position: [-1.8, 4.2, 21], size: [3.5, 3, 0.5], color: '#f59e0b' },
      { id: 'au4_bar_2', position: [1.8, 4.2, 21], size: [3.5, 3, 0.5], color: '#ea580c' }
    ],
    lasers: [
      {
        id: 'au4_laser_sweep',
        start: [-7, 2.0, 7],
        direction: [1, 0, 0],
        length: 14,
        moving: true,
        moveRange: 4.0,
        moveSpeed: 2.2,
        moveAxis: 'z'
      }
    ],
    jumpPads: [],
    cores: [
      { id: 'au4_c1', position: [0, 2.2, 7] },
      { id: 'au4_c2', position: [-9, 4.2, 14] },
      { id: 'au4_c3', position: [9, 4.2, 14] },
      { id: 'au4_c4', position: [0, 4.5, 23] }
    ],
    portal: { position: [0, 4.5, 27] }
  },

  // -------------------------------------------------------------
  // LEVEL 5: WINTER BIOME (❄️ Зима)
  // -------------------------------------------------------------
  {
    id: 5,
    title: 'Уровень 5: ❄️ Зима — Ледяной Шпиль',
    subtitle: 'Полярное сияние и ледяные кристаллы',
    description: 'Северное полярное сияние и ледяные вершины. Преодолейте морозные пропасти, скользящие переходы и заблокируйте ледяной лазер квантовым кубом.',
    hint: 'Квантовый куб защитит вас от лазера! Поставьте его на линию огня или пронесите перед собой.',
    biome: 'winter',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 3,
    targetTimeSeconds: 65,
    platforms: [
      { id: 'wi5_start', position: [0, 0, 0], size: [8, 1, 8], color: '#0f1f33', friction: 0.8 },
      { id: 'wi5_mid1', position: [0, 1.0, 12], size: [6, 1, 6], color: '#163354', friction: 0.75 },
      { id: 'wi5_bridge', position: [0, 2.0, 23], size: [5, 1, 10], color: '#0f1f33', friction: 0.75 },
      { id: 'wi5_exit', position: [0, 3.2, 41], size: [8, 1, 8], color: '#060f1c' }
    ],
    movingPlatforms: [
      {
        id: 'wi5_mp_1',
        position: [0, 0.5, 6],
        endPosition: [0, 0.8, 9.5],
        size: [3.5, 0.6, 3],
        speed: 2.2,
        axis: 'z',
        color: '#38bdf8'
      },
      {
        id: 'wi5_mp_2',
        position: [0, 2.2, 30],
        endPosition: [0, 3.0, 37],
        size: [3.5, 0.6, 3],
        speed: 2.6,
        axis: 'z',
        color: '#38bdf8'
      }
    ],
    cubes: [
      { id: 'wi5_cube_1', position: [1.5, 2.2, 12], size: [1.3, 1.3, 1.3], color: '#38bdf8' }
    ],
    pressurePads: [
      { id: 'wi5_pad_1', position: [0, 2.55, 26], size: [2.2, 0.2, 2.2], targetBarrierId: 'wi5_bar_1', color: '#38bdf8' }
    ],
    barriers: [
      { id: 'wi5_bar_1', position: [0, 3.8, 28], size: [5, 3, 0.5], color: '#38bdf8' }
    ],
    lasers: [
      {
        id: 'wi5_laser_1',
        start: [-6, 2.8, 20],
        direction: [1, 0, 0],
        length: 12,
        moving: false
      },
      {
        id: 'wi5_laser_2',
        start: [-6, 4.0, 34],
        direction: [1, 0, 0],
        length: 12,
        moving: true,
        moveRange: 3.5,
        moveSpeed: 2.0,
        moveAxis: 'z'
      }
    ],
    jumpPads: [],
    cores: [
      { id: 'wi5_c1', position: [0, 2.5, 6] },
      { id: 'wi5_c2', position: [-2, 3.4, 23] },
      { id: 'wi5_c3', position: [0, 4.4, 35] }
    ],
    portal: { position: [0, 4.5, 42] }
  },

  // -------------------------------------------------------------
  // LEVEL 6: SAKURA BIOME (🌸 Сакура - Продвинутый)
  // -------------------------------------------------------------
  {
    id: 6,
    title: 'Уровень 6: 🌸 Сакура — Небесный Храм',
    subtitle: 'Высотные прыжки сквозь вишневый вихрь',
    description: 'Древний парящий храм над лепестковыми облаками. Сочетайте джамп-пад ускорение, двойные прыжки и точный перенос квантовых ключей к святилищу.',
    hint: 'Взлетайте на джамп-паде, подхватив куб, или метните его вперед с помощью [F] / ЛКМ!',
    biome: 'sakura',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 4,
    targetTimeSeconds: 75,
    platforms: [
      { id: 'sk6_p0', position: [0, 0, 0], size: [8, 1, 8], color: '#26182f' },
      { id: 'sk6_p1', position: [0, 1.5, 12], size: [6, 1, 6], color: '#3b2046' },
      { id: 'sk6_high', position: [0, 7.5, 24], size: [10, 1, 10], color: '#26182f' },
      { id: 'sk6_peak', position: [0, 12.0, 38], size: [9, 1, 9], color: '#180e20' }
    ],
    movingPlatforms: [
      {
        id: 'sk6_mp_1',
        position: [-5, 8.0, 24],
        endPosition: [-7, 9.5, 30],
        size: [3, 0.5, 3],
        speed: 2.2,
        axis: 'z',
        color: '#f43f5e'
      },
      {
        id: 'sk6_mp_2',
        position: [5, 8.0, 24],
        endPosition: [7, 9.5, 30],
        size: [3, 0.5, 3],
        speed: 2.2,
        axis: 'z',
        color: '#f43f5e'
      }
    ],
    cubes: [
      { id: 'sk6_cube_1', position: [0, 8.8, 20], size: [1.2, 1.2, 1.2], color: '#f43f5e' }
    ],
    pressurePads: [
      { id: 'sk6_pad_1', position: [2.5, 8.05, 24], size: [2.2, 0.2, 2.2], targetBarrierId: 'sk6_bar_1', color: '#f43f5e' }
    ],
    barriers: [
      { id: 'sk6_bar_1', position: [0, 13.5, 35], size: [6, 3, 0.5], color: '#f43f5e' }
    ],
    lasers: [
      {
        id: 'sk6_laser_1',
        start: [-6, 9.5, 24],
        direction: [1, 0, 0],
        length: 12,
        moving: false
      }
    ],
    jumpPads: [
      { id: 'sk6_jp_1', position: [0, 2.05, 12], strength: 17 },
      { id: 'sk6_jp_2', position: [-2.5, 8.05, 24], strength: 15 }
    ],
    cores: [
      { id: 'sk6_c1', position: [0, 3.5, 6] },
      { id: 'sk6_c2', position: [0, 9.5, 16] },
      { id: 'sk6_c3', position: [-7, 11.2, 30] },
      { id: 'sk6_c4', position: [7, 11.2, 30] }
    ],
    portal: { position: [0, 13.5, 39] }
  },

  // -------------------------------------------------------------
  // LEVEL 7: SUMMER BIOME (☀️ Лето - Высокая скорость)
  // -------------------------------------------------------------
  {
    id: 7,
    title: 'Уровень 7: ☀️ Лето — Гравитационный Оазис',
    subtitle: 'Спринтерские прыжки и движущиеся мосты',
    description: 'Солнце в зените. Используйте спринт [Shift], чтобы на полной скорости преодолевать длинные пролеты между парящими солнечными монолитами.',
    hint: 'Зажмите [Shift] для спринта перед прыжком, чтобы перелетать большие расстояния!',
    biome: 'summer',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 4,
    targetTimeSeconds: 70,
    platforms: [
      { id: 'sm7_p0', position: [0, 0, 0], size: [8, 1, 8], color: '#182b3d' },
      { id: 'sm7_p1', position: [0, 1.2, 14], size: [7, 1, 7], color: '#274461' },
      { id: 'sm7_p2', position: [0, 2.4, 28], size: [7, 1, 7], color: '#274461' },
      { id: 'sm7_p3', position: [0, 3.8, 44], size: [9, 1, 9], color: '#0e1c28' }
    ],
    movingPlatforms: [
      {
        id: 'sm7_mp_1',
        position: [0, 0.6, 7],
        endPosition: [0, 1.0, 10.5],
        size: [3, 0.5, 3],
        speed: 3.0,
        axis: 'z',
        color: '#0ea5e9'
      },
      {
        id: 'sm7_mp_2',
        position: [-3.5, 1.8, 21],
        endPosition: [3.5, 1.8, 21],
        size: [3, 0.5, 3],
        speed: 3.2,
        axis: 'x',
        color: '#0ea5e9'
      },
      {
        id: 'sm7_mp_3',
        position: [0, 3.0, 36],
        endPosition: [0, 3.5, 40],
        size: [3, 0.5, 3],
        speed: 2.8,
        axis: 'z',
        color: '#0ea5e9'
      }
    ],
    cubes: [
      { id: 'sm7_cube_1', position: [2, 3.6, 28], size: [1.2, 1.2, 1.2], color: '#facc15' }
    ],
    pressurePads: [
      { id: 'sm7_pad_1', position: [-2, 2.95, 28], size: [2.2, 0.2, 2.2], targetBarrierId: 'sm7_bar_1', color: '#0ea5e9' }
    ],
    barriers: [
      { id: 'sm7_bar_1', position: [0, 5.2, 40], size: [5, 3, 0.5], color: '#0ea5e9' }
    ],
    lasers: [
      {
        id: 'sm7_laser_1',
        start: [-6, 3.2, 28],
        direction: [1, 0, 0],
        length: 12,
        moving: true,
        moveRange: 2.5,
        moveSpeed: 2.4,
        moveAxis: 'z'
      }
    ],
    jumpPads: [
      { id: 'sm7_jp_1', position: [0, 1.75, 14], strength: 15 }
    ],
    cores: [
      { id: 'sm7_c1', position: [0, 2.2, 7] },
      { id: 'sm7_c2', position: [0, 3.4, 21] },
      { id: 'sm7_c3', position: [0, 4.5, 36] },
      { id: 'sm7_c4', position: [0, 5.5, 45] }
    ],
    portal: { position: [0, 5.5, 47] }
  },

  // -------------------------------------------------------------
  // LEVEL 8: AUTUMN BIOME (🍁 Осень - Сумеречный Реактор)
  // -------------------------------------------------------------
  {
    id: 8,
    title: 'Уровень 8: 🍁 Осень — Сумеречный Реактор',
    subtitle: 'Координация двух ключей сквозь осеннюю мглу',
    description: 'Сумерки над янтарным лесом. Преодолейте перекрестные лазерные рубежи, заблокируйте смертельный огонь кубами и активируйте парные преобразователи.',
    hint: 'Метните один куб через лазер [F], затем перепрыгните и установите его на дальнюю плиту!',
    biome: 'autumn',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 4,
    targetTimeSeconds: 80,
    platforms: [
      { id: 'au8_p0', position: [0, 0, 0], size: [8, 1, 8], color: '#281a17' },
      { id: 'au8_p1', position: [0, 1.5, 15], size: [10, 1, 10], color: '#3d251f' },
      { id: 'au8_p2', position: [-8, 3.0, 26], size: [6, 1, 6], color: '#281a17' },
      { id: 'au8_p3', position: [8, 3.0, 26], size: [6, 1, 6], color: '#281a17' },
      { id: 'au8_p_end', position: [0, 4.5, 38], size: [9, 1, 9], color: '#1c100c' }
    ],
    movingPlatforms: [
      {
        id: 'au8_mp_1',
        position: [0, 2.2, 22],
        endPosition: [0, 3.5, 31],
        size: [3.5, 0.5, 3.5],
        speed: 2.2,
        axis: 'z',
        color: '#f59e0b'
      }
    ],
    cubes: [
      { id: 'au8_cube_1', position: [-2.5, 2.8, 15], size: [1.2, 1.2, 1.2], color: '#f59e0b' },
      { id: 'au8_cube_2', position: [2.5, 2.8, 15], size: [1.2, 1.2, 1.2], color: '#ea580c' }
    ],
    pressurePads: [
      { id: 'au8_pad_1', position: [-8, 3.55, 26], size: [2.2, 0.2, 2.2], targetBarrierId: 'au8_bar_1', color: '#f59e0b' },
      { id: 'au8_pad_2', position: [8, 3.55, 26], size: [2.2, 0.2, 2.2], targetBarrierId: 'au8_bar_2', color: '#ea580c' }
    ],
    barriers: [
      { id: 'au8_bar_1', position: [-2, 5.8, 33], size: [3.5, 3, 0.5], color: '#f59e0b' },
      { id: 'au8_bar_2', position: [2, 5.8, 33], size: [3.5, 3, 0.5], color: '#ea580c' }
    ],
    lasers: [
      {
        id: 'au8_laser_1',
        start: [-7, 2.6, 15],
        direction: [1, 0, 0],
        length: 14,
        moving: false
      },
      {
        id: 'au8_laser_cross',
        start: [-6, 4.2, 26],
        direction: [1, 0, 0],
        length: 12,
        moving: true,
        moveRange: 3.0,
        moveSpeed: 2.0,
        moveAxis: 'z'
      }
    ],
    jumpPads: [
      { id: 'au8_jp_1', position: [0, 2.05, 15], strength: 14 }
    ],
    cores: [
      { id: 'au8_c1', position: [0, 3.2, 8] },
      { id: 'au8_c2', position: [-8, 4.8, 26] },
      { id: 'au8_c3', position: [8, 4.8, 26] },
      { id: 'au8_c4', position: [0, 6.0, 35] }
    ],
    portal: { position: [0, 6.0, 40] }
  },

  // -------------------------------------------------------------
  // LEVEL 9: WINTER BIOME (❄️ Зима - Вечная Мерзлота)
  // -------------------------------------------------------------
  {
    id: 9,
    title: 'Уровень 9: ❄️ Зима — Вечная Мерзлота',
    subtitle: 'Экстремальный ледниковый паркур',
    description: 'Глубины ледяного хребта под танцующим сиянием. Скользкие платформы, вертикальные высоты и точные прыжки на кинетических подушках.',
    hint: 'Учитывайте инерцию скольжения по льду! Контролируйте скорость перед прыжком.',
    biome: 'winter',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 4,
    targetTimeSeconds: 85,
    platforms: [
      { id: 'wi9_p0', position: [0, 0, 0], size: [8, 1, 8], color: '#0f1f33', friction: 0.75 },
      { id: 'wi9_p1', position: [0, 1.5, 12], size: [6, 1, 6], color: '#163354', friction: 0.7 },
      { id: 'wi9_high', position: [0, 8.0, 24], size: [10, 1, 10], color: '#0f1f33', friction: 0.7 },
      { id: 'wi9_peak', position: [0, 13.0, 38], size: [9, 1, 9], color: '#060f1c', friction: 0.75 }
    ],
    movingPlatforms: [
      {
        id: 'wi9_mp_1',
        position: [-5, 4.5, 18],
        endPosition: [5, 6.0, 18],
        size: [3, 0.5, 3],
        speed: 2.4,
        axis: 'x',
        color: '#38bdf8'
      },
      {
        id: 'wi9_mp_2',
        position: [0, 9.5, 30],
        endPosition: [0, 11.5, 35],
        size: [3, 0.5, 3],
        speed: 2.6,
        axis: 'z',
        color: '#38bdf8'
      }
    ],
    cubes: [
      { id: 'wi9_cube_1', position: [2, 9.2, 24], size: [1.3, 1.3, 1.3], color: '#38bdf8' }
    ],
    pressurePads: [
      { id: 'wi9_pad_1', position: [-2, 8.55, 24], size: [2.2, 0.2, 2.2], targetBarrierId: 'wi9_bar_1', color: '#38bdf8' }
    ],
    barriers: [
      { id: 'wi9_bar_1', position: [0, 14.5, 34], size: [6, 3, 0.5], color: '#38bdf8' }
    ],
    lasers: [
      {
        id: 'wi9_laser_1',
        start: [-6, 3.2, 12],
        direction: [1, 0, 0],
        length: 12,
        moving: false
      },
      {
        id: 'wi9_laser_2',
        start: [-6, 9.8, 24],
        direction: [1, 0, 0],
        length: 12,
        moving: true,
        moveRange: 3.5,
        moveSpeed: 2.2,
        moveAxis: 'z'
      }
    ],
    jumpPads: [
      { id: 'wi9_jp_1', position: [0, 2.05, 12], strength: 17 },
      { id: 'wi9_jp_2', position: [0, 8.55, 26], strength: 15 }
    ],
    cores: [
      { id: 'wi9_c1', position: [0, 3.2, 6] },
      { id: 'wi9_c2', position: [0, 6.5, 18] },
      { id: 'wi9_c3', position: [0, 10.5, 24] },
      { id: 'wi9_c4', position: [0, 14.8, 38] }
    ],
    portal: { position: [0, 14.8, 41] }
  },

  // -------------------------------------------------------------
  // LEVEL 10: APEX ALL-SEASONS (🌌 Хроно-Сфера)
  // -------------------------------------------------------------
  {
    id: 10,
    title: 'Уровень 10: 🌌 Хроно-Сфера — Апекс Всех Сезонов',
    subtitle: 'Грандиозный финал четырех стихий',
    description: 'Вершина пространственно-временного ядра, где сходятся сакура, весна, лето, осень и морозная зима. Продемонстрируйте всё мастерство паркура, толкания кубов и тайминга!',
    hint: 'Финальное испытание! Используйте джамп-пады, закрывайтесь кубом от лазеров и шагните в портал победителя.',
    biome: 'sakura',
    spawnPoint: [0, 1.5, 0],
    targetCoresCount: 5,
    targetTimeSeconds: 100,
    platforms: [
      { id: 'ap10_p0', position: [0, 0, 0], size: [8, 1, 8], color: '#26182f' },
      { id: 'ap10_p1', position: [0, 1.5, 14], size: [8, 1, 8], color: '#132822' },
      { id: 'ap10_p2', position: [0, 3.5, 28], size: [11, 1, 11], color: '#182b3d' },
      { id: 'ap10_p_apex', position: [0, 9.5, 42], size: [11, 1, 11], color: '#060f1c' }
    ],
    movingPlatforms: [
      {
        id: 'ap10_mp_1',
        position: [0, 0.8, 7],
        endPosition: [0, 1.2, 10.5],
        size: [3, 0.5, 3],
        speed: 2.4,
        axis: 'z',
        color: '#f43f5e'
      },
      {
        id: 'ap10_mp_2',
        position: [-5, 5.0, 35],
        endPosition: [5, 7.5, 35],
        size: [3, 0.5, 3],
        speed: 2.6,
        axis: 'x',
        color: '#38bdf8'
      }
    ],
    cubes: [
      { id: 'ap10_cube_1', position: [0, 4.5, 24], size: [1.3, 1.3, 1.3], color: '#ec4899' }
    ],
    pressurePads: [
      { id: 'ap10_pad_1', position: [3.0, 4.05, 28], size: [2.2, 0.2, 2.2], targetBarrierId: 'ap10_bar_1', color: '#ec4899' }
    ],
    barriers: [
      { id: 'ap10_bar_1', position: [0, 11.0, 39], size: [6, 3, 0.5], color: '#ec4899' }
    ],
    lasers: [
      {
        id: 'ap10_laser_1',
        start: [-7, 2.8, 14],
        direction: [1, 0, 0],
        length: 14,
        moving: false
      },
      {
        id: 'ap10_laser_2',
        start: [-6, 5.0, 28],
        direction: [1, 0, 0],
        length: 12,
        moving: true,
        moveRange: 3.5,
        moveSpeed: 2.2,
        moveAxis: 'z'
      }
    ],
    jumpPads: [
      { id: 'ap10_jp_1', position: [-3.0, 4.05, 28], strength: 18 }
    ],
    cores: [
      { id: 'ap10_c1', position: [0, 2.8, 7] },
      { id: 'ap10_c2', position: [0, 4.2, 18] },
      { id: 'ap10_c3', position: [0, 6.8, 28] },
      { id: 'ap10_c4', position: [0, 8.2, 35] },
      { id: 'ap10_c5', position: [0, 11.2, 42] }
    ],
    portal: { position: [0, 11.2, 44] }
  }
];
