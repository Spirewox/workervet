// AdminSettings.tsx — manage departments and skills (the assessment taxonomy).
import { useState } from "react";
import { toast } from "react-toastify";
import { useDepartments, useSkills } from "../../hooks/useSettings";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useUpdateDepartment,
  useCreateSkill,
  useDeleteSkill,
  useUpdateSkill,
} from "../../hooks/useAdminMutations";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { ConfirmDialog } from "./ConfirmDialog";
import { Plus, Trash2 } from "lucide-react";

type Entity = { _id: string; is_active: boolean } & Record<string, unknown>;

/** Generic taxonomy editor used for both departments and skills. */
function TaxonomyCard<T extends Entity>({
  title,
  description,
  items,
  nameKey,
  loading,
  placeholder,
  onAdd,
  onToggle,
  onDelete,
  busy,
}: {
  title: string;
  description: string;
  items: T[] | undefined;
  nameKey: keyof T & string;
  loading: boolean;
  placeholder: string;
  onAdd: (name: string) => Promise<void>;
  onToggle: (item: T) => Promise<void>;
  onDelete: (item: T) => Promise<void>;
  busy: boolean;
}) {
  const [newName, setNewName] = useState("");
  const [toDelete, setToDelete] = useState<T | null>(null);
  const [adding, setAdding] = useState(false);

  const add = async () => {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await onAdd(name);
      setNewName("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mb-4">{description}</p>

      <div className="divide-y divide-slate-100 border-y border-slate-100">
        {loading ? (
          <p className="text-sm text-slate-400 py-4">Loading…</p>
        ) : (items?.length ?? 0) === 0 ? (
          <p className="text-sm text-slate-400 py-4">None yet.</p>
        ) : (
          items!.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-3 gap-4">
              <span className={`text-sm font-medium ${item.is_active ? "text-slate-800" : "text-slate-400 line-through"}`}>
                {String(item[nameKey])}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => onToggle(item)}
                    aria-label={`Toggle ${String(item[nameKey])}`}
                  />
                  <span className="text-xs text-slate-400 w-14">
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setToDelete(item)}
                  aria-label={`Delete ${String(item[nameKey])}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          value={newName}
          placeholder={placeholder}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          aria-label={`New ${title.toLowerCase()}`}
        />
        <Button variant="outline" onClick={add} disabled={adding || !newName.trim()}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete ? String(toDelete[nameKey]) : ""}?`}
        description="This can’t be undone."
        onConfirm={async () => {
          if (toDelete) {
            await onDelete(toDelete);
            setToDelete(null);
          }
        }}
        loading={busy}
      />
    </Card>
  );
}

export const AdminSettingsPage = () => {
  const { data: departments, isLoading: dLoading } = useDepartments();
  const { data: skills, isLoading: sLoading } = useSkills();

  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      toast.success(msg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage the departments and skills used across assessments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaxonomyCard
          title="Departments"
          description="Roles and assessments are grouped by department."
          items={departments}
          nameKey="department_name"
          loading={dLoading}
          placeholder="New department name…"
          busy={deleteDept.isPending}
          onAdd={(name) => guard(() => createDept.mutateAsync({ department_name: name }), "Department added")}
          onToggle={(d) =>
            guard(() => updateDept.mutateAsync({ id: d._id, data: { is_active: !d.is_active } }), "Updated")
          }
          onDelete={(d) => guard(() => deleteDept.mutateAsync(d._id), "Department deleted")}
        />

        <TaxonomyCard
          title="Skills"
          description="Competencies scored in each assessment."
          items={skills}
          nameKey="skill_name"
          loading={sLoading}
          placeholder="New skill name…"
          busy={deleteSkill.isPending}
          onAdd={(name) => guard(() => createSkill.mutateAsync({ skill_name: name }), "Skill added")}
          onToggle={(s) =>
            guard(() => updateSkill.mutateAsync({ id: s._id, data: { is_active: !s.is_active } }), "Updated")
          }
          onDelete={(s) => guard(() => deleteSkill.mutateAsync(s._id), "Skill deleted")}
        />
      </div>
    </div>
  );
};
