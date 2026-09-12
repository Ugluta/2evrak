import React, { useState } from "react";
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
} from "lucide-react";
import { User, Role } from "../../types";

export const UsersRolesView: React.FC = () => {
  const {
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
    currentUser,
    setCurrentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"users" | "roles" | "matrix">("users");
  const [searchUser, setSearchUser] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  // New User Form State
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(roles[3]?.id || "role_zumre_head");
  const [newBranch, setNewBranch] = useState("Matematik");
  const [newSchoolType, setNewSchoolType] = useState("Anadolu Lisesi");

  // New Role Form State
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleSlug, setNewRoleSlug] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("bg-indigo-500/10 text-indigo-400 border-indigo-500/30");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.branch.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = selectedRoleId === "all" || u.roleId === selectedRoleId;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    addUser({
      fullName: newFullName,
      email: newEmail,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60`,
      roleId: newRole,
      status: "active",
      branch: newBranch,
      schoolType: newSchoolType,
      verifiedTeacher: true,
      customPermissions: [],
    });

    setIsAddUserOpen(false);
    setNewFullName("");
    setNewEmail("");
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
    if (!r || r.isSystemRole && r.slug === "super_admin") return;

    const hasP = r.permissions.includes(permKey as any);
    const updatedPerms = hasP
      ? r.permissions.filter((p) => p !== permKey)
      : [...r.permissions, permKey as any];

    updateRole(roleId, { permissions: updatedPerms });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              02 — Kullanıcı / Rol / İzin (RBAC)
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MEB Öğretmen Yetki Matrisi
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zümre Başkanları, Öğretmenler, Editörler ve Süper Yöneticiler için Rol Tabanlı Erişim Denetimi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "users" ? (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Öğretmen Ekle
            </button>
          ) : (
            <button
              onClick={() => setIsAddRoleOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Rol Tanımla
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "users"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          Kullanıcılar ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "roles"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Shield className="w-4 h-4" />
          Roller ({roles.length})
        </button>
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "matrix"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Key className="w-4 h-4" />
          Granüler İzin Matrisi ({permissions.length} İzin)
        </button>
      </div>

      {/* Tab 1: Users List */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İsim, e-posta veya branş ara..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Rol Filtresi:</span>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Tüm Roller</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Kullanıcı & Öğretmen</th>
                    <th className="p-3.5">Branş / Kurum</th>
                    <th className="p-3.5">Rolü</th>
                    <th className="p-3.5">Durum</th>
                    <th className="p-3.5">Kayıt Tarihi</th>
                    <th className="p-3.5">Son Giriş</th>
                    <th className="p-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => {
                    const r = roles.find((role) => role.id === u.roleId);
                    const isSelf = u.id === currentUser.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                                {u.verifiedTeacher && (
                                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" title="MEBBİS Doğrulanmış Öğretmen" />
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-slate-200 font-medium">{u.branch}</div>
                          <div className="text-[10px] text-slate-400">{u.schoolType}</div>
                        </td>

                        <td className="p-3.5">
                          {r && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${r.color}`}>
                              {r.name}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              u.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {u.status === "active" ? "Aktif" : "Askıda"}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{u.createdAt}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{u.lastLoginAt}</td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.status === "active"
                                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                              }`}
                              title={u.status === "active" ? "Askıya Al" : "Aktif Et"}
                            >
                              {u.status === "active" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            {!isSelf && (
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => {
            const userCount = users.filter((u) => u.roleId === r.id).length;
            return (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${r.color}`}>
                      {r.name}
                    </span>
                    {r.isSystemRole && (
                      <span className="text-[10px] text-slate-500 font-mono">Sistem Rolü</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{r.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Atanmış Kullanıcılar:</span>
                    <strong className="text-white font-mono">{userCount} Öğretmen</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Yetki Sayısı:</span>
                    <strong className="text-indigo-400 font-mono">
                      {r.slug === "super_admin" ? "Tüm Yetkiler (*)" : `${r.permissions.length} İzin`}
                    </strong>
                  </div>
                </div>

                {!r.isSystemRole && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => deleteRole(r.id)}
                      className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">Granüler İzin Matrisi (RBAC)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Her rolün sistemdeki yetkilerini açıp kapatabilirsiniz. Değişiklikler anında yürürlüğe girer ve loglanır.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">İzin Tanımı & Anahtarı</th>
                  <th className="p-3">Modül</th>
                  {roles.map((r) => (
                    <th key={r.id} className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${r.color}`}>
                        {r.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {permissions.map((perm) => {
                  return (
                    <tr key={perm.id} className="hover:bg-slate-800/30">
                      <td className="p-3">
                        <div className="font-semibold text-white">{perm.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{perm.key}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                          {perm.module}
                        </span>
                      </td>

                      {roles.map((role) => {
                        const isGranted =
                          role.slug === "super_admin" ||
                          role.permissions.includes(perm.key as any);
                        const isSuper = role.slug === "super_admin";

                        return (
                          <td key={role.id} className="p-3 text-center">
                            <button
                              disabled={isSuper}
                              onClick={() => handleTogglePermission(role.id, perm.key)}
                              className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                                isGranted
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-800/40 text-slate-600 hover:text-slate-400 border border-slate-800"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Öğretmen / Kullanıcı Ekle</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Merve Kaya"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">E-posta (MEB veya Kişisel)</label>
                <input
                  type="email"
                  required
                  placeholder="merve.kaya@meb.k12.tr"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Branş</label>
                  <input
                    type="text"
                    required
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Okul Türü</label>
                  <input
                    type="text"
                    required
                    value={newSchoolType}
                    onChange={(e) => setNewSchoolType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Kullanıcı Rolü</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Rol Tanımla</h3>
              <button onClick={() => setIsAddRoleOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Rol Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Bölge Koordinatörü"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Rol Anahtarı (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="bolge_koordinatoru"
                  value={newRoleSlug}
                  onChange={(e) => setNewRoleSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Bu role sahip kullanıcıların yapabileceği işlemler..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Rolü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
