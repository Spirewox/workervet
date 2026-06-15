import { Briefcase, MapPin, ArrowRight, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Department } from "../../interface/settings.interface";
import { useAuth } from "../../context/AuthContext";
import {
  ApplicationStatus,
  useMyApplications,
} from "../../hooks/useApplications";
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

const formatDate = (value?: Date) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const MyApplicationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError } = useMyApplications(!!user?._id, { page, limit });

  const applications = data?.data ?? [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Applications</h1>
        <p className="text-slate-500">Track the status of every job you've applied to.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl border border-slate-100 bg-white animate-pulse" />
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

                  <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-6">
                    {job?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    {application.createdAt && (
                      <span>Applied {formatDate(application.createdAt)}</span>
                    )}
                  </div>

                  <div className="mt-auto">
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
