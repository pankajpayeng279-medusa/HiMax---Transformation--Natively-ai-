import { useState, useEffect, useCallback } from 'react';
import {
  getLatestProgress,
  saveProgress,
  EMPTY_PROGRESS,
  type ProgressData,
} from '../services/progressService';

interface UseProgressResult {
  progress: ProgressData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveProgress: (data: ProgressData) => Promise<boolean>;
}

export function useProgress(): UseProgressResult {
  const [progress, setProgress] = useState<ProgressData>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestProgress();
      setProgress(data);
    } catch {
      setError("We couldn't load your progress data. Try again?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistProgress = useCallback(async (data: ProgressData) => {
    setSaving(true);
    setError(null);
    try {
      await saveProgress(data);
      setProgress(data);
      return true;
    } catch {
      setError("We couldn't save your progress. Try again?");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { progress, loading, saving, error, saveProgress: persistProgress };
}