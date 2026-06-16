import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Search, Building2, TrendingUp, Calendar, ArrowRight, Activity, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// PAST_COMPANIES is fetched dynamically from the API

const History = () => {
  const navigate = useNavigate();
  const [pastCompanies, setPastCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          setPastCompanies(data.data || []);
        } else {
          console.error("Failed to fetch history");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <HistoryIcon className="w-6 h-6" />
            </div>
            Search History
          </h1>
          <p className="text-gray-500 mt-2">View your past company searches and analysis details.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter history..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading history...</div>
        ) : pastCompanies.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No history found.</div>
        ) : pastCompanies.map((company) => (
          <Link key={company.id} to={`/details/${encodeURIComponent(company.name)}`}>
            <div
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-gray-400" />
                        {company.industry}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(company.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 md:gap-8 ml-16 md:ml-0">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 mb-1">Match Score</span>
                    <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {company.score}%
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 mb-1">Status</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${company.status === 'Analyzed' ? 'bg-green-50 text-green-700 border-green-200' :
                      company.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                      {company.status}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/details/${encodeURIComponent(company.name)}`)}
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile View Details Button */}
              <button
                onClick={() => navigate(`/details/${encodeURIComponent(company.name)}`)}
                className="mt-4 w-full md:hidden flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
