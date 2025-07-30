// Quiz service for localStorage operations (ready for backend integration)

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  questions: Question[];
  duration: number;
  passingScore: number;
  status: 'active' | 'draft' | 'archived';
  attempts: number;
  averageScore: number;
  createdAt: string;
  createdBy: string; // teacher email
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: number[];
  score: number;
  passed: boolean;
  timeTaken: number; // in minutes
  completedAt: string;
}

class QuizService {
  private readonly QUIZZES_KEY = 'quizzes';
  private readonly ATTEMPTS_KEY = 'quiz_attempts';

  // Quiz Management
  getAllQuizzes(): Quiz[] {
    try {
      const quizzes = localStorage.getItem(this.QUIZZES_KEY);
      return quizzes ? JSON.parse(quizzes) : [];
    } catch (error) {
      console.error('Error loading quizzes:', error);
      return [];
    }
  }

  getActiveQuizzes(): Quiz[] {
    return this.getAllQuizzes().filter(quiz => quiz.status === 'active');
  }

  getQuizzesByTeacher(teacherEmail: string): Quiz[] {
    return this.getAllQuizzes().filter(quiz => quiz.createdBy === teacherEmail);
  }

  createQuiz(quizData: Omit<Quiz, 'id' | 'attempts' | 'averageScore' | 'createdAt'>): Quiz {
    const quizzes = this.getAllQuizzes();
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      attempts: 0,
      averageScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    quizzes.unshift(newQuiz);
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(quizzes));
    return newQuiz;
  }

  updateQuiz(quizId: string, updates: Partial<Quiz>): Quiz | null {
    const quizzes = this.getAllQuizzes();
    const index = quizzes.findIndex(quiz => quiz.id === quizId);
    
    if (index === -1) return null;
    
    quizzes[index] = { ...quizzes[index], ...updates };
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(quizzes));
    return quizzes[index];
  }

  deleteQuiz(quizId: string): boolean {
    const quizzes = this.getAllQuizzes();
    const filteredQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    
    if (filteredQuizzes.length === quizzes.length) return false;
    
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(filteredQuizzes));
    return true;
  }

  getQuizById(quizId: string): Quiz | null {
    const quizzes = this.getAllQuizzes();
    return quizzes.find(quiz => quiz.id === quizId) || null;
  }

  // Quiz Attempts Management
  getAllAttempts(): QuizAttempt[] {
    try {
      const attempts = localStorage.getItem(this.ATTEMPTS_KEY);
      return attempts ? JSON.parse(attempts) : [];
    } catch (error) {
      console.error('Error loading attempts:', error);
      return [];
    }
  }

  getAttemptsByStudent(studentId: string): QuizAttempt[] {
    return this.getAllAttempts().filter(attempt => attempt.studentId === studentId);
  }

  getAttemptsByQuiz(quizId: string): QuizAttempt[] {
    return this.getAllAttempts().filter(attempt => attempt.quizId === quizId);
  }

  submitQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): QuizAttempt {
    const attempts = this.getAllAttempts();
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: Date.now().toString(),
      completedAt: new Date().toISOString(),
    };
    
    attempts.push(newAttempt);
    localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
    
    // Update quiz statistics
    this.updateQuizStatistics(attempt.quizId);
    
    return newAttempt;
  }

  private updateQuizStatistics(quizId: string): void {
    const attempts = this.getAttemptsByQuiz(quizId);
    const quiz = this.getQuizById(quizId);
    
    if (!quiz) return;
    
    const totalAttempts = attempts.length;
    const averageScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
      : 0;
    
    this.updateQuiz(quizId, {
      attempts: totalAttempts,
      averageScore,
    });
  }

  // Student-specific methods
  getStudentQuizHistory(studentId: string): (QuizAttempt & { quiz: Quiz })[] {
    const attempts = this.getAttemptsByStudent(studentId);
    return attempts.map(attempt => {
      const quiz = this.getQuizById(attempt.quizId);
      return {
        ...attempt,
        quiz: quiz!,
      };
    }).filter(item => item.quiz !== null);
  }

  canStudentTakeQuiz(studentId: string, quizId: string): boolean {
    const attempts = this.getAttemptsByStudent(studentId);
    const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
    // For now, allow unlimited attempts - can be modified later
    return true;
  }

  // Utility methods
  calculateScore(answers: number[], correctAnswers: number[]): number {
    if (answers.length !== correctAnswers.length) return 0;
    
    const correctCount = answers.reduce((count, answer, index) => {
      return count + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);
    
    return Math.round((correctCount / answers.length) * 100);
  }

  isPassingScore(score: number, passingScore: number): boolean {
    return score >= passingScore;
  }

  // Initialize sample data for testing
  initializeSampleData(): void {
    const existingQuizzes = this.getAllQuizzes();
    if (existingQuizzes.length > 0) return; // Don't initialize if data already exists

    const sampleQuizzes: Omit<Quiz, 'id' | 'attempts' | 'averageScore' | 'createdAt'>[] = [
      {
        title: 'Mathematics - Algebra Basics',
        subject: 'Mathematics',
        description: 'Test your understanding of basic algebraic concepts including equations, inequalities, and functions.',
        questions: [
          {
            id: '1',
            question: 'What is the solution to the equation 2x + 5 = 13?',
            options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
            correctAnswer: 1
          },
          {
            id: '2',
            question: 'Which of the following is a linear equation?',
            options: ['y = x² + 2', 'y = 3x + 1', 'y = 1/x', 'y = √x'],
            correctAnswer: 1
          },
          {
            id: '3',
            question: 'Solve for x: 3x - 7 = 8',
            options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
            correctAnswer: 1
          }
        ],
        duration: 15,
        passingScore: 70,
        status: 'active',
        createdBy: 'teacher@123gmail.com'
      },
      {
        title: 'Science - Physics Fundamentals',
        subject: 'Science',
        description: 'Test your knowledge of basic physics concepts including motion, forces, and energy.',
        questions: [
          {
            id: '4',
            question: 'What is the SI unit of force?',
            options: ['Joule', 'Newton', 'Watt', 'Pascal'],
            correctAnswer: 1
          },
          {
            id: '5',
            question: 'Which of Newton\'s laws states that every action has an equal and opposite reaction?',
            options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'],
            correctAnswer: 2
          },
          {
            id: '6',
            question: 'What is the formula for kinetic energy?',
            options: ['KE = mgh', 'KE = ½mv²', 'KE = mv', 'KE = ma'],
            correctAnswer: 1
          }
        ],
        duration: 20,
        passingScore: 75,
        status: 'active',
        createdBy: 'teacher@123gmail.com'
      },
      {
        title: 'History - World War II',
        subject: 'History',
        description: 'Test your knowledge of major events and figures from World War II.',
        questions: [
          {
            id: '7',
            question: 'In which year did World War II end?',
            options: ['1943', '1944', '1945', '1946'],
            correctAnswer: 2
          },
          {
            id: '8',
            question: 'Which country was not part of the Axis Powers?',
            options: ['Germany', 'Italy', 'Japan', 'France'],
            correctAnswer: 3
          },
          {
            id: '9',
            question: 'Who was the leader of Nazi Germany during WWII?',
            options: ['Mussolini', 'Hitler', 'Stalin', 'Churchill'],
            correctAnswer: 1
          }
        ],
        duration: 15,
        passingScore: 70,
        status: 'active',
        createdBy: 'teacher@123gmail.com'
      }
    ];

    sampleQuizzes.forEach(quizData => {
      this.createQuiz(quizData);
    });

    console.log('Sample quiz data initialized');
  }
}

export const quizService = new QuizService(); 