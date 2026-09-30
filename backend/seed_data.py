import json
import sqlite3
import uuid
import datetime
from database import get_db, init_db

def seed_all():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM bug_reports")
    if cursor.fetchone()[0] > 0:
        print("Database already seeded. Skipping.")
        conn.close()
        return

    print("Seeding database with demo government reporting data...")

    # 1. Seed Organisations
    orgs = [
        {"id": "org-mds", "name": "Ministry of Digital Services", "code": "MDS"},
        {"id": "org-shd", "name": "State Health Reporting Department", "code": "SHD"},
        {"id": "org-epo", "name": "External Partner Organisation", "code": "EPO"}
    ]
    for org in orgs:
        cursor.execute("INSERT INTO organisations (id, name, code) VALUES (?, ?, ?)",
                       (org["id"], org["name"], org["code"]))

    # 2. Seed Users
    users = [
        {"id": "usr-admin", "name": "Sarah Jenkins (Admin)", "email": "admin@example.gov", "role": "ADMIN", "organisation_id": "org-mds"},
        {"id": "usr-analyst", "name": "David Chen (Analyst)", "email": "analyst@example.gov", "role": "TRIAGE_ANALYST", "organisation_id": "org-mds"},
        {"id": "usr-qa", "name": "Maria Rodriguez (QA Lead)", "email": "qa@example.gov", "role": "QA_ENGINEER", "organisation_id": "org-shd"},
        {"id": "usr-partner", "name": "Alex Taylor (Partner)", "email": "partner@example.com", "role": "EXTERNAL_PARTNER", "organisation_id": "org-epo"},
        {"id": "usr-auditor", "name": "Robert Vance (Auditor)", "email": "auditor@example.gov", "role": "AUDITOR", "organisation_id": "org-mds"}
    ]
    for user in users:
        cursor.execute("INSERT INTO users (id, name, email, role, organisation_id) VALUES (?, ?, ?, ?, ?)",
                       (user["id"], user["name"], user["email"], user["role"], user["organisation_id"]))

    # 3. Seed Historical Resolutions (10 Incident References)
    historical_cases = [
        {
            "id": "hist-101",
            "bug_code": "BUG-104",
            "title": "Legacy XML Schema v2.1 Entity Validation Failure",
            "app_module": "Government Annual Reporting",
            "file_format": "XML v2.1",
            "file_version": "2.1",
            "error_pattern": "XMLParserError: Entity declaration outside DTD schema range v2.1",
            "resolution_summary": "Legacy XML v2.1 parser required strict backward-compatibility flag `--legacy-dtd-override` and schema validation set to 2.1 mode.",
            "schema_rule": "RULE-XML-003",
            "verified_steps": json.dumps([
                "Open Government Annual Reporting module",
                "Set XML Parser Engine to Legacy v2.1 mode",
                "Upload test XML file annual_report_v2.1.xml",
                "Execute schema validation step"
            ])
        },
        {
            "id": "hist-102",
            "bug_code": "BUG-127",
            "title": "XML v2.1 UTF-8 BOM Encoding Header Crash",
            "app_module": "Taxation Filing Module",
            "file_format": "XML v2.1",
            "file_version": "2.1",
            "error_pattern": "XMLParserError: Premature end of file or unexpected byte 0xEF 0xBB 0xBF",
            "resolution_summary": "Stripped UTF-8 byte order mark (BOM) before parsing XML v2.1 headers in compliance with 2019 data retention guidelines.",
            "schema_rule": "RULE-XML-003",
            "verified_steps": json.dumps([
                "Select Taxation Filing Module",
                "Upload XML v2.1 with BOM encoding",
                "Enable BOM Stripper filter in environment configuration",
                "Verify file parses clean"
            ])
        },
        {
            "id": "hist-103",
            "bug_code": "BUG-189",
            "title": "Legacy CSV Delimiter Mismatch in Regional Healthcare Submissions",
            "app_module": "State Health Surveillance",
            "file_format": "CSV Legacy",
            "file_version": "1.0-LEGACY",
            "error_pattern": "CSVSchemaMismatch: Expected 14 columns, received 11 at row 42",
            "resolution_summary": "State health data prior to 2022 used pipe `|` delimiters instead of commas `,`. Legacy parser must toggle pipe reader.",
            "schema_rule": "RULE-CSV-001",
            "verified_steps": json.dumps([
                "Open State Health Surveillance module",
                "Set CSV Reader Delimiter to '|'",
                "Import legacy file health_data_2021.csv",
                "Verify 14 columns map correctly"
            ])
        },
        {
            "id": "hist-104",
            "bug_code": "BUG-204",
            "title": "XML v2.0 Namespace Prefix Collision in Municipal Grants",
            "app_module": "Municipal Grant Distribution",
            "file_format": "XML v2.0",
            "file_version": "2.0",
            "error_pattern": "XMLParserError: Unbound prefix 'gov20:GrantDetails'",
            "resolution_summary": "Pre-bound legacy namespace URI `xmlns:gov20=\"http://compliance.gov/schemas/v2.0\"` into XML parser wrapper.",
            "schema_rule": "RULE-XML-001",
            "verified_steps": json.dumps([
                "Open Municipal Grant Distribution",
                "Select XML v2.0 compatibility wrapper",
                "Upload grant_application_2018.xml",
                "Submit XML document"
            ])
        },
        {
            "id": "hist-105",
            "bug_code": "BUG-215",
            "title": "JSON Current Schema Strict Mode Date Regex Failure",
            "app_module": "Digital Identity Verification",
            "file_format": "JSON Current",
            "file_version": "3.5",
            "error_pattern": "JSONValidationError: Value '2025/13/45' does not match pattern ISO-8601",
            "resolution_summary": "Client app sent non-standard date format. Recommended input sanitizer before submitting to validation gateway.",
            "schema_rule": "RULE-JSON-002",
            "verified_steps": json.dumps([
                "Open Digital Identity Verification",
                "Submit payload with legacy date string",
                "Verify API returns HTTP 400 Bad Request with field level error"
            ])
        },
        {
            "id": "hist-106",
            "bug_code": "BUG-230",
            "title": "Legacy XML v2.0 Huge File Memory Overflow (>50MB)",
            "app_module": "National Census Archive",
            "file_format": "XML v2.0",
            "file_version": "2.0",
            "error_pattern": "OutOfMemoryError: Java heap space during DOM document creation",
            "resolution_summary": "Switched from DOM parser to SAX stream parser for XML files over 20MB in legacy compatibility mode.",
            "schema_rule": "RULE-PERF-004",
            "verified_steps": json.dumps([
                "Set Environment Memory Limit to 512MB",
                "Configure XML Parser to SAX Streaming mode",
                "Import 65MB Census XML v2.0 file",
                "Monitor heap memory usage during stream processing"
            ])
        },
        {
            "id": "hist-107",
            "bug_code": "BUG-242",
            "title": "CSV Legacy EOL Carriage Return Failure on Linux Hosts",
            "app_module": "State Health Surveillance",
            "file_format": "CSV Legacy",
            "file_version": "1.0-LEGACY",
            "error_pattern": "CSVParseError: Unexpected multi-line token caused by CRLF '\\r\\n'",
            "resolution_summary": "Legacy Windows CSVs imported on Linux server required universal newline parser mode enabled.",
            "schema_rule": "RULE-CSV-002",
            "verified_steps": json.dumps([
                "Open State Health Surveillance",
                "Upload Windows-formatted CSV file with CRLF line breaks",
                "Run import batch process",
                "Check system logs for multiline errors"
            ])
        },
        {
            "id": "hist-108",
            "bug_code": "BUG-260",
            "title": "JSON Current Cryptographic Signature Verification Timeout",
            "app_module": "Inter-Agency Portal",
            "file_format": "JSON Current",
            "file_version": "3.5",
            "error_pattern": "SecurityVerificationException: X.509 Certificate Chain verification timed out",
            "resolution_summary": "Government root CA certificate CRL cache was stale. Updated CRL cache on staging environment gateway.",
            "schema_rule": "RULE-SEC-005",
            "verified_steps": json.dumps([
                "Open Inter-Agency Portal",
                "Submit JSON payload with X.509 signed header",
                "Observe certificate validation response"
            ])
        },
        {
            "id": "hist-109",
            "bug_code": "BUG-288",
            "title": "XML v2.1 Null Character Injection in Employee Filing",
            "app_module": "Government Annual Reporting",
            "file_format": "XML v2.1",
            "file_version": "2.1",
            "error_pattern": "XMLParserError: Illegal character 0x00 found in element <EmployeeNotes>",
            "resolution_summary": "Sanitizing null bytes in binary blobs attached to XML v2.1 forms before passing to parser.",
            "schema_rule": "RULE-XML-003",
            "verified_steps": json.dumps([
                "Open Government Annual Reporting",
                "Import XML v2.1 with null byte payload",
                "Check sanitizer pipeline response"
            ])
        },
        {
            "id": "hist-110",
            "bug_code": "BUG-301",
            "title": "Unsupported File Extension `.xml2` Upload Rejection",
            "app_module": "Municipal Grant Distribution",
            "file_format": "XML v2.0",
            "file_version": "2.0",
            "error_pattern": "FileFormatUnsupportedException: File type .xml2 not recognized by validator",
            "resolution_summary": "File had non-standard extension `.xml2`. System preserved original upload and flagged warning to user without destroying content.",
            "schema_rule": "RULE-FILE-999",
            "verified_steps": json.dumps([
                "Open Municipal Grant Distribution",
                "Attempt import of .xml2 file",
                "Verify system rejects with preserved upload status"
            ])
        }
    ]

    for hc in historical_cases:
        cursor.execute("""
        INSERT INTO historical_resolutions 
        (id, bug_code, title, app_module, file_format, file_version, error_pattern, resolution_summary, schema_rule, verified_steps)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (hc["id"], hc["bug_code"], hc["title"], hc["app_module"], hc["file_format"], hc["file_version"], 
              hc["error_pattern"], hc["resolution_summary"], hc["schema_rule"], hc["verified_steps"]))

    # 4. Seed 30 Synthetic Bug Reports with various formats & edge cases
    sample_bugs = [
        # BUG 1 (Featured: Legacy XML v2.1 parser error)
        {
            "bug_code": "GOV-BUG-001",
            "title": "XMLParserError when submitting legacy XML v2.1 annual report",
            "description": "When importing annual financial compliance reports formatted in legacy XML v2.1 format into the Government Annual Reporting module, the system crashes during DTD validation step.",
            "expected_behavior": "Annual report should import successfully, validate schema v2.1 compliance, and produce a confirmation receipt ID.",
            "actual_behavior": "Application throws XMLParserError at line 42 and aborts report processing completely.",
            "steps_attempted": "1. Log into portal.\n2. Navigate to Annual Reporting.\n3. Upload annual_report_2020_v2.1.xml.\n4. Click Submit Report.",
            "app_module": "Government Annual Reporting",
            "app_version": "v4.8.2-gov",
            "os": "Windows 11 Enterprise",
            "browser": "Edge 124.0.0",
            "device_env": "Staging Sandbox Node-04",
            "file_format": "XML v2.1",
            "file_version": "2.1",
            "logs": "[2026-09-10 10:14:22] INFO: Uploading annual_report_2020_v2.1.xml (size: 4.2MB)\n[2026-09-10 10:14:23] ERROR: XMLParserError: DTD Validation failed for element <GovReportHeader version='2.1'>. Entity declaration outside DTD schema range v2.1.\n[2026-09-10 10:14:23] FATAL: Process aborted with exit code 1.",
            "error_messages": "XMLParserError: DTD Validation failed for element <GovReportHeader version='2.1'>",
            "screenshot_metadata": "screenshot_annual_xml_error.png (Resolution: 1920x1080, red error modal visible)",
            "historical_ref": "BUG-104",
            "org_id": "org-mds",
            "user_id": "usr-analyst",
            "user_name": "David Chen (Analyst)",
            "original_file_name": "annual_report_2020_v2.1.xml",
            "test_copy_name": "annual_report_2020_v2.1_test_copy.json",
            "conversion_history": "Original file preserved in compliance archive. Conversion performed on sandbox test copy."
        },
        # BUG 2 (Edge Case 1: Incomplete Bug Report)
        {
            "bug_code": "GOV-BUG-002",
            "title": "[EDGE CASE 1] Healthcare data import silently fails without error text",
            "description": "User reported that uploading healthcare files fails. No details provided on what module or browser was used.",
            "expected_behavior": "File should process successfully.",
            "actual_behavior": "Nothing happens.",
            "steps_attempted": "Tried uploading file.",
            "app_module": "State Health Surveillance",
            "app_version": "v3.1.0",
            "os": "Unknown",
            "browser": "Unknown",
            "device_env": "Production",
            "file_format": "CSV Legacy",
            "file_version": "1.0-LEGACY",
            "logs": "",
            "error_messages": "",
            "screenshot_metadata": "",
            "historical_ref": "",
            "org_id": "org-shd",
            "user_id": "usr-qa",
            "user_name": "Maria Rodriguez (QA Lead)",
            "original_file_name": "health_data_batch.csv",
            "test_copy_name": "health_data_batch_test.json",
            "conversion_history": "Original CSV legacy file preserved."
        },
        # BUG 3 (Edge Case 2: Conflicting Historical Resolutions)
        {
            "bug_code": "GOV-BUG-003",
            "title": "[EDGE CASE 2] Legacy XML v2.0 parser crashes on Municipal Grant submission",
            "description": "Importing legacy XML v2.0 files into the Municipal Grant module triggers namespace error. Historical resolution BUG-104 suggests legacy DTD flag while BUG-204 suggests URI prefix re-binding.",
            "expected_behavior": "Grant report imports and validates successfully under XML v2.0 rules.",
            "actual_behavior": "System throws XMLParserError with namespace collision.",
            "steps_attempted": "1. Upload XML v2.0 file.\n2. Submit grant application.",
            "app_module": "Municipal Grant Distribution",
            "app_version": "v4.1.0",
            "os": "Windows 10 Pro",
            "browser": "Chrome 122",
            "device_env": "Staging Node-01",
            "file_format": "XML v2.0",
            "file_version": "2.0",
            "logs": "[2026-09-10 11:02:11] ERROR: XMLParserError: Unbound prefix 'gov20:GrantDetails' at line 14.\n[2026-09-10 11:02:11] WARN: Multiple schema resolution pathways detected in historical database (BUG-104 vs BUG-204).",
            "error_messages": "XMLParserError: Unbound prefix 'gov20:GrantDetails'",
            "screenshot_metadata": "grant_error_screenshot.jpg",
            "historical_ref": "BUG-204",
            "org_id": "org-mds",
            "user_id": "usr-analyst",
            "user_name": "David Chen (Analyst)",
            "original_file_name": "grant_app_v2.0.xml",
            "test_copy_name": "grant_app_v2.0_test.json",
            "conversion_history": "Original XML v2.0 file preserved."
        },
        # BUG 4 (Edge Case 3: Unsupported Legacy File Format)
        {
            "bug_code": "GOV-BUG-004",
            "title": "[EDGE CASE 3] Proprietary binary binary-xml format rejected by ingestion engine",
            "description": "External partner attempted to upload file formatted as binary XML v1.5 (.bxml). Parser engine fails because v1.5 is deprecated and unsupported.",
            "expected_behavior": "System should preserve original uploaded file, decline auto-conversion, and display compliance rejection reason.",
            "actual_behavior": "Ingestion engine fails with FileFormatUnsupportedException.",
            "steps_attempted": "1. Select Partner Upload tab.\n2. Upload report_legacy.bxml.",
            "app_module": "Inter-Agency Portal",
            "app_version": "v5.0.1",
            "os": "RHEL Linux 9.2",
            "browser": "Firefox 115 ESM",
            "device_env": "Partner Gateway Node",
            "file_format": "Binary XML v1.5 (Deprecated)",
            "file_version": "1.5-DEPRECATED",
            "logs": "[2026-09-10 09:30:00] ERROR: FileFormatUnsupportedException: Binary XML format v1.5 is deprecated per 2024 compliance mandate.\n[2026-09-10 09:30:00] INFO: Original file report_legacy.bxml preserved unaltered in audit vault.",
            "error_messages": "FileFormatUnsupportedException: Format binary XML v1.5 is unsupported.",
            "screenshot_metadata": "bxml_unsupported.png",
            "historical_ref": "BUG-301",
            "org_id": "org-epo",
            "user_id": "usr-partner",
            "user_name": "Alex Taylor (Partner)",
            "original_file_name": "report_legacy.bxml",
            "test_copy_name": None,
            "conversion_history": "Conversion aborted. Original binary format preserved per government compliance standard 800-53."
        }
    ]

    # Generate 26 additional realistic bugs to total 30
    modules = ["Government Annual Reporting", "State Health Surveillance", "Municipal Grant Distribution", "Taxation Filing Module", "Digital Identity Verification", "Inter-Agency Portal"]
    formats = [("XML v2.1", "2.1"), ("XML v2.0", "2.0"), ("CSV Legacy", "1.0-LEGACY"), ("JSON Current", "3.5")]
    statuses = ["NEW", "ANALYSED", "SCENARIO_GENERATED", "APPROVED", "EXECUTED_SUCCESS"]

    for i in range(5, 31):
        mod = modules[i % len(modules)]
        fmt, ver = formats[i % len(formats)]
        code = f"GOV-BUG-{i:03d}"
        
        if fmt == "XML v2.1":
            title = f"XMLParserError in {mod} during batch validation"
            desc = f"Batch processing of XML v2.1 compliance files failed at record {i*10} due to schema mismatch."
            logs = f"[2026-09-10 08:{i:02d}:00] ERROR: XMLParserError: Element validation failed for schema {ver}."
            err = f"XMLParserError: Schema v{ver} mismatch"
            hist = "BUG-104"
        elif fmt == "XML v2.0":
            title = f"Legacy namespace error in {mod}"
            desc = f"XML v2.0 document failed namespace validation in module {mod}."
            logs = f"[2026-09-10 08:{i:02d}:00] ERROR: XMLParserError: Unbound namespace prefix in v2.0 header."
            err = "XMLParserError: Unbound prefix"
            hist = "BUG-204"
        elif fmt == "CSV Legacy":
            title = f"Delimiter parsing failure in {mod}"
            desc = f"Legacy pipe-delimited CSV file failed column count verification in {mod}."
            logs = f"[2026-09-10 08:{i:02d}:00] ERROR: CSVSchemaMismatch: Expected 14 columns, received 11."
            err = "CSVSchemaMismatch: Column count invalid"
            hist = "BUG-189"
        else:
            title = f"JSON payload validation failure in {mod}"
            desc = f"JSON Current payload failed strict ISO-8601 timestamp regex check in {mod}."
            logs = f"[2026-09-10 08:{i:02d}:00] ERROR: JSONValidationError: Field date_created invalid."
            err = "JSONValidationError: Regex match failed"
            hist = "BUG-215"

        sample_bugs.append({
            "bug_code": code,
            "title": title,
            "description": desc,
            "expected_behavior": f"Document should import successfully in {mod}.",
            "actual_behavior": f"Import failed with error: {err}.",
            "steps_attempted": "1. Login to portal.\n2. Select file.\n3. Click Import.",
            "app_module": mod,
            "app_version": "v4.8.2-gov",
            "os": "Windows 11 Enterprise" if i % 2 == 0 else "RHEL Linux 9",
            "browser": "Edge 124" if i % 2 == 0 else "Chrome 122",
            "device_env": f"Staging Node-{i%5 + 1}",
            "file_format": fmt,
            "file_version": ver,
            "logs": logs,
            "error_messages": err,
            "screenshot_metadata": f"screenshot_{code.lower()}.png",
            "historical_ref": hist,
            "org_id": "org-mds" if i % 3 == 0 else ("org-shd" if i % 3 == 1 else "org-epo"),
            "user_id": "usr-analyst" if i % 2 == 0 else "usr-qa",
            "user_name": "David Chen (Analyst)" if i % 2 == 0 else "Maria Rodriguez (QA Lead)",
            "original_file_name": f"compliance_doc_{code.lower()}.{fmt.split()[0].lower()}",
            "test_copy_name": f"compliance_doc_{code.lower()}_test.json",
            "conversion_history": "Original file preserved in compliance vault. Test copy generated for reproduction."
        })

    # Insert Bug Reports into SQLite
    for b in sample_bugs:
        bug_id = str(uuid.uuid4())
        timestamp = (datetime.datetime.now() - datetime.timedelta(hours=len(sample_bugs) - int(b["bug_code"].split("-")[-1]))).isoformat()
        
        cursor.execute("""
        INSERT INTO bug_reports (
            id, bug_code, title, description, expected_behavior, actual_behavior, steps_attempted,
            app_module, app_version, os, browser, device_env, file_format, file_version,
            timestamp, logs, error_messages, screenshot_metadata, historical_ref, org_id,
            created_by_user_id, created_by_user_name, status, original_file_name,
            original_file_preserved, test_copy_name, conversion_history
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            bug_id, b["bug_code"], b["title"], b["description"], b["expected_behavior"], b["actual_behavior"],
            b["steps_attempted"], b["app_module"], b["app_version"], b["os"], b["browser"], b["device_env"],
            b["file_format"], b["file_version"], timestamp, b["logs"], b["error_messages"],
            b["screenshot_metadata"], b["historical_ref"], b["org_id"], b["user_id"], b["user_name"],
            "NEW", b["original_file_name"], 1, b["test_copy_name"], b["conversion_history"]
        ))

    # 5. Insert Initial Audit Logs for system startup
    initial_audits = [
        {
            "id": str(uuid.uuid4()),
            "audit_code": "AUD-0001",
            "timestamp": datetime.datetime.now().isoformat(),
            "user_id": "usr-admin",
            "user_name": "Sarah Jenkins (Admin)",
            "user_role": "ADMIN",
            "org_id": "org-mds",
            "org_name": "Ministry of Digital Services",
            "bug_id": None,
            "action": "SYSTEM_INITIALIZATION",
            "ai_recommendation_summary": None,
            "evidence_summary": "System initialized with government compliance ruleset 2026.1",
            "decision": "COMPLETED",
            "human_confirmation": 1,
            "is_override": 0,
            "override_reason": None,
            "previous_value": None,
            "new_value": "V1.0-COMPLIANT",
            "execution_result": "SUCCESS"
        }
    ]

    import hashlib
    prev_h = "0" * 64
    for a in initial_audits:
        rec_data = f"{prev_h}|{a['timestamp']}|{a['user_id']}|{a['action']}|{a['decision']}|"
        rec_h = hashlib.sha256(rec_data.encode('utf-8')).hexdigest()
        cursor.execute("""
        INSERT INTO audit_logs (
            id, audit_code, timestamp, user_id, user_name, user_role, org_id, org_name,
            bug_id, action, ai_recommendation_summary, evidence_summary, decision,
            human_confirmation, is_override, override_reason, previous_value, new_value, execution_result,
            previous_hash, record_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            a["id"], a["audit_code"], a["timestamp"], a["user_id"], a["user_name"], a["user_role"],
            a["org_id"], a["org_name"], a["bug_id"], a["action"], a["ai_recommendation_summary"],
            a["evidence_summary"], a["decision"], a["human_confirmation"], a["is_override"],
            a["override_reason"], a["previous_value"], a["new_value"], a["execution_result"],
            prev_h, rec_h
        ))
        prev_h = rec_h

    conn.commit()
    conn.close()
    print(f"Successfully seeded database with {len(sample_bugs)} bug reports and 10 historical resolutions.")

if __name__ == "__main__":
    seed_all()
