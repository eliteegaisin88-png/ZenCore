/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { LEVELS } from './game/levels';
import { UnityHeader } from './components/UnityHeader';
import { UnityInspector } from './components/UnityInspector';
import { GameHUD } from './components/GameHUD';
import { TouchControls } from './components/TouchControls';
import { VictoryModal } from './components/VictoryModal';
import { WorldMapModal } from './components/WorldMapModal';
import { soundSystem, MusicTrack } from './audio/soundSystem';
import {
  PlayerConfig,
  UnityGameObject,
  ConsoleLogItem,
} from './types/game';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Game state
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevelIndexRef = useRef(0);
  currentLevelIndexRef.current = currentLevelIndex;

  const [isWorldMapOpen, setIsWorldMapOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'third' | 'close' | 'top'>('third');
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Relaxing Music & Audio state
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(() => soundSystem.getCurrentTrack());
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(() => soundSystem.isMusicPlaying());
  const [musicVolume, setMusicVolume] = useState<number>(() => soundSystem.getMusicVolume());
  const [sfxVolume, setSfxVolume] = useState<number>(() => soundSystem.getSfxVolume());
  const [musicToast, setMusicToast] = useState<string | null>(null);

  // Stats
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);
  const [triangles, setTriangles] = useState(0);

  // Level progression
  const [coresCollected, setCoresCollected] = useState(0);
  const [totalCores, setTotalCores] = useState(2);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [victoryTime, setVictoryTime] = useState(0);

  // Inspector state
  const [playerConfig, setPlayerConfig] = useState<PlayerConfig>({
    moveSpeed: 9.0,
    sprintSpeed: 14.5,
    jumpForce: 12.0,
    gravity: 28.0,
    doubleJump: true,
    color: '#0284c7',
    glowColor: '#38bdf8',
    invulnerable: false,
    mouseSensitivity: 1.0,
    invertY: false,
    characterSkin: 'robot',
    slowMotion: false,
    particleQuality: 'epic',
    speedLines: true,
  });
  const [gameObjects, setGameObjects] = useState<UnityGameObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogItem[]>([]);

  // Initialize GameEngine
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new GameEngine(containerRef.current, {
      onCoresUpdate: (collected, total) => {
        setCoresCollected(collected);
        setTotalCores(total);
      },
      onTimeUpdate: (seconds) => {
        setElapsedTime(seconds);
      },
      onInteractPrompt: (prompt) => {
        setInteractPrompt(prompt);
      },
      onConsoleLog: (log) => {
        setConsoleLogs((prev) => [log, ...prev.slice(0, 49)]);
      },
      onVictory: (timeSeconds) => {
        setVictoryTime(timeSeconds);
        setIsVictory(true);
        try {
          const lvl = LEVELS[currentLevelIndexRef.current] || LEVELS[0];
          const saved = localStorage.getItem('warpbound_progress');
          const progress = saved ? JSON.parse(saved) : {};
          const timeStar = timeSeconds <= (lvl.targetTimeSeconds || 60);
          const stars = 2 + (timeStar ? 1 : 0);
          const prev = progress[lvl.id] || { stars: 0, bestTime: 999999 };
          progress[lvl.id] = {
            stars: Math.max(prev.stars || 0, stars),
            bestTime: Math.min(prev.bestTime || 999999, timeSeconds),
          };
          localStorage.setItem('warpbound_progress', JSON.stringify(progress));
        } catch {
          // ignore
        }
      },
      onGameObjectList: (objects) => {
        setGameObjects(objects);
      },
      onFpsUpdate: (currentFps, calls, tris) => {
        setFps(currentFps);
        setDrawCalls(calls);
        setTriangles(tris);
      },
      onPointerLockChange: (locked) => {
        setIsPointerLocked(locked);
      },
      onCameraModeChange: (mode) => {
        setCameraMode(mode);
      },
      onConfigChange: (config) => {
        setPlayerConfig({ ...config });
      },
      onOpenMap: () => {
        setIsWorldMapOpen((prev) => !prev);
      },
    });

    engineRef.current = engine;
    engine.loadLevel(LEVELS[0]);

    // Start subtle ambient sound on first user click
    const handleFirstInteraction = () => {
      soundSystem.startAmbient();
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Listen for procedural relaxing track changes (from header, inspector, or [M] key)
  useEffect(() => {
    let timer: number | undefined;
    const handleTrackChange = (track: MusicTrack) => {
      setCurrentTrack({ ...track });
      setIsMusicPlaying(soundSystem.isMusicPlaying());
      setMusicToast(`${track.icon} ${track.title} • ${track.genre}`);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setMusicToast(null);
      }, 3500);
    };

    soundSystem.addTrackChangeListener(handleTrackChange);
    return () => {
      soundSystem.removeTrackChangeListener(handleTrackChange);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // Relaxing Music Handlers
  const handleSelectTrack = useCallback((trackId: string) => {
    soundSystem.selectTrack(trackId);
    setCurrentTrack(soundSystem.getCurrentTrack());
    setIsMusicPlaying(soundSystem.isMusicPlaying());
  }, []);

  const handleNextTrack = useCallback(() => {
    const next = soundSystem.nextTrack();
    setCurrentTrack({ ...next });
    setIsMusicPlaying(soundSystem.isMusicPlaying());
  }, []);

  const handlePrevTrack = useCallback(() => {
    const prev = soundSystem.prevTrack();
    setCurrentTrack({ ...prev });
    setIsMusicPlaying(soundSystem.isMusicPlaying());
  }, []);

  const handleToggleMusic = useCallback(() => {
    const playing = soundSystem.toggleMusic();
    setIsMusicPlaying(playing);
  }, []);

  const handleUpdateMusicVolume = useCallback((vol: number) => {
    soundSystem.setMusicVolume(vol);
    setMusicVolume(vol);
  }, []);

  const handleUpdateSfxVolume = useCallback((vol: number) => {
    soundSystem.setSfxVolume(vol);
    setSfxVolume(vol);
  }, []);

  // Level selector
  const handleSelectLevel = useCallback((index: number) => {
    if (!engineRef.current) return;
    setCurrentLevelIndex(index);
    setIsVictory(false);
    setIsPaused(false);
    engineRef.current.loadLevel(LEVELS[index]);
  }, []);

  const handleNextLevel = useCallback(() => {
    const nextIdx = currentLevelIndex + 1;
    if (nextIdx < LEVELS.length) {
      handleSelectLevel(nextIdx);
    }
  }, [currentLevelIndex, handleSelectLevel]);

  const handleReplay = useCallback(() => {
    handleSelectLevel(currentLevelIndex);
  }, [currentLevelIndex, handleSelectLevel]);

  const handleResetLevel = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.resetPlayerToCheckpoint();
  }, []);

  const handleTogglePause = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.togglePause();
    setIsPaused((prev) => !prev);
  }, []);

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundSystem.setMuted(newMuted);
  }, [isMuted]);

  const handleToggleCameraMode = useCallback((mode: 'third' | 'close' | 'top') => {
    setCameraMode(mode);
    if (engineRef.current) {
      engineRef.current.setViewPerspective(mode);
    }
  }, []);

  const handleRequestPointerLock = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.requestPointerLock();
    }
  }, []);

  const handleUpdatePlayerConfig = useCallback((config: Partial<PlayerConfig>) => {
    setPlayerConfig((prev) => {
      const updated = { ...prev, ...config };
      if (engineRef.current) {
        engineRef.current.updatePlayerConfig(updated);
      }
      return updated;
    });
  }, []);

  const handleSelectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id);
    if (engineRef.current) {
      engineRef.current.selectGameObject(id);
    }
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  // Touch handlers
  const handleVirtualMove = useCallback((x: number, z: number) => {
    if (engineRef.current) {
      engineRef.current.setVirtualJoystick(x, z);
    }
  }, []);

  const handleVirtualJump = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.triggerJump();
    }
  }, []);

  const handleVirtualInteract = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.handleInteract();
    }
  }, []);

  const handleVirtualThrow = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.throwCube();
    }
  }, []);

  const handleVirtualSprint = useCallback((sprint: boolean) => {
    if (engineRef.current) {
      engineRef.current.setSprinting(sprint);
    }
  }, []);

  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans">
      {/* 3D Scene Viewport */}
      <div
        ref={containerRef}
        onClick={handleRequestPointerLock}
        className="absolute inset-0 w-full h-full cursor-crosshair active:cursor-grabbing"
      />

      {/* Unity Top Toolbar */}
      <UnityHeader
        levels={LEVELS}
        currentLevelIndex={currentLevelIndex}
        onSelectLevel={handleSelectLevel}
        onOpenWorldMap={() => setIsWorldMapOpen(true)}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onResetLevel={handleResetLevel}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isEditorOpen={isEditorOpen}
        onToggleEditor={() => setIsEditorOpen(!isEditorOpen)}
        cameraMode={cameraMode}
        onToggleCameraMode={handleToggleCameraMode}
        fps={fps}
        drawCalls={drawCalls}
        triangles={triangles}
        isPointerLocked={isPointerLocked}
        onRequestPointerLock={handleRequestPointerLock}
        currentTrack={currentTrack}
        isMusicPlaying={isMusicPlaying}
        onSelectTrack={handleSelectTrack}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onToggleMusic={handleToggleMusic}
        coresCollected={coresCollected}
        totalCores={totalCores}
        elapsedTime={elapsedTime}
      />

      {/* In-Game HUD */}
      <GameHUD
        currentLevel={currentLevel}
        coresCollected={coresCollected}
        totalCores={totalCores}
        elapsedTime={elapsedTime}
        interactPrompt={interactPrompt}
        isPointerLocked={isPointerLocked}
        onRequestPointerLock={handleRequestPointerLock}
        musicToast={musicToast}
      />

      {/* Unity Inspector & Hierarchy Dock */}
      <UnityInspector
        isOpen={isEditorOpen}
        onToggle={() => setIsEditorOpen(!isEditorOpen)}
        playerConfig={playerConfig}
        onUpdatePlayerConfig={handleUpdatePlayerConfig}
        gameObjects={gameObjects}
        selectedObjectId={selectedObjectId}
        onSelectObject={handleSelectObject}
        consoleLogs={consoleLogs}
        onClearConsole={handleClearConsole}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        musicVolume={musicVolume}
        onUpdateMusicVolume={handleUpdateMusicVolume}
        sfxVolume={sfxVolume}
        onUpdateSfxVolume={handleUpdateSfxVolume}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Mobile Touch Controls */}
      <TouchControls
        onMove={handleVirtualMove}
        onJump={handleVirtualJump}
        onInteract={handleVirtualInteract}
        onThrow={handleVirtualThrow}
        onSprint={handleVirtualSprint}
      />

      {/* World Map & 60-Level Browser Modal */}
      <WorldMapModal
        isOpen={isWorldMapOpen}
        onClose={() => setIsWorldMapOpen(false)}
        levels={LEVELS}
        currentLevelIndex={currentLevelIndex}
        onSelectLevel={handleSelectLevel}
      />

      {/* Victory Celebration Modal */}
      {isVictory && (
        <VictoryModal
          level={currentLevel}
          timeSeconds={victoryTime}
          coresCollected={coresCollected}
          totalCores={totalCores}
          onNextLevel={handleNextLevel}
          onReplay={handleReplay}
          onOpenWorldMap={() => {
            setIsVictory(false);
            setIsWorldMapOpen(true);
          }}
          hasNextLevel={currentLevelIndex + 1 < LEVELS.length}
        />
      )}
    </div>
  );
}
