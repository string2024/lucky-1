// TODO: 광고 ID 수령 후 토스 인앱광고 SDK(@apps-in-toss/web-framework Ad API)로 교체 예정
const BannerAd = () => {
  return (
    <div className="fixed bottom-[52px] left-0 right-0 z-30">
      <div className="max-w-[480px] mx-auto px-3 pb-1">
        <div
          className="rounded-xl h-[52px] flex items-center justify-between px-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #fff8e1, #fff3cd)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🍀</span>
            <div>
              <p className="text-xs font-semibold text-amber-800">오늘의 행운을 나눠보세요!</p>
              <p className="text-[10px] text-amber-600">친구에게 공유하면 복이 두 배</p>
            </div>
          </div>
          <span className="text-[9px] text-amber-400 border border-amber-300 rounded px-1 py-0.5">AD</span>
        </div>
      </div>
    </div>
  );
};

export default BannerAd;
