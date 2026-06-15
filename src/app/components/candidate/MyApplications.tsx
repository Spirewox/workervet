import {
  Briefcase,
  MapPin,
  ArrowRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  ChevronDown,
  RotateCcw,
  GraduationCap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosPost } from "../../lib/api";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Department } from "../../interface/settings.interface";
import { useAuth } from "../../context/AuthContext";
import {
  ApplicationStatus,
  IApplication,
  IApplicationResult,
  useMyApplications,
} from "../../hooks/useApplications";
import { useCandidateAssessmentList } from "../../hooks/useDashboard";
import { useCandidateSkills } from "../../hooks/useCandidates";
import { CertificateAction } from "./CertificateAction";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const STATUS_META: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "outline" },
  under_review: { label: "Under Review", variant: "secondary" },
  shortlisted: { label: "Shortlisted", variant: "warning" },
  hired: { label: "Hired", variant: "success" },
  rejected: { label: "Not Selected", variant: "destructive" },
};

const formatDate = (value?: Date | string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const departmentId = (dept?: string | Department) =>
  typeof dept === "string" ? dept : dept?._id;

// Tailwind-friendly colour for a percentage score.
const scoreTone = (percentage: number) => {
  if (percentage >= 70) return { text: "text-emerald-600", bar: "[&_[data-slot=progress-indicator]]:bg-emerald-500" };
  if (percentage >= 40) return { text: "text-amber-600", bar: "[&_[data-slot=progress-indicator]]:bg-amber-500" };
  return { text: "text-red-600", bar: "[&_[data-slot=progress-indicator]]:bg-red-500" };
};

const ResultBreakdown = ({
  result,
  departmentId,
  courseTitle,
}: {
  result?: IApplicationResult;
  departmentId?: string;
  courseTitle?: string;
}) => {
  const navigate = useNavigate();
  const [retaking, setRetaking] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleRetake = async () => {
    if (!departmentId) return;
    try {
      setRetaking(true);
      await axiosPost(`assessment/candidate/departments/${departmentId}`, {}, true);
      navigate(`/assessment/${encodeURIComponent(departmentId)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't start the assessment");
    } finally {
      setRetaking(false);
    }
  };

  if (!result || (!result.submitted_at && result.status !== "in_progress")) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
        <p className="text-xs text-slate-500 mb-2">No assessment results yet for this role.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => departmentId && navigate(`/assessment/${encodeURIComponent(departmentId)}`)}
          disabled={!departmentId}
        >
          Take Assessment
        </Button>
      </div>
    );
  }

  const passed = result.result === "pass";
  const inProgress = result.status === "in_progress" && !result.submitted_at;
  const tone = scoreTone(result.percentage ?? 0);

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Assessment Result
        </span>
        {inProgress ? (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </Badge>
        ) : passed ? (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" /> Passed
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" /> Not Passed
          </Badge>
        )}
      </div>

      {!inProgress && (
        <>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Score</p>
              <p className="text-sm font-semibold text-slate-700">{result.score || "—"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Accuracy</p>
              <p className={`text-2xl font-black ${tone.text}`}>{result.percentage ?? 0}%</p>
            </div>
          </div>
          <Progress value={result.percentage ?? 0} className={tone.bar} />
        </>
      )}

      {result.submitted_at && (
        <p className="text-[11px] text-slate-400">Submitted {formatDate(result.submitted_at)}</p>
      )}

      {!inProgress && !!result.skills?.length && (
        <div>
          <button
            onClick={() => setShowBreakdown((s) => !s)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
            {showBreakdown ? "Hide score breakdown" : "View score breakdown"}
          </button>
          {showBreakdown && (
            <div className="mt-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              {result.skills.map((skill) => {
                const t = scoreTone(skill.percentage);
                return (
                  <div key={skill.skill_name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{skill.skill_name}</span>
                      <span className={`font-semibold ${t.text}`}>{skill.percentage}%</span>
                    </div>
                    <Progress value={skill.percentage} className={`h-1.5 ${t.bar}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!inProgress && passed && result.assessment_id && (
        <CertificateAction
          assessmentId={result.assessment_id}
          courseTitle={courseTitle || "Assessment"}
          scoreLabel={`${result.percentage ?? 0}%`}
          className="w-full"
        />
      )}

      {!inProgress && !passed && (
        <div className="pt-1 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/dashboard/training")}
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Train
          </Button>
          <Button size="sm" onClick={handleRetake} disabled={retaking || !departmentId}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            {retaking ? "Starting..." : "Retake"}
          </Button>
        </div>
      )}
    </div>
  );
};

