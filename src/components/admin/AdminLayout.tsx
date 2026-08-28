import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAwards } from '../../context/AwardContext';
import {
  LayoutDashboard,
  Trophy,
  HardDrive,
  Calendar,
  Users,
  FileBarChart,
  Trash2,
  History,
  Settings,
  LogOut,
  ArrowLeft,
  Shield,
  Plus
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AwardListTable } from './AwardListTable';
import { DriveFolderManager } from './DriveFolderManager';
import { AcademicYearManager } from './AcademicYearManager';
import { UserManagement } from './UserManagement';
import { ReportsAndPrint } from './ReportsAndPrint';
import { TrashBin } from './TrashBin';
import { ActivityLogViewer } from './ActivityLogViewer';
import { SystemSettings } from './SystemSettings';
import { AwardFormModal } from './AwardFormModal';
import { Award } from '../../types';

interface AdminLayoutProps {
  onOpenDetail: (award: Award) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onOpenDetail }) => {
  const { currentUser, isSuperAdmin, logout } = useAuth();
  const { setActiveView, awards } = useAwards();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  const pendingCount = awards.filter(a => !a.deleted && a.status === 'pending').length;
  const trashCount = awards.filter(a => a.deleted).length;

  const handleEditAward = (award: Award) => {
    setEditingAward(award);
    setShowAddModal(true);
  };

  const navItems = [
    { id: 'dashboard', label: 'ภาพรวมระบบ', icon: LayoutDashboard },
    {
      id: 'awards',
      label: 'จัดการผลงานและเกียรติบัตร',
      icon: Trophy,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: 'drive', label: 'โครงสร้าง Google Drive', icon: HardDrive },
    { id: 'years', label: 'จัดการปีการศึกษา', icon: Calendar },
    { id: 'reports', label: 'รายงานสรุปและพิมพ์ (SAR)', icon: FileBarChart },
    ...(isSuperAdmin
      ? [
          { id: 'users', label: 'จัดการสิทธิ์ 5 ฝ่าย', icon: Users },
          { id: 'logs', label: 'ประวัติการทำงาน (Logs)', icon: History },
          { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
          { id: 'trash', label: 'ถังขยะ', icon: Trash2, badge: trashCount > 0 ? trashCount : undefined }
        ]
      : [])
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 sm:p-5 flex flex-col shrink-0">
        {/* Top school crest & exit */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Shield size={18} />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-wider">ระบบจัดการคลังผลงาน</h1>
              <p className="text-[10px] text-slate-400">Admin Control Center</p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('home')}
            title="กลับสู่หน้าเว็บสาธารณะ"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* User Card */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-bold flex items-center justify-center shrink-0">
            {currentUser?.displayName.charAt(0)}
          </div>
          <div className="truncate flex-1">
            <p className="text-xs font-bold text-white truncate">{currentUser?.displayName}</p>
            <p className="text-[10px] text-amber-400 font-semibold truncate">
              {currentUser?.role === 'super_admin' ? 'Super Admin' : `ฝ่าย${currentUser?.department}`}
            </p>
          </div>
        </div>

        {/* Quick Add Award button */}
        <button
          onClick={() => {
            setEditingAward(null);
            setShowAddModal(true);
          }}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={15} />
          <span>เพิ่มผลงาน (AI OCR)</span>
        </button>

        {/* Nav Items List */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-900' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={() => {
              logout();
              setActiveView('home');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut size={15} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onAddNewAward={() => {
                setEditingAward(null);
                setShowAddModal(true);
              }}
              onNavigateTab={tab => setActiveTab(tab)}
              onOpenDetail={onOpenDetail}
            />
          )}

          {activeTab === 'awards' && (
            <AwardListTable
              onAddNew={() => {
                setEditingAward(null);
                setShowAddModal(true);
              }}
              onEdit={handleEditAward}
              onOpenDetail={onOpenDetail}
            />
          )}

          {activeTab === 'drive' && <DriveFolderManager />}
          {activeTab === 'years' && <AcademicYearManager />}
          {activeTab === 'reports' && <ReportsAndPrint />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'logs' && <ActivityLogViewer />}
          {activeTab === 'settings' && <SystemSettings />}
          {activeTab === 'trash' && <TrashBin />}
        </div>
      </main>

      {/* Add / Edit Award Modal */}
      {showAddModal && (
        <AwardFormModal
          initialAward={editingAward}
          onClose={() => {
            setShowAddModal(false);
            setEditingAward(null);
          }}
          onSaved={() => {
            setShowAddModal(false);
            setEditingAward(null);
          }}
        />
      )}
    </div>
  );
};
