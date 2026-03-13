const SAVED_KEY = "gajyeobwa_saved";

export interface SavedNumbers {
  id: string;
  numbers: number[];
  date: string;
  type: "main" | "bonus";
}

export function getSavedNumbers(): SavedNumbers[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveNumbers(entry: Omit<SavedNumbers, "id">): SavedNumbers {
  const saved = getSavedNumbers();
  const newEntry: SavedNumbers = { ...entry, id: Date.now().toString() };
  saved.unshift(newEntry);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved.slice(0, 50)));
  return newEntry;
}

export function deleteNumbers(id: string) {
  const saved = getSavedNumbers().filter((s) => s.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

export function shareNumbers(numbers: number[]): string {
  return `🍀 가져봐 1등 🍀\n오늘의 행운 번호: ${numbers.join(", ")}\nhttps://toss.im/gajyeobwa`;
}
