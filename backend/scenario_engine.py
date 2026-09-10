import uuid
import datetime
import time
from typing import Dict, Any, List
from models import ReproductionScenario, ScenarioStep, ScenarioExecution, ExecutionStepLog

def generate_reproduction_scenario(bug: Dict[str, Any], ai_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts a bug report and AI analysis into an executable reproduction scenario.
    """
    scenario_id = str(uuid.uuid4())
    scenario_code = f"SCEN-{bug['bug_code'].replace('GOV-BUG-', '')}"
    risk_level = ai_analysis.get("risk_level", "MEDIUM")
    
    # High impact if risk is HIGH or alters environment config
    is_high_impact = (risk_level == "HIGH") or ("XML v2.1" in bug.get("file_format", "")) or ("HIGH" in ai_analysis.get("risk_level", ""))

    steps: List[Dict[str, Any]] = []
    rec_steps = ai_analysis.get("recommended_steps", [])
    
    if rec_steps:
        for idx, step_text in enumerate(rec_steps, 1):
            steps.append({
                "step_number": idx,
                "action": f"Execute Step {idx}",
                "target_module": bug.get("app_module", "Government Annual Reporting"),
                "input_data": {"instruction": step_text},
                "expected_outcome": "Step proceeds cleanly to next target state." if idx < len(rec_steps) else ai_analysis.get("expected_result", "Bug reproduced cleanly.")
            })
    else:
        steps = [
            {
                "step_number": 1,
                "action": "Open Government Reporting Module",
                "target_module": bug.get("app_module", "Annual Reporting"),
                "input_data": {"module_name": bug.get("app_module", "Annual Reporting")},
                "expected_outcome": "Module UI loads into ready state."
            },
            {
                "step_number": 2,
                "action": "Configure Environment & Parser Settings",
                "target_module": bug.get("app_module", "Annual Reporting"),
                "input_data": {"file_format": bug.get("file_format", "XML v2.1"), "version": bug.get("file_version", "2.1")},
                "expected_outcome": "Environment switches parser flag to match target version."
            },
            {
                "step_number": 3,
                "action": "Upload Preserved Test File",
                "target_module": bug.get("app_module", "Annual Reporting"),
                "input_data": {"file_name": bug.get("original_file_name", "annual_report_v2.1.xml")},
                "expected_outcome": "File staging completed."
            },
            {
                "step_number": 4,
                "action": "Submit Report & Monitor Diagnostic Log",
                "target_module": bug.get("app_module", "Annual Reporting"),
                "input_data": {"action": "SUBMIT"},
                "expected_outcome": "Report submitted to parser engine."
            },
            {
                "step_number": 5,
                "action": "Verify Error Exception Trace",
                "target_module": bug.get("app_module", "Annual Reporting"),
                "input_data": {"log_pattern": ai_analysis.get("failure_indicators", ["XMLParserError"])[0]},
                "expected_outcome": ai_analysis.get("expected_result", "Target error reproduced.")
            }
        ]

    return {
        "id": scenario_id,
        "scenario_code": scenario_code,
        "bug_id": bug["id"],
        "bug_code": bug["bug_code"],
        "title": f"Reproduction Scenario for {bug['bug_code']}: {bug['title']}",
        "preconditions": {
            "Application Module": bug.get("app_module", "Annual Reporting"),
            "Target App Version": bug.get("app_version", "v4.8.2-gov"),
            "Required File Format": bug.get("file_format", "XML v2.1"),
            "File Schema Version": bug.get("file_version", "2.1")
        },
        "environment": {
            "OS": bug.get("os", "Windows 11 Enterprise"),
            "Browser": bug.get("browser", "Edge 124"),
            "Sandbox Node": bug.get("device_env", "Staging Node-04"),
            "Parser Mode": "Legacy Compatibility Mode" if "v2." in bug.get("file_version", "") else "Standard Mode"
        },
        "test_data": {
            "Original Preserved File": bug.get("original_file_name", "annual_report_v2.1.xml"),
            "Test Copy Container": bug.get("test_copy_name", "annual_report_v2.1_test.json"),
            "File Integrity Hash": "SHA256:8f4343a29482938a12903e0"
        },
        "steps": steps,
        "expected_result": ai_analysis.get("expected_result", "Target bug exception is reproduced under controlled sandbox parameters."),
        "observed_result": None,
        "pass_fail_status": "PENDING",
        "risk_level": risk_level,
        "is_high_impact": is_high_impact,
        "approval_status": "PENDING_CONFIRMATION" if is_high_impact else "APPROVED",
        "override_reason": None
    }

def execute_scenario_in_sandbox(scenario: Dict[str, Any], executed_by_user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes the reproduction scenario in a safe simulated government reporting sandbox environment.
    Generates step-by-step terminal logs with status updates.
    """
    exec_id = str(uuid.uuid4())
    timestamp = datetime.datetime.now().isoformat()
    steps_log: List[Dict[str, Any]] = []
    
    # 1. Environment Prep
    steps_log.append({
        "step_number": 1,
        "action": "Environment Preparation",
        "status": "COMPLETED",
        "output": f"[✓] Environment prepared on {scenario['environment'].get('Sandbox Node', 'Staging Sandbox Node-04')}. Mode: {scenario['environment'].get('Parser Mode', 'Legacy Compatibility Mode')}.",
        "timestamp": datetime.datetime.now().isoformat()
    })
    
    # 2. File Selection & Preservation Check
    steps_log.append({
        "step_number": 2,
        "action": "Legacy File Preservation Verification",
        "status": "COMPLETED",
        "output": f"[✓] Legacy file '{scenario['test_data'].get('Original Preserved File', 'annual_report_v2.1.xml')}' loaded into memory. SHA256 integrity verified. Original file preserved unaltered.",
        "timestamp": datetime.datetime.now().isoformat()
    })

    # 3. Format Validation
    steps_log.append({
        "step_number": 3,
        "action": "Format & Schema Pre-validation",
        "status": "COMPLETED",
        "output": f"[✓] File format '{scenario['preconditions'].get('Required File Format', 'XML v2.1')}' validated. Schema version {scenario['preconditions'].get('File Schema Version', '2.1')} active.",
        "timestamp": datetime.datetime.now().isoformat()
    })

    # 4. Report Submission Attempt
    steps_log.append({
        "step_number": 4,
        "action": "Report Submission Action",
        "status": "COMPLETED",
        "output": f"[✓] Report submission attempted in sandbox target module '{scenario['preconditions'].get('Application Module', 'Government Annual Reporting')}'.",
        "timestamp": datetime.datetime.now().isoformat()
    })

    # 5. Log & Exception Detection
    if "UNSUPPORTED_FORMAT" in str(scenario.get("title", "")) or "GOV-BUG-004" in scenario.get("bug_code", ""):
        steps_log.append({
            "step_number": 5,
            "action": "Compliance Format Gate",
            "status": "FAILED",
            "output": "[✗] FileFormatUnsupportedException: Deprecated binary XML format v1.5 rejected. Original upload preserved in compliance vault.",
            "timestamp": datetime.datetime.now().isoformat()
        })
        final_result = "PASSED_BUG_REPRODUCED" # Defect reproduced
        obs_result = "FileFormatUnsupportedException thrown correctly. Bug reproduced."
    elif "CSV" in scenario.get("preconditions", {}).get("Required File Format", ""):
        steps_log.append({
            "step_number": 5,
            "action": "Delimiter Check",
            "status": "FAILED",
            "output": "[✗] CSVSchemaMismatch: Expected 14 columns, received 11 at line 42.",
            "timestamp": datetime.datetime.now().isoformat()
        })
        final_result = "PASSED_BUG_REPRODUCED"
        obs_result = "CSVSchemaMismatch exception triggered at line 42. Bug reproduced."
    else:
        steps_log.append({
            "step_number": 5,
            "action": "Exception Diagnostics Check",
            "status": "FAILED",
            "output": "[✗] XMLParserError: DTD Validation failed for element <GovReportHeader version='2.1'>. Entity declaration outside schema range.",
            "timestamp": datetime.datetime.now().isoformat()
        })
        final_result = "PASSED_BUG_REPRODUCED"
        obs_result = "XMLParserError exception detected in sandbox logs. Defect 100% reproduced."

    steps_log.append({
        "step_number": 6,
        "action": "Reproduction Status Evaluation",
        "status": "COMPLETED",
        "output": "[✓] Bug reproduced successfully in sandbox simulation.",
        "timestamp": datetime.datetime.now().isoformat()
    })

    return {
        "id": exec_id,
        "scenario_id": scenario["id"],
        "bug_id": scenario["bug_id"],
        "executed_by_user_id": executed_by_user["id"],
        "executed_by_user_name": executed_by_user["name"],
        "timestamp": timestamp,
        "status": "COMPLETED",
        "steps_log": steps_log,
        "final_result": final_result,
        "evidence_captured": f"Captured console stdout trace & sandbox memory dump at {timestamp}",
        "logs_output": "\n".join([s["output"] for s in steps_log])
    }
