import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { PasswordInput } from './PasswordInput';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { ShieldCheck, ChevronLeft, Briefcase, Loader2, LogIn } from 'lucide-react';
import { useDepartments } from '../hooks/useSettings';
import { axiosPost } from '../lib/api';
import { toast } from 'sonner';
import { IJob } from '../interface/job.interface';
import { Department } from '../interface/settings.interface';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const jobContext = location.state?.job as IJob | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState<string>((jobContext?.department as Department)?._id || '');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const { data: departments } = useDepartments();

  const handleAuthSuccess = (user: User) => {
    login(user);
    if (jobContext) {
      navigate(`/jobs/${jobContext?._id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!cvFile) {
      toast.error('Please upload your CV to proceed.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', cvFile);
      const { secure_url, file_name } = await axiosPost('uploads/cv', formData, true);

      const user = await axiosPost(
        `users/candidate`,
        {
          full_name: name,
          email,
          password,
          target_department: department,
          cv: { filename: file_name || `${name}'s cv`, url: secure_url },
        },
        true,
      );

      handleAuthSuccess(user);
      toast.success('Candidate account created successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const renderTitle = () => {
    if (jobContext) return `Apply for ${jobContext.job_title}`;
    return 'Create an account';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-lg shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center pb-2 relative">
          {jobContext && (
            <button
              onClick={() => navigate('/jobs')}
              className="absolute top-0 left-0 text-slate-400 hover:text-slate-600 text-xs flex items-center"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> Back
            </button>
          )}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">{renderTitle()}</CardTitle>
          <CardDescription>Complete your profile to start assessments.</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleRegisterSubmit}
            className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <PasswordInput
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirm</Label>
                <PasswordInput
                  id="reg-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {!jobContext && (
              <div className="space-y-2">
                <Label htmlFor="department">Target Department</Label>
                <Select
                  value={department}
                  onValueChange={(val) => setDepartment(val)}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select Department..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((d) => (
                      <SelectItem key={d?._id} value={d?._id}>
                        {d?.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cv">Upload CV</Label>
              <Input
                id="cv"
                type="file"
                className="file:bg-slate-100 file:text-slate-700 file:border-0 file:rounded-md file:mr-4 file:px-2 file:text-xs hover:file:bg-slate-200 cursor-pointer text-slate-500"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {jobContext ? 'Create Account & Start' : 'Register & Enter'}
            </Button>
          </form>

          {/* CTA — already have an account */}
          <div className="mt-6 border-t border-slate-100 pt-5 space-y-3 text-center">
            <p className="text-sm text-slate-500">Already have an account?</p>
            <Button
              variant="outline"
              className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() =>
                navigate('/login', jobContext ? { state: { job: jobContext } } : undefined)
              }
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign in instead
            </Button>
          </div>

          {!jobContext && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/jobs')}
                className="w-full"
              >
                <Briefcase className="w-4 h-4 mr-2" /> View Open Positions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center w-full">
        <p className="text-xs text-slate-400">Protected by Workervet Academic Integrity Policy.</p>
      </div>
    </div>
  );
};
