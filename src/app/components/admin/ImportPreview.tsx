import { useState } from "react";
import { Button } from "../ui/button";
import { QuestionEditor } from "./QuestionEditor";
import { Question } from "../../interface/question.interface";
import { Department, Skill } from "../../interface/settings.interface";

interface ImportPreviewProps {
  initialQuestions: Question[];
  skillsData: Skill[];
  departmentsData: Department[];
  onSubmitAll: (questions: Question[]) => void;
  onCancel?: () => void;
}

export function ImportPreview({
  initialQuestions,
  skillsData,
  departmentsData,
  onSubmitAll,
  onCancel
}: ImportPreviewProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const updateQuestion = (index: number, updated: Question) => {
    const newQs = [...questions];
    newQs[index] = updated;
    setQuestions(newQs);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

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
            disabled={questions.length === 0}
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
          />
        ))}
      </div>
    </div>
  );
}
