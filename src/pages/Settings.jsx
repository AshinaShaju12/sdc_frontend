import React, { useState, useEffect } from "react";
import { 
  Palette, 
  Layout, 
  History, 
  Trash2, 
  Check,
  RefreshCw,
  Search
} from "lucide-react";
import Button from "shared-ui/src/components/ui/Button";

import { useSettings } from "../store/SettingsContext";

const Settings = () => {
  const {
    theme,
    setTheme,
    density,
    setDensity,
    searchSuggestions,
    setSearchSuggestions,
    currency,
    setCurrency,
  } = useSettings();

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your search history from the database?")) {
      try {
        const res = await fetch("/api/history", { method: "DELETE" });
        if (res.ok) {
          alert("Search history has been cleared.");
        } else {
          alert("Failed to clear search history.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
      }
    }
  };

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear all cached data? This will reset all preferences.")) {
      localStorage.clear();
      // Reset settings states
      setTheme("system");
      setDensity("comfortable");
      setSearchSuggestions(true);
      setCurrency("USD");
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
                {["light", "dark"].map((t) => (
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

      </div>
    </div>
  );
};

export default Settings;
