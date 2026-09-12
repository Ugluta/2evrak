import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SystemSettings,
  Role,
  Permission,
  User,
  MembershipPackage,
  AdItem,
  ScraperSource,
  ScraperJobItem,
  DocumentCategory,
  DocumentItem,
  ContentItem,
  SocialAccount,
  SocialPost,
  DashboardWidget,
  NotificationItem,
  CustomPage,
  MenuItem,
  MediaFile,
  FilterDefinition,
  AIAgent,
  AIExecutionLog,
  ModerationItem,
  SEOSettings,
  AnalyticsSummary,
  AuditLogEntry,
  SecurityMetrics,
  APIKeyItem,
  WebhookEndpoint,
  QueueJob,
  WorkerPoolStatus,
} from "../types";
import {
  initialSystemSettings,
  initialPermissions,
  initialRoles,
  initialUsers,
  initialMembershipPackages,
  initialAds,
  initialScraperSources,
  initialScraperJobs,
  initialDocumentCategories,
  initialDocuments,
  initialContents,
  initialSocialAccounts,
  initialSocialPosts,
  initialDashboardWidgets,
  initialNotifications,
  initialPages,
  initialMenuItems,
  initialMediaFiles,
  initialFilterDefinitions,
  initialAIAgents,
  initialModerationItems,
  initialSEOSettings,
  initialAnalytics,
  initialAuditLogs,
  initialSecurityMetrics,
  initialAPIKeys,
  initialWebhooks,
  initialQueueJobs,
  initialWorkerPoolStatus,
} from "../mockData";

interface AppContextType {
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: Role;
  hasPermission: (permKey: string) => boolean;
  
  // 01 System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;

