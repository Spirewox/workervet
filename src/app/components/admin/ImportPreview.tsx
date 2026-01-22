import { useState } from "react";
import { Button } from "../ui/button";
import { QuestionEditor } from "./QuestionEditor";
import { Question } from "../../interface/question.interface";
import { Department, Skill } from "../../interface/settings.interface";

interface ImportPreviewProps {
  initialQuestions: Question[];
  skillsData: Skill[];
  isSubmittingImport : boolean
  departmentsData: Department[];
  onSubmitAll: (questions: Question[]) => void;
  onCancel?: () => void;
}

export function ImportPreview({
  initialQuestions,
  skillsData,
  departmentsData,
  isSubmittingImport,
  onSubmitAll,
  onCancel
}: ImportPreviewProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  // Track validity per question
  const [validity, setValidity] = useState<Record<number, boolean>>(
    () => initialQuestions.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );

  const updateQuestion = (index: number, updated: Question) => {
    const newQs = [...questions];
    newQs[index] = updated;
    setQuestions(newQs);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    setValidity(prev => {
      const newValidity: Record<number, boolean> = {};
      Object.keys(prev).forEach(key => {
        const k = Number(key);
        if (k !== index) {
          newValidity[k < index ? k : k - 1] = prev[k];
        }
      });
      return newValidity;
    });
  };

  const handleValidityChange = (index: number, isValid: boolean) => {
    setValidity(prev => ({ ...prev, [index]: isValid }));
  };

  const allValid = Object.values(validity).every(v => v) && questions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Preview Imported Questions ({questions.length})
        </h2>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button
            onClick={() => onSubmitAll(questions)}
            disabled={!allValid|| isSubmittingImport}
          >
            Submit All
          </Button>
        </div>
      </div>

      {/* Editors */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <QuestionEditor
            key={q._id || idx}
            question={q}
            index={idx}
            skillsData={skillsData}
            departmentsData={departmentsData}
            onChange={(updated) => updateQuestion(idx, updated)}
            onRemove={() => removeQuestion(idx)}
            onValidityChange={(isValid) => handleValidityChange(idx, isValid)} // NEW
          />
        ))}
      </div>
    </div>
  );
}

