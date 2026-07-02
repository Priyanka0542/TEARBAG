import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { useStore } from './store/useStore';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Journal } from './pages/Journal';
import { Garden } from './pages/Garden';
import { Backpack } from './pages/Backpack';
import { Analytics } from './pages/Analytics';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

import { AnimatePresence, motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 100, -150, 0],
          scale: [1, 1.5, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-pink-500/10 rounded-full blur-[150px] mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 80, -80, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen"
      />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/garden" 
          element={
            <ProtectedRoute>
              <Garden />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/backpack" 
          element={
            <ProtectedRoute>
              <Backpack />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
        <BackgroundEffects />
        <Navbar />
        <main className="pt-24 pb-10 px-4 max-w-6xl mx-auto relative z-10">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
