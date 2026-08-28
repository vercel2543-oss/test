import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { DEPARTMENTS, AWARD_LEVELS } from '../../lib/constants';
import { DepartmentType } from '../../types';
import { Printer, Download, Filter, FileText, Building, Trophy, Calendar } from 'lucide-react';
import { AwardBadge } from '../common/AwardBadge';
import { DepartmentPill } from '../common/DepartmentPill';

export const ReportsAndPrint: React.FC = () => {
  const { awards, settings, academicYears } = useAwards();

  const [selectedYear, setSelectedYear] = useState<string>(settings.currentAcademicYear);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredAwards = awards.filter(a => {
    if (a.deleted || a.status !== 'published') return false;
    if (selectedYear !== 'all' && a.academicYear !== selectedYear) return false;
    if (selectedDept !== 'all' && a.department !== selectedDept) return false;
    if (selectedLevel !== 'all' && a.level !== selectedLevel) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['ลำดับ', 'ชื่อรางวัล / การแข่งขัน', 'ผู้ได้รับรางวัล', 'ประเภท', 'ฝ่าย', 'ระดับรางวัล', 'ปีการศึกษา', 'วันที่', 'หน่วยงานผู้มอบ'],
      ...filteredAwards.map((a, i) => [
        i + 1,
        `"${a.awardName.replace(/"/g, '""')}"`,
        `"${a.recipientName.replace(/"/g, '""')}"`,
        a.recipientType,
        a.department,
        a.level,
        a.academicYear,
        a.awardDate,
        `"${a.organization.replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `School_Awards_Report_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Non-printable Controls Banner */}
      <div className="print:hidden bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">ออกรายงานสรุปผลงานและรางวัล (SAR / กศน.)</h2>
            <p className="text-xs text-slate-500">
              จัดทำเอกสารรายงานทางการพร้อมพิมพ์ลงกระดาษ A4 หรือส่งออก CSV
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Download size={14} />
              <span>ส่งออก Excel / CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Printer size={15} />
              <span>สั่งพิมพ์รายงาน (A4)</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ปีการศึกษา</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="all">ทุกปีการศึกษา</option>
              {academicYears.map(y => (
                <option key={y.year} value={y.year}>
                  ปีการศึกษา {y.year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ฝ่ายที่รับผิดชอบ</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="all">ทุกฝ่าย (5 ฝ่าย)</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.nameTh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">ระดับรางวัล</label>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="all">ทุกระดับรางวัล</option>
              {AWARD_LEVELS.map(l => (
                <option key={l.id} value={l.id}>
                  {l.nameTh}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Printable Report Document */}
      <div
        id="printable-report-area"
        className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0"
      >
        {/* Official Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold mx-auto">
            <Trophy size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            {settings.schoolNameTh}
          </h2>
          <h3 className="text-base font-extrabold text-slate-800">
            รายงานสรุปผลงาน รางวัล และเกียรติบัตรเพื่อการประกันคุณภาพการศึกษา
          </h3>
          <p className="text-xs text-slate-600">
            {selectedYear === 'all' ? 'ข้อมูลรวมทุกปีการศึกษา' : `ประจำปีการศึกษา ${selectedYear}`} • ข้อมูล ณ วันที่{' '}
            {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Summary Mini Stats in Print */}
        <div className="grid grid-cols-3 gap-4 my-6 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">ผลงานทั้งหมดในรายงาน</span>
            <span className="text-xl font-bold text-slate-900">{filteredAwards.length} รายการ</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">ระดับนานาชาติ & ชาติ</span>
            <span className="text-xl font-bold text-amber-600">
              {filteredAwards.filter(a => a.level === 'international' || a.level === 'national').length} รายการ
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">สังกัดฝ่าย</span>
            <span className="text-xl font-bold text-blue-600">
              {selectedDept === 'all' ? '5 ฝ่ายงาน' : DEPARTMENTS.find(d => d.id === selectedDept)?.nameTh}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">ลำดับ</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ชื่อผลงาน / รายการแข่งขัน</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ผู้ได้รับรางวัล</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ฝ่าย</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ระดับ</th>
                <th className="py-2.5 px-3 border-r border-slate-300">ปี</th>
                <th className="py-2.5 px-3">หน่วยงานผู้มอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAwards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    ไม่พบผลงานตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredAwards.map((a, i) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border-r border-slate-300 text-center text-slate-500 font-mono">
                      {i + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 font-bold text-slate-900">
                      {a.awardName}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 text-slate-800 font-semibold">
                      {a.recipientName}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300">
                      <DepartmentPill department={a.department} size="sm" />
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300">
                      <AwardBadge level={a.level} size="xs" />
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 text-center font-mono">
                      {a.academicYear}
                    </td>
                    <td className="py-2 px-3 text-slate-600 truncate max-w-[160px]">
                      {a.organization}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signatures section for formal reports */}
        <div className="hidden print:grid grid-cols-2 gap-12 mt-16 pt-8 text-center text-xs">
          <div className="space-y-8">
            <p>ลงชื่อ.............................................................. ผู้จัดทำรายงาน</p>
            <p>( .............................................................. )</p>
            <p>ตำแหน่ง..............................................................</p>
          </div>
          <div className="space-y-8">
            <p>ลงชื่อ.............................................................. ผู้อำนวยการสถานศึกษา</p>
            <p>( .............................................................. )</p>
            <p>ผู้อำนวยการ{settings.schoolNameTh}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
