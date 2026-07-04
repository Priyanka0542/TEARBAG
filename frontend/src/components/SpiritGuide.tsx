import { motion } from 'framer-motion';

export const SpiritGuide = () => {
  return (
    <div className="fixed bottom-12 right-12 z-50 pointer-events-none drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
      <motion.div
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-16 h-20 flex items-center justify-center"
      >
        {/* Core Body */}
        <div className="absolute w-12 h-16 bg-gradient-to-t from-pink-400 to-indigo-300 rounded-[40px] opacity-90 blur-[1px]" />
        
        {/* Inner Glow */}
        <div className="absolute w-8 h-12 bg-white/80 rounded-[30px] blur-[3px]" />

        {/* Floating particles emanating from the spirit */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40],
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
            className="absolute -bottom-2 w-2 h-2 bg-pink-300 rounded-full blur-[1px]"
          />
        ))}

        {/* Eyes */}
        <div className="absolute top-6 flex gap-3 z-10">
          <motion.div
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
            className="w-2 h-2.5 bg-black/60 rounded-full"
          />
          <motion.div
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
            className="w-2 h-2.5 bg-black/60 rounded-full"
          />
        </div>

        {/* Little blush */}
        <div className="absolute top-9 flex gap-5 z-10 opacity-60">
          <div className="w-2 h-1.5 bg-pink-500 rounded-full blur-[2px]" />
          <div className="w-2 h-1.5 bg-pink-500 rounded-full blur-[2px]" />
        </div>
      </motion.div>
    </div>
  );
};
