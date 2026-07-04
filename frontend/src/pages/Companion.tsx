import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mail, Sparkles, Loader2, AlertCircle, X } from 'lucide-react';
import { api } from '../lib/api';

export const Companion = () => {
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLetter = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/entries/companion/letter');
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

      <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center gap-4 mb-10">
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

      <div className="glass rounded-[3rem] p-10 md:p-14 min-h-[60vh] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        {!letter ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 max-w-lg mx-auto">
            {loading ? (
              <>
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h2 className="text-3xl font-heading font-medium mb-4 text-foreground">Writing your letter...</h2>
                <p className="text-muted-foreground text-lg font-light">
                  Your AI Companion is reflecting on your journey. This may take a moment.
                </p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-heading font-medium mb-4 text-foreground">Need some encouragement?</h2>
                <p className="text-muted-foreground text-lg mb-8 font-light">
                  Your AI Companion has been reading your journals and following your journey. It can write you a personalized letter of support, reflecting on how far you've come.
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
          <div className="relative z-10 w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg">A Letter for You</h3>
                  <p className="text-sm text-muted-foreground">From your AI Companion</p>
                </div>
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
        )}
      </div>
    </motion.div>
  );
};
