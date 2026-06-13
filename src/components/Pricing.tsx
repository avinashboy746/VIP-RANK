import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Shield, Cpu, Globe, Server, HardDrive, CreditCard } from 'lucide-react';

type Category = 'minecraft' | 'vps' | 'web' | 'domain';

const categories: { id: Category; label: string; icon: any }[] = [
  { id: 'minecraft', label: 'Minecraft', icon: Server },
  { id: 'vps', label: 'VPS Hosting', icon: Cpu },
  { id: 'web', label: 'Web Hosting', icon: Globe },
  { id: 'domain', label: 'Domains', icon: HardDrive },
];

const minecraftPlans = [
  {
    id: 'dirt',
    name: 'Dirt',
    price: 49,
    ram: '1.0 GB',
    cpu: '100%',
    storage: '5 GB',
    backups: '2 Backups',
    features: ['100% CPU', '1.0 GB RAM', '5 GB Storage', '1 Port Allocation', '2 Backups', '24/7 Support'],
    color: 'orange'
  },
  {
    id: 'grass',
    name: 'Grass',
    price: 99,
    ram: '2.0 GB',
    cpu: '150%',
    storage: '10 GB',
    backups: '3 Backups',
    features: ['150% CPU', '2.0 GB RAM', '10 GB Storage', '1 Port Allocation', '3 Backups', '24/7 Support'],
    color: 'green'
  },
  {
    id: 'stone',
    name: 'Stone',
    price: 179,
    ram: '4.0 GB',
    cpu: '200%',
    storage: '20 GB',
    backups: '4 Backups',
    features: ['200% CPU', '4.0 GB RAM', '20 GB Storage', '1 Port Allocation', '4 Backups', '24/7 Support'],
    color: 'gray',
    popular: true
  },
  {
    id: 'coal',
    name: 'Coal',
    price: 249,
    ram: '6.0 GB',
    cpu: '250%',
    storage: '25 GB',
    backups: '4 Backups',
    features: ['250% CPU', '6.0 GB RAM', '25 GB Storage', '1 Port Allocation', '4 Backups', '24/7 Support'],
    color: 'gray'
  },
  {
    id: 'iron',
    name: 'Iron',
    price: 349,
    ram: '8.0 GB',
    cpu: '300%',
    storage: '35 GB',
    backups: '5 Backups',
    features: ['300% CPU', '8.0 GB RAM', '35 GB Storage', '1 Port Allocation', '5 Backups', '24/7 Support'],
    color: 'blue',
    popular: true
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 549,
    ram: '12.0 GB',
    cpu: '400%',
    storage: '50 GB',
    backups: '7 Backups',
    features: ['400% CPU', '12.0 GB RAM', '50 GB Storage', '1 Port Allocation', '7 Backups', '24/7 Support'],
    color: 'yellow'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 799,
    ram: '16.0 GB',
    cpu: '500%',
    storage: '70 GB',
    backups: '10 Backups',
    features: ['500% CPU', '16.0 GB RAM', '70 GB Storage', '1 MySQL Database', '1 Port Allocation', '10 Backups', '24/7 Support'],
    color: 'cyan'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    price: 1099,
    ram: '24.0 GB',
    cpu: '600%',
    storage: '100 GB',
    backups: '14 Backups',
    features: ['600% CPU', '24.0 GB RAM', '100 GB Storage', '1 MySQL Database', '2 Port Allocations', '14 Backups', '24/7 Support'],
    color: 'emerald'
  },
  {
    id: 'netherite',
    name: 'Netherite',
    price: 1499,
    ram: '32.0 GB',
    cpu: '700%',
    storage: '140 GB',
    backups: '20 Backups',
    features: ['700% CPU', '32.0 GB RAM', '140 GB Storage', '1 MySQL Database', '3 Port Allocations', '20 Backups', '24/7 Support'],
    color: 'purple'
  }
];

const vpsPlans = [
  {
    id: 'vps-starter',
    name: 'VPS Starter',
    price: 1299,
    ram: '4GB',
    cpu: '2 vCPU',
    storage: '80GB NVMe',
    features: ['Full Root Access', 'Dedicated IP', 'Any OS (Linux/Windows)', 'DDoS Protection'],
    color: 'purple'
  },
  {
    id: 'vps-pro',
    name: 'VPS Pro',
    price: 2499,
    ram: '8GB',
    cpu: '4 vCPU',
    storage: '160GB NVMe',
    features: ['Full Root Access', 'Dedicated IP', 'Any OS (Linux/Windows)', 'DDoS Protection', 'Premium Network'],
    color: 'indigo',
    popular: true
  }
];

