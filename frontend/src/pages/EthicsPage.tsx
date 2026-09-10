import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Eye, Database, FileCheck } from 'lucide-react';

export const EthicsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="gov-card p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span>RESPONSIBLE AI, ETHICS & GOVERNANCE POLICY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Government compliance frameworks for explainability, human oversight, and data retention.
          </p>
        </div>
      </div>

      {/* Critical Mandate Callout Banner */}
      <div className="bg-rose-950/40 border-2 border-rose-600 p-4 rounded-xl text-xs space-y-2">
        <div className="font-bold text-rose-300 flex items-center space-x-2 text-sm uppercase tracking-wide">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>MANDATORY GOVERNANCE DIRECTIVE</span>
        </div>
        <p className="text-slate-100 font-semibold leading-relaxed">
          "The assistant prototype must never autonomously make high-impact production changes. All environmental modifications, legacy schema toggles, or scenario executions require mandatory human approval or auditable manual overrides."
        </p>
      </div>

      {/* Core Ethics Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="gov-card p-4 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold">
            <Eye className="w-4 h-4" />
            <span>1. Explainability & Non-Black-Box AI</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Every recommendation cites explicit Rule IDs (e.g., RULE-XML-003), evidence sources, exact log excerpts, and historical case links. No confidence score is produced without evidence rationale.
          </p>
        </div>

        <div className="gov-card p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Lock className="w-4 h-4" />
            <span>2. Human-In-The-Loop Control</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            High-impact reproduction scenarios require explicit human approval. If an analyst or QA engineer overrides a recommendation, a mandatory override reason is captured.
          </p>
        </div>

        <div className="gov-card p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <Database className="w-4 h-4" />
            <span>3. Legacy File Preservation</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Original uploaded compliance files (XML v2.0/v2.1, CSV Legacy) are preserved unaltered. Transformations occur strictly on temporary sandbox test copies.
          </p>
        </div>

        <div className="gov-card p-4 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold">
            <FileCheck className="w-4 h-4" />
            <span>4. Immutable Append-Only Auditability</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            All user actions, AI recommendations, human confirmations, override reasons, and sandbox test results are recorded in an append-only audit trail filterable by auditors.
          </p>
        </div>
      </div>
    </div>
  );
};
