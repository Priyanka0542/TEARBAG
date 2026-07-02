import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Sparkles, Quote, Archive, Save, Loader2, Lock } from 'lucide-react';
import { api } from '../lib/api';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😭', label: 'Crying' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '❤️', label: 'Loved' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '🤔', label: 'Confused' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😞', label: 'Lonely' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.4 } }
};

const WeatherEffect = ({ mood }: { mood: string | null }) => {
  if (!mood) return null;
  
  if (mood === 'Sad' || mood === 'Crying' || mood === 'Lonely') {
    // Rain Effect
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-blue-900/10" />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-10 bg-blue-400/50"
            initial={{ top: -50, left: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ 
              top: '100vh', 
              opacity: [0, 1, 1, 0],
              left: `${(Math.random() - 0.5) * 20 + (Math.random() * 100)}vw` // Slight wind
            }}
            transition={{ 
              duration: 1 + Math.random(), 
              repeat: Infinity, 
              delay: Math.random() * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }
  
  if (mood === 'Happy' || mood === 'Excited' || mood === 'Loved') {
    // Sun Rays Effect
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay" />
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-64 h-[200vh] bg-gradient-to-b from-yellow-300/20 to-transparent blur-3xl transform -rotate-45 origin-top-left"
            initial={{ left: `${i * 15}vw`, opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    );
  }

  if (mood === 'Anxious' || mood === 'Angry') {
    // Stormy / Fast particles
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-red-900/10" />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/30 rounded-full blur-sm"
            initial={{ top: `${Math.random() * 100}vh`, left: `${Math.random() * 100}vw`, scale: Math.random() }}
            animate={{ 
              top: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              left: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export const Dashboard = () => {
  const { user } = useStore();
  const today = format(new Date(), 'EEEE, MMMM do');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [quickLog, setQuickLog] = useState('');
  const [saving, setSaving] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState("How are you feeling today?");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await api.get('/entries');
        setEntries(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    const fetchPrompt = async () => {
      try {
        const { data } = await api.get('/entries/daily-prompt');
        if (data.prompt) setDailyPrompt(data.prompt);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEntries();
    fetchPrompt();
  }, []);

  const handleQuickSave = async () => {
    if (!quickLog.trim() || !selectedMood) return;
    setSaving(true);
    try {
      const { data } = await api.post('/entries', {
        title: `Feeling ${selectedMood}`,
        content: quickLog,
        moods: [selectedMood]
      });
      setEntries([data, ...entries]);
      setQuickLog('');
      setSelectedMood(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredEntries = selectedMood 
    ? entries.filter(e => e.moods.includes(selectedMood))
    : entries;
    
  const latestMood = entries.length > 0 && entries[0].moods?.length > 0 ? entries[0].moods[0] : null;

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-12 w-full relative"
    >
      <WeatherEffect mood={latestMood} />
      
      <header className="pt-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-heading font-semibold tracking-tight mb-3 flex items-center gap-3"
        >
          Good Morning, {user?.name.split(' ')[0]} 
          <motion.span 
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} 
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
            className="inline-block origin-bottom-right"
          >
            🌸
          </motion.span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg font-light flex items-center gap-2"
        >
          {today} <span className="w-1 h-1 rounded-full bg-border inline-block" /> <span className="text-primary font-medium flex items-center gap-1"><Sparkles className="w-4 h-4" /> 1 Day Streak</span>
        </motion.p>
      </header>

      <section className="glass rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h2 className="text-2xl md:text-3xl font-heading font-medium mb-8 text-center relative z-10">{dailyPrompt}</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-4 justify-center relative z-10"
        >
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.label;
            return (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.15, y: -8, rotate: [-2, 2, -2, 0] }}
                whileTap={{ scale: 0.9 }}
                key={mood.label}
                onClick={() => setSelectedMood(isSelected ? null : mood.label)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-300 w-24 h-24 relative overflow-hidden ${isSelected ? 'bg-primary/20 border-primary shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] ring-2 ring-primary/50' : 'bg-background/40 border-border hover:border-primary/50 hover:bg-background/60 hover:shadow-lg'}`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="mood-glow"
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full" 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.span 
                  className="text-4xl mb-2 relative z-10"
                  animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {mood.emoji}
                </motion.span>
                <span className={`text-xs font-medium relative z-10 ${isSelected ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{mood.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        <AnimatePresence>
          {selectedMood && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="w-full max-w-2xl mx-auto overflow-hidden relative z-10"
            >
              <div className="bg-background/50 border border-primary/20 rounded-[2rem] p-6 shadow-xl shadow-primary/5 flex flex-col gap-4">
                <p className="font-heading text-lg font-medium text-foreground">
                  What's making you feel {selectedMood.toLowerCase()} today?
                </p>
                <div className="relative">
                  <textarea 
                    value={quickLog}
                    onChange={(e) => setQuickLog(e.target.value)}
                    placeholder="Jot down a quick thought..."
                    className="w-full bg-background/50 border border-border rounded-xl p-4 pb-14 min-h-[120px] resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-base font-light placeholder:text-muted-foreground/50 transition-all"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleQuickSave}
                    disabled={saving || !quickLog.trim()}
                    className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all flex items-center justify-center shadow-lg shadow-primary/20 gap-2 font-medium text-sm cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lock in Vault
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-[2.5rem] p-8 h-72 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />
          <h3 className="text-xl font-heading font-medium text-muted-foreground flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary/50" />
            Inspirational Quote
          </h3>
          <blockquote className="text-2xl md:text-3xl font-heading font-light leading-tight text-foreground z-10 relative">
            <span className="text-primary/40 absolute -left-4 -top-4 text-6xl select-none">"</span>
            The emotion that can break your heart is sometimes the very one that heals it...
          </blockquote>
          <p className="text-sm text-muted-foreground text-right z-10 font-medium">- Nicholas Sparks</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-[2.5rem] p-8 h-72 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10"
        >
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full group-hover:bg-pink-500/20 transition-colors duration-700" />
          <h3 className="text-xl font-heading font-medium text-muted-foreground flex items-center gap-2 shrink-0">
            <Archive className="w-5 h-5 text-pink-400/50" />
            Recent Memories
          </h3>
          
          <div className="flex-1 w-full flex flex-col z-10 overflow-y-auto pr-2 gap-3 mt-4" style={{ scrollbarWidth: 'thin' }}>
            {filteredEntries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground font-light text-center">
                <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mb-4">
                  <Archive className="w-6 h-6 text-muted-foreground/50" />
                </div>
                {selectedMood ? `No memories found feeling ${selectedMood}.` : 'Your vault is waiting for its first memory.'}
              </div>
            ) : (
              filteredEntries.slice(0, 3).map(entry => (
                <motion.div 
                  key={entry._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                  className={`border p-5 rounded-2xl flex flex-col gap-2 transition-all duration-300 group/item shrink-0 ${entry.isLocked ? 'bg-background/80 backdrop-blur-xl border-border/50 shadow-inner' : 'glass hover:border-pink-500/50 hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]'}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`font-heading font-medium transition-colors flex items-center gap-2 ${entry.isLocked ? 'text-muted-foreground' : 'text-foreground group-hover/item:text-pink-500'}`}>
                      {entry.isLocked && <Lock className="w-4 h-4 text-primary/50" />}
                      {entry.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{format(new Date(entry.date), 'MMM d')}</span>
                  </div>
                  <p className={`text-sm font-light line-clamp-2 ${entry.isLocked ? 'text-primary/60 italic font-medium' : 'text-muted-foreground'}`}>{entry.content}</p>
                  {entry.aiReflection && !entry.isLocked && (
                    <div className="mt-2 bg-primary/5 border border-primary/20 rounded-xl p-3 flex gap-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                      <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5 relative z-10" />
                      <p className="text-xs text-primary/90 font-medium italic leading-relaxed relative z-10">{entry.aiReflection}</p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};
