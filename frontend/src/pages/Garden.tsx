import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Sprout, Flower2, Droplets, Sun } from 'lucide-react';
import { api } from '../lib/api';

const ParticleBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: Math.random() * 2 + 1,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full bg-pink-400"
        />
      ))}
    </div>
  );
};
export const Garden = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<any | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await api.get('/entries');
        // Filter for positive/growth entries
        const positiveEntries = data.filter((e: any) => 
          e.moods.includes('Happy') || 
          e.moods.includes('Grateful') || 
          e.moods.includes('Loved') ||
          e.moods.includes('Excited')
        );
        setEntries(positiveEntries);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntries();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto py-8 relative min-h-[80vh] flex flex-col"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="mb-12 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center justify-center gap-4 text-emerald-600 dark:text-emerald-400">
          <Sprout className="w-10 h-10" />
          Gratitude Garden
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          Every happy, grateful, or loving memory you lock in your vault plants a new seed here. Watch your emotional garden grow over time.
        </p>
      </header>

      <div className="flex-1 glass rounded-[3rem] p-8 md:p-14 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span>{entries.length} memories blooming</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span>Watered by reflection</span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <Sprout className="w-12 h-12 text-emerald-500/50" />
            </div>
            <p className="text-xl font-medium text-foreground">Your garden is bare right now.</p>
            <p className="text-muted-foreground mt-2">Log a happy or grateful memory to plant your first seed.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-wrap gap-8 items-end justify-center pb-12 pt-20 relative">
            {entries.map((entry, i) => (
              <motion.div
                key={entry._id}
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", delay: i * 0.1, bounce: 0.5 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedSeed(selectedSeed?._id === entry._id ? null : entry)}
              >
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-24 flex flex-col items-center justify-end relative"
                >
                  <ParticleBurst active={selectedSeed?._id === entry._id} />
                  <Flower2 className={`w-12 h-12 transition-colors duration-500 relative z-10 ${selectedSeed?._id === entry._id ? 'text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]' : 'text-emerald-500 group-hover:text-pink-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]'}`} />
                  <div className="w-1 h-12 bg-emerald-600/40 rounded-full mt-1" />
                </motion.div>
                
                <AnimatePresence>
                  {selectedSeed?._id === entry._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-background/90 backdrop-blur-xl border border-primary/20 p-4 rounded-2xl shadow-xl shadow-primary/10 z-50 pointer-events-none"
                    >
                      <h4 className="font-heading font-medium text-foreground mb-1">{entry.title}</h4>
                      <span className="text-[10px] uppercase tracking-wider text-primary/70 font-semibold">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{entry.content}</p>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-background/90 border-b border-r border-primary/20 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            
            {/* Ground line & Dynamic Mist */}
            <div className="absolute bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none blur-xl mix-blend-screen" />
            <div className="absolute bottom-10 left-10 right-10 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
