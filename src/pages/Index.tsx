import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FortunePage from "@/components/FortunePage";
import LottoPage from "@/components/LottoPage";
import AttendancePage from "@/components/AttendancePage";
import SavedPage from "@/components/SavedPage";
import SplashScreen from "@/components/SplashScreen";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";

type Tab = "fortune" | "lotto" | "attendance" | "saved";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("fortune");

  const handleSplashDone = () => {
    setShowSplash(false);
    setShowInterstitial(true);
  };

  const handleInterstitialClose = () => {
    setShowInterstitial(false);
  };

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Interstitial Ad */}
      <AnimatePresence>
        {showInterstitial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-2xl p-6 mx-6 text-center max-w-sm w-full"
            >
              <div className="text-sm text-muted-foreground mb-2">광고</div>
              <div className="gradient-gold-soft rounded-xl p-8 mb-4">
                <p className="text-lg font-semibold text-secondary-foreground">🍀 오늘의 행운을 확인하세요!</p>
                <p className="text-sm text-muted-foreground mt-2">가져봐 1등과 함께하는 행운</p>
              </div>
              <button
                onClick={handleInterstitialClose}
                className="w-full py-3 rounded-xl bg-muted text-foreground font-medium text-sm"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 pb-36">
        <AnimatePresence mode="wait">
          {activeTab === "fortune" && (
            <motion.div key="fortune" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <FortunePage />
            </motion.div>
          )}
          {activeTab === "lotto" && (
            <motion.div key="lotto" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <LottoPage />
            </motion.div>
          )}
          {activeTab === "attendance" && (
            <motion.div key="attendance" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <AttendancePage />
            </motion.div>
          )}
          {activeTab === "saved" && (
            <motion.div key="saved" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <SavedPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Banner Ad */}
      <BannerAd />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
