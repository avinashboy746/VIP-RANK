import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ServerInstance } from '../types';
import { 
  Plus, 
  Server, 
  Power, 
  Settings, 
  Trash2, 
  ExternalLink, 
  Cpu, 
  Zap, 
  AlertCircle,
  Clock,
  Terminal,
  Globe,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const { user } = useAuth();
  const [servers, setServers] = useState<ServerInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('iron');
  const [activeTab, setActiveTab] = useState<'minecraft' | 'vps' | 'web' | 'domains'>('minecraft');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [domainInput, setDomainInput] = useState('');
  const [isUpdatingDomain, setIsUpdatingDomain] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'servers'), where('ownerUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const serverList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServerInstance[];
      setServers(serverList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching servers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newServerName) return;

    try {
      const newServer = {
        ownerUid: user.uid,
        name: newServerName,
        plan: selectedPlan,
        status: 'provisioning',
        ip: '127.0.0.1', // Placeholder
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'servers'), newServer);
      setShowCreateModal(false);
      setNewServerName('');
    } catch (error) {
      console.error("Error creating server:", error);
    }
  };

  const toggleServerStatus = async (serverId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'running' ? 'stopped' : 'running';
      await updateDoc(doc(db, 'servers', serverId), { status: newStatus });
    } catch (error) {
      console.error("Error updating server status:", error);
    }
  };

  const deleteServer = async (serverId: string) => {
    if (!window.confirm("Are you sure you want to delete this server? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'servers', serverId));
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  const handleOpenDomainModal = (server: ServerInstance) => {
    setSelectedServer(server);
    setDomainInput(server.domain || '');
    setShowDomainModal(true);
  };

  const handleUpdateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    setIsUpdatingDomain(true);
    try {
      await updateDoc(doc(db, 'servers', selectedServer.id), {
        domain: domainInput.trim().toLowerCase()
      });
      setShowDomainModal(false);
      setSelectedServer(null);
      setDomainInput('');
    } catch (error) {
      console.error("Error updating domain:", error);
    } finally {
      setIsUpdatingDomain(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your <span className="text-green-500">Dashboard</span></h2>
          <p className="text-gray-500 text-sm mt-1">Manage all your active services and domains.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'minecraft', label: 'Minecraft', icon: Server },
          { id: 'vps', label: 'VPS', icon: Cpu },
          { id: 'web', label: 'Web', icon: Globe },
          { id: 'domains', label: 'Domains', icon: HardDrive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-green-500' : 'text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
              />
            )}
            {tab.id === 'minecraft' && servers.length > 0 && (
              <span className="ml-2 bg-green-500/20 text-green-500 text-[10px] px-1.5 py-0.5 rounded-full">
                {servers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'minecraft' && (
          <motion.div
            key="minecraft-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {servers.length === 0 ? (
              <EmptyState 
                icon={Server} 
                title="No Minecraft Servers" 
                description="Deploy your first high-performance Minecraft server in seconds."
                onAction={() => setShowCreateModal(true)}
                actionLabel="Deploy Server"
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server) => (
                  <ServerCard 
                    key={server.id} 
                    server={server} 
                    onToggle={toggleServerStatus} 
                    onDelete={deleteServer} 
                    onManageDomain={handleOpenDomainModal}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'vps' && (
          <motion.div
            key="vps-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <EmptyState 
              icon={Cpu} 
              title="No VPS Instances" 
              description="Get full root access with our high-performance VPS hosting."
              onAction={() => setShowCreateModal(true)}
              actionLabel="Order VPS"
            />
          </motion.div>
        )}

        {activeTab === 'web' && (
          <motion.div
            key="web-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <EmptyState 
              icon={Globe} 
              title="No Web Hosting" 
              description="Host your website with our reliable and fast web hosting plans."
              onAction={() => setShowCreateModal(true)}
              actionLabel="Order Web Hosting"
            />
          </motion.div>
        )}

        {activeTab === 'domains' && (
          <motion.div
            key="domains-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {servers.length === 0 ? (
              <EmptyState 
                icon={HardDrive} 
                title="No Domains" 
                description="Register your custom domain name and build your brand today."
                onAction={() => setShowCreateModal(true)}
                actionLabel="Search Domains"
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server) => (
                  <div key={server.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-green-500" />
                        <h3 className="font-bold">{server.name}</h3>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Current Domain</span>
                          <span className="text-white font-mono">{server.domain || 'None'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Server IP</span>
                          <span className="text-white font-mono">{server.ip}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenDomainModal(server)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      {server.domain ? 'Change Domain' : 'Connect Domain'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDomainModal && selectedServer && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDomainModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-2">Connect <span className="text-green-500">Domain</span></h3>
              <p className="text-gray-500 text-sm mb-6">Link your custom domain to <span className="text-white font-bold">{selectedServer.name}</span>.</p>
              
              <form onSubmit={handleUpdateDomain} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Domain Name</label>
                  <input 
                    type="text" 
                    required 
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="e.g. minehost.qd.je"
                  />
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-blue-400 font-bold">DNS Setup Required</p>
                    <p className="text-[10px] text-blue-400/80 leading-relaxed">
                      Point your domain's A record to <span className="text-white font-mono">{selectedServer.ip}</span>. DNS changes can take up to 24 hours to propagate.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowDomainModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdatingDomain}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUpdatingDomain ? 'Saving...' : 'Save Domain'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Deploy New <span className="text-green-500">Service</span></h3>
              
              <form onSubmit={handleCreateServer} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Service Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="My Epic Project"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Select Plan</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['grass', 'iron', 'diamond'].map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`py-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                          selectedPlan === plan ? 'bg-green-500 border-green-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-green-400/80 leading-relaxed">
                    Services are provisioned instantly. You'll receive access details in a few moments.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
                  >
                    Deploy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, onAction, actionLabel }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-8">{description}</p>
      <button 
        onClick={onAction}
        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function ServerCard({ server, onToggle, onDelete, onManageDomain }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            server.status === 'running' ? 'bg-green-500/20 text-green-500' : 
            server.status === 'provisioning' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-500'
          }`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">{server.name}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{server.plan} Plan</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          server.status === 'running' ? 'bg-green-500/20 text-green-500' : 
          server.status === 'provisioning' ? 'bg-blue-500/20 text-blue-500 animate-pulse' : 'bg-red-500/20 text-red-500'
        }`}>
          {server.status}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <Terminal className="w-3 h-3" />
            <span>IP Address</span>
          </div>
          <span className="text-white font-mono">{server.ip || 'Allocating...'}</span>
        </div>
        {server.domain && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <Globe className="w-3 h-3 text-green-500" />
              <span>Domain</span>
            </div>
            <span className="text-green-400 font-bold">{server.domain}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Created</span>
          </div>
          <span className="text-white">{server.createdAt?.toDate().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => onToggle(server.id, server.status)}
          disabled={server.status === 'provisioning'}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all active:scale-95 ${
            server.status === 'running' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
          } disabled:opacity-50`}
        >
          <Power className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase">{server.status === 'running' ? 'Stop' : 'Start'}</span>
        </button>
        <button 
          onClick={() => onManageDomain(server)}
          className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all active:scale-95"
        >
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase">Domain</span>
        </button>
        <button 
          onClick={() => onDelete(server.id)}
          className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase">Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
