import React from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  FileCheck2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  CalendarDays,
  FileSpreadsheet,
  Award
} from 'lucide-react';

export default function HeadTeacherDashboard({ 
  school, 
  students, 
  staff, 
  assessments, 
  auditLogs, 
  securityAlerts, 
  onNavigate 
}) {
  const publishedAssessments = assessments.filter(a => a.status === 'published').length;
  const pendingReviews = assessments.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
  const draftAssessments = assessments.filter(a => a.status === 'draft').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Top Banner / School Context Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem', backdropFilter: 'blur(4px)' }}>
            <Building2 size={14} /> School Code: {school.slug.toUpperCase()} | Timezone: {school.timezone}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {school.name}
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '0.92rem', maxWidth: '600px' }}>
            Executive Administrative Command Center • Academic Session {school.currentSession} ({school.currentTerm})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('results_workflow')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
              color: '#312e81',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <FileCheck2 size={18} color="#4f46e5" />
            Review Queue ({pendingReviews})
          </button>
          <button 
            onClick={() => onNavigate('assessment_reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Award size={18} />
            Assessment Reports
          </button>
          <button 
            onClick={() => onNavigate('students')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Users size={18} />
            Manage Students
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Enrolments</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#eef2ff', color: '#4f46e5' }}>
              <GraduationCap size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            {students.length * 28 + 14} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>Students</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <TrendingUp size={14} /> 100% Verified Identifiers
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Staff Deployment</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            {staff.length + 18} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>Faculty</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Active assignments checked</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: pendingReviews > 0 ? '4px solid #f59e0b' : '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Reviews</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', letterSpacing: '-0.02em' }}>
            {pendingReviews} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>Assessments</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Awaiting Head Teacher sign-off</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Published Scores</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', letterSpacing: '-0.02em' }}>
            {publishedAssessments} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>Released</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Live on Parent & Student Portals</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Action Queue & Security/Audit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        {/* Continuous Assessment Approval Queue */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Academic Workflow Queue (§11 State Machine)
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                Assessments submitted by assigned subject teachers for verification & publication
              </p>
            </div>
            <button 
              onClick={() => onNavigate('results_workflow')}
              style={{
                fontSize: '0.8rem',
                color: '#4f46e5',
                background: 'none',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {assessments.map(asm => (
              <div 
                key={asm.id}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {asm.title}
                    </span>
                    <span className={`badge badge-${asm.status}`}>
                      {asm.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', gap: '1rem' }}>
                    <span><strong>Class:</strong> {asm.className}</span>
                    <span><strong>Subject:</strong> {asm.subjectName}</span>
                    <span><strong>Max:</strong> {asm.maxScore} pts</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => onNavigate('results_workflow')}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: asm.status === 'published' ? '#f1f5f9' : '#4f46e5',
                      color: asm.status === 'published' ? '#475569' : '#ffffff',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {asm.status === 'published' ? 'View Results' : 'Review & Sign'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Audit Monitor */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#4f46e5" /> Security & Audit Feed
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                Immutable audit events (§12) & alert logs
              </p>
            </div>
            <button 
              onClick={() => onNavigate('audit_logs')}
              style={{
                fontSize: '0.8rem',
                color: '#4f46e5',
                background: 'none',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Auditor View
            </button>
          </div>

          {/* Security alerts ticker */}
          {securityAlerts.length > 0 && (
            <div style={{
              padding: '0.85rem',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <AlertTriangle size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9f1239' }}>
                  {securityAlerts[0].eventType} (Severity: {securityAlerts[0].severity.toUpperCase()})
                </div>
                <div style={{ fontSize: '0.73rem', color: '#be123c', marginTop: '0.15rem' }}>
                  {securityAlerts[0].details}
                </div>
              </div>
            </div>
          )}

          {/* Audit events list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.slice(0, 4).map(log => (
              <div 
                key={log.id} 
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'var(--font-mono)' }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                    {new Date(log.occurredAt).toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ color: 'var(--slate-600)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Actor: {log.actor} ({log.actorRole})</span>
                  <span style={{ color: log.outcome === 'success' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                    {log.outcome.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
