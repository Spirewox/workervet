// AdminCandidates.tsx — searchable, paginated candidate roster.
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCandidates } from "../../hooks/useCandidates";
import { useUpdateCandidateStatus } from "../../hooks/useAdminMutations";
import { Department } from "../../interface/settings.interface";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

const deptLabel = (d: string | Department | undefined) =>
  typeof d === "string" ? d : d?.department_name ?? "—";

const fmtDate = (d: Date | undefined) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export const AdminCandidatesPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({ enabled: true, search, page, limit: PAGE_SIZE }),
    [search, page]
  );
  const { data, isLoading, isError } = useCandidates(params);
  const updateStatus = useUpdateCandidateStatus();

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "inactive" : "active";
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(next === "active" ? "Candidate activated" : "Candidate deactivated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn’t update status");
    }
  };

  const rows = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
        <p className="text-slate-500">
          {meta ? `${meta.total} candidate${meta.total === 1 ? "" : "s"}` : "Browse and search all candidates."}
        </p>
      </div>

      <form onSubmit={submitSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            aria-label="Search candidates"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Target dept.</TableHead>
              <TableHead>Latest result</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-600 py-8">
                  Couldn’t load candidates.
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                  {search ? `No candidates match “${search}”.` : "No candidates yet."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((c) => {
                const result = c.recent_activity?.result;
                return (
                  <TableRow
                    key={c._id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/candidates/${c._id}`)}
                  >
                    <TableCell className="font-medium text-slate-900">{c.full_name}</TableCell>
                    <TableCell className="text-slate-600">{c.email}</TableCell>
                    <TableCell className="text-slate-600">{deptLabel(c.target_department)}</TableCell>
                    <TableCell>
                      {result ? (
                        <Badge variant={result === "pass" ? "default" : "destructive"}>
                          {result === "pass" ? "Passed" : "Not Passed"}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(c.status ?? "active") === "active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {fmtDate(c.recent_activity?.submitted_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updateStatus.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(c._id, c.status ?? "active");
                        }}
                      >
                        {(c.status ?? "active") === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {meta?.page ?? page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
