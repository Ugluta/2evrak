import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Users,
  Download,
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Plus,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    documents,
    users,
    packages,
    moderationItems,
    queueJobs,
    aiAgents,
    setActiveModuleId,
    widgets,
    toggleWidgetVisibility,
    analytics,
  } = useApp();

  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year">("month");
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);

  const pendingModeration = moderationItems.filter((m) => m.status === "pending").length;
  const activeDocs = documents.filter((d) => !d.isSoftDeleted);
  const activeJobs = queueJobs.filter((j) => j.status === "processing" || j.status === "waiting");

  // Summary counters
  const totalDownloads = activeDocs.reduce((acc, d) => acc + d.downloadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Quick Date Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">09 — Dinamik Yönetim Paneli</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Canlı Veri Akışı
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            1 Milyon Öğretmen Ekosistemi için Gerçek Zamanlı Evrak, Zümre ve Altyapı Metrikleri
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center text-xs">
            {(["today", "week", "month", "year"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-md transition-colors capitalize ${
                  dateRange === r
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {r === "today" ? "Bugün" : r === "week" ? "Bu Hafta" : r === "month" ? "Bu Ay" : "Bu Yıl"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowWidgetSettings(!showWidgetSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Widgetları Düzenle
          </button>
        </div>
      </div>

      {/* Widget Customizer Dropdown */}
      {showWidgetSettings && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-xl">
          <div className="text-xs font-bold text-slate-200 mb-2">Görünür Panel Bileşenleri (Dinamik Yönetim)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {widgets.map((w) => (
              <button
                key={w.id}
                onClick={() => toggleWidgetVisibility(w.id)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs border transition-colors ${
                  w.isVisible
                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 font-medium"
                    : "bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-400"
                }`}
              >
                <span className="truncate">{w.title}</span>
                <span className="text-[10px] font-mono">{w.isVisible ? "Açık" : "Gizli"}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Yayınlanan MEB Evrakları</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {activeDocs.length.toLocaleString("tr-TR")}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zümre, sınav, yıllık plan ve BEP evrakları</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Toplam Evrak İndirme</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {totalDownloads.toLocaleString("tr-TR")}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +28.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Bu ay MEB okullarında aktif indirildi</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kayıtlı Öğretmen / Zümre</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {analytics.totalTeachers.toLocaleString("tr-TR")}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">81 ilde 14.820 MEB okulu bağlantılı</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Moderasyon Bekleyen</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {pendingModeration}
            </span>
            <span className="text-xs font-semibold text-amber-400 flex items-center">
              Beklemede
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Scraper, AI ve öğretmen gönderileri</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 opacity-60" />
        </div>
      </div>

      {/* Main Grid: Priority Attention & Recent Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Documents & Quick Action */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Hızlı Zümre & Sistem İşlemleri
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setActiveModuleId("06_documents")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-left border border-slate-700 transition-colors group"
              >
                <div className="p-2 rounded bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Yeni Evrak Ekle</div>
                  <div className="text-[10px] text-slate-400">Zümre, Sınav, Plan</div>
                </div>
              </button>

              <button
                onClick={() => setActiveModuleId("15_ai_agents")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-left border border-slate-700 transition-colors group"
              >
                <div className="p-2 rounded bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">AI ile Üret</div>
                  <div className="text-[10px] text-slate-400">Soru & BEP Planı</div>
                </div>
              </button>

              <button
                onClick={() => setActiveModuleId("05_scrapers")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-left border border-slate-700 transition-colors group"
              >
                <div className="p-2 rounded bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">MEB Kazı</div>
                  <div className="text-[10px] text-slate-400">Duyuru & Genelge</div>
                </div>
              </button>

              <button
                onClick={() => setActiveModuleId("16_moderation")}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-left border border-slate-700 transition-colors group"
              >
                <div className="p-2 rounded bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Moderasyon ({pendingModeration})</div>
                  <div className="text-[10px] text-slate-400">Kuyruktakileri Gör</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Documents Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Son Eklenen Evraklar & Materyaller</h3>
                <p className="text-xs text-slate-400 mt-0.5">Öğretmenler ve zümrelerce paylaşılan son dokümanlar</p>
              </div>
              <button
                onClick={() => setActiveModuleId("06_documents")}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Tümünü İncele &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {activeDocs.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 font-bold text-xs">
                      {doc.fileExtension.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate hover:text-indigo-300 cursor-pointer" onClick={() => setActiveModuleId("06_documents")}>
                        {doc.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-indigo-400 font-medium">{doc.lesson}</span>
                        <span>•</span>
                        <span>{doc.gradeLevel}</span>
                        <span>•</span>
                        <span>{doc.authorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-mono font-medium text-slate-200">
                        {doc.downloadCount} İndirme
                      </div>
                      <div className="text-[10px] text-slate-500">{doc.fileSize}</div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        doc.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {doc.status === "published" ? "Yayında" : "İnceleniyor"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Queue Health & AI Status */}
        <div className="space-y-6">
          {/* Real-time Worker Engine Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Kuyruk & Worker Altyapısı
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aktif
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Öğretmen yüklemeleri, PDF OCR ve AI içerik üretimleri ana API'yi tıkamadan arka plan kuyruğunda işlenmektedir.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">PDF OCR & Metin Çıkarıcı:</span>
                <span className="font-mono text-cyan-400 font-semibold">2 Worker / Boşta</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">AI Zümre & Soru Üretici:</span>
                <span className="font-mono text-purple-400 font-semibold">3 Worker / Çalışıyor</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">MEB Scraper Kuyruğu:</span>
                <span className="font-mono text-indigo-400 font-semibold">1 Worker / Periyodik</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Kuyruktaki Toplam İş:</span>
              <span className="font-mono font-bold text-white">{activeJobs.length} Bekliyor</span>
            </div>
            <button
              onClick={() => setActiveModuleId("22_queue_workers")}
              className="w-full mt-3 py-1.5 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors text-center"
            >
              Kuyruk & Worker Konsolu &rarr;
            </button>
          </div>

          {/* AI Agents Operational Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Öğretmen AI Ajanları
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Gemini 2.5 Flash
              </span>
            </div>

            <div className="space-y-2">
              {aiAgents.slice(0, 4).map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-slate-200 truncate">{agent.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{agent.model}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-emerald-400 block">
                      %{agent.accuracyRate} Doğruluk
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {agent.runsCount} İşlem
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModuleId("15_ai_agents")}
              className="w-full mt-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-colors text-center"
            >
              Tüm Ajanları Yönet &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
