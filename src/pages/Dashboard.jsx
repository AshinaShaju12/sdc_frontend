import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSettings } from "../store/SettingsContext";
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

// ACCOUNTS_DATA is fetched from API

/* ---------------- MAIN COMPONENT ---------------- */

const AccountPortal = () => {
  const [searchParams] = useSearchParams();
  const { formatCurrency } = useSettings();

  const requestedAccount =
    searchParams.get("name") || "Starlight Automotive";

  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  
// Duplicate chatInput state removed
  // Removed duplicate chatInput state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Fetch company details from backend
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch('/api/companydata/company/details');
        if (response.ok) {
          const data = await response.json();
          setCompanyInfo(data);
        } else {
          console.error('Failed to fetch company details');
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setIsLoadingCompany(false);
      }
    };
    fetchCompany();
  }, []);

  // Render company details card after header
  const renderCompanyDetails = () => {
    if (isLoadingCompany) {
      return <div className="text-center my-4">Loading company details...</div>;
    }
    if (!companyInfo) {
      return null;
    }
    return (
      <Card className="mt-6">
        <CardHeader className="bg-indigo-700 text-white">
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Health Trend:</strong> {companyInfo.healthTrend}</div>
            <div><strong>Industry:</strong> {companyInfo.industry}</div>
            <div><strong>Annual Revenue:</strong> {formatCurrency(companyInfo.annualRevenue)}</div>
            <div><strong>Strategic Fit:</strong> {companyInfo.strategicFit}%</div>
            {companyInfo.nextMilestone && (
              <div className="col-span-2">
                <strong>Next Milestone:</strong> {companyInfo.nextMilestone.title} – {companyInfo.nextMilestone.date}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Insert renderCompanyDetails in JSX after the header section

  if (isLoadingAccount) {
    return <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">Loading account details...</div>;
  }
  if (!accountInfo) {
    return <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">Account not found.</div>;
  }

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text }
    ]);

    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: requestedAccount, message: text }),
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => [
          ...prev,
          { sender: "coach", text: data.reply }
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "coach", text: "Sorry, I encountered an error connecting to the server." }
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "coach", text: "Sorry, I encountered an error connecting to the server." }
      ]);
    } finally {
      setIsTyping(false);
    }
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
            Revenue: {formatCurrency(accountInfo.revenue)}
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