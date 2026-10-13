// ESAMS Mock Data Store strictly adhering to Section 5, 6, and 7 of the Blueprint
export const INITIAL_SCHOOL = {
  id: "sch_01h8a91b2c3d4e5f6789012345",
  slug: "apex-crest-academy",
  name: "Apex Crest International Academy",
  timezone: "Africa/Lagos",
  status: "active",
  address: "Plot 14, Victoria Island Extension, Lagos, Nigeria",
  contactEmail: "info@apexcrest.edu.ng",
  currency: "NGN (₦)",
  currentSession: "2026/2027 Academic Session",
  currentTerm: "First Term"
};

export const INITIAL_USERS = [
  {
    id: "usr_head_teacher",
    schoolId: INITIAL_SCHOOL.id,
    email: "headteacher@apexcrest.edu.ng",
    phone: "+2348011112233",
    displayName: "Dr. Babatunde Adeleke",
    role: "HEAD_TEACHER",
    roleName: "Head Teacher",
    status: "active",
    mustChangePassword: false,
    mfaEnrolled: true,
    lastLogin: "2026-10-12T13:45:00Z"
  },
  {
    id: "usr_teacher_1",
    schoolId: INITIAL_SCHOOL.id,
    email: "teacher@apexcrest.edu.ng",
    phone: "+2348022223344",
    displayName: "Mrs. Ngozi Okonjo",
    role: "TEACHER",
    roleName: "Senior Mathematics & Physics Specialist",
    status: "active",
    mustChangePassword: false,
    mfaEnrolled: false,
    staffId: "stf_01",
    lastLogin: "2026-10-12T12:30:00Z"
  },
  {
    id: "usr_student_1",
    schoolId: INITIAL_SCHOOL.id,
    email: "student@apexcrest.edu.ng",
    phone: "+2348033334455",
    displayName: "Chinedu Eze",
    role: "STUDENT",
    roleName: "SS2 Class Student",
    status: "active",
    mustChangePassword: false,
    mfaEnrolled: false,
    studentId: "stu_01",
    lastLogin: "2026-10-12T08:15:00Z"
  },
  {
    id: "usr_parent_1",
    schoolId: INITIAL_SCHOOL.id,
    email: "parent@apexcrest.edu.ng",
    phone: "+2348044445566",
    displayName: "Chief Kenneth Eze",
    role: "PARENT",
    roleName: "Verified Guardian",
    status: "active",
    mustChangePassword: false,
    mfaEnrolled: false,
    guardianId: "grd_01",
    lastLogin: "2026-10-12T10:00:00Z"
  }
];

export const INITIAL_CLASSES = [
  { id: "cls_ss1_gold", name: "SS 1 - Gold Stream", level: "Senior Secondary 1", stream: "Science", status: "active", studentCount: 32 },
  { id: "cls_ss2_diamond", name: "SS 2 - Diamond Stream", level: "Senior Secondary 2", stream: "Science", status: "active", studentCount: 28 },
  { id: "cls_ss3_platinum", name: "SS 3 - Platinum Stream", level: "Senior Secondary 3", stream: "Science/Arts", status: "active", studentCount: 25 },
  { id: "cls_js1_ruby", name: "JS 1 - Ruby Stream", level: "Junior Secondary 1", stream: "General", status: "active", studentCount: 35 }
];

export const INITIAL_SUBJECTS = [
  { id: "sub_math", code: "MTH-101", name: "Further Mathematics", status: "active" },
  { id: "sub_eng", code: "ENG-101", name: "English Language & Literature", status: "active" },
  { id: "sub_phy", code: "PHY-101", name: "Pure Physics", status: "active" },
  { id: "sub_chem", code: "CHM-101", name: "Inorganic Chemistry", status: "active" },
  { id: "sub_bio", code: "BIO-101", name: "Biological Sciences", status: "active" },
  { id: "sub_civ", code: "CIV-101", name: "Civic Education & Ethics", status: "active" }
];

