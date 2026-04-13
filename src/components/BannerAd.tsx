import { useEffect, useRef, useState } from "react";
import { TossAds } from "@apps-in-toss/web-framework";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

// 실 광고 ID (콘솔에서 발급받은 배너 광고 그룹 ID)
const AD_GROUP_ID = "ait.v2.live.cbe71145d9ae4ab3";

const BannerAd = () => {
  const { isPremium, loading } = usePremiumStatus();
  if (loading || isPremium) return null;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // SDK 초기화
  useEffect(() => {
    if (!TossAds.initialize.isSupported?.()) return;

    TossAds.initialize({
      callbacks: {
        onInitialized: () => setIsInitialized(true),
        onInitializationFailed: (error) => {
          console.error("배너 광고 SDK 초기화 실패:", error);
        },
      },
    });
  }, []);

  // 배너 부착
  useEffect(() => {
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
  }, [isInitialized]);

  return (
    <div className="fixed bottom-[88px] left-0 right-0 z-30">
      <div className="max-w-[480px] mx-auto">
        <div ref={containerRef} style={{ width: "100%", height: "96px" }} />
      </div>
    </div>
  );
};

export default BannerAd;
