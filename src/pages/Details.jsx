import React from "react";
import { Link } from "react-router-dom";
import { useAnalysis } from "../store/AnalysisContext";
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
  const { analysisData } = useAnalysis();

  if (!analysisData) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-500">
        No analysis data available. Please run an analysis from the Home page.
      </div>
    );
  }

  const { 
    intelligence_overview, 
    strategic_fit_score, 
    ai_needs_prediction, 
    solution_mapping 
  } = analysisData;

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#2d1b7a]">Company Analysis Dashboard</h1>
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
        <div className="grid gap-4 xl:grid-cols-2">
          
          {/* Strategic Fit Card */}
          <Card className="p-6 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-4">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" className="stroke-indigo-100 fill-none" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" className="stroke-[#2d1b7a] fill-none" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (strategic_fit_score || 0) / 100)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-[#2d1b7a]">{strategic_fit_score || 0}%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-800 text-lg">Strategic Fit</h3>
              <p className="text-xs text-gray-500">Alignment Probability</p>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="p-6 flex flex-col justify-center gap-4">
             <h3 className="font-bold text-slate-800 text-lg">Next Steps</h3>
             <div className="flex gap-4">
                <Link to="/meeting-prep" className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-4 rounded-xl text-center font-semibold transition-colors border border-emerald-100">
                  Meeting Prep & QBR
                </Link>
                <Link to="/deal-coach" className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl text-center font-semibold transition-colors border border-blue-100">
                  Deal Coach Chat
                </Link>
             </div>
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
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {intelligence_overview || "No overview generated."}
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
            
            <div className="space-y-4">
               <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                 {(ai_needs_prediction || []).map((need, i) => (
                   <li key={i}>{need}</li>
                 ))}
               </ul>
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
                {(solution_mapping || []).map((row, idx) => (
                  <TableRow key={idx} className="border-b border-gray-50 hover:bg-transparent">
                    <TableCell className="px-0 py-4 align-top">
                      <div className="font-bold text-sm text-slate-800">{row.requirement}</div>
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top">
                      <div className="font-medium text-sm text-gray-800">{row.solution}</div>
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                          <div className="h-full bg-emerald-600" style={{ width: `${row.match_percentage ?? row.match ?? 0}%` }}></div>
                        </div>
                        <span className="font-bold text-sm text-slate-800">{row.match_percentage ?? row.match ?? 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-0 py-4 align-top font-bold text-sm text-slate-800">
                      {row.dealValue || row.deal_value || 'TBD'}
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
        </div>

      </div>
    </div>
  );
};

export default Details;
