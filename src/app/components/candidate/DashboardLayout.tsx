// DashboardLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { LayoutDashboard, Briefcase, LogOut, ShieldCheck, UserIcon, FileText } from "lucide-react";
import { cn } from "../../lib/utils";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname === "/dashboard";
  const isJobs = location.pathname.startsWith("/dashboard/jobs");
  const isApplications = location.pathname.startsWith("/dashboard/applications");

  const departmentLabel =
    typeof user?.target_department === "string"
      ? user.target_department
      : (user?.target_department as { department_name?: string } | undefined)?.department_name;

  const handleLogout = () => {
    logout();
    navigate("/login");
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
                onClick={() => navigate("/dashboard")}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                  isOverview
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => navigate("/dashboard/jobs")}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                  isJobs
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Briefcase className="w-4 h-4" />
                Job Board
              </button>
              <button
                onClick={() => navigate("/dashboard/applications")}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                  isApplications
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <FileText className="w-4 h-4" />
                My Applications
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-sm font-semibold text-slate-900 leading-none">{user?.full_name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{departmentLabel || 'Candidate'}</span>
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
              onClick={() => navigate("/dashboard")}
              className={cn(
                "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2",
                isOverview
                  ? "border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-500"
              )}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => navigate("/dashboard/jobs")}
              className={cn(
                "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2",
                isJobs
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500"
              )}
            >
              <Briefcase className="w-4 h-4" /> Job Board
            </button>
            <button
              onClick={() => navigate("/dashboard/applications")}
              className={cn(
                "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2",
                isApplications
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500"
              )}
            >
              <FileText className="w-4 h-4" /> Applications
            </button>
        </div>
      </header>


      {/* 👇 Pages render here */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Outlet />
      </main>
    </div>
  );
};
