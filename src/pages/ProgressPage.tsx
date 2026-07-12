import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Save, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { useProgress } from '../hooks/useProgress';
import type { ProgressData } from '../services/progressService';

type NumericField = Exclude<keyof ProgressData, 'notes'>;

interface FieldConfig {
  key: NumericField;
  label: string;
  unit: string;
}

const NUMERIC_FIELDS: FieldConfig[] = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'body_fat', label: 'Body Fat', unit: '%' },
  { key: 'muscle_mass', label: 'Muscle Mass', unit: 'kg' },
  { key: 'chest_cm', label: 'Chest', unit: 'cm' },
  { key: 'waist_cm', label: 'Waist', unit: 'cm' },
  { key: 'hips_cm', label: 'Hips', unit: 'cm' },
  { key: 'arms_cm', label: 'Arms', unit: 'cm' },
  { key: 'thighs_cm', label: 'Thighs', unit: 'cm' },
];

type ProgressFormState = Record<NumericField, string> & { notes: string };

function toFormState(data: ProgressData): ProgressFormState {
  const numeric = NUMERIC_FIELDS.reduce((acc, { key }) => {
    acc[key] = String(data[key]);
    return acc;
  }, {} as Record<NumericField, string>);
  return { ...numeric, notes: data.notes };
}

function sanitizeNumericInput(raw: string): number {
  if (raw.trim() === '') return 0;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return 0;
  return parsed < 0 ? 0 : parsed;
}

function toProgressData(form: ProgressFormState): ProgressData {
  const numeric = NUMERIC_FIELDS.reduce((acc, { key }) => {
    acc[key] = sanitizeNumericInput(form[key]);
    return acc;
  }, {} as Record<NumericField, number>);
  return { ...numeric, notes: form.notes };
}

// Allows digits and at most one decimal point; rejects "-" outright.
const NUMERIC_INPUT_PATTERN = /^\d*\.?\d*$/;

export default function ProgressPage() {
  const { progress, loading, saving, error, saveProgress } = useProgress();
  const [form, setForm] = useState<ProgressFormState>(() => toFormState(progress));
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setForm(toFormState(progress));
  }, [progress]);

  useEffect(() => {
    if (!savedMessage) return;
    const timeout = setTimeout(() => setSavedMessage(false), 3000);
    return () => clearTimeout(timeout);
  }, [savedMessage]);

  const handleNumericChange = useCallback((key: NumericField, raw: string) => {
    if (raw !== '' && !NUMERIC_INPUT_PATTERN.test(raw)) return;
    setForm((prev) => ({ ...prev, [key]: raw }));
  }, []);

  const handleNotesChange = useCallback((raw: string) => {
    setForm((prev) => ({ ...prev, notes: raw }));
  }, []);

  const handleSave = useCallback(async () => {
    setSavedMessage(false);
    const ok = await saveProgress(toProgressData(form));
    if (ok) setSavedMessage(true);
  }, [form, saveProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Transformation Tracking</h1>
          <p className="text-text-muted text-sm">
            Log your measurements to track how your body is changing over time.
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-red-400/30 bg-red-500/10 text-red-400 text-sm px-4 py-3"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NUMERIC_FIELDS.map(({ key, label, unit }) => (
              <Input
                key={key}
                label={`${label} (${unit})`}
                type="number"
                min={0}
                inputMode="decimal"
                placeholder="0"
                value={form[key]}
                onChange={(e) => handleNumericChange(key, e.target.value)}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <label htmlFor="progress-notes" className="block text-sm font-medium text-text mb-1.5">
            Notes
          </label>
          <textarea
            id="progress-notes"
            value={form.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="How are you feeling? Any observations about your progress..."
            rows={4}
            className="w-full bg-surface border border-border rounded-xl py-2.5 px-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-150 resize-none"
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-center gap-4"
      >
        <Button onClick={handleSave} loading={saving} disabled={saving}>
          <Save className="w-4 h-4" />
          Save Progress
        </Button>

        {savedMessage && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-sm text-green-400"
          >
            <CheckCircle2 className="w-4 h-4" />
            Progress saved successfully.
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}