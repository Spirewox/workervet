import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { JobLandingView } from './components/JobLandingView';
import { JobBoardView } from './components/JobBoardView';
import { LoginView } from './components/LoginView';
import { ResultView } from './components/ResultView';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { DashboardLayout } from './components/candidate/DashboardLayout';
import { DashboardOverviewPage } from './components/candidate/DashboardOverview';
import { JobBoardPage } from './components/candidate/JobBoardPage';

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

// Admin Protected Route
// const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
//   const { user,loading } = useAuth();
//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
//       </div>
//     );
//   }
//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return children;
// };

function AppContent() {
  const { logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      
      {/* Public Routes */}
      <Route path="/login" element={<LoginView />} />
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

      {/* Protected User Routes */}
      
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
