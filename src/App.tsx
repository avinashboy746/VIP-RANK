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

      <footer className="border-t border-white/10 pt-20 pb-12 bg-black/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="font-bold text-black">M</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-sans">MINE HOST</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Mine Host - Where Your Minecraft Server Comes Alive Instantly. High-performance game servers powered by latest NVMe SSDs.
              </p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                <p className="text-green-400 font-bold text-sm">Want a Powerful Host? <br/>You Found It.</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Hosting</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#plans" onClick={() => setView('home')} className="hover:text-green-400 transition-colors">Minecraft Plans</a></li>
                <li><a href="#plans" onClick={() => setView('home')} className="hover:text-green-400 transition-colors">VPS Hosting</a></li>
                <li><a href="#plans" onClick={() => setView('home')} className="hover:text-green-400 transition-colors">Web Hosting</a></li>
                <li><a href="#plans" onClick={() => setView('home')} className="hover:text-green-400 transition-colors">Server Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Infrastructure</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">DDoS Protection</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Global Network</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">NVMe Enterprise SSD</a></li>
                <li><span className="text-green-500 font-bold hover:underline cursor-pointer">Trustpilot Reviews</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">FAQ</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Knowledgebase</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Submit Ticket</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Mine Host. All rights reserved. Not an official Minecraft product.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="hover:text-white cursor-pointer hover:underline">Terms of Service</span>
              <span>|</span>
              <span className="hover:text-white cursor-pointer hover:underline">Privacy Policy</span>
            </div>
          </div>
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
