import { useState, useMemo } from "react";
import { calculateSafeToSkip, generateWeeklySchedule } from "../utils/attendanceCalculator";

interface WeeklySchedule {
  day: string;
  classes: number;
}

interface AttendanceState {
  remainingClasses: number;
  safeToSkip: number;
  weeklySchedule: WeeklySchedule[];
}

export function useAttendanceState(
  totalClasses: number,
  attendedClasses: number,
  classesPerWeek: number,
  holidays: number
): AttendanceState {
  const state = useMemo(() => {
    // Calculate remaining classes based on weeks left
    // Assuming 15 weeks total in a semester, subtract completed weeks
    const weeksCompleted = Math.floor(totalClasses / Math.max(1, classesPerWeek));
    const totalWeeks = 15;
    const weeksRemaining = Math.max(0, totalWeeks - weeksCompleted);
    
    // Calculate remaining classes (excluding holidays)
    const scheduledRemaining = weeksRemaining * classesPerWeek;
    const remainingClasses = Math.max(0, scheduledRemaining - holidays);
    
    // Calculate safe to skip
    const currentPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    const safeToSkip = calculateSafeToSkip(currentPercentage, remainingClasses);
    
    // Generate weekly schedule
    const weeklySchedule = generateWeeklySchedule(classesPerWeek);
    
    return {
      remainingClasses,
      safeToSkip,
      weeklySchedule
    };
  }, [totalClasses, attendedClasses, classesPerWeek, holidays]);

  return state;
}