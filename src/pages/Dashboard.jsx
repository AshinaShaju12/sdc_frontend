import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  TrendingUp,
  Building2,
  Sparkles,
  Send,
  Check
} from "lucide-react";
import Input from "shared-ui/src/components/ui/Input";

/* ---------------- SIMPLE UI COMPONENTS ---------------- */

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-5 border-b ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h2 className={`font-bold ${className}`}>{children}</h2>
);

const Badge = ({ children }) => (
  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold">
    {children}
  </span>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition ${className}`}
    {...props}
  >
    {children}
  </button>
);
 

/* ---------------- MOCK DATA ---------------- */

const ACCOUNTS_DATA = {
  "Starlight Automotive": {
    ticker: "STLA",
    industry: "Automotive & Heavy Industry",
    employees: "24,000",
    revenue: "$14.2B",
    brief:
      "Leading Tier-1 OEM manufacturing premium vehicle chassis and sustainable bio-based coating systems.",
    opportunities: [
      {
        name: "Specialty Bio-Based Coatings",
        label: "92% Confidence"
      }
    ],
    signals: [
      {
        title: "Tennessee Paintshop Expansion"
      }
    ],
    stakeholders: [
      {
        name: "Robert Chen",
        role: "VP of Manufacturing"
      }
    ],
    discovery: [
      {
        q: "How are you transitioning to bio-based coatings?"
      }
    ],
    objections: [
      {
        obj: "Switching suppliers is risky.",
        ans: "We provide phased qualification programs."
      },
      {
        obj: "Pricing premium is high.",
        ans: "Energy savings reduce total lifecycle costs."
      }
    ]
  }
};

/* ---------------- MAIN COMPONENT ---------------- */

const AccountPortal = () => {
  const [searchParams] = useSearchParams();

  const requestedAccount =
    searchParams.get("name") || "Starlight Automotive";

  const accountInfo = ACCOUNTS_DATA[requestedAccount];

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    setChatMessages([
      {
        sender: "coach",
        text: `Hello! I am your AI Deal Coach.

I recommend targeting "${accountInfo.opportunities[0].name}" (${accountInfo.opportunities[0].label}).

What would you like help with today?`
      }
    ]);
  }, []);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text }
    ]);

    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "";

      const lower = text.toLowerCase();

      if (lower.includes("why")) {
        response = `
Top reasons to contact this account:

1. ${accountInfo.signals[0].title}

2. Strong alignment with our bio-coating solutions.

3. Active expansion and sustainability initiatives.
`;
      } else if (lower.includes("objection")) {
        response = `
Main Objections:

1. ${accountInfo.objections[0].obj}

Response:
${accountInfo.objections[0].ans}

2. ${accountInfo.objections[1].obj}

Response:
${accountInfo.objections[1].ans}
`;
      } else if (lower.includes("discovery")) {
        response = `
Discovery Question:

${accountInfo.discovery[0].q}
`;
      } else {
        response = `
Recommended Stakeholder:

${accountInfo.stakeholders[0].name}
(${accountInfo.stakeholders[0].role})
`;
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "coach", text: response }
      ]);

      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ANALYSIS OVERLAY */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="max-w-md w-full p-6">
            <div className="flex justify-center mb-6">
              <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16" />
            </div>

            <h2 className="text-xl font-bold text-center mb-4">
              AI Analysis Running...
            </h2>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      analysisStep >= step
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {analysisStep >= step ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>

                  <span>
                    Analysis Step {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {requestedAccount}
        </h1>

        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <Badge>{accountInfo.ticker}</Badge>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {accountInfo.industry}
          </div>

          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            Revenue: {accountInfo.revenue}
          </div>
        </div>

        <p className="max-w-3xl mx-auto text-gray-600">
          {accountInfo.brief}
        </p>
      </div>

      {/* AI CHAT */}
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">

          <CardHeader className="bg-blue-700 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />

              <div>
                <CardTitle className="text-xl">
                  AI Deal Coach
                </CardTitle>

                <p className="text-sm text-blue-100">
                  Sales Intelligence Assistant
                </p>
              </div>
            </div>

            <Badge>ACTIVE</Badge>
          </CardHeader>

          <CardContent className="bg-gray-50 h-[600px] flex flex-col">

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="bg-white border rounded-2xl p-4 w-fit">
                  AI is typing...
                </div>
              )}
            </div>

            {/* QUICK PROMPTS */}
            <div className="flex flex-wrap gap-2 mb-4">

              <Button
                onClick={() =>
                  handleSendMessage(
                    "Why should I call today?"
                  )
                }
              >
                Why Call?
              </Button>

              <Button
                onClick={() =>
                  handleSendMessage(
                    "Handle objections"
                  )
                }
              >
                Objections
              </Button>

              <Button
                onClick={() =>
                  handleSendMessage(
                    "Discovery questions"
                  )
                }
              >
                Discovery
              </Button>

            </div>

            {/* INPUT */}
            <div className="flex gap-3">
              <Input
                className="flex-1"
                placeholder="Ask AI..."
                value={chatInput}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSendMessage(chatInput)
                }
              />

              <Button
                onClick={() =>
                  handleSendMessage(chatInput)
                }
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPortal;