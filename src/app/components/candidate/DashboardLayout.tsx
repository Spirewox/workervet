// DashboardLayout.tsx — sidebar shell inspired by the shadcn dashboard.
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import {
  LayoutDashboard, Briefcase, LogOut, ShieldCheck, FileText,
  GraduationCap, Menu, X, Search,
} from "lucide-react";
import { cn } from "../../lib/utils";

const NAV = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/dashboard/jobs", label: "Job Board", icon: Briefcase },
  { path: "/dashboard/applications", label: "My Applications", icon: FileText },
  { path: "/dashboard/training", label: "Training", icon: GraduationCap },
];

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const departmentLabel =
    typeof user?.target_department === "string"
      ? user.target_department
      : (user?.target_department as { department_name?: string } | undefined)?.department_name;

  const initials = (user?.full_name || "C")
    .split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  const Sidebar = (
    <div className="flex flex-col h-full w-64 bg-white border-r border-slate-200">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-slate-900 tracking-tight">Workervet</p>
          <p className="text-[11px] text-slate-400 -mt-0.5">Candidate</p>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden ml-auto text-slate-400 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
        <div className="space-y-1">
          {NAV.map((item) => {
            const active = isActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.full_name || "Candidate"}</p>
            <p className="text-[11px] text-slate-400 truncate">{departmentLabel || "Candidate"}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500 hover:text-slate-900 mt-1" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 z-30">
        {Sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 z-50 animate-in slide-in-from-left duration-200">
            {Sidebar}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="md:pl-64 min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              placeholder="Search..."
              className="w-full pl-9 pr-3 h-9 rounded-lg bg-slate-100 border border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-slate-900">{user?.full_name || "Candidate"}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">{departmentLabel || "Candidate"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold text-sm">
              {initials}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
