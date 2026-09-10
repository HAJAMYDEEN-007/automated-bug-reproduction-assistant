import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { runAIAnalysis, generateScenario } from '../api';
import { BugReport, AIAnalysisResult } from '../types';
import { ExplainabilityPanel } from '../components/ExplainabilityPanel';
import { Sparkles, Terminal, FileText, History, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIAnalysisPageProps {
  bug: BugReport;
  onScenarioGenerated: (scenario: any) => void;
}

export const AIAnalysisPage: React.FC<AIAnalysisPageProps> = ({ bug, onScenarioGenerated }) => {
  const { currentUser } = useAuth();
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      setLoading(true);
      try {
        const res = await runAIAnalysis(bug.id, currentUser?.id || 'usr-analyst');
        setAnalysis(res);
      } catch (err) {
        console.error('Failed to run AI analysis', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [bug.id]);

  const handleGenerateScenario = async () => {
    setGenerating(true);
    try {
      const scenario = await generateScenario(bug.id, currentUser?.id || 'usr-analyst');
      onScenarioGenerated(scenario);
    } catch (err) {
      console.error('Failed creating scenario', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="inline-block animate-spin text-sky-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <p className="font-mono text-xs text-slate-300">Extracting log evidence & running explainable rule engine for {bug.bug_code}...</p>
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-8 text-rose-400 text-xs font-mono">Error: AI Analysis failed to produce output.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="gov-card p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sky-400 text-sm">{bug.bug_code}</span>
            <span className="text-slate-500">•</span>
            <h2 className="text-base font-bold text-slate-100">{bug.title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Module: {bug.app_module} | Format: <span className="font-mono text-sky-300">{bug.file_format} (v{bug.file_version})</span>
          </p>
        </div>

        {/* Generate Reproduction Scenario Button */}
        <button
          onClick={handleGenerateScenario}
          disabled={generating || analysis.is_edge_case && analysis.edge_case_type === 'INCOMPLETE_INFO'}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs flex items-center space-x-2 transition shadow-lg disabled:opacity-40"
        >
          <Terminal className="w-4 h-4" />
          <span>{generating ? 'Generating Scenario...' : 'Generate Executable Scenario'}</span>
        </button>
      </div>

      {/* Edge Case Alert Banner if applicable */}
      {analysis.is_edge_case && (
        <div className="bg-amber-950/40 border border-amber-600 p-4 rounded-lg space-y-2 text-xs">
          <div className="font-bold text-amber-300 flex items-center space-x-2 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>EDGE CASE DETECTED: {analysis.edge_case_type}</span>
          </div>
          <p className="text-slate-200">
            {analysis.edge_case_type === 'INCOMPLETE_INFO' && 'This bug report lacks critical diagnostic logs or steps. The assistant declines to generate ungrounded test scenarios until logs are attached.'}
            {analysis.edge_case_type === 'CONFLICTING_RESOLUTIONS' && 'Multiple competing historical resolutions were matched in the database (BUG-104 vs BUG-204). Human triage confirmation is required.'}
            {analysis.edge_case_type === 'UNSUPPORTED_FORMAT' && 'The uploaded file format is deprecated per government compliance rules. Original file is preserved without lossy auto-conversion.'}
          </p>
        </div>
      )}

      {/* Problem Identification & Failure Point Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gov-card p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Identified Problem</span>
          <p className="text-sm font-bold text-slate-100">{analysis.identified_problem}</p>
          <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 font-mono">
            Probable Failure Point: <span className="text-sky-300">{analysis.probable_failure_point}</span>
          </div>
        </div>

        <div className="gov-card p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Environment Parameters</span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(analysis.relevant_env_conditions).map(([k, v]) => (
              <div key={k} className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{k}</span>
                <span className="text-slate-200">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPLAINABILITY PANEL (Rules & Evidence) */}
      <ExplainabilityPanel
        rules={analysis.explainability_rules}
        confidenceScore={analysis.confidence_score}
        riskLevel={analysis.risk_level}
      />

      {/* Historical Resolution Matching */}
      <div className="gov-card p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-700 pb-2">
          <History className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">HISTORICAL RESOLUTIONS MATCHED</h3>
        </div>

        <div className="space-y-2">
          {analysis.matching_resolutions.map((res, i) => (
            <div key={i} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-200">{res}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Evidence Preview */}
      <div className="gov-card p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-700 pb-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">RELEVANT LOG EVIDENCE EXCERPT</h3>
        </div>
        <pre className="terminal-window text-xs whitespace-pre-wrap">
          {analysis.relevant_log_evidence || "No log trace attached."}
        </pre>
      </div>
    </div>
  );
};
