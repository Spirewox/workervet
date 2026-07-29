// Dev-only mock layer. Installs a custom axios adapter that answers the
// candidate-facing endpoints with realistic sample data so the UI can be
// reviewed without a backend. Activated only when VITE_USE_MOCKS === "true"
// (see main.tsx). Safe to delete; not part of the production flow.
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getTrainingCourse } from "./trainingContent";

const departments = [
  { _id: "dept-care", department_name: "Patient Care", is_active: true },
  { _id: "dept-ops", department_name: "Operations", is_active: true },
  { _id: "dept-admin", department_name: "Administration", is_active: true },
];

const deptById = Object.fromEntries(departments.map((d) => [d._id, d]));

const user = {
  _id: "cand-1",
  full_name: "Ada Candidate",
  email: "ada@example.com",
  phone: "+1 555 0100",
  role: "candidate",
  status: "active",
  target_department: "Patient Care",
  cv: { filename: "ada-cv.pdf", url: "#" },
};

const jobs = [
  {
    _id: "job-1",
    job_title: "Care Assistant",
    job_description:
      "Support residents with daily living, dignity, and compassionate hands-on care in a busy facility.",
    department: deptById["dept-care"],
    location: "Manchester, UK",
    salary_range: "£24k–£28k",
    is_active: true,
    is_certified: true,
    is_applied: true,
  },
  {
    _id: "job-2",
    job_title: "Operations Coordinator",
    job_description:
      "Keep the floor running — scheduling, supplies, and smooth handoffs between shifts and teams.",
    department: deptById["dept-ops"],
    location: "Leeds, UK",
    salary_range: "£30k–£34k",
    is_active: true,
    is_certified: false,
    is_applied: false,
  },
  {
    _id: "job-3",
    job_title: "Front Desk Administrator",
    job_description:
      "First point of contact: greet visitors, manage records, and handle confidential information with care.",
    department: deptById["dept-admin"],
    location: "Remote",
    salary_range: "£22k–£26k",
    is_active: true,
    is_certified: true,
    is_applied: true,
  },
  {
    _id: "job-4",
    job_title: "Senior Care Worker",
    job_description:
      "Lead a small team, mentor new starters, and uphold the highest standards of trust and integrity.",
    department: deptById["dept-care"],
    location: "Birmingham, UK",
    salary_range: "£28k–£32k",
    is_active: true,
    is_certified: true,
    is_applied: false,
  },
];

// Per-application records, with embedded per-job results where available.
const applications = [
  {
    _id: "app-1",
    job: jobs[0],
    status: "under_review",
    createdAt: "2026-05-28T10:00:00.000Z",
    assessment: {
      assessment_id: "as-1",
      score: "9/10",
      percentage: 90,
      result: "pass",
      status: "submitted",
      submitted_at: "2026-05-27T14:30:00.000Z",
      skills: [
        { skill_name: "Trust", percentage: 92 },
        { skill_name: "Integrity", percentage: 88 },
        { skill_name: "Ethics", percentage: 90 },
        { skill_name: "Communication", percentage: 88 },
      ],
    },
  },
  {
    _id: "app-2",
    job: jobs[2],
    status: "pending",
    createdAt: "2026-06-02T09:15:00.000Z",
    assessment: {
      assessment_id: "as-2",
      score: "4/10",
      percentage: 48,
      result: "fail",
      status: "submitted",
      submitted_at: "2026-06-01T16:05:00.000Z",
      skills: [
        { skill_name: "Trust", percentage: 60 },
        { skill_name: "Integrity", percentage: 55 },
        { skill_name: "Ethics", percentage: 40 },
        { skill_name: "Communication", percentage: 38 },
      ],
    },
  },
  {
    _id: "app-3",
    job: jobs[1],
    status: "shortlisted",
    createdAt: "2026-06-08T11:40:00.000Z",
    // no embedded result -> falls back to department-level assessment below
  },
];

