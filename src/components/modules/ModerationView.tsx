import React, { useState, useEffect } from "react";
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
  Shield,
  Check,
} from "lucide-react";
import { ModerationItem } from "../../types";

export const ModerationView: React.FC = () => {
  const {
    moderationItems,
    approveModerationItem,
    rejectModerationItem,
    requestRevisionModerationItem,
    activeSubItemId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "revision_required" | "all">("pending");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [actionModal, setActionModal] = useState<"approve" | "reject" | "revision" | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  // Sync with sidebar sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("onay_bekleyen") || activeSubItemId.includes("Onay Bekleyen")) {
      setActiveTab("pending");
      setSelectedType("all");
    } else if (activeSubItemId.includes("raporlanan") || activeSubItemId.includes("Raporlanan")) {
      setActiveTab("revision_required");
      setSelectedType("all");
    } else if (activeSubItemId.includes("ai_filtre") || activeSubItemId.includes("AI Güvenlik")) {
      setSelectedType("ai_content");
    }
  }, [activeSubItemId]);

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
  const approvedCount = moderationItems.filter((m) => m.status === "approved").length;
  const revisionCount = moderationItems.filter((m) => m.status === "revision_required").length;
  const rejectedCount = moderationItems.filter((m) => m.status === "rejected").length;

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
    <div className="space-y-4">
      {/* AdminLTE Callout Header */}
      <div className="bg-white border-l-4 border-l-[#ffc107] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#ffc107]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                Moderasyon & İçerik Onay Merkezi
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#fff8e1] text-[#b78103] font-bold border border-[#ffc107]/40">
                Kural 18: Sıfır Kontrolsüz Yayın
              </span>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Scraper bot çıktıları, Gemini AI dokümanları ve öğretmen yüklemeleri için merkezi inceleme, telif ve pedagojik denetim kapısı.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded bg-[#fff8e1] border border-[#ffc107]/40 text-xs text-[#856404] font-semibold">
              Bekleyen İnceleme: <span className="font-bold text-[#b78103] font-mono ml-1">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AdminLTE Small Boxes Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#ffc107] text-[#1f2d3d] rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{pendingCount}</div>
            <p className="text-xs font-bold text-[#1f2d3d]/90 mt-0.5">Onay Bekleyen Evrak</p>
          </div>
          <Clock className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-[#1f2d3d]/80 mt-2 font-mono">İnceleme Sırasında</span>
        </div>

        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{approvedCount}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Onaylanan (Yayında)</p>
          </div>
          <CheckCircle className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Öğretmenlerin Erişimine Açık</span>
        </div>

        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{revisionCount}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Revizyon İstenen</p>
          </div>
          <AlertTriangle className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Düzeltme Bekleniyor</span>
        </div>

        <div className="bg-[#dc3545] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{rejectedCount}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Reddedilen İçerik</p>
          </div>
          <XCircle className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Mevzuata Aykırı Bulundu</span>
        </div>
      </div>

      {/* AdminLTE Nav-pills and Filter bar */}
      <div className="card card-outline card-warning bg-white border border-[#dee2e6] rounded shadow-xs p-3 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
            {[
              { key: "pending", label: "Bekleyenler", count: pendingCount },
              { key: "approved", label: "Onaylananlar" },
              { key: "revision_required", label: "Revizyon İstenenler" },
              { key: "rejected", label: "Reddedilenler" },
              { key: "all", label: "Tüm Akış" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-[#ffc107] text-[#1f2d3d] font-bold shadow-xs"
                    : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 text-[#212529] font-mono font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Başlık veya gönderen ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1 text-xs text-[#495057] focus:outline-none focus:border-[#ffc107]"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-[#ced4da] rounded px-2.5 py-1 text-xs text-[#495057] focus:outline-none focus:border-[#ffc107] cursor-pointer"
            >
              <option value="all">Tüm Kaynaklar</option>
              <option value="document">Öğretmen Evrakı</option>
              <option value="content">İçerik & Makale</option>
              <option value="scraper_output">Scraper Çıktısı</option>
              <option value="ai_content">AI Üretimi</option>
              <option value="comment">Kullanıcı Yorumu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Moderation Items Table */}
      <div className="card card-outline card-secondary bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-10 text-center text-[#6c757d] space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-[#28a745]" />
            <div className="text-sm font-bold text-[#212529]">İnceleme Kuyruğu Temiz</div>
            <p className="text-xs text-[#6c757d]">
              Şu anda seçilen filtrelere uygun incelenecek içerik bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#495057]">
              <thead className="bg-[#f4f6f9] text-[10px] font-bold uppercase tracking-wider text-[#495057] border-b border-[#dee2e6]">
                <tr>
                  <th className="py-2.5 px-3">İçerik & Başlık</th>
                  <th className="py-2.5 px-3">Kaynak Türü</th>
                  <th className="py-2.5 px-3">Gönderen / Kaynak</th>
                  <th className="py-2.5 px-3">AI Güvenlik Skoru</th>
                  <th className="py-2.5 px-3">Tarih</th>
                  <th className="py-2.5 px-3">Durum</th>
                  <th className="py-2.5 px-3 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6]">
                {filteredItems.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-[#f8f9fa]">
                      <td className="py-2.5 px-3 max-w-sm">
                        <div className="font-bold text-[#212529] truncate">{item.title}</div>
                        <div className="text-[11px] text-[#6c757d] mt-0.5 truncate">
                          {item.aiSafetySummary}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#f8f9fa] border border-[#ced4da] text-[#495057]">
                          {item.targetType === "scraper_output" && <Radio className="w-3 h-3 text-[#17a2b8]" />}
                          {item.targetType === "ai_content" && <Sparkles className="w-3 h-3 text-[#6f42c1]" />}
                          {item.targetType === "document" && <FileText className="w-3 h-3 text-[#007bff]" />}
                          {item.targetType === "scraper_output"
                            ? "Scraper Çıktısı"
                            : item.targetType === "ai_content"
                            ? "AI Üretimi"
                            : "Öğretmen Evrakı"}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[#212529] font-medium">{item.submittedBy}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#e9ecef] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.aiSafetyScore > 90
                                  ? "bg-[#28a745]"
                                  : item.aiSafetyScore > 75
                                  ? "bg-[#ffc107]"
                                  : "bg-[#dc3545]"
                              }`}
                              style={{ width: `${item.aiSafetyScore}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold text-[11px] ${
                              item.aiSafetyScore > 90
                                ? "text-[#28a745]"
                                : item.aiSafetyScore > 75
                                ? "text-[#856404]"
                                : "text-[#dc3545]"
                            }`}
                          >
                            %{item.aiSafetyScore}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-[#6c757d] text-[11px] font-mono">
                        {item.submittedAt}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "approved"
                              ? "bg-[#eaf7ed] text-[#28a745]"
                              : item.status === "rejected"
                              ? "bg-[#f8d7da] text-[#dc3545]"
                              : item.status === "revision_required"
                              ? "bg-[#fff3cd] text-[#856404]"
                              : "bg-[#f8f9fa] text-[#495057] border border-[#ced4da]"
                          }`}
                        >
                          {item.status === "approved"
                            ? "Onaylandı"
                            : item.status === "rejected"
                            ? "Reddedildi"
                            : item.status === "revision_required"
                            ? "Revizyon İstendi"
                            : "Bekliyor"}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {item.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setActionModal("approve");
                                setActionNotes("MEB formatına uygun bulundu, onaylandı.");
                              }}
                              className="p-1 rounded bg-[#eaf7ed] hover:bg-[#d4edda] text-[#28a745] cursor-pointer transition-colors"
                              title="Onayla & Yayınla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setActionModal("revision");
                                setActionNotes("Kazanım kodları eksik, lütfen ekleyiniz.");
                              }}
                              className="p-1 rounded bg-[#fff3cd] hover:bg-[#ffeeba] text-[#856404] cursor-pointer transition-colors"
                              title="Revizyon İste"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setActionModal("reject");
                                setActionNotes("İçerik standartlara uygun değil.");
                              }}
                              className="p-1 rounded bg-[#f8d7da] hover:bg-[#f5c6cb] text-[#dc3545] cursor-pointer transition-colors"
                              title="Reddet"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-[#6c757d]">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded border border-[#dee2e6] max-w-md w-full p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529] flex items-center gap-1.5">
                {actionModal === "approve" && <CheckCircle className="w-4 h-4 text-[#28a745]" />}
                {actionModal === "reject" && <XCircle className="w-4 h-4 text-[#dc3545]" />}
                {actionModal === "revision" && <AlertTriangle className="w-4 h-4 text-[#ffc107]" />}
                {actionModal === "approve"
                  ? "İçeriği Onayla & Yayınla"
                  : actionModal === "reject"
                  ? "İçeriği Reddet"
                  : "Revizyon Talebi Gönder"}
              </h3>
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="text-[#6c757d] hover:text-[#212529] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#495057] bg-[#f8f9fa] p-2.5 rounded border border-[#dee2e6]">
              <div className="font-bold text-[#212529] mb-0.5">{selectedItem.title}</div>
              <div className="text-[#6c757d] text-[11px]">
                Gönderen: {selectedItem.submittedBy} • AI Güvenlik Skoru: %{selectedItem.aiSafetyScore}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                {actionModal === "approve"
                  ? "Onay Notu (Opsiyonel):"
                  : "Gerekçe / Açıklama (Kullanıcıya iletilecek):"}
              </label>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#ffc107]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-semibold cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-1.5 rounded text-xs font-bold text-white cursor-pointer ${
                  actionModal === "approve"
                    ? "bg-[#28a745] hover:bg-[#218838]"
                    : actionModal === "reject"
                    ? "bg-[#dc3545] hover:bg-[#c82333]"
                    : "bg-[#ffc107] text-[#1f2d3d] hover:bg-[#e0a800]"
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
