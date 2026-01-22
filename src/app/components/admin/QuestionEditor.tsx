import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CheckCircle, Trash2 } from "lucide-react";
import { Question } from "../../interface/question.interface";
import { Department, Skill } from "../../interface/settings.interface";

interface QuestionEditorProps {
  question: Question;
  index: number;
  skillsData: Skill[];
  departmentsData: Department[];
  onChange: (updated: Question) => void;
  onRemove: () => void;
}

export function QuestionEditor({
  question,
  index,
  skillsData,
  departmentsData,
  onChange,
  onRemove
}: QuestionEditorProps) {

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Question {index + 1}</CardTitle>
          <CardDescription>Edit before submitting</CardDescription>
        </div>

        <Button
          size="icon"
          variant="destructive"
          onClick={onRemove}
          title="Remove question"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skill + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Skill Category</Label>
            <Select
              onValueChange={(val) => onChange({ ...question, skill_category: val })}
              value={question.skill_category || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Skill..." />
              </SelectTrigger>
              <SelectContent>
                {skillsData.map(s => (
                  <SelectItem key={s} value={s._id}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={question.department} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departmentsData.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scenario */}
        <div className="space-y-2">
          <Label>Scenario</Label>
          <Textarea
            placeholder="Describe the workplace situation..."
            value={question.scenario || ""}
            onChange={(e) =>
              onChange({ ...question, scenario: e.target.value })
            }
          />
        </div>

        {/* Question + Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label>Question</Label>
            <Input
              placeholder="What should the employee do?"
              value={question.question_text || ""}
              onChange={(e) =>
                onChange({ ...question, question_text: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Time Limit (Seconds)</Label>
            <Input
              type="number"
              min="10"
              max="300"
              value={question.time_seconds || 30}
              onChange={(e) =>
                onChange({
                  ...question,
                  time_seconds: parseInt(e.target.value) || 30
                })
              }
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label>Options</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map((opt, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...(question.options || [])];
                    newOpts[idx] = e.target.value;
                    onChange({ ...question, options: newOpts });
                  }}
                />

                <Button
                  type="button"
                  size="icon"
                  variant={idx === question.correct_option_index ? "default" : "outline"}
                  onClick={() =>
                    onChange({ ...question, correct_option_index: idx })
                  }
                  className={
                    idx === question.correct_option_index
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                  title="Mark as Correct"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
