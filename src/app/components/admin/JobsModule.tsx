import { Edit2, Plus, Trash2 } from "lucide-react";
import { Department, JobPosting } from "../../types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addJobPosting, deleteJobPosting, getDepartments, getJobPostings, updateJobPosting } from "../../services/dataStore";
import {useState} from "react"

const JobsModule= () => {
  const jobs = getJobPostings();
  const departments = getDepartments();
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<JobPosting>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentJob.id) {
        updateJobPosting(currentJob as JobPosting);
    } else {
        addJobPosting({
            ...currentJob,
            id: `job-${Date.now()}`,
            createdAt: new Date().toISOString(),
            active: true
        } as JobPosting);
    }
    setIsEditing(false);
    setCurrentJob({});
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this job posting?')) {
          deleteJobPosting(id);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-slate-900">Job Board Management</h2>
           <p className="text-slate-500 mt-1">Create and manage job listings.</p>
        </div>
        <Button onClick={() => { setCurrentJob({}); setIsEditing(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      {isEditing ? (
          <Card className="max-w-3xl mx-auto">
              <CardHeader>
                  <CardTitle>{currentJob.id ? 'Edit Job' : 'Post New Job'}</CardTitle>
              </CardHeader>
              <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Job Title</Label>
                              <Input 
                                  value={currentJob.title || ''} 
                                  onChange={e => setCurrentJob({...currentJob, title: e.target.value})}
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label>Department</Label>
                              <Select 
                                  value={currentJob.department || ''}
                                  onValueChange={val => setCurrentJob({...currentJob, department: val as Department})}
                                  required
                              >
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select Department..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea 
                              value={currentJob.description || ''} 
                              onChange={e => setCurrentJob({...currentJob, description: e.target.value})}
                              required
                              className="min-h-[100px]"
                          />
                      </div>

                      <div className="space-y-2">
                          <Label>Requirements</Label>
                          <Textarea 
                              value={currentJob.requirements || ''} 
                              onChange={e => setCurrentJob({...currentJob, requirements: e.target.value})}
                              className="min-h-[100px]"
                              placeholder="- Requirement 1&#10;- Requirement 2"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Location</Label>
                              <Input 
                                  value={currentJob.location || ''} 
                                  onChange={e => setCurrentJob({...currentJob, location: e.target.value})}
                                  placeholder="e.g. Remote, New York"
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <Label>Salary Range</Label>
                              <Input 
                                  value={currentJob.salaryRange || ''} 
                                  onChange={e => setCurrentJob({...currentJob, salaryRange: e.target.value})}
                                  placeholder="e.g. $80k - $100k"
                              />
                          </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                          <Button type="submit">Save Job Posting</Button>
                      </div>
                  </form>
              </CardContent>
          </Card>
      ) : (
        <div className="grid gap-4">
            {jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start group hover:border-blue-200 transition-all">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                            <Badge variant={job.active ? 'success' : 'secondary'} className="text-[10px]">
                                {job.active ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{job.department} • {job.location}</p>
                        <p className="text-sm text-slate-600 line-clamp-2 max-w-2xl">{job.description}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" onClick={() => { setCurrentJob(job); setIsEditing(true); }}>
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
            {jobs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No jobs posted yet.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default JobsModule