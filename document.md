# Frontend Project Analysis

## Overview

The `ai_sales_frontend` is a React-based application initialized with Vite. It serves as an AI-enabled sales intelligence dashboard. The application features a modular structure tailored to handle complex features, including data visualization, real-time communication via WebSockets, and AI integrations.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Local Dependency**: `shared-ui` package for reusable UI components.

## Application Architecture

The application entry point is managed through `src/main.jsx` and the routing logic is centralized in `src/App.jsx`. The structure enforces a logical separation of concerns.

### Routing (`App.jsx`)
The application defines multiple routes wrapped around a `MainLayout`. Some core routes include:
- `/` - Landing Page
- `/dashboard` - Main Dashboard View
- `/account` - Account Portal
- `/inventory` - Inventory Management
- `/details/:companyName` - Detailed view of specific companies/accounts
- `/history` - History Logs
- `/settings` - Application Configuration
- Fallback route (`*`) redirects to `/login`.

## Directory Structure & Modules

The `src` directory is organized into domain-specific folders to keep the code scalable:

- **`pages/`**: Contains the main top-level views/screens corresponding to the routes (e.g., `Home.jsx`, `Login.jsx`, `Details.jsx`, `History.jsx`, `LandingPage.jsx`, `Settings.jsx`).
- **`charts/`**: Focused on data visualization. Includes components like `DealPipelineChart.jsx`, `HiringTrendChart.jsx`, `IndustryTrendChart.jsx`, `OpportunityChart.jsx`, `RevenueTrendChart.jsx`, and `SignalHeatmap.jsx`.
- **`ai/`**: Hosts specific views/components relating to AI functionalities.
  - `AgentWorkflow.jsx`
  - `OpportunityScoringView.jsx`
  - `RagPipelineView.jsx`
  - `SignalFlow.jsx`
- **`services/`**: Centralized API interaction modules keeping the UI separated from data fetching logic (`authService.js`, `chatService.js`, `opportunityService.js`, `apiClient.js`, etc.).
- **`store/`**: Likely leverages a state management library or simple context/stubs for global state logic. Includes `accountStore.js`, `authStore.js`, `chatStore.js`, `opportunityStore.js`, etc.
- **`hooks/`**: Custom React hooks handling business logic that ties into services/stores. Features hooks like `useAccounts.js`, `useAuth.js`, `useChat.js`, `useOpportunities.js`, etc.
- **`websocket/`**: Handles real-time functionalities with separate sockets for chat and notifications (`chatSocket.js`, `notificationSocket.js`).
- **`utils/`**: Shared utility functions, constants, formatting, and validation (`constants.js`, `formatters.js`, `helpers.js`, `validators.js`).
- **`layouts/`**: Manages overall page layouts like `MainLayout` wrapping the core app content.

## Conclusion

The repository is built as a robust and scalable modern React application. It heavily isolates different responsibilities (views, data fetching, global state, utility hooks, real-time components). The existence of AI and advanced chart folders demonstrates it's a data-heavy application focused on providing deep sales insights and intelligence metrics.
