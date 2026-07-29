import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosGet, axiosPost } from "../lib/api";
import { HardCopyRequest } from "./useTraining";

// Certificates the candidate has paid for, keyed by assessment id.
export interface CertificateAccess {
  unlocked: string[];
}

const fetchCertificateAccess = async () => {
  const response = await axiosGet(`assessment/certificates`, true);
  return response as CertificateAccess;
};

export const useCertificateAccess = () => {
  return useQuery({
    queryKey: ["certificate-access"],
    queryFn: fetchCertificateAccess,
    retry: false,
  });
};

const purchaseCertificate = async (assessmentId: string) => {
  return axiosPost(
    `assessment/${encodeURIComponent(assessmentId)}/certificate/purchase`,
    {},
    true
  );
};

export const usePurchaseCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseCertificate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["certificate-access"] }),
  });
};

const requestCertificateHardCopy = async (vars: {
  assessmentId: string;
  details: HardCopyRequest;
}) => {
  return axiosPost(
    `assessment/${encodeURIComponent(vars.assessmentId)}/certificate/hardcopy`,
    vars.details,
    true
  );
};

export const useRequestCertificateHardCopy = () => {
  return useMutation({ mutationFn: requestCertificateHardCopy });
};
