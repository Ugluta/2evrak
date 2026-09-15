import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  Bot,
  Play,
  Send,
  Cpu,
  History,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Share2,
  Copy,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CalendarDays,
  BookMarked,
  Sliders,
  Check,
  Zap,
} from "lucide-react";
import { AIAgent } from "../../types";

export const AiAgentsView: React.FC = () => {
  const {
    aiAgents,
    aiLogs,
    runAgent,
    addDocument,
    currentUser,
    setActiveModuleId,
    academicCalendar,
    gradeCurriculums,
    activeSubItemId,
  } = useApp();

  const [selectedAgentKey, setSelectedAgentKey] = useState<string>("dokuman_ajani");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("9");
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(4);
  const [checkedGrades, setCheckedGrades] = useState<string[]>(["5", "6", "7", "8"]);
  const [checkedLessons, setCheckedLessons] = useState<string[]>(["Türkçe", "Matematik", "Fen Bilimleri"]);
  const [isMultiCategoryMode, setIsMultiCategoryMode] = useState<boolean>(true);
  const [promptText, setPromptText] = useState<string>(
    "Ortaokul Türkçe ve seçilen diğer branşlar için 2025-2026 Yeni Maarif Modeli uyumlu çoklu zümre yıllık plan, kazanım tablosu ve ortak sınav soruları taslağı hazırla."
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastOutput, setLastOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync with sidebar sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("soru_uretici") || activeSubItemId.includes("Soru Üretici")) {
      setSelectedAgentKey("soru_ajani");
      setPromptText("10. Sınıf Biyoloji 'Hücre Bölünmeleri' konusunda 4 adet açık uçlu kazanım sorusu ve rubrik değerlendirme anahtarı üret.");
    } else if (activeSubItemId.includes("zumre_asistani") || activeSubItemId.includes("Zümre Toplantı")) {
      setSelectedAgentKey("dokuman_ajani");
      setPromptText("9. Sınıf Matematik 2. Dönem 1. Zümre Öğretmenler Kurulu Karar Tutanağı hazırla. Gündem maddeleri ve karar metni MEB formatında olsun.");
    } else if (activeSubItemId.includes("bep_planlayici") || activeSubItemId.includes("BEP")) {
      setSelectedAgentKey("dokuman_ajani");
      setPromptText("Kaynaştırma öğrencisi için 6. Sınıf Fen Bilimleri Bireyselleştirilmiş Eğitim Planı (BEP) aylık kazanım tablosu üret.");
    }
  }, [activeSubItemId]);

  const currentAgent = aiAgents.find((a) => a.key === selectedAgentKey) || aiAgents[0];

  const handleExecuteAgent = async () => {
    if (!promptText.trim() || isRunning) return;
    setIsRunning(true);
    setSaveSuccess(false);

    const activeGradeObj = gradeCurriculums.find((g) => g.gradeLevelId === selectedGradeId);
    const activeWeekObj = academicCalendar.weeks.find((w) => w.weekNumber === selectedWeekNumber);

    try {
      const result = await runAgent(selectedAgentKey, promptText, {
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
      setLastOutput(result);
    } catch (e: any) {
      setLastOutput("Hata oluştu: " + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(lastOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsDocument = () => {
    if (!lastOutput) return;

    addDocument({
      title: `AI Üretimi: ${currentAgent.name} Çıktısı`,
      slug: `ai-dokuman-${Date.now()}`,
      description: promptText.slice(0, 160),
      categoryId: "cat_zumre",
      docType: "Zümre Kararı",
      gradeLevel: "9. Sınıf",
      lesson: "Matematik",
      fileUrl: "https://storage.2evrak.com/ai/generated_evrak.docx",
      fileSize: "450 KB",
      fileExtension: "docx",
      status: "pending", // Sends to moderation queue automatically!
      authorId: currentUser.id,
      authorName: `${currentUser.fullName} (AI Destekli)`,
      accessLevel: "free",
      tags: ["yapay-zeka", "meb", currentAgent.key],
      seoTitle: `AI MEB Dokümanı - 2Evrak`,
      seoDescription: promptText.slice(0, 140),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Header */}
      <div className="bg-white border-l-4 border-l-[#6f42c1] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#6f42c1]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                AI / Ajan Merkezi (Gemini 2.5 Flash Destekli)
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#f3e8ff] text-[#6f42c1] font-bold border border-[#6f42c1]/30">
                9 MEB Uzman Ajanı
              </span>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Müfredat, sınav, zümre ve evrak üretim ajanları. Üretilen dokümanlar Kural 18 gereğince Moderasyon onay sürecine aktarılır.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveModuleId("16_moderation")}
              className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffc107]" />
              <span>Moderasyon Havuzuna Git</span>
            </button>
          </div>
        </div>
      </div>

      {/* AdminLTE Small Boxes Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#6f42c1] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{aiAgents.length}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Aktif MEB Ajanı</p>
          </div>
          <Bot className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Gemini 2.5 Flash Motoru</span>
        </div>

        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              %{Math.round(aiAgents.reduce((acc, a) => acc + a.accuracyRate, 0) / aiAgents.length)}
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Müfredat Doğruluk Oranı</p>
          </div>
          <CheckCircle className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Talim Terbiye Uyumlu</span>
        </div>

        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">
              {aiAgents.reduce((acc, a) => acc + a.runsCount, 0)}
            </div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Toplam Yapılan Çağrı</p>
          </div>
          <Cpu className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Öğretmen Evrak Üretimi</span>
        </div>

        <div className="bg-[#ffc107] text-[#1f2d3d] rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{aiLogs.length}</div>
            <p className="text-xs font-bold text-[#1f2d3d]/90 mt-0.5">Oturum Telemetri Kaydı</p>
          </div>
          <History className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-[#1f2d3d]/80 mt-2 font-mono">Kural 17 Denetim İzi</span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {aiAgents.map((agent) => {
          const isSelected = agent.key === selectedAgentKey;
          return (
            <button
              key={agent.key}
              type="button"
              onClick={() => {
                setSelectedAgentKey(agent.key);
                if (agent.key === "soru_ajani") {
                  setPromptText("10. Sınıf Biyoloji 'Hücre Bölünmeleri' konusunda 4 adet açık uçlu kazanım sorusu ve rubrik değerlendirme anahtarı üret.");
                } else if (agent.key === "dokuman_ajani") {
                  setPromptText("9. Sınıf Matematik 2. Dönem 1. Zümre Öğretmenler Kurulu Karar Tutanağı hazırla. Gündem maddeleri ve karar metni MEB formatında olsun.");
                } else if (agent.key === "icerik_ajani") {
                  setPromptText("11. Sınıf Tarih 'Milli Mücadele Dönemi' için öğretmen ders sunum özeti ve kavram haritası metni hazırla.");
                } else if (agent.key === "sosyal_ajani") {
                  setPromptText("Öğretmenler Günü yaklaşırken MEB öğretmenlerinin kullanabileceği zümre planlama tüyolarını içeren 3 tweetlik bir X zinciri ve Instagram metni yaz.");
                }
              }}
              className={`p-3 rounded text-left border transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-white border-2 border-[#6f42c1] shadow-xs"
                  : "bg-white border border-[#dee2e6] hover:bg-[#f8f9fa]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`p-1.5 rounded ${
                      isSelected ? "bg-[#6f42c1] text-white" : "bg-[#f8f9fa] text-[#6f42c1] border border-[#ced4da]"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-[#28a745] font-bold">
                    %{agent.accuracyRate}
                  </span>
                </div>
                <div className="font-bold text-xs text-[#212529] truncate">{agent.name}</div>
                <p className="text-[10px] text-[#6c757d] line-clamp-2 mt-1 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#dee2e6] flex items-center justify-between text-[10px] text-[#6c757d] font-mono">
                <span>{agent.runsCount} İşlem</span>
                <span className={isSelected ? "font-bold text-[#6f42c1]" : "text-[#007bff]"}>
                  {isSelected ? "Seçili" : "Seç"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Agent Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Prompt Editor (5 cols) */}
        <div className="lg:col-span-5 card card-outline card-primary bg-white border border-[#dee2e6] rounded shadow-xs p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
            <div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#6f42c1]" />
                <h3 className="text-sm font-bold text-[#212529]">{currentAgent.name}</h3>
              </div>
              <span className="text-[11px] text-[#6c757d]">Model: {currentAgent.model}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#f8f9fa] border border-[#ced4da] text-[#495057]">
              Maks {currentAgent.maxTokens} Token
            </span>
          </div>

          {/* MEB 13 Kademe & Takvim Bağlamı Seçicisi */}
          <div className="p-2.5 bg-[#f8f9fa] rounded border border-[#dee2e6] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#28a745] flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                MEB Takvim & Müfredat Referansı
              </span>
              <span className="text-[10px] text-[#6c757d] font-mono">
                {academicCalendar.academicYear}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#6c757d] font-semibold block mb-0.5">
                  Hedef Kademe (13 Sınıf)
                </label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => {
                    const gid = e.target.value;
                    setSelectedGradeId(gid);
                    const gr = gradeCurriculums.find((g) => g.gradeLevelId === gid);
                    const defaultLesson = gr?.lessons[0]?.lessonName || "Ders";
                    setPromptText(`${gr?.gradeName || gid + ". Sınıf"} ${defaultLesson} dersi için MEB çalışma takviminin ${selectedWeekNumber}. haftasına uygun yıllık/günlük plan ve kazanım evrakı hazırla.`);
                  }}
                  className="w-full bg-white border border-[#ced4da] rounded p-1 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
                >
                  {gradeCurriculums.map((g) => (
                    <option key={g.gradeLevelId} value={g.gradeLevelId}>
                      {g.gradeName} ({g.levelStage || g.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6c757d] font-semibold block mb-0.5">
                  Çalışma Takvimi Haftası
                </label>
                <select
                  value={selectedWeekNumber}
                  onChange={(e) => {
                    const wn = Number(e.target.value);
                    setSelectedWeekNumber(wn);
                    const gr = gradeCurriculums.find((g) => g.gradeLevelId === selectedGradeId);
                    const defaultLesson = gr?.lessons[0]?.lessonName || "Ders";
                    setPromptText(`${gr?.gradeName || selectedGradeId + ". Sınıf"} ${defaultLesson} dersi için MEB çalışma takviminin ${wn}. haftasına uygun yıllık/günlük plan ve kazanım evrakı hazırla.`);
                  }}
                  className="w-full bg-white border border-[#ced4da] rounded p-1 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
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

          {/* Multi-Category / Multi-Grade & Multi-Branch Checkboxes */}
          <div className="p-2.5 bg-[#f8f9fa] rounded border border-[#dee2e6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#ffc107] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Çoklu Sınıf & Zümre Seçimi (Toplu Evrak)
              </span>
              <button
                type="button"
                onClick={() => setIsMultiCategoryMode(!isMultiCategoryMode)}
                className="text-[10px] text-[#007bff] hover:underline font-semibold cursor-pointer"
              >
                {isMultiCategoryMode ? "Gizle" : "Göster"}
              </button>
            </div>

            {isMultiCategoryMode && (
              <div className="space-y-2 pt-1 border-t border-[#dee2e6]">
                <div>
                  <div className="text-[10px] text-[#6c757d] font-semibold mb-1">Hedef Sınıflar:</div>
                  <div className="flex flex-wrap gap-1">
                    {["5", "6", "7", "8", "9", "10", "11", "12"].map((gid) => {
                      const isChecked = checkedGrades.includes(gid);
                      const gObj = gradeCurriculums.find((g) => g.gradeLevelId === gid);
                      return (
                        <button
                          key={gid}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setCheckedGrades(checkedGrades.filter((id) => id !== gid));
                            } else {
                              setCheckedGrades([...checkedGrades, gid]);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all border cursor-pointer ${
                            isChecked
                              ? "bg-[#ffc107] text-[#1f2d3d] border-[#e0a800]"
                              : "bg-white border-[#ced4da] text-[#495057] hover:bg-[#e9ecef]"
                          }`}
                        >
                          {isChecked ? "✓ " : ""}{gObj?.gradeName || `${gid}. Sınıf`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#6c757d] font-semibold mb-1">Dersler / Zümreler:</div>
                  <div className="flex flex-wrap gap-1">
                    {["Türkçe", "Matematik", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Din Kültürü", "Tarih", "Coğrafya", "Fizik", "Kimya", "Biyoloji"].map((lesson) => {
                      const isChecked = checkedLessons.includes(lesson);
                      return (
                        <button
                          key={lesson}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setCheckedLessons(checkedLessons.filter((l) => l !== lesson));
                            } else {
                              setCheckedLessons([...checkedLessons, lesson]);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all border cursor-pointer ${
                            isChecked
                              ? "bg-[#6f42c1] text-white border-[#6f42c1]"
                              : "bg-white border-[#ced4da] text-[#495057] hover:bg-[#e9ecef]"
                          }`}
                        >
                          {isChecked ? "✓ " : ""}{lesson}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Öğretmen İstemi / Görev Tarifi:
            </label>
            <textarea
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ajan için MEB dersi, sınıf, konu ve format yönergelerini yazın..."
              className="w-full bg-white border border-[#ced4da] rounded p-2.5 text-xs text-[#495057] focus:outline-none focus:border-[#6f42c1] leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleExecuteAgent}
            disabled={isRunning}
            className="w-full py-2 rounded bg-[#6f42c1] hover:bg-[#59359a] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini Motoru Çalışıyor...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Ajanı Çalıştır & İçerik Üret</span>
              </>
            )}
          </button>
        </div>

        {/* Right: AI Output Console & Direct Pipeline (7 cols) */}
        <div className="lg:col-span-7 card card-outline card-success bg-white border border-[#dee2e6] rounded shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#28a745]" />
                <h3 className="text-sm font-bold text-[#212529]">Üretilen Çıktı & Önizleme</h3>
              </div>

              {lastOutput && (
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[11px] text-[#495057] font-semibold transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? "Kopyalandı!" : "Kopyala"}</span>
                </button>
              )}
            </div>

            <div className="mt-3">
              {isRunning ? (
                <div className="h-80 flex flex-col items-center justify-center space-y-2 text-[#6c757d]">
                  <div className="w-7 h-7 rounded-full border-2 border-[#6f42c1] border-t-transparent animate-spin" />
                  <div className="text-xs font-semibold">MEB Müfredatına ve kazanımlara göre taranıyor...</div>
                  <div className="text-[10px] text-[#adb5bd]">Gemini 2.5 Flash API Çağrısı Aktif</div>
                </div>
              ) : lastOutput ? (
                <div className="h-96 overflow-y-auto bg-[#f8f9fa] rounded p-3.5 border border-[#dee2e6] font-mono text-xs text-[#212529] whitespace-pre-wrap leading-relaxed custom-scrollbar">
                  {lastOutput}
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center space-y-2 text-[#6c757d] border border-dashed border-[#dee2e6] rounded p-6 text-center">
                  <Bot className="w-10 h-10 text-[#adb5bd]" />
                  <div className="text-xs font-bold text-[#495057]">
                    Henüz bir ajan çalıştırılmadı.
                  </div>
                  <p className="text-[11px] text-[#6c757d] max-w-sm">
                    Sol panelden bir MEB ajanı seçip yönergenizi yazarak çalıştırın. Üretilen doküman doğrudan moderasyona aktarılabilir.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          {lastOutput && (
            <div className="mt-3 pt-2.5 border-t border-[#dee2e6] flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-[11px] text-[#856404] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ffc107] shrink-0" />
                <span>Kural 18: AI çıktıları onay için Moderasyon Merkezine iletilir.</span>
              </div>

              <div className="flex items-center gap-2">
                {saveSuccess ? (
                  <span className="text-xs text-[#28a745] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Moderasyon Havuzuna Eklendi!
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveAsDocument}
                    className="px-3.5 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Evrak Olarak Kaydet & Moderasyona İlet</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution Logs */}
      <div className="card card-outline card-secondary bg-white border border-[#dee2e6] rounded shadow-xs p-4">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#dee2e6]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#6c757d]" />
            <h3 className="text-xs font-bold text-[#212529] uppercase tracking-wider">
              Ajan Çalıştırma Kayıtları & Token Telemetrisi
            </h3>
          </div>
          <span className="text-[11px] text-[#6c757d] font-mono">
            {aiLogs.length} Kayıt Bulundu
          </span>
        </div>

        {aiLogs.length === 0 ? (
          <div className="text-xs text-[#6c757d] py-3 text-center">
            Bu oturumda henüz ajan çalıştırma kaydı bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-[#dee2e6] text-xs">
            {aiLogs.map((log) => (
              <div key={log.id} className="py-2 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#6f42c1]">{log.agentKey}</span>
                    <span className="text-[10px] text-[#6c757d]">{log.createdAt}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#eaf7ed] text-[#28a745] text-[10px] font-mono font-semibold">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[#6c757d] truncate text-[11px] mt-0.5">{log.prompt}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[#212529] font-mono text-[11px] font-bold">
                    {log.tokensUsed} Token
                  </span>
                  <div className="text-[10px] text-[#6c757d] font-mono">Gemini 2.5 Flash</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
