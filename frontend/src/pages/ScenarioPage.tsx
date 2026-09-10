import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { approveScenario, overrideScenario } from '../api';
import { ReproductionScenario } from '../types';
import { OverrideModal } from '../components/OverrideModal';
import { Terminal, Play, ShieldAlert, CheckCircle2, Edit3, AlertTriangle, ArrowRight } from 'lucide-react';

interface ScenarioPageProps {
  scenario: ReproductionScenario;
  onExecute: (scenarioId: string) => void;
  onRefresh: () => void;
}

export const ScenarioPage: React.FC<ScenarioPageProps> = ({ scenario, onExecute, onRefresh }) => {
  const { currentUser, hasPermission } = useAuth();
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const canApprove = hasPermission('approve_scenario');
  const canExecute = hasPermission('execute_scenario');

  const handleApprove = async () => {
    try {
      await approveScenario(scenario.id, currentUser?.id || 'usr-qa');
      setActionSuccessMsg('Scenario approved cleanly by human operator. Ready for sandbox execution.');
      onRefresh();
    } catch (err) {
      console.error('Failed to approve scenario', err);
    }
  };

  const handleOverrideSubmit = async (reason: string, modifications: any) => {
    try {
      await overrideScenario(scenario.id, reason, currentUser?.id || 'usr-qa', modifications);
      setShowOverrideModal(false);
      setActionSuccessMsg(`Scenario overridden successfully. Override reason permanently logged: "${reason}"`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Override failed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="gov-card p-5 border-l-4 border-l-emerald-500 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <span className="font-mono font-bold text-emerald-400 text-sm">{scenario.scenario_code}</span>
            <span className="text-slate-500">•</span>
            <h2 className="text-base font-bold text-slate-100">{scenario.title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bug Reference: <span className="font-mono text-sky-400">{scenario.bug_code}</span> | Risk Level:{' '}
            <span className={`font-bold ${scenario.risk_level === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>
              {scenario.risk_level}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {scenario.approval_status === 'PENDING_CONFIRMATION' && (
            <>
              <button
                onClick={handleApprove}
                disabled={!canApprove}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-1.5 transition shadow-lg disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Scenario</span>
              </button>

              <button
                onClick={() => setShowOverrideModal(true)}
                disabled={!canApprove}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-1.5 transition shadow-lg disabled:opacity-40"
              >
                <Edit3 className="w-4 h-4" />
                <span>Manual Override</span>
              </button>
            </>
          )}

          {(scenario.approval_status === 'APPROVED' || scenario.approval_status === 'OVERRIDDEN') && (
            <button
              onClick={() => onExecute(scenario.id)}
              disabled={!canExecute}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs flex items-center space-x-2 transition shadow-lg disabled:opacity-40"
            >
              <Play className="w-4 h-4" />
              <span>Execute Scenario in Sandbox</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="bg-emerald-950/50 border border-emerald-700 p-3 rounded-lg text-xs text-emerald-300 flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* High-Impact Human Confirmation Banner if Pending */}
      {scenario.is_high_impact && scenario.approval_status === 'PENDING_CONFIRMATION' && (
        <div className="bg-amber-950/40 border border-amber-600 p-4 rounded-lg space-y-2 text-xs">
          <div className="font-bold text-amber-300 flex items-center space-x-2 text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>HIGH-IMPACT HUMAN CONFIRMATION REQUIRED</span>
          </div>
          <p className="text-slate-200">
            This scenario alters system parser configuration flags or schema validation rules. Automated execution is blocked until explicit human approval or manual override reason is recorded.
          </p>
        </div>
      )}

      {/* Override Reason Log Display if Overridden */}
      {scenario.approval_status === 'OVERRIDDEN' && (
        <div className="bg-amber-950/30 border border-amber-700/80 p-3.5 rounded-lg text-xs space-y-1">
          <div className="font-semibold text-amber-300 flex items-center space-x-1.5">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Recorded Human Override Reason (Audit Logged)</span>
          </div>
          <p className="font-mono text-amber-200 bg-slate-950 p-2 rounded border border-slate-800">
            "{scenario.override_reason}"
          </p>
        </div>
      )}

      {/* Preconditions & Environment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gov-card p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Preconditions</span>
          <div className="space-y-1.5 text-xs font-mono">
            {Object.entries(scenario.preconditions).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">{k}:</span>
                <span className="text-slate-200 font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gov-card p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Environment Config</span>
          <div className="space-y-1.5 text-xs font-mono">
            {Object.entries(scenario.environment).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">{k}:</span>
                <span className="text-slate-200 font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executable Sequential Steps */}
      <div className="gov-card p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-700 pb-3">
          <Terminal className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">EXECUTABLE REPRODUCTION STEPS</h3>
        </div>

        <div className="space-y-3">
          {scenario.steps.map((step) => (
            <div key={step.step_number} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded text-[10px] font-bold">
                  Step {step.step_number}
                </span>
                <span className="text-slate-500 text-[11px]">Target: {step.target_module}</span>
              </div>
              <p className="font-semibold text-slate-100">{step.action}</p>
              <div className="text-slate-400 text-[11px]">
                Expected Outcome: <span className="text-slate-300 font-mono">{step.expected_outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Override Modal Portal */}
      {showOverrideModal && (
        <OverrideModal
          scenario={scenario}
          onClose={() => setShowOverrideModal(false)}
          onApprove={handleApprove}
          onOverride={handleOverrideSubmit}
        />
      )}
    </div>
  );
};
