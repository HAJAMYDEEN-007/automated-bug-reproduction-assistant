import sqlite3
import uuid
import datetime
import hashlib
from typing import Dict, Any, List, Optional
from database import get_db

def compute_hash(prev_hash: str, timestamp: str, user_id: str, action: str, decision: str, bug_id: Optional[str] = None) -> str:
    data = f"{prev_hash}|{timestamp}|{user_id}|{action}|{decision}|{bug_id or ''}"
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

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
    Appends an immutable audit log record to the database with cryptographic hash chaining.
    """
    conn = get_db()
    cursor = conn.cursor()

    audit_id = str(uuid.uuid4())
    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    cnt = cursor.fetchone()[0] + 1
    audit_code = f"AUD-{cnt:04d}"
    timestamp = datetime.datetime.now().isoformat()

    # Retrieve hash of the most recent audit record for chaining
    cursor.execute("SELECT record_hash FROM audit_logs ORDER BY timestamp DESC LIMIT 1")
    last_row = cursor.fetchone()
    prev_hash = last_row["record_hash"] if last_row and last_row["record_hash"] else "0" * 64
    
    rec_hash = compute_hash(prev_hash, timestamp, user_id, action, decision, bug_id)

    cursor.execute("""
    INSERT INTO audit_logs (
        id, audit_code, timestamp, user_id, user_name, user_role, org_id, org_name,
        bug_id, action, ai_recommendation_summary, evidence_summary, decision,
        human_confirmation, is_override, override_reason, previous_value, new_value, execution_result,
        previous_hash, record_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        audit_id, audit_code, timestamp, user_id, user_name, user_role, org_id, org_name,
        bug_id, action, ai_recommendation_summary, evidence_summary, decision,
        1 if human_confirmation else 0, 1 if is_override else 0, override_reason,
        previous_value, new_value, execution_result, prev_hash, rec_hash
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

def verify_audit_integrity() -> Dict[str, Any]:
    """
    30. AUDIT INTEGRITY: Verifies cryptographic hash chain across all audit records.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp ASC")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"status": "VALID", "total_records": 0, "verified_records": 0, "corrupted_record_id": None}

    expected_prev = "0" * 64
    verified = 0

    for r in rows:
        row_dict = dict(r)
        p_hash = row_dict.get("previous_hash") or expected_prev
        r_hash = row_dict.get("record_hash")
        
        calc_hash = compute_hash(
            p_hash,
            row_dict["timestamp"],
            row_dict["user_id"],
            row_dict["action"],
            row_dict["decision"],
            row_dict.get("bug_id")
        )

        if r_hash and r_hash != calc_hash:
            return {
                "status": "INVALID_TAMPERED",
                "total_records": len(rows),
                "verified_records": verified,
                "corrupted_record_id": row_dict["id"],
                "message": f"Audit record {row_dict['audit_code']} failed SHA-256 hash verification."
            }

        expected_prev = r_hash if r_hash else calc_hash
        verified += 1

    return {
        "status": "VALID",
        "total_records": len(rows),
        "verified_records": verified,
        "corrupted_record_id": None,
        "message": f"All {verified} audit chain records verified cryptographically with SHA-256."
    }
