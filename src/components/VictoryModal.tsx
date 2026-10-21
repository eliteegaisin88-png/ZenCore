import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, Clock, Zap } from 'lucide-react';
import { LevelDefinition } from '../types/game';

interface VictoryModalProps {
  level: LevelDefinition;
  timeSeconds: number;
  coresCollected: number;
  totalCores: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenWorldMap?: () => void;
  hasNextLevel: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  timeSeconds,
  coresCollected,
  totalCores,
  onNextLevel,
  onReplay,
  onOpenWorldMap,
  hasNextLevel,
}) => {
  useEffect(() => {
    // Confetti fanfare
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#06b6d4', '#facc15', '#a855f7'],
    });
  }, []);

  // Compute stars
  const finishStar = true;
  const coresStar = coresCollected >= totalCores;
  const timeStar = timeSeconds <= (level.targetTimeSeconds || 60);
  const starCount = (finishStar ? 1 : 0) + (coresStar ? 1 : 0) + (timeStar ? 1 : 0);

  const mins = Math.floor(timeSeconds / 60);
  const secs = Math.floor(timeSeconds % 60);
  const ms = Math.floor((timeSeconds % 1) * 10);
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
        {/* Glowing top accent banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
          <Trophy className="w-8 h-8 text-neutral-950 fill-current" />
        </div>

        <h2 className="text-xl font-extrabold text-white mb-1">Уровень пройден!</h2>
        <p className="text-xs text-neutral-400 mb-4">{level.title}</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-xl border transition-all ${
                starIdx <= starCount
                  ? 'bg-amber-950/40 border-amber-500/80 text-amber-400 scale-110 shadow-md'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-600'
              }`}
            >
              <Star className={`w-7 h-7 ${starIdx <= starCount ? 'fill-current' : ''}`} />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
          <div className="bg-neutral-950/70 border border-neutral-800 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1.5 text-neutral-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Время</span>
            </div>
            <div className="text-base font-bold text-neutral-100">{timeStr}</div>
            <div className="text-[10px] text-neutral-500">Цель: {level.targetTimeSeconds}с</div>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1.5 text-neutral-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ядра</span>
            </div>
            <div className="text-base font-bold text-cyan-300">
              {coresCollected} / {totalCores}
            </div>
            <div className="text-[10px] text-neutral-500">Собрано</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs transition-colors border border-neutral-700/80"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Переиграть</span>
            </button>

            {hasNextLevel ? (
              <button
                onClick={onNextLevel}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-cyan-900/40"
              >
                <span>Далее</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onReplay}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <span>Пройдено 60 уровней!</span>
              </button>
            )}
          </div>

          {onOpenWorldMap && (
            <button
              onClick={onOpenWorldMap}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-medium text-xs transition-colors border border-white/10"
            >
              Карта всех 60 уровней
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
