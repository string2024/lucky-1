const BannerAd = () => {
  return (
    <div className="fixed bottom-[52px] left-0 right-0 z-30 safe-bottom">
      <div className="max-w-[480px] mx-auto px-4 pb-1">
        <div className="bg-banner-bg rounded-lg h-[50px] flex items-center justify-center border border-border">
          <span className="text-xs text-muted-foreground">광고 영역</span>
        </div>
      </div>
    </div>
  );
};

export default BannerAd;
