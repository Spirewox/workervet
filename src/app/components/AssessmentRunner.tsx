import React, { useState, useEffect } from 'react';
import { Question, Department } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useSkills } from '../hooks/useSettings';

interface AssessmentRunnerProps {
  questions: Question[];
  department : string;
  onComplete: (answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[]) => void;
  onCancel: () => void;
}

const DEFAULT_TIME_PER_QUESTION = 20;

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({ questions,department, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{question : string, selected_option : string}[]>([]);
  const {data : skillData} = useSkills()
  const currentQuestion = questions?.[currentIndex];
  // Use specific time limit or default
  const timeLimit = currentQuestion?.timeLimit || DEFAULT_TIME_PER_QUESTION;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const totalQuestions = questions?.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = ({
    question,
    selected_option,
  }: {
    question: string;
    selected_option: string;
  }) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(
        ans => ans.question === question
      );

      if (existingIndex !== -1) {
        // ✅ Update existing answer
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          selected_option,
        };
        return updated;
      }

      // ✅ Add new answer
      return [...prev, { question, selected_option }];
    });
  };


  const finishAssessment = () => {
    onComplete(answers);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || DEFAULT_TIME_PER_QUESTION);
    }
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentIndex]);

  if (!currentQuestion) {
    return <div className="p-8 text-center">No questions available.</div>;
  }

  const isAlarm = timeLeft <= 5;
  const currentAnswer = answers?.find(
    ans => ans.question === currentQuestion?.question_id
  );

  const currentSkill = skillData?.find(
    ans => ans._id === currentQuestion?.skill
  );
  const isCurrentAnswered = !!currentAnswer?.selected_option;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{department} Assessment</h2>
          <div className="flex items-center gap-2 mt-1">
             <Badge variant="secondary" className="text-xs">
                Question {currentIndex + 1} of {totalQuestions}
             </Badge>
             <span className="text-sm text-slate-500">Evaluating: <span className="font-medium text-slate-900">{currentSkill?.skill_name}</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Timer Display */}
            <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border font-mono font-bold transition-all duration-300",
                isAlarm 
                  ? "bg-red-50 border-red-200 text-red-600 animate-pulse ring-2 ring-red-100" 
                  : "bg-white border-slate-200 text-slate-700"
            )}>
                {isAlarm ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                <span>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden relative">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <Card className={cn("mb-8 shadow-md transition-colors duration-500", isAlarm && "border-red-200 shadow-red-50")}>
        <CardContent className="p-8">
          <div className="mb-8">
            <p className="text-lg text-slate-800 leading-relaxed font-medium">
              {currentQuestion.scenario}
            </p>
            <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border-l-4 border-blue-600">
               <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Question</h3>
               <p className="text-slate-800 font-medium">{currentQuestion.questionText}</p>
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
               const isSelected = currentAnswer?.selected_option === option._id;
              return (
                <div 
                  key={idx}
                  onClick={() => handleOptionSelect({question : currentQuestion.question_id, selected_option : option._id})}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center group",
                    isSelected 
                      ? "border-slate-900 bg-slate-900 text-white shadow-md" 
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors",
                    isSelected ? "border-white" : "border-slate-300 group-hover:border-slate-400"
                  )}>
                     {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                  </div>
                  <span className={cn("text-sm font-medium", isSelected ? "text-white" : "text-slate-700")}>
                    {option?.content}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button 
          disabled={!isCurrentAnswered} 
          onClick={handleNext}
          className="min-w-[140px]"
        >
          {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'} 
          {currentIndex < totalQuestions - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};