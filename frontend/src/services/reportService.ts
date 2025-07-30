import { api } from './api';
import { quizService } from './quizService';
import type { Quiz, QuizAttempt } from './quizService';

export interface Report {
  _id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: number[];
  score: number;
  passed: boolean;
  timeTaken: number;
  completedAt: string;
  quiz?: Quiz;
  student?: {
    name: string;
    email: string;
  };
}

class ReportService {
  // Get all reports (for teachers)
  async getAllReports(): Promise<Report[]> {
    try {
      // Import reportApiService dynamically to avoid circular dependencies
      const { reportApiService } = await import('./reportApiService');
      return await reportApiService.getAllReports();
    } catch (error) {
      console.error('Error fetching all reports:', error);
      // Fallback to local storage if API fails
      return this.getAllReportsFromLocalStorage();
    }
  }

  // Get reports for a specific quiz (for teachers)
  async getReportsByQuiz(quizId: string): Promise<Report[]> {
    try {
      // Import reportApiService dynamically to avoid circular dependencies
      const { reportApiService } = await import('./reportApiService');
      return await reportApiService.getReportsByQuiz(quizId);
    } catch (error) {
      console.error(`Error fetching reports for quiz ${quizId}:`, error);
      // Fallback to local storage if API fails
      return this.getReportsByQuizFromLocalStorage(quizId);
    }
  }
  
  // Get reports for the current student
  async getMyReports(): Promise<Report[]> {
    try {
      // Import reportApiService dynamically to avoid circular dependencies
      const { reportApiService } = await import('./reportApiService');
      return await reportApiService.getMyReports();
    } catch (error) {
      console.error('Error fetching my reports:', error);
      // Fallback to local storage
      return this.getAllReportsFromLocalStorage();
    }
  }

  // Fallback methods using local storage
  private getAllReportsFromLocalStorage(): Report[] {
    const attempts = quizService.getAllAttempts();
    return attempts.map(attempt => this.convertAttemptToReport(attempt));
  }

  private getReportsByQuizFromLocalStorage(quizId: string): Report[] {
    const attempts = quizService.getAttemptsByQuiz(quizId);
    return attempts.map(attempt => this.convertAttemptToReport(attempt));
  }

  // Helper method to convert QuizAttempt to Report format
  private convertAttemptToReport(attempt: QuizAttempt): Report {
    const quiz = quizService.getQuizById(attempt.quizId);
    
    return {
      _id: attempt.id,
      quizId: attempt.quizId,
      studentId: attempt.studentId,
      studentName: attempt.studentName,
      answers: attempt.answers,
      score: attempt.score,
      passed: attempt.passed,
      timeTaken: attempt.timeTaken,
      completedAt: attempt.completedAt,
      quiz: quiz || undefined,
      student: {
        name: attempt.studentName,
        email: attempt.studentId // Using studentId as email since that's how it's stored in local storage
      }
    };
  }
}

export const reportService = new ReportService();