export const INITIAL_STUDENTS = [
  {
    id: "stu_01",
    schoolId: INITIAL_SCHOOL.id,
    studentNumber: "STU-2026-0042",
    firstName: "Chinedu",
    lastName: "Eze",
    dateOfBirth: "2009-08-14",
    gender: "Male",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    status: "active",
    guardianId: "grd_01",
    guardianName: "Chief Kenneth Eze",
    guardianPhone: "+2348044445566",
    enrolmentDate: "2023-09-10"
  },
  {
    id: "stu_02",
    schoolId: INITIAL_SCHOOL.id,
    studentNumber: "STU-2026-0043",
    firstName: "Amina",
    lastName: "Bello",
    dateOfBirth: "2009-11-22",
    gender: "Female",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    status: "active",
    guardianId: "grd_02",
    guardianName: "Alhaji Musa Bello",
    guardianPhone: "+2348055556677",
    enrolmentDate: "2023-09-10"
  },
  {
    id: "stu_03",
    schoolId: INITIAL_SCHOOL.id,
    studentNumber: "STU-2026-0044",
    firstName: "Folashade",
    lastName: "Adeyemi",
    dateOfBirth: "2010-01-19",
    gender: "Female",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    status: "active",
    guardianId: "grd_03",
    guardianName: "Mrs. Titilayo Adeyemi",
    guardianPhone: "+2348066667788",
    enrolmentDate: "2023-09-10"
  },
  {
    id: "stu_04",
    schoolId: INITIAL_SCHOOL.id,
    studentNumber: "STU-2026-0045",
    firstName: "Tari",
    lastName: "Briggs",
    dateOfBirth: "2009-06-30",
    gender: "Male",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    status: "active",
    guardianId: "grd_04",
    guardianName: "Engr. Tamuno Briggs",
    guardianPhone: "+2348077778899",
    enrolmentDate: "2023-09-10"
  },
  {
    id: "stu_05",
    schoolId: INITIAL_SCHOOL.id,
    studentNumber: "STU-2026-0046",
    firstName: "Emeka",
    lastName: "Nnamdi",
    dateOfBirth: "2009-04-12",
    gender: "Male",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    status: "active",
    guardianId: "grd_05",
    guardianName: "Dr. Jude Nnamdi",
    guardianPhone: "+2348088889900",
    enrolmentDate: "2023-09-10"
  }
];

// Verified Student-Guardian Relationship Links (Blueprint Section 6 & 7 ABAC Model)
export const INITIAL_STUDENT_GUARDIANS = [
  {
    id: "stg_01",
    studentId: "stu_01",
    guardianId: "grd_01",
    guardianName: "Chief Kenneth Eze",
    studentName: "Chinedu Eze",
    relationship: "Father / Legal Guardian",
    status: "verified",
    verifiedAt: "2023-09-12T10:00:00Z",
    verifiedBy: "Dr. Babatunde Adeleke (Head Teacher)",
    validFrom: "2023-09-01",
    validUntil: null,
    emergencyContact: true
  },
  {
    id: "stg_02",
    studentId: "stu_02",
    guardianId: "grd_02",
    guardianName: "Alhaji Musa Bello",
    studentName: "Amina Bello",
    relationship: "Father",
    status: "verified",
    verifiedAt: "2023-09-12T10:00:00Z",
    verifiedBy: "Dr. Babatunde Adeleke",
    validFrom: "2023-09-01",
    validUntil: null,
    emergencyContact: true
  },
  {
    id: "stg_03",
    studentId: "stu_03",
    guardianId: "grd_03",
    guardianName: "Mrs. Titilayo Adeyemi",
    studentName: "Folashade Adeyemi",
    relationship: "Mother",
    status: "verified",
    verifiedAt: "2023-09-12T10:00:00Z",
    verifiedBy: "Dr. Babatunde Adeleke",
    validFrom: "2023-09-01",
    validUntil: null,
    emergencyContact: true
  },
  {
    id: "stg_04",
    studentId: "stu_04",
    guardianId: "grd_04",
    guardianName: "Engr. Tamuno Briggs",
    studentName: "Tari Briggs",
    relationship: "Father",
    status: "verified",
    verifiedAt: "2023-09-12T10:00:00Z",
    verifiedBy: "Dr. Babatunde Adeleke",
    validFrom: "2023-09-01",
    validUntil: null,
    emergencyContact: true
  },
  {
    id: "stg_05",
    studentId: "stu_05",
    guardianId: "grd_05",
    guardianName: "Dr. Jude Nnamdi",
    studentName: "Emeka Nnamdi",
    relationship: "Father",
    status: "verified",
    verifiedAt: "2023-09-12T10:00:00Z",
    verifiedBy: "Dr. Babatunde Adeleke",
    validFrom: "2023-09-01",
    validUntil: null,
    emergencyContact: true
  }
];

