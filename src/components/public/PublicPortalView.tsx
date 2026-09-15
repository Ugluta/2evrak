import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Download,
  Eye,
  FileText,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ChevronRight,
  Filter,
  GraduationCap,
  LogIn,
  LayoutDashboard,
  ExternalLink,
  Printer,
  BadgeCheck,
  FolderOpen,
  Share2,
  MessageCircle,
  Mail,
  Phone,
  Newspaper,
  Scale,
  Send,
  Copy,
  Check,
} from "lucide-react";

interface PublicPortalViewProps {
  onGoToAdminPanel: () => void;
  onGoToTeacherPortal: () => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({
  onGoToAdminPanel,
  onGoToTeacherPortal,
}) => {
  const { documents, categories, systemSettings, packages, currentUser, currentRole, judicialPrecedents, pages } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeHomeTab, setActiveHomeTab] = useState<"documents" | "news" | "legislation" | "precedents">("documents");
  const [previewDocModal, setPreviewDocModal] = useState<any | null>(null);
  const [selectedPageModal, setSelectedPageModal] = useState<any | null>(null);

  const handleFooterLinkClick = (link: { label: string; url: string }) => {
    if (link.url === "admin_login") {
      onGoToAdminPanel();
    } else if (link.url === "teacher_portal" || link.url.includes("portal")) {
      onGoToTeacherPortal();
    } else {
      let targetSlug = "";
      const lowerLabel = link.label.toLowerCase();
      if (link.url === "public_about" || lowerLabel.includes("hakkımızda")) targetSlug = "hakkimizda";
      else if (link.url === "public_contact" || lowerLabel.includes("iletişim")) targetSlug = "iletisim";
      else if (link.url === "public_privacy" || lowerLabel.includes("kvkk") || lowerLabel.includes("gizlilik")) targetSlug = "gizlilik-kvkk";
      else if (lowerLabel.includes("kurallar") || lowerLabel.includes("şartlar")) targetSlug = "uye-kurallari";
      else if (lowerLabel.includes("çerez")) targetSlug = "cerez-politikasi";
      else if (lowerLabel.includes("duyuru") || lowerLabel.includes("dönem")) targetSlug = "yeni-donem-bildirimi";

      const foundPage = pages.find((p) => p.slug === targetSlug || p.title.toLowerCase().includes(lowerLabel.substring(0, 4)));
      if (foundPage) {
        setSelectedPageModal(foundPage);
      } else if (link.url.startsWith("public_")) {
        setActiveHomeTab(link.url.includes("news") ? "news" : link.url.includes("law") ? "legislation" : "documents");
        window.scrollTo({ top: 400, behavior: "smooth" });
      } else {
        setSelectedPageModal(pages[0] || null);
      }
    }
  };

