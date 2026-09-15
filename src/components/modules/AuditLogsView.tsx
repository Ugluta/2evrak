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
  CheckSquare,
} from "lucide-react";
import { AuditLogEntry } from "../../types";
import { ProjectAuditChecklistView } from "./ProjectAuditChecklistView";

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();

  const [activeTab, setActiveTab] = useState<"standards" | "logs">("standards");
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
    <div className="space-y-4">
      {/* AdminLTE Callout Box */}
      <div className="bg-white border-l-4 border-[#17a2b8] p-4 rounded shadow-xs border border-[#dee2e6]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#17a2b8] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                DENETİM & LOG
              </span>
              <h2 className="text-base font-bold text-[#212529]">
                Log, Denetim & Kalite Güvence Standartları
              </h2>
            </div>
            <p className="text-xs text-[#6c757d] mt-1">
              Proje Kontrol Standartları (8 Kategori & 100 Madde Hedefi), Puanlama ve Canlı Sistem Denetim İzi
            </p>
          </div>

          {/* AdminLTE Nav Pills Tabs */}
          <div className="flex items-center bg-[#f4f6f9] border border-[#dee2e6] rounded p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("standards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                activeTab === "standards"
                  ? "bg-[#007bff] text-white shadow-2xs"
                  : "text-[#495057] hover:bg-[#e9ecef]"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              QA & Denetim Matrisi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                activeTab === "logs"
                  ? "bg-[#007bff] text-white shadow-2xs"
                  : "text-[#495057] hover:bg-[#e9ecef]"
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              Audit Trail Logları ({auditLogs.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === "standards" ? (
        <ProjectAuditChecklistView />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="bg-white border border-[#dee2e6] rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Aktör, evrak, işlem veya IP ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1.5 text-xs text-[#495057] placeholder-gray-400 focus:outline-none focus:border-[#007bff]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedTargetType}
                onChange={(e) => setSelectedTargetType(e.target.value)}
                className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
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
                className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
              >
                <option value="all">Tüm Sonuçlar</option>
                <option value="success">Başarılı (Success)</option>
                <option value="warning">Uyarı (Warning)</option>
                <option value="failed">Başarısız (Failed)</option>
              </select>
            </div>
          </div>

          {/* Logs Table Card */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[#17a2b8]" />
                <h3 className="text-sm font-bold text-[#212529]">
                  Güvenlik & Değişiklik Günlüğü ({filteredLogs.length})
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f4f6f9] border-b border-[#dee2e6] text-[#495057] font-semibold">
                    <th className="p-3">Zaman & IP</th>
                    <th className="p-3">Aktör (Kim)</th>
                    <th className="p-3">Eylem (Ne Yaptı)</th>
                    <th className="p-3">Hedef Varlık (Neye)</th>
                    <th className="p-3">Sonuç</th>
                    <th className="p-3 text-right">Detay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-[#212529] font-mono text-[11px] font-bold">{log.timestamp}</div>
                        <div className="text-[10px] text-[#6c757d] font-mono">{log.ipAddress}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-[#212529]">{log.actorName}</div>
                        <div className="text-[10px] text-[#007bff]">{log.actorRole}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#f8f9fa] text-[#495057] font-mono text-[10px] border border-[#dee2e6]">
                          {log.action}
                        </span>
                      </td>

                      <td className="p-3 max-w-xs">
                        <div className="font-medium text-[#212529] truncate">{log.targetName}</div>
                        <div className="text-[10px] text-[#6c757d] font-mono">
                          {log.targetType} #{log.targetId}
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.result === "success"
                              ? "bg-[#28a745]/10 text-[#28a745]"
                              : log.result === "warning"
                              ? "bg-[#ffc107]/20 text-[#856404]"
                              : "bg-[#dc3545]/10 text-[#dc3545]"
                          }`}
                        >
                          {log.result === "success" && <CheckCircle2 className="w-3 h-3" />}
                          {log.result === "warning" && <AlertTriangle className="w-3 h-3" />}
                          {log.result === "failed" && <XCircle className="w-3 h-3" />}
                          {log.result}
                        </span>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Değişim Ayrıntısı"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#007bff]" />
                          <span>İncele</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Modal */}
          {selectedLog && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-[#dee2e6] rounded max-w-lg w-full p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
                  <div>
                    <h3 className="text-sm font-bold text-[#212529]">Denetim İzi Kayıt Detayı</h3>
                    <span className="text-[10px] text-[#6c757d] font-mono">{selectedLog.id}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLog(null)}
                    className="text-[#6c757d] hover:text-black cursor-pointer text-base font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
                  <div>
                    <span className="text-[#6c757d] block text-[10px]">İşlem</span>
                    <span className="text-[#212529] font-mono font-bold">{selectedLog.action}</span>
                  </div>
                  <div>
                    <span className="text-[#6c757d] block text-[10px]">Aktör</span>
                    <span className="text-[#212529] font-bold">{selectedLog.actorName} ({selectedLog.actorRole})</span>
                  </div>
                  <div>
                    <span className="text-[#6c757d] block text-[10px]">Zaman</span>
                    <span className="text-[#495057] font-mono">{selectedLog.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[#6c757d] block text-[10px]">IP Adresi</span>
                    <span className="text-[#495057] font-mono">{selectedLog.ipAddress}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {selectedLog.previousValue && (
                    <div>
                      <div className="text-[#dc3545] font-semibold mb-1">Önceki Değer:</div>
                      <pre className="bg-[#f8f9fa] p-2.5 rounded border border-[#dee2e6] font-mono text-[11px] text-[#dc3545] whitespace-pre-wrap overflow-x-auto">
                        {selectedLog.previousValue}
                      </pre>
                    </div>
                  )}

                  {selectedLog.newValue && (
                    <div>
                      <div className="text-[#28a745] font-semibold mb-1">Yeni Değer:</div>
                      <pre className="bg-[#f8f9fa] p-2.5 rounded border border-[#dee2e6] font-mono text-[11px] text-[#28a745] whitespace-pre-wrap overflow-x-auto">
                        {selectedLog.newValue}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-[#dee2e6]">
                  <button
                    type="button"
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-semibold cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
