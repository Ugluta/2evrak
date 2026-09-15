import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Bell,
  Check,
  Shield,
  User,
  ChevronDown,
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Server,
  Zap,
  Home,
  GraduationCap,
  Menu as MenuIcon,
  X,
  FileSpreadsheet,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    setCurrentUser,
    users,
    roles,
    currentRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    globalSearchQuery,
    setGlobalSearchQuery,
    documents,
    categories,
    setActiveModuleId,
    navigateToModule,
    systemSettings,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search results preview
  const searchResults = globalSearchQuery.trim()
    ? (documents || [])
        .filter(
          (d) =>
            !d.isSoftDeleted &&
            ((d.title && d.title.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
              (d.lesson && d.lesson.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
              (d.docType && d.docType.toLowerCase().includes(globalSearchQuery.toLowerCase())))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="h-14 bg-white border-b border-[#dee2e6] px-3 md:px-5 flex items-center justify-between sticky top-0 z-30 shadow-2xs select-none">
      {/* Left: Sidebar Toggle & AdminLTE Nav Links */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded hover:bg-[#f4f6f9] text-[#6c757d] hover:text-[#343a40] transition-colors cursor-pointer"
          title="Menüyü Aç / Kapat"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* AdminLTE Top Navbar Links */}
        <nav className="hidden sm:flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => navigateToModule("09_dashboard")}
            className="px-2.5 py-1.5 rounded text-[#495057] hover:text-[#007bff] hover:bg-[#f8f9fa] font-medium transition-colors cursor-pointer"
          >
            Ana Sayfa
          </button>

          <button
            type="button"
            onClick={() => navigateToModule("06_documents", "Yazılı & Ortak Sınav Soruları")}
            className="px-2.5 py-1.5 rounded text-[#495057] hover:text-[#007bff] hover:bg-[#f8f9fa] font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#007bff]" />
            <span>Yazılı Soruları</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("teacher")}
            className="px-2.5 py-1.5 rounded text-[#495057] hover:text-[#28a745] hover:bg-[#f8f9fa] font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#28a745]" />
            <span>Öğretmen Portalı</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("public")}
            className="px-2.5 py-1.5 rounded text-[#495057] hover:text-[#007bff] hover:bg-[#f8f9fa] font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#6c757d]" />
            <span>Ziyaretçi Portalı</span>
          </button>
        </nav>
      </div>

      {/* Center: AdminLTE Search Bar */}
      <div className="relative flex-1 max-w-sm mx-3 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Evrak, sınav, zümre veya modül ara... (Ctrl+K)"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-[#f4f6f9] border border-[#ced4da] rounded px-3 py-1 text-xs text-[#495057] placeholder-gray-400 focus:outline-none focus:border-[#007bff] focus:bg-white transition-colors pl-8"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>

        {/* Live Search Quick Overlay */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dee2e6] rounded shadow-lg p-2 z-50">
            <div className="text-[10px] font-bold text-[#6c757d] px-2 py-1 uppercase tracking-wider">
              Eşleşen Evraklar
            </div>
            {searchResults.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  navigateToModule("06_documents");
                  setGlobalSearchQuery(doc.title);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#f8f9fa] flex items-start gap-2 text-xs text-[#212529] transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-[#e8f4ff] text-[#007bff] mt-0.5">
                  <Layers className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{doc.title}</div>
                  <div className="text-[10px] text-[#6c757d] flex items-center gap-1.5">
                    <span>{doc.lesson}</span>
                    <span>•</span>
                    <span>{doc.gradeLevel}</span>
                    <span>•</span>
                    <span className="text-[#28a745] font-medium">{doc.docType}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Quick Action Badges, Notifications, Role Profile */}
      <div className="flex items-center gap-2">
        {/* Workers Status Badge */}
        <button
          type="button"
          onClick={() => navigateToModule("22_queue_workers")}
          title="Kuyruk ve Worker Durumu"
          className="hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[11px] text-[#495057] transition-colors cursor-pointer"
        >
          <Server className="w-3 h-3 text-[#17a2b8]" />
          <span className="font-mono">6 Worker</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#28a745] animate-pulse" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-1.5 rounded hover:bg-[#f4f6f9] text-[#6c757d] hover:text-[#343a40] transition-colors cursor-pointer"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 bg-[#dc3545] text-white text-[9px] font-bold px-1 rounded-full leading-tight">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-[#dee2e6] rounded shadow-lg p-2.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
                <span className="font-bold text-xs text-[#212529]">
                  {unreadCount} Yeni Bildirim
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-[#007bff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Tümünü Oku
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-[#dee2e6] my-1 custom-scrollbar">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`py-2 px-1 text-xs cursor-pointer hover:bg-[#f8f9fa] ${
                      n.isRead ? "opacity-60" : "font-semibold"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[#212529]">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {n.createdAt ? (n.createdAt.includes("T") ? n.createdAt.split("T")[1]?.slice(0, 5) : n.createdAt.slice(11, 16)) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6c757d] mt-0.5 font-normal line-clamp-1">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#dee2e6] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigateToModule("10_notifications");
                  }}
                  className="text-xs text-[#007bff] hover:underline font-semibold cursor-pointer"
                >
                  Tüm Bildirimleri Göster
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role & Profile Switcher (AdminLTE User Menu) */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f4f6f9] border border-transparent hover:border-[#ced4da] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#007bff] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
              {(currentUser?.fullName || currentUser?.name || "Öğretmen").slice(0, 2)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#212529] leading-tight">
                {currentUser?.fullName || currentUser?.name || "Öğretmen"}
              </div>
              <div className="text-[10px] text-[#6c757d] leading-tight">
                {currentRole?.name || "Yönetici"}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#dee2e6] rounded shadow-lg p-2.5 z-50">
              <div className="px-2 py-1.5 border-b border-[#dee2e6] mb-1">
                <div className="text-xs font-bold text-[#212529]">Rol & Profil Değiştir</div>
                <div className="text-[10px] text-[#6c757d]">
                  RBAC izinlerini test etmek için profil seçin:
                </div>
              </div>

              <div className="space-y-1">
                {users.map((u) => {
                  const r = roles.find((role) => role.id === u.roleId);
                  const isSelected = u.id === currentUser.id;
                  const uDisplayName = u.fullName || u.name || "Kullanıcı";
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setCurrentUser(u);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#007bff] text-white font-bold"
                          : "hover:bg-[#f8f9fa] text-[#495057]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? "bg-white text-[#007bff]" : "bg-[#e9ecef] text-[#495057]"
                          }`}
                        >
                          {uDisplayName.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <div className="leading-tight">{uDisplayName}</div>
                          <div className="text-[10px] opacity-80">{u.branch || "Yönetim"}</div>
                        </div>
                      </div>
                      {r && (
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded font-mono ${
                            isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {r.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
