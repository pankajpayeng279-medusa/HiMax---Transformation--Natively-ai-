import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  Cake,
  Ruler,
  Scale,
  Globe,
  Dumbbell,
  Flame,
  TrendingUp,
  Activity,
  Zap,
  Wind,
  Home,
  Building2,
  Layers,
  Apple,
  Info,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { supabase } from '../../services/supabase/client';
import profileService from '../../services/profileService';
import type {
  ProfileInsert,
  Gender,
  FitnessGoal,
  ExperienceLevel,
  WorkoutLocation,
  DietType,
} from '../../types/supabase';

interface OnboardingData {
  personal: {
    fullName: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    country: string;
  };
  fitness: {
    goal: string;
    experience: string;
    location: string;
  };
  nutrition: {
    diet: string;
    dislikedFoods: string[];
    allergies: string;
    monthlyBudget: number;
  };
  health: {
    bloodReportFile: File | null;
    equipment: string[];
  };
}

const TOTAL_STEPS = 6;
const MIN_BUDGET = 1000;
const MAX_BUDGET = 30000;

const initialData: OnboardingData = {
  personal: { fullName: '', age: '', gender: '', height: '', weight: '', country: '' },
  fitness: { goal: '', experience: '', location: '' },
  nutrition: { diet: '', dislikedFoods: [], allergies: '', monthlyBudget: 8000 },
  health: { bloodReportFile: null, equipment: [] },
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const GOAL_OPTIONS: { label: string; icon: LucideIcon; description: string }[] = [
  { label: 'Muscle Gain', icon: Dumbbell, description: 'Build lean muscle mass' },
  { label: 'Fat Loss', icon: Flame, description: 'Burn fat, get leaner' },
  { label: 'Weight Gain', icon: TrendingUp, description: 'Increase overall weight' },
  { label: 'Maintenance', icon: Activity, description: 'Stay at your current shape' },
  { label: 'Strength', icon: Zap, description: 'Get stronger, lift heavier' },
  { label: 'Endurance', icon: Wind, description: 'Improve stamina & cardio' },
];

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

const LOCATION_OPTIONS: { label: string; icon: LucideIcon }[] = [
  { label: 'Home', icon: Home },
  { label: 'Gym', icon: Building2 },
  { label: 'Both', icon: Layers },
];

const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];

const DISLIKED_FOOD_OPTIONS = [
  'Eggs',
  'Fish',
  'Milk',
  'Paneer',
  'Broccoli',
  'Nuts',
  'Soy',
  'Mushroom',
  'Onion',
  'Garlic',
];

const EQUIPMENT_OPTIONS = [
  'Dumbbells',
  'Barbell',
  'Bench',
  'Resistance Bands',
  'Pull-up Bar',
  'Cable Machine',
  'None',
];

function optionCardClasses(selected: boolean) {
  return cn(
    'flex flex-col items-start gap-2.5 rounded-2xl border p-4 text-left transition-all duration-200',
    selected
      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
      : 'border-border bg-surface hover:border-primary/30',
  );
}

function pillClasses(selected: boolean) {
  return cn(
    'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200',
    selected
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-border bg-surface text-text-muted hover:border-primary/30 hover:text-text',
  );
}

function chipClasses(selected: boolean) {
  return cn(
    'rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200',
    selected
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-border bg-surface text-text-muted hover:border-primary/30 hover:text-text',
  );
}

const stepVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -48 : 48, opacity: 0 }),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const goNext = () => {
    if (step >= TOTAL_STEPS) return;
    setDirection(1);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const goBack = () => {
    if (step <= 1) return;
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const goToStep = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  const updatePersonal = <K extends keyof OnboardingData['personal']>(
    key: K,
    value: OnboardingData['personal'][K],
  ) => {
    setFormData((prev) => ({ ...prev, personal: { ...prev.personal, [key]: value } }));
  };

  const updateFitness = <K extends keyof OnboardingData['fitness']>(
    key: K,
    value: OnboardingData['fitness'][K],
  ) => {
    setFormData((prev) => ({ ...prev, fitness: { ...prev.fitness, [key]: value } }));
  };

  const updateNutrition = <K extends keyof OnboardingData['nutrition']>(
    key: K,
    value: OnboardingData['nutrition'][K],
  ) => {
    setFormData((prev) => ({ ...prev, nutrition: { ...prev.nutrition, [key]: value } }));
  };

  const toggleDislikedFood = (food: string) => {
    setFormData((prev) => {
      const exists = prev.nutrition.dislikedFoods.includes(food);
      return {
        ...prev,
        nutrition: {
          ...prev.nutrition,
          dislikedFoods: exists
            ? prev.nutrition.dislikedFoods.filter((f) => f !== food)
            : [...prev.nutrition.dislikedFoods, food],
        },
      };
    });
  };

  const toggleEquipment = (item: string) => {
    setFormData((prev) => {
      const current = prev.health.equipment;
      if (item === 'None') {
        return {
          ...prev,
          health: { ...prev.health, equipment: current.includes('None') ? [] : ['None'] },
        };
      }
      const withoutNone = current.filter((e) => e !== 'None');
      const exists = withoutNone.includes(item);
      return {
        ...prev,
        health: {
          ...prev.health,
          equipment: exists ? withoutNone.filter((e) => e !== item) : [...withoutNone, item],
        },
      };
    });
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, health: { ...prev.health, bloodReportFile: file } }));
  };

  const handleFinish = async () => {
    setSaveError(null);
    setIsSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('You need to be signed in to finish setup.');
      }

      const payload: ProfileInsert = {
        id: user.id,
        email: user.email ?? '',
        name: formData.personal.fullName || null,
        age: formData.personal.age ? Number(formData.personal.age) : null,
        gender: (formData.personal.gender as Gender) || null,
        height_cm: formData.personal.height ? Number(formData.personal.height) : null,
        weight_kg: formData.personal.weight ? Number(formData.personal.weight) : null,
        goal: (formData.fitness.goal as FitnessGoal) || null,
        experience_level: (formData.fitness.experience as ExperienceLevel) || null,
        workout_location: (formData.fitness.location as WorkoutLocation) || null,
        diet_type: (formData.nutrition.diet as DietType) || null,
        allergies: formData.nutrition.allergies || null,
        // Onboarding collects a monthly figure; profiles stores a daily one.
        daily_budget: formData.nutrition.monthlyBudget
          ? Math.round((formData.nutrition.monthlyBudget / 30) * 100) / 100
          : null,
        // Blood report upload to Supabase Storage isn't wired up yet — once it
        // is, upload formData.health.bloodReportFile and store the URL here.
        blood_report_url: null,
        completed_onboarding: true,
      };

      await profileService.save(payload);
      navigate('/dashboard');
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Something went wrong while saving your profile.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = (() => {
    switch (step) {
      case 2:
        return formData.personal.fullName.trim().length > 0;
      case 3:
        return Boolean(
          formData.fitness.goal && formData.fitness.experience && formData.fitness.location,
        );
      case 4:
        return Boolean(formData.nutrition.diet);
      default:
        return true;
    }
  })();

  const personalRows = [
    { label: 'Full Name', value: formData.personal.fullName },
    { label: 'Age', value: formData.personal.age },
    { label: 'Gender', value: formData.personal.gender },
    { label: 'Height', value: formData.personal.height ? `${formData.personal.height} cm` : '' },
    { label: 'Weight', value: formData.personal.weight ? `${formData.personal.weight} kg` : '' },
    { label: 'Country', value: formData.personal.country },
  ];

  const fitnessRows = [
    { label: 'Goal', value: formData.fitness.goal },
    { label: 'Experience', value: formData.fitness.experience },
    { label: 'Location', value: formData.fitness.location },
  ];

  const nutritionRows = [
    { label: 'Diet', value: formData.nutrition.diet },
    { label: 'Disliked Foods', value: formData.nutrition.dislikedFoods.join(', ') },
    { label: 'Allergies', value: formData.nutrition.allergies },
    { label: 'Monthly Budget', value: `₹${formData.nutrition.monthlyBudget.toLocaleString('en-IN')}` },
  ];

  const healthRows = [
    { label: 'Blood Report', value: formData.health.bloodReportFile?.name ?? '' },
    { label: 'Equipment', value: formData.health.equipment.join(', ') },
  ];

  let stepContent: React.ReactNode = null;

  if (step === 1) {
    stepContent = (
      <Card padding="lg" className="text-center">
        <div className="flex flex-col items-center gap-5 py-6 sm:py-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text">
              Welcome to HiMax
            </h1>
            <p className="text-base sm:text-lg text-text-muted">
              Your Personal AI Fitness &amp; Nutrition Coach.
            </p>
          </div>
          <p className="max-w-lg text-sm sm:text-base text-text-muted leading-relaxed">
            HiMax creates personalized workout plans, nutrition plans and tracks your progress
            using AI.
          </p>

          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-2">
            <div className="rounded-xl border border-border bg-bg px-3 py-4">
              <Dumbbell className="w-4 h-4 text-primary mx-auto mb-1.5" />
              <p className="text-xs font-medium text-text">Workout Plans</p>
            </div>
            <div className="rounded-xl border border-border bg-bg px-3 py-4">
              <Apple className="w-4 h-4 text-primary mx-auto mb-1.5" />
              <p className="text-xs font-medium text-text">Nutrition Plans</p>
            </div>
            <div className="rounded-xl border border-border bg-bg px-3 py-4">
              <Activity className="w-4 h-4 text-primary mx-auto mb-1.5" />
              <p className="text-xs font-medium text-text">Progress Tracking</p>
            </div>
          </div>

          <Button variant="primary" size="lg" className="mt-2 px-10" onClick={goNext}>
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  } else if (step === 2) {
    stepContent = (
      <Card padding="lg" className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">
            Personal Information
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Tell us a bit about yourself so HiMax can personalize your plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            icon={<User className="w-4 h-4" />}
            placeholder="Enter your full name"
            value={formData.personal.fullName}
            onChange={(e) => updatePersonal('fullName', e.target.value)}
          />
          <Input
            label="Age"
            type="number"
            icon={<Cake className="w-4 h-4" />}
            placeholder="e.g. 28"
            value={formData.personal.age}
            onChange={(e) => updatePersonal('age', e.target.value)}
          />

          <div className="sm:col-span-2">
            <p className="block text-sm font-medium text-text mb-1.5">Gender</p>
            <div className="flex flex-wrap gap-2.5">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updatePersonal('gender', option)}
                  className={pillClasses(formData.personal.gender === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Height (cm)"
            type="number"
            icon={<Ruler className="w-4 h-4" />}
            placeholder="e.g. 175"
            value={formData.personal.height}
            onChange={(e) => updatePersonal('height', e.target.value)}
          />
          <Input
            label="Weight (kg)"
            type="number"
            icon={<Scale className="w-4 h-4" />}
            placeholder="e.g. 70"
            value={formData.personal.weight}
            onChange={(e) => updatePersonal('weight', e.target.value)}
          />

          <div className="sm:col-span-2">
            <Input
              label="Country"
              icon={<Globe className="w-4 h-4" />}
              placeholder="e.g. India"
              value={formData.personal.country}
              onChange={(e) => updatePersonal('country', e.target.value)}
            />
          </div>
        </div>
      </Card>
    );
  } else if (step === 3) {
    stepContent = (
      <Card padding="lg" className="space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">Fitness Profile</h2>
          <p className="text-sm text-text-muted mt-1">
            Pick what fits you best — you can fine-tune this anytime.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Goal
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GOAL_OPTIONS.map(({ label, icon: Icon, description }) => {
              const selected = formData.fitness.goal === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => updateFitness('goal', label)}
                  className={optionCardClasses(selected)}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      selected ? 'bg-primary text-white' : 'bg-bg text-primary',
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Workout Experience
          </p>
          <div className="flex flex-wrap gap-2.5">
            {EXPERIENCE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateFitness('experience', option)}
                className={pillClasses(formData.fitness.experience === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Workout Location
          </p>
          <div className="flex flex-wrap gap-2.5">
            {LOCATION_OPTIONS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => updateFitness('location', label)}
                className={pillClasses(formData.fitness.location === label)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>
    );
  } else if (step === 4) {
    stepContent = (
      <Card padding="lg" className="space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">
            Nutrition Profile
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Help HiMax build a meal plan you&apos;ll actually enjoy.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Diet
          </p>
          <div className="flex flex-wrap gap-2.5">
            {DIET_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateNutrition('diet', option)}
                className={pillClasses(formData.nutrition.diet === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Foods You Dislike
          </p>
          <div className="flex flex-wrap gap-2">
            {DISLIKED_FOOD_OPTIONS.map((food) => (
              <button
                key={food}
                type="button"
                onClick={() => toggleDislikedFood(food)}
                className={chipClasses(formData.nutrition.dislikedFoods.includes(food))}
              >
                {food}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Food Allergies (optional)"
          placeholder="e.g. Peanuts, Shellfish..."
          value={formData.nutrition.allergies}
          onChange={(e) => updateNutrition('allergies', e.target.value)}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text">Monthly Nutrition Budget</p>
            <span className="text-sm font-semibold text-primary">
              ₹{formData.nutrition.monthlyBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step={500}
            value={formData.nutrition.monthlyBudget}
            onChange={(e) => updateNutrition('monthlyBudget', Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-text-muted mt-1">
            <span>₹{MIN_BUDGET.toLocaleString('en-IN')}</span>
            <span>₹{MAX_BUDGET.toLocaleString('en-IN')}</span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-text-muted mt-3">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            This helps HiMax create affordable AI meal plans.
          </p>
        </div>
      </Card>
    );
  } else if (step === 5) {
    stepContent = (
      <Card padding="lg" className="space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">
            Health &amp; Optional Information
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Optional — but it helps HiMax fine-tune things further.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Blood Test Report
          </p>
          <label
            htmlFor="blood-report-upload"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-bg transition-colors duration-200 py-10 px-6 text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-text">
              {formData.health.bloodReportFile
                ? formData.health.bloodReportFile.name
                : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-text-muted">PDF, JPG or PNG</p>
            <input
              id="blood-report-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
          </label>

          {formData.health.bloodReportFile && (
            <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
              <FileText className="w-3.5 h-3.5" />
              {formData.health.bloodReportFile.name}
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 p-3 mt-4">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              Uploading your blood report is optional. Future versions of HiMax AI will use this
              to create more personalized nutrition recommendations.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Equipment Available
          </p>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleEquipment(item)}
                className={chipClasses(formData.health.equipment.includes(item))}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>
    );
  } else {
    const summarySections: { title: string; icon: LucideIcon; step: number; rows: { label: string; value: string }[] }[] = [
      { title: 'Personal Information', icon: User, step: 2, rows: personalRows },
      { title: 'Fitness Profile', icon: Dumbbell, step: 3, rows: fitnessRows },
      { title: 'Nutrition Profile', icon: Apple, step: 4, rows: nutritionRows },
      { title: 'Health & Equipment', icon: Activity, step: 5, rows: healthRows },
    ];

    stepContent = (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">Summary</h2>
          <p className="text-sm text-text-muted mt-1">
            Review everything before we set up your AI coach.
          </p>
        </div>

        {summarySections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <Card key={section.title} padding="lg" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SectionIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-text">{section.title}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => goToStep(section.step)}>
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {section.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between sm:block">
                    <p className="text-xs text-text-muted">{row.label}</p>
                    <p className="text-sm font-medium text-text mt-0.5">
                      {row.value ? (
                        row.value
                      ) : (
                        <span className="text-text-muted italic">Not provided</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base font-semibold text-text">
            You&apos;re ready to begin your AI fitness journey.
          </p>
        </div>

        {saveError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {saveError}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleFinish}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Finish Setup'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-heading font-bold text-text">HiMax</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-text-muted">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between mt-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              disabled={step === 1}
              className={cn(step === 1 && 'invisible')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < TOTAL_STEPS && (
              <Button variant="primary" size="sm" onClick={goNext} disabled={!canProceed}>
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}