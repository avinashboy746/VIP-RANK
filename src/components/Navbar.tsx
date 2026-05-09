import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { LogOut, User, Server, Shield, Home } from 'lucide-react';

interface NavbarProps {
  setView: (view: 'home' | 'auth' | 'dashboard') => void;
  currentView: string;
}

export function Navbar({ setView, currentView }: NavbarProps) {
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setView('home');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="font-bold text-black">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">MINE HOST</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('home')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'home' ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {user ? (
            <>
              <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
              >
                {profile?.role === 'admin' ? <Shield className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                <span className="hidden sm:inline">{profile?.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-bold text-white">{profile?.displayName || user.email?.split('@')[0]}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{profile?.role}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setView('auth')}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
