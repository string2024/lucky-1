import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@toss/tds-mobile";
import { requestPurchase, IAP_SKUS, isIapSupported } from "@/lib/iap";

interface PremiumPaywallProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PremiumPaywall = ({ onSuccess, onClose }: PremiumPaywallProps) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    if (!isIapSupported()) return;
    setLoading(true);
    requestPurchase({
      sku: IAP_SKUS.PREMIUM_PASS,
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
          <div className="text-4xl mb-2">✨</div>
          <h2 className="text-xl font-extrabold text-foreground mb-1">프리미엄 패스</h2>
          <p className="text-sm text-muted-foreground">광고 없이 자유롭게 이용하기</p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            "배너 광고 영구 제거",
            "전면 광고 영구 제거",
            "보너스 번호 무제한",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">✓</div>
              <span className="text-sm font-medium text-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-xs text-muted-foreground line-through mb-0.5">9,900원</p>
          <p className="text-2xl font-extrabold text-primary">3,300원</p>
          <p className="text-xs text-muted-foreground">1회 결제, 영구 이용</p>
        </div>

        <Button
          size="lg"
          onClick={handlePurchase}
          disabled={loading || !isIapSupported()}
          style={{ width: "100%" }}
        >
          {loading ? "처리 중..." : "프리미엄 패스 구매하기"}
        </Button>

        <button onClick={onClose} className="w-full mt-3 text-sm text-muted-foreground py-2">
          나중에 하기
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PremiumPaywall;
