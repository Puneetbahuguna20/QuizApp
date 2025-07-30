// AppRoutes.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import Index from "@/page/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import Quiz from "@/pages/Quiz";
import QuizResultsPage from "@/pages/QuizResultsPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { useAuth } from "@/contexts/AuthContext";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1120]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/TeacherDashboard" 
        element={
          <RoleBasedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/quiz/:quizId" 
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/results/:quizId" 
        element={
          <RoleBasedRoute allowedRoles={['teacher']}>
            <QuizResultsPage />
          </RoleBasedRoute>
        } 
      />
      {/* Add other protected routes as needed */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