export const INITIAL_STAFF = [
  {
    id: "stf_01",
    employeeNumber: "EMP-2024-0012",
    firstName: "Ngozi",
    lastName: "Okonjo",
    email: "teacher@apexcrest.edu.ng",
    phone: "+2348022223344",
    role: "Senior Subject Teacher",
    employmentStatus: "active",
    assignedClasses: ["cls_ss2_diamond", "cls_ss1_gold"],
    assignedSubjects: ["sub_math", "sub_phy"]
  },
  {
    id: "stf_02",
    employeeNumber: "EMP-2022-0005",
    firstName: "Babatunde",
    lastName: "Adeleke",
    email: "headteacher@apexcrest.edu.ng",
    phone: "+2348011112233",
    role: "Head of School / Principal",
    employmentStatus: "active",
    assignedClasses: [],
    assignedSubjects: []
  },
  {
    id: "stf_03",
    employeeNumber: "EMP-2025-0033",
    firstName: "Fatima",
    lastName: "Garba",
    email: "f.garba@apexcrest.edu.ng",
    phone: "+2348099990011",
    role: "English Language Specialist",
    employmentStatus: "active",
    assignedClasses: ["cls_ss2_diamond"],
    assignedSubjects: ["sub_eng"]
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: "asm_math_midterm",
    title: "First Term Mid-Term Assessment: Further Mathematics",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    subjectId: "sub_math",
    subjectName: "Further Mathematics",
    term: "First Term 2026/2027",
    assessmentType: "Mid-Term Examination",
    maxScore: 30,
    weightPercentage: 30,
    syllabusAlignment: "WAEC-MTH-SS2.4 (Advanced Algebraic Calculus & Coordinate Geometry)",
    status: "published",
    submittedBy: "Mrs. Ngozi Okonjo",
    submittedAt: "2026-10-08T14:30:00Z",
    approvedBy: "Dr. Babatunde Adeleke",
    approvedAt: "2026-10-09T10:00:00Z",
    publishedAt: "2026-10-09T11:30:00Z",
    version: 2,
    diagnosticStrengths: "Exceptional mastery of quadratic matrix operations and differentiation limits. 85% of cohort achieved full marks on Section A algorithmic proofs.",
    diagnosticGaps: "Trigonometric compound-angle identity proofs demonstrated calculation slip errors under timed conditions.",
    recommendations: "Introduce weekly 15-minute speed drills on inverse trigonometric substitutions before the terminal examination."
  },
  {
    id: "asm_physics_ca2",
    title: "Continuous Assessment 2: Electromagnetism & Practical Optics",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    subjectId: "sub_phy",
    subjectName: "Pure Physics",
    term: "First Term 2026/2027",
    assessmentType: "Practical Laboratory Exam",
    maxScore: 20,
    weightPercentage: 20,
    syllabusAlignment: "WAEC-PHY-SS2.2 (Optical Ray Tracing & Galvanometer Circuits)",
    status: "published",
    submittedBy: "Mrs. Ngozi Okonjo",
    submittedAt: "2026-10-02T11:00:00Z",
    approvedBy: "Dr. Babatunde Adeleke",
    approvedAt: "2026-10-04T09:00:00Z",
    publishedAt: "2026-10-05T10:00:00Z",
    version: 3,
    diagnosticStrengths: "Superior lab bench technique, apparatus calibration, and accurate determination of refractive index via triangular glass prisms.",
    diagnosticGaps: "Plotting experimental error margins and gradient calculations on non-linear graphical scales.",
    recommendations: "Provide calibrated graph paper workshops and enforce systematic SI unit notation across all experimental write-ups."
  },
  {
    id: "asm_english_essay",
    title: "Analytical Essay & Literature Critique: African Prose",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    subjectId: "sub_eng",
    subjectName: "English Language & Literature",
    term: "First Term 2026/2027",
    assessmentType: "Written Term Paper",
    maxScore: 40,
    weightPercentage: 40,
    syllabusAlignment: "WAEC-LIT-SS2.1 (Thematic & Structural Analysis of African Drama)",
    status: "published",
    submittedBy: "Mrs. Fatima Garba",
    submittedAt: "2026-10-03T16:00:00Z",
    approvedBy: "Dr. Babatunde Adeleke",
    approvedAt: "2026-10-05T08:30:00Z",
    publishedAt: "2026-10-06T09:00:00Z",
    version: 1,
    diagnosticStrengths: "Mature thematic synthesis, vivid metaphorical prose, and persuasive argumentative coherence regarding cultural heritage motifs.",
    diagnosticGaps: "Inconsistent MLA citation referencing and occasional passive voice overuse in introductory paragraphs.",
    recommendations: "Organize peer writing critique circles focusing on academic citation conventions and active voice rhetoric."
  },
  {
    id: "asm_chem_titration",
    title: "Volumetric Analysis & Quantitative Titration CA",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    subjectId: "sub_chem",
    subjectName: "Inorganic Chemistry",
    term: "First Term 2026/2027",
    assessmentType: "Laboratory Practical Assessment",
    maxScore: 25,
    weightPercentage: 25,
    syllabusAlignment: "WAEC-CHM-SS2.3 (Acid-Base Neutralization & Molar Concentration)",
    status: "published",
    submittedBy: "Mr. Tunde Lawal",
    submittedAt: "2026-10-07T13:15:00Z",
    approvedBy: "Dr. Babatunde Adeleke",
    approvedAt: "2026-10-08T11:45:00Z",
    publishedAt: "2026-10-08T15:00:00Z",
    version: 1,
    diagnosticStrengths: "Exact end-point colour changes with methyl orange indicator; concordance within 0.10 cm³ achieved by 90% of students.",
    diagnosticGaps: "Calculation of percentage purity from stoichiometric mole ratios required multiple prompt hints.",
    recommendations: "Revisit balancing redox equations and mole-to-mass conversions prior to final term practical exam."
  },
  {
    id: "asm_bio_genetics",
    title: "Continuous Assessment 1: Mendelian Genetics & Cell Biology",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    subjectId: "sub_bio",
    subjectName: "Biological Sciences",
    term: "First Term 2026/2027",
    assessmentType: "Diagnostic Objective & Theory Test",
    maxScore: 30,
    weightPercentage: 30,
    syllabusAlignment: "WAEC-BIO-SS2.5 (Monohybrid Inheritance, Sex Linkage & Chromosomes)",
    status: "under_review",
    submittedBy: "Mrs. Fatima Garba",
    submittedAt: "2026-10-11T09:30:00Z",
    reviewedBy: null,
    reviewedAt: null,
    version: 1,
    diagnosticStrengths: "Accurate Punnett square projections for dominant/recessive blood group phenotypes; excellent pedigree chart analysis.",
    diagnosticGaps: "Distinguishing between codominance and incomplete dominance in multi-allelic traits.",
    recommendations: "Conduct review tutorial examining human haemoglobin sickle cell trait alleles."
  },
  {
    id: "asm_civic_governance",
    title: "Constitutional Governance & Human Rights Term Project",
    classId: "cls_ss2_diamond",
    className: "SS 2 - Diamond Stream",
    subjectId: "sub_civ",
    subjectName: "Civic Education & Ethics",
    term: "First Term 2026/2027",
    assessmentType: "Case Study & Oral Presentation",
    maxScore: 50,
    weightPercentage: 50,
    syllabusAlignment: "WAEC-CIV-SS2.1 (Rule of Law, Separation of Powers & Fundamental Rights)",
    status: "approved",
    submittedBy: "Mr. Tunde Lawal",
    submittedAt: "2026-10-09T14:00:00Z",
    approvedBy: "Dr. Babatunde Adeleke",
    approvedAt: "2026-10-10T16:20:00Z",
    publishedAt: null,
    version: 1,
    diagnosticStrengths: "Eloquent civic discourse, deep understanding of the 1999 Nigerian Constitution provisions on separation of powers.",
    diagnosticGaps: "Understanding international treaties domestication mechanisms under Section 12.",
    recommendations: "Host a mock parliamentary debate on legislative oversight and constitutional amendments."
  }
];

