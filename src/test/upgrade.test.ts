import { describe, it, expect, beforeEach } from "vitest";
import { getLuckyTip } from "@/lib/fortune";
import { daysToNextReward, checkIn, getFreeBonusCount } from "@/lib/attendance";

describe("행운 팁", () => {
  it("같은 날에는 항상 같은 값이고 숫자는 1~45", () => {
    const a = getLuckyTip();
    const b = getLuckyTip();
    expect(a).toEqual(b);
    expect(a.number).toBeGreaterThanOrEqual(1);
    expect(a.number).toBeLessThanOrEqual(45);
  });
});

describe("출석 보상", () => {
  beforeEach(() => localStorage.clear());

  it("다음 보너스까지 남은 일수", () => {
    expect(daysToNextReward(0)).toBe(7);
    expect(daysToNextReward(1)).toBe(6);
    expect(daysToNextReward(6)).toBe(1);
    expect(daysToNextReward(7)).toBe(7);
    expect(daysToNextReward(29)).toBe(1);
    expect(daysToNextReward(23)).toBe(5);
  });

  it("30일째(7의 배수가 아닌 날)에도 보너스 1개 지급", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    localStorage.setItem("gajyeobwa_attendance", JSON.stringify({ dates: [], streak: 29, lastDate: y, badges: [] }));
    localStorage.setItem("gajyeobwa_free_bonus", "0");
    const r = checkIn();
    expect(r.streak).toBe(30);
    expect(r.rewardGranted).toBe(true);
    expect(getFreeBonusCount()).toBe(1);
  });
});

describe("인앱 결제 상품 ID", () => {
  it("콘솔에 등록된 ait.* 형식 ID를 쓴다", async () => {
    const { IAP_SKUS } = await import("@/lib/iap");
    expect(IAP_SKUS.PREMIUM_PASS).toMatch(/^ait\.\d+\./);
    expect(IAP_SKUS.BONUS_5PACK).toMatch(/^ait\.\d+\./);
    expect(IAP_SKUS.PREMIUM_PASS).not.toBe(IAP_SKUS.BONUS_5PACK);
  });
});

describe("프리미엄 패스 인식", () => {
  it("저장 전에는 아니고, 새 상품 ID·예전 상품 코드로 저장되면 인정한다", async () => {
    localStorage.clear();
    const { hasPremiumPass, saveGrantedSku } = await import("@/lib/iapStorage");
    expect(await hasPremiumPass()).toBe(false);
    await saveGrantedSku("lucky1.premium.pass");
    expect(await hasPremiumPass()).toBe(true);
    localStorage.clear();
    await saveGrantedSku("ait.0000022806.5d370157.7a0042f633.6059033179");
    expect(await hasPremiumPass()).toBe(true);
  });
});
