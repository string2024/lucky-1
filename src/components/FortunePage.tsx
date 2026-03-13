import { motion } from "framer-motion";
import { getTodayFortune, getTotalScore, getOverallMessage } from "@/lib/fortune";

const FortunePage = () => {
  const fortunes = getTodayFortune();
  const total = getTotalScore(fortunes);
  const overall = getOverallMessage(total);

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">오늘의 운세</h1>
      <p className="text-sm text-muted-foreground mb-5">
        {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
      </p>

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
    </div>
  );
};

export default FortunePage;
