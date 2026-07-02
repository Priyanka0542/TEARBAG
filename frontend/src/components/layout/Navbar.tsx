import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookHeart, LogOut, Home, PenTool, Sprout } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/30 backdrop-blur-3xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary group">
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <BookHeart className="w-7 h-7 text-primary group-hover:text-pink-400 transition-colors" />
          </motion.div>
          <span className="font-heading font-semibold text-xl tracking-tight">TearBag</span>
        </Link>

        <div className="flex items-center space-x-2 text-sm font-medium">
          <Link 
            to="/" 
            className={`relative px-4 py-2 rounded-full transition-colors flex items-center space-x-2 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {location.pathname === '/' && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-primary/10 rounded-full"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Home className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Home</span>
          </Link>

          <Link 
            to="/journal" 
            className={`relative px-4 py-2 rounded-full transition-colors flex items-center space-x-2 ${location.pathname === '/journal' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {location.pathname === '/journal' && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-primary/10 rounded-full"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <PenTool className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Journal</span>
          </Link>

          <Link 
            to="/garden" 
            className={`relative px-4 py-2 rounded-full transition-colors flex items-center space-x-2 ${location.pathname === '/garden' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {location.pathname === '/garden' && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-primary/10 rounded-full"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Sprout className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Garden</span>
          </Link>

          <div className="w-px h-6 bg-border mx-2" />

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
