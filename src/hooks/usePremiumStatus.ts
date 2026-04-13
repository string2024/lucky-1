import { useState, useEffect, useCallback } from 'react';
import { hasPremiumPass, getBonusTokenCount } from '@/lib/iapStorage';

export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [bonusTokens, setBonusTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [premium, tokens] = await Promise.all([
        hasPremiumPass(),
        getBonusTokenCount(),
      ]);
      setIsPremium(premium);
      setBonusTokens(tokens);
    } catch {
      // 브릿지 실패 시 기본값(비프리미엄) 유지
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { isPremium, bonusTokens, loading, refresh };
};
