import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AnalysisProvider } from './store/AnalysisContext';
import { SettingsProvider } from './store/SettingsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AnalysisProvider>
          <App />
        </AnalysisProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
