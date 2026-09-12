import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Radio,
  Sparkles,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";
import { ModerationItem } from "../../types";

export const ModerationView: React.FC = () => {
  const {
    moderationItems,
    approveModerationItem,
    rejectModerationItem,
    requestRevisionModerationItem,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "revision_required" | "all">("pending");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [actionModal, setActionModal] = useState<"approve" | "reject" | "revision" | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  const filteredItems = moderationItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.status === activeTab;
    const matchesType = selectedType === "all" || item.targetType === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesType && matchesSearch;
  });

  const pendingCount = moderationItems.filter((m) => m.status === "pending").length;

  const handleConfirmAction = () => {
    if (!selectedItem || !actionModal) return;

    if (actionModal === "approve") {
      approveModerationItem(selectedItem.id, actionNotes);
    } else if (actionModal === "reject") {
      rejectModerationItem(selectedItem.id, actionNotes || "MEB mevzuatına veya içerik standartlarına aykırı bulundu.");
    } else if (actionModal === "revision") {
      requestRevisionModerationItem(selectedItem.id, actionNotes || "Eksik kazanımlar tespit edildi, lütfen güncelleyin.");
    }

    setActionModal(null);
    setSelectedItem(null);
    setActionNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">16 — Moderasyon Merkezi</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kural 3: Sıfır Körlemesine Yayın
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scraper Çıktıları, AI Dokümanları ve Öğretmen Yüklemeleri için Merkezi Doğrulama & MEB Uyumluluk Kapısı
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
            Bekleyen İnceleme: <span className="font-bold text-amber-400 font-mono">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: "pending", label: "Bekleyenler", count: pendingCount },
            { key: "approved", label: "Onaylananlar" },
            { key: "revision_required", label: "Revizyon İstenenler" },
            { key: "rejected", label: "Reddedilenler" },
            { key: "all", label: "Tüm Akış" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Başlık veya gönderen ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Kaynaklar</option>
            <option value="document">Öğretmen Evrakı</option>
            <option value="scraper_output">Scraper Çıktısı</option>
            <option value="ai_content">AI Üretimi</option>
            <option value="comment">Kullanıcı Yorumu</option>
          </select>
        </div>
      </div>

      {/* Moderation Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500" />
            <div className="text-sm font-semibold text-white">İnceleme Kuyruğu Temiz</div>
            <p className="text-xs text-slate-500">
              Şu anda seçilen filtrelere uygun incelenecek içerik bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">İçerik & Başlık</th>
                  <th className="p-3.5">Kaynak Türü</th>
                  <th className="p-3.5">Gönderen / Kaynak</th>
                  <th className="p-3.5">AI Güvenlik Skoru</th>
                  <th className="p-3.5">Tarih</th>
                  <th className="p-3.5">Durum</th>
                  <th className="p-3.5 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredItems.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 max-w-sm">
                        <div className="font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {item.aiSafetySummary}
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                            item.targetType === "scraper_output"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : item.targetType === "ai_content"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                          }`}
                        >
                          {item.targetType === "scraper_output" && <Radio className="w-3 h-3" />}
                          {item.targetType === "ai_content" && <Sparkles className="w-3 h-3" />}
                          {item.targetType === "document" && <FileText className="w-3 h-3" />}
                          {item.targetType === "scraper_output"
                            ? "Scraper Çıktısı"
                            : item.targetType === "ai_content"
                            ? "AI Üretimi"
                            : "Öğretmen Evrakı"}
                        </span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="text-slate-200 font-medium">{item.submittedBy}</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.aiSafetyScore > 90
                                  ? "bg-emerald-400"
                                  : item.aiSafetyScore > 75
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                              }`}
                              style={{ width: `${item.aiSafetyScore}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold text-[11px] ${
                              item.aiSafetyScore > 90
                                ? "text-emerald-400"
                                : item.aiSafetyScore > 75
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            %{item.aiSafetyScore}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-slate-400 text-[11px] font-mono">
                        {item.submittedAt}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            item.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : item.status === "rejected"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : item.status === "revision_required"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {item.status === "approved"
                            ? "Onaylandı (Yayında)"
                            : item.status === "rejected"
                            ? "Reddedildi"
                            : item.status === "revision_required"
                            ? "Revizyon İstendi"
                            : "Bekliyor"}
                        </span>
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        {item.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setActionModal("approve");
                                setActionNotes("MEB formatına uygun bulundu, onaylandı.");
                              }}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              title="Onayla & Yayınla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setActionModal("revision");
                                setActionNotes("Kazanım kodları eksik, lütfen ekleyiniz.");
                              }}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                              title="Revizyon İste"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setActionModal("reject");
                                setActionNotes("İçerik standartlara uygun değil.");
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Reddet"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500">
                            {item.reviewedBy} • {item.reviewedAt}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Dialog Modal */}
      {actionModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {actionModal === "approve" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {actionModal === "reject" && <XCircle className="w-4 h-4 text-red-400" />}
                {actionModal === "revision" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {actionModal === "approve"
                  ? "İçeriği Onayla & Yayınla"
                  : actionModal === "reject"
                  ? "İçeriği Reddet"
                  : "Revizyon Talebi Gönder"}
              </h3>
              <button
                onClick={() => setActionModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              <div className="font-semibold text-white mb-1">{selectedItem.title}</div>
              <div className="text-slate-400 text-[11px]">
                Gönderen: {selectedItem.submittedBy} • AI Güvenlik: %{selectedItem.aiSafetyScore}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {actionModal === "approve"
                  ? "Onay Notu (Opsiyonel):"
                  : "Açıklama / Gerekçe (Kullanıcıya İletilecek):"}
              </label>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white ${
                  actionModal === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : actionModal === "reject"
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-amber-600 hover:bg-amber-500"
                }`}
              >
                İşlemi Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
