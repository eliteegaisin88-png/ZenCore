import React, { useRef, useState } from 'react';
import { ArrowUp, Sparkles, Zap, Flame } from 'lucide-react';

interface TouchControlsProps {
  onMove: (x: number, z: number) => void;
  onJump: () => void;
  onInteract: () => void;
  onThrow?: () => void;
  onSprint?: (sprinting: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onJump,
  onInteract,
  onThrow,
  onSprint,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [touchActive, setTouchActive] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const touchIdRef = useRef<number | null>(null);
  const baseCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      baseCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      updateKnob(touch.clientX, touch.clientY);
      setTouchActive(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMove(0, 0);
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
    const dx = clientX - baseCenterRef.current.x;
    const dy = clientY - baseCenterRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      onMove(dx / maxRadius, dy / maxRadius);
    } else {
      const angle = Math.atan2(dy, dx);
      const nx = Math.cos(angle) * maxRadius;
      const ny = Math.sin(angle) * maxRadius;
      setKnobPos({ x: nx, y: ny });
      onMove(Math.cos(angle), Math.sin(angle));
    }
  };

  const handleToggleSprint = () => {
    const next = !isSprinting;
    setIsSprinting(next);
    onSprint?.(next);
  };

  return (
    <div className="md:hidden pointer-events-none fixed inset-0 z-20 select-none overflow-hidden flex justify-between items-end p-5 pb-8">
      {/* Left: Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto relative w-32 h-32 rounded-full bg-neutral-900/70 backdrop-blur-md border border-neutral-700/70 flex items-center justify-center shadow-2xl"
      >
        <div
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
          className={`w-14 h-14 rounded-full border shadow-lg transition-transform duration-75 flex items-center justify-center ${
            touchActive
              ? 'bg-cyan-500/80 border-cyan-300 scale-105'
              : 'bg-neutral-800/90 border-neutral-600'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white/70" />
        </div>
      </div>

      {/* Right: Action Buttons (Sprint, Interact, Throw, Jump) */}
      <div className="pointer-events-auto flex flex-col items-end gap-2.5">
        <div className="flex items-center gap-2">
          {/* Sprint Toggle Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleToggleSprint();
            }}
            className={`w-12 h-12 rounded-full font-mono font-bold flex flex-col items-center justify-center border shadow-lg backdrop-blur-md transition-all ${
              isSprinting
                ? 'bg-amber-600 text-white border-amber-300 scale-105'
                : 'bg-neutral-800/90 text-neutral-300 border-neutral-600'
            }`}
          >
            <Flame className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">БЕГ</span>
          </button>

          {/* Throw Cube Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onThrow?.();
            }}
            className="w-12 h-12 rounded-full bg-emerald-600/90 active:bg-emerald-500 text-white font-mono font-bold flex flex-col items-center justify-center border border-emerald-400 shadow-lg backdrop-blur-md"
          >
            <Zap className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">БРОСИТЬ</span>
          </button>
        </div>

        <div className="flex items-end gap-2.5">
          {/* Interact / Grab Cube Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onInteract();
            }}
            className="w-16 h-16 rounded-full bg-cyan-600/90 active:bg-cyan-500 text-white font-mono font-bold flex flex-col items-center justify-center border border-cyan-400 shadow-xl backdrop-blur-md"
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">ВЗЯТЬ</span>
          </button>

          {/* Jump Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onJump();
            }}
            className="w-20 h-20 rounded-full bg-blue-600/90 active:bg-blue-500 text-white font-mono font-bold flex flex-col items-center justify-center border border-blue-400 shadow-xl backdrop-blur-md"
          >
            <ArrowUp className="w-6 h-6 mb-0.5" />
            <span className="text-xs">ПРЫЖОК</span>
          </button>
        </div>
      </div>
    </div>
  );
};
