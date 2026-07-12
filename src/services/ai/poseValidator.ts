export interface PoseValidationResult {
  valid: boolean;
  score: number;
  reason: string;

  shouldersVisible: boolean;
  elbowsVisible: boolean;
  wristsVisible: boolean;
  hipsVisible: boolean;

  cameraDistance: boolean;
  bodyHorizontal: boolean;
}

export function validatePushupPose(
  pose: any,
): PoseValidationResult {

  const leftShoulder = pose[11];
  const rightShoulder = pose[12];

  const leftElbow = pose[13];
  const rightElbow = pose[14];

  const leftWrist = pose[15];
  const rightWrist = pose[16];

  const leftHip = pose[23];
  const rightHip = pose[24];

  const shouldersVisible =
    leftShoulder.visibility > 0.7 &&
    rightShoulder.visibility > 0.7;

  const elbowsVisible =
    leftElbow.visibility > 0.7 &&
    rightElbow.visibility > 0.7;

  const wristsVisible =
    leftWrist.visibility > 0.7 &&
    rightWrist.visibility > 0.7;

  const hipsVisible =
    leftHip.visibility > 0.7 &&
    rightHip.visibility > 0.7;

  const shoulderY =
    (leftShoulder.y + rightShoulder.y) / 2;

  const hipY =
    (leftHip.y + rightHip.y) / 2;

  const bodyHorizontal =
    Math.abs(shoulderY - hipY) < 0.20;

  const shoulderWidth =
    Math.abs(leftShoulder.x - rightShoulder.x);

  const cameraDistance =
    shoulderWidth > 0.18;

  let score = 0;

  if (shouldersVisible) score += 15;
  if (elbowsVisible) score += 15;
  if (wristsVisible) score += 15;
  if (hipsVisible) score += 15;

  if (bodyHorizontal) score += 20;

  if (cameraDistance) score += 20;

  let reason = "Adjust your position";

  if (score >= 95)
    reason = "Excellent";

  else if (score >= 80)
    reason = "Ready";

  else if (score >= 60)
    reason = "Almost Ready";

  else if (!cameraDistance)
    reason = "Move closer to camera";

  else if (!bodyHorizontal)
    reason = "Get into push-up position";

  else
    reason = "Move fully into camera view";

  return {
    valid: score >= 80,
    score,
    reason,

    shouldersVisible,
    elbowsVisible,
    wristsVisible,
    hipsVisible,

    cameraDistance,
    bodyHorizontal,
  };
}