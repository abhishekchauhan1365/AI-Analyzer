import api from './api';
import type { ApiResponse, User, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const res = await api.post<any>('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const res = await api.post<any>('/auth/register', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/profile');
    return res.data.data!;
  },

  updateProfile: async (data: Partial<Pick<User, 'name' | 'email'>> & { password?: string }): Promise<User> => {
    const res = await api.put<ApiResponse<User>>('/auth/profile', data);
    return res.data.data!;
  },
};