const webPlans = [
  {
    id: 'web-basic',
    name: 'Web Basic',
    price: 249,
    storage: '10GB SSD',
    bandwidth: 'Unlimited',
    features: ['1 Website', 'Free SSL', 'cPanel Access', 'Daily Backups'],
    color: 'orange'
  },
  {
    id: 'web-business',
    name: 'Web Business',
    price: 649,
    storage: 'Unlimited SSD',
    bandwidth: 'Unlimited',
    features: ['Unlimited Websites', 'Free SSL', 'cPanel Access', 'Daily Backups', 'Free Domain (1yr)'],
    color: 'red',
    popular: true
  }
];

export function Pricing() {
  const [activeCategory, setActiveCategory] = useState<Category>('minecraft');
  const [domainSearch, setDomainSearch] = useState('');
  const [domainStatus, setDomainStatus] = useState<'idle' | 'searching' | 'available' | 'taken'>('idle');

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainSearch) return;
    setDomainStatus('searching');
    setTimeout(() => {
      setDomainStatus(Math.random() > 0.3 ? 'available' : 'taken');
    }, 1500);
  };

  return (
    <section className="py-24 bg-black/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">OUR <span className="text-green-500">SERVICES</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From Minecraft servers to enterprise VPS and domains, we have everything you need to build your online presence.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeCategory === 'minecraft' && (
            <motion.div
              key="minecraft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {minecraftPlans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} index={index} />
              ))}
            </motion.div>
          )}

          {activeCategory === 'vps' && (
            <motion.div
              key="vps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {vpsPlans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} index={index} />
              ))}
            </motion.div>
          )}

          {activeCategory === 'web' && (
            <motion.div
              key="web"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {webPlans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} index={index} />
              ))}
            </motion.div>
          )}

          {activeCategory === 'domain' && (
            <motion.div
              key="domain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <Globe className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Find Your Perfect Domain</h3>
                <p className="text-gray-400 mb-8">Register your custom domain name and build your brand today.</p>
                
                <form onSubmit={handleDomainSearch} className="flex gap-2 mb-8">
                  <input 
                    type="text" 
                    placeholder="yourname.com"
                    value={domainSearch}
                    onChange={(e) => setDomainSearch(e.target.value)}
                    className="flex-1 bg-black border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-green-500 transition-colors text-lg"
                  />
                  <button 
                    type="submit"
                    disabled={domainStatus === 'searching'}
                    className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {domainStatus === 'searching' ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {domainStatus !== 'idle' && domainStatus !== 'searching' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-2xl border flex items-center justify-between ${
                      domainStatus === 'available' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        domainStatus === 'available' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                      }`}>
                        {domainStatus === 'available' ? <Check className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{domainSearch}</p>
                        <p className={`text-sm ${domainStatus === 'available' ? 'text-green-400' : 'text-red-400'}`}>
                          {domainStatus === 'available' ? 'Domain is available!' : 'Domain is already taken.'}
                        </p>
                      </div>
                    </div>
                    {domainStatus === 'available' && (
                      <button className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-bold transition-all">
                        Buy Now - ₹1,099/yr
                      </button>
                    )}
                  </motion.div>
                )}

                <div className="mt-12 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-green-500 font-bold block text-lg">.com</span>
                    <span className="text-gray-500 text-xs">₹1,099/yr</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-blue-500 font-bold block text-lg">.net</span>
                    <span className="text-gray-500 text-xs font-medium">₹949/yr</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-purple-500 font-bold block text-lg">.org</span>
                    <span className="text-gray-500 text-xs">₹999/yr</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const PlanCard: React.FC<{ plan: any; index: number }> = ({ plan, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group p-8 rounded-3xl border transition-all hover:scale-[1.02] ${
        plan.popular 
          ? 'bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      {plan.tag && (
        <div className="absolute top-4 right-4 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/10">
          {plan.tag}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">₹{plan.price}</span>
          <span className="text-gray-500 text-sm">{plan.price === 0 ? '' : '/month'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {plan.ram && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-white">{plan.ram}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">RAM</span>
          </div>
        )}
        {plan.cpu && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-white">{plan.cpu}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">CPU</span>
          </div>
        )}
        {plan.storage && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
            <HardDrive className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-white">{plan.storage}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Storage</span>
          </div>
        )}
        {plan.bandwidth && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
            <Globe className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-white">{plan.bandwidth}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Bandwidth</span>
          </div>
        )}
        {plan.backups && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-white">{plan.backups}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Backups</span>
          </div>
        )}
      </div>

      <ul className="space-y-4 mb-10">
        {plan.features.map((feature: string, fIndex: number) => (
          <li key={fIndex} className="flex items-center gap-3 text-sm text-gray-400">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
        plan.popular 
          ? 'bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/20' 
          : 'bg-white/10 hover:bg-white/20 text-white'
      }`}>
        <CreditCard className="w-5 h-5" />
        {plan.price === 0 ? 'Get Started' : 'Order Now'}
      </button>
    </motion.div>
  );
};
