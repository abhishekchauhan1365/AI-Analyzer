import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisService } from '../services/analysisService';

export const ANALYSES_KEY = ['analyses'];

export const useAnalyses = (page = 1) => {
  return useQuery({
    queryKey: [...ANALYSES_KEY, page],
    queryFn: () => analysisService.getAll(page),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAnalysis = (id: string) => {
  return useQuery({
    queryKey: [...ANALYSES_KEY, id],
    queryFn: () => analysisService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAnalysisStatus = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: [...ANALYSES_KEY, id, 'status'],
    queryFn: () => analysisService.getStatus(id),
    enabled: !!id && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') return false;
      return 3000; // Poll every 3s while processing
    },
  });
};

export const useSubmitAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      onProgress,
    }: {
      payload: { file?: File; text?: string; analysisType: string };
      onProgress?: (pct: number) => void;
    }) => analysisService.submitAnalysis(payload, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYSES_KEY });
    },
  });
};

export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => analysisService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYSES_KEY });
    },
  });
};
