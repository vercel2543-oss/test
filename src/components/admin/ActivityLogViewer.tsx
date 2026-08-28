import React, { useState } from 'react';
import { useAwards } from '../../context/AwardContext';
import { ActivityLog } from '../../types';
import { History, Shield, User, Clock, Filter } from 'lucide-react';
import { DepartmentPill } from '../common/DepartmentPill';

export const ActivityLogViewer: React.FC = () => {
  const { activityLogs } = useAwards();
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = filterAction === 'all'
    ? activityLogs
    : activityLogs.filter(log => log.action.toLowerCase().includes(filterAction.toLowerCase()));

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE') || action.includes('ADD')) {
      return <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[11px]">สร้าง / เพิ่ม</span>;
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[11px]">แก้ไขข้อมูล</span>;
    }
    if (action.includes('APPROVE')) {
      return <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded text-[11px]">อนุมัติผลงาน</span>;
    }
    if (action.includes('DELETE') || action.includes('TRASH')) {
      return <span className="bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded text-[11px]">ลบ / ถังขยะ</span>;
    }
    return <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">{action}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <History size={16} />
            <span>Audit Trail & Activity Logs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">ประวัติการปฏิบัติงานในระบบ</h2>
          <p className="text-xs text-slate-500">
            บันทึกประวัติการเพิ่ม แก้ไข อนุมัติ และลบข้อมูลผลงานทั้งหมดเพื่อความโปร่งใส
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">ทุกกิจกรรม</option>
            <option value="CREATE">สร้าง / เพิ่มผลงาน</option>
            <option value="UPDATE">แก้ไขข้อมูล</option>
            <option value="APPROVE">อนุมัติผลงาน</option>
            <option value="DELETE">ลบ / ถังขยะ</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3.5 px-5">วันเวลา</th>
                <th className="py-3.5 px-5">ผู้ดำเนินการ</th>
                <th className="py-3.5 px-5">กิจกรรม</th>
                <th className="py-3.5 px-5">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {new Date(log.timestamp).toLocaleString('th-TH')}
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {log.userName.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{log.userName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">{getActionBadge(log.action)}</td>

                  <td className="py-3.5 px-5 text-slate-700 font-medium">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
