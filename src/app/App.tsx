import React from 'react';

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { JobLandingView } from './components/JobLandingView';
import { JobBoardView } from './components/JobBoardView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { ResultView } from './components/ResultView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { DashboardLayout } from './components/candidate/DashboardLayout';
import { DashboardOverviewPage } from './components/candidate/DashboardOverview';
import { JobBoardPage } from './components/candidate/JobBoardPage';
import { MyApplicationsPage } from './components/candidate/MyApplications';
import { TrainingCenterPage } from './components/candidate/TrainingCenter';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverviewPage } from './components/admin/AdminOverview';
import { AdminCandidatesPage } from './components/admin/AdminCandidates';
import { AdminCandidateDetailPage } from './components/admin/AdminCandidateDetail';
import { AdminJobsPage } from './components/admin/AdminJobs';
import { AdminQuestionsPage } from './components/admin/AdminQuestions';
import { AdminSettingsPage } from './components/admin/AdminSettings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // const { isAuthenticated , loading} = useAuth();
  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
  //     </div>
  //   );
  // }
  // if (!isAuthenticated && !loading) {
  //   return <Navigate to="/login" replace />;
  // }
  return <>{children}</>;
};

// Admin Protected Route — requires an authenticated user with the admin role.
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const { logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      
      {/* Public Routes */}
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/jobs" element={<JobBoardView />} />
      <Route path="/jobs/:jobId" element={<JobLandingView />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="jobs" element={<JobBoardPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="training" element={<TrainingCenterPage />} />
      </Route>
      {/* <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardView />
        </ProtectedRoute>
      } /> */}

      <Route path="/assessment/:department" element={
        <ProtectedRoute>
          <AssessmentView />
        </ProtectedRoute>
      } />

      <Route path="/result" element={
        <ProtectedRoute>
          <ResultView />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="candidates" element={<AdminCandidatesPage />} />
        <Route path="candidates/:candidateId" element={<AdminCandidateDetailPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="questions" element={<AdminQuestionsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <ToastContainer />
        <AppContent />
    </AuthProvider>
    </BrowserRouter>
  );
}
