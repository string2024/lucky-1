const ATTENDANCE_KEY = "gajyeobwa_attendance";
const FREE_BONUS_KEY = "gajyeobwa_free_bonus";

interface AttendanceData {
  dates: string[];
  streak: number;
  lastDate: string;
  badges: string[];
}

export type Badge = {
  icon: string;
  name: string;
  requirement: number;
};

export const BADGES: Badge[] = [
  { icon: "🍀", name: "행운의 새싹", requirement: 7 },
  { icon: "⭐", name: "럭키 스타", requirement: 14 },
  { icon: "💎", name: "다이아몬드", requirement: 21 },
  { icon: "👑", name: "로또 킹", requirement: 30 },
];

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadData(): AttendanceData {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { dates: [], streak: 0, lastDate: "" };
}

function saveData(data: AttendanceData) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
}

export function checkIn(): { streak: number; alreadyChecked: boolean } {
  const data = loadData();
  const today = getTodayStr();

  if (data.lastDate === today) {
    return { streak: data.streak, alreadyChecked: true };
  }

  const yesterday = getYesterdayStr();
  const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;

  data.dates.push(today);
  data.streak = newStreak;
  data.lastDate = today;
  saveData(data);

  return { streak: newStreak, alreadyChecked: false };
}

export function getAttendanceInfo(): { streak: number; totalDays: number; checkedToday: boolean } {
  const data = loadData();
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  let streak = data.streak;
  if (data.lastDate !== today && data.lastDate !== yesterday) {
    streak = 0;
  }

  return {
    streak,
    totalDays: data.dates.length,
    checkedToday: data.lastDate === today,
  };
}
