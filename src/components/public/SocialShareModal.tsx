import React, { useState } from 'react';
import { Award } from '../../types';
import { X, Share2, Copy, Check, QrCode, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface SocialShareModalProps {
  award: Award | null;
  onClose: () => void;
  onOpenQR: (award: Award) => void;
  onOpenShareImage: (award: Award) => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  award,
  onClose,
  onOpenQR,
  onOpenShareImage
}) => {
  const [copied, setCopied] = useState(false);
  if (!award) return null;

  const currentUrl = window.location.origin ? `${window.location.origin}/awards/${award.id}` : `https://school.ac.th/awards/${award.id}`;
  const shareTitle = `🏆 ${award.awardName} - ได้รับโดย ${award.recipientName} (${award.academicYear})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: award.awardName,
          text: `${shareTitle} | ระบบคลังผลงานและรางวัลของโรงเรียน`,
          url: currentUrl
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const shareToLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareToTwitter = () => {
    const text = `${shareTitle} #โรงเรียนสาธิต #ผลงานนักเรียน`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">แชร์ผลงานแห่งความภาคภูมิใจ</h3>
            <p className="text-xs text-slate-500">เผยแพร่ความสำเร็จผ่านโซเชียลมีเดีย</p>
          </div>
        </div>

        {/* Award Summary snippet */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5">
          <p className="text-xs font-bold text-slate-900 line-clamp-2">{award.awardName}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">👤 {award.recipientName} • ปี {award.academicYear}</p>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={shareToLine}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200 transition-all text-xs font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              L
            </div>
            <span>แชร์ LINE</span>
          </button>

          <button
            onClick={shareToFacebook}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl border border-blue-200 transition-all text-xs font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              f
            </div>
            <span>Facebook</span>
          </button>

          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl border border-slate-200 transition-all text-xs font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              𝕏
            </div>
            <span>แชร์ X</span>
          </button>
        </div>

        {/* Extra PR tools: QR Code & Share Image */}
        <div className="space-y-2 mb-5">
          <button
            onClick={() => {
              onClose();
              onOpenShareImage(award);
            }}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-900 rounded-xl border border-amber-200 text-xs font-semibold transition-all"
          >
            <span className="flex items-center gap-2">
              <ImageIcon size={16} className="text-amber-600" />
              <span>🎨 สร้างภาพประชาสัมพันธ์ (พร้อมกรอบ & QR)</span>
            </span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">แนะนำ</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenQR(award);
            }}
            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 text-xs font-semibold transition-all"
          >
            <span className="flex items-center gap-2">
              <QrCode size={16} className="text-slate-600" />
              <span>📱 สร้าง QR Code สำหรับพิมพ์ติดนิทรรศการ</span>
            </span>
            <ExternalLink size={13} className="text-slate-400" />
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="w-full pl-3 pr-24 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`absolute right-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
