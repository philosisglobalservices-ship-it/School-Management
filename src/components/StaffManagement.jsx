import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  PlusCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function StaffManagement({ staff, classes, subjects, onAddStaffAssignment }) {
  const [selectedStaff, setSelectedStaff] = useState(staff[0]);
  const [assignmentForm, setAssignmentForm] = useState({
    classId: classes[0]?.id || '',
    subjectId: subjects[0]?.id || ''
  });
  const [message, setMessage] = useState(null);

  const handleAssign = (e) => {
    e.preventDefault();
    onAddStaffAssignment(selectedStaff.id, assignmentForm.classId, assignmentForm.subjectId);
    setMessage({ type: 'success', text: `Assigned new class & subject to ${selectedStaff.firstName} ${selectedStaff.lastName}. ABAC permissions updated.` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Staff & Teacher Assignment Matrix (UI-012)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Controls RBAC teacher deployment and ABAC class/subject resource-level scoping (§2.1 & §5.3).
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '0.85rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', fontWeight: 600 }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
        {/* Staff List */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', textTransform: 'uppercase', padding: '0.4rem' }}>
            Faculty Members ({staff.length})
          </h3>
          {staff.map(st => {
            const isSel = selectedStaff.id === st.id;
            return (
              <div
                key={st.id}
                onClick={() => setSelectedStaff(st)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  backgroundColor: isSel ? '#eef2ff' : '#f8fafc',
                  border: isSel ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                  {st.firstName} {st.lastName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                  {st.role} • {st.employeeNumber}
                </div>
              </div>
            );
          })}
        </div>

        {/* Staff Details & Assignment Engine */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {selectedStaff.firstName} {selectedStaff.lastName}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.25rem', display: 'flex', gap: '1.25rem' }}>
              <span>Email: <strong>{selectedStaff.email}</strong></span>
              <span>Phone: <strong>{selectedStaff.phone}</strong></span>
              <span>Status: <strong style={{ color: '#16a34a' }}>{selectedStaff.employmentStatus.toUpperCase()}</strong></span>
            </div>
          </div>

          {/* Current Active Scope */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
              Active Teaching Assignments (ABAC Scope)
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedStaff.assignedClasses.length > 0 ? (
                selectedStaff.assignedClasses.map(cId => {
                  const cObj = classes.find(c => c.id === cId);
                  return (
                    <span key={cId} style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                      Class: {cObj?.name || cId}
                    </span>
                  );
                })
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>No class assignments (Administrative oversight role)</span>
              )}
            </div>
          </div>

          {/* Form to Assign Class/Subject */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
              Grant New Class / Subject Teaching Assignment
            </h4>
            <form onSubmit={handleAssign} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Assign Class</label>
                <select
                  value={assignmentForm.classId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, classId: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Assign Subject</label>
                <select
                  value={assignmentForm.subjectId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectId: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.55rem 1rem',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Assign Scope
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
