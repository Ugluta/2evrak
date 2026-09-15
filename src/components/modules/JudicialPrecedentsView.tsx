import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Scale,
  Search,
  Plus,
  Filter,
  Eye,
  Download,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Edit3,
  BookMarked,
  X,
  ArrowRight,
} from "lucide-react";
import { JudicialPrecedent } from "../../types";

export const JudicialPrecedentsView: React.FC = () => {
  const { judicialPrecedents, updateJudicialPrecedents, dispatchJob, activeSubItemId } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<string>("all");
  const [selectedPrecedent, setSelectedPrecedent] = useState<JudicialPrecedent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [aiSummaryResult, setAiSummaryResult] = useState<string | null>(null);

  // Sync with left sidebar sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("Özlük")) {
      setSelectedCategory("Özlük Hakları & Ek Ders");
    } else if (activeSubItemId.includes("Danıştay") || activeSubItemId.includes("Mahkeme")) {
      setSelectedCourt("Danıştay 2. Daire");
    } else if (activeSubItemId.includes("Filtre") || activeSubItemId.includes("Arama")) {
      setSelectedCategory("all");
      setSelectedCourt("all");
    }
  }, [activeSubItemId]);

  // New item form
  const [newTitle, setNewTitle] = useState("");
  const [newCourt, setNewCourt] = useState<JudicialPrecedent["court"]>("Danıştay 2. Daire");
  const [newCaseNo, setNewCaseNo] = useState("");
  const [newDate, setNewDate] = useState("2026-05-10");
  const [newCategory, setNewCategory] = useState<JudicialPrecedent["category"]>("Özlük Hakları & Ek Ders");
  const [newSummary, setNewSummary] = useState("");
  const [newFullText, setNewFullText] = useState("");
  const [newLegalBasis, setNewLegalBasis] = useState("657 Sayılı Kanun");
  const [newResult, setNewResult] = useState<JudicialPrecedent["result"]>("İptal Kararı");
  const [newTags, setNewTags] = useState("Öğretmen, Danıştay, Karar");

  const filteredPrecedents = judicialPrecedents.filter((item) => {
    if (selectedCourt !== "all" && item.court !== selectedCourt) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedResult !== "all" && item.result !== selectedResult) return false;
    if (
      searchTerm &&
      !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.summary.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.legalBasis.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCaseNo) {
      alert("Lütfen karar başlığı ve esas/karar numarasını giriniz.");
      return;
    }

    const newItem: JudicialPrecedent = {
      id: `jp_${Date.now()}`,
      title: newTitle,
      court: newCourt,
      caseNo: newCaseNo,
      date: newDate,
      category: newCategory,
      summary: newSummary || newTitle,
      fullText: newFullText || newSummary || "Kararın tam metin kaydı sisteme işlenmiştir.",
      legalBasis: newLegalBasis,
      result: newResult,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      viewCount: 1,
      downloadCount: 0,
    };

    updateJudicialPrecedents([newItem, ...judicialPrecedents]);
    setShowAddModal(false);
    setNewTitle("");
    setNewCaseNo("");
    setNewSummary("");
    setNewFullText("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu emsal kararı silmek istediğinize emin misiniz?")) {
      updateJudicialPrecedents(judicialPrecedents.filter((p) => p.id !== id));
      if (selectedPrecedent?.id === id) setSelectedPrecedent(null);
    }
  };

  const handleAiSummarize = (item: JudicialPrecedent) => {
    setIsAiSummarizing(true);
    setAiSummaryResult(null);
    setTimeout(() => {
      setIsAiSummarizing(false);
      setAiSummaryResult(
        `Gemini AI Emsal Analizi (${item.court} - ${item.caseNo}): Bu karar öğretmenlerin ${item.category} alanındaki hak arama süreçlerinde bağlayıcı emsal niteliği taşımaktadır. İlgili idari işlemin hukuka aykırılığı ${item.legalBasis} çerçevesinde tespit edilmiş olup idareler benzer durumlarda bu karara atıf yapabilmektedir.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Info Header */}
      <div className="bg-white border-l-4 border-l-[#17a2b8] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-[#17a2b8]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                Mevzuat & Yargı Emsal Kararları Kütüphanesi
              </h1>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Danıştay 2. ve 5. Daireleri, Anayasa Mahkemesi ve Bölge İdare Mahkemelerinin öğretmenler ve MEB personeli hakkındaki emsal kararları, iptal içtihatları ve yasal dayanakları.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                dispatchJob({
                  id: `job_${Date.now()}`,
                  queue: "ai_queue",
                  title: "Danıştay Emsal Kararları Otomatik Senkronizasyon",
                  priority: "high",
                  status: "completed",
                  attempts: 1,
                  maxAttempts: 3,
                  progressPercent: 100,
                  startedAt: new Date().toISOString(),
                  payload: { sync: "danistay_meb" },
                });
                alert("Danıştay ve Mevzuat Bilgi Sistemi kararları başarıyla senkronize edildi!");
              }}
              className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#17a2b8]" />
              <span>İçtihatları Senkronla</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Emsal Karar Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* AdminLTE Small Boxes Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{judicialPrecedents.length}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Toplam Emsal İçtihat</p>
          </div>
          <Scale className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Danıştay, AYM & İdare</span>
        </div>

        <div className="bg-[#007bff] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              {judicialPrecedents.filter((p) => p.court.includes("Danıştay")).length}
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Danıştay Kararları</p>
          </div>
          <BookOpen className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">2. ve 5. Daire İdari Yargı</span>
        </div>

        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              {judicialPrecedents.filter((p) => p.result === "İptal Kararı").length}
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Öğretmen Lehine İptaller</p>
          </div>
          <CheckCircle2 className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">İdari İşlemin İptali</span>
        </div>

        <div className="bg-[#6f42c1] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              {judicialPrecedents.filter((p) => p.court === "Anayasa Mahkemesi").length}
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Anayasa Mahkemesi</p>
          </div>
          <ShieldCheck className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Temel Hak İhlalleri</span>
        </div>
      </div>

      {/* AdminLTE Card: Filtre ve Arama Çubuğu */}
      <div className="card card-primary card-outline bg-white border border-[#dee2e6] rounded shadow-xs p-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Esas No, konu veya kanun ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Mahkemeler / Kurullar</option>
              <option value="Danıştay 2. Daire">Danıştay 2. Daire</option>
              <option value="Danıştay 5. Daire">Danıştay 5. Daire</option>
              <option value="Anayasa Mahkemesi">Anayasa Mahkemesi</option>
              <option value="MEB Yüksek Disiplin Kurulu">MEB Yüksek Disiplin Kurulu</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Özlük Hakları & Ek Ders">Özlük Hakları & Ek Ders</option>
              <option value="Disiplin Soruşturmaları">Disiplin Soruşturmaları</option>
              <option value="Atama & Yer Değiştirme">Atama & Yer Değiştirme</option>
              <option value="Yönetici Atama">Yönetici Atama</option>
              <option value="Rapor & İzin Hakları">Rapor & İzin Hakları</option>
            </select>

            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Sonuçlar</option>
              <option value="İptal Kararı">İptal Kararı</option>
              <option value="Onama">Onama</option>
              <option value="Yürütmenin Durdurulması">Yürütmenin Durdurulması</option>
              <option value="Bozma">Bozma</option>
              <option value="Red">Red</option>
            </select>
          </div>
        </div>
      </div>

      {/* Precedents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filteredPrecedents.map((item) => (
          <div
            key={item.id}
            className="card card-outline card-info bg-white border border-[#dee2e6] rounded shadow-xs hover:border-[#17a2b8] p-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e1f5f8] text-[#17a2b8] border border-[#17a2b8]/30 uppercase tracking-wide">
                  {item.court}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.result === "İptal Kararı"
                      ? "bg-[#28a745] text-white"
                      : item.result === "Yürütmenin Durdurulması"
                      ? "bg-[#007bff] text-white"
                      : "bg-[#ffc107] text-[#1f2d3d]"
                  }`}
                >
                  {item.result}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#6c757d]">
                  <span>Esas/Karar: <strong className="text-[#212529]">{item.caseNo}</strong></span>
                  <span>•</span>
                  <span>Tarih: {item.date}</span>
                </div>
                <h3
                  onClick={() => setSelectedPrecedent(item)}
                  className="text-xs font-bold text-[#212529] hover:text-[#17a2b8] transition-colors cursor-pointer mt-1"
                >
                  {item.title}
                </h3>
                <p className="text-xs text-[#6c757d] mt-1 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#f8f9fa] text-[#495057] font-medium border border-[#ced4da]">
                  {item.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#e8f4ff] text-[#007bff] font-medium border border-[#007bff]/20 font-mono">
                  {item.legalBasis}
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#dee2e6] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6c757d] font-mono">
                {item.viewCount} inceleme
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAiSummarize(item)}
                  className="px-2.5 py-1 rounded bg-[#f3eefb] hover:bg-[#e9def9] text-[#6f42c1] border border-[#6f42c1]/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Özet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPrecedent(item)}
                  className="px-3 py-1 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>İncele</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded hover:bg-[#f8d7da] text-[#dc3545] cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Precedent Detail Modal */}
      {selectedPrecedent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded border border-[#dee2e6] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-[#dee2e6] pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e1f5f8] text-[#17a2b8] border border-[#17a2b8]/30 uppercase">
                  {selectedPrecedent.court}
                </span>
                <h2 className="text-sm font-bold text-[#212529] mt-1.5">{selectedPrecedent.title}</h2>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#6c757d] mt-0.5">
                  <span>Esas/Karar: <strong>{selectedPrecedent.caseNo}</strong></span>
                  <span>•</span>
                  <span>Tarih: {selectedPrecedent.date}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrecedent(null)}
                className="p-1 rounded hover:bg-[#e9ecef] text-[#6c757d] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f8f9fa] rounded border border-[#dee2e6] flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-xs">
                  {selectedPrecedent.result}
                </span>
                <span className="text-[#495057] font-mono">Dayanak: {selectedPrecedent.legalBasis}</span>
              </div>

              <div>
                <span className="font-bold text-[#212529] block mb-1">Hukuki Özet:</span>
                <p className="text-[#495057] bg-[#f8f9fa] p-3 rounded border border-[#dee2e6] leading-relaxed">
                  {selectedPrecedent.summary}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#212529] block mb-1">Karar Metni ve Gerekçe:</span>
                <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6] text-[#212529] font-mono whitespace-pre-wrap max-h-52 overflow-y-auto custom-scrollbar leading-relaxed">
                  {selectedPrecedent.fullText}
                </div>
              </div>

              {aiSummaryResult && (
                <div className="bg-[#f3eefb] p-3 rounded border border-[#6f42c1]/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#6f42c1] font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini AI Emsal Analiz Raporu</span>
                  </div>
                  <p className="text-[#212529] leading-relaxed">{aiSummaryResult}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dee2e6]">
              <button
                type="button"
                onClick={() => handleAiSummarize(selectedPrecedent)}
                disabled={isAiSummarizing}
                className="px-3 py-1.5 rounded bg-[#f3eefb] hover:bg-[#e9def9] text-[#6f42c1] text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiSummarizing ? "Analiz Ediliyor..." : "AI Analiz İste"}</span>
              </button>
              <button
                type="button"
                onClick={() => alert(`"${selectedPrecedent.title}" emsal karar belgesi PDF olarak indirildi.`)}
                className="px-3.5 py-1.5 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Kararı İndir (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleAddItem}
            className="bg-white rounded border border-[#dee2e6] max-w-lg w-full p-5 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#dee2e6] pb-2">
              <h2 className="text-sm font-bold text-[#212529]">Yeni Emsal Karar Ekle</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded hover:bg-[#e9ecef] text-[#6c757d] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-semibold text-[#495057] block mb-1">Karar Başlığı</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Öğretmenin Ek Ders Kesintisine Karşı Açtığı Davanın Kabulü"
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#495057] block mb-1">Mahkeme</label>
                  <select
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="Danıştay 2. Daire">Danıştay 2. Daire</option>
                    <option value="Danıştay 5. Daire">Danıştay 5. Daire</option>
                    <option value="Danıştay 8. Daire">Danıştay 8. Daire</option>
                    <option value="Anayasa Mahkemesi">Anayasa Mahkemesi</option>
                    <option value="MEB Yüksek Disiplin Kurulu">MEB Yüksek Disiplin Kurulu</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#495057] block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="Özlük Hakları & Ek Ders">Özlük Hakları & Ek Ders</option>
                    <option value="Disiplin Soruşturmaları">Disiplin Soruşturmaları</option>
                    <option value="Atama & Yer Değiştirme">Atama & Yer Değiştirme</option>
                    <option value="Yönetici Atama">Yönetici Atama</option>
                    <option value="Rapor & İzin Hakları">Rapor & İzin Hakları</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#495057] block mb-1">Esas / Karar No</label>
                  <input
                    type="text"
                    required
                    value={newCaseNo}
                    onChange={(e) => setNewCaseNo(e.target.value)}
                    placeholder="2025/412 E., 2026/89 K."
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#495057] block mb-1">Sonuç</label>
                  <select
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="İptal Kararı">İptal Kararı</option>
                    <option value="Onama">Onama</option>
                    <option value="Yürütmenin Durdurulması">Yürütmenin Durdurulması</option>
                    <option value="Bozma">Bozma</option>
                    <option value="Red">Red</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#495057] block mb-1">Yasal Dayanak</label>
                <input
                  type="text"
                  value={newLegalBasis}
                  onChange={(e) => setNewLegalBasis(e.target.value)}
                  placeholder="657 Sayılı Kanun Madde 125"
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#495057] block mb-1">Özet / Gerekçe</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Kararın kısa hukuki özeti..."
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dee2e6]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-semibold cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
