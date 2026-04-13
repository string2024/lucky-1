import { useState, useEffect, useCallback } from 'react';
import { hasPremiumPass, getBonusTokenCount } from '@/lib/iapStorage';

export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [bonusTokens, setBonusTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [premium, tokens] = await Promise.all([
      hasPremiumPass(),
      getBonusTokenCount(),
    ]);
    setIsPremium(premium);
    setBonusTokens(tokens);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { isPremium, bonusTokens, loading, refresh };
};
