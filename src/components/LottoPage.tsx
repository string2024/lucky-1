import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayFortune, generateLottoNumbers, generateBonusNumbers, getNumberColor } from "@/lib/fortune";
import { saveNumbers, shareNumbers } from "@/lib/storage";
import { Share2, Download, Gift } from "lucide-react";
import { toast } from "sonner";

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

const LottoPage = () => {
  const fortunes = getTodayFortune();
  const mainNumbers = generateLottoNumbers(fortunes);
  const [bonusNumbers, setBonusNumbers] = useState<number[] | null>(null);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => setRevealed(true);

  const handleRewardAd = () => {
    setShowRewardAd(true);
    setTimeout(() => {
      setShowRewardAd(false);
      setBonusNumbers(generateBonusNumbers(fortunes));
      toast.success("보너스 번호가 생성되었어요!");
    }, 2000);
  };

  const handleSave = (numbers: number[], type: "main" | "bonus") => {
    const today = new Date().toLocaleDateString("ko-KR");
    saveNumbers({ numbers, date: today, type });
    toast.success("번호가 저장되었어요!");
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
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReveal}
            className="w-full py-4 gradient-gold rounded-xl text-primary-foreground font-bold text-lg"
          >
            🎱 번호 확인하기
          </motion.button>
        ) : (
          <>
            <div className="flex justify-center gap-2 mb-4">
              {mainNumbers.map((num, i) => (
                <LottoBall key={num} num={num} delay={i * 0.12} />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(mainNumbers, "main")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
              >
                <Download size={14} /> 저장
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
            <p className="text-xs text-muted-foreground mb-3">광고 시청 후 추가 번호 1세트를 받아보세요</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRewardAd}
              className="w-full py-3 gradient-gold rounded-xl text-primary-foreground font-bold text-sm"
            >
              🎬 광고 보고 번호 받기
            </motion.button>
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
              <Download size={14} /> 저장
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
