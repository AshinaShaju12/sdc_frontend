import React, { useState, useRef, useEffect } from "react";
import { useAnalysis } from "../store/AnalysisContext";
import { Bot, Send, Briefcase, TrendingUp, AlertCircle, Paperclip, Globe, Building2, DollarSign, CheckCircle, Award, Lightbulb, Users, AlertTriangle, CheckSquare, FileText, FileSpreadsheet, File, Download, Loader2, Calendar } from "lucide-react";
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

  const [docGenerationState, setDocGenerationState] = useState({
    status: "idle",
    currentType: null,
    message: "",
    downloads: null,
    timestamp: null
  });

  const [recentFiles, setRecentFiles] = useState(() => {
    try {
      const stored = localStorage.getItem(`deal_coach_files_${companyName.toLowerCase()}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(`deal_coach_files_${companyName.toLowerCase()}`, JSON.stringify(recentFiles));
  }, [recentFiles, companyName]);

  const formatDocType = (type) => {
    return type
      .split("_")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleGenerateDocument = async (type) => {
    setDocGenerationState({
      status: "generating",
      currentType: type,
      message: `Generating ${formatDocType(type)}...`,
      downloads: null,
      timestamp: new Date().toLocaleTimeString()
    });

    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company: companyName,
          documentType: type
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        const timestampStr = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        setDocGenerationState({
          status: "success",
          currentType: type,
          message: `${formatDocType(type)} Generated Successfully`,
          downloads: data.downloads,
          timestamp: timestampStr
        });

        // Add to recent files
        const newFile = {
          id: Date.now(),
          type: type,
          name: `${formatDocType(type)} - ${companyName}`,
          downloads: data.downloads,
          timestamp: timestampStr
        };
        setRecentFiles(prev => [newFile, ...prev]);
      } else {
        throw new Error(data.message || "Failed to generate document");
      }
    } catch (err) {
      console.error(err);
      setDocGenerationState({
        status: "error",
        currentType: type,
        message: `Error generating document: ${err.message}`,
        downloads: null,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [completedActions, setCompletedActions] = useState(() => {
    try {
      const stored = localStorage.getItem(`deal_coach_actions_${companyName.toLowerCase()}`);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const handleToggleAction = (action) => {
    setCompletedActions((prev) => {
      const updated = { ...prev, [action]: !prev[action] };
      localStorage.setItem(`deal_coach_actions_${companyName.toLowerCase()}`, JSON.stringify(updated));
      return updated;
    });
  };
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
    const text = chatInput.trim() || (uploadedFiles.length > 0 ? "Please analyze the attached document(s)." : "");
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

  const industry = analysisData?.raw?.intelligence_overview?.industry_position || "Industrial Manufacturing";
  const strategicFitScore = analysisData?.strategic_fit_score || 89;
  const opportunityScore = "High";
  
  const getEstimatedDealValue = () => {
    if (!analysisData?.solution_mapping?.length) return "$2.1M";
    let total = 0;
    analysisData.solution_mapping.forEach(sm => {
      const val = sm.deal_value || sm.dealValue;
      if (val && typeof val === "string") {
        const clean = val.replace(/[^0-9.]/g, "");
        const parsed = parseFloat(clean);
        if (!isNaN(parsed)) {
          if (val.toUpperCase().includes("M")) {
            total += parsed * 1000000;
          } else if (val.toUpperCase().includes("K")) {
            total += parsed * 1000;
          } else {
            total += parsed;
          }
        }
      } else if (typeof val === "number") {
        total += val;
      }
    });
    if (total === 0) return "$2.1M";
    if (total >= 1000000) {
      return `$${(total / 1000000).toFixed(1)}M`;
    }
    if (total >= 1000) {
      return `$${(total / 1000).toFixed(0)}K`;
    }
    return `$${total}`;
  };
  const estimatedDealValue = getEstimatedDealValue();
  const accountStatus = "Active Opportunity";

  const recommendedSolutions = analysisData?.solution_mapping?.length 
    ? analysisData.solution_mapping 
    : [
        { solution: "EcoShield Bio-Coatings", match_percentage: 92, requirement: "Low VOC Paint formulation requirements" },
        { solution: "VOCapture Elite", match_percentage: 88, requirement: "Zero emission requirements & carbon compliance" },
        { solution: "ESG Vision Audit", match_percentage: 95, requirement: "Sustainability tracking & annual reporting" }
      ];

  const keyPainPoints = analysisData?.ai_needs_prediction?.length
    ? analysisData.ai_needs_prediction
    : ["ESG Reporting Challenges", "VOC Compliance Risks", "Manufacturing Inefficiencies", "Sustainability Targets"];

  const stakeholders = analysisData?.meeting_preparation?.stakeholders_to_target?.length
    ? analysisData.meeting_preparation.stakeholders_to_target
    : ["Sustainability Director", "Operations Head", "Procurement Manager", "Plant Director"];

  const risks = analysisData?.executive_qbr?.risk_factors?.length
    ? analysisData.executive_qbr.risk_factors
    : ["Budget Constraints", "Existing Vendor Contracts", "Regulatory Delays", "Internal Approval Cycles"];

  const nextActions = [
    "Schedule Discovery Call",
    "Send Technical Proposal",
    "Arrange Product Demo",
    "Engage Sustainability Team"
  ];

  return (
    <div className="flex flex-col h-screen bg-[#fafafc] text-slate-900 p-6 max-w-[1600px] mx-auto w-full">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-[#2d1b7a]" />
          <h1 className="text-2xl font-bold text-[#2d1b7a]">AI Sales Copilot Workspace</h1>
        </div>
        {companyName && companyName !== "the analyzed company" && (
          <span
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white animate-fade-in"
            style={{
              background: "linear-gradient(135deg, #2d1b7a, #4f3ea8)",
            }}
          >
            {companyName}
          </span>
        )}
      </div>

      {/* Enterprise Deal Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
        <Card className="p-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Company</span>
          <div className="flex items-center gap-2 mt-1 truncate">
            <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{companyName}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strategic Fit</span>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{strategicFitScore}%</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Opportunity Score</span>
          <div className="flex items-center gap-2 mt-1">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">{opportunityScore}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Status</span>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{accountStatus}</span>
          </div>
        </Card>
      </div>

      {/* Main Workspace Area (Two-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.1fr] gap-6 flex-1 min-h-0 mb-4">
        
        {/* Left Column: Deal Coach Chat */}
        <div className="flex flex-col min-h-0 h-full">
          <Card className="overflow-hidden border border-gray-200 shadow-sm flex flex-col flex-1 h-full">
            {/* Chat Header */}
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

            {/* Message Area */}
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

            {/* Input & Upload */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              {uploadedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {uploadedFiles.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold">
                      <span>{f.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="hover:text-red-500 text-[10px] font-bold ml-1.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative flex items-center w-full bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 flex items-center justify-center border-r border-gray-200 focus:outline-none"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setUploadedFiles(Array.from(e.target.files))}
                />

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
                      : "Ask about pricing strategy, stakeholder mapping, objection handling, competitive intelligence, or proposal recommendations..."
                  }
                  className="flex-1 pl-4 pr-12 py-3 outline-none text-sm text-gray-700 bg-transparent"
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                />
                <button
                  id="deal-coach-send"
                  onClick={handleSendMessage}
                  disabled={isLoading || (!chatInput.trim() && uploadedFiles.length === 0)}
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "6px",
                    backgroundColor: isLoading || (!chatInput.trim() && uploadedFiles.length === 0) ? "#a5b4fc" : "#2d1b7a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isLoading || (!chatInput.trim() && uploadedFiles.length === 0) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                  }}
                >
                  <Send style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center font-medium">
                Press Enter to send · AI-Powered Sales Intelligence Platform
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Insights Panel */}
        <div className="space-y-5 overflow-y-auto h-full pr-1">
          {/* Generated Documents Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Generated Documents</h3>
              </div>
              {docGenerationState.status === "generating" && (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              )}
            </div>

            <div className="space-y-3">
              {/* Status Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Status</span>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {docGenerationState.status === "idle" && "No documents generated yet. Use the buttons below."}
                  {docGenerationState.status === "generating" && docGenerationState.message}
                  {docGenerationState.status === "success" && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> {docGenerationState.message}
                    </span>
                  )}
                  {docGenerationState.status === "error" && (
                    <span className="text-red-500 dark:text-red-400 flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> {docGenerationState.message}
                    </span>
                  )}
                </div>
                {docGenerationState.timestamp && (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{docGenerationState.timestamp}</span>
                  </div>
                )}
                
                {docGenerationState.status === "success" && docGenerationState.downloads && (
                  <div className="flex flex-col gap-2 mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    {docGenerationState.downloads.docx && (
                      <a
                        href={docGenerationState.downloads.docx}
                        download
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Download DOCX
                      </a>
                    )}
                    {docGenerationState.downloads.pdf && (
                      <a
                        href={docGenerationState.downloads.pdf}
                        download
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </a>
                    )}
                    {docGenerationState.downloads.xlsx && (
                      <a
                        href={docGenerationState.downloads.xlsx}
                        download
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Excel
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Files Section */}
              {recentFiles.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">Recent Files</span>
                  <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {recentFiles.slice(0, 3).map((file) => (
                      <div key={file.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0 gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={file.name}>
                          {file.name}
                        </span>
                        <div className="flex gap-2 shrink-0">
                          {file.downloads.docx && (
                            <a href={file.downloads.docx} download className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold text-[10px]">
                              DOCX
                            </a>
                          )}
                          {file.downloads.pdf && (
                            <a href={file.downloads.pdf} download className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 font-bold text-[10px]">
                              PDF
                            </a>
                          )}
                          {file.downloads.xlsx && (
                            <a href={file.downloads.xlsx} download className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold text-[10px]">
                              Excel
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Generate Deliverables Actions Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Generate Deliverables</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleGenerateDocument("proposal")}
                disabled={docGenerationState.status === "generating"}
                className="w-full px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" /> Generate Proposal
              </button>
              <button
                type="button"
                onClick={() => handleGenerateDocument("meeting_brief")}
                disabled={docGenerationState.status === "generating"}
                className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Briefcase className="w-4 h-4" /> Generate Meeting Brief
              </button>
              <button
                type="button"
                onClick={() => handleGenerateDocument("opportunity_report")}
                disabled={docGenerationState.status === "generating"}
                className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingUp className="w-4 h-4" /> Generate Opportunity Report
              </button>
              <button
                type="button"
                onClick={() => handleGenerateDocument("qbr")}
                disabled={docGenerationState.status === "generating"}
                className="w-full px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Award className="w-4 h-4" /> Generate QBR Report
              </button>
              <button
                type="button"
                onClick={() => handleGenerateDocument("excel_sheet")}
                disabled={docGenerationState.status === "generating"}
                className="w-full px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4" /> Generate Excel Opportunity Sheet
              </button>
            </div>
          </Card>

          {/* Solutions Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Recommended Solutions</h3>
            </div>
            <div className="space-y-3">
              {recommendedSolutions.map((sol, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate max-w-[70%]" title={sol.solution}>{sol.solution}</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 rounded shrink-0">
                      {sol.match_percentage ?? sol.match ?? 70}% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-normal">{sol.requirement}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Pain Points Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4.5 h-4.5 text-red-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Key Pain Points</h3>
            </div>
            <ul className="space-y-2">
              {keyPainPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Stakeholders Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4.5 h-4.5 text-blue-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Detected Stakeholders</h3>
            </div>
            <ul className="space-y-2">
              {stakeholders.map((person, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>{person}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Risks Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Account Risks</h3>
            </div>
            <ul className="space-y-2">
              {risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Next Actions Card */}
          <Card className="p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Next Actions</h3>
            </div>
            <ul className="space-y-2.5">
              {nextActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 leading-normal">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
                    checked={!!completedActions[action]}
                    onChange={() => handleToggleAction(action)}
                  />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

      </div>
    </div>
  );
}