  // Footer accordion state
  const [footerOpenMap, setFooterOpenMap] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
  });

  // Share modal state
  const [shareModalItem, setShareModalItem] = useState<{ title: string; type: string; desc?: string } | null>(null);
  const [sharePhone, setSharePhone] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const gradeOptions = [
    { id: "all", label: "Tüm Kademeler" },
    { id: "İlkokul", label: "İlkokul (1-4)" },
    { id: "Ortaokul", label: "Ortaokul (5-8)" },
    { id: "Lise", label: "Lise (9-12)" },
    { id: "Okul Öncesi", label: "Okul Öncesi" },
  ];

  // Mock News & Legislation items for the home page
  const newsItems = [
    {
      id: "news_1",
      title: "2025-2026 Eğitim Öğretim Yılı Çalışma Takvimi ve Zümre Esasları Yayımlandı",
      date: "12 Eylül 2026",
      category: "MEB Duyuru",
      summary: "Millî Eğitim Bakanlığı tarafından yayımlanan yeni genelgeye göre zümre toplantıları ve ortak sınav takvimi güncellendi.",
      content: "Millî Eğitim Bakanlığı 2025-2026 eğitim öğretim yılı iş takvimi çerçevesinde tüm il ve ilçe müdürlüklerine duyuru yapıldı. Zümre öğretmenler kurulu toplantılarının dijital ortamda saklanması ve e-Arşiv uyumu zorunlu kılındı."
    },
    {
      id: "news_2",
      title: "Yeni Maarif Modeli Müfredatında Ölçme ve Değişiklikler",
      date: "10 Eylül 2026",
      category: "Müfredat Haberleri",
      summary: "Türkiye Yüzyılı Maarif Modeli kapsamında ilkokul ve ortaokul kademelerinde beceri temelli değerlendirme kriterleri netleşti.",
      content: "Öğretmenlerimizin hazırlayacağı yıllık planlarda süreç odaklı değerlendirme yaklaşımlarına yer verilecek. Örnek planlar 2Evrak portalında yayında."
    },
    {
      id: "news_3",
      title: "1 Milyon Öğretmen İçin Dijital Arşiv ve Bulut Desteği",
      date: "05 Eylül 2026",
      category: "Platform Güncellemesi",
      summary: "2Evrak platformu üzerinden artık tüm zümre tutanakları ve BEP planları doğrudan tek tıkla başlık temizleme özelliğine kavuştu.",
      content: "Öğretmenlerimizin MEBBİS doğrulaması ile tam entegre çalışarak okul, şube ve kulüp bilgilerini otomatik evraklara aktarması sağlandı."
    }
  ];

  const legislationItems = [
    {
      id: "leg_1",
      title: "657 Sayılı Devlet Memurları Kanunu (İlgili Öğretmenlik Hükümleri)",
      lawNo: "Kanun No: 657",
      date: "14/07/1965",
      summary: "Devlet memurlarının ödev ve sorumlulukları, ders saatleri, ek ders esasları ve disiplin hükümleri.",
      content: "657 sayılı Kanun'un eğitim ve öğretim hizmetleri sınıfına dahil personelin hak ve yükümlülüklerini düzenleyen temel maddeleri."
    },
    {
      id: "leg_2",
      title: "Millî Eğitim Bakanlığı Eğitim Kurumları Sınıf Rehberlik ve Kulüp Yönetmeliği",
      lawNo: "MEB Mevzuat No: 2024/45",
      date: "Ağustos 2024",
      summary: "Okullarda kurulacak öğrenci kulüpleri, sosyal etkinlikler ve sınıf rehberlik dersi işleniş esasları.",
      content: "Danışman öğretmenlerin kulüp faaliyetlerinde tutacağı defterler, yıllık çalışma programları ve öğrenci katılım esasları."
    },
    {
      id: "leg_3",
      title: "MEB İlköğretim ve Ortaöğretim Kurumları Sınav ve Değişiklik Yönetmeliği",
      lawNo: "Mevzuat No: 32145",
      date: "Haziran 2025",
      summary: "Ortak sınavlar, mazeret sınavları, zümre kararları ve başarı değerlendirme kriterleri.",
      content: "Ülke ve il genelinde yapılacak ortak yazılı sınavların uygulama usulleri, soru hazırlama komisyonları ve zümre sorumlulukları."
    }
  ];

  const filteredDocs = documents
    .filter((d) => !d.isSoftDeleted && d.status === "published")
    .filter((d) => {
      const matchesSearch =
        !searchQuery.trim() ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.lesson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.docType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGrade =
        selectedGrade === "all" || d.gradeLevel.includes(selectedGrade);

      const matchesCategory =
        selectedCategory === "all" || d.categoryId === selectedCategory;

      return matchesSearch && matchesGrade && matchesCategory;
    });

  const isStaffUser =
    currentRole.slug === "super_admin" ||
    currentRole.slug === "editor_in_chief" ||
    currentRole.slug === "moderator";

  const handleSendShare = (method: "whatsapp" | "email" | "sms") => {
    if (!shareModalItem) return;
    const text = `2Evrak Paylaşımı: "${shareModalItem.title}" - Detaylar için inceleyin: ${window.location.href}`;

    if (method === "whatsapp") {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    } else if (method === "email") {
      const mailtoUrl = `mailto:${shareEmail || ""}?subject=${encodeURIComponent("Öğretmen Evrak Paylaşımı: " + shareModalItem.title)}&body=${encodeURIComponent(text)}`;
      window.location.href = mailtoUrl;
    } else if (method === "sms") {
      const smsUrl = `sms:${sharePhone || ""}?body=${encodeURIComponent(text)}`;
      window.location.href = smsUrl;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* 1. PUBLIC HEADER */}
      <header className="h-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white backdrop-blur-md border-b border-indigo-900/40 sticky top-0 z-40 px-4 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* LOGO WITH EMBEDDED LINK */}
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedGrade("all");
              setActiveHomeTab("documents");
            }}
            className="flex items-center gap-3 group text-left transition-transform active:scale-95"
            title="2Evrak Ana Sayfası"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all overflow-hidden">
              {systemSettings.general.logoUrl ? (
                <img src={systemSettings.general.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                systemSettings.headerFooterConfig?.headerLogoText || "2E"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  {systemSettings.general.siteName || "2Evrak"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  MEB 2025-2026
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 font-medium">
                1 Milyon Öğretmen & Zümre Portalı
              </p>
            </div>
          </button>

          {/* RIGHT ACTIONS: Switch to Admin / Teacher / Login */}
          <div className="flex items-center gap-3">
            {/* Öğretmenim Paneline Git */}
            <button
              onClick={onGoToTeacherPortal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all shadow-emerald-600/20"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Öğretmen Paneli</span>
            </button>

            {/* Yönetim Paneline Git */}
            {isStaffUser ? (
              <button
                onClick={onGoToAdminPanel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Yönetim Paneli</span>
              </button>
            ) : (
              <button
                onClick={onGoToAdminPanel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
                title="Yönetici Girişi"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Yönetici</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section 
        className="relative overflow-hidden pt-12 pb-16 px-4 md:px-8 border-b border-[#D6E9F8] bg-gradient-to-b from-[#E8F4FF] via-[#F7FBFF] to-[#FFFFFF] text-[#203650] shadow-xs bg-cover bg-center"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F4FF] border border-[#D6E9F8] text-[#4A90E2] text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4A90E2]" />
            <span>MEB Müfredatına Tam Uyumlu 2025-2026 Dönem Havuzu</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-[#203650] tracking-tight leading-tight">
            Öğretmenler İçin <span className="text-[#4A90E2]">Yıllık Plan, Zümre, Haber & Mevzuat</span> Arşivi
          </h1>

          <p className="text-sm md:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Türkiye genelindeki meslektaşlarınızla hazırlanan zümre toplantı tutanakları, BEP planları, en son eğitim haberleri ve kanun-mevzuat kaynaklarına anında ulaşın.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white border-2 border-[#4A90E2] rounded-2xl p-1.5 shadow-lg shadow-[#4A90E2]/15 focus-within:border-[#4A90E2] transition-all">
              <Search className="w-5 h-5 text-[#4A90E2] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Örn: 9. Sınıf Matematik Yıllık Planı, Zümre, 657 Sayılı Kanun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-[#203650] placeholder-[#64748B] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#64748B] hover:text-[#203650] mr-2 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl bg-[#4A90E2] hover:bg-[#357abd] text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                Ara
              </button>
            </div>
          </div>

          {/* QUICK STATS PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#D6E9F8] shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-[#203650]">{documents.length} MEB Uyumlu Evrak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#D6E9F8] shadow-2xs">
              <Users className="w-4 h-4 text-[#4A90E2]" />
              <span className="font-semibold text-[#203650]">142.850 Kayıtlı Öğretmen</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#D6E9F8] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#4A90E2]" />
              <span className="font-semibold text-[#203650]">MEB Moderatör Onaylı</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOME CONTENT SWITCHER TABS: Evraklar, Haberler, Mevzuat (Mobile Horizontal Scrolling / Carousel) */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2.5 snap-x">
            <button
              onClick={() => setActiveHomeTab("documents")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap snap-start ${
                activeHomeTab === "documents"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Zümre & Plan Arşivi</span>
            </button>

            <button
              onClick={() => setActiveHomeTab("news")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap snap-start ${
                activeHomeTab === "news"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <Newspaper className="w-4 h-4 text-amber-500" />
              <span>Eğitim Haberleri ({newsItems.length})</span>
            </button>

            <button
              onClick={() => setActiveHomeTab("legislation")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap snap-start ${
                activeHomeTab === "legislation"
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <Scale className="w-4 h-4 text-cyan-500" />
              <span>Kanun & Mevzuat ({legislationItems.length})</span>
            </button>

            <button
              onClick={() => setActiveHomeTab("precedents")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap snap-start ${
                activeHomeTab === "precedents"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Yargı Emsal Kararları ({judicialPrecedents.length})</span>
            </button>
          </div>

          {activeHomeTab === "documents" && (
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* MAIN BODY BASED ON ACTIVE TAB (Light Gray Background Body) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 bg-slate-100">
        
        {/* TAB 1: DOCUMENTS */}
        {activeHomeTab === "documents" && (
          <div className="space-y-6">
            {/* Mobile / Desktop Horizontal Sliding Categories & Grades ("Kaydırma kültürü") */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kademeler ve Kategoriler (Yatay Kaydırılabilir)</span>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">Mobil Uyumlu</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                {gradeOptions.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGrade(g.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all snap-start shadow-xs ${
                      selectedGrade === g.id
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
                <div className="w-px h-6 bg-slate-300 shrink-0 mx-1" />
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id === selectedCategory ? "all" : c.id)}
                    style={c.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${c.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all snap-start shadow-xs flex items-center gap-1.5 ${
                      selectedCategory === c.id
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-300"
                        : c.imageUrl
                        ? "text-white border border-amber-300/50"
                        : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                    }`}
                  >
                    <span>📂</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Öne Çıkan Eğitim Evrakları</h2>
                <p className="text-xs text-slate-500 font-medium">{filteredDocs.length} sonuç bulundu ve listeleniyor</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => {
                const ext = (doc.fileExtension || doc.fileType || "doc").toUpperCase();
                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-200/90 hover:border-indigo-400 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl shadow-xs group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                            ext === "PDF"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : ext === "DOCX" || ext === "DOC"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-emerald-50 text-emerald-600 border-emerald-200"
                          }`}
                        >
                          📄 {ext}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {doc.gradeLevel}
                        </span>
                      </div>

                      <div>
                        <h3
                          onClick={() => setPreviewDocModal(doc)}
                          className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                        >
                          {doc.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {doc.description || "MEB müfredat standartlarına tam uyumlu evrak."}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {doc.lesson}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200">
                          {doc.docType}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        <span className="text-slate-900 font-bold font-mono">{doc.downloadCount}</span> indirme
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setShareModalItem({ title: doc.title, type: "Evrak", desc: doc.description })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Arkadaşına Gönder / Paylaş"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPreviewDocModal(doc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Önizle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`"${doc.title}" standart evrak olarak indirildi.`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
                          title="Standart İndir"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>İndir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: NEWS */}
        {activeHomeTab === "news" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">MEB & 2Evrak Eğitim Haberleri</h2>
              </div>
              <p className="text-xs text-slate-600 mb-6">
                Öğretmenlerimizi ilgilendiren son dakika duyuruları, zümre takvimi güncellemeleri ve Maarif Modeli gelişmeleri.
              </p>

              <div className="space-y-4">
                {newsItems.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-amber-300 transition-all shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-slate-500 font-mono font-medium">{item.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{item.content}</p>
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => setShareModalItem({ title: item.title, type: "Haber", desc: item.summary })}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Arkadaşına Gönder / Paylaş</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEGISLATION & LAWS */}
        {activeHomeTab === "legislation" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-cyan-600" />
                <h2 className="text-base font-bold text-slate-900">Kanun, Yönetmelik & Mevzuat Arşivi</h2>
              </div>
              <p className="text-xs text-slate-600 mb-6">
                Okul yönetimleri, öğretmenler ve zümre kurulları için temel yasal dayanaklar ve yönetmelik özetleri.
              </p>

              <div className="space-y-4">
                {legislationItems.map((leg) => (
                  <div key={leg.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-cyan-300 transition-all shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono font-bold">
                        {leg.lawNo}
                      </span>
                      <span className="text-slate-500 font-mono">Resmi Gazete / Tarih: {leg.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{leg.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{leg.content}</p>
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => setShareModalItem({ title: leg.title, type: "Mevzuat", desc: leg.summary })}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Arkadaşına Gönder / Paylaş</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: JUDICIAL PRECEDENTS */}
        {activeHomeTab === "precedents" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Yargı & Danıştay Emsal Kararları</h2>
              </div>
              <p className="text-xs text-slate-600 mb-6">
                Öğretmenlerin özlük hakları, ek ders ücretleri, disiplin soruşturmaları ve atamaları hakkında Danıştay ile AYM emsal kararları.
              </p>

              <div className="space-y-4">
                {judicialPrecedents.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-purple-300 transition-all shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold">
                        {item.court}
                      </span>
                      <span className="text-slate-500 font-mono font-medium">Esas/Karar: {item.caseNo}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-semibold">
                        {item.legalBasis}
                      </span>
                      <button
                        onClick={() => setShareModalItem({ title: item.title, type: "Emsal Karar", desc: item.summary })}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Paylaş / İncele</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 5. FOOTER (Accordion / Expandable Links) */}
      <footer className="bg-[#F0F5FC] border-t border-[#D6E9F8] text-[#64748B] py-12 px-4 md:px-8 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(systemSettings.headerFooterConfig?.footerAccordionColumns || []).map((col, idx) => {
              const isOpen = footerOpenMap[idx] ?? true;
              return (
                <div key={idx} className="space-y-3 bg-white p-4 rounded-2xl border border-[#D6E9F8] shadow-xs">
                  <button
                    type="button"
                    onClick={() => setFooterOpenMap((prev) => ({ ...prev, [idx]: !isOpen }))}
                    className="w-full flex items-center justify-between font-bold text-[#203650] text-xs uppercase tracking-wider text-left py-1 cursor-pointer"
                  >
                    <span>{col.title}</span>
                    <span className="text-[#4A90E2] font-mono text-sm ml-2">{isOpen ? "▼" : "▶"}</span>
                  </button>
                  {isOpen && (
                    <ul className="space-y-2 pt-2 border-t border-[#D6E9F8] text-xs transition-all">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <button
                            type="button"
                            onClick={() => handleFooterLinkClick(link)}
                            className="hover:text-[#4A90E2] font-medium text-[#64748B] transition-colors text-left w-full py-1 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]/80" />
                            <span>{link.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#D6E9F8] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <div>
              {systemSettings.headerFooterConfig?.footerCopyright || "© 2026 2Evrak — Türkiye'nin Dijital Öğretmen Arşivi. Tüm Hakları Saklıdır."}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onGoToTeacherPortal} className="hover:text-[#203650] font-medium transition-colors">
                Öğretmen Paneli
              </button>
              <button onClick={onGoToAdminPanel} className="hover:text-[#203650] font-medium transition-colors">
                Yönetim Paneli
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* PREVIEW MODAL */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-[#203650]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D6E9F8] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E9F8]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F4FF] text-[#4A90E2]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#203650]">Evrak Önizleme & Detay</h3>
                  <span className="text-[10px] text-[#64748B]">MEB Müfredatı ve Zümre Bilgileri</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="w-8 h-8 rounded-lg bg-[#F7FBFF] border border-[#D6E9F8] text-[#64748B] hover:text-[#203650] hover:bg-[#E8F4FF] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px]">Başlık</span>
                <span className="text-[#203650] font-bold text-sm">{previewDocModal.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-[#F7FBFF] p-3 rounded-xl border border-[#D6E9F8]">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Ders</span>
                  <span className="text-[#203650] font-semibold">{previewDocModal.lesson}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Kademe</span>
                  <span className="text-[#203650] font-semibold">{previewDocModal.gradeLevel}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Format</span>
                  <span className="text-[#4A90E2] font-mono font-bold">
                    {(previewDocModal.fileExtension || previewDocModal.fileType || "doc").toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Kaynak</span>
                  <span className="text-[#203650] font-semibold">{previewDocModal.source}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">Açıklama</span>
                <p className="text-[#203650] leading-relaxed mt-1">
                  {previewDocModal.description || "MEB müfredatına tam uyumlu içerik."}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D6E9F8] flex items-center justify-between">
              <button
                onClick={() => {
                  setShareModalItem({ title: previewDocModal.title, type: "Evrak", desc: previewDocModal.description });
                  setPreviewDocModal(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7FBFF] hover:bg-[#E8F4FF] text-[#203650] border border-[#D6E9F8] text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#4A90E2]" />
                <span>Arkadaşına Gönder</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDocModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#F7FBFF] hover:bg-[#E8F4FF] text-[#64748B] hover:text-[#203650] border border-[#D6E9F8] text-xs font-medium transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    alert(`"${previewDocModal.title}" evrakı indirildi.`);
                    setPreviewDocModal(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A90E2] hover:bg-[#3b7bc7] text-white text-xs font-bold shadow-md shadow-[#4A90E2]/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Evrakı İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "ARKADAŞINA GÖNDER / PAYLAŞ" MODAL (WhatsApp, Mail, SMS) */}
      {shareModalItem && (
        <div className="fixed inset-0 z-50 bg-[#203650]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D6E9F8] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E9F8]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F4FF] text-[#4A90E2]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#203650]">Arkadaşına Gönder & Paylaş</h3>
                  <p className="text-[10px] text-[#64748B]">Bu içeriği meslektaşınıza WhatsApp, Mail veya SMS ile ulaştırın.</p>
                </div>
              </div>
              <button
                onClick={() => setShareModalItem(null)}
                className="w-8 h-8 rounded-lg bg-[#F7FBFF] border border-[#D6E9F8] text-[#64748B] hover:text-[#203650] hover:bg-[#E8F4FF] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-[#F7FBFF] p-3.5 rounded-xl border border-[#D6E9F8]">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F4FF] text-[#4A90E2] border border-[#D6E9F8]">
                {shareModalItem.type}
              </span>
              <h4 className="font-bold text-[#203650] text-sm">{shareModalItem.title}</h4>
              <p className="text-[#64748B] text-xs line-clamp-2">{shareModalItem.desc || "2Evrak meslektaş paylaşımı."}</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* WhatsApp Direct */}
              <div className="space-y-1">
                <label className="text-[#203650] font-bold">1. WhatsApp ile Gönder</label>
                <button
                  onClick={() => handleSendShare("whatsapp")}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp ile Meslektaşına Gönder</span>
                </button>
              </div>

              {/* Email Direct */}
              <div className="space-y-1.5 pt-2 border-t border-[#D6E9F8]">
                <label className="text-[#203650] font-bold">2. E-Posta (Mail) ile Gönder</label>
                <input
                  type="email"
                  placeholder="meslektas@meb.gov.tr"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full bg-[#F7FBFF] border border-[#D6E9F8] rounded-xl p-2.5 text-xs text-[#203650] placeholder:text-[#64748B] focus:outline-none focus:border-[#4A90E2]"
                />
                <button
                  onClick={() => handleSendShare("email")}
                  className="w-full py-2 rounded-xl bg-[#4A90E2] hover:bg-[#3b7bc7] text-white font-semibold flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Mail Olarak Gönder</span>
                </button>
              </div>

              {/* SMS / Cep Telefonu Direct */}
              <div className="space-y-1.5 pt-2 border-t border-[#D6E9F8]">
                <label className="text-[#203650] font-bold">3. Cep Telefonuna SMS ile Gönder</label>
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={sharePhone}
                  onChange={(e) => setSharePhone(e.target.value)}
                  className="w-full bg-[#F7FBFF] border border-[#D6E9F8] rounded-xl p-2.5 text-xs text-[#203650] placeholder:text-[#64748B] focus:outline-none focus:border-[#4A90E2]"
                />
                <button
                  onClick={() => handleSendShare("sms")}
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Cep Telefonuna SMS Gönder</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D6E9F8] flex justify-between items-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="text-[#203650] hover:text-[#4A90E2] text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7FBFF] border border-[#D6E9F8] cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Bağlantı Kopyalandı!" : "Linki Kopyala"}</span>
              </button>
              <button
                onClick={() => setShareModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#F7FBFF] hover:bg-[#E8F4FF] text-[#64748B] hover:text-[#203650] border border-[#D6E9F8] text-xs font-medium cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM PAGE MODAL */}
      {selectedPageModal && (
        <div className="fixed inset-0 z-50 bg-[#203650]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D6E9F8] rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D6E9F8]">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8F4FF] text-[#4A90E2] border border-[#D6E9F8] font-mono">
                  {selectedPageModal.schemaType || "WebPage"}
                </span>
                <h3 className="text-base font-bold text-[#203650] mt-1">{selectedPageModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPageModal(null)}
                className="w-8 h-8 rounded-lg bg-[#F7FBFF] border border-[#D6E9F8] text-[#64748B] hover:text-[#203650] hover:bg-[#E8F4FF] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-[#203650] text-sm leading-relaxed">
              {selectedPageModal.blocks?.map((block: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  {block.title && <h4 className="text-sm font-bold text-[#4A90E2]">{block.title}</h4>}
                  {block.type === "contact_form" ? (
                    <div className="p-4 bg-[#F7FBFF] border border-[#D6E9F8] rounded-xl space-y-3">
                      <p className="text-xs text-[#64748B]">{block.content}</p>
                      <div className="space-y-2">
                        <input type="text" placeholder="Adınız Soyadınız" className="w-full bg-white border border-[#D6E9F8] rounded-lg p-2.5 text-xs text-[#203650] placeholder:text-[#64748B]" />
                        <input type="email" placeholder="E-Posta Adresiniz (@meb.k12.tr)" className="w-full bg-white border border-[#D6E9F8] rounded-lg p-2.5 text-xs text-[#203650] placeholder:text-[#64748B]" />
                        <textarea placeholder="Mesajınız..." rows={4} className="w-full bg-white border border-[#D6E9F8] rounded-lg p-2.5 text-xs text-[#203650] placeholder:text-[#64748B]" />
                        <button
                          onClick={() => alert("Mesajınız Zümre Destek Masası'na başarıyla iletildi.")}
                          className="w-full py-2.5 bg-[#4A90E2] hover:bg-[#3b7bc7] text-white font-semibold text-xs rounded-lg cursor-pointer"
                        >
                          Destek Talebini Gönder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line text-xs md:text-sm text-[#203650] bg-[#F7FBFF] p-4 rounded-xl border border-[#D6E9F8]">
                      {block.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D6E9F8] flex justify-end">
              <button
                onClick={() => setSelectedPageModal(null)}
                className="px-5 py-2 rounded-xl bg-[#4A90E2] hover:bg-[#3b7bc7] text-white text-xs font-semibold cursor-pointer"
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

