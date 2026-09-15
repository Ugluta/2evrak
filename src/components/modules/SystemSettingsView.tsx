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
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
  UploadCloud,
  Check,
} from "lucide-react";

export const SystemSettingsView: React.FC = () => {
  const { systemSettings, updateSystemSettings, hasPermission, setCurrentView, categories, updateCategory } = useApp();

  const [activeTab, setActiveTab] = useState<
    | "general"
    | "ads_analytics"
    | "newsletter_messages"
    | "pages_limits"
    | "import_export"
    | "seo"
    | "performance"
    | "security"
    | "ai_api"
    | "header_footer"
  >("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form states initialized from systemSettings
  const [siteName, setSiteName] = useState(systemSettings.general.siteName);
  const [siteDescription, setSiteDescription] = useState(systemSettings.general.description);
  const [contactEmail, setContactEmail] = useState(systemSettings.general.contactEmail);
  const [maintenanceMode, setMaintenanceMode] = useState(systemSettings.general.maintenanceMode);
  const [academicYear, setAcademicYear] = useState(systemSettings.general.academicYear || "2025-2026");
  const [academicTerm, setAcademicTerm] = useState(systemSettings.general.academicTerm || "1. Dönem");
  const [guestLimit, setGuestLimit] = useState(systemSettings.general.guestDailyDownloadLimit || 3);
  const [teacherLimit, setTeacherLimit] = useState(systemSettings.general.teacherDailyDownloadLimit || 50);

  // Logo & Favicon & Hero Arka Plan
  const [logoUrl, setLogoUrl] = useState(systemSettings.general.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(systemSettings.general.faviconUrl || "");
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState(systemSettings.headerFooterConfig?.heroBackgroundUrl || "");

  const handleLogoUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFaviconUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBgUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setHeroBackgroundUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ads & Analytics Form
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(systemSettings.thirdPartyAdsAndAnalytics?.googleAnalyticsId || "");
  const [googleAdsenseId, setGoogleAdsenseId] = useState(systemSettings.thirdPartyAdsAndAnalytics?.googleAdsenseId || "");
  const [amazonAffiliateTag, setAmazonAffiliateTag] = useState(systemSettings.thirdPartyAdsAndAnalytics?.amazonAffiliateTag || "");
  const [metaPixelId, setMetaPixelId] = useState(systemSettings.thirdPartyAdsAndAnalytics?.metaPixelId || "");
  const [customHeadCode, setCustomHeadCode] = useState(systemSettings.thirdPartyAdsAndAnalytics?.customHeadCode || "");
  const [customFooterCode, setCustomFooterCode] = useState(systemSettings.thirdPartyAdsAndAnalytics?.customFooterCode || "");

  // Newsletter & Messages Form
  const [smtpHost, setSmtpHost] = useState(systemSettings.newsletterAndMessages?.smtpHost || "");
  const [smtpPort, setSmtpPort] = useState(systemSettings.newsletterAndMessages?.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(systemSettings.newsletterAndMessages?.smtpUser || "");
  const [senderEmail, setSenderEmail] = useState(systemSettings.newsletterAndMessages?.senderEmail || "");
  const [newsletterActive, setNewsletterActive] = useState(systemSettings.newsletterAndMessages?.newsletterActive ?? true);
  const [notifyOnNewMessage, setNotifyOnNewMessage] = useState(systemSettings.newsletterAndMessages?.notifyOnNewMessage ?? true);
  const [autoReplyTemplate, setAutoReplyTemplate] = useState(systemSettings.newsletterAndMessages?.autoReplyTemplate || "");

  // Pages & Limits Form
  const [defaultPageSize, setDefaultPageSize] = useState(systemSettings.moduleLimitsAndPages?.defaultPageSize || 20);
  const [maxDocumentsPerPage, setMaxDocumentsPerPage] = useState(systemSettings.moduleLimitsAndPages?.maxDocumentsPerPage || 50);
  const [allowPublicSubmissions, setAllowPublicSubmissions] = useState(systemSettings.moduleLimitsAndPages?.allowPublicSubmissions ?? true);

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

  // AI & API Form
  const [primaryProvider, setPrimaryProvider] = useState(systemSettings.aiApi?.primaryProvider || "gemini");
  const [geminiApiKey, setGeminiApiKey] = useState(systemSettings.aiApi?.geminiApiKey || "");
  const [anthropicApiKey, setAnthropicApiKey] = useState(systemSettings.aiApi?.anthropicApiKey || "");
  const [deepseekApiKey, setDeepseekApiKey] = useState(systemSettings.aiApi?.deepseekApiKey || "");
  const [openaiApiKey, setOpenaiApiKey] = useState(systemSettings.aiApi?.openaiApiKey || "");
  const [copilotApiKey, setCopilotApiKey] = useState(systemSettings.aiApi?.copilotApiKey || "");
  const [metaApiKey, setMetaApiKey] = useState(systemSettings.aiApi?.metaApiKey || "");
  const [defaultModel, setDefaultModel] = useState(systemSettings.aiApi?.defaultModel || "gemini-2.5-flash");
  const [scraperAiAutoProcessing, setScraperAiAutoProcessing] = useState(systemSettings.aiApi?.scraperAiAutoProcessing ?? true);
  const [autoGenerateZumreAndPlans, setAutoGenerateZumreAndPlans] = useState(systemSettings.aiApi?.autoGenerateZumreAndPlans ?? true);

  // Header & Footer Form
  const [hfHeaderTitle, setHfHeaderTitle] = useState(systemSettings.headerFooterConfig?.headerTitle || "2Evrak");
  const [hfHeaderSubtitle, setHfHeaderSubtitle] = useState(systemSettings.headerFooterConfig?.headerSubtitle || "MEB Uyumlu Doküman & Çok Kanallı AI Platformu");
  const [hfHeaderLogoText, setHfHeaderLogoText] = useState(systemSettings.headerFooterConfig?.headerLogoText || "2E");
  const [hfShowPortalBadge, setHfShowPortalBadge] = useState(systemSettings.headerFooterConfig?.showPortalBadge ?? true);
  const [hfPortalBadgeText, setHfPortalBadgeText] = useState(systemSettings.headerFooterConfig?.portalBadgeText || "1M Öğretmen Hedefi");
  const [hfFooterCopyright, setHfFooterCopyright] = useState(systemSettings.headerFooterConfig?.footerCopyright || "© 2026 2Evrak — Türkiye'nin Dijital Öğretmen Arşivi. Tüm Hakları Saklıdır.");
  const [hfFooterAboutText, setHfFooterAboutText] = useState(systemSettings.headerFooterConfig?.footerAboutText || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      general: {
        ...systemSettings.general,
        siteName,
        logoUrl,
        faviconUrl,
        description: siteDescription,
        contactEmail,
        maintenanceMode,
        academicYear,
        academicTerm,
        guestDailyDownloadLimit: Number(guestLimit),
        teacherDailyDownloadLimit: Number(teacherLimit),
      },
      thirdPartyAdsAndAnalytics: {
        googleAnalyticsId,
        googleAdsenseId,
        amazonAffiliateTag,
        metaPixelId,
        customHeadCode,
        customFooterCode,
      },
      newsletterAndMessages: {
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        senderEmail,
        newsletterActive,
        notifyOnNewMessage,
        autoReplyTemplate,
      },
      moduleLimitsAndPages: {
        defaultPageSize: Number(defaultPageSize),
        maxDocumentsPerPage: Number(maxDocumentsPerPage),
        featuredModules: systemSettings.moduleLimitsAndPages?.featuredModules || [],
        allowPublicSubmissions,
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
      aiApi: {
        primaryProvider,
        geminiApiKey,
        anthropicApiKey,
        deepseekApiKey,
        openaiApiKey,
        copilotApiKey,
        metaApiKey,
        defaultModel,
        scraperAiAutoProcessing,
        autoGenerateZumreAndPlans,
      },
      headerFooterConfig: {
        headerTitle: hfHeaderTitle,
        headerSubtitle: hfHeaderSubtitle,
        headerLogoText: hfHeaderLogoText,
        showPortalBadge: hfShowPortalBadge,
        portalBadgeText: hfPortalBadgeText,
        footerCopyright: hfFooterCopyright,
        footerAboutText: hfFooterAboutText,
        heroBackgroundUrl,
        footerAccordionColumns: systemSettings.headerFooterConfig?.footerAccordionColumns || [],
      },
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systemSettings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `2evrak_system_settings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === "object") {
            updateSystemSettings(parsed);
            setImportStatus("Konfigürasyon başarıyla içe aktarıldı!");
            setTimeout(() => setImportStatus(null), 3000);
          } else {
            setImportStatus("Geçersiz JSON formatı!");
          }
        } catch (err) {
          setImportStatus("Dosya okuma hatası!");
        }
      };
    }
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

  const tabsConfig = [
    { id: "general", label: "Genel Ayarlar", icon: Sliders, color: "text-[#007bff]" },
    { id: "ads_analytics", label: "Reklamlar & Analitik", icon: Globe, color: "text-[#ffc107]" },
    { id: "newsletter_messages", label: "Bülten & Mesajlar", icon: Layers, color: "text-[#28a745]" },
    { id: "pages_limits", label: "Sayfa & Limitler", icon: GraduationCap, color: "text-[#6f42c1]" },
    { id: "import_export", label: "Yedek / Aktarım", icon: RefreshCw, color: "text-[#17a2b8]" },
    { id: "seo", label: "SEO & Meta", icon: Globe, color: "text-[#007bff]" },
    { id: "performance", label: "Performans", icon: Zap, color: "text-[#fd7e14]" },
    { id: "security", label: "Güvenlik", icon: Shield, color: "text-[#dc3545]" },
    { id: "ai_api", label: "Yapay Zeka & API", icon: Zap, color: "text-[#e83e8c]" },
    { id: "header_footer", label: "Header & Footer", icon: Sliders, color: "text-[#20c997]" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Box */}
      <div className="bg-white border-l-4 border-[#007bff] p-4 rounded shadow-xs border border-[#dee2e6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#007bff] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                SİSTEM AYARLARI
              </span>
              <h2 className="text-base font-bold text-[#212529]">
                Merkezi Platform & Sunucu Konfigürasyonu
              </h2>
            </div>
            <p className="text-xs text-[#6c757d]">
              Site Bilgileri, MEB SEO Başlıkları, Önbellek, Bakım Modu ve Güvenlik Parametreleri.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentView("public")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da] text-xs font-semibold transition-colors cursor-pointer"
              title="Ziyaretçi Ana Sayfasını Aç"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#007bff]" />
              <span>Ana Sayfaya Git</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView("teacher")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#28a745]/10 hover:bg-[#28a745]/20 text-[#28a745] border border-[#28a745]/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Öğretmen / Üye Portalını Aç"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#28a745]" />
              <span>Öğretmen Paneli</span>
            </button>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#28a745] text-white text-xs font-bold animate-fade-in shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                Kaydedildi!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AdminLTE Card Tabs Container */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
        {/* Nav Tabs Bar */}
        <div className="bg-[#f4f6f9] border-b border-[#dee2e6] px-3 pt-2 flex flex-wrap gap-1">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 rounded-t transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white text-[#007bff] border-t-2 border-t-[#007bff] border-x border-[#dee2e6] font-bold -mb-[1px] shadow-2xs"
                    : "text-[#6c757d] hover:text-[#495057] hover:bg-[#e9ecef]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#007bff]" : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Card Body & Form */}
        <form onSubmit={handleSave} className="p-5 space-y-6">
          {/* Tab 1: General */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#007bff]" />
                  Platform Temel Bilgileri & Kurumsal Tanımlar
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Site Adı</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">
                    Resmi İletişim E-Postası
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#495057] mb-1">Site Açıklaması</label>
                <textarea
                  rows={3}
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              {/* MEB Dönem & Eğitim-Öğretim Takvimi */}
              <div className="pt-3 border-t border-[#dee2e6]">
                <h4 className="text-xs font-bold text-[#007bff] flex items-center gap-1.5 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  MEB Eğitim-Öğretim Takvimi ve Dönem Yönetimi
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">
                      Aktif Eğitim Yılı
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="Örn: 2025-2026"
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">
                      Aktif MEB Dönemi
                    </label>
                    <select
                      value={academicTerm}
                      onChange={(e) => setAcademicTerm(e.target.value)}
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                    >
                      <option value="1. Dönem">1. Dönem (Eylül - Ocak)</option>
                      <option value="Yarıyıl Tatili">Yarıyıl Tatili (15 Tatil)</option>
                      <option value="2. Dönem">2. Dönem (Şubat - Haziran)</option>
                      <option value="Yaz Dönemi">Yaz Dönemi (Temmuz - Ağustos)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* İndirme Kotaları */}
              <div className="pt-3 border-t border-[#dee2e6]">
                <h4 className="text-xs font-bold text-[#28a745] flex items-center gap-1.5 mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  Evrak İndirme & Kota Sınırları
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">
                      Ziyaretçi / Misafir Günlük İndirme Limiti
                    </label>
                    <input
                      type="number"
                      value={guestLimit}
                      onChange={(e) => setGuestLimit(Number(e.target.value))}
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                    <p className="text-[10px] text-[#6c757d] mt-0.5">Üye olmayan ziyaretçilerin günde indirebileceği evrak sayısı.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">
                      Standart Öğretmen Günlük İndirme Limiti
                    </label>
                    <input
                      type="number"
                      value={teacherLimit}
                      onChange={(e) => setTeacherLimit(Number(e.target.value))}
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                    <p className="text-[10px] text-[#6c757d] mt-0.5">Ücretsiz öğretmen hesabının günlük kota sınırı.</p>
                  </div>
                </div>
              </div>

              {/* Bakım Modu */}
              <div className="p-3.5 rounded bg-[#fff3cd] border border-[#ffeeba] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#856404] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#856404]" />
                    Bakım Modu (Maintenance Mode)
                  </div>
                  <p className="text-[11px] text-[#856404] mt-0.5">
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
                  <div className="w-11 h-6 bg-[#ced4da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffc107]"></div>
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: Ads & Analytics */}
          {activeTab === "ads_analytics" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#ffc107]" />
                  Reklam Kodları, Analitik & Servis Entegrasyonları (Amazon, Google AdSense vb.)
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Platformun ziyaretçi trafiğini ölçmek, reklam gelirleri elde etmek veya Amazon ortaklık (affiliate) programı gibi servisleri entegre etmek için gerekli kimlikleri buradan yönetebilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Google Analytics ID (GA4)</label>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Google AdSense Publisher ID</label>
                  <input
                    type="text"
                    value={googleAdsenseId}
                    onChange={(e) => setGoogleAdsenseId(e.target.value)}
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Amazon Affiliate / Associates Tag</label>
                  <input
                    type="text"
                    value={amazonAffiliateTag}
                    onChange={(e) => setAmazonAffiliateTag(e.target.value)}
                    placeholder="Örn: 2evrak-21"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                  <p className="text-[10px] text-[#6c757d] mt-0.5">Eğitim materyalleri ve kitap önerilerinde kullanılacak Amazon ortaklık etiketi.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Meta Pixel ID (Facebook / Instagram)</label>
                  <input
                    type="text"
                    value={metaPixelId}
                    onChange={(e) => setMetaPixelId(e.target.value)}
                    placeholder="123456789012345"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#dee2e6]">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Özel Header JavaScript / Meta Kodları (&lt;head&gt;)</label>
                  <textarea
                    rows={3}
                    value={customHeadCode}
                    onChange={(e) => setCustomHeadCode(e.target.value)}
                    placeholder="<script async src='...'></script>"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Özel Footer Script Kodları (&lt;/body&gt; öncesi)</label>
                  <textarea
                    rows={3}
                    value={customFooterCode}
                    onChange={(e) => setCustomFooterCode(e.target.value)}
                    placeholder="Örn: Canlı destek veya sayaç kodları..."
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Newsletter & Messages */}
          {activeTab === "newsletter_messages" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#28a745]" />
                  Bülten Aboneliği, Gelen Mesajlar & SMTP Ayarları
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Öğretmenlerin gönderdiği iletişim formu mesajları, bülten abonelikleri ve e-posta bildirim sunucusu (SMTP) yapılandırması.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">SMTP Sunucu Adresi (SMTP Host)</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.mail.com"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">SMTP Kullanıcı Adı / E-posta</label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="noreply@2evrak.com"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Gönderen E-posta Adresi (Sender Email)</label>
                  <input
                    type="text"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="destek@2evrak.com"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">Bülten Abonelik Formu Aktif</div>
                    <div className="text-[11px] text-[#6c757d]">Ana sayfada öğretmenler e-posta bültenine abone olabilir.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletterActive}
                    onChange={(e) => setNewsletterActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">Yeni Mesaj Bildirimi (Admin)</div>
                    <div className="text-[11px] text-[#6c757d]">Gelen mesajlar yönetici e-postasına anında iletilir.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnNewMessage}
                    onChange={(e) => setNotifyOnNewMessage(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#495057] mb-1">Gelen Mesaj Otomatik Yanıt Şablonu</label>
                <textarea
                  rows={3}
                  value={autoReplyTemplate}
                  onChange={(e) => setAutoReplyTemplate(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Pages & Limits */}
          {activeTab === "pages_limits" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#6f42c1]" />
                  Sayfa Yönetimi & Modül İçerik Limitleri Kapsamı
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Her modülde listelenecek içerik sayıları, sayfalama limitleri ve public içerik gönderim kuralları.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Varsayılan Sayfa Başına Kayıt (Default Page Size)</label>
                  <input
                    type="number"
                    value={defaultPageSize}
                    onChange={(e) => setDefaultPageSize(Number(e.target.value))}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Evrak Deposu Sayfa Başına Maksimum Öğe</label>
                  <input
                    type="number"
                    value={maxDocumentsPerPage}
                    onChange={(e) => setMaxDocumentsPerPage(Number(e.target.value))}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#343a40]">Öğretmenlerin Public Evrak Yüklemesine İzin Ver</div>
                  <div className="text-[11px] text-[#6c757d]">Öğretmenler sisteme doküman yükleyebilir, moderasyon onayından sonra yayınlanır.</div>
                </div>
                <input
                  type="checkbox"
                  checked={allowPublicSubmissions}
                  onChange={(e) => setAllowPublicSubmissions(e.target.checked)}
                  className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Import / Export */}
          {activeTab === "import_export" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#17a2b8]" />
                  Konfigürasyon İçeri Aktar & Dışarı Aktar (Backup & Restore)
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Sistemin tüm ayarlarını, API anahtarlarını ve modül konfigürasyonlarını JSON formatında yedekleyin veya başka bir ortama aktarın.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded space-y-3">
                  <h4 className="text-xs font-bold text-[#007bff]">Konfigürasyonu Dışarı Aktar (Export)</h4>
                  <p className="text-[11px] text-[#6c757d]">Tüm sistem ayarlarını JSON dosyası olarak bilgisayarınıza indirin.</p>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="w-full py-2 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Save className="w-4 h-4" />
                    JSON Yedek İndir
                  </button>
                </div>

                <div className="p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded space-y-3">
                  <h4 className="text-xs font-bold text-[#28a745]">Konfigürasyonu İçe Aktar (Import)</h4>
                  <p className="text-[11px] text-[#6c757d]">Daha önce aldığınız yedek JSON dosyasını yükleyerek ayarları geri yükleyin.</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="w-full text-xs text-[#495057] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#e9ecef] file:text-[#495057] hover:file:bg-[#ced4da] cursor-pointer"
                  />
                  {importStatus && (
                    <div className="text-[11px] font-bold text-[#28a745]">{importStatus}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: SEO */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#007bff]" />
                  MEB SEO & Sosyal Medya Kartları
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Arama motoru optimizasyonu (Google, Yandex) ve sosyal paylaşımlarda görüntülenecek başlık ve açıklamalar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#495057] mb-1">
                  Varsayılan Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#495057] mb-1">
                  Varsayılan Meta Description
                </label>
                <textarea
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#495057] mb-1">
                  Sosyal Paylaşım Görseli (OpenGraph Image URL)
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                />
              </div>
            </div>
          )}

          {/* Tab 7: Performance */}
          {activeTab === "performance" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#fd7e14]" />
                  Önbellek & Performans Optimizasyonu
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  1 milyon öğretmen ve ziyaretçi hedefine yönelik hızlandırma ve önbellekleme ayarları.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">Redis Önbellek</div>
                    <div className="text-[11px] text-[#6c757d]">Sorgu hızlandırıcı</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cacheEnabled}
                    onChange={(e) => setCacheEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">Cloudflare CDN</div>
                    <div className="text-[11px] text-[#6c757d]">Statik dosya dağıtımı</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cdnActive}
                    onChange={(e) => setCdnActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">HTML / JS Minify</div>
                    <div className="text-[11px] text-[#6c757d]">Gzip sıkıştırma</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={minifyHtml}
                    onChange={(e) => setMinifyHtml(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#dee2e6] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#343a40]">Uygulama Önbelleğini Temizle</div>
                  <p className="text-[11px] text-[#6c757d]">
                    Tüm evrak sayfalarını ve kategori listelerini yeniden derler.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearCache}
                  className="px-4 py-2 rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {cacheCleared ? "Önbellek Boşaltıldı!" : "Önbelleği Temizle"}
                </button>
              </div>
            </div>
          )}

          {/* Tab 8: Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#dc3545]" />
                  Sistem ve Oturum Güvenliği
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Brute-force koruması, 2FA zorunluluğu ve IP kara liste yönetimi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">
                    Maksimum Hatalı Giriş (Brute Force Limiti)
                  </label>
                  <input
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">
                    Oturum Zaman Aşımı (Dakika)
                  </label>
                  <input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#343a40] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#007bff]" />
                    Yönetici Hesapları için 2FA Zorunluluğu
                  </div>
                  <p className="text-[11px] text-[#6c757d] mt-0.5">
                    Süper Yönetici ve Editör rollerinin girişinde SMS veya Authenticator kodu zorunlu tutulur.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnforced}
                  onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                  className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                />
              </div>

              {/* IP Blacklist */}
              <div className="space-y-2 pt-2 border-t border-[#dee2e6]">
                <label className="block text-xs font-semibold text-[#495057]">
                  Engellenen IP Adresleri (IP Blacklist):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Örn: 185.220.101.5"
                    value={newBlockedIp}
                    onChange={(e) => setNewBlockedIp(e.target.value)}
                    className="flex-1 bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                  <button
                    type="button"
                    onClick={handleAddIp}
                    className="px-4 py-2 rounded bg-[#dc3545] hover:bg-[#c82333] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    IP Engelle
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {systemSettings.security.ipBlacklist.map((ip) => (
                    <span
                      key={ip}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] text-xs font-mono"
                    >
                      <span>{ip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIp(ip)}
                        className="text-[#721c24] hover:text-black font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 9: AI & API */}
          {activeTab === "ai_api" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#e83e8c]" />
                  Yapay Zeka Modelleri & API Entegrasyonları
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  2Evrak platformunda MEB müfredat taraması (Scraper), yıllık planlar, sene başı zümre tutanakları, ortak sınav soruları ve tüm resmi evraklar yapay zeka modelleri tarafından otomatik üretilir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">
                    Ana Yapay Zeka Sağlayıcısı (Primary AI Provider)
                  </label>
                  <select
                    value={primaryProvider}
                    onChange={(e) => setPrimaryProvider(e.target.value as any)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-semibold cursor-pointer"
                  >
                    <option value="gemini">Google Gemini AI (Varsayılan & Önerilen)</option>
                    <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet)</option>
                    <option value="deepseek">DeepSeek (DeepSeek-R1 / V3)</option>
                    <option value="openai">OpenAI (GPT-4o / GPT-4 Turbo)</option>
                    <option value="copilot">Microsoft Copilot API</option>
                    <option value="meta">Meta Llama (Llama 3.1 70B On-Premise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">
                    Varsayılan Üretim Modeli
                  </label>
                  <input
                    type="text"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                    placeholder="Örn: gemini-2.5-flash veya claude-3-5-sonnet"
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                  />
                </div>
              </div>

              {/* API Keys Grid */}
              <div className="space-y-3 pt-2 border-t border-[#dee2e6]">
                <h4 className="text-xs font-bold text-[#007bff]">Sağlayıcı API Anahtarları (API Keys)</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">Google Gemini API Key</label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">Anthropic Claude API Key</label>
                    <input
                      type="password"
                      value={anthropicApiKey}
                      onChange={(e) => setAnthropicApiKey(e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">DeepSeek API Key</label>
                    <input
                      type="password"
                      value={deepseekApiKey}
                      onChange={(e) => setDeepseekApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">OpenAI API Key (GPT-4o)</label>
                    <input
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">Microsoft Copilot API Key</label>
                    <input
                      type="password"
                      value={copilotApiKey}
                      onChange={(e) => setCopilotApiKey(e.target.value)}
                      placeholder="copilot-key-..."
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#495057] mb-1">Meta Llama / Open-Weight Key</label>
                    <input
                      type="password"
                      value={metaApiKey}
                      onChange={(e) => setMetaApiKey(e.target.value)}
                      placeholder="meta-token-..."
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* AI Capability Toggles */}
              <div className="space-y-3 pt-2 border-t border-[#dee2e6]">
                <h4 className="text-xs font-bold text-[#28a745]">Yapay Zeka Otomasyon Yetenekleri</h4>

                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">Scraper AI Okunabilirlik Normalizasyonu</div>
                    <div className="text-[11px] text-[#6c757d]">MEB duyuruları ve tebliğler çekildiğinde yapay zeka ile otomatik düzenlenir.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={scraperAiAutoProcessing}
                    onChange={(e) => setScraperAiAutoProcessing(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded bg-[#f8f9fa] border border-[#dee2e6] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#343a40]">Yıllık Plan & Zümre Otomatik Üretim Motoru</div>
                    <div className="text-[11px] text-[#6c757d]">Öğretmenler branş seçtiğinde yapay zeka yeni maarif modeline uygun taslakları anında hazırlar.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoGenerateZumreAndPlans}
                    onChange={(e) => setAutoGenerateZumreAndPlans(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 10: Header & Footer */}
          {activeTab === "header_footer" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#dee2e6]">
                <h3 className="text-sm font-bold text-[#343a40] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#20c997]" />
                  Header, Footer, Logo, Slogan & Görsel Yönetimi
                </h3>
                <p className="text-xs text-[#6c757d] mt-1">
                  Logo, favicon, site başlığı, slogan, hero arka planı ve kategori kapak görsellerini yönetin.
                </p>
              </div>

              {/* Logo, Favicon & Hero Arka Plan */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#007bff]">Logo, Favicon & Hero Arka Planı</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Logo */}
                  <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded space-y-2">
                    <label className="text-xs font-semibold text-[#495057] flex items-center justify-between">
                      <span>Site Logosu</span>
                      {logoUrl && <span className="text-[10px] text-[#28a745] font-bold">Aktif</span>}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-white border border-[#ced4da] flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#007bff] font-bold">Logo</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <input
                          type="text"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="https://... URL"
                          className="w-full bg-white border border-[#ced4da] rounded p-1 text-[11px] text-[#495057]"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUploadFile}
                          className="block w-full text-[10px] text-[#495057] file:mr-1 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#007bff] file:text-white hover:file:bg-[#0069d9] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Favicon */}
                  <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded space-y-2">
                    <label className="text-xs font-semibold text-[#495057] flex items-center justify-between">
                      <span>Favicon</span>
                      {faviconUrl && <span className="text-[10px] text-[#28a745] font-bold">Aktif</span>}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white border border-[#ced4da] flex items-center justify-center overflow-hidden shrink-0">
                        {faviconUrl ? (
                          <img src={faviconUrl} alt="Favicon" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#6c757d]">Fav</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <input
                          type="text"
                          value={faviconUrl}
                          onChange={(e) => setFaviconUrl(e.target.value)}
                          placeholder="Favicon URL"
                          className="w-full bg-white border border-[#ced4da] rounded p-1 text-[11px] text-[#495057]"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconUploadFile}
                          className="block w-full text-[10px] text-[#495057] file:mr-1 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#007bff] file:text-white hover:file:bg-[#0069d9] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Background */}
                  <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded space-y-2">
                    <label className="text-xs font-semibold text-[#495057] flex items-center justify-between">
                      <span>Hero Arka Planı</span>
                      {heroBackgroundUrl && <span className="text-[10px] text-[#28a745] font-bold">Aktif</span>}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-white border border-[#ced4da] flex items-center justify-center overflow-hidden shrink-0">
                        {heroBackgroundUrl ? (
                          <img src={heroBackgroundUrl} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#6c757d]">Hero</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <input
                          type="text"
                          value={heroBackgroundUrl}
                          onChange={(e) => setHeroBackgroundUrl(e.target.value)}
                          placeholder="Hero Görsel URL"
                          className="w-full bg-white border border-[#ced4da] rounded p-1 text-[11px] text-[#495057]"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroBgUploadFile}
                          className="block w-full text-[10px] text-[#495057] file:mr-1 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#007bff] file:text-white hover:file:bg-[#0069d9] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Background Images Management */}
              <div className="space-y-3 pt-3 border-t border-[#dee2e6]">
                <h4 className="text-xs font-bold text-[#007bff]">Kategori Arka Plan & Kapak Görselleri</h4>
                <p className="text-[11px] text-[#6c757d]">Her bir kategorinin arka plan veya kapak görselini belirleyin.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white border border-[#ced4da] flex items-center justify-center overflow-hidden shrink-0">
                        {cat.imageUrl ? (
                          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#6c757d]">Ksp</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-xs font-bold text-[#343a40] truncate">{cat.name}</div>
                        <input
                          type="text"
                          value={cat.imageUrl || ""}
                          placeholder="Görsel URL (https://...)"
                          onChange={(e) => updateCategory(cat.id, { imageUrl: e.target.value })}
                          className="w-full bg-white border border-[#ced4da] rounded p-1 text-[11px] text-[#495057]"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                updateCategory(cat.id, { imageUrl: ev.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-[9px] text-[#6c757d] file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-[#007bff] file:text-white hover:file:bg-[#0069d9] cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#dee2e6]">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#495057]">Header Site Başlığı</label>
                  <input
                    type="text"
                    value={hfHeaderTitle}
                    onChange={(e) => setHfHeaderTitle(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#495057]">Header Slogan / Alt Başlık</label>
                  <input
                    type="text"
                    value={hfHeaderSubtitle}
                    onChange={(e) => setHfHeaderSubtitle(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#495057]">Header Logo Sembolü (Örn: 2E)</label>
                  <input
                    type="text"
                    value={hfHeaderLogoText}
                    onChange={(e) => setHfHeaderLogoText(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#495057]">Portal Rozet Metni</label>
                  <input
                    type="text"
                    value={hfPortalBadgeText}
                    onChange={(e) => setHfPortalBadgeText(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057]"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="hfShowBadge"
                    checked={hfShowPortalBadge}
                    onChange={(e) => setHfShowPortalBadge(e.target.checked)}
                    className="rounded border-[#ced4da] text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                  />
                  <label htmlFor="hfShowBadge" className="text-xs text-[#495057] font-semibold cursor-pointer">
                    Header Bölümünde "Portal Rozetini" Göster
                  </label>
                </div>

                <div className="md:col-span-2 space-y-1 pt-2 border-t border-[#dee2e6]">
                  <label className="text-xs font-semibold text-[#495057]">Footer Telif Hakları Metni</label>
                  <input
                    type="text"
                    value={hfFooterCopyright}
                    onChange={(e) => setHfFooterCopyright(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs text-[#495057]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#dee2e6] flex items-center justify-between">
            <span className="text-xs text-[#6c757d]">
              Yapılan tüm değişiklikler anında kaydedilir ve önbelleğe yansıtılır.
            </span>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Değişiklikleri Kaydet & Yayınla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
