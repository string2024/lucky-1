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
import { isIapSupported, recoverPendingOrders } from "@/lib/iap";

type Tab = "fortune" | "lotto" | "attendance" | "saved";

// 광고 직전 업셀 컴포넌트 — 광고 보기 vs 프리미엄 선택
const AdUpsellNotice = ({
  onWatchAd,
  onPremium,
}: {
  onWatchAd: () => void;
  onPremium?: () => void;
}) => {
  const showPremiumOption = onPremium && isIapSupported();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-white rounded-t-3xl w-full px-6 pt-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {showPremiumOption ? (
          <>
            <p className="text-base font-extrabold text-foreground text-center mb-1">
              광고를 없애고 싶으신가요?
            </p>
            <p className="text-xs text-muted-foreground text-center mb-5">
              프리미엄 패스 한 번으로 모든 광고가 사라져요
            </p>
            <div className="space-y-2.5">
              <button
                onClick={onPremium}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
              >
                ✨ 프리미엄 패스 — 광고 영구 제거 (3,300원)
              </button>
              <button
                onClick={onWatchAd}
                className="w-full py-3 rounded-2xl bg-gray-100 text-gray-500 text-sm font-medium"
              >
                광고 보기
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-foreground text-center mb-0.5">
              광고가 잠시 표시돼요
            </p>
            <p className="text-xs text-muted-foreground text-center mb-4">
              광고 시청 후 이용이 가능해요
            </p>
            <button
              onClick={onWatchAd}
              className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 text-sm font-medium"
            >
              확인
            </button>
          </>
        )}
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
  const [isPremium, setIsPremium] = useState(false);
  const { showAd: showTabAd, showAdNotice: showTabAdNotice, onTabSwitch, closeAd: closeTabAd, onNoticeComplete } = useTabSwitchAd();

  useEffect(() => {
    hasPremiumPass().then(setIsPremium);
    // 결제 완료 전 앱 종료로 미지급된 주문 복구
    recoverPendingOrders().then(() => hasPremiumPass().then(setIsPremium));
  }, []);

  // 뒤로가기(popstate) 시 메인 탭이면 closeView로 미니앱 종료
  useEffect(() => {
    window.history.pushState({ miniapp: true }, "");

    const handlePopState = () => {
      if (activeTab !== "fortune") {
        setActiveTab("fortune");
        window.history.pushState({ miniapp: true }, "");
      } else {
        closeView();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeTab]);

  const handleSplashDone = () => setShowSplash(false);

  // 저장 버튼 클릭 → 프리미엄이면 즉시 저장, 아니면 광고 플로우
  const handleSaveWithAd = async (saveFn: () => void) => {
    const premium = await hasPremiumPass();
    if (premium) {
      setIsPremium(true);
      saveFn();
      return;
    }
    setPendingSave(() => saveFn);
    setShowSaveAdNotice(true);
  };

  // 저장 광고 직전 업셀 — "광고 보기" 선택
  const handleSaveAdNoticeDone = () => {
    setShowSaveAdNotice(false);
    setShowInterstitial(true);
  };

  // 저장 광고 직전 업셀 — "프리미엄" 선택
  const handleSaveAdNoticePremium = () => {
    setShowSaveAdNotice(false);
    setShowPremiumPaywall(true);
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
    setIsPremium(true);
    if (pendingSave) {
      pendingSave();
      setPendingSave(null);
    }
  };

  // 탭 전환 광고 직전 업셀 — "광고 보기" 선택
  const handleTabAdNoticeDone = () => {
    onNoticeComplete();
  };

  // 탭 전환 광고 직전 업셀 — "프리미엄" 선택
  const handleTabAdNoticePremium = () => {
    // 탭 전환 광고 취소 + 프리미엄 페이월 오픈
    closeTabAd();
    setShowPremiumPaywall(true);
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
      {/* 오버레이들 */}
      <AnimatePresence>
        {showSaveAdNotice && (
          <AdUpsellNotice
            onWatchAd={handleSaveAdNoticeDone}
            onPremium={!isPremium ? handleSaveAdNoticePremium : undefined}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInterstitial && (
          <InterstitialAd onClose={handleInterstitialClose} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPremiumPaywall && (
          <PremiumPaywall
            onSuccess={handlePremiumSuccess}
            onClose={() => setShowPremiumPaywall(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTabAdNotice && (
          <AdUpsellNotice
            onWatchAd={handleTabAdNoticeDone}
            onPremium={!isPremium ? handleTabAdNoticePremium : undefined}
          />
        )}
      </AnimatePresence>

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
              <FortunePage
                onNavigate={(tab) => setActiveTab(tab)}
                isPremium={isPremium}
                onShowPremium={() => setShowPremiumPaywall(true)}
              />
            </motion.div>
          )}
          {activeTab === "lotto" && (
            <motion.div key="lotto" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              <LottoPage
                onSaveWithAd={handleSaveWithAd}
                isPremium={isPremium}
                onShowPremium={() => setShowPremiumPaywall(true)}
              />
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
      <BannerAd isPremium={isPremium} />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
