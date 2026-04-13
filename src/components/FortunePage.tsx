import { motion } from "framer-motion";
import { getTodayFortune, getTotalScore, getOverallMessage } from "@/lib/fortune";
import { getAttendanceInfo } from "@/lib/attendance";
import { Ticket, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@toss/tds-mobile";

interface FortunePageProps {
  onNavigate?: (tab: "lotto" | "attendance") => void;
  isPremium?: boolean;
  onShowPremium?: () => void;
}

const FortunePage = ({ onNavigate, isPremium, onShowPremium }: FortunePageProps) => {
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
            <p className="text-[11px] text-muted-foreground">
              {attendance.streak > 0 ? `${attendance.streak}일 연속 중 — 끊지 마세요!` : "출석하고 보상 받기"}
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
          <span className="text-primary-foreground/80 text-sm font-medium">종합 운세</span>
          <span className="text-primary-foreground font-extrabold text-2xl">{total}/25</span>
        </div>
        <p className="text-primary-foreground font-semibold">{overall}</p>
        <p className="text-primary-foreground/60 text-xs mt-2">이 운세가 오늘의 행운 번호에 반영돼요 ✨</p>
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
