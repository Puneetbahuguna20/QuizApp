
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuizList from '../components/QuizList'
import CreateQuizModal from '../components/CreateQuizModal'
import StudentManagement from '../components/StudentManagement'
import QuizResults from '../components/QuizResults'
import { quizService } from '../services/quizService'
import type { Quiz, Question } from '../services/quizService'
import { useAuth } from '@/contexts/AuthContext'

interface NewQuizData {
  title: string
  subject: string
  description: string
  duration: number
  passingScore: number
  questions: Question[]
}

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>(undefined)

  // Load quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (user?.email) {
        try {
          // Try to fetch quizzes from backend first
          const { quizApiService } = await import('@/services/quizApiService');
          const apiQuizzes = await quizApiService.getAllQuizzes();
          setQuizzes(apiQuizzes);
          console.log('Quizzes fetched from backend successfully');
        } catch (error) {
          console.error('Failed to fetch quizzes from backend, falling back to local storage', error);
          // Fallback to local storage if API fails
          const teacherQuizzes = quizService.getQuizzesByTeacher(user.email);
          setQuizzes(teacherQuizzes);
        }
      }
    };
    
    fetchQuizzes();
  }, [user?.email]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to create a new quiz
  const handleCreateQuiz = async (newQuizData: NewQuizData) => {
    if (!user?.email) return;

    const quizData = {
      ...newQuizData,
      status: 'draft' as const,
      createdBy: user.email,
    };

    try {
      // Try to create quiz in backend first
      const { quizApiService } = await import('@/services/quizApiService');
      const newQuiz = await quizApiService.createQuiz(quizData);
      console.log('Quiz created in backend successfully');
      setQuizzes(prevQuizzes => [newQuiz, ...prevQuizzes]);
    } catch (error) {
      console.error('Failed to create quiz in backend, falling back to local storage', error);
      // Fallback to local storage if API fails
      const newQuiz = quizService.createQuiz(quizData);
      setQuizzes(prevQuizzes => [newQuiz, ...prevQuizzes]);
    }
    
    setShowCreateModal(false);
    setActiveTab('quizzes');
  }

  // Function to update quiz status
  const handleUpdateQuizStatus = async (quizId: string, newStatus: 'active' | 'draft' | 'archived') => {
    try {
      // Try to update quiz status in backend first
      const { quizApiService } = await import('@/services/quizApiService');
      // Add updateQuiz method to quizApiService
      const updatedQuiz = await quizApiService.updateQuiz(quizId, { status: newStatus });
      console.log('Quiz status updated in backend successfully');
      setQuizzes(prevQuizzes =>
        prevQuizzes.map(quiz =>
          quiz.id === quizId ? updatedQuiz : quiz
        )
      );
    } catch (error) {
      console.error('Failed to update quiz status in backend, falling back to local storage', error);
      // Fallback to local storage if API fails
      const updatedQuiz = quizService.updateQuiz(quizId, { status: newStatus });
      if (updatedQuiz) {
        setQuizzes(prevQuizzes =>
          prevQuizzes.map(quiz =>
            quiz.id === quizId ? updatedQuiz : quiz
          )
        );
      }
    }
  }

  // Function to delete a quiz
  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        // Try to delete quiz in backend first
        const { quizApiService } = await import('@/services/quizApiService');
        await quizApiService.deleteQuiz(quizId);
        console.log('Quiz deleted from backend successfully');
        setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
      } catch (error) {
        console.error('Failed to delete quiz from backend, falling back to local storage', error);
        // Fallback to local storage if API fails
        const success = quizService.deleteQuiz(quizId);
        if (success) {
          setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
        }
      }
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview quizzes={quizzes} onCreateQuiz={() => setShowCreateModal(true)} />
      case 'quizzes':
        return (
          <QuizList 
            quizzes={quizzes}
            onCreateQuiz={() => setShowCreateModal(true)}
            onUpdateStatus={handleUpdateQuizStatus}
            onDeleteQuiz={handleDeleteQuiz}
            onViewResults={(quizId) => {
              setSelectedQuizId(quizId);
              setActiveTab('results');
            }}
          />
        )
      case 'results':
        return <QuizResults teacherId={user?.email || ''} quizId={selectedQuizId} />
      case 'students':
        return <StudentManagement />
      default:
        return <DashboardOverview quizzes={quizzes} onCreateQuiz={() => setShowCreateModal(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#0c0c0c] border-b border-white/10 shadow-md">
        <h1 className="text-2xl font-bold">QuickQuiz - Teacher Portal</h1>
        <div className="flex gap-4">
          <Link to="/" className="text-white hover:underline">Home</Link>
          <Link to="/dashboard" className="text-white hover:underline">Student View</Link>
          <button 
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#10172a] border-r border-white/10 flex flex-col py-8 px-4 gap-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Teacher Dashboard</h3>
          </div>
          <nav className="flex flex-col gap-2">
            <button 
              className={`text-left px-4 py-2 rounded-lg transition font-medium ${activeTab === 'overview' ? 'bg-blue-900 text-white' : 'hover:bg-white/10 text-white/80'}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`text-left px-4 py-2 rounded-lg transition font-medium ${activeTab === 'quizzes' ? 'bg-blue-900 text-white' : 'hover:bg-white/10 text-white/80'}`}
              onClick={() => setActiveTab('quizzes')}
            >
              📝 Quizzes ({quizzes.length})
            </button>
            <button 
              className={`text-left px-4 py-2 rounded-lg transition font-medium ${activeTab === 'results' ? 'bg-blue-900 text-white' : 'hover:bg-white/10 text-white/80'}`}
              onClick={() => setActiveTab('results')}
            >
              📋 Results
            </button>
            <button 
              className={`text-left px-4 py-2 rounded-lg transition font-medium ${activeTab === 'students' ? 'bg-blue-900 text-white' : 'hover:bg-white/10 text-white/80'}`}
              onClick={() => setActiveTab('students')}
            >
              👥 Students
            </button>
          </nav>
          <div className="mt-auto">
            <button 
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg mt-4"
              onClick={() => setShowCreateModal(true)}
            >
              ➕ Create New Quiz
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
            {activeTab === 'quizzes' && (
              <button 
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg"
                onClick={() => setShowCreateModal(true)}
              >
                ➕ Create New Quiz
              </button>
            )}
          </div>
          <div>
            {renderTabContent()}
          </div>
        </main>
      </div>

      {showCreateModal && (
        <CreateQuizModal 
          onClose={() => setShowCreateModal(false)}
          onCreateQuiz={handleCreateQuiz}
        />
      )}
    </div>
  )
}

interface DashboardOverviewProps {
  quizzes: Quiz[]
  onCreateQuiz: () => void
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ quizzes, onCreateQuiz }) => {
  // Calculate dynamic statistics
  const totalQuizzes = quizzes.length
  const activeQuizzes = quizzes.filter(q => q.status === 'active').length
  const totalAttempts = quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0)
  const averageScore = quizzes.length > 0 
    ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.length)
    : 0

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#181f36] rounded-xl p-6 flex flex-col items-center shadow-md">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-semibold">Total Quizzes</h3>
          <p className="text-2xl font-bold">{totalQuizzes}</p>
          <span className="text-xs text-white/60">{activeQuizzes} active</span>
        </div>
        <div className="bg-[#181f36] rounded-xl p-6 flex flex-col items-center shadow-md">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-semibold">Total Students</h3>
          <p className="text-2xl font-bold">156</p>
          <span className="text-xs text-white/60">5 this week</span>
        </div>
        <div className="bg-[#181f36] rounded-xl p-6 flex flex-col items-center shadow-md">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="font-semibold">Total Attempts</h3>
          <p className="text-2xl font-bold">{totalAttempts}</p>
          <span className="text-xs text-white/60">Across all quizzes</span>
        </div>
        <div className="bg-[#181f36] rounded-xl p-6 flex flex-col items-center shadow-md">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold">Average Score</h3>
          <p className="text-2xl font-bold">{averageScore}%</p>
          <span className="text-xs text-white/60">Overall performance</span>
        </div>
      </div>
      <div className="bg-[#181f36] rounded-xl p-6 shadow-md">
        <h3 className="font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">📝</span>
            <div>
              <p><strong>Math Quiz Chapter 5</strong> was completed by <strong>John Doe</strong></p>
              <span className="text-xs text-white/60">2 hours ago</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">👥</span>
            <div>
              <p><strong>5 new students</strong> enrolled in your course</p>
              <span className="text-xs text-white/60">4 hours ago</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p><strong>Science Quiz</strong> average score improved to <strong>85%</strong></p>
              <span className="text-xs text-white/60">1 day ago</span>
            </div>
          </div>
          {quizzes.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xl">➕</span>
              <div>
                <p><strong>Latest Quiz:</strong> {quizzes[0].title}</p>
                <span className="text-xs text-white/60">{new Date(quizzes[0].createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard