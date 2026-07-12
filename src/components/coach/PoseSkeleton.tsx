import { DrawingUtils, PoseLandmarker } from "@mediapipe/tasks-vision";

export function drawPoseSkeleton(
  canvas: HTMLCanvasElement,
  landmarks: any[],
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const drawingUtils = new DrawingUtils(ctx);

  drawingUtils.drawConnectors(
    landmarks,
    PoseLandmarker.POSE_CONNECTIONS,
    {
      color: "#00F5FF",
      lineWidth: 5,
    },
  );

  drawingUtils.drawLandmarks(
    landmarks,
    {
      color: "#7CFFCB",
      radius: 5,
    },
  );
}