export const INITIAL_SCORES = [
  // 1. For asm_math_midterm (max 30, Further Mathematics)
  { id: "scr_01", assessmentId: "asm_math_midterm", studentId: "stu_01", scoreValue: 27.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Outstanding algebraic derivation and rapid calculus problem solving." },
  { id: "scr_02", assessmentId: "asm_math_midterm", studentId: "stu_02", scoreValue: 24.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Good conceptual clarity; improve precision in coordinate geometry proofs." },
  { id: "scr_03", assessmentId: "asm_math_midterm", studentId: "stu_03", scoreValue: 29.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Highest score in cohort! Flawless execution across both Section A and B." },
  { id: "scr_04", assessmentId: "asm_math_midterm", studentId: "stu_04", scoreValue: 21.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Commendable effort. Additional practice recommended on polynomial remainder theorem." },
  { id: "scr_05", assessmentId: "asm_math_midterm", studentId: "stu_05", scoreValue: 19.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Solid foundation; focus on quadratic formula discriminant derivations." },

  // 2. For asm_physics_ca2 (max 20, Pure Physics Lab)
  { id: "scr_06", assessmentId: "asm_physics_ca2", studentId: "stu_01", scoreValue: 18.0, scoreStatus: "scored", workflowStatus: "published", version: 2, remark: "Superb circuit assembly and pin tracing on optical refraction prism." },
  { id: "scr_07", assessmentId: "asm_physics_ca2", studentId: "stu_02", scoreValue: 16.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Careful experimental observations; verify gradient unit calculation." },
  { id: "scr_08", assessmentId: "asm_physics_ca2", studentId: "stu_03", scoreValue: 19.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Top-tier laboratory report write-up with zero apparatus handling errors." },
  { id: "scr_09", assessmentId: "asm_physics_ca2", studentId: "stu_04", scoreValue: 15.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Satisfactory optical alignment; take multiple parallax readings." },
  { id: "scr_10", assessmentId: "asm_physics_ca2", studentId: "stu_05", scoreValue: 17.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Strong experimental grasp; careful calculation of electric resistance slope." },

  // 3. For asm_english_essay (max 40, English Literature)
  { id: "scr_11", assessmentId: "asm_english_essay", studentId: "stu_01", scoreValue: 34.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Compelling analytical voice and rich diction in literary comparison." },
  { id: "scr_12", assessmentId: "asm_english_essay", studentId: "stu_02", scoreValue: 38.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Cohort best essay! Elegant prose structure with incisive character critiques." },
  { id: "scr_13", assessmentId: "asm_english_essay", studentId: "stu_03", scoreValue: 35.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Very expressive writing with persuasive textual evidence and citations." },
  { id: "scr_14", assessmentId: "asm_english_essay", studentId: "stu_04", scoreValue: 28.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Good narrative grasp; work on thesis sentence clarity in introduction." },
  { id: "scr_15", assessmentId: "asm_english_essay", studentId: "stu_05", scoreValue: 31.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Thoughtful reflections; improve paragraph transitions in body arguments." },

  // 4. For asm_chem_titration (max 25, Inorganic Chemistry Lab)
  { id: "scr_16", assessmentId: "asm_chem_titration", studentId: "stu_01", scoreValue: 23.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Precise burette meniscus readings and clean acid-base neutralization curve." },
  { id: "scr_17", assessmentId: "asm_chem_titration", studentId: "stu_02", scoreValue: 22.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Consistent titre volumes across all three trials; very tidy bench work." },
  { id: "scr_18", assessmentId: "asm_chem_titration", studentId: "stu_03", scoreValue: 24.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Exemplary chemical stoichiometry calculations with accurate molarity values." },
  { id: "scr_19", assessmentId: "asm_chem_titration", studentId: "stu_04", scoreValue: 18.5, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Safe handling of hydrochloric acid; practice converting cm³ to dm³." },
  { id: "scr_20", assessmentId: "asm_chem_titration", studentId: "stu_05", scoreValue: 20.0, scoreStatus: "scored", workflowStatus: "published", version: 1, remark: "Good understanding of indicator colour transition kinetics." },

  // 5. For asm_bio_genetics (max 30, Biological Sciences)
  { id: "scr_21", assessmentId: "asm_bio_genetics", studentId: "stu_01", scoreValue: 26.0, scoreStatus: "scored", workflowStatus: "under_review", version: 1, remark: "Skilled Punnett grid calculation for heterozygous blood genotype ratios." },
  { id: "scr_22", assessmentId: "asm_bio_genetics", studentId: "stu_02", scoreValue: 27.5, scoreStatus: "scored", workflowStatus: "under_review", version: 1, remark: "Accurate genetic ratio analysis with clear chromosome diagrams." },
  { id: "scr_23", assessmentId: "asm_bio_genetics", studentId: "stu_03", scoreValue: 28.5, scoreStatus: "scored", workflowStatus: "under_review", version: 1, remark: "Top biology score; deep understanding of sex-linked haemophilia traits." },
  { id: "scr_24", assessmentId: "asm_bio_genetics", studentId: "stu_04", scoreValue: 22.0, scoreStatus: "scored", workflowStatus: "under_review", version: 1, remark: "Good grasp of dominant alleles; review dihybrid cross phenotypic ratios." },
  { id: "scr_25", assessmentId: "asm_bio_genetics", studentId: "stu_05", scoreValue: 24.0, scoreStatus: "scored", workflowStatus: "under_review", version: 1, remark: "Strong cell division theory; clear explanation of meiotic gametogenesis." },

  // 6. For asm_civic_governance (max 50, Civic Education)
  { id: "scr_26", assessmentId: "asm_civic_governance", studentId: "stu_01", scoreValue: 46.0, scoreStatus: "scored", workflowStatus: "approved", version: 1, remark: "Exceptional oral defense on constitutional checks and balances." },
  { id: "scr_27", assessmentId: "asm_civic_governance", studentId: "stu_02", scoreValue: 44.5, scoreStatus: "scored", workflowStatus: "approved", version: 1, remark: "Very articulate analysis of fundamental human rights enforcement in courts." },
  { id: "scr_28", assessmentId: "asm_civic_governance", studentId: "stu_03", scoreValue: 48.0, scoreStatus: "scored", workflowStatus: "approved", version: 1, remark: "Outstanding research paper citing Supreme Court precedent on federalism." },
  { id: "scr_29", assessmentId: "asm_civic_governance", studentId: "stu_04", scoreValue: 41.0, scoreStatus: "scored", workflowStatus: "approved", version: 1, remark: "Thoughtful presentation on anti-corruption agencies and civic duties." },
  { id: "scr_30", assessmentId: "asm_civic_governance", studentId: "stu_05", scoreValue: 43.5, scoreStatus: "scored", workflowStatus: "approved", version: 1, remark: "Solid critique of electoral process integrity and voter registration rights." }
];

export const INITIAL_CORRECTIONS = [
  {
    id: "cor_01",
    scoreId: "scr_06",
    assessmentTitle: "Continuous Assessment 2: Electromagnetism & Optics",
    studentName: "Chinedu Eze",
    oldScoreValue: 16.0,
    proposedScoreValue: 18.0,
    oldScoreStatus: "scored",
    proposedScoreStatus: "scored",
    reason: "Re-computation error on question 3b practical experiment ledger. Verified with original answer sheet.",
    requestedBy: "Mrs. Ngozi Okonjo",
    requestedAt: "2026-10-06T15:20:00Z",
    status: "approved",
    approvedBy: "Dr. Babatunde Adeleke",
    decidedAt: "2026-10-07T09:12:00Z",
    decisionNote: "Script re-examined. Marking confirmed 2 marks discrepancy."
  }
];

export const INITIAL_ATTENDANCE = [
  {
    id: "att_01",
    date: "2026-10-12",
    classId: "cls_ss2_diamond",
    records: [
      { studentId: "stu_01", status: "present", time: "07:48 AM" },
      { studentId: "stu_02", status: "present", time: "07:52 AM" },
      { studentId: "stu_03", status: "present", time: "07:45 AM" },
      { studentId: "stu_04", status: "late", time: "08:15 AM", reason: "Traffic on Third Mainland Bridge" },
      { studentId: "stu_05", status: "present", time: "07:55 AM" }
    ],
    recordedBy: "Mrs. Ngozi Okonjo",
    finalizedAt: "2026-10-12T08:30:00Z"
  },
  {
    id: "att_02",
    date: "2026-10-11",
    classId: "cls_ss2_diamond",
    records: [
      { studentId: "stu_01", status: "present", time: "07:50 AM" },
      { studentId: "stu_02", status: "excused", reason: "Medical Appointment with Hospital Note" },
      { studentId: "stu_03", status: "present", time: "07:44 AM" },
      { studentId: "stu_04", status: "present", time: "07:51 AM" },
      { studentId: "stu_05", status: "present", time: "07:58 AM" }
    ],
    recordedBy: "Mrs. Ngozi Okonjo",
    finalizedAt: "2026-10-11T08:30:00Z"
  }
];

export const INITIAL_TIMETABLE = [
  { day: "Monday", period: "08:00 - 08:45", subject: "Further Mathematics", class: "SS 2 - Diamond", teacher: "Mrs. Ngozi Okonjo", room: "Lab 2" },
  { day: "Monday", period: "08:45 - 09:30", subject: "Pure Physics", class: "SS 2 - Diamond", teacher: "Mrs. Ngozi Okonjo", room: "Physics Lab" },
  { day: "Monday", period: "09:30 - 10:15", subject: "English Language", class: "SS 2 - Diamond", teacher: "Mrs. Fatima Garba", room: "Hall B" },
  { day: "Tuesday", period: "08:00 - 08:45", subject: "Inorganic Chemistry", class: "SS 2 - Diamond", teacher: "Mr. Tunde Lawal", room: "Chem Lab" },
  { day: "Tuesday", period: "08:45 - 09:30", subject: "Further Mathematics", class: "SS 2 - Diamond", teacher: "Mrs. Ngozi Okonjo", room: "Lab 2" },
  { day: "Wednesday", period: "10:30 - 11:15", subject: "Pure Physics Practical", class: "SS 2 - Diamond", teacher: "Mrs. Ngozi Okonjo", room: "Physics Lab" }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "anc_01",
    title: "Mid-Term Examination & Result Moderation Schedule",
    body: "All subject teachers are reminded that the moderation window for Continuous Assessments closes on Friday. Report card drafts will be released to the Academic Board on Monday.",
    audience: "All Staff & Parents",
    priority: "high",
    publishedAt: "2026-10-10T08:00:00Z",
    author: "Dr. Babatunde Adeleke, Head Teacher"
  },
  {
    id: "anc_02",
    title: "Parent-Teacher Academic Progress Consultation (PTC)",
    body: "Parent consultation sessions for SS2 students will be held on Thursday, October 22nd. Parents can view the time slots in their portal child dashboard.",
    audience: "Parents & Students",
    priority: "normal",
    publishedAt: "2026-10-08T10:15:00Z",
    author: "Administration Secretariat"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud_01",
    occurredAt: "2026-10-12T13:45:10Z",
    actor: "Dr. Babatunde Adeleke",
    actorRole: "HEAD_TEACHER",
    action: "auth.login.success",
    resourceType: "user_session",
    resourceId: "usr_head_teacher",
    outcome: "success",
    correlationId: "c7f1e4b9-8a21-4f11-b209-1123a4891101",
    ipAddress: "102.89.23.104 (Lagos, NG)"
  },
  {
    id: "aud_02",
    occurredAt: "2026-10-10T14:32:00Z",
    actor: "Mrs. Ngozi Okonjo",
    actorRole: "TEACHER",
    action: "result.submit",
    resourceType: "assessment",
    resourceId: "asm_math_midterm",
    outcome: "success",
    correlationId: "4b9e28fa-6712-4c22-9214-99b0c24231b7",
    ipAddress: "197.210.55.12 (Lagos, NG)"
  },
  {
    id: "aud_03",
    occurredAt: "2026-10-07T09:12:35Z",
    actor: "Dr. Babatunde Adeleke",
    actorRole: "HEAD_TEACHER",
    action: "result.correction.approve",
    resourceType: "result_correction",
    resourceId: "cor_01",
    outcome: "success",
    correlationId: "89aef412-11bc-4e33-8871-33cb66228800",
    ipAddress: "102.89.23.104 (Lagos, NG)"
  },
  {
    id: "aud_04",
    occurredAt: "2026-10-05T10:00:15Z",
    actor: "Dr. Babatunde Adeleke",
    actorRole: "HEAD_TEACHER",
    action: "result.publish",
    resourceType: "assessment",
    resourceId: "asm_physics_ca2",
    outcome: "success",
    correlationId: "33df4510-aa89-4112-b903-882200114433",
    ipAddress: "102.89.23.104 (Lagos, NG)"
  }
];

export const INITIAL_SECURITY_ALERTS = [
  {
    id: "sec_01",
    eventType: "MFA_CHALLENGE_RATE_LIMIT",
    severity: "low",
    alertStatus: "triaged",
    occurredAt: "2026-10-11T19:22:00Z",
    actorEmail: "external_probe@suspicious.net",
    details: "Multiple invalid OTP attempts on recovery gateway throttled by IP rate limiter."
  },
  {
    id: "sec_02",
    eventType: "PERMISSION_DENIED_ATTEMPT",
    severity: "medium",
    alertStatus: "contained",
    occurredAt: "2026-10-09T14:10:00Z",
    actorEmail: "student@apexcrest.edu.ng",
    details: "Unprivileged direct PUT invocation attempted on /api/v1/assessments/asm_math_midterm/publish. Request rejected with 403 FORBIDDEN."
  }
];
