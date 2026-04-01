import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { PasswordInput } from './PasswordInput';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { ShieldCheck, ChevronLeft, Briefcase, Loader2, UserPlus } from 'lucide-react';
import { axiosPost } from '../lib/api';
import { toast } from 'sonner';
import { IJob } from '../interface/job.interface';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const jobContext = location.state?.job as IJob | undefined;

  const [loginStep, setLoginStep] = useState<'email' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSuccess = (user: User) => {
    login(user);
    if (jobContext) {
      // Navigate back to the job they were trying to apply for
      navigate(`/jobs/${jobContext?._id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignInFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginStep === 'email') {
      // Step 1: Check if user exists
      setLoading(true)
      const {signedUp} = await axiosPost(`auth/candidate/check`,{ email},true);
      setLoading(false)
      if (!signedUp) {
        setError("No account found with this email. Please register.");
        return;
      }
      setLoginStep('password');
      
      // if (user.password) {
      //   setLoginStep('password');
      // } else {
      //   // User exists but has no password (Legacy user from before feature)
      //   setLoginStep('create-password');
      // }
    } else if (loginStep === 'password') {
      setLoading(true);
      const { user } = await axiosPost(`auth/candidate/login`, { email, password }, true);
      if (user) {
        handleAuthSuccess(user);
      } else {
        setError('Incorrect password.');
      }
      setLoading(false);
    }
  };

  // const handleQuickLogin = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //      // Check if Alex exists
  //      let user = getUserByEmail('alex.j@example.com');
  //      if (!user) {
  //         // Create if not exists (fallback)
  //         user = {
  //           name: "Alex Johnson",
  //           email: "alex.j@example.com",
  //           phone: "555-0101",
  //           targetDepartment: "Sales & Customer Management",
  //           password: "password123",
  //           assessments: []
  //         };
  //         addUser(user);
  //      } else if (!user.password) {
  //        // Ensure alex has password for subsequent logins
  //        updateUserPassword(user.email, "password123");
  //        user.password = "password123";
  //      }
  //      setLoading(false);
  //      handleAuthSuccess(user);
  //   }, 600);
  // };

  const renderTitle = () => {
    if (jobContext) return `Sign in to apply for ${jobContext.job_title}`;
    return 'Welcome back!';
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
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignInFlow} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {loginStep === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}

            {loginStep === 'password' && (
              <>
                <div className="p-3 bg-slate-50 rounded-md flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600 font-medium">{email}</span>
                  <button
                    type="button"
                    onClick={() => { setLoginStep('email'); setPassword(''); }}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <PasswordInput
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <Button type="submit" className="w-full mt-2 cursor-pointer" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loginStep === 'email' ? 'Continue' : 'Sign In'}
            </Button>
          </form>

          {/* CTA — no account yet */}
          <div className="mt-6 border-t border-slate-100 pt-5 space-y-3 text-center">
            <p className="text-sm text-slate-500">Don't have an account yet?</p>
            <Button
              variant="outline"
              className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() =>
                navigate('/register', jobContext ? { state: { job: jobContext } } : undefined)
              }
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create a free account
            </Button>
          </div>

          {!jobContext && (
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/jobs')} className="w-full">
                <Briefcase className="w-4 h-4 mr-2" /> View Open Positions
              </Button>
            </div>
          )}

        </CardContent>
        {/* <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">
            Administrator? <button className="text-indigo-600 hover:underline" onClick={() => navigate('/admin/login')}>Login here</button>
          </p>
        </CardFooter> */}
      </Card>
      
      <div className="absolute bottom-4 text-center w-full">
         <p className="text-xs text-slate-400">
           Protected by Workervet Academic Integrity Policy.
         </p>
      </div>
    </div>
  );
};
