import { motion } from "framer-motion";

interface AttendanceMeterProps {
  percentage: number;
}

export default function AttendanceMeter({ percentage }: AttendanceMeterProps) {
  const getColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 75) return "text-amber-600";
    return "text-red-600";
  };

  const getStrokeColor = () => {
    if (percentage >= 80) return "#16a34a";
    if (percentage >= 75) return "#d97706";
    return "#dc2626";
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="54"
            stroke="#e2e8f0"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="72"
            cy="72"
            r="54"
            stroke={getStrokeColor()}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-3">Current Attendance</p>
    </div>
  );
}