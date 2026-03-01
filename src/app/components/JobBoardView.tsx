import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobPosting } from '../types';
import { getJobPostings } from '../services/dataStore';
import { ShareJobModal } from './ShareJobModal';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Search, 
  MapPin, 
  DollarSign, 
  Share2 
} from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { Department } from '../interface/settings.interface';

export const JobBoardView: React.FC = () => {
  const navigate = useNavigate();
  const [page , setPage] = useState(1)
  const limit = 20
  const [searchTerm, setSearchTerm] = useState('');
  const [jobToShare, setJobToShare] = useState<JobPosting | null>(null);
  
  const {data : jobs, isLoading : jobsLoading} = useJobs(true,{page, limit,search : searchTerm})
  const handleSelectJob = (id: string) => {
    navigate(`/jobs/${id}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-100">
      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Workervet</span>
          </div>
          <button 
            onClick={handleLogin} 
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3" /> Login
          </button>
        </div>
      </nav>

      {/* Hero Section - Framer Style */}
      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center">
         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-600 mb-8 uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Verified Assessment Platform</span>
         </div>
         
         <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Find a job that is <br />
            <span className="text-slate-400">truly rewarding.</span>
         </h1>
         
         <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
             Showcase your integrity and communication skills to top employers. 
             Take the assessment, stand out, and get hired.
         </p>

         {/* Minimal Search */}
         <div className="max-w-md mx-auto relative group animate-in fade-in zoom-in duration-700 delay-300">
             <div className="relative flex items-center">
                 <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                 <input 
                     type="text" 
                     placeholder="Search roles..." 
                     className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-white rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>
         </div>
      </div>

      {/* Job Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.data?.length === 0 ? (
            <div className="col-span-full py-24 text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search className="w-5 h-5" />
               </div>
               <p className="text-slate-500 font-medium">No roles found matching "{searchTerm}"</p>
               <button 
                 onClick={() => setSearchTerm('')} 
                 className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
               >
                 Clear filters
               </button>
            </div>
          ) : (
            jobs?.data?.map((job) => (
              <div 
                key={job?._id} 
                className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 cursor-pointer flex flex-col items-start relative overflow-hidden"
                onClick={() => handleSelectJob(job._id)}
              >
                <div className="flex justify-between items-start w-full mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-sm border border-slate-100">
                       {(job.department as Department).department_name.substring(0,2).toUpperCase()}
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                         {job.job_title}
                       </h3>
                       <p className="text-xs text-slate-500 mt-0.5">{(job.department as Department).department_name}</p>
                     </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-1">
                  {job.job_description}
                </p>

                <div className="w-full flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                   <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      {job.salary_range && (
                        <span className="flex items-center gap-1">
                          {job.salary_range}
                        </span>
                      )}
                   </div>
                   <button 
                      onClick={(e) => { e.stopPropagation(); setJobToShare(job); }}
                      className="text-slate-300 hover:text-slate-600 transition-colors"
                   >
                     <Share2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-100 py-12 text-center">
         <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Workervet. All rights reserved.</p>
      </footer>

      {jobToShare && (
        <ShareJobModal job={jobToShare} onClose={() => setJobToShare(null)} />
      )}
    </div>
  );
};
