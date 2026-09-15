import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { PanelHeaderBar } from "./components/layout/PanelHeaderBar";

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
import { CurriculumCalendarView } from "./components/modules/CurriculumCalendarView";
import { JudicialPrecedentsView } from "./components/modules/JudicialPrecedentsView";
import { DilekcematikView } from "./components/modules/DilekcematikView";
import { MebAiChatbot } from "./components/common/MebAiChatbot";

// Public & Teacher Portals
import { PublicPortalView } from "./components/public/PublicPortalView";
import { TeacherPortalView } from "./components/teacher/TeacherPortalView";
import { Menu as MenuIcon } from "lucide-react";

const MainLayout: React.FC = () => {
  const {
    activeModuleId,
    currentView,
    setCurrentView,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useApp();

  // If Public Portal (Ziyaretçi / Misafir Ana Sayfası)
  if (currentView === "public") {
    return (
      <PublicPortalView
        onGoToAdminPanel={() => setCurrentView("admin")}
        onGoToTeacherPortal={() => setCurrentView("teacher")}
      />
    );
  }

  // If Teacher Portal (Üye / Öğretmen Paneli)
  if (currentView === "teacher") {
    return (
      <TeacherPortalView
        onGoToAdminPanel={() => setCurrentView("admin")}
        onGoToPublicPortal={() => setCurrentView("public")}
      />
    );
  }

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
      case "23_curriculum_calendar":
        return <CurriculumCalendarView />;
      case "24_judicial_precedents":
        return <JudicialPrecedentsView />;
      case "25_dilekcematik":
        return <DilekcematikView />;
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
    <div className="min-h-screen bg-[#f4f6f9] text-[#212529] flex flex-col font-sans selection:bg-[#007bff] selection:text-white">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f6f9]">
          <PanelHeaderBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6 custom-scrollbar bg-[#f4f6f9]">
            <div className="max-w-7xl mx-auto">{renderModuleView()}</div>
          </main>
        </div>
      </div>

      {/* Floating Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-6 left-5 z-40">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#007bff] text-white shadow-lg shadow-[#007bff]/30 hover:bg-[#0069d9] active:scale-95 transition-all text-xs font-bold border border-white/20 cursor-pointer"
          title="Menüyü Aç / Kapat"
        >
          <MenuIcon className="w-4 h-4" />
          <span>Panel Menüsü</span>
        </button>
      </div>

      <MebAiChatbot />
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
