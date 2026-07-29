import { useMemo, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  FileText,
  BookOpen,
  Video,
  Link as LinkIcon,
  ListChecks,
  Award,
  XCircle,
  ArrowRight,
  Lock,
  CreditCard,
  ShieldCheck,
  Download,
  Printer,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { useAuth } from "../../context/AuthContext";
import {
  getTrainingCourse,
  ResourceType,
  TrainingResource,
  formatPrice,
  CERTIFICATE_HARDCOPY_FEE,
} from "../../lib/trainingContent";
import {
  useTrainingCourse,
  useTrainingAccess,
  usePurchaseTraining,
  useRequestHardCopy,
} from "../../hooks/useTraining";
import { generateCertificatePdf } from "../../lib/certificate";

const RESOURCE_ICON: Record<ResourceType, typeof FileText> = {
  pdf: FileText,
  article: BookOpen,
  video: Video,
  link: LinkIcon,
};

const ResourceRow = ({ resource }: { resource: TrainingResource }) => {
  const Icon = RESOURCE_ICON[resource.type] ?? LinkIcon;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3 hover:border-slate-200 hover:shadow-sm transition-all"
    >
      <div className="w-9 h-9 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <span className="text-sm font-medium text-slate-700 flex-1">{resource.label}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        {resource.type}
      </span>
    </a>
  );
};

