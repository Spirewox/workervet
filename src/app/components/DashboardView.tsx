import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobPosting } from '../types';
import { getDepartments, getJobPostings } from '../services/dataStore';
import { useAuth } from '../context/AuthContext';
import { ShareJobModal } from './ShareJobModal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './ui/card';
import { cn } from './ui/utils';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Briefcase, 
  User as UserIcon, 
  LogOut, 
  Award, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  DollarSign,
  Share2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');
  const [jobToShare, setJobToShare] = useState<JobPosting | null>(null);
  
  // if (!user) {
  //   // Should be handled by protected route, but safety check
  //   return null;
  // }

  const passedCount = user?.assessments?.filter(a => a.passed)?.length;
  const departments = getDepartments();
  const jobs = getJobPostings();

  // Filter departments to show only the user's target department or those they've already interacted with
  const relevantDepartments = departments?.filter(dept => 
    dept === user?.targetDepartment || 
    user?.assessments?.some(a => a.department === dept)
  );

  const handleApply = (job: JobPosting) => {
    alert(`Application submitted for ${job.title}!`);
  };

  const handleSelectDepartment = (dept: string) => {
    navigate(`/assessment/${encodeURIComponent(dept)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Workervet</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  activeTab === 'overview' 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  activeTab === 'jobs' 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Briefcase className="w-4 h-4" />
                Job Board
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                   <UserIcon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{user?.targetDepartment || 'Candidate'}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden border-t border-slate-100 flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2",
                activeTab === 'overview' 
                  ? "border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-500"
              )}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={cn(
                "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2",
                activeTab === 'jobs' 
                  ? "border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-500"
              )}
            >
              <Briefcase className="w-4 h-4" /> Job Board
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'overview' && (
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
                  <div className="text-3xl font-bold">{passedCount}</div>
                  <p className="text-xs text-slate-400 mt-1">Departments Verified</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assessments Passed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{passedCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Successfully completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{relevantDepartments.length}</div>
                  <p className="text-xs text-slate-500 mt-1">In your queue</p>
                </CardContent>
              </Card>
            </div>

            {/* Departments Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Your Assessments</h2>
              </div>
              
              {relevantDepartments.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 mb-4">You have no pending assessments.</p>
                    <Button variant="outline" onClick={() => setActiveTab('jobs')}>
                      Go to Job Board
                    </Button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relevantDepartments.map((dept) => {
                    const history = user.assessments.filter(a => a.department === dept);
                    const isPassed = history.some(a => a.passed);
                    const lastAttempt = history[history.length - 1];
                    const isTarget = user.targetDepartment === dept;

                    return (
                      <Card key={dept} className={`transition-all hover:shadow-md ${isTarget && !isPassed ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 bg-indigo-50/10' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg leading-tight min-h-[3rem] flex items-center">{dept}</CardTitle>
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
                            ) : lastAttempt ? (
                              <Badge variant="warning">Retake Available</Badge>
                            ) : (
                              <Badge variant="outline">Not Started</Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          {isPassed ? (
                            <Button variant="secondary" className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-default">
                              <Award className="w-4 h-4 mr-2" /> Certified
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleSelectDepartment(dept)} 
                              className="w-full"
                              variant={isTarget ? 'default' : 'outline'}
                            >
                              {lastAttempt ? 'Retake Assessment' : 'Start Assessment'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Board Tab Content */}
        {activeTab === 'jobs' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                 <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Board</h1>
                 <p className="text-slate-500">Explore opportunities that match your verified skills.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 col-span-full">
                   <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                   <p className="text-slate-500">No open positions at the moment.</p>
                </div>
              ) : (
                jobs.map(job => {
                  const isCertified = user?.assessments?.some(a => a.department === job.department && a.passed);
                  return (
                    <div 
                      key={job.id} 
                      className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col relative cursor-pointer"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-sm border border-slate-100">
                               {job.department.substring(0,2).toUpperCase()}
                             </div>
                             <div>
                               <h3 className="font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                 {job.title}
                               </h3>
                               <p className="text-xs text-slate-500 mt-0.5">{job.department}</p>
                             </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-1">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-6">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                            {job.salaryRange && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salaryRange}</span>}
                        </div>

                        <div className="mt-auto flex gap-3">
                           {isCertified ? (
                              <Button 
                                onClick={(e) => { e.stopPropagation(); handleApply(job); }} 
                                className="flex-1 bg-slate-900 hover:bg-slate-800"
                              >
                                Apply Now
                              </Button>
                           ) : (
                              <Button 
                                onClick={(e) => { e.stopPropagation(); handleSelectDepartment(job.department); }} 
                                variant="outline" 
                                className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                              >
                                Take Assessment
                              </Button>
                           )}
                           <Button 
                               variant="outline" 
                               size="icon" 
                               onClick={(e) => { e.stopPropagation(); setJobToShare(job); }}
                               className="shrink-0 border-slate-200 text-slate-400 hover:text-slate-900"
                           >
                             <Share2 className="w-4 h-4" />
                           </Button>
                        </div>
                        
                        {!isCertified && (
                           <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-amber-600 font-medium bg-amber-50 py-1.5 rounded-md">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Certification required</span>
                           </div>
                        )}
                    </div>
                  );
                })
              )}
            </div>
           </div>
        )}

      </main>
      
      {jobToShare && (
        <ShareJobModal job={jobToShare} onClose={() => setJobToShare(null)} />
      )}
    </div>
  );
};
