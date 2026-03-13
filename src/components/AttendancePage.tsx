import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkIn, getAttendanceInfo } from "@/lib/attendance";
import { toast } from "sonner";
import { Check } from "lucide-react";

const REWARDS = [
  "🍀 행운 부적",
  "⭐ 럭키 스타",
  "💎 행운의 보석",
  "🎯 적중 부스터",
  "🏆 황금 트로피",
  "🎪 매직 티켓",
  "👑 로또 킹 칭호",
];

const AttendancePage = () => {
  const [info, setInfo] = useState(getAttendanceInfo());
  const [justChecked, setJustChecked] = useState(false);

  useEffect(() => {
    setInfo(getAttendanceInfo());
  }, []);

  const handleCheckIn = () => {
    const result = checkIn();
    if (result.alreadyChecked) {
      toast("이미 오늘 출석했어요! ✅");
      return;
    }
    setJustChecked(true);
    setInfo(getAttendanceInfo());
    const reward = REWARDS[Math.min(result.streak - 1, REWARDS.length - 1)];
    toast.success(`${result.streak}일 연속 출석! ${reward} 획득!`);
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

      {/* 7-day grid */}
      <div className="bg-card rounded-2xl p-5 mb-5">
        <p className="font-semibold text-foreground mb-3">7일 연속 출석 보상</p>
        <div className="grid grid-cols-7 gap-2">
          {streakDays.map((day) => {
            const completed = day <= info.streak;
            return (
              <div key={day} className="text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 text-xs font-semibold ${
                    completed
                      ? "gradient-gold text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {completed ? <Check size={14} /> : day}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {REWARDS[day - 1]?.slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

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
          총 {info.totalDays}일 출석 • 7일 연속 시 특별 보상!
        </p>
      </div>
    </div>
  );
};

export default AttendancePage;
