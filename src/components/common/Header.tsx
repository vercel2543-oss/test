import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  LayoutDashboard,
  LogOut,
  Calendar,
  BarChart3,
  Flame,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { DEPARTMENTS } from '../../lib/constants';

export const Header: React.FC = () => {
  const { settings, activeView, setActiveView, filters, setFilters } = useAwards();
  const { currentUser, isSuperAdmin, logout, loginAsDemoUser } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navItems = [
    { id: 'public_home', label: 'หน้าแรก', icon: Sparkles },
    { id: 'public_gallery', label: 'ผลงานทั้งหมด', icon: Trophy },
    { id: 'public_hall_of_fame', label: 'Hall of Fame', icon: Flame, highlight: true },
    { id: 'public_timeline', label: 'ตามปีการศึกษา', icon: Calendar },
    { id: 'public_stats', label: 'สถิติและภาพรวม', icon: BarChart3 }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    if (activeView !== 'public_gallery' && activeView !== 'public_home') {
      setActiveView('public_gallery');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with School Name & Demo Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium text-slate-200">{settings.schoolNameTh}</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">ปีการศึกษาปัจจุบัน {settings.currentAcademicYear}</span>
        </div>

        {/* User Role Switcher & Status */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-xs transition-colors border border-slate-700"
            >
              <UserCheck size={13} className="text-amber-400" />
              <span>
                {currentUser
                  ? isSuperAdmin
                    ? '👑 Super Admin'
                    : `ฝ่าย${DEPARTMENTS.find(d => d.id === currentUser.department)?.nameTh || 'Admin'}`
                  : 'โหมดบุคคลทั่วไป'}
              </span>
              <ChevronDown size={12} />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-1 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="text-[11px] font-semibold text-slate-500 uppercase px-2 py-1 border-b border-slate-100">
                  สลับบทบาททดสอบ (Quick Switch)
                </div>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      loginAsDemoUser('super_admin', 'all');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                  >
                    <span className="font-medium">👑 Super Admin</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">ทุกฝ่าย</span>
                  </button>

                  {DEPARTMENTS.map(dept => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        loginAsDemoUser('department_admin', dept.id);
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>{dept.nameTh}</span>
                      <span className="text-[10px] text-slate-500">{dept.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentUser && (
            <button
              onClick={logout}
              title="ออกจากระบบ"
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 text-xs"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">ออก</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setActiveView('public_home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Trophy size={22} className="text-yellow-300" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>คลังผลงานและรางวัล</span>
                <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  5 ฝ่าย
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                {settings.schoolNameEn}
              </p>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="ค้นหาชื่อรางวัล, ผู้ได้รับ, ฝ่าย, ปี..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : item.highlight
                      ? 'text-amber-700 bg-amber-50/70 hover:bg-amber-100/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} className={item.highlight ? 'text-amber-500' : ''} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin System Switch Button */}
          <div className="flex items-center gap-2">
            {activeView.startsWith('admin') ? (
              <button
                onClick={() => setActiveView('public_home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <span>🌐 ดูหน้าเว็บหลัก</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('admin_dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-sm transition-all hover:shadow"
              >
                <LayoutDashboard size={15} />
                <span>ระบบจัดการ (Admin)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-100 gap-2 scrollbar-none">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              activeView === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
