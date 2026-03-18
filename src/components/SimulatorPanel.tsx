import { useState } from "react";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SimulatorPanelProps {
  currentPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  remainingClasses: number;
}

export default function SimulatorPanel({ 
  currentPercentage, 
  totalClasses, 
  attendedClasses, 
  remainingClasses 
}: SimulatorPanelProps) {
  const [skipCount, setSkipCount] = useState<number>(0);
  const [attendCount, setAttendCount] = useState<number>(0);

  const simulatedClasses = skipCount + attendCount;
  const newAttended = attendedClasses + attendCount;
  const newTotal = totalClasses + simulatedClasses;
  const newPercentage = newTotal > 0 ? (newAttended / newTotal) * 100 : 0;
  const percentageChange = newPercentage - currentPercentage;

  const handleReset = () => {
    setSkipCount(0);
    setAttendCount(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skip Simulator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Skip Next Classes</label>
            <span className="text-2xl font-bold text-red-600">{skipCount}</span>
          </div>
          <Slider
            value={[skipCount]}
            onValueChange={(v) => setSkipCount(v[0])}
            max={Math.min(10, remainingClasses)}
            step={1}
            className="w-full"
          />
          <div className="flex gap-2">
            {[1, 2, 3, 5].map(n => (
              <Button
                key={n}
                variant="outline"
                size="sm"
                onClick={() => setSkipCount(n)}
                className={`flex-1 ${skipCount === n ? "bg-red-100 border-red-300 text-red-700" : ""}`}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>

        {/* Attend Simulator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Attend Next Classes</label>
            <span className="text-2xl font-bold text-green-600">{attendCount}</span>
          </div>
          <Slider
            value={[attendCount]}
            onValueChange={(v) => setAttendCount(v[0])}
            max={Math.min(10, remainingClasses)}
            step={1}
            className="w-full"
          />
          <div className="flex gap-2">
            {[1, 2, 3, 5].map(n => (
              <Button
                key={n}
                variant="outline"
                size="sm"
                onClick={() => setAttendCount(n)}
                className={`flex-1 ${attendCount === n ? "bg-green-100 border-green-300 text-green-700" : ""}`}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {simulatedClasses > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Projected Attendance</span>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-800">{newPercentage.toFixed(1)}%</p>
              <p className="text-sm text-slate-500">
                {newTotal} total classes • {newAttended} attended
              </p>
            </div>
            <div className={`flex items-center gap-2 ${percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {percentageChange >= 0 ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
              <span className="text-xl font-bold">
                {percentageChange >= 0 ? "+" : ""}{percentageChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              {percentageChange >= 0 
                ? "✨ Great! This improves your attendance."
                : percentageChange >= -2
                ? "⚠️ Small drop. Be careful with more skips."
                : "🚨 Significant drop! Consider attending more classes."
              }
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}