import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  INR: { symbol: "₹", rate: 83.5 },
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("app_theme") || "system");
  const [density, setDensity] = useState(localStorage.getItem("app_density") || "comfortable");
  const [searchSuggestions, setSearchSuggestions] = useState(
    localStorage.getItem("app_search_suggestions") !== "false"
  );
  const [currency, setCurrency] = useState(localStorage.getItem("app_currency") || "INR");

  // Synchronize with LocalStorage
  useEffect(() => {
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app_density", density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem("app_search_suggestions", searchSuggestions.toString());
  }, [searchSuggestions]);

  useEffect(() => {
    localStorage.setItem("app_currency", currency);
  }, [currency]);

  // Real-time Theme handler
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (currentTheme) => {
      let isDark = false;
      if (currentTheme === "dark") {
        isDark = true;
      } else if (currentTheme === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    };

    applyTheme(theme);

    // Listen for system preference change if in system mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Real-time Layout Density handler
  useEffect(() => {
    const root = document.documentElement;
    if (density === "compact") {
      root.classList.add("layout-compact");
    } else {
      root.classList.remove("layout-compact");
    }
  }, [density]);

  // Currency Formatter helper
  const currencySymbol = CURRENCIES[currency]?.symbol || "$";
  
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "";
    
    // Parse value if string (e.g. "$1.2B" -> 1.2B)
    if (typeof val === "string") {
      // Remove any existing currency prefix/symbol
      const cleanVal = val.replace(/^[$\u20AC\u00A3\u20B9\s]+/, "");
      // Convert to requested currency symbol dynamically
      return `${currencySymbol}${cleanVal}`;
    }
    
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    }).format(val);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        density,
        setDensity,
        searchSuggestions,
        setSearchSuggestions,
        currency,
        setCurrency,
        currencySymbol,
        formatCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
