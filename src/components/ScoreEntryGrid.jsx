import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Save, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Lock,
  ArrowLeft,
  Award
} from 'lucide-react';

export default function ScoreEntryGrid({ 
  assessment, 
  assessments = [],
  onSelectAssessment,
  students, 
  scores, 
  onSaveScores, 
  onSubmitAssessment, 
  currentRole,
  onBack,
  onViewReport
}) {
  const [localScores, setLocalScores] = useState(() => {
    // initialize from store
    const map = {};
    students.forEach(st => {
      const match = scores.find(s => s.assessmentId === assessment.id && s.studentId === st.id);
      map[st.id] = {
        scoreValue: match ? (match.scoreValue ?? '') : '',
        scoreStatus: match ? match.scoreStatus : 'scored'
      };
    });
    return map;
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    const map = {};
    students.forEach(st => {
      const match = scores.find(s => s.assessmentId === assessment.id && s.studentId === st.id);
      map[st.id] = {
        scoreValue: match ? (match.scoreValue ?? '') : '',
        scoreStatus: match ? match.scoreStatus : 'scored'
      };
    });
    setLocalScores(map);
    setMessage(null);
  }, [assessment.id, scores]);

  const handleScoreChange = (studentId, value) => {
    // Enforce non-negative and max_score boundary validation (§10.4 & §11)
    const num = parseFloat(value);
    if (value !== '' && (isNaN(num) || num < 0 || num > assessment.maxScore)) {
      setMessage({ type: 'error', text: `Score must be between 0 and assessment maximum of ${assessment.maxScore}` });
      return;
    }
    setMessage(null);
    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        scoreValue: value,
        scoreStatus: value === '' ? 'missing' : 'scored'
      }
    }));
  };

  const handleStatusChange = (studentId, status) => {
    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        scoreStatus: status,
        scoreValue: status !== 'scored' ? '' : prev[studentId].scoreValue
      }
    }));
  };

  const handleSaveDraft = () => {
    onSaveScores(assessment.id, localScores);
    setMessage({ type: 'success', text: 'Draft scores successfully committed to database (§10.4 Idempotent PUT).' });
  };

  const handleSubmitToHead = () => {
    // Validate that all students have either a score or valid absent/exempt status
    let hasEmpty = false;
    students.forEach(st => {
      const row = localScores[st.id];
      if (row.scoreStatus === 'scored' && (row.scoreValue === '' || row.scoreValue === null)) {
        hasEmpty = true;
      }
    });

    if (hasEmpty) {
      setMessage({ type: 'error', text: 'Every student on roster must be accounted for before submitting to Head Teacher.' });
      return;
    }

    onSaveScores(assessment.id, localScores);
    onSubmitAssessment(assessment.id);
    setMessage({ type: 'success', text: 'Assessment submitted for Head Teacher review! Transitioned to SUBMITTED state.' });
  };

  const isEditable = assessment.status === 'draft' || assessment.status === 'submitted';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--slate-500)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Assessments
          </button>

          {/* Assessment Switcher Dropdown */}
          {assessments && assessments.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase' }}>Current Assessment:</label>
              <select
                value={assessment.id}
                onChange={(e) => {
                  const targetAsm = assessments.find(a => a.id === e.target.value);
                  if (targetAsm && onSelectAssessment) onSelectAssessment(targetAsm);
                }}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  border: '1.5px solid #6366f1',
                  backgroundColor: '#ffffff',
                  color: '#1e1b4b',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.subjectName} — {a.title} ({a.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {assessment.title}
            </h1>
            <span className={`badge badge-${assessment.status}`}>
              {assessment.status.replace('_', ' ')}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Class: <strong>{assessment.className}</strong> • Subject: <strong>{assessment.subjectName}</strong> • Maximum: <strong>{assessment.maxScore} pts</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onViewReport && onViewReport(assessment)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              border: '1.5px solid #c7d2fe',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Award size={16} /> View Assessment Report
          </button>
          {isEditable && currentRole === 'TEACHER' && (
            <>
              <button
                onClick={handleSaveDraft}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: 'var(--slate-700)',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Save size={16} /> Save Draft
              </button>
              <button
                onClick={handleSubmitToHead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Send size={16} /> Submit to Head Teacher
              </button>
            </>
          )}

          {!isEditable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
              <Lock size={16} /> Score entry locked in {assessment.status.toUpperCase()} state
            </div>
          )}
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: message.type === 'error' ? '#fff1f2' : '#f0fdf4',
          color: message.type === 'error' ? '#e11d48' : '#16a34a',
          border: `1px solid ${message.type === 'error' ? '#fecdd3' : '#bbf7d0'}`,
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      {/* Roster Spreadsheet Grid */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STUDENT NO</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STUDENT NAME</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700, width: '180px' }}>SCORE (MAX {assessment.maxScore})</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>PERCENTAGE</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>GRADE</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st, idx) => {
              const row = localScores[st.id] || { scoreValue: '', scoreStatus: 'scored' };
              const val = parseFloat(row.scoreValue);
              const percentage = !isNaN(val) ? ((val / assessment.maxScore) * 100).toFixed(1) : '-';
              
              let grade = '-';
              if (!isNaN(val)) {
                const pct = (val / assessment.maxScore) * 100;
                if (pct >= 75) grade = 'A1 (Excellent)';
                else if (pct >= 65) grade = 'B2 (Very Good)';
                else if (pct >= 55) grade = 'C4 (Credit)';
                else if (pct >= 40) grade = 'P7 (Pass)';
                else grade = 'F9 (Fail)';
              }

              return (
                <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--slate-600)' }}>
                    {st.studentNumber}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {st.firstName} {st.lastName}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <select
                      disabled={!isEditable || currentRole !== 'TEACHER'}
                      value={row.scoreStatus}
                      onChange={(e) => handleStatusChange(st.id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: row.scoreStatus === 'scored' ? '#0f172a' : '#e11d48'
                      }}
                    >
                      <option value="scored">Scored</option>
                      <option value="absent">Absent</option>
                      <option value="exempt">Exempt</option>
                      <option value="missing">Missing</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    {row.scoreStatus === 'scored' ? (
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={assessment.maxScore}
                        disabled={!isEditable || currentRole !== 'TEACHER'}
                        value={row.scoreValue}
                        onChange={(e) => handleScoreChange(st.id, e.target.value)}
                        placeholder="0.0"
                        style={{
                          width: '100px',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          color: '#0f172a',
                          backgroundColor: !isEditable ? '#f8fafc' : '#ffffff'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 600 }}>
                        [{row.scoreStatus.toUpperCase()}]
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                    {percentage !== '-' ? `${percentage}%` : '-'}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: grade.startsWith('A') ? '#15803d' : grade.startsWith('B') ? '#4338ca' : '#475569' }}>
                    {grade}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
