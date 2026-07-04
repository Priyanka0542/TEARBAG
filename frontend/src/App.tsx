import React, { useCallback, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { useStore } from './store/useStore';
import { useEmotionStore } from './store/useEmotionStore';
import { emotionThemes } from './lib/emotionThemes';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Journal } from './pages/Journal';
import { Garden } from './pages/Garden';
import { Backpack } from './pages/Backpack';
import { Analytics } from './pages/Analytics';
import { Companion } from './pages/Companion';
import { Galaxy } from './pages/Galaxy';
import { Community } from './pages/Community';
import { Breathe } from './pages/Breathe';
import { AmbientSound } from './components/AmbientSound';
import { NotFound } from './pages/NotFound';

import { AnimatePresence, motion } from 'framer-motion';
import { GlobalParticles } from './components/GlobalParticles';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/* ==========================================================================
   Emotion-Reactive Particle Environment
   - Renders canvas particles + gradient orbs driven by the emotion store
   - Respects prefers-reduced-motion
   - Pauses when tab is hidden (document.visibilityState)
   ========================================================================== */
const EmotionEnvironment = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentEmotion, intensity } = useEmotionStore();
  const theme = emotionThemes[currentEmotion];
  const particlesRef = useRef<any[]>([]);
  const rafRef = useRef<number>(0);

  // Parse hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 255, g: 255, b: 255 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const PARTICLE_COUNT = prefersReduced ? 0 : Math.min(60, Math.floor(30 + intensity * 40));
    const particles: any[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * (0.3 + intensity * 0.5),
        speedY: currentEmotion === 'sadness'
          ? Math.random() * 0.5 + 0.2
          : currentEmotion === 'joy'
            ? -(Math.random() * 0.5 + 0.2)
            : (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    const rgb = hexToRgb(theme.particle);
    let visible = true;

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible) animate();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const animate = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Jitter for anxiety
        if (currentEmotion === 'anxiety') {
          p.x += (Math.random() - 0.5) * 1.5;
          p.y += (Math.random() - 0.5) * 1.5;
        }

        const pulsedOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        const pulsedSize = p.size * (0.8 + Math.sin(p.pulse) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pulsedOpacity})`;
        ctx.fill();

        // Glow effect for larger particles
        if (pulsedSize > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulsedSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pulsedOpacity * 0.15})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [currentEmotion, intensity, theme.particle, hexToRgb]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Gradient orbs driven by emotion */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[120px] mix-blend-screen"
        style={{ background: `radial-gradient(circle, ${theme.bgStart} 0%, transparent 70%)` }}
      />
      <motion.div
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 100, -150, 0],
          scale: [1, 1.5, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full blur-[150px] mix-blend-screen"
        style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }}
      />
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 80, -80, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full blur-[100px] mix-blend-screen"
        style={{ background: `radial-gradient(circle, ${theme.bgEnd} 0%, transparent 70%)` }}
      />

      {/* Canvas particle layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 + intensity * 0.3 }}
      />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/garden" 
          element={
            <ProtectedRoute>
              <Garden />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/backpack" 
          element={
            <ProtectedRoute>
              <Backpack />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/companion" 
          element={
            <ProtectedRoute>
              <Companion />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/galaxy" 
          element={
            <ProtectedRoute>
              <Galaxy />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/breathe" 
          element={
            <ProtectedRoute>
              <Breathe />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
        <GlobalParticles />
        <EmotionEnvironment />
        <Navbar />
        <AmbientSound />
        <main className="pt-24 pb-10 px-4 max-w-6xl mx-auto relative z-10">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
