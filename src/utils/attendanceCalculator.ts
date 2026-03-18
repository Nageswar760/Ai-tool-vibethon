export function calculateAttendance(attended: number, total: number): number {
  if (total === 0) return 0;
  return (attended / total) * 100;
}

export function getRiskLevel(percentage: number): "safe" | "warning" | "critical" {
  if (percentage >= 80) return "safe";
  if (percentage >= 75) return "warning";
  return "critical";
}

export function getRecommendation(percentage: number, remainingClasses: number): string {
  const riskLevel = getRiskLevel(percentage);
  
  switch (riskLevel) {
    case "safe":
      return `You're doing great! You can afford to skip a few classes while staying above 80%. Keep up the good work!`;
    case "warning":
      return `You're in the warning zone. Be selective about which classes to skip. Try to attend at least 80% of remaining classes.`;
    case "critical":
      return `Critical alert! You must attend all remaining classes to reach 75%. Every class counts now - don't skip anything!`;
    default:
      return "Keep tracking your attendance regularly.";
  }
}

export function calculateSafeToSkip(
  currentPercentage: number,
  remainingClasses: number
): number {
  if (remainingClasses === 0) return 0;
  
  const currentAttended = (currentPercentage / 100) * remainingClasses;
  const targetPercentage = 75;
  const minAttended = (targetPercentage / 100) * remainingClasses;
  
  return Math.floor(currentAttended - minAttended);
}

export function generateWeeklySchedule(classesPerWeek: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const schedule = days.map(day => ({
    day,
    classes: 0
  }));
  
  // Distribute classes across days
  let remaining = classesPerWeek;
  let dayIndex = 0;
  
  while (remaining > 0 && dayIndex < 5) {
    const classesToAdd = Math.min(Math.ceil(remaining / (5 - dayIndex)), 3);
    schedule[dayIndex].classes = classesToAdd;
    remaining -= classesToAdd;
    dayIndex++;
  }
  
  return schedule;
}