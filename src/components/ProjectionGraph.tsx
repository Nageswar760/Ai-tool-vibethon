import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProjectionGraphProps {
  currentPercentage: number;
  remainingClasses: number;
}

export default function ProjectionGraph({ currentPercentage, remainingClasses }: ProjectionGraphProps) {
  const generateProjectionData = () => {
    const data = [];
    const classesToProject = Math.min(10, remainingClasses);
    
    for (let i = 0; i <= classesToProject; i++) {
      const totalClasses = remainingClasses;
      const attendedIfAll = i;
      const percentageIfAll = ((currentPercentage / 100 * (remainingClasses - classesToProject)) + attendedIfAll) / remainingClasses * 100;
      
      data.push({
        class: i === 0 ? "Now" : `+${i}`,
        attendAll: Math.max(0, Math.min(100, percentageIfAll)),
        skipAll: Math.max(0, Math.min(100, percentageIfAll - (i * (100 / remainingClasses)))),
      });
    }
    return data;
  };

  const data = generateProjectionData();

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="class" stroke="#64748b" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#f8fafc", 
              border: "1px solid #e2e8f0",
              borderRadius: "8px"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="attendAll" 
            stroke="#16a34a" 
            strokeWidth={2}
            name="Attend All"
            dot={{ fill: "#16a34a", strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="skipAll" 
            stroke="#dc2626" 
            strokeWidth={2}
            name="Skip All"
            dot={{ fill: "#dc2626", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full" />
          <span className="text-slate-600">If you attend all</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full" />
          <span className="text-slate-600">If you skip all</span>
        </div>
      </div>
    </div>
  );
}