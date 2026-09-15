import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Radio,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Plus,
  Trash2,
  Eye,
  FileCode,
  Layers,
  ArrowRight,
  Clock,
  XCircle,
  Search,
  Filter,
  FileText,
  Check,
  AlertCircle,
  Database,
  SlidersHorizontal,
} from "lucide-react";
import { ScraperSource, ModerationItem } from "../../types";

export const ScraperView: React.FC = () => {
  const {
    sources,
    scraperJobs,
    addSource,
    deleteSource,
    triggerScrapeSource,
    categories,
    setActiveModuleId,
    activeSubItemId,
    moderationItems,
    approveModerationItem,
    rejectModerationItem,
    requestRevisionModerationItem,
  } = useApp();

  // Active Main Tab - Default to "moderation" as requested!
  const [activeTab, setActiveTab] = useState<"moderation" | "sources" | "jobs" | "ssrf">("moderation");

  // Moderation filtering state (strictly for scraper_output items)
  const [modFilterStatus, setModFilterStatus] = useState<"pending" | "approved" | "revision_required" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModItem, setSelectedModItem] = useState<ModerationItem | null>(null);
  const [actionModal, setActionModal] = useState<"approve" | "reject" | "revision" | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  // SSRF testing state
  const [testUrl, setTestUrl] = useState("https://meb.gov.tr/meb_duyuru.html");
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // New source form state
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0]?.id || "cat_zumre");

  // Sync with navigation sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("canli_kazima") || activeSubItemId.includes("Canlı Kazıma")) {
      setActiveTab("jobs");
    } else if (activeSubItemId.includes("kaynak_listesi") || activeSubItemId.includes("Kaynakları")) {
      setActiveTab("sources");
    } else if (activeSubItemId.includes("yeni_bot") || activeSubItemId.includes("Yeni Bot")) {
      setActiveTab("sources");
      setIsAddSourceOpen(true);
    } else if (activeSubItemId.includes("scraper_moderasyon") || activeSubItemId.includes("Moderasyon")) {
      setActiveTab("moderation");
    }
  }, [activeSubItemId]);

  // Filter moderation items strictly for scraper
  const scraperModerationItems = moderationItems.filter(
    (item) => item.targetType === "scraper_output"
  );

  const filteredScraperItems = scraperModerationItems.filter((item) => {
    const matchesStatus = modFilterStatus === "all" || item.status === modFilterStatus;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingScraperCount = scraperModerationItems.filter((m) => m.status === "pending" || m.status === "in_review").length;
  const approvedScraperCount = scraperModerationItems.filter((m) => m.status === "approved").length;
  const revisionScraperCount = scraperModerationItems.filter((m) => m.status === "revision_required").length;
  const rejectedScraperCount = scraperModerationItems.filter((m) => m.status === "rejected").length;

  const handleConfirmAction = () => {
    if (!selectedModItem || !actionModal) return;

    if (actionModal === "approve") {
      approveModerationItem(selectedModItem.id, actionNotes || "Resmi kaynaktan doğrulanıp arşive alındı.");
    } else if (actionModal === "reject") {
      rejectModerationItem(selectedModItem.id, actionNotes || "Mükerrer veya hatalı kazıma sebebiyle reddedildi.");
    } else if (actionModal === "revision") {
      requestRevisionModerationItem(selectedModItem.id, actionNotes || "Eksik PDF eki veya bozuk format sebebiyle yeniden kazıma (re-scrape) talep edildi.");
    }

    setActionModal(null);
    setSelectedModItem(null);
    setActionNotes("");
  };

  const handleTestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const resp = await fetch("/api/scraper/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: testUrl,
          selectors: {
            titleSelector: "h1.title, .news-title",
            contentSelector: ".content-detail, article",
            fileLinkSelector: "a[href$='.pdf'], a[href$='.docx']",
          },
        }),
      });

      const data = await resp.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        status: "error",
        message: "İstek başarısız oldu: " + err.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    addSource({
      name: newName.trim(),
      targetUrl: newUrl.trim(),
      cronExpression: "0 */3 * * *",
      status: "idle",
      lastItemCount: 0,
      selectors: {
        titleSelector: ".article-title",
        contentSelector: ".article-content",
        fileLinkSelector: "a.download-link",
      },
      autoCategoryMapping: [{ keyword: "zümre", targetCategoryId: newCategory }],
    });

    setIsAddSourceOpen(false);
    setNewName("");
    setNewUrl("");
  };

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Header */}
      <div className="bg-white border-l-4 border-l-[#17a2b8] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-5 h-5 text-[#17a2b8]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                Scraper & Bot Yönetim Merkezi
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#e0f7fa] text-[#006064] font-bold border border-[#b2ebf2]">
                Modül Odaklı Moderasyon
              </span>
            </div>
            <p className="text-xs text-[#6c757d]">
              MEB, EBA, ÖSYM ve Resmi Gazete botlarının çektiği evraklar için ayrıştırılmış özel moderasyon havuzu ve bot kaynakları.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("sources");
                setIsAddSourceOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Bot Kaynağı Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded border border-[#dee2e6] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "moderation"
                ? "bg-[#17a2b8] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Scraper Moderasyon Havuzu</span>
            {pendingScraperCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                  activeTab === "moderation"
                    ? "bg-white text-[#17a2b8]"
                    : "bg-[#dc3545] text-white"
                }`}
              >
                {pendingScraperCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sources")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "sources"
                ? "bg-[#17a2b8] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Kayıtlı Bot Kaynakları</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 font-mono">
              {sources.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "jobs"
                ? "bg-[#17a2b8] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Canlı Kazıma İşleri</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 font-mono">
              {scraperJobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ssrf")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "ssrf"
                ? "bg-[#17a2b8] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>SSRF & Güvenlik Sandbox</span>
          </button>
        </div>

        <div className="text-xs text-[#6c757d] flex items-center gap-1 font-mono">
          <Database className="w-3.5 h-3.5 text-[#17a2b8]" />
          <span>Filtre: Sadece Scraper Evrakları</span>
        </div>
      </div>

      {/* TAB 1: SCRAPER-SPECIFIC MODERATION QUEUE */}
      {activeTab === "moderation" && (
        <div className="space-y-4">
          {/* AdminLTE Small Boxes: Scraper Specific Moderation Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#ffc107] text-[#1f2d3d] rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{pendingScraperCount}</div>
                <p className="text-xs font-bold text-[#1f2d3d]/90 mt-0.5">Onay Bekleyen Kazıma</p>
              </div>
              <Clock className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-[#1f2d3d]/80 mt-2 font-mono">Botlardan Gelen Evraklar</span>
            </div>

            <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{approvedScraperCount}</div>
                <p className="text-xs font-semibold text-white/90 mt-0.5">Onaylanan & Yayına Alınan</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-white/80 mt-2 font-mono">Evrak Havuzuna Aktarıldı</span>
            </div>

            <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{revisionScraperCount}</div>
                <p className="text-xs font-semibold text-white/90 mt-0.5">Yeniden Kazıma (Re-Scrape)</p>
              </div>
              <RefreshCw className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-white/80 mt-2 font-mono">Eksik Dosya / Bozuk Format</span>
            </div>

            <div className="bg-[#dc3545] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{rejectedScraperCount}</div>
                <p className="text-xs font-semibold text-white/90 mt-0.5">Reddedilen / Mükerrer</p>
              </div>
              <XCircle className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-white/80 mt-2 font-mono">Duplicate & Çöp Filtresi</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { key: "pending", label: "Onay Bekleyenler", count: pendingScraperCount },
                  { key: "approved", label: "Onaylananlar" },
                  { key: "revision_required", label: "Yeniden Kazı / Revizyon" },
                  { key: "rejected", label: "Mükerrer / Reddedilenler" },
                  { key: "all", label: "Tüm Kazıma Havuzu" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setModFilterStatus(tab.key as any)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                      modFilterStatus === tab.key
                        ? "bg-[#17a2b8] text-white font-bold shadow-xs"
                        : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-[#17a2b8] font-mono font-bold">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Kazınan başlık veya bot ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1 text-xs text-[#495057] focus:outline-none focus:border-[#17a2b8]"
                />
              </div>
            </div>
          </div>

          {/* Scraper Moderation Table */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
            {filteredScraperItems.length === 0 ? (
              <div className="p-10 text-center text-[#6c757d] space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-[#28a745]" />
                <div className="text-sm font-bold text-[#212529]">Scraper Moderasyon Kuyruğu Boş</div>
                <p className="text-xs text-[#6c757d]">
                  Seçilen filtrelere uygun incelenecek kazıma çıktısı bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#495057]">
                  <thead className="bg-[#f4f6f9] text-[10px] font-bold uppercase tracking-wider text-[#495057] border-b border-[#dee2e6]">
                    <tr>
                      <th className="py-2.5 px-3">Kazınan Evrak & Başlık</th>
                      <th className="py-2.5 px-3">Kaynak Bot</th>
                      <th className="py-2.5 px-3">AI Bütünlük & Kopya Skoru</th>
                      <th className="py-2.5 px-3">Tarih</th>
                      <th className="py-2.5 px-3">Durum</th>
                      <th className="py-2.5 px-3 text-right">Moderasyon İşlemleri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dee2e6]">
                    {filteredScraperItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f8f9fa]">
                        <td className="py-2.5 px-3 max-w-sm">
                          <div className="font-bold text-[#212529] truncate">{item.title}</div>
                          <div className="text-[11px] text-[#6c757d] mt-0.5 truncate flex items-center gap-1">
                            <span className="text-gray-400">Not:</span> {item.aiSafetySummary}
                          </div>
                          {item.reviewerNotes && (
                            <div className="text-[10px] text-[#856404] bg-[#fff3cd] border border-[#ffeeba] rounded px-1.5 py-0.5 mt-1">
                              <strong>Moderatör Notu:</strong> {item.reviewerNotes}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[#212529] font-medium">
                            <Radio className="w-3.5 h-3.5 text-[#17a2b8]" />
                            <span>{item.submittedBy}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.aiSafetyScore > 80
                                    ? "bg-[#28a745]"
                                    : item.aiSafetyScore > 50
                                    ? "bg-[#ffc107]"
                                    : "bg-[#dc3545]"
                                }`}
                                style={{ width: `${item.aiSafetyScore}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold text-[11px] ${
                                item.aiSafetyScore > 80
                                  ? "text-[#28a745]"
                                  : item.aiSafetyScore > 50
                                  ? "text-[#856404]"
                                  : "text-[#dc3545]"
                              }`}
                            >
                              %{item.aiSafetyScore}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[#6c757d] font-mono text-[11px]">
                          {item.submittedAt}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === "pending" || item.status === "in_review"
                                ? "bg-[#ffc107]/20 text-[#856404]"
                                : item.status === "approved"
                                ? "bg-[#28a745]/20 text-[#28a745]"
                                : item.status === "revision_required"
                                ? "bg-[#17a2b8]/20 text-[#17a2b8]"
                                : "bg-[#dc3545]/20 text-[#dc3545]"
                            }`}
                          >
                            {item.status === "pending" || item.status === "in_review"
                              ? "Onay Bekliyor"
                              : item.status === "approved"
                              ? "Arşivde / Yayında"
                              : item.status === "revision_required"
                              ? "Yeniden Kazı (Re-Scrape)"
                              : "Reddedildi / Mükerrer"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedModItem(item)}
                              className="px-2 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Detay & Önizleme"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                              İncele
                            </button>

                            {item.status !== "approved" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModItem(item);
                                  setActionModal("approve");
                                }}
                                className="px-2.5 py-1 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                                title="Onayla & Evrak Havuzuna Aktar"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Onayla & Yayına Al
                              </button>
                            )}

                            {item.status !== "revision_required" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModItem(item);
                                  setActionModal("revision");
                                }}
                                className="px-2 py-1 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Yeniden Kazıma İste"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Re-Scrape
                              </button>
                            )}

                            {item.status !== "rejected" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModItem(item);
                                  setActionModal("reject");
                                }}
                                className="px-2 py-1 rounded bg-[#dc3545]/10 hover:bg-[#dc3545]/20 text-[#dc3545] border border-[#dc3545]/30 text-xs font-semibold transition-colors cursor-pointer"
                                title="Mükerrer / Reddet"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reddet
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED BOT SOURCES */}
      {activeTab === "sources" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white border border-[#dee2e6] rounded shadow-xs p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#17a2b8]" />
                      <h3 className="text-xs font-bold text-[#212529]">{src.name}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        src.status === "running"
                          ? "bg-[#ffc107]/20 text-[#856404] animate-pulse"
                          : "bg-[#28a745]/10 text-[#28a745]"
                      }`}
                    >
                      {src.status === "running" ? "Kazınıyor" : "Hazır (Idle)"}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#6c757d] truncate mt-1.5 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{src.targetUrl}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-[#f8f9fa] rounded border border-[#dee2e6] text-[11px]">
                    <div>
                      <span className="text-[#6c757d] block text-[10px]">Periyot</span>
                      <span className="text-[#212529] font-mono">{src.cronExpression}</span>
                    </div>
                    <div>
                      <span className="text-[#6c757d] block text-[10px]">Son Kazıma</span>
                      <span className="text-[#212529] font-mono">{src.lastRunAt || "Henüz yok"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#dee2e6] flex items-center justify-between">
                  <span className="text-[11px] text-[#6c757d]">
                    Toplam: <strong className="text-[#212529]">{src.lastItemCount} Evrak</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerScrapeSource(src.id)}
                    disabled={src.status === "running"}
                    className="px-2.5 py-1 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    Şimdi Kazı
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: JOBS & HISTORY */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#dee2e6] flex items-center justify-between bg-[#f8f9fa]">
              <div>
                <h3 className="text-xs font-bold text-[#212529]">Son Kazıma Görevleri & Ayıklanan Veriler</h3>
                <p className="text-[11px] text-[#6c757d] mt-0.5">
                  İşlenen veriler otomatik duplicate kontrolünden geçip moderasyon havuzuna aktarılır.
                </p>
              </div>
              <span className="text-xs text-[#6c757d] font-mono">{scraperJobs.length} Görev</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f4f6f9] border-b border-[#dee2e6] text-[#495057] font-semibold">
                    <th className="p-3">Kaynak & Başlık</th>
                    <th className="p-3">Bulunan Dosyalar</th>
                    <th className="p-3">Benzerlik Skoru</th>
                    <th className="p-3">Tarih</th>
                    <th className="p-3">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6]">
                  {scraperJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-3 max-w-sm">
                        <div className="text-[#6c757d] text-[10px] font-semibold">{job.sourceName}</div>
                        <div className="font-bold text-[#212529] truncate">{job.rawTitle}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex gap-1 flex-wrap">
                          {job.foundFiles.map((file) => (
                            <span
                              key={file}
                              className="px-2 py-0.5 rounded bg-[#f8f9fa] border border-[#ced4da] text-[#007bff] text-[10px]"
                            >
                              {file}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-[11px] ${
                              job.similarityScore > 0.8 ? "text-[#dc3545]" : "text-[#28a745]"
                            }`}
                          >
                            %{(job.similarityScore * 100).toFixed(0)}
                          </span>
                          {job.isDuplicate && (
                            <span className="px-1.5 py-0.2 rounded bg-[#dc3545]/10 text-[#dc3545] text-[9px] font-bold">
                              KOPYA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-[#6c757d] font-mono text-[11px]">
                        {job.scrapedAt}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffc107]/20 text-[#856404]">
                          Moderasyon Kuyruğunda
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SSRF & URL SECURITY SANDBOX */}
      {activeTab === "ssrf" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* URL Test Form */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#28a745]" />
                <h3 className="text-xs font-bold text-[#212529]">Canlı URL & SSRF Güvenlik Testi</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#28a745]/10 text-[#28a745] font-bold">
                Güvenli Sandbox
              </span>
            </div>

            <p className="text-xs text-[#6c757d] leading-relaxed">
              Sistem Güvenliği İlkesi: Scraper motoru, iç ağlara ve yerel IP adreslerine (localhost, 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, vb.) yapılan SSRF saldırılarını otomatik engeller.
            </p>

            <form onSubmit={handleTestUrl} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#495057] mb-1">
                  Hedef URL (Denemek için yerel IP veya resmi site girebilirsiniz):
                </label>
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://meb.gov.tr/... veya http://127.0.0.1/admin"
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                />
              </div>

              {/* Quick pre-filled tests */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setTestUrl("https://ogmmateryal.eba.gov.tr/kazanim-testleri")}
                  className="px-2 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] transition-colors cursor-pointer"
                >
                  + EBA Kazanım Testleri (Güvenli)
                </button>
                <button
                  type="button"
                  onClick={() => setTestUrl("http://127.0.0.1:8080/internal")}
                  className="px-2 py-1 rounded bg-[#dc3545]/10 hover:bg-[#dc3545]/20 text-[#dc3545] border border-[#dc3545]/30 transition-colors cursor-pointer font-semibold"
                >
                  + SSRF Testi (127.0.0.1 Blokajı)
                </button>
                <button
                  type="button"
                  onClick={() => setTestUrl("http://192.168.1.1/router")}
                  className="px-2 py-1 rounded bg-[#dc3545]/10 hover:bg-[#dc3545]/20 text-[#dc3545] border border-[#dc3545]/30 transition-colors cursor-pointer font-semibold"
                >
                  + Yerel Ağ Testi (192.168.1.1 Blokajı)
                </button>
              </div>

              <button
                type="submit"
                disabled={testing}
                className="w-full py-2 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Test Ediliyor...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" /> URL'yi Çözümle & Test Et
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Test Result Console */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#007bff]" />
                  <h3 className="text-xs font-bold text-[#212529]">Çıkarım & Güvenlik Raporu</h3>
                </div>
                {testResult && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      testResult.status === "blocked_ssrf"
                        ? "bg-[#dc3545]/10 text-[#dc3545]"
                        : "bg-[#28a745]/10 text-[#28a745]"
                    }`}
                  >
                    {testResult.status === "blocked_ssrf" ? "SSRF ENGELİ TETİKLENDİ" : "BAŞARILI"}
                  </span>
                )}
              </div>

              <div className="mt-2.5">
                {testResult ? (
                  <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6] font-mono text-xs text-[#212529] space-y-2 max-h-60 overflow-y-auto">
                    <div className="text-[11px] text-[#6c757d]">
                      Durum: <span className="text-[#212529] font-bold">{testResult.message}</span>
                    </div>

                    {testResult.ssrfCheck && (
                      <div className="p-2 rounded bg-white border border-[#dee2e6] text-[11px] space-y-1">
                        <div className="text-[#6c757d]">
                          SSRF Kontrolü:{" "}
                          <span
                            className={
                              testResult.ssrfCheck.allowed ? "text-[#28a745] font-bold" : "text-[#dc3545] font-bold"
                            }
                          >
                            {testResult.ssrfCheck.allowed ? "İzin Verildi (Genel IP)" : "Engellendi (Özel / Yerel IP)"}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6c757d]">
                          Çözülen IP: {testResult.ssrfCheck.resolvedIp || "Belirlenemedi"}
                        </div>
                      </div>
                    )}

                    {testResult.extractedData && (
                      <div className="space-y-1 pt-1 text-[11px]">
                        <div className="text-[#007bff] font-semibold">Ayıklanan Başlık:</div>
                        <div className="text-[#212529]">{testResult.extractedData.title}</div>
                        <div className="text-[#6c757d] mt-1">İçerik Özeti:</div>
                        <p className="text-[#495057]">{testResult.extractedData.contentSnippet}</p>
                        <div className="text-[#6c757d] mt-1">Tespit Edilen Dosyalar:</div>
                        <div className="flex gap-1 flex-wrap">
                          {testResult.extractedData.detectedFiles?.map((f: any) => (
                            <span
                              key={f.name}
                              className="px-2 py-0.5 rounded bg-white border border-[#ced4da] text-[#007bff] text-[10px]"
                            >
                              {f.name} ({f.type})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-[#6c757d] space-y-1 border border-dashed border-[#dee2e6] rounded">
                    <Radio className="w-6 h-6 text-gray-400" />
                    <div className="text-xs">Sol panelden bir URL test edin.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL PREVIEW MODAL */}
      {selectedModItem && !actionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#17a2b8]" />
                <h3 className="text-sm font-bold text-[#212529]">Kazınan Evrak Detayı</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModItem(null)}
                className="text-[#6c757d] hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#6c757d] block text-[10px] uppercase font-bold">Evrak Başlığı</span>
                <p className="text-sm font-bold text-[#212529] mt-0.5">{selectedModItem.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] rounded border border-[#dee2e6]">
                <div>
                  <span className="text-[#6c757d] block text-[10px]">Kaynak Bot</span>
                  <span className="text-[#212529] font-semibold">{selectedModItem.submittedBy}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block text-[10px]">Kazıma Tarihi</span>
                  <span className="text-[#212529] font-mono">{selectedModItem.submittedAt}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block text-[10px]">AI Bütünlük Skoru</span>
                  <span className="text-[#28a745] font-bold font-mono">%{selectedModItem.aiSafetyScore} Güvenli</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block text-[10px]">Mevcut Durum</span>
                  <span className="font-bold text-[#17a2b8]">{selectedModItem.status}</span>
                </div>
              </div>

              <div>
                <span className="text-[#6c757d] block text-[10px] uppercase font-bold">Sistem Analiz Notu</span>
                <p className="text-[#495057] bg-white p-2.5 rounded border border-[#dee2e6] mt-1 leading-relaxed">
                  {selectedModItem.aiSafetySummary}
                </p>
              </div>

              {selectedModItem.reviewerNotes && (
                <div>
                  <span className="text-[#856404] block text-[10px] uppercase font-bold">Moderatör Revizyon Notu</span>
                  <p className="text-[#856404] bg-[#fff3cd] p-2 rounded border border-[#ffeeba] mt-1">
                    {selectedModItem.reviewerNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dee2e6]">
              <button
                type="button"
                onClick={() => setSelectedModItem(null)}
                className="px-3 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-semibold cursor-pointer"
              >
                Kapat
              </button>

              <button
                type="button"
                onClick={() => setActionModal("revision")}
                className="px-3 py-1.5 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-semibold cursor-pointer"
              >
                Yeniden Kazı Talebi
              </button>

              <button
                type="button"
                onClick={() => setActionModal("approve")}
                className="px-3 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Onayla & Arşive Al
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION CONFIRMATION MODAL (Approve, Reject, Revision) */}
      {actionModal && selectedModItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">
                {actionModal === "approve"
                  ? "Scraper Evrakını Onayla & Yayına Al"
                  : actionModal === "reject"
                  ? "Scraper Evrakını Reddet (Mükerrer / Çöp)"
                  : "Yeniden Kazıma (Re-Scrape) Talep Et"}
              </h3>
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="text-[#6c757d] hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#495057]">
              <strong>{selectedModItem.title}</strong> başlıklı kazıma içeriği için işlem yapıyorsunuz.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                {actionModal === "approve"
                  ? "Onay Notu (Opsiyonel):"
                  : actionModal === "reject"
                  ? "Reddedilme / Mükerrer Sebebi:"
                  : "Yeniden Kazıma & Revizyon Notu:"}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={
                  actionModal === "approve"
                    ? "Tüm kontroller sağlandı, evrak havuzuna aktarıldı."
                    : actionModal === "reject"
                    ? "Örn: Mevzuat veri tabanında duplicate kayıt tespit edildi."
                    : "Örn: PDF ek dosyası eksik indi, kaynak URL tekrar taranmalı."
                }
                rows={3}
                className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#17a2b8]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-3 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-medium cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-3.5 py-1.5 rounded text-white text-xs font-bold cursor-pointer shadow-xs ${
                  actionModal === "approve"
                    ? "bg-[#28a745] hover:bg-[#218838]"
                    : actionModal === "reject"
                    ? "bg-[#dc3545] hover:bg-[#c82333]"
                    : "bg-[#17a2b8] hover:bg-[#138496]"
                }`}
              >
                {actionModal === "approve"
                  ? "Onayla & Arşive Ekle"
                  : actionModal === "reject"
                  ? "İşlemi Reddet"
                  : "Revizyonu Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {isAddSourceOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni Kazıma Kaynağı Ekle</h3>
              <button
                type="button"
                onClick={() => setIsAddSourceOpen(false)}
                className="text-[#6c757d] hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Kaynak Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: MEB Ortaöğretim Genel Müdürlüğü Duyuruları"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">Hedef URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://ogm.meb.gov.tr/duyurular"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">
                  Otomatik Eşlenecek Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsAddSourceOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Kaynağı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
