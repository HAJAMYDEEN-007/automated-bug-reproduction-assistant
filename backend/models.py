from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Auth & User
class User(BaseModel):
    id: str
    name: str
    email: str
    role: str # ADMIN, TRIAGE_ANALYST, QA_ENGINEER, EXTERNAL_PARTNER, AUDITOR
    organisation_id: str

class Organisation(BaseModel):
    id: str
    name: str
    code: str

# Bug Submission & Evidence
class BugReportCreate(BaseModel):
    title: str
    description: str
    expected_behavior: str
    actual_behavior: str
    steps_attempted: Optional[str] = ""
    app_module: str
    app_version: str
    os: str
    browser: str
    device_env: str
    file_format: str # XML v2.0, XML v2.1, CSV Legacy, JSON Current
    file_version: str
    logs: Optional[str] = ""
    error_messages: Optional[str] = ""
    screenshot_metadata: Optional[str] = ""
    historical_ref: Optional[str] = ""

class BugReport(BugReportCreate):
    id: str
    bug_code: str
    timestamp: str
    org_id: str
    created_by_user_id: str
    created_by_user_name: str
    status: str # NEW, ANALYZED, SCENARIO_GENERATED, APPROVED, OVERRIDDEN, EXECUTED_SUCCESS, EXECUTED_FAILED, REJECTED
    original_file_name: Optional[str] = None
    original_file_preserved: bool = True
    test_copy_name: Optional[str] = None
    conversion_history: Optional[str] = None

# Historical Resolution
class HistoricalResolution(BaseModel):
    id: str
    bug_code: str
    title: str
    app_module: str
    file_format: str
    file_version: str
    error_pattern: str
    resolution_summary: str
    schema_rule: str
    verified_steps: List[str]

# AI Analysis & Explainability Rule Engine
class RuleEvidence(BaseModel):
    rule_id: str
    rule_description: str
    evidence_source: str
    evidence_excerpt: str
    historical_case_refs: List[str]
    reason_for_recommendation: str
    confidence: float
    risk_level: str # LOW, MEDIUM, HIGH

class AIAnalysisResult(BaseModel):
    id: str
    bug_id: str
    identified_problem: str
    probable_failure_point: str
    missing_reproduction_info: List[str]
    relevant_env_conditions: Dict[str, str]
    relevant_log_evidence: str
    similar_historical_bugs: List[str]
    matching_resolutions: List[str]
    confidence_score: float
    risk_level: str
    explainability_rules: List[RuleEvidence]
    recommended_steps: List[str]
    required_test_data: Dict[str, str]
    expected_result: str
    failure_indicators: List[str]
    is_edge_case: bool = False
    edge_case_type: Optional[str] = None # INCOMPLETE_INFO, CONFLICTING_RESOLUTIONS, UNSUPPORTED_FORMAT

# Reproduction Scenario
class ScenarioStep(BaseModel):
    step_number: int
    action: str
    target_module: str
    input_data: Dict[str, str]
    expected_outcome: str

class ReproductionScenario(BaseModel):
    id: str
    scenario_code: str
    bug_id: str
    bug_code: str
    title: str
    preconditions: Dict[str, str]
    environment: Dict[str, str]
    test_data: Dict[str, str]
    steps: List[ScenarioStep]
    expected_result: str
    observed_result: Optional[str] = None
    pass_fail_status: Optional[str] = None # PENDING, PASS, FAIL
    risk_level: str
    is_high_impact: bool
    approval_status: str # PENDING_CONFIRMATION, APPROVED, REJECTED, OVERRIDDEN
    override_reason: Optional[str] = None

# Human Override & Confirmation Request
class ScenarioApprovalRequest(BaseModel):
    action: str # APPROVE, REJECT, OVERRIDE
    override_reason: Optional[str] = None
    modified_steps: Optional[List[ScenarioStep]] = None
    modified_environment: Optional[Dict[str, str]] = None
    modified_risk_level: Optional[str] = None
    modified_expected_result: Optional[str] = None

# Sandbox Execution
class ExecutionStepLog(BaseModel):
    step_number: int
    action: str
    status: str # IN_PROGRESS, COMPLETED, FAILED
    output: str
    timestamp: str

class ScenarioExecution(BaseModel):
    id: str
    scenario_id: str
    bug_id: str
    executed_by_user_id: str
    executed_by_user_name: str
    timestamp: str
    status: str # RUNNING, COMPLETED, FAILED
    steps_log: List[ExecutionStepLog]
    final_result: str # PASSED_BUG_REPRODUCED, FAILED_NOT_REPRODUCED, ERROR
    evidence_captured: str
    logs_output: str

# Audit Trail Log
class AuditLog(BaseModel):
    id: str
    audit_code: str
    timestamp: str
    user_id: str
    user_name: str
    user_role: str
    org_id: str
    org_name: str
    bug_id: Optional[str] = None
    action: str
    ai_recommendation_summary: Optional[str] = None
    evidence_summary: Optional[str] = None
    decision: str
    human_confirmation: bool
    is_override: bool
    override_reason: Optional[str] = None
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    execution_result: Optional[str] = None

# Metrics & Experiments
class ErrorCategoryBreakdown(BaseModel):
    category: str
    count: int
    percentage: float

class PerformanceMetrics(BaseModel):
    total_defects: int
    converted_defects: int
    conversion_rate: float
    baseline_conversion_rate: float
    improvement_percentage: float
    avg_triage_time_min: float
    baseline_triage_time_min: float
    successful_repro_rate: float
    false_repro_rate: float
    human_override_rate: float
    high_impact_confirm_rate: float
    missing_evidence_rate: float
    error_categories: List[ErrorCategoryBreakdown]
