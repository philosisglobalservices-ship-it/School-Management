-- ==============================================================================
-- ESAMS: Enterprise School Administration Management System
-- Supabase PostgreSQL Database Schema & Initial Seed
-- Project URL: https://npjmcwjpfuxhcyvczitx.supabase.co
-- Target DB: PostgreSQL (Supabase)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'Africa/Lagos',
  status TEXT DEFAULT 'active',
  address TEXT,
  contact_email TEXT,
  currency TEXT DEFAULT 'NGN (₦)',
  current_session TEXT,
  current_term TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT,
  stream TEXT,
  status TEXT DEFAULT 'active',
  student_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  student_number TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT,
  class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,
  class_name TEXT,
  status TEXT DEFAULT 'active',
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  employee_number TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  assigned_classes TEXT[] DEFAULT '{}',
  assigned_subjects TEXT[] DEFAULT '{}',
  employment_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  class_name TEXT,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  subject_name TEXT,
  title TEXT NOT NULL,
  term TEXT,
  session TEXT,
  max_score NUMERIC(7,2) DEFAULT 100,
  weight_percent NUMERIC(5,2) DEFAULT 30,
  status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  created_by TEXT,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  published_at TIMESTAMPTZ,
  published_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Scores Table
CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  assessment_id TEXT REFERENCES assessments(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  score_value NUMERIC(7,2),
  score_status TEXT DEFAULT 'scored',
  workflow_status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS scores_asm_stu_uq ON scores(assessment_id, student_id);

-- 9. Result Corrections Table
CREATE TABLE IF NOT EXISTS result_corrections (
  id TEXT PRIMARY KEY,
  score_id TEXT REFERENCES scores(id) ON DELETE CASCADE,
  assessment_id TEXT,
  student_id TEXT,
  student_name TEXT,
  subject_name TEXT,
  old_score_value NUMERIC(7,2),
  proposed_score_value NUMERIC(7,2),
  reason TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);

-- 10. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  class_name TEXT,
  recorded_by TEXT,
  students_records JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS attendance_class_date_uq ON attendance_records(class_id, date);

-- 11. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  audience TEXT DEFAULT 'all',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  author_name TEXT,
  priority TEXT DEFAULT 'normal'
);

-- 12. Audit Logs Table (Matches existing Supabase table if present)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  description TEXT,
  previous_value TEXT,
  new_value TEXT,
  ip_address TEXT,
  integrity_hash TEXT,
  previous_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ==============================================================================

