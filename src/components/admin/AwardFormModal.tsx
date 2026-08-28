import React, { useState, useEffect } from 'react';
import { Award, DepartmentType, AwardLevelType, RecipientType, AwardStatusType, ActivityImage } from '../../types';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, AWARD_LEVELS } from '../../lib/constants';
import { compressImage } from '../../lib/imageUtils';
import { DriveService } from '../../lib/driveService';
import {
  X,
  Sparkles,
  Upload,
  HardDrive,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Trash2,
  Plus,
  FileText
} from 'lucide-react';

interface AwardFormModalProps {
  initialAward?: Award | null;
  onClose: () => void;
  onSaved: () => void;
}

export const AwardFormModal: React.FC<AwardFormModalProps> = ({
  initialAward,
  onClose,
  onSaved
}) => {
  const { driveFolders, settings, academicYears, addAward, updateAward, checkDuplicateAward } = useAwards();
  const { currentUser, isSuperAdmin } = useAuth();

  // Form Fields
  const [awardName, setAwardName] = useState<string>(initialAward?.awardName || '');
  const [recipientName, setRecipientName] = useState<string>(initialAward?.recipientName || '');
  const [recipientType, setRecipientType] = useState<RecipientType>(initialAward?.recipientType || 'student');
  const [department, setDepartment] = useState<DepartmentType>(
    initialAward?.department || (currentUser?.department !== 'all' ? (currentUser?.department as DepartmentType) : 'academic')
  );
  const [level, setLevel] = useState<AwardLevelType>(initialAward?.level || 'national');
  const [academicYear, setAcademicYear] = useState<string>(initialAward?.academicYear || settings.currentAcademicYear);
  const [awardDate, setAwardDate] = useState<string>(initialAward?.awardDate || new Date().toISOString().split('T')[0]);
  const [organization, setOrganization] = useState<string>(initialAward?.organization || '');
  const [description, setDescription] = useState<string>(initialAward?.description || '');
  const [status, setStatus] = useState<AwardStatusType>(initialAward?.status || (isSuperAdmin ? 'published' : 'pending'));
  const [featured, setFeatured] = useState<boolean>(initialAward?.featured || false);

  // Files
  const [certFile, setCertFile] = useState<{
    fileName: string;
    dataUrl: string;
    fileSize: number;
    mimeType: string;
  } | null>(
    initialAward?.certificate
      ? {
          fileName: initialAward.certificate.fileName,
          dataUrl: initialAward.certificate.url,
          fileSize: initialAward.certificate.fileSize || 0,
          mimeType: initialAward.certificate.mimeType
        }
      : null
  );

  const [imagesList, setImagesList] = useState<ActivityImage[]>(initialAward?.images || []);
  const [coverImage, setCoverImage] = useState<string>(initialAward?.coverImage || '');

  // OCR and loading states
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrMessage, setOcrMessage] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [savingStatus, setSavingStatus] = useState<string>('กำลังบันทึกข้อมูล...');

  // Duplicate Check
  const [duplicateWarning, setDuplicateWarning] = useState<Award[]>([]);

  // Check duplicate on name/recipient change
  useEffect(() => {
    if (awardName.trim().length > 3 && recipientName.trim().length > 2) {
      const result = checkDuplicateAward(awardName, recipientName, academicYear, department, initialAward?.id);
      if (result.isDuplicate) {
        setDuplicateWarning(result.matches);
      } else {
        setDuplicateWarning([]);
      }
    } else {
      setDuplicateWarning([]);
    }
  }, [awardName, recipientName, academicYear, department]);

  // Google Drive resolved path
  const drivePathInfo = DriveService.resolveUploadPath(driveFolders, department, academicYear, 'certificate');

  // Handle Certificate Upload & AI OCR Trigger
  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setOcrLoading(true);
      setOcrMessage('กำลังบีบอัดและวิเคราะห์เกียรติบัตรด้วย Gemini 2.5 Flash AI...');

      const compressed = await compressImage(file, 2048, 2048, 0.9);
      setCertFile({
        fileName: file.name,
        dataUrl: compressed.dataUrl,
        fileSize: compressed.compressedSize,
        mimeType: file.type || 'image/jpeg'
      });

      if (!coverImage) {
        setCoverImage(compressed.dataUrl);
      }

      // Call AI OCR endpoint
      const response = await fetch('/api/ocr-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressed.dataUrl,
          mimeType: file.type || 'image/jpeg'
        })
      });

      const data = await response.json();
      if (data.success && data.extracted) {
        const ext = data.extracted;
        if (ext.awardName && !awardName) setAwardName(ext.awardName);
        if (ext.recipientName && !recipientName) setRecipientName(ext.recipientName);
        if (ext.organization && !organization) setOrganization(ext.organization);
        if (ext.level) setLevel(ext.level as AwardLevelType);
        if (ext.department) setDepartment(ext.department as DepartmentType);
        if (ext.awardDate && ext.awardDate.length === 10) setAwardDate(ext.awardDate);
        if (ext.description && !description) setDescription(ext.description);
        if (ext.recipientType) setRecipientType(ext.recipientType as RecipientType);

        setOcrMessage('✨ AI ดึงข้อมูลจากเกียรติบัตรสำเร็จแล้ว กรุณาตรวจสอบความถูกต้องด้านล่าง');
      }
    } catch (err: any) {
      console.warn('OCR error:', err);
      setOcrMessage('อัปโหลดไฟล์สำเร็จ (ไม่สามารถรัน OCR ได้ กรุณากรอกข้อมูลด้วยตนเอง)');
    } finally {
      setOcrLoading(false);
    }
  };

  // Handle Activity Images Upload
  const handleActivityImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    for (const file of files) {
      const compressed = await compressImage(file, 1600, 1600, 0.85);
      const newImg: ActivityImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fileId: `drive_act_${Date.now()}`,
        fileName: file.name,
        url: compressed.dataUrl,
        thumbnailUrl: compressed.dataUrl,
        order: imagesList.length + 1
      };
      setImagesList(prev => [...prev, newImg]);
      if (!coverImage) {
        setCoverImage(compressed.dataUrl);
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    setImagesList(prev => prev.filter(img => img.id !== id));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardName.trim() || !recipientName.trim()) {
      alert('กรุณาระบุชื่อรางวัลและชื่อผู้ได้รับรางวัล');
      return;
    }

    setSaving(true);
    setSavingStatus('กำลังเตรียมข้อมูลรูปภาพ...');
    try {
      // 1. Upload Certificate to Google Drive with fast fallback
      let finalCertData = certFile ? {
        fileId: `drive_cert_${Date.now()}`,
        fileName: certFile.fileName,
        url: certFile.dataUrl,
        thumbnailUrl: certFile.dataUrl,
        mimeType: certFile.mimeType,
        fileSize: certFile.fileSize,
        drivePath: drivePathInfo.pathString
      } : undefined;

      if (certFile && certFile.dataUrl.startsWith('data:')) {
        setSavingStatus('กำลังเชื่อมต่อและอัปโหลดเกียรติบัตรขึ้น Google Drive...');
        try {
          const certBlob = await (await fetch(certFile.dataUrl)).blob();
          const targetFolderId = drivePathInfo.folder?.googleDriveFolderId;
          const uploadedDriveCert = await Promise.race([
            DriveService.uploadFileToDrive(
              certBlob,
              `Cert_${academicYear}_${recipientName}_${certFile.fileName}`,
              targetFolderId,
              certFile.mimeType
            ),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000))
          ]);

          if (uploadedDriveCert && uploadedDriveCert.url) {
            finalCertData = {
              fileId: uploadedDriveCert.fileId,
              fileName: certFile.fileName,
              url: uploadedDriveCert.url,
              thumbnailUrl: uploadedDriveCert.thumbnailUrl,
              mimeType: certFile.mimeType,
              fileSize: certFile.fileSize,
              drivePath: drivePathInfo.pathString
            };
          }
        } catch (e) {
          console.warn('Google Drive cert upload fallback:', e);
        }
      }

      // 2. Parallel upload activity images to Google Drive
      const imgPathInfo = DriveService.resolveUploadPath(driveFolders, department, academicYear, 'images');
      let finalImagesList: ActivityImage[] = [];

      if (imagesList.length > 0) {
        setSavingStatus(`กำลังอัปโหลดรูปภาพกิจกรรม (${imagesList.length} รูป)...`);
        const uploadPromises = imagesList.map(async (img) => {
          if (img.url.startsWith('data:')) {
            try {
              const imgBlob = await (await fetch(img.url)).blob();
              const targetFolderId = imgPathInfo.folder?.googleDriveFolderId;
              const uploaded = await Promise.race([
                DriveService.uploadFileToDrive(
                  imgBlob,
                  `Act_${academicYear}_${recipientName}_${img.fileName}`,
                  targetFolderId,
                  'image/jpeg'
                ),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000))
              ]);

              if (uploaded && uploaded.url) {
                return {
                  ...img,
                  fileId: uploaded.fileId,
                  url: uploaded.url,
                  thumbnailUrl: uploaded.thumbnailUrl,
                };
              }
            } catch {
              // fallback to existing
            }
          }
          return img;
        });

        finalImagesList = await Promise.all(uploadPromises);
      }

      const finalCover = coverImage || finalCertData?.url || finalImagesList[0]?.url || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop&q=80';

      setSavingStatus('กำลังบันทึกลงฐานข้อมูล...');
      const awardPayload = {
        awardName: awardName.trim(),
        recipientName: recipientName.trim(),
        recipientType,
        department,
        level,
        academicYear,
        awardDate,
        organization: organization.trim() || 'สถานศึกษา',
        description: description.trim(),
        certificate: finalCertData,
        images: finalImagesList,
        coverImage: finalCover,
        status,
        featured,
        googleDriveFolderId: drivePathInfo.folder?.googleDriveFolderId
      };

      if (initialAward) {
        await updateAward(initialAward.id, awardPayload);
      } else {
        await addAward(awardPayload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      alert(`บันทึกไม่สำเร็จ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {initialAward ? 'แก้ไขข้อมูลผลงานและเกียรติบัตร' : 'เพิ่มผลงานและเกียรติบัตรใหม่'}
              </h3>
              <p className="text-xs text-slate-500">บันทึกลงฐานข้อมูลและเชื่อมโยง Google Drive</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* AI OCR Certificate Upload Box */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white border-2 border-dashed border-blue-300 rounded-2xl p-5 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    อัปโหลดเกียรติบัตร / รางวัล (พร้อมระบบ AI อ่านข้อมูลอัตโนมัติ)
                  </h4>
                  <p className="text-[11px] text-slate-500">รองรับไฟล์ JPG, PNG, PDF (Gemini 2.5 Flash OCR)</p>
                </div>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0">
                <Upload size={14} />
                <span>เลือกไฟล์เกียรติบัตร</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleCertUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* OCR Notice */}
            {ocrLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-100/70 px-3 py-2 rounded-xl animate-pulse">
                <Loader2 size={15} className="animate-spin" />
                <span>{ocrMessage}</span>
              </div>
            )}

            {!ocrLoading && ocrMessage && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                {ocrMessage}
              </div>
            )}

            {/* Certificate Preview if loaded */}
            {certFile && (
              <div className="mt-3 flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={certFile.dataUrl}
                    alt="Certificate"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 truncate">{certFile.fileName}</p>
                    <p className="text-[10px] text-slate-500">
                      โฟลเดอร์ปลายทาง: {drivePathInfo.pathString}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCertFile(null)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Duplicate Warning Alert */}
          {duplicateWarning.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-900">ตรวจพบผลงานที่มีชื่อหรือผู้ได้รับรางวัลใกล้เคียงกัน:</p>
                <ul className="list-disc pl-4 text-amber-800 space-y-0.5">
                  {duplicateWarning.map(dup => (
                    <li key={dup.id}>
                      "{dup.awardName}" - {dup.recipientName} ({dup.academicYear})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Award Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                ชื่อรางวัล / กิจกรรมการแข่งขัน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={awardName}
                onChange={e => setAwardName(e.target.value)}
                placeholder="เช่น รางวัลชนะเลิศเหรียญทอง การแข่งขันหุ่นยนต์ระดับชาติ..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                ชื่อ-นามสกุล / ทีม / หน่วยงานผู้ได้รับ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="เช่น นายกิตติภูมิ ธนปภากุล หรือ ทีม Robot Club"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Recipient Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ประเภทผู้รับผลงาน</label>
              <select
                value={recipientType}
                onChange={e => setRecipientType(e.target.value as RecipientType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              >
                <option value="student">นักเรียน (รายบุคคล)</option>
                <option value="team">ทีมนักเรียน / กลุ่ม</option>
                <option value="teacher">ครูผู้สอน / บุคลากร</option>
                <option value="staff">เจ้าหน้าที่ / ฝ่ายงาน</option>
                <option value="school">สถานศึกษา / สถาบัน</option>
              </select>
            </div>

            {/* Department (5 departments) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                ฝ่ายที่รับผิดชอบ (5 ฝ่าย) <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                disabled={!isSuperAdmin && currentUser?.department !== 'all'}
                onChange={e => setDepartment(e.target.value as DepartmentType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none disabled:opacity-75"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nameTh} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Award Level */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ระดับรางวัล (Level)</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as AwardLevelType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              >
                {AWARD_LEVELS.map(lvl => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.nameTh} ({lvl.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ปีการศึกษา</label>
              <select
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              >
                {academicYears.map(yr => (
                  <option key={yr.year} value={yr.year}>
                    ปีการศึกษา {yr.year} {yr.isCurrent ? '(ปัจจุบัน)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Award Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">วันที่ได้รับรางวัล</label>
              <input
                type="date"
                value={awardDate}
                onChange={e => setAwardDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Organization / Issuer */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">หน่วยงาน/องค์กรผู้มอบรางวัล</label>
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="เช่น กระทรวงศึกษาธิการ, สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">คำอธิบายและรายละเอียดผลงาน</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="ระบุรายละเอียดการแข่งขัน ผลงานชิ้นงาน หรือข้อความสรุปเกียรติประวัติ..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          {/* Activity Photos Gallery Section */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-blue-600" />
                  <span>ภาพบรรยากาศ / ภาพกิจกรรมการรับรางวัล</span>
                </h4>
                <p className="text-[11px] text-slate-500">อัปโหลดภาพเพิ่มเติมเพื่อแสดงในแกลเลอรี</p>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors">
                <Plus size={14} />
                <span>เพิ่มภาพถ่าย</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleActivityImagesUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images Thumbnail Grid */}
            {imagesList.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagesList.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {coverImage === img.url ? (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        หน้าปก
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCoverImage(img.url)}
                        className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ตั้งเป็นปก
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status & Featured Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">สถานะการเผยแพร่</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as AwardStatusType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              >
                <option value="published">เผยแพร่ทันที (Published)</option>
                <option value="pending">รอการอนุมัติ (Pending Review)</option>
                <option value="draft">ฉบับร่าง (Draft)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                />
                <span>⭐ ตั้งเป็นผลงานเด่น (Featured Showcase)</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>{savingStatus}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>บันทึกผลงาน</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
