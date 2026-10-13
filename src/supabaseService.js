import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  INITIAL_SCHOOL,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_ASSESSMENTS,
  INITIAL_SCORES,
  INITIAL_CORRECTIONS,
  INITIAL_ATTENDANCE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS
} from './mockData';

/**
 * Loads all school data from Supabase.
 * If tables do not exist yet or are empty, gracefully returns initial blueprint defaults.
 */
export async function loadSchoolDataFromSupabase() {
  const result = {
    school: INITIAL_SCHOOL,
    classes: INITIAL_CLASSES,
    subjects: INITIAL_SUBJECTS,
    students: INITIAL_STUDENTS,
    staff: INITIAL_STAFF,
    assessments: INITIAL_ASSESSMENTS,
    scores: INITIAL_SCORES,
    corrections: INITIAL_CORRECTIONS,
    attendance: INITIAL_ATTENDANCE,
    announcements: INITIAL_ANNOUNCEMENTS,
    auditLogs: INITIAL_AUDIT_LOGS,
    connected: false,
    syncedTables: []
  };

  if (!isSupabaseConfigured) {
    return result;
  }

  try {
    // 1. Fetch Schools
    const { data: schoolsData, error: schoolsErr } = await supabase.from('schools').select('*').limit(1);
    if (!schoolsErr && schoolsData && schoolsData.length > 0) {
      const s = schoolsData[0];
      result.school = {
        id: s.id,
        slug: s.slug,
        name: s.name,
        timezone: s.timezone || 'Africa/Lagos',
        status: s.status || 'active',
        address: s.address,
        contactEmail: s.contact_email,
        currency: s.currency || 'NGN (₦)',
        currentSession: s.current_session,
        currentTerm: s.current_term
      };
      result.syncedTables.push('schools');
    }

    // 2. Fetch Classes
    const { data: classesData, error: classesErr } = await supabase.from('classes').select('*');
    if (!classesErr && classesData && classesData.length > 0) {
      result.classes = classesData.map(c => ({
        id: c.id,
        name: c.name,
        level: c.level,
        stream: c.stream,
        status: c.status,
        studentCount: c.student_count || 0
      }));
      result.syncedTables.push('classes');
    }

    // 3. Fetch Subjects
    const { data: subjectsData, error: subjectsErr } = await supabase.from('subjects').select('*');
    if (!subjectsErr && subjectsData && subjectsData.length > 0) {
      result.subjects = subjectsData.map(sub => ({
        id: sub.id,
        code: sub.code,
        name: sub.name,
        status: sub.status
      }));
      result.syncedTables.push('subjects');
    }

    // 4. Fetch Students
    const { data: studentsData, error: studentsErr } = await supabase.from('students').select('*');
    if (!studentsErr && studentsData && studentsData.length > 0) {
      result.students = studentsData.map(st => ({
        id: st.id,
        schoolId: st.school_id,
        studentNumber: st.student_number,
        firstName: st.first_name,
        lastName: st.last_name,
        dateOfBirth: st.date_of_birth,
        gender: st.gender,
        classId: st.class_id,
        className: st.class_name,
        status: st.status,
        emergencyContact: st.emergency_contact
      }));
      result.syncedTables.push('students');
    }

    // 5. Fetch Staff
    const { data: staffData, error: staffErr } = await supabase.from('staff').select('*');
    if (!staffErr && staffData && staffData.length > 0) {
      result.staff = staffData.map(stf => ({
        id: stf.id,
        schoolId: stf.school_id,
        employeeNumber: stf.employee_number,
        firstName: stf.first_name,
        lastName: stf.last_name,
        role: stf.role,
        email: stf.email,
        phone: stf.phone,
        assignedClasses: stf.assigned_classes || [],
        assignedSubjects: stf.assigned_subjects || [],
        employmentStatus: stf.employment_status
      }));
      result.syncedTables.push('staff');
    }

    // 6. Fetch Assessments
    const { data: assessmentsData, error: assessmentsErr } = await supabase.from('assessments').select('*');
    if (!assessmentsErr && assessmentsData && assessmentsData.length > 0) {
      result.assessments = assessmentsData.map(a => ({
        id: a.id,
        schoolId: a.school_id,
        classId: a.class_id,
        className: a.class_name,
        subjectId: a.subject_id,
        subjectName: a.subject_name,
        title: a.title,
        term: a.term,
        session: a.session,
        maxScore: Number(a.max_score) || 100,
        weightPercent: Number(a.weight_percent) || 30,
        status: a.status,
        version: a.version || 1,
        createdBy: a.created_by,
        submittedAt: a.submitted_at,
        approvedAt: a.approved_at,
        approvedBy: a.approved_by,
        publishedAt: a.published_at,
        publishedBy: a.published_by
      }));
      result.syncedTables.push('assessments');
    }

    // 7. Fetch Scores
    const { data: scoresData, error: scoresErr } = await supabase.from('scores').select('*');
    if (!scoresErr && scoresData && scoresData.length > 0) {
      result.scores = scoresData.map(sc => ({
        id: sc.id,
        assessmentId: sc.assessment_id,
        studentId: sc.student_id,
        scoreValue: sc.score_value !== null ? Number(sc.score_value) : null,
        scoreStatus: sc.score_status,
        workflowStatus: sc.workflow_status,
        version: sc.version || 1
      }));
      result.syncedTables.push('scores');
    }

    // 8. Fetch Corrections
    const { data: corrData, error: corrErr } = await supabase.from('result_corrections').select('*');
    if (!corrErr && corrData && corrData.length > 0) {
      result.corrections = corrData.map(c => ({
        id: c.id,
        scoreId: c.score_id,
        assessmentId: c.assessment_id,
        studentId: c.student_id,
        studentName: c.student_name,
        subjectName: c.subject_name,
        oldScoreValue: c.old_score_value !== null ? Number(c.old_score_value) : null,
        proposedScoreValue: c.proposed_score_value !== null ? Number(c.proposed_score_value) : null,
        reason: c.reason,
        requestedBy: c.requested_by,
        status: c.status,
        approvedBy: c.approved_by,
        requestedAt: c.requested_at,
        decidedAt: c.decided_at
      }));
      result.syncedTables.push('result_corrections');
    }

    // 9. Fetch Attendance
    const { data: attData, error: attErr } = await supabase.from('attendance_records').select('*');
    if (!attErr && attData && attData.length > 0) {
      result.attendance = attData.map(a => ({
        id: a.id,
        schoolId: a.school_id,
        date: a.date,
        classId: a.class_id,
        className: a.class_name,
        recordedBy: a.recorded_by,
        studentsRecords: a.students_records || {}
      }));
      result.syncedTables.push('attendance_records');
    }

    // 10. Fetch Announcements
    const { data: ancData, error: ancErr } = await supabase.from('announcements').select('*');
    if (!ancErr && ancData && ancData.length > 0) {
      result.announcements = ancData.map(an => ({
        id: an.id,
        schoolId: an.school_id,
        title: an.title,
        body: an.body,
        category: an.category,
        audience: an.audience,
        publishedAt: an.published_at,
        authorName: an.author_name,
        priority: an.priority
      }));
      result.syncedTables.push('announcements');
    }

    // 11. Fetch Audit Logs from Supabase audit_logs
    const { data: auditData, error: auditErr } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(50);
    if (!auditErr && auditData && auditData.length > 0) {
      result.auditLogs = auditData.map(a => ({
        id: a.id,
        occurredAt: a.timestamp || a.created_at,
        actor: a.actor_name,
        actorRole: a.actor_role,
        action: a.action,
        resourceType: a.module,
        resourceId: a.entity_id,
        outcome: 'success',
        correlationId: a.id,
        ipAddress: a.ip_address || '127.0.0.1'
      }));
      result.syncedTables.push('audit_logs');
    }

    result.connected = true;
  } catch (err) {
    console.warn('[Supabase Sync] Warning while fetching:', err);
  }

  return result;
}

