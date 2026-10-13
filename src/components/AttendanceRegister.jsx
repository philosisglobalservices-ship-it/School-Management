import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Save, 
  Filter,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function AttendanceRegister({ 
  attendance, 
  students, 
  classes, 
  currentRole, 
  onSaveAttendance 
}) {
  const [selectedClass, setSelectedClass] = useState(classes[1]?.id || classes[0]?.id);
  const [selectedDate, setSelectedDate] = useState('2026-10-12');
  
  // Find or initialize today's attendance record
  const currentRecord = attendance.find(a => a.date === selectedDate && a.classId === selectedClass);
  
  const [rosterStatus, setRosterStatus] = useState(() => {
    const map = {};
    students.forEach(st => {
      const match = currentRecord?.records.find(r => r.studentId === st.id);
      map[st.id] = match ? match.status : 'present';
    });
    return map;
  });

  const [message, setMessage] = useState(null);

  const handleStatusToggle = (studentId, status) => {
    setRosterStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    const recordPayload = {
      id: currentRecord ? currentRecord.id : `att_${Date.now()}`,
      date: selectedDate,
      classId: selectedClass,
      recordedBy: currentRole === 'HEAD_TEACHER' ? 'Dr. Babatunde Adeleke' : 'Mrs. Ngozi Okonjo',
      finalizedAt: new Date().toISOString(),
      records: students.map(st => ({
        studentId: st.id,
        status: rosterStatus[st.id] || 'present',
        time: rosterStatus[st.id] === 'present' ? '07:50 AM' : null
      }))
    };

    onSaveAttendance(recordPayload);
    setMessage({ type: 'success', text: `Attendance for ${selectedDate} finalized and audited successfully!` });
  };

  const presentCount = Object.values(rosterStatus).filter(s => s === 'present').length;
  const lateCount = Object.values(rosterStatus).filter(s => s === 'late').length;
  const absentCount = Object.values(rosterStatus).filter(s => s === 'absent').length;
  const excusedCount = Object.values(rosterStatus).filter(s => s === 'excused').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Daily Student Attendance Register (UI-020)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Strict single-entry-per-day constraint (§6 unique constraint), instant parent notification linkage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--slate-800)'
            }}
          />

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--slate-800)'
            }}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Save size={16} /> Finalize Register
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          fontSize: '0.85rem',
          fontWeight: 600,
          border: '1px solid #bbf7d0'
        }}>
          {message.text}
        </div>
      )}

      {/* Attendance Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Present</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{presentCount}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Late</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{lateCount}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Absent</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{absentCount}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Excused</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>{excusedCount}</div>
        </div>
      </div>

      {/* Roster Roll Call Grid */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STUDENT NO</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>STUDENT NAME</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700 }}>VERIFIED GUARDIAN</th>
              <th style={{ padding: '0.9rem 1.25rem', color: '#475569', fontWeight: 700, textAlign: 'center' }}>RECORD STATUS</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st, i) => {
              const currentStatus = rosterStatus[st.id] || 'present';
              return (
                <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--slate-600)' }}>
                    {st.studentNumber}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {st.firstName} {st.lastName}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                    {st.guardianName} ({st.guardianPhone})
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', backgroundColor: '#f1f5f9', padding: '0.3rem', borderRadius: '8px' }}>
                      {['present', 'late', 'absent', 'excused'].map(opt => {
                        const isSelected = currentStatus === opt;
                        const colors = {
                          present: { bg: '#10b981', text: '#ffffff' },
                          late: { bg: '#f59e0b', text: '#ffffff' },
                          absent: { bg: '#ef4444', text: '#ffffff' },
                          excused: { bg: '#6366f1', text: '#ffffff' }
                        };
                        return (
                          <button
                            key={opt}
                            onClick={() => handleStatusToggle(st.id, opt)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: isSelected ? colors[opt].bg : 'transparent',
                              color: isSelected ? colors[opt].text : 'var(--slate-600)',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
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
