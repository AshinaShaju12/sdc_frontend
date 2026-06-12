import React, { useState, useRef, useEffect } from "react";
import { useAnalysis } from "../store/AnalysisContext";
import { Bot, Send, Briefcase, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "shared-ui";
import { sendChatMessage } from "../services/chatService";

// Simple markdown-ish renderer: bold (**text**), newlines → <br>
function MessageText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part.split("\n").map((line, j, arr) => (
          <React.Fragment key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </span>
  );
}

// Animated typing dots indicator
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="max-w-[85%] bg-[#eef2fc] text-[#3c4a6b] text-sm px-5 py-4 rounded-2xl rounded-tl-sm border border-blue-50/50"
        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
      >
        <span style={{ fontStyle: "italic", color: "#6b7fa3", fontSize: "13px" }}>
          AI is thinking
        </span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              display: "inline-block",
              animation: "dealCoachBounce 1.2s infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes dealCoachBounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function DealCoach() {
  const { analysisData } = useAnalysis();
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Derive company name from analysis data
  const companyName =
    analysisData?.company ||
    analysisData?.company_name ||
    analysisData?.upstream?.agent?.company ||
    "the analyzed company";

  const [uploadedFiles, setUploadedFiles] = useState([]);
const [messages, setMessages] = useState(() => {
    if (analysisData?.deal_coach?.recommended_pitch_strategy) {
      return [
        {
          sender: "ai",
          text: `Based on my analysis, here is the recommended pitch strategy:\n\n${analysisData.deal_coach.recommended_pitch_strategy}`,
        },
      ];
    }
    return [
      {
        sender: "ai",
        text: `Hello! I'm your AI Deal Coach for **${companyName}**. Ask me anything about pricing tactics, objection handling, competitor analysis, or deal strategy.`,
      },
    ];
  });

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || isLoading) return;

    setError(null);
    setChatInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsLoading(true);

    try {
      const answer = await sendChatMessage(companyName, text, uploadedFiles);
      setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
      // Clear uploaded files after processing
      setUploadedFiles([]);
      // Reset file input value if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to get a response. Please try again.");
      // Remove the user message optimistically added above so UX is clean
      setMessages((prev) => {
        const copy = [...prev];
        // Only remove the last user message if it's the one we just added
        if (copy[copy.length - 1]?.sender === "user") copy.pop();
        return copy;
      });
    } finally {
      setIsLoading(false);
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    <div className="flex flex-col h-screen bg-[#fafafc] text-slate-900 p-8">
        {/* File upload section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Attach documents (optional)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setUploadedFiles(Array.from(e.target.files))}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2d1b7a] file:text-white hover:file:bg-[#4f3ea8]"
          />
          {uploadedFiles.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
              {uploadedFiles.map((f, i) => (
                <li key={i}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
              ))}
            </ul>
          )}
        </div>
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-8 h-8 text-[#2d1b7a]" />
        <h1 className="text-3xl font-bold text-[#2d1b7a]">Deal Coach</h1>
        {companyName && companyName !== "the analyzed company" && (
          <span
            style={{
              background: "linear-gradient(135deg, #2d1b7a, #4f3ea8)",
              color: "#fff",
              borderRadius: "20px",
              padding: "2px 14px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {companyName}
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] flex-1">
        {/* Deal Opportunities */}
        <div className="space-y-6">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Cross-Sell Opportunities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {(deal_coach?.cross_sell_opportunities || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Upsell Opportunities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {(deal_coach?.upsell_opportunities || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Deal Coach Chat */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm flex flex-col flex-1">
          {/* Header */}
          <div className="border-b border-gray-100 p-4 flex items-center gap-3 bg-white flex-shrink-0">
            <div className="bg-[#2d1b7a] p-1.5 rounded-lg text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm">AI Deal Coach</h3>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-amber-400" : "bg-emerald-500 animate-pulse"}`}
                />
                <span
                  className={`text-xs font-bold tracking-wider ${isLoading ? "text-amber-500" : "text-emerald-600"}`}
                >
                  {isLoading ? "Thinking..." : "Online"}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, idx) =>
                msg.sender === "ai" ? (
                  <div key={idx} className="flex justify-start">
                    <div className="max-w-[85%] bg-[#eef2fc] text-[#3c4a6b] text-sm px-5 py-4 rounded-2xl rounded-tl-sm leading-relaxed border border-blue-50/50">
                      <MessageText text={msg.text} />
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex justify-end">
                    <div className="max-w-[75%] bg-[#2d1b7a] text-white text-sm px-5 py-4 rounded-2xl rounded-tr-sm leading-relaxed shadow-sm">
                      <MessageText text={msg.text} />
                    </div>
                  </div>
                )
              )}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}

              {/* Error banner */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#be123c",
                  }}
                >
                  <AlertCircle style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "1px" }} />
                  <div>
                    <strong>Error:</strong> {error}
                    <button
                      onClick={() => setError(null)}
                      style={{
                        marginLeft: "8px",
                        textDecoration: "underline",
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        color: "#be123c",
                        fontSize: "12px",
                        padding: 0,
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
            <div className="relative rounded-xl border border-gray-300 overflow-hidden shadow-sm bg-white">
              <input
                ref={inputRef}
                type="text"
                id="deal-coach-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={
                  isLoading
                    ? "Waiting for AI response..."
                    : "Ask your Deal Coach for pricing tactics, competitor analysis, etc..."
                }
                className="w-full pl-4 pr-12 py-3 outline-none text-sm text-gray-700"
                style={{ opacity: isLoading ? 0.6 : 1 }}
              />
              <button
                id="deal-coach-send"
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                style={{
                  position: "absolute",
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "6px",
                  backgroundColor: isLoading || !chatInput.trim() ? "#a5b4fc" : "#2d1b7a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading || !chatInput.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s",
                }}
              >
                <Send style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send · Powered by Groq AI
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

