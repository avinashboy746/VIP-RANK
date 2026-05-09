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
    id: 'invite',
    name: 'Invite Plan',
    price: 0,
    ram: '1GB',
    cpu: '1 Core',
    slots: '10',
    features: ['Free Forever', 'Community Support', 'Standard SSD', 'Public IP'],
    color: 'gray',
    tag: 'Free'
  },
  {
    id: 'grass',
    name: 'Grass Plan',
    price: 4.99,
    ram: '2GB',
    cpu: '1 Core',
    slots: '20',
    features: ['Instant Setup', 'NVMe SSD Storage', 'DDoS Protection', '99.9% Uptime'],
    color: 'green'
  },
  {
    id: 'iron',
    name: 'Iron Plan',
    price: 9.99,
    ram: '4GB',
    cpu: '2 Cores',
    slots: '50',
    features: ['Instant Setup', 'NVMe SSD Storage', 'DDoS Protection', '99.9% Uptime', 'Daily Backups'],
    color: 'blue',
    popular: true
  },
  {
    id: 'diamond',
    name: 'Diamond Plan',
    price: 19.99,
    ram: '8GB',
    cpu: '4 Cores',
    slots: 'Unlimited',
    features: ['Instant Setup', 'NVMe SSD Storage', 'DDoS Protection', '99.9% Uptime', 'Daily Backups', 'Priority Support'],
    color: 'cyan'
  }
];

const vpsPlans = [
  {
    id: 'vps-starter',
    name: 'VPS Starter',
    price: 14.99,
    ram: '4GB',
    cpu: '2 vCPU',
    storage: '80GB NVMe',
    features: ['Full Root Access', 'Dedicated IP', 'Any OS (Linux/Windows)', 'DDoS Protection'],
    color: 'purple'
  },
  {
    id: 'vps-pro',
    name: 'VPS Pro',
    price: 29.99,
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
    price: 2.99,
    storage: '10GB SSD',
    bandwidth: 'Unlimited',
    features: ['1 Website', 'Free SSL', 'cPanel Access', 'Daily Backups'],
    color: 'orange'
  },
  {
    id: 'web-business',
    name: 'Web Business',
    price: 7.99,
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
                        Buy Now - $12.99/yr
                      </button>
                    )}
                  </motion.div>
                )}

                <div className="mt-12 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-green-500 font-bold block text-lg">.com</span>
                    <span className="text-gray-500 text-xs">$12.99/yr</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-blue-500 font-bold block text-lg">.net</span>
                    <span className="text-gray-500 text-xs">$10.99/yr</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-purple-500 font-bold block text-lg">.org</span>
                    <span className="text-gray-500 text-xs">$11.99/yr</span>
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
          <span className="text-4xl font-bold text-white">${plan.price}</span>
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
