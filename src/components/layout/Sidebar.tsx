import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
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
  FileClock,
  ExternalLink,
} from "lucide-react";

interface ModuleNavGroup {
  name: string;
  items: {
    id: string;
    num: string;
    title: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({
  isOpen,
  setIsOpen,
}) => {
  const {
    activeModuleId,
    setActiveModuleId,
    documents,
    moderationItems,
    queueJobs,
    aiAgents,
    users,
  } = useApp();

  const pendingModerations = moderationItems.filter((m) => m.status === "pending").length;
  const activeJobs = queueJobs.filter((j) => j.status === "processing" || j.status === "waiting").length;
  const activeDocsCount = documents.filter((d) => !d.isSoftDeleted).length;

  const moduleGroups: ModuleNavGroup[] = [
    {
      name: "Yönetim & Panel",
      items: [
        { id: "09_dashboard", num: "09", title: "Dinamik Yönetim Paneli", icon: LayoutDashboard },
        { id: "10_notifications", num: "10", title: "Bildirim Merkezi", icon: Bell },
      ],
    },
    {
      name: "Doküman & İçerik",
      items: [
        {
          id: "06_documents",
          num: "06",
          title: "Doküman Yönetimi",
          icon: FileText,
          badge: activeDocsCount,
          badgeColor: "bg-indigo-500/20 text-indigo-300",
        },
        { id: "07_contents", num: "07", title: "İçerik Yönetimi", icon: BookOpen },
        { id: "11_pages", num: "11", title: "Sayfa Yönetimi", icon: Layers },
        { id: "12_menus", num: "12", title: "Menü Yönetimi", icon: MenuIcon },
        { id: "13_media", num: "13", title: "Medya / Dosya Kütüphanesi", icon: ImageIcon },
        { id: "14_search_filter", num: "14", title: "Arama / Filtreleme", icon: Filter },
      ],
    },
    {
      name: "Zeka & Otomasyon",
      items: [
        {
          id: "15_ai_agents",
          num: "15",
          title: "AI / Ajan Merkezi",
          icon: Sparkles,
          badge: "Gemini",
          badgeColor: "bg-purple-500/20 text-purple-300",
        },
        { id: "05_scrapers", num: "05", title: "Scraper / Kaynak Yönetimi", icon: Radio },
        { id: "08_social", num: "08", title: "Sosyal Medya Yönetimi", icon: Share2 },
        {
          id: "16_moderation",
          num: "16",
          title: "Moderasyon Merkezi",
          icon: ShieldCheck,
          badge: pendingModerations > 0 ? pendingModerations : undefined,
          badgeColor: "bg-amber-500/20 text-amber-300",
        },
        {
          id: "22_queue_workers",
          num: "22",
          title: "Kuyruk / Zamanlanmış Görevler",
          icon: Cpu,
          badge: activeJobs > 0 ? `${activeJobs} İş` : undefined,
          badgeColor: "bg-cyan-500/20 text-cyan-300",
        },
      ],
    },
    {
      name: "Kullanıcı & Gelir Modelleri",
      items: [
        {
          id: "02_users_roles",
          num: "02",
          title: "Kullanıcı / Rol / İzin (RBAC)",
          icon: Users,
          badge: users.length,
          badgeColor: "bg-slate-700 text-slate-300",
        },
        { id: "03_packages", num: "03", title: "Üyelik Paketleri", icon: Award },
        { id: "04_ads", num: "04", title: "Reklam Yönetimi", icon: Megaphone },
      ],
    },
    {
      name: "SEO & Analitik",
      items: [
        { id: "17_seo", num: "17", title: "SEO Merkezi", icon: Globe },
        { id: "18_analytics", num: "18", title: "İstatistik / Analitik", icon: BarChart3 },
        { id: "19_audit_logs", num: "19", title: "Log / Denetim İzi (Audit)", icon: ScrollText },
      ],
    },
    {
      name: "Sistem & Altyapı",
      items: [
        { id: "01_system_settings", num: "01", title: "Sistem Ayarları", icon: Sliders },
        { id: "20_security", num: "20", title: "Sistem Güvenliği", icon: Lock },
        { id: "21_api_integrations", num: "21", title: "API / Entegrasyonlar", icon: Code2 },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-30 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              22 Modül Mimarisi
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">v2.4 Prod</span>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5 custom-scrollbar">
          {moduleGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>{group.name}</span>
              </div>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModuleId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModuleId(item.id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`font-mono text-[10px] font-semibold transition-colors ${
                            isActive
                              ? "text-indigo-200"
                              : "text-slate-500 group-hover:text-slate-400"
                          }`}
                        >
                          {item.num}
                        </span>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive ? "text-white" : "text-slate-400 group-hover:scale-110"
                          }`}
                        />
                        <span className="truncate text-left">{item.title}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ml-1.5 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor || "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer quick system summary */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 font-medium">Hedef Kitle</span>
            <span className="text-indigo-400 font-semibold">1.000.000 Öğretmen</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[14.2%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>142.500 Aktif Öğretmen</span>
            <span>%14.2 MEB Erişimi</span>
          </div>
        </div>
      </aside>
    </>
  );
};
