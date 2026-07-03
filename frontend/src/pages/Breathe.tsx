import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Flame, ArrowRight, Shield } from 'lucide-react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const phaseConfig: Record<Exclude<Phase, 'idle'>, { duration: number; label: string; scale: number }> = {
  inhale: { duration: 4, label: 'Breathe In', scale: 1.6 },
  hold:   { duration: 7, label: 'Hold',       scale: 1.6 },
  exhale: { duration: 8, label: 'Breathe Out', scale: 1 },
};

export const Breathe = () => {
  const [mode, setMode] = useState<'choose' | 'breathe' | 'release'>('choose');
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [releaseText, setReleaseText] = useState('');
  const [dissolved, setDissolved] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCycle = useCallback(() => {
    // Inhale 4s
    setPhase('inhale');
    timeoutRef.current = setTimeout(() => {
      // Hold 7s
      setPhase('hold');
      timeoutRef.current = setTimeout(() => {
        // Exhale 8s
        setPhase('exhale');
        timeoutRef.current = setTimeout(() => {
          setCycle(c => c + 1);
          runCycle();
        }, 8000);
      }, 7000);
    }, 4000);
  }, []);

  const startBreathing = () => {
    setMode('breathe');
    setCycle(0);
    runCycle();
  };

  const stopBreathing = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase('idle');
    setMode('choose');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const dissolveText = () => {
    if (!releaseText.trim()) return;
    
    // Create particles from text characters
    const chars = releaseText.split('');
    const newParticles = chars.map((char, i) => ({
      id: i,
      x: (i % 40) * 14 + Math.random() * 10,
      y: Math.floor(i / 40) * 24 + Math.random() * 10,
      char,
    }));
    
    setParticles(newParticles);
    setDissolved(true);
    
    // Clear everything after animation
    setTimeout(() => {
      setParticles([]);
      setDissolved(false);
      setReleaseText('');
      setMode('choose');
    }, 4000);
  };

  const currentPhaseConfig = phase !== 'idle' ? phaseConfig[phase] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto py-8 min-h-[80vh] flex flex-col"
    >
      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-medium text-foreground flex items-center gap-4">
              <Wind className="w-10 h-10 text-primary" />
              Calm Space
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Take a moment to center yourself. Choose a calming ritual below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-2xl">
              <motion.button
                whileHover={{ y: -5, boxShadow: '0 0 40px -10px rgba(96, 165, 250, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={startBreathing}
                className="glass-strong p-8 rounded-3xl text-left flex flex-col gap-4 cursor-pointer border border-blue-500/20 hover:border-blue-500/40 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Wind className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-heading font-medium text-foreground">4-7-8 Breathing</h3>
                <p className="text-sm text-muted-foreground">A guided breathing rhythm to calm your nervous system. Inhale 4s, hold 7s, exhale 8s.</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -5, boxShadow: '0 0 40px -10px rgba(239, 68, 68, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode('release')}
                className="glass-strong p-8 rounded-3xl text-left flex flex-col gap-4 cursor-pointer border border-red-500/20 hover:border-red-500/40 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Flame className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-heading font-medium text-foreground">Write It, Don't Send It</h3>
                <p className="text-sm text-muted-foreground">Vent everything. Then watch it dissolve into nothing. This will never be saved.</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'breathe' && (
          <motion.div
            key="breathe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 relative"
          >
            {/* Breathing Orb */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: currentPhaseConfig?.scale ?? 1,
                  backgroundColor: phase === 'inhale' ? 'rgba(96, 165, 250, 0.3)' : phase === 'hold' ? 'rgba(246, 196, 69, 0.3)' : 'rgba(96, 165, 250, 0.15)',
                }}
                transition={{
                  duration: currentPhaseConfig?.duration ?? 1,
                  ease: 'easeInOut',
                }}
                className="w-40 h-40 rounded-full border border-blue-400/30 flex items-center justify-center"
                style={{ background: 'rgba(96, 165, 250, 0.15)' }}
              >
                <motion.div
                  animate={{
                    scale: currentPhaseConfig?.scale ? currentPhaseConfig.scale * 0.6 : 0.6,
                  }}
                  transition={{
                    duration: currentPhaseConfig?.duration ?? 1,
                    ease: 'easeInOut',
                  }}
                  className="w-20 h-20 rounded-full bg-blue-400/40 backdrop-blur-sm"
                />
              </motion.div>

              {/* Progress ring */}
              <svg className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)]" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle
                  cx="100" cy="100" r="95"
                  fill="none"
                  stroke="rgba(96, 165, 250, 0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 95}
                  animate={{
                    strokeDashoffset: phase === 'idle' ? 2 * Math.PI * 95 : 0,
                  }}
                  transition={{
                    duration: currentPhaseConfig?.duration ?? 0,
                    ease: 'linear',
                  }}
                  transform="rotate(-90 100 100)"
                />
              </svg>
            </div>

            <div className="text-center">
              <motion.h2
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-heading font-medium text-foreground mb-2"
              >
                {currentPhaseConfig?.label ?? 'Get Ready...'}
              </motion.h2>
              <p className="text-muted-foreground">Cycle {cycle + 1}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopBreathing}
              className="px-6 py-3 rounded-xl bg-background/50 border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              End Session
            </motion.button>
          </motion.div>
        )}

        {mode === 'release' && (
          <motion.div
            key="release"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-heading font-medium text-foreground">Release Ritual</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-red-400 font-medium">This will NOT be saved</span>
              </div>
            </div>

            <div className="flex-1 glass-strong rounded-3xl p-8 relative overflow-hidden">
              <AnimatePresence>
                {dissolved ? (
                  /* Dissolving particles */
                  <div className="absolute inset-0 p-8 overflow-hidden">
                    {particles.map(p => (
                      <motion.span
                        key={p.id}
                        initial={{ 
                          x: p.x, 
                          y: p.y, 
                          opacity: 1, 
                          scale: 1 
                        }}
                        animate={{ 
                          x: p.x + (Math.random() - 0.5) * 300,
                          y: p.y - 200 - Math.random() * 300,
                          opacity: 0,
                          scale: 0,
                          rotate: Math.random() * 360,
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          ease: 'easeOut',
                        }}
                        className="absolute text-red-400/80 text-sm font-light"
                        style={{ left: 0, top: 0 }}
                      >
                        {p.char}
                      </motion.span>
                    ))}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="absolute inset-0 flex items-center justify-center text-2xl font-heading text-muted-foreground/50"
                    >
                      Released. ✨
                    </motion.p>
                  </div>
                ) : (
                  <motion.textarea
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    value={releaseText}
                    onChange={(e) => setReleaseText(e.target.value)}
                    placeholder="Speak your truth here. Every word. Every frustration. Every feeling you've been holding back. This space is purely cathartic — nothing you type will ever be stored, saved, or seen by anyone. Let it all out..."
                    className="w-full h-full min-h-[50vh] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-lg font-light leading-relaxed text-red-100/80 placeholder:text-muted-foreground/30 selection:bg-red-500/20"
                    autoFocus
                  />
                )}
              </AnimatePresence>
            </div>

            {!dissolved && (
              <div className="flex items-center justify-between mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setReleaseText(''); setMode('choose'); }}
                  className="px-6 py-3 rounded-xl bg-background/50 border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  Go Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px -5px rgba(239, 68, 68, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={dissolveText}
                  disabled={!releaseText.trim()}
                  className="px-8 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 disabled:opacity-30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  Let It Go
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
