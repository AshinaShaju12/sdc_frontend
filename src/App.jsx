import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./charts/components/layout/MainLayout";
import Dashboard from "./pages/landing";
import Inventory from "./pages/Inventory";
import AccountPortal from "./pages/dashboard";
import Login from "./pages/Login";

function App() {

  console.log("ook")
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/account" element={<AccountPortal />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>

      

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    
  );
}

export default App;