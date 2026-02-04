// Maps keyboard keys to pad IDs
// Layout mirrors the physical pad grid spatially:
//   1 2 3 4  → Row 3 (top)
//   Q W E R  → Row 2
//   A S D F  → Row 1
//   Z X C V  → Row 0 (bottom)

export const KEYBOARD_TO_PAD: Record<string, number> = {
  // Row 3 (top)
  '1': 12, '2': 13, '3': 14, '4': 15,
  // Row 2
  'q': 8,  'w': 9,  'e': 10, 'r': 11,
  // Row 1
  'a': 4,  's': 5,  'd': 6,  'f': 7,
  // Row 0 (bottom)
  'z': 0,  'x': 1,  'c': 2,  'v': 3,
};

export const PAD_TO_KEY: Record<number, string> = Object.fromEntries(
  Object.entries(KEYBOARD_TO_PAD).map(([key, padId]) => [padId, key.toUpperCase()])
);
