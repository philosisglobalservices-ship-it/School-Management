import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Layers, 
  Terminal, 
  ShieldCheck 
} from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, testSupabaseConnection } from '../supabaseClient';

export default function SupabaseStatusModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'sql' | 'guide'

  const checkStatus = async () => {
    setLoading(true);
    const res = await testSupabaseConnection();
    setHealth(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copySQL = () => {
    fetch('./supabase_schema.sql')
      .then(r => r.text())
      .catch(() => '')
      .then(text => {
        const sqlText = text || `-- Run this in Supabase SQL Editor\n-- Project: ${SUPABASE_URL}\n-- See supabase_schema.sql in project root`;
        navigator.clipboard.writeText(sqlText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
  };

  const tables = [
    { name: 'audit_logs', label: 'Security & Audit Logs', critical: true },
    { name: 'schools', label: 'School Profiles', critical: true },
    { name: 'classes', label: 'Academic Classes & Streams', critical: true },
    { name: 'subjects', label: 'Curriculum & Subjects', critical: true },
    { name: 'students', label: 'Student Directory', critical: true },
    { name: 'staff', label: 'Staff & Teacher Assignments', critical: true },
    { name: 'assessments', label: 'Continuous Assessment Tests', critical: true },
    { name: 'scores', label: 'Student Grade & Score Registry', critical: true },
    { name: 'attendance_records', label: 'Class Attendance Registers', critical: false },
    { name: 'announcements', label: 'School Notices & Bulletins', critical: false }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, #0f172a, #1e293b)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)'
            }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Supabase Live Database
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: health?.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: health?.ok ? '#34d399' : '#f87171',
                  border: `1px solid ${health?.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  fontWeight: 600
                }}>
                  {health?.ok ? 'ONLINE & CONNECTED' : 'CHECKING...'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                PostgreSQL Engine · Nigerian School Architecture
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #334155',
          backgroundColor: '#0f172a',
          padding: '0 1.75rem'
        }}>
          {[
            { id: 'status', label: 'Connection & Tables', icon: Layers },
            { id: 'sql', label: 'SQL Schema & Migration', icon: Terminal },
            { id: 'guide', label: 'Setup Guide', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid #38bdf8' : '2px solid transparent',
                  color: active ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Endpoint Credentials Card */}
              <div style={{
                backgroundColor: '#0f172a',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #334155'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                  Supabase Project Credentials
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Project URL:</span>
                    <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600 }}>{SUPABASE_URL}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Publishable Key:</span>
                    <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>
                      {SUPABASE_ANON_KEY.substring(0, 22)}...{SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 8)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingTop: '0.35rem', borderTop: '1px solid #1e293b' }}>
                    <span style={{ color: '#64748b' }}>Ping Latency:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>
                      {health?.latency ? `${health.latency} ms` : 'Measuring...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Sync Status */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                    Database Tables Status
                  </div>
                  <button
                    onClick={checkStatus}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.65rem',
                      backgroundColor: '#334155',
                      color: '#f8fafc',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Testing...' : 'Refresh Status'}
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.6rem'
                }}>
                  {tables.map(tbl => {
                    const isAvailable = health?.tableStatus?.[tbl.name];
                    return (
                      <div
                        key={tbl.name}
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: `1px solid ${isAvailable ? '#065f46' : '#334155'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                            {tbl.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                            public.{tbl.name}
                          </div>
                        </div>
                        <div>
                          {isAvailable ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.7rem',
                              color: '#34d399',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}>
                              <CheckCircle2 size={12} /> Live DB
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.7rem',
                              color: '#fbbf24',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}>
                              Local Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#7dd3fc',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem'
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#38bdf8' }} />
                <div>
                  A complete schema and seed migration file is generated at <code>supabase_schema.sql</code> in the project root.
                  Execute it once in your Supabase SQL Editor to initialize all tables with RLS policies and baseline academic data.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  supabase_schema.sql (Ready to execute)
                </span>
                <button
                  onClick={copySQL}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    backgroundColor: copied ? '#10b981' : '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Entire SQL Script'}
                </button>
              </div>

              <pre style={{
                backgroundColor: '#0f172a',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '0.78rem',
                fontFamily: 'Consolas, monospace',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
{`-- Preview of supabase_schema.sql:
CREATE TABLE IF NOT EXISTS schools (...);
CREATE TABLE IF NOT EXISTS classes (...);
CREATE TABLE IF NOT EXISTS subjects (...);
CREATE TABLE IF NOT EXISTS students (...);
CREATE TABLE IF NOT EXISTS staff (...);
CREATE TABLE IF NOT EXISTS assessments (...);
CREATE TABLE IF NOT EXISTS scores (...);
CREATE TABLE IF NOT EXISTS attendance_records (...);
CREATE TABLE IF NOT EXISTS announcements (...);
CREATE TABLE IF NOT EXISTS audit_logs (...);

-- RLS Public Policies & Seeds included!`}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Follow these 3 easy steps to complete the one-time database table setup in Supabase:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  backgroundColor: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  display: 'flex',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>1</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                      Open Supabase SQL Editor
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      Navigate to your project dashboard:
                    </div>
                    <a
                      href="https://supabase.com/dashboard/project/npjmcwjpfuxhcyvczitx/sql"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginTop: '0.4rem',
                        color: '#38bdf8',
                        fontSize: '0.82rem',
                        textDecoration: 'none'
                      }}
                    >
                      Open Supabase SQL Editor <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  display: 'flex',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>2</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                      Paste and Run supabase_schema.sql
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      Click "New Query", paste the contents of <code>supabase_schema.sql</code>, and click <strong>Run</strong>.
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  display: 'flex',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>3</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                      Automatic Real-Time Sync
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      The School Management system is already connected and will instantly sync students, scores, assessments, and attendance records straight to Postgres!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #334155',
          backgroundColor: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Supabase Project ID: <code style={{ color: '#94a3b8' }}>npjmcwjpfuxhcyvczitx</code>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: '#334155',
              color: '#f8fafc',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