export const TrainingCourse = ({
  skillName,
  onBack,
}: {
  skillName: string;
  onBack: () => void;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Prefer backend course content; fall back to the built-in library.
  const { data: remoteCourse } = useTrainingCourse(skillName);
  const course = useMemo(
    () => remoteCourse ?? getTrainingCourse(skillName),
    [remoteCourse, skillName]
  );

  // Paywall: only unlocked (purchased) courses can be opened.
  const { data: access, isLoading: accessLoading } = useTrainingAccess();
  const purchase = usePurchaseTraining();
  const unlocked = !!access?.unlocked?.includes(skillName);

  const handleUnlock = () => {
    purchase.mutate(skillName, {
      onSuccess: () => toast.success(`${course.title} unlocked`),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Payment failed"),
    });
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [watched, setWatched] = useState<Record<string, boolean>>({});
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const [certId] = useState(
    () => `WV-${skillName.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase() || "TRN"}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );
  const [hardCopyOpen, setHardCopyOpen] = useState(false);
  const [hcForm, setHcForm] = useState(() => ({
    full_name: user?.full_name ?? "",
    address: "",
    city: "",
    country: "",
  }));
  const hardCopy = useRequestHardCopy();

  const activeModule = course.modules[activeIndex] ?? course.modules[0];
  const completedCount = course.modules.filter((m) => completed[m.id]).length;
  const allModulesDone = completedCount === course.modules.length;
  const moduleProgress = Math.round((completedCount / course.modules.length) * 100);

  // A module unlocks only once every module before it is completed.
  const isUnlocked = (i: number) => i === 0 || completed[course.modules[i - 1]?.id];
  // The current module can be completed only after its video has been watched.
  const canComplete = completed[activeModule.id] || watched[activeModule.id];

  const markCompleteAndContinue = () => {
    if (!canComplete) return;
    setCompleted((c) => ({ ...c, [activeModule.id]: true }));
    if (activeIndex < course.modules.length - 1) setActiveIndex((i) => i + 1);
  };

  const correctCount = course.quiz.filter((q) => answers[q.id] === q.answerIndex).length;
  const passed = correctCount / course.quiz.length >= course.passMark;
  const allAnswered = course.quiz.every((q) => answers[q.id] != null);

  const candidateName = user?.full_name || "Candidate";
  const scorePercent = Math.round((correctCount / course.quiz.length) * 100);
  const dateLabel = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadCertificate = () =>
    generateCertificatePdf({
      name: candidateName,
      courseTitle: course.title,
      dateLabel,
      scoreLabel: `${scorePercent}%`,
      certId,
    });

  const submitHardCopy = (e: FormEvent) => {
    e.preventDefault();
    hardCopy.mutate(
      { skill: skillName, details: hcForm },
      {
        onSuccess: () => toast.success("Hard-copy certificate request received"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Request failed"),
      }
    );
  };
  const hcValid = hcForm.full_name && hcForm.address && hcForm.city && hcForm.country;

  const BackLink = (
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Training Center
    </button>
  );

  // ---- Paywall gate ----
  if (accessLoading) {
    return (
      <div className="space-y-6">
        {BackLink}
        <div className="h-64 rounded-xl border border-slate-100 bg-white animate-pulse" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {BackLink}
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 text-white p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-amber-400" />
            </div>
            <Badge className="bg-amber-500 text-white border-none mb-3">Premium Training</Badge>
            <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-slate-300 mt-2 max-w-md mx-auto text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              What's included
            </p>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                {course.modules.length} guided video modules
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                {course.resources.length} downloadable resources
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <ListChecks className="w-4 h-4 text-blue-600 shrink-0" />
                {course.quiz.length}-question quick assessment
              </li>
            </ul>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5 flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-slate-900">{formatPrice()}</p>
                <p className="text-xs text-slate-500">One-time payment · lifetime access</p>
              </div>
              <Button size="lg" onClick={handleUnlock} disabled={purchase.isPending}>
                <CreditCard className="w-4 h-4 mr-2" />
                {purchase.isPending ? "Processing..." : `Unlock for ${formatPrice()}`}
              </Button>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout · 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Training Center
      </button>

      {/* Course header */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              Training Course
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{course.title}</h1>
            <p className="text-slate-500 mt-1 max-w-2xl">{course.description}</p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Progress</p>
            <p className="text-2xl font-black text-slate-900">{moduleProgress}%</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={moduleProgress} className="[&_[data-slot=progress-indicator]]:bg-blue-500" />
          <p className="text-xs text-slate-400 mt-1.5">
            {completedCount} of {course.modules.length} modules completed
          </p>
        </div>
      </div>

      {!quizMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video player + active module */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-black rounded-xl overflow-hidden border border-slate-200">
              <video
                key={activeModule.id}
                src={activeModule.videoUrl}
                controls
                onEnded={() => setWatched((w) => ({ ...w, [activeModule.id]: true }))}
                className="w-full aspect-video bg-black"
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
                <Clock className="w-3.5 h-3.5" /> {activeModule.durationLabel} · Module{" "}
                {activeIndex + 1} of {course.modules.length}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{activeModule.title}</h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{activeModule.description}</p>
              <div className="mt-4">
                <Button onClick={markCompleteAndContinue} disabled={!canComplete}>
                  {completed[activeModule.id] ? "Completed" : "Mark complete"}
                  {activeIndex < course.modules.length - 1 && (
                    <>
                      {" "}& continue <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
                {!canComplete && (
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Watch the full video to unlock this module.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Module list + resources */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Modules</h3>
              <div className="space-y-1">
                {course.modules.map((m, i) => {
                  const unlocked = isUnlocked(i);
                  return (
                    <button
                      key={m.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && setActiveIndex(i)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        i === activeIndex ? "bg-slate-100" : unlocked ? "hover:bg-slate-50" : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {completed[m.id] ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : !unlocked ? (
                        <Lock className="w-4 h-4 text-slate-300 shrink-0" />
                      ) : i === activeIndex ? (
                        <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className="text-sm text-slate-700 flex-1 leading-tight">{m.title}</span>
                      <span className="text-[11px] text-slate-400">{m.durationLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Resources</h3>
              <div className="space-y-2">
                {course.resources.map((r) => (
                  <ResourceRow key={r.label} resource={r} />
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <ListChecks className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Quick Assessment</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                {course.quiz.length} questions · pass at {Math.round(course.passMark * 100)}%.
                {!allModulesDone && " Complete all modules to unlock."}
              </p>
              <Button
                variant="secondary"
                disabled={!allModulesDone}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                onClick={() => {
                  setQuizMode(true);
                  setSubmitted(false);
                }}
              >
                {allModulesDone ? (
                  "Start Quick Assessment"
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1.5" /> Locked
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Quick assessment */
        <div className="bg-white rounded-xl border border-slate-100 p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Quick Assessment · {course.title}</h2>
            <button
              onClick={() => setQuizMode(false)}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Back to course
            </button>
          </div>

          {submitted && (
            <div
              className={`rounded-xl p-5 mb-6 flex items-start gap-3 ${
                passed ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"
              }`}
            >
              {passed ? (
                <Award className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              )}
              <div>
                <p className={`font-semibold ${passed ? "text-emerald-800" : "text-red-800"}`}>
                  {passed ? "Passed — nicely done!" : "Not quite yet"} · {correctCount}/
                  {course.quiz.length} correct
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  {passed
                    ? "You're ready — head back and retake the real assessment."
                    : "Review the modules and try the quick assessment again."}
                </p>
              </div>
            </div>
          )}

          {submitted && passed && (
            <div className="mb-6 space-y-4">
              {/* Certificate preview */}
              <div className="rounded-xl border-2 border-slate-900 p-6 text-center bg-gradient-to-b from-white to-slate-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Workervet · Certificate of Completion
                </p>
                <div className="my-3 mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-xs text-slate-500">This certifies that</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{candidateName}</p>
                <p className="text-xs text-slate-500 mt-1">has completed</p>
                <p className="text-base font-semibold text-blue-600">{course.title}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Score {scorePercent}% · {dateLabel} · ID {certId}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button onClick={handleDownloadCertificate}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF (soft copy)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setHardCopyOpen((o) => !o)}
                >
                  <Printer className="w-4 h-4 mr-2" /> Request hard copy ·{" "}
                  {formatPrice(CERTIFICATE_HARDCOPY_FEE)}
                </Button>
              </div>

              {hardCopyOpen && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {hardCopy.isSuccess ? (
                    <div className="text-center py-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <p className="font-semibold text-slate-900">Request received</p>
                      <p className="text-sm text-slate-500">
                        Your printed certificate will be posted to the address provided.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={submitHardCopy} className="space-y-3">
                      <p className="text-sm font-medium text-slate-900">
                        Ship a printed, framed certificate — {formatPrice(CERTIFICATE_HARDCOPY_FEE)}
                      </p>
                      <Input
                        placeholder="Full name"
                        value={hcForm.full_name}
                        onChange={(e) => setHcForm((f) => ({ ...f, full_name: e.target.value }))}
                      />
                      <Input
                        placeholder="Delivery address"
                        value={hcForm.address}
                        onChange={(e) => setHcForm((f) => ({ ...f, address: e.target.value }))}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="City"
                          value={hcForm.city}
                          onChange={(e) => setHcForm((f) => ({ ...f, city: e.target.value }))}
                        />
                        <Input
                          placeholder="Country"
                          value={hcForm.country}
                          onChange={(e) => setHcForm((f) => ({ ...f, country: e.target.value }))}
                        />
                      </div>
                      <Button type="submit" disabled={!hcValid || hardCopy.isPending}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        {hardCopy.isPending
                          ? "Processing..."
                          : `Pay ${formatPrice(CERTIFICATE_HARDCOPY_FEE)} & request`}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            {course.quiz.map((q, qi) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-slate-900 mb-2">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === oi;
                    const isAnswer = q.answerIndex === oi;
                    const showState = submitted;
                    return (
                      <button
                        key={oi}
                        disabled={submitted}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        className={`w-full flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                          showState && isAnswer
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : showState && selected && !isAnswer
                            ? "border-red-300 bg-red-50 text-red-800"
                            : selected
                            ? "border-slate-900 bg-slate-50 text-slate-900"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {showState && isAnswer ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : showState && selected && !isAnswer ? (
                          <XCircle className="w-4 h-4 shrink-0" />
                        ) : selected ? (
                          <span className="w-4 h-4 rounded-full bg-slate-900 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            {!submitted ? (
              <Button disabled={!allAnswered} onClick={() => setSubmitted(true)}>
                Submit answers
              </Button>
            ) : passed ? (
              <Button onClick={() => navigate("/dashboard")}>
                Retake the assessment <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                }}
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
