import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Department, Question, AssessmentResult } from '../types';
import { generateAssessmentForDepartment } from '../services/geminiService';
import { addUser } from '../services/dataStore';
import { useAuth } from '../context/AuthContext';
import { AssessmentRunner } from './AssessmentRunner';
import { Loader2 } from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const { user, login } = useAuth(); // We need login to update the user in context
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      if (department) {
        try {
          const generatedQuestions = await generateAssessmentForDepartment(department as Department);
          setQuestions(generatedQuestions);
        } catch (error) {
          console.error("Failed to load assessment:", error);
          alert("Failed to load assessment. Please try again.");
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/dashboard');
      }
    };
    loadQuestions();
  }, [department, navigate]);

  const handleCompleteAssessment = (
    answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[]
  ) => {
    if (!user) return;

    // Enrich answers
    const enrichedAnswers = answers.map(ans => {
        const question = questions.find(q => q.id === ans.questionId);
        return {
            ...ans,
            skill: question?.skill
        };
    });

    const score = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    const passed = (score / total) >= 0.7;

    const result: AssessmentResult = {
      id: `res-${Date.now()}`,
      department: decodeURIComponent(department || ''),
      // We don't have direct access to jobId here easily unless passed via state
      // For simplicity in this refactor, we omit jobId or could read it from state if we passed it
      date: new Date().toISOString(),
      score,
      totalQuestions: total,
      passed,
      answers: enrichedAnswers
    };

    const updatedUser = { ...user, assessments: [...user.assessments, result] };
    addUser(updatedUser); // Update data store
    login(updatedUser); // Update context

    navigate('/result', { state: { result } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Preparing Assessment...</h2>
          <p className="text-slate-500 mt-2">Our AI is curating a unique scenario-based test for you.</p>
        </div>
      </div>
    );
  }

  return (
    <AssessmentRunner 
      questions={questions} 
      department={department as Department}
      onComplete={handleCompleteAssessment}
      onCancel={() => navigate('/dashboard')}
    />
  );
};
