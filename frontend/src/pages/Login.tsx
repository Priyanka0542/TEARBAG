import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookHeart, Mail, Lock, ArrowRight, Loader2, Sparkles, User, Unlock } from 'lucide-react';
import { api } from '../lib/api';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const loginAction = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        loginAction(data.user, data.token);
      } else {
        const { data } = await api.post('/auth/register', { name, email, password });
        loginAction(data.user, data.token);
      }
      
      // Vault unlock animation before navigation
      setLoading(false);
      setUnlocking(true);
      
      setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-[calc(100vh-8rem)] flex items-center justify-center relative w-full"
    >
      {/* Decorative blurred blobs */}
      <motion.div 
        animate={{ scale: unlocking ? 3 : 1, opacity: unlocking ? 0.8 : 0.3 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"
      />
      <motion.div 
        animate={{ scale: unlocking ? 3 : 1, opacity: unlocking ? 0.8 : 0.3 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"
      />

      <AnimatePresence mode="wait">
        {unlocking ? (
          /* Vault Unlock Animation */
          <motion.div
            key="vault-unlock"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 0.9, 20],
              opacity: [1, 1, 0],
              borderRadius: ['2.5rem', '50%', '50%'],
            }}
            transition={{ 
              duration: 1.8,
              times: [0, 0.3, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-md p-10 bg-black/30 backdrop-blur-3xl border border-white/20 shadow-[0_0_80px_-15px_rgba(124,58,237,0.6)] flex flex-col items-center justify-center gap-6"
            style={{ borderRadius: '2.5rem' }}
          >
            <motion.div
              animate={{ rotate: [0, -20, 180], scale: [1, 1.2, 1.5] }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <Unlock className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, times: [0, 0.3, 1] }}
              className="text-xl font-heading font-medium text-foreground"
            >
              Entering your world...
            </motion.p>
          </motion.div>
        ) : (
          /* Login Form */
          <motion.div 
            key="login-form"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
            className="w-full max-w-md p-10 rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_-15px_rgba(124,58,237,0.4)] text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="flex justify-center mb-8"
              >
                <div className="w-20 h-20 rounded-3xl bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)]">
                  <BookHeart className="w-10 h-10" />
                </div>
              </motion.div>
              
              <h1 className="text-4xl font-heading font-semibold tracking-tight mb-3 text-foreground drop-shadow-sm">TearBag</h1>
              <p className="text-muted-foreground font-light text-lg mb-10 flex items-center justify-center gap-2">
                The Emotional Vault <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              </p>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="p-4 rounded-2xl bg-red-500/10 backdrop-blur-md text-red-500 text-sm border border-red-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="text-sm font-medium text-muted-foreground ml-1 mb-1 block">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40 font-light"
                          placeholder="Your Name"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground ml-1 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40 font-light"
                      placeholder="hello@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground ml-1 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40 font-light"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px -10px rgba(124, 58, 237, 0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all disabled:opacity-70 font-medium text-lg shadow-lg shadow-primary/20 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <span>{isLogin ? 'Unlock Vault' : 'Create Vault'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-8 text-muted-foreground font-light">
                {isLogin ? "Don't have a vault?" : "Already have a vault?"}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                >
                  {isLogin ? 'Create one' : 'Enter here'}
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
