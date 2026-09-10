import React, { useState, useEffect } from 'react';
import { fetchAuditLogs, fetchOrganisations, fetchUsers } from '../api';
import { AuditLog, Organisation, User } from '../types';
import { History, Filter, Search, ShieldCheck, Edit3, UserCheck, CheckCircle2 } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [overrideOnly, setOverrideOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAuditData() {
      setLoading(true);
      try {
        const oList = await fetchOrganisations();
        const uList = await fetchUsers();
        setOrgs(oList);
        setUsers(uList);

        const aLogs = await fetchAuditLogs({
          org_id: selectedOrg || undefined,
          user_id: selectedUser || undefined,
          is_override: overrideOnly ? true : undefined
        });
        setLogs(aLogs);
      } catch (err) {
        console.error('Failed loading audit logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadAuditData();
  }, [selectedOrg, selectedUser, overrideOnly]);

  const filteredLogs = logs.filter(l => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (l.audit_code.toLowerCase().includes(term) ||
            l.action.toLowerCase().includes(term) ||
            (l.bug_id && l.bug_id.toLowerCase().includes(term)) ||
            (l.override_reason && l.override_reason.toLowerCase().includes(term)) ||
            l.user_name.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <History className="w-5 h-5 text-sky-400" />
            <span>IMMUTABLE APPEND-ONLY DECISION AUDIT TRAIL</span>
          </h2>
          <p className="text-xs text-slate-400">
            Complete auditable trail of AI recommendations, human confirmations, manual override reasons, and execution outputs.
          </p>
        </div>

        {/* Audit Filter Toolbar */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search audit code, action, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
            />
          </div>

          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-sky-300 text-xs rounded px-2.5 py-1.5 font-medium cursor-pointer"
          >
            <option value="">All Organisations</option>
            {orgs.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>

          <label className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={overrideOnly}
              onChange={(e) => setOverrideOnly(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="font-semibold text-amber-400">Overrides Only</span>
          </label>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="gov-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono">Querying Audit Database...</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="p-3">AUDIT CODE</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">USER & ROLE</th>
                <th className="p-3">ORGANISATION</th>
                <th className="p-3">ACTION & DECISION</th>
                <th className="p-3">HUMAN CONFIRMATION</th>
                <th className="p-3">EVIDENCE / OVERRIDE REASON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className={log.is_override ? 'bg-amber-950/10 hover:bg-amber-950/20 transition' : 'hover:bg-slate-800/50 transition'}>
                  <td className="p-3 font-mono font-bold text-sky-400">{log.audit_code}</td>
                  <td className="p-3 text-[11px] font-mono text-slate-400">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-100">{log.user_name}</div>
                    <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono">{log.user_role}</span>
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{log.org_name}</td>
                  <td className="p-3">
                    <div className="font-bold text-sky-300">{log.action}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Decision: {log.decision}</span>
                  </td>
                  <td className="p-3">
                    {log.is_override ? (
                      <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-mono flex items-center w-max space-x-1 font-bold">
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>OVERRIDDEN</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono flex items-center w-max space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>CONFIRMED</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 max-w-xs">
                    {log.override_reason ? (
                      <div className="bg-amber-950/40 p-1.5 rounded border border-amber-800/60 font-mono text-[11px] text-amber-200">
                        "{log.override_reason}"
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-300 truncate font-mono">
                        {log.evidence_summary || log.ai_recommendation_summary || 'N/A'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
