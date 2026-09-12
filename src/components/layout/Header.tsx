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
} from "lucide-react";

export const Header: React.FC = () => {
  const {
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
    systemSettings,
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
    ? documents
        .filter(
          (d) =>
            !d.isSoftDeleted &&
            (d.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
              d.lesson.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
              d.docType.toLowerCase().includes(globalSearchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Scalability Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20 tracking-wider">
            2E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Space_Grotesk']">
                2Evrak
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                1M Öğretmen Hedefi
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              MEB Uyumlu Doküman & Çok Kanallı AI Platformu
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Evrak, zümre, sınav, ders veya kategori ara... (Ctrl + K)"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Live Search Quick Overlay */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
            <div className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
              Eşleşen Evraklar
            </div>
            {searchResults.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveModuleId("06_documents");
                  setGlobalSearchQuery(doc.title);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-start gap-2.5 text-xs text-slate-200 transition-colors group"
              >
                <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-200 truncate group-hover:text-indigo-300">
                    {doc.title}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{doc.lesson}</span>
                    <span>•</span>
                    <span>{doc.gradeLevel}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{doc.docType}</span>
                  </div>
                </div>
              </button>
            ))}
            <div className="border-t border-slate-800 mt-1 pt-1 text-center">
              <button
                onClick={() => setActiveModuleId("14_search_filter")}
                className="text-xs text-indigo-400 hover:text-indigo-300 py-1 font-medium"
              >
                Gelişmiş Filtreleme Merkezine Git &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Worker Status, Role Switcher, Notification, User */}
      <div className="flex items-center gap-2.5">
        {/* Real-time Worker Badge */}
        <button
          onClick={() => setActiveModuleId("22_queue_workers")}
          title="Kuyruk ve Worker Motoru Durumu"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/60 transition-colors"
        >
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] text-cyan-300">6 Worker Aktif</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
        </button>

        {/* AI Gateway Status */}
        <button
          onClick={() => setActiveModuleId("15_ai_agents")}
          title="AI Ajanları Hazır (Gemini Entegre)"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-xs text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium">9 AI Ajanı</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">Bildirimler</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded-full font-medium">
                      {unreadCount} Yeni
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Tümünü Okundu Say
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-1">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                      n.isRead ? "opacity-60 hover:opacity-100" : "bg-slate-800/40 hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-200">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {n.createdAt.slice(11)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    setActiveModuleId("10_notifications");
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Tüm Bildirim Merkezini Görüntüle &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role & User Switcher (RBAC Tester) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-7 h-7 rounded-full object-cover border border-indigo-500/40"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-none">
                {currentUser.fullName}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${currentRole.color}`}
                >
                  {currentRole.name}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                <div className="text-xs font-bold text-white">Canlı Rol & Profil Değiştirici</div>
                <div className="text-[10px] text-slate-400">
                  RBAC izin matrisini test etmek için kullanıcı seçin:
                </div>
              </div>

              <div className="space-y-1">
                {users.map((u) => {
                  const r = roles.find((role) => role.id === u.roleId);
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                          : "hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div className="text-left">
                          <div className="font-medium text-slate-200">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400">{u.branch}</div>
                        </div>
                      </div>
                      {r && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${r.color}`}>
                          {r.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-800 mt-2 pt-1.5 px-2 flex justify-between text-[11px] text-slate-400">
                <span>Branş: {currentUser.branch}</span>
                <span className="text-indigo-400 font-semibold">{currentUser.schoolType}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
