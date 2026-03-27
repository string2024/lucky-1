import { useEffect, useRef } from "react";
import { TossAds } from "@apps-in-toss/web-bridge";

// 테스트 ID (출시 직전 실제 ID로 교체: ait.v2.live.cbe71145d9ae4ab3)
const AD_GROUP_ID = "ait-ad-test-banner-id";

const BannerAd = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!TossAds.attachBanner.isSupported?.()) return;

    const result = TossAds.attachBanner(AD_GROUP_ID, containerRef.current);
    return () => {
      result?.destroy?.();
    };
  }, []);

  return (
    <div className="fixed bottom-[88px] left-0 right-0 z-30">
      <div className="max-w-[480px] mx-auto">
        <div ref={containerRef} style={{ width: "100%", minHeight: "96px" }} />
      </div>
    </div>
  );
};

export default BannerAd;
