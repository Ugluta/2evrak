import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  Layers,
  FileSpreadsheet,
  Printer,
  Share2,
  X,
  FileCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

export interface WrittenExamItem {
  id: string;
  title: string;
  gradeLevel: string;
  lesson: string;
  term: "1. Dönem 1. Yazılı" | "1. Dönem 2. Yazılı (Ortak)" | "2. Dönem 1. Yazılı" | "2. Dönem 2. Yazılı (Ortak)";
  examType: "Açık Uçlu (Senaryo 1)" | "Açık Uçlu (Senaryo 2)" | "Açık Uçlu (Senaryo 3)" | "Karma (Açık Uçlu + Çoktan Seçmeli)" | "MEB Ülke Geneli Ortak Sınav";
  questionCount: number;
  hasAnswerKey: boolean;
  hasRubric: boolean;
  fileFormat: "docx" | "pdf";
  downloads: number;
  author: string;
  schoolType: string;
  publishedDate: string;
  isMebOfficialScenario: boolean;
  sampleQuestions: {
    questionNo: number;
    text: string;
    points: number;
    answer: string;
    learningOutcome: string;
  }[];
}

const INITIAL_WRITTEN_EXAMS: WrittenExamItem[] = [
  {
    id: "exam_1",
    title: "7. Sınıf Türkçe 1. Dönem 1. Ortak Yazılı Sınavı",
    gradeLevel: "7. Sınıf",
    lesson: "Türkçe",
    term: "1. Dönem 1. Yazılı",
    examType: "Açık Uçlu (Senaryo 1)",
    questionCount: 8,
    hasAnswerKey: true,
    hasRubric: true,
    fileFormat: "docx",
    downloads: 4120,
    author: "Zeynep Öğretmen (MEB Türkçe Zümresi)",
    schoolType: "Devlet Ortaokulu",
    publishedDate: "2025-10-14",
    isMebOfficialScenario: true,
    sampleQuestions: [
      {
        questionNo: 1,
        text: "Metindeki altı çizili deyimin anlamını metnin bağlamından hareketle açıklayınız ve bu deyimi bir cümlede kullanınız.",
        points: 15,
        answer: "Deyim: 'Göze girmek'. Anlamı: Davranışlarıyla birinin sevgi ve güvenini kazanmak. Cümle: 'Çalışkanlığıyla kısa sürede öğretmenlerinin gözüne girdi.'",
        learningOutcome: "T.7.3.5. Bağlamdan yararlanarak bilmediği kelime ve kelime gruplarının anlamını tahmin eder.",
      },
      {
        questionNo: 2,
        text: "Yazarın metinde savunduğu ana düşünceyi iki cümleyle ifade ediniz.",
        points: 15,
        answer: "Metinde dostluk ilişkilerinin güven ve samimiyet temeline dayandığı, zor günlerde gösterilen vefanın gerçek arkadaşlığı belirlediği vurgulanmaktadır.",
        learningOutcome: "T.7.3.16. Metnin ana fikrini/ana duygusunu belirler.",
      },
      {
        questionNo: 3,
        text: "Aşağıdaki fiillerin anlam özelliklerini (iş, oluş, durum) belirleyerek karşılarına yazınız: (Gülmek, Sararmak, Taşımak, Uyumak).",
        points: 20,
        answer: "Gülmek: Durum fiili | Sararmak: Oluş fiili | Taşımak: İş (kılış) fiili | Uyumak: Durum fiili.",
        learningOutcome: "T.7.3.9. Fiillerin anlam özelliklerini kavrar.",
      },
    ],
  },
  {
    id: "exam_2",
    title: "9. Sınıf Matematik 1. Dönem 2. Ülke Geneli Ortak Yazılı Sınavı",
    gradeLevel: "9. Sınıf",
    lesson: "Matematik",
    term: "1. Dönem 2. Yazılı (Ortak)",
    examType: "MEB Ülke Geneli Ortak Sınav",
    questionCount: 10,
    hasAnswerKey: true,
    hasRubric: true,
    fileFormat: "docx",
    downloads: 6850,
    author: "ÖDSGM / MEB Matematik Komisyonu",
    schoolType: "Anadolu Lisesi",
    publishedDate: "2025-12-20",
    isMebOfficialScenario: true,
    sampleQuestions: [
      {
        questionNo: 1,
        text: "p: '√9 bir rasyonel sayıdır.', q: 'En küçük asal sayı 1'dir.' önermeleri veriliyor. Buna göre (p ∧ q')' önermesinin doğruluk değerini işlem basamaklarını göstererek bulunuz.",
        points: 10,
        answer: "p ≡ 1 (çünkü √9=3 rasyoneldir), q ≡ 0 (en küçük asal sayı 2'dir). q' ≡ 1 olur. (1 ∧ 1)' ≡ 1' ≡ 0. Doğruluk değeri 0'dır.",
        learningOutcome: "9.1.1. Mantık ve bileşik önermeler.",
      },
      {
        questionNo: 2,
        text: "A = {x | -3 < x ≤ 5, x ∈ Z} ve B = {x | x = 2k, k ∈ Z} kümeleri için s(A ∩ B) kaçtır? Küme elemanlarını listeleyerek çözünüz.",
        points: 10,
        answer: "A = {-2, -1, 0, 1, 2, 3, 4, 5}. B çift tam sayılar kümesidir. A ∩ B = {-2, 0, 2, 4}. Dolayısıyla s(A ∩ B) = 4'tür.",
        learningOutcome: "9.1.2. Kümelerde kesişim ve birleşim işlemleri.",
      },
    ],
  },
  {
    id: "exam_3",
    title: "6. Sınıf Sosyal Bilgiler 1. Dönem 1. Yazılı Sınavı",
    gradeLevel: "6. Sınıf",
    lesson: "Sosyal Bilgiler",
    term: "1. Dönem 1. Yazılı",
    examType: "Açık Uçlu (Senaryo 2)",
    questionCount: 8,
    hasAnswerKey: true,
    hasRubric: true,
    fileFormat: "docx",
    downloads: 3290,
    author: "Murat Hoca (Sosyal Zümresi)",
    schoolType: "Devlet Ortaokulu",
    publishedDate: "2025-10-18",
    isMebOfficialScenario: true,
    sampleQuestions: [
      {
        questionNo: 1,
        text: "Rol ve sorumluluk kavramlarını birer örnekle açıklayarak aralarındaki ilişkiyi belirtiniz.",
        points: 20,
        answer: "Rol: Bir grup veya toplumda üstlendiğimiz görevdir (Örn: Öğrenci olmak). Sorumluluk: Üstlendiğimiz rolün gerektirdiği görevleri yerine getirmektir (Örn: Ders çalışmak, ödev yapmak).",
        learningOutcome: "SB.6.1.1. Bir parçası olduğu gruplar ile bu gruplardaki rolleri arasındaki ilişkiyi analiz eder.",
      },
    ],
  },
  {
    id: "exam_4",
    title: "8. Sınıf Fen Bilimleri 1. Dönem 2. Yazılı (LGS & Ortak Sınav Formatı)",
    gradeLevel: "8. Sınıf",
    lesson: "Fen Bilimleri",
    term: "1. Dönem 2. Yazılı (Ortak)",
    examType: "Açık Uçlu (Senaryo 1)",
    questionCount: 8,
    hasAnswerKey: true,
    hasRubric: true,
    fileFormat: "docx",
    downloads: 5410,
    author: "Fen Öğretmenleri Ağı",
    schoolType: "Devlet Ortaokulu",
    publishedDate: "2025-12-15",
    isMebOfficialScenario: true,
    sampleQuestions: [
      {
        questionNo: 1,
        text: "Dünya'nın Güneş etrafında dolanırken eksen eğikliğine bağlı olarak mevsimlerin nasıl oluştuğunu şekil çizerek kısaca açıklayınız.",
        points: 25,
        answer: "23° 27' eksen eğikliği nedeniyle Güneş ışınlarının yeryüzüne düşme açısı yıl boyunca değişir. Işınların dik geldiği yarım kürede yaz, eğik geldiği yarım kürede kış mevsimi yaşanır.",
        learningOutcome: "F.8.1.1. Mevsimlerin oluşumuna yönelik tahminlerde bulunur.",
      },
    ],
  },
  {
    id: "exam_5",
    title: "10. Sınıf Tarih 1. Dönem 2. MEB Ortak Yazılı Sınavı",
    gradeLevel: "10. Sınıf",
    lesson: "Tarih",
    term: "1. Dönem 2. Yazılı (Ortak)",
    examType: "MEB Ülke Geneli Ortak Sınav",
    questionCount: 10,
    hasAnswerKey: true,
    hasRubric: true,
    fileFormat: "pdf",
    downloads: 4180,
    author: "MEB Ölçme ve Değerlendirme",
    schoolType: "Anadolu Lisesi",
    publishedDate: "2025-12-22",
    isMebOfficialScenario: true,
    sampleQuestions: [
      {
        questionNo: 1,
        text: "Kösedağ Savaşı'nın (1243) Anadolu Türk siyasi birliği üzerindeki etkilerini iki maddeyle yazınız.",
        points: 20,
        answer: "1) Türkiye Selçuklu Devleti Moğol hakimiyetine girmiş ve yıkılış sürecine girmiştir. 2) Anadolu'da ikinci beylikler dönemi başlamış ve Anadolu Türk siyasi birliği parçalanmıştır.",
        learningOutcome: "TAR.10.2.1. Anadolu'daki Moğol istilasının sonuçlarını değerlendirir.",
      },
    ],
  },
  {
    id: "exam_6",
    title: "11. Sınıf Türk Dili ve Edebiyatı 2. Dönem 1. Yazılı Sınavı",
    gradeLevel: "11. Sınıf",
    lesson: "Edebiyat",
    term: "2. Dönem 1. Yazılı",
    examType: "Açık Uçlu (Senaryo 2)",
    questionCount: 7,
    hasAnswerKey: true,
    hasRubric: true,
    fileFormat: "docx",
    downloads: 2790,
    author: "Edebiyat Zümresi",
    schoolType: "Anadolu Lisesi",
    publishedDate: "2026-03-24",
    isMebOfficialScenario: true,
    sampleQuestions: [
      {
        questionNo: 1,
        text: "Milli Edebiyat Dönemi şiirinin dil, tema ve ölçü özelliklerini üç madde halinde açıklayınız.",
        points: 25,
        answer: "1) Sade, halkın konuştuğu Türkçe esas alınmıştır. 2) Hece ölçüsü kullanılmıştır. 3) Anadolu insanı, yurt sevgisi ve milli mücadele konuları işlenmiştir.",
        learningOutcome: "EDB.11.2. Milli Edebiyat dönemi şiir tahlili.",
      },
    ],
  },
];

