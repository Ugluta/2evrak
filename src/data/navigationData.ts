export interface NavigationSubItem {
  id: string;
  title: string;
  actionId: string;
  badge?: string;
  description?: string;
}

export interface NavigationModuleItem {
  id: string;
  num: string;
  title: string;
  groupName: string;
  iconName: string;
  badge?: string | number;
  badgeColor?: string;
  description: string;
  subItems?: NavigationSubItem[];
}

export interface NavigationGroup {
  name: string;
  order: number;
  iconName: string;
  description: string;
  items: NavigationModuleItem[];
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    name: "Yönetim & Panel",
    order: 1,
    iconName: "LayoutDashboard",
    description: "Ana panel, bildirimler ve sistem kontrol merkezi",
    items: [
      {
        id: "09_dashboard",
        num: "09",
        title: "Dinamik Yönetim Paneli",
        groupName: "Yönetim & Panel",
        iconName: "LayoutDashboard",
        description: "1 Milyon öğretmen ekosistemi için gerçek zamanlı canlı akış",
        subItems: [
          { id: "genel_bakis", title: "Genel İstatistikler", actionId: "09_dashboard" },
          { id: "hizli_evrak", title: "Hızlı Evrak Ekle", actionId: "09_dashboard" },
          { id: "hizli_icerik", title: "Hızlı İçerik Oluştur", actionId: "09_dashboard" },
          { id: "son_evraklar", title: "Son Eklenen Evraklar", actionId: "09_dashboard" },
        ],
      },
      {
        id: "10_notifications",
        num: "10",
        title: "Bildirim Merkezi",
        groupName: "Yönetim & Panel",
        iconName: "Bell",
        description: "Sistem, zümre ve MEB duyuru bildirimleri yönetimi",
        subItems: [
          { id: "bildirimler", title: "Gelen Bildirimler", actionId: "10_notifications" },
          { id: "uyarilar", title: "Sistem Uyarıları", actionId: "10_notifications" },
          { id: "sablonlar", title: "SMS & E-Posta Şablonları", actionId: "10_notifications" },
        ],
      },
    ],
  },
  {
    name: "Doküman & İçerik",
    order: 2,
    iconName: "FolderTree",
    description: "MEB müfredatı, zümre tutanakları ve evrak havuzu",
    items: [
      {
        id: "06_documents",
        num: "06",
        title: "Doküman Yönetimi",
        groupName: "Doküman & İçerik",
        iconName: "FileText",
        description: "Zümre tutanakları, yazılı soruları, yıllık planlar ve BEP",
        subItems: [
          { id: "zumre", title: "Zümre Toplantı Tutanakları", actionId: "06_documents" },
          { id: "yazili", title: "Yazılı & Ortak Sınav Soruları", actionId: "06_documents" },
          { id: "planlar", title: "Yıllık Planlar & Çerçeve", actionId: "06_documents" },
          { id: "bep", title: "BEP Gelişim Evrakları", actionId: "06_documents" },
        ],
      },
      {
        id: "07_contents",
        num: "07",
        title: "İçerik Yönetimi",
        groupName: "Doküman & İçerik",
        iconName: "BookOpen",
        description: "Pedagojik makaleler, MEB duyuruları ve öğretmen rehberleri",
        subItems: [
          { id: "icerik_moderasyon", title: "İçerik Moderasyon Havuzu", actionId: "07_contents" },
          { id: "haberler", title: "Haber & Duyurular", actionId: "07_contents" },
          { id: "rehberler", title: "Rehberlik & Makaleler", actionId: "07_contents" },
          { id: "taslaklar", title: "Taslak ve Bekleyenler", actionId: "07_contents" },
        ],
      },
      {
        id: "23_curriculum_calendar",
        num: "23",
        title: "MEB Müfredat & Takvim",
        groupName: "Doküman & İçerik",
        iconName: "CalendarDays",
        badge: "13 Kademe",
        badgeColor: "bg-emerald-500/20 text-emerald-600",
        description: "1-12. sınıf yeni maarif modeli müfredatı ve akademik takvim",
        subItems: [
          { id: "calisma_takvimi", title: "MEB Çalışma Takvimi", actionId: "23_curriculum_calendar" },
          { id: "mufredat_kademeler", title: "1-12 Kademe Müfredatı", actionId: "23_curriculum_calendar" },
          { id: "ders_cizelgeleri", title: "Haftalık Ders Çizelgeleri", actionId: "23_curriculum_calendar" },
        ],
      },
      {
        id: "24_judicial_precedents",
        num: "24",
        title: "Mevzuat & Yargı Emsal",
        groupName: "Doküman & İçerik",
        iconName: "Scale",
        badge: "Danıştay",
        badgeColor: "bg-cyan-500/20 text-cyan-600",
        description: "Öğretmen hakları, nöbet muafiyetleri ve emsal mahkeme kararları",
        subItems: [
          { id: "emsal_kararlar", title: "Danıştay & Mahkeme Kararları", actionId: "24_judicial_precedents" },
          { id: "ozluk_ictihat", title: "Özlük Hakları Emsalleri", actionId: "24_judicial_precedents" },
          { id: "hukuk_filtre", title: "Hukuki Arama & Filtre", actionId: "24_judicial_precedents" },
        ],
      },
      {
        id: "25_dilekcematik",
        num: "25",
        title: "Dilekçematik (40+ Şablon)",
        groupName: "Doküman & İçerik",
        iconName: "FileText",
        badge: "Yeni",
        badgeColor: "bg-purple-500/20 text-purple-600",
        description: "Mevzuata uygun öğretmen dilekçeleri otomatik üretim motoru",
        subItems: [
          { id: "ozluk", title: "Özlük & Mazeret İzinleri", actionId: "25_dilekcematik" },
          { id: "nobet", title: "Nöbet & Ek Ders İtirazları", actionId: "25_dilekcematik" },
          { id: "gorevlendirme", title: "Müdürlük Görevlendirme", actionId: "25_dilekcematik" },
          { id: "hizmetici", title: "Hizmet İçi Eğitim Başvurusu", actionId: "25_dilekcematik" },
        ],
      },
      {
        id: "11_pages",
        num: "11",
        title: "Sayfa Yönetimi",
        groupName: "Doküman & İçerik",
        iconName: "Layers",
        description: "Statik sayfalar, kurumsal bilgi ve yardım merkezi",
        subItems: [
          { id: "kurumsal_sayfalar", title: "Kurumsal Sayfalar", actionId: "11_pages" },
          { id: "yardim_sss", title: "Yardım & SSS", actionId: "11_pages" },
          { id: "yeni_sayfa", title: "Yeni Statik Sayfa", actionId: "11_pages" },
        ],
      },
      {
        id: "12_menus",
        num: "12",
        title: "Menü Yönetimi",
        groupName: "Doküman & İçerik",
        iconName: "Menu",
        description: "Header, sidebar akordeon ve footer navigasyon ağacı",
        subItems: [
          { id: "header", title: "Header & Navigasyon", actionId: "12_menus" },
          { id: "sidebar", title: "Sol Sidebar Akordeon", actionId: "12_menus" },
          { id: "footer", title: "Footer Hızlı Linkler", actionId: "12_menus" },
          { id: "mobile", title: "Mobil Alt Bar", actionId: "12_menus" },
        ],
      },
      {
        id: "13_media",
        num: "13",
        title: "Medya / Dosya Kütüphanesi",
        groupName: "Doküman & İçerik",
        iconName: "Image",
        description: "Yüklenen evrak, PDF ve görsel dosyaları yönetimi",
        subItems: [
          { id: "evrak_dosyalari", title: "Evrak Dosyaları", actionId: "13_media" },
          { id: "gorseller", title: "Görseller & Logolar", actionId: "13_media" },
          { id: "yetim_temizlik", title: "Yetim Dosya Temizliği", actionId: "13_media" },
        ],
      },
      {
        id: "14_search_filter",
        num: "14",
        title: "Kategori & Filtreleme",
        groupName: "Doküman & İçerik",
        iconName: "Filter",
        description: "Zümre kategorileri, sınıf kademeleri ve evrak etiketleri",
        subItems: [
          { id: "kategoriler", title: "Zümre / Branş Kategorileri", actionId: "14_search_filter" },
          { id: "kademeler", title: "Sınıf Kademeleri (1-12)", actionId: "14_search_filter" },
          { id: "turler", title: "Doküman Türleri", actionId: "14_search_filter" },
          { id: "emsal", title: "Emsal Karar Konuları", actionId: "14_search_filter" },
        ],
      },
    ],
  },
  {
    name: "Zeka & Otomasyon",
    order: 3,
    iconName: "Sparkles",
    description: "Gemini AI ajanları, botlar, kuyruklar ve moderasyon",
    items: [
      {
        id: "15_ai_agents",
        num: "15",
        title: "AI / Ajan Merkezi",
        groupName: "Zeka & Otomasyon",
        iconName: "Sparkles",
        badge: "Gemini",
        badgeColor: "bg-purple-500/20 text-purple-600",
        description: "MEB soru üretici, zümre toplantı asistanı ve BEP planlayıcı",
        subItems: [
          { id: "soru_uretici", title: "MEB Soru Üretici Ajanı", actionId: "15_ai_agents" },
          { id: "zumre_asistani", title: "Zümre Toplantı Asistanı", actionId: "15_ai_agents" },
          { id: "bep_planlayici", title: "BEP Gelişim Planlayıcı", actionId: "15_ai_agents" },
        ],
      },
      {
        id: "05_scrapers",
        num: "05",
        title: "Scraper / Kaynak Yönetimi",
        groupName: "Zeka & Otomasyon",
        iconName: "Radio",
        description: "MEB ve EBA resmi kaynaklarını otomatik izleme ve kazıma",
        subItems: [
          { id: "scraper_moderasyon", title: "Scraper Moderasyon Havuzu", actionId: "05_scrapers" },
          { id: "kaynak_listesi", title: "MEB / EBA Kaynakları", actionId: "05_scrapers" },
          { id: "canli_kazima", title: "Canlı Kazıma İşleri", actionId: "05_scrapers" },
          { id: "yeni_bot", title: "Yeni Bot Ekle", actionId: "05_scrapers" },
        ],
      },
      {
        id: "08_social",
        num: "08",
        title: "Sosyal Medya Yönetimi",
        groupName: "Zeka & Otomasyon",
        iconName: "Share2",
        description: "WhatsApp, Telegram ve sosyal medya otomatik paylaşım botu",
        subItems: [
          { id: "bagli_kanallar", title: "Bağlı Kanallar", actionId: "08_social" },
          { id: "zamanlanmis", title: "Zamanlanmış Paylaşımlar", actionId: "08_social" },
          { id: "gonderi_olustur", title: "Gönderi Oluştur", actionId: "08_social" },
        ],
      },
      {
        id: "16_moderation",
        num: "16",
        title: "Moderasyon Merkezi",
        groupName: "Zeka & Otomasyon",
        iconName: "ShieldCheck",
        description: "Kullanıcı yüklemeleri, telif ve içerik güvenlik onayı",
        subItems: [
          { id: "onay_bekleyen", title: "Onay Bekleyen Evraklar", actionId: "16_moderation" },
          { id: "raporlanan", title: "Raporlanan İçerikler", actionId: "16_moderation" },
          { id: "ai_filtre", title: "AI Güvenlik Filtresi", actionId: "16_moderation" },
        ],
      },
      {
        id: "22_queue_workers",
        num: "22",
        title: "Kuyruk / Zamanlanmış Görevler",
        groupName: "Zeka & Otomasyon",
        iconName: "Cpu",
        description: "BullMQ worker havuzu, OCR ve arka plan asenkron işlemler",
        subItems: [
          { id: "aktif_worker", title: "Aktif Worker Durumu", actionId: "22_queue_workers" },
          { id: "basarisiz", title: "Başarısız Görevler", actionId: "22_queue_workers" },
          { id: "metrikler", title: "Kuyruk Metrikleri", actionId: "22_queue_workers" },
        ],
      },
    ],
  },
  {
    name: "Kullanıcı & Gelir Modelleri",
    order: 4,
    iconName: "Users",
    description: "Öğretmen üyelikleri, VIP paketler ve reklam alanları",
    items: [
      {
        id: "02_users_roles",
        num: "02",
        title: "Kullanıcı / Rol / İzin (RBAC)",
        groupName: "Kullanıcı & Gelir Modelleri",
        iconName: "Users",
        description: "Öğretmen profilleri, MEBBİS doğrulama ve rol yetki matrisi",
        subItems: [
          { id: "ogretmenler", title: "Öğretmen Listesi", actionId: "02_users_roles" },
          { id: "meb_dogrulama", title: "MEB Doğrulama Bekleyenler", actionId: "02_users_roles" },
          { id: "rbac_matrisi", title: "Roller & İzin Matrisi", actionId: "02_users_roles" },
        ],
      },
      {
        id: "03_packages",
        num: "03",
        title: "Üyelik Paketleri",
        groupName: "Kullanıcı & Gelir Modelleri",
        iconName: "Award",
        description: "Bireysel öğretmen ve VIP zümre üyelik abonelikleri",
        subItems: [
          { id: "bireysel_paket", title: "Bireysel Öğretmen", actionId: "03_packages" },
          { id: "kurumsal_vip", title: "Zümre & Kurumsal VIP", actionId: "03_packages" },
          { id: "fiyatlandirma", title: "Paket Fiyatlandırma", actionId: "03_packages" },
        ],
      },
      {
        id: "04_ads",
        num: "04",
        title: "Reklam Yönetimi",
        groupName: "Kullanıcı & Gelir Modelleri",
        iconName: "Megaphone",
        description: "Header, zümre arası banner ve sponsor alanları yönetimi",
        subItems: [
          { id: "aktif_bannerlar", title: "Aktif Bannerlar", actionId: "04_ads" },
          { id: "gosterim_istatistik", title: "Gösterim İstatistikleri", actionId: "04_ads" },
          { id: "yeni_reklam", title: "Yeni Reklam Alanı", actionId: "04_ads" },
        ],
      },
    ],
  },
  {
    name: "SEO & Analitik",
    order: 5,
    iconName: "BarChart3",
    description: "Google SEO, sitemap, öğretmen trafik analizleri ve loglar",
    items: [
      {
        id: "17_seo",
        num: "17",
        title: "SEO Merkezi",
        groupName: "SEO & Analitik",
        iconName: "Globe",
        description: "Meta etiketleri, sitemap.xml ve Schema.org zümre yapıları",
        subItems: [
          { id: "meta_etiketler", title: "Meta Etiketleri", actionId: "17_seo" },
          { id: "sitemap", title: "Sitemap & Robots.txt", actionId: "17_seo" },
          { id: "schema_org", title: "Schema.org Yapılandırması", actionId: "17_seo" },
        ],
      },
      {
        id: "18_analytics",
        num: "18",
        title: "İstatistik / Analitik",
        groupName: "SEO & Analitik",
        iconName: "BarChart3",
        description: "En çok indirilen evraklar, branş dağılımı ve ziyaretçi trafiği",
        subItems: [
          { id: "indirme_rapor", title: "İndirme Raporları", actionId: "18_analytics" },
          { id: "populer_zumreler", title: "En Popüler Zümreler", actionId: "18_analytics" },
          { id: "trafik", title: "Kullanıcı Trafiği", actionId: "18_analytics" },
        ],
      },
      {
        id: "19_audit_logs",
        num: "19",
        title: "Log / Denetim İzi (Audit)",
        groupName: "SEO & Analitik",
        iconName: "ScrollText",
        description: "Yönetici işlem kayıtları, güvenlik denetimi ve dışa aktarma",
        subItems: [
          { id: "yonetici_islem", title: "Yönetici İşlem Günlüğü", actionId: "19_audit_logs" },
          { id: "guvenlik_ihlal", title: "Güvenlik İhlalleri", actionId: "19_audit_logs" },
          { id: "export_kayit", title: "Dışa Aktarma (Export)", actionId: "19_audit_logs" },
        ],
      },
    ],
  },
  {
    name: "Sistem & Altyapı",
    order: 6,
    iconName: "Sliders",
    description: "Sistem ayarları, güvenlik duvarı ve API anahtarları",
    items: [
      {
        id: "01_system_settings",
        num: "01",
        title: "Sistem Ayarları",
        groupName: "Sistem & Altyapı",
        iconName: "Sliders",
        description: "Platform adı, MEB genel parametreleri ve görünüm kuralları",
        subItems: [
          { id: "genel_ayar", title: "Genel Konfigürasyon", actionId: "01_system_settings" },
          { id: "header_footer_ayar", title: "Header & Footer Tasarımı", actionId: "01_system_settings" },
          { id: "yedekleme", title: "Veritabanı Yedekleme", actionId: "01_system_settings" },
        ],
      },
      {
        id: "20_security",
        num: "20",
        title: "Sistem Güvenliği",
        groupName: "Sistem & Altyapı",
        iconName: "Lock",
        description: "Firewall, IP engelleme, 2FA ve şifrelenmiş veri güvenliği",
        subItems: [
          { id: "ip_firewall", title: "IP Engelleme & Firewall", actionId: "20_security" },
          { id: "rate_limit", title: "Rate Limit Koruması", actionId: "20_security" },
          { id: "iki_asama", title: "İki Aşamalı Doğrulama (2FA)", actionId: "20_security" },
        ],
      },
      {
        id: "21_api_integrations",
        num: "21",
        title: "API / Entegrasyonlar",
        groupName: "Sistem & Altyapı",
        iconName: "Code2",
        description: "REST API anahtarları, Webhook uç noktaları ve harici servisler",
        subItems: [
          { id: "api_keys", title: "API Anahtarları", actionId: "21_api_integrations" },
          { id: "webhooks_tab", title: "Webhooks", actionId: "21_api_integrations" },
          { id: "harici_sistem", title: "Harici Sistem Bağlantıları", actionId: "21_api_integrations" },
        ],
      },
    ],
  },
];

export const getModuleById = (id: string, customGroups?: NavigationGroup[]): NavigationModuleItem | undefined => {
  const groups = customGroups || NAVIGATION_GROUPS;
  for (const group of groups) {
    const found = group.items.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
};

export const getGroupByModuleId = (id: string, customGroups?: NavigationGroup[]): NavigationGroup | undefined => {
  const groups = customGroups || NAVIGATION_GROUPS;
  return groups.find((group) => group.items.some((item) => item.id === id));
};
