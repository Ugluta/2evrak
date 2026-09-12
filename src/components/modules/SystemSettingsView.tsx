import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sliders,
  Globe,
  Zap,
  Shield,
  Save,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

export const SystemSettingsView: React.FC = () => {
  const { systemSettings, updateSystemSettings, hasPermission } = useApp();

  const [activeTab, setActiveTab] = useState<"general" | "seo" | "performance" | "security">("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Form states initialized from systemSettings
  const [siteName, setSiteName] = useState(systemSettings.general.siteName);
  const [siteDescription, setSiteDescription] = useState(systemSettings.general.description);
  const [contactEmail, setContactEmail] = useState(systemSettings.general.contactEmail);
  const [maintenanceMode, setMaintenanceMode] = useState(systemSettings.general.maintenanceMode);

  // SEO Form
  const [metaTitle, setMetaTitle] = useState(systemSettings.seo.defaultMetaTitle);
  const [metaDesc, setMetaDesc] = useState(systemSettings.seo.defaultMetaDescription);
  const [ogImage, setOgImage] = useState(systemSettings.seo.ogImage);

  // Performance Form
  const [cacheEnabled, setCacheEnabled] = useState(systemSettings.performance.cacheEnabled);
  const [cdnActive, setCdnActive] = useState(systemSettings.performance.cdnActive);
  const [minifyHtml, setMinifyHtml] = useState(systemSettings.performance.minifyHtml);

  // Security Form
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(systemSettings.security.twoFactorEnforced);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(systemSettings.security.sessionTimeoutMinutes);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(systemSettings.security.maxLoginAttempts);
  const [newBlockedIp, setNewBlockedIp] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      general: {
        ...systemSettings.general,
        siteName,
        description: siteDescription,
        contactEmail,
        maintenanceMode,
      },
      seo: {
        ...systemSettings.seo,
        defaultMetaTitle: metaTitle,
        defaultMetaDescription: metaDesc,
        ogImage,
      },
      performance: {
        ...systemSettings.performance,
        cacheEnabled,
        cdnActive,
        minifyHtml,
      },
      security: {
        ...systemSettings.security,
        twoFactorEnforced,
        sessionTimeoutMinutes,
        maxLoginAttempts,
      },
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleAddIp = () => {
    if (!newBlockedIp.trim()) return;
    updateSystemSettings({
      security: {
        ...systemSettings.security,
        ipBlacklist: [...systemSettings.security.ipBlacklist, newBlockedIp.trim()],
      },
    });
    setNewBlockedIp("");
  };

  const handleRemoveIp = (ip: string) => {
    updateSystemSettings({
      security: {
        ...systemSettings.security,
        ipBlacklist: systemSettings.security.ipBlacklist.filter((item) => item !== ip),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">01 — Sistem Ayarları</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Merkezi Konfigürasyon
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Site Bilgileri, MEB SEO Başlıkları, Önbellek, Bakım Modu ve Güvenlik Parametreleri
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Ayarlar başarıyla kaydedildi & denetim kütüğüne işlendi!
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "general"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Genel Ayarlar
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "seo"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          SEO & Meta
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "performance"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Zap className="w-4 h-4" />
          Performans & Cache
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Shield className="w-4 h-4" />
          Sistem Güvenliği
        </button>
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Platform Temel Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site Adı</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resmi İletişim E-Postası
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Site Açıklaması</label>
              <textarea
                rows={3}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Bakım Modu (Maintenance Mode)
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Açıldığında sadece Süper Yönetici giriş yapabilir, öğretmenlere bakım sayfası gösterilir.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: SEO */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              MEB SEO & Sosyal Medya Kartları
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Varsayılan Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Varsayılan Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sosyal Paylaşım Görseli (OpenGraph Image URL)
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Performance */}
        {activeTab === "performance" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Önbellek & Performans Optimizasyonu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Redis Önbellek</div>
                  <div className="text-[10px] text-slate-400">Sorgu hızlandırıcı</div>
                </div>
                <input
                  type="checkbox"
                  checked={cacheEnabled}
                  onChange={(e) => setCacheEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Cloudflare CDN</div>
                  <div className="text-[10px] text-slate-400">Statik dosya dağıtımı</div>
                </div>
                <input
                  type="checkbox"
                  checked={cdnActive}
                  onChange={(e) => setCdnActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">HTML / JS Minify</div>
                  <div className="text-[10px] text-slate-400">Gzip sıkıştırma</div>
                </div>
                <input
                  type="checkbox"
                  checked={minifyHtml}
                  onChange={(e) => setMinifyHtml(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Uygulama Önbelleğini Temizle</div>
                <p className="text-[11px] text-slate-400">
                  Tüm evrak sayfalarını ve kategori listelerini yeniden derler.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearCache}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {cacheCleared ? "Önbellek Boşaltıldı!" : "Önbelleği Temizle"}
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Sistem ve Oturum Güvenliği
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Maksimum Hatalı Giriş (Brute Force Limiti)
                </label>
                <input
                  type="number"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Oturum Zaman Aşımı (Dakika)
                </label>
                <input
                  type="number"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  Yönetici Hesapları için 2FA Zorunluluğu
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Süper Yönetici ve Editör rollerinin girişinde SMS veya Authenticator kodu zorunlu tutulur.
                </p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnforced}
                onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            {/* IP Blacklist */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Engellenen IP Adresleri (IP Blacklist):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Örn: 185.220.101.5"
                  value={newBlockedIp}
                  onChange={(e) => setNewBlockedIp(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddIp}
                  className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
                >
                  IP Engelle
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {systemSettings.security.ipBlacklist.map((ip) => (
                  <span
                    key={ip}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-rose-500/30 text-rose-400 text-xs font-mono"
                  >
                    <span>{ip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIp(ip)}
                      className="text-slate-500 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Değişiklikleri Kaydet & Yayınla
          </button>
        </div>
      </form>
    </div>
  );
};
