import React from 'react';
import { DepartmentType } from '../../types';
import { DEPARTMENTS } from '../../lib/constants';

interface DepartmentPillProps {
  department: DepartmentType | 'all';
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: number;
}

export const DepartmentPill: React.FC<DepartmentPillProps> = ({
  department,
  onClick,
  selected = false,
  size = 'md',
  showCount
}) => {
  if (department === 'all') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3.5 py-1.5 text-xs'
        } ${
          selected
            ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
        }`}
      >
        <span>🏢 ทุกฝ่าย (5 ฝ่าย)</span>
        {typeof showCount === 'number' && (
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${selected ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {showCount}
          </span>
        )}
      </button>
    );
  }

  const dept = DEPARTMENTS.find(d => d.id === department);
  if (!dept) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3.5 py-1.5 text-xs'
      } ${
        selected
          ? 'text-white shadow-sm ring-2'
          : `${dept.bgColor} hover:opacity-90 border`
      }`}
      style={{
        backgroundColor: selected ? dept.color : undefined,
        borderColor: selected ? dept.color : undefined
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selected ? '#ffffff' : dept.color }} />
      <span>{dept.nameTh}</span>
      {typeof showCount === 'number' && (
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px]"
          style={{
            backgroundColor: selected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)'
          }}
        >
          {showCount}
        </span>
      )}
    </button>
  );
};
