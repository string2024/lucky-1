import { useEffect, useRef, useState } from "react";
import { TossAds } from "@apps-in-toss/web-framework";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

const LIVE_AD_GROUP_ID = "ait.v2.live.cbe71145d9ae4ab3";
// 콘솔 QR 테스트 주소(*.private-*)에서는 공식 테스트 배너 ID를 쓴다. 출시 주소에서는 실제 ID를 쓴다.
const TEST_AD_GROUP_ID = "ait-ad-test-banner-id";
const isQrTestEnv = () => typeof window !== "undefined" && /\.private-/.test(window.location.hostname);
const AD_GROUP_ID = isQrTestEnv() ? TEST_AD_GROUP_ID : LIVE_AD_GROUP_ID;

interface BannerAdProps {
  isPremium?: boolean;
}

const BannerAd = ({ isPremium: isPremiumProp }: BannerAdProps) => {
  const { isPremium: isPremiumStored, loading } = usePremiumStatus();
  const isPremium = isPremiumProp ?? isPremiumStored;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  // 보여 줄 광고가 없거나 그리지 못하면 빈 회색 띠가 남지 않게 자리를 접는다
  const [collapsed, setCollapsed] = useState(false);

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
          setCollapsed(true);
        },
        onNoFill: () => {
          console.warn("표시할 배너 광고가 없습니다.");
          setCollapsed(true);
        },
      },
    });

    return () => { result?.destroy(); };
  }, [isInitialized, loading, isPremium]);

  if (loading || isPremium || collapsed) return null;

  return (
    <div className="w-full shrink-0 bg-background" style={{ height: "102px" }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default BannerAd;
