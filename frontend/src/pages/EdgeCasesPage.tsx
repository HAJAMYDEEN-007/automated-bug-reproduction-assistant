import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, FileCode, HelpCircle, ArrowRight } from 'lucide-react';

interface EdgeCasesPageProps {
  onSelectBugCode: (bugCode: string) => void;
}

export const EdgeCasesPage: React.FC<EdgeCasesPageProps> = ({ onSelectBugCode }) => {
  const [activeCase, setActiveCase] = useState<number>(1);

  const edgeCases = [
    {
      id: 1,
      code: "GOV-BUG-002",
      title: "EDGE CASE 1: Incomplete Bug Report Submission",
      type: "INCOMPLETE_INFO",
      summary: "Bug report lacks logs, error messages, and detailed steps.",
      behavior: "System flags report as underspecified, outputs confidence score 45%, declines unsafe auto-generation, and prompts submitter for diagnostic log attachments.",
      ruleId: "RULE-EDGE-001",
      expectedOutcome: "Safety protocol prevents generating ungrounded test scenarios."
    },
    {
      id: 2,
      code: "GOV-BUG-003",
      title: "EDGE CASE 2: Conflicting Historical Resolutions",
      type: "CONFLICTING_RESOLUTIONS",
      summary: "Two historical incidents suggest competing solutions (BUG-104 legacy DTD vs BUG-204 URI prefix re-binding).",
      behavior: "System displays dual evidence panels, calculates 70% confidence, flags high risk, and requests human triage selection between Path A and Path B.",
      ruleId: "RULE-XML-001 vs RULE-XML-003",
      expectedOutcome: "Human triage analyst resolves ambiguous historical evidence."
    },
    {
      id: 3,
      code: "GOV-BUG-004",
      title: "EDGE CASE 3: Unsupported Legacy File Format (.bxml)",
      type: "UNSUPPORTED_FORMAT",
      summary: "External partner uploaded deprecated binary XML v1.5 format.",
      behavior: "System preserves original file unaltered in audit vault, declines lossy auto-conversion per government standard 800-53, and issues format rejection receipt.",
      ruleId: "RULE-FILE-999",
      expectedOutcome: "Original upload preserved without lossy transformation."
    }
  ];

  const currentCaseObj = edgeCases.find(c => c.id === activeCase) || edgeCases[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="gov-card p-5 border-l-4 border-l-amber-500 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <span>INTERACTIVE EDGE CASE DEMO SUITE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verification suite demonstrating handling of incomplete inputs, conflicting historical evidence, and unsupported legacy formats.
          </p>
        </div>
      </div>

      {/* Case Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {edgeCases.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCase(c.id)}
            className={`p-4 rounded-xl border text-left transition ${
              activeCase === c.id
                ? 'bg-slate-900 border-amber-500 shadow-lg text-slate-100'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
              <span className={activeCase === c.id ? 'text-amber-400' : 'text-slate-500'}>CASE #{c.id}</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-sky-300">{c.code}</span>
            </div>
            <div className="font-semibold text-xs leading-snug">{c.title}</div>
          </button>
        ))}
      </div>

      {/* Active Case Detail Display */}
      <div className="gov-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-3">
            <span className="font-mono font-bold text-amber-400 text-sm">{currentCaseObj.code}</span>
            <span className="text-slate-500">•</span>
            <h3 className="text-base font-bold text-slate-100">{currentCaseObj.title}</h3>
          </div>

          <button
            onClick={() => onSelectBugCode(currentCaseObj.code)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-2 transition shadow-lg"
          >
            <span>Run Analysis On {currentCaseObj.code}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Trigger Scenario & Inputs</span>
            <p className="text-slate-200 leading-relaxed">{currentCaseObj.summary}</p>
            <div className="font-mono text-[11px] text-amber-300 bg-slate-900 p-2 rounded border border-slate-800">
              Trigger Rule: {currentCaseObj.ruleId}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Expected AI & System Behavior</span>
            <p className="text-slate-200 leading-relaxed">{currentCaseObj.behavior}</p>
            <div className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentCaseObj.expectedOutcome}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
