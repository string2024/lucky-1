import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkIn, getAttendanceInfo, BADGES, getFreeBonusCount } from "@/lib/attendance";
import { toast } from "sonner";
import { Check, Gift, Trophy } from "lucide-react";

const REWARDS = [
  "🍀 행운 부적",
  "⭐ 럭키 스타",
  "💎 행운의 보석",
  "🎯 적중 부스터",
  "🏆 황금 트로피",
  "🎪 매직 티켓",
  "🎁 무료 보너스!",
];

const AttendancePage = () => {
  const [info, setInfo] = useState(getAttendanceInfo());
  const [justChecked, setJustChecked] = useState(false);
  const [freeBonusCount, setFreeBonusCount] = useState(getFreeBonusCount());

  useEffect(() => {
    setInfo(getAttendanceInfo());
    setFreeBonusCount(getFreeBonusCount());
  }, []);

  const handleCheckIn = () => {
    const result = checkIn();
    if (result.alreadyChecked) {
      toast("이미 오늘 출석했어요! ✅");
      return;
    }
    setJustChecked(true);
    setInfo(getAttendanceInfo());
    setFreeBonusCount(getFreeBonusCount());

    if (result.rewardGranted) {
      toast.success("🎁 7일 연속 출석 달성! 무료 보너스 번호 1세트 획득!");
    } else {
      const reward = REWARDS[Math.min(result.streak - 1, REWARDS.length - 1)];
      toast.success(`${result.streak}일 연속 출석! ${reward} 획득!`);
    }

    if (result.newBadges && result.newBadges.length > 0) {
      setTimeout(() => {
        result.newBadges!.forEach((badge) => {
          toast.success(`🏅 새 뱃지 획득: ${badge}`);
        });
      }, 1000);
    }
  };

  const streakDays = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">출석 체크</h1>
      <p className="text-sm text-muted-foreground mb-5">매일 접속하고 보상을 받으세요</p>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-gold rounded-2xl p-5 mb-5 text-center"
      >
        <p className="text-primary-foreground/80 text-sm mb-1">연속 출석</p>
        <p className="text-5xl font-extrabold text-primary-foreground">{info.streak}</p>
        <p className="text-primary-foreground/80 text-sm mt-1">일</p>
      </motion.div>

      {/* Free bonus token indicator */}
      {freeBonusCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-primary/30 rounded-2xl p-4 mb-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
            <Gift size={18} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">무료 보너스 번호 {freeBonusCount}개</p>
            <p className="text-xs text-muted-foreground">번호 페이지에서 광고 없이 사용 가능!</p>
          </div>
        </motion.div>
      )}

      {/* 7-day grid */}
      <div className="bg-card rounded-2xl p-5 mb-5">
        <p className="font-semibold text-foreground mb-3">7일 연속 출석 보상</p>
        <div className="grid grid-cols-7 gap-2">
          {streakDays.map((day) => {
            const completed = day <= (info.streak % 7 || (info.streak >= 7 ? 7 : 0));
            const isRewardDay = day === 7;
            return (
              <div key={day} className="text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 text-xs font-semibold ${
                    completed
                      ? "gradient-gold text-primary-foreground"
                      : isRewardDay
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {completed ? <Check size={14} /> : isRewardDay ? "🎁" : day}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {isRewardDay ? "보상" : REWARDS[day - 1]?.slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {info.earnedBadges.length > 0 && (
        <div className="bg-card rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-primary" />
            <p className="font-semibold text-foreground">획득한 뱃지</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {info.earnedBadges.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-xl mb-1">
                  {badge.icon}
                </div>
                <span className="text-[10px] text-muted-foreground">{badge.name}</span>
              </div>
            ))}
          </div>
          {/* Show next badge */}
          {BADGES.filter(b => !info.badges.includes(b.name)).length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                다음 뱃지: {BADGES.find(b => !info.badges.includes(b.name))?.icon}{" "}
                {BADGES.find(b => !info.badges.includes(b.name))?.name} (
                {BADGES.find(b => !info.badges.includes(b.name))?.requirement}일 출석)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Unlocked badges preview for new users */}
      {info.earnedBadges.length === 0 && (
        <div className="bg-card rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-muted-foreground" />
            <p className="font-semibold text-foreground">뱃지 컬렉션</p>
          </div>
          <div className="flex gap-3">
            {BADGES.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center opacity-40">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl mb-1">
                  {badge.icon}
                </div>
                <span className="text-[10px] text-muted-foreground">{badge.requirement}일</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCheckIn}
        disabled={info.checkedToday}
        className={`w-full py-4 rounded-xl font-bold text-lg ${
          info.checkedToday
            ? "bg-muted text-muted-foreground"
            : "gradient-gold text-primary-foreground"
        }`}
      >
        {info.checkedToday ? "✅ 오늘 출석 완료!" : "🍀 출석 체크하기"}
      </motion.button>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          총 {info.totalDays}일 출석 • 7일 연속 시 무료 보너스 번호!
        </p>
      </div>
    </div>
  );
};

export default AttendancePage;
