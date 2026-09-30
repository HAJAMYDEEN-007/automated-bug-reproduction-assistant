import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "gov_bugs.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # 1. Organisations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS organisations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL
    );
    """)

    # 2. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        organisation_id TEXT NOT NULL
    );
    """)

    # 3. Historical Resolutions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS historical_resolutions (
        id TEXT PRIMARY KEY,
        bug_code TEXT NOT NULL,
        title TEXT NOT NULL,
        app_module TEXT NOT NULL,
        file_format TEXT NOT NULL,
        file_version TEXT NOT NULL,
        error_pattern TEXT NOT NULL,
        resolution_summary TEXT NOT NULL,
        schema_rule TEXT NOT NULL,
        verified_steps TEXT NOT NULL
    );
    """)

    # 4. Bug Reports
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bug_reports (
        id TEXT PRIMARY KEY,
        bug_code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        expected_behavior TEXT NOT NULL,
        actual_behavior TEXT NOT NULL,
        steps_attempted TEXT,
        app_module TEXT NOT NULL,
        app_version TEXT NOT NULL,
        os TEXT NOT NULL,
        browser TEXT NOT NULL,
        device_env TEXT NOT NULL,
        file_format TEXT NOT NULL,
        file_version TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        logs TEXT,
        error_messages TEXT,
        screenshot_metadata TEXT,
        historical_ref TEXT,
        org_id TEXT NOT NULL,
        created_by_user_id TEXT NOT NULL,
        created_by_user_name TEXT NOT NULL,
        status TEXT NOT NULL,
        original_file_name TEXT,
        original_file_preserved INTEGER DEFAULT 1,
        test_copy_name TEXT,
        conversion_history TEXT
    );
    """)

    # 5. AI Recommendations / Analysis
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_recommendations (
        id TEXT PRIMARY KEY,
        bug_id TEXT NOT NULL UNIQUE,
        identified_problem TEXT NOT NULL,
        probable_failure_point TEXT NOT NULL,
        missing_reproduction_info TEXT NOT NULL,
        relevant_env_conditions TEXT NOT NULL,
        relevant_log_evidence TEXT NOT NULL,
        similar_historical_bugs TEXT NOT NULL,
        matching_resolutions TEXT NOT NULL,
        confidence_score REAL NOT NULL,
        risk_level TEXT NOT NULL,
        explainability_rules TEXT NOT NULL,
        recommended_steps TEXT NOT NULL,
        required_test_data TEXT NOT NULL,
        expected_result TEXT NOT NULL,
        failure_indicators TEXT NOT NULL,
        is_edge_case INTEGER DEFAULT 0,
        edge_case_type TEXT,
        FOREIGN KEY(bug_id) REFERENCES bug_reports(id)
    );
    """)

    # 6. Reproduction Scenarios
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reproduction_scenarios (
        id TEXT PRIMARY KEY,
        scenario_code TEXT NOT NULL UNIQUE,
        bug_id TEXT NOT NULL,
        bug_code TEXT NOT NULL,
        title TEXT NOT NULL,
        preconditions TEXT NOT NULL,
        environment TEXT NOT NULL,
        test_data TEXT NOT NULL,
        steps TEXT NOT NULL,
        expected_result TEXT NOT NULL,
        observed_result TEXT,
        pass_fail_status TEXT DEFAULT 'PENDING',
        risk_level TEXT NOT NULL,
        is_high_impact INTEGER DEFAULT 0,
        approval_status TEXT DEFAULT 'PENDING_CONFIRMATION',
        override_reason TEXT,
        FOREIGN KEY(bug_id) REFERENCES bug_reports(id)
    );
    """)

    # 7. Scenario Executions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scenario_executions (
        id TEXT PRIMARY KEY,
        scenario_id TEXT NOT NULL,
        bug_id TEXT NOT NULL,
        executed_by_user_id TEXT NOT NULL,
        executed_by_user_name TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        steps_log TEXT NOT NULL,
        final_result TEXT NOT NULL,
        evidence_captured TEXT NOT NULL,
        logs_output TEXT NOT NULL,
        FOREIGN KEY(scenario_id) REFERENCES reproduction_scenarios(id)
    );
    """)

    # 8. Audit Logs (APPEND ONLY + TAMPER EVIDENT HASH CHAIN)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        audit_code TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_role TEXT NOT NULL,
        org_id TEXT NOT NULL,
        org_name TEXT NOT NULL,
        bug_id TEXT,
        action TEXT NOT NULL,
        ai_recommendation_summary TEXT,
        evidence_summary TEXT,
        decision TEXT NOT NULL,
        human_confirmation INTEGER NOT NULL,
        is_override INTEGER NOT NULL,
        override_reason TEXT,
        previous_value TEXT,
        new_value TEXT,
        execution_result TEXT,
        previous_hash TEXT,
        record_hash TEXT
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
