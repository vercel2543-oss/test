import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { AwardCard } from './AwardCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Award } from '../../types';

interface FeaturedAwardsProps {
  onOpenDetail: (award: Award) => void;
  onOpenShare: (award: Award) => void;
  onOpenQR: (award: Award) => void;
  onOpenShareImage: (award: Award) => void;
}

export const FeaturedAwards: React.FC<FeaturedAwardsProps> = ({
  onOpenDetail,
  onOpenShare,
  onOpenQR,
  onOpenShareImage
}) => {
  const { awards, setActiveView } = useAwards();

  const featuredAwards = awards.filter(
    a => !a.deleted && a.status === 'published' && a.featured
  );

  if (featuredAwards.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">⭐ ผลงานเด่นคัดสรร (Featured)</h2>
            <p className="text-xs text-slate-500">ไฮไลต์ความสำเร็จที่ไม่ควรพลาดของโรงเรียน</p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('public_gallery')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <span>ดูทั้งหมด</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredAwards.slice(0, 3).map(award => (
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
    </section>
  );
};
