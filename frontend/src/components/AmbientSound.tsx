import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useEmotionStore } from '../store/useEmotionStore';
import { type Emotion } from '../lib/emotionThemes';

/* 
  Programmatic ambient sound per emotion using Web Audio API.
  No audio files needed — pure synthesis.
  - Calm: warm pad (low sine + harmonic)
  - Joy: bright chimes (high sine with envelope)
  - Sadness: gentle rain noise (filtered brown noise)
  - Anger: deep rumble (low-frequency oscillation)
  - Anxiety: wind (filtered white noise with LFO)
*/

const createEmotionSound = (
  ctx: AudioContext,
  emotion: Emotion,
  masterGain: GainNode
): (() => void) => {
  const nodes: AudioNode[] = [];
  const oscillators: OscillatorNode[] = [];

  const createOsc = (type: OscillatorType, freq: number, gain: number) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    oscillators.push(osc);
    nodes.push(g);
    return { osc, gain: g };
  };

  const createNoise = (gain: number, filterFreq: number, filterQ: number = 1) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Brown noise (smoother than white)
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = filterQ;
    
    const g = ctx.createGain();
    g.gain.value = gain;
    
    source.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    source.start();
    
    nodes.push(source, filter, g);
    return { source, filter, gain: g };
  };

  switch (emotion) {
    case 'calm': {
      createOsc('sine', 174, 0.08); // F3
      createOsc('sine', 220, 0.05); // A3
      createOsc('sine', 261, 0.03); // C4
      // Gentle LFO on volume
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start();
      oscillators.push(lfo);
      nodes.push(lfoGain);
      break;
    }
    case 'joy': {
      createOsc('sine', 523, 0.04); // C5
      createOsc('sine', 659, 0.03); // E5
      createOsc('sine', 784, 0.02); // G5
      createOsc('triangle', 1047, 0.01); // C6 shimmer
      break;
    }
    case 'sadness': {
      createNoise(0.06, 800, 0.5);
      createOsc('sine', 146, 0.04); // D3 deep
      createOsc('sine', 196, 0.02); // G3
      break;
    }
    case 'anger': {
      createOsc('sawtooth', 55, 0.03); // Deep rumble
      createOsc('sine', 82, 0.04);
      createNoise(0.03, 200, 2);
      break;
    }
    case 'anxiety': {
      createNoise(0.05, 2000, 0.3);
      createOsc('sine', 220, 0.02);
      // Irregular LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.3;
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start();
      oscillators.push(lfo);
      nodes.push(lfoGain);
      break;
    }
  }

  // Cleanup function
  return () => {
    oscillators.forEach(o => {
      try { o.stop(); } catch {}
    });
    nodes.forEach(n => {
      try { n.disconnect(); } catch {}
    });
  };
};

export const AmbientSound = () => {
  const [enabled, setEnabled] = useState(false);
  const { currentEmotion } = useEmotionStore();
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const startSound = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = 0;
      masterGainRef.current.connect(ctxRef.current.destination);
    }
    
    // Cleanup previous sound
    if (cleanupRef.current) cleanupRef.current();

    const ctx = ctxRef.current;
    const masterGain = masterGainRef.current!;

    // Fade in
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);

    cleanupRef.current = createEmotionSound(ctx, currentEmotion, masterGain);
  }, [currentEmotion]);

  const stopSound = useCallback(() => {
    if (ctxRef.current && masterGainRef.current) {
      const ctx = ctxRef.current;
      const gain = masterGainRef.current;
      
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      setTimeout(() => {
        if (cleanupRef.current) cleanupRef.current();
        cleanupRef.current = null;
      }, 600);
    }
  }, []);

  // React to emotion changes while playing
  useEffect(() => {
    if (enabled) {
      startSound();
    }
  }, [currentEmotion, enabled, startSound]);

  const toggle = () => {
    if (enabled) {
      stopSound();
      setEnabled(false);
    } else {
      setEnabled(true);
      // startSound will be called by the useEffect
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
      if (ctxRef.current) {
        ctxRef.current.close();
      }
    };
  }, []);

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-strong flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all"
      title={enabled ? 'Mute ambient sound' : 'Enable ambient sound'}
    >
      <AnimatePresence mode="wait">
        {enabled ? (
          <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Volume2 className="w-5 h-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulse ring when active */}
      {enabled && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-primary/30"
        />
      )}
    </motion.button>
  );
};
