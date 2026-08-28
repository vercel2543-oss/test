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
  ShieldCheck
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

  // Add folder modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [parentFolderId, setParentFolderId] = useState<string>('root-folder-0');
  const [newFolderName, setNewFolderName] = useState('');
  const [newDriveId, setNewDriveId] = useState('');

  const [isDriveAuth, setIsDriveAuth] = useState(googleDriveClient.isConnected());
  const [authLoading, setAuthLoading] = useState(false);

  const handleConnectGoogleDrive = async () => {
    try {
      setAuthLoading(true);
      await googleDriveClient.authorize();
      setIsDriveAuth(googleDriveClient.isConnected());
      setSyncMessage('เชื่อมต่อ Google Drive API สำเร็จ พร้อมอัปโหลดไฟล์จริง');
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err: any) {
      alert(`การเชื่อมต่อ Google Drive ไม่สำเร็จ: ${err.message || err}`);
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
    if (confirm('คุณต้องการสร้างโครงสร้างโฟลเดอร์ Google Drive อัตโนมัติสำหรับ 5 ฝ่ายและปีการศึกษาทั้งหมดใช่หรือไม่?')) {
      await generateAutoDriveStructure();
      alert('สร้างโครงสร้างโฟลเดอร์ Google Drive สำเร็จ');
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;

    const parent = driveFolders.find(f => f.id === parentFolderId);
    const driveId = newDriveId || `1Drive_${Math.random().toString(36).substring(2, 10)}`;

    await addDriveFolder({
      name: newFolderName.startsWith('📁') ? newFolderName : `📁 ${newFolderName}`,
      type: 'custom',
      department: parent?.department,
      parentFolderId,
      googleDriveFolderId: driveId,
      googleDriveUrl: `https://drive.google.com/drive/folders/${driveId}`,
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
                  <CheckCircle2 size={11} className="text-emerald-500" /> Synced
                </span>
              );
            }
            if (folder.status === 'warning') {
              return (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={11} className="text-amber-500" /> Mapping Only
                </span>
              );
            }
            return (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                <XCircle size={11} className="text-rose-500" /> Disconnected
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

                  <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[120px]">
                    ID: {folder.googleDriveFolderId}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge()}

                  <a
                    href={folder.googleDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="เปิดใน Google Drive"
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                  >
                    <ExternalLink size={14} />
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
              <span>{authLoading ? 'กำลังขอสิทธิ์...' : 'เชื่อมต่อ Google Drive'}</span>
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

      {syncMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

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
                  Google Drive Folder ID (ระบุเพื่อเชื่อมโยงกับโฟลเดอร์ที่มีอยู่จริง)
                </label>
                <input
                  type="text"
                  placeholder="เช่น 1A2b3C4d5E... (เว้นว่างเพื่อให้ระบบสุ่มสร้าง)"
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
