import { ArrowRight, Award, Briefcase, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { IJob } from "../../interface/job.interface";
import { useCandidateAssessmentList, useCandidateAssessmentMetrics } from "../../hooks/useDashboard";
import { useAuth } from "../../context/AuthContext";
import { Department } from "../../interface/settings.interface";
import { axiosPost } from "../../lib/api";

export const DashboardOverviewPage = () => {
  const {user} = useAuth()
  const navigate = useNavigate();
  const {data : metric} = useCandidateAssessmentMetrics(!!user?._id)
  const {data : assessments} = useCandidateAssessmentList(!!user?._id)

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
          <Briefcase className="h-4 w-4 text-indigo-600" />
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
            const isTarget = user.target_department === assessment.department;

            return (
              <Card key={assessment.assessment_id} className={`transition-all hover:shadow-md ${isTarget && !isPassed ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 bg-indigo-50/10' : ''}`}>
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
                </CardContent>
                <CardFooter>
                  {
                    isPassed ? (
                      <Button variant="secondary" className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-default">
                        <Award className="w-4 h-4 mr-2" /> Certified
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleSelectDepartment(assessment.department._id)} 
                        className="w-full"
                        variant={isTarget ? 'default' : 'outline'}
                      >
                        {assessment?.result == "fail" || assessment?.status == "expired" ? 'Retake Assessment' : !assessment?.status ? 'Start Assessment' : "Continue Assessment"}
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