import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ServerInstance, UserProfile } from '../types';
import { 
  Users, 
  Server, 
  Shield, 
  Activity, 
  Search, 
  MoreVertical, 
  ArrowUpRight,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const [servers, setServers] = useState<ServerInstance[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const qServers = query(collection(db, 'servers'), orderBy('createdAt', 'desc'));
    const unsubscribeServers = onSnapshot(qServers, (snapshot) => {
      setServers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ServerInstance[]);
    });

    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as unknown as UserProfile[]);
      setLoading(false);
    });

    return () => {
      unsubscribeServers();
      unsubscribeUsers();
    };
  }, []);

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
    { label: 'Active Servers', value: servers.filter(s => s.status === 'running').length, icon: Server, color: 'green' },
    { label: 'Total Revenue', value: `$${servers.reduce((acc, s) => acc + (s.plan === 'grass' ? 4.99 : s.plan === 'iron' ? 9.99 : 19.99), 0).toFixed(2)}`, icon: Activity, color: 'purple' },
    { label: 'System Load', value: '12%', icon: Database, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin <span className="text-green-500">Control Panel</span></h2>
          <p className="text-gray-500 text-sm mt-1">Global overview of Mine Host infrastructure.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest">
          <Shield className="w-4 h-4" />
          Admin Access
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Recent Users
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.filter(u => u.email.includes(searchTerm) || u.displayName?.includes(searchTerm)).slice(0, 5).map((user) => (
                  <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                          {user.displayName?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.displayName || 'Unnamed'}</p>
                          <p className="text-[10px] text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {user.createdAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-green-500" />
              Active Servers
            </h3>
            <button className="text-xs text-green-500 font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Server</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {servers.slice(0, 5).map((server) => (
                  <tr key={server.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{server.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{server.ip}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        server.status === 'running' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {server.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">{server.plan}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
