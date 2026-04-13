import { useEffect, useRef, useState } from "react";
import { TossAds } from "@apps-in-toss/web-framework";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

const AD_GROUP_ID = "ait.v2.live.cbe71145d9ae4ab3";

const BannerAd = () => {
  const { isPremium, loading } = usePremiumStatus();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // SDK 초기화
  useEffect(() => {
    if (loading || isPremium) return;
    if (!TossAds.initialize.isSupported?.()) return;

    TossAds.initialize({
      callbacks: {
        onInitialized: () => setIsInitialized(true),
        onInitializationFailed: (error) => {
          console.error("배너 광고 SDK 초기화 실패:", error);
        },
      },
    });
  }, [loading, isPremium]);

  // 배너 부착
  useEffect(() => {
    if (loading || isPremium) return;
    if (!isInitialized || !containerRef.current) return;
    if (!TossAds.attachBanner.isSupported?.()) return;

    const result = TossAds.attachBanner(AD_GROUP_ID, containerRef.current, {
      theme: "auto",
      tone: "blackAndWhite",
      variant: "expanded",
      callbacks: {
        onAdFailedToRender: (payload) => {
          console.error("배너 광고 렌더링 실패:", payload.error.message);
        },
        onNoFill: () => {
          console.warn("표시할 배너 광고가 없습니다.");
        },
      },
    });

    return () => {
      result?.destroy();
    };
  }, [isInitialized, loading, isPremium]);

  if (loading || isPremium) return null;

  return (
    <div
      className="fixed left-0 right-0 z-30"
      style={{ bottom: 'calc(max(20px, env(safe-area-inset-bottom, 0px) + 8px) + 76px)' }}
    >
      <div className="max-w-[480px] mx-auto">
        <div ref={containerRef} style={{ width: "100%", height: "96px" }} />
      </div>
    </div>
  );
};

export default BannerAd;
