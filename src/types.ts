/**
 * 2Evrak - Type Definitions
 * Designed for 1,000,000 Teachers Scale
 */

// 01 — SİSTEM AYARLARI
export interface SystemSettings {
  general: {
    siteName: string;
    logoUrl: string;
    faviconUrl: string;
    description: string;
    language: "tr" | "en";
    timezone: string;
    currency: string;
    contactPhone: string;
    contactEmail: string;
    maintenanceMode: boolean;
    academicYear?: string; // Örn: "2025-2026"
    academicTerm?: string; // Örn: "1. Dönem", "2. Dönem", "Yaz Dönemi"
    guestDailyDownloadLimit?: number;
    teacherDailyDownloadLimit?: number;
  };
  seo: {
    siteTitle: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    robotsTxt: string;
    sitemapEnabled: boolean;
    defaultSchemaType: string;
    ogImageUrl: string;
  };
  performance: {
    cacheEngine: "redis" | "memcached" | "memory";
    cacheEnabled: boolean;
    cdnUrl: string;
    imageWebpAutoConvert: boolean;
    lazyLoading: boolean;
    apiRateLimitPerMin: number;
  };
  security: {
    sessionTimeoutMinutes: number;
    passwordMinLength: number;
    requireSpecialChar: boolean;
    twoFactorAuthPolicy: "optional" | "mandatory_for_staff" | "mandatory_all";
    rateLimitEnabled: boolean;
    ipBlacklist: string[];
    ipWhitelist: string[];
    allowedMimeTypes: string[];
    maxUploadSizeMb: number;
    auditLogRetentionDays: number;
  };
  aiApi: {
    primaryProvider: "gemini" | "anthropic" | "deepseek" | "openai" | "copilot" | "meta";
    geminiApiKey: string;
    anthropicApiKey: string;
    deepseekApiKey: string;
    openaiApiKey: string;
    copilotApiKey: string;
    metaApiKey: string;
    defaultModel: string;
    scraperAiAutoProcessing: boolean;
    autoGenerateZumreAndPlans: boolean;
  };
  thirdPartyAdsAndAnalytics: {
    googleAnalyticsId: string;
    googleAdsenseId: string;
    amazonAffiliateTag: string;
    metaPixelId: string;
    customHeadCode: string;
    customFooterCode: string;
  };
  newsletterAndMessages: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    senderEmail: string;
    newsletterActive: boolean;
    notifyOnNewMessage: boolean;
    autoReplyTemplate: string;
  };
  calendarAndAcademic: {
    academicYear: string;
    termName: string;
    termStartDate: string;
    termEndDate: string;
    holidaySchedule: string;
  };
  moduleLimitsAndPages: {
    defaultPageSize: number;
    maxDocumentsPerPage: number;
    featuredModules: string[];
    allowPublicSubmissions: boolean;
  };
  headerFooterConfig: {
    headerTitle: string;
    headerSubtitle: string;
    headerLogoText: string;
    showPortalBadge: boolean;
    portalBadgeText: string;
    footerCopyright: string;
    footerAboutText: string;
    heroBackgroundUrl?: string;
    footerAccordionColumns: Array<{
      title: string;
      links: Array<{ label: string; url: string; isExternal?: boolean }>;
    }>;
  };
}

// 02 — KULLANICI / ROL / İZİN
export type PermissionKey =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "publish"
  | "moderate"
  | "import"
  | "export"
  | "manage_system";

export interface Permission {
  id: string;
  key: PermissionKey;
  name: string;
  category: "Doküman" | "İçerik" | "Kullanıcı" | "Sistem" | "AI & Scraper";
  description: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  order: number;
  permissions: PermissionKey[];
  isSystemRole?: boolean;
  color: string;
}

export interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  roleId: string;
  customPermissions?: PermissionKey[];
  packageId: string;
  status: "active" | "suspended" | "pending";
  branch: string; // Öğretmen Branşı (Matematik, Türkçe, Fizik...)
  schoolType: string; // Devlet Okulu, Özel vb.
  city: string;
  avatarUrl: string;
  createdAt: string;
  lastLoginAt: string;
  twoFactorEnabled: boolean;
  documentsDownloaded: number;
  aiCreditsUsed: number;
  verifiedTeacher?: boolean; // MEBBİS / E-Devlet onaylı öğretmen
  phone?: string;
  tcNo?: string; // T.C. Kimlik No (11 hane - maskelenmiş saklanır/gösterilir)
  mebbisNo?: string; // MEBBİS Kurum/Öğretmen Sicil No
  verifiedAt?: string; // Doğrulama tarihi
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
  // Öğretmen Profil ve Görev Tanımları
  schoolName?: string;
  assignedGrades?: string[];
  clubActivity?: string;
  guidanceDuty?: string;
}

// 03 — ÜYELİK PAKETLERİ
export interface MembershipPackage {
  id: string;
  name: string;
  badge: string;
  priceMonthly: number;
  priceYearly: number;
  isActive: boolean;
  order: number;
  isTeacherSpecial?: boolean; // MEBBİS/TC ile doğrulanmış öğretmenlere özel avantaj paketi
  limits: {
    documentDownloadsPerDay: number; // 0 = unlimited
    aiCreditsPerMonth: number;
    aiQuestionGenerationMonthly: number;
    maxDocumentCreationMonthly: number;
    storageMb: number;
    canShareSocial: boolean;
    hasSpecialContentAccess: boolean;
    canExportPdfWord: boolean;
    cleanHeaderlessExport: boolean; // Başlıksız / filigransız / temiz MEB formatında çıktı alabilme
    directZipDownload: boolean; // Toplu evrak & zümre arşivi (ZIP) tek tıkla indirme
    customWatermarkRemoval: boolean; // 2Evrak tanıtım filigranını kaldırma
    priorityQueue: boolean; // Yoğun dönemlerde anında yüksek hızlı indirme önceliği
  };
  description: string;
}

// 04 — REKLAM YÖNETİMİ
export type AdPlacementArea =
  | "header"
  | "menu"
  | "content_top"
  | "content_inline"
  | "content_bottom"
  | "sidebar"
  | "footer"
  | "mobile_sticky"
  | "custom_modal";

export type AdType =
  | "image"
  | "html"
  | "javascript"
  | "video"
  | "interstitial"
  | "popup"
  | "sticky"
  | "native"
  | "custom_code";

export interface AdItem {
  id: string;
  name: string;
  area: AdPlacementArea;
  type: AdType;
  contentUrl?: string;
  htmlSnippet?: string;
  redirectUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  priority: number; // 1 to 10
  targetPages: string[]; // e.g. ["all", "home", "document_detail"]
  targetCategories: string[]; // Category IDs or ["all"]
  targetDevices: ("desktop" | "mobile" | "tablet")[];
  targetUserTypes: ("all" | "guest" | "free_user" | "premium_user")[];
  impressionCap: number; // max per day per user
  stats: {
    impressions: number;
    clicks: number;
    revenue: number; // ₺
  };
}

// 05 — SCRAPER / KAYNAK YÖNETİMİ
export interface ScraperSource {
  id: string;
  name: string;
  targetUrl: string;
  isActive: boolean;
  scheduleCron: string; // e.g. "0 * * * *"
  lastRunAt?: string;
  status: "idle" | "running" | "error" | "paused";
  selectors: {
    container: string;
    title: string;
    content: string;
    fileUrl: string;
    image: string;
    date: string;
  };
  autoCategoryMapping: {
    ruleKeyword: string;
    targetCategoryId: string;
  }[];
  autoTagMapping: string[];
  lastItemCount: number;
  errorLog?: string;
}

