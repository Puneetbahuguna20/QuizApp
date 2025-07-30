import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Quiz } from '../services/quizService';
import { useNavigate } from 'react-router-dom';

interface QuizListProps {
  quizzes: Quiz[];
  onCreateQuiz: () => void;
  onUpdateStatus: (quizId: string, status: 'active' | 'draft' | 'archived') => void;
  onDeleteQuiz: (quizId: string) => void;
  onViewResults?: (quizId: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, onCreateQuiz, onUpdateStatus, onDeleteQuiz, onViewResults }) => {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 text-white';
      case 'draft':
        return 'bg-yellow-600 text-white';
      case 'archived':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Quizzes</h3>
        <Button onClick={onCreateQuiz} className="bg-blue-700 hover:bg-blue-800">
          ➕ Create New Quiz
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Card className="bg-[#181f36] border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-white/60 mb-4">No quizzes created yet.</p>
            <Button onClick={onCreateQuiz} className="bg-blue-700 hover:bg-blue-800">
              Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-[#181f36] border-white/10 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                    <CardDescription className="text-white/60 mb-2">
                      {quiz.description}
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                    {getStatusText(quiz.status)}
                  </span>
                </div>
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
                  
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Attempts:</span>
                      <span className="font-medium">{quiz.attempts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Avg Score:</span>
                      <span className="font-medium">{quiz.averageScore}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 mb-2">
                    <Button
                      size="sm"
                      onClick={() => onViewResults ? onViewResults(quiz.id) : navigate(`/teacher/results/${quiz.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      View Results
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {quiz.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => onUpdateStatus(quiz.id, 'active')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Activate
                      </Button>
                    )}
                    {quiz.status === 'active' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => onUpdateStatus(quiz.id, 'draft')}
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                          Deactivate
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => onUpdateStatus(quiz.id, 'archived')}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        >
                          Archive
                        </Button>
                      </>
                    )}
                    {quiz.status === 'archived' && (
                      <Button 
                        size="sm" 
                        onClick={() => onUpdateStatus(quiz.id, 'active')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Unarchive
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeleteQuiz(quiz.id)}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;