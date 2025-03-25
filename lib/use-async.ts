import { useState, useCallback, useEffect } from 'react';
import { ApiError } from '@/src/api';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: options.immediate || false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await asyncFunction();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState({ data: null, isLoading: false, error: apiError });
      throw error;
    }
  }, [asyncFunction]);

  // Execute immediately if option is set
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  });

  return {
    ...state,
    execute,
    // Reset state
    reset: useCallback(() => {
      setState({ data: null, isLoading: false, error: null });
    }, []),
  };
}
