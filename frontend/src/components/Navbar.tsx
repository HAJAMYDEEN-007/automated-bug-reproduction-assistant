import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, Building2, HelpCircle, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenWalkthrough: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWalkthrough }) => {
  const { currentUser, currentOrg, users, switchUser } = useAuth();

  return (
    <header className="gov-navy-header px-6 py-3 text-white flex items-center justify-between shadow-lg sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="bg-sky-600 p-2 rounded-lg text-white shadow-md flex items-center justify-center">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">GOV-BUG REPRO ASSISTANT</h1>
            <span className="bg-sky-900/80 text-sky-300 text-xs px-2 py-0.5 rounded border border-sky-700 font-mono">v2026.1-COMPLIANT</span>
          </div>
          <p className="text-xs text-slate-400">Automated Bug-Reproduction Assistant for Government Reporting Applications</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Stakeholder Walkthrough Button */}
        <button
          onClick={onOpenWalkthrough}
          className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 px-3 py-1.5 rounded-md text-xs font-medium transition"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Demo Walkthrough Mode</span>
        </button>

        {/* Active Organisation Badge */}
        {currentOrg && (
          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-md text-xs">
            <Building2 className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Organisation</span>
              <span className="text-slate-200 font-medium">{currentOrg.name} ({currentOrg.code})</span>
            </div>
          </div>
        )}

        {/* Demo Role Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-md text-xs">
          <User className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Account & Role</span>
            <select
              value={currentUser?.id || ''}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-sky-300 text-xs rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} [{u.role}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
