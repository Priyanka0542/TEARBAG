import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Bot, Mail, Sparkles, Loader2, AlertCircle, X } from 'lucide-react';
import { api } from '../lib/api';

export const Companion = () => {
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGuide, setSelectedGuide] = useState('spirit');

  // Hologram 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  // Glare overlay movement
  const glareX = useTransform(x, [-100, 100], [-50, 50]);
  const glareY = useTransform(y, [-100, 100], [-50, 50]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / rect.width - 0.5) * 200;
    const yPct = (mouseY / rect.height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const fetchLetter = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/entries/companion/letter', { params: { guide: selectedGuide } });
      setLetter(data.letter);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to get your letter. The AI might be busy — please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      className="max-w-4xl mx-auto py-8 relative"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />

      <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center gap-4 mb-10 anime-title">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Bot className="w-7 h-7 text-primary" />
        </div>
        Your AI Companion
      </h1>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 rounded-2xl bg-red-500/10 backdrop-blur-md text-red-400 text-sm border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
              <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400 cursor-pointer" aria-label="Dismiss error">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass holo-card rounded-[3rem] p-10 md:p-14 min-h-[60vh] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        {!letter && !loading && (
          <div className="w-full flex flex-col gap-6 mb-10 relative z-10 items-center justify-center border-b border-border/30 pb-10">
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest text-center">Select Your Guide</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: 'spirit', name: 'TearBag Spirit', color: 'bg-primary/20 text-primary border-primary/30', hover: 'hover:bg-primary/30', icon: '🌟' },
                { id: 'tanjiro', name: 'Tanjiro', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', hover: 'hover:bg-emerald-500/30', icon: '🎴' },
                { id: 'rengoku', name: 'Rengoku', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', hover: 'hover:bg-orange-500/30', icon: '🔥' },
                { id: 'giyu', name: 'Giyu', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', hover: 'hover:bg-blue-500/30', icon: '🌊' },
                { id: 'shinobu', name: 'Shinobu', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', hover: 'hover:bg-purple-500/30', icon: '🦋' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuide(g.id)}
                  className={`px-4 py-3 rounded-2xl border transition-all duration-300 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                    selectedGuide === g.id 
                      ? `${g.color} shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105` 
                      : `bg-background/20 text-muted-foreground border-border/50 ${g.hover} hover:text-foreground`
                  }`}
                >
                  <span className="text-lg">{g.icon}</span>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!letter ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 max-w-lg mx-auto">
            {loading ? (
              <>
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h2 className="text-3xl font-heading font-medium mb-4 text-foreground">Writing your letter...</h2>
                <p className="text-muted-foreground text-lg font-light">
                  Your Guide is reflecting on your journey. This may take a moment.
                </p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-heading font-medium mb-4 text-foreground">Need some encouragement?</h2>
                <p className="text-muted-foreground text-lg mb-8 font-light">
                  Your chosen Guide has been reading your journals and following your journey. They can write you a personalized letter of support, reflecting on how far you've come.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchLetter}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium shadow-[0_0_30px_-5px_rgba(124,58,237,0.4)] hover:bg-primary/90 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  Ask for a Letter
                </motion.button>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 relative z-10 text-left items-start">
            
            {/* Holographic Character Projection */}
            {selectedGuide !== 'spirit' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full md:w-1/3 shrink-0 flex flex-col items-center justify-center hologram-wrapper"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="relative w-full aspect-[3/4] overflow-hidden rounded-[2rem] border-0"
                  style={{ 
                    rotateX, 
                    rotateY, 
                    transformStyle: "preserve-3d" 
                  }}
                >
                  <img 
                    src={`/characters/${selectedGuide}.png`} 
                    alt={selectedGuide} 
                    className="w-full h-full object-cover hologram-image"
                  />
                  {/* Holographic Glare Overlay based on mouse position */}
                  <motion.div 
                    className="absolute inset-0 pointer-events-none rounded-[2rem] opacity-30"
                    style={{
                      background: `radial-gradient(circle at center, ${
                        selectedGuide === 'tanjiro' ? 'rgba(16,185,129,0.8)' : 
                        selectedGuide === 'rengoku' ? 'rgba(249,115,22,0.8)' : 
                        selectedGuide === 'giyu' ? 'rgba(59,130,246,0.8)' : 
                        'rgba(168,85,247,0.8)'
                      } 0%, transparent 70%)`,
                      x: glareX,
                      y: glareY,
                    }}
                  />
                </motion.div>

                {/* Glowing Base Disk */}
                <div 
                  className="projection-disk"
                  style={{
                    color: 
                      selectedGuide === 'tanjiro' ? '#10b981' : 
                      selectedGuide === 'rengoku' ? '#f97316' : 
                      selectedGuide === 'giyu' ? '#3b82f6' : 
                      '#a855f7'
                  }}
                />
              </motion.div>
            )}

            {/* The Letter */}
            <div className={`flex-1 flex flex-col gap-4 ${selectedGuide === 'spirit' ? 'max-w-2xl mx-auto' : ''}`}>
              <div className="flex items-center gap-3 mb-4 border-b border-border/30 pb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                  {selectedGuide === 'tanjiro' ? <span className="text-xl">🎴</span> :
                   selectedGuide === 'rengoku' ? <span className="text-xl">🔥</span> :
                   selectedGuide === 'giyu' ? <span className="text-xl">🌊</span> :
                   selectedGuide === 'shinobu' ? <span className="text-xl">🦋</span> :
                   <Sparkles className="w-6 h-6 text-primary drop-shadow-md" />}
                </div>
                <h3 className="text-2xl font-heading font-semibold text-foreground">
                  A Letter from {selectedGuide === 'spirit' ? 'Your Guide' : selectedGuide.charAt(0).toUpperCase() + selectedGuide.slice(1)}
                </h3>
              </div>
              
              <div className="flex-1 glass holo-card rounded-[2rem] p-6 mb-6 overflow-y-auto flex flex-col gap-4 min-h-[300px]" style={{ scrollbarWidth: 'thin' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert max-w-none text-foreground/90 font-light leading-relaxed text-lg"
                >
                  {letter.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6">{paragraph}</p>
                  ))}
                </motion.div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchLetter}
                disabled={loading}
                className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium bg-primary/10 px-4 py-2 rounded-xl cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Write another'}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
