// AdminOverview.tsx — headline metrics + analytics for the admin dashboard.
import {
  useDepartmentsPassRate,
  useRecentAssessments,
} from "../../hooks/useCandidates";
import { useDashboardMetrics, useGlobalSkillPerformance } from "../../hooks/useDashboard";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Users, ClipboardCheck, TrendingUp, TrendingDown, Briefcase } from "lucide-react";

const fmtDate = (d: Date | null) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const scoreTone = (pct: number) =>
  pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-600";

const MoM = ({ value }: { value: number }) => {
  if (value === 0) return <span className="text-xs text-slate-400">no change</span>;
  const up = value > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-red-600"}`}>
      <Icon className="w-3.5 h-3.5" />
      {up ? "+" : ""}{value}% MoM
    </span>
  );
};

export const AdminOverviewPage = () => {
  const { data: metrics, isLoading: mLoading, isError: mError } = useDashboardMetrics(true);
  const { data: passRates } = useDepartmentsPassRate(true);
  const { data: skills } = useGlobalSkillPerformance();
  const { data: recent } = useRecentAssessments(true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500">Platform-wide candidate and assessment performance.</p>
      </div>

      {/* Stat cards */}
      {mError ? (
        <Card className="p-6 text-sm text-red-600">Couldn’t load dashboard metrics.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Candidates"
            value={metrics?.totalCandidates}
            loading={mLoading}
            footer={metrics ? <MoM value={metrics.totalCandidatesMoM} /> : null}
          />
          <StatCard
            icon={ClipboardCheck}
            label="Assessments Taken"
            value={metrics?.assessmentsTaken}
            loading={mLoading}
            footer={
              metrics ? (
                <span className="text-xs text-slate-500">{metrics.assessmentsPassed} passed</span>
              ) : null
            }
          />
          <StatCard
            icon={TrendingUp}
            label="Average Pass Rate"
            value={metrics ? `${metrics.avgPassRate}%` : undefined}
            loading={mLoading}
            footer={metrics ? <MoM value={metrics.passRateMoM} /> : null}
          />
          <StatCard
            icon={Briefcase}
            label="Active Jobs"
            value={metrics?.activeJobsCount}
            loading={mLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department pass rates */}
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Pass rate by department</h2>
          <div className="space-y-4">
            {passRates === undefined ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : passRates.length === 0 ? (
              <p className="text-sm text-slate-400">No data yet.</p>
            ) : (
              passRates.map((d) => (
                <div key={d.department_name}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-slate-700">{d.department_name}</span>
                    <span className={`text-sm font-semibold ${scoreTone(d.percentage)}`}>
                      {d.percentage}%
                    </span>
                  </div>
                  <Progress value={d.percentage} />
                  <p className="text-xs text-slate-400 mt-1">
                    {d.total_passed} of {d.total_people} passed
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Global skill performance */}
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Skill performance (all candidates)</h2>
          <div className="space-y-4">
            {skills === undefined ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : skills.length === 0 ? (
              <p className="text-sm text-slate-400">No data yet.</p>
            ) : (
              skills.map((s) => (
                <div key={s.skill_id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-slate-700">{s.skill_name}</span>
                    <span className={`text-sm font-semibold ${scoreTone(s.average_percentage)}`}>
                      {s.average_percentage}%
                    </span>
                  </div>
                  <Progress value={s.average_percentage} />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent assessments */}
      <Card className="p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Recent assessments</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent === undefined ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-6">
                  Loading…
                </TableCell>
              </TableRow>
            ) : recent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-6">
                  No assessments yet.
                </TableCell>
              </TableRow>
            ) : (
              recent.map((r, i) => (
                <TableRow key={`${r.participant_name}-${i}`}>
                  <TableCell className="font-medium text-slate-900">{r.participant_name}</TableCell>
                  <TableCell className="text-slate-600">{r.job_department}</TableCell>
                  <TableCell className={`text-right font-semibold ${scoreTone(r.percentage)}`}>
                    {r.percentage}%
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.result === "pass" ? "default" : "destructive"}>
                      {r.result === "pass" ? "Passed" : "Not Passed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-500">{fmtDate(r.submitted_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  loading,
  footer,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | undefined;
  loading: boolean;
  footer?: React.ReactNode;
}) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="mt-2 text-3xl font-bold text-slate-900">
      {loading ? <span className="text-slate-300">—</span> : value ?? "—"}
    </div>
    {footer ? <div className="mt-1">{footer}</div> : null}
  </Card>
);
