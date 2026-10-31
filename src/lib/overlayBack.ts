import { useEffect, useRef } from "react";

// 열려 있는 아래 창(바텀시트)을 시스템 뒤로가기로 닫기 위한 목록. 가장 나중에 열린 창부터 닫는다.
const closers: Array<() => void> = [];

export function closeTopOverlay(): boolean {
  const close = closers[closers.length - 1];
  if (!close) return false;
  close();
  return true;
}

/** 창이 떠 있는 동안 뒤로가기가 이 창을 닫도록 등록한다. */
export function useCloseOnBack(onClose: () => void) {
  const ref = useRef(onClose);
  ref.current = onClose;
  useEffect(() => {
    const closer = () => ref.current();
    closers.push(closer);
    return () => {
      const i = closers.lastIndexOf(closer);
      if (i >= 0) closers.splice(i, 1);
    };
  }, []);
}

/** 창을 아래로 쓸어내리면 닫히게 하는 framer-motion 속성 */
export const sheetDragProps = (onClose: () => void) =>
  ({
    drag: "y" as const,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: 0, bottom: 0.6 },
    onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (info.offset.y > 80 || info.velocity.y > 500) onClose();
    },
  });
