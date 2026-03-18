import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import AttendanceMeter from "../components/AttendanceMeter";
import SafeToBunkCounter from "../components/SafeToBunkCounter";
import ProjectionGraph from "../components/ProjectionGraph";
import RiskIndicator from "../components/RiskIndicator";
import CalendarView from "../components/CalendarView";
import Chatbot from "../components/Chatbot";
import SimulatorPanel from "../components/SimulatorPanel";
import { useAttendanceState } from "../hooks/useAttendanceState";
import { calculateAttendance, getRiskLevel, getRecommendation } from "../utils/attendanceCalculator";
import { findBestSkipDay, calculateSurvivalScore } from "../utils/recommendations";

function App() {
  const [totalClasses, setTotalClasses] = useState<number>(50);
  const [attendedClasses, setAttendedClasses] = useState<number>(40);
  const [classesPerWeek, setClassesPerWeek] = useState<number>(5);
  const [holidays, setHolidays] = useState<number>(2);
  const [showSetup, setShowSetup] = useState<boolean>(true);
  
  const attendanceData = useAttendanceState(totalClasses, attendedClasses, classesPerWeek, holidays);
  
  const currentPercentage = calculateAttendance(attendedClasses, totalClasses);
  const riskLevel = getRiskLevel(currentPercentage);
  const recommendation = getRecommendation(currentPercentage, attendanceData.remainingClasses);
  const bestSkipDay = findBestSkipDay(attendanceData.weeklySchedule);
  const survivalScore = calculateSurvivalScore(currentPercentage);

  if (showSetup) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">🎓 Smart Attendance Optimizer</CardTitle>
            <CardDescription className="text-slate-600">Your AI-powered academic co-pilot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="total">Total Classes Held So Far</Label>
              <Input
                id="total"
                type="number"
                value={totalClasses}
                onChange={(e) => setTotalClasses(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attended">Classes You've Attended</Label>
              <Input
                id="attended"
                type="number"
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(Math.max(0, Math.min(totalClasses, parseInt(e.target.value) || 0)))}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly">Classes Per Week (Mon-Fri)</Label>
              <Select value={classesPerWeek.toString()} onValueChange={(v) => setClassesPerWeek(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n} classes/week</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="holidays">Upcoming Holidays</Label>
              <Input
                id="holidays"
                type="number"
                value={holidays}
                onChange={(e) => setHolidays(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-lg"
              />
            </div>
            <div className="bg-slate-100 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600">Current Attendance</p>
              <p className="text-3xl font-bold text-slate-800">{currentPercentage.toFixed(1)}%</p>
            </div>
            <Button 
              onClick={() => setShowSetup(false)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
            >
              Launch Dashboard →
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">🎓 Attendance Dashboard</h1>
            <p className="text-slate-600">AI-powered insights for your academic success</p>
          </div>
          <Button 
            onClick={() => setShowSetup(true)}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Update Settings
          </Button>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <AttendanceMeter percentage={currentPercentage} />
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <SafeToBunkCounter 
                safeToSkip={attendanceData.safeToSkip} 
                riskLevel={riskLevel}
              />
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <RiskIndicator riskLevel={riskLevel} />
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <p className="text-sm text-slate-600 mb-2">Detention Survival Score</p>
              <p className={`text-4xl font-bold ${survivalScore >= 70 ? 'text-green-600' : survivalScore >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                {survivalScore}
              </p>
              <p className="text-xs text-slate-500 mt-1">out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Simulator & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">⚡ AI What-If Simulator</CardTitle>
                <CardDescription>See how skipping classes affects your attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <SimulatorPanel 
                  currentPercentage={currentPercentage}
                  totalClasses={totalClasses}
                  attendedClasses={attendedClasses}
                  remainingClasses={attendanceData.remainingClasses}
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">📅 Smart Calendar</CardTitle>
                <CardDescription>Green = Safe to skip • Red = Must attend</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarView 
                  weeklySchedule={attendanceData.weeklySchedule}
                  bestSkipDay={bestSkipDay}
                  currentPercentage={currentPercentage}
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">📈 Future Projection</CardTitle>
                <CardDescription>Attendance trajectory over next 10 classes</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectionGraph 
                  currentPercentage={currentPercentage}
                  remainingClasses={attendanceData.remainingClasses}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chatbot & Recommendations */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">💡 AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">Best Day to Skip:</p>
                  <p className="text-lg font-bold text-blue-900">{bestSkipDay}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600">{recommendation}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-slate-800">{attendanceData.remainingClasses}</p>
                    <p className="text-xs text-slate-600">Classes Left</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-slate-800">{attendanceData.safeToSkip}</p>
                    <p className="text-xs text-slate-600">Safe Skips</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">🤖 AI Assistant</CardTitle>
                <CardDescription>Ask me anything about your attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <Chatbot 
                  currentPercentage={currentPercentage}
                  safeToSkip={attendanceData.safeToSkip}
                  riskLevel={riskLevel}
                  survivalScore={survivalScore}
                  bestSkipDay={bestSkipDay}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;