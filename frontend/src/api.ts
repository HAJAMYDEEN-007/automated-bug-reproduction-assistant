import { 
  BugReport, AIAnalysisResult, ReproductionScenario, ScenarioExecution, 
  AuditLog, PerformanceMetrics, User, Organisation, StakeholderFeedback 
} from './types';

const API_BASE = '/api';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function fetchOrganisations(): Promise<Organisation[]> {
  const res = await fetch(`${API_BASE}/orgs`);
  return res.json();
}

export async function fetchBugs(filters?: { org_id?: string; user_id?: string; status?: string }): Promise<BugReport[]> {
  const params = new URLSearchParams();
  if (filters?.org_id) params.append('org_id', filters.org_id);
  if (filters?.user_id) params.append('user_id', filters.user_id);
  if (filters?.status) params.append('status', filters.status);

  const res = await fetch(`${API_BASE}/bugs?${params.toString()}`);
  return res.json();
}

export async function fetchBugById(id: string): Promise<BugReport> {
  const res = await fetch(`${API_BASE}/bugs/${id}`);
  if (!res.ok) throw new Error('Bug report not found');
  return res.json();
}

export async function createBug(bugData: any, userId: string, orgId: string): Promise<BugReport> {
  const res = await fetch(`${API_BASE}/bugs?user_id=${userId}&org_id=${orgId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bugData)
  });
  return res.json();
}

export async function fetchBugEvidence(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/bugs/${id}/evidence`);
  return res.json();
}

export async function runAIAnalysis(id: string, userId: string): Promise<AIAnalysisResult> {
  const res = await fetch(`${API_BASE}/bugs/${id}/analyze?user_id=${userId}`, { method: 'POST' });
  return res.json();
}

export async function generateScenario(id: string, userId: string): Promise<ReproductionScenario> {
  const res = await fetch(`${API_BASE}/bugs/${id}/scenario?user_id=${userId}`, { method: 'POST' });
  return res.json();
}

export async function fetchScenarios(): Promise<ReproductionScenario[]> {
  const res = await fetch(`${API_BASE}/scenarios`);
  return res.json();
}

export async function fetchScenarioById(id: string): Promise<ReproductionScenario> {
  const res = await fetch(`${API_BASE}/scenarios/${id}`);
  return res.json();
}

export async function approveScenario(id: string, userId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/scenarios/${id}/approve?user_id=${userId}`, { method: 'POST' });
  return res.json();
}

export async function overrideScenario(id: string, overrideReason: string, userId: string, modifications?: any): Promise<any> {
  const res = await fetch(`${API_BASE}/scenarios/${id}/override?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'OVERRIDE',
      override_reason: overrideReason,
      ...modifications
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Override failed');
  }
  return res.json();
}

export async function executeScenario(id: string, userId: string): Promise<ScenarioExecution> {
  const res = await fetch(`${API_BASE}/scenarios/${id}/execute?user_id=${userId}`, { method: 'POST' });
  return res.json();
}

export async function fetchAuditLogs(filters?: { org_id?: string; user_id?: string; bug_id?: string; action?: string; is_override?: boolean }): Promise<AuditLog[]> {
  const params = new URLSearchParams();
  if (filters?.org_id) params.append('org_id', filters.org_id);
  if (filters?.user_id) params.append('user_id', filters.user_id);
  if (filters?.bug_id) params.append('bug_id', filters.bug_id);
  if (filters?.action) params.append('action', filters.action);
  if (filters?.is_override !== undefined) params.append('is_override', String(filters.is_override));

  const res = await fetch(`${API_BASE}/audit?${params.toString()}`);
  return res.json();
}

export async function fetchMetrics(): Promise<PerformanceMetrics> {
  const res = await fetch(`${API_BASE}/metrics`);
  return res.json();
}

export async function fetchExperiments(): Promise<{ metrics: PerformanceMetrics; stakeholders: StakeholderFeedback[]; methodology: string; formula: string }> {
  const res = await fetch(`${API_BASE}/experiments`);
  return res.json();
}
