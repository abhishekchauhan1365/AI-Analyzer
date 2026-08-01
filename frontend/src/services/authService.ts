import api from './api';
import type { ApiResponse, User, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const res = await api.post<ApiResponse<User>>('/auth/login', credentials);
    return res.data.data!;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const res = await api.post<ApiResponse<User>>('/auth/register', credentials);
    return res.data.data!;
  },

  logout: async (): Promise<void> => {
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
