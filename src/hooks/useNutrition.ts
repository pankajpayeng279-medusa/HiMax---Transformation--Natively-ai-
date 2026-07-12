import { useState, useEffect, useCallback } from 'react';
import {
  getTodayNutrition,
  saveTodayNutrition,
  EMPTY_NUTRITION,
  type NutritionData,
} from '../services/nutritionService';

interface UseNutritionResult {
  nutrition: NutritionData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveNutrition: (data: NutritionData) => Promise<boolean>;
}

export function useNutrition(): UseNutritionResult {
  const [nutrition, setNutrition] = useState<NutritionData>(EMPTY_NUTRITION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodayNutrition();
      setNutrition(data);
    } catch {
      setError("We couldn't load your nutrition data. Try again?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveNutrition = useCallback(async (data: NutritionData) => {
    setSaving(true);
    setError(null);
    try {
      await saveTodayNutrition(data);
      setNutrition(data);
      return true;
    } catch {
      setError("We couldn't save your nutrition data. Try again?");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { nutrition, loading, saving, error, saveNutrition };
}