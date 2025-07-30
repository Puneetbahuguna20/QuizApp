import React from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizResults from '@/components/QuizResults';
import { useAuth } from '@/contexts/AuthContext';

const QuizResultsPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#0c0c0c] border-b border-white/10 shadow-md">
        <h1 className="text-2xl font-bold">QuickQuiz - Quiz Results</h1>
        <div className="flex gap-4">
          <Link to="/TeacherDashboard" className="text-white hover:underline">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/TeacherDashboard" 
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Quiz Results</h2>
          
          {user?.email ? (
            <QuizResults teacherId={user.email} quizId={quizId} />
          ) : (
            <div className="bg-[#181f36] border-white/10 p-8 rounded-xl text-center">
              <p className="text-white/60">You need to be logged in to view quiz results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;