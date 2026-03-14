import { Star, Ticket, Calendar, Bookmark } from "lucide-react";

type Tab = "fortune" | "lotto" | "attendance" | "saved";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Star }[] = [
  { id: "fortune", label: "운세", icon: Star },
  { id: "lotto", label: "번호", icon: Ticket },
  { id: "attendance", label: "출석", icon: Calendar },
  { id: "saved", label: "저장", icon: Bookmark },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border safe-bottom z-40">
      <div className="max-w-[480px] mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all duration-200 ${
                isActive ? "text-amber-500" : "text-gray-400"
              }`}
            >
              <div className={`relative flex items-center justify-center transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </div>
              <span className={`text-[10px] transition-all ${isActive ? "font-bold" : "font-normal"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