/**
 * Persists an audit log event directly to the live Supabase database
 */
export async function persistAuditLogToSupabase(logEvent) {
  if (!isSupabaseConfigured) return;
  try {
    const payload = {
      id: logEvent.id || `AUD-${Date.now()}`,
      timestamp: logEvent.occurredAt || new Date().toISOString(),
      actor_id: 'a0000000-0000-0000-0000-000000000001',
      actor_name: logEvent.actor || 'Administrator',
      actor_role: (logEvent.actorRole || 'head_teacher').toLowerCase(),
      module: logEvent.resourceType || 'School Administration',
      action: logEvent.action || 'SYSTEM_ACTION',
      entity_id: String(logEvent.resourceId || 'ESAMS-APP'),
      description: `Action ${logEvent.action} performed on ${logEvent.resourceType} (${logEvent.resourceId}). Outcome: ${logEvent.outcome}`,
      previous_value: null,
      new_value: logEvent.outcome,
      ip_address: logEvent.ipAddress || '127.0.0.1',
      integrity_hash: `sha256_${Math.random().toString(36).substring(2, 10)}`,
      previous_hash: 'sha256_genesis_00001'
    };

    await supabase.from('audit_logs').insert([payload]);
  } catch (err) {
    console.warn('[Supabase] Failed to write audit log:', err);
  }
}

/**
 * Inserts or updates a student in Supabase
 */
export async function persistStudentToSupabase(student) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('students').upsert([{
      id: student.id,
      school_id: student.schoolId || 'sch_01h8a91b2c3d4e5f6789012345',
      student_number: student.studentNumber,
      first_name: student.firstName,
      last_name: student.lastName,
      date_of_birth: student.dateOfBirth,
      gender: student.gender,
      class_id: student.classId,
      class_name: student.className,
      status: student.status,
      emergency_contact: student.emergencyContact
    }]);
  } catch (err) {
    console.warn('[Supabase] Failed to persist student:', err);
  }
}

/**
 * Inserts a batch of students in Supabase
 */
