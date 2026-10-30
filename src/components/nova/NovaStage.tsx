'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

const FRAME_COUNT = 120;
const FRAME_W = 1280;
const FRAME_H = 720;
const BASE_URL = 'https://prompts.picsmob.com/frames/nova/';

function frameSrc(i: number) {
  return BASE_URL + 'frame_' + String(i + 1).padStart(4, '0') + '.jpg';
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function band(p: number, a: number, b: number, c: number, d: number) {
  if (p < a) return 0;
  if (p >= a && p < b) return (p - a) / (b - a);
  if (p >= b && p <= c) return 1;
  if (p > c && p <= d) return 1 - (p - c) / (d - c);
  return 0;
}

interface CalloutConfig {
  anchor: { x: number; y: number };
  offset: { x: number; y: number };
  title: string;
  value: string;
  alignRight?: boolean;
}

const CALLOUTS: CalloutConfig[] = [
  {
    anchor: { x: 0.695, y: 0.25 },
    offset: { x: 150, y: -70 },
    title: 'Glow heel loop',
    value: 'Seen at 200 m',
  },
  {
    anchor: { x: 0.55, y: 0.40 },
    offset: { x: 340, y: 60 },
    title: 'Engineered mesh',
    value: '198 g, size 9',
  },
  {
    anchor: { x: 0.42, y: 0.58 },
    offset: { x: -250, y: 90 },
    title: 'Nova Foam + light strip',
    value: '38% more return',
    alignRight: true,
  },
];

export default function NovaStage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stepText, setStepText] = useState('01 / 03');

  // Animation values
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastDrawnIndexRef = useRef(-1);

  // Screen transform for canvas & callouts
  const transformRef = useRef({ scale: 1, dx: 0, dy: 0, w: 0, h: 0 });

  // Callout SVGs and points
  const [calloutCoords, setCalloutCoords] = useState<
    { ax: number; ay: number; lx: number; ly: number; len: number }[]
  >([]);

  // 1. Initial Frame Loading & 6 Parallel Workers
  useEffect(() => {
    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    if (mq.matches) {
      // Load frame 120 only
      const img120 = new Image();
      img120.src = frameSrc(119);
      img120.onload = () => {
        imagesRef.current[119] = img120;
        setLoadedCount(120);
        drawFrame(119);
      };
      return;
    }

    // Step A: Load frame 1 first and draw immediately
    const img1 = new Image();
    img1.src = frameSrc(0);
    img1.onload = () => {
      imagesRef.current[0] = img1;
      setLoadedCount((c) => c + 1);
      drawFrame(0);

      // Step B: Load remaining 119 frames with 6 parallel worker queues
      const queue: number[] = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        queue.push(i);
      }

      const CONCURRENCY = 6;
      let active = 0;

      const loadNext = () => {
        if (queue.length === 0) return;
        const index = queue.shift()!;
        active++;

        const img = new Image();
        img.src = frameSrc(index);
        img.onload = img.onerror = () => {
          imagesRef.current[index] = img;
          setLoadedCount((c) => c + 1);
          active--;
          loadNext();
        };
      };

      for (let w = 0; w < CONCURRENCY; w++) {
        loadNext();
      }
    };
  }, []);

  // 2. Window Resize & Canvas Dimensions
  const handleResize = () => {
    if (!canvasRef.current || !stageRef.current) return;
    const canvas = canvasRef.current;
    const w = stageRef.current.clientWidth;
    const h = stageRef.current.clientHeight;

    const mobile = w < 760;
    setIsMobile(mobile);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    let scale: number;
    let dx: number;
    let dy: number;

    if (w >= h) {
      // Wide screens: "cover" the frame, centered
      scale = Math.max(w / FRAME_W, h / FRAME_H);
      dx = (w - FRAME_W * scale) / 2;
      dy = (h - FRAME_H * scale) / 2;
    } else {
      // Tall screens (phones): scale = (w * 1.35) / 1280
      scale = (w * 1.35) / FRAME_W;
      dx = (w - FRAME_W * scale) / 2;
      dy = h * 0.46 - (FRAME_H * scale) / 2;
    }

    transformRef.current = { scale, dx, dy, w, h };

    // Compute callout coordinates in screen pixels
    const coords = CALLOUTS.map((c) => {
      const ax = dx + c.anchor.x * FRAME_W * scale;
      const ay = dy + c.anchor.y * FRAME_H * scale;
      const lx = ax + c.offset.x;
      const ly = ay + c.offset.y;
      const len = Math.hypot(c.offset.x, c.offset.y);
      return { ax, ay, lx, ly, len };
    });
    setCalloutCoords(coords);

    // Redraw current frame
    if (lastDrawnIndexRef.current >= 0) {
      drawFrame(lastDrawnIndexRef.current);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Draw Frame Function
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { scale, dx, dy, w, h } = transformRef.current;
    if (w === 0 || h === 0) return;

    // Find nearest loaded image
    let img: HTMLImageElement | null = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded before it
      for (let k = index; k >= 0; k--) {
        if (imagesRef.current[k] && imagesRef.current[k]!.complete && imagesRef.current[k]!.naturalWidth > 0) {
          img = imagesRef.current[k];
          break;
        }
      }
      // If none before, search after
      if (!img) {
        for (let k = index + 1; k < FRAME_COUNT; k++) {
          if (imagesRef.current[k] && imagesRef.current[k]!.complete && imagesRef.current[k]!.naturalWidth > 0) {
            img = imagesRef.current[k];
            break;
          }
        }
      }
    }

    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.save();
    ctx.scale(dpr, dpr);

    // Fill with pure black #010101 before each draw
    ctx.fillStyle = '#010101';
    ctx.fillRect(0, 0, w, h);

    const drawW = FRAME_W * scale;
    const drawH = FRAME_H * scale;

    ctx.drawImage(img, dx, dy, drawW, drawH);

    // Vertical gradients on tall screens (phones)
    if (w < h) {
      // Top 12% fade
      const topH = drawH * 0.12;
      const topGrad = ctx.createLinearGradient(0, dy, 0, dy + topH);
      topGrad.addColorStop(0, '#010101');
      topGrad.addColorStop(1, 'rgba(1, 1, 1, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, dy, w, topH);

      // Bottom 18% fade
      const botH = drawH * 0.18;
      const botY = dy + drawH - botH;
      const botGrad = ctx.createLinearGradient(0, botY, 0, dy + drawH);
      botGrad.addColorStop(0, 'rgba(1, 1, 1, 0)');
      botGrad.addColorStop(1, '#010101');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, botY, w, botH + 2);
    }

    ctx.restore();
    lastDrawnIndexRef.current = index;
  };

  // 4. RequestAnimationFrame Scroll Sync & Ease
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!sectionRef.current || !stageRef.current) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      const p = scrollRange > 0 ? clamp(-rect.top / scrollRange, 0, 1) : 0;

      // CSS Variables on stage element
      const b1 = band(p, -1, 0, 0.16, 0.28);
      const b2 = band(p, 0.30, 0.38, 0.54, 0.62);
      const b3 = band(p, 0.66, 0.76, 2, 3);

      const stage = stageRef.current;
      stage.style.setProperty('--p', p.toString());
      stage.style.setProperty('--b1', b1.toString());
      stage.style.setProperty('--b2', b2.toString());
      stage.style.setProperty('--b3', b3.toString());

      // Update step counter text
      if (p >= 0.64) {
        setStepText('03 / 03');
      } else if (p >= 0.3) {
        setStepText('02 / 03');
      } else {
        setStepText('01 / 03');
      }

      // Eased Frame Target
      if (!reducedMotion) {
        targetFrameRef.current = p * (FRAME_COUNT - 1);
        currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.2;
        const nextIndex = clamp(Math.round(currentFrameRef.current), 0, FRAME_COUNT - 1);

        if (nextIndex !== lastDrawnIndexRef.current) {
          drawFrame(nextIndex);
        }
      }

      // Callout Lines animation calculation
      if (b3 > 0 && !isMobile && !reducedMotion) {
        const t = clamp((p - 0.7) / 0.18, 0, 1);
        CALLOUTS.forEach((_, n) => {
          const prog = clamp(t * 1.6 - n * 0.3, 0, 1);
          stage.style.setProperty(`--callout-${n}`, prog.toString());
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion, isMobile]);

  return (
    <section ref={sectionRef} id="tech" className="nova-scroll-section">
      <div ref={stageRef} className="nova-sticky-stage">
        {/* Layer 0: Giant Words */}
        <div className="nova-giant-word nova-giant-run">RUN</div>
        <div className="nova-giant-word nova-giant-light">LIGHT</div>

        {/* Layer 1: Canvas with mix-blend-mode: screen */}
        <canvas ref={canvasRef} className="nova-canvas" />

        {/* Loading Bar across bottom until all 120 frames load */}
        {loadedCount < FRAME_COUNT && !reducedMotion && (
          <div className="nova-loading-bar">
            <div
              className="nova-loading-fill"
              style={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }}
            />
          </div>
        )}

        {/* Layer 2: Overlay with all text and beats */}
        <div className="nova-overlay">
          {/* Beat 1 */}
          <div className="nova-beat-1">
            <div className="mono nova-beat-1-kicker">Nova 01 — road runner</div>
            <div className="nova-beat-1-text">
              The lightest shoe we have ever made. Scroll to turn it.
            </div>
          </div>

          {/* Beat 2 */}
          <div className="nova-beat-2">
            <div className="nova-beat-2-left">
              FEELS <br />
              LIKE <br />
              <span className="orange">NOTHING.</span>
            </div>
            <div className="nova-beat-2-right">
              <p className="nova-beat-2-body">
                One piece of foam, tuned to give back more than you put in. A light strip runs through
                it, so you are seen before you are heard.
              </p>
              <div>
                <div className="nova-beat-2-stat">
                  198<span className="unit">g</span>
                </div>
                <div className="mono" style={{ marginTop: '4px' }}>
                  Size 9, the lightest in its class
                </div>
              </div>
            </div>
          </div>

          {/* Beat 3 */}
          <div className="nova-beat-3">
            {/* Desktop: SVG lines and anchor dots */}
            {!isMobile && (
              <svg className="nova-beat-3-svg">
                {calloutCoords.map((coord, idx) => {
                  return (
                    <line
                      key={idx}
                      x1={coord.ax}
                      y1={coord.ay}
                      x2={coord.lx}
                      y2={coord.ly}
                      stroke="rgba(243, 236, 226, 0.7)"
                      strokeWidth="1"
                      strokeDasharray={coord.len}
                      style={{
                        strokeDashoffset: `calc(${coord.len} * (1 - var(--callout-${idx}, ${reducedMotion ? 1 : 0})))`,
                        willChange: 'stroke-dashoffset',
                      }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Desktop: Dots & Labels */}
            {!isMobile &&
              calloutCoords.map((coord, idx) => {
                const conf = CALLOUTS[idx];
                return (
                  <React.Fragment key={idx}>
                    {/* Anchor Dot */}
                    <div
                      className="nova-callout-dot"
                      style={{
                        left: `${coord.ax}px`,
                        top: `${coord.ay}px`,
                        transform: `translate(-50%, -50%) scale(var(--callout-${idx}, ${reducedMotion ? 1 : 0}))`,
                      }}
                    />
                    {/* Label */}
                    <div
                      className="nova-callout-label"
                      style={{
                        left: `${coord.lx}px`,
                        top: `${coord.ly}px`,
                        transform: conf.alignRight ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
                        textAlign: conf.alignRight ? 'right' : 'left',
                        opacity: `var(--callout-${idx}, ${reducedMotion ? 1 : 0})`,
                      }}
                    >
                      <span className="nova-callout-title">{conf.title}</span>
                      <span className="nova-callout-value">{conf.value}</span>
                    </div>
                  </React.Fragment>
                );
              })}

            {/* Mobile: List stacked at bottom */}
            {isMobile && (
              <div className="nova-mobile-callout-list">
                {CALLOUTS.map((conf, idx) => (
                  <div key={idx} className="nova-callout-label">
                    <span className="nova-callout-title">{conf.title}</span>
                    <span className="nova-callout-value">{conf.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Rail (always visible in stage) */}
          <div className="nova-progress-rail">
            <div className="nova-progress-fill" />
          </div>

          {/* Step Counter (always visible in stage) */}
          <div className="nova-step-counter">
            <span className="nova-step-active">{stepText.slice(0, 2)}</span>
            <span>{stepText.slice(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

