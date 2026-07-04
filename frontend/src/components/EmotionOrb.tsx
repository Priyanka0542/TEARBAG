import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmotionStore } from '../store/useEmotionStore';
import { emotionThemes } from '../lib/emotionThemes';

export const EmotionOrb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentEmotion, intensity } = useEmotionStore();
  const theme = emotionThemes[currentEmotion];
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = 60;
    let time = 0;

    // Parse color
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [255, 255, 255];
    };

    const [r, g, b] = hexToRgb(theme.orbColor);
    
    // Pulse speed by emotion
    const pulseSpeed = {
      calm: 0.008,
      joy: 0.015,
      sadness: 0.005,
      anger: 0.025,
      anxiety: 0.018,
    }[currentEmotion];

    const visible = () => document.visibilityState === 'visible';

    const draw = () => {
      if (!visible()) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, size, size);
      time += pulseSpeed;

      // Liquid deformation
      const points = 100;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        
        // Multiple sine waves for organic liquid shape
        const wave1 = Math.sin(angle * 3 + time * 2) * 4 * intensity;
        const wave2 = Math.sin(angle * 5 - time * 3) * 3 * intensity;
        const wave3 = Math.sin(angle * 7 + time * 1.5) * 2 * intensity;
        const pulse = Math.sin(time) * 3 * intensity;
        
        const r = baseRadius + wave1 + wave2 + wave3 + pulse;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Radial gradient fill
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius + 15);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.5)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner glow
      const innerGlow = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, baseRadius);
      innerGlow.addColorStop(0, `rgba(255, 255, 255, 0.4)`);
      innerGlow.addColorStop(0.5, `rgba(255, 255, 255, 0.05)`);
      innerGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // Outer glow halo
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius + 25, 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(cx, cy, baseRadius, cx, cy, baseRadius + 40);
      outerGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.15 + Math.sin(time) * 0.1})`);
      outerGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frameRef.current);
  }, [currentEmotion, intensity, theme.orbColor]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 1.2, bounce: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="w-[200px] h-[200px]"
        />
        {/* Outer breathing ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: currentEmotion === 'calm' ? 6 : currentEmotion === 'anger' ? 2 : 4,
            repeat: Infinity,
            ease: 'easeInOut' 
          }}
          className="absolute inset-[-15px] rounded-full border"
          style={{ borderColor: `${theme.orbColor}33` }}
        />
      </div>
      <p className="text-sm font-medium tracking-widest uppercase" style={{ color: theme.orbColor }}>
        {theme.label}
      </p>
    </motion.div>
  );
};
