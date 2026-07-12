export interface Point {
  x: number;
  y: number;
}

export function calculateAngle(
  a: Point,
  b: Point,
  c: Point,
): number {

  const ab = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const cb = {
    x: c.x - b.x,
    y: c.y - b.y,
  };

  const dot =
    ab.x * cb.x +
    ab.y * cb.y;

  const magAB = Math.sqrt(
    ab.x * ab.x +
    ab.y * ab.y,
  );

  const magCB = Math.sqrt(
    cb.x * cb.x +
    cb.y * cb.y,
  );

  const cosine =
    dot /
    (magAB * magCB);

  const angle =
    Math.acos(
      Math.min(
        Math.max(cosine, -1),
        1,
      ),
    );

  return angle * (180 / Math.PI);
}