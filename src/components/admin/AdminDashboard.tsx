import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, AWARD_LEVELS } from '../../lib/constants';
import { Award } from '../../types';
import { DepartmentPill } from '../common/DepartmentPill';
import { AwardBadge } from '../common/AwardBadge';
import {
  Trophy,
  CheckCircle2,
  Clock,
  HardDrive,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onAddNewAward: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenDetail: (award: Award) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onAddNewAward,
  onNavigateTab,
  onOpenDetail
}) => {
  const { awards, driveFolders, approveAward, settings } = useAwards();
  const { currentUser, isSuperAdmin, currentDepartment } = useAuth();

  const nonDeleted = awards.filter(a => !a.deleted);
  const pendingAwards = nonDeleted.filter(a => a.status === 'pending');
  const publishedAwards = nonDeleted.filter(a => a.status === 'published');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <span>👋 ยินดีต้อนรับ, {currentUser?.displayName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            แผงควบคุมระบบคลังผลงานและรางวัลโรงเรียน
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light">
            ปีการศึกษาปัจจุบัน: <strong className="text-amber-300">{settings.currentAcademicYear}</strong> • เข้าใช้งานในฐานะ{' '}
            <span className="font-semibold text-white">
              {currentUser?.role === 'super_admin' ? '👑 Super Admin' : `🛡️ ฝ่าย${currentUser?.department}`}
            </span>
          </p>
        </div>

        <button
          onClick={onAddNewAward}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-2xl text-xs font-bold shadow-lg transition-all shrink-0"
        >
          <Plus size={16} />
          <span>เพิ่มผลงานใหม่ (AI OCR)</span>
        </button>
      </div>

      {/* KPI Stats 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">ผลงานทั้งหมด</div>
            <div className="text-2xl font-bold text-slate-900">{nonDeleted.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">เผยแพร่แล้ว {publishedAwards.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">รอการอนุมัติ</div>
            <div className="text-2xl font-bold text-amber-600">{pendingAwards.length}</div>
            <div className="text-[10px] text-slate-400">จาก 5 ฝ่ายงาน</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <HardDrive size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">โฟลเดอร์ Google Drive</div>
            <div className="text-2xl font-bold text-slate-900">{driveFolders.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">100% Synced</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">ระดับชาติ/นานาชาติ</div>
            <div className="text-2xl font-bold text-purple-600">
              {nonDeleted.filter(a => a.level === 'international' || a.level === 'national').length}
            </div>
            <div className="text-[10px] text-purple-700 font-semibold">เกียรติยศสูงสุด</div>
          </div>
        </div>
      </div>

      {/* Pending Approval Section */}
      {pendingAwards.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">รายการที่รอการตรวจสอบและอนุมัติ</h3>
                <p className="text-xs text-slate-500">มี {pendingAwards.length} รายการที่ส่งเข้ามาใหม่</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('awards')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>ดูทั้งหมดในตาราง</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingAwards.slice(0, 4).map(award => (
              <div
                key={award.id}
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AwardBadge level={award.level} size="xs" />
                    <DepartmentPill department={award.department} size="sm" />
                    <span className="text-[11px] text-slate-500">ปีการศึกษา {award.academicYear}</span>
                  </div>
                  <h4
                    onClick={() => onOpenDetail(award)}
                    className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                  >
                    {award.awardName}
                  </h4>
                  <p className="text-xs text-slate-600">👤 {award.recipientName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetail(award)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold"
                  >
                    ตรวจสอบ
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => approveAward(award.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} />
                      <span>อนุมัติทันที</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 Departments Overview Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900">ผลงานแยกตามฝ่ายงานทั้ง 5 ฝ่าย</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEPARTMENTS.map(dept => {
            const count = nonDeleted.filter(a => a.department === dept.id).length;
            return (
              <div
                key={dept.id}
                onClick={() => onNavigateTab('awards')}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">{dept.code}</span>
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {dept.nameTh}
                </div>
                <div className="text-2xl font-extrabold text-slate-800">{count}</div>
                <div className="text-[10px] text-slate-400">รางวัลสะสม</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
