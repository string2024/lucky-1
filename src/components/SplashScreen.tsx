import { motion } from "framer-motion";
import { useEffect } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 5.5) % 90}%`,
  top: `${5 + (i * 7.3) % 85}%`,
  delay: (i * 0.15) % 2,
  duration: 1.5 + (i % 3) * 0.5,
}));

const SplashScreen = ({ onDone }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden bg-[#1a1a2e]">
      {/* 배경 별 파티클 */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-yellow-300"
          style={{ left: p.left, top: p.top }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.delay + 0.5,
          }}
        />
      ))}

      {/* 빛 퍼짐 배경 */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "280px",
          height: "280px",
          background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      {/* 메인 별 로고 */}
      <motion.div
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="text-8xl mb-6 relative z-10"
      >
        ⭐
      </motion.div>

      {/* 앱 이름 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-3xl font-extrabold text-white tracking-tight mb-2 relative z-10"
      >
        가져봐 1등
      </motion.h1>

      {/* 서브타이틀 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-yellow-300/80 text-sm font-medium relative z-10"
      >
        오늘의 운세로 행운 번호를 받아보세요
      </motion.p>

      {/* 로딩 바 */}
      <motion.div
        className="absolute bottom-16 w-36 h-0.5 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 1.6, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

export default SplashScreen;
