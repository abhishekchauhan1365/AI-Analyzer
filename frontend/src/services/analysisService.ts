import api from './api';
import type { ApiResponse, Analysis } from '../types';

export const analysisService = {
  upload: async (file: File, onProgress?: (pct: number) => void): Promise<Analysis> => {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await api.post<ApiResponse<Analysis>>('/analyses/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    });
    return res.data.data!;
  },

  getAll: async (page = 1, limit = 10): Promise<ApiResponse<Analysis[]>> => {
    const res = await api.get<ApiResponse<Analysis[]>>(`/analyses?page=${page}&limit=${limit}`);
    return res.data;
  },

  getById: async (id: string): Promise<Analysis> => {
    const res = await api.get<ApiResponse<Analysis>>(`/analyses/${id}`);
    return res.data.data!;
  },

  getStatus: async (id: string): Promise<Analysis> => {
    const res = await api.get<ApiResponse<Analysis>>(`/analyses/${id}/status`);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/analyses/${id}`);
  },

  chat: async (id: string, message: string): Promise<{reply: string}> => {
    const res = await api.post<ApiResponse<{reply: string}>>(`/analyses/${id}/chat`, { message });
    return res.data.data!;
  },
};
