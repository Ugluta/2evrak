import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";

// Module Views
import { DashboardView } from "./components/modules/DashboardView";
import { DocumentsView } from "./components/modules/DocumentsView";
import { AiAgentsView } from "./components/modules/AiAgentsView";
import { ModerationView } from "./components/modules/ModerationView";
import { ScraperView } from "./components/modules/ScraperView";
import { UsersRolesView } from "./components/modules/UsersRolesView";
import { SystemSettingsView } from "./components/modules/SystemSettingsView";
import { QueueWorkersView } from "./components/modules/QueueWorkersView";
import { AuditLogsView } from "./components/modules/AuditLogsView";
import { PackagesAdsView } from "./components/modules/PackagesAdsView";
import { ContentsSocialView } from "./components/modules/ContentsSocialView";
import { PagesMenusMediaView } from "./components/modules/PagesMenusMediaView";
import { SeoAnalyticsSecurityView } from "./components/modules/SeoAnalyticsSecurityView";
import { NotificationsApiView } from "./components/modules/NotificationsApiView";

const MainLayout: React.FC = () => {
  const { activeModuleId } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderModuleView = () => {
    switch (activeModuleId) {
      case "01_system_settings":
        return <SystemSettingsView />;
      case "02_users_roles":
        return <UsersRolesView />;
      case "03_packages":
      case "04_ads":
        return <PackagesAdsView />;
      case "05_scrapers":
        return <ScraperView />;
      case "06_documents":
        return <DocumentsView />;
      case "07_contents":
      case "08_social":
        return <ContentsSocialView />;
      case "09_dashboard":
        return <DashboardView />;
      case "10_notifications":
      case "14_search_filter":
      case "21_api_integrations":
        return <NotificationsApiView />;
      case "11_pages":
      case "12_menus":
      case "13_media":
        return <PagesMenusMediaView />;
      case "15_ai_agents":
        return <AiAgentsView />;
      case "16_moderation":
        return <ModerationView />;
      case "17_seo":
      case "18_analytics":
      case "20_security":
        return <SeoAnalyticsSecurityView />;
      case "19_audit_logs":
        return <AuditLogsView />;
      case "22_queue_workers":
        return <QueueWorkersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{renderModuleView()}</div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
