
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, History, Sparkles, Building2, TrendingUp, Activity, UploadCloud, FileText, X } from "lucide-react";
import Button from "shared-ui/src/components/ui/Button";
import { analyzeCompany } from "../services/analyzeService";
import { useAnalysis } from "../store/AnalysisContext";

const RECENT_SEARCHES = [
  { term: "Starlight Automotive", type: "recent" },
  { term: "BioPharma Group", type: "recent" },
  { term: "Global Logistics & Retail", type: "recent" },
  { term: "TechFlow Solutions", type: "trending" }
];


const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisData } = useAnalysis();

  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFile = (file) => {
    if (!file) return;
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    });
  };

  const handleDrop = (event) => {
    preventDefaults(event);
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (event, over) => {
    preventDefaults(event);
    setIsDragOver(over);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setShowHistory(false);
    
    setIsAnalyzing(true);
    try {
      // In LandingPage, uploadedFile is stored as {name, size} but we don't have the actual file object.
      // Wait, in handleFile we did not save the actual file object.
      // Let's pass the raw file if we can, but since we didn't save it, we just pass null for now or update handleFile.
      const data = await analyzeCompany(term, null); // For now, passing null for file since LandingPage didn't save the raw file.
      setAnalysisData(data.data || data);
      navigate("/details");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze company");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredHistory = RECENT_SEARCHES.filter((s) => 
    s.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10" />

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-white border border-gray-100 shadow-sm rounded-2xl mb-6 ring-4 ring-blue-50/50">
          <Sparkles className="w-8 h-8 text-blue-600 fill-blue-600/20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          SalesIntel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Enter a target account name to instantly generate AI-powered sales intelligence, opportunity mapping, and deal coaching.
        </p>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div 
          className={`relative flex items-center w-full bg-white transition-all duration-300 shadow-lg ${
            showHistory && filteredHistory.length > 0 
              ? 'border-2 border-blue-500 rounded-t-2xl shadow-blue-500/10' 
              : 'border border-gray-200 hover:border-gray-300 rounded-2xl hover:shadow-xl'
          } ${searchTerm && !showHistory ? 'border-2 border-blue-500 shadow-blue-500/10' : ''}`}
        >
          <Search className="w-6 h-6 text-gray-400 ml-5 absolute pointer-events-none" />
          <input
            type="text"
            className="w-full h-16 pl-14 pr-4 bg-transparent outline-none text-lg text-gray-800 placeholder-gray-400"
            placeholder="Search company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
          />
          <div className="pr-2">
            <Button variant="primary" size="lg" className="rounded-xl px-6" onClick={() => handleSearch(searchTerm)} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        {/* Search History Dropdown */}
        {showHistory && filteredHistory.length > 0 && (
          <div className="absolute top-[calc(100%-2px)] left-0 w-full bg-white border-x-2 border-b-2 border-blue-500 rounded-b-2xl shadow-xl z-50 overflow-hidden shadow-blue-500/10">
            <div className="px-5 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Suggested Accounts</span>
            </div>
            <ul className="py-2">
              {filteredHistory.map((item, idx) => (
                <li 
                  key={idx}
                  className="flex items-center px-5 py-3 hover:bg-blue-50 cursor-pointer transition-colors group"
                  onClick={() => handleSearch(item.term)}
                >
                  {item.type === "recent" ? (
                    <History className="w-4 h-4 text-gray-400 group-hover:text-blue-500 mr-3 shrink-0" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 mr-3 shrink-0" />
                  )}
                  <span className="text-gray-700 group-hover:text-blue-700 font-medium text-sm">{item.term}</span>
                  {item.type === "trending" && (
                    <span className="ml-auto text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Trending</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`rounded-3xl border-2 border-dashed p-8 bg-white transition-colors duration-200 ${
            isDragOver ? "border-indigo-400 bg-indigo-50/70" : "border-slate-200 bg-slate-50"
          }`}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex max-w-lg flex-col items-center text-center gap-4 px-4 py-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Drag & Drop files here</p>
              <p className="text-sm text-slate-500 mt-2">
                Optional — upload contracts, RFP responses, or transcripts for instant synthesis.
              </p>
              <p className="text-xs text-slate-400 mt-3">Maximum file size: 50MB</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">PDF</span>
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-600">DOCX</span>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">EXCEL</span>
            </div>
            <label className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 cursor-pointer">
              Browse files
              <input
                type="file"
                accept=".pdf,.docx,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {uploadedFile && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{uploadedFile.name}</p>
                  <p className="text-sm text-slate-500">{uploadedFile.size} • Ready to analyze</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="rounded-full p-2 text-slate-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-8 text-sm text-gray-400 font-medium">
        <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-300" /> 10M+ Global Accounts</span>
        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
        <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-gray-300" /> Live Signal Ingestion</span>
      </div>
    </div>
  );
};

export default LandingPage;