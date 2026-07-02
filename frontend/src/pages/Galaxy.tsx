import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Maximize2 } from 'lucide-react';
import { api } from '../lib/api';
import { format } from 'date-fns';

const moodColors: Record<string, string> = {
  'Happy': '#FCD34D',
  'Sad': '#60A5FA',
  'Anxious': '#F87171',
  'Grateful': '#34D399',
  'Angry': '#EF4444',
  'Tired': '#9CA3AF',
  'Loved': '#F472B6',
  'Excited': '#38BDF8',
};

const MemoryStar = ({ entry, position }: { entry: any, position: [number, number, number] }) => {
  const [hovered, setHovered] = useState(false);
  
  const primaryMood = entry.moods && entry.moods.length > 0 ? entry.moods[0] : 'Neutral';
  const color = moodColors[primaryMood] || '#ffffff';

  return (
    <Float speed={hovered ? 5 : 2} rotationIntensity={hovered ? 2 : 1} floatIntensity={hovered ? 4 : 2}>
      <mesh 
        position={position}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[hovered ? 0.35 : 0.2, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 4 : 2} 
          toneMapped={false}
        />
        
        {hovered && (
          <Html distanceFactor={15} center zIndexRange={[100, 0]}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-xl border border-white/20 p-4 rounded-2xl pointer-events-none w-56 text-left shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <div className="flex gap-2 mb-2 items-center">
                <span className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color: color }} />
                <span className="text-[10px] text-white/90 uppercase tracking-widest font-bold">{primaryMood}</span>
              </div>
              <p className="text-white font-medium text-sm line-clamp-2 leading-tight">{entry.title || 'Memory'}</p>
              <p className="text-white/50 text-xs mt-2">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
            </motion.div>
          </Html>
        )}
      </mesh>
    </Float>
  );
};

export const Galaxy = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await api.get('/entries');
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch entries for galaxy:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
    
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const arms = 3; 
    const armSeparationDistance = 2 * Math.PI / arms;
    const armOffsetMax = 0.5;
    const rotationFactor = 5;

    for (let i = 0; i < entries.length; i++) {
      const distance = Math.random() * 20; 
      const angle = Math.random() * 2 * Math.PI; 
      
      const armOffset = Math.random() * armOffsetMax;
      const armAngle = (Math.floor(Math.random() * arms) * armSeparationDistance) + armOffset;
      
      const theta = distance / rotationFactor + armAngle;
      
      const x = Math.cos(theta) * distance;
      const z = Math.sin(theta) * distance;
      
      // Add random spread and thickness
      const spreadX = (Math.random() - 0.5) * (distance * 0.1);
      const spreadZ = (Math.random() - 0.5) * (distance * 0.1);
      const y = (Math.random() - 0.5) * 2 * (1 - distance / 25); 

      pos.push([x + spreadX, y, z + spreadZ]);
    }
    return pos;
  }, [entries]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 w-screen h-screen bg-[#020208] z-0 overflow-hidden"
    >
      <div className="absolute top-24 left-10 z-10 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-white flex items-center gap-4 mb-2 drop-shadow-2xl">
          Memory Galaxy
        </h1>
        <p className="text-white/70 text-lg drop-shadow-md">
          {entries.length} glowing moments suspended in time.
        </p>
      </div>
      
      <div className="absolute bottom-10 right-10 z-10 pointer-events-none text-white/70 flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full shadow-2xl">
        <Maximize2 className="w-4 h-4" />
        <span className="text-sm font-medium tracking-wide">Drag to orbit &bull; Scroll to zoom</span>
      </div>

      <Canvas camera={{ position: [0, 15, 25], fov: 60 }}>
        <color attach="background" args={['#010105']} />
        <fog attach="fog" args={['#010105', 10, 50]} />
        
        <ambientLight intensity={0.2} />
        
        <Stars radius={100} depth={50} count={7000} factor={6} saturation={0.5} fade speed={1.5} />
        
        <group rotation={[Math.PI / 8, 0, 0]}>
          {entries.map((entry, idx) => (
            <MemoryStar key={entry._id} entry={entry} position={positions[idx]} />
          ))}
        </group>
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} />
        </EffectComposer>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={40}
          minDistance={2}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </motion.div>
  );
};
