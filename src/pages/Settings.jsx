import React, { useState, useEffect } from "react";
import { 
  Palette, 
  Layout, 
  History, 
  Trash2, 
  Globe, 
  Check,
  RefreshCw,
  Search
} from "lucide-react";
import Button from "shared-ui/src/components/ui/Button";

const Settings = () => {
  // 1. Appearance & UI Preferences
  const [theme, setTheme] = useState(localStorage.getItem("app_theme") || "system");
  const [density, setDensity] = useState(localStorage.getItem("app_density") || "comfortable");

  // 2. Search & History Management
  const [searchSuggestions, setSearchSuggestions] = useState(
    localStorage.getItem("app_search_suggestions") !== "false"
  );

  // 3. Localization & Formatting
  const [currency, setCurrency] = useState(localStorage.getItem("app_currency") || "USD");

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    localStorage.setItem("app_density", density);
    localStorage.setItem("app_search_suggestions", searchSuggestions.toString());
    localStorage.setItem("app_currency", currency);
  }, [theme, density, searchSuggestions, currency]);

  const handleClearHistory = () => {
    // In a real app, this would clear the state/context
    alert("Search history has been cleared.");
  };

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear all cached data and uploaded documents? This cannot be undone.")) {
      localStorage.clear();
      // Restore the just-cleared settings so the UI doesn't break
      localStorage.setItem("app_theme", theme);
      localStorage.setItem("app_density", density);
      localStorage.setItem("app_search_suggestions", searchSuggestions.toString());
      localStorage.setItem("app_currency", currency);
      alert("All cached data and uploaded documents have been reset.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your app preferences, data, and localization.</p>
      </div>

      <div className="space-y-8">
        
        {/* Appearance & UI Preferences */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Palette className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-800">Appearance & UI Preferences</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Theme Selection</label>
              <div className="flex flex-wrap gap-4">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium capitalize transition-all ${
                      theme === t 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {theme === t && <Check className="w-4 h-4" />}
                    {t} Mode
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            {/* Layout Density */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Layout className="w-4 h-4 text-gray-400" />
                Layout Density
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setDensity("comfortable")}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    density === "comfortable" ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-800 mb-1 flex justify-between">
                    Comfortable {density === "comfortable" && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-gray-500">More spacing, relaxed typography. Best for reading.</p>
                </div>
                <div 
                  onClick={() => setDensity("compact")}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    density === "compact" ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-800 mb-1 flex justify-between">
                    Compact {density === "compact" && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-gray-500">Tighter spacing, fits more data on screen. Best for dense tables.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & History Management */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <History className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-800">Search & History Management</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Search Suggestions */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  Search Suggestions
                </h3>
                <p className="text-sm text-gray-500 mt-1">Enable AI-suggested trending companies on the search bar.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={searchSuggestions}
                  onChange={(e) => setSearchSuggestions(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            {/* Clear History */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Clear Search History</h3>
                <p className="text-sm text-gray-500 mt-1">Wipe recent searches shown on the landing page and history.</p>
              </div>
              <Button variant="secondary" onClick={handleClearHistory} className="border-gray-200 text-gray-700 hover:bg-gray-100">
                <History className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            {/* Clear Cache */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-600">Clear Cache / Saved Data</h3>
                <p className="text-sm text-gray-500 mt-1">A master reset to clear all uploaded documents and analysis.</p>
              </div>
              <Button variant="danger" onClick={handleClearCache} className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Data
              </Button>
            </div>
          </div>
        </section>

        {/* Localization & Formatting */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-gray-800">Localization & Formatting</h2>
          </div>
          
          <div className="p-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Currency Formatting</label>
              <p className="text-sm text-gray-500 mb-4">Set the default currency for revenue and financial data.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { code: "USD", symbol: "$", name: "US Dollar" },
                  { code: "EUR", symbol: "€", name: "Euro" },
                  { code: "GBP", symbol: "£", name: "British Pound" },
                  { code: "INR", symbol: "₹", name: "Indian Rupee" },
                ].map((c) => (
                  <div 
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center text-center transition-all ${
                      currency === c.code ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-xl font-bold mb-1 ${currency === c.code ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {c.symbol}
                    </span>
                    <span className="font-semibold text-sm text-gray-800">{c.code}</span>
                    <span className="text-xs text-gray-500">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;