// Candidate's department-level assessment results.
const candidateAssessments = [
  {
    assessment_id: "as-1",
    department: { _id: "dept-care", name: "Patient Care" },
    score: "9/10",
    percentage: 90,
    result: "pass",
    status: "submitted",
    submitted_at: "2026-05-27T14:30:00.000Z",
    expires_at: "2027-05-27T14:30:00.000Z",
    skills: [
      { skill_name: "Trust", percentage: 92 },
      { skill_name: "Integrity", percentage: 88 },
      { skill_name: "Ethics", percentage: 90 },
      { skill_name: "Communication", percentage: 88 },
    ],
  },
  {
    assessment_id: "as-2",
    department: { _id: "dept-admin", name: "Administration" },
    score: "4/10",
    percentage: 48,
    result: "fail",
    status: "submitted",
    submitted_at: "2026-06-01T16:05:00.000Z",
    expires_at: "2027-06-01T16:05:00.000Z",
    skills: [
      { skill_name: "Trust", percentage: 60 },
      { skill_name: "Integrity", percentage: 55 },
      { skill_name: "Ethics", percentage: 40 },
      { skill_name: "Communication", percentage: 38 },
    ],
  },
  {
    assessment_id: "as-3",
    department: { _id: "dept-ops", name: "Operations" },
    score: "6/10",
    percentage: 62,
    result: "fail",
    status: "submitted",
    submitted_at: "2026-06-09T12:00:00.000Z",
    expires_at: "2027-06-09T12:00:00.000Z",
    skills: [
      { skill_name: "Trust", percentage: 72 },
      { skill_name: "Integrity", percentage: 68 },
      { skill_name: "Ethics", percentage: 58 },
      { skill_name: "Communication", percentage: 50 },
    ],
  },
];

const candidateMetrics = {
  departments_verified: 1,
  assessments_passed: 1,
  active_assessments: 2,
};

const candidateSkills = {
  candidate_id: "cand-1",
  candidate_name: "Ada Candidate",
  total_assessments: 3,
  pass_rate: 33,
  avg_score: 67,
  skills: [
    { skill_id: "sk-trust", skill_name: "Trust", percentage: 88 },
    { skill_id: "sk-integrity", skill_name: "Integrity", percentage: 81 },
    { skill_id: "sk-ethics", skill_name: "Ethics", percentage: 52 },
    { skill_id: "sk-comm", skill_name: "Communication", percentage: 45 },
    { skill_id: "sk-prof", skill_name: "Professionalism", percentage: 64 },
  ],
};

// ---------------------------------------------------------------------------
// Admin-side sample data
// ---------------------------------------------------------------------------

// The admin surface is gated on role. Rather than add a second login to the
// mock, whoami reports an admin whenever the browser is on an /admin route.
// Dev-only convenience — the real backend must decide this from the session.
const adminUser = {
  _id: "admin-1",
  full_name: "Morgan Reid",
  email: "morgan@workervet.example",
  phone: "+44 20 7946 0000",
  role: "admin",
  status: "active",
};

const dashboardMetrics = {
  totalCandidates: 7,
  totalCandidatesMoM: 12,
  assessmentsTaken: 23,
  assessmentsPassed: 14,
  passRateMoM: -4,
  avgPassRate: 61,
  activeJobsCount: 4,
};

const departmentPassRates = [
  { department_name: "Patient Care", percentage: 72, total_people: 11, total_passed: 8 },
  { department_name: "Operations", percentage: 57, total_people: 7, total_passed: 4 },
  { department_name: "Administration", percentage: 40, total_people: 5, total_passed: 2 },
];

const globalSkills = [
  { skill_id: "sk-trust", skill_name: "Trust", average_percentage: 78 },
  { skill_id: "sk-integrity", skill_name: "Integrity", average_percentage: 74 },
  { skill_id: "sk-prof", skill_name: "Professionalism", average_percentage: 66 },
  { skill_id: "sk-ethics", skill_name: "Ethics", average_percentage: 54 },
  { skill_id: "sk-comm", skill_name: "Communication", average_percentage: 49 },
];

