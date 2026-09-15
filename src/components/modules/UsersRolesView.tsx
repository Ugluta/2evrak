import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  Shield,
  Key,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  Phone,
  BadgeCheck,
  Award,
  FileCheck,
  Building,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { User, Role } from "../../types";

export const UsersRolesView: React.FC = () => {
  const {
    users,
    roles,
    permissions,
    packages,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    verifyTeacherProfile,
    addRole,
    updateRole,
    deleteRole,
    currentUser,
    setCurrentUser,
    activeSubItemId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"users" | "roles" | "matrix">("users");
  const [searchUser, setSearchUser] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("all");
  const [onlyUnverifiedFilter, setOnlyUnverifiedFilter] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [verifyModalUser, setVerifyModalUser] = useState<User | null>(null);
  const [tcInput, setTcInput] = useState("");
  const [mebbisInput, setMebbisInput] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  // New User Form State
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState(roles[3]?.id || "role_branch_lead");
  const [newBranch, setNewBranch] = useState("Matematik");
  const [newSchoolType, setNewSchoolType] = useState("Anadolu Lisesi");
  const [newVerifiedTeacher, setNewVerifiedTeacher] = useState(true);
  const [newTcNo, setNewTcNo] = useState("");
  const [newMebbisNo, setNewMebbisNo] = useState("");

  // New Role Form State
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleSlug, setNewRoleSlug] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("bg-[#e8f4ff] text-[#007bff] border-[#007bff]/30");

  // Sync with left sidebar sub-items
  useEffect(() => {
    if (!activeSubItemId) return;
    if (activeSubItemId.includes("ogretmenler") || activeSubItemId.includes("Öğretmen Listesi")) {
      setActiveTab("users");
      setOnlyUnverifiedFilter(false);
    } else if (activeSubItemId.includes("meb_dogrulama") || activeSubItemId.includes("Doğrulama Bekleyenler")) {
      setActiveTab("users");
      setOnlyUnverifiedFilter(true);
    } else if (activeSubItemId.includes("rbac_matrisi") || activeSubItemId.includes("Roller") || activeSubItemId.includes("İzin Matrisi")) {
      setActiveTab("matrix");
    }
  }, [activeSubItemId]);

  const verifiedCount = users.filter((u) => u.verifiedTeacher).length;
  const pendingVerifyCount = users.filter((u) => !u.verifiedTeacher).length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.branch.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = selectedRoleId === "all" || u.roleId === selectedRoleId;
    const matchesUnverified = !onlyUnverifiedFilter || !u.verifiedTeacher;
    return matchesSearch && matchesRole && matchesUnverified;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    addUser({
      fullName: newFullName,
      email: newEmail,
      phone: newPhone.trim() || undefined,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60`,
      roleId: newRole,
      status: "active",
      branch: newBranch,
      schoolType: newSchoolType,
      verifiedTeacher: newVerifiedTeacher,
      verificationStatus: newVerifiedTeacher ? "verified" : "unverified",
      tcNo: newVerifiedTeacher && newTcNo ? `${newTcNo.slice(0, 2)}******${newTcNo.slice(8)}` : undefined,
      mebbisNo: newVerifiedTeacher && newMebbisNo ? newMebbisNo.trim().toUpperCase() : undefined,
      verifiedAt: newVerifiedTeacher ? new Date().toISOString().split("T")[0] : undefined,
      packageId: newVerifiedTeacher ? "pkg_meb_verified" : "pkg_free",
      customPermissions: [],
    });

    setIsAddUserOpen(false);
    setNewFullName("");
    setNewEmail("");
    setNewPhone("");
    setNewTcNo("");
    setNewMebbisNo("");
  };

  const handleOpenVerifyModal = (u: User) => {
    setVerifyModalUser(u);
    setTcInput(u.tcNo ? u.tcNo.replace(/\*/g, "9") : "");
    setMebbisInput(u.mebbisNo || "");
    setVerifyError("");
    setVerifySuccess(false);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyModalUser) return;

    if (tcInput.length !== 11) {
      setVerifyError("Lütfen geçerli 11 haneli T.C. Kimlik Numarası giriniz.");
      return;
    }

    if (!mebbisInput.trim()) {
      setVerifyError("Lütfen MEBBİS Kurum/Kullanıcı Kodunu giriniz.");
      return;
    }

    const maskedTc = `${tcInput.slice(0, 2)}******${tcInput.slice(8)}`;
    verifyTeacherProfile(verifyModalUser.id, maskedTc, mebbisInput.trim().toUpperCase());

    setVerifySuccess(true);
    setTimeout(() => {
      setVerifyModalUser(null);
      setVerifySuccess(false);
    }, 1500);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || !newRoleSlug.trim()) return;

    addRole({
      name: newRoleName,
      slug: newRoleSlug,
      description: newRoleDesc,
      color: newRoleColor,
      isSystemRole: false,
      permissions: ["documents:view", "documents:download"] as any,
    });

    setIsAddRoleOpen(false);
    setNewRoleName("");
    setNewRoleSlug("");
    setNewRoleDesc("");
  };

  const handleTogglePermission = (roleId: string, permKey: string) => {
    const r = roles.find((role) => role.id === roleId);
    if (!r || (r.isSystemRole && r.slug === "super_admin")) return;

    const hasP = r.permissions.includes(permKey as any);
    const updatedPerms = hasP
      ? r.permissions.filter((p) => p !== permKey)
      : [...r.permissions, permKey as any];

    updateRole(roleId, { permissions: updatedPerms });
  };

  return (
    <div className="space-y-4">
      {/* AdminLTE Callout Info Header */}
      <div className="bg-white border-l-4 border-l-[#17a2b8] border border-[#dee2e6] rounded p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[#17a2b8]" />
              <h1 className="text-base font-bold text-[#212529] tracking-tight">
                Kullanıcı / Rol / İzin Yönetimi (RBAC & MEBBİS)
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#e1f5f8] text-[#17a2b8] font-bold border border-[#17a2b8]/30">
                Rol Tabanlı Yetki
              </span>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Zümre Başkanları, Öğretmenler, Editörler ve Süper Yöneticiler için Rol Tabanlı Erişim Denetimi ve MEBBİS onaylı öğretmen profili yönetimi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === "users" ? (
              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Öğretmen Ekle</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddRoleOpen(true)}
                className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Rol Tanımla</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AdminLTE Small Boxes Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#17a2b8] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{users.length}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Toplam Kayıtlı Kullanıcı</p>
          </div>
          <Users className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Öğretmen & Yönetici Havuzu</span>
        </div>

        <div className="bg-[#28a745] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{verifiedCount}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">MEBBİS Onaylı Öğretmen</p>
          </div>
          <UserCheck className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">Filigransız & Tam Yetkili</span>
        </div>

        <div className="bg-[#ffc107] text-[#1f2d3d] rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{pendingVerifyCount}</div>
            <p className="text-xs font-bold text-[#1f2d3d]/90 mt-0.5">Doğrulama Bekleyen</p>
          </div>
          <BadgeCheck className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-[#1f2d3d]/80 mt-2 font-mono">Onay Bekleyen Başvurular</span>
        </div>

        <div className="bg-[#007bff] text-white rounded overflow-hidden shadow-xs relative flex flex-col justify-between p-4">
          <div>
            <div className="text-2xl font-black font-mono">{roles.length}</div>
            <p className="text-xs font-semibold text-white/90 mt-0.5">Aktif Rol / Yetki Grubu</p>
          </div>
          <Shield className="w-12 h-12 text-black/15 absolute right-2 top-2 pointer-events-none" />
          <span className="text-[10px] text-white/80 mt-2 font-mono">{permissions.length} Granüler İzin</span>
        </div>
      </div>

      {/* AdminLTE Nav Pills Navigation Card */}
      <div className="bg-white border border-[#dee2e6] rounded p-2.5 shadow-xs flex items-center justify-between overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab("users");
              setOnlyUnverifiedFilter(false);
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "users" && !onlyUnverifiedFilter
                ? "bg-[#007bff] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kullanıcılar ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("users");
              setOnlyUnverifiedFilter(true);
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "users" && onlyUnverifiedFilter
                ? "bg-[#ffc107] text-[#1f2d3d] shadow-xs font-bold"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5 text-[#ffc107]" />
            <span>MEB Doğrulama Bekleyenler ({pendingVerifyCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("roles")}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "roles"
                ? "bg-[#007bff] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Roller ({roles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "matrix"
                ? "bg-[#007bff] text-white shadow-xs"
                : "bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef] border border-[#ced4da]"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Yetki Matrisi (RBAC)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Users List */}
      {activeTab === "users" && (
        <div className="space-y-3.5">
          {/* Filter Bar */}
          <div className="card card-primary card-outline bg-white border border-[#dee2e6] rounded shadow-xs p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="İsim, e-posta veya branş ara..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded pl-8 pr-3 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
                <span className="text-[#6c757d]">Rol Filtresi:</span>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff] cursor-pointer"
                >
                  <option value="all">Tüm Roller</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                {onlyUnverifiedFilter && (
                  <button
                    type="button"
                    onClick={() => setOnlyUnverifiedFilter(false)}
                    className="text-xs text-[#007bff] hover:underline cursor-pointer ml-2"
                  >
                    Filtreyi Temizle
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="card card-outline card-info bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-[#495057]">
                <thead className="bg-[#f4f6f9] text-[#495057] uppercase text-[10px] border-b border-[#dee2e6]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Kullanıcı & Öğretmen</th>
                    <th className="py-2.5 px-3 font-semibold">Branş / Kurum</th>
                    <th className="py-2.5 px-3 font-semibold">Rol</th>
                    <th className="py-2.5 px-3 font-semibold">Durum</th>
                    <th className="py-2.5 px-3 font-semibold">Kayıt Tarihi</th>
                    <th className="py-2.5 px-3 font-semibold">Son Giriş</th>
                    <th className="py-2.5 px-3 font-semibold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6]">
                  {filteredUsers.map((u) => {
                    const r = roles.find((role) => role.id === u.roleId);
                    const isSelf = u.id === currentUser.id;

                    return (
                      <tr key={u.id} className="hover:bg-[#f8f9fa]">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-[#dee2e6]"
                            />
                            <div>
                              <div className="font-bold text-[#212529] flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                                {u.verifiedTeacher ? (
                                  <span
                                    className="inline-flex items-center gap-0.5 text-[10px] text-[#28a745] font-semibold bg-[#eaf7ed] px-1.5 py-0.2 rounded border border-[#28a745]/30"
                                    title="MEBBİS Doğrulanmış Öğretmen"
                                  >
                                    <UserCheck className="w-3 h-3" />
                                    <span>MEBBİS Onaylı</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-[#ffc107] font-semibold bg-[#fff8e1] px-1.5 py-0.2 rounded border border-[#ffc107]/40">
                                    Doğrulama Bekliyor
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#6c757d] flex items-center gap-2 mt-0.5">
                                <span>{u.email}</span>
                                {u.phone && (
                                  <span className="font-mono text-[10px] text-[#adb5bd]">
                                    {u.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="text-[#212529] font-medium">{u.branch}</div>
                          <div className="text-[10px] text-[#6c757d]">{u.schoolType}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          {r && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e8f4ff] text-[#007bff] border border-[#007bff]/20">
                              {r.name}
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === "active"
                                ? "bg-[#eaf7ed] text-[#28a745]"
                                : "bg-[#f8d7da] text-[#dc3545]"
                            }`}
                          >
                            {u.status === "active" ? "Aktif" : "Askıda"}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#6c757d]">
                          {u.createdAt}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#6c757d]">
                          {u.lastLoginAt}
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.verificationStatus !== "verified" ? (
                              <button
                                type="button"
                                onClick={() => handleOpenVerifyModal(u)}
                                className="px-2 py-1 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                title="MEBBİS / T.C. ile Doğrula"
                              >
                                <BadgeCheck className="w-3.5 h-3.5" />
                                <span>Doğrula</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenVerifyModal(u)}
                                className="px-2 py-1 rounded bg-[#eaf7ed] hover:bg-[#d4edda] text-[#28a745] border border-[#28a745]/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Doğrulama Bilgilerini Gör / Güncelle"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{u.mebbisNo || "MEB"}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleUserStatus(u.id)}
                              className={`p-1.5 rounded cursor-pointer transition-colors ${
                                u.status === "active"
                                  ? "hover:bg-[#fff3cd] text-[#ffc107]"
                                  : "hover:bg-[#d4edda] text-[#28a745]"
                              }`}
                              title={u.status === "active" ? "Askıya Al" : "Aktif Et"}
                            >
                              {u.status === "active" ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => deleteUser(u.id)}
                                className="p-1.5 rounded hover:bg-[#f8d7da] text-[#dc3545] cursor-pointer transition-colors"
                                title="Kullanıcıyı Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
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

      {/* Tab 2: Roles Grid */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {roles.map((r) => {
            const userCount = users.filter((u) => u.roleId === r.id).length;
            return (
              <div
                key={r.id}
                className="card card-outline card-primary bg-white border border-[#dee2e6] rounded shadow-xs p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#e8f4ff] text-[#007bff] border border-[#007bff]/30">
                      {r.name}
                    </span>
                    {r.isSystemRole && (
                      <span className="text-[10px] text-[#6c757d] font-mono font-semibold">
                        Sistem Rolü
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6c757d] mt-2 leading-relaxed">{r.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#dee2e6]">
                  <div className="flex items-center justify-between text-xs text-[#495057]">
                    <span>Atanmış Kullanıcılar:</span>
                    <strong className="text-[#212529] font-mono">{userCount} Öğretmen</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#495057]">
                    <span>Yetki Sayısı:</span>
                    <strong className="text-[#007bff] font-mono">
                      {r.slug === "super_admin" ? "Tüm Yetkiler (*)" : `${r.permissions.length} İzin`}
                    </strong>
                  </div>
                </div>

                {!r.isSystemRole && (
                  <div className="pt-2 border-t border-[#dee2e6] flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteRole(r.id)}
                      className="text-xs text-[#dc3545] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Rolü Sil
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Granular Permission Matrix */}
      {activeTab === "matrix" && (
        <div className="card card-outline card-primary bg-white border border-[#dee2e6] rounded shadow-xs overflow-hidden p-4">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[#212529]">Granüler İzin Matrisi (RBAC)</h3>
            <p className="text-xs text-[#6c757d] mt-0.5">
              Her rolün sistemdeki yetkilerini anlık olarak açıp kapatabilirsiniz.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#495057]">
              <thead className="bg-[#f4f6f9] text-[10px] font-bold uppercase tracking-wider text-[#495057] border-b border-[#dee2e6]">
                <tr>
                  <th className="p-2.5">İzin Tanımı & Anahtarı</th>
                  <th className="p-2.5">Modül</th>
                  {roles.map((r) => (
                    <th key={r.id} className="p-2.5 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#ced4da] font-bold text-[#212529]">
                        {r.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6]">
                {permissions.map((perm) => {
                  return (
                    <tr key={perm.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-2.5">
                        <div className="font-bold text-[#212529]">{perm.name}</div>
                        <div className="text-[10px] font-mono text-[#6c757d]">{perm.key}</div>
                      </td>
                      <td className="p-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#f4f6f9] text-[#6c757d] uppercase font-mono font-semibold">
                          {perm.module}
                        </span>
                      </td>

                      {roles.map((role) => {
                        const isGranted =
                          role.slug === "super_admin" ||
                          role.permissions.includes(perm.key as any);
                        const isSuper = role.slug === "super_admin";

                        return (
                          <td key={role.id} className="p-2.5 text-center">
                            <button
                              type="button"
                              disabled={isSuper}
                              onClick={() => handleTogglePermission(role.id, perm.key)}
                              className={`w-6 h-6 rounded inline-flex items-center justify-center transition-colors ${
                                isGranted
                                  ? "bg-[#28a745] text-white"
                                  : "bg-[#f8f9fa] text-[#adb5bd] border border-[#ced4da] hover:text-[#495057]"
                              } ${isSuper ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                            >
                              {isGranted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded border border-[#dee2e6] max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni Öğretmen / Kullanıcı Ekle</h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="text-[#6c757d] hover:text-[#212529] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Merve Kaya"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">E-posta</label>
                  <input
                    type="email"
                    required
                    placeholder="merve.kaya@meb.k12.tr"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  />
                </div>
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Telefon</label>
                  <input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] font-mono focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Branş</label>
                  <input
                    type="text"
                    required
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  />
                </div>
                <div>
                  <label className="block text-[#495057] font-semibold mb-1">Okul Türü</label>
                  <input
                    type="text"
                    required
                    value={newSchoolType}
                    onChange={(e) => setNewSchoolType(e.target.value)}
                    className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f9fa] rounded border border-[#dee2e6] flex items-center justify-between">
                <div>
                  <div className="text-[#212529] font-bold text-xs">MEBBİS / E-Devlet Doğrulaması</div>
                  <div className="text-[10px] text-[#6c757d]">Aktif MEB öğretmeni olarak işaretle</div>
                </div>
                <input
                  type="checkbox"
                  checked={newVerifiedTeacher}
                  onChange={(e) => setNewVerifiedTeacher(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              {newVerifiedTeacher && (
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#eaf7ed] border border-[#28a745]/30 rounded">
                  <div>
                    <label className="block text-[#1e7e34] font-semibold mb-1">T.C. Kimlik No</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="11 haneli T.C."
                      value={newTcNo}
                      onChange={(e) => setNewTcNo(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1e7e34] font-semibold mb-1">MEBBİS Kodu</label>
                    <input
                      type="text"
                      placeholder="Örn: MEB-89412"
                      value={newMebbisNo}
                      onChange={(e) => setNewMebbisNo(e.target.value)}
                      className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#495057] font-semibold mb-1">Kullanıcı Rolü</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold cursor-pointer"
                >
                  Kullanıcıyı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {isAddRoleOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded border border-[#dee2e6] max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <h3 className="text-sm font-bold text-[#212529]">Yeni Rol Tanımla</h3>
              <button
                type="button"
                onClick={() => setIsAddRoleOpen(false)}
                className="text-[#6c757d] hover:text-[#212529] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Rol Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Bölge Koordinatörü"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">Rol Anahtarı (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="bolge_koordinatoru"
                  value={newRoleSlug}
                  onChange={(e) => setNewRoleSlug(e.target.value)}
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs font-mono text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-[#495057] font-semibold mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Bu role sahip kullanıcıların yapabileceği işlemler..."
                  className="w-full bg-white border border-[#ced4da] rounded p-1.5 text-xs text-[#495057] focus:outline-none focus:border-[#007bff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold cursor-pointer"
                >
                  Rolü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Verification Modal (MEBBİS & T.C.) */}
      {verifyModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded border border-[#dee2e6] max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee2e6]">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-[#28a745]" />
                <div>
                  <h3 className="text-sm font-bold text-[#212529]">Öğretmen MEBBİS Doğrulama</h3>
                  <p className="text-[11px] text-[#6c757d]">MEB Personel & E-Devlet Kontrolü</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerifyModalUser(null)}
                className="text-[#6c757d] hover:text-[#212529] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* User card info */}
            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded border border-[#dee2e6]">
              <img
                src={verifyModalUser.avatarUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-[#dee2e6]"
              />
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-[#212529] flex items-center gap-2">
                  <span>{verifyModalUser.fullName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#ced4da] font-mono">
                    {verifyModalUser.branch}
                  </span>
                </div>
                <div className="text-[11px] text-[#6c757d] truncate">
                  {verifyModalUser.schoolType} • {verifyModalUser.email}
                </div>
              </div>
            </div>

            {verifySuccess ? (
              <div className="p-4 bg-[#eaf7ed] border border-[#28a745]/30 rounded text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-[#28a745] mx-auto" />
                <div className="text-sm font-bold text-[#1e7e34]">Öğretmen Başarıyla Doğrulandı!</div>
                <p className="text-xs text-[#495057]">
                  MEB Doğrulanmış Öğretmen statüsü verildi. Filigransız çıktı ve toplu indirme hakları aktif.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifySubmit} className="space-y-3 text-xs">
                <div className="p-2.5 bg-[#eaf7ed] border border-[#28a745]/30 rounded space-y-1">
                  <div className="text-xs font-bold text-[#1e7e34] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#28a745]" />
                    <span>Doğrulanmış Öğretmen Ayrıcalıkları:</span>
                  </div>
                  <ul className="text-[11px] text-[#495057] space-y-0.5 list-disc list-inside">
                    <li>Filigransız ve <strong>başlıksız resmi çıktı</strong> alabilme</li>
                    <li>Tüm evrakları <strong>toplu ZIP</strong> olarak indirme</li>
                    <li>Sistem öncelikli evrak üretim sırası</li>
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[#495057] font-semibold mb-1">
                      T.C. Kimlik Numarası (11 Hane)
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      required
                      placeholder="11 haneli T.C. Kimlik No giriniz"
                      value={tcInput}
                      onChange={(e) => setTcInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs font-mono tracking-wider focus:outline-none focus:border-[#28a745]"
                    />
                    <span className="text-[10px] text-[#6c757d] mt-0.5 block">
                      * KVKK gereğince T.C. maskelenerek saklanır.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[#495057] font-semibold mb-1">
                      MEBBİS Kullanıcı Kodu / Kurum Sicil No
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: MEB-49210"
                      value={mebbisInput}
                      onChange={(e) => setMebbisInput(e.target.value)}
                      className="w-full bg-white border border-[#ced4da] rounded p-2 text-xs font-mono focus:outline-none focus:border-[#28a745]"
                    />
                  </div>
                </div>

                {verifyError && (
                  <div className="p-2 bg-[#f8d7da] border border-[#dc3545]/30 rounded text-[#721c24] text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dee2e6]">
                  <button
                    type="button"
                    onClick={() => setVerifyModalUser(null)}
                    className="px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#ced4da] text-[#495057] text-xs font-semibold cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-4 py-1.5 rounded bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>MEBBİS Doğrulamasını Kaydet</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
