import React, { useState, useEffect } from 'react';
import { fetchExperiments } from '../api';
import { PerformanceMetrics, StakeholderFeedback } from '../types';
import { BarChart3, TrendingUp, Clock, AlertTriangle, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';

export const MetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [stakeholders, setStakeholders] = useState<StakeholderFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchExperiments();
        setMetrics(res.metrics);
        setStakeholders(res.stakeholders);
      } catch (err) {
        console.error('Failed loading metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !metrics) {
    return <div className="p-8 text-center text-slate-400 font-mono">Loading Experiment Metrics & Baseline Comparison...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="gov-card p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <span>PERFORMANCE & BASELINE EXPERIMENT DASHBOARD</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Empirical benchmark comparing Manual Defect Triage (Baseline) vs AI Reproduction Assistant across 30 synthetic government bug reports.
          </p>
        </div>
        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded text-xs font-mono font-bold">
          DEMO / SYNTHETIC EXPERIMENT BENCHMARK
        </span>
      </div>

      {/* Primary Success Metric Banner & Formula Callout */}
      <div className="bg-slate-900 border-2 border-sky-600 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">PRIMARY PERFORMANCE METRIC</h3>
          </div>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs px-3 py-1 rounded-full font-mono font-bold">
            +39.3% IMPROVEMENT OVER BASELINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 text-xs block uppercase font-semibold">Baseline Manual Triage</span>
            <div className="text-3xl font-bold text-rose-400 font-mono mt-1">{metrics.baseline_conversion_rate}%</div>
            <span className="text-[10px] text-slate-500">Historical Triage Conversion Share</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 text-xs block uppercase font-semibold">Target Requirement</span>
            <div className="text-3xl font-bold text-amber-300 font-mono mt-1">{metrics.target_conversion_rate}%</div>
            <span className="text-[10px] text-slate-500">Government SLA Threshold</span>
          </div>

          <div className="bg-sky-950/60 p-4 rounded-lg border border-sky-700 text-center">
            <span className="text-sky-300 text-xs block uppercase font-bold">AI Assistant Measured Result</span>
            <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">{metrics.conversion_rate}%</div>
            <span className="text-[10px] text-emerald-300 font-semibold">{metrics.converted_defects} of {metrics.total_defects} Defects Converted</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Conversion Rate Formula:</span>
          <span className="text-sky-300">
            Conversion Rate = (Defects Converted to Executable Scenarios / Total Incoming Defects) × 100
          </span>
        </div>
      </div>

      {/* Baseline vs AI Assistant Detailed Matrix */}
      <div className="gov-card p-5 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm tracking-wide border-b border-slate-700 pb-2">
          DETAILED COMPARATIVE EXPERIMENT MATRIX
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="p-3">MEASUREMENT METRIC</th>
                <th className="p-3">MANUAL BASELINE</th>
                <th className="p-3">AI ASSISTANT</th>
                <th className="p-3">DELTA / IMPROVEMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr>
                <td className="p-3 font-sans font-semibold">Reproducible Scenario Conversion Rate</td>
                <td className="p-3 text-rose-400">42.0%</td>
                <td className="p-3 text-emerald-400 font-bold">{metrics.conversion_rate}%</td>
                <td className="p-3 text-emerald-400 font-bold">+{metrics.improvement_percentage}% share</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Average Triage Duration</td>
                <td className="p-3 text-rose-400">45.0 minutes</td>
                <td className="p-3 text-sky-300 font-bold">{metrics.avg_triage_time_min} minutes</td>
                <td className="p-3 text-emerald-400 font-bold">-40.8 mins (90.7% faster)</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Successful Sandbox Reproduction Rate</td>
                <td className="p-3 text-slate-400">68.5%</td>
                <td className="p-3 text-emerald-400 font-bold">{metrics.successful_repro_rate}%</td>
                <td className="p-3 text-emerald-400 font-bold">+24.0% accuracy</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">False Reproduction Rate</td>
                <td className="p-3 text-rose-400">18.4%</td>
                <td className="p-3 text-emerald-400 font-bold">{metrics.false_repro_rate}%</td>
                <td className="p-3 text-emerald-400 font-bold">-14.2% reduction</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Human Override Rate</td>
                <td className="p-3 text-slate-400">N/A (Fully Manual)</td>
                <td className="p-3 text-amber-300 font-bold">{metrics.human_override_rate}%</td>
                <td className="p-3 text-slate-400">Captures 100% override reasons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ERROR ANALYSIS SECTION */}
      <div className="gov-card p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-700 pb-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">ERROR ANALYSIS & UNCONVERTED DEFECT BREAKDOWN</h3>
        </div>

        <p className="text-xs text-slate-400">
          Categorization of failed conversions or reports flagged for human triage due to edge cases or missing evidence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.error_categories.map((cat, idx) => (
            <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-200 block">{cat.category}</span>
                <span className="text-[11px] text-slate-500 font-mono">Count: {cat.count} defects</span>
              </div>
              <span className="bg-slate-800 text-amber-300 px-2.5 py-1 rounded font-mono font-bold text-xs border border-slate-700">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STAKEHOLDER VALIDATION SECTION (DEMO DATA) */}
      <div className="gov-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">STAKEHOLDER VALIDATION FEEDBACK</h3>
          </div>
          <span className="bg-slate-800 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700 font-bold">
            DEMO DATA — SYNTHETIC PARTICIPANT FEEDBACK
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stakeholders.map((s, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="bg-sky-950 text-sky-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-sky-800">
                  {s.role}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{s.participant}</span>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Explainability Score:</span>
                  <span className="text-emerald-400 font-bold">{s.explainability_score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trust in Recs:</span>
                  <span className="text-emerald-400 font-bold">{s.trust_in_recommendations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Override Usability:</span>
                  <span className="text-emerald-400 font-bold">{s.override_usability}</span>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] italic bg-slate-900/80 p-2 rounded border border-slate-800">
                "{s.feedback}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
