import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, Save, HardDrive, Database, ShieldCheck, Download, Upload, CheckCircle2 } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { settings, updateSettings, exportDataJson, importDataJson } = useAwards();
  const { isSuperAdmin } = useAuth();

  const [schoolNameTh, setSchoolNameTh] = useState(settings.schoolNameTh);
  const [schoolNameEn, setSchoolNameEn] = useState(settings.schoolNameEn);
  const [currentYear, setCurrentYear] = useState(settings.currentAcademicYear);
  const [rootDriveFolderId, setRootDriveFolderId] = useState(settings.rootGoogleDriveFolderId);
  const [requireApproval, setRequireApproval] = useState(settings.requireApproval);
  const [allowPublicSearch, setAllowPublicSearch] = useState(settings.allowPublicSearch);
  const [schoolAddress, setSchoolAddress] = useState(settings.schoolAddress || '');
  const [schoolPhone, setSchoolPhone] = useState(settings.schoolPhone || '');
  const [schoolEmail, setSchoolEmail] = useState(settings.schoolEmail || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      schoolNameTh,
      schoolNameEn,
      currentAcademicYear: currentYear,
      rootGoogleDriveFolderId: rootDriveFolderId,
      requireApproval,
      allowPublicSearch,
      schoolAddress,
      schoolPhone,
      schoolEmail
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const result = await importDataJson(jsonStr);
        if (result.success) {
          alert('นำเข้าข้อมูลผลงานสำเร็จแล้ว');
        } else {
          alert(`เกิดข้อผิดพลาด: ${result.error}`);
        }
      } catch (err: any) {
        alert(`เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <SettingsIcon size={16} />
            <span>Global System Configuration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">ตั้งค่าระบบทั่วไป</h2>
          <p className="text-xs text-slate-500">
            ปรับแต่งข้อมูลโรงเรียน การเชื่อมโยง Google Drive และนโยบายการอนุมัติ
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold border border-emerald-200">
            <CheckCircle2 size={16} />
            <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* School Info Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            🏫 ข้อมูลหน่วยงาน / สถานศึกษา
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ชื่อโรงเรียน (ภาษาไทย)</label>
              <input
                type="text"
                value={schoolNameTh}
                disabled={!isSuperAdmin}
                onChange={e => setSchoolNameTh(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ชื่อโรงเรียน (ภาษาอังกฤษ)</label>
              <input
                type="text"
                value={schoolNameEn}
                disabled={!isSuperAdmin}
                onChange={e => setSchoolNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ที่อยู่โรงเรียน</label>
              <input
                type="text"
                value={schoolAddress}
                onChange={e => setSchoolAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">เบอร์โทรศัพท์ติดต่อ</label>
              <input
                type="text"
                value={schoolPhone}
                onChange={e => setSchoolPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Google Drive Integration & Workflow Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <HardDrive size={16} className="text-blue-600" />
            <span>การเชื่อมต่อ Google Drive & กฎการเผยแพร่</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Google Drive Root Folder ID</label>
              <input
                type="text"
                value={rootDriveFolderId}
                disabled={!isSuperAdmin}
                onChange={e => setRootDriveFolderId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400">
                รหัสโฟลเดอร์หลักบน Google Drive ที่ใช้สำหรับสร้างโครงสร้าง 5 ฝ่ายและปีการศึกษา
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  disabled={!isSuperAdmin}
                  onChange={e => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-slate-800">
                  ต้องผ่านการอนุมัติจาก Super Admin ก่อนเผยแพร่สู่สาธารณะ
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPublicSearch}
                  disabled={!isSuperAdmin}
                  onChange={e => setAllowPublicSearch(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-slate-800">
                  อนุญาตให้บุคคลภายนอกสืบค้นและดาวน์โหลดเกียรติบัตรได้
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isSuperAdmin && (
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Save size={15} />
            <span>บันทึกการตั้งค่า</span>
          </button>
        )}
      </form>

      {/* Backup and Restore Box (Super Admin) */}
      {isSuperAdmin && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-amber-400" />
            <h3 className="font-bold text-sm">สำรองและกู้คืนฐานข้อมูล (Backup & Restore)</h3>
          </div>
          <p className="text-xs text-slate-400">
            ดาวน์โหลดสำเนาข้อมูลผลงาน โฟลเดอร์ Drive และสถิติทั้งหมดในรูปแบบ JSON
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={exportDataJson}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download size={14} className="text-amber-400" />
              <span>ดาวน์โหลด Backup (JSON)</span>
            </button>

            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
              <Upload size={14} />
              <span>นำเข้าข้อมูล (Restore JSON)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
