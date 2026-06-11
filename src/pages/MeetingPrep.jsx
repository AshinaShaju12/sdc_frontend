import React from "react";
import { useAnalysis } from "../store/AnalysisContext";
import { Users, FileText, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { Card } from "shared-ui";

export default function MeetingPrep() {
  const { analysisData } = useAnalysis();

  if (!analysisData) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-500">
        No analysis data available. Please run an analysis from the Home page.
      </div>
    );
  }

  const { executive_qbr, meeting_preparation } = analysisData;

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 p-8 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-[#2d1b7a]" />
        <h1 className="text-3xl font-bold text-[#2d1b7a]">Meeting Preparation & QBR</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Executive QBR */}
        <Card className="p-6 border-t-4 border-t-[#352582]">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#352582]" />
            <h2 className="text-xl font-bold">Executive QBR</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Key Business Priorities</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(executive_qbr?.key_business_priorities || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Growth Initiatives</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(executive_qbr?.growth_initiatives || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Risk Factors</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(executive_qbr?.risk_factors || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Buying Signals</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(executive_qbr?.buying_signals || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </Card>

        {/* Meeting Preparation */}
        <Card className="p-6 border-t-4 border-t-emerald-600">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold">Meeting Preparation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Suggested Discussion Points
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(meeting_preparation?.suggested_discussion_points || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Potential Objections
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(meeting_preparation?.potential_objections || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Relevant Case Studies</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(meeting_preparation?.relevant_case_studies || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Stakeholders to Target</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(meeting_preparation?.stakeholders_to_target || []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
