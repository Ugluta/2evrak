import React, { useState } from "react";
import {
  CalendarDays,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";

interface AnnualPlanItem {
  id: string;
  title: string;
  grade: string;
  lesson: string;
  totalWeeks: number;
  weeklyHours: number;
  isMaarifModel: boolean;
  fileFormat: "docx" | "pdf";
  downloads: number;
  author: string;
}

const INITIAL_ANNUAL_PLANS: AnnualPlanItem[] = [
  {
    id: "plan_1",
    title: "5. Sınıf Türkçe Maarif Modeli Yıllık Ders Planı (36 Hafta)",
    grade: "5. Sınıf",
    lesson: "Türkçe",
    totalWeeks: 36,
    weeklyHours: 6,
    isMaarifModel: true,
    fileFormat: "docx",
    downloads: 7420,
    author: "MEB Türkçe Komisyonu",
  },
  {
    id: "plan_2",
    title: "9. Sınıf Matematik Yeni Müfredat Yıllık Çerçeve Planı",
    grade: "9. Sınıf",
    lesson: "Matematik",
    totalWeeks: 36,
    weeklyHours: 6,
    isMaarifModel: true,
    fileFormat: "docx",
    downloads: 8190,
    author: "Matematik Zümreler Birliği",
  },
  {
    id: "plan_3",
    title: "7. Sınıf Fen Bilimleri Yıllık Planı & Deney Takvimi",
    grade: "7. Sınıf",
    lesson: "Fen Bilimleri",
    totalWeeks: 36,
    weeklyHours: 4,
    isMaarifModel: false,
    fileFormat: "docx",
    downloads: 4890,
    author: "Fen Zümresi",
  },
  {
    id: "plan_4",
    title: "11. Sınıf Tarih Yıllık Planı & Belirli Günler Dağılımı",
    grade: "11. Sınıf",
    lesson: "Tarih",
    totalWeeks: 36,
    weeklyHours: 2,
    isMaarifModel: false,
    fileFormat: "docx",
    downloads: 3650,
    author: "Tarih Zümre Başkanı",
  },
];

export const AnnualPlansView: React.FC = () => {
  const [plans] = useState<AnnualPlanItem[]>(INITIAL_ANNUAL_PLANS);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (plan: AnnualPlanItem) => {
    setDownloadToast(`"${plan.title}" 36 haftalık yıllık planı (.docx) indirildi.`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const filteredPlans = plans.filter((p) => {
    const matchesGrade = selectedGrade === "all" || p.grade === selectedGrade;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lesson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {downloadToast && (
        <div className="bg-[#28a745] text-white px-4 py-3 rounded shadow-md flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{downloadToast}</span>
          </div>
          <button type="button" onClick={() => setDownloadToast(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AdminLTE Callout Box */}
      <div className="bg-white border-l-4 border-[#28a745] p-4 rounded shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#28a745] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                YILLIK PLANLAR
              </span>
              <h2 className="text-base font-bold text-[#212529]">
                MEB Türkiye Yüzyılı Maarif Modeli Yıllık Ders Planları & Çerçeve Planı
              </h2>
            </div>
            <p className="text-xs text-[#6c757d] mt-1">
              36 haftalık akademik takvime göre hazırlanmış, ara tatiller ve resmi bayramlar hesaplanmış düzenlenebilir Word formatında yıllık ders planları arşivi.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#dee2e6] rounded p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Yıllık plan ara (örn: 5. Sınıf Türkçe)..."
            className="w-full sm:w-64 bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#28a745]"
          />
        </div>

        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] cursor-pointer"
        >
          <option value="all">Tüm Sınıflar (1-12)</option>
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

      {/* Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#28a745]" />
            <h3 className="text-sm font-bold text-[#212529]">
              Yıllık Ders Planları Listesi ({filteredPlans.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f4f6f9] border-b border-[#dee2e6] text-[#495057] font-semibold">
                <th className="p-3">Plan Adı & Detay</th>
                <th className="p-3">Sınıf & Ders</th>
                <th className="p-3">Müfredat Uyumu</th>
                <th className="p-3">Haftalık Saat</th>
                <th className="p-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6]">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#f8f9fa]">
                  <td className="p-3">
                    <div className="font-bold text-[#212529]">{plan.title}</div>
                    <div className="text-[11px] text-[#6c757d] mt-0.5">
                      {plan.author} • {plan.downloads.toLocaleString()} İndirme
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-[#212529]">{plan.lesson}</span>
                    <span className="block text-[11px] text-[#6c757d]">{plan.grade}</span>
                  </td>
                  <td className="p-3">
                    {plan.isMaarifModel ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#28a745] bg-[#28a745]/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Yeni Maarif Modeli
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6c757d] bg-gray-100 px-2 py-0.5 rounded">
                        Güncel MEB Müfredatı
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-[11px] font-mono text-[#495057]">
                    {plan.weeklyHours} Saat/Hafta ({plan.totalWeeks} Hafta)
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(plan)}
                      className="px-3 py-1 rounded bg-[#28a745] hover:bg-[#218838] text-white font-bold flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Word İndir</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
