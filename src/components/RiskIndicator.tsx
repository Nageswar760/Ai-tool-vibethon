import { Shield, AlertTriangle, XCircle } from "lucide-react";

interface RiskIndicatorProps {
  riskLevel: "safe" | "warning" | "critical";
}

export default function RiskIndicator({ riskLevel }: RiskIndicatorProps) {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case "safe":
        return {
          icon: Shield,
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
          textColor: "text-green-700",
          title: "Safe Zone",
          description: "You're on track! Keep it up."
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgColor: "bg-amber-100",
          borderColor: "border-amber-300",
          textColor: "text-amber-700",
          title: "Warning Zone",
          description: "Be careful with skips."
        };
      case "critical":
        return {
          icon: XCircle,
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          textColor: "text-red-700",
          title: "Critical Zone",
          description: "Attend all classes!"
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`w-20 h-20 rounded-full ${config.bgColor} border-4 ${config.borderColor} flex items-center justify-center`}>
        <Icon className={`w-10 h-10 ${config.textColor}`} />
      </div>
      <p className={`text-lg font-semibold ${config.textColor} mt-3`}>{config.title}</p>
      <p className="text-sm text-slate-600 text-center">{config.description}</p>
    </div>
  );
}