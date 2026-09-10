import React, { useState, useEffect } from 'react';
import { fetchBugs } from '../api';
import { BugReport } from '../types';
import { Bug, Sparkles, Filter, Search, Shield, FileText, ArrowRight } from 'lucide-react';

interface BugListProps {
  onSelectBug: (bug: BugReport) => void;
}

export const BugList: React.FC<BugListProps> = ({ onSelectBug }) => {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [filteredFormat, setFilteredFormat] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const b = await fetchBugs();
        setBugs(b);
      } catch (err) {
        console.error('Failed fetching bugs', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBugs = bugs.filter(bug => {
    const matchesFormat = filteredFormat === 'ALL' || bug.file_format.includes(filteredFormat);
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bug.bug_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bug.app_module.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFormat && matchesSearch;
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-mono">Loading Government Bug Database...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <Bug className="w-5 h-5 text-sky-400" />
            <span>Government Compliance Bug Queue</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select an incoming defect to execute evidence extraction and AI rule analysis.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search bug code, title, module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Format:</span>
            <select
              value={filteredFormat}
              onChange={(e) => setFilteredFormat(e.target.value)}
              className="bg-transparent text-sky-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Formats</option>
              <option value="XML v2.1" className="bg-slate-900">XML v2.1</option>
              <option value="XML v2.0" className="bg-slate-900">XML v2.0</option>
              <option value="CSV" className="bg-slate-900">CSV Legacy</option>
              <option value="JSON" className="bg-slate-900">JSON Current</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bugs Table */}
      <div className="gov-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <th className="p-3">CODE</th>
              <th className="p-3">TITLE & MODULE</th>
              <th className="p-3">FILE FORMAT</th>
              <th className="p-3">PRESERVED</th>
              <th className="p-3">STATUS</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredBugs.map((bug) => (
              <tr key={bug.id} className="hover:bg-slate-800/50 transition">
                <td className="p-3 font-mono font-bold text-sky-400">{bug.bug_code}</td>
                <td className="p-3">
                  <div className="font-semibold text-slate-100">{bug.title}</div>
                  <div className="text-[11px] text-slate-400">{bug.app_module} ({bug.app_version})</div>
                </td>
                <td className="p-3">
                  <span className="bg-slate-800 text-sky-300 border border-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                    {bug.file_format} (v{bug.file_version})
                  </span>
                </td>
                <td className="p-3">
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono flex items-center w-max space-x-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span>PRESERVED</span>
                  </span>
                </td>
                <td className="p-3">
                  <span className="bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded text-[10px] font-mono">
                    {bug.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onSelectBug(bug)}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1.5 rounded text-xs transition flex items-center space-x-1.5 ml-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze Defect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
