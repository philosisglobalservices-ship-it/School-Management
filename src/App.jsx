import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeadTeacherDashboard from './components/HeadTeacherDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentManagement from './components/StudentManagement';
import ScoreEntryGrid from './components/ScoreEntryGrid';
import ResultsWorkflow from './components/ResultsWorkflow';
import AttendanceRegister from './components/AttendanceRegister';
import StudentParentPortal from './components/StudentParentPortal';
import SecurityAuditViewer from './components/SecurityAuditViewer';
import ImportWizard from './components/ImportWizard';
import AcademicsManagement from './components/AcademicsManagement';
import StaffManagement from './components/StaffManagement';
import TimetableView from './components/TimetableView';
import AnnouncementsView from './components/AnnouncementsView';
import LoginScreen from './components/LoginScreen';
import AssessmentReports from './components/AssessmentReports';

import {
  INITIAL_SCHOOL,
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_STUDENT_GUARDIANS,
  INITIAL_STAFF,
  INITIAL_ASSESSMENTS,
  INITIAL_SCORES,
  INITIAL_CORRECTIONS,
  INITIAL_ATTENDANCE,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_ALERTS
} from './mockData';

import {
  loadSchoolDataFromSupabase,
  persistAuditLogToSupabase,
  persistStudentToSupabase,
  persistStudentsBatchToSupabase,
  persistClassToSupabase,
  persistSubjectToSupabase,
  persistScoresToSupabase,
  persistAssessmentStatusToSupabase,
  persistAttendanceToSupabase,
  persistAnnouncementToSupabase,
  persistCorrectionToSupabase
} from './supabaseService';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState('HEAD_TEACHER'); // 'HEAD_TEACHER' | 'TEACHER' | 'STUDENT' | 'PARENT'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App Data State (synced with Supabase PostgreSQL store)
  const [school, setSchool] = useState(INITIAL_SCHOOL);
  const [users] = useState(INITIAL_USERS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [studentGuardians] = useState(INITIAL_STUDENT_GUARDIANS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [corrections, setCorrections] = useState(INITIAL_CORRECTIONS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [timetable] = useState(INITIAL_TIMETABLE);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [securityAlerts, setSecurityAlerts] = useState(INITIAL_SECURITY_ALERTS);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Active selected assessment for Score Entry Grid
  const [selectedAssessmentForEntry, setSelectedAssessmentForEntry] = useState(assessments[0]);

  // Reactive Supabase data initialization
  useEffect(() => {
    async function initSupabaseData() {
      try {
        const data = await loadSchoolDataFromSupabase();
        if (data.connected) {
          setIsSupabaseLive(true);
          if (data.syncedTables.includes('schools')) setSchool(data.school);
          if (data.syncedTables.includes('classes')) setClasses(data.classes);
          if (data.syncedTables.includes('subjects')) setSubjects(data.subjects);
          if (data.syncedTables.includes('students')) setStudents(data.students);
          if (data.syncedTables.includes('staff')) setStaff(data.staff);
          if (data.syncedTables.includes('assessments')) {
            setAssessments(data.assessments);
            if (data.assessments.length > 0) setSelectedAssessmentForEntry(data.assessments[0]);
          }
          if (data.syncedTables.includes('scores')) setScores(data.scores);
          if (data.syncedTables.includes('result_corrections')) setCorrections(data.corrections);
          if (data.syncedTables.includes('attendance_records')) setAttendance(data.attendance);
          if (data.syncedTables.includes('announcements')) setAnnouncements(data.announcements);
          if (data.syncedTables.includes('audit_logs') && data.auditLogs.length > 0) {
            setAuditLogs(prev => {
              const existingIds = new Set(prev.map(l => l.id));
              const newItems = data.auditLogs.filter(l => !existingIds.has(l.id));
              return [...newItems, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn('[Supabase Init] Error initializing live Supabase data:', err);
      }
    }
    initSupabaseData();
  }, []);

  const currentUser = users.find(u => u.role === currentRole) || users[0];

  // Audit logging utility helper adhering to §12 schema & Supabase live sync
  const logAuditEvent = (action, resourceType, resourceId, outcome = 'success') => {
    const newLog = {
      id: `aud_${Date.now()}`,
      occurredAt: new Date().toISOString(),
      actor: currentUser.displayName,
      actorRole: currentRole,
      action,
      resourceType,
      resourceId,
      outcome,
      correlationId: `${Math.random().toString(36).substring(2, 10)}-${Date.now()}`,
      ipAddress: "102.89.23.104 (Lagos, NG)"
    };
    setAuditLogs(prev => [newLog, ...prev]);
    persistAuditLogToSupabase(newLog);
  };

  // State Machine handlers (§11) & Supabase sync
  const handleSaveDraftScores = (assessmentId, newScoresMap) => {
    let updatedSnapshot = [];
    setScores(prev => {
      const updated = [...prev];
      Object.keys(newScoresMap).forEach(stId => {
        const item = newScoresMap[stId];
        const idx = updated.findIndex(s => s.assessmentId === assessmentId && s.studentId === stId);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            scoreValue: item.scoreStatus === 'scored' ? parseFloat(item.scoreValue) : null,
            scoreStatus: item.scoreStatus,
            version: updated[idx].version + 1
          };
        } else {
          updated.push({
            id: `scr_${Date.now()}_${stId}`,
            assessmentId,
            studentId: stId,
            scoreValue: item.scoreStatus === 'scored' ? parseFloat(item.scoreValue) : null,
            scoreStatus: item.scoreStatus,
            workflowStatus: 'draft',
            version: 1
          });
        }
      });
      updatedSnapshot = updated;
      return updated;
    });
    persistScoresToSupabase(assessmentId, updatedSnapshot);
    logAuditEvent('score.draft.save', 'scores', assessmentId);
  };

  const handleSubmitAssessment = (assessmentId) => {
    const timestamp = new Date().toISOString();
    setAssessments(prev => prev.map(a => a.id === assessmentId ? { ...a, status: 'submitted', submittedAt: timestamp } : a));
    persistAssessmentStatusToSupabase(assessmentId, { status: 'submitted', submittedAt: timestamp });
    logAuditEvent('result.submit', 'assessment', assessmentId);
  };

  const handleApproveAssessment = (assessmentId) => {
    const timestamp = new Date().toISOString();
    setAssessments(prev => prev.map(a => a.id === assessmentId ? { ...a, status: 'approved', approvedAt: timestamp, approvedBy: currentUser.displayName } : a));
    persistAssessmentStatusToSupabase(assessmentId, { status: 'approved', approvedAt: timestamp, approvedBy: currentUser.displayName });
    logAuditEvent('result.approve', 'assessment', assessmentId);
  };

  const handleRejectAssessment = (assessmentId, reason) => {
    setAssessments(prev => prev.map(a => a.id === assessmentId ? { ...a, status: 'draft' } : a));
    persistAssessmentStatusToSupabase(assessmentId, { status: 'draft' });
    logAuditEvent('result.return', 'assessment', assessmentId);
  };

  const handlePublishAssessment = (assessmentId) => {
    const timestamp = new Date().toISOString();
    let nextVersion = 2;
    setAssessments(prev => prev.map(a => {
      if (a.id === assessmentId) {
        nextVersion = (a.version || 1) + 1;
        return { ...a, status: 'published', publishedAt: timestamp, publishedBy: currentUser.displayName, version: nextVersion };
      }
      return a;
    }));
    persistAssessmentStatusToSupabase(assessmentId, { status: 'published', publishedAt: timestamp, publishedBy: currentUser.displayName, version: nextVersion });
    logAuditEvent('result.publish', 'assessment', assessmentId);
  };

  const handleRequestCorrection = (correctionObj) => {
    setCorrections(prev => [correctionObj, ...prev]);
    persistCorrectionToSupabase(correctionObj);
    logAuditEvent('result.correction.request', 'result_correction', correctionObj.id);
  };

  const handleApproveCorrection = (correctionId, isApproved) => {
    const decidedAt = new Date().toISOString();
    setCorrections(prev => prev.map(c => {
      if (c.id === correctionId) {
        const updated = {
          ...c,
          status: isApproved ? 'approved' : 'rejected',
          approvedBy: currentUser.displayName,
          decidedAt
        };
        persistCorrectionToSupabase(updated);
        return updated;
      }
      return c;
    }));

    if (isApproved) {
      const match = corrections.find(c => c.id === correctionId);
      if (match) {
        setScores(prev => {
          const updated = prev.map(s => s.id === match.scoreId ? { ...s, scoreValue: match.proposedScoreValue, version: s.version + 1 } : s);
          persistScoresToSupabase(match.assessmentId, updated);
          return updated;
        });
      }
    }
    logAuditEvent(isApproved ? 'result.correction.approve' : 'result.correction.reject', 'result_correction', correctionId);
  };

  // Student actions
  const handleAddStudent = (newStu) => {
    setStudents(prev => [newStu, ...prev]);
    persistStudentToSupabase(newStu);
    logAuditEvent('student.create', 'student', newStu.id);
  };

  const handleImportCommit = (newBatch) => {
    setStudents(prev => [...newBatch, ...prev]);
    persistStudentsBatchToSupabase(newBatch);
    logAuditEvent('student.import.commit', 'student_batch', `batch_${Date.now()}`);
  };

  // Academics actions
  const handleAddClass = (cls) => {
    setClasses(prev => [...prev, cls]);
    persistClassToSupabase(cls);
    logAuditEvent('class.create', 'class', cls.id);
  };

  const handleAddSubject = (sub) => {
    setSubjects(prev => [...prev, sub]);
    persistSubjectToSupabase(sub);
    logAuditEvent('subject.create', 'subject', sub.id);
  };

  // Staff assignment
  const handleAddStaffAssignment = (staffId, classId, subjectId) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const classesSet = Array.from(new Set([...s.assignedClasses, classId]));
        const subjectsSet = Array.from(new Set([...s.assignedSubjects, subjectId]));
        return { ...s, assignedClasses: classesSet, assignedSubjects: subjectsSet };
      }
      return s;
    }));
    logAuditEvent('staff.assignment.update', 'staff', staffId);
  };

  // Attendance actions
  const handleSaveAttendance = (recordPayload) => {
    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.date === recordPayload.date && a.classId === recordPayload.classId));
      return [recordPayload, ...filtered];
    });
    persistAttendanceToSupabase(recordPayload);
    logAuditEvent('attendance.record.finalize', 'attendance_record', recordPayload.id);
  };

  // Announcement actions
  const handleAddAnnouncement = (anc) => {
    setAnnouncements(prev => [anc, ...prev]);
    persistAnnouncementToSupabase(anc);
    logAuditEvent('announcement.create', 'announcement', anc.id);
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar with RBAC Switcher */}
      <Sidebar
        currentRole={currentRole}
        setRole={(role) => {
          setCurrentRole(role);
          setActiveTab('dashboard');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Pane */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', maxHeight: '100vh' }}>
        {activeTab === 'dashboard' && (
          currentRole === 'HEAD_TEACHER' ? (
            <HeadTeacherDashboard
              school={school}
              students={students}
              staff={staff}
              assessments={assessments}
              auditLogs={auditLogs}
              securityAlerts={securityAlerts}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          ) : currentRole === 'TEACHER' ? (
            <TeacherDashboard
              staff={staff}
              classes={classes}
              subjects={subjects}
              assessments={assessments}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectAssessment={(asm) => {
                setSelectedAssessmentForEntry(asm);
                setActiveTab('assessments');
              }}
            />
          ) : (
            <StudentParentPortal
              currentRole={currentRole}
              currentUser={currentUser}
              students={students}
              assessments={assessments}
              scores={scores}
              attendance={attendance}
              school={school}
            />
          )
        )}

        {activeTab === 'students' && (
          <StudentManagement
            students={students}
            classes={classes}
            currentRole={currentRole}
            onAddStudent={handleAddStudent}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement
            staff={staff}
            classes={classes}
            subjects={subjects}
            onAddStaffAssignment={handleAddStaffAssignment}
          />
        )}

        {activeTab === 'academics' && (
          <AcademicsManagement
            classes={classes}
            subjects={subjects}
            onAddClass={handleAddClass}
            onAddSubject={handleAddSubject}
          />
        )}

        {activeTab === 'assessments' && (
          <ScoreEntryGrid
            assessment={selectedAssessmentForEntry || assessments[0]}
            assessments={assessments}
            onSelectAssessment={(asm) => setSelectedAssessmentForEntry(asm)}
            students={students.filter(st => st.classId === (selectedAssessmentForEntry?.classId || assessments[0]?.classId))}
            scores={scores}
            onSaveScores={handleSaveDraftScores}
            onSubmitAssessment={handleSubmitAssessment}
            currentRole={currentRole}
            onBack={() => setActiveTab('results_workflow')}
            onViewReport={(asm) => {
              setSelectedAssessmentForEntry(asm || selectedAssessmentForEntry || assessments[0]);
              setActiveTab('assessment_reports');
            }}
          />
        )}

        {activeTab === 'results_workflow' && (
          <ResultsWorkflow
            assessments={assessments}
            scores={scores}
            students={students}
            currentRole={currentRole}
            onApprove={handleApproveAssessment}
            onReject={handleRejectAssessment}
            onPublish={handlePublishAssessment}
            onRequestCorrection={handleRequestCorrection}
            corrections={corrections}
            onApproveCorrection={handleApproveCorrection}
            onViewReport={(asm) => {
              setSelectedAssessmentForEntry(asm);
              setActiveTab('assessment_reports');
            }}
          />
        )}

        {activeTab === 'assessment_reports' && (
          <AssessmentReports
            assessments={assessments}
            scores={scores}
            students={students}
            studentGuardians={studentGuardians}
            school={school}
            currentRole={currentRole}
            currentUser={currentUser}
            selectedAssessmentId={selectedAssessmentForEntry?.id}
            onSelectAssessment={(asm) => setSelectedAssessmentForEntry(asm)}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceRegister
            attendance={attendance}
            students={students}
            classes={classes}
            currentRole={currentRole}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {(activeTab === 'my_results' || activeTab === 'my_attendance') && (
          <StudentParentPortal
            currentRole={currentRole}
            currentUser={currentUser}
            students={students}
            studentGuardians={studentGuardians}
            assessments={assessments}
            scores={scores}
            attendance={attendance}
            school={school}
            onViewAssessmentReport={(asm) => {
              setSelectedAssessmentForEntry(asm);
              setActiveTab('assessment_reports');
            }}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableView
            timetable={timetable}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsView
            announcements={announcements}
            currentRole={currentRole}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}

        {activeTab === 'import_wizard' && (
          <ImportWizard
            onImportCommit={handleImportCommit}
          />
        )}

        {activeTab === 'audit_logs' && (
          <SecurityAuditViewer
            auditLogs={auditLogs}
            securityAlerts={securityAlerts}
          />
        )}
      </main>
    </div>
  );
}