  // 02 Users & Roles
  users: User[];
  roles: Role[];
  permissions: Permission[];
  addUser: (user: Omit<User, "id" | "createdAt" | "lastLoginAt">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  addRole: (role: Omit<Role, "id">) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;

  // 03 Membership Packages
  packages: MembershipPackage[];
  addPackage: (pkg: Omit<MembershipPackage, "id">) => void;
  updatePackage: (id: string, updates: Partial<MembershipPackage>) => void;
  deletePackage: (id: string) => void;

  // 04 Ads
  ads: AdItem[];
  addAd: (ad: Omit<AdItem, "id" | "stats">) => void;
  updateAd: (id: string, updates: Partial<AdItem>) => void;
  deleteAd: (id: string) => void;
  recordAdClick: (id: string) => void;

  // 05 Scraper
  sources: ScraperSource[];
  scraperJobs: ScraperJobItem[];
  addSource: (source: Omit<ScraperSource, "id" | "lastItemCount">) => void;
  updateSource: (id: string, updates: Partial<ScraperSource>) => void;
  deleteSource: (id: string) => void;
  triggerScrapeSource: (sourceId: string) => Promise<void>;

  // 06 Documents (Unlimited Hierarchy & Soft Delete)
  categories: DocumentCategory[];
  documents: DocumentItem[];
  addCategory: (cat: Omit<DocumentCategory, "id" | "itemCount">) => void;
  updateCategory: (id: string, updates: Partial<DocumentCategory>) => void;
  deleteCategory: (id: string) => void;
  addDocument: (doc: Omit<DocumentItem, "id" | "createdAt" | "updatedAt" | "downloadCount" | "viewCount" | "rating" | "isSoftDeleted">) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  softDeleteDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  permanentDeleteDocument: (id: string) => void;

  // 07 Contents
  contents: ContentItem[];
  addContent: (item: Omit<ContentItem, "id" | "views">) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;

  // 08 Social
  socialAccounts: SocialAccount[];
  socialPosts: SocialPost[];
  addSocialPost: (post: Omit<SocialPost, "id">) => void;
  publishSocialPostNow: (id: string) => void;

  // 09 Dashboard Widgets
  widgets: DashboardWidget[];
  toggleWidgetVisibility: (id: string) => void;
  reorderWidgets: (newWidgets: DashboardWidget[]) => void;
  resetWidgets: () => void;

  // 10 Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendNotification: (notif: Omit<NotificationItem, "id" | "createdAt" | "isRead">) => void;

  // 11 Pages
  pages: CustomPage[];
  addPage: (page: Omit<CustomPage, "id">) => void;
  updatePage: (id: string, updates: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;

  // 12 Menus
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // 13 Media Library
  mediaFiles: MediaFile[];
  addMediaFile: (file: Omit<MediaFile, "id" | "createdAt" | "usages" | "isOrphan">) => void;
  deleteMediaFile: (id: string) => void;
  cleanOrphanFiles: () => void;

  // 14 Dynamic Filters
  filterDefinitions: FilterDefinition[];
  addFilterDefinition: (filter: Omit<FilterDefinition, "id">) => void;
  updateFilterDefinition: (id: string, updates: Partial<FilterDefinition>) => void;
  deleteFilterDefinition: (id: string) => void;

  // 15 AI Agents
  aiAgents: AIAgent[];
  aiLogs: AIExecutionLog[];
  runAgent: (agentKey: string, prompt: string, params?: Record<string, any>) => Promise<string>;

  // 16 Moderation Hub
  moderationItems: ModerationItem[];
  approveModerationItem: (id: string, notes?: string) => void;
  rejectModerationItem: (id: string, reason: string) => void;
  requestRevisionModerationItem: (id: string, notes: string) => void;

  // 17 SEO Center
  seoSettings: SEOSettings;
  updateSEOSettings: (updates: Partial<SEOSettings>) => void;

  // 18 Analytics
  analytics: AnalyticsSummary;

  // 19 Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;

  // 20 System Security
  securityMetrics: SecurityMetrics;
  blockIP: (ip: string) => void;
  unblockIP: (ip: string) => void;

  // 21 API & Integrations
  apiKeys: APIKeyItem[];
  webhooks: WebhookEndpoint[];
  addAPIKey: (key: Omit<APIKeyItem, "id" | "createdAt" | "lastUsedAt">) => void;
  deleteAPIKey: (id: string) => void;
  addWebhook: (wh: Omit<WebhookEndpoint, "id" | "successRate">) => void;
  deleteWebhook: (id: string) => void;

  // 22 Queue & Workers
  queueJobs: QueueJob[];
  workerPool: WorkerPoolStatus;
  retryJob: (id: string) => void;
  cancelJob: (id: string) => void;
  dispatchJob: (queue: string, title: string, payload: Record<string, any>, priority?: "low" | "normal" | "high" | "critical") => void;

  // Global search & UI
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>("09_dashboard");
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(initialSystemSettings);
  const [permissions] = useState<Permission[]>(initialPermissions);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default Super Admin
  const [packages, setPackages] = useState<MembershipPackage[]>(initialMembershipPackages);
  const [ads, setAds] = useState<AdItem[]>(initialAds);
  const [sources, setSources] = useState<ScraperSource[]>(initialScraperSources);
  const [scraperJobs, setScraperJobs] = useState<ScraperJobItem[]>(initialScraperJobs);
  const [categories, setCategories] = useState<DocumentCategory[]>(initialDocumentCategories);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [contents, setContents] = useState<ContentItem[]>(initialContents);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(initialSocialAccounts);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(initialDashboardWidgets);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [pages, setPages] = useState<CustomPage[]>(initialPages);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialMediaFiles);
  const [filterDefinitions, setFilterDefinitions] = useState<FilterDefinition[]>(initialFilterDefinitions);
  const [aiAgents, setAiAgents] = useState<AIAgent[]>(initialAIAgents);
  const [aiLogs, setAiLogs] = useState<AIExecutionLog[]>([]);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(initialModerationItems);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(initialSEOSettings);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(initialAnalytics);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>(initialSecurityMetrics);
  const [apiKeys, setApiKeys] = useState<APIKeyItem[]>(initialAPIKeys);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(initialWebhooks);
  const [queueJobs, setQueueJobs] = useState<QueueJob[]>(initialQueueJobs);
  const [workerPool, setWorkerPool] = useState<WorkerPoolStatus>(initialWorkerPoolStatus);

  const currentRole = roles.find((r) => r.id === currentUser.roleId) || roles[0];

  const hasPermission = (permKey: string): boolean => {
    if (currentRole.slug === "super_admin") return true;
    if (currentUser.customPermissions?.includes(permKey as any)) return true;
    return currentRole.permissions.includes(permKey as any);
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const updateSystemSettings = (updates: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const merged = {
        ...prev,
        ...updates,
        general: { ...prev.general, ...updates.general },
        seo: { ...prev.seo, ...updates.seo },
        performance: { ...prev.performance, ...updates.performance },
        security: { ...prev.security, ...updates.security },
      };
      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "UPDATE_SYSTEM_SETTINGS",
        targetType: "settings",
        targetId: "system_config",
        targetName: "Sistem Ayarları",
        newValue: JSON.stringify(updates),
        ipAddress: "88.255.10.15",
        result: "success",
      });
      return merged;
    });
  };

  // User & Role Handlers
  const addUser = (userData: Omit<User, "id" | "createdAt" | "lastLoginAt">) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastLoginAt: "Henüz giriş yapmadı",
    };
    setUsers((prev) => [newUser, ...prev]);
    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole.name,
      action: "CREATE_USER",
      targetType: "user",
      targetId: newUser.id,
      targetName: newUser.fullName,
      newValue: newUser.email,
      ipAddress: "88.255.10.15",
      result: "success",
    });
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          addAuditLog({
            actorId: currentUser.id,
            actorName: currentUser.fullName,
            actorRole: currentRole.name,
            action: "UPDATE_USER",
            targetType: "user",
            targetId: id,
            targetName: updated.fullName,
            newValue: JSON.stringify(updates),
            ipAddress: "88.255.10.15",
            result: "success",
          });
          return updated;
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (target) {
      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "DELETE_USER",
        targetType: "user",
        targetId: id,
        targetName: target.fullName,
        ipAddress: "88.255.10.15",
        result: "success",
      });
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          addAuditLog({
            actorId: currentUser.id,
            actorName: currentUser.fullName,
            actorRole: currentRole.name,
            action: nextStatus === "active" ? "ACTIVATE_USER" : "SUSPEND_USER",
            targetType: "user",
            targetId: id,
            targetName: u.fullName,
            previousValue: u.status,
            newValue: nextStatus,
            ipAddress: "88.255.10.15",
            result: "success",
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const addRole = (roleData: Omit<Role, "id">) => {
    const newRole: Role = {
      ...roleData,
      id: `role_${Date.now()}`,
    };
    setRoles((prev) => [...prev, newRole]);
    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole.name,
      action: "CREATE_ROLE",
      targetType: "role",
      targetId: newRole.id,
      targetName: newRole.name,
      newValue: JSON.stringify(newRole.permissions),
      ipAddress: "88.255.10.15",
      result: "success",
    });
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          addAuditLog({
            actorId: currentUser.id,
            actorName: currentUser.fullName,
            actorRole: currentRole.name,
            action: "UPDATE_ROLE",
            targetType: "role",
            targetId: id,
            targetName: updated.name,
            newValue: JSON.stringify(updates),
            ipAddress: "88.255.10.15",
            result: "success",
          });
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRole = (id: string) => {
    const target = roles.find((r) => r.id === id);
    if (target?.isSystemRole) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    if (target) {
      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "DELETE_ROLE",
        targetType: "role",
        targetId: id,
        targetName: target.name,
        ipAddress: "88.255.10.15",
        result: "success",
      });
    }
  };

  // Membership Packages
  const addPackage = (pkgData: Omit<MembershipPackage, "id">) => {
    const newPkg: MembershipPackage = { ...pkgData, id: `pkg_${Date.now()}` };
    setPackages((prev) => [...prev, newPkg]);
  };
  const updatePackage = (id: string, updates: Partial<MembershipPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Ads
  const addAd = (adData: Omit<AdItem, "id" | "stats">) => {
    const newAd: AdItem = {
      ...adData,
      id: `ad_${Date.now()}`,
      stats: { impressions: 0, clicks: 0, revenue: 0 },
    };
    setAds((prev) => [newAd, ...prev]);
    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole.name,
      action: "CREATE_AD",
      targetType: "ad",
      targetId: newAd.id,
      targetName: newAd.name,
      ipAddress: "88.255.10.15",
      result: "success",
    });
  };
  const updateAd = (id: string, updates: Partial<AdItem>) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };
  const deleteAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
  };
  const recordAdClick = (id: string) => {
    setAds((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const clicks = a.stats.clicks + 1;
          const impressions = a.stats.impressions + 1;
          const revenue = a.stats.revenue + 2.5;
          return { ...a, stats: { impressions, clicks, revenue } };
        }
        return a;
      })
    );
  };

  // Scraper
  const addSource = (sourceData: Omit<ScraperSource, "id" | "lastItemCount">) => {
    const newSrc: ScraperSource = {
      ...sourceData,
      id: `src_${Date.now()}`,
      lastItemCount: 0,
    };
    setSources((prev) => [...prev, newSrc]);
  };
  const updateSource = (id: string, updates: Partial<ScraperSource>) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };
  const deleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };
  const triggerScrapeSource = async (sourceId: string) => {
    const src = sources.find((s) => s.id === sourceId);
    if (!src) return;

    setSources((prev) => prev.map((s) => (s.id === sourceId ? { ...s, status: "running" } : s)));

    try {
      const resp = await fetch("/api/scraper/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: src.targetUrl, selectors: src.selectors }),
      });
      const data = await resp.json();

      const newJob: ScraperJobItem = {
        id: `job_${Date.now()}`,
        sourceId: src.id,
        sourceName: src.name,
        rawTitle: data.extractedData?.title || "Kazınan Yeni Evrak",
        rawUrl: src.targetUrl,
        foundFiles: data.extractedData?.detectedFiles?.map((f: any) => f.name) || ["meb_dokuman.pdf"],
        scrapedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        similarityScore: data.extractedData?.similarityScore || 0.05,
        isDuplicate: data.extractedData?.duplicateFound || false,
        status: "moderation_queue",
        aiSummary: data.extractedData?.contentSnippet || "MEB duyurusu otomatik çekildi.",
        suggestedCategoryId: src.autoCategoryMapping[0]?.targetCategoryId || "cat_zumre",
      };

      setScraperJobs((prev) => [newJob, ...prev]);

      // Add to moderation queue
      setModerationItems((prev) => [
        {
          id: `mod_${Date.now()}`,
          targetType: "scraper_output",
          targetId: newJob.id,
          title: newJob.rawTitle,
          submittedBy: `Scraper: ${src.name}`,
          submittedAt: newJob.scrapedAt,
          status: "pending",
          aiSafetyScore: 99,
          aiSafetySummary: "Scraper çıktısı doğrulandı, duplicate bulunmadı.",
        },
        ...prev,
      ]);

      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                status: "idle",
                lastRunAt: new Date().toISOString().replace("T", " ").substring(0, 16),
                lastItemCount: s.lastItemCount + 1,
              }
            : s
        )
      );

      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "TRIGGER_SCRAPER",
        targetType: "scraper",
        targetId: src.id,
        targetName: src.name,
        newValue: "Manuel kazıma başarıyla çalıştırıldı ve moderasyona iletildi.",
        ipAddress: "88.255.10.15",
        result: "success",
      });
    } catch (e: any) {
      setSources((prev) => prev.map((s) => (s.id === sourceId ? { ...s, status: "error", errorLog: e.message } : s)));
    }
  };

  // Documents & Sınırsız Hiyerarşi
  const addCategory = (catData: Omit<DocumentCategory, "id" | "itemCount">) => {
    const newCat: DocumentCategory = {
      ...catData,
      id: `cat_${Date.now()}`,
      itemCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole.name,
      action: "CREATE_CATEGORY",
      targetType: "category",
      targetId: newCat.id,
      targetName: newCat.name,
      newValue: `Parent: ${newCat.parentId || "Root"}`,
      ipAddress: "88.255.10.15",
      result: "success",
    });
  };

  const updateCategory = (id: string, updates: Partial<DocumentCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
  };

  const addDocument = (docData: Omit<DocumentItem, "id" | "createdAt" | "updatedAt" | "downloadCount" | "viewCount" | "rating" | "isSoftDeleted">) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc_${Date.now()}`,
      downloadCount: 0,
      viewCount: 1,
      rating: 5.0,
      isSoftDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    // Add to Moderation Queue if not published immediately
    if (newDoc.status !== "published") {
      setModerationItems((prev) => [
        {
          id: `mod_${Date.now()}`,
          targetType: "document",
          targetId: newDoc.id,
          title: newDoc.title,
          submittedBy: newDoc.authorName,
          submittedAt: now,
          status: "pending",
          aiSafetyScore: 96,
          aiSafetySummary: "Öğretmen evrakı yüklendi, moderasyon incelemesinde.",
        },
        ...prev,
      ]);
    }

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole.name,
      action: "CREATE_DOCUMENT",
      targetType: "document",
      targetId: newDoc.id,
      targetName: newDoc.title,
      newValue: `Tür: ${newDoc.docType}, Kategori: ${newDoc.categoryId}`,
      ipAddress: "88.255.10.15",
      result: "success",
    });
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = { ...d, ...updates, updatedAt: now };
          addAuditLog({
            actorId: currentUser.id,
            actorName: currentUser.fullName,
            actorRole: currentRole.name,
            action: "UPDATE_DOCUMENT",
            targetType: "document",
            targetId: id,
            targetName: updated.title,
            newValue: JSON.stringify(updates),
            ipAddress: "88.255.10.15",
            result: "success",
          });
          return updated;
        }
        return d;
      })
    );
  };

  // Soft Delete, Restore & Audit Trail
  const softDeleteDocument = (id: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isSoftDeleted: true,
              deletedAt: now,
              deletedBy: currentUser.fullName,
            }
          : d
      )
    );
    const target = documents.find((d) => d.id === id);
    if (target) {
      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "SOFT_DELETE_DOCUMENT",
        targetType: "document",
        targetId: id,
        targetName: target.title,
        previousValue: "active",
        newValue: "soft_deleted",
        ipAddress: "88.255.10.15",
        result: "success",
      });
    }
  };

  const restoreDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isSoftDeleted: false,
              deletedAt: undefined,
              deletedBy: undefined,
            }
          : d
      )
    );
    const target = documents.find((d) => d.id === id);
    if (target) {
      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "RESTORE_DOCUMENT",
        targetType: "document",
        targetId: id,
        targetName: target.title,
        previousValue: "soft_deleted",
        newValue: "restored_active",
        ipAddress: "88.255.10.15",
        result: "success",
      });
    }
  };

  const permanentDeleteDocument = (id: string) => {
    const target = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (target) {
      addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.fullName,
        actorRole: currentRole.name,
        action: "PERMANENT_DELETE_DOCUMENT",
        targetType: "document",
        targetId: id,
        targetName: target.title,
        ipAddress: "88.255.10.15",
        result: "warning",
      });
    }
  };

  // Content Handlers
  const addContent = (item: Omit<ContentItem, "id" | "views">) => {
    const newContent: ContentItem = {
      ...item,
      id: `cnt_${Date.now()}`,
      views: 0,
    };
    setContents((prev) => [newContent, ...prev]);
  };
  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };
  const deleteContent = (id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  // Social Handlers
  const addSocialPost = (post: Omit<SocialPost, "id">) => {
    const newPost: SocialPost = { ...post, id: `sp_${Date.now()}` };
    setSocialPosts((prev) => [newPost, ...prev]);
  };
  const publishSocialPostNow = (id: string) => {
    setSocialPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "published",
              publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              metrics: { impressions: 1420, engagements: 85, shares: 12 },
            }
          : p
      )
    );
  };

  // Widgets
  const toggleWidgetVisibility = (id: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, isVisible: !w.isVisible } : w)));
  };
  const reorderWidgets = (newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets);
  };
  const resetWidgets = () => {
    setWidgets(initialDashboardWidgets);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };
  const sendNotification = (notif: Omit<NotificationItem, "id" | "createdAt" | "isRead">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Pages
  const addPage = (page: Omit<CustomPage, "id">) => {
    setPages((prev) => [...prev, { ...page, id: `page_${Date.now()}` }]);
  };
  const updatePage = (id: string, updates: Partial<CustomPage>) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  // Menus
  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    setMenuItems((prev) => [...prev, { ...item, id: `m_${Date.now()}` }]);
  };
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };
  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id && m.parentId !== id));
  };

  // Media
  const addMediaFile = (file: Omit<MediaFile, "id" | "createdAt" | "usages" | "isOrphan">) => {
    const newMedia: MediaFile = {
      ...file,
      id: `med_${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      usages: [],
      isOrphan: true,
    };
    setMediaFiles((prev) => [newMedia, ...prev]);
  };
  const deleteMediaFile = (id: string) => {
    setMediaFiles((prev) => prev.filter((m) => m.id !== id));
  };
  const cleanOrphanFiles = () => {
    setMediaFiles((prev) => prev.filter((m) => !m.isOrphan));
  };

  // Dynamic Filters
  const addFilterDefinition = (filter: Omit<FilterDefinition, "id">) => {
    setFilterDefinitions((prev) => [...prev, { ...filter, id: `f_${Date.now()}` }]);
  };
  const updateFilterDefinition = (id: string, updates: Partial<FilterDefinition>) => {
    setFilterDefinitions((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };
  const deleteFilterDefinition = (id: string) => {
    setFilterDefinitions((prev) => prev.filter((f) => f.id !== id));
  };

  // AI Agents Hub - Real Gemini Endpoint Integration
  const runAgent = async (agentKey: string, prompt: string, params?: Record<string, any>): Promise<string> => {
    try {
      const response = await fetch("/api/ai/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType: agentKey, prompt, parameters: params }),
      });
      const data = await response.json();
      const output = data.output || "Sonuç üretilemedi.";

      // Log execution
      const newLog: AIExecutionLog = {
        id: `ailog_${Date.now()}`,
        agentKey: agentKey as any,
        prompt,
        output,
        tokensUsed: data.tokensUsed || 240,
        status: "success",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      setAiLogs((prev) => [newLog, ...prev]);

      // Increment agent usage
      setAiAgents((prev) =>
        prev.map((a) => (a.key === agentKey ? { ...a, runsCount: a.runsCount + 1 } : a))
      );

      return output;
    } catch (err: any) {
      console.error("AI run agent error:", err);
      return "Hata oluştu: " + err.message;
    }
  };

  // Moderation Hub Handlers
  const approveModerationItem = (id: string, notes?: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setModerationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // If it's a document, publish it!
          if (item.targetType === "document") {
            setDocuments((dList) =>
              dList.map((d) => (d.id === item.targetId ? { ...d, status: "published" } : d))
            );
          }
          return {
            ...item,
            status: "approved",
            reviewerNotes: notes || "Tüm kontroller sağlandı, onaylandı.",
            reviewedBy: currentUser.fullName,
            reviewedAt: now,
          };
        }
        return item;
      })
    );
  };

  const rejectModerationItem = (id: string, reason: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setModerationItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "rejected",
              reviewerNotes: reason,
              reviewedBy: currentUser.fullName,
              reviewedAt: now,
            }
          : item
      )
    );
  };

  const requestRevisionModerationItem = (id: string, notes: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    setModerationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.targetType === "document") {
            setDocuments((dList) =>
              dList.map((d) => (d.id === item.targetId ? { ...d, status: "revision_required" } : d))
            );
          }
          return {
            ...item,
            status: "revision_required",
            reviewerNotes: notes,
            reviewedBy: currentUser.fullName,
            reviewedAt: now,
          };
        }
        return item;
      })
    );
  };

  // SEO Settings
  const updateSEOSettings = (updates: Partial<SEOSettings>) => {
    setSeoSettings((prev) => ({ ...prev, ...updates }));
  };

  // Security
  const blockIP = (ip: string) => {
    setSystemSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        ipBlacklist: [...prev.security.ipBlacklist, ip],
      },
    }));
  };
  const unblockIP = (ip: string) => {
    setSystemSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        ipBlacklist: prev.security.ipBlacklist.filter((item) => item !== ip),
      },
    }));
  };

  // API Keys & Webhooks
  const addAPIKey = (keyData: Omit<APIKeyItem, "id" | "createdAt" | "lastUsedAt">) => {
    setApiKeys((prev) => [
      {
        ...keyData,
        id: `key_${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        lastUsedAt: "Henüz kullanılmadı",
      },
      ...prev,
    ]);
  };
  const deleteAPIKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };
  const addWebhook = (wh: Omit<WebhookEndpoint, "id" | "successRate">) => {
    setWebhooks((prev) => [...prev, { ...wh, id: `wh_${Date.now()}`, successRate: 100 }]);
  };
  const deleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  // Queue & Worker Management
  const retryJob = (id: string) => {
    setQueueJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: "processing",
              attempts: j.attempts + 1,
              progressPercent: 10,
              startedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
            }
          : j
      )
    );
  };

  const cancelJob = (id: string) => {
    setQueueJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "failed", errorReason: "Kullanıcı tarafından iptal edildi" } : j))
    );
  };

  const dispatchJob = (
    queue: string,
    title: string,
    payload: Record<string, any>,
    priority: "low" | "normal" | "high" | "critical" = "normal"
  ) => {
    const newJob: QueueJob = {
      id: `job_${Date.now()}`,
      queue: queue as any,
      title,
      priority,
      status: "waiting",
      attempts: 0,
      maxAttempts: 3,
      progressPercent: 0,
      payload,
    };
    setQueueJobs((prev) => [newJob, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeModuleId,
        setActiveModuleId,
        currentUser,
        setCurrentUser,
        currentRole,
        hasPermission,
        systemSettings,
        updateSystemSettings,
        users,
        roles,
        permissions,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        addRole,
        updateRole,
        deleteRole,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        ads,
        addAd,
        updateAd,
        deleteAd,
        recordAdClick,
        sources,
        scraperJobs,
        addSource,
        updateSource,
        deleteSource,
        triggerScrapeSource,
        categories,
        documents,
        addCategory,
        updateCategory,
        deleteCategory,
        addDocument,
        updateDocument,
        softDeleteDocument,
        restoreDocument,
        permanentDeleteDocument,
        contents,
        addContent,
        updateContent,
        deleteContent,
        socialAccounts,
        socialPosts,
        addSocialPost,
        publishSocialPostNow,
        widgets,
        toggleWidgetVisibility,
        reorderWidgets,
        resetWidgets,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        sendNotification,
        pages,
        addPage,
        updatePage,
        deletePage,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        mediaFiles,
        addMediaFile,
        deleteMediaFile,
        cleanOrphanFiles,
        filterDefinitions,
        addFilterDefinition,
        updateFilterDefinition,
        deleteFilterDefinition,
        aiAgents,
        aiLogs,
        runAgent,
        moderationItems,
        approveModerationItem,
        rejectModerationItem,
        requestRevisionModerationItem,
        seoSettings,
        updateSEOSettings,
        analytics,
        auditLogs,
        addAuditLog,
        securityMetrics,
        blockIP,
        unblockIP,
        apiKeys,
        webhooks,
        addAPIKey,
        deleteAPIKey,
        addWebhook,
        deleteWebhook,
        queueJobs,
        workerPool,
        retryJob,
        cancelJob,
        dispatchJob,
        globalSearchQuery,
        setGlobalSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
