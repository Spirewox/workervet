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
    is_certified: false,
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

// In-memory entitlements (reset on page reload).
const purchasedTrainings = new Set<string>();
const purchasedCertificates = new Set<string>();

const paginate = <T,>(items: T[]) => ({
  data: items,
  meta: { page: 1, limit: items.length, total: items.length, totalPages: 1 },
});

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

  // ---- POST/PATCH/etc ----
  if (method !== "get") {
    const trainingPurchase = path.match(/^training\/(.+)\/purchase$/);
    if (trainingPurchase) purchasedTrainings.add(decodeURIComponent(trainingPurchase[1]));
    const certPurchase = path.match(/^assessment\/(.+)\/certificate\/purchase$/);
    if (certPurchase) purchasedCertificates.add(decodeURIComponent(certPurchase[1]));
    return { success: true };
  }

  // ---- GET (order: most specific first) ----
  if (path === "auth/whoami") return { data: user };
  if (path === "assessment/candidate/metrics") return candidateMetrics;
  if (/^assessment\/candidate\/[^/]+\/skills$/.test(path)) return candidateSkills;
  if (path === "assessment/certificates")
    return { unlocked: Array.from(purchasedCertificates) };
  if (path === "assessment/candidate") return candidateAssessments;
  if (path === "departments") return departments;
  if (path === "skills") return candidateSkills.skills;

  if (path === "training/access") return { unlocked: Array.from(purchasedTrainings) };

  const training = path.match(/^training\/(.+)$/);
  if (training) return getTrainingCourse(decodeURIComponent(training[1]));

  if (path === "jobs/application") return paginate(applications);

  if (path === "jobs") {
    const search = (params.get("search") || "").toLowerCase();
    const dept = params.get("department") || "";
    let filtered = jobs;
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
