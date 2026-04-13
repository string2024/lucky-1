import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayFortune, generateLottoNumbers, generateBonusNumbers, getNumberColor } from "@/lib/fortune";
import { saveNumbers, shareNumbers } from "@/lib/storage";
import { getFreeBonusCount, useFreeBonusToken } from "@/lib/attendance";
import { Button } from "@toss/tds-mobile";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";
import BonusPackPaywall from "@/components/BonusPackPaywall";
import { getBonusTokenCount, useBonusToken } from "@/lib/iapStorage";
import { isIapSupported } from "@/lib/iap";

import { Share2, Download, Gift, Ticket } from "lucide-react";
import { toast } from "sonner";

// 실 광고 ID (콘솔에서 발급받은 보상형 광고 그룹 ID)
const REWARD_AD_ID = "ait.v2.live.6f0047c507dd40aa";

const LottoBall = ({ num, delay }: { num: number; delay: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 15 }}
    className="lotto-ball text-primary-foreground font-bold"
    style={{ backgroundColor: getNumberColor(num) }}
  >
    {num}
  </motion.div>
);

interface LottoPageProps {
  onSaveWithAd?: (saveFn: () => void) => void;
  isPremium?: boolean;
  onShowPremium?: () => void;
}

const LottoPage = ({ onSaveWithAd, isPremium = false, onShowPremium }: LottoPageProps) => {
  const fortunes = getTodayFortune();
  const mainNumbers = generateLottoNumbers(fortunes);
  const [bonusNumbers, setBonusNumbers] = useState<number[] | null>(null);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [showBonusPaywall, setShowBonusPaywall] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [freeBonusCount, setFreeBonusCount] = useState(getFreeBonusCount());
  const [iapBonusTokens, setIapBonusTokens] = useState(0);

  useEffect(() => {
    getBonusTokenCount().then(setIapBonusTokens);
  }, []);

  const handleReveal = () => setRevealed(true);

  const handleUseFreeBonus = () => {
    const used = useFreeBonusToken();
    if (used) {
      setFreeBonusCount(getFreeBonusCount());
      setBonusNumbers(generateBonusNumbers(fortunes));
      toast.success("🎁 무료 보너스 번호가 생성되었어요!");
    }
  };

  const handleRewardAd = () => {
    if (!loadFullScreenAd.isSupported?.()) {
      // 토스 앱 환경이 아닐 때 fallback
      setBonusNumbers(generateBonusNumbers(fortunes));
      toast.success("보너스 번호가 생성되었어요!");
      return;
    }

    setShowRewardAd(true);
    loadFullScreenAd({
      options: { adGroupId: REWARD_AD_ID },
      onEvent: () => {
        showFullScreenAd({
          options: { adGroupId: REWARD_AD_ID },
          onEvent: (event) => {
            if (event.type === "userEarnedReward") {
              setBonusNumbers(generateBonusNumbers(fortunes));
              toast.success("보너스 번호가 생성되었어요!");
            }
            if (event.type === "dismissed" || event.type === "failedToShow") {
              setShowRewardAd(false);
            }
          },
          onError: () => setShowRewardAd(false),
        });
      },
      onError: () => {
        setShowRewardAd(false);
        toast.error("광고를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
      },
    });
  };

  const handleSave = (numbers: number[], type: "main" | "bonus") => {
    const today = new Date().toLocaleDateString("ko-KR");
    const doSave = () => {
      saveNumbers({ numbers, date: today, type });
      toast.success("번호가 저장되었어요!");
    };
    if (onSaveWithAd) {
      onSaveWithAd(doSave);
    } else {
      doSave();
    }
  };

  const handleShare = async (numbers: number[]) => {
    const text = shareNumbers(numbers);
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("클립보드에 복사되었어요!");
      }
    } catch {
      await navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었어요!");
    }
  };

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">행운 번호</h1>
      <p className="text-sm text-muted-foreground mb-5">운세 기반 로또 번호 생성</p>

      {/* Main numbers */}
      <div className="bg-card rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-foreground">오늘의 번호</span>
          <span className="text-xs text-muted-foreground">운세 반영</span>
        </div>

        {!revealed ? (
          <Button
            size="xlarge"
            style={{ width: "100%" }}
            onClick={handleReveal}
          >
            🎱 번호 확인하기
          </Button>
        ) : (
          <>
            <div className="flex justify-center gap-2 mb-4">
              {mainNumbers.map((num, i) => (
                <LottoBall key={num} num={num} delay={i * 0.12} />
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleSave(mainNumbers, "main")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
              >
                <Download size={14} /> {isPremium ? "저장하기" : "광고 후 저장"}
              </button>
              <button
                onClick={() => handleShare(mainNumbers)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
              >
                <Share2 size={14} /> 공유
              </button>
            </div>
          </>
        )}
      </div>

      {/* Native Ad after number reveal */}
      {revealed && (
        <div className="bg-card rounded-2xl p-4 mb-4 border border-border">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">AD</span>
          </div>
          <div className="gradient-gold-soft rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-secondary-foreground">🍀 행운을 나누면 두 배!</p>
            <p className="text-xs text-muted-foreground mt-1">친구에게 공유하고 함께 당첨되세요</p>
          </div>
        </div>
      )}

      {/* Bonus Numbers */}
      {revealed && !bonusNumbers && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 mb-4"
        >
          <div className="text-center">
            <Gift className="mx-auto mb-2 text-primary" size={28} />
            <p className="font-semibold text-foreground mb-1">보너스 번호 받기</p>

            {isPremium ? (
              <>
                <p className="text-xs text-primary mb-3">✨ 프리미엄 — 보너스 번호 무제한</p>
                <Button size="large" style={{ width: "100%" }} onClick={() => setBonusNumbers(generateBonusNumbers(fortunes))}>
                  🎱 보너스 번호 받기
                </Button>
              </>
            ) : iapBonusTokens > 0 ? (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  <Ticket size={12} className="inline mr-1" />
                  이용권 {iapBonusTokens}개 보유 중
                </p>
                <Button size="large" style={{ width: "100%" }} onClick={async () => {
                  const ok = await useBonusToken();
                  if (ok) {
                    setIapBonusTokens(await getBonusTokenCount());
                    setBonusNumbers(generateBonusNumbers(fortunes));
                    toast.success("이용권을 사용했어요!");
                  }
                }}>
                  🎟 이용권으로 번호 받기
                </Button>
              </>
            ) : freeBonusCount > 0 ? (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  <Ticket size={12} className="inline mr-1" />
                  무료 이용권 {freeBonusCount}개 보유 중!
                </p>
                <Button size="large" style={{ width: "100%" }} onClick={handleUseFreeBonus}>
                  🎁 무료로 번호 받기
                </Button>
              </>
            ) : (
              <div className="space-y-2 w-full">
                <p className="text-xs text-muted-foreground mb-2">광고 시청 또는 이용권 구매</p>
                <Button size="large" style={{ width: "100%" }} onClick={handleRewardAd}>
                  🎬 광고 보고 번호 받기
                </Button>
                {isIapSupported() && (
                  <Button size="large" variant="secondary" style={{ width: "100%" }} onClick={() => setShowBonusPaywall(true)}>
                    🎟 이용권 구매 (990원)
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {bonusNumbers && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-foreground">보너스 번호</span>
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">추가</span>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {bonusNumbers.map((num, i) => (
              <LottoBall key={num} num={num} delay={i * 0.12} />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(bonusNumbers, "bonus")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
            >
              <Download size={14} /> {isPremium ? "저장하기" : "광고 후 저장"}
            </button>
            <button
              onClick={() => handleShare(bonusNumbers)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
            >
              <Share2 size={14} /> 공유
            </button>
          </div>
        </motion.div>
      )}

      {/* Bonus Pack Paywall */}
      <AnimatePresence>
        {showBonusPaywall && (
          <BonusPackPaywall
            onSuccess={async () => {
              setShowBonusPaywall(false);
              setIapBonusTokens(await getBonusTokenCount());
              toast.success("이용권 5개가 충전됐어요!");
            }}
            onWatchAd={() => {
              setShowBonusPaywall(false);
              handleRewardAd();
            }}
            onClose={() => setShowBonusPaywall(false)}
          />
        )}
      </AnimatePresence>

      {/* Premium nudge — only for non-premium users */}
      {!isPremium && onShowPremium && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onShowPremium}
          className="w-full mt-2 mb-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium"
        >
          ✨ 프리미엄 패스로 광고 없이 이용하기
        </motion.button>
      )}

      <div className="h-4" />

      {/* Reward Ad Modal */}
      <AnimatePresence>
        {showRewardAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-card rounded-2xl p-8 mx-6 text-center"
            >
              <div className="text-4xl mb-3">📺</div>
              <p className="font-semibold text-foreground mb-2">광고 시청 중...</p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full gradient-gold rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
};

export default LottoPage;
