import React, { useState, useEffect } from "react";
import { useSettings } from "../store/SettingsContext";
import {
  Package,
  FileText,
  Target,
  Users,
  Briefcase,
  PieChart,
  BarChart,
  Activity,
  CheckCircle,
  Lightbulb,
  Award,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button, Card, CardHeader, CardContent } from "shared-ui";

const PremiumStatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle }) => (
  <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
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

  useEffect(() => {
    fetch("/api/dashboard")
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
            
            <div className="flex gap-6 pt-4 md:pt-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{overview.totalProducts || 0}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Products</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{overview.totalCaseStudies || 0}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Case Studies</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{overview.activeOpportunities || 0}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Opportunities</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{overview.activeCustomers || 0}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Customers</p>
              </div>
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
          />
          <PremiumStatCard
            title="Case Studies Delivered"
            value={overview.totalCaseStudies || 0}
            icon={FileText}
            trend="up"
            trendValue="Growing"
            subtitle="Documented successful deployments"
          />
          <PremiumStatCard
            title="Active Opportunities"
            value={overview.activeOpportunities || 0}
            icon={Target}
            trend="up"
            trendValue="Pipeline"
            subtitle="Engagements in progress"
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* SECTION 5: Recent Case Studies */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center gap-3 py-4">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Recent Case Studies</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentCaseStudies.map((cs, idx) => (
                  <div key={idx} className="group relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{cs.clientName}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">{cs.projectTitle}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {cs.industry}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <p className="text-sm font-medium text-emerald-700">{cs.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 6: Opportunity Pipeline */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center gap-3 py-4">
              <BarChart className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Opportunity Pipeline</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {opportunityPipeline.map((stage, idx) => {
                  const maxCount = Math.max(...opportunityPipeline.map(s => s.count)) || 1;
                  const widthPercentage = Math.round((stage.count / maxCount) * 100);
                  
                  // Funnel colors mapping
                  const colorMap = {
                    'Lead': 'bg-slate-300',
                    'Qualified': 'bg-indigo-300',
                    'Proposal Sent': 'bg-indigo-400',
                    'Negotiation': 'bg-indigo-500',
                    'Won': 'bg-emerald-500',
                    'Lost': 'bg-rose-400'
                  };
                  const barColor = colorMap[stage.stage] || 'bg-slate-400';

                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-28 text-sm font-medium text-slate-600 text-right shrink-0">
                        {stage.stage}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="h-8 w-full rounded-full bg-slate-50 overflow-hidden flex-1">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${barColor}`} 
                            style={{ width: `${widthPercentage}%` }}
                          />
                        </div>
                        <div className="w-8 text-sm font-bold text-slate-900 shrink-0">
                          {stage.count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* SECTION 7: CRM Activity Summary */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center gap-3 py-4">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">CRM Activity</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Meetings (MTD)</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{crmActivity.meetingsThisMonth || 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes Added</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{crmActivity.notesAdded || 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interactions</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{crmActivity.customerInteractions || 0}</p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100">
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Follow-Ups</p>
                  <p className="mt-2 text-2xl font-bold text-orange-700">{crmActivity.followUpsPending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 8: Proposal Analytics */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex items-center gap-3 py-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Proposal Analytics</h2>
            </CardHeader>
            <CardContent className="p-6 flex flex-col justify-center">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-slate-900">{proposalAnalytics.total || 0}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">Total Proposals Generated</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-xl bg-emerald-50">
                  <p className="text-xl font-bold text-emerald-700">{proposalAnalytics.approved || 0}</p>
                  <p className="text-xs font-medium text-emerald-600 mt-1 uppercase">Approved</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-rose-50">
                  <p className="text-xl font-bold text-rose-700">{proposalAnalytics.rejected || 0}</p>
                  <p className="text-xs font-medium text-rose-600 mt-1 uppercase">Rejected</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-50">
                  <p className="text-xl font-bold text-amber-700">{proposalAnalytics.pending || 0}</p>
                  <p className="text-xs font-medium text-amber-600 mt-1 uppercase">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

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

      </div>
    </div>
  );
}
