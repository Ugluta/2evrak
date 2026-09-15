import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  NAVIGATION_GROUPS,
  NavigationGroup,
  NavigationModuleItem,
} from "../../data/navigationData";
import {
  Sliders,
  Users,
  Award,
  Megaphone,
  Radio,
  FileText,
  BookOpen,
  Share2,
  LayoutDashboard,
  Bell,
  Layers,
  Menu as MenuIcon,
  Image as ImageIcon,
  Filter,
  Sparkles,
  ShieldCheck,
  Globe,
  BarChart3,
  ScrollText,
  Lock,
  Code2,
  Cpu,
  ChevronRight,
  FolderTree,
  CalendarDays,
  Scale,
  ChevronDown,
  X,
  Search,
  Circle,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

export const Sidebar: React.FC<{ isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
}) => {
  const {
    isSidebarOpen: contextIsOpen,
    setIsSidebarOpen: contextSetIsOpen,
    activeModuleId,
    activeSubItemId,
    navigateToModule,
    documents,
    moderationItems,
    queueJobs,
    users,
    hasPermission,
    currentRole,
    currentUser,
    navigationGroups,
  } = useApp();

  const isOpen = propIsOpen ?? contextIsOpen;
  const setIsOpen = propSetIsOpen ?? contextSetIsOpen;

  const [sidebarSearch, setSidebarSearch] = useState("");

  const pendingModerations = moderationItems.filter((m) => m.status === "pending").length;
  const activeJobs = queueJobs.filter((j) => j.status === "processing" || j.status === "waiting").length;
  const activeDocsCount = documents.filter((d) => !d.isSoftDeleted).length;

  // Track expanded submenus (Treeview)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    "09_dashboard": false,
    "06_documents": true,
    "25_dilekcematik": true,
    "12_menus": false,
    "14_search_filter": false,
    "15_ai_agents": false,
  });

  // Automatically expand sub-menu of active module
  useEffect(() => {
    if (activeModuleId) {
      setOpenSubMenus((prev) => ({
        ...prev,
        [activeModuleId]: true,
      }));
    }
  }, [activeModuleId]);

  const toggleSubMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Group accordion toggle
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Yönetim & Panel": true,
    "Doküman & İçerik": true,
    "Zeka & Otomasyon": true,
    "Kullanıcı & Gelir Modelleri": true,
    "SEO & Analitik": true,
    "Sistem & Altyapı": true,
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutDashboard":
        return LayoutDashboard;
      case "Bell":
        return Bell;
      case "FileText":
        return FileText;
      case "BookOpen":
        return BookOpen;
      case "CalendarDays":
        return CalendarDays;
      case "Scale":
        return Scale;
      case "Layers":
        return Layers;
      case "Menu":
        return MenuIcon;
      case "Image":
        return ImageIcon;
      case "Filter":
        return Filter;
      case "Sparkles":
        return Sparkles;
      case "Radio":
        return Radio;
      case "Share2":
        return Share2;
      case "ShieldCheck":
        return ShieldCheck;
      case "Cpu":
        return Cpu;
      case "Users":
        return Users;
      case "Award":
        return Award;
      case "Megaphone":
        return Megaphone;
      case "Globe":
        return Globe;
      case "BarChart3":
        return BarChart3;
      case "ScrollText":
        return ScrollText;
      case "Sliders":
        return Sliders;
      case "Lock":
        return Lock;
      case "Code2":
        return Code2;
      default:
        return FileText;
    }
  };

  const canAccessModule = (id: string) => {
    if (currentRole.slug === "super_admin" || currentRole.slug === "administrator") return true;

    if (["01_system_settings", "20_security", "21_api_integrations"].includes(id)) {
      return hasPermission("manage_system");
    }
    if (["02_users_roles", "03_packages", "04_ads"].includes(id)) {
      return hasPermission("manage_system") || hasPermission("export");
    }
    if (["17_seo", "18_analytics", "19_audit_logs"].includes(id)) {
      return hasPermission("moderate") || hasPermission("manage_system") || hasPermission("export");
    }
    if (["15_ai_agents", "05_scrapers", "08_social", "16_moderation", "22_queue_workers"].includes(id)) {
      return hasPermission("moderate") || hasPermission("import") || hasPermission("manage_system");
    }
    return hasPermission("view") || hasPermission("create");
  };

  const groupsToRender = navigationGroups && navigationGroups.length > 0 ? navigationGroups : NAVIGATION_GROUPS;

  const filteredModuleGroups = groupsToRender.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => canAccessModule(item.id))
      .filter((item) => {
        if (!sidebarSearch.trim()) return true;
        const query = sidebarSearch.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSub = item.subItems?.some((sub) => sub.title.toLowerCase().includes(query));
        return matchesTitle || matchesSub;
      }),
  })).filter((group) => group.items.length > 0);

  // Dynamic badge override (AdminLTE badge styles)
  const getBadgeInfo = (item: NavigationModuleItem) => {
    if (item.id === "06_documents") {
      return { badge: activeDocsCount, color: "bg-[#007bff] text-white" };
    }
    if (item.id === "16_moderation" && pendingModerations > 0) {
      return { badge: pendingModerations, color: "bg-[#dc3545] text-white" };
    }
    if (item.id === "22_queue_workers" && activeJobs > 0) {
      return { badge: `${activeJobs} İş`, color: "bg-[#17a2b8] text-white" };
    }
    if (item.id === "02_users_roles") {
      return { badge: users.length, color: "bg-[#6c757d] text-white" };
    }
    if (item.badge) {
      return { badge: item.badge, color: "bg-[#28a745] text-white" };
    }
    return null;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      {/* AdminLTE 3 Dark Sidebar (main-sidebar sidebar-dark-primary) */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#343a40] text-[#c2c7d0] border-r border-[#4b545c] flex flex-col z-40 transition-transform duration-300 ease-in-out select-none shadow-md ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Link (AdminLTE brand-link) */}
        <div className="h-14 px-4 border-b border-[#4b545c] flex items-center justify-between bg-[#343a40] shrink-0">
          <button
            type="button"
            onClick={() => navigateToModule("09_dashboard")}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-[#007bff] flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              2E
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-white text-base tracking-wider">2EVRAK</span>
              <span className="text-[10px] font-mono text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">
                LTE 3
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Menüyü Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Panel (AdminLTE user-panel) */}
        <div className="px-4 py-3 border-b border-[#4b545c] flex items-center gap-3 bg-[#343a40] shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#007bff]/20 border border-[#007bff]/40 flex items-center justify-center text-white font-bold text-xs uppercase">
              {(currentUser?.fullName || currentUser?.name || "Öğretmen").slice(0, 2)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#28a745] border-2 border-[#343a40]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">
              {currentUser?.fullName || currentUser?.name || "Öğretmen"}
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28a745]" />
              <span className="truncate">{currentRole?.name || "Yönetici"} • Çevrimiçi</span>
            </div>
          </div>
        </div>

        {/* Sidebar Search Form (AdminLTE form-inline) */}
        <div className="px-3 py-2 border-b border-[#4b545c] shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Menüde ara..."
              className="w-full bg-[#3f474e] border border-[#4f5962] text-xs text-white rounded px-2.5 py-1.5 placeholder-gray-400 focus:outline-none focus:border-[#007bff]"
            />
            {sidebarSearch ? (
              <button
                type="button"
                onClick={() => setSidebarSearch("")}
                className="absolute right-2 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Sidebar Navigation Menu (AdminLTE nav nav-pills nav-sidebar flex-column) */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 custom-scrollbar">
          {filteredModuleGroups.map((group) => {
            const isGroupOpen = openGroups[group.name] ?? true;

            return (
              <div key={group.name} className="space-y-0.5">
                {/* Section Header (AdminLTE nav-header) */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="w-full px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#6c757d] hover:text-[#c2c7d0] flex items-center justify-between cursor-pointer text-left"
                >
                  <span className="truncate">{group.name}</span>
                  <span className="text-[10px] text-gray-500 ml-1">
                    {isGroupOpen ? "▾" : "▸"}
                  </span>
                </button>

                {/* Group Modules (AdminLTE nav-item) */}
                {isGroupOpen && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = getIcon(item.iconName);
                      const isActive = activeModuleId === item.id;
                      const hasSub = item.subItems && item.subItems.length > 0;
                      const isSubOpen = openSubMenus[item.id];
                      const badgeInfo = getBadgeInfo(item);

                      return (
                        <div key={item.id} className="space-y-0.5">
                          {/* Main Module Nav Link */}
                          <div
                            onClick={() => {
                              // If it has sub-items, toggle open AND navigate to default sub
                              if (hasSub) {
                                setOpenSubMenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                                const defaultSub = item.subItems?.[0]?.title;
                                navigateToModule(item.id, defaultSub);
                              } else {
                                navigateToModule(item.id);
                              }
                              if (window.innerWidth < 1024 && !hasSub) setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[0.25rem] text-xs font-normal transition-colors group cursor-pointer select-none ${
                              isActive
                                ? "bg-[#007bff] text-white font-semibold shadow-xs"
                                : "text-[#c2c7d0] hover:text-white hover:bg-[#494e53]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-transform ${
                                  isActive ? "text-white" : "text-[#c2c7d0] group-hover:text-white"
                                }`}
                              />
                              <span className="truncate">{item.title}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {badgeInfo && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                    isActive ? "bg-white text-[#007bff]" : badgeInfo.color
                                  }`}
                                >
                                  {badgeInfo.badge}
                                </span>
                              )}
                              {hasSub && (
                                <ChevronRight
                                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                    isSubOpen ? "rotate-90 text-white" : "text-gray-400 group-hover:text-white"
                                  }`}
                                />
                              )}
                            </div>
                          </div>

                          {/* Collapsible Subitems (AdminLTE nav-treeview) */}
                          {hasSub && isSubOpen && (
                            <div className="bg-[#2c3136] rounded-[0.25rem] my-0.5 py-1 px-1 space-y-0.5 border-l-2 border-[#007bff]">
                              {item.subItems!.map((sub, sIdx) => {
                                const isSubActive =
                                  activeModuleId === item.id &&
                                  (activeSubItemId === sub.title || (!activeSubItemId && sIdx === 0));

                                return (
                                  <button
                                    key={sub.id || sIdx}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigateToModule(sub.actionId, sub.title);
                                      if (window.innerWidth < 1024) setIsOpen(false);
                                    }}
                                    className={`w-full text-left pl-3 pr-2 py-1.5 rounded-[0.25rem] text-[11px] font-normal transition-colors flex items-center justify-between group cursor-pointer ${
                                      isSubActive
                                        ? "bg-[#007bff] text-white font-bold"
                                        : "text-[#c2c7d0] hover:text-white hover:bg-[#343a40]"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Circle
                                        className={`w-1.5 h-1.5 shrink-0 ${
                                          isSubActive
                                            ? "fill-white text-white"
                                            : "fill-transparent text-[#6c757d] group-hover:text-white"
                                        }`}
                                      />
                                      <span className="truncate">{sub.title}</span>
                                    </div>

                                    {isSubActive && (
                                      <span className="text-[10px] text-white/80 font-mono">
                                        ●
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer (AdminLTE sidebar bottom status) */}
        <div className="p-3 border-t border-[#4b545c] bg-[#343a40] text-[11px] text-[#6c757d] shrink-0">
          <div className="flex items-center justify-between mb-1 text-[10px]">
            <span className="text-gray-400">MEB Öğretmen Hedefi</span>
            <span className="text-white font-mono font-bold">142.500 / 1.000.000</span>
          </div>
          <div className="w-full bg-[#494e53] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#28a745] h-full w-[14.2%]" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>2Evrak AdminLTE v3.2</span>
            <span className="text-[#28a745] font-semibold">%14.2 Erişim</span>
          </div>
        </div>
      </aside>
    </>
  );
};
