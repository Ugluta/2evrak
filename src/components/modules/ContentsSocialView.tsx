import React, { useState } from "react";
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
} from "lucide-react";
import { ContentItem, SocialPost, SocialPlatform } from "../../types";

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
  } = useApp();

  const [activeTab, setActiveTab] = useState<"content" | "social">("content");
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
      slug: contentTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      type: "announcement",
      summary: contentSummary || "MEB duyurusu ve güncel eğitim gelişmeleri.",
      body: contentBody || contentSummary,
      coverImageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
      authorName: currentUser.fullName,
      status: "published",
      publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      tags: ["meb", "egitim", "ogretmen"],
      seo: {
        metaTitle: `${contentTitle} - 2Evrak Haber`,
        metaDescription: (contentSummary || contentTitle).slice(0, 150),
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              07 & 08 — İçerik & Çok Kanallı Sosyal Medya
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Destekli Çok Kanallı Dağıtım
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            MEB Haberleri, Makaleler, Duyurular ve Twitter/Telegram/Instagram Otomasyonu
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "content" ? (
            <button
              onClick={() => setIsAddContentOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni İçerik Yaz
            </button>
          ) : (
            <button
              onClick={() => setIsAddSocialPostOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Gönderi Planla
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "content"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          07 İçerik Yönetimi ({contents.length})
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "social"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Share2 className="w-4 h-4" />
          08 Sosyal Medya Kanalları & Planlayıcı ({socialPosts.length})
        </button>
      </div>

      {/* Tab 1: Contents */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-colors"
            >
              <div>
                <img
                  src={item.coverImageUrl}
                  alt=""
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium">
                      {item.category}
                    </span>
                    <span className="font-mono">{item.publishedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-slate-500" /> {item.views.toLocaleString("tr-TR")}
                </span>
                <button
                  onClick={() => deleteContent(item.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Social Media */}
      {activeTab === "social" && (
        <div className="space-y-6">
          {/* Connected Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white capitalize">{acc.platform}</div>
                  <div className="text-[11px] text-indigo-400 font-mono">{acc.handle}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white font-mono">
                    {acc.followersCount.toLocaleString("tr-TR")}
                  </div>
                  <span className="text-[10px] text-slate-500">Takipçi</span>
                </div>
              </div>
            ))}
          </div>

          {/* Social Posts Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Çok Kanallı Sosyal Medya Akışı</h3>
              <span className="text-xs text-slate-400 font-mono">{socialPosts.length} Gönderi</span>
            </div>

            <div className="divide-y divide-slate-800">
              {socialPosts.map((post) => {
                const mainPlatform = post.targetPlatforms[0] || "twitter";
                const displayContent =
                  post.contentPerPlatform[mainPlatform] ||
                  Object.values(post.contentPerPlatform).find((v) => v) ||
                  "";
                return (
                  <div key={post.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {post.targetPlatforms.join(" • ")}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {post.status === "published" ? "Yayında" : "Zamanlandı"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {displayContent}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <div className="flex items-center gap-4 font-mono">
                        <span>👁️ {post.metrics?.impressions || 0}</span>
                        <span>💬 {post.metrics?.engagements || 0}</span>
                        <span>🔄 {post.metrics?.shares || 0}</span>
                      </div>

                      {post.status === "scheduled" && (
                        <button
                          onClick={() => publishSocialPostNow(post.id)}
                          className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors"
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

      {/* Add Content Modal */}
      {isAddContentOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Eğitim İçeriği / Makale</h3>
              <button onClick={() => setIsAddContentOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">İçerik Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2024 MEB Zümre Takvimi Açıklandı"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium">Haber Özeti</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiSummary}
                    disabled={isAiGenerating || !contentTitle.trim()}
                    className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> AI ile Özetle
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={contentSummary}
                  onChange={(e) => setContentSummary(e.target.value)}
                  placeholder="Kısa spot metni..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Makale Gövdesi</label>
                <textarea
                  rows={4}
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Detaylı metin..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddContentOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Sosyal Medya Paylaşımı Planla</h3>
              <button onClick={() => setIsAddSocialPostOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSocialPost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Kanal</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="twitter">X (Twitter)</option>
                  <option value="telegram">Telegram Öğretmen Kanalı</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium">Paylaşım Metni</label>
                  <button
                    type="button"
                    onClick={handleGenerateSocialAi}
                    disabled={isAiGenerating}
                    className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSocialPostOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
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