export interface ScraperJobItem {
  id: string;
  sourceId: string;
  sourceName: string;
  rawTitle: string;
  rawUrl: string;
  foundFiles: string[];
  scrapedAt: string;
  similarityScore: number;
  isDuplicate: boolean;
  status: "raw" | "ai_processed" | "moderation_queue" | "published" | "discarded";
  aiSummary?: string;
  suggestedCategoryId?: string;
}

// 06 — DOKÜMAN YÖNETİMİ (Sınırsız Hiyerarşi & Detay)
export interface DocumentCategory {
  id: string;
  parentId: string | null; // null for root categories
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  itemCount: number;
  children?: DocumentCategory[]; // nested helper
}

export type DocumentStatus =
  | "draft"
  | "pending_review"
  | "in_review"
  | "revision_required"
  | "approved"
  | "published"
  | "archived";

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryIds: string[];
  schoolType: string; // Devlet, Özel, BİLSEM, İmam Hatip, Mesleki ve Teknik
  gradeLevel: string; // Okul Öncesi, İlkokul, Ortaokul, Lise
  classNumber: string; // 1. Sınıf - 12. Sınıf
  lesson: string; // Matematik, Türkçe, Fen Bilimleri, Tarih...
  branch: string;
  subject: string; // Konu: Kesirler, Hücre Bölünmesi, Lozan Antlaşması...
  term: string; // 1. Dönem, 2. Dönem, Sene Başı
  docType: string; // Yıllık Plan, Zümre Tutanağı, Yazılı Sınavı, Çalışma Kağıdı, Kulüp Evrakı, ŞÖK, BEP Planı
  year: string; // 2025-2026
  fileUrl: string;
  fileName: string;
  fileType: "pdf" | "docx" | "xlsx" | "pptx" | "zip" | "image";
  fileExtension?: string;
  fileSizeBytes: number;
  fileSize?: string;
  previewUrl?: string;
  tags: string[];
  source: string; // MEB, Öğretmen Yüklemesi, Scraper, AI Üretimi
  authorId: string;
  authorName: string;
  accessLevel?: "free" | "teacher_pro" | "vip";
  status: DocumentStatus;
  isSoftDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  downloadCount: number;
  viewCount: number;
  rating: number;
  seoDescription?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// 07 — İÇERİK YÖNETİMİ
export type ContentType =
  | "news"
  | "blog"
  | "announcement"
  | "guide"
  | "article"
  | "training"
  | "special";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  summary: string;
  body: string;
  coverImageUrl: string;
  tags: string[];
  status: DocumentStatus;
  authorName: string;
  publishedAt?: string;
  views: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  aiGeneratedFields?: {
    summaryGenerated: boolean;
    seoGenerated: boolean;
    socialCopyGenerated: boolean;
  };
}

// 08 — SOSYAL MEDYA
export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "telegram"
  | "youtube";

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  handle: string;
  isConnected: boolean;
  followersCount: number;
}

export interface SocialPost {
  id: string;
  referenceType: "document" | "content" | "custom";
  referenceId?: string;
  targetPlatforms: SocialPlatform[];
  contentPerPlatform: Record<SocialPlatform, string>;
  mediaUrl?: string;
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledFor?: string;
  publishedAt?: string;
  metrics?: {
    impressions: number;
    engagements: number;
    shares: number;
  };
}

// 09 — DİNAMİK YÖNETİM PANELİ (Widget Sistemi)
export interface DashboardWidget {
  id: string;
  title: string;
  category: "kpi" | "chart" | "queue" | "recent" | "quick_action";
  size: "small" | "medium" | "large" | "full";
  order: number;
  isVisible: boolean;
  componentKey: string;
}

// 10 — BİLDİRİM MERKEZİ
export type NotificationType =
  | "system"
  | "new_document"
  | "moderation"
  | "package"
  | "ai"
  | "scraper"
  | "admin"
  | "security";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  channels: ("site" | "email" | "push" | "mobile")[];
  targetGroup: "all_teachers" | "branch_specific" | "premium_users" | "admins";
  targetUserId?: string;
  priority?: "low" | "normal" | "high";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// 11 — SAYFA YÖNETİMİ
