import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Filter 
} from 'lucide-react';

export default function TimetableView({ timetable, currentRole }) {
  const [selectedDay, setSelectedDay] = useState('ALL');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSlots = timetable.filter(t => selectedDay === 'ALL' || t.day === selectedDay);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={26} color="#4f46e5" /> Academic Timetable & Scheduling Grid (UI-021)
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Conflict-free period allocation for classes, laboratories, and instructors (§5.3 / UI-021).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            onClick={() => setSelectedDay('ALL')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedDay === 'ALL' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            All Days
          </button>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedDay === d ? '#ffffff' : 'transparent',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredSlots.map((slot, i) => (
          <div 
            key={i} 
            className="glass-panel" 
            style={{ 
              padding: '1.25rem', 
              borderLeft: '4px solid #4f46e5',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>
                {slot.day}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> {slot.period}
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {slot.subject}
            </h3>

            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div>Class: <strong>{slot.class}</strong></div>
              <div>Instructor: <strong>{slot.teacher}</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#15803d' }}>
                <MapPin size={12} /> Room: <strong>{slot.room}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
