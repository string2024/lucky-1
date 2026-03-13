import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InterstitialAdProps {
  onClose: () => void;
  variant?: "default" | "lotto";
}

const AD_MESSAGES = [
  { title: "🍀 오늘의 행운을 확인하세요!", sub: "가져봐 1등과 함께하는 행운" },
  { title: "🎯 당신의 번호가 기다리고 있어요!", sub: "운세 기반 AI 번호 추천" },
  { title: "⭐ 행운은 준비된 자에게!", sub: "매일 출석하면 보상이 팡팡" },
];

const InterstitialAd = ({ onClose, variant = "default" }: InterstitialAdProps) => {
  const msg = variant === "lotto" 
    ? { title: "🎱 번호 생성 중...", sub: "잠시만 기다려주세요" }
    : AD_MESSAGES[Math.floor(Math.random() * AD_MESSAGES.length)];

  const [countdown, setCountdown] = useState(variant === "lotto" ? 3 : 0);
  const [canClose, setCanClose] = useState(variant !== "lotto");

  useState(() => {
    if (variant === "lotto") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-card rounded-2xl p-6 mx-6 text-center max-w-sm w-full"
      >
        <div className="text-sm text-muted-foreground mb-2">광고</div>
        <div className="gradient-gold-soft rounded-xl p-8 mb-4">
          <p className="text-lg font-semibold text-secondary-foreground">{msg.title}</p>
          <p className="text-sm text-muted-foreground mt-2">{msg.sub}</p>
        </div>
        {variant === "lotto" && !canClose && (
          <div className="w-full bg-muted rounded-full h-1.5 mb-4">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className="h-full gradient-gold rounded-full"
            />
          </div>
        )}
        <button
          onClick={canClose ? onClose : undefined}
          disabled={!canClose}
          className={`w-full py-3 rounded-xl font-medium text-sm ${
            canClose
              ? "bg-muted text-foreground"
              : "bg-muted/50 text-muted-foreground"
          }`}
        >
          {canClose ? "닫기" : `${countdown}초 후 닫기`}
        </button>
      </motion.div>
    </motion.div>
  );
};

// Hook for managing tab-switch interstitials
export function useTabSwitchAd() {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showAd, setShowAd] = useState(false);

  const onTabSwitch = useCallback(() => {
    setTabSwitchCount((prev) => {
      const next = prev + 1;
      // Show ad every 5th tab switch
      if (next % 5 === 0) {
        setShowAd(true);
      }
      return next;
    });
  }, []);

  const closeAd = useCallback(() => setShowAd(false), []);

  return { showAd, onTabSwitch, closeAd };
}

export default InterstitialAd;
