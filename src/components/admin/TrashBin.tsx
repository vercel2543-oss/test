import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, RotateCcw, AlertTriangle, Sparkles, FolderArchive } from 'lucide-react';
import { DepartmentPill } from '../common/DepartmentPill';
import { AwardBadge } from '../common/AwardBadge';

export const TrashBin: React.FC = () => {
  const { awards, restoreAward, hardDeleteAward, emptyTrash } = useAwards();
  const { isSuperAdmin } = useAuth();

  const trashedAwards = awards.filter(a => a.deleted);

  const handleEmptyTrash = async () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการในถังขยะทั้งหมดอย่างถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      await emptyTrash();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <Trash2 size={16} />
            <span>Trash Bin & Data Recovery</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">ถังขยะและรายการที่ถูกลบ</h2>
          <p className="text-xs text-slate-500">
            รายการที่ถูกลบชั่วคราว (Soft Delete) สามารถกู้คืนกลับมาได้ตลอดเวลา
          </p>
        </div>

        {trashedAwards.length > 0 && isSuperAdmin && (
          <button
            onClick={handleEmptyTrash}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Trash2 size={14} />
            <span>ล้างถังขยะทั้งหมด</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {trashedAwards.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FolderArchive size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-700">ไม่มีรายการในถังขยะ</p>
            <p className="text-xs text-slate-400">รายการที่ถูกลบจะปรากฏที่นี่เพื่อให้คุณกู้คืนได้</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {trashedAwards.map(award => (
              <div
                key={award.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <AwardBadge level={award.level} size="xs" />
                    <DepartmentPill department={award.department} size="sm" />
                    <span className="text-xs text-slate-500 font-medium">ปีการศึกษา {award.academicYear}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{award.awardName}</h4>
                  <p className="text-xs text-slate-600">ผู้ได้รับ: {award.recipientName}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => restoreAward(award.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>กู้คืนผลงาน</span>
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`คุณต้องการลบ "${award.awardName}" ถาวรใช่หรือไม่?`)) {
                          hardDeleteAward(award.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>ลบถาวร</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
