import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('headteacher@apexcrest.edu.ng');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' | 'mfa'
  const [error, setError] = useState(null);

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter a valid school email identifier');
      return;
    }

    // If head teacher, simulate MFA challenge required by §4.1 (FR-IAM-04)
    if (identifier.includes('headteacher')) {
      setStep('mfa');
      setError(null);
    } else if (identifier.includes('teacher')) {
      onLoginSuccess('TEACHER');
    } else if (identifier.includes('student')) {
      onLoginSuccess('STUDENT');
    } else if (identifier.includes('parent')) {
      onLoginSuccess('PARENT');
    } else {
      onLoginSuccess('HEAD_TEACHER');
    }
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 6) {
      setError('Please enter the 6-digit TOTP code sent to your authenticator app');
      return;
    }
    onLoginSuccess('HEAD_TEACHER');
  };

  const quickSwitch = (roleEmail, roleKey) => {
    setIdentifier(roleEmail);
    if (roleKey === 'HEAD_TEACHER') {
      setStep('mfa');
    } else {
      setStep('credentials');
      onLoginSuccess(roleKey);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      background: 'radial-gradient(ellipse at 50% 20%, #1e1b4b 0%, #0f172a 100%)',
      padding: '1.5rem',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #334155',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        color: '#f8fafc'
      }}>
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #4338ca)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            marginBottom: '1rem'
          }}>
            <Building2 size={30} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            ESAMS Enterprise Gateway
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            Apex Crest International Academy • Enterprise Portal (UI-001)
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                School Email / Identifier
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@apexcrest.edu.ng"
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                Master Credential / Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
              }}
            >
              Authenticate Session <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          /* MFA Challenge Step (§4.1 FR-IAM-04 / UI-003) */
          <form onSubmit={handleMfaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', marginBottom: '0.5rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>MFA Step-Up Challenge (UI-003)</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Enter the 6-digit authenticator passkey for {identifier}
              </p>
            </div>

            <div>
              <input
                type="text"
                autoFocus
                maxLength="6"
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1.4rem',
                  letterSpacing: '0.5em',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: '#0f172a',
                  border: '1px solid #4f46e5',
                  borderRadius: '10px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.75rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Verify & Enter School System
            </button>
          </form>
        )}

        {/* Quick Demo Persona Shortcuts */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'center', marginBottom: '0.75rem' }}>
            Fast Persona Quick-Launch (1-Click)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => quickSwitch('headteacher@apexcrest.edu.ng', 'HEAD_TEACHER')}
              style={{ padding: '0.45rem', backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              👑 Head Teacher
            </button>
            <button
              type="button"
              onClick={() => quickSwitch('teacher@apexcrest.edu.ng', 'TEACHER')}
              style={{ padding: '0.45rem', backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              👩‍🏫 Subject Teacher
            </button>
            <button
              type="button"
              onClick={() => quickSwitch('student@apexcrest.edu.ng', 'STUDENT')}
              style={{ padding: '0.45rem', backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              🎓 Student Portal
            </button>
            <button
              type="button"
              onClick={() => quickSwitch('parent@apexcrest.edu.ng', 'PARENT')}
              style={{ padding: '0.45rem', backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              👨‍👩‍👧 Parent Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
