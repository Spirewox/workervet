import { Department, Question } from "../types";
import { getPresetQuestions } from "./dataStore";

// Mock implementation for now
export const generateAssessmentForDepartment = async (department: Department): Promise<Question[]> => {
  console.log(`Generating assessment for ${department}...`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return preset questions for now
  return getPresetQuestions(department).slice(0, 5); // Return a subset for testing
};