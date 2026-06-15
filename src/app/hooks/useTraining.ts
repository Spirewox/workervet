import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosGet, axiosPost } from "../lib/api";
import { TrainingCourse } from "../lib/trainingContent";

// Fetches a training course for a category/skill. The backend resolves the
// category and returns the full course (description, video modules, resources,
// quiz). Callers fall back to the built-in content library when this is
// unavailable, so training keeps working without the endpoint.
const fetchTrainingCourse = async (skill: string) => {
  const response = await axiosGet(`training/${encodeURIComponent(skill)}`, true);
  return response as TrainingCourse;
};

export const useTrainingCourse = (skill: string) => {
  return useQuery({
    queryKey: ["training-course", skill],
    enabled: !!skill,
    queryFn: () => fetchTrainingCourse(skill),
    retry: false,
  });
};

// ---- Paywall: entitlements + purchase ----

export interface TrainingAccess {
  // Names (or ids) of the training courses this candidate has unlocked.
  unlocked: string[];
}

const fetchTrainingAccess = async () => {
  const response = await axiosGet(`training/access`, true);
  return response as TrainingAccess;
};

export const useTrainingAccess = () => {
  return useQuery({
    queryKey: ["training-access"],
    queryFn: fetchTrainingAccess,
    retry: false,
  });
};

const purchaseTraining = async (skill: string) => {
  return axiosPost(`training/${encodeURIComponent(skill)}/purchase`, {}, true);
};

export const usePurchaseTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseTraining,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["training-access"] }),
  });
};

// ---- Hard-copy certificate request (paid) ----

export interface HardCopyRequest {
  full_name: string;
  address: string;
  city: string;
  country: string;
}

const requestHardCopy = async (vars: { skill: string; details: HardCopyRequest }) => {
  return axiosPost(
    `training/${encodeURIComponent(vars.skill)}/certificate/hardcopy`,
    vars.details,
    true
  );
};

export const useRequestHardCopy = () => {
  return useMutation({ mutationFn: requestHardCopy });
};
