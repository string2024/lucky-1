import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FortunePage from "@/components/FortunePage";
import LottoPage from "@/components/LottoPage";
import AttendancePage from "@/components/AttendancePage";
import SavedPage from "@/components/SavedPage";
import SplashScreen from "@/components/SplashScreen";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";
import InterstitialAd, { useTabSwitchAd } from "@/components/InterstitialAd";

type Tab = "fortune" | "lotto" | "attendance" | "saved";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("fortune");
  const { showAd: showTabAd, onTabSwitch, closeAd: closeTabAd } = useTabSwitchAd();

  const handleSplashDone = () => {
    setShowSplash(false);
    setShowInterstitial(true);
  };

  const handleInterstitialClose = () => {
    setShowInterstitial(false);
  };

  const handleTabChange = (tab: Tab) => {
    if (tab !== activeTab) {
      onTabSwitch();
      setActiveTab(tab);
    }
  };

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Initial Interstitial Ad */}
      <AnimatePresence>
        {showInterstitial && (
          <InterstitialAd onClose={handleInterstitialClose} />
        )}
      </AnimatePresence>

      {/* Tab Switch Interstitial Ad */}
      <AnimatePresence>
        {showTabAd && (
          <InterstitialAd onClose={closeTabAd} />
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
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