export interface PageBlock {
  id: string;
  type: "hero" | "rich_text" | "two_column" | "document_grid" | "faq" | "contact_form";
  title?: string;
  content: string;
  settings?: Record<string, any>;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  blocks: PageBlock[];
  order: number;
  seoTitle: string;
  seoDescription: string;
  schemaType: string;
  publishedAt: string;
}

// 12 — MENÜ YÖNETİMİ
export interface MenuItem {
  id: string;
  parentId: string | null;
  label: string;
  type: "url" | "page" | "category" | "external";
  targetValue: string;
  order: number;
  requiredRole?: string; // null = everyone
  requiredPackage?: string; // null = everyone
  openInNewTab: boolean;
  isActive: boolean;
}

// 13 — MEDYA / DOSYA KÜTÜPHANESİ
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  category: "image" | "document" | "video" | "archive";
  uploadedBy: string;
  createdAt: string;
  isScannedSafe: boolean;
  metadata: {
    dimensions?: string;
    checksumSha256: string;
  };
  usages: { type: "document" | "content" | "page"; id: string; name: string }[];
  isOrphan: boolean;
}

// 14 — DİNAMİK ARAMA VE FİLTRELEME
export interface FilterDefinition {
  id: string;
  key: string;
  label: string;
  options: string[];
  order: number;
  isMultiSelect: boolean;
  isSystemCore: boolean;
}

// 15 — AI / AJAN MERKEZİ
export type AIAgentKey =
  | "icerik_ajani"
  | "dokuman_ajani"
  | "yazili_soru_ajani"
  | "ders_plani_ajani"
  | "evrak_ajani"
  | "seo_ajani"
  | "moderasyon_ajani"
  | "scraper_ajani"
  | "sosyal_ajani";

export interface AIAgent {
  key: AIAgentKey;
  name: string;
  badge: string;
  description: string;
  iconName: string;
  defaultPrompt: string;
  exampleInputs: string[];
  provider: "gemini-3.8-flash" | "claude-3-5" | "openai-gpt4o" | "local_llm";
  runsCount: number;
  avgResponseSec: number;
}

export interface AIExecutionLog {
  id: string;
  agentKey: AIAgentKey;
  prompt: string;
  output: string;
  tokensUsed: number;
  status: "success" | "pending" | "failed";
  createdAt: string;
}

// 16 — MODERASYON MERKEZİ
export type ModerationTargetType =
  | "document"
  | "content"
  | "user"
  | "comment"
  | "ai_output"
  | "scraper_output"
  | "ad"
  | "social_post";

export interface ModerationItem {
  id: string;
  targetType: ModerationTargetType;
  targetId: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "in_review" | "revision_required" | "rejected" | "approved";
  aiSafetyScore: number; // 0-100
  aiSafetySummary: string;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// 17 — SEO MERKEZİ
export interface SEOSettings {
  robotsTxt: string;
  sitemapXmlGenerated: string;
  defaultSchemaOrg: string;
  redirects: { source: string; target: string; code: 301 | 302 }[];
  brokenLinks404: { path: string; hits: number; lastDetected: string }[];
  spamChecker: {
    totalDocumentsScanned: number;
    cleanRate: number;
    flaggedKeywords: string[];
  };
}

// 18 — İSTATİSTİK / ANALİTİK
export interface AnalyticsSummary {
  totalTeachers: number;
  activeToday: number;
  totalDocuments: number;
  totalDownloads: number;
  topSearchTerms: { term: string; count: number }[];
  emptySearches: { term: string; count: number }[];
  downloadsPerDay: { date: string; count: number }[];
  branchBreakdown: { branch: string; docCount: number; downloadCount: number }[];
  adPerformance: { impressions: number; clicks: number; ctr: number; revenue: number };
  aiTokenConsumption: { agent: string; tokens: number }[];
  scraperSuccessRate: number;
}

// 19 — LOG / DENETİM (Audit Log)
export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: "user" | "role" | "document" | "category" | "ad" | "settings" | "ai" | "scraper";
  targetId: string;
  targetName: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  result: "success" | "failure" | "warning";
  timestamp: string;
}

