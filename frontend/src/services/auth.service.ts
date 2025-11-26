import { apiClient } from './api';
import { LoginCredentials, LoginResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};