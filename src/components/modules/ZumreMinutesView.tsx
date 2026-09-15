import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface ZumreItem {
  id: string;
  title: string;
  branch: string;
  term: "Sene Başı (1. Dönem)" | "1. Dönem Sonu" | "2. Dönem Başı" | "Yıl Sonu";
  level: "Okul Zümresi" | "İlçe Zümresi" | "İl Zümresi";
  year: string;
  agendaCount: number;
  author: string;
  fileFormat: "docx" | "pdf";
  downloads: number;
  decisions: string[];
}

const INITIAL_ZUMRE_ITEMS: ZumreItem[] = [
  {
    id: "zumre_1",
    title: "2025-2026 Sene Başı Matematik Zümre Öğretmenler Kurulu Karar Tutanağı",
    branch: "Matematik",
    term: "Sene Başı (1. Dönem)",
    level: "Okul Zümresi",
    year: "2025-2026",
    agendaCount: 14,
    author: "Zümre Başkanı / Mustafa Demir",
    fileFormat: "docx",
    downloads: 5120,
    decisions: [
      "Yeni Maarif Modeli çerçeve öğretim programı incelenmiş, haftalık ders kazanımları takvime bağlanmıştır.",
      "1. ve 2. ortak yazılı sınav tarihlerinin MEB Ölçme ve Değerlendirme takvimine göre yürütülmesine karar verilmiştir.",
      "Açık uçlu soru senaryolarından okul imkanlarına göre Senaryo 1 ve Senaryo 2'nin uygulanmasına oy birliğiyle karar verildi.",
    ],
  },
  {
    id: "zumre_2",
    title: "Türk Dili ve Edebiyatı 1. Dönem Başı Zümre Tutanağı & İmza Sirküsü",
    branch: "Türk Dili ve Edebiyatı",
    term: "Sene Başı (1. Dönem)",
    level: "Okul Zümresi",
    year: "2025-2026",
    agendaCount: 16,
    author: "Fatma Yılmaz (Zümre Bşk.)",
    fileFormat: "docx",
    downloads: 4890,
    decisions: [
      "Öğrencilerin kitap okuma alışkanlıklarını geliştirmek adına her ay 1 ortak edebi eser tahlili yapılması kararlaştırıldı.",
      "Ortak sınav hazırlıklarında MEB açık uçlu soru dağılım tablolarının esas alınması kabul edildi.",
    ],
  },
  {
    id: "zumre_3",
    title: "İlçe Zümre Başkanları Kurulu Toplantı Tutanağı (Fen Bilimleri)",
    branch: "Fen Bilimleri",
    term: "Sene Başı (1. Dönem)",
    level: "İlçe Zümresi",
    year: "2025-2026",
    agendaCount: 12,
    author: "İlçe MEM Zümre Koordinatörü",
    fileFormat: "pdf",
    downloads: 3200,
    decisions: [
      "İlçe genelinde ortak sınavların soru havuzunun ortak dijital platformda toplanması kararlaştırıldı.",
      "Laboratuvar deney ve uygulamalarında iş güvenliği kurallarına azami dikkat gösterilmesi tavsiye edildi.",
    ],
  },
  {
    id: "zumre_4",
    title: "1. Dönem Sonu Değerlendirme Zümresi (İngilizce Branşı)",
    branch: "İngilizce",
    term: "1. Dönem Sonu",
    level: "Okul Zümresi",
    year: "2025-2026",
    agendaCount: 10,
    author: "İngilizce Zümre Kurulu",
    fileFormat: "docx",
    downloads: 2740,
    decisions: [
      "1. Dönem başarı yüzdeleri analiz edilmiş, konuşma (Speaking) sınavı sonuçları değerlendirilmiştir.",
      "Bahar döneminde telafi çalışmalarına ağırlık verilmesine karar verilmiştir.",
    ],
  },
];