export const WrittenExamsView: React.FC = () => {
  const { navigateToModule } = useApp();

  const [exams, setExams] = useState<WrittenExamItem[]>(INITIAL_WRITTEN_EXAMS);
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("all");
  const [selectedScenario, setSelectedScenario] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewExam, setPreviewExam] = useState<WrittenExamItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // New Exam Form State
  const [newTitle, setNewTitle] = useState("");
  const [newGrade, setNewGrade] = useState("7. Sınıf");
  const [newLesson, setNewLesson] = useState("Türkçe");
  const [newTerm, setNewTerm] = useState<WrittenExamItem["term"]>("1. Dönem 1. Yazılı");
  const [newScenario, setNewScenario] = useState<WrittenExamItem["examType"]>("Açık Uçlu (Senaryo 1)");
  const [newQuestionsCount, setNewQuestionsCount] = useState(8);

  const handleDownload = (exam: WrittenExamItem, format: "docx" | "pdf") => {
    setDownloadSuccessToast(`"${exam.title}" (${format.toUpperCase()}) dosyası ve MEB rubrik baremi başarıyla indirildi.`);
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newExam: WrittenExamItem = {
      id: `exam_${Date.now()}`,
      title: newTitle,
      gradeLevel: newGrade,
      lesson: newLesson,
      term: newTerm,
      examType: newScenario,
      questionCount: Number(newQuestionsCount),
      hasAnswerKey: true,
      hasRubric: true,
      fileFormat: "docx",
      downloads: 1,
      author: "Süper Yönetici / Baieco",
      schoolType: "MEB Resmi Okul",
      publishedDate: new Date().toISOString().split("T")[0],
      isMebOfficialScenario: true,
      sampleQuestions: [
        {
          questionNo: 1,
          text: "MEB Konu Soru Dağılım Tablosu 1. Kazanım Açık Uçlu Soru Taslağı.",
          points: 20,
          answer: "Öğrencinin kazanımı tam kavradığını gösteren gerekçeli örnek cevabı.",
          learningOutcome: `${newLesson} temel ünite kazanımı.`,
        },
      ],
    };

    setExams([newExam, ...exams]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setDownloadSuccessToast("Yeni yazılı sınavı ve soru dağılım tablosu sisteme eklendi!");
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  // Filter logic
  const filteredExams = exams.filter((exam) => {
    const matchesTerm = selectedTerm === "all" || exam.term === selectedTerm;
    const matchesGrade = selectedGrade === "all" || exam.gradeLevel === selectedGrade;
    const matchesLesson = selectedLesson === "all" || exam.lesson === selectedLesson;
    const matchesScenario = selectedScenario === "all" || exam.examType === selectedScenario;
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.lesson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTerm && matchesGrade && matchesLesson && matchesScenario && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {downloadSuccessToast && (
        <div className="bg-[#28a745] text-white px-4 py-3 rounded shadow-md flex items-center justify-between text-sm transition-all animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{downloadSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccessToast(null)}
            className="text-white hover:opacity-80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AdminLTE Callout Box */}
      <div className="bg-white border-l-4 border-[#007bff] p-4 rounded shadow-xs">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#007bff] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                MEB 2025-2026 UYUMLU
              </span>
              <h2 className="text-base font-bold text-[#212529]">
                Yazılı & Ortak Sınav Soruları Havuzu (Senaryo 1 - 2 - 3)
              </h2>
            </div>
            <p className="text-xs text-[#6c757d]">
              Milli Eğitim Bakanlığı Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü (ÖDSGM) tarafından yayımlanan konu-soru dağılım tablolarına tam uyumludur. Açık uçlu sorular, rubrik puanlama baremleri ve düzenlenebilir Word (.docx) formatı içermektedir.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateToModule("15_ai_agents", "MEB Soru Üretici Ajanı")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#6f42c1] hover:bg-[#59339d] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Soru Üretici</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Yazılı Yükle</span>
            </button>
          </div>
        </div>
      </div>

      {/* AdminLTE Small Boxes / Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Info Box 1 */}
        <div className="bg-[#17a2b8] text-white rounded shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black">482</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-90">
                1. Dönem 1. Yazılılar
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">Açık Uçlu Sınıf Sınavları</div>
            </div>
            <FileSpreadsheet className="w-10 h-10 opacity-30" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedTerm("1. Dönem 1. Yazılı")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-[11px] py-1 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>Filtrele</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Info Box 2 */}
        <div className="bg-[#28a745] text-white rounded shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black">216</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-90">
                MEB Ortak Sınavlar
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">1. Dönem 2. Yazılı (Ülke/İl)</div>
            </div>
            <Award className="w-10 h-10 opacity-30" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedTerm("1. Dönem 2. Yazılı (Ortak)")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-[11px] py-1 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>Filtrele</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Info Box 3 */}
        <div className="bg-[#ffc107] text-[#212529] rounded shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black">340</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-90">
                2. Dönem Yazılıları
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">Bahar Dönemi Senaryoları</div>
            </div>
            <Calendar className="w-10 h-10 opacity-30" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedTerm("2. Dönem 1. Yazılı")}
            className="w-full bg-black/10 hover:bg-black/20 text-[#212529] text-[11px] py-1 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>Filtrele</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Info Box 4 */}
        <div className="bg-[#dc3545] text-white rounded shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black">3,850+</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-90">
                Soru & Çözüm Bankası
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">Cevap Anahtarı & Rubrikler</div>
            </div>
            <CheckCircle2 className="w-10 h-10 opacity-30" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedTerm("all")}
            className="w-full bg-black/15 hover:bg-black/25 text-white text-[11px] py-1 px-3 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
          >
            <span>Tümünü Göster</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* AdminLTE Card: Filtreleme & Arama Araç Çubuğu */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs">
        <div className="p-3 border-b border-[#dee2e6] flex flex-wrap items-center justify-between gap-3 bg-[#f8f9fa]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#007bff]" />
            <span className="text-xs font-bold text-[#343a40] uppercase tracking-wider">
              Sınav Filtreleme ve Arama
            </span>
          </div>

          {(selectedTerm !== "all" || selectedGrade !== "all" || selectedLesson !== "all" || selectedScenario !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTerm("all");
                setSelectedGrade("all");
                setSelectedLesson("all");
                setSelectedScenario("all");
                setSearchQuery("");
              }}
              className="text-[11px] text-[#007bff] hover:underline font-semibold cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          )}
        </div>

        <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Arama Input */}
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-[11px] font-semibold text-[#495057] mb-1">Kelime Ara:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: 7. Sınıf Türkçe..."
                className="w-full bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          {/* Sınav Dönemi */}
          <div>
            <label className="block text-[11px] font-semibold text-[#495057] mb-1">Dönem & Sınav:</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Dönemler</option>
              <option value="1. Dönem 1. Yazılı">1. Dönem 1. Yazılı</option>
              <option value="1. Dönem 2. Yazılı (Ortak)">1. Dönem 2. Yazılı (Ortak)</option>
              <option value="2. Dönem 1. Yazılı">2. Dönem 1. Yazılı</option>
              <option value="2. Dönem 2. Yazılı (Ortak)">2. Dönem 2. Yazılı (Ortak)</option>
            </select>
          </div>

          {/* Sınıf Kademe */}
          <div>
            <label className="block text-[11px] font-semibold text-[#495057] mb-1">Sınıf Kademesi:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Sınıflar</option>
              <option value="5. Sınıf">5. Sınıf</option>
              <option value="6. Sınıf">6. Sınıf (MEB Ortak)</option>
              <option value="7. Sınıf">7. Sınıf</option>
              <option value="8. Sınıf">8. Sınıf (LGS)</option>
              <option value="9. Sınıf">9. Sınıf</option>
              <option value="10. Sınıf">10. Sınıf (MEB Ortak)</option>
              <option value="11. Sınıf">11. Sınıf</option>
              <option value="12. Sınıf">12. Sınıf (YKS)</option>
            </select>
          </div>

          {/* Ders Seçici */}
          <div>
            <label className="block text-[11px] font-semibold text-[#495057] mb-1">Ders / Branş:</label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Dersler</option>
              <option value="Türkçe">Türkçe</option>
              <option value="Matematik">Matematik</option>
              <option value="Fen Bilimleri">Fen Bilimleri</option>
              <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
              <option value="Tarih">Tarih</option>
              <option value="Edebiyat">Türk Dili ve Edebiyatı</option>
              <option value="İngilizce">İngilizce</option>
              <option value="Din Kültürü">Din Kültürü ve Ahlak Bilgisi</option>
            </select>
          </div>

          {/* Senaryo Tipi */}
          <div>
            <label className="block text-[11px] font-semibold text-[#495057] mb-1">Senaryo / Soru Tipi:</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Senaryolar</option>
              <option value="Açık Uçlu (Senaryo 1)">Senaryo 1 (Temel Açık Uçlu)</option>
              <option value="Açık Uçlu (Senaryo 2)">Senaryo 2 (Gelişmiş Açık Uçlu)</option>
              <option value="Açık Uçlu (Senaryo 3)">Senaryo 3 (Analiz / Beceri)</option>
              <option value="MEB Ülke Geneli Ortak Sınav">MEB Ülke Geneli Ortak Sınav</option>
            </select>
          </div>
        </div>
      </div>

      {/* AdminLTE Card: Sınav Listesi Tablosu */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#007bff]" />
            <h3 className="text-sm font-bold text-[#212529]">
              Yazılı Sınav Evrakları ve Soru Setleri ({filteredExams.length})
            </h3>
          </div>
          <span className="text-xs text-[#6c757d] font-mono">
            Gösterilen: {filteredExams.length} / Toplam: {exams.length}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f6f9] border-b border-[#dee2e6] text-[#495057] font-semibold">
                <th className="p-3">Sınav Başlığı & Detay</th>
                <th className="p-3">Sınıf & Ders</th>
                <th className="p-3">Dönem</th>
                <th className="p-3">Senaryo / Soru Tipi</th>
                <th className="p-3">Durum & Baremler</th>
                <th className="p-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6]">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6c757d]">
                    <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold">Seçilen filtrelere uygun yazılı sınavı bulunamadı.</p>
                    <p className="text-[11px] mt-1">Filtreleri temizleyebilir veya "Yeni Yazılı Yükle" butonuyla yeni evrak ekleyebilirsiniz.</p>
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-[#f8f9fa] transition-colors group">
                    {/* Başlık & Detay */}
                    <td className="p-3">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase font-mono shrink-0 mt-0.5 ${
                            exam.fileFormat === "docx"
                              ? "bg-[#007bff]/10 text-[#007bff] border border-[#007bff]/20"
                              : "bg-[#dc3545]/10 text-[#dc3545] border border-[#dc3545]/20"
                          }`}
                        >
                          {exam.fileFormat.toUpperCase()}
                        </span>
                        <div>
                          <div className="font-bold text-[#212529] group-hover:text-[#007bff] transition-colors">
                            {exam.title}
                          </div>
                          <div className="text-[11px] text-[#6c757d] flex items-center gap-2 mt-0.5">
                            <span>Yazar: {exam.author}</span>
                            <span>•</span>
                            <span>{exam.schoolType}</span>
                            <span>•</span>
                            <span className="font-mono">{exam.downloads.toLocaleString()} İndirme</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sınıf & Ders */}
                    <td className="p-3">
                      <div className="font-semibold text-[#212529]">{exam.lesson}</div>
                      <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#e9ecef] text-[#495057] font-medium mt-0.5">
                        {exam.gradeLevel}
                      </span>
                    </td>

                    {/* Dönem */}
                    <td className="p-3">
                      <span className="text-[11px] font-medium text-[#495057] bg-[#f8f9fa] border border-[#ced4da] px-2 py-0.5 rounded">
                        {exam.term}
                      </span>
                    </td>

                    {/* Senaryo / Soru Tipi */}
                    <td className="p-3">
                      <div className="font-medium text-[#212529] text-[11px]">{exam.examType}</div>
                      <div className="text-[10px] text-[#6c757d] mt-0.5 font-mono">
                        {exam.questionCount} Açık Uçlu Soru
                      </div>
                    </td>

                    {/* Baremler */}
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#28a745] bg-[#28a745]/10 px-2 py-0.5 rounded w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Cevap Anahtarı Dahil
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#17a2b8] bg-[#17a2b8]/10 px-2 py-0.5 rounded w-fit">
                          <FileCheck className="w-3 h-3" />
                          Puanlama Baremi (Rubrik)
                        </span>
                      </div>
                    </td>

                    {/* Aksiyonlar */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewExam(exam)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Sınavı Önizle"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#007bff]" />
                          <span>İncele</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(exam, "docx")}
                          className="px-2.5 py-1 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Düzenlenebilir Word (.docx) formatında indir"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Word İndir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer */}
        <div className="p-3 bg-[#f8f9fa] border-t border-[#dee2e6] text-xs text-[#6c757d] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#28a745]" />
            <span>Tüm sınavlar MEB Maarif Modeli ve ÖDSGM sınav yönergelerine uygundur.</span>
          </div>
          <div className="text-[11px] font-mono">
            Sınav Formatı: Word (.docx) / MEB Başlıklı & Filigransız Temiz Çıktı
          </div>
        </div>
      </div>

      {/* Sınav Önizleme Modalı */}
      {previewExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#dee2e6]">
            {/* Modal Header */}
            <div className="bg-[#343a40] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono bg-[#007bff] px-2 py-0.5 rounded font-bold uppercase">
                  {previewExam.gradeLevel} • {previewExam.lesson}
                </span>
                <h3 className="text-base font-bold mt-1 text-white">{previewExam.title}</h3>
                <p className="text-xs text-gray-300">
                  {previewExam.term} — {previewExam.examType} ({previewExam.questionCount} Soru)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewExam(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar bg-[#f8f9fa]">
              <div className="bg-white p-3.5 rounded border border-[#dee2e6] shadow-2xs space-y-2">
                <div className="text-xs font-bold text-[#343a40] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#dee2e6] pb-2">
                  <FileCheck className="w-4 h-4 text-[#007bff]" />
                  <span>Sınav Yönergesi & Konu-Soru Dağılım Uyumu</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#495057]">
                  <div><strong>Okul Tipi:</strong> {previewExam.schoolType}</div>
                  <div><strong>Yayımlayan:</strong> {previewExam.author}</div>
                  <div><strong>Puanlama:</strong> 100 Puan Üzerinden (Rubrikli)</div>
                  <div><strong>Tarih:</strong> {previewExam.publishedDate}</div>
                </div>
              </div>

              {/* Sample Questions & Answers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#343a40] uppercase tracking-wider">
                  Örnek Açık Uçlu Sorular ve Cevap Anahtarları:
                </h4>

                {previewExam.sampleQuestions.map((q) => (
                  <div key={q.questionNo} className="bg-white p-4 rounded border border-[#dee2e6] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#dee2e6]">
                      <span className="font-bold text-xs text-[#007bff]">
                        Soru {q.questionNo} ({q.points} Puan)
                      </span>
                      <span className="text-[10px] text-[#6c757d] font-mono bg-[#f4f6f9] px-2 py-0.5 rounded">
                        Kazanım: {q.learningOutcome}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#212529] leading-relaxed">
                      {q.text}
                    </p>

                    <div className="bg-[#e8f4ff] p-2.5 rounded border border-[#b8daff] text-xs space-y-1">
                      <div className="font-bold text-[#004085] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cevap Anahtarı & Rubrik Puanlama:</span>
                      </div>
                      <p className="text-[#004085] text-[11px] leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-[#dee2e6] flex items-center justify-between">
              <span className="text-xs text-[#6c757d]">
                Word dosyasında okul adı ve öğretmen bilgileri düzenlenebilir durumdadır.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewExam(null)}
                  className="px-3 py-1.5 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold cursor-pointer"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownload(previewExam, "docx");
                    setPreviewExam(null);
                  }}
                  className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Word (.docx) İndir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Yazılı Sınavı Yükleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-[#dee2e6]">
            <div className="bg-[#343a40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#007bff]" />
                <h3 className="text-sm font-bold text-white">Yeni Yazılı Sınavı Evrakı Ekle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#495057] mb-1">Sınav Başlığı:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: 8. Sınıf Matematik 1. Dönem 1. Ortak Yazılı Sınavı"
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#495057] mb-1">Sınıf:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="5. Sınıf">5. Sınıf</option>
                    <option value="6. Sınıf">6. Sınıf</option>
                    <option value="7. Sınıf">7. Sınıf</option>
                    <option value="8. Sınıf">8. Sınıf</option>
                    <option value="9. Sınıf">9. Sınıf</option>
                    <option value="10. Sınıf">10. Sınıf</option>
                    <option value="11. Sınıf">11. Sınıf</option>
                    <option value="12. Sınıf">12. Sınıf</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#495057] mb-1">Ders:</label>
                  <select
                    value={newLesson}
                    onChange={(e) => setNewLesson(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="Türkçe">Türkçe</option>
                    <option value="Matematik">Matematik</option>
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                    <option value="Tarih">Tarih</option>
                    <option value="Edebiyat">Türk Dili ve Edebiyatı</option>
                    <option value="İngilizce">İngilizce</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#495057] mb-1">Dönem:</label>
                  <select
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value as WrittenExamItem["term"])}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="1. Dönem 1. Yazılı">1. Dönem 1. Yazılı</option>
                    <option value="1. Dönem 2. Yazılı (Ortak)">1. Dönem 2. Yazılı (Ortak)</option>
                    <option value="2. Dönem 1. Yazılı">2. Dönem 1. Yazılı</option>
                    <option value="2. Dönem 2. Yazılı (Ortak)">2. Dönem 2. Yazılı (Ortak)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#495057] mb-1">Senaryo / Format:</label>
                  <select
                    value={newScenario}
                    onChange={(e) => setNewScenario(e.target.value as WrittenExamItem["examType"])}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                  >
                    <option value="Açık Uçlu (Senaryo 1)">Açık Uçlu (Senaryo 1)</option>
                    <option value="Açık Uçlu (Senaryo 2)">Açık Uçlu (Senaryo 2)</option>
                    <option value="Açık Uçlu (Senaryo 3)">Açık Uçlu (Senaryo 3)</option>
                    <option value="MEB Ülke Geneli Ortak Sınav">MEB Ülke Geneli Ortak Sınav</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#495057] mb-1">Soru Sayısı:</label>
                <input
                  type="number"
                  min={4}
                  max={20}
                  value={newQuestionsCount}
                  onChange={(e) => setNewQuestionsCount(Number(e.target.value))}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="p-3 bg-[#e8f4ff] rounded border border-[#b8daff] text-[11px] text-[#004085]">
                ✓ Cevap anahtarı ve puanlama rubriği otomatik olarak sınava eklenecektir.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold cursor-pointer"
                >
                  Sınavı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
