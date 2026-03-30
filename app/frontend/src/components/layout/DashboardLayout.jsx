import React from 'react';
import { LayoutDashboard, Map, TrendingUp, Users, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Parkshare</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Vue d'ensemble" active />
          <NavItem icon={<Map size={20} />} label="Carte Interactive" />
          <NavItem icon={<TrendingUp size={20} />} label="Opportunités" />
          <NavItem icon={<Users size={20} />} label="Clients" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <NavItem icon={<Settings size={20} />} label="Paramètres" />
          <NavItem icon={<LogOut size={20} />} label="Déconnexion" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Prospection Zones</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               {/* placeholder for avatar */}
               <img src="https://ui-avatars.com/api/?name=Sales+Rep&background=0D8ABC&color=fff" alt="User Avatar" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}
