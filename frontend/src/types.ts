export type RoleType = 'ADMIN' | 'TRIAGE_ANALYST' | 'QA_ENGINEER' | 'EXTERNAL_PARTNER' | 'AUDITOR';

export interface User {
  id: str;
  name: string;
  email: string;
  role: RoleType;
  organisation_id: string;
  organisation_name?: string;
}

export interface Organisation {
  id: string;
  name: string;
  code: string;
}

export interface BugReport {
  id: string;
  bug_code: string;
  title: string;
  description: string;
  expected_behavior: string;
  actual_behavior: string;
  steps_attempted: string;
  app_module: string;
  app_version: string;
  os: string;
  browser: string;
  device_env: string;
  file_format: string;
  file_version: string;
  timestamp: string;
  logs: string;
  error_messages: string;
  screenshot_metadata: string;
  historical_ref: string;
  org_id: string;
  created_by_user_id: string;
  created_by_user_name: string;
  status: string;
  original_file_name?: string;
  original_file_preserved: boolean;
  test_copy_name?: string;
  conversion_history?: string;
}

export interface RuleEvidence {
  rule_id: string;
  rule_description: string;
  evidence_source: string;
  evidence_excerpt: string;
  historical_case_refs: string[];
  reason_for_recommendation: string;
  confidence: number;
  risk_level: string;
}

export interface AIAnalysisResult {
  id: string;
  bug_id: string;
  identified_problem: string;
  probable_failure_point: string;
  missing_reproduction_info: string[];
  relevant_env_conditions: Record<string, string>;
  relevant_log_evidence: string;
  similar_historical_bugs: string[];
  matching_resolutions: string[];
  confidence_score: number;
  risk_level: string;
  explainability_rules: RuleEvidence[];
  recommended_steps: string[];
  required_test_data: Record<string, string>;
  expected_result: string;
  failure_indicators: string[];
  is_edge_case: boolean;
  edge_case_type?: 'INCOMPLETE_INFO' | 'CONFLICTING_RESOLUTIONS' | 'UNSUPPORTED_FORMAT';
}

export interface ScenarioStep {
  step_number: number;
  action: string;
  target_module: string;
  input_data: Record<string, string>;
  expected_outcome: string;
}

export interface ReproductionScenario {
  id: string;
  scenario_code: string;
  bug_id: string;
  bug_code: string;
  title: string;
  preconditions: Record<string, string>;
  environment: Record<string, string>;
  test_data: Record<string, string>;
  steps: ScenarioStep[];
  expected_result: string;
  observed_result?: string;
  pass_fail_status?: string;
  risk_level: string;
  is_high_impact: boolean;
  approval_status: 'PENDING_CONFIRMATION' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
  override_reason?: string;
}

export interface ExecutionStepLog {
  step_number: number;
  action: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  output: string;
  timestamp: string;
}

export interface ScenarioExecution {
  id: string;
  scenario_id: string;
  bug_id: string;
  executed_by_user_id: string;
  executed_by_user_name: string;
  timestamp: string;
  status: string;
  steps_log: ExecutionStepLog[];
  final_result: string;
  evidence_captured: string;
  logs_output: string;
}

export interface AuditLog {
  id: string;
  audit_code: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_role: string;
  org_id: string;
  org_name: string;
  bug_id?: string;
  action: string;
  ai_recommendation_summary?: string;
  evidence_summary?: string;
  decision: string;
  human_confirmation: boolean;
  is_override: boolean;
  override_reason?: string;
  previous_value?: string;
  new_value?: string;
  execution_result?: string;
}

export interface ErrorCategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface PerformanceMetrics {
  total_defects: number;
  converted_defects: number;
  conversion_rate: number;
  baseline_conversion_rate: number;
  target_conversion_rate: number;
  improvement_percentage: number;
  avg_triage_time_min: number;
  baseline_triage_time_min: number;
  successful_repro_rate: number;
  false_repro_rate: number;
  human_override_rate: number;
  high_impact_confirm_rate: number;
  missing_evidence_rate: number;
  error_categories: ErrorCategoryBreakdown[];
  formula_explanation: string;
}

export interface StakeholderFeedback {
  role: string;
  participant: string;
  ease_of_understanding: string;
  trust_in_recommendations: string;
  explainability_score: string;
  usefulness: string;
  override_usability: string;
  feedback: string;
}
