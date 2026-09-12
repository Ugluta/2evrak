import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ScrollText,
  Search,
  Filter,
  Eye,
  Shield,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { AuditLogEntry } from "../../types";

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTargetType, setSelectedTargetType] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesType =
      selectedTargetType === "all" || log.targetType === selectedTargetType;
    const matchesResult =
      selectedResult === "all" || log.result === selectedResult;

    return matchesSearch && matchesType && matchesResult;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              19 — Log / Denetim İzi (Audit Trail)
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              KVKK & Kurumsal Güvenlik Uyumlu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sistemdeki Her Değişikliğin Kim, Ne, Neye, Ne Zaman, Önceki Değer ve Yeni Değer Kayıtları
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono">
            Toplam {auditLogs.length} Kayıt
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Aktör, evrak, işlem veya IP ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTargetType}
            onChange={(e) => setSelectedTargetType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Varlık Türleri</option>
            <option value="document">Dokümanlar</option>
            <option value="user">Kullanıcılar</option>
            <option value="role">Roller</option>
            <option value="category">Kategoriler</option>
            <option value="settings">Sistem Ayarları</option>
            <option value="scraper">Scraper</option>
          </select>

          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Sonuçlar</option>
            <option value="success">Başarılı (Success)</option>
            <option value="warning">Uyarı (Warning)</option>
            <option value="failed">Başarısız (Failed)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Zaman & IP</th>
                <th className="p-3.5">Aktör (Kim)</th>
                <th className="p-3.5">Eylem (Ne Yaptı)</th>
                <th className="p-3.5">Hedef Varlık (Neye)</th>
                <th className="p-3.5">Sonuç</th>
                <th className="p-3.5 text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => {
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-white font-mono text-[11px]">{log.timestamp}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.ipAddress}</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{log.actorName}</div>
                      <div className="text-[10px] text-indigo-400">{log.actorRole}</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="font-medium text-slate-200 truncate">{log.targetName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {log.targetType} #{log.targetId}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          log.result === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : log.result === "warning"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {log.result === "success" && <CheckCircle2 className="w-3 h-3" />}
                        {log.result === "warning" && <AlertTriangle className="w-3 h-3" />}
                        {log.result === "failed" && <XCircle className="w-3 h-3" />}
                        {log.result}
                      </span>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Değişim Ayrıntısı"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Denetim İzi Kayıt Detayı</h3>
                <span className="text-[10px] text-slate-500 font-mono">{selectedLog.id}</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">İşlem</span>
                <span className="text-white font-mono">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Aktör</span>
                <span className="text-white">{selectedLog.actorName} ({selectedLog.actorRole})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Zaman</span>
                <span className="text-slate-300 font-mono">{selectedLog.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">IP Adresi</span>
                <span className="text-slate-300 font-mono">{selectedLog.ipAddress}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {selectedLog.previousValue && (
                <div>
                  <div className="text-slate-400 font-medium mb-1">Önceki Değer:</div>
                  <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300 whitespace-pre-wrap overflow-x-auto">
                    {selectedLog.previousValue}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div>
                  <div className="text-slate-400 font-medium mb-1">Yeni Değer:</div>
                  <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                    {selectedLog.newValue}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
