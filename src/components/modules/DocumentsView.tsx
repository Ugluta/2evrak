import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  FolderTree,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Archive,
  Star,
  ExternalLink,
  Sliders,
  Shield,
  BookOpen,
  FileSpreadsheet,
  Users,
  CalendarDays,
  HeartHandshake,
} from "lucide-react";
import { DocumentItem, DocumentCategory } from "../../types";
import { WrittenExamsView } from "./WrittenExamsView";
import { ZumreMinutesView } from "./ZumreMinutesView";
import { AnnualPlansView } from "./AnnualPlansView";
import { BepDocumentsView } from "./BepDocumentsView";

export const DocumentsView: React.FC = () => {
  const {
    documents,
    categories,
    gradeCurriculums,
    addDocument,
    updateDocument,
    softDeleteDocument,
    restoreDocument,
    permanentDeleteDocument,
    addCategory,
    deleteCategory,
    currentUser,
    hasPermission,
    activeSubItemId,
    setActiveSubItemId,
  } = useApp();

  // State
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all");
  const [selectedLessonFilter, setSelectedLessonFilter] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

  // Sync subitem selection with document type filter
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("Zümre Toplantı")) {
      setSelectedDocType("Zümre Kararı");
    } else if (activeSubItemId.includes("Yazılı & Ortak Sınav")) {
      setSelectedDocType("Yazılı Sınav");
    } else if (activeSubItemId.includes("Yıllık Planlar")) {
      setSelectedDocType("Yıllık Plan");
    } else if (activeSubItemId.includes("BEP Gelişim")) {
      setSelectedDocType("BEP Planı");
    }
  }, [activeSubItemId]);

  // New Document Form State
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocDescription, setNewDocDescription] = useState("");
  const [newDocCategory, setNewDocCategory] = useState(categories[0]?.id || "cat_zumre");
  const [newDocType, setNewDocType] = useState<string>("Zümre Kararı");
  const [newDocGrade, setNewDocGrade] = useState("9. Sınıf");
  const [newDocLesson, setNewDocLesson] = useState("Matematik");
  const [newDocExt, setNewDocExt] = useState<DocumentItem["fileType"]>("pdf");
  const [newDocAccessLevel, setNewDocAccessLevel] = useState<string>("free");

  // New Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatParent, setNewCatParent] = useState<string>("");

  // Filtering
  const filteredDocs = documents.filter((doc) => {
    const matchesTrash = viewMode === "trash" ? doc.isSoftDeleted : !doc.isSoftDeleted;
    const matchesCategory =
      selectedCategory === "all" ||
      doc.categoryId === selectedCategory ||
      (doc.subCategoryIds && doc.subCategoryIds.includes(selectedCategory));
    const matchesDocType =
      selectedDocType === "all" ||
      doc.docType.toLowerCase() === selectedDocType.toLowerCase();
    const matchesGrade =
      selectedGradeFilter === "all" ||
      doc.gradeLevel.toLowerCase().includes(selectedGradeFilter.toLowerCase());
    const matchesLesson =
      selectedLessonFilter === "all" ||
      doc.lesson.toLowerCase() === selectedLessonFilter.toLowerCase();
    const matchesSearch =
      searchKeyword === "" ||
      doc.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      doc.lesson.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchKeyword.toLowerCase()));

    return (
      matchesTrash &&
      matchesCategory &&
      matchesDocType &&
      matchesGrade &&
      matchesLesson &&
      matchesSearch
    );
  });

  const trashCount = documents.filter((d) => d.isSoftDeleted).length;
  const activeCount = documents.filter((d) => !d.isSoftDeleted).length;

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    addDocument({
      title: newDocTitle,
      description: newDocDescription,
      categoryId: newDocCategory,
      subCategoryIds: [],
      schoolType: "Devlet / Anadolu Lisesi",
      gradeLevel: newDocGrade,
      classNumber: "9. Sınıf",
      lesson: newDocLesson,
      branch: newDocLesson,
      subject: newDocTitle,
      term: "1. Dönem",
      docType: newDocType,
      year: "2025-2026",
      fileUrl: `https://storage.2evrak.com/docs/${newDocTitle.toLowerCase().replace(/\s+/g, "_")}.${newDocExt}`,
      fileName: `${newDocTitle.toLowerCase().replace(/\s+/g, "_")}.${newDocExt}`,
      fileType: newDocExt,
      fileSizeBytes: 1450000,
      previewUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      tags: [newDocLesson.toLowerCase(), newDocGrade.toLowerCase(), newDocType.toLowerCase()],
      source: "Öğretmen Yüklemesi",
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      status: "pending_review",
      seo: {
        metaTitle: `${newDocTitle} - 2Evrak MEB Dokümanı`,
        metaDescription: newDocDescription.slice(0, 150),
        keywords: [newDocLesson.toLowerCase(), "meb", "evrak"],
      },
    });

    setIsAddModalOpen(false);
    setNewDocTitle("");
    setNewDocDescription("");
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      parentId: newCatParent || null,
      description: `${newCatName} kategorisindeki MEB dokümanları`,
      order: 1,
      isActive: true,
    });

    setIsNewCategoryOpen(false);
    setNewCatName("");
  };

  // Helper to render hierarchical category options
  const rootCategories = categories.filter((c) => !c.parentId);

  // Sub-view conditional detection
  const isYaziliActive = activeSubItemId?.includes("Yazılı");
  const isZumreActive = activeSubItemId?.includes("Zümre");
  const isPlanlarActive = activeSubItemId?.includes("Planlar") || activeSubItemId?.includes("Yıllık");
  const isBepActive = activeSubItemId?.includes("BEP");
  const isAllDocs = !isYaziliActive && !isZumreActive && !isPlanlarActive && !isBepActive;

  const renderSubNavPills = () => (
    <div className="bg-white border border-[#dee2e6] rounded p-2 flex flex-wrap items-center gap-1.5 shadow-xs">
      <span className="text-[11px] font-bold text-[#6c757d] uppercase tracking-wider px-2 py-1">
        Doküman Alt Modülü:
      </span>
      <button
        type="button"
        onClick={() => setActiveSubItemId("")}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          isAllDocs
            ? "bg-[#007bff] text-white shadow-xs font-bold"
            : "bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da]"
        }`}
      >
        <FolderTree className="w-3.5 h-3.5" />
        <span>Tüm Dokümanlar & Kategori Ağacı</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveSubItemId("Zümre Toplantı Tutanakları")}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          isZumreActive
            ? "bg-[#17a2b8] text-white shadow-xs font-bold"
            : "bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da]"
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>Zümre Toplantı Tutanakları</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveSubItemId("Yazılı & Ortak Sınav Soruları")}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          isYaziliActive
            ? "bg-[#007bff] text-white shadow-xs font-bold"
            : "bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da]"
        }`}
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        <span>Yazılı & Ortak Sınav Soruları</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveSubItemId("Yıllık Planlar & Çerçeve")}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          isPlanlarActive
            ? "bg-[#28a745] text-white shadow-xs font-bold"
            : "bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da]"
        }`}
      >
        <CalendarDays className="w-3.5 h-3.5" />
        <span>Yıllık Planlar & Çerçeve</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveSubItemId("BEP Gelişim Evrakları")}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          isBepActive
            ? "bg-[#6f42c1] text-white shadow-xs font-bold"
            : "bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da]"
        }`}
      >
        <HeartHandshake className="w-3.5 h-3.5" />
        <span>BEP Gelişim Evrakları</span>
      </button>
    </div>
  );

  if (isYaziliActive) {
    return (
      <div className="space-y-4">
        {renderSubNavPills()}
        <WrittenExamsView />
      </div>
    );
  }

  if (isZumreActive) {
    return (
      <div className="space-y-4">
        {renderSubNavPills()}
        <ZumreMinutesView />
      </div>
    );
  }

  if (isPlanlarActive) {
    return (
      <div className="space-y-4">
        {renderSubNavPills()}
        <AnnualPlansView />
      </div>
    );
  }

  if (isBepActive) {
    return (
      <div className="space-y-4">
        {renderSubNavPills()}
        <BepDocumentsView />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderSubNavPills()}

      {/* AdminLTE Callout Header */}
      <div className="bg-white border-l-4 border-l-[#007bff] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-[#007bff]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                03 — Doküman Yönetimi & İçerik Deposu
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#e8f4ff] text-[#007bff] font-bold border border-[#007bff]/30">
                Hiyerarşik & Çöp Kutusu Korumalı
              </span>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              MEB Müfredatına Uygun Zümre Kararları, Sınavlar, Yıllık Planlar, BEP ve ŞÖK Evrakları
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Active vs Trash View Switcher */}
            <div className="bg-[#f8f9fa] p-1 rounded border border-[#ced4da] flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewMode("active")}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "active"
                    ? "bg-[#007bff] text-white font-bold shadow-xs"
                    : "text-[#495057] hover:text-[#212529]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Aktif Evraklar ({activeCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("trash")}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "trash"
                    ? "bg-[#dc3545] text-white font-bold shadow-xs"
                    : "text-[#495057] hover:text-[#dc3545]"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Çöp Kutusu ({trashCount})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsNewCategoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] text-xs font-semibold border border-[#ced4da] transition-colors cursor-pointer"
            >
              <FolderTree className="w-3.5 h-3.5 text-[#007bff]" />
              <span>Yeni Kategori</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Evrak Yükle</span>
            </button>
          </div>
        </div>
      </div>

      {/* AdminLTE Small Boxes Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#007bff] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{activeCount}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Aktif Yayında Evrak</p>
          </div>
          <FileText className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Doğrulanmış & İndirilebilir</span>
        </div>

        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              {documents.reduce((acc, d) => acc + (d.downloadCount || 0), 0)}
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Toplam İndirme</p>
          </div>
          <Download className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Öğretmen İndirmeleri</span>
        </div>

        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{categories.length}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Kategori / Zümre Dalı</p>
          </div>
          <FolderTree className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Sınırsız Derinlik Ağacı</span>
        </div>

        <div className="bg-[#ffc107] text-[#1f2d3d] rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{trashCount}</div>
            <p className="text-xs font-bold text-[#1f2d3d]/90 mt-0.5">Çöp Kutusunda</p>
          </div>
          <Trash2 className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-[#1f2d3d]/80 mt-2 font-mono">Geri Döndürülebilir (Soft Delete)</span>
        </div>
      </div>

      {/* Side-by-Side Grade & Lesson Matrix Selector */}
      <div className="card card-outline card-info bg-white border border-[#dee2e6] rounded p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#17a2b8]" />
            <h2 className="text-xs font-bold text-[#212529] uppercase tracking-wider">
              Sınıf Kademeleri & Ders Matrisi (Anaokulu - 12. Sınıf)
            </h2>
          </div>
          {(selectedGradeFilter !== "all" || selectedLessonFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSelectedGradeFilter("all");
                setSelectedLessonFilter("all");
              }}
              className="text-[11px] text-[#007bff] hover:underline font-bold cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Grade Levels Bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedGradeFilter("all");
              setSelectedLessonFilter("all");
            }}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGradeFilter === "all"
                ? "bg-[#007bff] text-white shadow-xs font-bold"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            Tüm Kademeler
          </button>
          {gradeCurriculums.map((g) => {
            const isSelected = selectedGradeFilter === g.grade;
            return (
              <button
                key={g.grade}
                type="button"
                onClick={() => {
                  setSelectedGradeFilter(g.grade);
                  setSelectedLessonFilter("all");
                }}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#007bff] text-white shadow-xs font-bold"
                    : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                }`}
              >
                {g.grade} ({g.lessons.length} Ders)
              </button>
            );
          })}
        </div>

        {/* Dynamic Lesson Pills for Selected Grade */}
        {selectedGradeFilter !== "all" && (
          <div className="pt-2 border-t border-[#dee2e6] flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-[#6c757d] font-semibold mr-1">Dersler:</span>
            {gradeCurriculums
              .find((g) => g.grade === selectedGradeFilter)
              ?.lessons.map((l) => {
                const isLessonSelected =
                  selectedLessonFilter.toLowerCase() === l.lessonName.toLowerCase();
                return (
                  <button
                    key={l.lessonCode || l.lessonName}
                    type="button"
                    onClick={() => setSelectedLessonFilter(l.lessonName)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isLessonSelected
                        ? "bg-[#28a745] text-white shadow-xs font-bold"
                        : "bg-white text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                    }`}
                  >
                    {l.lessonName} ({l.weeklyHours} Saat)
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Main Content Area: Sidebar Hierarchy + Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Hierarchical Category Tree */}
        <div className="lg:col-span-1 card card-outline card-secondary bg-white border border-[#dee2e6] rounded p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
            <div className="flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-[#007bff]" />
              <span className="text-xs font-bold text-[#212529] uppercase tracking-wider">
                Kategori Ağacı
              </span>
            </div>
            <span className="text-[10px] text-[#495057] font-mono font-bold bg-[#f8f9fa] px-1.5 py-0.5 rounded border border-[#ced4da]">
              {categories.length}
            </span>
          </div>

          {/* All Categories Root Selector */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#007bff] text-white font-bold shadow-xs"
                  : "text-[#495057] hover:bg-[#f8f9fa]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Tüm Kategoriler</span>
              </div>
              <span className="text-[10px] font-mono">{activeCount}</span>
            </button>

            {/* Tree Items */}
            {rootCategories.map((root) => {
              const children = categories.filter((c) => c.parentId === root.id);
              const isSelected = selectedCategory === root.id;
              const rootDocCount = documents.filter(
                (d) => !d.isSoftDeleted && d.categoryId === root.id
              ).length;

              return (
                <div key={root.id} className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(root.id)}
                      className={`flex-1 text-left px-2.5 py-1 rounded text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#007bff] text-white font-bold shadow-xs"
                          : "text-[#495057] hover:bg-[#f8f9fa]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FolderTree className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{root.name}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                        {rootDocCount}
                      </span>
                    </button>
                  </div>

                  {/* Sub-categories */}
                  {children.length > 0 && (
                    <div className="ml-3 pl-2 border-l-2 border-[#dee2e6] space-y-0.5 py-0.5">
                      {children.map((sub) => {
                        const isSubSelected = selectedCategory === sub.id;
                        const subDocCount = documents.filter(
                          (d) =>
                            !d.isSoftDeleted &&
                            (d.categoryId === sub.id ||
                              (d.subCategoryIds && d.subCategoryIds.includes(sub.id)))
                        ).length;

                        return (
                          <div key={sub.id} className="flex items-center justify-between group">
                            <button
                              type="button"
                              onClick={() => setSelectedCategory(sub.id)}
                              className={`flex-1 text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                                isSubSelected
                                  ? "bg-[#007bff] text-white font-bold shadow-xs"
                                  : "text-[#6c757d] hover:text-[#212529] hover:bg-[#f8f9fa]"
                              }`}
                            >
                              <span className="truncate">↳ {sub.name}</span>
                              <span className="text-[9px] font-mono opacity-70">
                                {subDocCount}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Filter, Documents List */}
        <div className="lg:col-span-3 space-y-3">
          {/* Filter Bar */}
          <div className="card card-outline card-primary bg-white border border-[#dee2e6] rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#6c757d] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Evrak adı, ders veya etiket ara..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1 text-xs text-[#495057] placeholder-[#6c757d] focus:outline-none focus:border-[#007bff]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#6c757d] flex items-center gap-1 shrink-0 font-medium">
                <Filter className="w-3.5 h-3.5 text-[#007bff]" /> Tür:
              </span>
              <select
                value={selectedDocType}
                onChange={(e) => {
                  setSelectedDocType(e.target.value);
                  if (e.target.value === "Zümre Kararı") setActiveSubItemId("Zümre Toplantı Tutanakları");
                  else if (e.target.value === "Yazılı Sınav") setActiveSubItemId("Yazılı & Ortak Sınav Soruları");
                  else if (e.target.value === "Yıllık Plan") setActiveSubItemId("Yıllık Planlar & Çerçeve");
                  else if (e.target.value === "BEP Planı") setActiveSubItemId("BEP Gelişim Evrakları");
                }}
                className="bg-white border border-[#ced4da] rounded px-2.5 py-1 text-xs text-[#495057] font-medium focus:outline-none focus:border-[#007bff] cursor-pointer"
              >
                <option value="all">Tüm Evrak Türleri</option>
                <option value="Zümre Kararı">Zümre Kararı</option>
                <option value="Yazılı Sınav">Yazılı Sınav</option>
                <option value="Yıllık Plan">Yıllık Plan</option>
                <option value="BEP Planı">BEP Planı</option>
                <option value="Ders Notu">Ders Notu</option>
                <option value="Rehberlik Evrakı">Rehberlik Evrakı</option>
              </select>
            </div>
          </div>

          {/* Documents Table */}
          <div className="card card-outline card-secondary bg-white border border-[#dee2e6] rounded overflow-hidden shadow-xs">
            {filteredDocs.length === 0 ? (
              <div className="p-10 text-center text-[#6c757d] space-y-2">
                <FileText className="w-8 h-8 mx-auto text-[#007bff]/40" />
                <div className="text-sm font-bold text-[#212529]">
                  Bu kriterlere uygun evrak bulunamadı.
                </div>
                <p className="text-xs text-[#6c757d]">
                  Filtreleri temizleyebilir veya yeni bir MEB dokümanı yükleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#495057]">
                  <thead className="bg-[#f4f6f9] text-[10px] font-bold uppercase tracking-wider text-[#495057] border-b border-[#dee2e6]">
                    <tr>
                      <th className="py-2.5 px-3">Evrak & Başlık</th>
                      <th className="py-2.5 px-3">Ders / Kademe</th>
                      <th className="py-2.5 px-3">Tür</th>
                      <th className="py-2.5 px-3">Erişim</th>
                      <th className="py-2.5 px-3">İstatistik</th>
                      <th className="py-2.5 px-3">Durum</th>
                      <th className="py-2.5 px-3 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dee2e6]">
                    {filteredDocs.map((doc) => {
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-[#f8f9fa] transition-colors group"
                        >
                          <td className="py-2.5 px-3 max-w-xs">
                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 rounded bg-[#e8f4ff] border border-[#b8daff] flex items-center justify-center font-bold text-[9px] text-[#007bff] shrink-0 mt-0.5">
                                {(doc.fileExtension || doc.fileType || "doc").toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div
                                  onClick={() => setPreviewDoc(doc)}
                                  className="font-bold text-[#212529] truncate hover:text-[#007bff] cursor-pointer"
                                >
                                  {doc.title}
                                </div>
                                <div className="text-[10px] text-[#6c757d] flex items-center gap-1.5 mt-0.5">
                                  <span>{doc.authorName}</span>
                                  <span>•</span>
                                  <span>{doc.createdAt}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="text-[#212529] font-medium">{doc.lesson}</div>
                            <div className="text-[10px] text-[#6c757d]">{doc.gradeLevel}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-[#f8f9fa] text-[#495057] text-[10px] font-semibold border border-[#ced4da]">
                              {doc.docType}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                doc.accessLevel === "free"
                                  ? "bg-[#eaf7ed] text-[#28a745] border-[#28a745]/30"
                                  : doc.accessLevel === "teacher_pro"
                                  ? "bg-[#e8f4ff] text-[#007bff] border-[#007bff]/30"
                                  : "bg-[#f3e8ff] text-[#6f42c1] border-[#6f42c1]/30"
                              }`}
                            >
                              {doc.accessLevel === "free"
                                ? "Ücretsiz"
                                : doc.accessLevel === "teacher_pro"
                                ? "Öğretmen Pro"
                                : "Zümre VIP"}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center text-[#212529] font-mono font-medium">
                                <Download className="w-3 h-3 mr-1 text-[#007bff]" />
                                {doc.downloadCount}
                              </span>
                              <span className="flex items-center text-amber-500 font-mono font-semibold">
                                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                                {doc.rating}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#6c757d] mt-0.5">{doc.fileSize}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                doc.status === "published"
                                  ? "bg-[#eaf7ed] text-[#28a745]"
                                  : doc.status === "pending"
                                  ? "bg-[#fff3cd] text-[#856404]"
                                  : "bg-[#f8d7da] text-[#dc3545]"
                              }`}
                            >
                              {doc.status === "published"
                                ? "Yayında"
                                : doc.status === "pending"
                                ? "Moderasyonda"
                                : "Revizyon"}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Action */}
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="p-1 rounded bg-[#e8f4ff] hover:bg-[#d0e7ff] text-[#007bff] transition-colors cursor-pointer"
                                title="Önizle & Detay"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {viewMode === "active" ? (
                                <button
                                  type="button"
                                  onClick={() => softDeleteDocument(doc.id)}
                                  className="p-1 rounded bg-[#f8d7da] hover:bg-[#f5c6cb] text-[#dc3545] transition-colors cursor-pointer"
                                  title="Çöp Kutusuna At (Soft Delete)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => restoreDocument(doc.id)}
                                    className="p-1 rounded bg-[#eaf7ed] hover:bg-[#d4edda] text-[#28a745] transition-colors cursor-pointer"
                                    title="Geri Yükle"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => permanentDeleteDocument(doc.id)}
                                    className="p-1 rounded bg-[#dc3545] text-white hover:bg-[#c82333] transition-colors cursor-pointer"
                                    title="Kalıcı Olarak Yok Et"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Detail / Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card card-outline card-primary bg-white border border-[#dee2e6] rounded max-w-2xl w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-start justify-between border-b border-[#dee2e6] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007bff] bg-[#e8f4ff] px-2 py-0.5 rounded border border-[#007bff]/20">
                  MEB Doküman Kartı
                </span>
                <h3 className="text-base font-bold text-[#212529] mt-1.5">{previewDoc.title}</h3>
                <p className="text-xs text-[#6c757d] mt-0.5">{previewDoc.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-[#6c757d] hover:text-[#212529] p-1 rounded hover:bg-[#f8f9fa] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8f9fa] p-3 rounded border border-[#dee2e6] text-xs">
              <div>
                <span className="text-[#6c757d] block text-[10px]">Ders</span>
                <span className="text-[#212529] font-bold">{previewDoc.lesson}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block text-[10px]">Kademe / Sınıf</span>
                <span className="text-[#212529] font-bold">{previewDoc.gradeLevel}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block text-[10px]">Evrak Türü</span>
                <span className="text-[#212529] font-bold">{previewDoc.docType}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block text-[10px]">Dosya Formatı</span>
                <span className="text-[#212529] font-mono font-bold">
                  {(previewDoc.fileExtension || previewDoc.fileType || "doc").toUpperCase()} (
                  {previewDoc.fileSize || `${Math.round(previewDoc.fileSizeBytes / 1024)} KB`})
                </span>
              </div>
            </div>

            <div className="border border-[#dee2e6] rounded p-3 bg-[#f8f9fa] space-y-2 text-xs">
              <div className="font-bold text-[#212529]">SEO & Müfredat Uyumluluğu</div>
              <p className="text-[#6c757d] leading-relaxed text-[11px]">
                {previewDoc.seoDescription ||
                  "MEB Talim ve Terbiye Kurulu zümre kararlarına tam uygun hazırlanmıştır."}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {previewDoc.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-[#e8f4ff] text-[#007bff] font-semibold text-[10px] border border-[#007bff]/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#dee2e6]">
              <div className="text-xs text-[#6c757d]">
                Ekleyen: <span className="text-[#212529] font-bold">{previewDoc.authorName}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-3.5 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] text-xs font-semibold border border-[#ced4da] cursor-pointer"
                >
                  Kapat
                </button>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Dosyayı İndir
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card card-outline card-primary bg-white border border-[#dee2e6] rounded max-w-xl w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni MEB Evrakı Yükle</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#6c757d] hover:text-[#212529] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Evrak Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2024-2025 Matematik 1. Dönem Zümre Kararları"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Evrak Türü</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                  >
                    <option value="Zümre Kararı">Zümre Kararı</option>
                    <option value="Yazılı Sınav">Yazılı Sınav</option>
                    <option value="Yıllık Plan">Yıllık Plan</option>
                    <option value="BEP Planı">BEP Planı</option>
                    <option value="ŞÖK Evrakı">ŞÖK Evrakı</option>
                    <option value="Kulüp Evrakı">Kulüp Evrakı</option>
                    <option value="Ders Notu">Ders Notu</option>
                    <option value="Rehberlik Evrakı">Rehberlik Evrakı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Kategori</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Ders</label>
                  <input
                    type="text"
                    required
                    value={newDocLesson}
                    onChange={(e) => setNewDocLesson(e.target.value)}
                    placeholder="Örn: Matematik, Fizik, Türkçe"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                  />
                </div>
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Kademe / Sınıf</label>
                  <select
                    value={newDocGrade}
                    onChange={(e) => setNewDocGrade(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                  >
                    <option value="Tüm Kademeler">Tüm Kademeler</option>
                    <option value="İlkokul (1-4)">İlkokul (1-4)</option>
                    <option value="5. Sınıf">5. Sınıf</option>
                    <option value="6. Sınıf">6. Sınıf</option>
                    <option value="7. Sınıf">7. Sınıf</option>
                    <option value="8. Sınıf (LGS)">8. Sınıf (LGS)</option>
                    <option value="9. Sınıf">9. Sınıf</option>
                    <option value="10. Sınıf">10. Sınıf</option>
                    <option value="11. Sınıf">11. Sınıf</option>
                    <option value="12. Sınıf (YKS)">12. Sınıf (YKS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">İndirme Yetki Paketi</label>
                  <select
                    value={newDocAccessLevel}
                    onChange={(e) => setNewDocAccessLevel(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                  >
                    <option value="free">Ücretsiz (Tüm Öğretmenler)</option>
                    <option value="teacher_pro">Öğretmen Pro Paketi</option>
                    <option value="zumre_pro">Zümre VIP Paketi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Dosya Formatı</label>
                  <select
                    value={newDocExt}
                    onChange={(e) => setNewDocExt(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                  >
                    <option value="docx">Word (.docx)</option>
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">Açıklama / Notlar</label>
                <textarea
                  rows={2}
                  placeholder="Müfredat kazanımları ve zümre detayları..."
                  value={newDocDescription}
                  onChange={(e) => setNewDocDescription(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] text-xs font-semibold border border-[#ced4da] cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Kaydet & Moderasyona Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Category Modal (Unlimited Hierarchy Support) */}
      {isNewCategoryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card card-outline card-primary bg-white border border-[#dee2e6] rounded max-w-md w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni Kategori Ekle (Sınırsız Derinlik)</h3>
              <button
                type="button"
                onClick={() => setIsNewCategoryOpen(false)}
                className="text-[#6c757d] hover:text-[#212529] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Kategori Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 9. Sınıf Geometri veya LGS Denemeleri"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">
                  Üst Kategori (Sınırsız Hiyerarşi)
                </label>
                <select
                  value={newCatParent}
                  onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                >
                  <option value="">-- Ana Kategori Olarak Tanımla (Root) --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {"— ".repeat(c.level)} {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#6c757d] mt-1">
                  Kategori hiyerarşisi alt alta sınırsız sayıda kırılıma izin verir.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] text-xs font-semibold border border-[#ced4da] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Kategoriyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
