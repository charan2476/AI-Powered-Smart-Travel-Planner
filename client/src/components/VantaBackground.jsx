import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const VantaBackground = ({ children, className = '' }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    let effect = null;
    let isMounted = true;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      return;
    }

    const initVanta = async () => {
      try {
        // Dynamically import vanta net / globe
        const NET = (await import('vanta/dist/vanta.net.min.js')).default;
        
        if (isMounted && vantaRef.current && !effect) {
          effect = NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 0.75,
            color: 0x38bdf8, // Sky 400
            backgroundColor: 0x0a0f1d, // Deep modern navy
            points: isMobile ? 8.0 : 12.0,
            maxDistance: isMobile ? 18.0 : 23.0,
            spacing: isMobile ? 18.0 : 16.0,
            showDots: true,
          });
          setVantaEffect(effect);
        }
      } catch (err) {
        console.warn('Vanta 3D background initialization skipped or fallback active:', err);
      }
    };

    initVanta();

    return () => {
      isMounted = false;
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className={`relative w-full overflow-hidden bg-navy-900 ${className}`}
    >
      {/* Subtle radial overlay to ensure contrast and readable text */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-900/50 to-slate-900/90 pointer-events-none z-0" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default VantaBackground;
