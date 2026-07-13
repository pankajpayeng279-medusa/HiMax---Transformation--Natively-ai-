import { useRef, useEffect, useState } from "react";
import { loadPoseLandmarker } from "../../services/ai/mediapipe";
import { calculateAngle } from "../../utils/poseUtils";
import { validatePushupPose } from "../../services/ai/poseValidator";
import { drawPoseSkeleton } from "./PoseSkeleton";

import { Exercise } from "../../types/coach";

interface CameraViewProps {
  exercise: Exercise;

  currentRep: number;
  targetReps: number;

  paused: boolean;

  onRep: () => void;
}

export default function CameraView({
  exercise,
  currentRep,
  targetReps,
  paused,
  onRep,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<any>(null);
  const animationRef = useRef<number>();

  const [angle, setAngle] = useState(0);

  const [isPoseValid, setIsPoseValid] = useState(false);
  const [status, setStatus] = useState("Checking Pose...");

  const stageRef = useRef<"up" | "down">("up");
  const repLockRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        poseRef.current = await loadPoseLandmarker();

        const detect = () => {
          if (
            videoRef.current &&
            poseRef.current &&
            videoRef.current.readyState >= 2
          ) {
            if (paused || currentRep >= targetReps) {
              animationRef.current = requestAnimationFrame(detect);
              return;
            }

            const result = poseRef.current.detectForVideo(
              videoRef.current,
              performance.now(),
            );

            if (result.landmarks.length > 0) {
              const pose = result.landmarks[0];
              const exerciseName = exercise.name;
              const canvas = canvasRef.current;

              if (canvas && videoRef.current) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;

                drawPoseSkeleton(canvas, pose);
              }

              // ----------------------------
              // Validate Push-up Pose
              // ----------------------------

              let validation;

              switch (exerciseName) {
                case "Push Ups":
                  validation = validatePushupPose(pose);
                  break;

                case "Squats":
                  validation = { valid: true, reason: "" };
                  break;

                default:
                  validation = { valid: true, reason: "" };
              }

              setIsPoseValid(validation.valid);
              setStatus(validation.reason);

              // Don't count reps until pose is valid
              if (!validation.valid) {
                animationRef.current = requestAnimationFrame(detect);
                return;
              }

              switch (exerciseName) {
                case "Push Ups": {
                  const leftShoulder = pose[11];
                  const leftElbow = pose[13];
                  const leftWrist = pose[15];

                  const leftAngle = calculateAngle(
                    leftShoulder,
                    leftElbow,
                    leftWrist,
                  );

                  setAngle(leftAngle);

                  if (leftAngle < 90) {
                    stageRef.current = "down";
                    repLockRef.current = false;
                  }

                  if (
                    leftAngle > 160 &&
                    stageRef.current === "down" &&
                    !repLockRef.current
                  ) {
                    stageRef.current = "up";
                    repLockRef.current = true;

                    onRep();
                  }

                  break;
                }

                case "Squats": {
                  const leftHip = pose[23];
                  const leftKnee = pose[25];
                  const leftAnkle = pose[27];

                  const kneeAngle = calculateAngle(
                    leftHip,
                    leftKnee,
                    leftAnkle,
                  );

                  setAngle(kneeAngle);

                  // Standing position
                  if (kneeAngle > 165) {
                    stageRef.current = "up";
                    repLockRef.current = false;
                  }

                  // Bottom position
                  if (
                    kneeAngle < 90 &&
                    stageRef.current === "up" &&
                    !repLockRef.current
                  ) {
                    stageRef.current = "down";
                    repLockRef.current = true;

                    onRep();
                  }

                  break;
                }
              }
            }
          }

          animationRef.current = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paused]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-xl scale-x-[-1]"
      />

      <canvas
        ref={canvasRef}
        className="
    absolute
    inset-0
    w-full
    h-full
    pointer-events-none
    scale-x-[-1]
  "
      />

      {/* AI Overlay */}

      <div
        className="
absolute
top-2
left-2
sm:top-4
sm:left-4
bg-black/70
backdrop-blur-md
rounded-xl
px-3
sm:px-4
py-2
sm:py-3
text-white
w-[170px]
sm:min-w-[220px]
"
      >
        <p className="text-xs uppercase tracking-widest text-gray-300">
          AI Coach
        </p>

        <p className="text-lg sm:text-2xl font-bold mt-1">
          {currentRep} / {targetReps} Reps
        </p>

        <p className="text-xs sm:text-sm text-gray-300 mt-1">
          Elbow: {angle.toFixed(0)}°
        </p>

        <div
          className={`mt-2 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium ${
            isPoseValid
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-300"
          }`}
        >
          {isPoseValid ? "🟢 Ready" : "🟡 " + status}
        </div>

        <p className="text-xs mt-2 text-gray-400">
          {stageRef.current === "down" ? "⬇ Down Position" : "⬆ Up Position"}
        </p>
      </div>
    </div>
  );
}
