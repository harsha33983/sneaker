'use client';

import React, { useEffect, useState } from 'react';
import NovaStage from '@/components/nova/NovaStage';
import './nova.css';

const SIZES = [6, 7, 8, 9, 10, 11, 12];

export default function NovaPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number>(9);
  const [reserved, setReserved] = useState(false);

  // Nav blur & background after 4 screen heights
  useEffect(() => {
    const handleScroll = () => {
      const fourHeights = window.innerHeight * 4;
      setNavScrolled(window.scrollY > fourHeights);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for reveal sections below stage
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Preload frame 1
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = 'https://prompts.picsmob.com/frames/nova/frame_0001.jpg';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handlePreorderClick = () => {
    setReserved(true);
  };

  return (
    <div className="nova-page">
      {/* Fixed Nav */}
      <nav className={`nova-nav ${navScrolled ? 'scrolled' : ''}`}>
        <a href="#tech" className="nova-nav-logo">
          NOVA
        </a>

        <div className="nova-nav-links">
          <a href="#tech">Tech</a>
          <a href="#specs">Specs</a>
          <a href="#order">Stores</a>
        </div>

        <a href="#order" className="btn-pill btn-orange btn-sm">
          Pre-order ₹12,999
        </a>
      </nav>

      {/* The Scroll Stage (500vh with 120-frame canvas & 3 beats) */}
      <NovaStage />

      {/* Below the Stage: 1. Specs */}
      <section id="specs" className="nova-section reveal-on-scroll">
        <div className="mono" style={{ color: 'var(--orange)' }}>
          The numbers
        </div>
        <h2 className="nova-section-heading">
          Made to disappear <br />
          on your foot.
        </h2>

        <div className="nova-specs-grid">
          <div className="nova-spec-col">
            <div className="nova-spec-num">198 g</div>
            <div className="mono">Weight</div>
            <p className="nova-spec-desc">Size 9. Lighter than most racing flats.</p>
          </div>

          <div className="nova-spec-col">
            <div className="nova-spec-num">38%</div>
            <div className="mono">Energy return</div>
            <p className="nova-spec-desc">Nova Foam gives back more with every stride.</p>
          </div>

          <div className="nova-spec-col">
            <div className="nova-spec-num">8 mm</div>
            <div className="mono">Drop</div>
            <p className="nova-spec-desc">Heel to toe, for an easy, rolling landing.</p>
          </div>

          <div className="nova-spec-col">
            <div className="nova-spec-num">200 m</div>
            <div className="mono">Glow</div>
            <p className="nova-spec-desc">The light strip charges in daylight, glows at night.</p>
          </div>
        </div>
      </section>

      {/* Below the Stage: 2. Pre-order */}
      <section id="order" className="nova-section reveal-on-scroll">
        <div className="nova-order-grid">
          {/* Left: Frame 120 image */}
          <div className="nova-order-media">
            <img
              src="https://prompts.picsmob.com/frames/nova/frame_0120.jpg"
              alt="Nova 01 Running Shoe - Final Profile"
              className="nova-order-img"
              loading="lazy"
            />
          </div>

          {/* Right: Order details */}
          <div className="nova-order-info">
            <div>
              <div className="mono" style={{ color: 'var(--orange)' }}>
                First drop · ships March 2027
              </div>
              <h2 className="nova-section-heading">
                Your next PB <br />
                starts here.
              </h2>
            </div>

            <div className="nova-order-price">₹12,999</div>

            <div>
              <div className="mono" style={{ marginBottom: '10px' }}>
                Pick your size (UK)
              </div>
              <div className="nova-sizes-row">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setReserved(false);
                    }}
                    className={`nova-size-btn ${selectedSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePreorderClick}
                className="btn-pill btn-orange"
                style={{ width: '100%' }}
              >
                {reserved ? `Reserved: UK ${selectedSize} ✓` : 'Pre-order now'}
              </button>
            </div>

            <p className="nova-order-terms">
              Free returns for 30 days. Pay nothing until it ships.
            </p>
          </div>
        </div>
      </section>

      {/* Below the Stage: 3. Footer */}
      <footer className="nova-footer">
        <div className="nova-footer-brand">NOVA</div>
        <p className="nova-footer-copy">A concept product. © 2027 Nova Running.</p>
      </footer>
    </div>
  );
}

