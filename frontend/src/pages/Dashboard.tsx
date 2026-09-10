import React, { useEffect, useState } from 'react';
import { fetchMetrics, fetchBugs } from '../api';
import { PerformanceMetrics, BugReport } from '../types';
import { 
  BarChart2, CheckCircle2, TrendingUp, AlertTriangle, Clock, ShieldAlert, FileText, ArrowRight, Play 
} from 'lucide-react';

interface DashboardProps {
  onNavigateToTab: (tab: string, itemData?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToTab }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [recentBugs, setRecentBugs] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const m = await fetchMetrics();
        const b = await fetchBugs();
        setMetrics(m);
        setRecentBugs(b.slice(0, 5));
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !metrics) {
    return <div className="p-8 text-center text-slate-400 font-mono">Loading Government Assistant Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-800/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center space-x-2">
            <span>EXECUTIVE COMPLIANCE & REPRODUCTION DASHBOARD</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Automated reproduction engine for government compliance file formats and auditable defect triage.
          </p>
        </div>
        <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-lg text-right font-mono text-xs">
          <span className="text-slate-400 block text-[10px] uppercase">Primary Metric</span>
          <span className="text-emerald-400 font-bold text-sm">{metrics.conversion_rate}% Conversion Rate</span>
          <span className="text-slate-400 block text-[10px]">Baseline: {metrics.baseline_conversion_rate}% (+{metrics.improvement_percentage}%)</span>
        </div>
      </div>

      {/* Primary Conversion Formula Callout Banner */}
      <div className="bg-sky-950/40 border border-sky-800/80 rounded-lg p-3.5 flex items-center justify-between text-xs text-sky-200">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-sky-400" />
          <div>
            <strong className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Core Performance Formula:</strong>
            <span className="block font-mono text-sky-300 text-[11px]">
              Conversion Rate = (Executable Reproducible Scenarios / Total Defects) × 100
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('metrics')}
          className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 transition"
        >
          <span>View Detailed Benchmark</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Bugs */}
        <div className="gov-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold text-[10px]">Total Defects</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{metrics.total_defects}</div>
          <p className="text-[10px] text-slate-400">Incoming Government Reports</p>
        </div>

        {/* Reproducible Scenarios */}
        <div className="gov-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold text-[10px]">Reproducible Scenarios</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{metrics.converted_defects}</div>
          <p className="text-[10px] text-emerald-400 font-medium">100% Executable Sandbox Scenarios</p>
        </div>

        {/* Conversion Rate */}
        <div className="gov-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold text-[10px]">Conversion Share</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">{metrics.conversion_rate}%</div>
          <p className="text-[10px] text-slate-400">Target: {metrics.target_conversion_rate}% | Baseline: {metrics.baseline_conversion_rate}%</p>
        </div>

        {/* Average Triage Time */}
        <div className="gov-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="uppercase font-semibold text-[10px]">Avg Triage Duration</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300 font-mono">{metrics.avg_triage_time_min} mins</div>
          <p className="text-[10px] text-emerald-400 font-medium">90.7% faster than manual baseline (45m)</p>
        </div>
      </div>

      {/* Recent Bug Reports & Actions */}
      <div className="gov-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="font-bold text-slate-100 text-sm tracking-wide flex items-center space-x-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>RECENT GOVERNMENT BUG REPORTS</span>
          </h3>
          <button
            onClick={() => onNavigateToTab('bugs')}
            className="text-xs text-sky-400 hover:underline font-mono flex items-center space-x-1"
          >
            <span>View All ({metrics.total_defects})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="p-2.5">BUG CODE</th>
                <th className="p-2.5">TITLE</th>
                <th className="p-2.5">MODULE</th>
                <th className="p-2.5">FILE FORMAT</th>
                <th className="p-2.5">STATUS</th>
                <th className="p-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {recentBugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-2.5 font-mono font-bold text-sky-400">{bug.bug_code}</td>
                  <td className="p-2.5 font-medium">{bug.title}</td>
                  <td className="p-2.5 text-slate-300">{bug.app_module}</td>
                  <td className="p-2.5">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                      {bug.file_format} (v{bug.file_version})
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded text-[10px] font-mono">
                      {bug.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => onNavigateToTab('bugs', bug)}
                      className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                    >
                      Process & Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
