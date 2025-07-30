import { api } from './api';
import type { Quiz, QuizAttempt } from './quizService';

// Interface for quiz submission
export interface QuizSubmission {
  quizId: string;
  answers: number[];
  timeTaken: number;
}

// Quiz API Service for backend operations
class QuizApiService {
  // Get all quizzes
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const response = await api.get('/api/exams/quizzes');
      return response.data.quizzes;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  // Get quiz by ID
  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      const response = await api.get(`/api/exams/quiz/${quizId}`);
      return response.data.quiz;
    } catch (error) {
      console.error(`Error fetching quiz ${quizId}:`, error);
      throw error;
    }
  }

  // Create a new quiz
  async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await api.post('/api/exams/create', quizData);
      return response.data.quiz;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  // Update an existing quiz
  async updateQuiz(quizId: string, updateData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await api.put(`/api/exams/update/${quizId}`, updateData);
      return response.data.quiz;
    } catch (error) {
      console.error(`Error updating quiz ${quizId}:`, error);
      throw error;
    }
  }

  // Delete a quiz
  async deleteQuiz(quizId: string): Promise<boolean> {
    try {
      await api.delete(`/api/exams/delete/${quizId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting quiz ${quizId}:`, error);
      throw error;
    }
  }

  // Submit quiz attempt
  async submitQuizAttempt(submission: QuizSubmission): Promise<any> {
    try {
      const response = await api.post('/api/exams/submit', submission);
      return response.data.report;
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      throw error;
    }
  }

  // Get student's quiz attempts
  async getMyAttempts(): Promise<any[]> {
    try {
      const response = await api.get('/api/exams/my-attempts');
      return response.data.attempts;
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      throw error;
    }
  }
}

export const quizApiService = new QuizApiService();