import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  CalendarDays,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  BookMarked,
  Info,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  GraduationCap,
  School,
  SlidersHorizontal,
  Table,
  Filter,
  Check,
} from "lucide-react";
import { GradeCurriculum, MebSchoolType, SubjectCategory, TtkbWeeklyScheduleInfo } from "../../types";
import { MEB_SCHOOL_TYPES } from "../../data/curriculumData";

export const CurriculumCalendarView: React.FC = () => {
  const {
    academicCalendar,
    updateAcademicCalendar,
    gradeCurriculums,
    updateCurriculumStatus,
    ttkbWeeklySchedules,
    currentUser,
    setActiveModuleId,
    dispatchJob,
    activeSubItemId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"grades" | "calendar" | "ttkb_schedules" | "auto_sync">("grades");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("9");
  const [selectedStageFilter, setSelectedStageFilter] = useState<"all" | "Temel Eğitim" | "Ortaöğretim">("all");
  const [selectedSchoolType, setSelectedSchoolType] = useState<MebSchoolType | "all">("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<SubjectCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("" );
  const [selectedTermFilter, setSelectedTermFilter] = useState<"all" | "1. Dönem" | "2. Dönem">("all");
  const [ttkbSearchTerm, setTtkbSearchTerm] = useState<string>("");
  const [ttkbSchoolTypeFilter, setTtkbSchoolTypeFilter] = useState<MebSchoolType | "all">("all");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Sync with left sidebar sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("Takvim")) {
      setActiveTab("calendar");
    } else if (activeSubItemId.includes("Kademe") || activeSubItemId.includes("Müfredat")) {
      setActiveTab("grades");
    } else if (activeSubItemId.includes("Çizelge") || activeSubItemId.includes("Haftalık")) {
      setActiveTab("ttkb_schedules");
    }
  }, [activeSubItemId]);

  // Filtered grades based on stage and school type
  const availableGrades = gradeCurriculums.filter((grade) => {
    if (selectedStageFilter !== "all" && grade.levelStage !== selectedStageFilter) return false;
    if (selectedSchoolType !== "all") {
      if (grade.applicableSchoolTypes && !grade.applicableSchoolTypes.includes(selectedSchoolType)) {
        return false;
      }
    }
    return true;
  });

  const currentGrade =
    availableGrades.find((g) => g.gradeLevelId === selectedGradeId) ||
    availableGrades[0] ||
    gradeCurriculums[0];

  // TTKB Schedule for current grade & school type
  const currentTtkbSchedule =
    ttkbWeeklySchedules.find(
      (s) =>
        s.gradeLevelId === currentGrade.gradeLevelId &&
        (selectedSchoolType === "all" ? true : s.schoolType === selectedSchoolType)
    ) ||
    ttkbWeeklySchedules.find((s) => s.gradeLevelId === currentGrade.gradeLevelId);

  // Lessons filtered by school type and category
  const filteredLessons = currentGrade.lessons.filter((lesson) => {
    if (selectedSchoolType !== "all") {
      if (lesson.applicableSchoolTypes && lesson.applicableSchoolTypes.length > 0) {
        if (!lesson.applicableSchoolTypes.includes(selectedSchoolType)) return false;
      }
    }
    if (selectedCategoryFilter !== "all") {
      if (lesson.subjectCategory && lesson.subjectCategory !== selectedCategoryFilter) return false;
    }
    return true;
  });

  // Calendar dates form states
  const [calYear, setCalYear] = useState(academicCalendar.academicYear);
  const [term1Start, setTerm1Start] = useState(academicCalendar.firstTermStart);
  const [term1End, setTerm1End] = useState(academicCalendar.firstTermEnd);
  const [term2Start, setTerm2Start] = useState(academicCalendar.secondTermStart);
  const [term2End, setTerm2End] = useState(academicCalendar.secondTermEnd);
  const [calSaveSuccess, setCalSaveSuccess] = useState(false);

  const handleSaveCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademicCalendar({
      academicYear: calYear,
      firstTermStart: term1Start,
      firstTermEnd: term1End,
      secondTermStart: term2Start,
      secondTermEnd: term2End,
    });
    setCalSaveSuccess(true);
    setTimeout(() => setCalSaveSuccess(false), 3000);
  };

  const handleToggleCurriculumUpdated = (lessonKey: string, currentStatus: boolean, version: string) => {
    updateCurriculumStatus(currentGrade.gradeLevelId, lessonKey, !currentStatus, version);
  };

  const handleTriggerCalendarSync = () => {
    setIsSyncing(true);
    setSyncSuccessMessage(null);

    dispatchJob(
      "ai_queue",
      `${academicCalendar.academicYear} MEB Çalışma Takvimi Dinamik Tarih Senkronizasyonu (13 Kademe)`,
      {
        academicYear: academicCalendar.academicYear,
        totalWeeks: academicCalendar.weeks.length,
        initiatedBy: currentUser?.fullName || "Yönetici",
      },
      "high"
    );

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMessage(
        `MEB ${academicCalendar.academicYear} Çalışma Takvimi uyarınca tüm 13 kademedeki zümre, yıllık plan, sınav ve ders kitabı ünitelerinin tarihleri başarıyla güncellendi!`
      );
      setTimeout(() => setSyncSuccessMessage(null), 6000);
    }, 1500);
  };

  const filteredWeeks = academicCalendar.weeks.filter((w) => {
    if (selectedTermFilter !== "all" && w.term !== selectedTermFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        w.themeOrMilestone?.toLowerCase().includes(q) ||
        w.holidayName?.toLowerCase().includes(q) ||
        w.weekNumber.toString().includes(q)
      );
    }
    return true;
  });

  const filteredTtkbSchedules = ttkbWeeklySchedules.filter((sched) => {
    if (ttkbSchoolTypeFilter !== "all" && sched.schoolType !== ttkbSchoolTypeFilter) return false;
    if (ttkbSearchTerm) {
      const q = ttkbSearchTerm.toLowerCase();
      return (
        sched.gradeName.toLowerCase().includes(q) ||
        sched.schoolType.toLowerCase().includes(q) ||
        sched.ttkbDecisionNumber.toLowerCase().includes(q) ||
        sched.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Info Header */}
      <div className="bg-white border-l-4 border-l-[#28a745] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-5 h-5 text-[#28a745]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                MEB Müfredat & TTKB Haftalık Ders Çizelgeleri
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#eaf7ed] text-[#28a745] font-bold border border-[#28a745]/30">
                Talim Terbiye Onaylı
              </span>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed max-w-3xl">
              Anadolu, Fen, İmam Hatip, MTAL, Ortaokul ve İlkokul seviyelerinde okutulacak dersler ve haftalık ders saatleri TTKB resmi kararlarıyla belirlenmiştir. Okul türü ve sınıf kademesi filtreleri ile resmi çizelgelere tam uyumlu müfredat haritasını inceleyin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleTriggerCalendarSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Senkronize Ediliyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Takvime Göre Otomatik Güncelle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {syncSuccessMessage && (
          <div className="mt-3 p-3 rounded bg-[#eaf7ed] border border-[#28a745]/40 text-[#1e7e34] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#28a745] shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* AdminLTE Small Boxes: Curriculum & Calendar Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{gradeCurriculums.length} Kademe</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Sınıf Seviyesi Haritası</p>
          </div>
          <School className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Okul Öncesi - 12. Sınıf</span>
        </div>

        <div className="bg-[#007bff] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              {gradeCurriculums.reduce((acc, g) => acc + (g.lessons?.length || 0), 0)} Ders
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Tanımlı MEB Dersi</p>
          </div>
          <BookOpen className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Zorunlu & Seçmeli Dersler</span>
        </div>

        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{ttkbWeeklySchedules.length} Çizelge</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">TTKB Haftalık Çizelge</p>
          </div>
          <Table className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Resmi Karar Sayılı</span>
        </div>

        <div className="bg-[#fd7e14] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{academicCalendar.weeks.length} Hafta</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Akademik Çalışma Takvimi</p>
          </div>
          <CalendarDays className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">{academicCalendar.academicYear} Dönemi</span>
        </div>
      </div>

      {/* AdminLTE Nav Pills Navigation Card */}
      <div className="bg-white border border-[#dee2e6] rounded p-2.5 shadow-xs flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("grades")}
          className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "grades"
              ? "bg-[#28a745] text-white shadow-xs"
              : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Okul Türü & Ders Listeleri (Müfredat)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ttkb_schedules")}
          className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "ttkb_schedules"
              ? "bg-[#28a745] text-white shadow-xs"
              : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>TTKB Haftalık Ders Çizelgeleri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "calendar"
              ? "bg-[#28a745] text-white shadow-xs"
              : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>MEB {academicCalendar.academicYear} Çalışma Takvimi (38 Hafta)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("auto_sync")}
          className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "auto_sync"
              ? "bg-[#28a745] text-white shadow-xs"
              : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Dinamik Güncelleme Matrisi</span>
        </button>
      </div>

      {/* TAB 1: Okul Türü & Ders Listeleri (Müfredat) */}
      {activeTab === "grades" && (
        <div className="space-y-4">
          {/* Filter Bar: Okul Türü Seçimi */}
          <div className="card card-outline card-success bg-white border border-[#dee2e6] rounded p-3.5 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#28a745]" />
                <span className="text-xs font-bold text-[#212529] uppercase tracking-wider">
                  Talim Terbiye Okul Türü Filtresi:
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#eaf7ed] text-[#28a745]">
                  {selectedSchoolType === "all" ? "Tüm Okul Türleri" : selectedSchoolType}
                </span>
              </div>

              {/* Subject Category Quick Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#6c757d] text-[11px] font-medium mr-1">Ders Grubu:</span>
                {(["all", "Ortak / Zorunlu", "Seçmeli", "Rehberlik & Yönlendirme"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? "bg-[#28a745] text-white shadow-xs"
                        : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                    }`}
                  >
                    {cat === "all" ? "Tümü" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* School Type Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedSchoolType("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedSchoolType === "all"
                    ? "bg-[#28a745] text-white border-[#28a745]"
                    : "bg-[#f8f9fa] text-[#495057] border-[#ced4da] hover:bg-[#e9ecef]"
                }`}
              >
                Tüm Okul Türleri
              </button>

              {MEB_SCHOOL_TYPES.map((st) => {
                const isActive = selectedSchoolType === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSelectedSchoolType(st);
                      const matchingGrade = gradeCurriculums.find((g) =>
                        g.applicableSchoolTypes?.includes(st)
                      );
                      if (matchingGrade && !currentGrade.applicableSchoolTypes?.includes(st)) {
                        setSelectedGradeId(matchingGrade.gradeLevelId);
                      }
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                      isActive
                        ? "bg-[#28a745] text-white border-[#28a745]"
                        : "bg-[#f8f9fa] text-[#495057] border-[#ced4da] hover:bg-[#e9ecef]"
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Two Column View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Grade Selector Buttons */}
            <div className="lg:col-span-4 space-y-2">
              <div className="p-3 bg-white border border-[#dee2e6] rounded shadow-xs mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#212529] block">
                    Sınıf Kademeleri ({availableGrades.length} Kademe)
                  </span>
                  {selectedSchoolType !== "all" && (
                    <span className="text-[10px] text-[#28a745] font-mono font-bold">
                      {selectedSchoolType}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#6c757d] mb-2.5">
                  Talim Terbiye Kurulu kararıyla bu okul türü için belirlenmiş sınıf seviyeleri.
                </p>

                {/* Stage Filter */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#f8f9fa] rounded border border-[#dee2e6] text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedStageFilter("all")}
                    className={`py-1 rounded font-semibold transition-colors cursor-pointer ${
                      selectedStageFilter === "all"
                        ? "bg-[#28a745] text-white"
                        : "text-[#495057] hover:bg-[#e9ecef]"
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStageFilter("Temel Eğitim")}
                    className={`py-1 rounded font-semibold transition-colors cursor-pointer ${
                      selectedStageFilter === "Temel Eğitim"
                        ? "bg-[#28a745] text-white"
                        : "text-[#495057] hover:bg-[#e9ecef]"
                    }`}
                  >
                    Temel Eğitim
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStageFilter("Ortaöğretim")}
                    className={`py-1 rounded font-semibold transition-colors cursor-pointer ${
                      selectedStageFilter === "Ortaöğretim"
                        ? "bg-[#28a745] text-white"
                        : "text-[#495057] hover:bg-[#e9ecef]"
                    }`}
                  >
                    Ortaöğretim
                  </button>
                </div>
              </div>

              {/* Grade Buttons List */}
              <div className="space-y-1.5 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
                {availableGrades.map((grade) => {
                  const isSelected = grade.gradeLevelId === currentGrade.gradeLevelId;
                  return (
                    <button
                      key={grade.gradeLevelId}
                      type="button"
                      onClick={() => setSelectedGradeId(grade.gradeLevelId)}
                      className={`w-full text-left p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#eaf7ed] border-[#28a745] shadow-xs"
                          : "bg-white border-[#dee2e6] hover:bg-[#f8f9fa]"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-[#1e7e34]" : "text-[#212529]"
                            }`}
                          >
                            {grade.gradeName}
                          </span>
                          {grade.levelStage && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#f4f6f9] text-[#6c757d] border border-[#ced4da]">
                              {grade.levelStage === "Temel Eğitim" ? "Temel" : "Orta"}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#6c757d] truncate mt-0.5">
                          {grade.lessons.length} Ders • {grade.maarifModelStatus || "Sabit"}
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? "text-[#28a745]" : "text-[#ced4da]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Lessons of Selected Grade */}
            <div className="lg:col-span-8 space-y-3">
              {currentTtkbSchedule && (
                <div className="p-3 bg-white border border-[#dee2e6] rounded shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dee2e6] pb-2">
                    <div>
                      <span className="text-xs font-bold text-[#212529] block">
                        TTKB Karar No: {currentTtkbSchedule.ttkbDecisionNumber} ({currentTtkbSchedule.schoolType})
                      </span>
                      <span className="text-[11px] text-[#6c757d]">
                        Haftalık Toplam: <strong>{currentTtkbSchedule.totalWeeklyHours} Saat</strong> (Ortak: {currentTtkbSchedule.totalMandatoryHours}s, Seçmeli: {currentTtkbSchedule.totalElectiveHours}s)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f8f9fa] text-[#495057] border border-[#ced4da]">
                      Karar Tarihi: {currentTtkbSchedule.ttkbDecisionDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#495057] italic mt-2">
                    &ldquo;{currentTtkbSchedule.notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Main Lessons Card */}
              <div className="card card-outline card-success bg-white border border-[#dee2e6] rounded p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dee2e6] gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookMarked className="w-4 h-4 text-[#28a745]" />
                      <h2 className="text-sm font-bold text-[#212529]">
                        {currentGrade.gradeName} — Ders ve Müfredat Tanımları
                      </h2>
                    </div>
                    <span className="text-xs text-[#6c757d] mt-0.5 block">
                      {filteredLessons.length} Ders listeleniyor • Model: {currentGrade.maarifModelStatus || "Sabit Müfredat"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModuleId("15_ai_agents")}
                    className="px-2.5 py-1 rounded bg-[#6f42c1] hover:bg-[#5a32a3] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Evrak Üret</span>
                  </button>
                </div>

                {/* Lessons List */}
                <div className="mt-3 space-y-2.5">
                  {filteredLessons.map((lesson) => (
                    <div
                      key={lesson.lessonKey}
                      className="p-3 bg-[#f8f9fa] rounded border border-[#dee2e6] space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-[#eaf7ed] text-[#28a745] flex flex-col items-center justify-center font-bold text-xs shrink-0">
                            <span>{lesson.weeklyHours}s</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-bold text-[#212529]">{lesson.lessonName}</h3>
                              {lesson.subjectCategory && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-white border border-[#ced4da] text-[#495057]">
                                  {lesson.subjectCategory}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#6c757d]">
                              Ders Saati: {lesson.weeklyHours} Saat • Tebliğ: {lesson.lastMebBulletinDate}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleCurriculumUpdated(
                              lesson.lessonKey,
                              lesson.isUpdatedThisYear,
                              lesson.curriculumVersion
                            )
                          }
                          className={`text-xs px-2.5 py-1 rounded border font-semibold transition-colors cursor-pointer ${
                            lesson.isUpdatedThisYear
                              ? "bg-[#fff3cd] border-[#ffeeba] text-[#856404]"
                              : "bg-white border-[#ced4da] text-[#495057] hover:bg-[#e9ecef]"
                          }`}
                        >
                          {lesson.isUpdatedThisYear ? "⚠️ Yeni Maarif Modeli" : "✓ Sabit Müfredat"}
                        </button>
                      </div>

                      {/* Textbook info */}
                      <div className="p-2 rounded bg-white border border-[#dee2e6] text-[11px] text-[#495057] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <strong>MEB Ders Kitabı:</strong> {lesson.textbookName} ({lesson.textbookAuthorOrPublisher})
                        </div>
                        <div className="text-[#28a745] font-semibold font-mono">
                          Versiyon: {lesson.curriculumVersion}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TTKB Haftalık Ders Çizelgeleri (Resmi Tablo) */}
      {activeTab === "ttkb_schedules" && (
        <div className="card card-outline card-success bg-white border border-[#dee2e6] rounded p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#dee2e6]">
            <div>
              <h2 className="text-sm font-bold text-[#212529] flex items-center gap-2">
                <Table className="w-4 h-4 text-[#28a745]" />
                <span>Talim ve Terbiye Kurulu Başkanlığı (TTKB) Haftalık Ders Çizelgeleri</span>
              </h2>
              <p className="text-xs text-[#6c757d] mt-0.5">
                Milli Eğitim Bakanlığı Tebliğler Dergisi ve TTKB Kararları uyarınca resmi ders saati dağılımı.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                value={ttkbSearchTerm}
                onChange={(e) => setTtkbSearchTerm(e.target.value)}
                placeholder="Çizelgelerde ara..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-[#ced4da] rounded text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#495057]">
              <thead className="bg-[#f4f6f9] text-[#495057] uppercase text-[10px] border-b border-[#dee2e6]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Sınıf / Kademe</th>
                  <th className="py-2.5 px-3 font-semibold">Okul Türü</th>
                  <th className="py-2.5 px-3 font-semibold">TTKB Karar No</th>
                  <th className="py-2.5 px-3 font-semibold">Karar Tarihi</th>
                  <th className="py-2.5 px-3 font-semibold">Ortak Saat</th>
                  <th className="py-2.5 px-3 font-semibold">Seçmeli</th>
                  <th className="py-2.5 px-3 font-semibold">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6]">
                {filteredTtkbSchedules.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f8f9fa]">
                    <td className="py-2 px-3 font-bold text-[#212529]">{s.gradeName}</td>
                    <td className="py-2 px-3">{s.schoolType}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-[#007bff]">{s.ttkbDecisionNumber}</td>
                    <td className="py-2 px-3">{s.ttkbDecisionDate}</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#28a745]">{s.totalMandatoryHours}s</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#fd7e14]">{s.totalElectiveHours}s</td>
                    <td className="py-2 px-3 font-mono font-black text-[#212529]">{s.totalWeeklyHours} Saat</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MEB Çalışma Takvimi (38 Hafta) */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          {/* Calendar Dates Form Card */}
          <div className="card card-outline card-success bg-white border border-[#dee2e6] rounded p-4 shadow-xs">
            <h2 className="text-sm font-bold text-[#212529] mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#28a745]" />
              <span>MEB {academicCalendar.academicYear} Çalışma Takvimi Parametreleri</span>
            </h2>
            <p className="text-xs text-[#6c757d] mb-3">
              MEB tarafından yayımlanan resmi takvim tarihleri. Değiştirildiğinde tüm planlar takvime göre güncellenir.
            </p>

            <form onSubmit={handleSaveCalendar} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="font-semibold text-[#495057] block mb-1">Eğitim Öğretim Yılı</label>
                <input
                  type="text"
                  value={calYear}
                  onChange={(e) => setCalYear(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#495057] block mb-1">1. Dönem Başlangıcı</label>
                <input
                  type="date"
                  value={term1Start}
                  onChange={(e) => setTerm1Start(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#495057] block mb-1">1. Dönem Bitişi (Karneler)</label>
                <input
                  type="date"
                  value={term1End}
                  onChange={(e) => setTerm1End(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#495057] block mb-1">2. Dönem Başlangıcı</label>
                <input
                  type="date"
                  value={term2Start}
                  onChange={(e) => setTerm2Start(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#495057] block mb-1">2. Dönem Bitişi (Kapanış)</label>
                <input
                  type="date"
                  value={term2End}
                  onChange={(e) => setTerm2End(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-5 flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#6c757d]">
                  Resmi MEB Genelgesi: <strong>2024/36 Sayılı Çalışma Takvimi Genelgesi</strong>
                </span>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {calSaveSuccess ? "✓ Tarihler Kaydedildi & Senkronlandı" : "Takvim Tarihlerini Güncelle"}
                </button>
              </div>
            </form>
          </div>

          {/* 38 Weeks Interactive Table */}
          <div className="card card-outline card-success bg-white border border-[#dee2e6] rounded p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#dee2e6]">
              <div>
                <h3 className="text-sm font-bold text-[#212529]">
                  38 Haftalık MEB Akış Takvimi ({filteredWeeks.length} Hafta)
                </h3>
                <p className="text-[11px] text-[#6c757d]">
                  Her haftanın sınav dönemleri, ara tatil, yarıyıl tatili ve pedagojik dönüm noktaları.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Hafta ara (tatil, sınav)..."
                  className="pl-3 pr-3 py-1 bg-white border border-[#ced4da] rounded text-xs text-[#495057] focus:outline-none focus:border-[#28a745] w-44"
                />

                <div className="flex items-center bg-[#f8f9fa] p-0.5 rounded border border-[#ced4da] text-xs">
                  {(["all", "1. Dönem", "2. Dönem"] as const).map((term) => (
                    <button
                      key={term}
                      onClick={() => setSelectedTermFilter(term)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        selectedTermFilter === term
                          ? "bg-[#28a745] text-white"
                          : "text-[#495057] hover:bg-[#e9ecef]"
                      }`}
                    >
                      {term === "all" ? "Tümü" : term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left text-[#495057]">
                <thead className="bg-[#f4f6f9] text-[#495057] uppercase text-[10px] border-b border-[#dee2e6]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Hafta</th>
                    <th className="py-2.5 px-3 font-semibold">Dönem</th>
                    <th className="py-2.5 px-3 font-semibold">Tarih Aralığı</th>
                    <th className="py-2.5 px-3 font-semibold">Pedagojik Tema / MEB Dönüm Noktası</th>
                    <th className="py-2.5 px-3 font-semibold">Resmi Tatil / Bayram</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6]">
                  {filteredWeeks.map((week) => (
                    <tr
                      key={week.weekNumber}
                      className={`hover:bg-[#f8f9fa] transition-colors ${
                        week.isHoliday ? "bg-[#fff8e1]" : ""
                      }`}
                    >
                      <td className="py-2 px-3 font-bold font-mono text-[#212529]">
                        {week.weekNumber}. Hafta
                      </td>
                      <td className="py-2 px-3">{week.term}</td>
                      <td className="py-2 px-3 font-mono">
                        {week.startDate} — {week.endDate}
                      </td>
                      <td className="py-2 px-3 font-medium text-[#212529]">
                        {week.themeOrMilestone}
                      </td>
                      <td className="py-2 px-3">
                        {week.holidayName ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ffc107] text-[#1f2d3d]">
                            {week.holidayName}
                          </span>
                        ) : (
                          <span className="text-[#adb5bd]">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {week.isHoliday ? (
                          <span className="text-xs text-[#fd7e14] font-bold">Tatil</span>
                        ) : (
                          <span className="text-xs text-[#28a745] font-semibold">Aktif Ders</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Yapay Zeka Dinamik Güncelleme Matrisi */}
      {activeTab === "auto_sync" && (
        <div className="card card-outline card-purple bg-white border border-[#dee2e6] rounded p-4 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#212529] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6f42c1]" />
              <span>Yapay Zeka Evrak Üretim Matrisi (Müfredat x Okul Türü x Çalışma Takvimi)</span>
            </h2>
            <p className="text-xs text-[#6c757d] mt-1">
              MEB Öğretmen Ekosisteminde evrak oluştururken yapay zekanın önüne 4 temel referans katmanı yerleştirilir:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#f8f9fa] rounded border border-[#dee2e6]">
              <div className="w-7 h-7 rounded bg-[#e8f4ff] text-[#007bff] flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h3 className="text-xs font-bold text-[#212529] mb-1">Müfredat & TTKB Kararları</h3>
              <p className="text-[11px] text-[#6c757d] leading-relaxed">
                Okul türü ve kademeye göre TTKB karar numarası, haftalık saat ve kazanım kodları referans alınır.
              </p>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] rounded border border-[#dee2e6]">
              <div className="w-7 h-7 rounded bg-[#e1f5f8] text-[#17a2b8] flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h3 className="text-xs font-bold text-[#212529] mb-1">MEB Ders Kitapları</h3>
              <p className="text-[11px] text-[#6c757d] leading-relaxed">
                Ünite isimleri, metinler, problem tipleri ve devlet kitaplarının pedagojik akışı incelenir.
              </p>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] rounded border border-[#dee2e6]">
              <div className="w-7 h-7 rounded bg-[#eaf7ed] text-[#28a745] flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h3 className="text-xs font-bold text-[#212529] mb-1">38 Haftalık Çalışma Takvimi</h3>
              <p className="text-[11px] text-[#6c757d] leading-relaxed">
                Her eğitim yılı sene başında güncellenir. Tatiller ve bayramlara göre haftalar ötelenir.
              </p>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] rounded border border-[#dee2e6]">
              <div className="w-7 h-7 rounded bg-[#f3eefb] text-[#6f42c1] flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <h3 className="text-xs font-bold text-[#212529] mb-1">Gemini AI Motoru</h3>
              <p className="text-[11px] text-[#6c757d] leading-relaxed">
                Bu 4 referansı birleştirerek zümre, yıllık plan ve ortak sınavı saniyeler içinde hatasız üretir.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#f8f9fa] border border-[#ced4da] rounded flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#28a745] shrink-0" />
              <p className="text-xs text-[#495057]">
                Öğretmenler her yıl yeniden evrak yazmak zorunda kalmaz. Okul türünün Talim Terbiye çizelgesi ve çalışma takvimi tarihleri dinamik olarak yerleşir.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModuleId("15_ai_agents")}
              className="px-3 py-1.5 rounded bg-[#6f42c1] hover:bg-[#5a32a3] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 shadow-xs"
            >
              AI Ajan Merkezine Git &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