const recentAssessments = [
  { participant_name: "Ada Candidate", job_department: "Operations", percentage: 62, result: "fail", submitted_at: "2026-06-09T12:00:00.000Z" },
  { participant_name: "Tom Okafor", job_department: "Patient Care", percentage: 88, result: "pass", submitted_at: "2026-06-09T09:20:00.000Z" },
  { participant_name: "Priya Raman", job_department: "Administration", percentage: 45, result: "fail", submitted_at: "2026-06-08T17:05:00.000Z" },
  { participant_name: "Luis Ferreira", job_department: "Patient Care", percentage: 91, result: "pass", submitted_at: "2026-06-08T11:32:00.000Z" },
  { participant_name: "Grace Mensah", job_department: "Operations", percentage: 76, result: "pass", submitted_at: "2026-06-07T15:48:00.000Z" },
  { participant_name: "Ada Candidate", job_department: "Administration", percentage: 48, result: "fail", submitted_at: "2026-06-01T16:05:00.000Z" },
];

const candidateRoster = [
  {
    _id: "cand-1",
    full_name: "Ada Candidate",
    email: "ada@example.com",
    phone: "+44 7700 900100",
    target_department: deptById["dept-care"],
    cv: { filename: "ada-cv.pdf", url: "#" },
    recent_activity: { department_name: "Operations", result: "fail", submitted_at: "2026-06-09T12:00:00.000Z" },
  },
  {
    _id: "cand-2",
    full_name: "Tom Okafor",
    email: "tom.okafor@example.com",
    phone: "+44 7700 900101",
    target_department: deptById["dept-care"],
    cv: { filename: "t-okafor.pdf", url: "#" },
    recent_activity: { department_name: "Patient Care", result: "pass", submitted_at: "2026-06-09T09:20:00.000Z" },
  },
  {
    _id: "cand-3",
    full_name: "Priya Raman",
    email: "priya.raman@example.com",
    phone: "+44 7700 900102",
    target_department: deptById["dept-admin"],
    cv: { filename: "praman-cv.pdf", url: "#" },
    recent_activity: { department_name: "Administration", result: "fail", submitted_at: "2026-06-08T17:05:00.000Z" },
  },
  {
    _id: "cand-4",
    full_name: "Luis Ferreira",
    email: "luis.f@example.com",
    phone: "+44 7700 900103",
    target_department: deptById["dept-care"],
    cv: { filename: "luis-ferreira.pdf", url: "#" },
    recent_activity: { department_name: "Patient Care", result: "pass", submitted_at: "2026-06-08T11:32:00.000Z" },
  },
  {
    _id: "cand-5",
    full_name: "Grace Mensah",
    email: "g.mensah@example.com",
    phone: "+44 7700 900104",
    target_department: deptById["dept-ops"],
    cv: { filename: "gmensah.pdf", url: "#" },
    recent_activity: { department_name: "Operations", result: "pass", submitted_at: "2026-06-07T15:48:00.000Z" },
  },
  {
    _id: "cand-6",
    full_name: "Ben Whitfield",
    email: "ben.w@example.com",
    phone: "+44 7700 900105",
    target_department: deptById["dept-ops"],
    cv: { filename: "bwhitfield.pdf", url: "#" },
    recent_activity: { department_name: "Operations", result: "fail", submitted_at: "2026-06-05T10:12:00.000Z" },
  },
  {
    _id: "cand-7",
    full_name: "Sara Ellis",
    email: "sara.ellis@example.com",
    phone: "+44 7700 900106",
    target_department: deptById["dept-admin"],
    cv: { filename: "sellis-cv.pdf", url: "#" },
    recent_activity: { department_name: "Administration", result: "pass", submitted_at: "2026-06-04T14:00:00.000Z" },
  },
];

