import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { quizService } from "@/services/quizService";
import type { Quiz } from "@/services/quizService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [userAttempts, setUserAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch quizzes from backend first
        const { quizApiService } = await import('@/services/quizApiService');
        const apiQuizzes = await quizApiService.getAllQuizzes();
        // Filter for active quizzes only
        const activeApiQuizzes = apiQuizzes.filter(quiz => quiz.status === 'active');
        setAvailableQuizzes(activeApiQuizzes);
        console.log('Quizzes fetched from backend successfully');
        
        // Try to fetch user's quiz attempts from backend
        if (user?.email) {
          try {
            const { reportService } = await import('@/services/reportService');
            const myReports = await reportService.getMyReports();
            setUserAttempts(myReports);
            console.log('User attempts fetched from backend successfully');
          } catch (error) {
            console.error('Failed to fetch user attempts from backend, falling back to local storage', error);
            // Fallback to local storage if API fails
            const attempts = quizService.getStudentQuizHistory(user.email);
            setUserAttempts(attempts);
          }
        }
      } catch (error) {
        console.error('Failed to fetch quizzes from backend, falling back to local storage', error);
        // Fallback to local storage if API fails
        const activeQuizzes = quizService.getActiveQuizzes();
        setAvailableQuizzes(activeQuizzes);
        
        // Also load user's quiz attempts from local storage
        if (user?.email) {
          const attempts = quizService.getStudentQuizHistory(user.email);
          setUserAttempts(attempts);
        }
      }
    };
    
    fetchData();
  }, [user?.email]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Navigate to home page instead of login
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTakeQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  // Function to navigate to teacher dashboard (only for hardcoded teacher account)
  const handleGoToTeacherBoard = () => {
    navigate('/TeacherDashboard');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Only the hardcoded teacher account can access teacher dashboard
  const isTeacher = user?.email === 'teacher@123gmail.com';

  return (
    <div className="min-h-screen bg-[#0b1120] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <div className="flex gap-3">
            {isTeacher && (
              <Button
                onClick={handleGoToTeacherBoard}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Teacher Board
              </Button>
            )}
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="bg-[#0c0c0c] text-white border border-white/10 mb-8">
          <CardHeader>
            <CardTitle>Welcome back, {user?.name}!</CardTitle>
            <CardDescription className="text-white/50">
              Ready to test your knowledge? Choose from the available quizzes below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/60">Total Quizzes Taken:</span>
                <p className="font-medium text-lg">{userAttempts.length}</p>
              </div>
              <div>
                <span className="text-white/60">Available Quizzes:</span>
                <p className="font-medium text-lg">{availableQuizzes.length}</p>
              </div>
              <div>
                <span className="text-white/60">Average Score:</span>
                <p className="font-medium text-lg">
                  {userAttempts.length > 0 
                    ? Math.round(userAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / userAttempts.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Quizzes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Quizzes</h2>
          {availableQuizzes.length === 0 ? (
            <Card className="bg-[#0c0c0c] text-white border border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/60 mb-4">No quizzes available at the moment.</p>
                <p className="text-white/40 text-sm">Check back later for new quizzes!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableQuizzes.map((quiz) => {
                const userAttempt = userAttempts.find(attempt => attempt.quizId === quiz.id);
                return (
                  <Card key={quiz.id} className="bg-[#0c0c0c] text-white border border-white/10 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription className="text-white/50">
                        {quiz.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Subject:</span>
                            <p className="font-medium">{quiz.subject}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Questions:</span>
                            <p className="font-medium">{quiz.questions.length}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Duration:</span>
                            <p className="font-medium">{quiz.duration} min</p>
                          </div>
                          <div>
                            <span className="text-white/60">Passing Score:</span>
                            <p className="font-medium">{quiz.passingScore}%</p>
                          </div>
                        </div>
                        
                        {userAttempt && (
                          <div className="border-t border-white/10 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/60">Your Score:</span>
                              <span className={`font-bold ${getScoreColor(userAttempt.score)}`}>
                                {userAttempt.score}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/60">Status:</span>
                              <span className={`font-medium ${userAttempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                                {userAttempt.passed ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                          </div>
                        )}

                        <Button 
                          className="w-full bg-[#0d1c44] text-white hover:bg-[#0a1736]"
                          onClick={() => handleTakeQuiz(quiz.id)}
                        >
                          {userAttempt ? 'Retake Quiz' : 'Take Quiz'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        {userAttempts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Attempts</h2>
            <div className="grid gap-4">
              {[...userAttempts].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 5).map((attempt) => (
                <Card key={attempt.id} className="bg-[#0c0c0c] text-white border border-white/10">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{attempt.quiz.title}</h3>
                        <p className="text-white/60 text-sm">
                          Completed on {new Date(attempt.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                          {attempt.score}%
                        </div>
                        <div className={`text-sm ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;