// 20 — GÜVENLİK
export interface SecurityMetrics {
  healthScore: number; // 0-100
  rbacEnforced: boolean;
  rateLimitBlockedRequests: number;
  ssrfAttemptsBlocked: number;
  fileUploadThreatsBlocked: number;
  activeSessions: number;
  recentThreatLogs: {
    id: string;
    type: string;
    ip: string;
    details: string;
    timestamp: string;
    severity: "low" | "medium" | "high" | "critical";
  }[];
}

// 21 — API / ENTEGRASYONLAR
export interface APIKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  rateLimitPerMinute: number;
  createdAt: string;
  lastUsedAt: string;
  isActive: boolean;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastTriggeredAt?: string;
  successRate: number;
}

// 22 — KUYRUK / ZAMANLANMIŞ GÖREVLER (Queue & Worker Engine)
export type QueueType =
  | "scraper_queue"
  | "ai_queue"
  | "pdf_ocr_queue"
  | "social_queue"
  | "notification_queue"
  | "seo_queue";

export interface QueueJob {
  id: string;
  queue: QueueType;
  title: string;
  priority: "low" | "normal" | "high" | "critical";
  status: "waiting" | "processing" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  errorReason?: string;
  payload: Record<string, any>;
}

export interface WorkerPoolStatus {
  totalWorkers: number;
  activeWorkers: number;
  jobsProcessedToday: number;
  avgDurationMs: number;
  queues: Record<
    QueueType,
    {
      waiting: number;
      processing: number;
      completed: number;
      failed: number;
    }
  >;
}

// 23 — MEB ÇALIŞMA TAKVİMİ & MÜFREDAT MOTORU (13 KADEME & DİNAMİK TARİH SİSTEMİ)
export interface AcademicCalendarWeek {
  weekNumber: number; // 1 - 38
  term: "1. Dönem" | "2. Dönem";
  startDate: string; // "2025-09-08"
  endDate: string; // "2025-09-12"
  isHoliday: boolean;
  holidayName?: string; // "Ara Tatil", "Yarıyıl Tatili", "29 Ekim Cumhuriyet Bayramı", vb.
  themeOrMilestone?: string; // "Okulların Açılışı", "1. Ortak Sınav Haftası" vb.
}

export interface AcademicCalendarConfig {
  academicYear: string; // "2025-2026"
  firstTermStart: string; // "2025-09-08"
  firstTermMidBreakStart: string; // "2025-11-10"
  firstTermMidBreakEnd: string; // "2025-11-14"
  firstTermEnd: string; // "2026-01-16"
  semesterBreakStart: string; // "2026-01-19"
  semesterBreakEnd: string; // "2026-01-30"
  secondTermStart: string; // "2026-02-02"
  secondTermMidBreakStart: string; // "2026-04-06"
  secondTermMidBreakEnd: string; // "2026-04-10"
  secondTermEnd: string; // "2026-06-19"
  weeks: AcademicCalendarWeek[];
}

export type MebSchoolType =
  | "Okul Öncesi"
  | "İlkokul"
  | "Ortaokul"
  | "İmam Hatip Ortaokulu"
  | "Anadolu Lisesi"
  | "Fen Lisesi"
  | "Sosyal Bilimler Lisesi"
  | "Anadolu İmam Hatip Lisesi"
  | "Mesleki ve Teknik Anadolu Lisesi (MTAL)"
  | "Güzel Sanatlar ve Spor Lisesi";

export type SubjectCategory = "Ortak / Zorunlu" | "Seçmeli" | "Rehberlik";

