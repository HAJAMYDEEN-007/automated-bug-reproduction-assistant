import React, { useState } from 'react';
import { ReproductionScenario } from '../types';
import { AlertTriangle, ShieldAlert, CheckCircle, XCircle, Edit3 } from 'lucide-react';

interface OverrideModalProps {
  scenario: ReproductionScenario;
  onClose: () => void;
  onApprove: () => void;
  onOverride: (reason: string, modifications: any) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({ scenario, onClose, onApprove, onOverride }) => {
  const [mode, setMode] = useState<'CONFIRM' | 'OVERRIDE'>('CONFIRM');
  const [reason, setReason] = useState('');
  const [riskLevel, setRiskLevel] = useState(scenario.risk_level);
  const [expectedResult, setExpectedResult] = useState(scenario.expected_result);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setErrorMsg('Mandatory government audit rule: You must enter a clear override reason (minimum 5 characters).');
      return;
    }
    setErrorMsg('');
    onOverride(reason, {
      modified_risk_level: riskLevel,
      modified_expected_result: expectedResult
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              {scenario.is_high_impact ? 'HIGH-IMPACT HUMAN CONFIRMATION REQUIRED' : 'SCENARIO HUMAN REVIEW'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">Scenario ID: {scenario.scenario_code}</p>
          </div>
        </div>

        {/* Action Warning Card */}
        <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-lg space-y-2 text-xs">
          <div className="font-semibold text-amber-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>AI Recommended High-Impact Reproduction Action</span>
          </div>
          <p className="text-slate-300">
            The AI assistant recommends running scenario <strong>{scenario.scenario_code}</strong> against the staging sandbox environment.
          </p>
          <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono text-slate-300 border border-slate-800 space-y-1">
            <div><span className="text-slate-500">Target Module:</span> {scenario.preconditions["Application Module"]}</div>
            <div><span className="text-slate-500">Environment Mode:</span> {scenario.environment["Parser Mode"]}</div>
            <div><span className="text-slate-500">Current Risk Level:</span> <span className="text-rose-400 font-bold">{scenario.risk_level}</span></div>
          </div>
        </div>

        {mode === 'CONFIRM' ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Government compliance rules mandate human confirmation before executing any scenario that alters environment parameters or parser configurations.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={onApprove}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Proceed</span>
              </button>

              <button
                onClick={() => setMode('OVERRIDE')}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                <span>Manual Override</span>
              </button>

              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-lg text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOverrideSubmit} className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3 text-xs">
              <h4 className="font-semibold text-amber-400 flex items-center space-x-1.5">
                <Edit3 className="w-4 h-4" />
                <span>Specify Manual Override Parameters</span>
              </h4>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Modify Risk Level:</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 w-full"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Modify Expected Outcome:</label>
                <textarea
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  rows={2}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 w-full"
                />
              </div>

              <div>
                <label className="block text-amber-300 text-[11px] font-bold mb-1">
                  MANDATORY OVERRIDE REASON (Recorded permanently in Audit Log):
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Example: Partner organisation still submits legacy XML v2.0 files. Override parser flag to v2.0."
                  rows={3}
                  className="bg-slate-900 border border-amber-500/50 text-slate-100 text-xs rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-rose-400 text-[11px] font-medium bg-rose-950/40 p-2 rounded border border-rose-800/50">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Override & Log Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('CONFIRM')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-lg text-xs transition"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
