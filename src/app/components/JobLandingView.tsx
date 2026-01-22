import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobPosting } from '../types';
import { getJobPostingById } from '../services/dataStore';
import { useAuth } from '../context/AuthContext';
import { ShareJobModal } from './ShareJobModal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ShieldCheck,
  ArrowRight,
  MapPin,
  DollarSign,
  Clock,
  Share2,
  Loader2
} from 'lucide-react';

export const JobLandingView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (jobId) {
      const foundJob = getJobPostingById(jobId);
      setJob(foundJob || null);
    }
    setLoading(false);
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500">Job not found.</p>
        <Button onClick={() => navigate('/jobs')}>Back to Job Board</Button>
      </div>
    );
  }

  const isUserCertified = user?.assessments.some(a => a.department === job.department && a.passed);
  
  const actionLabel = user 
      ? (isUserCertified ? "Apply Now" : "Take Assessment") 
      : "Apply Now"; 

  const handleAction = () => {
    if (!user) {
        // Redirect to login with job context
        navigate('/login', { state: { job } });
        return;
    }
    
    if (isUserCertified) {
        alert("Application Submitted!");
    } else {
        navigate(`/assessment/${encodeURIComponent(job.department)}`);
    }
  };

  const handleBack = () => {
    // Navigate back to jobs or dashboard depending on where they likely came from
    // or just simply back to jobs list
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-24 pb-12 px-6">
      {/* Sticky Nav for consistency */}
       <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Workervet</span>
          </div>
          <button onClick={handleBack} className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5">
             <ArrowRight className="w-3 h-3 rotate-180" /> Back
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="mb-10">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-lg">
                  {job.department.substring(0,2).toUpperCase()}
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-3 py-1">{job.department}</Badge>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">{job.title}</h1>
           
           <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
              {job.salaryRange && <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-400" /> {job.salaryRange}</span>}
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
           </div>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-12">
           <div className="space-y-10">
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">About the role</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">{job.description}</p>
              </section>

              {job.requirements && (
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Requirements</h3>
                  <div className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    {job.requirements}
                  </div>
                </section>
              )}
           </div>

           <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <Button size="lg" onClick={handleAction} className="w-full h-12 text-base shadow-lg shadow-slate-200">
                    {actionLabel}
                </Button>
                
                <button 
                    onClick={() => setShowShare(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
                >
                    <Share2 className="w-4 h-4" /> Share this role
                </button>

                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Assessment Required</p>
                            <p className="text-sm text-blue-700/80 leading-relaxed">
                                You must complete a brief skill assessment to apply for this position.
                            </p>
                        </div>
                    </div>
                </div>
              </div>
           </div>
        </div>
      </div>
      
      {showShare && <ShareJobModal job={job} onClose={() => setShowShare(false)} />}
    </div>
  );
};
