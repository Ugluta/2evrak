import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Layers,
  Menu as MenuIcon,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  FolderOpen,
  FileCheck,
  AlertTriangle,
  Upload,
  Sparkles,
} from "lucide-react";
import { CustomPage, MenuItem, MediaFile } from "../../types";

export const PagesMenusMediaView: React.FC = () => {
  const {
    pages,
    addPage,
    deletePage,
    menuItems,
    addMenuItem,
    deleteMenuItem,
    mediaFiles,
    addMediaFile,
    deleteMediaFile,
    cleanOrphanFiles,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"pages" | "menus" | "media">("pages");

  // Page modal
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");

  // Menu modal
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [menuTitle, setMenuTitle] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const [menuType, setMenuType] = useState<MenuItem["type"]>("url");

  // Media upload simulation
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [mediaType, setMediaType] = useState("pdf");

  const orphanCount = mediaFiles.filter((m) => m.isOrphan).length;

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim()) return;

    addPage({
      title: pageTitle,
      slug: pageSlug || pageTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      status: "published",
      blocks: [
        {
          id: "b_" + Date.now(),
          type: "richText",
          content: "# " + pageTitle + "\n\nMEB mevzuatı ve yönerge açıklamaları burada yer alır.",
          order: 1,
        },
      ],
      order: pages.length + 1,
      seoTitle: `${pageTitle} - 2Evrak`,
      seoDescription: `${pageTitle} resmi MEB evrak ve mevzuat sayfası`,
      schemaType: "WebPage",
      publishedAt: new Date().toISOString().split("T")[0],
    });

    setIsAddPageOpen(false);
    setPageTitle("");
    setPageSlug("");
  };

  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuTitle.trim() || !menuUrl.trim()) return;

    addMenuItem({
      parentId: null,
      label: menuTitle,
      type: menuType,
      targetValue: menuUrl,
      order: menuItems.length + 1,
      openInNewTab: false,
      isActive: true,
    });

    setIsAddMenuOpen(false);
    setMenuTitle("");
    setMenuUrl("");
  };

  const handleUploadMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaName.trim()) return;

    addMediaFile({
      name: `${mediaName}.${mediaType}`,
      url: `https://storage.2evrak.com/uploads/${mediaName}.${mediaType}`,
      mimeType:
        mediaType === "pdf"
          ? "application/pdf"
          : mediaType === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : `image/${mediaType}`,
      sizeBytes: 1850000,
      category: mediaType === "pdf" || mediaType === "docx" ? "document" : "image",
      uploadedBy: currentUser.fullName,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      isScannedSafe: true,
      metadata: {
        dimensions: mediaType === "png" || mediaType === "jpg" ? "1200x800" : undefined,
        checksumSha256: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
      },
      usages: [],
      isOrphan: true,
    });

    setIsAddMediaOpen(false);
    setMediaName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              11, 12 & 13 — Sayfa, Menü & Medya Yönetimi
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              CMS ve Dosya Havuzu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Özel Sayfalar, Dinamik Hiyerarşik Menüler ve Yetim Dosya Temizleyicili Medya Deposu
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "pages" && (
            <button
              onClick={() => setIsAddPageOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Sayfa Ekle
            </button>
          )}
          {activeTab === "menus" && (
            <button
              onClick={() => setIsAddMenuOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Menü Linki
            </button>
          )}
          {activeTab === "media" && (
            <button
              onClick={() => setIsAddMediaOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Dosya Yükle
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "pages"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" /> 11 Sayfa Yönetimi ({pages.length})
        </button>
        <button
          onClick={() => setActiveTab("menus")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "menus"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <MenuIcon className="w-4 h-4" /> 12 Menü Yönetimi ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "media"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ImageIcon className="w-4 h-4" /> 13 Medya Kütüphanesi ({mediaFiles.length})
        </button>
      </div>

      {/* Tab 1: Pages */}
      {activeTab === "pages" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Sayfa Başlığı</th>
                <th className="p-3.5">URL Yolu (Slug)</th>
                <th className="p-3.5">Şema Türü</th>
                <th className="p-3.5">Yayınlanma</th>
                <th className="p-3.5">Durum</th>
                <th className="p-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-semibold text-white">{p.title}</td>
                  <td className="p-3.5 font-mono text-indigo-400">/{p.slug}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{p.schemaType}</td>
                  <td className="p-3.5 font-mono text-slate-500">{p.publishedAt}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button onClick={() => deletePage(p.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Menus */}
      {activeTab === "menus" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Menü Öğesi</th>
                <th className="p-3.5">Hedef Değer / URL</th>
                <th className="p-3.5">Tür</th>
                <th className="p-3.5">Sıra</th>
                <th className="p-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {menuItems.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-semibold text-white">{m.label}</td>
                  <td className="p-3.5 font-mono text-indigo-400">{m.targetValue}</td>
                  <td className="p-3.5 uppercase font-mono text-[10px] text-slate-400">{m.type}</td>
                  <td className="p-3.5 font-mono text-slate-400">{m.order}</td>
                  <td className="p-3.5 text-right">
                    <button onClick={() => deleteMenuItem(m.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Media */}
      {activeTab === "media" && (
        <div className="space-y-4">
          {/* Orphan Cleaner Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Yetim Dosya Tarayıcısı (Orphan File Cleaner)
                </div>
                <p className="text-[11px] text-slate-400">
                  Veritabanında hiçbir dokümanda veya içerikte kullanılmayan {orphanCount} adet dosya tespit edildi.
                </p>
              </div>
            </div>

            {orphanCount > 0 && (
              <button
                onClick={cleanOrphanFiles}
                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
              >
                Yetim Dosyaları Temizle ({orphanCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mediaFiles.map((f) => (
              <div
                key={f.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400">
                    {f.mimeType.split("/")[1] || f.category}
                  </span>
                  {f.isOrphan && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      Yetim
                    </span>
                  )}
                </div>

                <div className="text-xs font-medium text-white truncate">{f.name}</div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>{(f.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>{f.createdAt}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button onClick={() => deleteMediaFile(f.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Page Modal */}
      {isAddPageOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Sayfa Oluştur</h3>
              <button onClick={() => setIsAddPageOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Sayfa Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: MEB Öğretmenlik Kariyer Basamakları Rehberi"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Özel URL (Slug)</label>
                <input
                  type="text"
                  placeholder="kariyer-basamaklari-rehberi"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPageOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Sayfayı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Menü Bağlantısı</h3>
              <button onClick={() => setIsAddMenuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateMenu} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Görünecek İsim</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2024 Zümreleri"
                  value={menuTitle}
                  onChange={(e) => setMenuTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">URL</label>
                <input
                  type="text"
                  required
                  placeholder="/kategori/zumre-kararlari"
                  value={menuUrl}
                  onChange={(e) => setMenuUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Menü Bağlantı Türü</label>
                <select
                  value={menuType}
                  onChange={(e) => setMenuType(e.target.value as MenuItem["type"])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="url">Doğrudan URL / Rota</option>
                  <option value="category">Kategori Filtresi</option>
                  <option value="page">Özel İçerik Sayfası</option>
                  <option value="external">Harici Web Sitesi</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Menüye Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {isAddMediaOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Medya / Dosya Yükle</h3>
              <button onClick={() => setIsAddMediaOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUploadMedia} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Dosya Adı</label>
                <input
                  type="text"
                  required
                  placeholder="meb_kazanim_tablosu"
                  value={mediaName}
                  onChange={(e) => setMediaName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Format</label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="pdf">PDF Dokümanı (.pdf)</option>
                  <option value="docx">Word Evrakı (.docx)</option>
                  <option value="png">PNG Görsel (.png)</option>
                  <option value="jpg">JPEG Görsel (.jpg)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMediaOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Yükle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