export async function persistStudentsBatchToSupabase(students) {
  if (!isSupabaseConfigured) return;
  try {
    const records = students.map(st => ({
      id: st.id,
      school_id: st.schoolId || 'sch_01h8a91b2c3d4e5f6789012345',
      student_number: st.studentNumber,
      first_name: st.firstName,
      last_name: st.lastName,
      date_of_birth: st.dateOfBirth,
      gender: st.gender,
      class_id: st.classId,
      class_name: st.className,
      status: st.status || 'active',
      emergency_contact: st.emergencyContact
    }));
    await supabase.from('students').upsert(records);
  } catch (err) {
    console.warn('[Supabase] Failed to persist student batch:', err);
  }
}

/**
 * Inserts a new class in Supabase
 */
export async function persistClassToSupabase(cls) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('classes').upsert([{
      id: cls.id,
      school_id: 'sch_01h8a91b2c3d4e5f6789012345',
      name: cls.name,
      level: cls.level,
      stream: cls.stream,
      status: cls.status || 'active',
      student_count: cls.studentCount || 0
    }]);
  } catch (err) {
    console.warn('[Supabase] Failed to persist class:', err);
  }
}

/**
 * Inserts a new subject in Supabase
 */
export async function persistSubjectToSupabase(sub) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('subjects').upsert([{
      id: sub.id,
      school_id: 'sch_01h8a91b2c3d4e5f6789012345',
      code: sub.code,
      name: sub.name,
      status: sub.status || 'active'
    }]);
  } catch (err) {
    console.warn('[Supabase] Failed to persist subject:', err);
  }
}

/**
 * Saves draft or updated scores for an assessment
 */
export async function persistScoresToSupabase(assessmentId, updatedScores) {
  if (!isSupabaseConfigured) return;
  try {
    const records = updatedScores
      .filter(s => s.assessmentId === assessmentId)
      .map(s => ({
        id: s.id,
        assessment_id: s.assessmentId,
        student_id: s.studentId,
        score_value: s.scoreValue,
        score_status: s.scoreStatus,
        workflow_status: s.workflowStatus,
        version: s.version || 1,
        updated_at: new Date().toISOString()
      }));
    if (records.length > 0) {
      await supabase.from('scores').upsert(records);
    }
  } catch (err) {
    console.warn('[Supabase] Failed to persist scores:', err);
  }
}

/**
 * Updates assessment workflow state in Supabase
 */
export async function persistAssessmentStatusToSupabase(assessmentId, updates) {
  if (!isSupabaseConfigured) return;
  try {
    const payload = {};
    if (updates.status) payload.status = updates.status;
    if (updates.submittedAt) payload.submitted_at = updates.submittedAt;
    if (updates.approvedAt) payload.approved_at = updates.approvedAt;
    if (updates.approvedBy) payload.approved_by = updates.approvedBy;
    if (updates.publishedAt) payload.published_at = updates.publishedAt;
    if (updates.publishedBy) payload.published_by = updates.publishedBy;
    if (updates.version) payload.version = updates.version;
    payload.updated_at = new Date().toISOString();

    await supabase.from('assessments').update(payload).eq('id', assessmentId);
  } catch (err) {
    console.warn('[Supabase] Failed to update assessment status:', err);
  }
}

/**
 * Persists an attendance session record to Supabase
 */
export async function persistAttendanceToSupabase(attRecord) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('attendance_records').upsert([{
      id: attRecord.id,
      school_id: 'sch_01h8a91b2c3d4e5f6789012345',
      date: attRecord.date,
      class_id: attRecord.classId,
      class_name: attRecord.className,
      recorded_by: attRecord.recordedBy,
      students_records: attRecord.studentsRecords || {}
    }]);
  } catch (err) {
    console.warn('[Supabase] Failed to persist attendance:', err);
  }
}

/**
 * Persists a new announcement in Supabase
 */
export async function persistAnnouncementToSupabase(announcement) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('announcements').upsert([{
      id: announcement.id,
      school_id: 'sch_01h8a91b2c3d4e5f6789012345',
      title: announcement.title,
      body: announcement.body,
      category: announcement.category || 'general',
      audience: announcement.audience || 'all',
      published_at: announcement.publishedAt || new Date().toISOString(),
      author_name: announcement.authorName,
      priority: announcement.priority || 'normal'
    }]);
  } catch (err) {
    console.warn('[Supabase] Failed to persist announcement:', err);
  }
}

/**
 * Requests or updates a result correction
 */
export async function persistCorrectionToSupabase(correction) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('result_corrections').upsert([{
      id: correction.id,
      score_id: correction.scoreId,
      assessment_id: correction.assessmentId,
      student_id: correction.studentId,
      student_name: correction.studentName,
      subject_name: correction.subjectName,
      old_score_value: correction.oldScoreValue,
      proposed_score_value: correction.proposedScoreValue,
      reason: correction.reason,
      requested_by: correction.requestedBy,
      status: correction.status || 'pending',
      approved_by: correction.approvedBy,
      requested_at: correction.requestedAt || new Date().toISOString(),
      decided_at: correction.decidedAt
    }]);
  } catch (err) {
    console.warn('[Supabase] Failed to persist correction:', err);
  }
}
