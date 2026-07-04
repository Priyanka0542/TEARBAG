import { motion } from 'framer-motion';
import { Ghost, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center relative"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]">
          <Ghost className="w-14 h-14 text-primary/60" />
        </div>
      </motion.div>

      <h1 className="text-5xl font-heading font-semibold mb-4 text-foreground">404</h1>
      <p className="text-xl text-muted-foreground mb-2">This page doesn't exist in your world.</p>
      <p className="text-muted-foreground/60 mb-10">The memory you're looking for has drifted away.</p>

      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px -5px rgba(124, 58, 237, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium shadow-lg shadow-primary/20 flex items-center gap-3 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          Return Home
        </motion.button>
      </Link>
    </motion.div>
  );
};
