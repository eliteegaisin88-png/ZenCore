import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Eye,
  Layers,
  ChevronDown,
  Maximize2,
  Music,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { MusicTrack, RELAXING_TRACKS } from '../audio/soundSystem';

interface UnityHeaderProps {
  levels: LevelDefinition[];
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
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
}

export const UnityHeader: React.FC<UnityHeaderProps> = ({
  levels,
  currentLevelIndex,
  onSelectLevel,
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
  drawCalls,
  triangles,
  currentTrack,
  isMusicPlaying,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
  onToggleMusic,
}) => {
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
  const currentLevel = levels[currentLevelIndex];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-xs text-neutral-300 select-none">
      {/* Left: Unity Branding & Level Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-neutral-100">
          {/* Unity Cube stylized icon */}
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-black text-white">U</span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-neutral-300">Unity 2026.3 LTS</span>
        </div>

        <div className="h-4 w-px bg-neutral-700 hidden sm:block" />

        {/* Level Selector Dropdown */}
        <div className="relative group flex items-center">
          <select
            value={currentLevelIndex}
            onChange={(e) => onSelectLevel(Number(e.target.value))}
            className="appearance-none bg-neutral-800/90 hover:bg-neutral-700/80 text-neutral-200 pl-2.5 pr-7 py-1 rounded border border-neutral-700/80 font-mono text-[11px] cursor-pointer transition-colors focus:outline-none focus:border-cyan-500"
          >
            {levels.map((lvl, idx) => (
              <option key={lvl.id} value={idx} className="bg-neutral-900 text-neutral-200">
                {lvl.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-neutral-400" />
        </div>
      </div>

      {/* Center: Unity Play / Pause / Step Controls & Relaxing Music Bar */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <div className="flex items-center bg-neutral-950/80 border border-neutral-800 rounded-md p-0.5 shadow-inner">
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Возобновить (Play)' : 'Приостановить (Pause)'}
            className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-[11px] font-semibold ${
              !isPaused
                ? 'bg-emerald-600/90 text-white shadow-sm'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden md:inline">{isPaused ? 'Resume' : 'Playing'}</span>
          </button>

          <button
            onClick={onResetLevel}
            title="Сбросить на чекпоинт (R)"
            className="px-2 py-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Relaxing Music Player Pill & Dropdown */}
        <div className="relative flex items-center bg-neutral-950/80 border border-neutral-800 rounded-md p-0.5 shadow-inner">
          <button
            onClick={onPrevTrack}
            title="Предыдущий трек"
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
            title="Выбрать расслабляющую музыку (4 трека) [M]"
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-neutral-800/80 text-neutral-200 rounded text-[11px] font-mono transition-colors"
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'text-cyan-400 animate-pulse' : 'text-neutral-500'}`} />
            <span className="hidden sm:inline font-semibold truncate max-w-[130px] lg:max-w-[160px]">
              {currentTrack.icon} {currentTrack.title}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          <button
            onClick={onNextTrack}
            title="Следующий трек [M]"
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Остановить музыку' : 'Включить музыку'}
            className={`p-1 rounded transition-colors ${
              isMusicPlaying ? 'text-cyan-300 hover:bg-neutral-800' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {isMusicPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          </button>

          {/* Music Selection Dropdown */}
          {isMusicMenuOpen && (
            <div className="absolute top-full mt-2 -left-10 sm:left-0 w-72 bg-neutral-900/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-xl p-2 z-50">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800 text-[10px] font-mono text-neutral-400">
                <span className="font-semibold text-neutral-300 flex items-center gap-1">
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
                      className={`w-full text-left p-2 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-cyan-950/70 border-cyan-500/80 text-cyan-200 shadow-sm'
                          : 'bg-neutral-950/40 border-neutral-800/60 hover:bg-neutral-800/70 text-neutral-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span>{t.icon}</span>
                          <span className="font-bold text-[11px] truncate text-white">{t.title}</span>
                          <span className="text-[9px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1 rounded">
                            {t.genre}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400 leading-tight truncate">
                          {t.description}
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 mt-0.5 ${
                        isActive ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-500 bg-neutral-900'
                      }`}>
                        {idx + 1}/4
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Unity Tools, Stats & Inspector Toggle */}
      <div className="flex items-center gap-2">
        {/* Unity Render Stats */}
        <div className="hidden lg:flex items-center gap-2.5 font-mono text-[10px] text-neutral-400 bg-neutral-950/60 px-2 py-1 rounded border border-neutral-800/80">
          <span>FPS: <strong className="text-emerald-400">{fps}</strong></span>
          <span>Batches: <strong className="text-cyan-400">{drawCalls}</strong></span>
          <span>Tris: <strong className="text-blue-400">{triangles > 1000 ? `${(triangles / 1000).toFixed(1)}k` : triangles}</strong></span>
        </div>

        {/* Camera Perspective Toggle */}
        <button
          onClick={() => {
            const nextMode = cameraMode === 'third' ? 'close' : cameraMode === 'close' ? 'top' : 'third';
            onToggleCameraMode(nextMode);
          }}
          title="Сменить режим камеры: 3D / Плечо / Сверху (C)"
          className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700/80"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline text-[11px]">
            {cameraMode === 'third' ? '3D View' : cameraMode === 'close' ? 'Close View' : 'Top View'}
          </span>
        </button>

        {/* Unity Inspector & Hierarchy Toggle */}
        <button
          onClick={onToggleEditor}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-[11px] font-medium border ${
            isEditorOpen
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 border-neutral-700/80'
          }`}
          title="Открыть панель инспектора компонентов Unity"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspector</span>
        </button>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors"
          title={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors hidden sm:block"
          title="Полноэкранный режим"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
