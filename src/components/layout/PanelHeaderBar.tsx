import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  getModuleById,
  getGroupByModuleId,
} from "../../data/navigationData";
import {
  ChevronRight,
  Home,
  Search,
  Filter,
  X,
  Smartphone,
  SlidersHorizontal,
  RotateCcw,
  Check,
  LayoutGrid,
} from "lucide-react";

export const PanelHeaderBar: React.FC = () => {
  const {
    activeModuleId,
    activeSubItemId,
    navigateToModule,
    globalSearchQuery,
    setGlobalSearchQuery,
    mobileGridCols,
    setMobileGridCols,
    navbarFilterCategory,
    setNavbarFilterCategory,
    navbarFilterGrade,
    setNavbarFilterGrade,
    navbarFilterStatus,
    setNavbarFilterStatus,
    categories,
    navigationGroups,
  } = useApp();

  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  const currentModule = getModuleById(activeModuleId, navigationGroups);
  const currentGroup = getGroupByModuleId(activeModuleId, navigationGroups);

  const subItems = currentModule?.subItems || [];
  const hasSubItems = subItems.length > 0;

  // Derive active sub-item title
  const activeTitle = activeSubItemId || currentModule?.title || "Yönetim Paneli";

  const hasActiveFilters =
    globalSearchQuery.trim() !== "" ||
    navbarFilterCategory !== "all" ||
    navbarFilterGrade !== "all" ||
    navbarFilterStatus !== "all";

  const resetAllFilters = () => {
    setGlobalSearchQuery("");
    setNavbarFilterCategory("all");
    setNavbarFilterGrade("all");
    setNavbarFilterStatus("all");
  };

  return (
    <div className="bg-[#f4f6f9] border-b border-[#dee2e6] px-3 sm:px-4 md:px-6 pt-3 pb-3 space-y-2.5 select-none">
      {/* Row 1: AdminLTE Content Header (H1 Title + Breadcrumb) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left: Content Title */}
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#212529] tracking-tight">
            {activeTitle}
          </h1>
          {currentModule && (
            <span className="text-xs text-[#6c757d] hidden md:inline">
              (Modül {currentModule.num} • {currentGroup?.name})
            </span>
          )}
        </div>

        {/* Right: Breadcrumb (AdminLTE breadcrumb float-sm-right) */}
        <nav aria-label="breadcrumb" className="text-xs">
          <ol className="flex items-center gap-1.5 text-[#6c757d] flex-wrap">
            <li className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigateToModule("09_dashboard")}
                className="hover:text-[#007bff] flex items-center gap-1 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Ana Sayfa</span>
              </button>
            </li>

            {currentGroup && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                <li className="truncate max-w-[120px]">{currentGroup.name}</li>
              </>
            )}

            {currentModule && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToModule(currentModule.id)}
                    className={`hover:text-[#007bff] cursor-pointer ${
                      !activeSubItemId ? "font-bold text-[#212529]" : ""
                    }`}
                  >
                    {currentModule.title}
                  </button>
                </li>
              </>
            )}

            {activeSubItemId && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                <li className="font-bold text-[#212529] truncate max-w-[180px]">
                  {activeSubItemId}
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* Row 2: Sub-items Nav-Pills (AdminLTE nav nav-pills) */}
      {hasSubItems && (
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#6c757d] uppercase tracking-wider shrink-0 mr-1">
            Alt Bölümler:
          </span>
          {subItems.map((sub, idx) => {
            const isSubActive =
              activeSubItemId === sub.title || (!activeSubItemId && idx === 0);

            return (
              <button
                key={sub.id || idx}
                type="button"
                onClick={() => navigateToModule(sub.actionId, sub.title)}
                className={`px-2.5 py-1 rounded-[0.25rem] text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
                  isSubActive
                    ? "bg-[#007bff] text-white font-bold shadow-xs"
                    : "bg-white text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSubActive ? "bg-white" : "bg-[#6c757d]"
                  }`}
                />
                <span>{sub.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Row 3: Header Altı Navbar (Arama ve Filtreleme Seçenekleri + Mobil Düzen) */}
      <div className="bg-white border border-[#dee2e6] rounded p-2 sm:p-2.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs">
        {/* Sol / Orta: Arama ve Filtre Seçenekleri */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Canlı Arama Input */}
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Evrak, zümre, sınav, ders veya içerik ara..."
              className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded pl-8 pr-7 py-1.5 text-xs text-[#212529] placeholder-gray-400 focus:outline-none focus:border-[#007bff] focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
            {globalSearchQuery && (
              <button
                type="button"
                onClick={() => setGlobalSearchQuery("")}
                className="absolute right-2 top-2 text-gray-400 hover:text-[#dc3545] cursor-pointer"
                title="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Kademe Filtresi */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#6c757d] font-semibold hidden lg:inline">
              Kademe:
            </span>
            <select
              value={navbarFilterGrade}
              onChange={(e) => setNavbarFilterGrade(e.target.value)}
              className="bg-[#f8f9fa] border border-[#ced4da] rounded px-2 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Kademeler</option>
              <option value="ilkokul">İlkokul (1-4)</option>
              <option value="ortaokul">Ortaokul (5-8)</option>
              <option value="lise">Lise (9-12)</option>
              <option value="okuloncesi">Okul Öncesi</option>
              <option value="bep">Özel Eğitim / BEP</option>
            </select>
          </div>

          {/* Kategori Filtresi */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#6c757d] font-semibold hidden lg:inline">
              Kategori:
            </span>
            <select
              value={navbarFilterCategory}
              onChange={(e) => setNavbarFilterCategory(e.target.value)}
              className="bg-[#f8f9fa] border border-[#ced4da] rounded px-2 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories && categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="cat_yazili">Yazılı & Ortak Sınavlar</option>
                  <option value="cat_zumre">Zümre Tutanakları</option>
                  <option value="cat_plan">Yıllık Planlar</option>
                  <option value="cat_bep">BEP Evrakları</option>
                  <option value="cat_dilekce">Dilekçematik Şablonları</option>
                </>
              )}
            </select>
          </div>

          {/* Durum Filtresi */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#6c757d] font-semibold hidden lg:inline">
              Durum:
            </span>
            <select
              value={navbarFilterStatus}
              onChange={(e) => setNavbarFilterStatus(e.target.value)}
              className="bg-[#f8f9fa] border border-[#ced4da] rounded px-2 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Yayında / Onaylı</option>
              <option value="pending">İncelemede</option>
              <option value="draft">Taslak</option>
            </select>
          </div>

          {/* Temizle Butonu */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-2 py-1 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#dc3545] border border-[#ced4da] text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Filtreleri Sıfırla"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        {/* Sağ: Mobil & Panel Izgara Düzeni Ayarı (Kullanıcının İstediği: İkili veya 3, 6, 9'lu) */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-dashed border-[#dee2e6]">
          <span className="text-[11px] text-[#6c757d] font-bold flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-[#007bff]" />
            <span>Mobil/Kart Dizilim:</span>
          </span>

          <div className="inline-flex rounded border border-[#ced4da] bg-[#f8f9fa] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMobileGridCols(2)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                mobileGridCols === 2
                  ? "bg-[#007bff] text-white shadow-xs"
                  : "text-[#495057] hover:text-[#212529]"
              }`}
              title="İkili İkili (2x2) Düzen"
            >
              <span>2'li</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileGridCols(3)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                mobileGridCols === 3
                  ? "bg-[#007bff] text-white shadow-xs"
                  : "text-[#495057] hover:text-[#212529]"
              }`}
              title="3, 6, 9'lu Kompakt İkon Dizilimi"
            >
              <span>3'lü (3,6,9)</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileGridCols(4)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                mobileGridCols === 4
                  ? "bg-[#007bff] text-white shadow-xs"
                  : "text-[#495057] hover:text-[#212529]"
              }`}
              title="4'lü Mini Izgara"
            >
              <span>4'lü</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileGridCols(1)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                mobileGridCols === 1
                  ? "bg-[#007bff] text-white shadow-xs"
                  : "text-[#495057] hover:text-[#212529]"
              }`}
              title="Tekli Alt Alta Liste"
            >
              <span>1'li</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigateToModule("12_menus", "Menü & Kategori Yönetimi")}
            className="px-2.5 py-1 rounded bg-white hover:bg-[#e9ecef] text-[#007bff] hover:text-[#0056b3] border border-[#ced4da] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Tüm panel menü ve kategori isimlerini düzenle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#007bff]" />
            <span className="hidden sm:inline">Menü & Kategori Düzenle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

