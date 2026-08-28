import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAwards } from '../../context/AwardContext';
import { DEPARTMENTS } from '../../lib/constants';
import { DepartmentType } from '../../types';
import { X, Lock, Shield, KeyRound, ArrowRight, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsDemoUser, currentUser } = useAuth();
  const { setActiveView } = useAwards();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (role: 'super_admin' | 'department_admin', dept: DepartmentType | 'all', name: string) => {
    loginAsDemoUser(role, dept, name);
    setActiveView('admin');
    onClose();
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo quick fallback
    if (email.includes('acad')) {
      handleSelectRole('department_admin', 'academic', 'ครูฝ่ายวิชาการ');
    } else {
      handleSelectRole('super_admin', 'all', 'ผู้ดูแลระบบส่วนกลาง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Lock size={22} />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">เข้าสู่ระบบจัดการผลงาน</h3>
          <p className="text-xs text-slate-500">สำหรับผู้ดูแลระบบส่วนกลางและผู้ดูแลประจำฝ่ายทั้ง 5 ฝ่าย</p>
        </div>

        {/* 1-Click Role-Based Quick Demo Sign In */}
        <div className="space-y-2 mb-6">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            ⚡ เข้าใช้งานด่วนตามสิทธิ์ (Role Fast Login)
          </p>

          <div className="space-y-2">
            {/* Super Admin */}
            <button
              onClick={() => handleSelectRole('super_admin', 'all', 'ผู้ดูแลระบบส่วนกลาง (Super Admin)')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-200 text-amber-900 transition-all text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  👑
                </span>
                <div className="text-left">
                  <div>ผู้ดูแลระบบส่วนกลาง (Super Admin)</div>
                  <div className="text-[10px] text-amber-700 font-normal">จัดการได้ทุกฝ่าย, สิทธิ์สูงสุด</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-amber-600" />
            </button>

            {/* Academic Dept Admin */}
            <button
              onClick={() => handleSelectRole('department_admin', 'academic', 'ครูสมศรี (ฝ่ายวิชาการ)')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition-all text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  📘
                </span>
                <div className="text-left">
                  <div>ผู้ดูแลฝ่ายบริหารงานวิชาการ</div>
                  <div className="text-[10px] text-blue-600 font-normal">จัดการเฉพาะผลงานฝ่ายวิชาการ</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-blue-600" />
            </button>

            {/* Student Affairs Admin */}
            <button
              onClick={() => handleSelectRole('department_admin', 'affairs', 'ครูสมปอง (ฝ่ายกิจการนักเรียน)')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 transition-all text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  🏃
                </span>
                <div className="text-left">
                  <div>ผู้ดูแลฝ่ายกิจการนักเรียน</div>
                  <div className="text-[10px] text-emerald-700 font-normal">กิจกรรม กีฬา ดนตรี วินัย</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-semibold">หรือใช้อีเมลโรงเรียน</span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleStandardLogin} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">อีเมลผู้ใช้งาน (@school.ac.th)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@school.ac.th"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors mt-2"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
};
