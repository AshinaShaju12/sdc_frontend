import React, { useState, useEffect } from "react";
import { useAnalysis } from "../store/AnalysisContext";
import { analyzeCompany } from "../services/analyzeService";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Bell,
  PieChart,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  SearchFilterBar,
  StatCard,
  RecommendationCard,
} from "shared-ui";

const filters = [
  { id: "all", label: "All" },
  { id: "pipeline", label: "Pipeline" },
  { id: "accounts", label: "Accounts" },
  { id: "signals", label: "Signals" },
];

const stats = [
  {
    title: "Revenue Pipeline",
    value: "$1.2B",
    trend: "up",
    trendValue: "+5.2%",
    icon: TrendingUp,
    subtitle: "since last quarter",
  },
  {
    title: "Active Accounts",
    value: "450",
    trend: "neutral",
    trendValue: "Current",
    icon: ShieldCheck,
    subtitle: "high-priority coverage",
  },
  {
    title: "AI Win Prob",
    value: "68%",
    trend: "up",
    trendValue: "+8 pts",
    icon: Sparkles,
    subtitle: "based on deal fit",
  },
  {
    title: "Total High Priority Ops",
    value: "1.2k",
    trend: "neutral",
    trendValue: "Stable",
    icon: Bell,
    subtitle: "across segments",
  },
];

const recommendations = [
  {
    message: "Nexus Global Systems: +92% match with enterprise data migration",
    type: "critical",
    action: "View opportunity",
  },
  {
    message: "Aether Logistics: AI signal detected for cloud refresh",
    type: "warning",
    action: "Review account",
  },
  {
    message: "Summit Financial: cybersecurity audit opportunity",
    type: "info",
    action: "Explore deal",
  },
];

const targetAccounts = [
  { name: "Volt Energy", category: "Energy" },
  { name: "Orion Space", category: "Aerospace" },
  { name: "Zenith Fin", category: "Fintech" },
  { name: "BioStream", category: "Healthcare" },
];

const signals = [
  {
    label: "Just now",
    title: "Nexus Global CFO mentioned AI expansion in earnings call.",
  },
  {
    label: "2 hours ago",
    title: "Industry shift detected in EMEA region cloud spend.",
  },
  {
    label: "4 hours ago",
    title: "Competitor announced new security offering in US East.",
  },
];

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dashboardData, setDashboardData] = useState(null);
  
  const [companyInput, setCompanyInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  
  const { setAnalysisData, isAnalyzing, setIsAnalyzing } = useAnalysis();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!companyInput) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeCompany(companyInput, fileInput);
      setAnalysisData(data.data || data);
      navigate("/details");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze company");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetch("/api/dashboard-summary")
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, []);

  const currentStats = dashboardData?.stats || stats;
  const currentRecommendations = dashboardData?.recommendations || recommendations;
  const currentTargetAccounts = dashboardData?.target_accounts || dashboardData?.targetAccounts || targetAccounts;
  const currentSignals = dashboardData?.signals || signals;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-600 font-semibold">
              Executive Overview
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950">
              Enterprise AI Sales Intelligence Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Monitor pipeline momentum, account signals, and AI recommendations in one connected workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="secondary" className="px-5 py-3">
              Filter
            </Button>
            <Button className="px-5 py-3 flex items-center gap-2">
              Generate Insights
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Run Deep Analysis</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Asian Paints" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={companyInput}
                onChange={e => setCompanyInput(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-slate-700">Supplemental Documents (Optional)</label>
              <input 
                type="file" 
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                onChange={e => setFileInput(e.target.files[0])}
              />
            </div>
            <Button className="px-6 py-2.5 h-[42px]" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing (approx 30s)..." : "Analyze"}
            </Button>
          </div>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search accounts, stakeholders, or deal histories..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="grid gap-5 xl:grid-cols-4">
          {currentStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.6fr_0.95fr]">
          <Card className="overflow-hidden">
            <CardHeader className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Revenue Growth Trend</p>
                <h2 className="text-xl font-semibold text-slate-950">Projected vs. Actual</h2>
              </div>
              <Button variant="secondary" className="px-4 py-2 text-sm">
                View Report
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative h-64 rounded-[28px] bg-gradient-to-b from-slate-100 to-white p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_40%)]" />
                <div className="relative h-full">
                  <div className="absolute inset-x-0 top-6 h-px bg-slate-200" />
                  <div className="absolute inset-x-0 top-28 h-px bg-slate-200" />
                  <div className="absolute inset-x-0 top-44 h-px bg-slate-200" />
                  <div className="absolute inset-x-0 top-56 h-px bg-slate-200" />
                  <div className="absolute inset-x-0 bottom-6 h-px bg-slate-200" />
                  <div className="absolute left-8 right-8 bottom-10 h-0.5 rounded-full bg-indigo-400"
                    style={{ transform: "translateY(-4px)" }}
                  />
                  <div className="absolute left-12 bottom-24 w-2 h-2 rounded-full bg-indigo-600" />
                  <div className="absolute left-24 bottom-32 w-2 h-2 rounded-full bg-slate-500" />
                  <div className="absolute left-36 bottom-20 w-2 h-2 rounded-full bg-indigo-600" />
                  <div className="absolute left-52 bottom-28 w-2 h-2 rounded-full bg-slate-500" />
                  <div className="absolute left-64 bottom-16 w-2 h-2 rounded-full bg-indigo-600" />
                  <div className="absolute left-80 bottom-24 w-2 h-2 rounded-full bg-slate-500" />
                  <div className="absolute left-96 bottom-14 w-2 h-2 rounded-full bg-indigo-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  Projected
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                  Actual
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Industry Segmentation</p>
                <h2 className="text-xl font-semibold text-slate-950">Top Sector</h2>
              </div>
              <Button variant="secondary" className="px-4 py-2 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-[28px] bg-slate-50 p-4 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Top Sector</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">SaaS</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Market Signals</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">8</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Technology & Fintech</span>
                    <span>62%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[62%] rounded-full bg-indigo-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Finance & Fintech</span>
                    <span>28%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[28%] rounded-full bg-slate-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Healthcare</span>
                    <span>18%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[18%] rounded-full bg-slate-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_0.9fr]">
          <RecommendationCard title="AI Recommended" recommendations={currentRecommendations} />

          <Card>
            <CardHeader className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Target Accounts</p>
                <h2 className="text-lg font-semibold text-slate-950">Opportunity shortlist</h2>
              </div>
              <Button variant="secondary" className="px-4 py-2 text-sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentTargetAccounts.map((account) => (
                <div
                  key={account.name}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{account.name}</p>
                      <p className="text-sm text-slate-500">{account.category}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.25em] text-indigo-600 font-semibold">
                      Priority
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Market Signals</p>
                <h2 className="text-lg font-semibold text-slate-950">Urgent updates</h2>
              </div>
              <Button variant="secondary" className="px-4 py-2 text-sm">
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSignals.map((signal) => (
                <div key={signal.title} className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-500 uppercase tracking-[0.28em] font-semibold">
                    <span>{signal.label}</span>
                    <span className="text-emerald-600">Live</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{signal.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
