import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  Globe, 
  FileText, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles,
  HelpCircle,
  Eye,
  AlertTriangle,
  Award
} from 'lucide-react';

export default function ResultsWorkflow({ 
  assessments, 
  scores, 
  students, 
  currentRole, 
  onApprove, 
  onReject, 
  onPublish,
  onRequestCorrection,
  corrections,
  onApproveCorrection,
  onViewReport
}) {
  const [selectedAsm, setSelectedAsm] = useState(assessments[0] || null);
  const [returnReason, setReturnReason] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    studentId: '',
    scoreId: '',
    proposedScore: '',
    reason: ''
  });
  const [message, setMessage] = useState(null);

  const currentScores = selectedAsm ? scores.filter(s => s.assessmentId === selectedAsm.id) : [];

  const handleApprove = () => {
    onApprove(selectedAsm.id);
    setMessage({ type: 'success', text: `Assessment approved! Transitioned to APPROVED state (§11.2 State Machine).` });
  };

  const handleReturn = () => {
    if (!returnReason.trim()) {
      setMessage({ type: 'error', text: 'You must provide a specific reason when returning assessment to draft state.' });
      return;
    }
    onReject(selectedAsm.id, returnReason);
    setReturnReason('');
    setMessage({ type: 'info', text: 'Assessment returned to Assigned Teacher with feedback.' });
  };

  const handlePublish = () => {
    onPublish(selectedAsm.id);
    setMessage({ type: 'success', text: 'Assessment published! Scores are now visible on Parent and Student Portals.' });
  };

  const submitCorrection = () => {
    if (!correctionForm.studentId || !correctionForm.proposedScore || correctionForm.reason.length < 10) {
      setMessage({ type: 'error', text: 'Please fill all fields. Reason must be at least 10 characters long (§6 constraint).' });
      return;
    }

    const stMatch = students.find(s => s.id === correctionForm.studentId);
    const scoreMatch = currentScores.find(s => s.studentId === correctionForm.studentId);

    onRequestCorrection({
      id: `cor_${Date.now()}`,
      scoreId: scoreMatch ? scoreMatch.id : 'scr_gen',
      assessmentTitle: selectedAsm.title,
      studentName: `${stMatch.firstName} ${stMatch.lastName}`,
      oldScoreValue: scoreMatch ? scoreMatch.scoreValue : 0,
      proposedScoreValue: parseFloat(correctionForm.proposedScore),
      oldScoreStatus: 'scored',
      proposedScoreStatus: 'scored',
      reason: correctionForm.reason,
      requestedBy: currentRole === 'HEAD_TEACHER' ? 'Dr. Babatunde Adeleke' : 'Mrs. Ngozi Okonjo',
      requestedAt: new Date().toISOString(),
      status: 'pending'
    });

    setShowCorrectionModal(false);
    setMessage({ type: 'success', text: 'Formal Correction Request filed (requires dual-control approval §11.2).' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* State Machine Overview Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileCheck2 size={24} color="#4f46e5" />
          Academic Result Approval & Publication Engine (§11 State Machine)
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
          Implements immutable audit trails, multi-stage approval gates, dual-control post-publication corrections, and role-based permissions.
        </p>

        {/* State Machine Pipeline Visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { label: 'DRAFT', desc: 'Teacher Entry' },
            { label: 'SUBMITTED', desc: 'Teacher Sign-off' },
            { label: 'UNDER_REVIEW', desc: 'Audit Check' },
            { label: 'APPROVED', desc: 'Head Teacher Pass' },
            { label: 'PUBLISHED', desc: 'Parent/Student Live' },
            { label: 'CORRECTION', desc: 'Dual-Control Request' }
          ].map((st, i, arr) => (
            <React.Fragment key={st.label}>
              <div style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: selectedAsm && selectedAsm.status.toUpperCase() === st.label ? '#4f46e5' : '#f1f5f9',
                color: selectedAsm && selectedAsm.status.toUpperCase() === st.label ? '#ffffff' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                textAlign: 'center',
                minWidth: '100px',
                border: '1px solid #cbd5e1'
              }}>
                <div>{st.label}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.85 }}>{st.desc}</div>
              </div>
              {i < arr.length - 1 && <ArrowRight size={16} color="#94a3b8" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: message.type === 'error' ? '#fff1f2' : message.type === 'info' ? '#eff6ff' : '#f0fdf4',
          color: message.type === 'error' ? '#e11d48' : message.type === 'info' ? '#1d4ed8' : '#16a34a',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {message.text}
        </div>
      )}

      {/* Main Approval Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '1.5rem' }}>
        {/* Left Assessment Selector */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0.5rem' }}>
            Assessments in Queue
          </h2>
          {assessments.map(asm => {
            const isSel = selectedAsm && selectedAsm.id === asm.id;
            return (
              <div
                key={asm.id}
                onClick={() => setSelectedAsm(asm)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  backgroundColor: isSel ? '#eef2ff' : '#f8fafc',
                  border: isSel ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {asm.title}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                  <span>{asm.className}</span>
                  <span className={`badge badge-${asm.status}`}>{asm.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Action Panel */}
        {selectedAsm ? (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {selectedAsm.title}
                  </h2>
                  <span className={`badge badge-${selectedAsm.status}`}>{selectedAsm.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Class: <strong>{selectedAsm.className}</strong> • Subject: <strong>{selectedAsm.subjectName}</strong> • Max Score: <strong>{selectedAsm.maxScore}</strong>
                </div>
              </div>

              {/* Action Buttons based on Role & State Machine (§11.2) */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onViewReport && onViewReport(selectedAsm)}
                  style={{
                    padding: '0.55rem 1rem',
                    backgroundColor: '#eef2ff',
                    color: '#4338ca',
                    borderRadius: '8px',
                    border: '1.5px solid #c7d2fe',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Award size={16} /> View Assessment Report
                </button>
                {currentRole === 'HEAD_TEACHER' && (selectedAsm.status === 'submitted' || selectedAsm.status === 'under_review') && (
                  <>
                    <button
                      onClick={handleApprove}
                      style={{
                        padding: '0.55rem 1rem',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <CheckCircle size={16} /> Approve Results
                    </button>
                    <button
                      onClick={handleReturn}
                      style={{
                        padding: '0.55rem 1rem',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <XCircle size={16} /> Return to Draft
                    </button>
                  </>
                )}

                {currentRole === 'HEAD_TEACHER' && selectedAsm.status === 'approved' && (
                  <button
                    onClick={handlePublish}
                    style={{
                      padding: '0.55rem 1.25rem',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Globe size={16} /> Publish to Portals
                  </button>
                )}

                {selectedAsm.status === 'published' && (
                  <button
                    onClick={() => setShowCorrectionModal(true)}
                    style={{
                      padding: '0.55rem 1rem',
                      backgroundColor: '#f1f5f9',
                      color: '#be123c',
                      borderRadius: '8px',
                      border: '1px solid #fecdd3',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <AlertTriangle size={16} /> Request Result Correction
                  </button>
                )}
              </div>
            </div>

            {/* If return reason is required */}
            {currentRole === 'HEAD_TEACHER' && (selectedAsm.status === 'submitted' || selectedAsm.status === 'under_review') && (
              <div style={{ display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                <input 
                  type="text" 
                  value={returnReason} 
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Feedback/Reason note if returning to teacher (required by §11.2)..."
                  style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>
            )}

            {/* Roster Preview for Reviewer */}
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#475569' }}>Student</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#475569' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#475569' }}>Score</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#475569' }}>Version</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, i) => {
                    const scr = currentScores.find(s => s.studentId === st.id);
                    return (
                      <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                          {st.firstName} {st.lastName} ({st.studentNumber})
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge ${scr?.scoreStatus === 'scored' ? 'badge-published' : 'badge-cancelled'}`}>
                            {scr ? scr.scoreStatus : 'PENDING'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {scr?.scoreValue !== null && scr?.scoreValue !== undefined ? `${scr.scoreValue} / ${selectedAsm.maxScore}` : 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-500)' }}>
                          v{scr?.version || 1}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Post-Publication Corrections Log for this Assessment */}
            {corrections.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={16} color="#e11d48" /> Immutable Result Correction History (§11.2 & §12)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {corrections.map(cor => (
                    <div key={cor.id} style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{cor.studentName}</span>
                        <span className={`badge ${cor.status === 'approved' ? 'badge-published' : 'badge-review'}`}>{cor.status}</span>
                      </div>
                      <div style={{ color: 'var(--slate-600)', marginBottom: '0.35rem' }}>
                        Old Score: <strong>{cor.oldScoreValue}</strong> &rarr; Proposed Score: <strong>{cor.proposedScoreValue}</strong>
                      </div>
                      <div style={{ color: 'var(--slate-500)', fontStyle: 'italic', marginBottom: '0.35rem' }}>
                        Reason: "{cor.reason}"
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-400)', fontSize: '0.7rem' }}>
                        <span>Requested by: {cor.requestedBy}</span>
                        {cor.approvedBy && <span>Approved by: {cor.approvedBy}</span>}
                      </div>

                      {/* Head Teacher Dual-Control Action on Pending Corrections */}
                      {cor.status === 'pending' && currentRole === 'HEAD_TEACHER' && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => onApproveCorrection(cor.id, true)}
                            style={{ padding: '0.35rem 0.65rem', backgroundColor: '#16a34a', color: '#ffffff', borderRadius: '4px', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Approve Correction
                          </button>
                          <button
                            onClick={() => onApproveCorrection(cor.id, false)}
                            style={{ padding: '0.35rem 0.65rem', backgroundColor: '#dc2626', color: '#ffffff', borderRadius: '4px', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Reject Correction
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            Select an assessment from the queue to review.
          </div>
        )}
      </div>

      {/* Modal for Correction Request */}
      {showCorrectionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', backgroundColor: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Request Post-Publication Result Correction
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
              Published results are immutable (§1.4). Corrections generate version increments and require dual-control authorization.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.3rem' }}>Select Student</label>
                <select
                  value={correctionForm.studentId}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, studentId: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(st => (
                    <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.studentNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.3rem' }}>New Proposed Score</label>
                <input
                  type="number"
                  step="0.5"
                  value={correctionForm.proposedScore}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, proposedScore: e.target.value })}
                  placeholder="e.g. 19.5"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.3rem' }}>Detailed Audit Justification (Min 10 characters)</label>
                <textarea
                  rows="3"
                  value={correctionForm.reason}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  placeholder="Explain reason for discrepancy and cite answer script evidence..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                ></textarea>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowCorrectionModal(false)}
                style={{ padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={submitCorrection}
                style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