// Per-candidate skill profiles, keyed by id. Falls back to Ada's profile so an
// unknown id still renders rather than 404-ing the detail page.
const skillsByCandidate: Record<string, typeof candidateSkills> = {
  "cand-1": candidateSkills,
  "cand-2": {
    candidate_id: "cand-2", candidate_name: "Tom Okafor",
    total_assessments: 2, pass_rate: 100, avg_score: 86,
    skills: [
      { skill_id: "sk-trust", skill_name: "Trust", percentage: 91 },
      { skill_id: "sk-integrity", skill_name: "Integrity", percentage: 89 },
      { skill_id: "sk-ethics", skill_name: "Ethics", percentage: 84 },
      { skill_id: "sk-comm", skill_name: "Communication", percentage: 80 },
      { skill_id: "sk-prof", skill_name: "Professionalism", percentage: 85 },
    ],
  },
  "cand-3": {
    candidate_id: "cand-3", candidate_name: "Priya Raman",
    total_assessments: 2, pass_rate: 0, avg_score: 46,
    skills: [
      { skill_id: "sk-trust", skill_name: "Trust", percentage: 58 },
      { skill_id: "sk-integrity", skill_name: "Integrity", percentage: 51 },
      { skill_id: "sk-ethics", skill_name: "Ethics", percentage: 39 },
      { skill_id: "sk-comm", skill_name: "Communication", percentage: 35 },
      { skill_id: "sk-prof", skill_name: "Professionalism", percentage: 47 },
    ],
  },
};

const historyByCandidate: Record<string, unknown[]> = {
  "cand-1": [
    { date: "2026-06-09T12:00:00.000Z", job_name: "Operations Coordinator", department_name: "Operations", score: "6/10", percentage: 62, result: "fail" },
    { date: "2026-06-01T16:05:00.000Z", job_name: "Front Desk Administrator", department_name: "Administration", score: "4/10", percentage: 48, result: "fail" },
    { date: "2026-05-27T14:30:00.000Z", job_name: "Care Assistant", department_name: "Patient Care", score: "9/10", percentage: 90, result: "pass" },
  ],
  "cand-2": [
    { date: "2026-06-09T09:20:00.000Z", job_name: "Care Assistant", department_name: "Patient Care", score: "9/10", percentage: 88, result: "pass" },
    { date: "2026-05-20T10:00:00.000Z", job_name: "Senior Care Worker", department_name: "Patient Care", score: "8/10", percentage: 84, result: "pass" },
  ],
  "cand-3": [
    { date: "2026-06-08T17:05:00.000Z", job_name: "Front Desk Administrator", department_name: "Administration", score: "4/10", percentage: 45, result: "fail" },
    { date: "2026-05-14T13:20:00.000Z", job_name: "Front Desk Administrator", department_name: "Administration", score: "5/10", percentage: 47, result: "fail" },
  ],
};

// ---------------------------------------------------------------------------
// Mutable admin-managed stores (reset on page reload). These back the admin
// CRUD screens so create/edit/delete actually persist for the session.
// ---------------------------------------------------------------------------
const uid = () => Math.random().toString(36).slice(2, 10);

// Skill entities ({ _id, skill_name, is_active }) — distinct from the
// per-candidate skill *scores* served elsewhere.
const skillEntities = [
  { _id: "sk-trust", skill_name: "Trust", is_active: true },
  { _id: "sk-integrity", skill_name: "Integrity", is_active: true },
  { _id: "sk-ethics", skill_name: "Ethics", is_active: true },
  { _id: "sk-comm", skill_name: "Communication", is_active: true },
  { _id: "sk-prof", skill_name: "Professionalism", is_active: true },
];

type MockQuestion = {
  _id: string;
  skill_category: string;
  department: string;
  scenario?: string;
  question_text: string;
  time_seconds: number;
  options: { _id: string; content: string }[];
  correct_option_index: number;
};

const mkOptions = (contents: string[]) =>
  contents.map((content) => ({ _id: uid(), content }));

