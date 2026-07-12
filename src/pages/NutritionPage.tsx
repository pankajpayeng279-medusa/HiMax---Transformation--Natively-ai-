import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Flame,
  Beef,
  Wheat,
  Droplet,
  Droplets,
  Wallet,
  UtensilsCrossed,
  CheckCircle2,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { useNutrition } from '../hooks/useNutrition';
import type { NutritionData } from '../services/nutritionService';

type MetricKey = keyof NutritionData;

interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  unitPosition: 'prefix' | 'suffix';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const METRICS: MetricConfig[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal', unitPosition: 'suffix', icon: Flame, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-400' },
  { key: 'protein', label: 'Protein', unit: 'g', unitPosition: 'suffix', icon: Beef, iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
  { key: 'carbs', label: 'Carbs', unit: 'g', unitPosition: 'suffix', icon: Wheat, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
  { key: 'fat', label: 'Fat', unit: 'g', unitPosition: 'suffix', icon: Droplet, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
  { key: 'water_ml', label: 'Water', unit: 'ml', unitPosition: 'suffix', icon: Droplets, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  { key: 'budget_spent', label: 'Budget', unit: '₹', unitPosition: 'prefix', icon: Wallet, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
];

type DraftState = Record<MetricKey, string>;

function toDraftStrings(data: NutritionData): DraftState {
  return {
    calories: String(data.calories),
    protein: String(data.protein),
    carbs: String(data.carbs),
    fat: String(data.fat),
    water_ml: String(data.water_ml),
    budget_spent: String(data.budget_spent),
  };
}

function sanitizeInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
}

function parseValue(raw: string): number {
  const parsed = parseFloat(raw);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

export default function NutritionPage() {
  const { nutrition, loading, saving, error, saveNutrition } = useNutrition();
  const [draft, setDraft] = useState<DraftState>(() => toDraftStrings(nutrition));
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setDraft(toDraftStrings(nutrition));
  }, [nutrition]);

  const handleChange = (key: MetricKey, raw: string) => {
    setDraft((prev) => ({ ...prev, [key]: sanitizeInput(raw) }));
  };

  const handleSave = async () => {
    const payload: NutritionData = {
      calories: parseValue(draft.calories),
      protein: parseValue(draft.protein),
      carbs: parseValue(draft.carbs),
      fat: parseValue(draft.fat),
      water_ml: parseValue(draft.water_ml),
      budget_spent: parseValue(draft.budget_spent),
    };

    const success = await saveNutrition(payload);
    if (success) {
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
          <UtensilsCrossed className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Nutrition</h1>
          <p className="text-gray-400 text-sm">Log today's intake and stay on track</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {METRICS.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.iconBg}`}>
                    <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                    <p className="text-lg font-semibold text-white">
                      {metric.unitPosition === 'prefix' && (
                        <span className="text-xs font-normal text-gray-500 mr-0.5">{metric.unit}</span>
                      )}
                      {nutrition[metric.key]}
                      {metric.unitPosition === 'suffix' && (
                        <span className="text-xs font-normal text-gray-500 ml-1">{metric.unit}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    inputMode="decimal"
                    value={draft[metric.key]}
                    onChange={(e) => handleChange(metric.key, e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                    {metric.unit}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition flex items-center justify-center gap-2"
      >
        {saving ? <Spinner /> : "Save Today's Nutrition"}
      </button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm shadow-lg backdrop-blur z-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Nutrition saved successfully.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}