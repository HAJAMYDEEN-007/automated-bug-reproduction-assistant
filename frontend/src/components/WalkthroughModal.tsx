import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, CheckCircle2, Shield, Info, ArrowRight } from 'lucide-react';

interface WalkthroughModalProps {
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({ onClose, onNavigateToTab }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Submit Bug Report",
      tab: "submit",
      description: "Incoming bug reports are submitted manually or uploaded with logs, error messages, and legacy file format metadata.",
      highlight: "Supports XML v2.0, XML v2.1, CSV Legacy, and JSON Current while preserving original files unaltered.",
      actionLabel: "Try Bug Submission Page"
    },
    {
      title: "2. Input Collection & Evidence Extraction",
      tab: "bugs",
      description: "The system automatically parses log tracebacks, header details, and environmental parameters.",
      highlight: "Original legacy compliance file is preserved in the vault; sandbox test copies are initialized.",
      actionLabel: "View Bug Reports"
    },
    {
      title: "3. AI Bug Analysis & Rule Matching",
      tab: "bugs",
      description: "The analysis engine evaluates error signatures against government compliance rules.",
      highlight: "Identifies failure points, checks missing information, and flags edge cases instantly.",
      actionLabel: "Inspect Analysis Engine"
    },
    {
      title: "4. Rule & Evidence Explainability",
      tab: "bugs",
      description: "Displays explicit Rule IDs (e.g. RULE-XML-003), evidence excerpts, and confidence scores.",
      highlight: "No black-box predictions! Every recommendation cites specific log excerpts and schema rules.",
      actionLabel: "View Evidence Panel"
    },
    {
      title: "5. Historical Incident Matching",
      tab: "bugs",
      description: "Cross-references database of 10+ historical resolutions (e.g., BUG-104, BUG-127).",
      highlight: "Learns from past resolution steps to suggest proven reproduction configurations.",
      actionLabel: "Check Historical Cases"
    },
    {
      title: "6. Executable Reproduction Scenario Generation",
      tab: "scenarios",
      description: "Converts fuzzy bug reports into structured, step-by-step executable test scenarios.",
      highlight: "Defines exact preconditions, environment flags, test data, and expected outcomes.",
      actionLabel: "Go to Scenarios"
    },
    {
      title: "7. Risk & Impact Classification",
      tab: "scenarios",
      description: "Classifies risk level (LOW, MEDIUM, HIGH) based on environment configuration changes.",
      highlight: "High-impact actions are flagged for human oversight.",
      actionLabel: "Review Risk Badges"
    },
    {
      title: "8. Human-In-The-Loop Confirmation & Manual Override",
      tab: "scenarios",
      description: "High-impact actions require human approval. Manual overrides capture forced audit reasons.",
      highlight: "Auditors can review exact human decisions, previous values, and new values.",
      actionLabel: "Try Confirmation Workflow"
    },
    {
      title: "9. Sandbox Test Execution Simulation",
      tab: "scenarios",
      description: "Executes reproduction scenarios in a safe simulated government reporting sandbox.",
      highlight: "Displays real-time step checkmarks: [✓] Environment prepared, [✗] Error reproduced.",
      actionLabel: "Run Test Terminal"
    },
    {
      title: "10. Pass/Fail Reproduction Result Verification",
      tab: "scenarios",
      description: "Verifies whether the bug was 100% reproduced under controlled test conditions.",
      highlight: "Saves captured console stdout trace and diagnostic memory dump.",
      actionLabel: "Check Results"
    },
    {
      title: "11. Append-Only Audit Trail Logging",
      tab: "audit",
      description: "Every action, recommendation, human decision, override reason, and test result is logged.",
      highlight: "Immutable audit log filterable by organisation, user, risk, and override status.",
      actionLabel: "Inspect Audit Trail"
    },
    {
      title: "12. Performance Dashboard & Baseline Metrics",
      tab: "metrics",
      description: "Quantifies the share of incoming defects converted into reproducible test cases.",
      highlight: "Measures AI Assistant (81.3%) vs Baseline Manual Triage (42.0%) with error breakdowns.",
      actionLabel: "View Performance Dashboard"
    }
  ];

  const activeStepObj = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">STAKEHOLDER USABILITY WALKTHROUGH</h3>
              <p className="text-xs text-slate-400">12-Step Lifecycle: Bug Report → Executable Reproduction Scenario</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-sky-400 px-3 py-1 rounded border border-slate-700">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full transition-all duration-300 ${
                idx === currentStep ? 'bg-amber-400 flex-1' : (idx < currentStep ? 'bg-sky-500 flex-1' : 'bg-slate-800 flex-1')
              }`}
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-4">
          <h4 className="text-lg font-bold text-amber-300 tracking-wide flex items-center space-x-2">
            <Info className="w-5 h-5 text-amber-400" />
            <span>{activeStepObj.title}</span>
          </h4>

          <p className="text-sm text-slate-200 leading-relaxed">
            {activeStepObj.description}
          </p>

          <div className="bg-sky-950/40 p-3 rounded-lg border border-sky-800/50 text-xs text-sky-200 flex items-start space-x-2">
            <Shield className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-[11px] uppercase tracking-wider text-sky-300">Key Compliance Highlight:</strong>
              <span className="text-slate-300">{activeStepObj.highlight}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={() => {
              onNavigateToTab(activeStepObj.tab);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-md text-xs font-mono transition"
          >
            <span>{activeStepObj.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition shadow-lg"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Walkthrough</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
