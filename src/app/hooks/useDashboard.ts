import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../lib/api";
import { GSkillPerformance } from "../interface/dashboard.interface";

const fetchGlobalSkillPerformance = async () => {
  const response = await axiosGet(`assessment/global/skills`, true);
  return response as GSkillPerformance[];
};

// Custom hook
export const useGlobalSkillPerformance = () => {
  return useQuery({
    queryKey: ["global-skill-performance"], // cache key
    queryFn: ()=>fetchGlobalSkillPerformance(),
    retry : false,
  });
};