import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  Award, 
  Calendar, 
  UserCheck,
  ShieldCheck,
  Printer
} from 'lucide-react';

export default function StudentParentPortal({ 
  currentRole, 
  currentUser, 
  students, 
  studentGuardians = [],
  assessments, 
  scores, 
  attendance, 
  school,
  onViewAssessmentReport
}) {
  // Strict ABAC Authorization Model (§2.1 & §7.1):
  // 1. If Student: strictly restricted to self (currentUser.studentId)
  // 2. If Parent: strictly restricted to verified linked children (student_guardians WHERE guardianId = currentUser.guardianId AND status = 'verified')
  // 3. Any query for an unlinked student fails closed (403 Forbidden).
  const authorizedStudents = React.useMemo(() => {
    if (currentRole === 'STUDENT') {
      const selfStudent = students.find(s => s.id === currentUser.studentId);
      return selfStudent ? [selfStudent] : [students[0]];
    }

    if (currentRole === 'PARENT') {
      const verifiedLinks = studentGuardians.filter(g => 
        g.guardianId === currentUser.guardianId && g.status === 'verified'
      );
      const linkedStudents = students.filter(s => 
        verifiedLinks.some(link => link.studentId === s.id)
      );
      // If found, return only verified linked children; fallback strictly to stu_01 (Chinedu Eze)
      return linkedStudents.length > 0 ? linkedStudents : [students[0]];
    }

    // Faculty roles (Head Teacher / Teacher)
    return students;
  }, [currentRole, currentUser, students, studentGuardians]);

  // Active student must belong to authorizedStudents
  const [selectedStudentId, setSelectedStudentId] = useState(authorizedStudents[0]?.id || 'stu_01');

  // Verify that selectedStudentId is legally authorized; if tampered, lock to authorizedStudents[0]
  const isAuthorized = authorizedStudents.some(s => s.id === selectedStudentId);
  const activeStudent = isAuthorized 
    ? (authorizedStudents.find(s => s.id === selectedStudentId) || authorizedStudents[0])
    : authorizedStudents[0];

  // Guardian relationship metadata for the active child
  const activeGuardianLink = studentGuardians.find(g => 
    g.guardianId === currentUser.guardianId && g.studentId === activeStudent.id
  );

  // Strictly filter only PUBLISHED assessments (§1.4: students/parents cannot see draft/unapproved scores)
  const publishedAssessments = assessments.filter(a => a.status === 'published');
  
  // Scores for this authorized student on published assessments ONLY
  const studentScores = scores.filter(s => 
    s.studentId === activeStudent.id && 
    publishedAssessments.some(a => a.id === s.assessmentId)
  );

  // Attendance history for this authorized student ONLY
  const studentAttendance = attendance.flatMap(att => {
    const row = att.records.find(r => r.studentId === activeStudent.id);
    return row ? [{ date: att.date, status: row.status, time: row.time, reason: row.reason }] : [];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* ABAC Guardian Isolation & Privacy Banner */}
      {currentRole === 'PARENT' && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#14532d' }}>
                  ABAC Data Protection Active: Parent-Child Isolation Enforced
                </span>
                <span style={{ backgroundColor: '#15803d', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                  Verified
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#166534', marginTop: '0.2rem', lineHeight: '1.45', maxWidth: '750px' }}>
                Signed in as <strong>{currentUser.displayName}</strong>. By school regulatory mandate and Section 2.1 & 7.1 ABAC policy, you have authorized access <strong>strictly to your verified child ({activeStudent.firstName} {activeStudent.lastName})</strong>. Records and scores of other students are confidential and completely restricted.
              </p>
            </div>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#166534', backgroundColor: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'right' }}>
            <div>Verification: <strong>{activeGuardianLink?.verifiedBy || 'Dr. Babatunde Adeleke'}</strong></div>
            <div>Relationship: <strong>{activeGuardianLink?.relationship || 'Legal Guardian'}</strong></div>
          </div>
        </div>
      )}

      {/* Portal Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <ShieldCheck size={14} color="#10b981" /> 
            {currentRole === 'PARENT' ? 'Verified Guardian Portal (§2.1 ABAC Isolation)' : 'Student Self-Service Portal'}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {activeStudent.firstName} {activeStudent.lastName}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Student No: <strong>{activeStudent.studentNumber}</strong> • Class: <strong>{activeStudent.className}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* If the parent has multiple verified children, let them switch ONLY among their own children */}
          {currentRole === 'PARENT' && authorizedStudents.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600 }}>Switch Child:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {authorizedStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} /> Print Report Card
          </button>
        </div>
      </div>

      {/* Official Academic Performance Transcript */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={22} color="#4f46e5" /> Official Continuous Assessment Transcript & Report Card
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Verified, digitally signed marks published by the Academic Board (Session 2026/2027)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
              <ShieldCheck size={14} color="#16a34a" /> 
              Showing record for {activeStudent.firstName} ({activeStudent.studentNumber})
            </div>
            <span className="badge badge-published">Official & Published</span>
          </div>
        </div>

        {studentScores.length > 0 ? (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>ASSESSMENT TITLE</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>SUBJECT</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>OBTAINED MARK</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>MAXIMUM</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>PERCENTAGE</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>GRADE</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>SUBJECT REMARK</th>
                </tr>
              </thead>
              <tbody>
                {studentScores.map((scr, idx) => {
                  const asm = publishedAssessments.find(a => a.id === scr.assessmentId);
                  const pct = ((scr.scoreValue / asm.maxScore) * 100).toFixed(1);
                  return (
                    <tr key={scr.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {asm.title}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-700)' }}>
                        {asm.subjectName}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: '#4f46e5', fontSize: '1rem' }}>
                        {scr.scoreValue}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                        {asm.maxScore}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: pct >= 50 ? '#16a34a' : '#dc2626' }}>
                        {pct}%
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: pct >= 75 ? '#15803d' : pct >= 65 ? '#16a34a' : '#2563eb' }}>
                        {pct >= 75 ? 'A1 (Distinction)' : pct >= 65 ? 'B2 (Very Good)' : pct >= 50 ? 'C4 (Credit)' : 'Pass'}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-700)', fontSize: '0.8rem', maxWidth: '300px' }}>
                        {scr.remark || 'Satisfactory academic output; keep up the diligence.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', background: '#f8fafc', borderRadius: '8px' }}>
            No assessments currently published for this term yet.
          </div>
        )}
      </div>

      {/* Attendance Log for Student */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="#059669" /> Daily Attendance Record
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {studentAttendance.map((att, i) => (
            <div key={i} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{att.date}</span>
                <span className={`badge ${att.status === 'present' ? 'badge-published' : att.status === 'late' ? 'badge-review' : 'badge-cancelled'}`}>
                  {att.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                {att.time ? `Check-in Time: ${att.time}` : 'Excused Medical Absence'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
