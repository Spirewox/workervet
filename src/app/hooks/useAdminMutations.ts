// Admin write operations. Each mutation invalidates the read queries that back
// the affected admin screens so the UI refreshes without a manual reload.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPost, axiosPatch, axiosDelete } from "../lib/api";
import { IJob } from "../interface/job.interface";
import { Department, Skill } from "../interface/settings.interface";
import { Question } from "../interface/question.interface";

// ---- Jobs ----
export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IJob>) => axiosPost("jobs", data, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IJob> }) =>
      axiosPatch(`jobs/${id}`, data, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosDelete(`jobs/${id}`, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};

// ---- Departments ----
export const useCreateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Department>) => axiosPost("departments", data, true),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["question-bank"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
      axiosPatch(`departments/${id}`, data, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
};

export const useDeleteDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosDelete(`departments/${id}`, true),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["question-bank"] });
    },
  });
};

// ---- Skills ----
export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Skill>) => axiosPost("skills", data, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["skill"] }),
  });
};

export const useUpdateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Skill> }) =>
      axiosPatch(`skills/${id}`, data, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["skill"] }),
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosDelete(`skills/${id}`, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["skill"] }),
  });
};

// ---- Questions ----
const invalidateQuestions = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["department-questions"] });
  qc.invalidateQueries({ queryKey: ["question-bank"] });
};

export const useCreateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Question>) => axiosPost("questions", data, true),
    onSuccess: () => invalidateQuestions(qc),
  });
};

export const useUpdateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Question> }) =>
      axiosPatch(`questions/${id}`, data, true),
    onSuccess: () => invalidateQuestions(qc),
  });
};

export const useDeleteQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosDelete(`questions/${id}`, true),
    onSuccess: () => invalidateQuestions(qc),
  });
};

// ---- Candidate status ----
export const useUpdateCandidateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axiosPatch(`users/${id}/status`, { status }, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["candidates"] }),
  });
};
