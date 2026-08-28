import React from 'react';
import { Award } from '../../types';
import { AwardBadge } from '../common/AwardBadge';
import { DepartmentPill } from '../common/DepartmentPill';
import { useAwards } from '../../context/AwardContext';
import { Calendar, Eye, Share2, QrCode, Image as ImageIcon, Heart, Sparkles } from 'lucide-react';

interface AwardCardProps {
  award: Award;
  onOpenDetail: (award: Award) => void;
  onOpenShare?: (award: Award) => void;
  onOpenQR?: (award: Award) => void;
  onOpenShareImage?: (award: Award) => void;
}

export const AwardCard: React.FC<AwardCardProps> = ({
  award,
  onOpenDetail,
  onOpenShare,
  onOpenQR,
  onOpenShareImage
}) => {
  const { setSelectedRecipientName, favorites, toggleFavorite } = useAwards();
  const isFav = favorites.includes(award.id);

  const displayImage = award.coverImage || award.certificate?.thumbnailUrl || award.certificate?.url || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Top Image Box */}
      <div
        className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onOpenDetail(award)}
      >
        <img
          src={displayImage}
          alt={award.awardName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <AwardBadge level={award.level} size="xs" />
          {award.featured && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles size={11} /> เด่น
            </span>
          )}
        </div>

        {/* Favorite Button (Top right overlay on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(award.id);
          }}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
          }`}
          title={isFav ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
        >
          <Heart size={14} className={isFav ? 'fill-white' : ''} />
        </button>

        {/* Recipient info on image bottom */}
        <div className="absolute bottom-3 left-3 right-12 text-white pointer-events-none">
          <p className="text-xs font-semibold drop-shadow-sm truncate text-white/95">
            {award.recipientName}
          </p>
          <p className="text-[10px] text-slate-300 drop-shadow-xs truncate">
            {award.organization || 'สถานศึกษา'}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Department & Year Pill */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <DepartmentPill department={award.department} size="sm" />
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              ปี {award.academicYear}
            </span>
          </div>

          {/* Award Title */}
          <h3
            onClick={() => onOpenDetail(award)}
            className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors leading-snug mb-2"
          >
            {award.awardName}
          </h3>

          {/* Recipient Link */}
          <button
            onClick={() => setSelectedRecipientName(award.recipientName)}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium mb-3 text-left"
          >
            <span>👤 {award.recipientName}</span>
          </button>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              {award.awardDate}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Eye size={12} />
              {award.views || 0}
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {onOpenQR && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQR(award);
                }}
                title="สร้าง QR Code"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <QrCode size={14} />
              </button>
            )}

            {onOpenShareImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShareImage(award);
                }}
                title="สร้างภาพสำหรับแชร์โซเชียล"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <ImageIcon size={14} />
              </button>
            )}

            {onOpenShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShare(award);
                }}
                title="แชร์ผลงาน (LINE, Facebook, Copy)"
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Share2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
