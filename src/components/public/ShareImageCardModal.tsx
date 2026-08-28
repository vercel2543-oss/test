import React, { useState, useEffect } from 'react';
import { Award } from '../../types';
import { useAwards } from '../../context/AwardContext';
import { generateQRCodeDataUrl } from '../../lib/qrCodeHelper';
import { captureAndDownloadElement } from '../../lib/shareCardGenerator';
import { X, Download, Sparkles, Trophy, Image as ImageIcon, Loader2 } from 'lucide-react';
import { DEPARTMENTS } from '../../lib/constants';
import { AwardBadge } from '../common/AwardBadge';

interface ShareImageCardModalProps {
  award: Award | null;
  onClose: () => void;
}

export const ShareImageCardModal: React.FC<ShareImageCardModalProps> = ({ award, onClose }) => {
  const { settings } = useAwards();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!award) return;
    const url = window.location.origin ? `${window.location.origin}/awards/${award.id}` : `https://school.ac.th/awards/${award.id}`;
    generateQRCodeDataUrl(url, { width: 180, margin: 1 }).then(setQrUrl);
  }, [award]);

  if (!award) return null;

  const deptInfo = DEPARTMENTS.find(d => d.id === award.department);
  const displayImage = award.certificate?.thumbnailUrl || award.coverImage || award.certificate?.url || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop&q=80';

  const handleDownloadImage = async () => {
    setDownloading(true);
    await captureAndDownloadElement('official-social-share-card', `Award_Poster_${award.recipientName}_${award.academicYear}.png`);
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 my-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <ImageIcon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">สร้างภาพโปสเตอร์สำหรับแชร์</h3>
            <p className="text-xs text-slate-500">สร้างภาพ PNG พร้อมกรอบเกียรติยศสำหรับเผยแพร่ในโซเชียลมีเดีย</p>
          </div>
        </div>

        {/* The Generatable Card Element Container (captured by html-to-image) */}
        <div className="flex justify-center mb-6 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <div
            id="official-social-share-card"
            className="w-full max-w-[420px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden"
            style={{ minHeight: '520px' }}
          >
            {/* Background Glows */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl" />

            {/* School Crest / Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Trophy size={16} />
              </div>
              <span className="text-xs font-bold text-amber-200 tracking-wide uppercase">
                {settings.schoolNameTh}
              </span>
            </div>

            {/* Banner Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-semibold mb-4">
              <Sparkles size={12} />
              <span>ผลงานแห่งความภาคภูมิใจ</span>
            </div>

            {/* Certificate / Cover Photo Frame */}
            <div className="w-full h-44 rounded-xl overflow-hidden border-2 border-amber-400/40 shadow-xl bg-slate-800 mb-4 relative">
              <img
                src={displayImage}
                alt={award.awardName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute top-2 left-2">
                <AwardBadge level={award.level} size="xs" />
              </div>
            </div>

            {/* Award Information */}
            <div className="w-full space-y-1.5 mb-4">
              <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                {award.awardName}
              </h4>
              <p className="text-sm font-extrabold text-amber-300">
                {award.recipientName}
              </p>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-300 pt-1">
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {deptInfo?.nameTh || award.department}
                </span>
                <span>•</span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  ปีการศึกษา {award.academicYear}
                </span>
              </div>
            </div>

            {/* Footer QR Code & Details */}
            <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
              <div className="text-left text-[10px] text-slate-400">
                <p className="font-semibold text-slate-200">{settings.schoolNameEn}</p>
                <p>สแกนเพื่อดูเกียรติบัตรฉบับเต็ม</p>
              </div>

              {qrUrl && (
                <div className="bg-white p-1 rounded-lg shadow-sm shrink-0">
                  <img src={qrUrl} alt="QR Code" className="w-14 h-14" crossOrigin="anonymous" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>กำลังสร้างภาพความละเอียดสูง...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>ดาวน์โหลดภาพโปสเตอร์สำหรับแชร์ (PNG)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
