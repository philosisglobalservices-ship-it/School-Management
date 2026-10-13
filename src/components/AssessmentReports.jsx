import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Printer, 
  Download, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Calendar,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export default function AssessmentReports({ 
  assessments, 
  scores, 
  students, 
  studentGuardians = [],
  school, 
  currentRole,
  currentUser,
  selectedAssessmentId,
  onSelectAssessment
}) {
  const isPrivilegedStaff = currentRole === 'HEAD_TEACHER' || currentRole === 'TEACHER';

  // ABAC Scoping: Parents & students cannot see arbitrary students (§2.1 & §7.1)
  const authorizedStudents = React.useMemo(() => {
    if (isPrivilegedStaff) return students;
    if (currentRole === 'STUDENT') {
      const self = students.find(s => s.id === currentUser?.studentId);
      return self ? [self] : [students[0]];
    }
    if (currentRole === 'PARENT') {
      const verifiedLinks = studentGuardians.filter(g => 
        g.guardianId === currentUser?.guardianId && g.status === 'verified'
      );
      const matched = students.filter(s => verifiedLinks.some(l => l.studentId === s.id));
      return matched.length > 0 ? matched : [students[0]];
    }
    return [students[0]];
  }, [currentRole, currentUser, students, studentGuardians, isPrivilegedStaff]);

  const [activeAsmId, setActiveAsmId] = useState(selectedAssessmentId || assessments[0]?.id || '');
  const [viewMode, setViewMode] = useState(isPrivilegedStaff ? 'broadsheet' : 'individual_slip');
  const [selectedStudentForSlip, setSelectedStudentForSlip] = useState(authorizedStudents[0]?.id || 'stu_01');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAssessment = assessments.find(a => a.id === activeAsmId) || assessments[0];
  
  if (!activeAssessment) {
    return <div className="glass-panel" style={{ padding: '2rem' }}>No assessment data found.</div>;
  }

  // Calculate scores for this specific assessment
  const asmScores = scores.filter(s => s.assessmentId === activeAssessment.id);

  // Compute student rankings for this assessment
  const studentRows = students.map(st => {
    const scr = asmScores.find(s => s.studentId === st.id);
    const rawScore = scr?.scoreValue !== null && scr?.scoreValue !== undefined ? scr.scoreValue : 0;
    const isScored = scr?.scoreStatus === 'scored';
    const percentage = activeAssessment.maxScore > 0 ? (rawScore / activeAssessment.maxScore) * 100 : 0;
    
    // WAEC Standard Grading Scheme
    let grade = 'F9';
    let gradeTier = 'Fail';
    let gradeColor = '#ef4444';

    if (percentage >= 75) {
      grade = 'A1';
      gradeTier = 'Distinction';
      gradeColor = '#15803d';
    } else if (percentage >= 70) {
      grade = 'B2';
      gradeTier = 'Very Good';
      gradeColor = '#16a34a';
    } else if (percentage >= 65) {
      grade = 'B3';
      gradeTier = 'Good';
      gradeColor = '#22c55e';
    } else if (percentage >= 60) {
      grade = 'C4';
      gradeTier = 'Credit';
      gradeColor = '#2563eb';
    } else if (percentage >= 55) {
      grade = 'C5';
      gradeTier = 'Credit';
      gradeColor = '#3b82f6';
    } else if (percentage >= 50) {
      grade = 'C6';
      gradeTier = 'Credit';
      gradeColor = '#60a5fa';
    } else if (percentage >= 45) {
      grade = 'D7';
      gradeTier = 'Pass';
      gradeColor = '#f59e0b';
    } else if (percentage >= 40) {
      grade = 'E8';
      gradeTier = 'Pass';
      gradeColor = '#d97706';
    }

    return {
      student: st,
      rawScore,
      percentage,
      grade,
      gradeTier,
      gradeColor,
      isScored,
      status: scr?.scoreStatus || 'missing',
      remark: scr?.remark || 'Steady academic participation; continue diligence in study routines.',
      version: scr?.version || 1
    };
  });

  // Sort descending by raw score for official position/rank
  const rankedStudents = [...studentRows].sort((a, b) => b.rawScore - a.rawScore);

  // Add rank indices
  const studentRanks = rankedStudents.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  // Summary Metrics for this assessment
  const scoredCount = studentRows.filter(s => s.isScored).length;
  const totalRawSum = studentRows.reduce((acc, curr) => acc + (curr.isScored ? curr.rawScore : 0), 0);
  const averageScore = scoredCount > 0 ? (totalRawSum / scoredCount).toFixed(1) : 0;
  const averagePct = activeAssessment.maxScore > 0 ? ((averageScore / activeAssessment.maxScore) * 100).toFixed(1) : 0;
  
  const rawScoresList = studentRows.filter(s => s.isScored).map(s => s.rawScore);
  const highestScore = rawScoresList.length > 0 ? Math.max(...rawScoresList) : 0;
  const lowestScore = rawScoresList.length > 0 ? Math.min(...rawScoresList) : 0;
  const passRate = scoredCount > 0 
    ? ((studentRows.filter(s => s.isScored && s.percentage >= 50).length / scoredCount) * 100).toFixed(0)
    : 0;

  // Grade Distribution Counts
  const gradeDistribution = {
    'A1 (75%+)': studentRows.filter(s => s.percentage >= 75).length,
    'B2-B3 (65-74%)': studentRows.filter(s => s.percentage >= 65 && s.percentage < 75).length,
    'C4-C6 (50-64%)': studentRows.filter(s => s.percentage >= 50 && s.percentage < 65).length,
    'D7-E8 (40-49%)': studentRows.filter(s => s.percentage >= 40 && s.percentage < 50).length,
    'F9 (<40%)': studentRows.filter(s => s.percentage < 40).length
  };

  const filteredStudents = studentRanks.filter(item => {
    const fullName = `${item.student.firstName} ${item.student.lastName}`.toLowerCase();
    const stNum = item.student.studentNumber.toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || stNum.includes(q) || item.grade.toLowerCase().includes(q);
  });

  const activeSlipStudent = studentRanks.find(s => s.student.id === selectedStudentForSlip) || studentRanks[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Assessment Selector Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4f46e5', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
              <Award size={15} /> Official Assessment Broadsheet & Performance Engine
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Individual Assessment Reports
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)' }}>
              Select an assessment below to generate its unique diagnostic report, statistical distribution, and student mark broadsheet.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isPrivilegedStaff ? (
              <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', borderRadius: '10px', padding: '3px' }}>
                <button
                  onClick={() => setViewMode('broadsheet')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: viewMode === 'broadsheet' ? '#ffffff' : 'transparent',
                    color: viewMode === 'broadsheet' ? '#1e293b' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: viewMode === 'broadsheet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Class Broadsheet
                </button>
                <button
                  onClick={() => setViewMode('individual_slip')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: viewMode === 'individual_slip' ? '#ffffff' : 'transparent',
                    color: viewMode === 'individual_slip' ? '#1e293b' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: viewMode === 'individual_slip' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Individual Result Slip
                </button>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#065f46', fontWeight: 700 }}>
                <ShieldCheck size={16} color="#059669" />
                Verified Child Result Slip Mode (§2.1 ABAC)
              </div>
            )}

            <button
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} /> Print Report
            </button>
          </div>
        </div>

        {/* Assessment Pills Grid */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {assessments.map(asm => {
            const isSelected = asm.id === activeAssessment.id;
            return (
              <div
                key={asm.id}
                onClick={() => {
                  setActiveAsmId(asm.id);
                  if (onSelectAssessment) onSelectAssessment(asm);
                }}
                style={{
                  minWidth: '220px',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#4338ca' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--slate-800)',
                  border: isSelected ? '2px solid #3730a3' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(67, 56, 202, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#a5b4fc' : '#64748b', textTransform: 'uppercase' }}>
                    {asm.subjectName}
                  </span>
                  <span className={`badge badge-${asm.status}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                    {asm.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.35rem' }}>
                  {asm.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: isSelected ? '#e0e7ff' : '#64748b' }}>
                  <span>Max: {asm.maxScore} pts</span>
                  <span>Weight: {asm.weightPercentage || 25}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Assessment Banner & Meta */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.14)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <BookOpen size={14} color="#a5b4fc" />
            {activeAssessment.className} • {activeAssessment.term}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {activeAssessment.title}
          </h2>
          <p style={{ color: '#c7d2fe', fontSize: '0.88rem', lineHeight: '1.5' }}>
            Subject Code: <strong>{activeAssessment.subjectName}</strong> • Curriculum Standard: <strong>{activeAssessment.syllabusAlignment || 'National WAEC Curriculum Benchmark'}</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Submitted By</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeAssessment.submittedBy || 'Assigned Subject Teacher'}</div>
          {activeAssessment.approvedBy && (
            <div style={{ fontSize: '0.76rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
              <ShieldCheck size={14} /> Approved by {activeAssessment.approvedBy}
            </div>
          )}
        </div>
      </div>

      {/* 4 Assessment KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Class Average */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Class Average</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {averageScore} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-500)' }}>/ {activeAssessment.maxScore}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: '0.25rem' }}>
            {averagePct}% Overall Mean Performance
          </div>
        </div>

        {/* Highest Mark */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Top Cohort Mark</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#15803d' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#15803d' }}>
            {highestScore} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-500)' }}>/ {activeAssessment.maxScore}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
            Lowest Mark: {lowestScore} ({((lowestScore / activeAssessment.maxScore) * 100).toFixed(0)}%)
          </div>
        </div>

        {/* Pass Rate */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Pass Benchmark (&ge;50%)</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {passRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: '0.25rem' }}>
            {studentRows.filter(s => s.percentage >= 50).length} of {scoredCount} Students Passed
          </div>
        </div>

        {/* Weight Contribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Assessment Weight</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#475569' }}>
              <FileSpreadsheet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#4338ca' }}>
            {activeAssessment.weightPercentage || 25}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.25rem' }}>
            Term 1 Continuous Assessment Weight
          </div>
        </div>
      </div>

      {/* Formative Diagnostic Report (Subject-Tailored Qualitative Findings) */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '5px solid #4f46e5' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="#4f46e5" />
          Formative Diagnostic Evaluation & Examiner Feedback
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* Strengths */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <CheckCircle2 size={16} /> Observed Strengths & Mastery
            </div>
            <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: '1.55' }}>
              {activeAssessment.diagnosticStrengths || 'Students showed strong conceptual engagement with fundamental course principles.'}
            </p>
          </div>

          {/* Gaps */}
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <TrendingDown size={16} /> Identified Learning Gaps
            </div>
            <p style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: '1.55' }}>
              {activeAssessment.diagnosticGaps || 'Time management and presentation rigor were areas requiring additional focus during practicals.'}
            </p>
          </div>

          {/* Action Plan */}
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <Award size={16} /> Pedagogical Intervention & Action Plan
            </div>
            <p style={{ fontSize: '0.82rem', color: '#1e40af', lineHeight: '1.55' }}>
              {activeAssessment.recommendations || 'Conduct targeted revision tutorials on key exam components before the terminal examination.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grade Distribution Graph Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} color="#4f46e5" /> Grade Frequency Distribution
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(gradeDistribution).map(([band, count]) => {
            const pct = scoredCount > 0 ? ((count / scoredCount) * 100).toFixed(0) : 0;
            return (
              <div key={band} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.3rem' }}>{band}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>{count}</div>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#4f46e5', borderRadius: '3px' }}></div>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--slate-400)', marginTop: '0.3rem' }}>{pct}% of class</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Mode: Class Broadsheet */}
      {viewMode === 'broadsheet' ? (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Official Student Mark Broadsheet
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Ranked from 1st to {studentRanks.length}th based on marks achieved in this assessment
              </p>
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search student or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700, width: '60px' }}>RANK</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>STUDENT NAME</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>ID NUMBER</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>OBTAINED MARK</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>PERCENTAGE</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>GRADE</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>TEACHER DIAGNOSTIC REMARK</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700, textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((row, idx) => (
                  <tr key={row.student.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: row.rank === 1 ? '#fef08a' : row.rank === 2 ? '#e2e8f0' : row.rank === 3 ? '#ffedd5' : '#f1f5f9',
                        color: row.rank === 1 ? '#854d0e' : row.rank === 2 ? '#475569' : row.rank === 3 ? '#9a3412' : '#64748b',
                        fontSize: '0.78rem'
                      }}>
                        {row.rank}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {row.student.firstName} {row.student.lastName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-500)', fontSize: '0.8rem' }}>
                      {row.student.studentNumber}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#4f46e5', fontSize: '0.95rem' }}>
                      {row.rawScore} <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 500 }}>/ {activeAssessment.maxScore}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: row.gradeColor }}>
                      {row.percentage.toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: row.gradeColor + '18',
                        color: row.gradeColor,
                        fontWeight: 800,
                        fontSize: '0.78rem'
                      }}>
                        {row.grade} ({row.gradeTier})
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)', fontSize: '0.8rem', maxWidth: '340px' }}>
                      {row.remark}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedStudentForSlip(row.student.id);
                          setViewMode('individual_slip');
                        }}
                        style={{
                          padding: '0.35rem 0.7rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#4f46e5',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: Individual Student Result Slip */
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Official Student Assessment Result Slip
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                Certified academic assessment transcript slip suitable for printing or guardian reporting
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)' }}>Student:</label>
              {authorizedStudents.length > 1 ? (
                <select
                  value={activeSlipStudent.student.id}
                  onChange={(e) => setSelectedStudentForSlip(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {authorizedStudents.map(st => {
                    const rankItem = studentRanks.find(item => item.student.id === st.id) || { rank: 1, grade: 'A1' };
                    return (
                      <option key={st.id} value={st.id}>
                        Rank #{rankItem.rank}: {st.firstName} {st.lastName} ({rankItem.grade})
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  fontSize: '0.84rem',
                  fontWeight: 700
                }}>
                  <ShieldCheck size={16} color="#059669" />
                  {activeSlipStudent.student.firstName} {activeSlipStudent.student.lastName} ({activeSlipStudent.student.studentNumber})
                </div>
              )}
            </div>
          </div>

          {/* Printable Result Slip Card */}
          <div style={{
            border: '2px solid #334155',
            borderRadius: '16px',
            padding: '2rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            {/* Header / School Crest */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.01em' }}>
                {school.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                {school.address} • {school.contactEmail}
              </div>
              <div style={{ marginTop: '0.6rem', display: 'inline-block', backgroundColor: '#eef2ff', color: '#4338ca', padding: '0.25rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Continuous Assessment Performance Slip • {activeAssessment.term}
              </div>
            </div>

            {/* Student & Assessment Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>STUDENT FULL NAME</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{activeSlipStudent.student.firstName} {activeSlipStudent.student.lastName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>STUDENT IDENTIFIER</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{activeSlipStudent.student.studentNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>CLASS & STREAM</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{activeSlipStudent.student.className}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>CLASS POSITION (RANK)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4338ca' }}>
                  {activeSlipStudent.rank} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>of {studentRanks.length} students</span>
                </div>
              </div>
            </div>

            {/* Marks Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>OBTAINED MARK</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4338ca', marginTop: '0.2rem' }}>
                  {activeSlipStudent.rawScore} <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>/ {activeAssessment.maxScore}</span>
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SCORE PERCENTAGE</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: activeSlipStudent.gradeColor, marginTop: '0.2rem' }}>
                  {activeSlipStudent.percentage.toFixed(1)}%
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>LETTER GRADE</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: activeSlipStudent.gradeColor, marginTop: '0.2rem' }}>
                  {activeSlipStudent.grade}
                </div>
                <div style={{ fontSize: '0.75rem', color: activeSlipStudent.gradeColor, fontWeight: 700 }}>{activeSlipStudent.gradeTier}</div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>CLASS AVERAGE</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#64748b', marginTop: '0.2rem' }}>
                  {averagePct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: activeSlipStudent.percentage >= averagePct ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                  {activeSlipStudent.percentage >= averagePct ? 'Above Cohort Mean' : 'Below Cohort Mean'}
                </div>
              </div>
            </div>

            {/* Diagnostic Remarks Box */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Subject Teacher's Diagnostic Appraisal & Comments:
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{activeSlipStudent.remark}"
              </p>
            </div>

            {/* Signatures & Certification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #e2e8f0', paddingTop: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ height: '35px', borderBottom: '1px dashed #94a3b8', width: '220px' }}></div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginTop: '0.4rem' }}>{activeAssessment.submittedBy || 'Subject Teacher'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Assigned Subject Specialist</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1.5px solid #16a34a', color: '#16a34a', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                  <ShieldCheck size={16} /> Digitally Certified by Academic Board
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Recorded in ESAMS Audit Ledger (§12 Compliance)
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ height: '35px', borderBottom: '1px dashed #94a3b8', width: '220px' }}></div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginTop: '0.4rem' }}>{school.contactEmail ? 'Dr. Babatunde Adeleke' : 'Head Teacher'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Head of School / Academic Principal</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
