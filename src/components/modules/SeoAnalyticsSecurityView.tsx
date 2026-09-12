import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Globe,
  BarChart3,
  ShieldCheck,
  Search,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Users,
  Download,
  Lock,
  Zap,
} from "lucide-react";

export const SeoAnalyticsSecurityView: React.FC = () => {
  const { documents, systemSettings, securityIncidents, resolveIncident } = useApp();

  const [activeTab, setActiveTab] = useState<"seo" | "analytics" | "security">("analytics");
  const [sitemapGenerated, setSitemapGenerated] = useState(false);

  const totalDownloads = documents.reduce((acc, d) => acc + d.downloadCount, 0);
  const totalViews = documents.reduce((acc, d) => acc + d.viewCount, 0);

  const handleGenerateSitemap = () => {
    setSitemapGenerated(true);
    setTimeout(() => setSitemapGenerated(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              17, 18 & 20 — SEO, Analitik & Sistem Güvenliği
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Kural 5: SEO Temelde & Kural 6: Güvenlik Mimarisinde
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Google MEB Arama Sıralamaları, 1 Milyon Öğretmen Metrikleri ve WAF/DDoS Tehdit Savunması
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "seo" && (
            <button
              onClick={handleGenerateSitemap}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              {sitemapGenerated ? "Sitemap Yenilendi!" : "XML Sitemap Yeniden Derle"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "analytics"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          18 İstatistik & Analitik
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "seo"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          17 SEO Merkezi & Schema
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          20 Güvenlik & WAF Koruma
        </button>
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Aktif Çevrimiçi Öğretmen</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-white font-['Space_Grotesk']">
                4,892
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">Son 15 dakikada aktif</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Toplam Evrak İndirme</span>
                <Download className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-white font-['Space_Grotesk']">
                {totalDownloads.toLocaleString("tr-TR")}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Tüm branşlar toplamı</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Toplam Sayfa Görüntüleme</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-white font-['Space_Grotesk']">
                {totalViews.toLocaleString("tr-TR")}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Aylık ortalama: ~1.2M</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Hedef: 1 Milyon Öğretmen</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-white font-['Space_Grotesk']">
                %42.6
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "42.6%" }} />
              </div>
            </div>
          </div>

          {/* Top Searched Queries & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">
                En Çok Aranan MEB Arama Terimleri (Trendler)
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { query: "fizik 1. dönem zümre tutanağı 2024", count: 18450, trend: "+32%" },
                  { query: "lgs deneme sınavı pdf cevap anahtarlı", count: 14200, trend: "+15%" },
                  { query: "veli toplantısı tutanağı anadolu lisesi", count: 9800, trend: "+8%" },
                  { query: "bep bireyselleştirilmiş eğitim planı", count: 8550, trend: "+24%" },
                  { query: "matematik ortak sınav senaryoları meb", count: 7900, trend: "+45%" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80"
                  >
                    <span className="text-slate-200 font-medium">{item.query}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400">
                        {item.count.toLocaleString("tr-TR")}
                      </span>
                      <span className="text-emerald-400 font-semibold">{item.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">En Çok İndirilen MEB Evrakları</h3>
              <div className="space-y-2 text-xs">
                {documents.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80"
                  >
                    <div className="truncate max-w-[240px]">
                      <div className="text-slate-200 font-medium truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-500">{doc.categoryName}</div>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold">
                      {doc.downloadCount.toLocaleString("tr-TR")} İndirme
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SEO */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Google Öğretmen Aramaları İçin Otomatik Schema (JSON-LD)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Her evrak sayfası için MEB yönergelerine uygun <code>LearningResource</code> ve{" "}
              <code>DigitalDocument</code> şemaları otomatik enjekte edilir.
            </p>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  "name": "${documents[0]?.title || "MEB Evrakı"}",
  "educationalLevel": "Lise / Ortaöğretim",
  "learningResourceType": "Zümre Tutanağı / Plan",
  "publisher": {
    "@type": "Organization",
    "name": "2Evrak Öğretmen Portalı",
    "url": "https://2evrak.com"
  },
  "inLanguage": "tr-TR"
}`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">robots.txt Önizlemesi</h3>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
{`User-agent: *
Allow: /
Allow: /dokumanlar/
Allow: /kategori/
Disallow: /admin/
Disallow: /api/
Sitemap: https://2evrak.com/sitemap.xml`}
              </pre>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">SEO Sağlık Kontrolleri</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span>Canonical URL Zorunluluğu</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span>OpenGraph & Twitter Cards</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span>Kırık Bağlantı (404) Taraması</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 Kırık Link
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & WAF */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Security Features Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>SSRF Koruması (Scraper)</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-base font-bold text-emerald-400">Tam Korumalı</div>
              <p className="text-[11px] text-slate-500 mt-1">127.0.0.1 ve iç IP blokları engellendi</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Rate Limiting (DDoS)</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2 text-base font-bold text-white">100 req / 15 dk</div>
              <p className="text-[11px] text-slate-500 mt-1">IP bazlı token bucket kuralı</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>SQL / XSS Injection Sanitizer</span>
                <Lock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-base font-bold text-emerald-400">Aktif</div>
              <p className="text-[11px] text-slate-500 mt-1">DOMPurify + Parametreli Sorgular</p>
            </div>
          </div>

          {/* Security Incidents Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Engellenen Güvenlik Olayları & Tehdit Günlüğü
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  WAF ve SSRF filtresine takılan şüpheli girişimler anında engellenir.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {securityIncidents.length} Olay Kaydı
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Zaman</th>
                    <th className="p-3.5">Saldırı Türü</th>
                    <th className="p-3.5">Saldırgan IP</th>
                    <th className="p-3.5">Açıklama</th>
                    <th className="p-3.5">Durum</th>
                    <th className="p-3.5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {securityIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                        {inc.timestamp}
                      </td>
                      <td className="p-3.5 font-bold text-rose-400 whitespace-nowrap">
                        {inc.type}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">
                        {inc.ipAddress}
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-sm">{inc.description}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            inc.status === "blocked"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {inc.status === "blocked" ? "Engellendi" : "Çözüldü"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {inc.status === "blocked" && (
                          <button
                            onClick={() => resolveIncident(inc.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Çözüldü Olarak İşaretle
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
