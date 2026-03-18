import { generateWeeklySchedule } from "./attendanceCalculator";

export function findBestSkipDay(weeklySchedule: { day: string; classes: number }[]): string {
  // Find the day with the fewest classes (but at least 1)
  const validDays = weeklySchedule.filter(d => d.classes > 0);
  
  if (validDays.length === 0) return "None";
  
  // Sort by number of classes, then by day preference (Wed > Tue > Thu > Mon > Fri)
  const dayPreference: Record<string, number> = { "Wed": 5, "Tue": 4, "Thu": 3, "Mon": 2, "Fri": 1 };
  
  validDays.sort((a, b) => {
    if (a.classes !== b.classes) {
      return a.classes - b.classes;
    }
    return (dayPreference[b.day] || 0) - (dayPreference[a.day] || 0);
  });
  
  return validDays[0].day;
}

export function calculateSurvivalScore(currentPercentage: number): number {
  // Score ranges from 0 to 100
  // 75% = 50 points (baseline)
  // 80% = 70 points
  // 90% = 90 points
  // 100% = 100 points
  // Below 70% = rapid drop off
  
  if (currentPercentage >= 90) {
    return Math.min(100, 90 + (currentPercentage - 90) * 1);
  } else if (currentPercentage >= 75) {
    return 50 + (currentPercentage - 75) * 4;
  } else {
    return Math.max(0, (currentPercentage - 60) * 3.33);
  }
}

export function getOptimizationTip(
  currentPercentage: number,
  safeToSkip: number,
  weeklySchedule: { day: string; classes: number }[]
): string {
  const bestDay = findBestSkipDay(weeklySchedule);
  
  if (currentPercentage < 70) {
    return "🚨 Emergency mode: Attend every single class until you're above 75%.";
  } else if (currentPercentage < 75) {
    return "⚠️ You're very close to the danger zone. Attend your next 3 classes to be safe.";
  } else if (safeToSkip >= 2) {
    return `✨ You have plenty of room! ${bestDay} is the best day to take a break if needed.`;
  } else if (safeToSkip === 1) {
    return `👍 You can afford one skip. Make it count: ${bestDay} is optimal.`;
  } else {
    return "📚 No skips recommended right now. Focus on maintaining your streak!";
  }
}