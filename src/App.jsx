import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import MainLayout from "./charts/components/layout/MainLayout";
import LandingPage from "./pages/landing";
import DashboardPage from "./pages/Home";
import Inventory from "./pages/Inventory";
import AccountPortal from "./pages/dashboard";
import Login from "./pages/Login";
import Details from "./pages/Details";
import History from "./pages/History";
import Settings from "./pages/Settings";

function App() {
  return (
    <div style={{ "overflowY": "hidden" }} className="app">
      <Routes>


        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account" element={<AccountPortal />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/details/:companyName" element={<Details />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>



        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </div>
  );
}

export default App;