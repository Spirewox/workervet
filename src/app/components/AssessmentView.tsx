import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentResult } from '../types';
import { addUser } from '../services/dataStore';
import { useAuth } from '../context/AuthContext';
import { AssessmentRunner } from './AssessmentRunner';
import { Loader2 } from 'lucide-react';
import { useCandidateAssessment } from '../hooks/useAssessment';
import { axiosPost } from '../lib/api';

export const AssessmentView: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const { user, login } = useAuth(); // We need login to update the user in context

  const {data : assessmentData, isLoading : assessmentLoading} = useCandidateAssessment(department)
  console.log(assessmentData)

  const handleCompleteAssessment = async(
    answers: { question: string; selected_option: number; }[]
  ) => {
    if (!user) return;
    console.log(answers)
    const result = await axiosPost(`assessment/${assessmentData.assessment_id}/submit`,{answers},true)

    navigate('/result', { state: { result } });
  };

  if (assessmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Preparing Assessment...</h2>
          <p className="text-slate-500 mt-2">Our AI is curating a unique scenario-based test for you.</p>
        </div>
      </div>
    );
  }

  return (
    <AssessmentRunner 
      questions={assessmentData?.questions}
      department={assessmentData?.department_name} 
      onComplete={handleCompleteAssessment}
      onCancel={() => navigate('/dashboard')}
    />
  );
};
