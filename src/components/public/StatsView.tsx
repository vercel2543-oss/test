import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { DEPARTMENTS, AWARD_LEVELS } from '../../lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Trophy, Award as AwardIcon } from 'lucide-react';

export const StatsView: React.FC = () => {
  const { awards, academicYears } = useAwards();

  const publishedAwards = awards.filter(a => !a.deleted && a.status === 'published');
  const totalCount = publishedAwards.length;

  // 1. Department Breakdown Data
  const deptData = DEPARTMENTS.map(dept => {
    const count = publishedAwards.filter(a => a.department === dept.id).length;
    return {
      name: dept.nameTh.replace('ฝ่าย', ''),
      fullName: dept.nameTh,
      count,
      color: dept.color
    };
  });

  // 2. Award Level Breakdown Data
  const levelData = AWARD_LEVELS.map(level => {
    const count = publishedAwards.filter(a => a.level === level.id).length;
    const colors: Record<string, string> = {
      international: '#8b5cf6',
      national: '#f59e0b',
      regional: '#0ea5e9',
      provincial: '#10b981',
      area: '#6366f1',
      school: '#64748b'
    };
    return {
      name: level.nameTh,
      value: count,
      color: colors[level.id] || '#64748b'
    };
  }).filter(d => d.value > 0);

  // 3. Year over Year Trend Data
  const sortedYears = [...academicYears].sort((a, b) => a.year.localeCompare(b.year));
  const trendData = sortedYears.map(yr => {
    const yrAwards = publishedAwards.filter(a => a.academicYear === yr.year);
    const topTier = yrAwards.filter(a => a.level === 'international' || a.level === 'national').length;
    return {
      year: `ปี ${yr.year}`,
      total: yrAwards.length,
      topTier: topTier
    };
  });

  // 4. Recipient Type Data
  const studentAwards = publishedAwards.filter(a => a.recipientType === 'student' || a.recipientType === 'team').length;
  const teacherAwards = publishedAwards.filter(a => a.recipientType === 'teacher' || a.recipientType === 'staff').length;
  const schoolAwards = publishedAwards.filter(a => a.recipientType === 'school').length;

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <BarChart3 size={14} />
            <span>ระบบสถิติและการวิเคราะห์เชิงภาพ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ภาพรวมและสถิติผลงานรางวัล 5 ฝ่าย
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light">
            สรุปข้อมูลสถิติเชิงลึกเพื่อการประกันคุณภาพสถานศึกษาและการวางแผนพัฒนาศักยภาพผู้เรียน
          </p>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">ผลงานทั้งหมดในระบบ</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">พร้อมไฟล์เกียรติบัตร</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">ระดับนานาชาติ & ชาติ</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">
            {publishedAwards.filter(a => a.level === 'international' || a.level === 'national').length}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Hall of Fame</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">ผลงานนักเรียนและเยาวชน</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">{studentAwards}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">ผู้เรียนเป็นสำคัญ</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">ผลงานครูและบุคลากร</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-1">{teacherAwards}</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">วิทยฐานะ & คุรุสภา</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              <span>จำนวนผลงานจำแนกตามฝ่าย (5 ฝ่าย)</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  formatter={(val) => [`${val} รางวัล`, 'จำนวนผลงาน']}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Award Level Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PieIcon size={18} className="text-amber-600" />
              <span>สัดส่วนผลงานตามระดับรางวัล (Award Levels)</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  formatter={(val) => [`${val} รางวัล`, 'จำนวน']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Annual Trends Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              <span>แนวโน้มการได้รับรางวัลสะสมเปรียบเทียบตามปีการศึกษา</span>
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="total" name="ผลงานรวมทั้งหมด" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="topTier" name="ระดับนานาชาติ/ระดับชาติ" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTop)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
