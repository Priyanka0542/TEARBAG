import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Sprout, Flower2, Droplets, Sun } from 'lucide-react';
import { api } from '../lib/api';

const ParticleBurst = ({ active, count = 6, color = 'bg-pink-400' }: { active: boolean, count?: number, color?: string }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: Math.random() * 2 + 0.5,
            x: (Math.random() - 0.5) * 250,
            y: (Math.random() - 0.5) * 250 - 50,
          }}
          transition={{ duration: 2 + Math.random() * 2, ease: "easeOut", repeat: Infinity, delay: Math.random() * 2 }}
          className={`absolute w-2 h-2 rounded-full ${color} blur-[1px]`}
        />
      ))}
    </div>
  );
};
const TreeGraphic = ({ streak }: { streak: number }) => {
  let StageComponent = Sprout;
  let sizeClass = "w-16 h-16 text-emerald-400";
  let label = "A fragile sprout";
  let particles = 5;

  if (streak >= 7) {
    StageComponent = Flower2; // Imagine this as a blooming tree canopy for now
    sizeClass = "w-64 h-64 text-pink-400 drop-shadow-[0_0_40px_rgba(236,72,153,0.8)]";
    label = "A magnificent blooming tree";
    particles = 25;
  } else if (streak >= 4) {
    StageComponent = Flower2;
    sizeClass = "w-40 h-40 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]";
    label = "A strong sapling";
    particles = 15;
  } else if (streak >= 2) {
    StageComponent = Sprout;
    sizeClass = "w-24 h-24 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]";
    label = "A growing seedling";
    particles = 8;
  }

  return (
    <div className="relative flex flex-col items-center justify-end h-full">
      <ParticleBurst active={true} count={particles} color={streak >= 7 ? 'bg-pink-400' : 'bg-emerald-400'} />
      
      {/* Tree Glow */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute ${streak >= 7 ? 'bg-pink-500/20' : 'bg-emerald-500/20'} blur-3xl rounded-full w-full h-full bottom-0`} 
      />
      
      <motion.div 
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <StageComponent className={sizeClass} />
        {streak >= 4 && <div className={`w-4 bg-emerald-900/80 rounded-full mt-[-10px] z-0 ${streak >= 7 ? 'h-32 w-8' : 'h-16'}`} />}
      </motion.div>

      <div className="absolute -bottom-12 text-center">
        <p className="text-xl font-heading font-medium text-foreground drop-shadow-md">{label}</p>
        <p className="text-sm text-primary/80 font-semibold">{streak} Day Streak</p>
      </div>
    </div>
  );
};

export const Garden = () => {
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/entries/analytics');
        setStreak(data.streak || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto py-8 relative min-h-[80vh] flex flex-col"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="mb-12 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center justify-center gap-4 anime-title">
          <Sprout className="w-10 h-10 text-emerald-400 drop-shadow-lg" />
          The Tree of Life
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          Your emotional world is alive. Maintain your daily journaling streak to watch your tree grow into something magical.
        </p>
      </header>

      <div className="flex-1 glass-strong holo-card rounded-[3rem] p-8 md:p-14 min-h-[30rem] relative overflow-hidden flex flex-col border border-white/5">
        <div className="flex justify-between items-center mb-8 border-b border-border/30 pb-4 relative z-20">
          <div className="flex items-center gap-2 text-primary/80 font-medium">
            <Sun className="w-5 h-5 text-yellow-400" />
            <span>Nourished by reflection</span>
          </div>
          <div className="flex items-center gap-2 text-primary/80 font-medium">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span>Watered daily</span>
          </div>
        </div>

        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
           </div>
        ) : streak === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 relative z-20">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Sprout className="w-12 h-12 text-emerald-500/50" />
            </div>
            <p className="text-2xl font-heading font-medium text-foreground mb-2">The soil is ready.</p>
            <p className="text-muted-foreground mb-8">Log a memory today to plant your magical seed.</p>
            <Link to="/journal" className="px-8 py-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full font-medium hover:bg-emerald-500/30 transition-all shadow-lg shadow-emerald-500/10">
              Plant a seed
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-end pb-32 pt-20 relative z-10">
            <TreeGraphic streak={streak} />
            
            {/* Ground line & Dynamic Mist */}
            <div className="absolute bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-emerald-900/40 via-emerald-800/10 to-transparent pointer-events-none blur-2xl mix-blend-screen" />
            <div className="absolute bottom-20 left-10 right-10 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
