import axios, { type AxiosResponse } from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Mock API for demonstration (when backend is not available)
const MOCK_MODE = false; // Set to false to use real API

// Auth API functions
export const authApi = {
  // Register user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      console.log('🔄 Using mock API for registration');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-' + Date.now(),
          name: data.name,
          email: data.email,
        }
      };
      
      console.log('✅ Mock registration successful:', mockResponse);
      return mockResponse;
    }
    
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      console.log('🔄 Using mock API for login');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-' + Date.now(),
          name: 'Demo User',
          email: data.email,
        }
      };
      
      console.log('✅ Mock login successful:', mockResponse);
      return mockResponse;
    }
    
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    if (MOCK_MODE) {
      console.log('🔄 Using mock API for logout');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Mock logout successful');
      return;
    }
    
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    if (MOCK_MODE) {
      console.log('🔄 Using mock API for getCurrentUser');
      // Return null for mock mode to simulate no existing session
      return null as any;
    }
    
    const response = await api.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },
};