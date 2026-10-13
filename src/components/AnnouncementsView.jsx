import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  PlusCircle, 
  AlertCircle, 
  Clock, 
  Users 
} from 'lucide-react';

export default function AnnouncementsView({ announcements, currentRole, onAddAnnouncement }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    audience: 'All Staff & Parents',
    priority: 'normal'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    onAddAnnouncement({
      id: `anc_${Date.now()}`,
      title: form.title,
      body: form.body,
      audience: form.audience,
      priority: form.priority,
      publishedAt: new Date().toISOString(),
      author: currentRole === 'HEAD_TEACHER' ? 'Dr. Babatunde Adeleke, Head Teacher' : 'Faculty Secretariat'
    });
    setShowModal(false);
    setForm({ title: '', body: '', audience: 'All Staff & Parents', priority: 'normal' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={26} color="#4f46e5" /> School Notices & Administrative Bulletin (UI-022)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Targeted announcements with server-side audience resolution (§10.4 & §11).
          </p>
        </div>

        {currentRole === 'HEAD_TEACHER' && (
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
            <PlusCircle size={18} /> Compose Bulletin
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements.map(anc => (
          <div 
            key={anc.id} 
            className="glass-panel" 
            style={{ 
              padding: '1.5rem', 
              borderLeft: `4px solid ${anc.priority === 'high' ? '#e11d48' : '#4f46e5'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {anc.title}
                </h3>
                {anc.priority === 'high' && (
                  <span className="badge badge-correction">High Priority</span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={12} /> {new Date(anc.publishedAt).toLocaleDateString()}
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: '1.6' }}>
              {anc.body}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              <div>Author: <strong>{anc.author}</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Users size={12} /> Audience: <strong>{anc.audience}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              Publish School Announcement
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Target Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="All Staff & Parents">All Staff & Parents</option>
                  <option value="Parents & Students">Parents & Students</option>
                  <option value="Teaching Staff Only">Teaching Staff Only</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority (Urgent Broadcast)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Message Body</label>
                <textarea
                  rows="4"
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#ffffff', fontWeight: 700 }}>Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
