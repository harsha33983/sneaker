'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Rotate3d, Play, Pause, Sparkles, MoveHorizontal, RotateCcw } from 'lucide-react';

const FRAME_COUNT = 120;
const FRAME_W = 1280;
const FRAME_H = 720;
const BASE_URL = 'https://prompts.picsmob.com/frames/nova/';

function frameSrc(index: number): string {
  const padded = String(index + 1).padStart(4, '0');
  return `${BASE_URL}frame_${padded}.jpg`;
}

interface HeroSneakerCanvasProps {
  onFrameChange?: (index: number) => void;
}

export default function HeroSneakerCanvas({ onFrameChange }: HeroSneakerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));

  const [loadedCount, setLoadedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
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

  // Sync state to refs
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

      // Fill canvas with pure black #010101 matching the frame background
      ctx.fillStyle = '#010101';
      ctx.fillRect(0, 0, cw, ch);

      // On wide screens (desktop), position the sneaker toward center-right
      // so editorial typography on the left doesn't obscure the shoe.
      const isDesktop = cw >= 960 * (window.devicePixelRatio || 1);
      const targetCenterX = isDesktop ? cw * 0.60 : cw * 0.50;
      const targetCenterY = isDesktop ? ch * 0.50 : ch * 0.54;

      // Maximize scale across full hero stage while preserving aspect ratio
      const maxAvailableW = isDesktop ? cw * 0.75 : cw * 0.98;
      const maxAvailableH = isDesktop ? ch * 0.88 : ch * 0.65;
      const scale = Math.min(maxAvailableW / FRAME_W, maxAvailableH / FRAME_H);

      const dw = FRAME_W * scale;
      const dh = FRAME_H * scale;
      const dx = targetCenterX - dw / 2;
      const dy = targetCenterY - dh / 2;

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

    // Step A: Load frame 0 immediately and draw
    const initialImg = new Image();
    initialImg.src = frameSrc(0);
    initialImg.onload = () => {
      if (!active) return;
      imagesRef.current[0] = initialImg;
      setLoadedCount(1);
      renderFrame(0);
    };

    // Step B: Stream remaining 119 frames in parallel workers
    const loadRemaining = async () => {
      const pool = 8;
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

  // 3. Scroll-Linked Rotation when visitor scrolls through Hero
  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingRef.current) return;
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // Only apply scroll control while scrolling down through hero
      if (scrollY > 10 && scrollY <= heroHeight * 1.5) {
        isPlayingRef.current = false;
        setIsPlaying(false);

        const scrollProgress = Math.min(1, Math.max(0, scrollY / (heroHeight * 1.2)));
        const targetFrame = Math.round(scrollProgress * (FRAME_COUNT - 1));

        frameProgressRef.current = targetFrame;
        renderFrame(targetFrame);
        setCurrentFrameIndex(targetFrame);
        onFrameChange?.(targetFrame);
      } else if (scrollY <= 5 && !isPlayingRef.current && !isDraggingRef.current) {
        // When back at top, restore auto spin
        isPlayingRef.current = true;
        setIsPlaying(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [renderFrame, onFrameChange]);

  // 4. Animation Loop (smooth cinematic rotation on load)
  useEffect(() => {
    let lastTime = performance.now();
    const targetFps = 36;
    const frameInterval = 1000 / targetFps;

    const loop = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(loop);

      const delta = currentTime - lastTime;
      if (delta < frameInterval) return;
      lastTime = currentTime - (delta % frameInterval);

      if (isPlayingRef.current && !isDraggingRef.current) {
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
          onFrameChange?.(frameIdx);
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderFrame, onFrameChange]);

  // 5. Pointer Drag & Touch Scrubbing Handlers across full Hero
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only respond to primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    isDraggingRef.current = true;
    setHasInteracted(true);
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
    // 6 pixels dragged corresponds to 1 photo frame
    const deltaFrames = dx / 6;
    let nextFrame = dragStartFrameRef.current + deltaFrames;

    // Wrap around 0..119 seamlessly for 360 spin
    nextFrame = ((nextFrame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    frameProgressRef.current = nextFrame;

    const frameIdx = Math.round(nextFrame);
    renderFrame(frameIdx);
    setCurrentFrameIndex(frameIdx);
    onFrameChange?.(frameIdx);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;

    // Auto-resume continuous spin after 3 seconds of user inactivity
    if (isPlayingRef.current) {
      resumeTimerRef.current = setTimeout(() => {
        // Resumes smoothly
      }, 3000);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const resetAngle = (e: React.MouseEvent) => {
    e.stopPropagation();
    frameProgressRef.current = 0;
    renderFrame(0);
    setCurrentFrameIndex(0);
    onFrameChange?.(0);
  };

  const progressPercent = Math.min(100, Math.round((loadedCount / FRAME_COUNT) * 100));

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute inset-0 w-full h-full select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      title="Drag left/right anywhere across the hero to rotate sneaker 360°"
    >
      {/* Pure black background with radial glow centered on the sneaker */}
      <div className="absolute inset-0 bg-[#010101]" />
      <div className="absolute top-1/2 left-1/2 md:left-[60%] -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[900px] h-[500px] md:h-[600px] bg-[radial-gradient(circle_at_center,rgba(215,255,69,0.14)_0%,rgba(255,106,31,0.09)_35%,transparent_70%)] pointer-events-none" />

      {/* The 120-Frame Full Stage Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Subtle left-side dark vignette to give contrast to editorial typography */}
      <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-transparent pointer-events-none z-[1]" />
      {/* Bottom fade into the page body */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent pointer-events-none z-[1]" />

      {/* Interactive HUD Overlay Bar */}
      <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-3 pointer-events-auto">
        {/* Drag Hint Pill (fades away after user interacts) */}
        {!hasInteracted && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/90 backdrop-blur-md border border-[#D7FF45]/40 text-[11px] font-mono text-[#F5F3EE] animate-pulse">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#D7FF45]" />
            <span>DRAG ANYWHERE TO ROTATE 360°</span>
          </div>
        )}

        {/* 360 Control Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161616]/90 backdrop-blur-md border border-[#333333] shadow-xl text-xs text-[#F5F3EE]">
          <button
            type="button"
            onClick={togglePlay}
            className="p-1 rounded-full hover:text-[#D7FF45] transition-colors"
            title={isPlaying ? 'Pause auto-spin' : 'Play auto-spin'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <span className="w-px h-3 bg-[#333333]" />

          <button
            type="button"
            onClick={resetAngle}
            className="p-1 rounded-full hover:text-[#D7FF45] transition-colors"
            title="Reset to side profile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3 bg-[#333333]" />

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#A4A19B]">
            <Rotate3d className="w-3.5 h-3.5 text-[#D7FF45]" />
            <span>{String(currentFrameIndex + 1).padStart(3, '0')} / 120</span>
          </div>
        </div>
      </div>

      {/* Top Right 360 Status Indicator */}
      <div className="absolute top-28 right-6 md:right-12 z-20 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616]/80 backdrop-blur-md border border-[#2d2d2d] text-[10px] font-mono text-[#D7FF45] uppercase tracking-wider pointer-events-none">
        <Sparkles className="w-3 h-3 text-[#D7FF45]" />
        <span>120-FRAME INTERACTIVE STUDIO</span>
      </div>

      {/* Frame Loading Stream Bar */}
      {progressPercent < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] overflow-hidden z-30">
          <div
            className="h-full bg-gradient-to-r from-[#D7FF45] via-[#ff6a1f] to-[#D7FF45] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
