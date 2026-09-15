import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  BookOpen,
  Share2,
  Plus,
  Trash2,
  Sparkles,
  Send,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Search,
  Check,
  XCircle,
  RefreshCw,
  FileText,
  UserCheck,
  AlertCircle,
  Layers,
} from "lucide-react";
import { ContentItem, SocialPost, SocialPlatform, ModerationItem } from "../../types";

export const ContentsSocialView: React.FC = () => {
  const {
    contents,
    addContent,
    deleteContent,
    socialAccounts,
    socialPosts,
    addSocialPost,
    publishSocialPostNow,
    runAgent,
    currentUser,
    activeSubItemId,
    moderationItems,
    approveModerationItem,
    rejectModerationItem,
    requestRevisionModerationItem,
  } = useApp();

  // Filter content moderation items
  const contentModItems = moderationItems.filter((item) => item.targetType === "content");
  const pendingContentCount = contentModItems.filter((m) => m.status === "pending" || m.status === "in_review").length;
  const approvedContentCount = contentModItems.filter((m) => m.status === "approved").length;
  const revisionContentCount = contentModItems.filter((m) => m.status === "revision_required").length;
  const rejectedContentCount = contentModItems.filter((m) => m.status === "rejected").length;

  // Active Main Tab - Default to content_moderation if pending items or subitem indicates
  const [activeTab, setActiveTab] = useState<"content_moderation" | "content" | "social">(
    pendingContentCount > 0 ? "content_moderation" : "content"
  );

  // Content moderation filtering
  const [modFilterStatus, setModFilterStatus] = useState<"pending" | "approved" | "revision_required" | "rejected" | "all">("pending");
  const [modSearchQuery, setModSearchQuery] = useState("");
  const [selectedModItem, setSelectedModItem] = useState<ModerationItem | null>(null);
  const [actionModal, setActionModal] = useState<"approve" | "reject" | "revision" | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isAddSocialPostOpen, setIsAddSocialPostOpen] = useState(false);

  // Content form
  const [contentTitle, setContentTitle] = useState("");
  const [contentCategory, setContentCategory] = useState("MEB Duyuruları");
  const [contentSummary, setContentSummary] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Social form
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("twitter");
  const [socialText, setSocialText] = useState("");
  const [socialScheduleTime, setSocialScheduleTime] = useState("");

  // Sync with subItem clicks
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("icerik_moderasyon") || activeSubItemId.includes("taslaklar")) {
      setActiveTab("content_moderation");
    } else if (activeSubItemId.includes("haberler") || activeSubItemId.includes("rehberler")) {
      setActiveTab("content");
    } else if (activeSubItemId.includes("sosyal") || activeSubItemId.includes("kanallar")) {
      setActiveTab("social");
    }
  }, [activeSubItemId]);

  const filteredContentModItems = contentModItems.filter((item) => {
    const matchesStatus = modFilterStatus === "all" || item.status === modFilterStatus;
    const matchesSearch =
      modSearchQuery === "" ||
      item.title.toLowerCase().includes(modSearchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(modSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmAction = () => {
    if (!selectedModItem || !actionModal) return;

    if (actionModal === "approve") {
      approveModerationItem(selectedModItem.id, actionNotes || "Pedagojik ve resmi kontrolden geçti, yayına alındı.");
    } else if (actionModal === "reject") {
      rejectModerationItem(selectedModItem.id, actionNotes || "İçerik standartlara uygun bulunmadığı için reddedildi.");
    } else if (actionModal === "revision") {
      requestRevisionModerationItem(selectedModItem.id, actionNotes || "Editöryal düzenleme ve kaynak kontrolü istendi.");
    }

    setActionModal(null);
    setSelectedModItem(null);
    setActionNotes("");
  };

  const handleGenerateAiSummary = async () => {
    if (!contentTitle.trim()) return;
    setIsAiGenerating(true);
    try {
      const summary = await runAgent(
        "icerik_ajani",
        `Bu başlık için 2 cümlelik MEB öğretmenlerine yönelik haber özeti çıkar: "${contentTitle}"`
      );
      setContentSummary(summary);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim()) return;

    addContent({
      title: contentTitle,
      category: contentCategory,
      summary: contentSummary,
      body: contentBody,
      coverImageUrl:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
      status: "published",
      publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      authorName: currentUser.fullName || currentUser.name || "Mustafa Yılmaz",
      views: 0,
      seoMeta: {
        title: contentTitle,
        description: contentSummary,
      },
    });

    setIsAddContentOpen(false);
    setContentTitle("");
    setContentSummary("");
    setContentBody("");
  };

  const handleGenerateSocialAi = async () => {
    setIsAiGenerating(true);
    try {
      const tweet = await runAgent(
        "sosyal_ajani",
        `Öğretmenlere 2Evrak'taki yeni MEB zümre kararlarını ve sınav evraklarını duyuran çekici bir ${socialPlatform} paylaşımı hazırla.`
      );
      setSocialText(tweet);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateSocialPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialText.trim()) return;

    addSocialPost({
      referenceType: "custom",
      targetPlatforms: [socialPlatform],
      contentPerPlatform: {
        twitter: socialPlatform === "twitter" ? socialText : "",
        telegram: socialPlatform === "telegram" ? socialText : "",
        instagram: socialPlatform === "instagram" ? socialText : "",
        linkedin: socialPlatform === "linkedin" ? socialText : "",
        facebook: "",
        youtube: "",
      },
      status: socialScheduleTime ? "scheduled" : "published",
      scheduledFor: socialScheduleTime || undefined,
      publishedAt: socialScheduleTime ? undefined : new Date().toISOString().replace("T", " ").substring(0, 16),
      metrics: { impressions: 0, engagements: 0, shares: 0 },
    });

    setIsAddSocialPostOpen(false);
    setSocialText("");
  };

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Box */}
      <div className="bg-white border-l-4 border-l-[#6f42c1] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6f42c1]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                İçerik & Sosyal Medya Yönetim Merkezi
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#f3e8ff] text-[#6f42c1] font-bold border border-[#e9d5ff]">
                Modül Odaklı Moderasyon
              </span>
            </div>
            <p className="text-xs text-[#6c757d]">
              Pedagojik makaleler, MEB haberleri, kılavuzlar ve sosyal medya dağıtım kanalları için editoryal onay havuzu.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === "social" ? (
              <button
                type="button"
                onClick={() => setIsAddSocialPostOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#6f42c1] hover:bg-[#5a32a3] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Gönderi Planla
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddContentOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Yeni İçerik Yaz
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AdminLTE Nav Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded border border-[#dee2e6] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("content_moderation")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "content_moderation"
                ? "bg-[#6f42c1] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>İçerik Moderasyon Havuzu</span>
            {pendingContentCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                  activeTab === "content_moderation"
                    ? "bg-white text-[#6f42c1]"
                    : "bg-[#dc3545] text-white"
                }`}
              >
                {pendingContentCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "content"
                ? "bg-[#6f42c1] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tüm Makale & Haberler</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 font-mono">
              {contents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "social"
                ? "bg-[#6f42c1] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Sosyal Medya Kanalları & Planlayıcı</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 font-mono">
              {socialPosts.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-[#6c757d] flex items-center gap-1 font-mono">
          <BookOpen className="w-3.5 h-3.5 text-[#6f42c1]" />
          <span>Filtre: Sadece İçerik & Makaleler</span>
        </div>
      </div>

      {/* TAB 1: CONTENT-SPECIFIC MODERATION QUEUE */}
      {activeTab === "content_moderation" && (
        <div className="space-y-4">
          {/* AdminLTE Small Boxes: Content Specific Moderation Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#ffc107] text-[#1f2d3d] rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{pendingContentCount}</div>
                <p className="text-xs font-bold text-[#1f2d3d]/90 mt-0.5">Onay Bekleyen İçerik</p>
              </div>
              <Clock className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-[#1f2d3d]/80 mt-2 font-mono">Yazar & Editör Taslakları</span>
            </div>

            <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{approvedContentCount}</div>
                <p className="text-xs font-semibold text-white/90 mt-0.5">Onaylanan & Yayındakiler</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-white/80 mt-2 font-mono">Genel Portala Aktarıldı</span>
            </div>

            <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{revisionContentCount}</div>
                <p className="text-xs font-semibold text-white/90 mt-0.5">Revizyon Bekleyenler</p>
              </div>
              <RefreshCw className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-white/80 mt-2 font-mono">Düzeltme İstenen Yazılar</span>
            </div>

            <div className="bg-[#dc3545] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
              <div>
                <div className="text-2xl font-black font-mono">{rejectedContentCount}</div>
                <p className="text-xs font-semibold text-white/90 mt-0.5">Reddedilen / Taslak</p>
              </div>
              <XCircle className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
              <span className="text-[10px] text-white/80 mt-2 font-mono">Standart Dışı İçerikler</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { key: "pending", label: "Onay Bekleyenler", count: pendingContentCount },
                  { key: "approved", label: "Onaylananlar" },
                  { key: "revision_required", label: "Revizyon İstenenler" },
                  { key: "rejected", label: "Reddedilenler" },
                  { key: "all", label: "Tüm İçerik Havuzu" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setModFilterStatus(tab.key as any)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                      modFilterStatus === tab.key
                        ? "bg-[#6f42c1] text-white font-bold shadow-xs"
                        : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-[#6f42c1] font-mono font-bold">
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
                  placeholder="Başlık veya yazar ara..."
                  value={modSearchQuery}
                  onChange={(e) => setModSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1 text-xs text-[#495057] focus:outline-none focus:border-[#6f42c1]"
                />
              </div>
            </div>
          </div>

          {/* Content Moderation Table */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
            {filteredContentModItems.length === 0 ? (
              <div className="p-10 text-center text-[#6c757d] space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-[#28a745]" />
                <div className="text-sm font-bold text-[#212529]">İçerik Moderasyon Kuyruğu Boş</div>
                <p className="text-xs text-[#6c757d]">
                  Seçilen filtrelere uygun incelenecek makale veya haber bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#495057]">
                  <thead className="bg-[#f4f6f9] text-[10px] font-bold uppercase tracking-wider text-[#495057] border-b border-[#dee2e6]">
                    <tr>
                      <th className="py-2.5 px-3">İçerik Başlığı & Özet</th>
                      <th className="py-2.5 px-3">Yazar / Editör</th>
                      <th className="py-2.5 px-3">AI Pedagojik Güvenlik</th>
                      <th className="py-2.5 px-3">Tarih</th>
                      <th className="py-2.5 px-3">Durum</th>
                      <th className="py-2.5 px-3 text-right">Moderasyon İşlemleri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dee2e6]">
                    {filteredContentModItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f8f9fa]">
                        <td className="py-2.5 px-3 max-w-sm">
                          <div className="font-bold text-[#212529] truncate">{item.title}</div>
                          <div className="text-[11px] text-[#6c757d] mt-0.5 truncate flex items-center gap-1">
                            <span className="text-gray-400">Analiz:</span> {item.aiSafetySummary}
                          </div>
                          {item.reviewerNotes && (
                            <div className="text-[10px] text-[#856404] bg-[#fff3cd] border border-[#ffeeba] rounded px-1.5 py-0.5 mt-1">
                              <strong>Editör Notu:</strong> {item.reviewerNotes}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[#212529] font-medium">
                            <UserCheck className="w-3.5 h-3.5 text-[#6f42c1]" />
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
                              ? "Yayında"
                              : item.status === "revision_required"
                              ? "Revizyon İstendi"
                              : "Reddedildi / Taslak"}
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
                              Oku
                            </button>

                            {item.status !== "approved" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModItem(item);
                                  setActionModal("approve");
                                }}
                                className="px-2.5 py-1 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                                title="Onayla & Portala Yayınla"
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
                                title="Revizyon İste"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Revizyon
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
                                title="Reddet"
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

      {/* TAB 2: ALL CONTENTS (ARTICLES & NEWS) */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <img
                  src={item.coverImageUrl}
                  alt=""
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] text-[#6c757d] mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#f8f9fa] text-[#007bff] font-semibold border border-[#dee2e6]">
                      {item.category}
                    </span>
                    <span className="font-mono">{item.publishedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#212529] line-clamp-1 mt-1.5">{item.title}</h3>
                  <p className="text-xs text-[#6c757d] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-3 border-t border-[#dee2e6] flex items-center justify-between text-xs text-[#6c757d] bg-[#f8f9fa]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-gray-400" /> {item.views.toLocaleString("tr-TR")} Görüntülenme
                </span>
                <button
                  type="button"
                  onClick={() => deleteContent(item.id)}
                  className="text-[#dc3545] hover:text-[#bd2130] p-1 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SOCIAL MEDIA */}
      {activeTab === "social" && (
        <div className="space-y-4">
          {/* Connected Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white border border-[#dee2e6] rounded p-3.5 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#212529] capitalize">{acc.platform}</div>
                  <div className="text-[11px] text-[#007bff] font-mono">{acc.handle}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#212529] font-mono">
                    {acc.followersCount.toLocaleString("tr-TR")}
                  </div>
                  <span className="text-[10px] text-[#6c757d]">Takipçi</span>
                </div>
              </div>
            ))}
          </div>

          {/* Social Posts Feed */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#dee2e6] flex items-center justify-between bg-[#f8f9fa]">
              <h3 className="text-xs font-bold text-[#212529]">Çok Kanallı Sosyal Medya Akışı</h3>
              <span className="text-xs text-[#6c757d] font-mono">{socialPosts.length} Gönderi</span>
            </div>

            <div className="divide-y divide-[#dee2e6]">
              {socialPosts.map((post) => {
                const mainPlatform = post.targetPlatforms[0] || "twitter";
                const displayContent =
                  post.contentPerPlatform[mainPlatform] ||
                  Object.values(post.contentPerPlatform).find((v) => v) ||
                  "";
                return (
                  <div key={post.id} className="p-4 hover:bg-[#f8f9fa] transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-[#6f42c1]/10 text-[#6f42c1] border border-[#6f42c1]/20">
                        {post.targetPlatforms.join(" • ")}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          post.status === "published"
                            ? "bg-[#28a745]/10 text-[#28a745]"
                            : "bg-[#ffc107]/20 text-[#856404]"
                        }`}
                      >
                        {post.status === "published" ? "Yayında" : "Zamanlandı"}
                      </span>
                    </div>

                    <p className="text-xs text-[#212529] whitespace-pre-wrap leading-relaxed">
                      {displayContent}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-[#6c757d] border-t border-[#dee2e6]">
                      <div className="flex items-center gap-4 font-mono">
                        <span>👁️ {post.metrics?.impressions || 0}</span>
                        <span>💬 {post.metrics?.engagements || 0}</span>
                        <span>🔄 {post.metrics?.shares || 0}</span>
                      </div>

                      {post.status === "scheduled" && (
                        <button
                          type="button"
                          onClick={() => publishSocialPostNow(post.id)}
                          className="px-2.5 py-1 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" /> Şimdi Yayınla
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
                <BookOpen className="w-4 h-4 text-[#6f42c1]" />
                <h3 className="text-sm font-bold text-[#212529]">İçerik İnceleme & Detayı</h3>
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
                <span className="text-[#6c757d] block text-[10px] uppercase font-bold">İçerik Başlığı</span>
                <p className="text-sm font-bold text-[#212529] mt-0.5">{selectedModItem.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] rounded border border-[#dee2e6]">
                <div>
                  <span className="text-[#6c757d] block text-[10px]">Yazar / Gönderen</span>
                  <span className="text-[#212529] font-semibold">{selectedModItem.submittedBy}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block text-[10px]">Gönderim Tarihi</span>
                  <span className="text-[#212529] font-mono">{selectedModItem.submittedAt}</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block text-[10px]">AI Güvenlik & Pedagoji Skoru</span>
                  <span className="text-[#28a745] font-bold font-mono">%{selectedModItem.aiSafetyScore} Uyumlu</span>
                </div>
                <div>
                  <span className="text-[#6c757d] block text-[10px]">Mevcut Durum</span>
                  <span className="font-bold text-[#6f42c1]">{selectedModItem.status}</span>
                </div>
              </div>

              <div>
                <span className="text-[#6c757d] block text-[10px] uppercase font-bold">Sistem Analiz Özeti</span>
                <p className="text-[#495057] bg-white p-2.5 rounded border border-[#dee2e6] mt-1 leading-relaxed">
                  {selectedModItem.aiSafetySummary}
                </p>
              </div>

              {selectedModItem.reviewerNotes && (
                <div>
                  <span className="text-[#856404] block text-[10px] uppercase font-bold">Editör Revizyon Notu</span>
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
                Revizyon İste
              </button>

              <button
                type="button"
                onClick={() => setActionModal("approve")}
                className="px-3 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Onayla & Yayına Al
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION CONFIRMATION MODAL */}
      {actionModal && selectedModItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">
                {actionModal === "approve"
                  ? "İçeriği Onayla & Portala Yayınla"
                  : actionModal === "reject"
                  ? "İçeriği Reddet / Taslağa Al"
                  : "Yazardan Revizyon Talep Et"}
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
              <strong>{selectedModItem.title}</strong> başlıklı makale/duyuru için işlem yapıyorsunuz.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                {actionModal === "approve"
                  ? "Editör Onay Notu (Opsiyonel):"
                  : actionModal === "reject"
                  ? "Reddetme Gerekçesi:"
                  : "Yazara İletilecek Revizyon Notu:"}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={
                  actionModal === "approve"
                    ? "Tüm kontroller sağlandı, ana portala yayınlandı."
                    : actionModal === "reject"
                    ? "Örn: Mevzuat ile çelişen pedagojik öneriler içeriyor."
                    : "Örn: Giriş paragrafına RAM tavsiyesi ve resmi bağlantı eklenmeli."
                }
                rows={3}
                className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#6f42c1]"
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
                  ? "Onayla & Portala Yayınla"
                  : actionModal === "reject"
                  ? "İçeriği Reddet"
                  : "Revizyonu Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {isAddContentOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-lg w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni Eğitim İçeriği / Makale</h3>
              <button
                type="button"
                onClick={() => setIsAddContentOpen(false)}
                className="text-[#6c757d] hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">İçerik Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2026 MEB Zümre Takvimi Açıklandı"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#495057] font-semibold">Haber Özeti</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiSummary}
                    disabled={isAiGenerating || !contentTitle.trim()}
                    className="text-[10px] text-[#6f42c1] hover:text-[#5a32a3] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> AI ile Özetle
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={contentSummary}
                  onChange={(e) => setContentSummary(e.target.value)}
                  placeholder="Kısa spot metni..."
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">Makale Gövdesi</label>
                <textarea
                  rows={4}
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Detaylı metin..."
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsAddContentOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Yayına Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Social Post Modal */}
      {isAddSocialPostOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Sosyal Medya Paylaşımı Planla</h3>
              <button
                type="button"
                onClick={() => setIsAddSocialPostOpen(false)}
                className="text-[#6c757d] hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSocialPost} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Kanal</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as any)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                >
                  <option value="twitter">X (Twitter)</option>
                  <option value="telegram">Telegram Öğretmen Kanalı</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#495057] font-semibold">Paylaşım Metni</label>
                  <button
                    type="button"
                    onClick={handleGenerateSocialAi}
                    disabled={isAiGenerating}
                    className="text-[10px] text-[#6f42c1] hover:text-[#5a32a3] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> AI ile Metin Oluştur
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={socialText}
                  onChange={(e) => setSocialText(e.target.value)}
                  placeholder="Gönderi metni ve etiketler..."
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsAddSocialPostOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-medium cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#6f42c1] hover:bg-[#5a32a3] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Planla & Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
