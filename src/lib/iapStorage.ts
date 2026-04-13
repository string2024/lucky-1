import { Storage } from '@apps-in-toss/web-framework';

const PREMIUM_KEY = 'lucky1_premium_pass';
const BONUS_KEY   = 'lucky1_bonus_tokens';

export const saveGrantedSku = async (sku: string): Promise<void> => {
  await Storage.setItem(PREMIUM_KEY, sku);
};

export const hasPremiumPass = async (): Promise<boolean> => {
  const val = await Storage.getItem(PREMIUM_KEY);
  return val === 'lucky1.premium.pass';
};

export const saveBonusTokens = async (add: number): Promise<void> => {
  const current = await getBonusTokenCount();
  await Storage.setItem(BONUS_KEY, String(current + add));
};

export const getBonusTokenCount = async (): Promise<number> => {
  const val = await Storage.getItem(BONUS_KEY);
  return parseInt(val ?? '0', 10);
};

export const useBonusToken = async (): Promise<boolean> => {
  const count = await getBonusTokenCount();
  if (count <= 0) return false;
  await Storage.setItem(BONUS_KEY, String(count - 1));
  return true;
};
