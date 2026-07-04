import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Globe, Heart, Search } from 'lucide-react';
import { api } from '../lib/api';

export const Community = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunityEntries();
  }, []);

  const fetchCommunityEntries = async () => {
    try {
      const { data } = await api.get('/entries/community');
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch community entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendHug = async (id: string) => {
    try {
      const { data } = await api.post(`/entries/${id}/hug`);
      setEntries(entries.map(e => e._id === id ? { ...e, hugs: data.hugs } : e));
    } catch (err) {
      console.error('Failed to send hug:', err);
    }
  };

  const filteredEntries = entries.filter((entry) => 
    entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      className="max-w-4xl mx-auto py-8 relative"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
      
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center justify-center gap-4 mb-4 anime-title">
          <Globe className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
          Empathy Community
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A safe, anonymous space to share your journey and support others. You are not alone.
        </p>
      </header>

      <div className="relative mb-10 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search the community..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background/50 glass border-blue-500/20 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="glass rounded-[3rem] p-12 text-center flex flex-col items-center justify-center min-h-[30vh]">
          <Globe className="w-16 h-16 text-blue-500/20 mb-4" />
          <h3 className="text-2xl font-heading font-medium mb-2">No entries yet</h3>
          <p className="text-muted-foreground mb-6">The community is quiet right now. Be the first to share.</p>
          <Link to="/journal" className="px-6 py-3 bg-blue-500/10 text-blue-500 rounded-full font-medium hover:bg-blue-500/20 transition-colors">
            Share a memory
          </Link>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="glass rounded-[3rem] p-12 text-center flex flex-col items-center justify-center min-h-[30vh]">
          <Globe className="w-16 h-16 text-blue-500/20 mb-4" />
          <h3 className="text-2xl font-heading font-medium mb-2">No entries found</h3>
          <p className="text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredEntries.map((entry, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                key={entry._id}
                className="glass holo-card p-8 rounded-[2rem] flex flex-col gap-4 border border-blue-500/10 hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] min-h-[12rem]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-foreground">Anonymous Voyager</h4>
                      <p className="text-xs text-muted-foreground">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  {entry.moods?.length > 0 && (
                    <span className="px-3 py-1 bg-background/50 rounded-full border border-border text-xs font-medium text-muted-foreground">
                      Feeling {entry.moods[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">{entry.title}</h3>
                
                {entry.imageUrl && (
                  <div className="w-full max-h-64 rounded-2xl overflow-hidden mb-4">
                    <img src={`http://localhost:5000${entry.imageUrl}`} alt="Memory" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <p className="text-foreground/80 leading-relaxed font-light text-sm whitespace-pre-wrap mb-6">
                  {entry.content}
                </p>

                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendHug(entry._id)}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 rounded-xl transition-colors border border-pink-500/20"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="font-medium text-sm">Send Hug</span>
                    </motion.button>
                    <span className="text-sm font-medium text-pink-500/80">
                      {entry.hugs > 0 ? `${entry.hugs} ${entry.hugs === 1 ? 'Hug' : 'Hugs'}` : ''}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
