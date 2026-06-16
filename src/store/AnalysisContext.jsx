import React, { createContext, useState, useContext } from 'react';

const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisDataState] = useState(() => {
    try {
      const saved = localStorage.getItem('current_analysis_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to load analysisData from localStorage:", e);
      return null;
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const setAnalysisData = (data) => {
    try {
      if (data) {
        localStorage.setItem('current_analysis_data', JSON.stringify(data));
      } else {
        localStorage.removeItem('current_analysis_data');
      }
    } catch (e) {
      console.error("Failed to save analysisData to localStorage:", e);
    }
    setAnalysisDataState(data);
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData, isAnalyzing, setIsAnalyzing }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
