import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { Award } from '../../types';
import { AwardBadge } from '../common/AwardBadge';
import { DepartmentPill } from '../common/DepartmentPill';
import { DEPARTMENTS } from '../../lib/constants';
import { Calendar, Trophy, Sparkles, Filter, ChevronRight, Eye } from 'lucide-react';

interface TimelineViewProps {
  onOpenDetail: (award: Award) => void;
  onOpenShare: (award: Award) => void;
  onOpenQR: (award: Award) => void;
  onOpenShareImage: (award: Award) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  onOpenDetail,
  onOpenShare,
  onOpenQR,
  onOpenShareImage
}) => {
  const { awards, academicYears } = useAwards();
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const publishedAwards = awards.filter(a => !a.deleted && a.status === 'published');

  // Filtered
  const filteredAwards = selectedDept === 'all'
    ? publishedAwards
    : publishedAwards.filter(a => a.department === selectedDept);

  // Group by Academic Year descending
  const yearsList = [...academicYears].sort((a, b) => b.year.localeCompare(a.year));

  return (
    <div className="space-y-8 py-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Calendar size={14} />
            <span>เส้นทางแห่งเกียรติยศ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Timeline ผลงานตามปีการศึกษา
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light">
            ติดตามประวัติและพัฒนาการความสำเร็จของโรงเรียนในแต่ละปีการศึกษาอย่างเป็นลำดับ
          </p>
        </div>

        {/* Filter by department */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <span className="text-xs text-slate-300 flex items-center gap-1 mr-2">
            <Filter size={13} />
            <span>กรองตามฝ่าย:</span>
          </span>
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedDept === 'all' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ทั้งหมด
          </button>
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDept === dept.id ? 'text-white font-bold shadow-sm ring-2' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              style={{
                backgroundColor: selectedDept === dept.id ? dept.color : undefined,
                borderColor: selectedDept === dept.id ? dept.color : undefined
              }}
            >
              {dept.nameTh}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Tree */}
      <div className="space-y-12 relative before:absolute before:inset-0 before:left-8 sm:before:left-1/2 before:w-0.5 before:bg-slate-200">
        {yearsList.map((yearObj) => {
          const yearAwards = filteredAwards.filter(a => a.academicYear === yearObj.year);
          if (yearAwards.length === 0) return null;

          return (
            <div key={yearObj.year} className="relative space-y-6">
              {/* Year Marker Badge */}
              <div className="sticky top-20 z-10 flex justify-start sm:justify-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-amber-300 text-sm font-bold shadow-lg border border-slate-700">
                  <Trophy size={16} className="text-yellow-400" />
                  <span>ปีการศึกษา {yearObj.year}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-normal">
                    {yearAwards.length} รางวัล
                  </span>
                </div>
              </div>

              {/* Awards in this year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14 sm:pl-0">
                {yearAwards.map((award, idx) => (
                  <div
                    key={award.id}
                    onClick={() => onOpenDetail(award)}
                    className={`bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer space-y-3 relative group ${
                      idx % 2 === 0 ? 'sm:mr-4' : 'sm:ml-4'
                    }`}
                  >
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AwardBadge level={award.level} size="xs" />
                        <DepartmentPill department={award.department} size="sm" />
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {award.awardDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {award.awardName}
                    </h4>

                    {/* Recipient */}
                    <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                      <span>👤 {award.recipientName}</span>
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {award.description || award.organization}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {award.views || 0} ครั้ง
                      </span>
                      <span className="text-blue-600 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        ดูรายละเอียด <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
