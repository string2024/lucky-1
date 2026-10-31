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
    <nav
      className="mx-3 mt-1 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100"
      style={{ marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
    >
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-all duration-200 ${
                isActive ? "text-amber-500" : "text-gray-500"
              }`}
            >
              <div className={`relative flex items-center justify-center transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </div>
              <span className={`text-xs transition-all ${isActive ? "font-bold" : "font-normal"}`}>
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
