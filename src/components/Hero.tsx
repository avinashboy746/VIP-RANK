import { motion } from 'motion/react';
import { Play, Shield, Zap, Server } from 'lucide-react';

interface HeroProps {
  setView: (view: 'home' | 'auth' | 'dashboard') => void;
}

export function Hero({ setView }: HeroProps) {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              Instant Deployment
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-[0.9] mb-6">
              PREMIUM <br />
              <span className="text-green-500">MINECRAFT</span> <br />
              HOSTING
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Experience lag-free gaming with our high-performance servers. 
              Powered by NVMe SSDs and DDR4 RAM for the ultimate Minecraft experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setView('auth')}
                className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Your Server
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <Shield className="w-5 h-5" />
                View Features
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">99.9%</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Uptime</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Support</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">&lt;10ms</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Latency</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
              <div className="bg-black/80 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Survival World</h3>
                      <p className="text-xs text-gray-500">v1.20.4 • Vanilla</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                    Online
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 uppercase tracking-widest">CPU Usage</span>
                      <span className="text-white font-bold">12%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[12%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 uppercase tracking-widest">RAM Usage</span>
                      <span className="text-white font-bold">2.4GB / 8GB</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[30%]"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-black rounded-xl border border-white/5 font-mono text-[10px] text-green-400/80">
                  <p>[14:24:59] [Server thread/INFO]: Starting minecraft server version 1.20.4</p>
                  <p>[14:25:01] [Server thread/INFO]: Loading properties</p>
                  <p>[14:25:05] [Server thread/INFO]: Default game type: SURVIVAL</p>
                  <p>[14:25:10] [Server thread/INFO]: Done (11.2s)! For help, type "help"</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/20 rounded-2xl border border-green-500/30 backdrop-blur-sm z-20 flex items-center justify-center"
            >
              <Zap className="w-10 h-10 text-green-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
