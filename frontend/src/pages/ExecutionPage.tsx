import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { executeScenario } from '../api';
import { ScenarioExecution } from '../types';
import { Terminal, CheckCircle2, AlertTriangle, ShieldCheck, Play, FileText, ArrowRight } from 'lucide-react';

interface ExecutionPageProps {
  scenarioId: string;
  onFinishExecution: () => void;
}

export const ExecutionPage: React.FC<ExecutionPageProps> = ({ scenarioId, onFinishExecution }) => {
  const { currentUser } = useAuth();
  const [execution, setExecution] = useState<ScenarioExecution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runExec() {
      setLoading(true);
      try {
        const res = await executeScenario(scenarioId, currentUser?.id || 'usr-qa');
        setExecution(res);
      } catch (err) {
        console.error('Failed scenario execution', err);
      } finally {
        setLoading(false);
      }
    }
    runExec();
  }, [scenarioId]);

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="inline-block animate-spin text-sky-400">
          <Terminal className="w-10 h-10" />
        </div>
        <p className="font-mono text-xs text-sky-300">Initializing Safe Government Sandbox Container...</p>
        <div className="text-[11px] text-slate-500 font-mono">Simulating step execution & log capture</div>
      </div>
    );
  }

  if (!execution) {
    return <div className="p-8 text-rose-400 text-xs font-mono">Error: Execution runner failed to start.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="gov-card p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sky-400 text-sm">SANDBOX TERMINAL RUNNER</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-mono">Executed by: {execution.executed_by_user_name}</span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-0.5">Execution Summary ID: {execution.id.slice(0, 13)}...</h2>
        </div>

        <button
          onClick={onFinishExecution}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg text-xs transition flex items-center space-x-1.5"
        >
          <span>Return to Scenarios</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Reproduction Status Result Card */}
      <div className="bg-emerald-950/40 border border-emerald-700/80 p-5 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-300 text-base uppercase tracking-wide">
              RESULT: {execution.final_result.replace(/_/g, ' ')}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              The reported defect was 100% reproduced under safe sandbox parameters. Audit log updated.
            </p>
          </div>
        </div>

        <span className="bg-emerald-900 text-emerald-300 border border-emerald-600 px-3 py-1 rounded text-xs font-mono font-bold">
          FAIL — BUG REPRODUCED
        </span>
      </div>

      {/* Live Terminal Step Output */}
      <div className="gov-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide font-mono">SANDBOX EXECUTION LOG</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Timestamp: {execution.timestamp}</span>
        </div>

        <div className="terminal-window space-y-2 text-xs">
          {execution.steps_log.map((s, idx) => (
            <div key={idx} className="flex items-start space-x-2 font-mono">
              <span className="text-slate-500 text-[10px] min-w-[60px]">[Step {s.step_number}]</span>
              <span className={s.output.includes('[✗]') ? 'text-rose-400 font-bold' : (s.output.includes('[✓]') ? 'text-emerald-400' : 'text-sky-300')}>
                {s.output}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Captured Evidence */}
      <div className="gov-card p-4 space-y-2 text-xs">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Captured Sandbox Diagnostic Evidence</span>
        </span>
        <p className="font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
          {execution.evidence_captured}
        </p>
      </div>
    </div>
  );
};
