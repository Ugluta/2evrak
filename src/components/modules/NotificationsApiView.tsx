import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Bell,
  Search,
  Code2,
  Plus,
  Trash2,
  Send,
  Key,
  Webhook,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Copy,
} from "lucide-react";
import { NotificationItem } from "../../types";

export const NotificationsApiView: React.FC = () => {
  const {
    notifications,
    sendNotification,
    markNotificationAsRead,
    apiKeys,
    createApiKey,
    deleteApiKey,
    webhooks,
    addWebhook,
    deleteWebhook,
    documents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"notifications" | "search_filters" | "api_integrations">("notifications");

  // Notification form
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<NotificationItem["type"]>("system");
  const [notifTargetRole, setNotifTargetRole] = useState("all");

  // API Key form
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyRole, setKeyRole] = useState("read_only");

  // Webhook form
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvent, setWebhookEvent] = useState("document.created");

  // Search Test Lab
  const [searchTestQuery, setSearchTestQuery] = useState("");

  const searchTestResults = searchTestQuery
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(searchTestQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchTestQuery.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(searchTestQuery.toLowerCase()))
      )
    : [];

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    sendNotification({
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      targetRole: notifTargetRole,
    });

    setNotifTitle("");
    setNotifMessage("");
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    createApiKey(keyName, keyRole);
    setIsAddKeyOpen(false);
    setKeyName("");
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;

    addWebhook({
      url: webhookUrl,
      events: [webhookEvent],
      isActive: true,
    });

    setIsAddWebhookOpen(false);
    setWebhookUrl("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              10, 14 & 21 — Bildirim, Arama & API Entegrasyonları
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Harici Bağlantılar & Dağıtım
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Çok Kanallı MEB Bildirimleri, Gelişmiş Arama Filtreleri ve REST API / Webhook Yönetimi
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "notifications"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          10 Bildirim Merkezi ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab("search_filters")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "search_filters"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Search className="w-4 h-4" />
          14 Arama / Filtreleme Laboratuvarı
        </button>
        <button
          onClick={() => setActiveTab("api_integrations")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "api_integrations"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Code2 className="w-4 h-4" />
          21 API & Webhook Entegrasyonları
        </button>
      </div>

      {/* Tab 1: Notifications */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Sender Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" />
              Öğretmenlere Bildirim Fırlat
            </h3>

            <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Bildirim Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2. Dönem Ortak Sınav Takvimi"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mesaj İçeriği</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Öğretmenlerin bildirim panelinde görünecek açıklama..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Bildirim Türü</label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="system">Sistem Duyurusu</option>
                    <option value="moderation">Moderasyon</option>
                    <option value="scraper">Scraper / MEB</option>
                    <option value="membership">Üyelik / Kampanya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Hedef Kitle</label>
                  <select
                    value={notifTargetRole}
                    onChange={(e) => setNotifTargetRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Tüm Öğretmenler</option>
                    <option value="pro_teachers">Yalnızca Pro Üyeler</option>
                    <option value="zumre_heads">Zümre Başkanları</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Bildirimi Gönder
              </button>
            </form>
          </div>

          {/* Notifications Feed */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Geçmiş Bildirim Günlüğü</h3>
              <span className="text-xs text-slate-400 font-mono">
                {notifications.length} Bildirim
              </span>
            </div>

            <div className="divide-y divide-slate-800 max-h-[480px] overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-300">{n.message}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono">
                      {n.type}
                    </span>
                    <span className="text-[10px] text-slate-500">Hedef: {n.targetRole}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Search & Filter Lab */}
      {activeTab === "search_filters" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Dinamik Arama ve Eş Anlamlı (Synonym) Test Laboratuvarı
            </h3>
            <p className="text-xs text-slate-400">
              MEB aramalarında "zümre" yazıldığında "zümre tutanağı", "yıllık plan" ve "toplantı kararları" sonuçlarını eşleştiren zeki arama motoru testi.
            </p>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Evrak, branş veya konu yazın (Örn: fizik, zümre, sınav)..."
                value={searchTestQuery}
                onChange={(e) => setSearchTestQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {searchTestQuery && (
              <div className="pt-2">
                <div className="text-xs text-slate-400 mb-2">
                  Bulunan Sonuçlar ({searchTestResults.length} Evrak):
                </div>
                <div className="space-y-2">
                  {searchTestResults.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{d.title}</div>
                        <div className="text-[10px] text-slate-500">{d.categoryName} • {d.branch}</div>
                      </div>
                      <span className="font-mono text-indigo-400">{d.fileFormat.toUpperCase()}</span>
                    </div>
                  ))}
                  {searchTestResults.length === 0 && (
                    <div className="text-xs text-slate-500 p-4 text-center">
                      Aramanıza uygun sonuç bulunamadı.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: API & Webhooks */}
      {activeTab === "api_integrations" && (
        <div className="space-y-6">
          {/* API Keys Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Geliştirici API Anahtarları (REST API)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Harici okul sistemleri veya MEB servisleri için yetkilendirilmiş API tokenları
                </p>
              </div>
              <button
                onClick={() => setIsAddKeyOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Yeni API Key Üret
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Anahtar Tanımı</th>
                    <th className="p-3.5">API Token</th>
                    <th className="p-3.5">Yetki Seviyesi</th>
                    <th className="p-3.5">Rate Limit</th>
                    <th className="p-3.5">Son Kullanım</th>
                    <th className="p-3.5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-semibold text-white">{k.name}</td>
                      <td className="p-3.5 font-mono text-emerald-400 flex items-center gap-2">
                        <span>{k.key}</span>
                        <Copy className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" />
                      </td>
                      <td className="p-3.5 uppercase font-mono text-[10px] text-slate-400">
                        {k.role}
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">
                        {k.rateLimitPerMinute} istek/dk
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">{k.lastUsedAt}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteApiKey(k.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Webhooks Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Canlı Webhook Entegrasyonları</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Yeni evrak yüklendiğinde veya onaylandığında harici sunuculara HTTP POST bildirimleri
                </p>
              </div>
              <button
                onClick={() => setIsAddWebhookOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Yeni Webhook Ekle
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {webhooks.map((w) => (
                <div key={w.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40">
                  <div>
                    <div className="font-mono text-xs text-cyan-300">{w.url}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>Tetiklenen Olaylar:</span>
                      {w.events.map((ev, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWebhook(w.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add API Key Modal */}
      {isAddKeyOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni API Anahtarı Oluştur</h3>
              <button onClick={() => setIsAddKeyOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateApiKey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Anahtar Tanımı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: MEB Okul Entegrasyonu"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Yetki Seviyesi</label>
                <select
                  value={keyRole}
                  onChange={(e) => setKeyRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="read_only">Sadece Okuma (Read-Only)</option>
                  <option value="read_write">Okuma ve Yazma (Read/Write)</option>
                  <option value="admin">Yönetici API Erişimi</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddKeyOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Anahtarı Üret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {isAddWebhookOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Webhook Uç Noktası</h3>
              <button onClick={() => setIsAddWebhookOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateWebhook} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Uç Nokta URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.okul.k12.tr/webhooks/2evrak"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Olay (Event)</label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="document.created">Yeni Evrak Yüklendi (document.created)</option>
                  <option value="moderation.approved">Evrak Onaylandı (moderation.approved)</option>
                  <option value="scraper.completed">MEB Scraper Tamamlandı (scraper.completed)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddWebhookOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Webhook Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
