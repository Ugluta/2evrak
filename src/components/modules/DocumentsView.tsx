import React, { useState } from "react";
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
} from "lucide-react";
import { DocumentItem, DocumentCategory } from "../../types";

export const DocumentsView: React.FC = () => {
  const {
    documents,
    categories,
    addDocument,
    updateDocument,
    softDeleteDocument,
    restoreDocument,
    permanentDeleteDocument,
    addCategory,
    deleteCategory,
    currentUser,
    hasPermission,
  } = useApp();

  // State
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [viewMode, setViewMode] = useState<"active" | "trash">("active");
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

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
      selectedCategory === "all" || doc.categoryId === selectedCategory;
    const matchesDocType =
      selectedDocType === "all" || doc.docType === selectedDocType;
    const matchesSearch =
      searchKeyword === "" ||
      doc.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      doc.lesson.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchKeyword.toLowerCase()));

    return matchesTrash && matchesCategory && matchesDocType && matchesSearch;
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

  return (
    <div className="space-y-6">
      {/* Module Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">06 — Doküman Yönetimi</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Sınırsız Hiyerarşi & Çöp Kutusu Korumalı
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            MEB Müfredatına Uygun Zümre Kararları, Sınavlar, Yıllık Planlar, BEP ve ŞÖK Evrakları
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active vs Trash View Switcher */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode("active")}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === "active"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Aktif Evraklar ({activeCount})</span>
            </button>
            <button
              onClick={() => setViewMode("trash")}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === "trash"
                  ? "bg-red-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Çöp Kutusu ({trashCount})</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewCategoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
            Yeni Kategori
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Evrak Yükle
          </button>
        </div>
      </div>

      {/* Main Content Area: Sidebar Hierarchy + Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Hierarchical Category Tree */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Kategori Ağacı
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {categories.length} Kategori
            </span>
          </div>

          {/* All Categories Root Selector */}
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
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
                      onClick={() => setSelectedCategory(root.id)}
                      className={`flex-1 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FolderTree className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{root.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                        {rootDocCount}
                      </span>
                    </button>
                    {!root.isSystem && (
                      <button
                        onClick={() => deleteCategory(root.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 ml-1 transition-opacity"
                        title="Kategoriyi Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Render 2nd Level Children */}
                  {children.length > 0 && (
                    <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2">
                      {children.map((sub) => {
                        const isSubSelected = selectedCategory === sub.id;
                        const subDocCount = documents.filter(
                          (d) => !d.isSoftDeleted && d.categoryId === sub.id
                        ).length;

                        return (
                          <div key={sub.id} className="flex items-center justify-between group">
                            <button
                              onClick={() => setSelectedCategory(sub.id)}
                              className={`flex-1 text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                                isSubSelected
                                  ? "bg-indigo-600 text-white font-semibold"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                              }`}
                            >
                              <span className="truncate">↳ {sub.name}</span>
                              <span className="text-[9px] font-mono opacity-60">
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
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Evrak adı, ders veya etiket ara..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Tür:
              </span>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <div className="text-sm font-semibold">Bu kriterlere uygun evrak bulunamadı.</div>
                <p className="text-xs text-slate-500">
                  Filtreleri temizleyebilir veya yeni bir MEB dokümanı yükleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Evrak & Başlık</th>
                      <th className="p-3.5">Ders / Kademe</th>
                      <th className="p-3.5">Tür</th>
                      <th className="p-3.5">Erişim</th>
                      <th className="p-3.5">İstatistik</th>
                      <th className="p-3.5">Durum</th>
                      <th className="p-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredDocs.map((doc) => {
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="p-3.5 max-w-xs">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] text-indigo-400 shrink-0 mt-0.5">
                                {doc.fileExtension.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div
                                  onClick={() => setPreviewDoc(doc)}
                                  className="font-medium text-white truncate hover:text-indigo-300 cursor-pointer"
                                >
                                  {doc.title}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <span>{doc.authorName}</span>
                                  <span>•</span>
                                  <span>{doc.createdAt}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <div className="text-slate-200 font-medium">{doc.lesson}</div>
                            <div className="text-[10px] text-slate-400">{doc.gradeLevel}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                              {doc.docType}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                doc.accessLevel === "free"
                                  ? "bg-slate-800 text-slate-300 border-slate-700"
                                  : doc.accessLevel === "teacher_pro"
                                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                                  : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              }`}
                            >
                              {doc.accessLevel === "free"
                                ? "Ücretsiz"
                                : doc.accessLevel === "teacher_pro"
                                ? "Öğretmen Pro"
                                : "Zümre VIP"}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center text-slate-300 font-mono">
                                <Download className="w-3 h-3 mr-1 text-slate-500" />
                                {doc.downloadCount}
                              </span>
                              <span className="flex items-center text-amber-400 font-mono">
                                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                                {doc.rating}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{doc.fileSize}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                doc.status === "published"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : doc.status === "pending"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}
                            >
                              {doc.status === "published"
                                ? "Yayında"
                                : doc.status === "pending"
                                ? "Moderasyonda"
                                : "Revizyon"}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Action */}
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Önizle & Detay"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {viewMode === "active" ? (
                                <button
                                  onClick={() => softDeleteDocument(doc.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                  title="Çöp Kutusuna At (Soft Delete)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => restoreDocument(doc.id)}
                                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                    title="Geri Yükle"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => permanentDeleteDocument(doc.id)}
                                    className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 transition-colors"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  MEB Doküman Kartı
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{previewDoc.description}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Ders</span>
                <span className="text-white font-medium">{previewDoc.lesson}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Kademe / Sınıf</span>
                <span className="text-white font-medium">{previewDoc.gradeLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Evrak Türü</span>
                <span className="text-white font-medium">{previewDoc.docType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Dosya Formatı</span>
                <span className="text-white font-mono">{previewDoc.fileExtension.toUpperCase()} ({previewDoc.fileSize})</span>
              </div>
            </div>

            <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/50 space-y-2 text-xs">
              <div className="font-semibold text-slate-300">SEO & Müfredat Uyumluluğu</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {previewDoc.seoDescription || "MEB Talim ve Terbiye Kurulu zümre kararlarına tam uygun hazırlanmıştır."}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {previewDoc.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-slate-400">
                Ekleyen: <span className="text-white font-medium">{previewDoc.authorName}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Kapat
                </button>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni MEB Evrakı Yükle</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Evrak Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2024-2025 Matematik 1. Dönem Zümre Kararları"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Evrak Türü</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  <label className="block text-slate-300 font-medium mb-1">Kategori</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  <label className="block text-slate-300 font-medium mb-1">Ders</label>
                  <input
                    type="text"
                    required
                    value={newDocLesson}
                    onChange={(e) => setNewDocLesson(e.target.value)}
                    placeholder="Örn: Matematik, Fizik, Türkçe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kademe / Sınıf</label>
                  <select
                    value={newDocGrade}
                    onChange={(e) => setNewDocGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  <label className="block text-slate-300 font-medium mb-1">İndirme Yetki Paketi</label>
                  <select
                    value={newDocAccessLevel}
                    onChange={(e) => setNewDocAccessLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="free">Ücretsiz (Tüm Öğretmenler)</option>
                    <option value="teacher_pro">Öğretmen Pro Paketi</option>
                    <option value="zumre_pro">Zümre VIP Paketi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dosya Formatı</label>
                  <select
                    value={newDocExt}
                    onChange={(e) => setNewDocExt(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="docx">Word (.docx)</option>
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Açıklama / Notlar</label>
                <textarea
                  rows={2}
                  placeholder="Müfredat kazanımları ve zümre detayları..."
                  value={newDocDescription}
                  onChange={(e) => setNewDocDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Kategori Ekle (Sınırsız Derinlik)</h3>
              <button
                onClick={() => setIsNewCategoryOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Kategori Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 9. Sınıf Geometri veya LGS Denemeleri"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Üst Kategori (Sınırsız Hiyerarşi)
                </label>
                <select
                  value={newCatParent}
                  onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Ana Kategori Olarak Tanımla (Root) --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {"— ".repeat(c.level)} {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Kategori hiyerarşisi alt alta sınırsız sayıda kırılıma izin verir.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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
