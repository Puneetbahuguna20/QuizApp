import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { quizService } from '@/services/quizService';
import { reportService } from '@/services/reportService';
import type { Quiz, QuizAttempt } from '@/services/quizService';
import type { Report } from '@/services/reportService';

interface QuizResultsProps {
  quizId?: string;
  teacherId: string;
}

type ResultItem = QuizAttempt | Report;

const QuizResults: React.FC<QuizResultsProps> = ({ quizId, teacherId }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (quizId) {
          // Try to fetch from backend first
          try {
            const reports = await reportService.getReportsByQuiz(quizId);
            if (reports && reports.length > 0) {
              setResults(reports);
              // If the quiz info is included in the report, use it
              if (reports[0].quiz) {
                setQuiz(reports[0].quiz as Quiz);
              } else {
                // Otherwise fetch it from local storage
                const quizData = quizService.getQuizById(quizId);
                if (quizData) setQuiz(quizData);
              }
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error fetching reports from API, falling back to local storage', err);
          }
          
          // Fallback to local storage
          const quizData = quizService.getQuizById(quizId);
          if (quizData && quizData.createdBy === teacherId) {
            setQuiz(quizData);
            const quizAttempts = quizService.getAttemptsByQuiz(quizId);
            setResults(quizAttempts);
          }
        } else {
          // Try to fetch all reports from backend first
          try {
            const allReports = await reportService.getAllReports();
            if (allReports && allReports.length > 0) {
              setResults(allReports);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error fetching all reports from API, falling back to local storage', err);
          }
          
          // Fallback to local storage
          const teacherQuizzes = quizService.getQuizzesByTeacher(teacherId);
          const allAttempts: QuizAttempt[] = [];
          
          teacherQuizzes.forEach(quiz => {
            const quizAttempts = quizService.getAttemptsByQuiz(quiz.id);
            allAttempts.push(...quizAttempts);
          });
          
          setResults(allAttempts);
        }
      } catch (err) {
        console.error('Error fetching quiz results:', err);
        setError('Failed to load quiz results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [quizId, teacherId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-white/60">Loading results...</p>
      </div>
    );
  }

  if (quizId && !quiz) {
    return (
      <Card className="bg-[#181f36] border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/60">Quiz not found or you don't have permission to view it.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#181f36] border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (results.length === 0 && !loading) {
    return (
      <Card className="bg-[#181f36] border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/60">No quiz attempts found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {quiz && (
        <Card className="bg-[#181f36] border-white/10">
          <CardHeader>
            <CardTitle>{quiz.title} - Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/60">Subject:</span>
                <p className="font-medium">{quiz.subject}</p>
              </div>
              <div>
                <span className="text-white/60">Total Attempts:</span>
                <p className="font-medium">{quiz.attempts}</p>
              </div>
              <div>
                <span className="text-white/60">Average Score:</span>
                <p className="font-medium">{quiz.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{quiz ? 'Student Attempts' : 'All Quiz Attempts'}</h3>
        
        {results.map((result) => {
          // Handle both QuizAttempt and Report types
          const id = 'id' in result ? result.id : result._id;
          const quizId = result.quizId;
          const studentName = result.studentName;
          const completedAt = result.completedAt;
          const timeTaken = result.timeTaken;
          const score = result.score;
          const passed = result.passed;
          
          // Get quiz info
          const resultQuiz = quiz || 
            ('quiz' in result && result.quiz) || 
            quizService.getQuizById(quizId);
            
          return (
            <Card key={id} className="bg-[#181f36] border-white/10">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    {!quiz && resultQuiz && (
                      <h4 className="font-semibold mb-2">{resultQuiz.title}</h4>
                    )}
                    <p className="text-white/80 font-medium">{studentName}</p>
                    <p className="text-white/60 text-sm">
                      Completed on {new Date(completedAt).toLocaleDateString()} at {new Date(completedAt).toLocaleTimeString()}
                    </p>
                    <p className="text-white/60 text-sm">
                      Time taken: {timeTaken} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                    <div className={`font-medium ${passed ? 'text-green-400' : 'text-red-400'}`}>
                      {passed ? 'Passed' : 'Failed'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResults;