import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS } from '../../lib/constants';
import { UserRole, DepartmentType } from '../../types';
import { Users, Shield, UserCheck, CheckCircle2, XCircle, KeyRound } from 'lucide-react';
import { DepartmentPill } from '../common/DepartmentPill';

export const UserManagement: React.FC = () => {
  const { usersList, updateUserRoleAndDept, toggleUserStatus } = useAwards();
  const { isSuperAdmin } = useAuth();

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
            กำหนดบทบาทผู้ดูแลระบบส่วนกลาง (Super Admin) และผู้ดูแลประจำฝ่าย (Department Admin)
          </p>
        </div>
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
                          <div className="font-bold text-slate-900">{user.displayName}</div>
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
                            className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100"
                          >
                            {user.status === 'active' ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                          </button>
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
    </div>
  );
};
