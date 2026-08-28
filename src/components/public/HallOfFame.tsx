import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { AwardCard } from './AwardCard';
import { Trophy, Globe, Flame, Sparkles, Award as AwardIcon } from 'lucide-react';
import { Award } from '../../types';

interface HallOfFameProps {
  onOpenDetail: (award: Award) => void;
  onOpenShare: (award: Award) => void;
  onOpenQR: (award: Award) => void;
  onOpenShareImage: (award: Award) => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({
  onOpenDetail,
  onOpenShare,
  onOpenQR,
  onOpenShareImage
}) => {
  const { awards } = useAwards();

  const internationalAwards = awards.filter(
    a => !a.deleted && a.status === 'published' && a.level === 'international'
  );
  const nationalAwards = awards.filter(
    a => !a.deleted && a.status === 'published' && a.level === 'national'
  );

  return (
    <div className="space-y-12 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold backdrop-blur-md border border-white/20">
            <Flame size={14} className="text-yellow-300 animate-bounce" />
            <span>หอเกียรติยศแห่งความสำเร็จสูงสุด</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            🏆 HALL OF FAME
          </h2>
          <p className="text-sm sm:text-base text-amber-100 font-light leading-relaxed">
            เชิดชูเกียรตินักเรียน คณะครู และบุคลากรผู้สร้างชื่อเสียงระดับนานาชาติและระดับประเทศ
            จารึกไว้ในประวัติศาสตร์สถานศึกษา
          </p>
        </div>

        {/* Decorative gold trophy icon watermark */}
        <Trophy
          size={240}
          className="absolute -right-8 -bottom-10 text-white/10 pointer-events-none rotate-12"
        />
      </div>

      {/* Section 1: International Awards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Globe size={22} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>ระดับนานาชาติ (International Achievements)</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                  {internationalAwards.length} รายการ
                </span>
              </h3>
              <p className="text-xs text-slate-500">ผลงานการแข่งขันระดับโลกและระดับนานาชาติ</p>
            </div>
          </div>
        </div>

        {internationalAwards.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
            ยังไม่มีรายการผลงานระดับนานาชาติที่เผยแพร่
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalAwards.map(award => (
              <AwardCard
                key={award.id}
                award={award}
                onOpenDetail={onOpenDetail}
                onOpenShare={onOpenShare}
                onOpenQR={onOpenQR}
                onOpenShareImage={onOpenShareImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section 2: National Awards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Trophy size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>ระดับชาติ (National Achievements)</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                  {nationalAwards.length} รายการ
                </span>
              </h3>
              <p className="text-xs text-slate-500">ผลงานการแข่งขันและรางวัลยกย่องเชิดชูเกียรติระดับประเทศ</p>
            </div>
          </div>
        </div>

        {nationalAwards.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
            ยังไม่มีรายการผลงานระดับชาติที่เผยแพร่
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalAwards.map(award => (
              <AwardCard
                key={award.id}
                award={award}
                onOpenDetail={onOpenDetail}
                onOpenShare={onOpenShare}
                onOpenQR={onOpenQR}
                onOpenShareImage={onOpenShareImage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
