import { mulberry32, xmur3 } from "./stringUtils";

export const getUTCDate = (): Date => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

export function getDailyRandomElement<T>(arr: T[]): T {
  const dateSeed = getUTCDate().toISOString().slice(0, 10); // YYYY-MM-DD
  const seedFn = xmur3(dateSeed);
  const rand = mulberry32(seedFn());
  const idx = Math.floor(rand() * arr.length);
  return arr[idx];
}
