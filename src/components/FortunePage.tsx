import { motion } from "framer-motion";
import { useState } from "react";
import { getTodayFortune, getTotalScore, getOverallMessage, getLuckyTip } from "@/lib/fortune";
import { getAttendanceInfo, daysToNextReward } from "@/lib/attendance";
import { useRewardAd } from "@/hooks/useRewardAd";
import { shareMessage, fortuneMessage } from "@/lib/share";
import { toast } from "sonner";
import { Ticket, Calendar, ArrowRight, Lock, Share2 } from "lucide-react";
import { Button } from "@toss/tds-mobile";

interface FortunePageProps {
  onNavigate?: (tab: "lotto" | "attendance") => void;
  isPremium?: boolean;
  onShowPremium?: () => void;
}

const TIP_KEY = "gajyeobwa_tip_unlocked";

// 한국 시간(기기 시간) 기준 오늘 날짜
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const isTipUnlockedToday = (): boolean => {
  try {
    return localStorage.getItem(TIP_KEY) === todayStr();
  } catch {
    return false;
  }
};

const FortunePage = ({ onNavigate, isPremium, onShowPremium }: FortunePageProps) => {
  const [tipUnlocked, setTipUnlocked] = useState(isTipUnlockedToday());
  const tip = getLuckyTip();
  const { show: showTipAd, ready: tipAdReady, failed: tipAdFailed, showing: tipAdShowing } = useRewardAd(() => {
    try {
      localStorage.setItem(TIP_KEY, todayStr());
    } catch {
      // 저장에 실패해도 오늘은 열어 준다
    }
    setTipUnlocked(true);
  });
  const tipOpen = tipUnlocked || !!isPremium;

  const handleShare = async () => {
    const result = await shareMessage(fortuneMessage(total));
    if (result === "copied") toast.success("클립보드에 복사되었어요!");
    if (result === "failed") toast.error("공유하지 못했어요. 잠시 후 다시 시도해주세요.");
  };

  const fortunes = getTodayFortune();
  const total = getTotalScore(fortunes);
  const overall = getOverallMessage(total);
  const attendance = getAttendanceInfo();

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">오늘의 운세</h1>
      <p className="text-sm text-muted-foreground mb-5">
        {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      {/* Attendance nudge */}
      {!attendance.checkedToday && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onNavigate?.("attendance")}
          className="w-full flex items-center gap-3 bg-card border border-primary/20 rounded-xl p-3 mb-4"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar size={16} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">오늘 출석 안 했어요!</p>
            <p className="text-xs text-muted-foreground">
              {attendance.streak > 0
                ? `${attendance.streak}일 연속 중 — ${daysToNextReward(attendance.streak)}일 더 하면 무료 보너스!`
                : "출석하고 보상 받기"}
            </p>
          </div>
          <ArrowRight size={14} className="text-muted-foreground" />
        </motion.button>
      )}

      {/* Overall */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-gold rounded-2xl p-5 mb-5"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[hsl(var(--gold-foreground))] text-sm font-medium">종합 운세</span>
          <span className="text-[hsl(var(--gold-foreground))] font-extrabold text-2xl">{total}/25</span>
        </div>
        <p className="text-[hsl(var(--gold-foreground))] font-semibold">{overall}</p>
        <p className="text-[hsl(var(--gold-foreground))] text-xs mt-2">이 운세가 오늘의 행운 번호에 반영돼요 ✨</p>
      </motion.div>

      {/* Categories */}
      <div className="space-y-3">
        {fortunes.map((fortune, i) => (
          <motion.div
            key={fortune.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{fortune.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">{fortune.name}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`w-2 h-2 rounded-full ${
                        s <= fortune.score ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">{fortune.message}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 오늘의 행운 팁 — 광고를 보면 열린다 */}
      <div className="bg-card rounded-xl p-4 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm text-foreground">🔮 오늘의 행운 팁</span>
          {!tipOpen && <Lock size={14} className="text-muted-foreground" />}
        </div>
        {tipOpen ? (
          <div className="grid grid-cols-2 gap-2 text-xs text-foreground">
            <p>🎨 행운의 색 <b>{tip.color}</b></p>
            <p>🧭 행운의 방향 <b>{tip.direction}</b></p>
            <p>⏰ 좋은 시간 <b>{tip.time}</b></p>
            <p>🔢 행운의 숫자 <b>{tip.number}</b></p>
          </div>
        ) : (
          <button
            onClick={showTipAd}
            disabled={tipAdShowing || (!tipAdReady && !tipAdFailed)}
            className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold disabled:opacity-60"
          >
            {tipAdFailed ? "광고를 불러오지 못했어요. 다시 시도" : tipAdReady ? "광고 보고 오늘의 행운 팁 열기" : "광고 불러오는 중..."}
          </button>
        )}
      </div>

      {/* CTA: Go to Lotto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-5"
      >
        <Button
          size="xlarge"
          style={{ width: "100%" }}
          onClick={() => onNavigate?.("lotto")}
        >
          🎱 이 운세로 행운 번호 뽑기
        </Button>
      </motion.div>

      <button
        onClick={handleShare}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground"
      >
        <Share2 size={14} /> 친구에게 오늘 운세 공유하기
      </button>

      {/* Premium nudge — only for non-premium */}
      {!isPremium && onShowPremium && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onShowPremium}
          className="w-full mt-3 mb-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium"
        >
          ✨ 프리미엄 패스로 광고 없이 이용하기
        </motion.button>
      )}

      <div className="h-4" />
    </div>
  );
};

export default FortunePage;
