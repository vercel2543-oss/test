import React, { useState } from 'react';
import { Award } from '../../types';
import { AwardBadge } from '../common/AwardBadge';
import { DepartmentPill } from '../common/DepartmentPill';
import { useAwards } from '../../context/AwardContext';
import {
  X,
  Calendar,
  Eye,
  Share2,
  QrCode,
  Image as ImageIcon,
  HardDrive,
  ExternalLink,
  Download,
  Building,
  User,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { DEPARTMENTS } from '../../lib/constants';
import { formatFileSize } from '../../lib/imageUtils';

interface AwardDetailModalProps {
  award: Award | null;
  onClose: () => void;
  onOpenShare: (award: Award) => void;
  onOpenQR: (award: Award) => void;
  onOpenShareImage: (award: Award) => void;
}

export const AwardDetailModal: React.FC<AwardDetailModalProps> = ({
  award,
  onClose,
  onOpenShare,
  onOpenQR,
  onOpenShareImage
}) => {
  const { setSelectedRecipientName, favorites, toggleFavorite, incrementViews } = useAwards();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [viewingTab, setViewingTab] = useState<'certificate' | 'gallery'>('certificate');

  if (!award) return null;

  const isFav = favorites.includes(award.id);
  const deptInfo = DEPARTMENTS.find(d => d.id === award.department);

  const certUrl = award.certificate?.url || award.coverImage;
  const allGalleryImages = [
    ...(certUrl ? [{ url: certUrl, caption: 'ภาพเกียรติบัตร / โล่รางวัล' }] : []),
    ...award.images.map(img => ({ url: img.url, caption: img.caption || 'ภาพกิจกรรม' }))
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <AwardBadge level={award.level} size="sm" />
            <DepartmentPill department={award.department} size="sm" />
            <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              ปีการศึกษา {award.academicYear}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(award.id)}
              className={`p-2 rounded-full border transition-all ${
                isFav ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
              title={isFav ? 'รายการโปรด' : 'เพิ่มในรายการโปรด'}
            >
              <Heart size={16} className={isFav ? 'fill-rose-500' : ''} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Visual Showcase (Certificate or Photos) */}
          <div className="space-y-3">
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center">
              {allGalleryImages.length > 0 ? (
                <img
                  src={allGalleryImages[activeImageIndex]?.url}
                  alt={award.awardName}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-slate-400 text-sm">ไม่มีไฟล์ภาพแสดง</div>
              )}

              {/* Slider Arrows if multiple images */}
              {allGalleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allGalleryImages.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === allGalleryImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Open High Res in new tab */}
              {allGalleryImages[activeImageIndex]?.url && (
                <a
                  href={allGalleryImages[activeImageIndex]?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs flex items-center gap-1 backdrop-blur-xs transition-all"
                >
                  <Maximize2 size={14} />
                  <span>ดูภาพต้นฉบับ</span>
                </a>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allGalleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allGalleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Award Title & Recipient */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {award.awardName}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <button
                onClick={() => {
                  onClose();
                  setSelectedRecipientName(award.recipientName);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200 transition-colors"
              >
                <User size={16} />
                <span>{award.recipientName}</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">คลิกดูผลงานทั้งหมด</span>
              </button>

              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Calendar size={14} />
                <span>วันที่ได้รับ: {award.awardDate}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Building size={14} />
                <span>หน่วยงานผู้มอบ: {award.organization || 'กระทรวงศึกษาธิการ'}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {award.description && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                รายละเอียดและผลงานเชิงประจักษ์
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-light">
                {award.description}
              </p>
            </div>
          )}

          {/* Google Drive File Architecture & Metadata Box */}
          <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <HardDrive size={16} className="text-blue-600" />
                <span>ตำแหน่งการจัดเก็บบน Google Drive</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                🟢 Google Drive Synced
              </span>
            </div>

            <p className="text-xs font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-blue-100">
              {award.certificate?.drivePath || `📁 ผลงานและรางวัลโรงเรียน / ${deptInfo?.code || award.department} / ${award.academicYear} / เกียรติบัตร`}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
              <div>
                <span>ไฟล์: {award.certificate?.fileName || 'Certificate_File.pdf'}</span>
                {award.certificate?.fileSize && (
                  <span className="ml-2">({formatFileSize(award.certificate.fileSize)})</span>
                )}
              </div>
              <a
                href={award.certificate?.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>เปิดใน Google Drive</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Eye size={14} />
            <span>เข้าชม {award.views || 0} ครั้ง</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenQR(award);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
            >
              <QrCode size={15} />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenShareImage(award);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold border border-amber-200 transition-colors shadow-xs"
            >
              <ImageIcon size={15} className="text-amber-600" />
              <span>สร้างภาพโปสเตอร์แชร์</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenShare(award);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Share2 size={15} />
              <span>แชร์ผลงาน</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
