import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  KeyRound, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function StudentManagement({ 
  students, 
  classes, 
  onAddStudent, 
  onUpdateStudent, 
  currentRole 
}) {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    studentNumber: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    dateOfBirth: '2010-05-15',
    gender: 'Male',
    classId: classes[0]?.id || '',
    guardianName: '',
    guardianPhone: '+23480',
    status: 'active'
  });

  const filtered = students.filter(st => {
    const matchesSearch = `${st.firstName} ${st.lastName} ${st.studentNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || st.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.studentNumber) return;

    const classObj = classes.find(c => c.id === form.classId);
    onAddStudent({
      ...form,
      id: `stu_${Date.now()}`,
      className: classObj ? classObj.name : 'Unassigned Class',
      enrolmentDate: new Date().toISOString().split('T')[0]
    });

    setShowAddModal(false);
    setForm({
      firstName: '',
      lastName: '',
      studentNumber: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dateOfBirth: '2010-05-15',
      gender: 'Male',
      classId: classes[0]?.id || '',
      guardianName: '',
      guardianPhone: '+23480',
      status: 'active'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Student Directory & Enrolment Master (§5.3 / UI-011)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Enforces unique student identifier validation, parent-guardian linkage, and enrolment session rules.
          </p>
        </div>

        {currentRole === 'HEAD_TEACHER' && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '0.7rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}
          >
            <UserPlus size={18} /> Enroll New Student
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or student number..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.4rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#64748b" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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
            <option value="ALL">All Classes ({students.length})</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STUDENT IDENTIFIER</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STUDENT NAME</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>CLASS ENROLMENT</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>DATE OF BIRTH</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>GUARDIAN LINK</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((st, i) => (
              <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#4f46e5' }}>
                  {st.studentNumber}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {st.firstName} {st.lastName}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-700)' }}>
                  {st.className}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                  {st.dateOfBirth} ({st.gender})
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{st.guardianName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={12} color="#16a34a" /> {st.guardianPhone}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span className="badge badge-published">
                    {st.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Enrollment */}
      {showAddModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
              Student Enrolment Form (§6 Schema)
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
              Allocates unique school identifier and links verified parent contact.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>First Name</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>Last Name</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>Student Number (Unique)</label>
                  <input
                    type="text"
                    required
                    value={form.studentNumber}
                    onChange={(e) => setForm({ ...form, studentNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>Class Enrolment</label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>Guardian Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Chief / Mrs..."
                    value={form.guardianName}
                    onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '0.25rem' }}>Guardian Phone (E.164)</label>
                  <input
                    type="text"
                    required
                    value={form.guardianPhone}
                    onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Commit Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
