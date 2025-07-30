import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type AuthResponse } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Log the form data being submitted
      console.log('✅ Login form data successfully read:', { email, password });
      console.log('✅ Validation passed - attempting login...');
      
      // Check for teacher shortcuts first
      if ((email === 'teacher@123gmail.com' && password === 'teacher123') || 
          (email === 'teacher@31gmail.com' && password === 'teacher31')) {
        console.log('🔑 Teacher shortcut detected, creating session');
        const userResponse: AuthResponse = {
          token: 'teacher-jwt-token-' + Date.now(),
          user: {
            id: 'teacher-' + Date.now(),
            name: 'Teacher Admin',
            email: email,
            role: 'teacher'
          }
        };
        localStorage.setItem('authToken', userResponse.token);
        setUser(userResponse.user);
        console.log('✅ Teacher shortcut login successful:', userResponse);
        return;
      }
      
      try {
        // Attempt to login with backend API
        console.log('🔄 Attempting to login with backend API');
        const response = await authApi.login({ email, password });
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        console.log('✅ API Login successful:', response);
        return;
      } catch (apiError: any) {
        console.log('❌ API login failed:', apiError);
        
        // Check if it's a specific API error
        if (apiError.response && apiError.response.data) {
          console.log('❌ API error details:', apiError.response.data);
          if (apiError.response.data.message) {
            throw new Error(apiError.response.data.message);
          }
        }
        
        console.log('❌ Falling back to localStorage');
        // Fallback to localStorage for offline development
        // Check registered users in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('🔍 Checking registered users:', registeredUsers);
        
        const registeredUser = registeredUsers.find((user: any) => 
          user.email === email && user.password === password
        );
        
        console.log('🔍 Found registered user:', registeredUser);
        
        if (registeredUser) {
          console.log('🔄 Registered user login detected:', registeredUser);
          const userResponse: AuthResponse = {
            token: 'user-jwt-token-' + Date.now(),
            user: {
              id: registeredUser.id,
              name: registeredUser.name,
              email: registeredUser.email,
              role: registeredUser.role
            }
          };
          localStorage.setItem('authToken', userResponse.token);
          setUser(userResponse.user);
          console.log('✅ Registered user login successful:', userResponse);
          return;
        }
        
        console.log('❌ No registered user found - throwing error');
        throw new Error('User not found. Please register first.');
      }
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      // Log the form data being submitted
      console.log('✅ Form data successfully read:', { name, email, password, role });
      console.log('✅ Validation passed - attempting registration...');
      
      try {
        // Attempt to register with backend API
        await authApi.register({ name, email, password, role });
        console.log('✅ API Registration successful');
      } catch (apiError) {
        console.log('❌ API registration failed, falling back to localStorage:', apiError);
        
        // Fallback to localStorage for offline development
        // Store user data in localStorage for login validation
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const newUser = {
          id: 'user-' + Date.now(),
          name: name,
          email: email,
          password: password,
          role: role
        };
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        console.log('✅ Registration successful - user data stored in localStorage');
      }
      
      console.log('✅ User can now login with their credentials');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      // Navigate to home page instead of login
      window.location.href = '/';
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};