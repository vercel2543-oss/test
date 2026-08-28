import React, { useState, useMemo } from 'react';
import { useAwards } from '../../context/AwardContext';
import { Award, DepartmentType, AwardLevelType, RecipientType } from '../../types';
import { AwardCard } from './AwardCard';
import { DEPARTMENTS, AWARD_LEVELS } from '../../lib/constants';
import {
  Search,
  Filter,
  Trophy,
  Calendar,
  Sparkles,
  Heart,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Grid,
  Users
} from 'lucide-react';

interface PublicGalleryProps {
  onOpenDetail: (award: Award) => void;
  onOpenShare: (award: Award) => void;
  onOpenQR: (award: Award) => void;
  onOpenShareImage: (award: Award) => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({
  onOpenDetail,
  onOpenShare,
  onOpenQR,
  onOpenShareImage
}) => {
  const {
    awards,
    filters,
    setFilters,
    resetFilters,
    academicYears,
    favorites
  } = useAwards();

  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Safe search query & filters extraction
  const searchQuery = filters?.searchQuery || '';
  const selectedDepartment = filters?.department || 'all';
  const selectedLevel = filters?.level || 'all';
  const selectedYear = filters?.academicYear || 'all';
  const recipientTypeFilter = filters?.recipientType || 'all';
  const onlyFeatured = !!filters?.onlyFeatured;
  const sortBy = filters?.sortBy || 'date_desc';

  // Filtered Awards
  const filteredAwards = useMemo(() => {
    return awards.filter(award => {
      if (award.deleted || award.status !== 'published') return false;

      // Search Query
      const q = (searchQuery || '').trim().toLowerCase();
      if (q) {
        const matchName = (award.awardName || '').toLowerCase().includes(q);
        const matchRecipient = (award.recipientName || '').toLowerCase().includes(q);
        const matchOrg = (award.organization || '').toLowerCase().includes(q);
        const matchDesc = (award.description || '').toLowerCase().includes(q);
        if (!matchName && !matchRecipient && !matchOrg && !matchDesc) return false;
      }

      // Department Filter
      if (selectedDepartment !== 'all' && award.department !== selectedDepartment) {
        return false;
      }

      // Level Filter
      if (selectedLevel !== 'all' && award.level !== selectedLevel) {
        return false;
      }

      // Year Filter
      if (selectedYear !== 'all' && award.academicYear !== selectedYear) {
        return false;
      }

      // Recipient Type
      if (recipientTypeFilter !== 'all' && award.recipientType !== recipientTypeFilter) {
        return false;
      }

      // Featured only
      if (onlyFeatured && !award.featured) {
        return false;
      }

      // Favorites only
      if (onlyFavorites && !favorites.includes(award.id)) {
        return false;
      }

      return true;
    });
  }, [
    awards,
    searchQuery,
    selectedDepartment,
    selectedLevel,
    selectedYear,
    recipientTypeFilter,
    onlyFeatured,
    onlyFavorites,
    favorites
  ]);

  // Sorted Awards
  const sortedAwards = useMemo(() => {
    const list = [...filteredAwards];
    const levelOrder: Record<string, number> = {
      international: 1,
      national: 2,
      regional: 3,
      provincial: 4,
      area: 5,
      school: 6
    };

    return list.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.awardDate).getTime() - new Date(a.awardDate).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.awardDate).getTime() - new Date(b.awardDate).getTime();
      }
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'level_rank') {
        return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
      }
      return 0;
    });
  }, [filteredAwards, sortBy]);

  const handleResetFilters = () => {
    resetFilters();
    setOnlyFavorites(false);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedDepartment !== 'all' ||
    selectedLevel !== 'all' ||
    selectedYear !== 'all' ||
    recipientTypeFilter !== 'all' ||
    onlyFeatured ||
    onlyFavorites;

  return (
    <div className="space-y-6 py-4">
      {/* Search and Main Filters Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        {/* Search input + mobile toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อรางวัล, ผู้ได้รับ, ผลงาน, หรือหน่วยงานมอบ..."
              value={searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="sm:hidden p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* 5 Department quick pills row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilters(prev => ({ ...prev, department: 'all' }))}
            className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
              selectedDepartment === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏢 ทุกฝ่ายงาน
          </button>
          {DEPARTMENTS.map(dept => {
            const isSelected = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setFilters(prev => ({ ...prev, department: dept.id }))}
                className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={{
                  backgroundColor: isSelected ? dept.color : undefined
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : dept.color }}
                />
                <span>{dept.nameTh}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Dropdowns */}
        <div className={`grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs ${showFiltersMobile ? 'block' : 'hidden sm:grid'}`}>
          {/* Award Level */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ระดับรางวัล</label>
            <select
              value={selectedLevel}
              onChange={e => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="all">🏆 ทุกระดับรางวัล</option>
              {AWARD_LEVELS.map(l => (
                <option key={l.id} value={l.id}>
                  {l.nameTh}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ปีการศึกษา</label>
            <select
              value={selectedYear}
              onChange={e => setFilters(prev => ({ ...prev, academicYear: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="all">📅 ทุกปีการศึกษา</option>
              {academicYears.map(y => (
                <option key={y.year} value={y.year}>
                  ปีการศึกษา {y.year}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ประเภทผู้รับผลงาน</label>
            <select
              value={recipientTypeFilter}
              onChange={e => setFilters(prev => ({ ...prev, recipientType: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="all">👥 ทุกประเภท</option>
              <option value="student">นักเรียน (รายบุคคล)</option>
              <option value="team">ทีมนักเรียน / กลุ่ม</option>
              <option value="teacher">ครูและบุคลากร</option>
              <option value="school">สถานศึกษา</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">การเรียงลำดับ</label>
            <select
              value={sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="date_desc">🕒 ล่าสุด - เก่าสุด</option>
              <option value="date_asc">🕒 เก่าสุด - ล่าสุด</option>
              <option value="views">🔥 ยอดเข้าชมสูงสุด</option>
              <option value="level_rank">⭐ ลำดับเกียรติยศสูงสุด</option>
            </select>
          </div>
        </div>

        {/* Quick Toggles: Featured, Favorites & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilters(prev => ({ ...prev, onlyFeatured: !prev.onlyFeatured }))}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                onlyFeatured
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles size={13} className={onlyFeatured ? 'text-amber-600' : 'text-slate-400'} />
              <span>⭐ เฉพาะผลงานเด่น</span>
            </button>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                onlyFavorites
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart size={13} className={onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
              <span>รายการโปรด ({favorites.length})</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <X size={13} />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500">
          พบผลงานทั้งหมด <strong className="text-slate-900">{sortedAwards.length}</strong> รายการ
        </span>
      </div>

      {/* Awards Cards Grid */}
      {sortedAwards.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Trophy size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">ไม่พบผลงานตามเงื่อนไขการค้นหา</h3>
            <p className="text-xs text-slate-500">ลองเปลี่ยนคำค้นหา หรือปรับตัวกรองฝ่ายและปีการศึกษา</p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAwards.map(award => (
            <AwardCard
              key={award.id}
              award={award}
              onOpenDetail={onOpenDetail}
              onOpenShare={onOpenShare}
              onOpenQR={onOpenQR}
              onOpenShareImage={onOpenShareImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};
