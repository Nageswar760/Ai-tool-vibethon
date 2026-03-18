import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send, Bot, User } from "lucide-react";

interface ChatbotProps {
  currentPercentage: number;
  safeToSkip: number;
  riskLevel: "safe" | "warning" | "critical";
  survivalScore: number;
  bestSkipDay: string;
}

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
}

export default function Chatbot({ currentPercentage, safeToSkip, riskLevel, survivalScore, bestSkipDay }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: `Hi! I'm your attendance assistant. You're at ${currentPercentage.toFixed(1)}% with a Survival Score of ${survivalScore}. How can I help?`
    }
  ]);
  const [input, setInput] = useState("");

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Skip-related queries
    if (lowerInput.includes("skip") || lowerInput.includes("bunk")) {
      if (lowerInput.includes("tomorrow") || lowerInput.includes("today")) {
        if (safeToSkip > 0) {
          return `Yes! You can safely skip tomorrow. Your attendance will stay around ${currentPercentage.toFixed(1)}% and your Survival Score remains ${survivalScore}.`;
        } else {
          return `I wouldn't recommend it. Skipping would drop your attendance below safe levels. You need to attend more classes to improve your Survival Score.`;
        }
      }
      if (lowerInput.includes("how many") || lowerInput.includes("can i")) {
        return safeToSkip > 0 
          ? `You can safely skip ${safeToSkip} more class(es) and still stay above 75%.`
          : `You cannot skip any more classes. Attend all upcoming classes to stay safe.`;
      }
      return `Based on your current ${currentPercentage.toFixed(1)}%, you can skip ${safeToSkip} more class(es). ${bestSkipDay} would be the best day to skip.`;
    }

    // Risk/survival queries
    if (lowerInput.includes("risk") || lowerInput.includes("danger") || lowerInput.includes("safe")) {
      if (riskLevel === "safe") {
        return `You're in the Safe Zone! 🎉 Keep attending regularly and you'll maintain a great attendance record.`;
      } else if (riskLevel === "warning") {
        return `You're in the Warning Zone ⚠️. Be careful with skips and try to attend most upcoming classes.`;
      } else {
        return `You're in the Critical Zone 🚨. You must attend all remaining classes to avoid falling below 75%.`;
      }
    }

    if (lowerInput.includes("survival") || lowerInput.includes("score")) {
      return `Your Detention Survival Score is ${survivalScore}/100. ${survivalScore >= 70 ? "Looking good!" : survivalScore >= 40 ? "Be careful!" : "High risk!"}`;
    }

    // Improvement queries
    if (lowerInput.includes("improve") || lowerInput.includes("increase") || lowerInput.includes("better")) {
      const neededFor80 = Math.ceil((0.8 * 100 - currentPercentage) / (100 / 100));
      return `To reach 80%, attend your next ${Math.max(1, neededFor80)} classes. Consistency is key!`;
    }

    // Help queries
    if (lowerInput.includes("help") || lowerInput.includes("what can")) {
      return `I can help you with:\n• "Can I skip tomorrow?"\n• "How many classes can I bunk?"\n• "What's my risk level?"\n• "How can I improve?"\n• "What's my survival score?"`;
    }

    // Default response
    return `I understand you're asking about "${userInput}". Based on your ${currentPercentage.toFixed(1)}% attendance, you can skip ${safeToSkip} more classes. Try asking about skipping, risk levels, or how to improve!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input
    };

    const botResponse: Message = {
      id: messages.length + 2,
      type: "bot",
      content: generateResponse(input)
    };

    setMessages([...messages, userMessage, botResponse]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-y-auto space-y-3 p-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.type === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
            {message.type === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}