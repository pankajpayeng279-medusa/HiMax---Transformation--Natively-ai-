import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { coachService } from "../services/coachService";
import { WorkoutPlan, DailySummary, Exercise } from "../types/coach";

import WorkoutCard from "../components/coach/WorkoutCard";
import TrackingCard from "../components/coach/TrackingCard";
import SummaryCard from "../components/coach/SummaryCard";
import AIChatCard from "../components/coach/AIChatCard";
import { motion } from "framer-motion";

export default function AICoach() {
  console.count("CoachPage Render");
  const { user } = useAuth();
  const userName = user?.email?.split("@")[0] || "there";

  const [showWorkoutReady, setShowWorkoutReady] = useState(false);
  const [showWorkoutCards, setShowWorkoutCards] = useState(false);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [workoutSelected, setWorkoutSelected] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);

  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const activeExercise =
    workout?.exercises.find((exercise) => exercise.id === activeExerciseId) ??
    null;
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [elapsedSecondsTotal, setElapsedSecondsTotal] = useState(0);

  const trackingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [w, s] = await Promise.all([
        coachService.generateWorkout(),
        coachService.getDailySummary(),
      ]);
      if (cancelled) return;
      const initializedWorkout = {
        ...w,
        exercises: w.exercises.map((exercise) => ({
          ...exercise,
          currentSet: 0,
          completedSets: 0,
          completedReps: 0,
          completed: false,
        })),
      };

      setWorkout(initializedWorkout);
      setSummary(s);
      setActiveExerciseId(null);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Powers the hero's "Upper Body" quick action. This reuses the exact
  // same coachService.generateWorkout() call and exercise-initialization
  // shape already used on mount — just made callable on demand, the same
  // way handleRegenerate already wraps coachService.regenerateWorkout().
  const handleGenerateWorkout = async () => {
    setGeneratingWorkout(true);
    const w = await coachService.generateWorkout();
    const initializedWorkout = {
      ...w,
      exercises: w.exercises.map((exercise) => ({
        ...exercise,
        currentSet: 0,
        completedSets: 0,
        completedReps: 0,
        completed: false,
      })),
    };
    setWorkout(initializedWorkout);

    setActiveExerciseId(initializedWorkout.exercises[0]?.id ?? null);

    setCompletedIds(new Set());
    setElapsedSecondsTotal(0);
    setShowWorkoutReady(true);

    setTimeout(() => {
      setShowWorkoutCards(true);
    }, 900);

    setTimeout(() => {
      setShowWorkoutReady(false);
    }, 2200);
    setGeneratingWorkout(false);
  };

  const handleRegenerate = async () => {
    setShowWorkoutCards(true);
    setRegenerating(true);
    const w = await coachService.regenerateWorkout();
    setWorkout(w);

    setActiveExerciseId(w.exercises[0]?.id ?? null);

    setCompletedIds(new Set());
    setElapsedSecondsTotal(0);
    setRegenerating(false);
  };

  const handleStartTracking = (exercise: Exercise) => {
    setActiveExerciseId(exercise.id);

    trackingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSetComplete = (
    exerciseId: string,
    reps: number,
    _elapsedSeconds: number,
  ) => {
    setWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      const updatedExercises = prevWorkout.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        const completedSets = (exercise.completedSets ?? 0) + 1;

        const isFinished = completedSets >= exercise.sets;

        return {
          ...exercise,

          completedReps: reps,

          completedSets,

          currentSet: isFinished ? exercise.sets : completedSets + 1,

          completed: isFinished,

          completedAt: isFinished ? new Date().toISOString() : undefined,
        };
      });

      setActiveExerciseId(exerciseId);

      return {
        ...prevWorkout,
        exercises: updatedExercises,
      };
    });
  };

  const handleExerciseComplete = (
    exerciseId: string,
    reps: number,
    elapsedSeconds: number,
  ) => {
    setElapsedSecondsTotal((prev) => prev + elapsedSeconds);

    setWorkout((prevWorkout) => {
      if (!prevWorkout) return prevWorkout;

      const updatedExercises = prevWorkout.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        const completedSets = exercise.completedSets ?? 0;

        const isFinished = completedSets >= exercise.sets;

        return {
          ...exercise,

          completedReps: reps,

          completedSets,

          currentSet: isFinished ? exercise.sets : completedSets + 1,

          completed: isFinished,

          completedAt: isFinished ? new Date().toISOString() : undefined,
        };
      });

      const finishedExercise = updatedExercises.find(
        (e) => e.id === exerciseId,
      );

      if (finishedExercise?.completed) {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.add(exerciseId);
          return next;
        });

        const nextExercise = updatedExercises.find((e) => !e.completed);

        setActiveExerciseId(nextExercise?.id ?? null);
      } else {
        setActiveExerciseId(exerciseId);
      }

      return {
        ...prevWorkout,
        exercises: updatedExercises,
      };
    });
  };

  if (loading || !workout || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-text-muted">
          Preparing today&apos;s coaching session…
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-start">
      <div className="flex flex-col gap-6 lg:gap-8 min-w-0">
        <AIChatCard
          userName={userName}
          onGenerateWorkout={handleGenerateWorkout}
          onRegenerateWorkout={handleRegenerate}
        />

        {showWorkoutReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
          >
            <p className="text-3xl mb-3">✨</p>

            <h2 className="text-2xl font-bold text-emerald-400">
              Today's Workout is Ready
            </h2>

            <p className="mt-2 text-text-muted">
              Good luck! Give it your best 💪
            </p>
          </motion.div>
        )}

        {showWorkoutCards && (
          <section>
            <h2 className="text-lg font-heading font-bold text-text mb-4">
              Today&apos;s Workout
            </h2>
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {workout.exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{
                    opacity: 0,
                    y: 35,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.18,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                >
                  <WorkoutCard
                    exercise={exercise}
                    completed={completedIds.has(exercise.id)}
                    currentSet={exercise.currentSet}
                    completedSets={exercise.completedSets}
                    completedReps={exercise.completedReps}
                    onStartTracking={handleStartTracking}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        <div ref={trackingRef}>
          {activeExercise ? (
            <TrackingCard
              exercise={activeExercise}
              onSetComplete={handleSetComplete}
              onComplete={handleExerciseComplete}
            />
          ) : (
            <section className="rounded-2xl border border-border bg-surface p-6 lg:p-8">
              <h2 className="text-lg font-heading font-bold text-text mb-5">
                Camera Tracking
              </h2>

              <div className="rounded-xl border-2 border-dashed border-border h-[420px] flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold text-text">
                  No Exercise Selected
                </h3>

                <p className="mt-2 text-text-muted max-w-sm">
                  Choose an Upper Body, Lower Body or Full Body workout from the
                  AI Coach above to begin tracking.
                </p>

                <button
                  disabled
                  className="mt-8 rounded-xl bg-primary/30 text-white/60 px-8 py-3 cursor-not-allowed"
                >
                  Select a Workout First
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <SummaryCard summary={summary} />
    </div>
  );
}
