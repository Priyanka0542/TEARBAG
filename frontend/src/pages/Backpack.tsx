import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Backpack as BackpackIcon, Search, Lock, Sparkles, Filter, X } from 'lucide-react';
import { api } from '../lib/api';

const MOODS = [
  'Happy', 'Sad', 'Anxious', 'Calm', 'Angry', 'Grateful', 'Loved', 'Excited', 'Tired'
];

export const Backpack = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await api.get('/entries');
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch backpack entries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood ? entry.moods?.includes(selectedMood) : true;
    return matchesSearch && matchesMood;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      className="max-w-6xl mx-auto py-8 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <BackpackIcon className="w-7 h-7 text-primary" />
            </div>
            Emotional Backpack
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your entire vault of memories, thoughts, and reflections. Safely stored and always yours.
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search your memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background/50 glass border-primary/20 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedMood === mood 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-background/40 border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {mood}
              </button>
            ))}
            {selectedMood && (
              <button 
                onClick={() => setSelectedMood(null)}
                className="p-1 rounded-full bg-background/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="glass rounded-[3rem] p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-2xl font-heading font-medium mb-2">No memories found</h3>
          <p className="text-muted-foreground">Try adjusting your search or mood filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                key={entry._id}
                className={`glass p-6 rounded-3xl flex flex-col gap-4 group hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] hover:border-primary/40 transition-all duration-300 ${entry.isLocked ? 'bg-background/80 blur-[2px] hover:blur-none transition-all' : ''}`}
              >
                {entry.imageUrl && !entry.isLocked && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10" />
                    <img 
                      src={`http://localhost:5000${entry.imageUrl}`} 
                      alt="Memory" 
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 flex-wrap">
                    {entry.moods?.map((m: string) => (
                      <span key={m} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                        {m}
                      </span>
                    ))}
                    {entry.tags?.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 text-[10px] font-semibold tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded-lg shrink-0">
                    {format(new Date(entry.date), 'MMM d')}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className={`text-xl font-heading font-semibold mb-2 ${entry.isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                    {entry.title || 'Untitled Memory'}
                  </h3>
                  
                  {entry.isLocked ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3 text-muted-foreground">
                      <Lock className="w-8 h-8 opacity-50" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Locked Memory</p>
                        <p className="text-xs opacity-70">Unlocks on {format(new Date(entry.unlockDate), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground/80 leading-relaxed font-light text-sm whitespace-pre-wrap line-clamp-6 group-hover:line-clamp-none transition-all duration-500">
                      {entry.content}
                    </p>
                  )}
                </div>

                {entry.aiReflection && !entry.isLocked && (
                  <div className="mt-2 bg-primary/5 border border-primary/20 rounded-2xl p-4 relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/20 rounded-full blur-xl" />
                    <div className="flex items-center gap-2 mb-2 text-primary font-medium text-xs uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Reflection</span>
                    </div>
                    <p className="text-sm text-primary/80 leading-relaxed italic">
                      "{entry.aiReflection}"
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
