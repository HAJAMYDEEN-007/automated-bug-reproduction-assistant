import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WalkthroughModal } from './components/WalkthroughModal';

import { Dashboard } from './pages/Dashboard';
import { BugSubmission } from './pages/BugSubmission';
import { BugList } from './pages/BugList';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { AuditPage } from './pages/AuditPage';
import { MetricsPage } from './pages/MetricsPage';
import { EdgeCasesPage } from './pages/EdgeCasesPage';
import { EthicsPage } from './pages/EthicsPage';
import { DeploymentPage } from './pages/DeploymentPage';

import { BugReport, ReproductionScenario } from './types';
import { fetchBugById, fetchScenarioById, fetchScenarios } from './api';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ReproductionScenario | null>(null);
  const [activeExecutionScenarioId, setActiveExecutionScenarioId] = useState<string | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(false);

  const handleNavigateToTab = (tab: string, itemData?: any) => {
    setActiveTab(tab);
    if (tab === 'bugs' && itemData) {
      setSelectedBug(itemData);
      setActiveTab('ai');
    }
  };

  const handleBugSelect = (bug: BugReport) => {
    setSelectedBug(bug);
    setActiveTab('ai');
  };

  const handleBugSubmitted = (newBug: BugReport) => {
    setSelectedBug(newBug);
    setActiveTab('ai');
  };

  const handleScenarioGenerated = (scenario: ReproductionScenario) => {
    setSelectedScenario(scenario);
    setActiveTab('scenarios');
  };

  const handleRunExecution = (scenarioId: string) => {
    setActiveExecutionScenarioId(scenarioId);
    setActiveTab('execution');
  };

  const handleSelectBugCodeFromEdgeCases = async (bugCode: string) => {
    try {
      const bug = await fetchBugById(bugCode);
      setSelectedBug(bug);
      setActiveTab('ai');
    } catch (err) {
      console.error('Failed fetching bug for edge case', err);
    }
  };

  const refreshScenario = async () => {
    if (selectedScenario) {
      try {
        const sc = await fetchScenarioById(selectedScenario.id);
        setSelectedScenario(sc);
      } catch (err) {
        console.error('Failed refreshing scenario', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar onOpenWalkthrough={() => setShowWalkthrough(true)} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-65px)]">
          {activeTab === 'dashboard' && <Dashboard onNavigateToTab={handleNavigateToTab} />}
          {activeTab === 'submit' && <BugSubmission onSuccess={handleBugSubmitted} />}
          {activeTab === 'bugs' && <BugList onSelectBug={handleBugSelect} />}
          {activeTab === 'ai' && selectedBug && (
            <AIAnalysisPage bug={selectedBug} onScenarioGenerated={handleScenarioGenerated} />
          )}
          {activeTab === 'ai' && !selectedBug && (
            <div className="p-8 text-center text-slate-400 font-mono">
              Select a bug report from the Bug Queue to view deep AI analysis.
            </div>
          )}
          {activeTab === 'scenarios' && selectedScenario && (
            <ScenarioPage scenario={selectedScenario} onExecute={handleRunExecution} onRefresh={refreshScenario} />
          )}
          {activeTab === 'scenarios' && !selectedScenario && (
            <div className="p-8 text-center text-slate-400 font-mono">
              Generate a reproduction scenario from the AI Analysis page to view steps & approvals.
            </div>
          )}
          {activeTab === 'execution' && activeExecutionScenarioId && (
            <ExecutionPage
              scenarioId={activeExecutionScenarioId}
              onFinishExecution={() => setActiveTab('scenarios')}
            />
          )}
          {activeTab === 'audit' && <AuditPage />}
          {activeTab === 'metrics' && <MetricsPage />}
          {activeTab === 'edge-cases' && <EdgeCasesPage onSelectBugCode={handleSelectBugCodeFromEdgeCases} />}
          {activeTab === 'ethics' && <EthicsPage />}
          {activeTab === 'deployment' && <DeploymentPage />}
        </main>
      </div>

      {showWalkthrough && (
        <WalkthroughModal
          onClose={() => setShowWalkthrough(false)}
          onNavigateToTab={handleNavigateToTab}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
