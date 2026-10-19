import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sliders,
  Terminal,
  Layers,
  Box,
  Shield,
  Zap,
  Activity,
  Trash2,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { PlayerConfig, UnityGameObject, ConsoleLogItem } from '../types/game';
import { MusicTrack, RELAXING_TRACKS } from '../audio/soundSystem';

interface UnityInspectorProps {
  isOpen: boolean;
  onToggle: () => void;
  playerConfig: PlayerConfig;
  onUpdatePlayerConfig: (config: Partial<PlayerConfig>) => void;
  gameObjects: UnityGameObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  consoleLogs: ConsoleLogItem[];
  onClearConsole: () => void;
  currentTrack?: MusicTrack;
  onSelectTrack?: (id: string) => void;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
  musicVolume?: number;
  onUpdateMusicVolume?: (vol: number) => void;
  sfxVolume?: number;
  onUpdateSfxVolume?: (vol: number) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const UnityInspector: React.FC<UnityInspectorProps> = ({
  isOpen,
  onToggle,
  playerConfig,
  onUpdatePlayerConfig,
  gameObjects,
  selectedObjectId,
  onSelectObject,
  consoleLogs,
  onClearConsole,
  currentTrack,
  onSelectTrack,
  isMusicPlaying = true,
  onToggleMusic,
  onNextTrack,
  onPrevTrack,
  musicVolume = 0.25,
  onUpdateMusicVolume,
  sfxVolume = 0.6,
  onUpdateSfxVolume,
  isMuted = false,
  onToggleMute,
}) => {
  const [activeTab, setActiveTab] = useState<'inspector' | 'hierarchy' | 'console' | 'audio'>('inspector');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full border border-neutral-700/80 shadow-lg text-xs font-mono backdrop-blur-md transition-all hover:scale-105"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>▴ Открыть Unity Инспектор</span>
        </button>
      </div>
    );
  }

  const filteredObjects = gameObjects.filter(
    (obj) =>
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedObj = gameObjects.find((o) => o.id === selectedObjectId);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-3 pb-2 transition-all duration-300">
      <div className="bg-neutral-900/95 border border-neutral-700/90 rounded-t-xl shadow-2xl backdrop-blur-xl flex flex-col max-h-[380px] overflow-hidden">
        {/* Dock Header & Tabs */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950/90 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-[11px] transition-colors ${
                activeTab === 'inspector'
                  ? 'bg-neutral-800 text-cyan-300 border border-cyan-800/60 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('hierarchy')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-[11px] transition-colors ${
                activeTab === 'hierarchy'
                  ? 'bg-neutral-800 text-cyan-300 border border-cyan-800/60 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Hierarchy ({gameObjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-[11px] transition-colors ${
                activeTab === 'console'
                  ? 'bg-neutral-800 text-cyan-300 border border-cyan-800/60 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Console ({consoleLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-[11px] transition-colors ${
                activeTab === 'audio'
                  ? 'bg-neutral-800 text-cyan-300 border border-cyan-800/60 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio (4 трека)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-0.5 rounded hover:bg-neutral-800 transition-colors font-mono"
              title="Свернуть инспектор"
            >
              <span>▾ Скрыть</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-3 overflow-y-auto custom-scrollbar text-xs font-mono text-neutral-200">
          {/* TAB 1: INSPECTOR */}
          {activeTab === 'inspector' && (
            <div className="space-y-4">
              {/* Component: PlayerController */}
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Activity className="w-4 h-4" />
                    <span>Component: PlayerController.cs</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    GameObject: Player_Robot
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  {/* Speed */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400">
                      <span>Скорость бега (Move Speed)</span>
                      <span className="text-cyan-400 font-bold">{playerConfig.moveSpeed.toFixed(1)} m/s</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={18}
                      step={0.5}
                      value={playerConfig.moveSpeed}
                      onChange={(e) => onUpdatePlayerConfig({ moveSpeed: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Jump Force */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400">
                      <span>Сила прыжка (Jump Force)</span>
                      <span className="text-cyan-400 font-bold">{playerConfig.jumpForce.toFixed(1)} N</span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={22}
                      step={0.5}
                      value={playerConfig.jumpForce}
                      onChange={(e) => onUpdatePlayerConfig({ jumpForce: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Gravity */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400">
                      <span>Гравитация (Gravity)</span>
                      <span className="text-cyan-400 font-bold">{playerConfig.gravity.toFixed(1)} m/s²</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={45}
                      step={1}
                      value={playerConfig.gravity}
                      onChange={(e) => onUpdatePlayerConfig({ gravity: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Sprint Speed */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400">
                      <span>Скорость спринта (Shift)</span>
                      <span className="text-cyan-400 font-bold">{playerConfig.sprintSpeed?.toFixed(1) || '14.5'} m/s</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={26}
                      step={0.5}
                      value={playerConfig.sprintSpeed || 14.5}
                      onChange={(e) => onUpdatePlayerConfig({ sprintSpeed: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Mouse Sensitivity */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400">
                      <span>Чувствительность мыши</span>
                      <span className="text-cyan-400 font-bold">{(playerConfig.mouseSensitivity || 1.0).toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={3.0}
                      step={0.1}
                      value={playerConfig.mouseSensitivity || 1.0}
                      onChange={(e) => onUpdatePlayerConfig({ mouseSensitivity: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Toggles: Double Jump, Invert Y & God Mode */}
                  <div className="col-span-1 md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={playerConfig.doubleJump}
                        onChange={(e) => onUpdatePlayerConfig({ doubleJump: e.target.checked })}
                        className="rounded accent-cyan-500 w-3.5 h-3.5"
                      />
                      <span className="text-neutral-300">Двойной прыжок</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={playerConfig.invertY || false}
                        onChange={(e) => onUpdatePlayerConfig({ invertY: e.target.checked })}
                        className="rounded accent-cyan-500 w-3.5 h-3.5"
                      />
                      <span className="text-neutral-300">Инвертировать ось Y</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={playerConfig.invulnerable}
                        onChange={(e) => onUpdatePlayerConfig({ invulnerable: e.target.checked })}
                        className="rounded accent-amber-500 w-3.5 h-3.5"
                      />
                      <span className="text-neutral-300 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-amber-400" />
                        Бессмертие (God Mode)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Color customization */}
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-neutral-800/80">
                  <span className="text-neutral-400 text-[11px]">Цвет дроида:</span>
                  <div className="flex gap-2">
                    {['#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#e11d48'].map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdatePlayerConfig({ color: c, glowColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          playerConfig.color === c ? 'scale-125 border-white shadow-md' : 'border-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Inspector Selected Object details */}
              {selectedObj && (
                <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-3">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Box className="w-4 h-4" />
                      <span>Transform: {selectedObj.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                      Tag: {selectedObj.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-400">
                    <div>
                      <span className="text-neutral-500">Pos X:</span>{' '}
                      <span className="text-neutral-200">{selectedObj.position[0].toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Pos Y:</span>{' '}
                      <span className="text-neutral-200">{selectedObj.position[1].toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Pos Z:</span>{' '}
                      <span className="text-neutral-200">{selectedObj.position[2].toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HIERARCHY */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Поиск GameObject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono mb-2"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto">
                {filteredObjects.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => onSelectObject(obj.id === selectedObjectId ? null : obj.id)}
                    className={`flex items-center justify-between p-2 rounded border text-left transition-colors ${
                      obj.id === selectedObjectId
                        ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-200'
                        : 'bg-neutral-950/50 border-neutral-800/80 hover:bg-neutral-800/60 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Box className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-semibold truncate">{obj.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 shrink-0 ml-2">
                      {obj.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONSOLE */}
          {activeTab === 'console' && (
            <div>
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-neutral-800">
                <span className="text-neutral-400 text-[11px]">Журнал событий Unity Engine</span>
                <button
                  onClick={onClearConsole}
                  className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {consoleLogs.length === 0 ? (
                  <div className="text-neutral-500 italic py-4 text-center">Консоль пуста</div>
                ) : (
                  consoleLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-2 text-[11px] py-0.5 px-1 rounded ${
                        log.type === 'error'
                          ? 'text-red-400 bg-red-950/30'
                          : log.type === 'warning'
                          ? 'text-amber-400 bg-amber-950/30'
                          : 'text-neutral-300 hover:bg-neutral-800/30'
                      }`}
                    >
                      <span className="text-neutral-500 text-[10px] shrink-0">[{log.time}]</span>
                      <span className="break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO / RELAXING SOUNDTRACKS */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Component: AudioMixer.cs */}
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-3">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800/80">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <Music className="w-4 h-4" />
                    <span>Component: AudioMixer.cs (4 Саундтрека)</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Procedural Web Audio API
                  </span>
                </div>

                {/* Volume Sliders & Master Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 mb-3 border-b border-neutral-800/80">
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        Громкость релакс-музыки
                      </span>
                      <span className="text-cyan-400 font-bold">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={musicVolume}
                      onChange={(e) => onUpdateMusicVolume?.(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Громкость звуковых эффектов (SFX)
                      </span>
                      <span className="text-amber-400 font-bold">{Math.round(sfxVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={sfxVolume}
                      onChange={(e) => onUpdateSfxVolume?.(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Playback Controls & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPrevTrack}
                      className="p-1.5 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-700/80 transition-colors"
                      title="Предыдущий трек"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onToggleMusic}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                        isMusicPlaying
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      {isMusicPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isMusicPlaying ? 'Музыка играет' : 'Музыка на паузе'}</span>
                    </button>

                    <button
                      onClick={onNextTrack}
                      className="p-1.5 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-700/80 transition-colors"
                      title="Следующий трек [M]"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onToggleMute}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                        isMuted
                          ? 'bg-red-950/70 border-red-800 text-red-300'
                          : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white'
                      }`}
                      title={isMuted ? 'Включить звук' : 'Выключить звук'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{isMuted ? 'Звук выкл' : 'Звук вкл'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                    <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      Горячая клавиша: <strong className="text-cyan-300">[M]</strong>
                    </span>
                    {currentTrack && (
                      <span className="text-cyan-300 font-semibold truncate max-w-[200px]">
                        Сейчас: {currentTrack.icon} {currentTrack.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4 Relaxing Tracks Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {RELAXING_TRACKS.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => onSelectTrack?.(track.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-cyan-950/60 border-cyan-500/90 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg shrink-0">{track.icon}</span>
                          <div className="truncate">
                            <span className="font-bold text-xs text-white truncate block">
                              {idx + 1}. {track.title}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {track.genre}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-mono shrink-0 font-semibold ${
                            isCurrent
                              ? 'bg-cyan-400 text-neutral-950 shadow-sm'
                              : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                          }`}
                        >
                          {isCurrent ? (isMusicPlaying ? '▶ Играет' : '⏸ Пауза') : 'Выбрать'}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-300 leading-relaxed mb-1.5">
                        {track.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-1.5 border-t border-neutral-800/60">
                        <span>Настроение: <strong className="text-neutral-200">{track.mood}</strong></span>
                        <span className="text-neutral-500">Бесшовный чилл</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
