import { useCallback, useEffect, useRef, useState } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";

// 실 광고 ID (콘솔에서 발급받은 보상형 광고 그룹 ID — 번호 보너스와 같은 그룹을 쓴다)
const REWARD_AD_ID = "ait.v2.live.6f0047c507dd40aa";

/**
 * 보상형 광고를 미리 불러 두고, 사용자가 누를 때만 보여 준다.
 * 보상은 userEarnedReward 이벤트에서만 지급한다(토스 앱 밖 미리보기는 예외).
 */
export function useRewardAd(onReward: () => void) {
  const [loaded, setLoaded] = useState(false);
  const [showing, setShowing] = useState(false);
  const [failed, setFailed] = useState(false);
  const unregisterRef = useRef<(() => void) | null>(null);
  const showUnregisterRef = useRef<(() => void) | null>(null);
  const showingRef = useRef(false);
  const mountedRef = useRef(true);
  const onRewardRef = useRef(onReward);
  onRewardRef.current = onReward;

  const supported = !!loadFullScreenAd.isSupported?.();

  const preload = useCallback(() => {
    if (!loadFullScreenAd.isSupported?.() || !mountedRef.current) return;
    unregisterRef.current?.();
    setLoaded(false);
    setFailed(false);
    unregisterRef.current = loadFullScreenAd({
      options: { adGroupId: REWARD_AD_ID },
      onEvent: (event) => {
        if (event.type === "loaded" && mountedRef.current) setLoaded(true);
      },
      onError: () => {
        if (!mountedRef.current) return;
        setLoaded(false);
        setFailed(true);
      },
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    preload();
    return () => {
      mountedRef.current = false;
      unregisterRef.current?.();
      showUnregisterRef.current?.();
    };
  }, [preload]);

  const finishShow = useCallback(() => {
    showingRef.current = false;
    if (!mountedRef.current) return;
    setShowing(false);
    preload();
  }, [preload]);

  const show = useCallback(() => {
    // 토스 앱 밖(미리보기)에서는 광고 없이 바로 보상한다
    if (!loadFullScreenAd.isSupported?.()) {
      onRewardRef.current();
      return;
    }
    // 광고를 못 불러왔으면 보상 없이 다시 불러온다
    if (failed) {
      preload();
      return;
    }
    if (!loaded || showingRef.current) return;
    showingRef.current = true;
    setShowing(true);
    showUnregisterRef.current = showFullScreenAd({
      options: { adGroupId: REWARD_AD_ID },
      onEvent: (event) => {
        if (event.type === "userEarnedReward") onRewardRef.current();
        if (event.type === "dismissed" || event.type === "failedToShow") finishShow();
      },
      onError: finishShow,
    });
  }, [loaded, failed, preload, finishShow]);

  return { show, ready: loaded || !supported, failed, showing };
}
