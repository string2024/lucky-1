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
  return { dates: [], streak: 0, lastDate: "", badges: [] };
}

function saveData(data: AttendanceData) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
}

export function checkIn(): { streak: number; alreadyChecked: boolean; rewardGranted?: boolean; newBadges?: string[] } {
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

  // 7일 달성 시 무료 보너스 토큰 지급
  let rewardGranted = false;
  if (newStreak > 0 && newStreak % 7 === 0) {
    grantFreeBonus();
    rewardGranted = true;
  }

  // 뱃지 체크
  const newBadges: string[] = [];
  for (const badge of BADGES) {
    if (data.dates.length >= badge.requirement && !data.badges.includes(badge.name)) {
      data.badges.push(badge.name);
      newBadges.push(badge.name);
    }
  }

  saveData(data);

  return { streak: newStreak, alreadyChecked: false, rewardGranted, newBadges };
}

export function getAttendanceInfo() {
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
    badges: data.badges || [],
    earnedBadges: BADGES.filter(b => (data.badges || []).includes(b.name)),
  };
}

// 무료 보너스 토큰 관리
export function grantFreeBonus() {
  const count = getFreeBonusCount();
  localStorage.setItem(FREE_BONUS_KEY, String(count + 1));
}

export function getFreeBonusCount(): number {
  return parseInt(localStorage.getItem(FREE_BONUS_KEY) || "0", 10);
}

export function useFreeBonusToken(): boolean {
  const count = getFreeBonusCount();
  if (count <= 0) return false;
  localStorage.setItem(FREE_BONUS_KEY, String(count - 1));
  return true;
}
