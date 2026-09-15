import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { DILEKCEMATIK_TEMPLATES, DilekceTemplate } from "../../data/dilekcematikData";
import {
  FileText,
  Search,
  Printer,
  Copy,
  Check,
  Sparkles,
  Filter,
  ArrowRight,
  ShieldCheck,
  Send,
  Layers,
  Download,
  PlusCircle,
  FolderOpen,
  Scale,
  BookOpen,
  X,
  FileCheck,
  Award,
} from "lucide-react";

export const DilekcematikView: React.FC = () => {
  const { documents, updateDocuments, currentUser, activeSubItemId } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [activeTemplate, setActiveTemplate] = useState<DilekceTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync with left sidebar sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("Özlük") || activeSubItemId.includes("Mazeret")) {
      setSelectedCategory("Özlük & Atama");
    } else if (activeSubItemId.includes("Nöbet") || activeSubItemId.includes("Ek Ders")) {
      setSelectedCategory("Ek Ders & Mali");
    } else if (activeSubItemId.includes("Görevlendirme")) {
      setSelectedCategory("Genel Dilekçeler");
    } else if (activeSubItemId.includes("Hizmet İçi")) {
      setSelectedCategory("Eğitim & Kurs");
    }
  }, [activeSubItemId]);

  const categories = [
    "Tümü",
    "Özlük & Atama",
    "Ek Ders & Mali",
    "İzin & Rapor",
    "Disiplin & Soruşturma",
    "Eğitim & Kurs",
    "Genel Dilekçeler",
  ];

  const filteredTemplates = DILEKCEMATIK_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === "Tümü" || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenTemplate = (template: DilekceTemplate) => {
    setActiveTemplate(template);
    const initialVals: Record<string, string> = {};
    template.requiredFields.forEach((f) => {
      initialVals[f.key] = "";
    });
    // prefill user name if available
    if (currentUser && initialVals["adSoyad"]) {
      initialVals["adSoyad"] = currentUser.fullName || currentUser.name || "Mustafa Öğretmen";
    }
    if (initialVals["kurumAdi"]) {
      initialVals["kurumAdi"] = "Atatürk Ortaokulu Müdürlüğüne";
    }
    if (initialVals["tarih"]) {
      initialVals["tarih"] = new Date().toLocaleDateString("tr-TR");
    }
    setFormValues(initialVals);
    setSavedSuccess(false);
    setCopied(false);
  };

  const getGeneratedContent = () => {
    if (!activeTemplate) return "";
    let content = activeTemplate.templateContent;
    Object.keys(formValues).forEach((key) => {
      const val = formValues[key] || `[${key.toUpperCase()}]`;
      content = content.replace(new RegExp(`\\{${key}\\}`, "g"), val);
    });
    return content;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getGeneratedContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToArchive = () => {
    if (!activeTemplate) return;
    const newDoc = {
      id: `doc_${Date.now()}`,
      title: activeTemplate.title,
      category: activeTemplate.category,
      type: "Dilekçe",
      docType: "Dilekçe",
      lesson: "Genel",
      gradeLevel: "Mevzuat",
      author: currentUser?.fullName || "Öğretmen",
      authorName: currentUser?.fullName || "Öğretmen",
      date: new Date().toISOString().split("T")[0],
      downloads: 1,
      rating: 5.0,
      fileSize: "120 KB",
      content: getGeneratedContent(),
      status: "published" as const,
      isSoftDeleted: false,
    };
    updateDocuments([newDoc as any, ...documents]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${activeTemplate?.title || "Dilekçe"}</title>
            <style>
              @page { size: A4; margin: 25mm 20mm 25mm 20mm; }
              body { 
                font-family: 'Times New Roman', Times, serif; 
                font-size: 12pt; 
                line-height: 1.6; 
                color: #000; 
                margin: 0; 
                padding: 20px; 
              }
              .header { text-align: center; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; }
              .content { white-space: pre-wrap; text-align: justify; text-indent: 30px; }
              .footer { margin-top: 40px; text-align: right; }
            </style>
          </head>
          <body>
            <div class="content">${getGeneratedContent()}</div>
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Info Header */}
      <div className="bg-white border-l-4 border-l-[#17a2b8] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#17a2b8]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                Dilekçematik — 657 ve MEB Mevzuatına Uygun 40+ Resmi Dilekçe Şablonu
              </h1>
            </div>
            <p className="text-xs text-[#6c757d] mt-1">
              Özlük hakları, ek ders itirazları, mazeret izinleri, görevlendirme ve disiplin süreçleri için mevzuata uygun, resmi formatta hazırlanmış dilekçeleri saniyeler içinde doldurun, yazdırın veya dijital olarak arşivleyin.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#17a2b8]/10 text-[#17a2b8] border border-[#17a2b8]/30">
              657 DMK & Danıştay İçtihatları
            </span>
          </div>
        </div>
      </div>

      {/* AdminLTE Info-Boxes Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#dee2e6] rounded flex items-center shadow-2xs overflow-hidden">
          <span className="w-14 h-14 bg-[#007bff] text-white flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </span>
          <div className="p-2.5 min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6c757d] block truncate font-medium">
              Toplam Şablon
            </span>
            <span className="text-base font-bold font-mono text-[#212529]">
              {DILEKCEMATIK_TEMPLATES.length} Hazır Şablon
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#dee2e6] rounded flex items-center shadow-2xs overflow-hidden">
          <span className="w-14 h-14 bg-[#28a745] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div className="p-2.5 min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6c757d] block truncate font-medium">
              Mevzuat Doğruluğu
            </span>
            <span className="text-base font-bold text-[#28a745] font-mono">%100 Hukuki Uygunluk</span>
          </div>
        </div>

        <div className="bg-white border border-[#dee2e6] rounded flex items-center shadow-2xs overflow-hidden">
          <span className="w-14 h-14 bg-[#17a2b8] text-white flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </span>
          <div className="p-2.5 min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6c757d] block truncate font-medium">
              Hukuki Kategori
            </span>
            <span className="text-base font-bold text-[#212529] font-mono">6 Temel Alan</span>
          </div>
        </div>

        <div className="bg-white border border-[#dee2e6] rounded flex items-center shadow-2xs overflow-hidden">
          <span className="w-14 h-14 bg-[#ffc107] text-white flex items-center justify-center shrink-0">
            <Printer className="w-6 h-6" />
          </span>
          <div className="p-2.5 min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6c757d] block truncate font-medium">
              Çıktı & Arşivleme
            </span>
            <span className="text-base font-bold text-[#212529] font-mono">A4 Resmi Format</span>
          </div>
        </div>
      </div>

      {/* AdminLTE Card: Filtre ve Arama Çubuğu */}
      <div className="card card-primary card-outline bg-white border border-[#dee2e6] rounded shadow-xs">
        <div className="p-3 border-b border-[#dee2e6] flex flex-wrap items-center justify-between gap-3 bg-[#f8f9fa]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#007bff]" />
            <span className="text-xs font-bold text-[#343a40] uppercase tracking-wider">
              Dilekçe Kategorileri ve Arama
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Dilekçe adı veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Nav Pills Category Filter */}
        <div className="p-3 flex items-center gap-1.5 overflow-x-auto custom-scrollbar bg-white">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#007bff] text-white shadow-xs"
                  : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid (AdminLTE Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="card card-outline card-primary bg-white border border-[#dee2e6] rounded shadow-xs hover:border-[#007bff] hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f4ff] text-[#007bff] border border-[#007bff]/20">
                  {template.category}
                </span>
                <span className="text-[10px] text-[#6c757d] font-mono">
                  {template.requiredFields.length} Parametre
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#212529] mb-1.5 line-clamp-2">
                {template.title}
              </h3>

              <p className="text-xs text-[#6c757d] line-clamp-3 leading-relaxed mb-3">
                {template.summary}
              </p>

              {template.legalBasis && (
                <div className="p-2 rounded bg-[#f8f9fa] border border-[#dee2e6] text-[11px] text-[#495057] mb-2 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#17a2b8] shrink-0" />
                  <span className="truncate">Hukuki Dayanak: {template.legalBasis}</span>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[#dee2e6] bg-[#f8f9fa] flex items-center justify-between">
              <span className="text-[10px] text-[#6c757d]">Resmi Format (A4)</span>
              <button
                type="button"
                onClick={() => handleOpenTemplate(template)}
                className="px-3 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Doldur & Oluştur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-8 text-center bg-white border border-[#dee2e6] rounded text-[#6c757d] space-y-2">
          <FileText className="w-8 h-8 mx-auto text-gray-300" />
          <p className="text-xs font-semibold">Arama kriterinize uygun dilekçe şablonu bulunamadı.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Tümü");
              setSearchQuery("");
            }}
            className="text-xs text-[#007bff] hover:underline font-semibold cursor-pointer"
          >
            Tüm şablonları göster
          </button>
        </div>
      )}

      {/* Dilekçe Editörü Modal (AdminLTE Modal Window) */}
      {activeTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white border border-[#dee2e6] rounded shadow-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-3.5 border-b border-[#dee2e6] bg-[#f8f9fa] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#007bff]" />
                <h3 className="text-sm font-bold text-[#212529] truncate max-w-xl">
                  {activeTemplate.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="p-1 rounded hover:bg-[#e9ecef] text-[#6c757d] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-y-auto">
              {/* Form Inputs (Left 5 Cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold text-[#343a40] uppercase tracking-wider pb-1 border-b border-[#dee2e6]">
                  Dilekçe Bilgileri (Gerekli Alanlar)
                </div>

                <div className="space-y-2.5">
                  {activeTemplate.requiredFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#495057] block">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={formValues[field.key] || ""}
                        onChange={(e) =>
                          setFormValues({ ...formValues, [field.key]: e.target.value })
                        }
                        className="w-full bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded bg-[#f8f9fa] border border-[#dee2e6] text-xs text-[#6c757d] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#28a745] shrink-0 mt-0.5" />
                  <span>
                    Bilgileri girdikçe sağdaki resmi önizleme anlık olarak güncellenir. Tamamlandığında yazdırabilir veya sisteme kaydedebilirsiniz.
                  </span>
                </div>
              </div>

              {/* Live Preview Paper (Right 7 Cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#dee2e6]">
                  <span className="text-xs font-bold text-[#343a40] uppercase tracking-wider">
                    Resmi Dilekçe Önizleme (A4 Standardı)
                  </span>
                  {savedSuccess && (
                    <span className="text-xs font-bold text-[#28a745] bg-[#eaf7ed] px-2 py-0.5 rounded border border-[#28a745]/30">
                      ✓ Arşive Eklendi!
                    </span>
                  )}
                </div>

                {/* Paper Canvas */}
                <div className="bg-[#fcfcfc] border border-[#ced4da] rounded p-6 shadow-inner font-serif text-[13px] text-[#212529] whitespace-pre-wrap leading-relaxed flex-1 min-h-[360px] max-h-[460px] overflow-y-auto custom-scrollbar">
                  {getGeneratedContent()}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded bg-white hover:bg-[#f8f9fa] border border-[#ced4da] text-[#495057] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#28a745]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Kopyalandı" : "Metni Kopyala"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToArchive}
                    className="px-3 py-1.5 rounded bg-[#e8f4ff] hover:bg-[#d0e7ff] text-[#007bff] border border-[#007bff]/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Evraklarıma Kaydet</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Yazdır / PDF Olarak Kaydet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
