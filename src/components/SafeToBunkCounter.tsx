import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface SafeToBunkCounterProps {
  safeToSkip: number;
  riskLevel: "safe" | "warning" | "critical";
}

export default function SafeToBunkCounter({ safeToSkip, riskLevel }: SafeToBunkCounterProps) {
  const getBgColor = () => {
    if (riskLevel === "safe") return "bg-green-100 border-green-300";
    if (riskLevel === "warning") return "bg-amber-100 border-amber-300";
    return "bg-red-100 border-red-300";
  };

  const getTextColor = () => {
    if (riskLevel === "safe") return "text-green-700";
    if (riskLevel === "warning") return "text-amber-700";
    return "text-red-700";
  };

  const getIcon = () => {
    return safeToSkip >= 0 ? <Plus className="w-6 h-6" /> : <Minus className="w-6 h-6" />;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-24 h-24 rounded-full border-4 ${getBgColor()} flex items-center justify-center ${getTextColor()}`}
      >
        <div className="flex items-center gap-1">
          {getIcon()}
          <span className="text-3xl font-bold">{Math.abs(safeToSkip)}</span>
        </div>
      </motion.div>
      <p className="text-sm text-slate-600 mt-3 text-center">
        {safeToSkip >= 0 ? "Safe to Skip" : "Must Attend"}
      </p>
      <p className="text-xs text-slate-500">
        {safeToSkip >= 0 ? `${safeToSkip} classes` : `${Math.abs(safeToSkip)} extra classes`}
      </p>
    </div>
  );
}