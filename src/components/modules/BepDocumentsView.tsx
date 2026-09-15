import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  X,
  BookOpen,
} from "lucide-react";

interface BepItem {
  id: string;
  title: string;
  category: "Kaba Değerlendirme Formu" | "BEP Geliştirme Birimi Tutanağı" | "Bireyselleştirilmiş Eğitim Planı" | "RAM Sevk & İzleme Evrakı";
  specialNeedsType: string;
  fileFormat: "docx" | "pdf";
  downloads: number;
  author: string;
}

const INITIAL_BEP_ITEMS: BepItem[] = [
  {
    id: "bep_1",
    title: "Özel Eğitim BEP Geliştirme Birimi Sene Başı Toplantı Tutanağı",
    category: "BEP Geliştirme Birimi Tutanağı",
    specialNeedsType: "Tüm Kaynaştırma Öğrencileri",
    fileFormat: "docx",
    downloads: 3840,
    author: "Rehberlik & Özel Eğitim Zümresi",
  },
  {
    id: "bep_2",
    title: "Öğrenme Güçlüğü (Disleksi) Kaba Değerlendirme & Gözlem Formu",
    category: "Kaba Değerlendirme Formu",
    specialNeedsType: "Özgül Öğrenme Güçlüğü",
    fileFormat: "docx",
    downloads: 4190,
    author: "RAM Koordinatörü / PDR",
  },
  {
    id: "bep_3",
    title: "Matematik Dersi Bireyselleştirilmiş Eğitim Programı (BEP) Şablonu",
    category: "Bireyselleştirilmiş Eğitim Planı",
    specialNeedsType: "Hafif Düzey Zihinsel Yetersizlik",
    fileFormat: "docx",
    downloads: 5620,
    author: "Özel Eğitim Öğretmeni",
  },
  {
    id: "bep_4",
    title: "RAM (Rehberlik Araştırma Merkezi) Eğitsel Değerlendirme İstek Formu",
    category: "RAM Sevk & İzleme Evrakı",
    specialNeedsType: "Genel Değerlendirme",
    fileFormat: "pdf",
    downloads: 3110,
    author: "Okul Rehberlik Servisi",
  },
];

export const BepDocumentsView: React.FC = () => {
  const [items] = useState<BepItem[]>(INITIAL_BEP_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (item: BepItem) => {
    setDownloadToast(`"${item.title}" BEP evrakı (.docx) indirildi.`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const filteredItems = items.filter((i) => {
    const matchesCat = selectedCategory === "all" || i.category === selectedCategory;
    const matchesSearch =
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.specialNeedsType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
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
      <div className="bg-white border-l-4 border-[#6f42c1] p-4 rounded shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#6f42c1] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                ÖZEL EĞİTİM & BEP
              </span>
              <h2 className="text-base font-bold text-[#212529]">
                Bireyselleştirilmiş Eğitim Programı (BEP) & Rehberlik Evrakları
              </h2>
            </div>
            <p className="text-xs text-[#6c757d] mt-1">
              Kaynaştırma/bütünleştirme yoluyla eğitim alan öğrenciler için RAM raporuna uygun BEP planları, kaba değerlendirme formları ve BEP geliştirme birimi tutanakları.
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
            placeholder="BEP evrakı ara (örn: Kaba Değerlendirme, Disleksi)..."
            className="w-full sm:w-64 bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#6f42c1]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] cursor-pointer"
        >
          <option value="all">Tüm BEP Türleri</option>
          <option value="Kaba Değerlendirme Formu">Kaba Değerlendirme Formu</option>
          <option value="BEP Geliştirme Birimi Tutanağı">BEP Geliştirme Birimi Tutanağı</option>
          <option value="Bireyselleştirilmiş Eğitim Planı">Bireyselleştirilmiş Eğitim Planı</option>
          <option value="RAM Sevk & İzleme Evrakı">RAM Sevk & İzleme Evrakı</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#6f42c1]" />
            <h3 className="text-sm font-bold text-[#212529]">
              BEP ve Özel Eğitim Evrakları ({filteredItems.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f4f6f9] border-b border-[#dee2e6] text-[#495057] font-semibold">
                <th className="p-3">Evrak Adı</th>
                <th className="p-3">Evrak Kategorisi</th>
                <th className="p-3">Yetersizlik / İhtiyaç Alanı</th>
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
                  <td className="p-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#f3e8ff] text-[#6f42c1] font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-[#495057]">
                    {item.specialNeedsType}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      className="px-3 py-1 rounded bg-[#6f42c1] hover:bg-[#59339d] text-white font-bold flex items-center gap-1 ml-auto cursor-pointer"
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
