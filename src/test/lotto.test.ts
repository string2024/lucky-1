import { describe, it, expect, vi, afterEach } from "vitest";
import { getTodayFortune, generateLottoNumbers, getNumberColor } from "@/lib/fortune";

const numbersForDay = (day: Date) => {
  vi.setSystemTime(day);
  return generateLottoNumbers(getTodayFortune());
};

describe("행운 번호", () => {
  afterEach(() => vi.useRealTimers());

  it("1~45 사이 서로 다른 6개이고 같은 날에는 항상 같다", () => {
    vi.useFakeTimers();
    const a = numbersForDay(new Date(2026, 9, 31));
    const b = numbersForDay(new Date(2026, 9, 31));
    expect(a).toEqual(b);
    expect(new Set(a).size).toBe(6);
    expect(a.every((n) => n >= 1 && n <= 45)).toBe(true);
  });

  it("1년 동안 특정 번호가 몰리지 않고, 여러 색 구슬이 섞여 나온다", () => {
    vi.useFakeTimers();
    const freq = new Map<number, number>();
    let multiColorDays = 0;
    const days = 365;
    for (let i = 0; i < days; i++) {
      const nums = numbersForDay(new Date(2026, 0, 1 + i));
      nums.forEach((n) => freq.set(n, (freq.get(n) ?? 0) + 1));
      if (new Set(nums.map(getNumberColor)).size >= 2) multiColorDays++;
    }
    const maxShare = Math.max(...freq.values()) / days;
    expect(maxShare).toBeLessThan(0.3); // 어떤 번호도 하루의 30% 넘게 나오지 않는다
    expect(multiColorDays / days).toBeGreaterThan(0.9);
  });
});
