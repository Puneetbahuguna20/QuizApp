import { api } from './api';
import type { Report } from './reportService';

// Report API Service for backend operations
class ReportApiService {
  // Get all reports (for teachers)
  async getAllReports(): Promise<Report[]> {
    try {
      const response = await api.get('/api/reports/all');
      return response.data.reports;
    } catch (error) {
      console.error('Error fetching all reports:', error);
      throw error;
    }
  }

  // Get reports for a specific quiz (for teachers)
  async getReportsByQuiz(quizId: string): Promise<Report[]> {
    try {
      const response = await api.get(`/api/reports/quiz/${quizId}`);
      return response.data.reports;
    } catch (error) {
      console.error(`Error fetching reports for quiz ${quizId}:`, error);
      throw error;
    }
  }

  // Get reports for the current student
  async getMyReports(): Promise<Report[]> {
    try {
      const response = await api.get('/api/exams/my-attempts');
      return response.data.attempts;
    } catch (error) {
      console.error('Error fetching my reports:', error);
      throw error;
    }
  }
}

export const reportApiService = new ReportApiService();