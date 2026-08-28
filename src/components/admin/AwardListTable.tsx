import React, { useState } from 'react';
import { Award, DepartmentType, AwardLevelType, AwardStatusType } from '../../types';
import { useAwards } from '../../context/AwardContext';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, AWARD_LEVELS } from '../../lib/constants';
import { AwardBadge } from '../common/AwardBadge';
import { DepartmentPill } from '../common/DepartmentPill';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  Eye,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';

interface AwardListTableProps {
  onAddNew: () => void;
  onEdit: (award: Award) => void;
  onOpenDetail: (award: Award) => void;
}

export const AwardListTable: React.FC<AwardListTableProps> = ({
  onAddNew,
  onEdit,
  onOpenDetail
}) => {
  const { awards, academicYears, softDeleteAward, approveAward, toggleFeatured, addAward } = useAwards();
  const { isSuperAdmin, currentDepartment } = useAuth();

  // Local Table Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>(
    isSuperAdmin ? 'all' : (currentDepartment as string)
  );
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter awards (non-deleted)
  const nonDeletedAwards = awards.filter(a => !a.deleted);

  const filtered = nonDeletedAwards.filter(a => {
    const matchSearch =
      a.awardName.toLowerCase().includes(search.toLowerCase()) ||
      a.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      (a.organization && a.organization.toLowerCase().includes(search.toLowerCase()));

    const matchDept = deptFilter === 'all' || a.department === deptFilter;
    const matchLevel = levelFilter === 'all' || a.level === levelFilter;
    const matchYear = yearFilter === 'all' || a.academicYear === yearFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;

    // RBAC constraint
    const hasDeptAccess = isSuperAdmin || a.department === currentDepartment;

    return matchSearch && matchDept && matchLevel && matchYear && matchStatus && hasDeptAccess;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  // Duplicate an award
  const handleDuplicate = async (award: Award) => {
    const { id, createdAt, updatedAt, views, deleted, ...rest } = award;
    await addAward({
      ...rest,
      awardName: `(คัดลอก) ${award.awardName}`,
      status: 'draft'
    });
  };

  // Export filtered to CSV
  const handleExportCSV = () => {
    const rows = [
      ['ID', 'ชื่อรางวัล', 'ผู้ได้รับ', 'ประเภท', 'ฝ่าย', 'ระดับ', 'ปีการศึกษา', 'วันที่', 'หน่วยงาน', 'สถานะ'],
      ...filtered.map(a => [
        a.id,
        `"${a.awardName.replace(/"/g, '""')}"`,
        `"${a.recipientName.replace(/"/g, '""')}"`,
        a.recipientType,
        a.department,
        a.level,
        a.academicYear,
        a.awardDate,
        `"${a.organization.replace(/"/g, '""')}"`,
        a.status
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Awards_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">จัดการข้อมูลผลงานและเกียรติบัตร</h2>
          <p className="text-xs text-slate-500">
            แสดง {filtered.length} จากทั้งหมด {nonDeletedAwards.length} รายการ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <Download size={14} />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>เพิ่มผลงานใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อรางวัล, ผู้ได้รับ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Department Filter */}
        <select
          value={deptFilter}
          disabled={!isSuperAdmin && currentDepartment !== 'all'}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">🏢 ทุกฝ่าย (5 ฝ่าย)</option>
          {DEPARTMENTS.map(d => (
            <option key={d.id} value={d.id}>
              {d.nameTh}
            </option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">🏆 ทุกระดับรางวัล</option>
          {AWARD_LEVELS.map(l => (
            <option key={l.id} value={l.id}>
              {l.nameTh}
            </option>
          ))}
        </select>

        {/* Academic Year Filter */}
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">📅 ทุกปีการศึกษา</option>
          {academicYears.map(y => (
            <option key={y.year} value={y.year}>
              ปีการศึกษา {y.year}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">📌 ทุกสถานะ</option>
          <option value="published">เผยแพร่แล้ว</option>
          <option value="pending">รออนุมัติ</option>
          <option value="draft">ฉบับร่าง</option>
        </select>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3.5 px-4 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare size={16} className="text-blue-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 min-w-[240px]">ชื่อผลงาน / รางวัล</th>
                <th className="py-3.5 px-4 min-w-[150px]">ผู้ได้รับรางวัล</th>
                <th className="py-3.5 px-4">ฝ่าย</th>
                <th className="py-3.5 px-4">ระดับ</th>
                <th className="py-3.5 px-4">ปี</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    ไม่พบข้อมูลผลงานตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filtered.map(award => {
                  const isSelected = selectedIds.includes(award.id);
                  return (
                    <tr
                      key={award.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <button onClick={() => toggleSelect(award.id)} className="text-slate-400 hover:text-slate-600">
                          {isSelected ? (
                            <CheckSquare size={16} className="text-blue-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Award Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={award.coverImage || award.certificate?.thumbnailUrl || 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=100&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div
                              onClick={() => onOpenDetail(award)}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                            >
                              {award.awardName}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">
                              {award.organization || 'สถานศึกษา'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{award.recipientName}</span>
                        <span className="block text-[10px] text-slate-400">{award.recipientType}</span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <DepartmentPill department={award.department} size="sm" />
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4">
                        <AwardBadge level={award.level} size="xs" />
                      </td>

                      {/* Academic Year */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{award.academicYear}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {award.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            เผยแพร่แล้ว
                          </span>
                        ) : award.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            รออนุมัติ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            ฉบับร่าง
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {award.status === 'pending' && isSuperAdmin && (
                            <button
                              onClick={() => approveAward(award.id)}
                              title="อนุมัติและเผยแพร่"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}

                          <button
                            onClick={() => toggleFeatured(award.id)}
                            title={award.featured ? 'ยกเลิกผลงานเด่น' : 'ตั้งเป็นผลงานเด่น'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              award.featured
                                ? 'text-amber-500 hover:bg-amber-50'
                                : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                            }`}
                          >
                            <Sparkles size={15} className={award.featured ? 'fill-amber-400' : ''} />
                          </button>

                          <button
                            onClick={() => handleDuplicate(award)}
                            title="คัดลอกผลงาน"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Copy size={15} />
                          </button>

                          <button
                            onClick={() => onEdit(award)}
                            title="แก้ไข"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            onClick={() => softDeleteAward(award.id)}
                            title="ย้ายไปถังขยะ"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