export interface TtkbWeeklyScheduleInfo {
  id: string;
  schoolType: MebSchoolType;
  gradeLevelId: string;
  gradeName: string;
  totalMandatoryHours: number;
  totalElectiveHours: number;
  totalWeeklyHours: number;
  ttkbDecisionNumber: string;
  ttkbDecisionDate: string;
  bulletinNumber: string;
  notes?: string;
}

export interface CurriculumCompetency {
  code: string; // Örn: "MAT.9.1.1"
  weekNumber: number; // Bağlı olduğu çalışma takvimi haftası
  title: string;
  subTopics: string[];
  hoursPerWeek: number;
  textbookUnit: string; // Ders Kitabı Ünite Referansı: "Ünite 1: Mantık ve Kümeler"
  suggestedActivities: string[];
}

export interface JudicialPrecedent {
  id: string;
  title: string;
  court:
    | "Danıştay 2. Daire"
    | "Danıştay 5. Daire"
    | "Danıştay 8. Daire"
    | "Anayasa Mahkemesi"
    | "Yargıtay"
    | "İdare Mahkemesi"
    | "MEB Yüksek Disiplin Kurulu";
  caseNo: string; // Örn: "2024/1452 E., 2025/892 K."
  date: string; // Örn: "14.05.2025"
  category:
    | "Özlük Hakları & Ek Ders"
    | "Disiplin Soruşturmaları"
    | "Atama & Yer Değiştirme"
    | "Yönetici Atama"
    | "Rapor & İzin Hakları"
    | "Mobbing & İdari İşlemler";
  summary: string;
  fullText: string;
  legalBasis: string; // Örn: "657 Sayılı Kanun Madde 125, 4483 Sayılı Kanun"
  result: "İptal Kararı" | "Onama" | "Yürütmenin Durdurulması" | "Bozma" | "Red";
  tags: string[];
  viewCount: number;
  downloadCount: number;
}

export interface GradeCurriculum {
  id: string;
  gradeLevelId: string; // "anaokulu", "1", "2", ... "12" (Toplam 13 Kademe)
  gradeName: string; // "Anaokulu / Okul Öncesi", "1. Sınıf", ... "12. Sınıf"
  category: "Okul Öncesi" | "İlkokul" | "Ortaokul" | "Lise";
  levelStage: "Temel Eğitim" | "Ortaöğretim"; // MEB İdari Yapılanması: Temel Eğitim (Okul Öncesi, İlkokul 1-4, Ortaokul 5-8) & Ortaöğretim (Lise 9-12)
  maarifModelStatus: "Kademeli Geçiş (Yeni Model)" | "Sabit Müfredat (Önceki Model)";
  maarifRolloutYear: string; // Örn: "2024-2025 Başlangıç (1, 5, 9)", "2025-2026 (2, 6, 10)", vb.
  applicableSchoolTypes?: MebSchoolType[];
  ttkbKararNo?: string;
  lessons: {
    lessonKey: string;
    lessonName: string;
    weeklyHours: number;
    subjectCategory?: SubjectCategory; // "Ortak / Zorunlu" | "Seçmeli" | "Rehberlik"
    applicableSchoolTypes?: MebSchoolType[];
    textbookName: string;
    textbookAuthorOrPublisher: string;
    curriculumVersion: string; // "2024 Türkiye Yüzyılı Maarif Modeli" veya "2018 MEB Programı"
    isUpdatedThisYear: boolean; // Müfredat bu yıl değişti mi?
    lastMebBulletinDate: string; // Tebliğler Dergisi Tarih/Sayı
    ttkbDecisionNumber?: string;
    competencies: CurriculumCompetency[];
  }[];
}

export type MobileGridCols = 1 | 2 | 3 | 4;

export interface MobileLayoutSettings {
  gridCols: MobileGridCols;
  iconDensity: "compact" | "normal" | "spacious";
  showQuickActions: boolean;
  twoColumnForms: boolean;
}
