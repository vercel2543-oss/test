import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { AwardBadge } from '../common/AwardBadge';
import { DepartmentPill } from '../common/DepartmentPill';
import { X, Trophy, Calendar, ExternalLink, Award as AwardIcon, User } from 'lucide-react';
import { Award } from '../../types';

interface RecipientPortfolioModalProps {
  recipientName: string | null;
  onClose: () => void;
  onOpenAwardDetail: (award: Award) => void;
}

export const RecipientPortfolioModal: React.FC<RecipientPortfolioModalProps> = ({
  recipientName,
  onClose,
  onOpenAwardDetail
}) => {
  const { awards } = useAwards();
  if (!recipientName) return null;

  const recipientAwards = awards.filter(
    a => !a.deleted && a.status === 'published' && a.recipientName.toLowerCase().includes(recipientName.toLowerCase())
  );

  const internationalCount = recipientAwards.filter(a => a.level === 'international').length;
  const nationalCount = recipientAwards.filter(a => a.level === 'national').length;
  const regionalCount = recipientAwards.filter(a => a.level === 'regional').length;
  const provincialCount = recipientAwards.filter(a => a.level === 'provincial').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Recipient Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            <User size={32} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
              <span>ทำเนียบประวัติและผลงานรายบุคคล</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{recipientName}</h3>
            <p className="text-xs text-slate-500">
              ผลงานและรางวัลที่ได้รับทั้งหมด {recipientAwards.length} รายการ
            </p>
          </div>
        </div>

        {/* Level breakdown stats pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-amber-700">{internationalCount}</div>
            <div className="text-[11px] text-amber-900 font-medium">นานาชาติ</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-yellow-700">{nationalCount}</div>
            <div className="text-[11px] text-yellow-900 font-medium">ระดับชาติ</div>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-sky-700">{regionalCount}</div>
            <div className="text-[11px] text-sky-900 font-medium">ระดับภาค</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-700">{provincialCount}</div>
            <div className="text-[11px] text-emerald-900 font-medium">ระดับจังหวัด</div>
          </div>
        </div>

        {/* Awards list */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {recipientAwards.map((award, index) => (
            <div
              key={award.id}
              onClick={() => {
                onClose();
                onOpenAwardDetail(award);
              }}
              className="group p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <AwardBadge level={award.level} size="xs" />
                  <DepartmentPill department={award.department} size="sm" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    ปีการศึกษา {award.academicYear}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {award.awardName}
                </h4>
                <p className="text-xs text-slate-500">{award.organization}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {award.awardDate}
                </span>
                <button className="p-2 rounded-lg bg-white group-hover:bg-blue-600 group-hover:text-white border border-slate-200 group-hover:border-blue-600 text-slate-600 transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
