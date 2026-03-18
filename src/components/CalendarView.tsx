import { useState } from "react";
import { motion } from "framer-motion";

interface CalendarViewProps {
  weeklySchedule: { day: string; classes: number }[];
  bestSkipDay: string;
  currentPercentage: number;
}

export default function CalendarView({ weeklySchedule, bestSkipDay, currentPercentage }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const getDayStatus = (day: string, classes: number) => {
    if (classes === 0) return "holiday";
    if (day === bestSkipDay && currentPercentage >= 75) return "safe";
    if (currentPercentage < 75) return "mandatory";
    return "neutral";
  };

  const getDayStyles = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-100 border-green-400 text-green-800 hover:bg-green-200";
      case "mandatory":
        return "bg-red-100 border-red-400 text-red-800 hover:bg-red-200";
      case "holiday":
        return "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed";
      default:
        return "bg-white border-slate-300 text-slate-700 hover:bg-slate-50";
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {days.map((day) => {
          const schedule = weeklySchedule.find(s => s.day === day) || { classes: 0 };
          const status = getDayStatus(day, schedule.classes);
          const isSelected = selectedDay === day;

          return (
            <motion.button
              key={day}
              whileHover={{ scale: status !== "holiday" ? 1.05 : 1 }}
              whileTap={{ scale: status !== "holiday" ? 0.95 : 1 }}
              onClick={() => status !== "holiday" && setSelectedDay(isSelected ? null : day)}
              disabled={status === "holiday"}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${getDayStyles(status)}
                ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
              `}
            >
              <p className="font-semibold text-sm">{day}</p>
              <p className="text-2xl font-bold mt-1">{schedule.classes}</p>
              <p className="text-xs mt-1">classes</p>
              {status === "safe" && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Best
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>{selectedDay}</strong>: {weeklySchedule.find(s => s.day === selectedDay)?.classes} class(es) scheduled.
            {selectedDay === bestSkipDay && currentPercentage >= 75 && (
              <span className="ml-2">✨ This is the AI-recommended day to skip!</span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}