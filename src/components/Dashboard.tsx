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
  HardDrive,
  Edit,
  Eye,
  Layout,
  Palette,
  Check,
  Share2,
  Copy,
  Code,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const { user } = useAuth();
  const [servers, setServers] = useState<ServerInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('stone');
  const [activeTab, setActiveTab] = useState<'minecraft' | 'vps' | 'web' | 'domains'>('minecraft');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [domainInput, setDomainInput] = useState('');
  const [isUpdatingDomain, setIsUpdatingDomain] = useState(false);

  // Free Web Builder States
  const [websites, setWebsites] = useState<any[]>([]);
  const [loadingWebsites, setLoadingWebsites] = useState(true);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [selectedWebTemplate, setSelectedWebTemplate] = useState<'minecraft' | 'portfolio' | 'clan'>('minecraft');
  const [webTitle, setWebTitle] = useState('');
  const [webSubdomain, setWebSubdomain] = useState('');
  const [webBaseDomain, setWebBaseDomain] = useState('minehost.qd.je');
  const [webDesc, setWebDesc] = useState('');
  const [webAccent, setWebAccent] = useState('#22c55e'); // Green default
  const [webServerIp, setWebServerIp] = useState('');
  const [webDiscord, setWebDiscord] = useState('');
  const [webAbout, setWebAbout] = useState('');
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState<any | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'websites'), where('ownerUid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const websiteList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWebsites(websiteList);
      setLoadingWebsites(false);
    }, (error) => {
      console.error("Error fetching websites:", error);
      setLoadingWebsites(false);
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

  const handleSaveWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !webTitle || !webSubdomain) return;

    const domainName = webSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!domainName) return;

    try {
      const payload = {
        ownerUid: user.uid,
        name: webTitle,
        subdomain: domainName,
        domain: webBaseDomain,
        template: selectedWebTemplate,
        accentColor: webAccent,
        description: webDesc,
        serverIp: webServerIp,
        discordLink: webDiscord,
        aboutText: webAbout,
        updatedAt: serverTimestamp()
      };

      if (editingWebsiteId) {
        await updateDoc(doc(db, 'websites', editingWebsiteId), payload);
      } else {
        await addDoc(collection(db, 'websites'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      // Reset states
      setWebTitle('');
      setWebSubdomain('');
      setWebDesc('');
      setWebServerIp('');
      setWebDiscord('');
      setWebAbout('');
      setWebAccent('#22c55e');
      setEditingWebsiteId(null);
      setShowBuilderModal(false);
    } catch (error) {
      console.error("Error saving website:", error);
    }
  };

  const handleEditWebsite = (website: any) => {
    setEditingWebsiteId(website.id);
    setWebTitle(website.name || '');
    setWebSubdomain(website.subdomain || '');
    setWebBaseDomain(website.domain || 'minehost.qd.je');
    setSelectedWebTemplate(website.template || 'minecraft');
    setWebAccent(website.accentColor || '#22c55e');
    setWebDesc(website.description || '');
    setWebServerIp(website.serverIp || '');
    setWebDiscord(website.discordLink || '');
    setWebAbout(website.aboutText || '');
    setShowBuilderModal(true);
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!window.confirm("Are you sure you want to delete this website? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'websites', websiteId));
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  const handleCopyLink = (domainStr: string) => {
    navigator.clipboard.writeText(domainStr);
    setCopySuccess(domainStr);
    setTimeout(() => setCopySuccess(null), 2000);
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
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Free Subdomain Web hosting & Creator
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Design beautiful game server pages, portals, and portfolios under your chosen subdomain completely free.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingWebsiteId(null);
                  setWebTitle('');
                  setWebSubdomain('');
                  setWebBaseDomain('minehost.qd.je');
                  setSelectedWebTemplate('minecraft');
                  setWebAccent('#22c55e');
                  setWebDesc('');
                  setWebServerIp('');
                  setWebDiscord('');
                  setWebAbout('');
                  setShowBuilderModal(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Free Website
              </button>
            </div>

            {loadingWebsites ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : websites.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">No Websites Created Yet</h4>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  Design a stunning Minecraft Server Page, Clan Portal, or Personal Profile with zero code and host it completely free!
                </p>
                <button
                  onClick={() => setShowBuilderModal(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  Create Your First Website
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {websites.map((site) => {
                  const fullUrl = `https://${site.subdomain}.${site.domain || 'minehost.qd.je'}`;
                  return (
                    <div key={site.id} className="bg-white/5 border border-white/15 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/15 px-2 py-1 rounded">
                              {site.template === 'minecraft' ? 'Server Page' : site.template === 'clan' ? 'Clan Portal' : 'Portfolio'}
                            </span>
                            <h4 className="text-lg font-bold text-white mt-2 leading-snug">{site.name}</h4>
                            <p className="text-green-400/80 text-xs mt-1 font-mono hover:underline cursor-pointer" onClick={() => setShowLivePreview(site)}>{fullUrl}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditWebsite(site)}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                              title="Edit Website"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWebsite(site.id)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Delete Website"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mt-2 leading-relaxed">
                          {site.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopyLink(fullUrl)}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                          >
                            {copySuccess === fullUrl ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              alert("DNA Routing updated mapping " + site.subdomain + "." + site.domain + " successfully to India Global-Scale Cloud Edge!");
                            }}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>DNA Map</span>
                          </button>
                        </div>
                        <button
                          onClick={() => setShowLivePreview(site)}
                          className="bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/30 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Live Preview
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors text-white appearance-none cursor-pointer"
                  >
                    <option value="dirt">Dirt Plan (₹49/mo - 1GB RAM)</option>
                    <option value="grass">Grass Plan (₹99/mo - 2GB RAM)</option>
                    <option value="stone">Stone Plan (₹179/mo - 4GB RAM)</option>
                    <option value="coal">Coal Plan (₹249/mo - 6GB RAM)</option>
                    <option value="iron">Iron Plan (₹349/mo - 8GB RAM)</option>
                    <option value="gold">Gold Plan (₹549/mo - 12GB RAM)</option>
                    <option value="diamond">Diamond Plan (₹799/mo - 16GB RAM)</option>
                    <option value="emerald">Emerald Plan (₹1099/mo - 24GB RAM)</option>
                    <option value="netherite">Netherite Plan (₹1499/mo - 32GB RAM)</option>
                  </select>
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

      {/* Website Creator / Editor Modal */}
      <AnimatePresence>
        {showBuilderModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuilderModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Globe className="text-green-500 w-6 h-6" />
                    {editingWebsiteId ? 'Modify Your Website' : 'Design Your Free Website'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Design, configure and publish instantly on premium subdomains.</p>
                </div>
                <button 
                  onClick={() => setShowBuilderModal(false)}
                  className="text-gray-400 hover:text-white font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveWebsite} className="space-y-6">
                {/* Step 1: Select Template Style */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">1. Select Website Template</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'minecraft', title: 'Minecraft Server', desc: 'Hero banner, IP copy, stats card', icon: Server },
                      { id: 'clan', title: 'Clan Portal', desc: 'Recruitment board, Discord widget', icon: Layout },
                      { id: 'portfolio', title: 'Player Profile', desc: 'Custom bio, roles, skill level', icon: Zap }
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedWebTemplate(tpl.id as any)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedWebTemplate === tpl.id 
                            ? 'bg-green-500/10 border-green-500 text-white' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <tpl.icon className={`w-5 h-5 mb-2 ${selectedWebTemplate === tpl.id ? 'text-green-400' : 'text-gray-400'}`} />
                        <h4 className="font-bold text-sm text-white">{tpl.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-snug">{tpl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Custom Subdomain Choice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">2. Type Subdomain Name</label>
                    <div className="flex bg-black border border-white/10 rounded-xl overflow-hidden focus-within:border-green-500 transition-colors">
                      <input 
                        type="text" 
                        required
                        value={webSubdomain}
                        onChange={(e) => setWebSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="flex-1 bg-transparent py-3 px-4 outline-none text-white text-sm"
                        placeholder="e.g. survival-clan"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Base Domain Suffix</label>
                    <select
                      value={webBaseDomain}
                      onChange={(e) => setWebBaseDomain(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors text-white text-sm appearance-none cursor-pointer"
                    >
                      <option value="minehost.qd.je">.minehost.qd.je</option>
                      <option value="avinash.qd.je">.avinash.qd.je</option>
                      <option value="minehost.avinash.qd.je">.minehost.avinash.qd.je</option>
                    </select>
                  </div>
                </div>

                {/* Live Preview of URL */}
                {webSubdomain && (
                  <div className="text-xs font-mono text-green-400 bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                    🌐 Webpage Live URL: <span className="underline font-bold">https://{webSubdomain}.{webBaseDomain}</span>
                  </div>
                )}

                {/* Step 3: Base Settings */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">3. Content Customization</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 block">Website Title/Heading</label>
                      <input 
                        type="text" 
                        required
                        value={webTitle}
                        onChange={(e) => setWebTitle(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors text-sm"
                        placeholder="My Awesome Network / Clan"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 block">Theme Accent Preset</label>
                      <div className="flex gap-2 h-11 items-center bg-black border border-white/10 rounded-xl px-4">
                        {[
                          { val: '#22c55e', name: 'Emerald' },
                          { val: '#06b6d4', name: 'Diamond' },
                          { val: '#f59e0b', name: 'Amber' },
                          { val: '#ef4444', name: 'Crimson' },
                          { val: '#8b5cf6', name: 'Aether' }
                        ].map((color) => (
                          <button
                            key={color.val}
                            type="button"
                            onClick={() => setWebAccent(color.val)}
                            className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                            style={{ backgroundColor: color.val }}
                            title={color.name}
                          >
                            {webAccent === color.val && <Check className="w-3.5 h-3.5 text-black" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block">Short Description / Subtitle</label>
                    <textarea 
                      value={webDesc}
                      onChange={(e) => setWebDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors text-sm"
                      placeholder="Welcome to our Minecraft portal! Active 24/7, friendly community, clean survival."
                    />
                  </div>

                  {/* Template-specific settings */}
                  {selectedWebTemplate === 'minecraft' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs text-green-400 block">Minecraft Server Connect IP</label>
                        <input 
                          type="text" 
                          value={webServerIp}
                          onChange={(e) => setWebServerIp(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
                          placeholder="e.g. play.minehost.qd.je"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-green-400 block">Community Discord Link</label>
                        <input 
                          type="text" 
                          value={webDiscord}
                          onChange={(e) => setWebDiscord(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
                          placeholder="e.g. discord.gg/minehost"
                        />
                      </div>
                    </div>
                  )}

                  {selectedWebTemplate === 'clan' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs text-cyan-400 block">About Clan / Recruitment Details</label>
                        <textarea 
                          value={webAbout}
                          onChange={(e) => setWebAbout(e.target.value)}
                          rows={2}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-green-500 transition-colors text-sm"
                          placeholder="We are recruiting mature builders and PvP masters! Apply via discord."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-cyan-400 block">Discord Server Widget / Link</label>
                        <input 
                          type="text" 
                          value={webDiscord}
                          onChange={(e) => setWebDiscord(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                          placeholder="e.g. discord.gg/clanlink"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-cyan-400 block">Active Members Count Preset</label>
                        <input 
                          type="text" 
                          value={webServerIp}
                          onChange={(e) => setWebServerIp(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                          placeholder="e.g. 42 Members"
                        />
                      </div>
                    </div>
                  )}

                  {selectedWebTemplate === 'portfolio' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs text-purple-400 block">Player Roles (comma separated)</label>
                        <input 
                          type="text" 
                          value={webServerIp}
                          onChange={(e) => setWebServerIp(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                          placeholder="e.g. Builder, Redstoner, Mod"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-purple-400 block">Discord Handle / Tag</label>
                        <input 
                          type="text" 
                          value={webDiscord}
                          onChange={(e) => setWebDiscord(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                          placeholder="e.g. Steve#1337"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs text-purple-400 block">Tell people about yourself</label>
                        <textarea 
                          value={webAbout}
                          onChange={(e) => setWebAbout(e.target.value)}
                          rows={2}
                          className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                          placeholder="Write a custom bio..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setShowBuilderModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black py-3.5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    {editingWebsiteId ? 'Update & Deploy' : 'Publish Website'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Website Live Dynamic Preview Modal (Simulates a beautifully rendered website live in a browserframe) */}
      <AnimatePresence>
        {showLivePreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[85vh] shadow-2xl"
            >
              {/* Browser Address Bar UI */}
              <div className="bg-[#1f1f1f] border-b border-white/10 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                <div className="flex-1 max-w-xl mx-auto bg-black/50 border border-white/5 rounded-xl py-1.5 px-4 text-xs text-gray-400 flex items-center justify-center gap-2 font-mono">
                  <span className="text-green-500 font-bold select-none">https://</span>
                  <span className="text-white font-bold select-all">{showLivePreview.subdomain}.{showLivePreview.domain}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(`https://${showLivePreview.subdomain}.${showLivePreview.domain}`)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all flex items-center gap-1 cursor-pointer text-xs font-bold"
                  >
                    {copySuccess === `https://${showLivePreview.subdomain}.${showLivePreview.domain}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copySuccess === `https://${showLivePreview.subdomain}.${showLivePreview.domain}` ? 'Copied' : 'Share'}</span>
                  </button>
                  <button
                    onClick={() => setShowLivePreview(null)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs font-bold px-3.5 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Dynamic Live Preview Screen Container */}
              <div className="flex-1 overflow-y-auto bg-black relative p-6 sm:p-12 text-left">
                {/* Simulated Custom Accent Aura */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px]" style={{
                  background: `radial-gradient(circle, ${showLivePreview.accentColor || '#22c55e'} 0%, transparent 70%)`
                }}></div>

                <div className="relative max-w-4xl mx-auto space-y-12 z-10">
                  {/* Website Header */}
                  <div className="flex justify-between items-center pb-6 border-b border-white/10">
                    <span className="font-bold text-lg tracking-tight uppercase" style={{ color: showLivePreview.accentColor }}>
                      {showLivePreview.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full font-mono border border-white/5">
                      📶 LIVE & PORTABLE
                    </span>
                  </div>

                  {/* Render Template 1: Minecraft Server style */}
                  {showLivePreview.template === 'minecraft' && (
                    <div className="space-y-10 py-6">
                      <div className="space-y-4 text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                          Welcome to <span style={{ color: showLivePreview.accentColor }}>{showLivePreview.name}</span>
                        </h1>
                        <p className="text-gray-400 text-base leading-relaxed">
                          {showLivePreview.description || 'No custom description set yet. Click Edit to customize this subtitle in Webspace Creator.'}
                        </p>
                      </div>

                      {/* Server Status Indicators & Join Board */}
                      <div className="grid sm:grid-cols-2 gap-6 pt-6">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Connect Server</span>
                            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Copy the IP address below to add to your Minecraft multiplayer server list!</p>
                          </div>
                          <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl p-3">
                            <span className="font-mono text-xs text-white flex-1 select-all">{showLivePreview.serverIp || 'play.minehost.qd.je'}</span>
                            <button 
                              onClick={() => handleCopyLink(showLivePreview.serverIp || 'play.minehost.qd.je')}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                            >
                              IP Copy
                            </button>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Server Health</span>
                              <span className="flex items-center gap-1.5 text-xs text-green-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Enjoy zero lag gaming hosted with high performance NVMe SSD nodes!</p>
                          </div>
                          <div className="flex items-center justify-between text-xs bg-black border border-white/10 rounded-xl p-3 pt-4">
                            <span className="text-gray-400 font-bold">Active Players</span>
                            <span className="text-white font-mono bg-green-500/20 px-2 py-0.5 rounded text-green-400 font-bold">42 / 100</span>
                          </div>
                        </div>
                      </div>

                      {/* Discord banner */}
                      {showLivePreview.discordLink && (
                        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div>
                            <h4 className="font-bold text-white mb-1">Let's Voice Chat on Discord!</h4>
                            <p className="text-xs text-blue-400 leading-relaxed">Discuss strategies, trade notes, and meet our community members.</p>
                          </div>
                          <a 
                            href={`https://${showLivePreview.discordLink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 uppercase tracking-wider"
                          >
                            Join Discord
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Template 2: Clan Portal style */}
                  {showLivePreview.template === 'clan' && (
                    <div className="space-y-10 py-6">
                      <div className="space-y-4 text-center max-w-2xl mx-auto">
                        <span className="text-xs uppercase tracking-widest font-black" style={{ color: showLivePreview.accentColor }}>
                          🏆 ACTIVE CLAN PORTAL
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                          {showLivePreview.name}
                        </h1>
                        <p className="text-gray-400 text-base leading-relaxed">
                          {showLivePreview.description || 'Welcome to our guild landing portal page.'}
                        </p>
                      </div>

                      {/* Recruitment/Stat Details */}
                      <div className="grid sm:grid-cols-3 gap-4 pt-6">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold block mb-1">Guild Status</span>
                          <span className="text-sm font-bold text-white">RECRUITING</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold block mb-1">Members Count</span>
                          <span className="text-sm font-bold text-white font-mono">{showLivePreview.serverIp || '28 active players'}</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold block mb-1">Guild Discord</span>
                          <span className="text-sm font-bold text-white font-mono" style={{ color: showLivePreview.accentColor }}>
                            {showLivePreview.discordLink ? 'Connected' : 'None'}
                          </span>
                        </div>
                      </div>

                      {showLivePreview.aboutText && (
                        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-3">Recruitment Guidelines & About Us</h4>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{showLivePreview.aboutText}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Template 3: Player Portfolio style */}
                  {showLivePreview.template === 'portfolio' && (
                    <div className="space-y-10 py-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center font-black text-3xl shrink-0" style={{
                          border: `2px solid ${showLivePreview.accentColor}`
                        }}>
                          {showLivePreview.name ? showLivePreview.name[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {(showLivePreview.serverIp || 'Gamer, Mod').split(',').map((role: string) => (
                              <span key={role} className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-full border border-white/5">
                                {role.trim()}
                              </span>
                            ))}
                          </div>
                          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                            I am <span style={{ color: showLivePreview.accentColor }}>{showLivePreview.name}</span>
                          </h1>
                          <p className="text-gray-400 text-sm mt-1">{showLivePreview.description || 'Welcome to my player dashboard.'}</p>
                        </div>
                      </div>

                      {showLivePreview.aboutText && (
                        <div className="p-6 bg-white/5 border border-white/15 rounded-2xl">
                          <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-3" style={{ color: showLivePreview.accentColor }}>About Me</h4>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{showLivePreview.aboutText}</p>
                        </div>
                      )}

                      {/* Display contact/footer block */}
                      <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Connect with Me:</span>
                        <span className="text-sm font-mono text-white bg-black px-4 py-2 rounded-xl border border-white/10">
                          Discord: <span className="font-bold" style={{ color: showLivePreview.accentColor }}>{showLivePreview.discordLink || 'Not specified'}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Website Footer block */}
                  <div className="text-center pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                    <p>© {new Date().getFullYear()} {showLivePreview.name}. Hosted securely via Mine Host Free Web Builder.</p>
                    <p className="hover:underline cursor-pointer" style={{ color: showLivePreview.accentColor }}>Report abuse</p>
                  </div>
                </div>
              </div>
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
