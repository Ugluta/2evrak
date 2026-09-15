import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Download,
  Filter,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Plus,
  Target,
  Network,
  Palette,
  Code2,
  ShieldCheck,
  Gauge,
  Sliders,
  Globe2,
  FileCheck,
  Percent,
} from "lucide-react";
import { initialAuditCategories, AuditCategory, AuditChecklistItem } from "../../data/projectAuditData";

const categoryIcons: Record<string, React.ReactNode> = {
  cat_1_strategy: <Target className="w-4 h-4 text-[#007bff]" />,
  cat_2_architecture: <Network className="w-4 h-4 text-[#17a2b8]" />,
  cat_3_uxui: <Palette className="w-4 h-4 text-[#e83e8c]" />,
  cat_4_code_quality: <Code2 className="w-4 h-4 text-[#28a745]" />,
  cat_5_security: <ShieldCheck className="w-4 h-4 text-[#ffc107]" />,
  cat_6_performance: <Gauge className="w-4 h-4 text-[#6f42c1]" />,
  cat_7_admin_panel: <Sliders className="w-4 h-4 text-[#007bff]" />,
  cat_8_store_seo: <Globe2 className="w-4 h-4 text-[#20c997]" />,
};

export const ProjectAuditChecklistView: React.FC = () => {
  const [categories, setCategories] = useState<AuditCategory[]>(initialAuditCategories);
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState<boolean>(false);
  const [newItemTitle, setNewItemTitle] = useState<string>("");
  const [newItemCatId, setNewItemCatId] = useState<string>("cat_1_strategy");
  const [newItemPriority, setNewItemPriority] = useState<"high" | "medium" | "low">("high");

  // Toggle category enabled/disabled
  const toggleCategoryEnabled = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  };

  // Toggle collapse
  const toggleCollapse = (catId: string) => {
    setCollapsedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Cycle item status: done -> in_progress -> needs_revision -> done
  const cycleItemStatus = (itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => {
          if (item.id !== itemId) return item;
          const nextStatus =
            item.status === "done"
              ? "in_progress"
              : item.status === "in_progress"
              ? "needs_revision"
              : "done";
          return { ...item, status: nextStatus };
        }),
      }))
    );
  };

  // Add new item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: AuditChecklistItem = {
      id: `custom_${Date.now()}`,
      title: newItemTitle.trim(),
      category: newItemCatId,
      status: "in_progress",
      priority: newItemPriority,
    };

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === newItemCatId ? { ...cat, items: [...cat.items, newItem] } : cat
      )
    );

    setNewItemTitle("");
    setIsNewItemModalOpen(false);
  };

  // Overall Statistics Calculation
  const stats = useMemo(() => {
    let totalItems = 0;
    let doneCount = 0;
    let inProgressCount = 0;
    let revisionCount = 0;

    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        totalItems++;
        if (item.status === "done") doneCount++;
        else if (item.status === "in_progress") inProgressCount++;
        else if (item.status === "needs_revision") revisionCount++;
      });
    });

    const complianceScore = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

    return {
      totalItems,
      doneCount,
      inProgressCount,
      revisionCount,
      complianceScore,
    };
  }, [categories]);

  // Export report
  const exportAuditReport = () => {
    const reportData = {
      title: "2Evrak - Proje Denetim, Kabul & Standart Uyum Raporu",
      generatedAt: new Date().toLocaleString("tr-TR"),
      targetAudience: "1 Milyon Öğretmen & Kurumsal Teslim Standardı",
      overallCompliance: `%${stats.complianceScore}`,
      metrics: {
        totalEvaluated: stats.totalItems,
        done: stats.doneCount,
        inProgress: stats.inProgressCount,
        needsRevision: stats.revisionCount,
      },
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        isEnabled: cat.isEnabled,
        completionRate: `%${
          cat.items.length > 0
            ? Math.round(
                (cat.items.filter((i) => i.status === "done").length / cat.items.length) * 100
              )
            : 0
        }`,
        items: cat.items,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `2evrak_denetim_ve_kalite_raporu_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Small Boxes (AdminLTE 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Compliance Score Small Box */}
        <div className="bg-[#17a2b8] text-white p-4 rounded shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold font-mono">%{stats.complianceScore}</span>
              <Percent className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-xs font-semibold mt-1">Genel Uyumluluk Skoru</p>
          </div>
          <div className="mt-3 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-white h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.complianceScore}%` }}
            />
          </div>
        </div>

        {/* Done Small Box */}
        <div className="bg-[#28a745] text-white p-4 rounded shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold font-mono">{stats.doneCount}</span>
              <CheckCircle2 className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-xs font-semibold mt-1">Tamamlandı ({stats.totalItems} Madde)</p>
          </div>
          <p className="text-[10px] text-white/80 mt-2">Doğrulanan ve onaylanan standartlar</p>
        </div>

        {/* In Progress Small Box */}
        <div className="bg-[#ffc107] text-white p-4 rounded shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold font-mono">{stats.inProgressCount}</span>
              <Clock className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-xs font-semibold mt-1">İnceleniyor / Süreçte</p>
          </div>
          <p className="text-[10px] text-white/80 mt-2">Test ve entegrasyonu süren kısımlar</p>
        </div>

        {/* Revision Small Box */}
        <div className="bg-[#dc3545] text-white p-4 rounded shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold font-mono">{stats.revisionCount}</span>
              <AlertTriangle className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-xs font-semibold mt-1">Revize Edilecek</p>
          </div>
          <p className="text-[10px] text-white/80 mt-2">Tekrar incelenmesi gereken noktalar</p>
        </div>
      </div>

      {/* Control Bar & Actions */}
      <div className="bg-white border border-[#dee2e6] rounded p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Madde veya kriter ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#ced4da] rounded text-xs text-[#495057] placeholder-gray-400 focus:outline-none focus:border-[#007bff]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-[#f4f6f9] border border-[#dee2e6] rounded p-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                statusFilter === "all" ? "bg-[#007bff] text-white" : "text-[#495057] hover:bg-[#e9ecef]"
              }`}
            >
              Tümü ({stats.totalItems})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("done")}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                statusFilter === "done" ? "bg-[#28a745] text-white" : "text-[#495057] hover:bg-[#e9ecef]"
              }`}
            >
              Yapıldı ({stats.doneCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("in_progress")}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                statusFilter === "in_progress" ? "bg-[#ffc107] text-white" : "text-[#495057] hover:bg-[#e9ecef]"
              }`}
            >
              İnceleniyor ({stats.inProgressCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("needs_revision")}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                statusFilter === "needs_revision" ? "bg-[#dc3545] text-white" : "text-[#495057] hover:bg-[#e9ecef]"
              }`}
            >
              Revize ({stats.revisionCount})
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewItemModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Madde Ekle
          </button>
          <button
            type="button"
            onClick={exportAuditReport}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#007bff]" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedCatId("all")}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
            selectedCatId === "all"
              ? "bg-[#007bff] text-white border-[#007bff]"
              : "bg-white border-[#ced4da] text-[#495057] hover:bg-[#f8f9fa]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Tüm Kategoriler (8)
        </button>
        {categories.map((cat) => {
          const catDone = cat.items.filter((i) => i.status === "done").length;
          const catRate = cat.items.length > 0 ? Math.round((catDone / cat.items.length) * 100) : 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                selectedCatId === cat.id
                  ? "bg-[#007bff] text-white border-[#007bff]"
                  : cat.isEnabled
                  ? "bg-white border-[#ced4da] text-[#495057] hover:bg-[#f8f9fa]"
                  : "bg-[#f8f9fa] border-[#dee2e6] text-[#6c757d] opacity-60"
              }`}
            >
              {categoryIcons[cat.id]}
              <span>{cat.name.split(". ")[1]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  catRate === 100
                    ? "bg-[#28a745]/20 text-[#28a745]"
                    : "bg-gray-100 text-[#6c757d]"
                }`}
              >
                %{catRate}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categories & Checklist Accordion */}
      <div className="space-y-3">
        {categories
          .filter((cat) => selectedCatId === "all" || cat.id === selectedCatId)
          .map((cat) => {
            const isCollapsed = collapsedCats[cat.id];
            const filteredItems = cat.items.filter((item) => {
              const matchesSearch =
                searchQuery === "" ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;
              return matchesSearch && matchesStatus;
            });

            const catDone = cat.items.filter((i) => i.status === "done").length;
            const catRate = cat.items.length > 0 ? Math.round((catDone / cat.items.length) * 100) : 0;

            return (
              <div
                key={cat.id}
                className={`bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden transition-all ${
                  !cat.isEnabled ? "opacity-60" : ""
                }`}
              >
                {/* Category Header */}
                <div className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#dee2e6] bg-[#f8f9fa]">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(cat.id)}
                      className="p-1 rounded text-[#6c757d] hover:text-[#212529] hover:bg-[#e9ecef] cursor-pointer"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-1.5 rounded bg-white border border-[#ced4da]">
                      {categoryIcons[cat.id]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#212529]">{cat.name}</h3>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-white text-[#495057] border border-[#ced4da] font-mono">
                          {catDone} / {cat.items.length} Yapıldı
                        </span>
                        <span className="text-[10px] text-[#6c757d] font-mono">
                          (Hedef ≈{cat.targetCount} Madde)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6c757d] mt-0.5">{cat.description}</p>
                    </div>
                  </div>

                  {/* Actions for Category */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    {/* Category progress */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#007bff] h-1.5 rounded-full"
                          style={{ width: `${catRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#007bff]">
                        %{catRate}
                      </span>
                    </div>

                    {/* Enable/Disable Category switch */}
                    <button
                      type="button"
                      onClick={() => toggleCategoryEnabled(cat.id)}
                      className={`text-[10px] px-2 py-1 rounded border font-medium transition-colors cursor-pointer ${
                        cat.isEnabled
                          ? "bg-white border-[#28a745]/40 text-[#28a745]"
                          : "bg-gray-100 border-[#ced4da] text-[#6c757d]"
                      }`}
                    >
                      {cat.isEnabled ? "Kategori Aktif" : "Kategori Kapalı"}
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {!isCollapsed && (
                  <div className="p-3 space-y-1.5 divide-y divide-[#dee2e6]">
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-4 text-xs text-[#6c757d]">
                        Filtreye veya aramaya uygun kriter maddesi bulunamadı.
                      </div>
                    ) : (
                      filteredItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 px-2 rounded hover:bg-[#f8f9fa] transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0 pr-4">
                            <span className="text-[10px] text-[#6c757d] font-mono mt-0.5 w-6 shrink-0">
                              #{index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-[#212529]">
                                {item.title}
                              </p>
                            </div>
                          </div>

                          {/* Status Control */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => cycleItemStatus(item.id)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                                item.status === "done"
                                  ? "bg-[#28a745]/10 text-[#28a745] border-[#28a745]/30 hover:bg-[#28a745]/20"
                                  : item.status === "in_progress"
                                  ? "bg-[#ffc107]/20 text-[#856404] border-[#ffeeba] hover:bg-[#ffc107]/30"
                                  : "bg-[#dc3545]/10 text-[#dc3545] border-[#dc3545]/30 hover:bg-[#dc3545]/20"
                              }`}
                            >
                              {item.status === "done" && (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Yapıldı
                                </>
                              )}
                              {item.status === "in_progress" && (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  İnceleniyor
                                </>
                              )}
                              {item.status === "needs_revision" && (
                                <>
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Revize Edilecek
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* New Item Modal */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni Standart / Kriter Maddesi Ekle</h3>
              <button
                type="button"
                onClick={() => setIsNewItemModalOpen(false)}
                className="text-[#6c757d] hover:text-black font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] mb-1 font-semibold">Hedef Kategori</label>
                <select
                  value={newItemCatId}
                  onChange={(e) => setNewItemCatId(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#495057] mb-1 font-semibold">Kontrol Sorusu / Madde Başlığı</label>
                <textarea
                  required
                  rows={3}
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Örn: Kullanıcı oturum açtığında SMS doğrulaması zorunlu mu?"
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] placeholder-gray-400 focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] mb-1 font-semibold">Öncelik Seviyesi</label>
                <select
                  value={newItemPriority}
                  onChange={(e) => setNewItemPriority(e.target.value as any)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                >
                  <option value="high">Yüksek (Kritik Teslimat Standardı)</option>
                  <option value="medium">Orta (Standart Güvence)</option>
                  <option value="low">Düşük (İyileştirme Fikri)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white font-medium cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Maddeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
