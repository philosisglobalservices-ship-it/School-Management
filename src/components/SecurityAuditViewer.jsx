import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  AlertTriangle, 
  FileText, 
  Download, 
  CheckCircle2, 
  XCircle,
  Clock,
  Terminal
} from 'lucide-react';

export default function SecurityAuditViewer({ auditLogs, securityAlerts }) {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'alerts'
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = `${log.actor} ${log.action} ${log.resourceType} ${log.correlationId}`.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action.includes(filterAction);
    return matchesSearch && matchesAction;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={26} color="#4f46e5" /> Security Events & Audit Trail (§12 & §13 / UI-025, UI-026)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Immutable, append-only security logs recording actor, RBAC role snapshot, RFC3339 timestamp, and correlation IDs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.3rem', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'audit' ? '#ffffff' : 'transparent',
              color: activeTab === 'audit' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'alerts' ? '#ffffff' : 'transparent',
              color: activeTab === 'alerts' ? '#e11d48' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Security Alerts ({securityAlerts.length})
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <>
          {/* Audit Filters */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by actor, action, or correlation ID..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.4rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--slate-700)'
              }}
            >
              <option value="ALL">All Actions</option>
              <option value="result">Result Actions</option>
              <option value="auth">Auth Actions</option>
            </select>
          </div>

          {/* Audit Event Table */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>TIMESTAMP (UTC)</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>ACTION</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>ACTOR</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>RESOURCE</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>OUTCOME</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>CORRELATION ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-600)' }}>
                      {log.occurredAt}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#312e81', fontFamily: 'var(--font-mono)' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                      {log.actor} <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({log.actorRole})</span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {log.resourceType}:{log.resourceId}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span className={`badge ${log.outcome === 'success' ? 'badge-published' : 'badge-cancelled'}`}>
                        {log.outcome.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontSize: '0.75rem' }}>
                      {log.correlationId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Security Incident Alerts (§13) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {securityAlerts.map(alert => (
            <div 
              key={alert.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${alert.severity === 'critical' ? '#dc2626' : alert.severity === 'high' ? '#e11d48' : '#f59e0b'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color="#e11d48" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                    {alert.eventType}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge badge-${alert.severity === 'high' ? 'cancelled' : 'review'}`}>
                    Severity: {alert.severity}
                  </span>
                  <span className="badge badge-draft">
                    Status: {alert.alertStatus}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-700)' }}>
                {alert.details}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', display: 'flex', gap: '1.5rem' }}>
                <span>Actor: {alert.actorEmail}</span>
                <span>Logged: {alert.occurredAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