DO $$ 
DECLARE
  t text;
  tables text[] := ARRAY[
    'schools', 'classes', 'subjects', 'students', 'staff', 
    'assessments', 'scores', 'result_corrections', 
    'attendance_records', 'announcements', 'audit_logs'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public access to %I" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "Public access to %I" ON %I FOR ALL USING (true) WITH CHECK (true);', t, t);
  END LOOP;
END $$;

-- ==============================================================================
-- SEED DATA (Apex Crest International Academy Baseline)
-- ==============================================================================

-- Seed School
INSERT INTO schools (id, slug, name, timezone, status, address, contact_email, currency, current_session, current_term)
VALUES (
  'sch_01h8a91b2c3d4e5f6789012345',
  'apex-crest-academy',
  'Apex Crest International Academy',
  'Africa/Lagos',
  'active',
  'Plot 14, Victoria Island Extension, Lagos, Nigeria',
  'info@apexcrest.edu.ng',
  'NGN (₦)',
  '2026/2027 Academic Session',
  'First Term'
) ON CONFLICT (id) DO NOTHING;

-- Seed Classes
INSERT INTO classes (id, school_id, name, level, stream, status, student_count) VALUES
  ('cls_ss1_gold', 'sch_01h8a91b2c3d4e5f6789012345', 'SS 1 - Gold Stream', 'Senior Secondary 1', 'Science', 'active', 32),
  ('cls_ss2_diamond', 'sch_01h8a91b2c3d4e5f6789012345', 'SS 2 - Diamond Stream', 'Senior Secondary 2', 'Science', 'active', 28),
  ('cls_ss3_platinum', 'sch_01h8a91b2c3d4e5f6789012345', 'SS 3 - Platinum Stream', 'Senior Secondary 3', 'Science/Arts', 'active', 25),
  ('cls_js1_ruby', 'sch_01h8a91b2c3d4e5f6789012345', 'JS 1 - Ruby Stream', 'Junior Secondary 1', 'General', 'active', 35)
ON CONFLICT (id) DO NOTHING;

-- Seed Subjects
INSERT INTO subjects (id, school_id, code, name, status) VALUES
  ('sub_math', 'sch_01h8a91b2c3d4e5f6789012345', 'MTH-101', 'Further Mathematics', 'active'),
  ('sub_eng', 'sch_01h8a91b2c3d4e5f6789012345', 'ENG-101', 'English Language & Literature', 'active'),
  ('sub_phy', 'sch_01h8a91b2c3d4e5f6789012345', 'PHY-101', 'Pure Physics', 'active'),
  ('sub_chem', 'sch_01h8a91b2c3d4e5f6789012345', 'CHM-101', 'Inorganic Chemistry', 'active'),
  ('sub_bio', 'sch_01h8a91b2c3d4e5f6789012345', 'BIO-101', 'Biological Sciences', 'active'),
  ('sub_civ', 'sch_01h8a91b2c3d4e5f6789012345', 'CIV-101', 'Civic Education & Ethics', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed Staff
INSERT INTO staff (id, school_id, employee_number, first_name, last_name, role, email, phone, assigned_classes, assigned_subjects, employment_status) VALUES
  ('stf_01', 'sch_01h8a91b2c3d4e5f6789012345', 'EMP-2022-012', 'Ngozi', 'Okonjo', 'Senior Science Lead', 'teacher@apexcrest.edu.ng', '+2348022223344', ARRAY['cls_ss2_diamond', 'cls_ss3_platinum'], ARRAY['sub_math', 'sub_phy'], 'active'),
  ('stf_02', 'sch_01h8a91b2c3d4e5f6789012345', 'EMP-2023-045', 'Emeka', 'Okafor', 'Head of Humanities', 'emeka.okafor@apexcrest.edu.ng', '+2348033334455', ARRAY['cls_ss1_gold', 'cls_ss2_diamond'], ARRAY['sub_eng'], 'active'),
  ('stf_03', 'sch_01h8a91b2c3d4e5f6789012345', 'EMP-2024-089', 'Fatima', 'Bello', 'Chemistry Specialist', 'fatima.bello@apexcrest.edu.ng', '+2348044445566', ARRAY['cls_ss2_diamond'], ARRAY['sub_chem'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed Students
INSERT INTO students (id, school_id, student_number, first_name, last_name, date_of_birth, gender, class_id, class_name, status, emergency_contact) VALUES
  ('stu_01', 'sch_01h8a91b2c3d4e5f6789012345', 'STU-2026-0042', 'Chinedu', 'Eze', '2009-08-14', 'Male', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'active', '+2348044445566 (Chief Kenneth Eze - Father)'),
  ('stu_02', 'sch_01h8a91b2c3d4e5f6789012345', 'STU-2026-0043', 'Amina', 'Danjuma', '2009-03-22', 'Female', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'active', '+2348055556677 (Alhaji Danjuma - Father)'),
  ('stu_03', 'sch_01h8a91b2c3d4e5f6789012345', 'STU-2026-0044', 'Tunde', 'Bakare', '2008-11-05', 'Male', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'active', '+2348066667788 (Mrs. Bakare - Mother)'),
  ('stu_04', 'sch_01h8a91b2c3d4e5f6789012345', 'STU-2026-0045', 'Zainab', 'Yusuf', '2009-06-19', 'Female', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'active', '+2348077778899 (Dr. Yusuf - Father)'),
  ('stu_05', 'sch_01h8a91b2c3d4e5f6789012345', 'STU-2026-0046', 'Kenechukwu', 'Obi', '2009-01-30', 'Male', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'active', '+2348088889900 (Barrister Obi - Father)'),
  ('stu_06', 'sch_01h8a91b2c3d4e5f6789012345', 'STU-2026-0047', 'Blessing', 'Adeyemi', '2009-12-10', 'Female', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'active', '+2348099990011 (Pastor Adeyemi - Father)')
ON CONFLICT (id) DO NOTHING;

-- Seed Assessments
INSERT INTO assessments (id, school_id, class_id, class_name, subject_id, subject_name, title, term, session, max_score, weight_percent, status, version, created_by, submitted_at, approved_at, approved_by, published_at, published_by) VALUES
  ('asm_ss2_math_ca1', 'sch_01h8a91b2c3d4e5f6789012345', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'sub_math', 'Further Mathematics', 'Continuous Assessment Test 1 (Algebra & Calculus)', 'First Term', '2026/2027', 30.00, 30.00, 'published', 2, 'Mrs. Ngozi Okonjo', '2026-10-08T10:00:00Z', '2026-10-09T14:20:00Z', 'Dr. Babatunde Adeleke', '2026-10-10T09:00:00Z', 'Dr. Babatunde Adeleke'),
  ('asm_ss2_math_ca2', 'sch_01h8a91b2c3d4e5f6789012345', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'sub_math', 'Further Mathematics', 'Continuous Assessment Test 2 (Trigonometry)', 'First Term', '2026/2027', 30.00, 30.00, 'approved', 1, 'Mrs. Ngozi Okonjo', '2026-10-11T16:00:00Z', '2026-10-12T11:30:00Z', 'Dr. Babatunde Adeleke', NULL, NULL),
  ('asm_ss2_phy_ca1', 'sch_01h8a91b2c3d4e5f6789012345', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'sub_phy', 'Pure Physics', 'CA Test 1 (Mechanics & Vectors)', 'First Term', '2026/2027', 30.00, 30.00, 'submitted', 1, 'Mrs. Ngozi Okonjo', '2026-10-12T15:00:00Z', NULL, NULL, NULL, NULL),
  ('asm_ss2_chem_ca1', 'sch_01h8a91b2c3d4e5f6789012345', 'cls_ss2_diamond', 'SS 2 - Diamond Stream', 'sub_chem', 'Inorganic Chemistry', 'CA Test 1 (Periodic Trends & Bonding)', 'First Term', '2026/2027', 30.00, 30.00, 'draft', 1, 'Mrs. Fatima Bello', NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Scores
INSERT INTO scores (id, assessment_id, student_id, score_value, score_status, workflow_status, version) VALUES
  ('scr_01', 'asm_ss2_math_ca1', 'stu_01', 28.5, 'scored', 'published', 2),
  ('scr_02', 'asm_ss2_math_ca1', 'stu_02', 29.0, 'scored', 'published', 1),
  ('scr_03', 'asm_ss2_math_ca1', 'stu_03', 24.5, 'scored', 'published', 1),
  ('scr_04', 'asm_ss2_math_ca1', 'stu_04', 27.0, 'scored', 'published', 1),
  ('scr_05', 'asm_ss2_math_ca1', 'stu_05', 21.0, 'scored', 'published', 1),
  ('scr_06', 'asm_ss2_math_ca1', 'stu_06', 26.5, 'scored', 'published', 1),
  ('scr_11', 'asm_ss2_math_ca2', 'stu_01', 27.0, 'scored', 'approved', 1),
  ('scr_12', 'asm_ss2_math_ca2', 'stu_02', 28.5, 'scored', 'approved', 1),
  ('scr_13', 'asm_ss2_math_ca2', 'stu_03', 23.0, 'scored', 'approved', 1),
  ('scr_14', 'asm_ss2_math_ca2', 'stu_04', 25.5, 'scored', 'approved', 1),
  ('scr_15', 'asm_ss2_math_ca2', 'stu_05', null, 'absent', 'approved', 1),
  ('scr_16', 'asm_ss2_math_ca2', 'stu_06', 24.0, 'scored', 'approved', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Announcements
INSERT INTO announcements (id, school_id, title, body, category, audience, published_at, author_name, priority) VALUES
  ('anc_01', 'sch_01h8a91b2c3d4e5f6789012345', 'Mid-Term Assessment Schedule & Continuous Assessment Deadlines', 'All Subject Specialists and Class Teachers are notified that Continuous Assessment (CA 1 & CA 2) grades must be submitted to the Head Teacher office via the Result Workflow engine by Friday, October 16, 2026.', 'academic', 'staff', '2026-10-10T08:00:00Z', 'Dr. Babatunde Adeleke', 'high'),
  ('anc_02', 'sch_01h8a91b2c3d4e5f6789012345', 'Parent-Teacher Academic Consultation Day', 'Apex Crest International Academy cordially invites all parents and guardians to our First Term Consultation Day scheduled for Saturday, October 24, 2026 at the School Grand Hall.', 'general', 'parents', '2026-10-11T10:30:00Z', 'Administration Office', 'normal')
ON CONFLICT (id) DO NOTHING;
