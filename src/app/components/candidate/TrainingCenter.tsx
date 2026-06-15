import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useAuth } from "../../context/AuthContext";
import { useCandidateSkills, CandidateSkill } from "../../hooks/useCandidates";
import { getTrainingModule } from "../../lib/trainingContent";

const PASS_THRESHOLD = 70;

const scoreTone = (percentage: number) => {
  if (percentage >= PASS_THRESHOLD)
    return { text: "text-emerald-600", bar: "[&_[data-slot=progress-indicator]]:bg-emerald-500" };
  if (percentage >= 40)
    return { text: "text-amber-600", bar: "[&_[data-slot=progress-indicator]]:bg-amber-500" };
  return { text: "text-red-600", bar: "[&_[data-slot=progress-indicator]]:bg-red-500" };
};

const TrainingModuleCard = ({ skill }: { skill: CandidateSkill }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Record<number, boolean>>({});

  const pct = skill.percentage ?? 0;
  const tone = scoreTone(pct);
  const module = useMemo(() => getTrainingModule(skill.skill_name), [skill.skill_name]);

  const completed = Object.values(done).filter(Boolean).length;
  const allDone = completed === module.checklist.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{skill.skill_name}</h3>
              <p className="text-xs text-slate-500">Below the recommended {PASS_THRESHOLD}% benchmark</p>
            </div>
          </div>
          <span className={`text-2xl font-black ${tone.text}`}>{pct}%</span>
        </div>

        <div className="mt-4">
          <Progress value={pct} className={tone.bar} />
        </div>

        <Button
          variant={open ? "outline" : "default"}
          className="w-full mt-5"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide Training" : "Start Training"}
        </Button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm text-slate-600 leading-relaxed">{module.summary}</p>

          <div className="space-y-4">
            {module.lessons.map((lesson, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{lesson.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{lesson.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Readiness check
            </p>
            <div className="space-y-2">
              {module.checklist.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                  className="flex items-center gap-2 text-left w-full group"
                >
                  {done[i] ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                  )}
                  <span className={`text-sm ${done[i] ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!allDone}
            onClick={() => navigate("/dashboard")}
          >
            {allDone ? "Ready — Retake Assessment" : `Complete the readiness check (${completed}/${module.checklist.length})`}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export const TrainingCenterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: skills, isLoading } = useCandidateSkills(user?._id ?? "");

  const scored = (skills?.skills ?? []).filter((s) => s.percentage != null);
  const weak = scored.filter((s) => (s.percentage ?? 0) < PASS_THRESHOLD);
  const strong = scored.filter((s) => (s.percentage ?? 0) >= PASS_THRESHOLD);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Training Center</h1>
          <p className="text-slate-500">
            Build up the categories where you fell short, then retake the assessment.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl border border-slate-100 bg-white animate-pulse" />
          ))}
        </div>
      ) : scored.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">
            Take an assessment first — we'll recommend training based on the categories you need to improve.
          </p>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Go to Assessments
          </Button>
        </div>
      ) : weak.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-emerald-200 bg-emerald-50/30">
          <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-slate-700 font-medium mb-1">Every category is above the benchmark.</p>
          <p className="text-slate-500 text-sm">Nice work — no training needed right now.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
            You have <span className="font-semibold">{weak.length}</span> categor
            {weak.length === 1 ? "y" : "ies"} below the {PASS_THRESHOLD}% benchmark. Work through the
            training below to improve before your next attempt.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weak.map((skill) => (
              <TrainingModuleCard key={skill.skill_id} skill={skill} />
            ))}
          </div>
        </>
      )}

      {strong.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Your strengths
          </h2>
          <div className="flex flex-wrap gap-2">
            {strong.map((s) => (
              <Badge key={s.skill_id} variant="success" className="gap-1">
                {s.skill_name} · {s.percentage}%
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
