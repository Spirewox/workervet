import { ArrowRight, Award, Briefcase, CheckCircle, GraduationCap, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { IJob } from "../../interface/job.interface";
import { useCandidateAssessmentList, useCandidateAssessmentMetrics } from "../../hooks/useDashboard";
import { useCandidateSkills } from "../../hooks/useCandidates";
import { CertificateAction } from "./CertificateAction";
import { useAuth } from "../../context/AuthContext";
import { Department } from "../../interface/settings.interface";
import { axiosPost } from "../../lib/api";

const PASS_THRESHOLD = 70;

const scoreTone = (percentage: number) => {
  if (percentage >= PASS_THRESHOLD)
    return { text: "text-emerald-600", bar: "[&_[data-slot=progress-indicator]]:bg-emerald-500" };
  if (percentage >= 40)
    return { text: "text-amber-600", bar: "[&_[data-slot=progress-indicator]]:bg-amber-500" };
  return { text: "text-red-600", bar: "[&_[data-slot=progress-indicator]]:bg-red-500" };
};

const formatDate = (value?: Date | string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const ScoreBreakdown = ({ skills }: { skills?: { skill_name: string; percentage: number }[] }) => {
  const [open, setOpen] = useState(false);
  if (!skills?.length) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide score breakdown" : "View score breakdown"}
      </button>

      {open && (
        <div className="mt-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {skills.map((skill) => {
            const tone = scoreTone(skill.percentage);
            return (
              <div key={skill.skill_name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{skill.skill_name}</span>
                  <span className={`font-semibold ${tone.text}`}>{skill.percentage}%</span>
                </div>
                <Progress value={skill.percentage} className={`h-1.5 ${tone.bar}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const DashboardOverviewPage = () => {
  const {user} = useAuth()
  const navigate = useNavigate();
  const {data : metric} = useCandidateAssessmentMetrics(!!user?._id)
  const {data : assessments} = useCandidateAssessmentList(!!user?._id)
  const {data : skills} = useCandidateSkills(user?._id ?? "")

  // Categories the candidate scored below the benchmark — surfaced as
  // training suggestions on failed assessments.
  const weakCategories = (skills?.skills ?? [])
    .filter((s) => s.percentage != null && (s.percentage as number) < PASS_THRESHOLD)
    .map((s) => s.skill_name);

  const handleApply = (job: IJob) => {
    alert(`Application submitted for ${job?.job_title}!`);
  };

  const handleSelectDepartment = async(dept: string) => {
    await axiosPost(`assessment/candidate/departments/${dept}`,{},true)
    navigate(`/assessment/${encodeURIComponent(dept)}`);
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Track your progress and certified skills.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-slate-900 text-white border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">Certifications Earned</CardTitle>
          <Award className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metric?.departments_verified}</div>
          <p className="text-xs text-slate-400 mt-1">Departments Verified</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assessments Passed</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{metric?.assessments_passed}</div>
          <p className="text-xs text-slate-500 mt-1">Successfully completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
          <Briefcase className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{metric?.active_assessments}</div>
          <p className="text-xs text-slate-500 mt-1">In your queue</p>
        </CardContent>
      </Card>
    </div>

    {/* Departments Grid */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Your Assessments</h2>
      </div>
      
      {assessments?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">You have no pending assessments.</p>
            <Button variant="outline" onClick={() => navigate("/dashboard/jobs")}>
              Go to Job Board
            </Button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments?.map((assessment) => {
            const isPassed = assessment.result == 'pass'
            const isFailed = !isPassed && (assessment?.result == "fail" || assessment?.status == "expired")
            const isTarget = user?.target_department === assessment.department;

            return (
              <Card key={assessment.assessment_id} className={`transition-all hover:shadow-md ${isTarget && !isPassed ? 'border-blue-500/50 ring-1 ring-blue-500/20 bg-blue-50/10' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight min-h-[3rem] flex items-center">{assessment.department.name}</CardTitle>
                    {isTarget && !isPassed && (
                      <Badge variant="secondary" className="ml-2 whitespace-nowrap">Target</Badge>
                    )}
                  </div>
                  <CardDescription>
                    Evaluate skills in Trust, Integrity, Ethics & Communication.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Certified</Badge>
                    ) : assessment?.result == "fail" ? (
                      <Badge variant="warning">Retake Available</Badge>
                    ) : assessment?.status == "in_progress" ? (
                      <Badge variant="outline">In Progress</Badge>
                    ) :  (
                      <Badge variant="outline">Not Started</Badge>)
                  }
                  </div>

                  {(isPassed || isFailed) && (
                    (() => {
                      const tone = scoreTone(assessment.percentage ?? 0);
                      return (
                        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/60 p-3 space-y-2">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Score</p>
                              <p className="text-sm font-semibold text-slate-700">{assessment.score || "—"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Accuracy</p>
                              <p className={`text-2xl font-black leading-none ${tone.text}`}>{assessment.percentage ?? 0}%</p>
                            </div>
                          </div>
                          <Progress value={assessment.percentage ?? 0} className={tone.bar} />
                          {assessment.submitted_at && (
                            <p className="text-[11px] text-slate-400">Submitted {formatDate(assessment.submitted_at)}</p>
                          )}
                          <ScoreBreakdown skills={assessment.skills} />
                        </div>
                      );
                    })()
                  )}

                  {isFailed && (
                    <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                        <GraduationCap className="w-3.5 h-3.5" /> Suggested Training
                      </div>
                      {weakCategories.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {weakCategories.slice(0, 3).map((cat) => (
                            <Badge key={cat} variant="outline" className="bg-white border-amber-200 text-amber-800">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-amber-700/80">
                          Brush up on the categories you missed before retaking.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {
                    isPassed ? (
                      <CertificateAction
                        assessmentId={assessment.assessment_id}
                        courseTitle={assessment.department.name}
                        scoreLabel={`${assessment.percentage ?? 0}%`}
                        className="w-full"
                      />
                    ) : isFailed ? (
                      <div className="w-full grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => navigate('/dashboard/training')}>
                          <GraduationCap className="w-4 h-4 mr-1.5" /> Train
                        </Button>
                        <Button onClick={() => handleSelectDepartment(assessment.department._id)}>
                          Retake <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSelectDepartment(assessment.department._id)}
                        className="w-full"
                        variant={isTarget ? 'default' : 'outline'}
                      >
                        {!assessment?.status ? 'Start Assessment' : "Continue Assessment"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )
                    }
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  </div>
  );
};