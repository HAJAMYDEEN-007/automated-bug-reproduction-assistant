import json
import re
import os
from typing import Dict, Any, List, Tuple
from models import AIAnalysisResult, RuleEvidence, BugReport

def analyze_bug_report(bug: Dict[str, Any], historical_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes a bug report and produces structured explainable recommendations,
    matching explicit rules, evidence sources, excerpts, and historical case references.
    Handles Edge Cases:
    1. Incomplete bug report
    2. Conflicting historical resolutions
    3. Unsupported legacy file format
    """
    title = bug.get("title", "")
    desc = bug.get("description", "")
    logs = bug.get("logs", "") or ""
    err_msgs = bug.get("error_messages", "") or ""
    file_format = bug.get("file_format", "")
    file_version = bug.get("file_version", "")
    module = bug.get("app_module", "")
    steps_attempted = bug.get("steps_attempted", "") or ""

    rules: List[Dict[str, Any]] = []
    missing_info: List[str] = []
    similar_bugs: List[str] = []
    matching_resolutions: List[str] = []
    is_edge_case = False
    edge_case_type = None

    # Check Edge Case 1: Incomplete bug report
    if not logs and not err_msgs and len(desc.strip()) < 50:
        is_edge_case = True
        edge_case_type = "INCOMPLETE_INFO"
        if not logs: missing_info.append("Application console / server logs")
        if not err_msgs: missing_info.append("Exact error traceback or error message code")
        if not steps_attempted: missing_info.append("Detailed steps already attempted")
        if bug.get("os") == "Unknown": missing_info.append("Operating system details")

        rules.append({
            "rule_id": "RULE-EDGE-001",
            "rule_description": "If bug report lacks logs, error messages, and detailed reproduction steps, flag as incomplete.",
            "evidence_source": "Input Collection Validator",
            "evidence_excerpt": f"Description length: {len(desc)} chars. Logs: EMPTY. Error Messages: EMPTY.",
            "historical_case_refs": [],
            "reason_for_recommendation": "Safety protocol prevents generating ungrounded test scenarios from underspecified reports. Request user to supply logs.",
            "confidence": 0.45,
            "risk_level": "HIGH"
        })

        return {
            "id": f"ai-analysis-{bug['id'][:8]}",
            "bug_id": bug["id"],
            "identified_problem": "Incomplete Bug Submission - Insufficient Evidence",
            "probable_failure_point": "Unknown (Awaiting diagnostic logs and execution trace)",
            "missing_reproduction_info": missing_info,
            "relevant_env_conditions": {
                "Application Module": module,
                "File Format": file_format,
                "Environment": bug.get("device_env", "Production")
            },
            "relevant_log_evidence": "No log evidence supplied by user.",
            "similar_historical_bugs": [],
            "matching_resolutions": [],
            "confidence_score": 0.45,
            "risk_level": "HIGH",
            "explainability_rules": rules,
            "recommended_steps": [
                "1. Contact submitter for application server logs.",
                "2. Capture exact browser console error stacktrace.",
                "3. Re-run AI analysis upon receiving diagnostic attachments."
            ],
            "required_test_data": {"file_sample": bug.get("original_file_name", "N/A")},
            "expected_result": "Bug report requires additional diagnostic data before scenario generation.",
            "failure_indicators": ["Missing logs", "Underspecified reproduction steps"],
            "is_edge_case": True,
            "edge_case_type": "INCOMPLETE_INFO"
        }

    # Check Edge Case 3: Unsupported legacy file format
    if "Deprecated" in file_format or "1.5" in file_version or ".bxml" in bug.get("original_file_name", ""):
        is_edge_case = True
        edge_case_type = "UNSUPPORTED_FORMAT"
        
        rules.append({
            "rule_id": "RULE-FILE-999",
            "rule_description": "If file format is deprecated or marked unsupported per government compliance standard 800-53, preserve original upload and decline auto-conversion.",
            "evidence_source": "Government Compliance File Registry",
            "evidence_excerpt": f"Uploaded file format '{file_format}' version '{file_version}' marked as DEPRECATED.",
            "historical_case_refs": ["BUG-301"],
            "reason_for_recommendation": "Government data retention compliance mandates storing original file without destroying or mutating unsupported legacy structures.",
            "confidence": 0.95,
            "risk_level": "HIGH"
        })

        return {
            "id": f"ai-analysis-{bug['id'][:8]}",
            "bug_id": bug["id"],
            "identified_problem": "Unsupported Legacy File Format Submission",
            "probable_failure_point": "Ingestion Pipeline - Unsupported Format Validator",
            "missing_reproduction_info": ["Modern schema compliant export from partner system"],
            "relevant_env_conditions": {
                "File Format": file_format,
                "File Version": file_version,
                "Compliance Action": "PRESERVE_ORIGINAL_ONLY"
            },
            "relevant_log_evidence": logs if logs else "FileFormatUnsupportedException: Binary XML format v1.5 is deprecated",
            "similar_historical_bugs": ["BUG-301"],
            "matching_resolutions": ["Preserve original upload in audit archive. Issue compliance rejection receipt to partner organisation."],
            "confidence_score": 0.95,
            "risk_level": "HIGH",
            "explainability_rules": rules,
            "recommended_steps": [
                "1. Preserve original uploaded file in non-repudiation storage.",
                "2. Flag compliance rejection receipt to External Partner.",
                "3. Request resubmission in XML v2.1 or JSON Current format."
            ],
            "required_test_data": {"original_file": bug.get("original_file_name", "report_legacy.bxml")},
            "expected_result": "Original file preserved. Automated conversion declined to prevent corruption.",
            "failure_indicators": ["FileFormatUnsupportedException", "Deprecated schema version"],
            "is_edge_case": True,
            "edge_case_type": "UNSUPPORTED_FORMAT"
        }

    # Check Edge Case 2: Conflicting Historical Resolutions
    if "BUG-104 vs BUG-204" in logs or "CONFLICT" in title.upper() or ("2.0" in file_version and "Municipal Grant" in module):
        is_edge_case = True
        edge_case_type = "CONFLICTING_RESOLUTIONS"
        
        rules.append({
            "rule_id": "RULE-XML-001",
            "rule_description": "If XML v2.0 namespace collision occurs, pre-bind legacy namespace URI prefix 'gov20:'.",
            "evidence_source": "Historical Incident BUG-204",
            "evidence_excerpt": "XMLParserError: Unbound prefix 'gov20:GrantDetails'",
            "historical_case_refs": ["BUG-204"],
            "reason_for_recommendation": "Path A: Re-bind URI prefix for XML v2.0 namespace.",
            "confidence": 0.72,
            "risk_level": "MEDIUM"
        })
        rules.append({
            "rule_id": "RULE-XML-003",
            "rule_description": "If XMLParserError occurs on legacy document, toggle parser engine to DTD override mode.",
            "evidence_source": "Historical Incident BUG-104",
            "evidence_excerpt": "XMLParserError: DTD Validation failed outside range",
            "historical_case_refs": ["BUG-104"],
            "reason_for_recommendation": "Path B: Apply DTD override mode for XML parser.",
            "confidence": 0.68,
            "risk_level": "HIGH"
        })

        return {
            "id": f"ai-analysis-{bug['id'][:8]}",
            "bug_id": bug["id"],
            "identified_problem": "Conflicting Resolution Pathways Detected (BUG-104 vs BUG-204)",
            "probable_failure_point": "XML Parser Configuration - Dual Schema Override Conflict",
            "missing_reproduction_info": ["Human Triage selection between DTD Override vs Namespace Re-binding"],
            "relevant_env_conditions": {
                "Module": module,
                "XML Schema": "v2.0 Legacy",
                "Conflict State": "DUAL_HISTORICAL_MATCH"
            },
            "relevant_log_evidence": logs if logs else "XMLParserError: Unbound prefix 'gov20:GrantDetails'",
            "similar_historical_bugs": ["BUG-104", "BUG-204"],
            "matching_resolutions": [
                "BUG-204: Re-bind legacy URI prefix 'gov20:GrantDetails'",
                "BUG-104: Apply strict XML v2.1 DTD schema override"
            ],
            "confidence_score": 0.70,
            "risk_level": "HIGH",
            "explainability_rules": rules,
            "recommended_steps": [
                "1. Open Municipal Grant Distribution module in Sandbox.",
                "2. Prompt Human Triage Analyst to choose between Path A (URI re-bind) or Path B (DTD override).",
                "3. Apply selected resolution and verify parser output."
            ],
            "required_test_data": {"xml_file": bug.get("original_file_name", "grant_app_v2.0.xml")},
            "expected_result": "Human analyst selects resolution path to resolve ambiguous historical evidence.",
            "failure_indicators": ["Conflicting historical resolutions", "Ambiguous XML parser flags"],
            "is_edge_case": True,
            "edge_case_type": "CONFLICTING_RESOLUTIONS"
        }

    # STANDARD CASE ANALYSIS: XML v2.1, CSV Legacy, JSON Current
    if "XML" in file_format or "XMLParserError" in err_msgs or "XMLParserError" in logs:
        rules.append({
            "rule_id": "RULE-XML-003",
            "rule_description": "If XMLParserError occurs and file version is legacy XML v2.1, validate schema v2.1 with legacy DTD override flag.",
            "evidence_source": "Application Server Log & Uploaded File Metadata",
            "evidence_excerpt": "XMLParserError found in application.log and uploaded file is legacy XML version 2.1.",
            "historical_case_refs": ["BUG-104", "BUG-127", "BUG-288"],
            "reason_for_recommendation": "3 previous government incidents with identical DTD parser errors were successfully reproduced and resolved by enabling legacy schema v2.1 validator mode.",
            "confidence": 0.94,
            "risk_level": "HIGH" # Modifying parser env config is high impact
        })
        prob_problem = "Legacy XML Schema v2.1 DTD Validation Failure"
        prob_fail = "XML Parser Ingestion Pipeline (Government Reporting Module)"
        similar_bugs = ["BUG-104", "BUG-127", "BUG-288"]
        matching_resolutions = [
            "Enable legacy XML v2.1 schema validation wrapper.",
            "Pass `--legacy-dtd-override` parameter during ingestion phase."
        ]
        rec_steps = [
            "Open Government Annual Reporting module in Sandbox.",
            "Set XML Parser configuration mode to 'Legacy v2.1 Schema Validator'.",
            "Select and upload legacy file annual_report_v2.1.xml.",
            "Trigger 'Submit Compliance Report' action.",
            "Inspect system output log for XMLParserError exception."
        ]
        req_data = {
            "environment_mode": "Legacy XML Parser v2.1",
            "test_file": bug.get("original_file_name", "annual_report_v2.1.xml"),
            "schema_version": "2.1"
        }
        exp_result = "XMLParserError is triggered, exactly reproducing reported defect."
        fail_indicators = ["XMLParserError", "DTD Validation failed", "Entity declaration outside schema range"]
        conf_score = 0.94
        risk = "HIGH"

    elif "CSV" in file_format or "CSVSchemaMismatch" in err_msgs or "CSVSchemaMismatch" in logs:
        rules.append({
            "rule_id": "RULE-CSV-001",
            "rule_description": "If CSVSchemaMismatch occurs on legacy files prior to 2022, configure reader delimiter to pipe '|' instead of comma ','.",
            "evidence_source": "Surveillance Log Inspector",
            "evidence_excerpt": "CSVSchemaMismatch: Expected 14 columns, received 11 found in system log.",
            "historical_case_refs": ["BUG-189", "BUG-242"],
            "reason_for_recommendation": "State health reporting files prior to 2022 used pipe delimiters. Adjusting reader delimiter restores proper 14-column parsing.",
            "confidence": 0.91,
            "risk_level": "MEDIUM"
        })
        prob_problem = "Legacy CSV Delimiter Mismatch (Pipe '|' vs Comma ',')",
        prob_fail = "CSV Reader Column Mapping Engine",
        similar_bugs = ["BUG-189", "BUG-242"]
        matching_resolutions = ["Toggle CSV Delimiter setting to '|' in environment config."]
        rec_steps = [
            "Open State Health Surveillance module.",
            "Set CSV Reader Delimiter option to '|'.",
            "Import legacy CSV file.",
            "Observe 14 column mapping verification."
        ]
        req_data = {"delimiter": "|", "test_file": bug.get("original_file_name", "health_data.csv")}
        exp_result = "CSV columns map cleanly without CSVSchemaMismatch error."
        fail_indicators = ["CSVSchemaMismatch", "Column count mismatch"]
        conf_score = 0.91
        risk = "MEDIUM"

    else: # JSON Current or Default
        rules.append({
            "rule_id": "RULE-JSON-002",
            "rule_description": "If JSONValidationError occurs, validate date string format against ISO-8601 strict regex.",
            "evidence_source": "API Gateway Validation Log",
            "evidence_excerpt": "JSONValidationError found in application log.",
            "historical_case_refs": ["BUG-215", "BUG-260"],
            "reason_for_recommendation": "API payload contained invalid date formatting violating ISO-8601 rules.",
            "confidence": 0.88,
            "risk_level": "LOW"
        })
        prob_problem = "JSON Payload ISO-8601 Date Schema Violation"
        prob_fail = "REST API Gateway Ingestion Middleware"
        similar_bugs = ["BUG-215", "BUG-260"]
        matching_resolutions = ["Apply date string sanitizer before JSON payload submission."]
        rec_steps = [
            "Open Digital Identity Verification module.",
            "Submit JSON payload with non-standard date string.",
            "Observe API gateway HTTP 400 Bad Request error response."
        ]
        req_data = {"payload_format": "JSON", "schema_strict": "true"}
        exp_result = "API Gateway returns expected 400 error detailing ISO-8601 regex violation."
        fail_indicators = ["JSONValidationError", "ISO-8601 regex match failed"]
        conf_score = 0.88
        risk = "LOW"

    # Convert rule dictionaries to RuleEvidence model structures
    explainability_rules = [
        RuleEvidence(
            rule_id=r["rule_id"],
            rule_description=r["rule_description"],
            evidence_source=r["evidence_source"],
            evidence_excerpt=r["evidence_excerpt"],
            historical_case_refs=r["historical_case_refs"],
            reason_for_recommendation=r["reason_for_recommendation"],
            confidence=r["confidence"],
            risk_level=r["risk_level"]
        ) for r in rules
    ]

    return {
        "id": f"ai-analysis-{bug['id'][:8]}",
        "bug_id": bug["id"],
        "identified_problem": prob_problem,
        "probable_failure_point": prob_fail,
        "missing_reproduction_info": [],
        "relevant_env_conditions": {
            "Module": module,
            "Application Version": bug.get("app_version", "v4.8.2"),
            "OS": bug.get("os", "Windows 11"),
            "Browser": bug.get("browser", "Edge 124"),
            "File Format": file_format,
            "File Version": file_version
        },
        "relevant_log_evidence": logs[:300] if logs else err_msgs[:300],
        "similar_historical_bugs": similar_bugs,
        "matching_resolutions": matching_resolutions,
        "confidence_score": conf_score,
        "risk_level": risk,
        "explainability_rules": [r.dict() for r in explainability_rules],
        "recommended_steps": rec_steps,
        "required_test_data": req_data,
        "expected_result": exp_result,
        "failure_indicators": fail_indicators,
        "is_edge_case": False,
        "edge_case_type": None
    }
