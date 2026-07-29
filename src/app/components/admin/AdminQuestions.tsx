// AdminQuestions.tsx — manage the assessment question bank per department.
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuestionBank, useDepartmentQuestions } from "../../hooks/useQuestionQueries";
import { useSkills } from "../../hooks/useSettings";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "../../hooks/useAdminMutations";
import { Question } from "../../interface/question.interface";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ConfirmDialog } from "./ConfirmDialog";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const skillId = (s: Question["skill_category"]) =>
  typeof s === "string" ? s : s?._id ?? "";

type FormState = {
  question_text: string;
  scenario: string;
  skill_category: string;
  time_seconds: number;
  options: { _id?: string; content: string }[];
  correct_option_index: number;
};

const emptyForm = (skill: string): FormState => ({
  question_text: "",
  scenario: "",
  skill_category: skill,
  time_seconds: 30,
  options: [{ content: "" }, { content: "" }],
  correct_option_index: 0,
});

export const AdminQuestionsPage = () => {
  const { data: bank, isLoading: bankLoading } = useQuestionBank();
  const { data: skills } = useSkills();
  const [deptId, setDeptId] = useState<string>("");

  // Default to the first department once the bank loads.
  useEffect(() => {
    if (!deptId && bank && bank.length > 0) setDeptId(bank[0].department_id);
  }, [bank, deptId]);

  const { data: deptData, isLoading: qLoading } = useDepartmentQuestions(deptId);
  const questions = deptData?.questions ?? [];

  const createQ = useCreateQuestion();
  const updateQ = useUpdateQuestion();
  const deleteQ = useDeleteQuestion();

  const skillList = useMemo(() => skills ?? [], [skills]);
  const skillName = (id: string) =>
    skillList.find((s) => s._id === id)?.skill_name ?? id;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(""));
  const [toDelete, setToDelete] = useState<Question | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(skillList[0]?._id ?? ""));
    setDialogOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setForm({
      question_text: q.question_text,
      scenario: q.scenario ?? "",
      skill_category: skillId(q.skill_category),
      time_seconds: q.time_seconds ?? 30,
      options: (q.options ?? []).map((o) => ({ _id: o._id, content: o.content })),
      correct_option_index: q.correct_option_index ?? 0,
    });
    setDialogOpen(true);
  };

  const setOption = (i: number, content: string) =>
    setForm((f) => ({
      ...f,
      options: f.options.map((o, idx) => (idx === i ? { ...o, content } : o)),
    }));

  const addOption = () =>
    setForm((f) => ({ ...f, options: [...f.options, { content: "" }] }));

  const removeOption = (i: number) =>
    setForm((f) => {
      const options = f.options.filter((_, idx) => idx !== i);
      let correct = f.correct_option_index;
      if (i === correct) correct = 0;
      else if (i < correct) correct -= 1;
      return { ...f, options, correct_option_index: Math.max(0, correct) };
    });

  const submit = async () => {
    const cleanOptions = form.options.map((o) => ({ ...o, content: o.content.trim() }));
    if (!form.question_text.trim()) return toast.error("Question text is required");
    if (cleanOptions.length < 2 || cleanOptions.some((o) => !o.content))
      return toast.error("Provide at least two non-empty options");
    if (!form.skill_category) return toast.error("Pick a skill");

    const payload: Partial<Question> = {
      question_text: form.question_text.trim(),
      scenario: form.scenario.trim() || undefined,
      skill_category: form.skill_category,
      department: deptId,
      time_seconds: Number(form.time_seconds) || 30,
      options: cleanOptions,
      correct_option_index: form.correct_option_index,
    };

    try {
      if (editing?._id) {
        await updateQ.mutateAsync({ id: editing._id, data: payload });
        toast.success("Question updated");
      } else {
        await createQ.mutateAsync(payload);
        toast.success("Question added");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete?._id) return;
    try {
      await deleteQ.mutateAsync(toDelete._id);
      toast.success("Question deleted");
      setToDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn’t delete question");
    }
  };

  const saving = createQ.isPending || updateQ.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Question bank</h1>
          <p className="text-slate-500">Manage assessment questions by department.</p>
        </div>
        <Button onClick={openCreate} disabled={!deptId}>
          <Plus className="w-4 h-4 mr-2" /> New question
        </Button>
      </div>

      {/* Department selector */}
      <div className="flex flex-wrap gap-2">
        {bankLoading ? (
          <span className="text-sm text-slate-400">Loading departments…</span>
        ) : (
          (bank ?? []).map((d) => (
            <button
              key={d.department_id}
              onClick={() => setDeptId(d.department_id)}
              aria-pressed={deptId === d.department_id}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                deptId === d.department_id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {d.department_name}
              <span className={`ml-2 text-xs ${deptId === d.department_id ? "text-slate-300" : "text-slate-400"}`}>
                {d.question_count}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {qLoading ? (
          <Card className="p-6 text-sm text-slate-400">Loading questions…</Card>
        ) : questions.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            No questions in this department yet.
          </Card>
        ) : (
          questions.map((q, i) => (
            <Card key={q._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{skillName(skillId(q.skill_category))}</Badge>
                    <span className="text-xs text-slate-400">{q.time_seconds}s</span>
                  </div>
                  {q.scenario ? (
                    <p className="text-sm text-slate-500 italic mb-1">{q.scenario}</p>
                  ) : null}
                  <p className="font-medium text-slate-900">
                    {i + 1}. {q.question_text}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {(q.options ?? []).map((o, idx) => {
                      const correct = idx === q.correct_option_index;
                      return (
                        <li
                          key={o._id ?? idx}
                          className={`text-sm flex items-center gap-2 ${correct ? "text-green-700 font-medium" : "text-slate-600"}`}
                        >
                          {correct ? (
                            <Check className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 shrink-0" />
                          )}
                          {o.content}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(q)} aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setToDelete(q)}
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit question" : "New question"}</DialogTitle>
            <DialogDescription>
              Mark exactly one option as the correct answer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Skill</Label>
                <Select
                  value={form.skill_category}
                  onValueChange={(v) => setForm((f) => ({ ...f, skill_category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillList.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.skill_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time_seconds">Time limit (s)</Label>
                <Input
                  id="time_seconds"
                  type="number"
                  min={5}
                  value={form.time_seconds}
                  onChange={(e) => setForm((f) => ({ ...f, time_seconds: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scenario">Scenario (optional)</Label>
              <Textarea
                id="scenario"
                rows={2}
                value={form.scenario}
                onChange={(e) => setForm((f) => ({ ...f, scenario: e.target.value }))}
                placeholder="Context for the question…"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="question_text">Question</Label>
              <Textarea
                id="question_text"
                rows={2}
                value={form.question_text}
                onChange={(e) => setForm((f) => ({ ...f, question_text: e.target.value }))}
                placeholder="What should the candidate decide?"
              />
            </div>

            <div className="space-y-2">
              <Label>Options — select the correct one</Label>
              {form.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, correct_option_index: i }))}
                    aria-label={`Mark option ${i + 1} correct`}
                    aria-pressed={form.correct_option_index === i}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      form.correct_option_index === i
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-slate-300 text-transparent hover:border-slate-400"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <Input
                    value={o.content}
                    onChange={(e) => setOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                  />
                  {form.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(i)}
                      aria-label={`Remove option ${i + 1}`}
                      className="text-slate-400 hover:text-red-600 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="mt-1">
                <Plus className="w-4 h-4 mr-1" /> Add option
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Add question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this question?"
        description="It will be removed from the assessment bank."
        onConfirm={confirmDelete}
        loading={deleteQ.isPending}
      />
    </div>
  );
};
