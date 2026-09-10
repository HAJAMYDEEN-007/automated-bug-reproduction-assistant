import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Bug, Sparkles, Terminal, PlaySquare, 
  History, BarChart3, AlertOctagon, ShieldCheck, CheckSquare, PlusCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'TRIAGE_ANALYST';

  // Role-based workflow navigation definition
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'bugs', label: 'Bug Reports', icon: Bug },
          { id: 'submit', label: 'Submit Bug', icon: PlusCircle },
          { id: 'scenarios', label: 'Reproduction Scenarios', icon: Terminal },
          { id: 'audit', label: 'Audit Trail', icon: History },
          { id: 'metrics', label: 'Performance & Baseline', icon: BarChart3 },
          { id: 'edge-cases', label: 'Edge Case Suite', icon: AlertOctagon },
          { id: 'ethics', label: 'Responsible AI & Ethics', icon: ShieldCheck },
          { id: 'deployment', label: 'Deployment Checklist', icon: CheckSquare }
        ];
      case 'TRIAGE_ANALYST':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'bugs', label: 'Bug Reports', icon: Bug },
          { id: 'submit', label: 'Submit Bug', icon: PlusCircle },
          { id: 'scenarios', label: 'Scenarios & Approvals', icon: Terminal },
          { id: 'audit', label: 'Audit Trail', icon: History },
          { id: 'metrics', label: 'Metrics', icon: BarChart3 },
          { id: 'edge-cases', label: 'Edge Cases', icon: AlertOctagon }
        ];
      case 'QA_ENGINEER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'bugs', label: 'Bug Queue', icon: Bug },
          { id: 'scenarios', label: 'Executable Scenarios', icon: Terminal },
          { id: 'audit', label: 'Execution Audit', icon: History }
        ];
      case 'EXTERNAL_PARTNER':
        return [
          { id: 'submit', label: 'Submit Compliance Bug', icon: PlusCircle },
          { id: 'bugs', label: 'My Submissions', icon: Bug },
          { id: 'scenarios', label: 'Approved Scenarios Status', icon: Terminal }
        ];
      case 'AUDITOR':
        return [
          { id: 'audit', label: 'Full Audit Trail', icon: History },
          { id: 'metrics', label: 'Conversion Metrics & Baseline', icon: BarChart3 },
          { id: 'ethics', label: 'Responsible AI Policy', icon: ShieldCheck },
          { id: 'deployment', label: 'Compliance Checklist', icon: CheckSquare }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'bugs', label: 'Bugs', icon: Bug }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Role Menu: {role}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300 flex items-center justify-between">
          <span>Role Scope</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-sky-400 font-mono">{role}</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          Visible workflow dynamically restricted per role compliance policies.
        </p>
      </div>
    </aside>
  );
};
