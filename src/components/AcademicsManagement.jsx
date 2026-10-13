import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  BookOpen, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  UserCheck 
} from 'lucide-react';

export default function AcademicsManagement({ classes, subjects, onAddClass, onAddSubject }) {
  const [activeSubTab, setActiveSubTab] = useState('classes');
  const [showModal, setShowModal] = useState(false);

  // New Class Form
  const [newClass, setNewClass] = useState({ name: '', level: 'Senior Secondary', stream: 'Science' });
  // New Subject Form
  const [newSubject, setNewSubject] = useState({ code: '', name: '' });

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClass.name) return;
    onAddClass({
      id: `cls_${Date.now()}`,
      name: newClass.name,
      level: newClass.level,
      stream: newClass.stream,
      status: 'active',
      studentCount: 0
    });
    setNewClass({ name: '', level: 'Senior Secondary', stream: 'Science' });
    setShowModal(false);
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.code) return;
    onAddSubject({
      id: `sub_${Date.now()}`,
      code: newSubject.code.toUpperCase(),
      name: newSubject.name,
      status: 'active'
    });
    setNewSubject({ code: '', name: '' });
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Curriculum, Classes & Academic Structure (UI-013, UI-014)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Manage academic sessions, class streams, subject offerings, and term scheduling (§5.3).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={18} /> Add {activeSubTab === 'classes' ? 'Class Stream' : 'Subject'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('classes')}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeSubTab === 'classes' ? '#4f46e5' : '#f1f5f9',
            color: activeSubTab === 'classes' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          Active Classes & Streams ({classes.length})
        </button>
        <button
          onClick={() => setActiveSubTab('subjects')}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeSubTab === 'subjects' ? '#4f46e5' : '#f1f5f9',
            color: activeSubTab === 'subjects' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          Subject Catalog ({subjects.length})
        </button>
      </div>

      {activeSubTab === 'classes' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {classes.map(cls => (
            <div key={cls.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {cls.name}
                </h3>
                <span className="badge badge-published">{cls.status}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                Level: <strong>{cls.level}</strong> • Stream: <strong>{cls.stream}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                Enrolled Capacity: {cls.studentCount || 28} Students
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {subjects.map(sub => (
            <div key={sub.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5', fontSize: '0.85rem' }}>
                  {sub.code}
                </span>
                <span className="badge badge-published">{sub.status}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                {sub.name}
              </h3>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              Add {activeSubTab === 'classes' ? 'Class Stream' : 'Subject'}
            </h3>

            {activeSubTab === 'classes' ? (
              <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Class Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SS 3 - Emerald Stream"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Academic Level</label>
                  <input
                    type="text"
                    required
                    value={newClass.level}
                    onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Curriculum Stream</label>
                  <input
                    type="text"
                    required
                    value={newClass.stream}
                    onChange={(e) => setNewClass({ ...newClass, stream: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#ffffff', fontWeight: 700 }}>Save Class</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GEO-101"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physical & Human Geography"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#ffffff', fontWeight: 700 }}>Save Subject</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
