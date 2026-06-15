import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Sparkles,
  PlayCircle,
  Lock,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useAuth } from "../../context/AuthContext";
import { useCandidateSkills, CandidateSkill } from "../../hooks/useCandidates";
import { getTrainingCourse, formatPrice } from "../../lib/trainingContent";
import { useTrainingAccess } from "../../hooks/useTraining";
import { TrainingCourse } from "./TrainingCourse";

const PASS_THRESHOLD = 70;

const scoreTone = (percentage: number) => {
  if (percentage >= PASS_THRESHOLD)
    return { text: "text-emerald-600", bar: "[&_[data-slot=progress-indicator]]:bg-emerald-500" };
  if (percentage >= 40)
    return { text: "text-amber-600", bar: "[&_[data-slot=progress-indicator]]:bg-amber-500" };
  return { text: "text-red-600", bar: "[&_[data-slot=progress-indicator]]:bg-red-500" };
};

const TrainingCard = ({
  skill,
  unlocked,
  onStart,
}: {
  skill: CandidateSkill;
  unlocked: boolean;
  onStart: () => void;
}) => {
  const pct = skill.percentage ?? 0;
  const tone = scoreTone(pct);
  const course = getTrainingCourse(skill.skill_name);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{course.title}</h3>
            <p className="text-xs text-slate-500">Below the recommended {PASS_THRESHOLD}% benchmark</p>
          </div>
        </div>
        <span className={`text-2xl font-black ${tone.text}`}>{pct}%</span>
      </div>

      <p className="text-sm text-slate-600 mt-4 leading-relaxed flex-1">{course.description}</p>

      <div className="mt-4">
        <Progress value={pct} className={tone.bar} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5" /> {course.modules.length} video modules
          </span>
          <span>· {course.quiz.length}-question quiz</span>
        </div>
        {unlocked ? (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" /> Unlocked
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 border-amber-200 text-amber-700 bg-amber-50">
            <Lock className="w-3 h-3" /> {formatPrice()}
          </Badge>
        )}
      </div>

      <Button className="w-full mt-5" onClick={onStart}>
        {unlocked ? "Continue Training" : `Unlock for ${formatPrice()}`}
      </Button>
    </div>
  );
};

export const TrainingCenterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: skills, isLoading } = useCandidateSkills(user?._id ?? "");
  const { data: access } = useTrainingAccess();
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const isUnlocked = (skillName: string) => !!access?.unlocked?.includes(skillName);

  const scored = (skills?.skills ?? []).filter((s) => s.percentage != null);
  const weak = scored.filter((s) => (s.percentage ?? 0) < PASS_THRESHOLD);
  const strong = scored.filter((s) => (s.percentage ?? 0) >= PASS_THRESHOLD);

  if (activeSkill) {
    return <TrainingCourse skillName={activeSkill} onBack={() => setActiveSkill(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Training Center</h1>
          <p className="text-slate-500">
            Video courses to build up the categories where you fell short, then retake the assessment.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl border border-slate-100 bg-white animate-pulse" />
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
            video training below to improve before your next attempt.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weak.map((skill) => (
              <TrainingCard
                key={skill.skill_id}
                skill={skill}
                unlocked={isUnlocked(skill.skill_name)}
                onStart={() => setActiveSkill(skill.skill_name)}
              />
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
