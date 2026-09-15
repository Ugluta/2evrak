import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  GraduationCap,
  Download,
  UploadCloud,
  FileText,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Settings,
  LogOut,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BadgeCheck,
  UserCheck,
  Award,
  Archive,
  Printer,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Zap,
  Bot,
  Play,
  Copy,
  RefreshCw,
  X,
  Send,
  CalendarDays,
  BookMarked,
} from "lucide-react";
import { DocumentItem, MebSchoolType } from "../../types";
import { MEB_SCHOOL_TYPES } from "../../data/curriculumData";

interface TeacherPortalViewProps {
  onGoToAdminPanel: () => void;
  onGoToPublicPortal: () => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  onGoToAdminPanel,
  onGoToPublicPortal,
}) => {
  const {
    currentUser,
    currentRole,
    documents,
    packages,
    systemSettings,
    setActiveModuleId,
    verifyTeacherProfile,
    runAgent,
    addDocument,
    academicCalendar,
    gradeCurriculums,
    updateUser,
  } = useApp();
  const [activeTab, setActiveTab] = useState<"downloads" | "uploads" | "ai_tools" | "subscription" | "profile">("downloads");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [tcInput, setTcInput] = useState("");
  const [mebbisInput, setMebbisInput] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [activeExportNotification, setActiveExportNotification] = useState<string | null>(null);

  // Profile & Duties State
  const [profileFullName, setProfileFullName] = useState(currentUser.fullName);
  const [profileSchoolName, setProfileSchoolName] = useState(currentUser.schoolName || "Ankara Atatürk Anadolu Lisesi");
  const [profileBranch, setProfileBranch] = useState(currentUser.branch);
  const [profileClub, setProfileClub] = useState(currentUser.clubActivity || "Bilişim ve Yazılım Kulübü");
  const [profileGuidance, setProfileGuidance] = useState(currentUser.guidanceDuty || "9-A Sınıfı Rehber Öğretmeni");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Document A4 Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [previewCategory, setPreviewCategory] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      fullName: profileFullName,
      schoolName: profileSchoolName,
      branch: profileBranch,
      clubActivity: profileClub,
      guidanceDuty: profileGuidance,
    });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleOpenA4Preview = (title: string, content: string, category: string) => {
    setPreviewTitle(title);
    setPreviewContent(content);
    setPreviewCategory(category);
    setIsPreviewModalOpen(true);
  };

  // Portal Direct AI Studio State & MEB Curriculum Engine
  const [selectedAgentKey, setSelectedAgentKey] = useState<string>("dokuman_ajani");
  const [selectedTeacherSchoolType, setSelectedTeacherSchoolType] = useState<MebSchoolType | "all">("all");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("9");
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(4);

  const filteredGradesForTeacher = selectedTeacherSchoolType === "all"
    ? gradeCurriculums
    : gradeCurriculums.filter((g) => !g.applicableSchoolTypes || g.applicableSchoolTypes.includes(selectedTeacherSchoolType as MebSchoolType));
  const [promptText, setPromptText] = useState<string>(
    "9. Sınıf Matematik 2. Dönem 1. Zümre Öğretmenler Kurulu Karar Tutanağı hazırla. Gündem maddeleri: Ortak yazılı sınav analizi, BEP planı öğrencileri ve proje görevleri olsun."
  );
  const [isAiRunning, setIsAiRunning] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [aiDocSaveSuccess, setAiDocSaveSuccess] = useState<boolean>(false);

  const userPackage = packages.find((p) => p.id === currentUser.packageId) || packages[0];
  const myUploadedDocs = documents.filter((d) => d.authorId === currentUser.id || d.authorName === currentUser.fullName);
  const isStaff = currentRole.slug === "super_admin" || currentRole.slug === "editor_in_chief" || currentRole.slug === "moderator";

  const isVerified = currentUser.verificationStatus === "verified" || currentUser.verifiedTeacher;
  const canCleanExport = userPackage.limits.cleanHeaderlessExport || isVerified;
  const canZipDownload = userPackage.limits.directZipDownload || isVerified;

  const handleOpenVerifyModal = () => {
    setTcInput("");
    setMebbisInput(currentUser.mebbisNo || "");
    setVerifyError("");
    setVerifySuccess(false);
    setIsVerifyModalOpen(true);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedTc = tcInput.replace(/\D/g, "");
    if (cleanedTc.length !== 11) {
      setVerifyError("T.C. Kimlik Numarası 11 haneli olmalıdır.");
      return;
    }
    if (!mebbisInput.trim()) {
      setVerifyError("MEBBİS numaranızı / kurum kodunuzu giriniz.");
      return;
    }

    const ok = verifyTeacherProfile(currentUser.id, cleanedTc, mebbisInput.trim());
    if (ok) {
      setVerifySuccess(true);
      setTimeout(() => {
        setIsVerifyModalOpen(false);
        setVerifySuccess(false);
      }, 1500);
    } else {
      setVerifyError("Doğrulama gerçekleştirilemedi. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  const handleDownloadDocument = (doc: DocumentItem, mode: "standard" | "clean_headerless") => {
    if (mode === "clean_headerless" && !canCleanExport) {
      handleOpenVerifyModal();
      return;
    }

    const modeText = mode === "clean_headerless"
      ? `"${doc.title}" evrakı MEB logosuz, filigransız ve BAŞLIKSIZ (Temiz Çıktı Modunda) Word/PDF formatında hazırlandı.`
      : `"${doc.title}" standart formatta indirildi.`;

    setActiveExportNotification(modeText);
    setTimeout(() => setActiveExportNotification(null), 4000);
  };

  const handleTeacherRunAi = async () => {
    if (!promptText.trim() || isAiRunning) return;
    setIsAiRunning(true);
    setAiDocSaveSuccess(false);

    const activeGradeObj = gradeCurriculums.find((g) => g.gradeLevelId === selectedGradeId);
    const activeWeekObj = academicCalendar.weeks.find((w) => w.weekNumber === selectedWeekNumber);

    try {
      const result = await runAgent(selectedAgentKey, promptText, {
        branch: currentUser.branch,
        schoolType: selectedTeacherSchoolType === "all" ? currentUser.schoolType : selectedTeacherSchoolType,
        gradeLevelId: selectedGradeId,
        gradeName: activeGradeObj?.gradeName || `${selectedGradeId}. Sınıf`,
        weekNumber: selectedWeekNumber,
        weekDateRange: activeWeekObj ? `${activeWeekObj.startDate} - ${activeWeekObj.endDate}` : "",
        weekTheme: activeWeekObj?.themeOrMilestone || "Standart Müfredat Haftası",
        academicYear: academicCalendar.academicYear,
        lessonsAvailable: activeGradeObj?.lessons.map((l) => ({
          name: l.lessonName,
          textbook: l.textbookName,
          version: l.curriculumVersion,
          isUpdated: l.isUpdatedThisYear,
        })),
      });
      setAiOutput(result);
    } catch (err: any) {
      setAiOutput("Hata oluştu: " + err.message);
    } finally {
      setIsAiRunning(false);
    }
  };

  const handleCopyAiOutput = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAiToMyDocs = () => {
    if (!aiOutput) return;

    addDocument({
      title: `MEB ${currentUser.branch} AI Plan & Evrakı`,
      slug: `ogretmen-ai-${Date.now()}`,
      description: promptText.slice(0, 150),
      categoryId: "cat_zumre",
      docType: "Zümre Kararı",
      gradeLevel: "Tüm Kademeler",
      lesson: currentUser.branch || "Genel",
      fileUrl: "https://storage.2evrak.com/ai/meb_ogretmen_evraki.docx",
      fileSize: "320 KB",
      fileExtension: "docx",
      status: "pending", // Kural 18: MEB Moderasyon onay havuzuna gider!
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      accessLevel: "free",
      tags: ["yapay-zeka", "meb", currentUser.branch.toLowerCase()],
      seoTitle: `${currentUser.branch} Evrakı - 2Evrak`,
      seoDescription: promptText.slice(0, 140),
    });

    setAiDocSaveSuccess(true);
    setTimeout(() => setAiDocSaveSuccess(false), 3500);
  };

  const handleBulkZipDownload = () => {
    if (!canZipDownload) {
      handleOpenVerifyModal();
      return;
    }

    setActiveExportNotification(`Tüm branş evrakları ve zümre planları tek bir ZIP paketi olarak derlenip indirilmeye başlandı.`);
    setTimeout(() => setActiveExportNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F7FBFF] text-[#203650] flex flex-col font-sans">
      {/* 1. TEACHER HEADER */}
      <header className="h-16 bg-white border-b border-[#D6E9F8] px-4 md:px-8 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* LOGO WITH EMBEDDED LINK */}
          <button
            onClick={onGoToPublicPortal}
            className="flex items-center gap-3 group text-left transition-transform active:scale-95"
            title="2Evrak Ana Sayfasına Git"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4A90E2] flex items-center justify-center font-extrabold text-white text-lg shadow-md shadow-[#4A90E2]/20 group-hover:scale-105 transition-all">
              2E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#203650] group-hover:text-[#4A90E2] transition-colors">
                  {systemSettings.general.siteName || "2Evrak"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Öğretmen Portalı
                </span>
              </div>
            </div>
          </button>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ana Sayfaya Git Butonu */}
            <button
              onClick={onGoToPublicPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F4FF] hover:bg-[#D6E9F8] text-xs font-semibold text-[#203650] border border-[#D6E9F8] transition-colors"
              title="Ziyaretçi Ana Sayfası"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#4A90E2]" />
              <span className="hidden sm:inline">Ana Sayfaya Git</span>
            </button>

            {/* Yönetim Paneline Git Butonu (Yetkililer için) */}
            {isStaff && (
              <button
                onClick={onGoToAdminPanel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A90E2] hover:bg-[#357abd] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Yönetim Paneli</span>
              </button>
            )}

            {/* Profile pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#D6E9F8]">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-emerald-400"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#203650] leading-none">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">
                  {currentUser.branch}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. TEACHER HERO & QUOTA STATS */}
      <section className="bg-[#E8F4FF]/70 border-b border-[#D6E9F8] py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#203650] flex items-center gap-2">
                <span>Hoş Geldiniz, {currentUser.fullName}</span>
                {isVerified ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>MEB Onaylı Öğretmen</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {userPackage.name}
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>{currentUser.schoolType}</span>
                <span>•</span>
                <span>{currentUser.city}</span>
                <span>•</span>
                <span>Branş: {currentUser.branch}</span>
                {currentUser.mebbisNo && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-indigo-300">MEBBİS: {currentUser.mebbisNo}</span>
                  </>
                )}
                {currentUser.tcNo && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-400">T.C.: {currentUser.tcNo}</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {!isVerified && (
                <button
                  onClick={handleOpenVerifyModal}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>T.C. & MEBBİS Doğrula</span>
                </button>
              )}

              <button
                onClick={() => {
                  onGoToAdminPanel();
                  setActiveModuleId("06_documents");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Yeni Evrak Yükle</span>
              </button>
            </div>
          </div>

          {/* MEBBİS DOĞRULAMA ÇAĞRI VEYA AYRICALIK BİLGİ BANDI */}
          {!isVerified ? (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold">Öğretmen Hesabınız Henüz MEBBİS İle Doğrulanmadı!</span>
                  <p className="text-[11px] text-amber-300/80">
                    T.C. ve MEBBİS numaranız ile doğrulanarak <strong>başlıksız filigransız temiz çıktı alma</strong> ve <strong>toplu ZIP indirme</strong> ayrıcalığını anında ücretsiz aktif edebilirsiniz.
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenVerifyModal}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] whitespace-nowrap shadow transition-all self-start sm:self-auto"
              >
                Hemen Doğrula
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">
                  <strong>MEBBİS Doğrulandı:</strong> Başlıksız temiz çıktı alma ve zümre toplu ZIP indirme haklarınız sınırsız olarak etkindir.
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                AKTİF AYRICALIK
              </span>
            </div>
          )}

          {/* KULLANICI KOTA VE İSTATİSTİK KARTLARI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                İndirilen Evraklar
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {currentUser.documentsDownloaded} <span className="text-xs text-slate-500 font-normal">adet</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                Kalan Günlük Hak: 48 / 50
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Kredisi
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {currentUser.aiCreditsUsed} / {userPackage.limits.aiCreditsPerMonth}
              </div>
              <div className="text-[10px] text-cyan-400 mt-0.5">
                Soru & Plan Üretim Kredisi
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Yüklediğim Evraklar
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {myUploadedDocs.length} <span className="text-xs text-slate-500 font-normal">dosya</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Tüm zümre ile paylaşıldı
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Paket & Başlıksız Çıktı
              </div>
              <div className="text-sm font-bold text-amber-400 mt-1 flex items-center gap-1">
                <span>{userPackage.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Başlıksız Çıktı: {canCleanExport ? "Açık" : "Doğrulama Gerektirir"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABS */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("downloads")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "downloads"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Download className="w-4 h-4" />
            İndirdiğim & Kaydettiğim Evraklar
          </button>
          <button
            onClick={() => setActiveTab("uploads")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "uploads"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Yüklediğim Dokümanlar
          </button>
          <button
            onClick={() => setActiveTab("ai_tools")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "ai_tools"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Öğretmen AI Asistanım
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "subscription"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Award className="w-4 h-4" />
            Üyelik & İndirme Hakları
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            Öğretmen Profil & Görevler
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-1 space-y-6">
        {/* AKTİF BİLDİRİM / TOAST */}
        {activeExportNotification && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activeExportNotification}</span>
          </div>
        )}

        {activeTab === "downloads" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Evrak İndirme & Çıktı Merkezi</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    {canCleanExport ? "Başlıksız Çıktı Aktif" : "Standart Çıktı"}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  MEB doğrulanmış öğretmenler tüm evrakları başlıksız, filigransız veya toplu ZIP olarak alabilir.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkZipDownload}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    canZipDownload
                      ? "bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/40 shadow"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                  title={canZipDownload ? "Tüm Branş Evraklarını ZIP Olarak İndir" : "Doğrulanmış Öğretmen Ayrıcalığı"}
                >
                  <Archive className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{canZipDownload ? "Tümünü ZIP İndir" : "Toplu ZIP (MEB Doğrulama Gerekir)"}</span>
                </button>

                <button
                  onClick={onGoToPublicPortal}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  Havuzda Ara &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(documents || []).slice(0, 6).map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {doc.gradeLevel}
                      </span>
                      <span className="text-[10px] text-slate-500">{doc.lesson}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-2">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Tür: {(doc.fileExtension || "pdf").toUpperCase()}</span>
                      <span>•</span>
                      <span>Boyut: {doc.fileSize || "1.2 MB"}</span>
                      <span>•</span>
                      <span>{doc.downloadCount} indirme</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDownloadDocument(doc, "standard")}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        title="Standart antetli/başlıklı formatta indir"
                      >
                        <Download className="w-3 h-3 text-slate-400" />
                        <span>İndir</span>
                      </button>

                      <button
                        onClick={() => handleDownloadDocument(doc, "clean_headerless")}
                        className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          canCleanExport
                            ? "bg-indigo-600/20 hover:bg-indigo-600 text-indigo-200 hover:text-white border-indigo-500/30"
                            : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-amber-500/40 hover:text-amber-300"
                        }`}
                        title={canCleanExport ? "Filigransız & Başlıksız Temiz Çıktı" : "Yalnızca MEBBİS Doğrulanmış Öğretmenler"}
                      >
                        <Printer className="w-3 h-3 text-indigo-400" />
                        <span>{canCleanExport ? "Başlıksız Çıktı" : "Başlıksız (Kilitli)"}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenA4Preview(doc.title, doc.description || "Resmi MEB Zümre ve Ders Planı Doküman İçeriği. Bu evrak T.C. Millî Eğitim Bakanlığı talim ve terbiye kurulu standartlarına uygun olarak öğretmen portalında hazırlanmıştır.", doc.categoryName || "Zümre Kararı")}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/50 transition-all"
                      title="Sayfa Düzeninde Ön İzle (A4)"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Sayfa Düzeninde Ön İzle (A4)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SUBSCRIPTION & VERIFICATION OVERVIEW */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Mevcut Planınız: {userPackage.name}</h2>
                  {isVerified && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      MEB ONAYLI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {userPackage.description}
                </p>
                {currentUser.mebbisNo && (
                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    Kayıtlı MEBBİS No: <span className="text-indigo-300">{currentUser.mebbisNo}</span> • T.C.: <span className="text-slate-300">{currentUser.tcNo || "12******89"}</span>
                  </div>
                )}
              </div>

              {!isVerified ? (
                <button
                  onClick={handleOpenVerifyModal}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start md:self-auto"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>T.C. & MEBBİS İle Ücretsiz Yükselt</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Doğrulanmış Profil Aktif</span>
                </div>
              )}
            </div>

            {/* PAKET KARŞILAŞTIRMA LİSTESİ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {packages.map((pkg) => {
                const isCurrent = pkg.id === userPackage.id;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{pkg.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>

                      <div className="text-lg font-black text-white">
                        {pkg.price === 0 ? "Ücretsiz" : `${pkg.price} ₺`}
                        <span className="text-xs font-normal text-slate-400">/{pkg.billingPeriod}</span>
                      </div>

                      <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>Günlük {pkg.limits.downloadPerDay} evrak indirme</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{pkg.limits.aiCreditsPerMonth} AI asistan kredisi</span>
                        </li>
                        <li className="flex items-center gap-2">
                          {pkg.limits.cleanHeaderlessExport ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="text-slate-600 text-xs font-bold">✕</span>
                          )}
                          <span className={pkg.limits.cleanHeaderlessExport ? "text-emerald-300 font-semibold" : "text-slate-500 line-through"}>
                            Başlıksız Temiz Çıktı
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {pkg.limits.directZipDownload ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="text-slate-600 text-xs font-bold">✕</span>
                          )}
                          <span className={pkg.limits.directZipDownload ? "text-emerald-300 font-semibold" : "text-slate-500 line-through"}>
                            Toplu ZIP İndirme
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80">
                      {isCurrent ? (
                        <div className="text-center text-xs font-bold text-indigo-400 py-1.5 bg-indigo-500/10 rounded-lg">
                          Kullanılan Paket
                        </div>
                      ) : pkg.id === "pkg_meb_verified" ? (
                        <button
                          onClick={handleOpenVerifyModal}
                          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                        >
                          MEBBİS İle Geçiş Yap
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`"${pkg.name}" planına yükseltme talebiniz kaydedildi.`)}
                          className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                        >
                          Planı Seç
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: PROFILE & DUTIES SETTINGS */}
        {activeTab === "profile" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  Öğretmen Profil, Okul ve Görev Ayarları
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Okutacağınız sınıflar, kulüp çalışmalarınız, rehberlik ve okul bilgileriniz tüm evrak ve zümre başlıklarına otomatik yansıtılır.
                </p>
              </div>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Öğretmen profil ve görev bilgileriniz başarıyla güncellendi!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={profileFullName}
                    onChange={(e) => setProfileFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Branş</label>
                  <input
                    type="text"
                    required
                    value={profileBranch}
                    onChange={(e) => setProfileBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Görev Yaptığınız Okul Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Ankara Atatürk Anadolu Lisesi"
                  value={profileSchoolName}
                  onChange={(e) => setProfileSchoolName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kulüp Faaliyeti / Çalışması</label>
                  <input
                    type="text"
                    placeholder="Örn: Bilişim ve Yazılım Kulübü"
                    value={profileClub}
                    onChange={(e) => setProfileClub(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Rehberlik / Sınıf Danışmanlığı</label>
                  <input
                    type="text"
                    placeholder="Örn: 9-A Sınıfı Rehber Öğretmeni"
                    value={profileGuidance}
                    onChange={(e) => setProfileGuidance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">MEB Bilgi & Doğrulama Durumu</span>
                <div className="flex items-center justify-between text-slate-400">
                  <span>T.C. & MEBBİS Eşleşmesi:</span>
                  <span className={isVerified ? "text-emerald-400 font-bold" : "text-amber-400"}>
                    {isVerified ? "Doğrulandı ve Onaylandı" : "Doğrulanmadı"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Profil ve Görevleri Kaydet
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "uploads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Yüklediğiniz Evrak & Zümre Belgeleri</h2>
              <button
                onClick={() => {
                  onGoToAdminPanel();
                  setActiveModuleId("06_documents");
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                + Yeni Belge Yükle
              </button>
            </div>

            {myUploadedDocs.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 text-xs space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Henüz sisteme yüklediğiniz bir evrak bulunmuyor.</p>
                <p className="text-[11px] text-slate-500">
                  Zümre tutanaklarınızı veya ders notlarınızı yükleyerek diğer öğretmenlerle paylaşabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myUploadedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {doc.lesson} • {doc.gradeLevel} • {doc.downloadCount} indirme
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        doc.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {doc.status === "published" ? "Yayında" : "İnceleniyor"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "ai_tools" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Öğretmen Pedagojik AI Asistanı (Gemini 2.5 Flash Destekli)
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  MEB müfredatı, kazanım kodları ve resmi evrak şablonlarına uygun anında doküman ve sınav üretin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Kalan AI Kredisi: {userPackage.limits.aiCreditsPerMonth} / Ay
                </span>
              </div>
            </div>

            {/* Quick Agent Category Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedAgentKey("soru_ajani");
                  setPromptText(`${currentUser.branch} dersi için MEB senaryolarına tam uyumlu 4 açık uçlu soru ve puanlama rubriği hazırla.`);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedAgentKey === "soru_ajani"
                    ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/10"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Yazılı & Ortak Sınav</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  MEB 1. ve 2. dönem açık uçlu kazanım sınavı ve detaylı puanlama baremi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAgentKey("dokuman_ajani");
                  setPromptText(`${currentUser.branch} dersi 2. Dönem Zümre Öğretmenler Kurulu Karar Tutanağı hazırla. Gündem maddeleri ve karar metni tam olsun.`);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedAgentKey === "dokuman_ajani"
                    ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/10"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Zümre & Yıllık Plan</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Sene başı, dönem ortası zümre tutanakları ve MEB çalışma takvimi planları.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAgentKey("icerik_ajani");
                  setPromptText(`${currentUser.branch} dersi için öğrencilerin dikkatini çekecek pedagojik ders özeti, kavram haritası ve çalışma kağıdı hazırla.`);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedAgentKey === "icerik_ajani"
                    ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/10"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Ders Özeti & BEP Planı</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Bireyselleştirilmiş eğitim planı (BEP) tablosu ve ders içi etkinlik kağıdı.
                </p>
              </button>
            </div>

            {/* AI Generator Interactive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Input */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* MEB 13 Kademe & Çalışma Takvimi Seçicileri */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        MEB Müfredat & Takvim Referansı
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {academicCalendar.academicYear}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-medium block mb-1">
                          Okul Türü Filtresi (TTKB Çizelgeleri)
                        </label>
                        <select
                          value={selectedTeacherSchoolType}
                          onChange={(e) => setSelectedTeacherSchoolType(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="all">Tüm Okul Türleri</option>
                          {MEB_SCHOOL_TYPES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-medium block mb-1">
                            Sınıf Kademesi ({filteredGradesForTeacher.length} Kademe)
                          </label>
                          <select
                            value={selectedGradeId}
                            onChange={(e) => {
                              const newGradeId = e.target.value;
                              setSelectedGradeId(newGradeId);
                              const grObj = gradeCurriculums.find((g) => g.gradeLevelId === newGradeId);
                              const lessonName = grObj?.lessons[0]?.lessonName || currentUser.branch || "Ders";
                              setPromptText(`${grObj?.gradeName || newGradeId + ". Sınıf"} ${lessonName} dersi için MEB çalışma takviminin ${selectedWeekNumber}. haftasına uygun kazanımlarla yıllık/günlük plan ve evrak hazırla.`);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          >
                            {filteredGradesForTeacher.map((g) => (
                              <option key={g.gradeLevelId} value={g.gradeLevelId}>
                                {g.gradeName} ({g.levelStage || g.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-medium block mb-1">
                            Çalışma Takvimi Haftası
                          </label>
                          <select
                            value={selectedWeekNumber}
                            onChange={(e) => {
                              const newWeek = Number(e.target.value);
                              setSelectedWeekNumber(newWeek);
                              const grObj = gradeCurriculums.find((g) => g.gradeLevelId === selectedGradeId);
                              const lessonName = grObj?.lessons[0]?.lessonName || currentUser.branch || "Ders";
                              setPromptText(`${grObj?.gradeName || selectedGradeId + ". Sınıf"} ${lessonName} dersi için MEB çalışma takviminin ${newWeek}. haftasına uygun kazanımlarla yıllık/günlük plan ve evrak hazırla.`);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          >
                            {academicCalendar.weeks.map((w) => (
                              <option key={w.weekNumber} value={w.weekNumber}>
                                {w.weekNumber}. Hafta ({w.startDate})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Week & Textbook Preview Pill */}
                    {(() => {
                      const curG = gradeCurriculums.find((g) => g.gradeLevelId === selectedGradeId);
                      const curW = academicCalendar.weeks.find((w) => w.weekNumber === selectedWeekNumber);
                      const curL = curG?.lessons[0];
                      return (
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-semibold font-mono">
                              Hafta {curW?.weekNumber}: {curW?.startDate} &mdash; {curW?.endDate}
                            </span>
                            <span className="text-slate-400">{curW?.term}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span className="line-clamp-1">{curL ? `Kitap: ${curL.textbookName}` : "Müfredat hazır"}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono shrink-0 ml-1">
                              {curG?.levelStage} &bull; {curG?.maarifModelStatus === "Kademeli Geçiş (Yeni Model)" ? "Yeni Maarif" : "Sabit"}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">
                        Öğretmen İsteminiz (Prompt):
                      </span>
                      <span className="text-[10px] text-indigo-400 font-medium">
                        Branşınız: {currentUser.branch || "Öğretmen"}
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Üretilmesini istediğiniz konu, sınıf düzeyi ve detayları belirtin..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed font-sans"
                    />

                    {/* Preset quick buttons */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const grObj = gradeCurriculums.find((g) => g.gradeLevelId === selectedGradeId);
                          const curW = academicCalendar.weeks.find((w) => w.weekNumber === selectedWeekNumber);
                          setPromptText(`${grObj?.gradeName || "Sınıf"} için MEB ${academicCalendar.academicYear} çalışma takviminin ${curW?.weekNumber}. haftasına (${curW?.startDate} - ${curW?.endDate}) tam uyumlu haftalık ders planı ve kazanım dökümü hazırla.`);
                        }}
                        className="text-[10px] px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
                      >
                        + Takvime Uygun Hafta Planı
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromptText("LGS / YKS formatına uygun 3 adet yeni nesil beceri temelli soru, çözüm aşamaları ve MEB kazanım kodları üret.")}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        + Yeni Nesil Soru Seti
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromptText("Kaynaştırma öğrencisi için 1. Dönem BEP Gelişim Raporu ve aylık kazanım hedefleri şablonu hazırla.")}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        + BEP Gelişim Planı
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTeacherRunAi}
                  disabled={isAiRunning}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isAiRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini Pedagojik Motoru Üretiyor...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>MEB Uyumlu Evrak / Soru Üret</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Output Console */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Üretilen Pedagojik Evrak
                      </h3>
                    </div>

                    {aiOutput && (
                      <button
                        type="button"
                        onClick={handleCopyAiOutput}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copied ? "Kopyalandı!" : "Metni Kopyala"}</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-3">
                    {isAiRunning ? (
                      <div className="h-72 flex flex-col items-center justify-center space-y-3 text-slate-400">
                        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                        <div className="text-xs font-medium">MEB müfredatı ve kazanımları taranıyor...</div>
                        <div className="text-[10px] text-slate-500">Gemini 2.5 Flash Motoru Aktif</div>
                      </div>
                    ) : aiOutput ? (
                      <div className="h-80 overflow-y-auto bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed custom-scrollbar">
                        {aiOutput}
                      </div>
                    ) : (
                      <div className="h-80 flex flex-col items-center justify-center space-y-2 text-slate-500 border border-dashed border-slate-800 rounded-xl p-6 text-center">
                        <Bot className="w-8 h-8 text-slate-700" />
                        <div className="text-xs font-semibold text-slate-400">
                          Henüz bir içerik üretilmedi.
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-sm">
                          Sol alandan isteminizi seçip &quot;Üret&quot; butonuna basarak saniyeler içinde MEB uyumlu taslak oluşturabilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pipeline Action Bar */}
                {aiOutput && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[11px] text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Kural 18: Evrak olarak kaydedildiğinde MEB moderasyon kontrolünden geçer.</span>
                    </div>

                    <div>
                      {aiDocSaveSuccess ? (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Moderasyon Havuzuna İletildi!
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSaveAiToMyDocs}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Evraklarıma Kaydet & Moderasyona Gönder</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ÖĞRETMEN KENDİ MEBBİS & T.C. DOĞRULAMA MODALI */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Öğretmen MEBBİS Doğrulaması</h3>
                  <p className="text-[11px] text-slate-400">T.C. & MEBBİS İle Ücretsiz Doğrulanmış Profil</p>
                </div>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {verifySuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-emerald-300">Tebrikler! Hesabınız Doğrulandı!</div>
                <p className="text-xs text-slate-300">
                  MEBBİS onayınız tamamlandı. Başlıksız temiz çıktı ve zümre toplu indirme ayrıcalıklarınız hesabınıza tanımlandı.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-1.5">
                  <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span>Doğrulanmış Öğretmen Hakları:</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Filigransız ve <strong>başlıksız temiz çıktı</strong> alabilme</li>
                    <li>Branşınızdaki tüm evrakları <strong>toplu ZIP</strong> olarak indirme</li>
                    <li>Aylık 120 AI Soru & Yıllık Plan üretim kredisi</li>
                    <li>MEB müfredat güncellemelerine öncelikli erişim</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      T.C. Kimlik Numaranız (11 Hane)
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      required
                      placeholder="11 haneli T.C. Kimlik Numaranız"
                      value={tcInput}
                      onChange={(e) => setTcInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      * KVKK gereğince T.C. kimlik numaranız sistemde maskeli (örn: 12******89) saklanır.
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      MEBBİS Kullanıcı Kodu / Kurum Sicil Numaranız
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: MEB-89412"
                      value={mebbisInput}
                      onChange={(e) => setMebbisInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      * MEB Bilgi İşlem veri entegrasyonu ile teyit edilir.
                    </span>
                  </div>
                </div>

                {verifyError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsVerifyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <FileCheck className="w-4 h-4" />
                    Doğrulamayı Tamamla
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* A4 PAGE LAYOUT PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-[#203650]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#D6E9F8] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#D6E9F8] flex items-center justify-between bg-[#F7FBFF]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F4FF] text-[#4A90E2]">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#203650]">Sayfa Düzeninde Ön İzleme (A4 Resmi Belge Formatı)</h3>
                  <p className="text-[10px] text-[#64748B]">MEB standartlarına tam uyumlu, başlıklı ve imzalı çıktı görünümü.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Evrak yazıcıya gönderiliyor...")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4A90E2] hover:bg-[#3b7bc7] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Yazdır / PDF İndir</span>
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-[#64748B] hover:text-[#203650] p-1.5 rounded-lg hover:bg-[#E8F4FF] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10 flex-1 overflow-y-auto bg-[#F7FBFF] flex justify-center">
              {/* A4 PAPER CONTAINER */}
              <div className="w-full max-w-[210mm] bg-white text-slate-900 p-10 md:p-14 shadow-2xl rounded-sm font-serif space-y-6 leading-relaxed">
                {/* MEB HEADER */}
                <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                  <div className="text-xs font-bold tracking-widest uppercase text-slate-700">T.C. MİLLÎ EĞİTİM BAKANLIĞI</div>
                  <div className="text-sm font-extrabold text-slate-900">{profileSchoolName || currentUser.schoolName || "Ankara Atatürk Anadolu Lisesi"}</div>
                  <div className="text-xs text-slate-600 font-sans">{previewCategory || "Zümre Öğretmenler Kurulu / Yıllık Plan Evrakı"}</div>
                </div>

                {/* METADATA */}
                <div className="grid grid-cols-2 text-xs font-sans border-b border-slate-300 pb-3 text-slate-700">
                  <div>
                    <strong>Branş:</strong> {currentUser.branch}<br />
                    <strong>Ders / Konu:</strong> {previewTitle}
                  </div>
                  <div className="text-right">
                    <strong>Öğretmen:</strong> {currentUser.fullName}<br />
                    <strong>Tarih:</strong> {new Date().toLocaleDateString("tr-TR")}
                  </div>
                </div>

                {/* CONTENT BODY */}
                <div className="space-y-4 text-sm text-slate-900 whitespace-pre-line font-serif py-2 min-h-[350px]">
                  {previewContent}
                </div>

                {/* DUTIES & SIGNATURE SECTION */}
                <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-4 text-xs font-sans text-slate-800">
                  <div className="space-y-1">
                    <div><strong>Kulüp Görevi:</strong> {currentUser.clubActivity || profileClub}</div>
                    <div><strong>Rehberlik Görevi:</strong> {currentUser.guidanceDuty || profileGuidance}</div>
                  </div>
                  <div className="text-right space-y-8">
                    <div>
                      <span>{currentUser.fullName}</span><br />
                      <span className="text-[11px] text-slate-600">{currentUser.branch} Öğretmeni</span>
                    </div>
                    <div className="font-bold text-slate-900">İmza</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
