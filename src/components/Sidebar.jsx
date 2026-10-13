import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  FileCheck2, 
  Clock, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Menu,
  KeyRound,
  FileSpreadsheet,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  FileText,
  Award,
  Database
} from 'lucide-react';
import SupabaseStatusModal from './SupabaseStatusModal';

export default function Sidebar({ currentRole, setRole, activeTab, setActiveTab, currentUser, onLogout }) {
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  // Navigation permissions strictly tailored to Section 7 & Section 9
  const navItems = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: Building2,
      roles: ['HEAD_TEACHER', 'TEACHER', 'STUDENT', 'PARENT']
    },
    {
      id: 'students',
      label: 'Student Directory',
      icon: GraduationCap,
      roles: ['HEAD_TEACHER', 'TEACHER']
    },
    {
      id: 'staff',
      label: 'Staff & Assignments',
      icon: UserCheck,
      roles: ['HEAD_TEACHER']
    },
    {
      id: 'academics',
      label: 'Classes & Subjects',
      icon: BookOpen,
      roles: ['HEAD_TEACHER']
    },
    {
      id: 'assessments',
      label: 'Continuous Assessment',
      icon: FileSpreadsheet,
      roles: ['HEAD_TEACHER', 'TEACHER']
    },
    {
      id: 'results_workflow',
      label: 'Result Approval Engine',
      icon: FileCheck2,
      roles: ['HEAD_TEACHER', 'TEACHER']
    },
    {
      id: 'assessment_reports',
      label: 'Assessment Reports',
      icon: Award,
      roles: ['HEAD_TEACHER', 'TEACHER']
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      icon: Clock,
      roles: ['HEAD_TEACHER', 'TEACHER']
    },
    {
      id: 'my_results',
      label: 'Academic Report Card',
      icon: FileText,
      roles: ['STUDENT', 'PARENT']
    },
    {
      id: 'my_attendance',
      label: 'Attendance Record',
      icon: Clock,
      roles: ['STUDENT', 'PARENT']
    },
    {
      id: 'timetable',
      label: 'Weekly Timetable',
      icon: Calendar,
      roles: ['HEAD_TEACHER', 'TEACHER', 'STUDENT', 'PARENT']
    },
    {
      id: 'announcements',
      label: 'Notices & Bulletin',
      icon: Bell,
      roles: ['HEAD_TEACHER', 'TEACHER', 'STUDENT', 'PARENT']
    },
    {
      id: 'import_wizard',
      label: 'Bulk CSV Importer',
      icon: UploadCloud,
      roles: ['HEAD_TEACHER']
    },
    {
      id: 'audit_logs',
      label: 'Security & Audit Trail',
      icon: ShieldCheck,
      roles: ['HEAD_TEACHER']
    }
  ];

  const visibleNav = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'var(--sidebar-bg)',
      color: '#cbd5e1',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      zIndex: 40
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #4338ca)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
        }}>
          <Building2 size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            ESAMS <span style={{ fontSize: '0.65rem', background: '#312e81', color: '#a5b4fc', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #4338ca' }}>v1.0</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
            Apex Crest Academy
          </div>
        </div>
      </div>

      {/* Supabase Connection Status Card */}
      <div 
        onClick={() => setSupabaseModalOpen(true)}
        title="Click to view Supabase Connection & Schema Migration"
        style={{
          margin: '0.85rem 1rem 0.25rem',
          padding: '0.55rem 0.75rem',
          backgroundColor: '#0f172a',
          border: '1px solid #0284c7',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0f172a'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: 'rgba(2, 132, 199, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Database size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Supabase Live
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#10b981', 
                display: 'inline-block',
                boxShadow: '0 0 6px #10b981'
              }}></span>
            </div>
            <div style={{ fontSize: '0.64rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              npjmcwjpfuxh...
            </div>
          </div>
        </div>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          padding: '0.2rem 0.45rem',
          borderRadius: '4px'
        }}>
          Connected
        </span>
      </div>

      {/* Role Switcher Sandbox (Strict RBAC demonstrator) */}
      <div style={{
        margin: '1rem',
        padding: '0.85rem',
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        border: '1px solid #334155'
      }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>RBAC Persona Switcher</span>
          <span style={{ color: '#10b981' }}>Live Demo</span>
        </div>
        <select 
          value={currentRole} 
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #475569',
            borderRadius: '6px',
            padding: '0.45rem 0.6rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="HEAD_TEACHER">👑 Head Teacher (Full Oversight)</option>
          <option value="TEACHER">👩‍🏫 Teacher (Class/Subject Scoped)</option>
          <option value="STUDENT">🎓 Student (Read-Only Self)</option>
          <option value="PARENT">👨‍👩‍👧 Parent (Linked Child Only)</option>
        </select>
        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.4rem' }}>
          Simulates Blueprint §7 RBAC authorization context.
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', padding: '0.5rem 0.5rem 0.25rem' }}>
          School Modules
        </div>
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#4f46e5' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#1e293b';
                if (!isActive) e.currentTarget.style.color = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                if (!isActive) e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} style={{ color: isActive ? '#ffffff' : '#818cf8' }} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </div>

      {/* User Session Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #1e293b',
        backgroundColor: '#0b1120'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#3730a3',
              color: '#c7d2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {currentUser.displayName.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.displayName}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                {currentUser.roleName.split(' ')[0]}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out Session"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f43f5e'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <SupabaseStatusModal 
        isOpen={supabaseModalOpen} 
        onClose={() => setSupabaseModalOpen(false)} 
      />
    </aside>
  );
}
