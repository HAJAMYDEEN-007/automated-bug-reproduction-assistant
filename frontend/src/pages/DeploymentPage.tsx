import React, { useState } from 'react';
import { CheckSquare, ShieldCheck, Database, Cpu, Server, CheckCircle2 } from 'lucide-react';

export const DeploymentPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'sec-1': true, 'sec-2': true, 'sec-3': true, 'sec-4': true,
    'comp-1': true, 'comp-2': true, 'comp-3': true, 'comp-4': true,
    'ai-1': true, 'ai-2': true, 'ai-3': true, 'ai-4': true,
    'ops-1': true, 'ops-2': true, 'ops-3': true, 'ops-4': true
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    {
      title: "Security & Access Control",
      icon: ShieldCheck,
      items: [
        { id: "sec-1", text: "Role-Based Access Control (RBAC) enforced across ADMIN, ANALYST, QA, PARTNER, AUDITOR." },
        { id: "sec-2", text: "Input validation & strict mime type checking for uploaded XML, CSV, JSON files." },
        { id: "sec-3", text: "No production secrets or hardcoded API keys in application source code." },
        { id: "sec-4", text: "Malware scanning & non-executable sandbox isolation for test executions." }
      ]
    },
    {
      title: "Compliance & Auditing",
      icon: Database,
      items: [
        { id: "comp-1", text: "Append-only immutable audit logging for all user, AI, and execution actions." },
        { id: "comp-2", text: "Legacy file format preservation in compliance with government retention standard 800-53." },
        { id: "comp-3", text: "Mandatory override reason logging for all human-in-the-loop overrides." },
        { id: "comp-4", text: "Multi-tenant organisation data segregation and view policies." }
      ]
    },
    {
      title: "AI Governance & Explainability",
      icon: Cpu,
      items: [
        { id: "ai-1", text: "Rule ID and evidence source citations required for every recommendation." },
        { id: "ai-2", text: "Human-in-the-loop approval enforced for all high-impact scenario actions." },
        { id: "ai-3", text: "Edge case handling for incomplete reports, conflicting evidence, and deprecated formats." },
        { id: "ai-4", text: "Deterministic offline rule engine fallback if LLM connectivity is unavailable." }
      ]
    },
    {
      title: "Operations & Monitoring",
      icon: Server,
      items: [
        { id: "ops-1", text: "Real-time sandbox terminal progress logging with stdout capture." },
        { id: "ops-2", text: "Automated error breakdown reporting and baseline conversion metric tracking." },
        { id: "ops-3", text: "SQLite persistent database schema with foreign key integrity constraints." },
        { id: "ops-4", text: "Health check endpoint `/api/metrics` and zero-downtime container configuration." }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="gov-card p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-sky-400" />
            <span>GOVERNMENT DEPLOYMENT & COMPLIANCE READINESS CHECKLIST</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verification checklist across Security, Compliance, AI Governance, and Operational Readiness.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="gov-card p-5 space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-700 pb-2 text-sm font-bold text-slate-100">
                <Icon className="w-4 h-4 text-sky-400" />
                <span>{sec.title}</span>
              </div>

              <div className="space-y-2 text-xs">
                {sec.items.map(item => (
                  <label
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-start space-x-2.5 bg-slate-950 p-2.5 rounded border border-slate-800 cursor-pointer hover:bg-slate-900 transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => {}}
                      className="mt-0.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                    />
                    <span className={checkedItems[item.id] ? 'text-slate-200' : 'text-slate-500 line-through'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
