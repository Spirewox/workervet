import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../lib/api";
import { IJob } from "../interface/job.interface";

export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface IApplication {
  _id: string;
  job: IJob;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApplicationRes {
  data: IApplication[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Counterpart to `POST jobs/application` (submit). Lists the
// authenticated candidate's own applications.
const fetchMyApplications = async (params?: { page?: number; limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const response = await axiosGet(`jobs/application?${queryParams.toString()}`, true);

  // Be tolerant of the backend returning either a bare array or a paginated envelope.
  if (Array.isArray(response)) {
    return {
      data: response as IApplication[],
      meta: {
        page: 1,
        limit: response.length,
        total: response.length,
        totalPages: 1,
      },
    } as ApplicationRes;
  }
  return response as ApplicationRes;
};

export const useMyApplications = (
  enabled: boolean,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ["my-applications", params],
    enabled,
    queryFn: () => fetchMyApplications(params),
    retry: false,
  });
};
