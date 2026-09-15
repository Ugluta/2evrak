import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FolderTree,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  FolderPlus,
  Sliders,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  Menu as MenuIcon,
  Tag,
  Search,
} from "lucide-react";
import { DocumentCategory } from "../../types";
import { NavigationGroup, NavigationModuleItem } from "../../data/navigationData";

export const MenuCategoryManager: React.FC = () => {
  const {
    navigationGroups,
    updateNavigationGroup,
    updateNavigationModule,
    updateNavigationSubItem,
    resetNavigationToDefault,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    documents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"nav_modules" | "categories">("nav_modules");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Group Modal / State
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [editingGroupDesc, setEditingGroupDesc] = useState("");

  // Edit Module State
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState("");
  const [editingModuleDesc, setEditingModuleDesc] = useState("");

  // Edit SubItem State
  const [editingSubItemId, setEditingSubItemId] = useState<{ moduleId: string; subId: string } | null>(null);
  const [editingSubItemTitle, setEditingSubItemTitle] = useState("");

  // Add Category State
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatParent, setNewCatParent] = useState<string>("");
  const [newCatIcon, setNewCatIcon] = useState("Folder");

  // Edit Category State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatDesc, setEditingCatDesc] = useState("");

  // Feedback Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Group expand toggles
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Yönetim & Panel": true,
    "Doküman & İçerik": true,
    "Zeka & Otomasyon": true,
    "Kullanıcı & Gelir Modelleri": true,
    "SEO & Analitik": true,
    "Sistem & Altyapı": true,
  });

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Handlers for Groups
  const handleStartEditGroup = (group: NavigationGroup) => {
    setEditingGroupId(group.name);
    setEditingGroupName(group.name);
    setEditingGroupDesc(group.description || "");
  };

  const handleSaveGroup = (oldName: string) => {
    if (!editingGroupName.trim()) return;
    updateNavigationGroup(oldName, editingGroupName.trim(), editingGroupDesc.trim());
    setEditingGroupId(null);
    showToast(`"${editingGroupName}" grup başlığı başarıyla güncellendi.`);
  };

  // Handlers for Modules
  const handleStartEditModule = (item: NavigationModuleItem) => {
    setEditingModuleId(item.id);
    setEditingModuleTitle(item.title);
    setEditingModuleDesc(item.description || "");
  };

  const handleSaveModule = (moduleId: string) => {
    if (!editingModuleTitle.trim()) return;
    updateNavigationModule(moduleId, {
      title: editingModuleTitle.trim(),
      description: editingModuleDesc.trim(),
    });
    setEditingModuleId(null);
    showToast(`Modül başlığı "${editingModuleTitle}" olarak güncellendi.`);
  };

  // Handlers for SubItems
  const handleStartEditSubItem = (moduleId: string, subId: string, currentTitle: string) => {
    setEditingSubItemId({ moduleId, subId });
    setEditingSubItemTitle(currentTitle);
  };

  const handleSaveSubItem = (moduleId: string, subId: string) => {
    if (!editingSubItemTitle.trim()) return;
    updateNavigationSubItem(moduleId, subId, editingSubItemTitle.trim());
    setEditingSubItemId(null);
    showToast(`Alt menü öğesi "${editingSubItemTitle}" olarak güncellendi.`);
  };

  // Handlers for Categories
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: newCatDesc.trim() || `${newCatName} doküman kategorisi`,
      parentId: newCatParent ? newCatParent : null,
      icon: newCatIcon,
      order: categories.length + 1,
      isActive: true,
      seoTitle: `${newCatName} - MEB Evrak Arşivi`,
      seoDescription: `${newCatName} evrakları, zümreleri ve sınav soruları`,
    });

    setIsAddCatOpen(false);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatDesc("");
    setNewCatParent("");
    showToast(`"${newCatName}" kategorisi başarıyla eklendi.`);
  };

  const handleStartEditCategory = (cat: DocumentCategory) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
    setEditingCatDesc(cat.description || "");
  };

  const handleSaveCategory = (catId: string) => {
    if (!editingCatName.trim()) return;
    updateCategory(catId, {
      name: editingCatName.trim(),
      description: editingCatDesc.trim(),
    });
    setEditingCatId(null);
    showToast(`Kategori "${editingCatName}" olarak güncellendi.`);
  };

  const handleDeleteCategory = (catId: string, name: string) => {
    if (window.confirm(`"${name}" kategorisini ve alt kategorilerini silmek istediğinize emin misiniz?`)) {
      deleteCategory(catId);
      showToast(`"${name}" kategorisi silindi.`);
    }
  };

  const handleResetNavigation = () => {
    if (
      window.confirm(
        "Tüm menü grupları, modül başlıkları ve alt menü isimleri varsayılan fabrika ayarlarına sıfırlanacaktır. Emin misiniz?"
      )
    ) {
      resetNavigationToDefault();
      showToast("Tüm menü ve modül isimleri varsayılan değerlere sıfırlandı.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Fast Actions */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#e8f4ff] text-[#007bff] flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#212529] tracking-tight">
                Panel Menü & Kategori Yönetim Merkezi
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#28a745]/10 text-[#28a745] border border-[#28a745]/30">
                Canlı Senkronize
              </span>
            </div>
            <p className="text-xs text-[#6c757d] mt-0.5">
              Paneldeki tüm menü gruplarını, 26 modül başlığını, alt menü maddelerini ve evrak kategorilerini tek tıkla düzenleyin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetNavigation}
            className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold text-[#dc3545] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Tüm menü isimlerini varsayılan standart ayarlara geri döndür"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#dc3545]" />
            <span>Varsayılana Sıfırla</span>
          </button>

          {activeTab === "categories" && (
            <button
              type="button"
              onClick={() => setIsAddCatOpen(true)}
              className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Yeni Kategori Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMsg && (
        <div className="p-3 rounded bg-[#eaf7ed] border border-[#28a745]/30 text-[#1e7e34] text-xs font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#28a745] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tabs & Search Bar */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-xs p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 bg-[#f4f6f9] p-1 rounded">
          <button
            type="button"
            onClick={() => setActiveTab("nav_modules")}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "nav_modules"
                ? "bg-white text-[#007bff] shadow-xs"
                : "text-[#6c757d] hover:text-[#212529]"
            }`}
          >
            <MenuIcon className="w-3.5 h-3.5" />
            <span>Panel Menüleri & Modüller (26)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-white text-[#007bff] shadow-xs"
                : "text-[#6c757d] hover:text-[#212529]"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Doküman Kategorileri ({categories.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#6c757d] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Başlık veya kategori ara..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff] bg-white text-[#212529]"
          />
        </div>
      </div>

      {/* TAB 1: Panel Menüleri & Modül İsimleri */}
      {activeTab === "nav_modules" && (
        <div className="space-y-3">
          {navigationGroups.map((group) => {
            const isExpanded = expandedGroups[group.name] ?? true;
            const filteredItems = group.items.filter((item) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                item.title.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q) ||
                item.subItems?.some((s) => s.title.toLowerCase().includes(q))
              );
            });

            if (searchQuery.trim() && filteredItems.length === 0) return null;

            return (
              <div
                key={group.name}
                className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden"
              >
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(group.name)}
                  className="bg-[#f8f9fa] border-b border-[#dee2e6] px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#e9ecef] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#6c757d]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#6c757d]" />
                    )}
                    <div>
                      {editingGroupId === group.name ? (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingGroupName}
                            onChange={(e) => setEditingGroupName(e.target.value)}
                            className="px-2 py-1 text-xs border border-[#007bff] rounded bg-white font-bold"
                          />
                          <input
                            type="text"
                            value={editingGroupDesc}
                            onChange={(e) => setEditingGroupDesc(e.target.value)}
                            placeholder="Grup açıklaması..."
                            className="px-2 py-1 text-xs border border-[#ced4da] rounded bg-white w-48 text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveGroup(group.name)}
                            className="px-2 py-1 rounded bg-[#28a745] text-white text-xs font-bold"
                          >
                            Kaydet
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingGroupId(null)}
                            className="px-2 py-1 rounded bg-[#6c757d] text-white text-xs"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#343a40]">
                            {group.name}
                          </span>
                          <span className="text-[11px] text-[#6c757d]">
                            ({group.items.length} Modül)
                          </span>
                          <span className="text-[11px] text-[#adb5bd] hidden md:inline">
                            • {group.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingGroupId !== group.name && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditGroup(group);
                      }}
                      className="px-2 py-1 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-[11px] text-[#007bff] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3 text-[#007bff]" />
                      <span>Grup İsmini Değiştir</span>
                    </button>
                  )}
                </div>

                {/* Modules Grid under Group */}
                {isExpanded && (
                  <div className="p-3 divide-y divide-[#dee2e6]">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                        {editingModuleId === item.id ? (
                          <div className="p-3 bg-[#e8f4ff] rounded border border-[#007bff]/40 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-[#007bff] text-white font-mono text-[10px] font-bold">
                                {item.num}
                              </span>
                              <input
                                type="text"
                                value={editingModuleTitle}
                                onChange={(e) => setEditingModuleTitle(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-xs border border-[#ced4da] rounded bg-white font-bold text-[#212529]"
                                placeholder="Modül Başlığı..."
                              />
                            </div>
                            <input
                              type="text"
                              value={editingModuleDesc}
                              onChange={(e) => setEditingModuleDesc(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#495057]"
                              placeholder="Modül Açıklaması..."
                            />
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingModuleId(null)}
                                className="px-3 py-1 rounded bg-[#6c757d] text-white text-xs font-medium"
                              >
                                İptal
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveModule(item.id)}
                                className="px-3 py-1 rounded bg-[#007bff] text-white text-xs font-bold shadow-xs flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Kaydet & Güncelle</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#007bff]/10 text-[#007bff] font-mono text-[10px] font-bold">
                                  {item.num}
                                </span>
                                <span className="font-bold text-xs text-[#212529]">
                                  {item.title}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f4f6f9] text-[#6c757d] font-mono">
                                  ID: {item.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6c757d] pl-8">
                                {item.description}
                              </p>

                              {/* Sub-items if any */}
                              {item.subItems && item.subItems.length > 0 && (
                                <div className="pl-8 pt-1.5 flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-[#495057] uppercase tracking-wider">
                                    Alt Menüler:
                                  </span>
                                  {item.subItems.map((sub) => (
                                    <div
                                      key={sub.id}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f8f9fa] border border-[#dee2e6] text-[11px] text-[#495057]"
                                    >
                                      {editingSubItemId?.moduleId === item.id &&
                                      editingSubItemId?.subId === sub.id ? (
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="text"
                                            value={editingSubItemTitle}
                                            onChange={(e) => setEditingSubItemTitle(e.target.value)}
                                            className="px-1 py-0.2 text-[10px] border border-[#007bff] rounded bg-white"
                                            autoFocus
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleSaveSubItem(item.id, sub.id)}
                                            className="text-[#28a745] hover:text-[#1e7e34]"
                                          >
                                            <Check className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <span>{sub.title}</span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleStartEditSubItem(item.id, sub.id, sub.title)
                                            }
                                            className="text-[#6c757d] hover:text-[#007bff] cursor-pointer"
                                            title="Alt menü başlığını değiştir"
                                          >
                                            <Edit2 className="w-2.5 h-2.5" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleStartEditModule(item)}
                              className="px-2.5 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[11px] text-[#495057] font-semibold flex items-center gap-1 self-start transition-colors shrink-0"
                            >
                              <Edit2 className="w-3 h-3 text-[#007bff]" />
                              <span>Başlığı Düzenle</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Doküman & Evrak Kategorileri */}
      {activeTab === "categories" && (
        <div className="bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
          <div className="p-3 border-b border-[#dee2e6] bg-[#f8f9fa] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#007bff]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#343a40]">
                Aktif Evrak & Zümre Kategori Havuzu ({categories.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#6c757d]">
              Toplam {documents.length} Doküman Kategoriye Bağlı
            </span>
          </div>

          <div className="divide-y divide-[#dee2e6]">
            {categories
              .filter((c) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  c.name.toLowerCase().includes(q) ||
                  c.slug.toLowerCase().includes(q) ||
                  c.description?.toLowerCase().includes(q)
                );
              })
              .map((cat) => {
                const docCount = documents.filter(
                  (d) => d.categoryId === cat.id || d.categoryId === cat.slug
                ).length;

                return (
                  <div key={cat.id} className="p-3 hover:bg-[#f8f9fa] transition-colors">
                    {editingCatId === cat.id ? (
                      <div className="p-3 bg-[#e8f4ff] rounded border border-[#007bff]/40 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs border border-[#ced4da] rounded bg-white font-bold text-[#212529]"
                            placeholder="Kategori Adı..."
                          />
                        </div>
                        <input
                          type="text"
                          value={editingCatDesc}
                          onChange={(e) => setEditingCatDesc(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-[#ced4da] rounded bg-white text-[#495057]"
                          placeholder="Açıklama..."
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="px-3 py-1 rounded bg-[#6c757d] text-white text-xs font-medium"
                          >
                            İptal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveCategory(cat.id)}
                            className="px-3 py-1 rounded bg-[#007bff] text-white text-xs font-bold shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Kaydet</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#e8f4ff] text-[#007bff] flex items-center justify-center font-bold text-xs shrink-0">
                            📁
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#212529]">{cat.name}</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#f4f6f9] text-[#6c757d] text-[10px] font-mono">
                                /{cat.slug}
                              </span>
                              {cat.parentId && (
                                <span className="px-1.5 py-0.2 rounded bg-[#ffc107]/20 text-[#856404] text-[10px]">
                                  Alt Kategori
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6c757d] mt-0.5">{cat.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#f4f6f9] text-[#495057] border border-[#dee2e6]">
                            {docCount} Evrak
                          </span>

                          <button
                            type="button"
                            onClick={() => handleStartEditCategory(cat)}
                            className="px-2 py-1 rounded bg-white hover:bg-[#e9ecef] border border-[#ced4da] text-[11px] text-[#007bff] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Düzenle</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1 rounded hover:bg-[#f8d7da] text-[#dc3545] border border-transparent hover:border-[#dc3545]/30 transition-colors"
                            title="Kategoriyi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-[#dee2e6] bg-[#f8f9fa] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#212529] flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#007bff]" />
                <span>Yeni Doküman Kategorisi Ekle</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCatOpen(false)}
                className="text-[#6c757d] hover:text-[#212529] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#343a40] block">
                  Kategori Adı <span className="text-[#dc3545]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")
                          .replace(/-+/g, "-")
                      );
                    }
                  }}
                  placeholder="Örn: Mesleki Çalışma ve Seminerler"
                  className="w-full px-3 py-2 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#343a40] block">
                  Kategori Slug (URL Yolu)
                </label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="Örn: mesleki-calismalar"
                  className="w-full px-3 py-2 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#343a40] block">
                  Üst Kategori (Varsa)
                </label>
                <select
                  value={newCatParent}
                  onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff] bg-white"
                >
                  <option value="">-- Ana Kategori (Kök Seviye) --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#343a40] block">
                  Açıklama
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Bu kategoride yer alacak evrak ve zümrelerin kapsamı..."
                  className="w-full px-3 py-2 text-xs border border-[#ced4da] rounded focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="pt-2 border-t border-[#dee2e6] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef] border border-[#ced4da] text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs"
                >
                  Kategoriyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
