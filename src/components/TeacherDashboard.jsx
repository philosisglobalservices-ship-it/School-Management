import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet, 
  PlusCircle, 
  Send, 
  AlertCircle,
  TrendingUp,
  UserCheck,
  Award
} from 'lucide-react';

export default function TeacherDashboard({ 
  staff, 
  classes, 
  subjects, 
  assessments, 
  onNavigate,
  onSelectAssessment 
}) {
  const teacherStaff = staff.find(s => s.id === 'stf_01') || staff[0];
  
  // Filter only assigned classes and subjects according to Section 7 & 9 (UI-007)
  const assignedClassList = classes.filter(c => teacherStaff.assignedClasses.includes(c.id));
  const assignedSubjectList = subjects.filter(s => teacherStaff.assignedSubjects.includes(s.id));
  const myAssessments = assessments.filter(a => teacherStaff.assignedClasses.includes(a.classId));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Teacher Profile Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(4, 120, 87, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <UserCheck size={14} /> Employee ID: {teacherStaff.employeeNumber} • ABAC Scoped
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Welcome, {teacherStaff.firstName} {teacherStaff.lastName}
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '0.92rem' }}>
            Faculty Portal: Active Class & Subject Scope (Section 2.1 & 7.1 Policy)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('attendance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
              color: '#064e3b',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <Clock size={18} color="#059669" />
            Mark Today's Attendance
          </button>
          <button
            onClick={() => onNavigate('assessments')}
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
              cursor: 'pointer'
            }}
          >
            <FileSpreadsheet size={18} />
            Enter Scores
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
        </div>
      </div>

      {/* Assigned Classes Grid */}
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
          My Assigned Classes & Academic Scope (ABAC Enforced)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {assignedClassList.map(cls => (
            <div key={cls.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {cls.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                    Level: {cls.level} • Stream: {cls.stream}
                  </div>
                </div>
                <span className="badge badge-published">Active Enrolment</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', background: 'var(--slate-50)', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--slate-800)' }}>Covered Subjects:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {assignedSubjectList.map(sub => (
                    <span key={sub.id} style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto' }}>
                <button
                  onClick={() => onNavigate('attendance')}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    color: 'var(--slate-700)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Attendance Register
                </button>
                <button
                  onClick={() => onNavigate('assessments')}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '8px',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Enter Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Tasks & Score Submission Ledger */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Assigned Assessments & Result Status
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
              Enter marks, save drafts, and submit to Head Teacher for official sign-off
            </p>
          </div>
          <button
            onClick={() => onNavigate('assessments')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <PlusCircle size={16} /> New Assessment Task
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {myAssessments.map(asm => (
            <div 
              key={asm.id}
              style={{
                padding: '1.1rem',
                borderRadius: '10px',
                backgroundColor: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {asm.title}
                  </span>
                  <span className={`badge badge-${asm.status}`}>
                    {asm.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', gap: '1.25rem' }}>
                  <span>Class: <strong>{asm.className}</strong></span>
                  <span>Subject: <strong>{asm.subjectName}</strong></span>
                  <span>Max Score: <strong>{asm.maxScore}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  onClick={() => {
                    onSelectAssessment(asm);
                    onNavigate('assessments');
                  }}
                  style={{
                    padding: '0.55rem 1rem',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <FileSpreadsheet size={16} />
                  Open Score Grid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
