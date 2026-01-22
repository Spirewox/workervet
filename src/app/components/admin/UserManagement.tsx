import { getDepartments, getJobPostings, getUsers } from "../../services/dataStore";
import {useState} from "react"
import { SKILLS, User } from "../../types";
import { Input } from "../ui/input";
import { BarChart, Briefcase, Calendar, Mail, Search, Send, TrendingUp, Users, X } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const UserManagementModule: React.FC = () => {

  const users = getUsers();
  const jobs = getJobPostings();
  const [filter, setFilter] = useState<'all' | 'success'>('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'success' ? u.assessments.some(a => a.passed) : true;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return null;
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : null;
  };

  // Helper to calculate Skill stats for a user
  const calculateSkillStats = (user: User) => {
    const skillMap: Record<string, { correct: number; total: number }> = {};
    SKILLS.forEach(s => skillMap[s] = { correct: 0, total: 0 });

    user.assessments.forEach(a => {
        a.answers.forEach(ans => {
            if (ans.skill) {
                if (!skillMap[ans.skill]) skillMap[ans.skill] = { correct: 0, total: 0 };
                skillMap[ans.skill].total++;
                if (ans.isCorrect) skillMap[ans.skill].correct++;
            }
        });
    });

    return SKILLS.map(skill => {
        const data = skillMap[skill];
        const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        return { skill, percentage, count: data.total };
    });
  };

  const calculateOverallStats = (user: User) => {
      const totalAssessments = user.assessments.length;
      // const passed = user.assessments.filter(a => a.passed).length; // Unused
      const passRate = totalAssessments > 0 ? Math.round((user.assessments.filter(a => a.passed).length / totalAssessments) * 100) : 0;
      
      let totalScore = 0;
      let totalQuestions = 0;
      user.assessments.forEach(a => {
          totalScore += a.score;
          totalQuestions += a.totalQuestions;
      });
      const avgScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

      return { totalAssessments, passRate, avgScore };
  };

  const handleInvite = () => {
    if (!selectedUser) return;
    const subject = encodeURIComponent("Interview Invitation - Workervet");
    const body = encodeURIComponent(`Dear ${selectedUser.name},\n\nWe were impressed with your recent assessment results on Workervet. We would like to invite you for an interview to discuss potential opportunities.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nThe Hiring Team`);
    window.location.href = `mailto:${selectedUser.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-slate-900">Candidate Management</h2>
           <p className="text-slate-500 mt-1">Monitor candidate registrations, assessment history, and certifications.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
                placeholder="Search candidates..." 
                className="pl-9 w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
             <button 
               onClick={() => setFilter('all')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
             >
               All
             </button>
             <button 
               onClick={() => setFilter('success')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'success' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Certified
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No candidates found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredUsers.map((user, idx) => (
            <Card key={idx} className="flex flex-col h-full hover:shadow-lg transition-all duration-200 border-slate-200 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg ring-4 ring-white shadow-sm group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                         {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div>
                         <h3 className="font-bold text-base text-slate-900 leading-tight">{user.name}</h3>
                         <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                           <Mail className="w-3 h-3" /> {user.email}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-3 mb-6">
                   <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm border border-slate-100">
                      {user.targetDepartment && (
                        <div className="flex items-center justify-between">
                           <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Target</span>
                           <span className="font-medium text-slate-700 text-right">{user.targetDepartment}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                         <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Phone</span>
                         <span className="font-medium text-slate-700">{user.phone || 'N/A'}</span>
                      </div>
                      {user.cvFileName && (
                         <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">CV</span>
                            <span className="font-medium text-blue-600 truncate max-w-[120px]" title={user.cvFileName}>{user.cvFileName}</span>
                         </div>
                      )}
                   </div>
                </div>
                
                <Button 
                    variant="outline" 
                    className="w-full text-indigo-600 border-indigo-100 hover:bg-indigo-50"
                    onClick={() => setSelectedUser(user)}
                >
                    <BarChart className="w-4 h-4 mr-2" /> View Performance
                </Button>
              </div>

              <div className="mt-auto bg-slate-50/50 border-t border-slate-100 p-4">
                 <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Briefcase className="w-3 h-3" /> Recent Activity
                 </h4>
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {user.assessments.length > 0 ? user.assessments.slice().reverse().slice(0, 3).map(a => {
                      const jobTitle = getJobTitle(a.jobId);
                      return (
                        <div key={a.id} className="flex items-center justify-between bg-white p-2.5 rounded border border-slate-200 shadow-sm">
                           <div className="min-w-0 flex-1 mr-2">
                              <div className="font-medium text-xs text-slate-900 truncate" title={jobTitle || a.department}>
                                 {jobTitle || a.department}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                 <Calendar className="w-3 h-3" /> {new Date(a.date).toLocaleDateString()}
                              </div>
                           </div>
                           <Badge variant={a.passed ? "success" : "destructive"} className="h-5 px-1.5 text-[9px] uppercase">
                             {a.passed ? "Pass" : "Fail"}
                           </Badge>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-2 text-sm text-slate-400 italic bg-white rounded border border-dashed border-slate-200">
                        No assessments taken
                      </div>
                    )}
                 </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Performance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            {selectedUser.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{selectedUser.name}</h3>
                            <p className="text-sm text-slate-500">{selectedUser.targetDepartment || "No Dept"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={handleInvite} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          <Send className="w-4 h-4 mr-2" /> Invite to Interview
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                          <X className="w-5 h-5 text-slate-400 hover:text-slate-900" />
                      </Button>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                            const stats = calculateOverallStats(selectedUser);
                            return (
                                <>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Assessments</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalAssessments}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Pass Rate</p>
                                        <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.passRate}%</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Avg. Score</p>
                                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgScore}%</p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Skill Breakdown */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Skill Competency Profile
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                            {calculateSkillStats(selectedUser).map((stat) => (
                                <div key={stat.skill} className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">{stat.skill}</span>
                                        <span className="text-slate-500 font-mono">{stat.percentage}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                stat.percentage >= 80 ? 'bg-emerald-500' : 
                                                stat.percentage >= 60 ? 'bg-blue-500' : 
                                                stat.count === 0 ? 'bg-slate-300' : 'bg-amber-500'
                                            }`} 
                                            style={{ width: `${stat.percentage}%` }}
                                        />
                                    </div>
                                    {stat.count === 0 && <p className="text-[10px] text-slate-400">Not yet tested</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History Table */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Assessment History
                        </h4>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Context</th>
                                        <th className="px-4 py-3">Score</th>
                                        <th className="px-4 py-3 text-right">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedUser.assessments.length === 0 ? (
                                        <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No history available</td></tr>
                                    ) : (
                                        selectedUser.assessments.slice().reverse().map(a => (
                                            <tr key={a.id} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 text-slate-600">{new Date(a.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {getJobTitle(a.jobId) || a.department}
                                                    {a.jobId && <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Job App</span>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{a.score}/{a.totalQuestions} ({Math.round(a.score/a.totalQuestions * 100)}%)</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Badge variant={a.passed ? "success" : "destructive"}>
                                                        {a.passed ? "PASS" : "FAIL"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};


export default UserManagementModule