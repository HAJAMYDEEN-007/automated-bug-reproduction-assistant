import React from 'react';
import { RuleEvidence } from '../types';
import { ShieldCheck, FileText, History, Lightbulb, AlertTriangle } from 'lucide-react';

interface ExplainabilityPanelProps {
  rules: RuleEvidence[];
  confidenceScore: number;
  riskLevel: string;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ rules, confidenceScore, riskLevel }) => {
  return (
    <div className="gov-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">EXPLAINABILITY & RULE EVIDENCE ENGINE</h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">
            Confidence: <strong className="text-emerald-400">{(confidenceScore * 100).toFixed(1)}%</strong>
          </span>
          <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
            riskLevel === 'HIGH' ? 'gov-badge-high' : (riskLevel === 'MEDIUM' ? 'gov-badge-medium' : 'gov-badge-low')
          }`}>
            Risk: {riskLevel}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-sky-950 text-sky-400 border border-sky-700 px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                {rule.rule_id}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Evidence Source: {rule.evidence_source}</span>
            </div>

            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              "{rule.rule_description}"
            </p>

            {/* Evidence Excerpt */}
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold uppercase">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Evidence Excerpt Captured:</span>
              </div>
              <p className="font-mono text-amber-300 text-[11px] bg-slate-900/80 p-1.5 rounded border border-slate-800">
                "{rule.evidence_excerpt}"
              </p>
            </div>

            {/* Historical Case References */}
            {rule.historical_case_refs && rule.historical_case_refs.length > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                <History className="w-4 h-4 text-sky-400" />
                <span className="text-slate-400">Historical Incidents Matched:</span>
                <div className="flex space-x-1.5">
                  {rule.historical_case_refs.map(c => (
                    <span key={c} className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reason for Recommendation */}
            <div className="flex items-start space-x-2 text-xs bg-sky-950/30 p-2.5 rounded border border-sky-900/50">
              <Lightbulb className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-300 block text-[11px] uppercase">Reason for Recommendation:</span>
                <p className="text-slate-300 text-xs mt-0.5">{rule.reason_for_recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
