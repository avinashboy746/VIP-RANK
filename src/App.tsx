import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<'home' | 'auth' | 'dashboard'>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      <Navbar setView={setView} currentView={view} />
      
      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Hero setView={setView} />
              <Pricing />
            </motion.div>
          )}

          {view === 'auth' && !user && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="pt-24 pb-12 px-4"
            >
              <AuthForm onSuccess={() => setView('dashboard')} />
            </motion.div>
          )}

          {(view === 'dashboard' || (view === 'auth' && user)) && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-24 pb-12 px-4 max-w-7xl mx-auto"
            >
              {profile?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 py-12 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="font-bold text-black">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight">MINE HOST</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mine Host. All rights reserved. Not an official Minecraft product.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
