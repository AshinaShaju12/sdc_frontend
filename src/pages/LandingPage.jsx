import React, { useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button, Input } from "shared-ui";

const PRESETS = [
  { title: "Executive Alignment", description: "Find gaps in C-suite relationships." },
  { title: "Competitive Displacement", description: "Analyze competitor renewal dates." },
  { title: "Risk Mitigation", description: "Surface procurement red flags." },
];

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({
    name: "Q3_Review_Microsoft.pdf",
    size: "2.4 MB",
  });

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      });
    }
  };

  const handleDrag = (event, value) => {
    event.preventDefault();
    setIsDragOver(value);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <section className="space-y-4 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">Account Search</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-950">
            AI Deal Intelligence Search
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-600">
            Aggregate insights from across your enterprise ecosystem. Ingest documents and let AI map your path to the executive suite.
          </p>
        </section>

        <div className="mt-8 rounded-full bg-white/95 border border-slate-200 shadow-sm shadow-slate-200/50 p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="material-symbols-outlined text-indigo-600 text-3xl">auto_awesome</span>
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search accounts, stakeholders, or deal histories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full border-0 bg-transparent py-4 px-5 text-base shadow-none focus:ring-0"
            />
          </div>
          <Button variant="primary" size="lg" className="rounded-full px-8 flex items-center gap-2">
            <span>SEARCH</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Document Ingestion</h2>
                <p className="text-sm text-slate-500">Upload contracts, RFP responses, or transcripts for instant synthesis.</p>
              </div>
              <CloudUpload className="w-9 h-9 text-slate-400" />
            </div>

            <div
              className={`rounded-[28px] border-2 border-dashed p-12 flex flex-col items-center justify-center gap-4 text-center transition-all duration-300 cursor-pointer ${
                isDragOver ? "border-indigo-400 bg-indigo-50/70" : "border-slate-200 bg-slate-50"
              }`}
              onDragEnter={(e) => handleDrag(e, true)}
              onDragOver={(e) => handleDrag(e, true)}
              onDragLeave={(e) => handleDrag(e, false)}
              onDrop={handleDrop}
            >
              <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-950">Drag & Drop files here</p>
                <p className="text-sm text-slate-500">Maximum file size: 50MB</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-xs font-semibold">PDF</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">DOCX</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">EXCEL</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-600">picture_as_pdf</span>
                <div>
                  <p className="font-medium text-slate-950">{uploadedFile.name}</p>
                  <p className="text-sm text-slate-500">{uploadedFile.size} • Ready to analyze</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-red-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">Intelligent Presets</p>
              <div className="space-y-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    className="w-full text-left rounded-2xl border border-transparent p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <p className="text-base font-semibold text-slate-950">{preset.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80"
                alt="Data Visualization Dashboard"
                className="w-full h-[320px] object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent p-6 flex flex-col justify-end">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 mb-1">PRO FEATURE</p>
                <h3 className="text-2xl font-semibold text-white leading-tight">Advanced Relationship Mapping</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="primary" size="lg" className="rounded-3xl px-10 py-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl">psychology</span>
            <div className="text-left">
              <span className="block text-lg font-semibold">Analyze Account Intelligence</span>
              <span className="block text-xs uppercase tracking-[0.32em] text-white/80">AI ENGINE: V4.2 CORE</span>
            </div>
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
