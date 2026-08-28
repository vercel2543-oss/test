import React, { useState, useEffect } from 'react';
import { Award } from '../../types';
import { generateQRCodeDataUrl, downloadFile } from '../../lib/qrCodeHelper';
import { useAwards } from '../../context/AwardContext';
import { X, Download, Printer, QrCode, Trophy, Sparkles } from 'lucide-react';
import { AwardBadge } from '../common/AwardBadge';

interface QRCodeModalProps {
  award: Award | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ award, onClose }) => {
  const { settings } = useAwards();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!award) return;
    const url = window.location.origin ? `${window.location.origin}/awards/${award.id}` : `https://school.ac.th/awards/${award.id}`;
    generateQRCodeDataUrl(url, { width: 350, margin: 2 }).then(setQrDataUrl);
  }, [award]);

  if (!award) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    downloadFile(qrDataUrl, `QR_${award.recipientName}_${award.academicYear}.png`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
            <QrCode size={20} />
          </div>
          <h3 className="font-bold text-base text-slate-900">QR Code ประจำผลงาน</h3>
          <p className="text-xs text-slate-500">สแกนเพื่อเปิดดูรายละเอียดและเกียรติบัตร</p>
        </div>

        {/* Printable Card Area */}
        <div
          id="printable-qr-card"
          className="bg-gradient-to-b from-slate-50 to-white border-2 border-dashed border-slate-300 rounded-2xl p-5 mb-5 shadow-xs flex flex-col items-center"
        >
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            {settings.schoolNameTh}
          </div>

          <div className="mb-2">
            <AwardBadge level={award.level} size="xs" />
          </div>

          {/* QR Image */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm my-2">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 object-contain" />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                กำลังสร้าง QR...
              </div>
            )}
          </div>

          <p className="text-xs font-bold text-slate-900 line-clamp-2 mt-2 leading-snug">
            {award.awardName}
          </p>
          <p className="text-xs text-blue-600 font-semibold mt-1">
            {award.recipientName}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">ปีการศึกษา {award.academicYear}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Download size={15} />
            <span>ดาวน์โหลดภาพ QR</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200"
          >
            <Printer size={15} />
            <span>สั่งพิมพ์การ์ด</span>
          </button>
        </div>
      </div>
    </div>
  );
};
