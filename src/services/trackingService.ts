import { Exercise } from '../types/coach';
import { supabase } from "./supabase/client";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface TrackingSession {
  exerciseId: string;
  startedAt: number;
}

export interface TrackingResult {
  exerciseId: string;
  repsCounted: number;
  elapsedSeconds: number;
}

/**
 * trackingService
 *
 * Mock service layer for pose tracking / rep counting. The real
 * implementation will wrap MediaPipe Pose (or similar) to read camera
 * frames and count reps from joint-angle sequences. For now every method
 * just resolves with a plausible mock payload so Camera Tracking can be
 * wired up end-to-end ahead of the real integration.
 *
 * TODO: swap internals for a MediaPipe Pose landmarker + rep-counting
 * state machine. Keep these method signatures stable.
 */
export const trackingService = {
  async startTracking(exercise: Exercise): Promise<TrackingSession> {
    await delay(400);
    return { exerciseId: exercise.id, startedAt: Date.now() };
  },

  async pauseTracking(exerciseId: string): Promise<{ exerciseId: string; paused: true }> {
    await delay(150);
    return { exerciseId, paused: true };
  },

  async stopTracking(
    exerciseId: string,
    repsCounted: number,
    elapsedSeconds: number,
  ): Promise<TrackingResult> {
    await delay(300);
    return { exerciseId, repsCounted, elapsedSeconds };
  },
};