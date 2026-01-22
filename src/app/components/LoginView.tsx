import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Department, JobPosting } from '../types';
import { addUser, getUserByEmail, updateUserPassword, getDepartments } from '../services/dataStore';
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
  CardFooter 
} from './ui/card';
import { 
  ShieldCheck, 
  ChevronLeft, 
  Zap,
  Briefcase,
  Loader2
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Job context passed via navigation state or query params could be handled here
  // For now we assume activeJob might be passed in state if navigating from Job Board
  const jobContext = location.state?.job as JobPosting | undefined;

  const [mode, setMode] = useState<'signin' | 'register'>('register');
  const [loginStep, setLoginStep] = useState<'email' | 'password' | 'create-password'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState<Department | ''>(jobContext?.department || '');
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const departments = getDepartments();

  // Reset state when switching modes
  useEffect(() => {
    setError(null);
    setLoginStep('email');
    setPassword('');
    setConfirmPassword('');
    if (mode === 'register') {
      setName('');
      setPhone('');
    }
  }, [mode]);

  const handleAuthSuccess = (user: User) => {
    login(user);
    if (jobContext) {
      // Navigate back to the job they were trying to apply for
      navigate(`/jobs/${jobContext.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newUser: User = {
        name,
        email,
        phone,
        password,
        cvFileName: cvFile?.name,
        targetDepartment: department as Department,
        assessments: []
      };
      
      addUser(newUser);
      setLoading(false);
      handleAuthSuccess(newUser);
    }, 800);
  };

  const handleSignInFlow = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loginStep === 'email') {
      // Step 1: Check if user exists
      const user = getUserByEmail(email);
      if (!user) {
        setError("No account found with this email. Please register.");
        return;
      }
      
      if (user.password) {
        setLoginStep('password');
      } else {
        // User exists but has no password (Legacy user from before feature)
        setLoginStep('create-password');
      }
    } else if (loginStep === 'password') {
      // Step 2a: Verify password
      const user = getUserByEmail(email);
      if (user && user.password === password) {
         setLoading(true);
         setTimeout(() => {
           setLoading(false);
           handleAuthSuccess(user);
         }, 600);
      } else {
        setError("Incorrect password.");
      }
    } else if (loginStep === 'create-password') {
      // Step 2b: Create password for legacy user
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      
      updateUserPassword(email, password);
      const user = getUserByEmail(email);
      if (user) {
        setLoading(true);
        setTimeout(() => {
           setLoading(false);
           alert("Password set successfully! Logging you in...");
           handleAuthSuccess(user);
        }, 800);
      }
    }
  };

  const handleQuickLogin = () => {
    setLoading(true);
    setTimeout(() => {
       // Check if Alex exists
       let user = getUserByEmail('alex.j@example.com');
       if (!user) {
          // Create if not exists (fallback)
          user = {
            name: "Alex Johnson",
            email: "alex.j@example.com",
            phone: "555-0101",
            targetDepartment: "Sales & Customer Management",
            password: "password123",
            assessments: []
          };
          addUser(user);
       } else if (!user.password) {
         // Ensure alex has password for subsequent logins
         updateUserPassword(user.email, "password123");
         user.password = "password123";
       }
       setLoading(false);
       handleAuthSuccess(user);
    }, 600);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const renderTitle = () => {
    if (jobContext) {
      if (mode === 'signin') return `Sign in to apply for ${jobContext.title}`;
      return `Apply for ${jobContext.title}`;
    }
    if (mode === 'signin') return "Welcome back!";
    return "Create an account";
  };

  const renderDescription = () => {
    if (mode === 'signin') {
      if (loginStep === 'create-password') return "Please secure your account with a password.";
      return "Enter your credentials to access your dashboard.";
    }
    return "Complete your profile to start assessments.";
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
           <CardDescription>{renderDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'signin' ? (
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
                      <button type="button" onClick={() => { setLoginStep('email'); setPassword(''); }} className="text-xs text-indigo-600 hover:underline">Change</button>
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

               {loginStep === 'create-password' && (
                 <div className="space-y-4">
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-800">
                     It looks like you've applied before but haven't set a password. Please create one now to secure your account.
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="new-password">Create Password</Label>
                     <PasswordInput
                       id="new-password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       minLength={6}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="confirm-password">Confirm Password</Label>
                     <PasswordInput
                       id="confirm-password" 
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       required
                       minLength={6}
                     />
                   </div>
                 </div>
               )}

               {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

               <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {loginStep === 'email' ? 'Continue' : (loginStep === 'create-password' ? 'Save & Sign In' : 'Sign In')}
               </Button>

               {/* Quick Login for Test */}
               <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Testing</span></div>
               </div>
               <Button 
                 type="button" 
                 variant="outline" 
                 className="w-full text-indigo-600 border-indigo-100 hover:bg-indigo-50" 
                 onClick={handleQuickLogin}
                 disabled={loading}
               >
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {!loading && <Zap className="w-4 h-4 mr-2" />}
                 Quick Login (Test)
               </Button>
             </form>
          ) : (
            // REGISTER FORM
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
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
                      onValueChange={(val) => setDepartment(val as Department)}
                      required
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select Department..." />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cv">Upload CV (Optional)</Label>
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
          )}

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button 
              type="button" 
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Register" 
                : "Already have an account? Sign in"}
            </button>
          </div>
          
          {!jobContext && (
            <div className="mt-4 pt-2 text-center">
               <Button variant="outline" size="sm" onClick={() => navigate('/jobs')} className="w-full">
                  <Briefcase className="w-4 h-4 mr-2" /> View Open Positions
               </Button>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">
            Administrator? <button className="text-indigo-600 hover:underline" onClick={() => navigate('/admin/login')}>Login here</button>
          </p>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-4 text-center w-full">
         <p className="text-xs text-slate-400">
           Protected by Workervet Academic Integrity Policy.
         </p>
      </div>
    </div>
  );
};
