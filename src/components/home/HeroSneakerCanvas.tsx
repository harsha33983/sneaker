'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Rotate3d, Play, Pause, Sparkles, MoveHorizontal } from 'lucide-react';

const FRAME_COUNT = 120;
const FRAME_W = 1280;
const FRAME_H = 720;
const BASE_URL = 'https://prompts.picsmob.com/frames/nova/';

function frameSrc(index: number): string {
  const padded = String(index + 1).padStart(4, '0');
  return `${BASE_URL}frame_${padded}.jpg`;
}

export default function HeroSneakerCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));

  const [loadedCount, setLoadedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Animation & physics refs
  const frameProgressRef = useRef(0); // 0 to 119 float
  const directionRef = useRef(1); // 1 = forward, -1 = reverse (ping-pong)
  const isPlayingRef = useRef(true);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const animFrameIdRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Find nearest loaded frame if current target is not loaded
  const getNearestLoadedImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (images[targetIndex]?.complete && images[targetIndex]?.naturalWidth) {
      return images[targetIndex];
    }
    // Search outwards for nearest loaded frame
    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      const left = (targetIndex - offset + FRAME_COUNT) % FRAME_COUNT;
      if (images[left]?.complete && images[left]?.naturalWidth) return images[left];
      const right = (targetIndex + offset) % FRAME_COUNT;
      if (images[right]?.complete && images[right]?.naturalWidth) return images[right];
    }
    return null;
  }, []);

  // Draw a specific frame to canvas
  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = getNearestLoadedImage(index);
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;

      // Fill canvas background with pure black #010101 to match frame background seamlessly
      ctx.fillStyle = '#010101';
      ctx.fillRect(0, 0, cw, ch);

      // Contain scaling
      const scale = Math.min(cw / FRAME_W, ch / FRAME_H);
      const dw = FRAME_W * scale;
      const dh = FRAME_H * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H, dx, dy, dw, dh);
      lastDrawnFrameRef.current = index;
    },
    [getNearestLoadedImage]
  );

  // Handle canvas sizing for sharp retina rendering
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      if (lastDrawnFrameRef.current >= 0) {
        renderFrame(lastDrawnFrameRef.current);
      }
    }
  }, [renderFrame]);

  // 1. Initial Frame Loading Stream
  useEffect(() => {
    let active = true;

    // Step A: Preload frame 0 immediately and draw as soon as available
    const initialImg = new Image();
    initialImg.src = frameSrc(0);
    initialImg.onload = () => {
      if (!active) return;
      imagesRef.current[0] = initialImg;
      setLoadedCount(1);
      renderFrame(0);
    };

    // Step B: Stream remaining frames in batches of 6 workers
    const loadRemaining = async () => {
      const pool = 6;
      let nextIndex = 1;

      const worker = async () => {
        while (nextIndex < FRAME_COUNT && active) {
          const idx = nextIndex++;
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.src = frameSrc(idx);
            img.onload = () => {
              if (active) {
                imagesRef.current[idx] = img;
                setLoadedCount((c) => c + 1);
              }
              resolve();
            };
            img.onerror = () => resolve();
          });
        }
      };

      const workers = Array.from({ length: pool }, () => worker());
      await Promise.all(workers);
    };

    loadRemaining();

    return () => {
      active = false;
    };
  }, [renderFrame]);

  // 2. Setup Resize Listener
  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', resizeCanvas);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  // 3. Animation Loop (60fps requestAnimationFrame)
  useEffect(() => {
    let lastTime = performance.now();
    const targetFps = 36; // 36 fps creates an ultra-cinematic luxury rotation speed
    const frameInterval = 1000 / targetFps;

    const loop = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(loop);

      const delta = currentTime - lastTime;
      if (delta < frameInterval) return;
      lastTime = currentTime - (delta % frameInterval);

      if (isPlayingRef.current && !isDraggingRef.current) {
        // Ping-pong smooth rotation: 0 -> 119 -> 0
        let next = frameProgressRef.current + directionRef.current * 0.75;
        if (next >= FRAME_COUNT - 1) {
          next = FRAME_COUNT - 1;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }
        frameProgressRef.current = next;

        const frameIdx = Math.round(next);
        if (frameIdx !== lastDrawnFrameRef.current) {
          renderFrame(frameIdx);
          setCurrentFrameIndex(frameIdx);
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderFrame]);

  // 4. Pointer Drag & Touch Scrubbing Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = frameProgressRef.current;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartXRef.current;
    // Every 5 pixels dragged corresponds to 1 photo frame
    const deltaFrames = dx / 5;
    let nextFrame = dragStartFrameRef.current + deltaFrames;

    // Wrap around 0..119 seamlessly for 360 spin
    nextFrame = ((nextFrame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    frameProgressRef.current = nextFrame;

    const frameIdx = Math.round(nextFrame);
    renderFrame(frameIdx);
    setCurrentFrameIndex(frameIdx);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;

    // Auto-resume continuous spin after 2.5 seconds of user inactivity
    if (isPlayingRef.current) {
      resumeTimerRef.current = setTimeout(() => {
        // Keep current direction
      }, 2500);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const progressPercent = Math.min(100, Math.round((loadedCount / FRAME_COUNT) * 100));

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full aspect-square max-w-[560px] mx-auto rounded-3xl overflow-hidden bg-[#010101] border border-[#2d2d2d] shadow-2xl transition-all duration-300 select-none touch-none ${
        isDragging ? 'cursor-grabbing border-[#D7FF45]/60' : 'cursor-grab hover:border-[#D7FF45]/40'
      }`}
      title="Drag left/right to rotate sneaker 360°"
    >
      {/* Radial backlight glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,255,69,0.12)_0%,rgba(255,106,31,0.08)_35%,transparent_70%)] pointer-events-none" />

      {/* The 120-Frame Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-contain pointer-events-none"
      />

      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#333333] text-[10px] font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
          <Sparkles className="w-3 h-3" />
          <span>360° ARCHIVAL ROTATION</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#333333] text-[10px] font-mono text-[#A4A19B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF45] animate-pulse" />
          <span>{String(currentFrameIndex + 1).padStart(3, '0')} / 120</span>
        </div>
      </div>

      {/* Center Drag Hint (Fades out when interacting) */}
      {!isDragging && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="px-4 py-2 rounded-full bg-[#111111]/90 backdrop-blur-md border border-[#D7FF45]/40 text-xs font-mono text-[#F5F3EE] flex items-center gap-2 shadow-xl">
            <MoveHorizontal className="w-4 h-4 text-[#D7FF45]" />
            <span>DRAG TO ROTATE 360°</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-[#111111]/85 backdrop-blur-md border border-[#2e2e2e] z-10">
        <div>
          <span className="text-[10px] font-mono text-[#D7FF45] uppercase tracking-wider block font-bold">
            FLAGSHIP SILHOUETTE
          </span>
          <span className="font-[family-name:var(--font-space)] text-xs md:text-sm font-bold text-[#F5F3EE]">
            PHANTOM PULSE 01
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="p-2 rounded-xl bg-[#202020] hover:bg-[#2c2c2c] text-[#F5F3EE] hover:text-[#D7FF45] border border-[#383838] transition-colors"
            title={isPlaying ? 'Pause auto-spin' : 'Resume auto-spin'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Interactive Scrub Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1a1a] border border-[#333333] text-[10px] font-mono text-[#A4A19B]">
            <Rotate3d className="w-3.5 h-3.5 text-[#D7FF45]" />
            <span>INTERACTIVE</span>
          </div>
        </div>
      </div>

      {/* Frame Loading Progress Bar (visible until all 120 frames cached) */}
      {progressPercent < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] overflow-hidden z-20">
          <div
            className="h-full bg-gradient-to-r from-[#D7FF45] to-[#ff6a1f] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
