import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { quizService } from '@/services/quizService';
import { useAuth } from '@/contexts/AuthContext';
import type { Quiz, Question } from '@/services/quizService';

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      const quizData = quizService.getQuizById(quizId);
      if (quizData) {
        setQuiz(quizData);
        setTimeLeft(quizData.duration * 60); // Convert to seconds
        setAnswers(new Array(quizData.questions.length).fill(-1));
      } else {
        alert('Quiz not found!');
        navigate('/dashboard');
      }
      setLoading(false);
    }
  }, [quizId, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isStarted && timeLeft > 0 && !isCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isStarted, timeLeft, isCompleted]);

  const startQuiz = () => {
    setIsStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user?.email) return;

    // Calculate score
    const correctAnswers = quiz.questions.map(q => q.correctAnswer);
    const calculatedScore = quizService.calculateScore(answers, correctAnswers);
    const isPassed = quizService.isPassingScore(calculatedScore, quiz.passingScore);

    setScore(calculatedScore);
    setPassed(isPassed);
    setIsCompleted(true);

    // Prepare attempt data for local storage fallback
    const attempt = {
      quizId: quiz.id,
      studentId: user.email,
      studentName: user.name || user.email,
      answers,
      score: calculatedScore,
      passed: isPassed,
      timeTaken: quiz.duration - Math.floor(timeLeft / 60),
    };

    try {
      // First try to submit to backend API
      const submission = {
        quizId: quiz.id,
        answers,
        timeTaken: quiz.duration - Math.floor(timeLeft / 60),
      };
      
      // Import quizApiService dynamically to avoid circular dependencies
      const { quizApiService } = await import('@/services/quizApiService');
      await quizApiService.submitQuizAttempt(submission);
      console.log('Quiz submitted to backend successfully');
    } catch (error) {
      console.error('Failed to submit quiz to backend, falling back to local storage', error);
      // Fallback to local storage if API fails
      quizService.submitQuizAttempt(attempt);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="text-white text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="text-white text-lg">Quiz not found!</div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-[#0c0c0c] text-white border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-white/60 mb-4">{quiz.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#181f36] p-4 rounded-lg">
                <div className="text-white/60">Subject</div>
                <div className="font-semibold">{quiz.subject}</div>
              </div>
              <div className="bg-[#181f36] p-4 rounded-lg">
                <div className="text-white/60">Questions</div>
                <div className="font-semibold">{quiz.questions.length}</div>
              </div>
              <div className="bg-[#181f36] p-4 rounded-lg">
                <div className="text-white/60">Duration</div>
                <div className="font-semibold">{quiz.duration} minutes</div>
              </div>
              <div className="bg-[#181f36] p-4 rounded-lg">
                <div className="text-white/60">Passing Score</div>
                <div className="font-semibold">{quiz.passingScore}%</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={startQuiz}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg"
              >
                Start Quiz
              </Button>
              <div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-[#0c0c0c] text-white border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {score}%
              </div>
              <div className={`text-lg font-semibold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {passed ? 'Passed!' : 'Failed'}
              </div>
              <p className="text-white/60 mt-2">
                Passing score: {quiz.passingScore}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#181f36] p-4 rounded-lg">
                <div className="text-white/60">Correct Answers</div>
                <div className="font-semibold">
                  {answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length} / {quiz.questions.length}
                </div>
              </div>
              <div className="bg-[#181f36] p-4 rounded-lg">
                <div className="text-white/60">Time Taken</div>
                <div className="font-semibold">{quiz.duration - Math.floor(timeLeft / 60)} minutes</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0b1120] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-white/60">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{formatTime(timeLeft)}</div>
            <div className="text-white/60 text-sm">Time Remaining</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <Card className="bg-[#0c0c0c] text-white border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[currentQuestionIndex] === index
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-6">
          <div className="text-white/60 mb-3">Question Navigation:</div>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : answers[index] !== -1
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;