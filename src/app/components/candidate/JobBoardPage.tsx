import { Briefcase, MapPin, Share2, ShieldCheck } from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import { IJob } from "../../interface/job.interface";
import {useState} from "react"
import { useNavigate } from "react-router-dom";
import { Department } from "../../interface/settings.interface";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { axiosPost } from "../../lib/api";
import { join } from "node:path";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export const JobBoardPage = () => {
    const [page , setPage] = useState(1)
    const limit = 20
    const [jobToShare, setJobToShare] = useState<IJob | null>(null);
    
    const {data : jobs, isLoading : jobsLoading} = useJobs(true,{page, limit})

    const totalPages = jobs?.meta?.totalPages || 1;

    // Function to generate an array of page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
        }
        return pages;
    };
    const navigate = useNavigate();
    const handleApply = (job: IJob) => {
        alert(`Application submitted for ${job.job_title}!`);
    };

    const handleSelectDepartment = async (dept: string) => {
        try {
            await axiosPost(`assessment/candidate/departments/${dept}`,{},true)
            navigate(`/assessment/${encodeURIComponent(dept)}`);
        } catch (error) {
            toast.error(error.message)
        }
    };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Board</h1>
            <p className="text-slate-500">Explore opportunities that match your verified skills.</p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.data?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 col-span-full">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No open positions at the moment.</p>
        </div>
        ) : (<>
            {jobs?.data?.map(job => {
                const isCertified =  job?.is_certified;
                return (
                <div 
                    key={job._id} 
                    className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col relative cursor-pointer"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                >
                    <div className="flex justify-between items-start mb-4">
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
                    
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-6">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        {job.salary_range && <span className="flex items-center gap-1"> {job.salary_range}</span>}
                    </div>

                    <div className="mt-auto flex gap-3">
                        {
                        job.is_applied ? (
                            <Button
                                disabled 
                                onClick={(e) => { e.stopPropagation(); handleApply(job); }} 
                                className="flex-1 bg-slate-900 hover:bg-slate-800"
                            >
                                Applied
                            </Button>
                        ) : isCertified ? (
                            <Button 
                            onClick={(e) => { e.stopPropagation(); handleApply(job); }} 
                            className="flex-1 bg-slate-900 hover:bg-slate-800"
                            >
                            Apply Now
                            </Button>
                        ) : (
                            <Button 
                            onClick={(e) => { e.stopPropagation(); handleSelectDepartment((job.department as Department)._id); }} 
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
            })}

            {totalPages > 1 && (
                <Pagination className="mt-6">
                <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                />
                <PaginationContent>
                    {getPageNumbers().map((num) => (
                    <PaginationItem key={num}>
                        <PaginationLink
                        isActive={num === page}
                        onClick={() => setPage(num)}
                        >
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
    </div>
  );
};