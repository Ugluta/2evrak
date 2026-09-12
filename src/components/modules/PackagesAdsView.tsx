import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Award,
  Megaphone,
  Check,
  Plus,
  Trash2,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { MembershipPackage, AdItem, AdPlacementArea, AdType } from "../../types";

export const PackagesAdsView: React.FC = () => {
  const {
    packages,
    addPackage,
    deletePackage,
    ads,
    addAd,
    deleteAd,
    recordAdClick,
    updateAd,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"packages" | "ads">("packages");
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);

  // New package form state
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState(99);
  const [pkgDownloadLimit, setPkgDownloadLimit] = useState(50);
  const [pkgAiLimit, setPkgAiLimit] = useState(100);

  // New ad form state
  const [adName, setAdName] = useState("");
  const [adArea, setAdArea] = useState<AdPlacementArea>("header");
  const [adType, setAdType] = useState<AdType>("image");

  const totalAdRevenue = ads.reduce((acc, a) => acc + a.stats.revenue, 0);
  const totalAdClicks = ads.reduce((acc, a) => acc + a.stats.clicks, 0);
  const totalAdImpressions = ads.reduce((acc, a) => acc + a.stats.impressions, 0);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    addPackage({
      name: pkgName,
      badge: "YENİ",
      priceMonthly: pkgPrice,
      priceYearly: pkgPrice * 10,
      isActive: true,
      order: packages.length + 1,
      limits: {
        documentDownloadsPerDay: pkgDownloadLimit,
        aiCreditsPerMonth: pkgAiLimit,
        aiQuestionGenerationMonthly: Math.round(pkgAiLimit / 3),
        maxDocumentCreationMonthly: 50,
        storageMb: 2048,
        canShareSocial: true,
        hasSpecialContentAccess: true,
        canExportPdfWord: true,
      },
      description: `${pkgName} ile MEB evrak ve AI araçlarına tam erişim sağlayın.`,
    });

    setIsAddPackageOpen(false);
    setPkgName("");
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName.trim()) return;

    addAd({
      name: adName,
      area: adArea,
      type: adType,
      contentUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
      redirectUrl: "https://2evrak.com/kampanya",
      isActive: true,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      priority: 5,
      targetPages: ["all"],
      targetCategories: ["all"],
      targetDevices: ["desktop", "mobile"],
      targetUserTypes: ["all"],
      impressionCap: 5,
    });

    setIsAddAdOpen(false);
    setAdName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              03 & 04 — Üyelik Paketleri & Reklam Gelirleri
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Sürdürülebilir Gelir Modeli
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Öğretmen ve Zümre Pro Abonelikleri, Google AdSense & Özel Sponsor Banner Yönetimi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "packages" ? (
            <button
              onClick={() => setIsAddPackageOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Paket Oluştur
            </button>
          ) : (
            <button
              onClick={() => setIsAddAdOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Reklam Alanı Ekle
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("packages")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "packages"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          03 Üyelik Paketleri ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab("ads")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "ads"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          04 Reklam Yönetimi & Gelir Simülatörü ({ads.length})
        </button>
      </div>

      {/* Tab 1: Packages */}
      {activeTab === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className="bg-slate-900 border border-indigo-500/20 rounded-xl p-5 flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                      {pkg.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono font-bold">
                      {pkg.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-['Space_Grotesk']">
                      ₺{pkg.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-400">/aylık (₺{pkg.priceYearly}/yıl)</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">{pkg.description}</p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pkg.limits.documentDownloadsPerDay === 0 ? "Sınırsız Evrak İndirme" : `${pkg.limits.documentDownloadsPerDay} Günlük Evrak İndirme`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pkg.limits.aiCreditsPerMonth} Aylık AI Kredisi</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pkg.limits.storageMb} MB Bulut Depolama Alanı</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sıra: #{pkg.order}</span>
                  <button
                    onClick={() => deletePackage(pkg.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Paketi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Ads Management & Revenue */}
      {activeTab === "ads" && (
        <div className="space-y-6">
          {/* Ad Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Toplam Reklam Geliri</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  ₺{totalAdRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">+18.5%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Google AdSense + Özel Yayıncılar</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Toplam Gösterim (Impressions)</span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  {totalAdImpressions.toLocaleString("tr-TR")}
                </span>
                <span className="text-xs text-cyan-400 font-semibold">MEB Ziyaretçileri</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">BGBM: ~₺24.50</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Toplam Tıklama</span>
                <MousePointer className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  {totalAdClicks.toLocaleString("tr-TR")}
                </span>
                <span className="text-xs text-purple-400 font-semibold">CTR: %3.6</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Ortalama TBM: ₺2.50</p>
            </div>
          </div>

          {/* Ads List Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Reklam Alanı & Başlık</th>
                    <th className="p-3.5">Yerleşim Konumu</th>
                    <th className="p-3.5">Hedef Kitle</th>
                    <th className="p-3.5">Gösterim / Tıklama</th>
                    <th className="p-3.5">Gelir</th>
                    <th className="p-3.5">Durum</th>
                    <th className="p-3.5 text-right">Canlı Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ads.map((ad) => {
                    return (
                      <tr key={ad.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 max-w-xs">
                          <div className="font-semibold text-white truncate">{ad.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Tür: {ad.type === "adsense" ? "Google AdSense" : "Özel Banner"}
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px] border border-slate-700">
                            {ad.area}
                          </span>
                        </td>

                        <td className="p-3.5 whitespace-nowrap text-slate-400">
                          {ad.targetUserTypes.includes("all") ? "Tüm Kullanıcılar" : ad.targetUserTypes.join(", ")}
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-mono text-[11px]">
                          {ad.stats.impressions.toLocaleString("tr-TR")} / {ad.stats.clicks.toLocaleString("tr-TR")}
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-mono font-bold text-emerald-400">
                          ₺{ad.stats.revenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Aktif
                          </span>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => recordAdClick(ad.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Tıklama simüle ederek gelir hesaplayıcısını test et"
                            >
                              <MousePointer className="w-3 h-3" /> Tık Simüle Et
                            </button>
                            <button
                              onClick={() => deleteAd(ad.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {isAddPackageOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Üyelik Paketi Tanımla</h3>
              <button onClick={() => setIsAddPackageOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Paket Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Branş Lideri Pro"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Aylık Fiyat (TL)</label>
                  <input
                    type="number"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Günlük İndirme Limiti</label>
                  <input
                    type="number"
                    value={pkgDownloadLimit}
                    onChange={(e) => setPkgDownloadLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPackageOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Paketi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Ad Modal */}
      {isAddAdOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Reklam Alanı Ekle</h3>
              <button onClick={() => setIsAddAdOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Reklam Kampanya Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: MEB Yayınevi Kitap Tanıtım Bannerı"
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Yerleşim Konumu</label>
                <select
                  value={adArea}
                  onChange={(e) => setAdArea(e.target.value as AdPlacementArea)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="header">Header Üst Banner</option>
                  <option value="sidebar">Sağ Kenar Çubuğu (Sidebar)</option>
                  <option value="content_inline">İçerik İçi Satır Arası</option>
                  <option value="custom_modal">Evrak İndirme Modalı</option>
                  <option value="footer">Footer Banner</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAdOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Reklamı Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