// Question bank keyed by department id.
const questionsByDept: Record<string, MockQuestion[]> = {
  "dept-care": [
    {
      _id: "q-care-1",
      skill_category: "sk-trust",
      department: "dept-care",
      scenario: "A resident asks you not to tell their family about a fall.",
      question_text: "What is the most appropriate first action?",
      time_seconds: 30,
      options: mkOptions([
        "Agree and keep it private",
        "Log the incident and follow safeguarding policy",
        "Tell the family immediately without recording it",
        "Ignore it if they seem fine",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-care-2",
      skill_category: "sk-comm",
      department: "dept-care",
      question_text: "A colleague hands over a task without clear instructions. You should:",
      time_seconds: 25,
      options: mkOptions([
        "Guess and proceed",
        "Ask clarifying questions before starting",
        "Skip the task",
        "Wait until someone notices",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-care-3",
      skill_category: "sk-integrity",
      department: "dept-care",
      scenario: "You realise you gave a resident the wrong medication dose, but no harm seems to have occurred.",
      question_text: "What should you do?",
      time_seconds: 30,
      options: mkOptions([
        "Say nothing since there was no harm",
        "Report it immediately and document the error",
        "Fix it quietly next time",
        "Ask the resident not to mention it",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-care-4",
      skill_category: "sk-ethics",
      department: "dept-care",
      scenario: "A family member offers you a generous cash tip for taking extra care of their relative.",
      question_text: "The most appropriate response is to:",
      time_seconds: 25,
      options: mkOptions([
        "Accept it discreetly",
        "Politely decline and explain your duty of care",
        "Accept and share it with the team",
        "Accept only if no one is watching",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-care-5",
      skill_category: "sk-prof",
      department: "dept-care",
      question_text: "You are running late for your shift for the third time this week. You should:",
      time_seconds: 20,
      options: mkOptions([
        "Say nothing and hope no one notices",
        "Notify your supervisor early and address the cause",
        "Blame traffic each time",
        "Leave early to make up for it",
      ]),
      correct_option_index: 1,
    },
  ],
  "dept-ops": [
    {
      _id: "q-ops-1",
      skill_category: "sk-integrity",
      department: "dept-ops",
      question_text: "You notice a supplier invoice has been double-counted. You:",
      time_seconds: 30,
      options: mkOptions([
        "Leave it — not your job",
        "Flag it to finance and correct the record",
        "Quietly adjust the stock instead",
        "Wait for an audit",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-ops-2",
      skill_category: "sk-comm",
      department: "dept-ops",
      scenario: "Two teams give you conflicting instructions for the same delivery.",
      question_text: "The best course of action is to:",
      time_seconds: 25,
      options: mkOptions([
        "Pick one and hope it's right",
        "Bring both teams together to clarify and agree",
        "Do nothing until they sort it out",
        "Follow whoever is more senior without checking",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-ops-3",
      skill_category: "sk-prof",
      department: "dept-ops",
      question_text: "A key supply will run out before the next delivery. You should:",
      time_seconds: 25,
      options: mkOptions([
        "Wait and see if anyone notices",
        "Escalate early and propose an interim plan",
        "Ration it silently",
        "Blame the supplier",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-ops-4",
      skill_category: "sk-trust",
      department: "dept-ops",
      scenario: "A teammate asks you to clock them in before they arrive.",
      question_text: "You should:",
      time_seconds: 20,
      options: mkOptions([
        "Do it — they'd do the same for you",
        "Decline; it falsifies records",
        "Do it just this once",
        "Ask someone else to do it",
      ]),
      correct_option_index: 1,
    },
  ],
  "dept-admin": [
    {
      _id: "q-admin-1",
      skill_category: "sk-ethics",
      department: "dept-admin",
      question_text: "A visitor asks for another person's records. The correct response is to:",
      time_seconds: 20,
      options: mkOptions([
        "Share them to be helpful",
        "Verify authorisation before disclosing anything",
        "Refuse without explanation",
        "Ask a colleague to share them",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-admin-2",
      skill_category: "sk-trust",
      department: "dept-admin",
      scenario: "You find a document containing sensitive staff data left on a shared printer.",
      question_text: "What should you do?",
      time_seconds: 25,
      options: mkOptions([
        "Leave it for its owner",
        "Secure it and return it to the responsible person",
        "Read it to find the owner",
        "Throw it away",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-admin-3",
      skill_category: "sk-comm",
      department: "dept-admin",
      question_text: "A caller is frustrated and raising their voice. The best response is to:",
      time_seconds: 25,
      options: mkOptions([
        "Match their tone",
        "Stay calm, listen, and acknowledge the issue",
        "Hang up",
        "Put them on hold indefinitely",
      ]),
      correct_option_index: 1,
    },
    {
      _id: "q-admin-4",
      skill_category: "sk-integrity",
      department: "dept-admin",
      question_text: "You spot a data-entry mistake you made last week. You should:",
      time_seconds: 20,
      options: mkOptions([
        "Hope it goes unnoticed",
        "Correct it and inform anyone affected",
        "Overwrite it quietly",
        "Wait for someone to flag it",
      ]),
      correct_option_index: 1,
    },
  ],
};

// Roster with a mutable status the admin can toggle.
const roster = candidateRoster.map((c) => ({ ...c, status: "active" as string }));

// In-memory entitlements (reset on page reload).
const purchasedTrainings = new Set<string>();
const purchasedCertificates = new Set<string>();

const paginate = <T,>(items: T[]) => ({
  data: items,
  meta: { page: 1, limit: items.length, total: items.length, totalPages: 1 },
});

// Slices a list the way a paginated endpoint would, so the admin roster can
// exercise real page/limit/search behaviour.
const paginateSlice = <T,>(items: T[], page: number, limit: number, search: string | null) => {
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page: current, limit, total: items.length, totalPages, search },
  };
};

const resolve = (config: InternalAxiosRequestConfig): unknown | undefined => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  // Path without origin/base or query string.
  const path = url
    .replace(/^https?:\/\/[^/]+/, "")
    .split("?")[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const params = new URLSearchParams(url.split("?")[1] || "");

  // ---- POST/PATCH/PUT/DELETE ----
  if (method !== "get") {
    const body: Record<string, unknown> = (() => {
      try {
        return typeof config.data === "string" && config.data ? JSON.parse(config.data) : {};
      } catch {
        return {};
      }
    })();

    // Purchases (existing behaviour)
    const trainingPurchase = path.match(/^training\/(.+)\/purchase$/);
    if (trainingPurchase) {
      purchasedTrainings.add(decodeURIComponent(trainingPurchase[1]));
      return { success: true };
    }
    const certPurchase = path.match(/^assessment\/(.+)\/certificate\/purchase$/);
    if (certPurchase) {
      purchasedCertificates.add(decodeURIComponent(certPurchase[1]));
      return { success: true };
    }

    // Candidate submits an assessment: POST assessment/:id/submit
    const submitMatch = path.match(/^assessment\/(.+)\/submit$/);
    if (submitMatch) {
      const assessmentId = decodeURIComponent(submitMatch[1]);
      const deptId = assessmentId.replace(/^as-/, "");
      const dept = deptById[deptId];
      const qs = questionsByDept[deptId] ?? [];
      const answers = (body.answers as { question: string; selected_option: string }[]) ?? [];
      let correct = 0;
      for (const q of qs) {
        const ans = answers.find((a) => a.question === q._id);
        if (ans && q.options[q.correct_option_index]?._id === ans.selected_option) correct++;
      }
      const total = qs.length || 1;
      const percentage = Math.round((correct / total) * 100);
      return {
        assessment_id: assessmentId,
        department_name: dept?.department_name ?? "Assessment",
        result: percentage >= 70 ? "pass" : "fail",
        percentage,
        total_score: correct,
        max_score: qs.length,
        jobId: null,
      };
    }

    const resolveDept = (d: unknown) =>
      typeof d === "string" ? deptById[d] : (d as (typeof departments)[number] | undefined);

    // ---- Jobs ----
    if (path === "jobs" && method === "post") {
      const job = {
        _id: uid(),
        job_title: (body.job_title as string) ?? "Untitled role",
        job_description: (body.job_description as string) ?? "",
        department: resolveDept(body.department) ?? departments[0],
        location: (body.location as string) ?? "",
        salary_range: (body.salary_range as string) ?? "",
        is_active: (body.is_active as boolean) ?? true,
        is_certified: (body.is_certified as boolean) ?? false,
        is_applied: false,
        application_count: 0,
      };
      jobs.push(job);
      return job;
    }
    // Candidate applies to a job.
    if (path === "jobs/application" && method === "post") {
      const jobId = body.job as string;
      const job = jobs.find((j) => j._id === jobId);
      if (job) {
        job.is_applied = true;
        applications.unshift({
          _id: uid(),
          job,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
      return { success: true };
    }
    const jobMatch = path.match(/^jobs\/(.+)$/);
    if (jobMatch) {
      const id = decodeURIComponent(jobMatch[1]);
      const idx = jobs.findIndex((j) => j._id === id);
      if (idx === -1) return undefined;
      if (method === "delete") {
        jobs.splice(idx, 1);
        return { success: true };
      }
      const dept = body.department !== undefined ? resolveDept(body.department) : jobs[idx].department;
      jobs[idx] = { ...jobs[idx], ...body, department: dept ?? jobs[idx].department };
      return jobs[idx];
    }

    // ---- Departments ----
    if (path === "departments" && method === "post") {
      const dep = {
        _id: uid(),
        department_name: (body.department_name as string) ?? "New department",
        is_active: (body.is_active as boolean) ?? true,
      };
      departments.push(dep);
      deptById[dep._id] = dep;
      return dep;
    }
    const depMatch = path.match(/^departments\/(.+)$/);
    if (depMatch) {
      const id = decodeURIComponent(depMatch[1]);
      const idx = departments.findIndex((d) => d._id === id);
      if (idx === -1) return undefined;
      if (method === "delete") {
        departments.splice(idx, 1);
        delete deptById[id];
        return { success: true };
      }
      departments[idx] = { ...departments[idx], ...body };
      deptById[id] = departments[idx];
      return departments[idx];
    }

    // ---- Skills ----
    if (path === "skills" && method === "post") {
      const sk = {
        _id: uid(),
        skill_name: (body.skill_name as string) ?? "New skill",
        is_active: (body.is_active as boolean) ?? true,
      };
      skillEntities.push(sk);
      return sk;
    }
    const skMatch = path.match(/^skills\/(.+)$/);
    if (skMatch) {
      const id = decodeURIComponent(skMatch[1]);
      const idx = skillEntities.findIndex((s) => s._id === id);
      if (idx === -1) return undefined;
      if (method === "delete") {
        skillEntities.splice(idx, 1);
        return { success: true };
      }
      skillEntities[idx] = { ...skillEntities[idx], ...body };
      return skillEntities[idx];
    }

    // ---- Questions ----
    const normOptions = (opts: unknown): { _id: string; content: string }[] =>
      Array.isArray(opts)
        ? opts.map((o) => ({
            _id: (o?._id as string) ?? uid(),
            content: (o?.content as string) ?? "",
          }))
        : [];

    if (path === "questions" && method === "post") {
      const dept = (body.department as string) ?? "";
      const q: MockQuestion = {
        _id: uid(),
        skill_category: (body.skill_category as string) ?? "",
        department: dept,
        scenario: body.scenario as string | undefined,
        question_text: (body.question_text as string) ?? "",
        time_seconds: (body.time_seconds as number) ?? 30,
        options: normOptions(body.options),
        correct_option_index: (body.correct_option_index as number) ?? 0,
      };
      (questionsByDept[dept] ||= []).push(q);
      return q;
    }
    const qMatch = path.match(/^questions\/(.+)$/);
    if (qMatch) {
      const id = decodeURIComponent(qMatch[1]);
      for (const dept of Object.keys(questionsByDept)) {
        const list = questionsByDept[dept];
        const idx = list.findIndex((q) => q._id === id);
        if (idx === -1) continue;
        if (method === "delete") {
          list.splice(idx, 1);
          return { success: true };
        }
        const nextDept = (body.department as string) ?? dept;
        const updated: MockQuestion = {
          ...list[idx],
          ...(body as Partial<MockQuestion>),
          department: nextDept,
          options: body.options !== undefined ? normOptions(body.options) : list[idx].options,
        };
        list.splice(idx, 1);
        (questionsByDept[nextDept] ||= []).push(updated);
        return updated;
      }
      return undefined;
    }

    // ---- Candidate status ----
    const userStatus = path.match(/^users\/(.+)\/status$/);
    if (userStatus) {
      const id = decodeURIComponent(userStatus[1]);
      const c = roster.find((r) => r._id === id);
      if (!c) return undefined;
      c.status = (body.status as string) ?? (c.status === "active" ? "inactive" : "active");
      return c;
    }

    return { success: true };
  }

  // ---- GET (order: most specific first) ----
  if (path === "auth/whoami") {
    const onAdminRoute =
      typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
    return { data: onAdminRoute ? adminUser : user };
  }

  // ---- Admin ----
  if (path === "assessment/metrics") return dashboardMetrics;
  if (path === "assessment/department/pass-rate") return departmentPassRates;
  if (path === "assessment/global/skills") return globalSkills;
  if (path === "assessment/recent") return recentAssessments;

  const history = path.match(/^assessment\/history\/(.+)$/);
  if (history) return historyByCandidate[decodeURIComponent(history[1])] ?? [];

  if (path === "users/candidates/recent-activity") {
    const search = (params.get("search") || "").toLowerCase();
    const filtered = search
      ? roster.filter(
          (c) =>
            c.full_name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        )
      : roster;
    return paginateSlice(
      filtered,
      Number(params.get("page")) || 1,
      Number(params.get("limit")) || 5,
      params.get("search")
    );
  }

  if (path === "assessment/candidate/metrics") return candidateMetrics;
  const candSkills = path.match(/^assessment\/candidate\/([^/]+)\/skills$/);
  if (candSkills)
    return skillsByCandidate[decodeURIComponent(candSkills[1])] ?? candidateSkills;
  if (path === "assessment/certificates")
    return { unlocked: Array.from(purchasedCertificates) };
  if (path === "assessment/candidate") return candidateAssessments;

  // Candidate takes an assessment for a department: GET assessment/:deptId
  const takeAssessment = path.match(/^assessment\/([^/]+)$/);
  if (takeAssessment) {
    const deptId = decodeURIComponent(takeAssessment[1]);
    const dept = deptById[deptId];
    const qs = questionsByDept[deptId] ?? [];
    return {
      assessment_id: `as-${deptId}`,
      department_id: deptId,
      department_name: dept?.department_name ?? "Assessment",
      expires_at: null,
      total_questions: qs.length,
      questions: qs.map((q, i) => ({
        index: i,
        question_id: q._id,
        questionText: q.question_text,
        question_text: q.question_text,
        scenario: q.scenario ?? "",
        skill: q.skill_category,
        timeLimit: q.time_seconds,
        options: q.options,
      })),
    };
  }

  if (path === "departments") return departments;
  if (path === "skills") return skillEntities;

  // ---- Admin: question bank ----
  if (path === "departments/by-questions")
    return departments.map((d) => ({
      department_id: d._id,
      department_name: d.department_name,
      question_count: (questionsByDept[d._id] ?? []).length,
    }));

  const deptQuestions = path.match(/^questions\/department\/(.+)$/);
  if (deptQuestions) {
    const id = decodeURIComponent(deptQuestions[1]);
    const questions = questionsByDept[id] ?? [];
    return { department_id: id, total: questions.length, questions };
  }

  if (path === "training/access") return { unlocked: Array.from(purchasedTrainings) };

  const training = path.match(/^training\/(.+)$/);
  if (training) return getTrainingCourse(decodeURIComponent(training[1]));

  if (path === "jobs/application") return paginate(applications);

  if (path === "jobs") {
    const search = (params.get("search") || "").toLowerCase();
    const dept = params.get("department") || "";
    const jobParam = params.get("job") || "";
    let filtered = jobs;
    if (jobParam) filtered = filtered.filter((j) => j._id === jobParam);
    if (search)
      filtered = filtered.filter(
        (j) =>
          j.job_title.toLowerCase().includes(search) ||
          j.job_description.toLowerCase().includes(search)
      );
    if (dept) filtered = filtered.filter((j) => j.department._id === dept);
    return paginate(filtered);
  }

  return undefined;
};

export const installMockApi = () => {
  axios.defaults.adapter = async (config): Promise<AxiosResponse> => {
    const data = resolve(config as InternalAxiosRequestConfig);
    const base = {
      headers: config.headers,
      config: config as InternalAxiosRequestConfig,
      request: {},
    };
    if (data === undefined) {
      return Promise.reject({
        response: { status: 404, data: { message: "Not mocked" }, ...base },
        isAxiosError: true,
        config,
      });
    }
    // Small delay so loading states are visible.
    await new Promise((r) => setTimeout(r, 250));
    return { data, status: 200, statusText: "OK", ...base } as AxiosResponse;
  };
  // eslint-disable-next-line no-console
  console.info("[mockApi] installed — serving sample candidate data");
};
