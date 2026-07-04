import { motion } from 'framer-motion';

export const BackgroundWorld = () => {
  return (
    <div className="fixed inset-0 z-[-20] overflow-hidden bg-[#0a0514] pointer-events-none select-none">
      
      {/* 1. Deep Space/Nebula Background */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ duration: 60, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 80%)',
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Dynamic Starfield */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [Math.random() * 0.3, Math.random() * 0.8 + 0.2, Math.random() * 0.3],
            scale: [1, Math.random() + 1, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            boxShadow: '0 0 4px rgba(255,255,255,0.8)'
          }}
        />
      ))}

      {/* 2. Distant Moving Creature: The Fantasy Whale */}
      <motion.div
        initial={{ x: '110vw', y: '20vh' }}
        animate={{ 
          x: '-30vw',
          y: ['20vh', '15vh', '25vh', '20vh'] 
        }}
        transition={{
          x: { duration: 120, repeat: Infinity, ease: 'linear' },
          y: { duration: 20, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute w-[400px] h-[200px] opacity-[0.15] blur-[2px] filter drop-shadow-[0_0_30px_rgba(56,189,248,0.8)]"
      >
        <svg viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Whale Body */}
          <path d="M480,100 C480,100 400,60 300,50 C200,40 100,70 50,100 C20,118 10,130 10,130 C10,130 20,140 40,140 C100,140 200,160 300,150 C400,140 480,100 480,100 Z" fill="url(#whaleGrad)" />
          {/* Whale Fins */}
          <path d="M250,145 C250,145 220,180 180,190 C180,190 200,160 220,148 Z" fill="url(#whaleGrad)" />
          <path d="M280,145 C280,145 260,160 230,165 C230,165 250,150 260,148 Z" fill="url(#whaleGrad)" opacity="0.6"/>
          {/* Whale Tail */}
          <path d="M50,100 C50,100 20,70 10,50 C10,50 30,80 40,95 C40,95 20,120 15,140 C15,140 30,115 50,100 Z" fill="url(#whaleGrad)" />
          <defs>
            <linearGradient id="whaleGrad" x1="0" y1="0" x2="500" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Smaller companion whale */}
      <motion.div
        initial={{ x: '130vw', y: '40vh' }}
        animate={{ 
          x: '-10vw',
          y: ['40vh', '45vh', '35vh', '40vh'] 
        }}
        transition={{
          x: { duration: 140, repeat: Infinity, ease: 'linear' },
          y: { duration: 15, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute w-[200px] h-[100px] opacity-[0.1] blur-[3px]"
      >
        <svg viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M480,100 C480,100 400,60 300,50 C200,40 100,70 50,100 C20,118 10,130 10,130 C10,130 20,140 40,140 C100,140 200,160 300,150 C400,140 480,100 480,100 Z" fill="#a78bfa" />
          <path d="M250,145 C250,145 220,180 180,190 C180,190 200,160 220,148 Z" fill="#a78bfa" />
          <path d="M50,100 C50,100 20,70 10,50 C10,50 30,80 40,95 C40,95 20,120 15,140 C15,140 30,115 50,100 Z" fill="#a78bfa" />
        </svg>
      </motion.div>

      {/* 3. Glowing Magical Grid (Floor) */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[40vh] opacity-20"
        style={{
          background: 'linear-gradient(transparent, rgba(139, 92, 246, 0.4))',
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) scale(2)',
            transformOrigin: 'bottom'
          }}
        />
        <motion.div 
          animate={{ y: [0, 40] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) scale(2)',
            transformOrigin: 'bottom'
          }}
        />
      </div>

    </div>
  );
};
