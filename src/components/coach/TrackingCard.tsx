import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Play, Pause, Square, User } from "lucide-react";
import { Exercise, TrackingStatus } from "../../types/coach";
import { trackingService } from "../../services/trackingService";
import CameraView from "./CameraView";
import CelebrationOverlay from "./CelebrationOverlay";

interface TrackingCardProps {
  exercise: Exercise;

  onSetComplete: (
    exerciseId: string,
    reps: number,
    elapsedSeconds: number,
  ) => void;

  onComplete: (
    exerciseId: string,
    reps: number,
    elapsedSeconds: number,
  ) => void;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const statusLabel: Record<TrackingStatus, string> = {
  idle: "Camera Ready",
  tracking: "Tracking…",
  paused: "Paused",
  stopped: "Stopped",
};

export default function TrackingCard({
  exercise,
  onSetComplete,
  onComplete,
}: TrackingCardProps) {
  const [isTrackingPaused, setIsTrackingPaused] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>("idle");
  const [reps, setReps] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [overlayPhase, setOverlayPhase] = useState<
    "hidden" | "perfect" | "countdown"
  >("hidden");

  const [countdown, setCountdown] = useState(3);
  const [waitingNextSet, setWaitingNextSet] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCompletingRef = useRef(false);

  // Reset the simulated session whenever the active exercise changes.
  useEffect(() => {
    setStatus("idle");

    setElapsed(0);

    setReps(0);

    setWaitingNextSet(false);

    setIsTrackingPaused(false);

    isCompletingRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [exercise.id]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    // Prevent multiple timers running together
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const handleStart = async () => {
    isCompletingRef.current = false;

    setWaitingNextSet(false);

    setIsTrackingPaused(false);

    // Reset only for a new set
    setReps(0);

    // Parent is now the source of truth
    exercise.completedReps = 0;

    await trackingService.startTracking(exercise);

    setStatus("tracking");

    startTimer();
  };

  const handlePause = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    await trackingService.pauseTracking(exercise.id);
    setStatus("paused");
  };

  const handleResume = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setStatus("tracking");
    startTimer();
  };

  const handleRep = useCallback(() => {
    // Prevent duplicate completion
    if (isCompletingRef.current) {
      return;
    }

    setReps((prev) => {
      const next = prev + 1;

      // Normal rep
      if (next < exercise.reps) {
        return next;
      }

      // Lock completion immediately
      isCompletingRef.current = true;

      onSetComplete(exercise.id, next, elapsed);

      // Stop elapsed timer while resting
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Pause AI detection
      setIsTrackingPaused(true);

      // Show celebration
      setOverlayPhase("perfect");

      setTimeout(() => {
        setOverlayPhase("countdown");
        setCountdown(3);

        let current = 3;

        const timer = setInterval(() => {
          current--;

          if (current > 0) {
            setCountdown(current);
            return;
          }

          clearInterval(timer);

          setOverlayPhase("hidden");

          if ((exercise.currentSet ?? 1) < exercise.sets) {
            setWaitingNextSet(true);

            // Pause tracking completely
            setStatus("paused");

            return;
          }

          handleStop(next);
        }, 1000);
      }, 1200);

      return next;
    });
  }, [
    exercise.id,
    exercise.reps,
    exercise.sets,
    exercise.currentSet,
    elapsed,
    onSetComplete,
  ]);
  const handleStop = async (finalReps: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const result = await trackingService.stopTracking(
      exercise.id,
      finalReps,
      elapsed,
    );

    setStatus("stopped");

    onComplete(result.exerciseId, result.repsCounted, result.elapsedSeconds);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 lg:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-heading font-bold text-text">
          Camera Tracking
        </h2>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
          <Camera className="w-3.5 h-3.5" />
          {statusLabel[status]}
        </span>
      </div>

      <div className="relative aspect-video w-full rounded-xl border-2 border-emerald-500/60 bg-bg overflow-hidden flex items-center justify-center mb-5">
        <div className="absolute inset-4 rounded-lg border border-dashed border-emerald-500/30" />

        <CelebrationOverlay
          show={overlayPhase !== "hidden"}
          title={
            overlayPhase === "perfect"
              ? "🏆 PERFECT SET"
              : (exercise.currentSet ?? 1) < exercise.sets
                ? `Preparing Set ${exercise.currentSet ?? 1}...`
                : "Preparing Next Exercise..."
          }
          subtitle={
            overlayPhase === "perfect" ? "⭐⭐⭐⭐⭐ Excellent Form" : undefined
          }
          xp={overlayPhase === "perfect" ? 120 : undefined}
          countdown={overlayPhase === "countdown" ? countdown : undefined}
        />

        {status === "tracking" ? (
          <CameraView
            exercise={exercise}
            currentRep={reps}
            targetReps={exercise.reps}
            paused={isTrackingPaused}
            onRep={handleRep}
          />
        ) : (
          <motion.div
            animate={{
              opacity: 0.5,
            }}
          >
            <User
              className="w-16 h-16 text-emerald-500/70"
              strokeWidth={1.25}
            />
          </motion.div>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
          {statusLabel[status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-bg border border-border px-4 py-3">
          <p className="text-xs text-text-muted mb-1">Exercise</p>
          <p className="text-sm font-semibold text-text truncate">
            {exercise.name}
          </p>
        </div>
        <div className="rounded-xl bg-bg border border-border px-4 py-3">
          <p className="text-xs text-text-muted mb-1">Counter</p>
          <p className="text-sm font-semibold text-text">
            {exercise.completedSets === 0
              ? "Not Started"
              : `Set ${Math.min(exercise.currentSet ?? 1, exercise.sets)} / ${exercise.sets}`}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {exercise.completedSets === 0
              ? `0 / ${exercise.reps}`
              : `${exercise.completedReps ?? reps} / ${exercise.reps}`}
          </p>
        </div>
        <div className="rounded-xl bg-bg border border-border px-4 py-3">
          <p className="text-xs text-text-muted mb-1">Elapsed Time</p>
          <p className="text-sm font-semibold text-text">
            {formatTime(elapsed)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {waitingNextSet ? (
          <button
            onClick={handleStart}
            className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 transition-colors"
          >
            ▶ Next Set
          </button>
        ) : status === "idle" || status === "stopped" ? (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm py-3 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Tracking
          </button>
        ) : (
          <>
            <button
              onClick={status === "tracking" ? handlePause : handleResume}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-bg hover:bg-border/40 text-text font-semibold text-sm py-3 transition-colors"
            >
              <Pause className="w-4 h-4" />
              {status === "tracking" ? "Pause" : "Resume"}
            </button>

            <button
              onClick={() => handleStop(reps)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-sm py-3 transition-colors"
            >
              <Square className="w-4 h-4 fill-current" />
              Stop
            </button>
          </>
        )}
      </div>
    </section>
  );
}
