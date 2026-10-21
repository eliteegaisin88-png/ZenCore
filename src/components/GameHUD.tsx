import React from 'react';
import { Sparkles, MousePointer } from 'lucide-react';
import { LevelDefinition } from '../types/game';

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
  interactPrompt,
  isPointerLocked,
  onRequestPointerLock,
  musicToast,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-3 flex flex-col justify-between select-none">
      {/* TOP: SUBTLE POINTER LOCK CUE (Only when mouse is not locked) */}
      {!isPointerLocked ? (
        <div className="pt-14 self-center pointer-events-none transition-opacity duration-300">
          <button
            onClick={onRequestPointerLock}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1 bg-neutral-950/60 hover:bg-neutral-900/80 text-neutral-300 hover:text-white rounded-full border border-white/10 backdrop-blur-xl text-xs font-mono shadow-lg transition-all hover:scale-105"
          >
            <MousePointer className="w-3 h-3 text-cyan-400" />
            <span>Кликните по экрану для обзора мышью 360°</span>
            <span className="text-[10px] text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded ml-1">Esc — выход</span>
          </button>
        </div>
      ) : (
        <div />
      )}

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
            <div className="bg-neutral-950/85 text-cyan-200 font-mono text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-cyan-500/40 backdrop-blur-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{musicToast}</span>
              <span className="text-[10px] text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded ml-1">[M]</span>
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
    </div>
  );
};
