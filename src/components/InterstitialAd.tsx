import { useEffect, useCallback, useState } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-bridge";

// 테스트 ID (출시 직전 실제 ID로 교체: ait.v2.live.1baffae39b8e4cb0)
const AD_GROUP_ID = "ait-ad-test-interstitial-id";

interface InterstitialAdProps {
  onClose: () => void;
}

const InterstitialAd = ({ onClose }: InterstitialAdProps) => {
  useEffect(() => {
    if (!loadFullScreenAd.isSupported?.()) {
      // 토스 앱 환경이 아니면 즉시 닫기
      onClose();
      return;
    }

    loadFullScreenAd({
      options: { adGroupId: AD_GROUP_ID },
      onEvent: () => {
        // 광고 로드 완료 → 즉시 노출
        showFullScreenAd({
          options: { adGroupId: AD_GROUP_ID },
          onEvent: (event) => {
            if (event.type === "dismissed" || event.type === "failedToShow") {
              onClose();
            }
          },
          onError: () => onClose(),
        });
      },
      onError: () => onClose(),
    });
  }, [onClose]);

  // SDK가 네이티브로 렌더링하므로 null 반환
  return null;
};

// 탭 전환 시 전면광고 훅
export function useTabSwitchAd() {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showAdNotice, setShowAdNotice] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const onTabSwitch = useCallback(() => {
    setTabSwitchCount((prev) => {
      const next = prev + 1;
      // 5번 탭 전환마다 광고 노출 (사전 고지 먼저)
      if (next % 5 === 0) {
        setShowAdNotice(true);
      }
      return next;
    });
  }, []);

  const onNoticeComplete = useCallback(() => {
    setShowAdNotice(false);
    setShowAd(true);
  }, []);

  const closeAd = useCallback(() => setShowAd(false), []);

  return { showAd, showAdNotice, onTabSwitch, closeAd, onNoticeComplete };
}

export default InterstitialAd;
