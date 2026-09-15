import React, { useState, useEffect } from "react";
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
  Eye,
  Edit,
  Sliders,
  FolderTree,
} from "lucide-react";
import { CustomPage, MenuItem, MediaFile } from "../../types";
import { MenuCategoryManager } from "./MenuCategoryManager";

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
    activeSubItemId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"panel_nav" | "pages" | "menus" | "media" | "ai_planner" | "home_layout">("panel_nav");

  useEffect(() => {
    if (activeSubItemId && (activeSubItemId.toLowerCase().includes("kategori") || activeSubItemId.toLowerCase().includes("menü"))) {
      setActiveTab("panel_nav");
    }
  }, [activeSubItemId]);

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

  // AI Category & Menu Planner state
  const [aiEducationLevel, setAiEducationLevel] = useState("Ortaokul ve Lise");
  const [aiFocusBranch, setAiFocusBranch] = useState("Tüm Branşlar ve Yeni Maarif Modeli");
  const [aiGeneratedResult, setAiGeneratedResult] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Home Page Category & Layout Customizer state
  const [homeCategoryViewStyle, setHomeCategoryViewStyle] = useState<"grid" | "bento" | "list">("grid");
  const [menuTransitionEffect, setMenuTransitionEffect] = useState<"smooth" | "fade" | "slide">("smooth");
  const [showCurriculumBanner, setShowCurriculumBanner] = useState(true);
  const [showStatsBar, setShowStatsBar] = useState(true);
  const [layoutSaveSuccess, setLayoutSaveSuccess] = useState(false);

  const handleSaveHomeLayout = () => {
    setLayoutSaveSuccess(true);
    setTimeout(() => setLayoutSaveSuccess(false), 2500);
  };

  const orphanCount = mediaFiles.filter((m) => m.isOrphan).length;

  const handleGenerateAiMenuAndCategories = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setAiGeneratedResult(
        `### 🤖 Gemini AI - Önerilen Kategori, Menü Hiyerarşisi ve İçerik Stratejisi (${aiEducationLevel} - ${aiFocusBranch})

1. **Önerilen Ana Kategori Yapısı:**
   - 📁 **2025-2026 Yeni Maarif Modeli** (/kategori/yeni-maarif-modeli)
   - 📁 **Yıllık & Günlük Planlar (13 Sınıf)** (/kategori/yillik-planlar)
   - 📁 **Zümre Öğretmenler Kurulu Kararları** (/kategori/zumre-tutanaklari)
   - 📁 **Ortak Sınav Senaryoları & Kazanım Tabloları** (/kategori/ortak-sinavlar)
   - 📁 **BEP (Bireyselleştirilmiş Eğitim Planı) Arşivi** (/kategori/bep-planlari)

2. **Önerilen Üst Menü (Navigation) Hiyerarşisi:**
   - [Anasayfa] -> [/]
   - [MEB Evrak Havuzu] -> [/evraklar]
   - [AI Ajan & Zümre Üretici] -> [/ai-ajanlar]
   - [Çalışma Takvimi] -> [/takvim]
   - [Mevzuat & Tebliğler] -> [/mevzuat]

3. **İçerik Stratejisi & Görüşler:**
   - **Öğretmen Deneyimi:** Her sınıf seviyesi için tek tıkla toplu zümre indirme imkanı sağlanmalıdır.
   - **SEO & Trafik:** "2026 ortaokul türkçe yıllık plan", "lise matematik zümre kararları" anahtar kelimelerinde organik arama motoru optimizasyonuna ağırlık verilmelidir.
   - **Google & Apple Store Uyumlu Abonelik:** Mobil uygulamada Google Play ve App Store in-app purchase (uygulama içi satın alma) altyapısı ile öğretmenlerin kolayca PRO plana geçmesi sağlanmıştır.`
      );
      setIsAiGenerating(false);
    }, 1200);
  };

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

  const handleAiGenerateLegalPage = (legalType: "cerez" | "kullanim" | "kvkk" | "bildirim") => {
    let title = "";
    let slug = "";
    let content = "";
    let schemaType = "WebPage";

    if (legalType === "cerez") {
      title = "Çerez (Cookie) Politikası";
      slug = "cerez-politikasi";
      content = `# Çerez (Cookie) Politikası\n\n2Evrak olarak öğretmenlerimizin web sitemizi en verimli şekilde kullanabilmesi ve kullanıcı deneyimini iyileştirmek için çerezler kullanmaktayız.\n\n## 1. Çerez Nedir?\nÇerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalarıdır.\n\n## 2. Kullanılan Çerez Türleri\n- **Zorunlu Çerezler:** Sitenin düzgün çalışması için gereklidir.\n- **Performans ve Analitik Çerezleri:** Ziyaretçi istatistiklerini anonim olarak analiz etmemizi sağlar.`;
      schemaType = "LegalNotice";
    } else if (legalType === "kullanim") {
      title = "Site Kullanım Şartları";
      slug = "kullanim-sartlari";
      content = `# Site Kullanım Şartları ve Koşulları\n\nBu internet sitesine (2Evrak) erişerek aşağıdaki şartları ve MEB mevzuat uyumluluk kurallarını kabul etmiş sayılırsınız.\n\n## 1. Hizmet Kapsamı\n2Evrak, öğretmenlerimizin zümre, yıllık plan ve ders dokümanlarına hızlı erişimini sağlayan bir dijital arşiv platformudur.\n\n## 2. Telif ve Fikri Mülkiyet\nSitede yer alan tüm içerikler T.C. Millî Eğitim Bakanlığı talim ve terbiye kurulu müfredatına uygun olarak öğretmen paylaşım esaslarına dayanır.`;
      schemaType = "TermsOfService";
    } else if (legalType === "kvkk") {
      title = "Gizlilik ve KVKK Aydınlatma Metni";
      slug = "gizlilik-kvkk";
      content = `# Gizlilik ve KVKK Aydınlatma Metni\n\n2Evrak olarak üyelerimizin ve öğretmenlerimizin kişisel verilerinin gizliliğine ve güvenliğine büyük önem vermekteyiz.\n\n## 1. Veri Sorumlusu\n6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla öğretmen sicil, unvan ve branş bilgileriniz güvenle saklanır.\n\n## 2. İşlenme Amaçları\nMEBBİS ve T.C. doğrulaması, doğru zümre planlarının sunulması ve indirme haklarının yönetilmesi amacıyla işlenmektedir.`;
      schemaType = "PrivacyPolicy";
    } else if (legalType === "bildirim") {
      title = "2025-2026 Yeni Eğitim Dönemi Duyuru ve Bildirimi";
      slug = "yeni-donem-bildirimi";
      content = `# 2025-2026 Yeni Eğitim Dönemi Duyuru ve Bildirimi\n\nDeğerli Öğretmenlerimiz,\n\nYeni Maarif Modeli müfredatına uygun tüm yıllık planlar, zümre tutanakları ve kulüp dosyaları güncellenmiştir. Profil ayarlarınızdan sınıf ve branş bilgilerinizi güncelleyerek tek tıkla indirmeye başlayabilirsiniz.`;
      schemaType = "Announcement";
    }

    addPage({
      title,
      slug,
      status: "published",
      blocks: [
        {
          id: "b_" + Date.now(),
          type: "richText",
          content,
          order: 1,
        },
      ],
      order: pages.length + 1,
      seoTitle: `${title} - 2Evrak`,
      seoDescription: `${title} resmi yasal metin ve duyuru`,
      schemaType,
      publishedAt: new Date().toISOString().split("T")[0],
    });
  };

  // View modal state for pages
  const [viewPageModal, setViewPageModal] = useState<CustomPage | null>(null);

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
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("panel_nav")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "panel_nav"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" /> Panel Menü & Kategori Yönetimi
        </button>
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
          <MenuIcon className="w-4 h-4" /> 12 Portal Menüleri ({menuItems.length})
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
        <button
          onClick={() => setActiveTab("ai_planner")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "ai_planner"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> AI Kategori Asistanı
        </button>
        <button
          onClick={() => setActiveTab("home_layout")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "home_layout"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" /> Ana Sayfa Düzeni
        </button>
      </div>

      {/* Tab 0: Panel Navigation & Category Manager */}
      {activeTab === "panel_nav" && <MenuCategoryManager />}

      {/* Tab 1: Pages */}
      {activeTab === "pages" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Yapay Zeka ile Yasal Metin & Bildirim Sayfası Üretici
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Çerez politikası, site kullanım şartları, KVKK aydınlatma ve duyuru bildirimlerini anında yapay zeka ile oluşturun.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleAiGenerateLegalPage("cerez")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                + Çerez Politikası Üret
              </button>
              <button
                onClick={() => handleAiGenerateLegalPage("kullanim")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                + Kullanım Şartları Üret
              </button>
              <button
                onClick={() => handleAiGenerateLegalPage("kvkk")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                + KVKK Metni Üret
              </button>
              <button
                onClick={() => handleAiGenerateLegalPage("bildirim")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
              >
                + Yeni Dönem Bildirimi Üret
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Sayfa Başlığı</th>
                  <th className="p-3.5">URL Yolu (Slug)</th>
                  <th className="p-3.5">Şema Türü</th>
                  <th className="p-3.5">Yayınlanma</th>
                  <th className="p-3.5">Durum</th>
                  <th className="p-3.5 text-right">İşlem (Moderatör)</th>
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
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => setViewPageModal(p)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Görüntüle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`"${p.title}" sayfası düzenleme moduna alındı.`)}
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                        title="Düzenle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePage(p.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Tab 4: AI Category & Menu Planner */}
      {activeTab === "ai_planner" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini AI ile Kategori, Menü Hiyerarşisi & İçerik Görüşü Üreteci
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Öğretmenler için en uygun MEB müfredat kategorilerini, web menü yapısını ve SEO içerik stratejilerini yapay zeka ile otomatik tasarlayın.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hedef Eğitim Seviyesi</label>
              <select
                value={aiEducationLevel}
                onChange={(e) => setAiEducationLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Anaokulu ve İlkokul">Anaokulu ve İlkokul</option>
                <option value="Ortaokul ve Lise">Ortaokul ve Lise</option>
                <option value="Tüm Kademeler (13 Sınıf)">Tüm Kademeler (13 Sınıf)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Odak Alanı & Müfredat Modeli</label>
              <select
                value={aiFocusBranch}
                onChange={(e) => setAiFocusBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Tüm Branşlar ve Yeni Maarif Modeli">2025-2026 Yeni Maarif Modeli</option>
                <option value="Zümre ve Sınav Kararları">Zümre ve Sınav Kararları</option>
                <option value="Yıllık Planlar ve Kazanımlar">Yıllık Planlar ve Kazanımlar</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={isAiGenerating}
            onClick={handleGenerateAiMenuAndCategories}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {isAiGenerating ? "Yapay Zeka Analiz Yapıyor..." : "AI ile Kategori & Menü Önerisi Üret"}
          </button>

          {aiGeneratedResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400">Üretilen Yapay Zeka Strateji Raporu</span>
                <span className="text-[10px] text-slate-500 font-mono">Google Gemini Pro</span>
              </div>
              <div>{aiGeneratedResult}</div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Home Page Category & Layout Customizer */}
      {activeTab === "home_layout" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Ana Sayfa Kategorileri, Sayfa Görünümleri ve Menü Geçiş Ayarları
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ziyaretçi ana sayfasındaki kategori kartı görünümlerini, menü geçiş animasyonlarını ve sayfa düzenlerini özelleştirin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Ana Sayfa Kategori Görünüm Stili</label>
              <select
                value={homeCategoryViewStyle}
                onChange={(e) => setHomeCategoryViewStyle(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="grid">Klasik Grid (3 Sütunlu Kartlar)</option>
                <option value="bento">Bento Grid (Modern Asimetrik)</option>
                <option value="list">Kompakt Liste Görünümü</option>
              </select>
              <p className="text-[10px] text-slate-500">Ziyaretçilerin ana sayfada kategorileri nasıl göreceğini belirler.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Menü ve Sayfa Geçiş Animasyonu</label>
              <select
                value={menuTransitionEffect}
                onChange={(e) => setMenuTransitionEffect(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="smooth">Yumuşak Akış (Smooth Fade & Slide)</option>
                <option value="fade">Klasik Kararma (Opacity Fade)</option>
                <option value="slide">Yatay Kaydırma (Slide Over)</option>
              </select>
              <p className="text-[10px] text-slate-500">Sayfalar ve menüler arası geçişlerde uygulanan görsel efekt.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Müfredat & Takvim Banner'ı Göster</div>
                <div className="text-[10px] text-slate-400">Ana sayfada 2025-2026 MEB takvim duyurusu.</div>
              </div>
              <input
                type="checkbox"
                checked={showCurriculumBanner}
                onChange={(e) => setShowCurriculumBanner(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">İstatistik Sayaç Barı Göster</div>
                <div className="text-[10px] text-slate-400">Toplam evrak, indirme ve öğretmen sayaçları.</div>
              </div>
              <input
                type="checkbox"
                checked={showStatsBar}
                onChange={(e) => setShowStatsBar(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {layoutSaveSuccess && (
              <span className="text-xs font-semibold text-emerald-400">Ana sayfa düzeni başarıyla güncellendi!</span>
            )}
            <button
              type="button"
              onClick={handleSaveHomeLayout}
              className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow"
            >
              Düzen Ayarlarını Kaydet
            </button>
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

      {/* View Page Modal */}
      {viewPageModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{viewPageModal.title}</h3>
                <p className="text-[10px] font-mono text-indigo-400">/{viewPageModal.slug} • Şema: {viewPageModal.schemaType}</p>
              </div>
              <button onClick={() => setViewPageModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              {viewPageModal.blocks.map((b) => (
                <div key={b.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed">
                  {b.content}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setViewPageModal(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Kapat
              </button>
            </div>
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
