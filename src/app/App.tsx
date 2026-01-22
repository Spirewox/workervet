import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { JobLandingView } from './components/JobLandingView';
import { JobBoardView } from './components/JobBoardView';
import { LoginView } from './components/LoginView';
import { ResultView } from './components/ResultView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import DashboardOverviewModule from './components/admin/DashboardOverview';
import UserManagementModule from './components/admin/UserManagement';
import QuestionsModule from './components/admin/QuestionsModule';
import JobsModule from './components/admin/JobsModule';
import SettingsModule from './components/admin/SettingsModule';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated , loading} = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Protected Route
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user,loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
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
      <Route path="/jobs" element={<JobBoardView />} />
      <Route path="/jobs/:jobId" element={<JobLandingView />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard onLogout={logout} />
          </AdminRoute>
        }
      >
        {/* 👇 These render INSIDE <Outlet /> */}
        <Route index element={<DashboardOverviewModule />} />
        <Route path="users" element={<UserManagementModule />} />
        <Route path="questions" element={<QuestionsModule />} />
        <Route path="jobs" element={<JobsModule />} />
        <Route path="settings" element={<SettingsModule />} />
      </Route>

      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardView />
        </ProtectedRoute>
      } />

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