const SkillProfilePanel = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: skills, isLoading } = useCandidateSkills(user?._id ?? "");

  if (isLoading || !skills || !skills.skills?.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Skill Profile</h2>
            <p className="text-xs text-slate-500">
              Across {skills.total_assessments} assessment{skills.total_assessments === 1 ? "" : "s"} ·{" "}
              {Math.round(skills.avg_score)}% avg · {Math.round(skills.pass_rate)}% pass rate
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.skills.map((skill) => {
            const pct = skill.percentage ?? 0;
            const tone = scoreTone(pct);
            return (
              <div key={skill.skill_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{skill.skill_name}</span>
                  {skill.percentage != null ? (
                    <span className={`font-semibold ${tone.text}`}>{pct}%</span>
                  ) : (
                    <span className="text-xs text-slate-400">{skill.message || "No data"}</span>
                  )}
                </div>
                {skill.percentage != null && <Progress value={pct} className={tone.bar} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MyApplicationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError } = useMyApplications(!!user?._id, { page, limit });
  const { data: assessments } = useCandidateAssessmentList(!!user?._id);

  const applications = data?.data ?? [];
  const totalPages = data?.meta?.totalPages || 1;

  // Map a job's department -> the candidate's assessment for that department,
  // used as a fallback when the application has no embedded result.
  const assessmentByDept = useMemo(() => {
    const map = new Map<string, IApplicationResult>();
    (assessments ?? []).forEach((a) => {
      if (a.department?._id) map.set(a.department._id, a);
    });
    return map;
  }, [assessments]);

  // Prefer a per-application result from the backend; otherwise fall back to
  // the candidate's department-level assessment result.
  const resolveResult = (application: IApplication): IApplicationResult | undefined =>
    application.assessment ??
    application.result ??
    assessmentByDept.get(departmentId(application.job?.department) ?? "");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Applications</h1>
        <p className="text-slate-500">
          Track each application and see how you performed on its assessment.
        </p>
      </div>

      <SkillProfilePanel />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl border border-slate-100 bg-white animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">We couldn't load your applications right now.</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">You haven't applied to any jobs yet.</p>
          <Button variant="outline" onClick={() => navigate("/dashboard/jobs")}>
            Browse the Job Board
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => {
              const job = application.job;
              const department = job?.department as Department | undefined;
              const status = STATUS_META[application.status] ?? STATUS_META.pending;
              const result = resolveResult(application);
              const deptId = departmentId(application.job?.department);

              return (
                <div
                  key={application._id}
                  className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-sm border border-slate-100 shrink-0">
                        {department?.department_name?.substring(0, 2).toUpperCase() || "JB"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 leading-tight truncate">
                          {job?.job_title || "Job"}
                        </h3>
                        {department?.department_name && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {department.department_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={status.variant} className="shrink-0">
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-4">
                    {job?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    {application.createdAt && (
                      <span>Applied {formatDate(application.createdAt)}</span>
                    )}
                  </div>

                  <ResultBreakdown
                    result={result}
                    departmentId={deptId}
                    courseTitle={department?.department_name}
                  />

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!job?._id}
                      onClick={() => job?._id && navigate(`/jobs/${job._id}`)}
                    >
                      View Job <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink isActive={num === page} onClick={() => setPage(num)}>
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};
