import React, { useState } from "react";
import { useAnalysis } from "../store/AnalysisContext";
import { Bot, Send, Briefcase, TrendingUp } from "lucide-react";
import { Card } from "shared-ui";

export default function DealCoach() {
  const { analysisData } = useAnalysis();
  const [chatInput, setChatInput] = useState("");
  
  // We initialize chat with the Deal Coach strategy from the analysis
  const [messages, setMessages] = useState(() => {
    if (analysisData?.deal_coach?.recommended_pitch_strategy) {
      return [{
        sender: "ai",
        text: `Based on my analysis, here is the recommended pitch strategy:\n\n${analysisData.deal_coach.recommended_pitch_strategy}`
      }];
    }
    return [{
      sender: "ai",
      text: "Hello! I am your AI Deal Coach. How can I assist you with this opportunity?"
    }];
  });

  const handleSendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setChatInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `I'm analyzing your request regarding "${text}"...`,
        },
      ]);
    }, 1000);
  };

  if (!analysisData) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-500">
        No analysis data available. Please run an analysis from the Home page.
      </div>
    );
  }

  const { deal_coach } = analysisData;

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 p-8 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-8 h-8 text-[#2d1b7a]" />
        <h1 className="text-3xl font-bold text-[#2d1b7a]">Deal Coach</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        
        {/* Deal Opportunities */}
        <div className="space-y-6">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Cross-Sell Opportunities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {(deal_coach?.cross_sell_opportunities || []).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Upsell Opportunities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {(deal_coach?.upsell_opportunities || []).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </Card>
        </div>

        {/* Deal Coach Chat */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm flex flex-col h-[600px]">
          <div className="border-b border-gray-100 p-4 flex items-center gap-3 bg-white">
            <div className="bg-[#2d1b7a] p-1.5 rounded-lg text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">AI Deal Coach</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-600 tracking-wider">Online</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 flex-1 overflow-y-auto flex flex-col">
            <div className="space-y-6 flex-1">
              {messages.map((msg, idx) => (
                msg.sender === "ai" ? (
                  <div key={idx} className="flex justify-start">
                    <div className="max-w-[85%] bg-[#eef2fc] text-[#3c4a6b] text-sm px-5 py-4 rounded-2xl rounded-tl-sm leading-relaxed border border-blue-50/50 whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex justify-end mt-4">
                    <div className="max-w-[75%] bg-[#2d1b7a] text-white text-sm px-5 py-4 rounded-2xl rounded-tr-sm leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            {/* Chat Input */}
            <div className="relative rounded-xl border border-gray-300 overflow-hidden shadow-sm bg-white">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask your Deal Coach for pricing tactics, competitor analysis, etc..."
                className="w-full pl-4 pr-12 py-3 outline-none text-sm text-gray-700"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#2d1b7a] hover:bg-[#1f125a] text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
