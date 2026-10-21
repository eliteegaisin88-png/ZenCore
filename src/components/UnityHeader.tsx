import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Eye,
  ChevronDown,
  Maximize2,
  Minimize2,
  Music,
  SkipForward,
  Sparkles,
  Zap,
  Timer,
  Info,
  Check,
  Compass,
  Map,
} from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { MusicTrack, RELAXING_TRACKS } from '../audio/soundSystem';
import { BIOMES } from '../game/biomeSystem';

interface UnityHeaderProps {
  levels: LevelDefinition[];
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
  onOpenWorldMap?: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onResetLevel: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
  cameraMode: 'third' | 'close' | 'top';
  onToggleCameraMode: (mode: 'third' | 'close' | 'top') => void;
  fps: number;
  drawCalls: number;
  triangles: number;
  isPointerLocked?: boolean;
  onRequestPointerLock?: () => void;
  currentTrack: MusicTrack;
  isMusicPlaying: boolean;
  onSelectTrack: (trackId: string) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onToggleMusic: () => void;
  coresCollected?: number;
  totalCores?: number;
  elapsedTime?: number;
}

export const UnityHeader: React.FC<UnityHeaderProps> = ({
  levels,
  currentLevelIndex,
  onSelectLevel,
  onOpenWorldMap,
  isPaused,
  onTogglePause,
  onResetLevel,
  isMuted,
  onToggleMute,
  isEditorOpen,
  onToggleEditor,
  cameraMode,
  onToggleCameraMode,
  fps,
  currentTrack,
  isMusicPlaying,
  onSelectTrack,
  onNextTrack,
  onToggleMusic,
  coresCollected = 0,
  totalCores = 1,
  elapsedTime = 0,
}) => {
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHintTooltip, setShowHintTooltip] = useState(false);

  const levelMenuRef = useRef<HTMLDivElement>(null);
  const musicMenuRef = useRef<HTMLDivElement>(null);

  const currentLevel = levels[currentLevelIndex] || levels[0];
  const biome = currentLevel.biome ? BIOMES[currentLevel.biome] : BIOMES.sakura;

  // Format time mm:ss
  const mins = Math.floor(elapsedTime / 60);
  const secs = Math.floor(elapsedTime % 60);
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const allCoresCollected = coresCollected >= totalCores;

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (levelMenuRef.current && !levelMenuRef.current.contains(e.target as Node)) {
        setIsLevelMenuOpen(false);
      }
      if (musicMenuRef.current && !musicMenuRef.current.contains(e.target as Node)) {
        setIsMusicMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-30 p-2 sm:p-3 pointer-events-none select-none flex justify-center">
      <div className="pointer-events-auto w-full max-w-6xl bg-neutral-950/60 hover:bg-neutral-950/75 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.55)] px-3 sm:px-4 py-2 transition-all duration-300 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ======================================================== */}
        {/* LEFT: BRAND & SLEEK LEVEL SELECTOR */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo Mark */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-extrabold tracking-wider text-[11px] uppercase bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent leading-none">
                WARPBOUND
              </span>
              <span className="text-[9px] font-mono text-neutral-400 leading-tight mt-0.5">
                {biome.name}
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* World Map Modal Trigger */}
          {onOpenWorldMap && (
            <button
              onClick={onOpenWorldMap}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 hover:from-cyan-500/25 hover:to-indigo-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all shadow-sm group"
              title="Открыть интерактивную карту 60 уровней и 10 миров [M]"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Карта Миров</span>
              <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                60
              </span>
            </button>
          )}

          {/* Level Selector Dropdown */}
          <div className="relative" ref={levelMenuRef}>
            <button
              onClick={() => {
                setIsLevelMenuOpen(!isLevelMenuOpen);
                setIsMusicMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-medium transition-all hover:border-cyan-500/50"
            >
              <span className="text-sm leading-none">{biome.icon}</span>
              <span className="font-mono text-[11px] font-semibold truncate max-w-[100px] sm:max-w-[140px]">
                {currentLevel.title}
              </span>
              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isLevelMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {/* Level Drawer Menu */}
            {isLevelMenuOpen && (
              <div className="absolute top-full mt-2 left-0 w-72 sm:w-80 bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  <span>Выберите Уровень</span>
                  <span>{levels.length} Локаций</span>
                </div>

                {onOpenWorldMap && (
                  <button
                    onClick={() => {
                      setIsLevelMenuOpen(false);
                      onOpenWorldMap();
                    }}
                    className="w-full mb-2 p-2 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900/90 hover:to-blue-900/90 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Открыть полную карту 10 миров</span>
                  </button>
                )}

                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                  {levels.map((lvl, idx) => {
                    const isCurrent = idx === currentLevelIndex;
                    const lvlBiome = lvl.biome ? BIOMES[lvl.biome] : BIOMES.sakura;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          onSelectLevel(idx);
                          setIsLevelMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                          isCurrent
                            ? 'bg-cyan-950/60 border-cyan-500/80 text-white shadow-sm'
                            : 'bg-neutral-950/30 border-white/5 hover:bg-white/10 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{lvlBiome.icon}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs truncate text-white">{lvl.title}</span>
                              {isCurrent && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate">{lvlBiome.name}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                          isCurrent ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-500 bg-neutral-900'
                        }`}>
                          #{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Objective Info Button / Tooltip */}
          {currentLevel.hint && (
            <div className="relative hidden md:block">
              <button
                onMouseEnter={() => setShowHintTooltip(true)}
                onMouseLeave={() => setShowHintTooltip(false)}
                onClick={() => setShowHintTooltip(!showHintTooltip)}
                className="p-1 rounded-lg text-neutral-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                title="Подсказка к уровню"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {showHintTooltip && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-neutral-900/95 border border-white/15 rounded-xl shadow-xl p-2.5 backdrop-blur-xl z-50 text-[11px] text-neutral-200 font-sans leading-relaxed">
                  <div className="text-[10px] font-mono font-semibold text-cyan-400 mb-0.5 uppercase tracking-wider">
                    Задача уровня
                  </div>
                  {currentLevel.hint}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CENTER: MINIMALIST GAME STATUS & RELAXING MUSIC PILL */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Energy Cores & Timer Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            {/* Cores */}
            <div className="flex items-center gap-1">
              <Zap className={`w-3.5 h-3.5 ${allCoresCollected ? 'text-cyan-400 animate-pulse' : 'text-amber-400'}`} />
              <span className="font-mono text-xs font-bold text-neutral-100">
                {coresCollected}<span className="text-neutral-500">/</span>{totalCores}
              </span>
            </div>

            <div className="h-3 w-px bg-white/15" />

            {/* Stopwatch */}
            <div className="flex items-center gap-1 font-mono text-xs text-neutral-300">
              <Timer className="w-3 h-3 text-neutral-400" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Minimal Relaxing Music Pill */}
          <div className="relative" ref={musicMenuRef}>
            <div className="flex items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-0.5 transition-all">
              <button
                onClick={() => {
                  setIsMusicMenuOpen(!isMusicMenuOpen);
                  setIsLevelMenuOpen(false);
                }}
                title="Музыкальный плеер (4 трека) [M]"
                className="flex items-center gap-1.5 px-2 py-0.5 text-neutral-200 text-xs font-mono transition-colors"
              >
                {/* 3 Animated Soundwave Bars */}
                <div className="flex items-end gap-0.5 h-3 w-3 shrink-0">
                  <span className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${isMusicPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                  <span className={`w-0.5 bg-cyan-300 rounded-full transition-all duration-300 ${isMusicPlaying ? 'h-2 animate-bounce' : 'h-1.5'}`} />
                  <span className={`w-0.5 bg-sky-400 rounded-full transition-all duration-300 ${isMusicPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                </div>
                <span className="hidden sm:inline font-medium text-[11px] truncate max-w-[100px] lg:max-w-[140px]">
                  {currentTrack.icon} {currentTrack.title}
                </span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isMusicMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {/* Skip Next */}
              <button
                onClick={onNextTrack}
                title="Следующий трек [M]"
                className="p-1 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <SkipForward className="w-3 h-3" />
              </button>

              {/* Toggle Play/Pause */}
              <button
                onClick={onToggleMusic}
                title={isMusicPlaying ? 'Остановить музыку' : 'Возобновить музыку'}
                className="p-1 hover:bg-white/10 text-cyan-400 hover:text-cyan-200 rounded-lg transition-colors"
              >
                {isMusicPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              </button>
            </div>

            {/* Music Selection Dropdown */}
            {isMusicMenuOpen && (
              <div className="absolute top-full mt-2 -left-12 sm:left-0 w-72 bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-white/10 text-[10px] font-mono text-neutral-400">
                  <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-cyan-400" /> РАССЛАБЛЯЮЩАЯ МУЗЫКА
                  </span>
                  <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-[9px]">Клавиша [M]</span>
                </div>
                <div className="space-y-1">
                  {RELAXING_TRACKS.map((t, idx) => {
                    const isActive = t.id === currentTrack.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTrack(t.id);
                          setIsMusicMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                          isActive
                            ? 'bg-cyan-950/70 border-cyan-500/80 text-cyan-200 shadow-sm'
                            : 'bg-neutral-950/40 border-white/5 hover:bg-white/10 text-neutral-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm">{t.icon}</span>
                            <span className="font-bold text-[11px] truncate text-white">{t.title}</span>
                            <span className="text-[9px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1 rounded">
                              {t.genre}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-400 leading-tight truncate">
                            {t.description}
                          </div>
                        </div>
                        {isActive ? (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        ) : (
                          <span className="text-[9px] text-neutral-500 font-mono shrink-0 mt-0.5">
                            0{idx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: MINIMALIST ACTION CONTROLS */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Camera Perspective Toggle */}
          <button
            onClick={() => {
              const nextMode = cameraMode === 'third' ? 'close' : cameraMode === 'close' ? 'top' : 'third';
              onToggleCameraMode(nextMode);
            }}
            title="Камера: 3D / Плечо / Сверху [C]"
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline text-[10px] font-mono">
              {cameraMode === 'third' ? '3D' : cameraMode === 'close' ? 'Close' : 'Top'}
            </span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Возобновить игру' : 'Пауза'}
            className={`p-1.5 rounded-xl border transition-all ${
              isPaused
                ? 'bg-amber-600/80 border-amber-400 text-white shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Reset Checkpoint */}
          <button
            onClick={onResetLevel}
            title="Рестарт чекпоинта [R]"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mute Audio */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Unity Inspector Toggle */}
          <button
            onClick={onToggleEditor}
            title="Панель инспектора компонентов"
            className={`flex items-center gap-1 px-2 py-1 rounded-xl border transition-all text-xs ${
              isEditorOpen
                ? 'bg-cyan-600/80 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px] font-mono">Инспектор</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            title={isFullscreen ? 'Выход из полноэкранного режима' : 'Полноэкранный режим'}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Subtle FPS meter */}
          <div className="hidden sm:flex items-center text-[10px] font-mono text-neutral-400 pl-1">
            <span className="text-emerald-400 font-semibold">{fps}</span>
            <span className="text-neutral-500 text-[9px] ml-0.5">fps</span>
          </div>
        </div>

      </div>
    </header>
  );
};
