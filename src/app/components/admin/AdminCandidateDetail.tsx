// AdminCandidateDetail.tsx — one candidate's skill profile + assessment history.
import { useParams, useNavigate } from "react-router-dom";
import {
  useCandidateSkills,
  useCandidateAssessmentHistory,
} from "../../hooks/useCandidates";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowLeft } from "lucide-react";

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const scoreTone = (pct: number) =>
  pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-600";

export const AdminCandidateDetailPage = () => {
  const { candidateId = "" } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading: pLoading, isError: pError } = useCandidateSkills(candidateId);
  const { data: history, isLoading: hLoading } = useCandidateAssessmentHistory(candidateId);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" onClick={() => navigate("/admin/candidates")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to candidates
      </Button>

      {pError ? (
        <Card className="p-6 text-sm text-red-600">Couldn’t load this candidate.</Card>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {pLoading ? "…" : profile?.candidate_name ?? "Candidate"}
            </h1>
            {profile && (
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                <span>{profile.total_assessments} assessment{profile.total_assessments === 1 ? "" : "s"}</span>
                <span>Pass rate <span className={`font-semibold ${scoreTone(profile.pass_rate)}`}>{profile.pass_rate}%</span></span>
                <span>Avg score <span className={`font-semibold ${scoreTone(profile.avg_score)}`}>{profile.avg_score}%</span></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skill profile */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Skill profile</h2>
              <div className="space-y-4">
                {pLoading ? (
                  <p className="text-sm text-slate-400">Loading…</p>
                ) : profile && profile.skills.length > 0 ? (
                  profile.skills.map((s) => (
                    <div key={s.skill_id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-medium text-slate-700">{s.skill_name}</span>
                        <span className={`text-sm font-semibold ${scoreTone(s.percentage ?? 0)}`}>
                          {s.percentage != null ? `${s.percentage}%` : s.message ?? "—"}
                        </span>
                      </div>
                      {s.percentage != null && <Progress value={s.percentage} />}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No skill data.</p>
                )}
              </div>
            </Card>

            {/* Assessment history */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Assessment history</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-400 py-6">Loading…</TableCell>
                    </TableRow>
                  ) : history && history.length > 0 ? (
                    history.map((h, i) => (
                      <TableRow key={`${h.date}-${i}`}>
                        <TableCell className="text-slate-600">{fmtDate(h.date)}</TableCell>
                        <TableCell className="text-slate-600">{h.department_name}</TableCell>
                        <TableCell className={`text-right font-semibold ${scoreTone(h.percentage)}`}>
                          {h.score} · {h.percentage}%
                        </TableCell>
                        <TableCell>
                          <Badge variant={h.result === "pass" ? "default" : "destructive"}>
                            {h.result === "pass" ? "Passed" : "Not Passed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-400 py-6">
                        No assessment history.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
