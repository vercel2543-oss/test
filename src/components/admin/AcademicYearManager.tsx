import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, CheckCircle, HardDrive, AlertCircle, Sparkles } from 'lucide-react';

export const AcademicYearManager: React.FC = () => {
  const { academicYears, settings, addAcademicYear, setCurrentAcademicYear, awards } = useAwards();
  const { isSuperAdmin } = useAuth();

  const [newYearInput, setNewYearInput] = useState<string>('2570');
  const [createDriveFolders, setCreateDriveFolders] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim() || newYearInput.length !== 4) {
      alert('กรุณาระบุปีการศึกษาเป็นตัวเลข 4 หลัก เช่น 2570');
      return;
    }

    setLoading(true);
    await addAcademicYear(newYearInput.trim(), createDriveFolders);
    setLoading(false);
    setNewYearInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Calendar size={16} />
            <span>Academic Year Management</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">จัดการปีการศึกษา</h2>
          <p className="text-xs text-slate-500">
            กำหนดปีการศึกษาปัจจุบันและสร้างโครงสร้างโฟลเดอร์ Google Drive รองรับผลงานใหม่
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {settings.currentAcademicYear}
          </div>
          <div>
            <div className="text-[10px] text-blue-800 font-semibold uppercase">ปีการศึกษาปัจจุบัน</div>
            <div className="text-xs font-bold text-slate-900">พ.ศ. {settings.currentAcademicYear}</div>
          </div>
        </div>
      </div>

      {/* Add New Academic Year Card (Super Admin) */}
      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200/80 rounded-3xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Plus size={16} className="text-blue-600" />
            <span>เปิดปีการศึกษาใหม่</span>
          </h3>

          <form onSubmit={handleAddYear} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="w-48">
              <input
                type="text"
                maxLength={4}
                value={newYearInput}
                onChange={e => setNewYearInput(e.target.value)}
                placeholder="เช่น 2570"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-bold text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={createDriveFolders}
                onChange={e => setCreateDriveFolders(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="flex items-center gap-1">
                <HardDrive size={14} className="text-blue-600" />
                <span>สร้างโฟลเดอร์ Google Drive สำหรับ 5 ฝ่ายโดยอัตโนมัติ</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus size={15} />
              <span>{loading ? 'กำลังสร้าง...' : 'บันทึกปีการศึกษา'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Academic Years List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-sm text-slate-900">
          รายการปีการศึกษาทั้งหมด ({academicYears.length} ปี)
        </div>

        <div className="divide-y divide-slate-100">
          {academicYears.map(yr => {
            const count = awards.filter(a => !a.deleted && a.academicYear === yr.year).length;
            const isCurrent = yr.year === settings.currentAcademicYear;

            return (
              <div
                key={yr.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {yr.year}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">ปีการศึกษา {yr.year}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          ปีปัจจุบัน
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>จำนวนผลงานที่บันทึก: {count} รายการ</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <HardDrive size={12} /> มีโฟลเดอร์ Google Drive
                      </span>
                    </div>
                  </div>
                </div>

                {isSuperAdmin && !isCurrent && (
                  <button
                    onClick={() => setCurrentAcademicYear(yr.year)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all"
                  >
                    ตั้งเป็นปีการศึกษาปัจจุบัน
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
