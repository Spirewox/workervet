import { Department } from "./settings.interface";

export interface IJob {
  _id?: string;

  job_title: string;
  job_description: string;

  department: string | Department;

  requirements?: string[];
  location?: string;
  salary_range?: string;

  is_active: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}