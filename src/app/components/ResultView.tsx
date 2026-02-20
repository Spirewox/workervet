import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AssessmentResult } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/utils';
import { 
  CheckCircle, 
  XCircle, 
  Inbox, 
  ArrowRight 
} from 'lucide-react';

export const ResultView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as AssessmentResult | undefined;

  if (!result) {
    // If accessed directly without state, redirect
    // We can't redirect in render easily without flashing content, but we can return null and use useEffect
    // or just show a button to go back.
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
    );
  }

  const percentage = result.percentage;
  const isJobLink = !!result.jobId;

  const passed = result?.result == "pass"

  const handleBack = () => {
    if (result.jobId && result.result == "pass") {
        navigate(`/jobs/${result.jobId}`);
    } else {
        navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header Status */}
          <div className={cn(
            "p-8 text-center space-y-4",
            passed ? "bg-emerald-50/50" : "bg-red-50/50"
          )}>
            <div className="flex justify-center">
              {passed ? (
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {passed? 'Certification Earned!' : 'Assessment Failed'}
              </h2>
              <p className="text-slate-500 text-sm">
                {passed 
                  ? `You have demonstrated proficiency in ${result.department_name} workplace scenarios.`
                  : `You did not meet the passing criteria for ${result.department_name}.`
                }
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Hiring Pipeline Notification */}
            {passed && (
              <div className="bg-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-200/50 flex items-start gap-4 animate-in slide-in-from-top-2 duration-500">
                <div className="bg-white/20 p-2 rounded-lg shrink-0">
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                <div>
                   <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Hiring Pipeline Update</h4>
                   <p className="text-sm text-emerald-50 leading-relaxed font-medium">
                      The hiring manager has added you to the hiring pipeline and you will be contacted for an interview via email.
                   </p>
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Accuracy Score</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{percentage}%</p>
                </div>
                <div className="text-center border-l border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Correct Answers</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{result.total_score}/{result.max_score}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button size="lg" className="w-full h-12 text-base" onClick={handleBack}>
                {isJobLink && passed 
                  ? "Continue to Job" 
                  : "Return to Dashboard"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
