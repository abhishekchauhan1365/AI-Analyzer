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

  streamChat: async function* (id: string, messages: { role: 'user'|'assistant', content: string }[], token: string): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/analyses/${id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Chat API failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No readable stream in response body.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              yield parsed.text;
            }
          } catch (e) {
            // Ignore parse errors on incomplete JSON chunks, wait for next buffer (this shouldn't happen with Server-Sent Events, but just in case)
          }
        }
      }
    }
  },
};
