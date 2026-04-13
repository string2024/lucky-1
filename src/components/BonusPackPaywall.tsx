import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@toss/tds-mobile";
import { requestPurchase, IAP_SKUS, isIapSupported } from "@/lib/iap";

interface BonusPackPaywallProps {
  onSuccess: () => void;
  onWatchAd: () => void;
  onClose: () => void;
}

const BonusPackPaywall = ({ onSuccess, onWatchAd, onClose }: BonusPackPaywallProps) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    if (!isIapSupported()) return;
    setLoading(true);
    requestPurchase({
      sku: IAP_SKUS.BONUS_5PACK,
      onSuccess: () => {
        setLoading(false);
        onSuccess();
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-white rounded-t-3xl w-full px-6 pt-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎱</div>
          <h2 className="text-xl font-extrabold text-foreground mb-1">보너스 번호 이용권</h2>
          <p className="text-sm text-muted-foreground">광고 없이 즉시 번호 받기</p>
        </div>

        <div className="bg-primary/5 rounded-2xl p-4 text-center mb-6">
          <p className="text-3xl font-extrabold text-primary mb-1">5회</p>
          <p className="text-sm text-muted-foreground">보너스 번호 즉시 생성권</p>
          <p className="text-lg font-bold text-foreground mt-2">990원</p>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={handlePurchase}
            disabled={loading || !isIapSupported()}
            style={{ width: "100%" }}
          >
            {loading ? "처리 중..." : "이용권 구매하기 (990원)"}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={onWatchAd}
            style={{ width: "100%" }}
          >
            광고 보고 무료로 받기
          </Button>
        </div>

        <button onClick={onClose} className="w-full mt-3 text-sm text-muted-foreground py-2">
          닫기
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BonusPackPaywall;
