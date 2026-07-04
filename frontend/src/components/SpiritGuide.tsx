import { motion } from 'framer-motion';

export const SpiritGuide = () => {
  return (
    <div className="fixed bottom-12 right-12 z-50 pointer-events-none drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]">
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-20 h-24 flex items-center justify-center"
      >
        {/* Core Body - Glowing Spirit */}
        <div className="absolute w-16 h-20 bg-gradient-to-b from-pink-300 via-purple-400 to-indigo-500 rounded-[50px] opacity-90 blur-[2px]" />
        <div className="absolute w-12 h-16 bg-white/90 rounded-[40px] blur-[1px]" />

        {/* Anime Element: Kitsune Mask (Demon Slayer / Anime Trope) */}
        <div className="absolute top-2 w-14 h-16 bg-white rounded-t-full rounded-b-[40%] shadow-lg border border-pink-200/50 flex flex-col items-center">
          {/* Fox Ears */}
          <div className="absolute -top-3 -left-1 w-5 h-6 bg-white rotate-[-30deg] skew-x-12 rounded-t-lg border-l border-pink-200/50" />
          <div className="absolute -top-3 -right-1 w-5 h-6 bg-white rotate-[30deg] skew-x-[-12deg] rounded-t-lg border-r border-pink-200/50" />
          
          {/* Red Ear Markings */}
          <div className="absolute -top-2 left-0 w-3 h-4 bg-red-500/80 rotate-[-30deg] skew-x-12 rounded-t-sm blur-[0.5px]" />
          <div className="absolute -top-2 right-0 w-3 h-4 bg-red-500/80 rotate-[30deg] skew-x-[-12deg] rounded-t-sm blur-[0.5px]" />

          {/* Eyes (Kitsune Slits) */}
          <div className="absolute top-6 flex gap-3 w-full justify-center">
            <div className="w-4 h-1 bg-black rotate-[15deg] rounded-full" />
            <div className="w-4 h-1 bg-black rotate-[-15deg] rounded-full" />
          </div>

          {/* Red Eye Markings (Demon Slayer Sabito/Makomo style) */}
          <div className="absolute top-4 flex gap-4 w-full justify-center opacity-80">
            <div className="w-2 h-4 bg-red-500 rounded-full blur-[1px] -rotate-[15deg] translate-y-2 -translate-x-1" />
            <div className="w-2 h-4 bg-red-500 rounded-full blur-[1px] rotate-[15deg] translate-y-2 translate-x-1" />
          </div>

          {/* Mask Snout/Mouth marking */}
          <div className="absolute bottom-2 w-3 h-3 bg-red-500 rounded-full blur-[1px] opacity-70" />
        </div>

        {/* Magical floating particles emanating from the spirit */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut"
            }}
            className="absolute -bottom-4 w-2 h-2 bg-pink-300 rounded-full blur-[1px] shadow-[0_0_10px_#f472b6]"
          />
        ))}
      </motion.div>
    </div>
  );
};
