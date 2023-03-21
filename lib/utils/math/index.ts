export const roundedSquareWave = (
  t: number,
  delta: number,
  a: number,
  f: number
) => {
  return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};
