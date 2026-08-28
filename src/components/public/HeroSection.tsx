import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { DEPARTMENTS } from '../../lib/constants';
import { Trophy, Search, Flame, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { DepartmentPill } from '../common/DepartmentPill';
import heroBgImage from '../../assets/school_hero_bg.jpg';

export const HeroSection: React.FC = () => {
  const { awards, settings, filters, setFilters, setActiveView } = useAwards();

  // Calculate statistics
  const publishedAwards = awards.filter(a => a.status === 'published' && !a.deleted);
  const totalCount = publishedAwards.length;
  const topTierCount = publishedAwards.filter(a => a.level === 'international' || a.level === 'national').length;
  const featuredCount = publishedAwards.filter(a => a.featured).length;

  return (
    <div className="relative overflow-hidden text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background Image with optimized dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      />
      {/* Gradient & Backdrop overlays for high contrast and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/90 to-indigo-950/95 backdrop-blur-[2px]" />
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-300 backdrop-blur-md shadow-sm">
          <Trophy size={14} className="text-yellow-400" />
          <span className="font-medium">Digital Achievement & Award Gallery</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">5 ฝ่ายบริหารงาน</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          ผลงาน เกียรติบัตร และรางวัล <br />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            แห่งความภาคภูมิใจของโรงเรียน
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          ศูนย์รวบรวมเกียรติประวัติ รางวัล และผลงานสร้างชื่อเสียงของนักเรียน ครู และบุคลากร
          พร้อมระบบจัดเก็บไฟล์ Google Drive และสร้างภาพประชาสัมพันธ์ทันใจ
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-white/10 p-1.5 border border-white/20 backdrop-blur-xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
            <Search size={20} className="text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="ค้นหาชื่อรางวัล, ผู้ได้รับรางวัล, หน่วยงาน, หรือปีการศึกษา..."
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
              }}
              className="w-full px-3 py-2 text-sm bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                ล้าง
              </button>
            )}
            <button
              onClick={() => setActiveView('public_gallery')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0"
            >
              ค้นหา
            </button>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="pt-2">
          <p className="text-xs text-slate-400 mb-2.5 font-medium flex items-center justify-center gap-1.5">
            <Filter size={13} />
            <span>เลือกดูผลงานตามฝ่าย:</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <DepartmentPill
              department="all"
              selected={filters.department === 'all'}
              onClick={() => setFilters(prev => ({ ...prev, department: 'all' }))}
              showCount={totalCount}
            />
            {DEPARTMENTS.map(dept => {
              const count = publishedAwards.filter(a => a.department === dept.id).length;
              return (
                <DepartmentPill
                  key={dept.id}
                  department={dept.id}
                  selected={filters.department === dept.id}
                  onClick={() => setFilters(prev => ({ ...prev, department: dept.id }))}
                  showCount={count}
                />
              );
            })}
          </div>
        </div>

        {/* Quick Highlights / Stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white tracking-tight">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ผลงานทั้งหมด</div>
          </div>

          <div
            onClick={() => setActiveView('public_hall_of_fame')}
            className="bg-amber-950/40 border border-amber-500/30 hover:border-amber-400 rounded-xl p-3 backdrop-blur-sm cursor-pointer transition-all hover:bg-amber-950/60 group"
          >
            <div className="text-2xl font-bold text-amber-300 tracking-tight flex items-center justify-center gap-1">
              <span>{topTierCount}</span>
              <Flame size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">นานาชาติ / ชาติ</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400 tracking-tight">5</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ฝ่ายบริหารงาน</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{settings.currentAcademicYear}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ปีการศึกษาปัจจุบัน</div>
          </div>
        </div>
      </div>
    </div>
  );
};