export const ZumreMinutesView: React.FC = () => {
  const [items] = useState<ZumreItem[]>(INITIAL_ZUMRE_ITEMS);
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewItem, setPreviewItem] = useState<ZumreItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (item: ZumreItem) => {
    setDownloadToast(`"${item.title}" tutanağı ve imza sirküsü (.docx) indirildi.`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const filteredItems = items.filter((i) => {
    const matchesTerm = selectedTerm === "all" || i.term === selectedTerm;
    const matchesBranch = selectedBranch === "all" || i.branch === selectedBranch;
    const matchesSearch =
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTerm && matchesBranch && matchesSearch;
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
      <div className="bg-white border-l-4 border-[#17a2b8] p-4 rounded shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#17a2b8] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                ZÜMRE HAVUZU
              </span>
              <h2 className="text-base font-bold text-[#212529]">
                Zümre Öğretmenler Kurulu Toplantı Tutanakları & Kararları
              </h2>
            </div>
            <p className="text-xs text-[#6c757d] mt-1">
              MEB Ortaöğretim ve Temel Eğitim Yönetmeliği'ne tam uyumlu sene başı, dönem sonu ve il/ilçe zümre kararları, gündem maddeleri şablonları ve hazır imza sirküleri.
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
            placeholder="Zümre ara (örn: Matematik, Sene Başı)..."
            className="w-full sm:w-64 bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#17a2b8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] cursor-pointer"
          >
            <option value="all">Tüm Toplantı Dönemleri</option>
            <option value="Sene Başı (1. Dönem)">Sene Başı (1. Dönem)</option>
            <option value="1. Dönem Sonu">1. Dönem Sonu</option>
            <option value="2. Dönem Başı">2. Dönem Başı</option>
            <option value="Yıl Sonu">Yıl Sonu</option>
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] cursor-pointer"
          >
            <option value="all">Tüm Branşlar</option>
            <option value="Matematik">Matematik</option>
            <option value="Türk Dili ve Edebiyatı">Türk Dili ve Edebiyatı</option>
            <option value="Fen Bilimleri">Fen Bilimleri</option>
            <option value="İngilizce">İngilizce</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#17a2b8]" />
            <h3 className="text-sm font-bold text-[#212529]">
              Zümre Tutanakları Arşivi ({filteredItems.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f4f6f9] border-b border-[#dee2e6] text-[#495057] font-semibold">
                <th className="p-3">Tutanak Adı & Gündem</th>
                <th className="p-3">Branş</th>
                <th className="p-3">Dönem & Düzey</th>
                <th className="p-3">Gündem Maddeleri</th>
                <th className="p-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9fa]">
                  <td className="p-3">
                    <div className="font-bold text-[#212529]">{item.title}</div>
                    <div className="text-[11px] text-[#6c757d] mt-0.5">
                      {item.author} • {item.downloads.toLocaleString()} İndirme
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-[#17a2b8]">{item.branch}</td>
                  <td className="p-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#e9ecef] text-[#495057]">
                      {item.term} ({item.level})
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-[#495057]">
                    {item.agendaCount} Gündem Maddesi & Alınan Kararlar
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] font-semibold cursor-pointer"
                      >
                        İncele
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        className="px-3 py-1 rounded bg-[#17a2b8] hover:bg-[#138496] text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Word İndir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-5 border border-[#dee2e6] space-y-4">
            <div className="flex items-start justify-between border-b border-[#dee2e6] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#17a2b8] text-white px-2 py-0.5 rounded">
                  {previewItem.branch} Zümresi
                </span>
                <h3 className="text-sm font-bold text-[#212529] mt-1">{previewItem.title}</h3>
              </div>
              <button type="button" onClick={() => setPreviewItem(null)} className="cursor-pointer text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#343a40]">Örnek Alınan Zümre Kararları:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[#495057]">
                {previewItem.decisions.map((d, idx) => (
                  <li key={idx} className="leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dee2e6]">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1.5 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold cursor-pointer"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewItem);
                  setPreviewItem(null);
                }}
                className="px-4 py-1.5 rounded bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word (.docx) İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
