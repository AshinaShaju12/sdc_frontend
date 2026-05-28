import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Bell, Rocket, TrendingUp, Sparkles, Send, Download, Bot, User, MapPin } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Input,
} from "shared-ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "shared-ui/src/components/ui/Table";

const Details = () => {
  const { companyName } = useParams();
  const displayName = companyName || "Global Nexus Corp";
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "I've completed the intelligence map for Global Nexus Corp. Based on their recent $200M APAC expansion announcement, they are likely struggling with data residency compliance. Should we frame the next proposal around our localized gateway solution?"
    },
    {
      sender: "user",
      text: "Yes, that's exactly what I was thinking. How should I approach the pricing discussion with their CFO?"
    },
    {
      sender: "ai",
      text: "For the CFO, focus on **TCO (Total Cost of Ownership)**. Emphasize that failing compliance in..."
    }
  ]);

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
          text: `Got it. Here is the analysis on: "${text}"...`,
        },
      ]);
    }, 500);
  };

  const mappingData = [
    {
      requirement: "Cloud Cost Reduction",
      subReq: "Targeting -20% OpEx",
      solution: "Nexus Optimizer v4",
      subSol: "FinOps Tier",
      match: 98,
      matchColor: "bg-emerald-600",
      dealValue: "$2.4M",
    },
    {
      requirement: "API Security Layer",
      subReq: "Enterprise Scale Protection",
      solution: "ShieldCore API Gateway",
      subSol: "Cybersecurity Suite",
      match: 85,
      matchColor: "bg-indigo-700",
      dealValue: "$1.8M",
    },
    {
      requirement: "Legacy DB Migration",
      subReq: "1,200 On-Prem Clusters",
      solution: "RelayX Auto-Migrate",
      subSol: "Professional Services",
      match: 72,
      matchColor: "bg-blue-600",
      dealValue: "$5.1M",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#2d1b7a]">{displayName}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold tracking-wide">
              Workspace Alpha
            </span>
            <button className="p-2 text-indigo-700 hover:bg-indigo-50 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Cards Section */}
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
          
          {/* Target Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Account Health</span>
              <span className="flex items-center text-xs font-bold text-emerald-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#352582] mb-6">Target: {displayName}</h2>
            <div className="flex gap-4">
              <div className="bg-blue-50/50 rounded-lg p-3 flex-1 border border-blue-50">
                <div className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">Industry</div>
                <div className="font-bold text-slate-800 text-sm">Cloud Infrastructure</div>
              </div>
              <div className="bg-blue-50/50 rounded-lg p-3 flex-1 border border-blue-50">
                <div className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">Annual Revenue</div>
                <div className="font-bold text-slate-800 text-sm">$14.2B USD</div>
              </div>
            </div>
          </Card>

          {/* Strategic Fit Card */}
          <Card className="p-6 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-4">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" className="stroke-indigo-100 fill-none" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" className="stroke-[#2d1b7a] fill-none" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.94)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-[#2d1b7a]">94%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-800 text-lg">Strategic Fit</h3>
              <p className="text-xs text-gray-500">High Alignment Probability</p>
            </div>
          </Card>

          {/* Next Milestone Card */}
          <Card className="p-6 border-l-4 border-l-emerald-500 border-t-0 border-r-0 border-b-0 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-emerald-50 opacity-50 pointer-events-none">
               <Rocket className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Rocket className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Next Milestone</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1 relative z-10">Executive QBR</h3>
            <p className="text-xs text-gray-500 mb-6 relative z-10">Scheduled: Oct 24, 2:00 PM</p>
            <button className="w-full bg-[#2d1b7a] hover:bg-[#1f125a] text-white py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors relative z-10">
              Prepare Materials
            </button>
          </Card>
        </div>

        {/* Middle Section */}
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          
          {/* Intelligence Overview */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Intelligence Overview</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-2 border-[#352582] pl-4">
                <h3 className="font-bold text-[#352582] text-sm mb-1">Strategic Goal: Global APAC Expansion</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Aggressive push into Southeast Asian markets with a focus on localized data residency and sovereign cloud compliance. Expected $200M infrastructure investment.
                </p>
              </div>
              <div className="border-l-2 border-[#352582] pl-4">
                <h3 className="font-bold text-[#352582] text-sm mb-1">Hiring Trend: AI Governance Officers</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Increasing recruitment for legal and technical roles in AI safety and regulatory compliance, signaling a shift toward enterprise-wide AI implementation.
                </p>
              </div>
              <div className="border-l-2 border-[#352582] pl-4">
                <h3 className="font-bold text-[#352582] text-sm mb-1">Expansion: Data Center Sustainability</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nexus has publicly committed to 100% renewable energy for all Tier 4 data centers by 2026. This creates a high opening for Green-Ops solutions.
                </p>
              </div>
            </div>
          </Card>

          {/* AI Needs Prediction */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">AI Needs Prediction</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Operational</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 tracking-wider uppercase">Critical</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">Automated Multi-Cloud FinOps</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Nexus is currently overspending by 18% on egress fees. Predictive modeling suggests a high need for automated arbitrage.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Technical</span>
                  <span className="text-[10px] font-extrabold text-[#352582] tracking-wider uppercase">High</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">Zero-Trust Network Access (ZTNA)</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Recent security audits indicate vulnerability in remote developer access points. Predicted spend: $4.5M.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">
          {/* Table */}
          <Card className="p-6 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#352582]" />
                <h2 className="text-lg font-bold text-slate-800">AI Solution Mapping Engine</h2>
              </div>
              <button className="text-sm font-semibold text-[#352582] hover:text-[#1f125a] flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Mapping
              </button>
            </div>
            
            <Table className="border-t-0 border-x-0 w-full text-left">
              <TableHeader className="bg-transparent border-b-2 border-gray-100">
                <TableRow className="border-b-2 border-gray-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-gray-400 tracking-wider uppercase h-10 px-0">Their Requirement</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 tracking-wider uppercase h-10 px-0">Our Solution</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 tracking-wider uppercase h-10 px-0">Match %</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 tracking-wider uppercase h-10 px-0">Est. Deal Value</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 tracking-wider uppercase h-10 px-0 w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappingData.map((row, idx) => (
                  <TableRow key={idx} className="border-b border-gray-50 hover:bg-transparent">
                    <TableCell className="px-0 py-4 align-top">
                      <div className="font-bold text-sm text-slate-800">{row.requirement}</div>
                      <div className="text-xs text-gray-500">{row.subReq}</div>
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top">
                      <div className="font-medium text-sm text-gray-800">{row.solution}</div>
                      <div className="text-xs text-[#352582]">{row.subSol}</div>
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                          <div className={`h-full ${row.matchColor}`} style={{ width: `${row.match}%` }}></div>
                        </div>
                        <span className="font-bold text-sm text-slate-800">{row.match}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top font-bold text-sm text-slate-800">
                      {row.dealValue}
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top text-right">
                      <button className="text-[#352582] hover:text-[#1f125a]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Deal Coach Chat */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <div className="border-b border-gray-100 p-4 flex items-center gap-3">
              <div className="bg-[#2d1b7a] p-1.5 rounded-lg text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">AI Deal Coach</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs font-bold text-emerald-600 tracking-wider">Online & Analyzing</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6">
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  msg.sender === "ai" ? (
                    <div key={idx} className="flex justify-start">
                      <div className="max-w-[85%] bg-[#eef2fc] text-[#3c4a6b] text-sm px-5 py-4 rounded-2xl rounded-tl-sm leading-relaxed border border-blue-50/50">
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

              {/* Suggestions */}
              <div className="mt-8 mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400">Suggested Prompts:</span>
                <button 
                  onClick={() => setChatInput("Prepare negotiation strategy")}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100 hover:bg-blue-100"
                >
                  Prepare negotiation strategy
                </button>
                <button 
                  onClick={() => setChatInput("Risk assessment for APAC")}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100 hover:bg-blue-100"
                >
                  Risk assessment for APAC
                </button>
              </div>

              {/* Chat Input */}
              <div className="relative rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask your Deal Coach anything..."
                  className="w-full pl-4 pr-12 py-3.5 outline-none text-sm text-gray-700 bg-white"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#2d1b7a] hover:bg-[#1f125a] text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Details;
