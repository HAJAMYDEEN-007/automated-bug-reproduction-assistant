import sqlite3
import uuid
import datetime
from typing import Dict, Any, List, Optional
from database import get_db

def log_audit_event(
    user_id: str,
    user_name: str,
    user_role: str,
    org_id: str,
    org_name: str,
    action: str,
    decision: str,
    bug_id: Optional[str] = None,
    ai_recommendation_summary: Optional[str] = None,
    evidence_summary: Optional[str] = None,
    human_confirmation: bool = False,
    is_override: bool = False,
    override_reason: Optional[str] = None,
    previous_value: Optional[str] = None,
    new_value: Optional[str] = None,
    execution_result: Optional[str] = None
) -> Dict[str, Any]:
    """
    Appends an immutable audit log record to the database.
    """
    conn = get_db()
    cursor = conn.cursor()

    audit_id = str(uuid.uuid4())
    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    cnt = cursor.fetchone()[0] + 1
    audit_code = f"AUD-{cnt:04d}"
    timestamp = datetime.datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO audit_logs (
        id, audit_code, timestamp, user_id, user_name, user_role, org_id, org_name,
        bug_id, action, ai_recommendation_summary, evidence_summary, decision,
        human_confirmation, is_override, override_reason, previous_value, new_value, execution_result
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        audit_id, audit_code, timestamp, user_id, user_name, user_role, org_id, org_name,
        bug_id, action, ai_recommendation_summary, evidence_summary, decision,
        1 if human_confirmation else 0, 1 if is_override else 0, override_reason,
        previous_value, new_value, execution_result
    ))

    conn.commit()

    cursor.execute("SELECT * FROM audit_logs WHERE id = ?", (audit_id,))
    row = cursor.fetchone()
    conn.close()

    return dict(row)

def get_filtered_audit_logs(
    org_id: Optional[str] = None,
    user_id: Optional[str] = None,
    bug_id: Optional[str] = None,
    action: Optional[str] = None,
    is_override: Optional[bool] = None,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """
    Retrieves audit trail with multi-faceted filtering.
    """
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM audit_logs WHERE 1=1"
    params = []

    if org_id:
        query += " AND org_id = ?"
        params.append(org_id)
    if user_id:
        query += " AND user_id = ?"
        params.append(user_id)
    if bug_id:
        query += " AND bug_id = ?"
        params.append(bug_id)
    if action:
        query += " AND action LIKE ?"
        params.append(f"%{action}%")
    if is_override is not None:
        query += " AND is_override = ?"
        params.append(1 if is_override else 0)

    query += " ORDER BY timestamp DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(r) for r in rows]
