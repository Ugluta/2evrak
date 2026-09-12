import React, { useState } from "react";
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
} from "lucide-react";
import { ScraperSource } from "../../types";

export const ScraperView: React.FC = () => {
  const {
    sources,
    scraperJobs,
    addSource,
    deleteSource,
    triggerScrapeSource,
    categories,
    setActiveModuleId,
  } = useApp();

  const [testUrl, setTestUrl] = useState("https://meb.gov.tr/meb_duyuru.html");
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);

  // New source form state
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0]?.id || "cat_zumre");

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
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    addSource({
      name: newName,
      targetUrl: newUrl,
      sourceType: "html_scrape",
      status: "idle",
      cronExpression: "0 */3 * * *",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">05 — Scraper / Kaynak Yönetimi</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SSRF Korumalı & Otomatik Duplicate Kontrolü
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            MEB, ÖSYM, EBA ve Resmi Gazete Kaynaklarından Otomatik Evrak ve Müfredat Çekme Motoru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddSourceOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Kaynak Ekle
          </button>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources.map((src) => {
          return (
            <div
              key={src.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white">{src.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                      src.status === "running"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {src.status === "running" ? "Kazınıyor" : "Hazır (Idle)"}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 truncate mt-1.5 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{src.targetUrl}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Periyot</span>
                    <span className="text-slate-300 font-mono">{src.cronExpression}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Son Kazıma</span>
                    <span className="text-slate-300 font-mono">{src.lastRunAt || "Henüz yok"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Toplam: <strong className="text-white">{src.lastItemCount} Evrak</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => triggerScrapeSource(src.id)}
                    disabled={src.status === "running"}
                    className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" /> Şimdi Kazı
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive SSRF Protection & Scraper Simulator Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Test Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Canlı URL & SSRF Güvenlik Testi</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
              Güvenli Sandbox
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Sistem Güvenliği İlkesi: Scraper motoru, iç ağlara ve yerel IP adreslerine (localhost, 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, vb.) yapılan SSRF saldırılarını otomatik engeller.
          </p>

          <form onSubmit={handleTestUrl} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hedef URL (Denemek için yerel IP veya resmi site girebilirsiniz):
              </label>
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://meb.gov.tr/... veya http://127.0.0.1/admin"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Quick pre-filled tests */}
            <div className="flex flex-wrap gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => setTestUrl("https://ogmmateryal.eba.gov.tr/kazanim-testleri")}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                + EBA Kazanım Testleri (Güvenli)
              </button>
              <button
                type="button"
                onClick={() => setTestUrl("http://127.0.0.1:8080/internal")}
                className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              >
                + SSRF Testi (127.0.0.1 Blokajı)
              </button>
              <button
                type="button"
                onClick={() => setTestUrl("http://192.168.1.1/router")}
                className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              >
                + Yerel Ağ Testi (192.168.1.1 Blokajı)
              </button>
            </div>

            <button
              type="submit"
              disabled={testing}
              className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Çıkarım & Güvenlik Raporu</h3>
              </div>
              {testResult && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    testResult.status === "blocked_ssrf"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {testResult.status === "blocked_ssrf" ? "SSRF ENGELİ TETİKLENDİ" : "BAŞARILI"}
                </span>
              )}
            </div>

            <div className="mt-3">
              {testResult ? (
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-72 overflow-y-auto">
                  <div className="text-[11px] text-slate-500">
                    Durum: <span className="text-white font-bold">{testResult.message}</span>
                  </div>

                  {testResult.ssrfCheck && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <div className="text-slate-400">
                        SSRF Kontrolü:{" "}
                        <span
                          className={
                            testResult.ssrfCheck.allowed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"
                          }
                        >
                          {testResult.ssrfCheck.allowed ? "İzin Verildi (Genel IP)" : "Engellendi (Özel / Yerel IP)"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Çözülen IP: {testResult.ssrfCheck.resolvedIp || "Belirlenemedi"}
                      </div>
                    </div>
                  )}

                  {testResult.extractedData && (
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="text-cyan-400 font-semibold">Ayıklanan Başlık:</div>
                      <div className="text-slate-200">{testResult.extractedData.title}</div>
                      <div className="text-slate-400 mt-1">İçerik Özeti:</div>
                      <p className="text-slate-300">{testResult.extractedData.contentSnippet}</p>
                      <div className="text-slate-400 mt-1">Tespit Edilen Dosyalar:</div>
                      <div className="flex gap-1 flex-wrap">
                        {testResult.extractedData.detectedFiles?.map((f: any) => (
                          <span
                            key={f.name}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300 text-[10px]"
                          >
                            {f.name} ({f.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-2 border border-dashed border-slate-800 rounded-lg">
                  <Radio className="w-8 h-8 text-slate-700" />
                  <div className="text-xs">Sol panelden bir URL test edin.</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-right">
            <button
              onClick={() => setActiveModuleId("16_moderation")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Kazınan Verilerin Düştüğü Moderasyon Merkezini Gör &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Scraped Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Son Kazıma Görevleri & Ayıklanan Veriler</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              İşlenen veriler otomatik duplicate kontrolünden geçip moderasyon havuzuna aktarılır.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{scraperJobs.length} Görev</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Kaynak & Başlık</th>
                <th className="p-3.5">Bulunan Dosyalar</th>
                <th className="p-3.5">Benzerlik (Kopya) Skoru</th>
                <th className="p-3.5">Tarih</th>
                <th className="p-3.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {scraperJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 max-w-sm">
                    <div className="text-slate-400 text-[10px] font-semibold">{job.sourceName}</div>
                    <div className="font-medium text-white truncate">{job.rawTitle}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap">
                      {job.foundFiles.map((file) => (
                        <span
                          key={file}
                          className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px]"
                        >
                          {file}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-[11px] ${
                          job.similarityScore > 0.8 ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        %{(job.similarityScore * 100).toFixed(0)}
                      </span>
                      {job.isDuplicate && (
                        <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">
                          KOPYA
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {job.scrapedAt}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Moderasyon Kuyruğunda
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      {isAddSourceOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Kazıma Kaynağı Ekle</h3>
              <button
                onClick={() => setIsAddSourceOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Kaynak Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: MEB Ortaöğretim Genel Müdürlüğü Duyuruları"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Hedef URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://ogm.meb.gov.tr/duyurular"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Otomatik Eşlenecek Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSourceOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
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
