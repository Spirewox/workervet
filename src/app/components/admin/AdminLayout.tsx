// AdminLayout.tsx — shell for the /admin surface.
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { LayoutDashboard, Users, Briefcase, ListChecks, Settings, LogOut, ShieldCheck, UserIcon } from "lucide-react";
import { cn } from "../../lib/utils";

const NAV = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  { label: "Candidates", to: "/admin/candidates", icon: Users, match: (p: string) => p.startsWith("/admin/candidates") },
  { label: "Jobs", to: "/admin/jobs", icon: Briefcase, match: (p: string) => p.startsWith("/admin/jobs") },
  { label: "Questions", to: "/admin/questions", icon: ListChecks, match: (p: string) => p.startsWith("/admin/questions") },
  { label: "Settings", to: "/admin/settings", icon: Settings, match: (p: string) => p.startsWith("/admin/settings") },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Workervet</span>
              <span className="ml-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500 border border-slate-300 rounded px-1.5 py-0.5">
                Admin
              </span>
            </div>

            <nav className="hidden md:flex space-x-1">
              {NAV.map(({ label, to, icon: Icon, match }) => {
                const active = match(pathname);
                return (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                      active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/60">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 leading-none">
                  {user?.full_name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Administrator
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Mobile tabs */}
        <nav className="md:hidden border-t border-slate-100 flex">
          {NAV.map(({ label, to, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2",
                  active ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"
                )}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Outlet />
      </main>
    </div>
  );
};
