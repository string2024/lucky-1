import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSavedNumbers, deleteNumbers, shareNumbers, type SavedNumbers as SavedEntry } from "@/lib/storage";
import { getNumberColor } from "@/lib/fortune";
import { Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";

const SavedPage = () => {
  const [saved, setSaved] = useState<SavedEntry[]>([]);

  useEffect(() => {
    setSaved(getSavedNumbers());
  }, []);

  const handleDelete = (id: string) => {
    deleteNumbers(id);
    setSaved(getSavedNumbers());
    toast("번호가 삭제되었어요");
  };

  const handleShare = async (numbers: number[]) => {
    const text = shareNumbers(numbers);
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("클립보드에 복사되었어요!");
      }
    } catch {
      await navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었어요!");
    }
  };

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">저장된 번호</h1>
      <p className="text-sm text-muted-foreground mb-5">내가 저장한 행운의 번호</p>

      {saved.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-4xl mb-3">📋</p>
          <p className="text-muted-foreground text-sm">아직 저장된 번호가 없어요</p>
          <p className="text-muted-foreground text-xs mt-1">번호 탭에서 번호를 저장해보세요</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {saved.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  {entry.type === "bonus" && (
                    <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">보너스</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleShare(entry.numbers)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted">
                    <Share2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                {entry.numbers.map((num) => (
                  <div
                    key={num}
                    className="lotto-ball text-primary-foreground text-xs"
                    style={{ backgroundColor: getNumberColor(num), width: 36, height: 36 }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
