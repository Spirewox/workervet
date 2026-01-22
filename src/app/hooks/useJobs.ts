import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../lib/api";
import { IJob } from "../interface/job.interface";

const fetchJobs = async () => {
  const response = await axiosGet(`jobs`, true);
  return response as IJob[]
};

// Custom hook
export const useJobs = (enabled : boolean) => {
  return useQuery({
    queryKey: ["jobs"],
    enabled ,
    queryFn: ()=>fetchJobs(),
    retry : false,
  });
};