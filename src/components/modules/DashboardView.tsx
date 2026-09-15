import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Users,
  Download,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Cpu,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  GraduationCap,
  CalendarDays,
  FileSpreadsheet,
  Activity,
  UploadCloud,
  FilePlus,
  PenTool,
  Send,
  BookOpen,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    documents,
    users,
    moderationItems,
    queueJobs,
    navigateToModule,
    analytics,
    contents,
    categories,
    addDocument,
    addContent,
    currentUser,
    mobileGridCols,
    globalSearchQuery,
    navbarFilterGrade,
    navbarFilterStatus,
    approveModerationItem,
    rejectModerationItem,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Hızlı Doküman Ekle Form State ---
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("cat_yazili");
  const [docLesson, setDocLesson] = useState("Matematik");
  const [docGrade, setDocGrade] = useState("9. Sınıf");
  const [docType, setDocType] = useState("Yazılı Sınavı");
  const [docExt, setDocExt] = useState<"docx" | "pdf" | "xlsx" | "pptx">("docx");
  const [docAccessLevel, setDocAccessLevel] = useState<"free" | "teacher_pro" | "vip">("free");
  const [docDescription, setDocDescription] = useState("");
  const [docTags, setDocTags] = useState("");
  const [docFileName, setDocFileName] = useState("");
  const [docSuccessMsg, setDocSuccessMsg] = useState<string | null>(null);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // --- Hızlı İçerik Oluştur Form State ---
  const [contentTitle, setContentTitle] = useState("");
  const [contentType, setContentType] = useState<"announcement" | "news" | "guide" | "article">("announcement");
  const [contentSummary, setContentSummary] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [contentTags, setContentTags] = useState("");
  const [contentSuccessMsg, setContentSuccessMsg] = useState<string | null>(null);
  const [isSubmittingContent, setIsSubmittingContent] = useState(false);
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState(false);

  const pendingModerationList = moderationItems.filter((m) => m.status === "pending");
  const activeDocs = documents.filter((d) => !d.isSoftDeleted);
  const activeJobs = queueJobs.filter((j) => j.status === "processing" || j.status === "waiting");
  const totalDownloads = activeDocs.reduce((acc, d) => acc + (d.downloadCount || 0), 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Quick Document Submit Handler
  const handleQuickAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    setIsSubmittingDoc(true);
    setTimeout(() => {
      const extension = docExt;
      const cleanFileName = docFileName || `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${extension}`;

      addDocument({
        title: docTitle,
        description: docDescription || `${docGrade} ${docLesson} ${docType} evrakı (MEB Müfredatı ile tam uyumlu)`,
        categoryId: docCategory,
        subCategoryIds: [],
        schoolType: "Devlet / Anadolu Lisesi",
        gradeLevel: docGrade,
        classNumber: docGrade,
        lesson: docLesson,
        branch: docLesson,
        subject: docTitle,
        term: "1. Dönem",
        docType: docType,
        year: "2025-2026",
        fileUrl: `https://storage.2evrak.com/docs/${cleanFileName}`,
        fileName: cleanFileName,
        fileType: extension,
        fileSizeBytes: 1540000,
        tags: docTags
          ? docTags.split(",").map((t) => t.trim().toLowerCase())
          : [docLesson.toLowerCase(), docGrade.toLowerCase(), docType.toLowerCase(), "meb"],
        source: "Öğretmen Yüklemesi",
        authorId: currentUser?.id || "u_admin",
        authorName: currentUser?.fullName || "Yönetici",
        accessLevel: docAccessLevel,
        status: "published",
        seo: {
          metaTitle: `${docTitle} - 2Evrak MEB Dokümanı`,
          metaDescription: (docDescription || docTitle).slice(0, 150),
          keywords: [docLesson.toLowerCase(), "meb", "evrak", "2evrak"],
        },
      });

      setIsSubmittingDoc(false);
      setDocSuccessMsg(`"${docTitle}" başarıyla sisteme eklendi ve MEB evrak havuzunda yayına alındı!`);
      setDocTitle("");
      setDocDescription("");
      setDocFileName("");
      setDocTags("");
      setTimeout(() => setDocSuccessMsg(null), 5000);
    }, 450);
  };

  // Quick Content Submit Handler
  const handleQuickCreateContent = (e: React.FormEvent, status: "published" | "draft") => {
    e.preventDefault();
    if (!contentTitle.trim()) return;

    setIsSubmittingContent(true);
    setTimeout(() => {
      const cleanSlug = contentTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

      addContent({
        title: contentTitle,
        slug: cleanSlug,
        type: contentType,
        category: contentType === "announcement" ? "Resmi Duyuru" : "Mevzuat ve Haber",
        summary:
          contentSummary ||
          `${contentTitle} konulu MEB duyurusu ve öğretmen bilgilendirme rehberi yayına alınmıştır.`,
        body:
          contentBody ||
          `### ${contentTitle}\n\nBu duyuru ve mevzuat açıklaması Millî Eğitim Bakanlığı resmi takvimine uygun olarak hazırlanmıştır.`,
        coverImageUrl:
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60",
        authorId: currentUser?.id || "u_admin",
        authorName: currentUser?.fullName || "2Evrak Editör Masası",
        tags: contentTags
          ? contentTags.split(",").map((t) => t.trim().toLowerCase())
          : ["meb", "duyuru", "öğretmen", "2evrak"],
        status: status,
        publishDate: new Date().toISOString().split("T")[0],
        seo: {
          metaTitle: `${contentTitle} - 2Evrak MEB Duyurusu`,
          metaDescription: (contentSummary || contentTitle).slice(0, 150),
          keywords: ["meb", "duyuru", "mevzuat", "öğretmen"],
        },
      });

      setIsSubmittingContent(false);
      setContentSuccessMsg(
        status === "published"
          ? `"${contentTitle}" başlıklı duyuru portala başarıyla yayınlandı!`
          : `"${contentTitle}" taslak olarak kaydedildi.`
      );
      setContentTitle("");
      setContentSummary("");
      setContentBody("");
      setContentTags("");
      setTimeout(() => setContentSuccessMsg(null), 5000);
    }, 450);
  };

  // AI Content Draft Generator
  const handleGenerateAiContentDraft = () => {
    if (!contentTitle.trim()) {
      alert("Lütfen önce bir içerik veya duyuru başlığı yazınız.");
      return;
    }

    setIsGeneratingAiDraft(true);
    setTimeout(() => {
      const sampleSummary = `Millî Eğitim Bakanlığı tarafından paylaşılan son duyuru kapsamında "${contentTitle}" hakkındaki tüm detaylar, uygulama esasları ve zümre takvimi netleşti.`;
      const sampleBody = `### ${contentTitle}\n\n**Tarih:** ${new Date().toLocaleDateString("tr-TR")} | **Kaynak:** Millî Eğitim Bakanlığı & 2Evrak Masası\n\n#### 1. Genel Bilgilendirme ve Amaç\nÖğretmenlerimizin ve zümre kurullarının çalışma süreçlerini kolaylaştırmak amacıyla hazırlanan bu metin, yasal yükümlülükleri ve uygulanacak yöntemleri özetlemektedir.\n\n#### 2. Uygulama Adımları\n- MEB Çalışma Takvimine ve TTKB haftalık ders saatlerine uyum esastır.\n- Ortak yazılı sınav senaryoları ÖDSGM ölçme standartlarına göre yürütülecektir.\n- Zümre kararlarında alınan maddeler dijital arşivde muhafaza edilecektir.\n\n#### 3. Hatırlatmalar\nEvrakların teslim ve onay süreçleri e-Müfredat ve MEBBİS sistemleri ile eşgüdümlü olarak tamamlanmalıdır.`;

      setContentSummary(sampleSummary);
      setContentBody(sampleBody);
      setIsGeneratingAiDraft(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. ANA İSTATİSTİK KUTULARI (4 EŞİT SİMETRİK KUTU)                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Kutu 1: DOKÜMAN HAVUZU */}
        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between group">
          <div className="p-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85">
                MEB Evrak Havuzu
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                13 Kademe Uyumlu
              </span>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight mt-1.5">
              {(activeDocs?.length ?? 2845).toLocaleString("tr-TR")}
            </div>
            <p className="text-xs font-semibold text-white/95 mt-0.5">Toplam MEB Doküman Sayısı</p>
            <div className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1.5">
              <span>Zümre</span>
              <span>•</span>
              <span>Yazılı</span>
              <span>•</span>
              <span>Yıllık Plan</span>
              <span>•</span>
              <span>BEP</span>
            </div>
          </div>
          <FileText className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none group-hover:scale-110 transition-transform" />
          <button
            type="button"
            onClick={() => navigateToModule("06_documents")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-xs py-1.5 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>Evrak Yönetimine Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kutu 2: KULLANICI & ÜYE HAVUZU */}
        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between group">
          <div className="p-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85">
                Kullanıcı & Üye Havuzu
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                MEBBİS Doğrulamalı
              </span>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight mt-1.5">
              {(analytics?.totalTeachers ?? 142500).toLocaleString("tr-TR")}
            </div>
            <p className="text-xs font-semibold text-white/95 mt-0.5">Kayıtlı Öğretmen / Üye Sayısı</p>
            <div className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1.5">
              <span>81 İl</span>
              <span>•</span>
              <span>14.820 MEB Okulu</span>
              <span>•</span>
              <span className="font-bold text-white">{users.length} Yetkili</span>
            </div>
          </div>
          <Users className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none group-hover:scale-110 transition-transform" />
          <button
            type="button"
            onClick={() => navigateToModule("02_users_roles")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-xs py-1.5 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>Kullanıcı Yönetimine Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kutu 3: İÇERİK & DUYURU */}
        <div className="bg-[#6f42c1] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between group">
          <div className="p-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85">
                Portal İçerikleri
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                SEO & Duyuru
              </span>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight mt-1.5">
              {(contents?.length ?? 18).toLocaleString("tr-TR")}
            </div>
            <p className="text-xs font-semibold text-white/95 mt-0.5">Yayınlanan İçerik & Duyuru</p>
            <div className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1.5">
              <span>Mevzuat</span>
              <span>•</span>
              <span>Sınav Kılavuzu</span>
              <span>•</span>
              <span>Rehberler</span>
            </div>
          </div>
          <BookOpen className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none group-hover:scale-110 transition-transform" />
          <button
            type="button"
            onClick={() => navigateToModule("07_contents")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-xs py-1.5 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>İçerik Portalı Yönetimine Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kutu 4: TOPLAM İNDİRME SAYISI */}
        <div className="bg-[#fd7e14] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between group">
          <div className="p-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85">
                Kullanım Hacmi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                Canlı İndirmeler
              </span>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight mt-1.5">
              {(totalDownloads || 19420).toLocaleString("tr-TR")}
            </div>
            <p className="text-xs font-semibold text-white/95 mt-0.5">Toplam Evrak İndirme Sayısı</p>
            <div className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1.5">
              <span>%99.98 Uptime</span>
              <span>•</span>
              <span>Yüksek Hızlı Dağıtım</span>
            </div>
          </div>
          <Download className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none group-hover:scale-110 transition-transform" />
          <button
            type="button"
            onClick={() => navigateToModule("06_documents", "Analitik")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-xs py-1.5 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>İndirme Analitiğini Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SİMETRİK 2-KUTU EYLEM MERKEZİ (HIZLI EVRAK & HIZLI DUYURU)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Sol Kutu: Hızlı Doküman Ekle */}
        <div className="card card-primary card-outline bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden flex flex-col h-full">
          <div className="card-header border-b border-[#dee2e6] p-3.5 flex items-center justify-between bg-[#f8f9fa]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#e8f4ff] text-[#007bff] flex items-center justify-center font-bold">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title text-xs font-bold text-[#212529] tracking-tight uppercase">
                  Hızlı Doküman Ekle (MEB Evrak Havuzu)
                </h3>
                <p className="text-[11px] text-[#6c757d]">
                  Sınav soruları, zümreler, yıllık planlar veya BEP formlarını tek tıkla yükleyin.
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#e8f4ff] text-[#007bff] border border-[#007bff]/30">
              Tek Tıkla Kaydet
            </span>
          </div>

          {docSuccessMsg && (
            <div className="m-3 p-2.5 rounded bg-[#eaf7ed] border border-[#28a745]/40 text-[#1e7e34] text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#28a745] shrink-0" />
                <span className="font-semibold">{docSuccessMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleQuickAddDocument} className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div>
                <label className="text-xs font-bold text-[#343a40] block mb-1">
                  Doküman Başlığı <span className="text-[#dc3545]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Örn: 9. Sınıf Matematik 1. Dönem 1. Ortak Yazılı Sınavı"
                  className="w-full px-3 py-1.5 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff] bg-white text-[#212529]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Kategori</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Ders / Branş</label>
                  <select
                    value={docLesson}
                    onChange={(e) => setDocLesson(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
                    <option value="Matematik">Matematik</option>
                    <option value="Türkçe">Türkçe / Edebiyat</option>
                    <option value="Fizik">Fizik</option>
                    <option value="Kimya">Kimya</option>
                    <option value="Biyoloji">Biyoloji</option>
                    <option value="Tarih">Tarih</option>
                    <option value="Coğrafya">Coğrafya</option>
                    <option value="İngilizce">İngilizce</option>
                    <option value="Din Kültürü">Din Kültürü</option>
                    <option value="Bilişim">Bilişim</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Kademe / Sınıf</label>
                  <select
                    value={docGrade}
                    onChange={(e) => setDocGrade(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
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

                <div>
                  <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Evrak Türü</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
                    <option value="Yazılı Sınavı">Yazılı Sınavı</option>
                    <option value="Zümre Kararı">Zümre Kararı</option>
                    <option value="Yıllık Plan">Yıllık Plan</option>
                    <option value="BEP Planı">BEP Planı</option>
                    <option value="Dilekçe">Dilekçe</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Format</label>
                  <select
                    value={docExt}
                    onChange={(e) => setDocExt(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
                    <option value="docx">Word (.DOCX)</option>
                    <option value="pdf">PDF (.PDF)</option>
                    <option value="xlsx">Excel (.XLSX)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Erişim İzni</label>
                  <select
                    value={docAccessLevel}
                    onChange={(e) => setDocAccessLevel(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
                    <option value="free">Ücretsiz / Açık</option>
                    <option value="teacher_pro">Öğretmen Pro</option>
                    <option value="vip">Zümre VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">
                  Evrak Dosyası & Açıklama
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={docFileName}
                    onChange={(e) => setDocFileName(e.target.value)}
                    placeholder="Dosya adı veya seçimi..."
                    className="flex-1 px-3 py-1.5 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff] bg-white text-[#212529]"
                  />
                  <label className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold text-[#495057] flex items-center gap-1 cursor-pointer shrink-0">
                    <UploadCloud className="w-3.5 h-3.5 text-[#007bff]" />
                    <span>Seç</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocFileName(file.name);
                          if (!docTitle) setDocTitle(file.name.replace(/\.[^/.]+$/, ""));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#dee2e6] flex items-center justify-between">
              <span className="text-[11px] text-[#6c757d]">MEB Müfredatı ile tam uyumlu</span>
              <button
                type="submit"
                disabled={isSubmittingDoc || !docTitle.trim()}
                className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] disabled:bg-[#6c757d] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSubmittingDoc ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Dokümanı Kaydet & Yayınla</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Kutu: Hızlı İçerik & Duyuru Oluştur */}
        <div className="card card-purple card-outline bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden flex flex-col h-full">
          <div className="card-header border-b border-[#dee2e6] p-3.5 flex items-center justify-between bg-[#f8f9fa]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#f3eefb] text-[#6f42c1] flex items-center justify-center font-bold">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title text-xs font-bold text-[#212529] tracking-tight uppercase">
                  Hızlı İçerik & Duyuru (Web + Mobil Portal)
                </h3>
                <p className="text-[11px] text-[#6c757d]">
                  Öğretmenler için MEB duyurusu, rehber veya mevzuat bülteni hazırlayın.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiContentDraft}
              disabled={isGeneratingAiDraft}
              className="px-2.5 py-1 rounded bg-[#f3eefb] hover:bg-[#e6d8f8] text-[#6f42c1] border border-[#6f42c1]/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Yapay zeka ile anında taslak oluştur"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiDraft ? "animate-spin" : ""}`} />
              <span>{isGeneratingAiDraft ? "Yazılıyor..." : "AI Taslak"}</span>
            </button>
          </div>

          {contentSuccessMsg && (
            <div className="m-3 p-2.5 rounded bg-[#eaf7ed] border border-[#28a745]/40 text-[#1e7e34] text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#28a745] shrink-0" />
                <span className="font-semibold">{contentSuccessMsg}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => handleQuickCreateContent(e, "published")}
            className="p-3.5 space-y-3 flex-1 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#343a40] block mb-1">
                    Duyuru Başlığı <span className="text-[#dc3545]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="Örn: 2025-2026 2. Dönem Ortak Sınav Takvimi"
                    className="w-full px-3 py-1.5 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#6f42c1] bg-white text-[#212529]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#343a40] block mb-1">Kategori</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#212529]"
                  >
                    <option value="announcement">Resmi Duyuru</option>
                    <option value="news">Mevzuat Haberi</option>
                    <option value="guide">Öğretmen Rehberi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">Kısa Özet / Spot</label>
                <input
                  type="text"
                  value={contentSummary}
                  onChange={(e) => setContentSummary(e.target.value)}
                  placeholder="Kısa spot metni..."
                  className="w-full px-3 py-1.5 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#6f42c1] bg-white text-[#212529]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#343a40] block mb-0.5">
                  Detaylı İçerik Metni (Markdown) <span className="text-[#dc3545]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Duyuru detaylarını ve resmi maddeleri yazınız..."
                  className="w-full px-3 py-1.5 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#6f42c1] bg-white text-[#212529] resize-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#dee2e6] flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleQuickCreateContent(e, "draft")}
                disabled={isSubmittingContent || !contentTitle.trim()}
                className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold text-[#495057] transition-colors cursor-pointer"
              >
                Taslak Kaydet
              </button>
              <button
                type="submit"
                disabled={isSubmittingContent || !contentTitle.trim()}
                className="px-4 py-1.5 rounded bg-[#6f42c1] hover:bg-[#5a32a3] disabled:bg-[#6c757d] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSubmittingContent ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Yayınlanıyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>İçeriği Yayınla</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SİMETRİK 8-KUTU TEMEL ARAÇLAR VE HIZLI GEÇİŞ IZGARASI                    */}
      {/* ========================================================================= */}
      <div className="card card-primary card-outline bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        <div className="card-header border-b border-[#dee2e6] p-3 flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#007bff]" />
            <h3 className="card-title text-xs font-bold text-[#343a40] uppercase tracking-wider">
              Temel Modüller & Hızlı İşlem Kutuları
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#007bff]/10 text-[#007bff] font-mono font-bold">
            8 Temel Araç
          </span>
        </div>

        <div className="p-3.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            {
              title: "Yazılı Soruları",
              sub: "ÖDSGM Senaryo",
              icon: FileSpreadsheet,
              color: "bg-[#e8f4ff] text-[#007bff]",
              hoverBorder: "hover:border-[#007bff]",
              action: () => navigateToModule("06_documents", "Yazılı & Ortak Sınav Soruları"),
            },
            {
              title: "Zümre Tutanak",
              sub: "Gündem & Karar",
              icon: Users,
              color: "bg-[#e1f5f8] text-[#17a2b8]",
              hoverBorder: "hover:border-[#17a2b8]",
              action: () => navigateToModule("06_documents", "Zümre Toplantı Tutanakları"),
            },
            {
              title: "Yıllık Planlar",
              sub: "36 Hafta Çerçeve",
              icon: CalendarDays,
              color: "bg-[#eaf7ed] text-[#28a745]",
              hoverBorder: "hover:border-[#28a745]",
              action: () => navigateToModule("06_documents", "Yıllık Planlar & Çerçeve"),
            },
            {
              title: "Dilekçematik",
              sub: "40+ Hazır Şablon",
              icon: FileText,
              color: "bg-[#f3eefb] text-[#6f42c1]",
              hoverBorder: "hover:border-[#6f42c1]",
              action: () => navigateToModule("25_dilekcematik", "Özlük & Mazeret İzinleri"),
            },
            {
              title: "MEB Takvimi",
              sub: "Tatil & Dönemler",
              icon: Clock,
              color: "bg-[#fff3e6] text-[#fd7e14]",
              hoverBorder: "hover:border-[#fd7e14]",
              action: () => navigateToModule("23_curriculum_calendar", "MEB Çalışma Takvimi"),
            },
            {
              title: "BEP Formları",
              sub: "Özel Eğitim",
              icon: GraduationCap,
              color: "bg-[#fff8e1] text-[#b78103]",
              hoverBorder: "hover:border-[#ffc107]",
              action: () => navigateToModule("06_documents", "BEP Gelişim Evrakları"),
            },
            {
              title: "Maarif Modeli",
              sub: "Yeni Müfredat",
              icon: BookOpen,
              color: "bg-[#e8eaf6] text-[#3949ab]",
              hoverBorder: "hover:border-[#3949ab]",
              action: () => navigateToModule("23_curriculum_calendar", "Müfredat & Ders Dağılımı"),
            },
            {
              title: "Menü & Kategori",
              sub: "İsim Düzenleyici",
              icon: Sliders,
              color: "bg-[#e8f5e9] text-[#2e7d32]",
              hoverBorder: "hover:border-[#2e7d32]",
              action: () => navigateToModule("12_menus", "Menü & Kategori Yönetimi"),
            },
          ].map((tool, idx) => (
            <button
              key={idx}
              type="button"
              onClick={tool.action}
              className={`p-2.5 rounded border border-[#dee2e6] bg-[#f8f9fa] hover:bg-white ${tool.hoverBorder} hover:shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer`}
            >
              <div
                className={`w-8 h-8 rounded ${tool.color} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform`}
              >
                <tool.icon className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#212529] truncate w-full">{tool.title}</div>
              <div className="text-[10px] text-[#6c757d] truncate w-full">{tool.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SİMETRİK 2-KOLON OPERASYON VE TABLO IZGARASI (EŞİT 50% - 50%)            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Sol Kolon: Son Eklenen MEB Dokümanları Tablosu */}
        <div className="card card-primary card-outline bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden flex flex-col h-full">
          <div className="card-header border-b border-[#dee2e6] p-3 flex items-center justify-between bg-[#f8f9fa]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#007bff]" />
              <h3 className="card-title text-xs font-bold text-[#343a40] uppercase tracking-wider">
                Son Eklenen MEB Dokümanları
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateToModule("06_documents")}
              className="text-xs text-[#007bff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Tümünü Gör ({activeDocs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left text-[#495057]">
              <thead className="bg-[#f4f6f9] text-[#495057] uppercase tracking-wider text-[10px] border-b border-[#dee2e6]">
                <tr>
                  <th className="py-2 px-3 font-semibold">Evrak Başlığı</th>
                  <th className="py-2 px-3 font-semibold">Ders</th>
                  <th className="py-2 px-3 font-semibold">Kademe</th>
                  <th className="py-2 px-3 font-semibold">İndirme</th>
                  <th className="py-2 px-3 font-semibold">Durum</th>
                  <th className="py-2 px-3 font-semibold text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6]">
                {activeDocs
                  .filter((doc) => {
                    if (globalSearchQuery.trim()) {
                      const q = globalSearchQuery.toLowerCase();
                      const match =
                        doc.title.toLowerCase().includes(q) ||
                        doc.lesson.toLowerCase().includes(q) ||
                        doc.gradeLevel.toLowerCase().includes(q);
                      if (!match) return false;
                    }
                    if (navbarFilterGrade !== "all") {
                      if (!doc.gradeLevel.toLowerCase().includes(navbarFilterGrade.toLowerCase()))
                        return false;
                    }
                    if (navbarFilterStatus !== "all") {
                      if (navbarFilterStatus === "active" && doc.status !== "published") return false;
                      if (navbarFilterStatus === "pending" && doc.status !== "pending") return false;
                    }
                    return true;
                  })
                  .slice(0, 6)
                  .map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="py-2 px-3 font-semibold text-[#212529]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-[#e8f4ff] text-[#007bff] font-bold text-[9px] flex items-center justify-center shrink-0 font-mono">
                            {(doc.fileType || "DOC").toUpperCase()}
                          </span>
                          <span className="truncate max-w-[170px]" title={doc.title}>
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 truncate max-w-[90px]">{doc.lesson}</td>
                      <td className="py-2 px-3 truncate max-w-[90px]">{doc.gradeLevel}</td>
                      <td className="py-2 px-3 font-mono font-bold">
                        {(doc.downloadCount || 0).toLocaleString("tr-TR")}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            doc.status === "published"
                              ? "bg-[#28a745] text-white"
                              : "bg-[#ffc107] text-[#1f2d3d]"
                          }`}
                        >
                          {doc.status === "published" ? "Yayında" : "İnceleniyor"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigateToModule("06_documents")}
                          className="px-2 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[11px] text-[#007bff] font-semibold cursor-pointer"
                        >
                          İncele
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ Kolon: Sistem Sağlığı & Hızlı Moderasyon Masası */}
        <div className="card card-warning card-outline bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden flex flex-col h-full">
          <div className="card-header border-b border-[#dee2e6] p-3 flex items-center justify-between bg-[#f8f9fa]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffc107]" />
              <h3 className="card-title text-xs font-bold text-[#343a40] uppercase tracking-wider">
                Hızlı Moderasyon & Sistem Sağlığı
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffc107]/20 text-[#856404] font-mono font-bold">
              {pendingModerationList.length} Bekleyen İnceleme
            </span>
          </div>

          <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
            {/* Bekleyen Moderasyon Listesi */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#495057] uppercase tracking-wider">
                Onay Bekleyen Evraklar & Başvurular:
              </div>

              {pendingModerationList.length === 0 ? (
                <div className="p-3 rounded bg-[#f8f9fa] border border-[#dee2e6] text-center text-xs text-[#6c757d]">
                  <CheckCircle2 className="w-5 h-5 text-[#28a745] mx-auto mb-1" />
                  <span>Şu an bekleyen onay veya moderasyon görevi bulunmamaktadır.</span>
                </div>
              ) : (
                pendingModerationList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#212529] truncate">{item.title}</div>
                      <div className="text-[10px] text-[#6c757d] truncate">
                        {item.authorName} • {item.itemType}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => approveModerationItem(item.id)}
                        className="px-2 py-1 rounded bg-[#28a745] hover:bg-[#218838] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Hemen Onayla"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Onayla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectModerationItem(item.id, "Kural uyumsuzluğu")}
                        className="p-1 rounded bg-[#dc3545] hover:bg-[#c82333] text-white text-[11px] cursor-pointer transition-colors"
                        title="Reddet"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sistem Worker ve Kuyruk Durumu */}
            <div className="pt-2 border-t border-[#dee2e6] space-y-2">
              <div className="text-[11px] font-bold text-[#495057] uppercase tracking-wider flex items-center justify-between">
                <span>Arka Plan Motorları:</span>
                <span className="text-[#28a745] font-mono">%100 Aktif</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                  <div className="text-[10px] text-[#6c757d]">PDF OCR & Metin Çıkarıcı</div>
                  <div className="font-bold text-[#212529] mt-0.5">2 Worker Hazır</div>
                </div>
                <div className="p-2 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                  <div className="text-[10px] text-[#6c757d]">BullMQ Görev Kuyruğu</div>
                  <div className="font-bold text-[#212529] mt-0.5">{activeJobs.length} Aktif Görev</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigateToModule("16_moderation")}
                  className="flex-1 py-1.5 rounded bg-[#ffc107] hover:bg-[#e0a800] text-[#212529] text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Moderasyon Merkezine Git
                </button>
                <button
                  type="button"
                  onClick={() => navigateToModule("22_queue_workers")}
                  className="flex-1 py-1.5 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Worker Konsolunu Aç
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
