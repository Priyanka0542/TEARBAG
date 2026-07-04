import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookHeart, LogOut, Home, PenTool, Sprout, Backpack, BarChart, Bot, Sparkles, Globe, Wind, Menu, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/journal', icon: PenTool, label: 'Journal' },
  { to: '/garden', icon: Sprout, label: 'Garden' },
  { to: '/backpack', icon: Backpack, label: 'Backpack' },
  { to: '/analytics', icon: BarChart, label: 'Analytics' },
  { to: '/companion', icon: Bot, label: 'AI' },
  { to: '/galaxy', icon: Sparkles, label: 'Galaxy' },
  { to: '/community', icon: Globe, label: 'Community' },
  { to: '/breathe', icon: Wind, label: 'Breathe' },
];

export const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/30 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary group" aria-label="TearBag Home">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <BookHeart className="w-7 h-7 text-primary group-hover:text-pink-400 transition-colors" />
            </motion.div>
            <span className="font-heading font-semibold text-xl tracking-tight">TearBag</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-1 text-sm font-medium">
            {navLinks.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-3 py-2 rounded-full transition-colors flex items-center space-x-1.5 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  aria-label={label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}

            <div className="w-px h-6 bg-border mx-2" />

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-full transition-all cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="bg-background/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl shadow-black/50 p-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {navLinks.map(({ to, icon: Icon, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${isActive ? 'bg-primary/15 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent'}`}
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
