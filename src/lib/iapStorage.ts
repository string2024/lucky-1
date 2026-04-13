import { Storage } from '@apps-in-toss/web-framework';

const PREMIUM_KEY = 'lucky1_premium_pass';
const BONUS_KEY   = 'lucky1_bonus_tokens';

// Storage 브릿지 실패 시 localStorage 폴백
const getItem = async (key: string): Promise<string | null> => {
  try {
    return await Storage.getItem(key);
  } catch {
    return localStorage.getItem(key);
  }
};

const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await Storage.setItem(key, value);
  } catch {
    localStorage.setItem(key, value);
  }
};

export const saveGrantedSku = async (sku: string): Promise<void> => {
  await setItem(PREMIUM_KEY, sku);
};

export const hasPremiumPass = async (): Promise<boolean> => {
  const val = await getItem(PREMIUM_KEY);
  return val === 'lucky1.premium.pass';
};

export const saveBonusTokens = async (add: number): Promise<void> => {
  const current = await getBonusTokenCount();
  await setItem(BONUS_KEY, String(current + add));
};

export const getBonusTokenCount = async (): Promise<number> => {
  const val = await getItem(BONUS_KEY);
  return parseInt(val ?? '0', 10);
};

export const useBonusToken = async (): Promise<boolean> => {
  const count = await getBonusTokenCount();
  if (count <= 0) return false;
  await setItem(BONUS_KEY, String(count - 1));
  return true;
};
