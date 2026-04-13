import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { closeView } from "@apps-in-toss/web-framework";
import FortunePage from "@/components/FortunePage";
import LottoPage from "@/components/LottoPage";
import AttendancePage from "@/components/AttendancePage";
import SavedPage from "@/components/SavedPage";
import SplashScreen from "@/components/SplashScreen";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";
import InterstitialAd, { useTabSwitchAd } from "@/components/InterstitialAd";
import PremiumPaywall from "@/components/PremiumPaywall";
import { hasPremiumPass } from "@/lib/iapStorage";

type Tab = "fortune" | "lotto" | "attendance" | "saved";

// 광고 사전 고지 컴포넌트
const AdNotice = ({ onDone }: { onDone: () => void }) => {
  const stableDone = useCallback(onDone, [onDone]);
  useEffect(() => {
    const t = setTimeout(stableDone, 1800);
    return () => clearTimeout(t);
  }, [stableDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center pb-16"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl px-6 py-4 mx-4 shadow-2xl text-center"
      >
        <p className="text-sm font-semibold text-foreground mb-0.5">광고가 잠시 표시됩니다</p>
        <p className="text-xs text-muted-foreground">광고 시청 후 이용이 가능해요</p>
      </motion.div>
    </motion.div>
  );
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showSaveAdNotice, setShowSaveAdNotice] = useState(false);
  const [showPremiumPaywall, setShowPremiumPaywall] = useState(false);
  const [pendingSave, setPendingSave] = useState<(() => void) | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("fortune");
  const { showAd: showTabAd, showAdNotice: showTabAdNotice, onTabSwitch, closeAd: closeTabAd, onNoticeComplete } = useTabSwitchAd();

  // 뒤로가기(popstate) 시 메인 탭이면 closeView로 미니앱 종료
  useEffect(() => {
    // 초기 히스토리 엔트리 추가 (뒤로가기 감지용)
    window.history.pushState({ miniapp: true }, "");

    const handlePopState = () => {
      if (activeTab !== "fortune") {
        // 다른 탭에 있으면 메인(운세)탭으로 이동
        setActiveTab("fortune");
        window.history.pushState({ miniapp: true }, "");
      } else {
        // 메인 탭에서 뒤로가기 → 미니앱 종료
        closeView();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeTab]);

  const handleSplashDone = () => {
    setShowSplash(false);
  };

  // 저장 버튼 클릭 → 프리미엄이면 즉시 저장, 아니면 광고 플로우
  const handleSaveWithAd = async (saveFn: () => void) => {
    const premium = await hasPremiumPass();
    if (premium) {
      saveFn();
      return;
    }
    setPendingSave(() => saveFn);
    setShowSaveAdNotice(true);
  };

  const handleSaveAdNoticeDone = () => {
    setShowSaveAdNotice(false);
    setShowInterstitial(true);
  };

  const handleInterstitialClose = () => {
    setShowInterstitial(false);
    if (pendingSave) {
      pendingSave();
      setPendingSave(null);
    }
  };

  const handlePremiumSuccess = () => {
    setShowPremiumPaywall(false);
    // 대기 중인 저장 작업이 있으면 즉시 실행
    if (pendingSave) {
      pendingSave();
      setPendingSave(null);
    }
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
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* 저장 광고 사전 고지 */}
      <AnimatePresence>
        {showSaveAdNotice && (
          <AdNotice onDone={handleSaveAdNoticeDone} />
        )}
      </AnimatePresence>

      {/* Save Interstitial Ad */}
      <AnimatePresence>
        {showInterstitial && (
          <InterstitialAd onClose={handleInterstitialClose} />
        )}
      </AnimatePresence>

      {/* Premium Paywall */}
      <AnimatePresence>
        {showPremiumPaywall && (
          <PremiumPaywall
            onSuccess={handlePremiumSuccess}
            onClose={() => setShowPremiumPaywall(false)}
          />
        )}
      </AnimatePresence>

      {/* 탭 전환 광고 사전 고지 */}
      <AnimatePresence>
        {showTabAdNotice && (
          <AdNotice onDone={onNoticeComplete} />
        )}
      </AnimatePresence>

      {/* Tab Switch Interstitial Ad */}
      <AnimatePresence>
        {showTabAd && (
          <InterstitialAd onClose={closeTabAd} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "fortune" && (
            <motion.div key="fortune" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <FortunePage onNavigate={(tab) => setActiveTab(tab)} />
            </motion.div>
          )}
          {activeTab === "lotto" && (
            <motion.div key="lotto" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <LottoPage onSaveWithAd={handleSaveWithAd} />
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
