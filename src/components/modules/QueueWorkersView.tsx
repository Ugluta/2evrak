import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Cpu,
  Server,
  Play,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Activity,
  Layers,
  Zap,
} from "lucide-react";
import { QueueJob } from "../../types";

export const QueueWorkersView: React.FC = () => {
  const { queueJobs, workerPool, retryJob, cancelJob, dispatchJob } = useApp();

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobQueue, setNewJobQueue] = useState<QueueJob["queue"]>("pdf_ocr");
  const [newJobPriority, setNewJobPriority] = useState<QueueJob["priority"]>("normal");

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    dispatchJob(newJobQueue, newJobTitle, { requestedBy: "Yönetici Konsolu" }, newJobPriority);
    setIsDispatchModalOpen(false);
    setNewJobTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              22 — Kuyruk / Zamanlanmış Görevler
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              Kural 4: Ağır İşler Queue/Worker Üzerinde
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            PDF Parse, OCR, Scraper, AI Üretimleri ve Toplu MEB Bildirimleri için Asenkron Dağıtık Worker Mimarisi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Görev Tetikle (Simüle Et)
          </button>
        </div>
      </div>

      {/* Worker Pool Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Aktif Worker Havuzu</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {workerPool.activeWorkers} / {workerPool.totalWorkers}
            </span>
            <span className="text-xs font-semibold text-emerald-400">Çalışıyor</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{
                width: `${(workerPool.activeWorkers / workerPool.totalWorkers) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kuyruktaki Bekleyen İş</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {workerPool.jobsInQueue}
            </span>
            <span className="text-xs text-slate-400">Görev</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Ortalama bekleme: ~1.2 sn</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tamamlanan Görevler</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {workerPool.jobsCompleted24h.toLocaleString("tr-TR")}
            </span>
            <span className="text-xs font-semibold text-emerald-400">Son 24 Saat</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Hata oranı: %0.04</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ortalama İş Süresi</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {workerPool.avgJobDurationMs}
            </span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Yüksek verimli worker thread</p>
        </div>
      </div>

      {/* Live Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Canlı Görev Kuyruğu (Job Stream)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              İşlem durumları anlık olarak frontend'e push edilir.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{queueJobs.length} Görev Listelendi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Görev & Başlık</th>
                <th className="p-3.5">Kuyruk Türü</th>
                <th className="p-3.5">Öncelik</th>
                <th className="p-3.5">İlerleme (%)</th>
                <th className="p-3.5">Deneme</th>
                <th className="p-3.5">Durum</th>
                <th className="p-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {queueJobs.map((job) => {
                return (
                  <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 max-w-sm">
                      <div className="font-semibold text-white truncate">{job.title}</div>
                      {job.errorReason && (
                        <div className="text-[10px] text-red-400 mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{job.errorReason}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px] border border-slate-700">
                        {job.queue}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase font-mono ${
                          job.priority === "critical"
                            ? "text-red-400"
                            : job.priority === "high"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      >
                        {job.priority}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>%{job.progressPercent}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              job.status === "failed"
                                ? "bg-red-500"
                                : job.status === "completed"
                                ? "bg-emerald-400"
                                : "bg-cyan-400"
                            }`}
                            style={{ width: `${job.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-400 font-mono">
                      {job.attempts} / {job.maxAttempts}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          job.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : job.status === "processing"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse"
                            : job.status === "failed"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {job.status === "completed"
                          ? "Tamamlandı"
                          : job.status === "processing"
                          ? "İşleniyor"
                          : job.status === "failed"
                          ? "Başarısız"
                          : "Sırada"}
                      </span>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status === "failed" && (
                          <button
                            onClick={() => retryJob(job.id)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                            title="Yeniden Dene"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {job.status === "processing" && (
                          <button
                            onClick={() => cancelJob(job.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Görevi İptal Et"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Job Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Ağır İş Simüle Et (Kuyruğa At)</h3>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Görev Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2024 MEB Yıllık Planlar Toplu OCR Ayrıştırması"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kuyruk Türü</label>
                  <select
                    value={newJobQueue}
                    onChange={(e) => setNewJobQueue(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="pdf_ocr">PDF / OCR Worker</option>
                    <option value="ai_generation">AI Zümre & Soru Worker</option>
                    <option value="scraper_pipeline">MEB Scraper Worker</option>
                    <option value="mass_notification">Toplu Bildirim Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Öncelik Seviyesi</label>
                  <select
                    value={newJobPriority}
                    onChange={(e) => setNewJobPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Düşük (Low)</option>
                    <option value="normal">Normal</option>
                    <option value="high">Yüksek (High)</option>
                    <option value="critical">Kritik (Critical)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Kuyruğa Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
