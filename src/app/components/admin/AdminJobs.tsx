// AdminJobs.tsx — manage job postings (create / edit / delete / activate).
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useJobs } from "../../hooks/useJobs";
import { useDepartments } from "../../hooks/useSettings";
import { useCreateJob, useUpdateJob, useDeleteJob } from "../../hooks/useAdminMutations";
import { IJob } from "../../interface/job.interface";
import { Department } from "../../interface/settings.interface";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

const deptId = (d: string | Department | undefined) =>
  typeof d === "string" ? d : d?._id ?? "";
const deptName = (d: string | Department | undefined) =>
  typeof d === "string" ? d : d?.department_name ?? "—";

type FormState = {
  job_title: string;
  job_description: string;
  department: string;
  location: string;
  salary_range: string;
  is_certified: boolean;
  is_active: boolean;
};

const emptyForm = (defaultDept: string): FormState => ({
  job_title: "",
  job_description: "",
  department: defaultDept,
  location: "",
  salary_range: "",
  is_certified: false,
  is_active: true,
});

export const AdminJobsPage = () => {
  const { data, isLoading, isError } = useJobs(true, { limit: 100 });
  const { data: departments } = useDepartments();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const jobs = data?.data ?? [];
  const depts = useMemo(() => departments ?? [], [departments]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IJob | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(""));
  const [toDelete, setToDelete] = useState<IJob | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(depts[0]?._id ?? ""));
    setDialogOpen(true);
  };

  const openEdit = (job: IJob) => {
    setEditing(job);
    setForm({
      job_title: job.job_title,
      job_description: job.job_description,
      department: deptId(job.department),
      location: job.location ?? "",
      salary_range: job.salary_range ?? "",
      is_certified: !!job.is_certified,
      is_active: job.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const submit = async () => {
    if (!form.job_title.trim()) {
      toast.error("Job title is required");
      return;
    }
    try {
      if (editing?._id) {
        await updateJob.mutateAsync({ id: editing._id, data: form });
        toast.success("Job updated");
      } else {
        await createJob.mutateAsync(form);
        toast.success("Job created");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete?._id) return;
    try {
      await deleteJob.mutateAsync(toDelete._id);
      toast.success("Job deleted");
      setToDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn’t delete job");
    }
  };

  const toggleActive = async (job: IJob) => {
    if (!job._id) return;
    try {
      await updateJob.mutateAsync({ id: job._id, data: { is_active: !job.is_active } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn’t update job");
    }
  };

  const saving = createJob.isPending || updateJob.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-500">Create and manage job postings.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New job
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Certified</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-600 py-8">
                  Couldn’t load jobs.
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                  No jobs yet. Create your first posting.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium text-slate-900">{job.job_title}</TableCell>
                  <TableCell className="text-slate-600">{deptName(job.department)}</TableCell>
                  <TableCell className="text-slate-600">{job.location || "—"}</TableCell>
                  <TableCell>
                    {job.is_certified ? (
                      <Badge variant="default">Certified</Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={job.is_active ?? true}
                      onCheckedChange={() => toggleActive(job)}
                      aria-label={`Toggle ${job.job_title} active`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(job)} aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setToDelete(job)}
                        aria-label="Delete"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit job" : "New job"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update this posting’s details." : "Add a new job posting to the board."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="job_title">Title</Label>
              <Input
                id="job_title"
                value={form.job_title}
                onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
                placeholder="e.g. Care Assistant"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="job_description">Description</Label>
              <Textarea
                id="job_description"
                value={form.job_description}
                onChange={(e) => setForm((f) => ({ ...f, job_description: e.target.value }))}
                placeholder="What the role involves…"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {depts.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Manchester, UK"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salary_range">Salary range</Label>
              <Input
                id="salary_range"
                value={form.salary_range}
                onChange={(e) => setForm((f) => ({ ...f, salary_range: e.target.value }))}
                placeholder="e.g. £24k–£28k"
              />
            </div>

            <div className="flex items-center gap-8 pt-1">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_certified"
                  checked={form.is_certified}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_certified: v }))}
                />
                <Label htmlFor="is_certified">Requires certification</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this job?"
        description={toDelete ? `“${toDelete.job_title}” will be removed from the board.` : ""}
        onConfirm={confirmDelete}
        loading={deleteJob.isPending}
      />
    </div>
  );
};
