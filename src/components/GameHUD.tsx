import React, { useState } from 'react';
import { Sparkles, Timer, Eye, EyeOff, Zap, MousePointer, Crosshair } from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { BIOMES } from '../game/biomeSystem';

interface GameHUDProps {
  currentLevel: LevelDefinition;
  coresCollected: number;
  totalCores: number;
  elapsedTime: number;
  interactPrompt: string | null;
  isPointerLocked?: boolean;
  onRequestPointerLock?: () => void;
  musicToast?: string | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentLevel,
  coresCollected,
  totalCores,
  elapsedTime,
  interactPrompt,
  isPointerLocked,
  onRequestPointerLock,
  musicToast,
}) => {
  const [showControlsHint, setShowControlsHint] = useState(true);

  // Format time mm:ss.ms
  const mins = Math.floor(elapsedTime / 60);
  const secs = Math.floor(elapsedTime % 60);
  const ms = Math.floor((elapsedTime % 1) * 10);
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;

  const allCoresCollected = coresCollected >= totalCores;
  const biome = currentLevel.biome ? BIOMES[currentLevel.biome] : BIOMES.sakura;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-3 flex flex-col justify-between select-none">
      {/* TOP SECTION: LEVEL INFO, POINTER LOCK HINT, & STATS */}
      <div className="pt-10 flex items-start justify-between gap-4">
        {/* Top-Left: Level Title & Objective Hint */}
        <div className="pointer-events-auto bg-neutral-900/85 backdrop-blur-md border border-neutral-800 rounded-xl p-3 shadow-lg max-w-sm">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <h1 className="font-bold text-sm tracking-wide text-white truncate">
                {currentLevel.title}
              </h1>
            </div>
            {biome && (
              <span
                style={{ borderColor: biome.accentGlow + '60', color: biome.accentGlow }}
                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-neutral-950/80 shrink-0 shadow-sm"
              >
                {biome.icon} {biome.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-300 font-medium leading-relaxed">
            {currentLevel.hint}
          </p>
        </div>

        {/* Center-Top: Pointer Lock Cue */}
        {!isPointerLocked && (
          <button
            onClick={onRequestPointerLock}
            className="pointer-events-auto hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full border border-neutral-700/80 backdrop-blur-md text-xs font-mono shadow-md transition-all hover:scale-105"
          >
            <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Кликните для обзора мышью</span>
            <span className="text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded">Esc - выход</span>
          </button>
        )}

        {/* Top-Right: Cores & Timer Badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Energy Cores */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-md transition-colors ${
              allCoresCollected
                ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300'
                : 'bg-neutral-900/85 border-neutral-800 text-neutral-200'
            }`}
          >
            <Zap className={`w-4 h-4 ${allCoresCollected ? 'text-cyan-400' : 'text-amber-400'}`} />
            <div className="font-mono text-xs font-bold">
              <span>{coresCollected}</span>
              <span className="text-neutral-500"> / </span>
              <span>{totalCores}</span>
              <span className="text-[10px] text-neutral-400 ml-1.5 hidden sm:inline">ЯДЕР</span>
            </div>
          </div>

          {/* Stopwatch */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/85 backdrop-blur-md border border-neutral-800 rounded-xl text-xs font-mono font-bold text-neutral-200 shadow-md">
            <Timer className="w-3.5 h-3.5 text-neutral-400" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* CENTER: RETICLE (WHEN POINTER LOCKED) */}
      {isPointerLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
          <div className="w-4 h-4 border border-cyan-400/80 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-300 rounded-full" />
          </div>
        </div>
      )}

      {/* CENTER BOTTOM: INTERACTIVE ACTION PROMPT & MUSIC NOTIFICATION */}
      <div className="self-center flex flex-col items-center gap-2 mb-16 pointer-events-none">
        {musicToast && (
          <div className="animate-fade-in transition-all">
            <div className="bg-neutral-900/90 text-cyan-200 font-mono text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-cyan-500/50 backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{musicToast}</span>
              <span className="text-[10px] text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded ml-1">[M]</span>
            </div>
          </div>
        )}

        {interactPrompt && (
          <div className="animate-bounce">
            <div className="bg-cyan-600/95 text-white font-mono text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-cyan-300/80 backdrop-blur-md flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{interactPrompt}</span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM-LEFT: CONTROLS LEGEND (Collapsible) */}
      <div className="pointer-events-auto flex items-end justify-between">
        <div className="bg-neutral-900/85 backdrop-blur-md border border-neutral-800/80 rounded-xl p-2.5 text-[11px] font-mono text-neutral-300 max-w-xs shadow-md hidden sm:block">
          <div className="flex items-center justify-between gap-4 pb-1 mb-1 border-b border-neutral-800 text-neutral-400 text-[10px]">
            <span className="font-semibold text-neutral-300">УПРАВЛЕНИЕ</span>
            <button
              onClick={() => setShowControlsHint(!showControlsHint)}
              className="hover:text-white"
            >
              {showControlsHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>

          {showControlsHint && (
            <div className="space-y-1 text-neutral-400">
              <div className="flex justify-between">
                <span>[WASD] / Стрелки:</span>
                <span className="text-neutral-200">Движение по камере</span>
              </div>
              <div className="flex justify-between">
                <span>[Shift]:</span>
                <span className="text-cyan-400 font-semibold">Спринт (Бег)</span>
              </div>
              <div className="flex justify-between">
                <span>[Пробел]:</span>
                <span className="text-neutral-200">Прыжок (х2 двойной)</span>
              </div>
              <div className="flex justify-between">
                <span>[E]:</span>
                <span className="text-cyan-400">Взять / Поставить</span>
              </div>
              <div className="flex justify-between">
                <span>[ЛКМ / F]:</span>
                <span className="text-emerald-400 font-semibold">Метнуть куб</span>
              </div>
              <div className="flex justify-between">
                <span>[Мышь / Клик]:</span>
                <span className="text-neutral-200">Обзор камеры 360°</span>
              </div>
              <div className="flex justify-between">
                <span>[C]:</span>
                <span className="text-neutral-200">Вид 3D / Плечо / Верх</span>
              </div>
              <div className="flex justify-between">
                <span>[M]:</span>
                <span className="text-cyan-400 font-semibold">Сменить музыку (4 трека)</span>
              </div>
              <div className="flex justify-between">
                <span>[R]:</span>
                <span className="text-neutral-200">Рестарт чекпоинта</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
