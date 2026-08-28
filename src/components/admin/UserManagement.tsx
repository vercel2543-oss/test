import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS } from '../../lib/constants';
import { UserRole, DepartmentType, UserProfile } from '../../types';
import {
  Users,
  Shield,
  UserCheck,
  CheckCircle2,
  XCircle,
  KeyRound,
  Plus,
  Trash2,
  Edit2,
  UserPlus,
  X,
  Lock,
  Mail,
  User
} from 'lucide-react';
import { DepartmentPill } from '../common/DepartmentPill';

export const UserManagement: React.FC = () => {
  const { usersList, addUser, updateUser, deleteUser, updateUserRoleAndDept, toggleUserStatus } = useAwards();
  const { isSuperAdmin, currentUser } = useAuth();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<UserRole>('department_admin');
  const [department, setDepartment] = useState<DepartmentType | 'all'>('academic');
  const [password, setPassword] = useState<string>('password123');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const openAddModal = () => {
    setEditingUser(null);
    setDisplayName('');
    setEmail('');
    setRole('department_admin');
    setDepartment('academic');
    setPassword('password123');
    setErrorMsg('');
    setShowAddModal(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setDisplayName(user.displayName);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department);
    setPassword('');
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!displayName.trim() || !email.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุล และอีเมลให้ครบถ้วน');
      return;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          displayName,
          email,
          role,
          department: role === 'super_admin' ? 'all' : department,
        });
      } else {
        await addUser({
          displayName,
          email,
          role,
          department: role === 'super_admin' ? 'all' : department,
          status: 'active',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`
        });
      }
      setShowAddModal(false);
      setEditingUser(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (user.id === currentUser?.id) {
      alert('ไม่สามารถลบบัญชีของตัวเองได้');
      return;
    }
    if (confirm(`คุณต้องการลบผู้ใช้งาน "${user.displayName}" หรือไม่?`)) {
      await deleteUser(user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Users size={16} />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">จัดการผู้ใช้งานและสิทธิ์ 5 ฝ่าย</h2>
          <p className="text-xs text-slate-500">
            กำหนดบทบาทผู้ดูแลระบบส่วนกลาง (Super Admin) และผู้ดูแลประจำฝ่าย (Department Admin) เพื่อความปลอดภัยของข้อมูลโรงเรียน
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <UserPlus size={16} />
            <span>เพิ่มผู้ใช้งานใหม่</span>
          </button>
        )}
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-4 px-6">ชื่อ-นามสกุล / อีเมล</th>
                <th className="py-4 px-6">บทบาท (Role)</th>
                <th className="py-4 px-6">ฝ่ายที่รับผิดชอบ</th>
                <th className="py-4 px-6">สถานะ</th>
                <th className="py-4 px-6 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map(user => {
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                          {user.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.displayName}</span>
                            {user.id === currentUser?.id && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">คุณ</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {user.role === 'super_admin' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          👑 Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          🛡️ Department Admin
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <DepartmentPill department={user.department} size="sm" />
                    </td>

                    <td className="py-4 px-6">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} className="text-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                          <XCircle size={12} className="text-rose-500" /> Disabled
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isSuperAdmin && (
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={user.department}
                            onChange={e =>
                              updateUserRoleAndDept(
                                user.id,
                                e.target.value === 'all' ? 'super_admin' : 'department_admin',
                                e.target.value as DepartmentType | 'all'
                              )
                            }
                            className="text-[11px] bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 outline-none"
                          >
                            <option value="all">Super Admin (ทุกฝ่าย)</option>
                            {DEPARTMENTS.map(d => (
                              <option key={d.id} value={d.id}>
                                {d.nameTh}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className="text-[11px] text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                          >
                            {user.status === 'active' ? 'ระงับ' : 'เปิด'}
                          </button>

                          <button
                            onClick={() => openEditModal(user)}
                            title="แก้ไขข้อมูลผู้ใช้"
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>

                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              title="ลบผู้ใช้"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingUser ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานระบบใหม่'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <XCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" />
                  <span>ชื่อ - นามสกุล</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ครูสมชาย ใจดี"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" />
                  <span>อีเมลประจำตัว (Google Account / Email)</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@school.ac.th"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                    <Shield size={13} className="text-slate-400" />
                    <span>บทบาท (Role)</span>
                  </label>
                  <select
                    value={role}
                    onChange={e => {
                      const newRole = e.target.value as UserRole;
                      setRole(newRole);
                      if (newRole === 'super_admin') {
                        setDepartment('all');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="department_admin">Department Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ฝ่ายที่รับผิดชอบ
                  </label>
                  <select
                    disabled={role === 'super_admin'}
                    value={department}
                    onChange={e => setDepartment(e.target.value as DepartmentType | 'all')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 disabled:opacity-50"
                  >
                    {role === 'super_admin' ? (
                      <option value="all">ทุกฝ่าย (ส่วนกลาง)</option>
                    ) : (
                      DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.nameTh}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  {editingUser ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
