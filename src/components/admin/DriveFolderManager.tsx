import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { DriveFolder, DepartmentType } from '../../types';
import { DEPARTMENTS } from '../../lib/constants';
import {
  HardDrive,
  FolderPlus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Folder,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
  Loader2,
  LogIn,
  LogOut,
  ShieldCheck,
  Link,
  Info,
  HelpCircle
} from 'lucide-react';
import { googleDriveClient } from '../../lib/googleDriveClient';

export const DriveFolderManager: React.FC = () => {
  const {
    driveFolders,
    academicYears,
    syncDriveFolders,
    generateAutoDriveStructure,
    addDriveFolder,
    updateDriveFolder,
    removeDriveFolderMapping
  } = useAwards();
  const { isSuperAdmin } = useAuth();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-folder-0': true,
    'dept-folder-acad': true,
    'dept-folder-affairs': true,
    'dept-folder-general': true,
    'dept-folder-personnel': true,
    'dept-folder-budget': true
  });

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [generatingProgress, setGeneratingProgress] = useState<string | null>(null);

  // Direct Master Drive Link Setup State
  const rootFolder = driveFolders.find(f => f.type === 'root') || driveFolders[0];
  const [masterDriveInput, setMasterDriveInput] = useState(rootFolder?.googleDriveUrl || '');
  const [isSavingMaster, setIsSavingMaster] = useState(false);

  // Add folder modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [parentFolderId, setParentFolderId] = useState<string>('root-folder-0');
  const [newFolderName, setNewFolderName] = useState('');
  const [newDriveId, setNewDriveId] = useState('');

  // OAuth & Help modal states
  const [isDriveAuth, setIsDriveAuth] = useState(googleDriveClient.isConnected());
  const [authLoading, setAuthLoading] = useState(false);
  const [oauthHelpNotice, setOauthHelpNotice] = useState<string | null>(null);

  const extractFolderId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (!trimmed) return '';
    // If it's a URL like https://drive.google.com/drive/folders/1ABC123xyz?usp=sharing
    const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // If it's a raw folder ID
    return trimmed;
  };

  const handleSaveMasterDriveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterDriveInput.trim()) return;

    try {
      setIsSavingMaster(true);
      const extractedId = extractFolderId(masterDriveInput);
      const standardUrl = `https://drive.google.com/drive/folders/${extractedId}`;

      if (rootFolder) {
        await updateDriveFolder(rootFolder.id, {
          googleDriveFolderId: extractedId,
          googleDriveUrl: standardUrl,
          status: 'connected'
        });
      }

      setSyncMessage(`เชื่อมต่อโฟลเดอร์ Google Drive หลักของโรงเรียนสำเร็จ (Folder ID: ${extractedId})`);
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err: any) {
      alert(`บันทึกไม่สำเร็จ: ${err.message}`);
    } finally {
      setIsSavingMaster(false);
    }
  };

  const handleConnectGoogleDrive = async () => {
    try {
      setAuthLoading(true);
      setOauthHelpNotice(null);
      await googleDriveClient.authorize();
      setIsDriveAuth(googleDriveClient.isConnected());
      setSyncMessage('เชื่อมต่อ Google Drive API สำเร็จ พร้อมสร้างโฟลเดอร์และอัปโหลดไฟล์จริง');
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('403') || errMsg.includes('access_denied') || errMsg.includes('verification')) {
        setOauthHelpNotice(
          'Google แจ้งเตือน 403 Access Blocked: เนื่องจาก OAuth App กำลังอยู่ในโหมดทดสอบ ท่านสามารถใช้ "โหมดเชื่อมต่อด้วยลิงก์โฟลเดอร์ Google Drive โดยตรง (Direct Folder Link)" ด้านล่างนี้ได้ทันที 100% โดยไม่ติดบล็อกสิทธิ์ใดๆ'
        );
      } else {
        alert(`การเชื่อมต่อ Google Drive: ${errMsg}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDisconnectGoogleDrive = () => {
    googleDriveClient.disconnect();
    setIsDriveAuth(false);
    setSyncMessage('ยกเลิกการเชื่อมต่อ Google Drive แล้ว');
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    const result = await syncDriveFolders();
    setSyncMessage(result.message);
    setSyncing(false);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleAutoGenerate = async () => {
    if (confirm('คุณต้องการสร้างโครงสร้างโฟลเดอร์ Google Drive อัตโนมัติสำหรับ 5 ฝ่ายและทุกปีการศึกษาใช่หรือไม่? ระบบจะบันทึกโครงสร้างลงฐานข้อมูล Cloud ให้ทันที')) {
      try {
        setSyncing(true);
        await generateAutoDriveStructure((msg) => {
          setGeneratingProgress(msg);
        });
        setSyncMessage('สร้างโครงสร้างโฟลเดอร์ Google Drive 5 ฝ่าย ครบทุกปีการศึกษาสำเร็จและบันทึกลง Cloud แล้ว');
        setTimeout(() => setSyncMessage(null), 5000);
      } catch (e: any) {
        alert(`เกิดข้อผิดพลาด: ${e.message}`);
      } finally {
        setSyncing(false);
        setGeneratingProgress(null);
      }
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;

    const parent = driveFolders.find(f => f.id === parentFolderId);
    const extractedId = extractFolderId(newDriveId) || `1Drive_${Math.random().toString(36).substring(2, 10)}`;

    await addDriveFolder({
      name: newFolderName.startsWith('📁') ? newFolderName : `📁 ${newFolderName}`,
      type: 'custom',
      department: parent?.department,
      parentFolderId,
      googleDriveFolderId: extractedId,
      googleDriveUrl: `https://drive.google.com/drive/folders/${extractedId}`,
      status: 'connected'
    });

    setNewFolderName('');
    setNewDriveId('');
    setShowAddModal(false);
  };

  // Build Hierarchy Tree
  const renderTree = (parentId: string | null = null, depth: number = 0) => {
    const children = driveFolders.filter(f => f.parentFolderId === parentId);
    if (children.length === 0) return null;

    return (
      <div className={`space-y-1.5 ${depth > 0 ? 'ml-6 pl-3 border-l border-slate-200' : ''}`}>
        {children.map(folder => {
          const hasChildren = driveFolders.some(f => f.parentFolderId === folder.id);
          const isExpanded = expandedNodes[folder.id] ?? false;

          const getStatusBadge = () => {
            if (folder.status === 'connected') {
              return (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} className="text-emerald-500" /> เชื่อมต่อแล้ว
                </span>
              );
            }
            if (folder.status === 'warning') {
              return (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={11} className="text-amber-500" /> กำหนด Folder ID
                </span>
              );
            }
            return (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                <XCircle size={11} className="text-rose-500" /> ยังไม่เชื่อมต่อ
              </span>
            );
          };

          return (
            <div key={folder.id} className="space-y-1">
              <div className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all text-xs">
                <div className="flex items-center gap-2 truncate">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleExpand(folder.id)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  ) : (
                    <span className="w-6" />
                  )}

                  <Folder size={16} className="text-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{folder.name}</span>

                  <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[130px]">
                    {folder.googleDriveFolderId}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge()}

                  <a
                    href={folder.googleDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="เปิดใน Google Drive"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span>เปิดโฟลเดอร์</span>
                    <ExternalLink size={12} />
                  </a>

                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setParentFolderId(folder.id);
                          setShowAddModal(true);
                        }}
                        title="เพิ่มโฟลเดอร์ย่อย"
                        className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                      >
                        <Plus size={14} />
                      </button>

                      {folder.type !== 'root' && (
                        <button
                          onClick={() => removeDriveFolderMapping(folder.id)}
                          title="ลบการเชื่อมต่อโฟลเดอร์นี้"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Subfolders */}
              {hasChildren && isExpanded && renderTree(folder.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <HardDrive size={16} />
            <span>Google Drive Architecture & Mapping</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">จัดการโครงสร้างโฟลเดอร์ Google Drive</h2>
          <p className="text-xs text-slate-500">
            โครงสร้างการจัดเก็บไฟล์เกียรติบัตรและภาพกิจกรรม 5 ฝ่ายอย่างเป็นระบบและถาวร
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isDriveAuth ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>Drive API เชื่อมต่อแล้ว</span>
              <button
                onClick={handleDisconnectGoogleDrive}
                className="text-[10px] text-slate-400 hover:text-rose-600 ml-1 underline"
              >
                ตัดการเชื่อมต่อ
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGoogleDrive}
              disabled={authLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              {authLoading ? <Loader2 size={14} className="animate-spin text-blue-600" /> : <LogIn size={14} className="text-blue-600" />}
              <span>{authLoading ? 'กำลังตรวจสอบ...' : 'ขอสิทธิ์ Drive OAuth'}</span>
            </button>
          )}

          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin text-blue-600' : ''} />
            <span>{syncing ? 'กำลังซิงค์...' : 'ตรวจสอบสถานะ Sync'}</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={handleAutoGenerate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Sparkles size={14} />
              <span>สร้างโครงสร้างอัตโนมัติ 5 ฝ่าย</span>
            </button>
          )}
        </div>
      </div>

      {/* OAuth 403 Friendly Guidance Notice */}
      {oauthHelpNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-2 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">คำแนะนำการเชื่อมต่อ Google Drive:</p>
              <p className="text-slate-700 leading-relaxed">{oauthHelpNotice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Folder Generation Progress Indicator */}
      {generatingProgress && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs space-y-2 animate-in fade-in flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-blue-600 shrink-0" />
          <div>
            <p className="font-bold text-blue-950">กำลังดำเนินการสร้างโครงสร้างโฟลเดอร์ Google Drive:</p>
            <p className="text-blue-800">{generatingProgress}</p>
          </div>
        </div>
      )}

      {syncMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 15 GB Google Drive Free Storage Benefits Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-3xl border border-emerald-800 shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
            <Sparkles size={18} />
            <span>สิทธิประโยชน์: ใช้พื้นที่ฟรี 15 GB ของ Google Drive ประหยัดฐานข้อมูล 100%</span>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            Zero Storage Cost
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          เมื่อเชื่อมต่อ Google Drive ระบบจะนำภาพเกียรติบัตรและรูปกิจกรรมทั้งหมดไปเก็บไว้บน Google Drive ส่วนตัวหรือของโรงเรียนโดยตรง ทำให้ฐานข้อมูล Firebase เก็บเพียงข้อความสั้นๆ (URL) ช่วยให้ระบบทำงานได้รวดเร็ว ประหยัดโควต้า ไม่เสียค่าใช้จ่ายพื้นที่จัดเก็บ และโรงเรียนเป็นเจ้าของไฟล์ 100%
        </p>
      </div>

      {/* Direct Google Drive Link Configuration Card */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 p-6 rounded-3xl border border-blue-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Link size={16} className="text-blue-600" />
            <span>เชื่อมต่อโฟลเดอร์ Google Drive หลักของโรงเรียน (Direct Link / ID Mode)</span>
          </div>
          <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
            แนะนำใช้งานได้ทันที 100%
          </span>
        </div>

        <p className="text-xs text-slate-600">
          คัดลอกลิงก์โฟลเดอร์ Google Drive ของโรงเรียน (หรือ Folder ID) มาวางที่นี่ ระบบจะเชื่อมโยงและจัดหมวดหมู่ให้ครูและบุคลากรทั้ง 5 ฝ่ายเข้าถึงและอัปโหลดไฟล์ได้อย่างสะดวก
        </p>

        <form onSubmit={handleSaveMasterDriveLink} className="flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            placeholder="วางลิงก์ https://drive.google.com/drive/folders/... หรือ Folder ID"
            value={masterDriveInput}
            onChange={e => setMasterDriveInput(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={isSavingMaster}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
          >
            {isSavingMaster ? 'กำลังบันทึก...' : 'บันทึกการเชื่อมต่อ'}
          </button>
        </form>
      </div>

      {/* Information Guide Card */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 text-xs space-y-2 border border-slate-800">
        <h4 className="font-bold text-white flex items-center gap-2">
          <span>📁 ลำดับชั้นมาตรฐานการจัดเก็บไฟล์ (Drive Hierarchy):</span>
        </h4>
        <div className="font-mono text-[11px] text-amber-300 pl-3 border-l-2 border-amber-400 space-y-1">
          <p>📁 ผลงานและรางวัลโรงเรียน (Root)</p>
          <p className="pl-4">├── 📁 01_วิชาการ / 02_กิจการ / 03_ทั่วไป / 04_บุคคล / 05_งบประมาณ</p>
          <p className="pl-8">├── 📁 [ปีการศึกษา เช่น 2569, 2568, 2567...]</p>
          <p className="pl-12">├── 📁 เกียรติบัตร (PDF/JPG)</p>
          <p className="pl-12">└── 📁 ภาพประกอบ (JPG/PNG)</p>
        </div>
      </div>

      {/* Visual Tree Component */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Layers size={16} className="text-blue-600" />
            <span>แผนผังต้นไม้โฟลเดอร์ Google Drive ({driveFolders.length} โฟลเดอร์)</span>
          </h3>

          <span className="text-[11px] text-slate-500">
            ระบบจะเลือกโฟลเดอร์ปลายทางให้อัตโนมัติตามฝ่ายและปีการศึกษาที่เลือก
          </span>
        </div>

        {renderTree(null)}
      </div>

      {/* Add Custom Folder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">เพิ่มโฟลเดอร์ใน Google Drive</h3>
            <p className="text-xs text-slate-500 mb-4">
              สร้างโฟลเดอร์ย่อยหรือจับคู่ Mapping Google Drive Folder ID
            </p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">ชื่อโฟลเดอร์</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ผลงานระดับนานาชาติ หรือ ภาพงานมอบรางวัล..."
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Google Drive Folder Link / ID (วางลิงก์หรือ Folder ID)
                </label>
                <input
                  type="text"
                  placeholder="วางลิงก์ https://drive.google.com/... หรือ Folder ID (เว้นว่างเพื่อให้ระบบสุ่ม)"
                  value={newDriveId}
                  onChange={e => setNewDriveId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  บันทึกโฟลเดอร์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
