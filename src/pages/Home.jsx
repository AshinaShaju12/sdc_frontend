import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../store/SettingsContext";
import {
  Package,
  FileText,
  Target,
  Users,
  Briefcase,
  PieChart,
  Lightbulb,
  Award,
  TrendingUp,
  AlertCircle,
  Search,
  DollarSign,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  RefreshCw,
  FolderOpen,
  ArrowRight
} from "lucide-react";
import { Button, Card, CardHeader, CardContent } from "shared-ui";

const PremiumStatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      {trendValue && (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
          trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {trendValue}
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  </div>
);

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  // States for dynamic full DB collections
  const [modalData, setModalData] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("/api/dashboard", {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then(res => res.json())
      .then(data => {
        setDashboardData(data.data || data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!activeModal) {
      setModalData([]);
      setModalError(null);
      setIsModalLoading(false);
      setSearchQuery("");
      setSelectedCategory("All");
      return;
    }

    setIsModalLoading(true);
    setModalError(null);

    let endpoint = "";
    if (activeModal === "products") {
      endpoint = "/api/companydata/product details?limit=100";
    } else if (activeModal === "case-studies") {
      endpoint = "/api/companydata/case studies?limit=100";
    } else if (activeModal === "opportunities") {
      endpoint = "/api/companydata/Opportunity History?limit=100";
    }

    fetch(endpoint, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const items = data.data?.items || data.items || data || [];
        setModalData(items);
        setIsModalLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching full ${activeModal} from DB:`, err);
        setModalError(`Failed to retrieve records from MongoDB: ${err.message}`);
        setIsModalLoading(false);
      });
  }, [activeModal]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading Enterprise Insights...</p>
        </div>
      </div>
    );
  }

  const {
    overview = {},
    productPortfolio = [],
    topSellingSolutions = [],
    recentCaseStudies = [],
    opportunityPipeline = [],
    crmActivity = {},
    proposalAnalytics = {},
    aiRecommendations = []
  } = dashboardData || {};

  // Filter logic for full lists shown in modals
  const filteredData = modalData.filter(item => {
    if (!item) return false;
    const q = searchQuery.toLowerCase();
    
    if (activeModal === 'products') {
      const matchesSearch = 
        (item.productName || "").toLowerCase().includes(q) ||
        (item.productId || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.technology || "").toLowerCase().includes(q) ||
        (item.application || "").toLowerCase().includes(q);
      
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
    
    if (activeModal === 'case-studies') {
      return (
        (item.client || "").toLowerCase().includes(q) ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.industry || "").toLowerCase().includes(q) ||
        (item.results || "").toLowerCase().includes(q) ||
        (item.challenge || "").toLowerCase().includes(q) ||
        (item.solution || "").toLowerCase().includes(q)
      );
    }
    
    if (activeModal === 'opportunities') {
      return (
        (item.companyName || "").toLowerCase().includes(q) ||
        (item.opportunityId || "").toLowerCase().includes(q) ||
        (item.salesStage || "").toLowerCase().includes(q) ||
        (item.assignedSalesRep || "").toLowerCase().includes(q) ||
        (item.nextAction || "").toLowerCase().includes(q)
      );
    }
    
    return true;
  });

  const uniqueCategories = activeModal === 'products' 
    ? ["All", ...new Set(modalData.map(item => item.category).filter(Boolean))]
    : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 pb-12">
      
      {/* SECTION 1: Company Overview Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Briefcase className="h-3.5 w-3.5" /> Internal Executive Dashboard
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                NovaChem Solutions Pvt Ltd
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl">
                Advanced Chemical & Industrial Solutions for Sustainable Manufacturing
              </p>
            </div>
            
            <div className="flex pt-4 md:pt-0">
              <Link 
                to="/analyse" 
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Analyse
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* SECTION 2: Executive KPI Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PremiumStatCard
            title="Total Products"
            value={overview.totalProducts || 0}
            icon={Package}
            trend="neutral"
            trendValue="Active Catalog"
            subtitle="Available commercial solutions"
            onClick={() => setActiveModal('products')}
          />
          <PremiumStatCard
            title="Case Studies Delivered"
            value={overview.totalCaseStudies || 0}
            icon={FileText}
            trend="up"
            trendValue="Growing"
            subtitle="Documented successful deployments"
            onClick={() => setActiveModal('case-studies')}
          />
          <PremiumStatCard
            title="Active Opportunities"
            value={overview.activeOpportunities || 0}
            icon={Target}
            trend="up"
            trendValue="Pipeline"
            subtitle="Engagements in progress"
            onClick={() => setActiveModal('opportunities')}
          />
          <PremiumStatCard
            title="Proposal Success Rate"
            value={`${overview.proposalSuccessRate || 0}%`}
            icon={Award}
            trend="up"
            trendValue="High"
            subtitle="Win / Total Proposals ratio"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* SECTION 3: Product Portfolio Overview */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center gap-3 py-4">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Product Portfolio</h2>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-center">
              <div className="space-y-4">
                {productPortfolio.map((cat, idx) => {
                  const total = productPortfolio.reduce((acc, curr) => acc + curr.count, 0) || 1;
                  const percentage = Math.round((cat.count / total) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm font-medium text-slate-700">
                        <span>{cat.category}</span>
                        <span>{cat.count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: Top Selling Solutions */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-900">Top Selling Solutions</h2>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Product Name</th>
                      <th className="px-6 py-4 font-medium text-center">Opportunities</th>
                      <th className="px-6 py-4 font-medium text-right">Estimated Revenue Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topSellingSolutions.map((sol, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {sol.productName}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs">
                            {sol.opportunities}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                          {sol.revenueImpact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 9: AI Strategic Recommendations */}
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
          <CardHeader className="border-b border-white/10 flex items-center gap-3 py-4">
            <Lightbulb className="w-5 h-5 text-indigo-300" />
            <h2 className="text-lg font-semibold text-white">AI Strategic Recommendations</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {aiRecommendations.length > 0 ? aiRecommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-50 leading-relaxed">
                    {rec}
                  </p>
                </div>
              )) : (
                <div className="flex items-center gap-3 text-indigo-200 text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <p>No strategic insights generated yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* MODAL OVERLAY */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            
            {/* Custom scrollbar hiding styling */}
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white shrink-0 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  {activeModal === 'products' && <Package className="h-5 w-5" />}
                  {activeModal === 'case-studies' && <FileText className="h-5 w-5" />}
                  {activeModal === 'opportunities' && <Target className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeModal === 'products' && 'Enterprise Product Catalog'}
                    {activeModal === 'case-studies' && 'Client Case Studies'}
                    {activeModal === 'opportunities' && 'Active Opportunities & Deals'}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Showing {filteredData.length} of {modalData.length} records fetched from MongoDB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder={`Search ${activeModal}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 placeholder-slate-400 shadow-sm"
                  />
                </div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Category Pills (Products only) */}
            {activeModal === 'products' && uniqueCategories.length > 1 && (
              <div className="px-6 py-3 border-b border-slate-100 flex flex-nowrap overflow-x-auto gap-2 bg-white shrink-0 relative z-10 no-scrollbar whitespace-nowrap">
                {uniqueCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
              {isModalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                  <p className="text-sm font-semibold text-slate-500">Querying database...</p>
                </div>
              ) : modalError ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-800">
                  <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
                  <h3 className="font-bold text-lg">Failed to Query Database</h3>
                  <p className="text-sm text-rose-600 max-w-md mt-1">{modalError}</p>
                  <button 
                    onClick={() => setActiveModal(activeModal)} 
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
                  </button>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                  <FolderOpen className="w-12 h-12 text-slate-300 mb-3" />
                  <h4 className="font-semibold text-slate-800">No records found</h4>
                  <p className="text-xs max-w-xs mt-1">Try modifying your search filter or category selection.</p>
                </div>
              ) : (
                <>
                  {/* PRODUCTS LIST */}
                  {activeModal === 'products' && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {filteredData.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between">
                          <div className="space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{item.productId || `NC${idx}`}</span>
                                  <h3 className="font-bold text-slate-900 leading-snug">{item.productName}</h3>
                                </div>
                                <span className="shrink-0 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wide">
                                  {item.category}
                                </span>
                              </div>
                              
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                {item.description || "No description provided."}
                              </p>
                              
                              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-50 text-[11px]">
                                <div>
                                  <span className="block text-slate-400 font-medium">Technology</span>
                                  <span className="font-semibold text-slate-700">{item.technology || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="block text-slate-400 font-medium">Application</span>
                                  <span className="font-semibold text-slate-700">{item.application || "N/A"}</span>
                                </div>
                              </div>
                              
                              {item.esgImpact && (
                                <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 text-emerald-800 rounded-lg p-2 text-[10px] font-semibold border border-emerald-100/50">
                                  <Sparkles className="h-3 w-3 text-emerald-600 shrink-0" />
                                  <span className="line-clamp-2">
                                    ESG: {item.esgImpact.toLowerCase().startsWith("esg:") ? item.esgImpact.slice(4).trim() : item.esgImpact}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                              <span className="text-sm font-bold text-indigo-600">
                                {item.price ? `₹${item.price.toLocaleString('en-IN')}` : "Contact Sales"}
                                {item.unit ? <span className="text-slate-400 font-normal text-[10px]"> / {item.unit}</span> : ""}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-medium">Stock Availability</span>
                              <span className={`text-xs font-bold ${item.stock > 20 ? 'text-emerald-600' : item.stock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {item.stock !== undefined ? `${item.stock} Units` : "In Stock"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CASE STUDIES LIST */}
                  {activeModal === 'case-studies' && (
                    <div className="space-y-6">
                      {filteredData.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-emerald-200 hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">{item.caseStudyId || `CS${idx}`}</span>
                                {item.completionYear && <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 font-bold">{item.completionYear}</span>}
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                <span className="font-bold text-slate-600">{item.client}</span>
                                {item.location && <span>• {item.location}</span>}
                              </div>
                            </div>
                            <span className="self-start sm:self-center shrink-0 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">
                              {item.industry}
                            </span>
                          </div>
                          
                          <div className="grid gap-4 mt-4 sm:grid-cols-2 text-xs">
                            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50">
                              <span className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Challenge</span>
                              <p className="text-slate-600 leading-relaxed">{item.challenge}</p>
                            </div>
                            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50">
                              <span className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Solution Deployed</span>
                              <p className="text-slate-600 leading-relaxed">{item.solution}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/30 text-xs">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <span className="block font-bold text-emerald-800 uppercase tracking-wider text-[10px] mb-0.5">Results</span>
                                <p className="font-semibold text-emerald-700">{item.results}</p>
                              </div>
                              {item.roiImpact && (
                                <div>
                                  <span className="block font-bold text-emerald-800 uppercase tracking-wider text-[10px] mb-0.5">ROI Impact</span>
                                  <p className="font-semibold text-emerald-700">{item.roiImpact}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {item.productsUsed && item.productsUsed.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Products:</span>
                              {item.productsUsed.map((p, pIdx) => (
                                <span key={pIdx} className="bg-slate-100 text-slate-600 font-semibold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* OPPORTUNITIES LIST */}
                  {activeModal === 'opportunities' && (
                    <div className="space-y-4">
                      {filteredData.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-violet-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{item.opportunityId || `OPP${idx}`}</span>
                              <span className="text-[10px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-violet-100">{item.industry}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                                item.opportunityStatus === 'Open' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                item.opportunityStatus === 'Won' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {item.opportunityStatus}
                              </span>
                            </div>
                            
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-lg">{item.companyName}</h3>
                              <p className="text-xs text-slate-400">Assigned Rep: <span className="font-semibold text-slate-600">{item.assignedSalesRep || "Unassigned"}</span></p>
                            </div>
                            
                            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs max-w-xl">
                              <span className="block font-bold text-slate-500 uppercase tracking-widest text-[9px] mb-0.5">Next Action</span>
                              <p className="font-medium text-slate-800 leading-snug">{item.nextAction || "N/A"}</p>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col justify-between md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 md:w-52">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] text-slate-400 block font-medium">Deal Value</span>
                              <span className="text-xl font-bold text-violet-600">
                                {item.dealValue ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.dealValue) : "N/A"}
                              </span>
                            </div>
                            
                            <div className="w-full max-w-[150px] md:max-w-none text-right space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                <span>Probability</span>
                                <span className="text-slate-800">{item.winProbability}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    item.winProbability > 70 ? 'bg-emerald-500' : item.winProbability > 40 ? 'bg-indigo-500' : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${item.winProbability}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="hidden md:block text-right">
                              <span className="text-[10px] text-slate-400 block font-medium">Sales Stage</span>
                              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {item.salesStage}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
