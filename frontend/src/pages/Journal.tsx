import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, Feather, CheckCircle2, Lock, Unlock, Mic, MicOff, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const Journal = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isCapsule, setIsCapsule] = useState(false);
  const [unlockDate, setUnlockDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Media Vault State
  const [isListening, setIsListening] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const wantListeningRef = useRef(false); // tracks whether user WANTS to listen (vs browser auto-end)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
           setContent(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        // Don't stop on no-speech — just let it keep trying
        if (event.error !== 'no-speech') {
          wantListeningRef.current = false;
          setIsListening(false);
        }
      };
      
      recognition.onend = () => {
        // Auto-restart if user still wants to listen
        // (browsers auto-end recognition after silence)
        if (wantListeningRef.current) {
          try {
            recognition.start();
          } catch {
            // Already started, ignore
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      wantListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      wantListeningRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        wantListeningRef.current = true;
        try {
          recognitionRef.current.start();
        } catch {
          // If already started, stop and restart
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 100);
        }
        setIsListening(true);
      } else {
        setError("Your browser does not support the Web Speech API. Try Chrome or Safari.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Client-side compression: resize to max 1200px and compress
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 1200;
        let { width, height } = img;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = (height / width) * MAX_SIZE;
            width = MAX_SIZE;
          } else {
            width = (width / height) * MAX_SIZE;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            setImageFile(resizedFile);
            setImagePreview(URL.createObjectURL(resizedFile));
          }
        }, 'image/jpeg', 0.85);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setError('');
    setSaving(true);
    
    // Stop listening before saving
    if (isListening) {
      wantListeningRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('moods', JSON.stringify([])); 
      
      if (isCapsule && unlockDate) {
        formData.append('unlockDate', new Date(unlockDate).toISOString());
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/entries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSaved(true);
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save your memory. Please try again.';
      setError(msg);
      setSaving(false);
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
      
      <div className={`flex justify-between items-center mb-10 transition-opacity duration-700 ${isFocused ? 'opacity-30' : 'opacity-100'}`}>
        <h1 className="text-4xl font-heading font-medium flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Feather className="w-6 h-6 text-primary" />
          </div>
          New Memory
        </h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving || !content.trim() || saved}
          className={`px-8 py-3.5 rounded-2xl flex items-center space-x-2 transition-all font-medium shadow-lg relative overflow-hidden group ${
            saved 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:shadow-none'
          } ${content.trim().length > 0 && !saved ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}`}
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{saved ? 'Saved securely' : 'Lock in vault'}</span>
        </motion.button>
      </div>

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
              <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`glass rounded-[3rem] p-10 md:p-14 min-h-[65vh] flex flex-col relative group transition-all duration-700 ${isFocused ? 'shadow-[0_0_50px_-10px_rgba(124,58,237,0.2)] border-primary/30 bg-card/80' : 'hover:shadow-2xl hover:shadow-primary/5'}`}>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this memory a title..."
          className="text-4xl md:text-5xl font-heading font-semibold bg-transparent border-none focus:outline-none focus:ring-0 mb-8 placeholder:text-muted-foreground/30 text-foreground transition-all"
        />
        
        <div className="w-16 h-1 bg-border/50 rounded-full mb-8" />
        
        <div className={`mb-8 flex flex-wrap items-center gap-4 transition-opacity duration-700 ${isFocused ? 'opacity-30' : 'opacity-100'}`}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCapsule(!isCapsule)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm cursor-pointer ${isCapsule ? 'bg-primary/20 border-primary/50 text-primary shadow-primary/20' : 'bg-background/50 border-border text-muted-foreground hover:bg-background/80 hover:text-foreground'}`}
          >
            {isCapsule ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="text-sm font-medium">Time Capsule</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-sm cursor-pointer ${isListening ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-red-500/20 animate-[pulse_2s_ease-in-out_infinite]' : 'bg-background/50 border-border text-muted-foreground hover:bg-background/80 hover:text-foreground'}`}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="text-sm font-medium">{isListening ? 'Listening...' : 'Voice Dictation'}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all border bg-background/50 border-border text-muted-foreground hover:bg-background/80 hover:text-foreground shadow-sm cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Add Photo</span>
          </motion.button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <AnimatePresence>
            {isCapsule && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <input 
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="bg-background/50 border border-primary/30 rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voice waveform visualization */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 40 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-1 mb-6"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, Math.random() * 24 + 8, 4] }}
                  transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                  className="w-1 rounded-full bg-red-400/60"
                  style={{ minHeight: 4 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {imagePreview && (
          <div className="relative mb-6 rounded-2xl overflow-hidden max-h-[300px] w-max group/image">
            <img src={imagePreview} alt="Memory Preview" className="object-cover w-full h-full" />
            <button 
              onClick={removeImage}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors opacity-0 group-hover/image:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isListening ? "Listening... Speak your mind." : "Start writing your thoughts here. This space is entirely yours, safe and encrypted..."}
          className="flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-xl font-light leading-relaxed placeholder:text-muted-foreground/40 text-foreground/90 selection:bg-primary/20"
        />
      </div>
    </motion.div>
  );
};
