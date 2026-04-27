"use client";

import { useState, useEffect } from "react";

export default function MaintenanceBanner() {
    const [visible, setVisible] = useState(true);

    // Pause animation on hover for readability
    const [paused, setPaused] = useState(false);

    if (!visible) return null;

    return (
        <div
            className="maintenance-banner"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Close button */}
            <button
                onClick={() => setVisible(false)}
                className="maintenance-banner__close"
                aria-label="Dismiss maintenance banner"
            >
                ✕
            </button>

            {/* Scrolling ticker */}
            <div className="maintenance-banner__track">
                <div
                    className={`maintenance-banner__scroll ${paused ? "maintenance-banner__scroll--paused" : ""}`}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="maintenance-banner__item">
                            <span className="maintenance-banner__icon">🔧</span>
                            This site is currently under maintenance — we&apos;ll be back
                            shortly!
                            <span className="maintenance-banner__dot">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Scoped styles */}
            <style jsx>{`
        .maintenance-banner {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, #f59e0b, #f97316, #ef4444, #f97316, #f59e0b);
          background-size: 200% 100%;
          animation: bannerGradient 6s linear infinite;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.025em;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        @keyframes bannerGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .maintenance-banner__close {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(0, 0, 0, 0.25);
          border: none;
          color: #fff;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.7rem;
          transition: background 0.2s;
          line-height: 1;
        }

        .maintenance-banner__close:hover {
          background: rgba(0, 0, 0, 0.45);
        }

        .maintenance-banner__track {
          overflow: hidden;
          padding: 0.5rem 2.5rem 0.5rem 0;
        }

        .maintenance-banner__scroll {
          display: flex;
          white-space: nowrap;
          animation: ticker 30s linear infinite;
        }

        .maintenance-banner__scroll--paused {
          animation-play-state: paused;
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .maintenance-banner__item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0 1.5rem;
        }

        .maintenance-banner__icon {
          font-size: 1rem;
        }

        .maintenance-banner__dot {
          opacity: 0.5;
          margin-left: 0.6rem;
        }
      `}</style>
        </div>
    );
}
