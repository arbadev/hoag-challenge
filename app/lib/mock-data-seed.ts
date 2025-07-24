// Use a fixed seed for consistent mock data generation
let seed = 12345;

function seededRandom(): number {
  // Linear congruential generator
  seed = (seed * 1664525 + 1013904223) % 2147483647;
  return seed / 2147483647;
}

// Replace Math.random with seededRandom for consistent data
export function resetSeed(newSeed: number = 12345) {
  seed = newSeed;
}

export function random(): number {
  return seededRandom();
}

export function randomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

export function randomElement<T>(array: T[]): T {
  return array[Math.floor(seededRandom() * array.length)];
}

export function randomBoolean(probability: number = 0.5): boolean {
  return seededRandom() < probability;
}