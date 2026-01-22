import { useQuery } from "@tanstack/react-query"
import { axiosGet } from "../lib/api"

export interface CandidateAct{
    _id : string
    "full_name": string,
    "email": string,
    "phone": string,
    "target_department": string,
    "cv": {
        "filename": string,
        "url": string
    },
    "recent_activity": {
    "job_name": string
    "result": "pass" | "fail",
    "submitted_at": Date
    }
}
export interface CandidateActRes
{
  "data": CandidateAct[],
  "meta": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "search": string | null
  }
}


const fetchCandidates = async (params : {enabled : boolean, search : string, page : number, limit : number}) => {
    const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('limit', String(params.limit));
  if (params.search) queryParams.append('search', String(params.search));
  
  const endpoint = `users/candidates/recent-activity/?${queryParams.toString()}`;
  const response = await axiosGet(endpoint, true);
  return response as CandidateActRes;
};

// Custom hook
export const useCandidates = (params : {enabled : boolean, search : string, page : number, limit : number}) => {
  return useQuery({
    queryKey: ["candidates",params], // cache key
    enabled : params.enabled,
    queryFn: ()=>fetchCandidates(params),
    retry : false,
  });
};

export interface CandidateSkill {
    "skill_id": string,
    "skill_name": string,
    "percentage" ?: number
    "message" ?: string
}

export interface CandidateSkillRes
{
  "candidate_id": "63f1c2b7e8f1a2d5f0a3c4d9",
  "candidate_name": "Alice Johnson",
  "total_assessments": number,
  "pass_rate": number,
  "avg_score": number,
  "skills": CandidateSkill[]
}


const fetchCandidateSkills = async (id : string) => {
  const response = await axiosGet(`assessment/candidate/${id}/skills`, true);
  return response as CandidateSkillRes
};

// Custom hook
export const useCandidateSkills = (id : string) => {
  return useQuery({
    queryKey: ["candidate - skills",id],
    enabled : !!id ,
    queryFn: ()=>fetchCandidateSkills(id),
    retry : false,
  });
};



export interface AssessmentHistory {
    "date": Date,
    "job_name": string,
    "score": string,
    "percentage": number,
    "result": "pass" | "fail"
}



const fetchCandidateAssessmentHistory = async (id : string) => {
  const response = await axiosGet(`assessment/history/${id}`, true);
  return response as AssessmentHistory[]
};

// Custom hook
export const useCandidateAssessmentHistory = (id : string) => {
  return useQuery({
    queryKey: ["canidate - assessment - history", id],
    enabled : !!id ,
    queryFn: ()=>fetchCandidateAssessmentHistory(id),
    retry : false,
  });
};