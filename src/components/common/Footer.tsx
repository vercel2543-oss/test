import React from 'react';
import { useAwards } from '../../context/AwardContext';
import { Trophy, HardDrive, ShieldCheck, Mail, Phone, ExternalLink, Heart } from 'lucide-react';
import { DEPARTMENTS } from '../../lib/constants';

export const Footer: React.FC = () => {
  const { settings, setActiveView, setFilters } = useAwards();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Trophy size={18} className="text-yellow-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{settings.schoolNameTh}</h4>
                <p className="text-[11px] text-slate-400">School Achievement & Award Gallery</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {settings.schoolMotto || 'คลังเก็บรวบรวมและประชาสัมพันธ์เกียรติประวัติ รางวัล และผลงานแห่งความภาคภูมิใจ'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
              <HardDrive size={14} />
              <span>ระบบจัดเก็บไฟล์ถาวรบน Google Drive</span>
            </div>
          </div>

          {/* Col 2: 5 Departments */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">คลังผลงาน 5 ฝ่าย</h4>
            <ul className="space-y-2">
              {DEPARTMENTS.map(dept => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, department: dept.id }));
                      setActiveView('public_gallery');
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-xs text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span>{dept.nameTh} ({dept.code})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">เมนูลัด</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('public_home')} className="hover:text-white transition-colors">
                  หน้าแรก Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public_hall_of_fame')} className="hover:text-amber-400 transition-colors">
                  🏆 Hall of Fame (นานาชาติ/ระดับชาติ)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public_timeline')} className="hover:text-white transition-colors">
                  📅 Timeline ผลงานตามปีการศึกษา
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('public_stats')} className="hover:text-white transition-colors">
                  📊 สถิติและบทวิเคราะห์รางวัล
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin_dashboard')} className="hover:text-blue-400 transition-colors">
                  🔒 เข้าสู่ระบบผู้ดูแล (Admin Portal)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white mb-3">ติดต่อสถานศึกษา</h4>
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400" />
              <span>{settings.contactEmail}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              <span>{settings.contactPhone}</span>
            </p>
            <div className="flex items-center gap-2 pt-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded border border-blue-500/30 transition-colors"
                >
                  Facebook
                </a>
              )}
              {settings.lineUrl && (
                <a
                  href={settings.lineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded border border-emerald-500/30 transition-colors"
                >
                  LINE Official
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.schoolNameTh}. ระบบคลังผลงานและเกียรติบัตรดิจิทัล All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck size={13} className="text-emerald-400" /> Google Drive & Firestore Connected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
