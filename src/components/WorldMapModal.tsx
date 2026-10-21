import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Star,
  Timer,
  Zap,
  Sparkles,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { WORLDS_INFO, WorldInfo } from '../game/levels';
import { BIOMES } from '../game/biomeSystem';

interface WorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelDefinition[];
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelIndex,
  onSelectLevel,
}) => {
  // Find current world
  const currentLvl = levels[currentLevelIndex] || levels[0];
  const initialWorldId = Math.floor(currentLevelIndex / 6) + 1;
  const [selectedWorldId, setSelectedWorldId] = useState<number>(initialWorldId);

  // Sync selected world with current level index when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedWorldId(Math.floor(currentLevelIndex / 6) + 1);
    }
  }, [isOpen, currentLevelIndex]);

  // Read saved completion data
  const [completionData, setCompletionData] = useState<Record<number, { stars: number; bestTime?: number }>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('warpbound_progress');
      if (saved) {
        setCompletionData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentWorld = WORLDS_INFO.find((w) => w.worldId === selectedWorldId) || WORLDS_INFO[0];
  const biome = BIOMES[currentWorld.biome] || BIOMES.sakura;

  // Levels for this world
  const [startNum, endNum] = currentWorld.levelRange;
  const worldLevels = levels.filter((lvl) => lvl.id >= startNum && lvl.id <= endNum);

  // Total stars and completed counts across all 60 levels
  let totalStars = 0;
  let completedCount = 0;
  levels.forEach((l) => {
    const data = completionData[l.id];
    if (data && data.stars > 0) {
      totalStars += data.stars;
      completedCount++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-neutral-950/90 border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{
          boxShadow: `0 0 60px ${currentWorld.color}15, 0 20px 70px rgba(0,0,0,0.85)`,
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg text-xl"
              style={{
                background: `linear-gradient(135deg, ${currentWorld.color}, #090d16)`,
                boxShadow: `0 0 20px ${currentWorld.color}40`,
              }}
            >
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                  КАРТА ВСЕЛЕННОЙ
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  60 УРОВНЕЙ
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                10 уникальных биомов и измерений • Выберите уровень для прыжка
              </p>
            </div>
          </div>

          {/* Stats & Close */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold">{completedCount}</span>
                <span className="text-neutral-500">/ 60</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono font-bold">{totalStars}</span>
                <span className="text-neutral-500">/ 180</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Закрыть [Esc]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 10 Worlds Horizontal Navigation Bar */}
        <div className="px-4 sm:px-8 py-3 border-b border-white/10 bg-neutral-900/40 overflow-x-auto scrollbar-none flex items-center gap-2">
          {WORLDS_INFO.map((w) => {
            const isSelected = w.worldId === selectedWorldId;
            const b = BIOMES[w.biome] || BIOMES.sakura;

            // Count completed in this world
            let worldDone = 0;
            for (let i = w.levelRange[0]; i <= w.levelRange[1]; i++) {
              if (completionData[i]?.stars) worldDone++;
            }

            return (
              <button
                key={w.worldId}
                onClick={() => setSelectedWorldId(w.worldId)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'text-white border-white/30 shadow-md'
                    : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-white/5'
                }`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${w.color}35, rgba(255,255,255,0.05))`
                    : 'transparent',
                  borderColor: isSelected ? w.color : undefined,
                }}
              >
                <span className="text-base">{b.icon}</span>
                <div className="flex flex-col text-left">
                  <span className="leading-tight">{w.name}</span>
                  <span className="text-[9px] font-mono text-neutral-400 font-normal">
                    {worldDone}/6 ★
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* World Banner */}
          <div
            className="p-5 sm:p-6 rounded-2xl border relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background: `linear-gradient(135deg, ${currentWorld.color}20, rgba(20,20,30,0.6))`,
              borderColor: `${currentWorld.color}40`,
            }}
          >
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{biome.icon}</span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
                  МИР {currentWorld.worldId} ИЗ 10
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {currentWorld.name}
              </h3>
              <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
                {currentWorld.theme}
              </p>
            </div>

            {/* Quick Switch Buttons */}
            <div className="relative z-10 flex items-center gap-2 self-end sm:self-center">
              <button
                disabled={selectedWorldId <= 1}
                onClick={() => setSelectedWorldId((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none border border-white/10 text-white transition-colors"
                title="Предыдущий мир"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={selectedWorldId >= 10}
                onClick={() => setSelectedWorldId((p) => Math.min(10, p + 1))}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none border border-white/10 text-white transition-colors"
                title="Следующий мир"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 6 Level Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {worldLevels.map((lvl, index) => {
              const globalIndex = lvl.id - 1;
              const isCurrent = globalIndex === currentLevelIndex;
              const stageNum = index + 1;
              const record = completionData[lvl.id];
              const stars = record?.stars || (isCurrent ? 1 : 0);

              return (
                <div
                  key={lvl.id}
                  className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-neutral-900/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                      : 'bg-neutral-900/50 hover:bg-neutral-900/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Bar: Level Number, Stars, and Target Cores */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-white/10 font-bold text-white">
                          #{lvl.id}
                        </span>
                        {stageNum === 6 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            БОСС
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-cyan-500 text-neutral-950">
                            АКТИВЕН
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars
                                ? 'text-yellow-400 fill-current'
                                : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Level Title */}
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {lvl.title.replace(/^Уровень \d+:\s*/, '')}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {lvl.subtitle || lvl.description}
                    </p>
                  </div>

                  {/* Bottom Stats & Launch Button */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 text-[11px] font-mono text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>{lvl.targetCoresCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3 text-neutral-400" />
                        <span>{lvl.targetTimeSeconds}с</span>
                      </div>
                      {record?.bestTime && (
                        <span className="text-emerald-400 font-semibold">
                          Рекорд: {record.bestTime.toFixed(1)}с
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectLevel(globalIndex);
                        onClose();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isCurrent ? 'Текущий' : 'Играть'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 sm:px-8 py-3 border-t border-white/10 bg-neutral-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              Пройдите все 60 уровней, собирая квантовые ядра и открывая финальный портал!
            </span>
          </div>
          <div className="font-mono text-[11px] text-neutral-500">
            Горячая клавиша: Нажмите [M] для быстрого открытия карты
          </div>
        </div>
      </div>
    </div>
  );
};
