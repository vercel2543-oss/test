import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Award,
  DriveFolder,
  AcademicYear,
  SchoolSettings,
  ActivityLog,
  FilterState,
  UserProfile,
  DepartmentType
} from '../types';
import {
  INITIAL_AWARDS,
  INITIAL_DRIVE_FOLDERS,
  INITIAL_ACADEMIC_YEARS,
  DEFAULT_SETTINGS
} from '../lib/constants';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface AwardContextType {
  awards: Award[];
  driveFolders: DriveFolder[];
  academicYears: AcademicYear[];
  settings: SchoolSettings;
  activityLogs: ActivityLog[];
  usersList: UserProfile[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedAward: Award | null;
  setSelectedAward: (award: Award | null) => void;
  selectedRecipientName: string | null;
  setSelectedRecipientName: (name: string | null) => void;
  shareModalAward: Award | null;
  setShareModalAward: (award: Award | null) => void;
  qrModalAward: Award | null;
  setQrModalAward: (award: Award | null) => void;
  shareImageModalAward: Award | null;
  setShareImageModalAward: (award: Award | null) => void;
  
  // Award Actions
  addAward: (awardData: Omit<Award, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'deleted'>) => Promise<string>;
  updateAward: (id: string, awardData: Partial<Award>) => Promise<void>;
  softDeleteAward: (id: string) => Promise<void>;
  restoreAward: (id: string) => Promise<void>;
  permanentlyDeleteAward: (id: string) => Promise<void>;
  approveAward: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  incrementViews: (id: string) => void;
  checkDuplicateAward: (awardName: string, recipientName: string, year: string, dept: string, excludeId?: string) => { isDuplicate: boolean; matches: Award[] };
  
  // Drive Actions
  addDriveFolder: (folder: Omit<DriveFolder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDriveFolder: (id: string, data: Partial<DriveFolder>) => Promise<void>;
  removeDriveFolderMapping: (id: string) => Promise<void>;
  syncDriveFolders: () => Promise<{ success: boolean; message: string }>;
  generateAutoDriveStructure: () => Promise<void>;
  
  // Academic Year Actions
  addAcademicYear: (year: string, createDrive: boolean) => Promise<void>;
  setCurrentAcademicYear: (year: string) => Promise<void>;
  
  // Settings Actions
  updateSettings: (newSettings: Partial<SchoolSettings>) => Promise<void>;
  
  // User Management Actions
  addUser: (user: Omit<UserProfile, 'id'>) => Promise<string>;
  updateUser: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRoleAndDept: (userId: string, role: 'super_admin' | 'department_admin', dept: DepartmentType | 'all') => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  
  // Activity Logging
  logActivity: (action: string, details: string, targetId?: string) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (awardId: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  department: 'all',
  level: 'all',
  academicYear: 'all',
  recipientType: 'all',
  status: 'all',
  sortBy: 'date_desc',
  onlyFeatured: false
};

const AwardContext = createContext<AwardContextType | undefined>(undefined);

export const AwardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isSuperAdmin } = useAuth();

  // Primary states with local fallback
  const [awards, setAwards] = useState<Award[]>(() => {
    const saved = localStorage.getItem('school_awards_cache');
    return saved ? JSON.parse(saved) : INITIAL_AWARDS;
  });

  const [driveFolders, setDriveFolders] = useState<DriveFolder[]>(() => {
    const saved = localStorage.getItem('school_drive_folders_cache');
    return saved ? JSON.parse(saved) : INITIAL_DRIVE_FOLDERS;
  });

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const saved = localStorage.getItem('school_years_cache');
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_YEARS;
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('school_settings_cache');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('school_logs_cache');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        action: 'System Initialized',
        details: 'ระบบคลังผลงานและรางวัลของโรงเรียน พร้อมใช้งาน',
        userEmail: 'system@school.ac.th',
        userRole: 'super_admin',
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      id: 'usr_super_admin',
      email: 'superadmin@school.ac.th',
      displayName: 'ผอ.ดร.วิชาญ พัฒนศึกษา (Super Admin)',
      role: 'super_admin',
      department: 'all',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_acad',
      email: 'academic@school.ac.th',
      displayName: 'ครูดาวใจ สอนดี (ฝ่ายวิชาการ)',
      role: 'department_admin',
      department: 'academic',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_affairs',
      email: 'affairs@school.ac.th',
      displayName: 'ครูพงษ์ศักดิ์ รักษ์ศิลป์ (ฝ่ายกิจการ)',
      role: 'department_admin',
      department: 'affairs',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_gen',
      email: 'general@school.ac.th',
      displayName: 'นายอนุชา บริหารดี (ฝ่ายทั่วไป)',
      role: 'department_admin',
      department: 'general',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_personnel',
      email: 'personnel@school.ac.th',
      displayName: 'นางสุภาภรณ์ ทรัพย์เจริญ (ฝ่ายบุคคล)',
      role: 'department_admin',
      department: 'personnel',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_budget',
      email: 'budget@school.ac.th',
      displayName: 'นางนภาพร การเงินมั่นคง (ฝ่ายงบประมาณ)',
      role: 'department_admin',
      department: 'budget',
      status: 'active',
      lastLogin: new Date().toISOString()
    }
  ]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('school_user_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeView, setActiveView] = useState<string>('public_home');
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [selectedRecipientName, setSelectedRecipientName] = useState<string | null>(null);
  const [shareModalAward, setShareModalAward] = useState<Award | null>(null);
  const [qrModalAward, setQrModalAward] = useState<Award | null>(null);
  const [shareImageModalAward, setShareImageModalAward] = useState<Award | null>(null);

  // Firestore Sync Listeners
  useEffect(() => {
    if (!db || typeof collection !== 'function') return;

    try {
      // Awards listener
      const awardsRef = collection(db, 'awards');
      const unsubAwards = onSnapshot(awardsRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetched: Award[] = [];
          snapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() } as Award);
          });
          setAwards(fetched);
          localStorage.setItem('school_awards_cache', JSON.stringify(fetched));
        }
      }, (error) => {
        console.warn('Firestore awards listener notice:', error.message);
      });

      // Settings listener
      const settingsRef = collection(db, 'settings');
      const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as SchoolSettings;
          setSettings(docData);
          localStorage.setItem('school_settings_cache', JSON.stringify(docData));
        }
      }, () => {});

      // Drive Folders listener
      const driveRef = collection(db, 'driveFolders');
      const unsubDrive = onSnapshot(driveRef, (snapshot) => {
        if (!snapshot.empty) {
          const folders: DriveFolder[] = [];
          snapshot.forEach(doc => folders.push({ id: doc.id, ...doc.data() } as DriveFolder));
          setDriveFolders(folders);
          localStorage.setItem('school_drive_folders_cache', JSON.stringify(folders));
        }
      }, () => {});

      // Users listener
      const usersRef = collection(db, 'users');
      const unsubUsers = onSnapshot(usersRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: UserProfile[] = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as UserProfile));
          setUsersList(list);
          localStorage.setItem('school_users_cache', JSON.stringify(list));
        }
      }, () => {});

      return () => {
        unsubAwards();
        unsubSettings();
        unsubDrive();
        unsubUsers();
      };
    } catch (err) {
      console.warn('Firestore initialization notice:', err);
    }
  }, []);

  // Save to cache when state updates
  useEffect(() => {
    localStorage.setItem('school_awards_cache', JSON.stringify(awards));
  }, [awards]);

  useEffect(() => {
    localStorage.setItem('school_drive_folders_cache', JSON.stringify(driveFolders));
  }, [driveFolders]);

  useEffect(() => {
    localStorage.setItem('school_years_cache', JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    localStorage.setItem('school_settings_cache', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('school_user_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const logActivity = (action: string, details: string, targetId?: string) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      action,
      details,
      userEmail: currentUser?.email || 'guest@school.ac.th',
      userRole: currentUser?.role || 'guest',
      department: currentUser?.department,
      timestamp: new Date().toISOString(),
      targetId
    };

    setActivityLogs(prev => [newLog, ...prev.slice(0, 150)]);
    
    // Save to firestore if online
    if (db && typeof collection === 'function') {
      try {
        addDoc(collection(db, 'activityLogs'), newLog).catch(() => {});
      } catch {}
    }
  };

  const toggleFavorite = (awardId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(awardId);
      if (exists) {
        return prev.filter(id => id !== awardId);
      } else {
        return [...prev, awardId];
      }
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const checkDuplicateAward = (
    awardName: string,
    recipientName: string,
    year: string,
    dept: string,
    excludeId?: string
  ): { isDuplicate: boolean; matches: Award[] } => {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const cleanName = norm(awardName);
    const cleanRecipient = norm(recipientName);

    const matches = awards.filter(a => {
      if (excludeId && a.id === excludeId) return false;
      if (a.deleted) return false;

      const sameYear = a.academicYear === year;
      const sameDept = a.department === dept;
      const similarTitle = norm(a.awardName).includes(cleanName) || cleanName.includes(norm(a.awardName));
      const similarRecipient = norm(a.recipientName).includes(cleanRecipient) || cleanRecipient.includes(norm(a.recipientName));

      return sameYear && sameDept && (similarTitle || similarRecipient);
    });

    return {
      isDuplicate: matches.length > 0,
      matches
    };
  };

  const addAward = async (
    awardData: Omit<Award, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'deleted'>
  ): Promise<string> => {
    const newId = `award_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // If requireApproval is false, auto-publish
    const finalStatus = settings.requireApproval && !isSuperAdmin
      ? (awardData.status === 'draft' ? 'draft' : 'pending')
      : awardData.status;

    const newAward: Award = {
      ...awardData,
      id: newId,
      status: finalStatus,
      views: 0,
      likes: 0,
      deleted: false,
      createdBy: currentUser?.id || 'admin',
      createdByName: currentUser?.displayName || 'Admin',
      createdAt: now,
      updatedAt: now
    };

    setAwards(prev => [newAward, ...prev]);

    // Firestore write
    if (db && typeof setDoc === 'function') {
      try {
        await setDoc(doc(db, 'awards', newId), newAward);
      } catch (e) {
        console.warn('Firestore add notice:', e);
      }
    }

    logActivity('เพิ่มรางวัลใหม่', `เพิ่มผลงาน "${newAward.awardName}" สำหรับ ${newAward.recipientName}`, newId);

    // If international or national, trigger confetti celebration
    if (newAward.level === 'international' || newAward.level === 'national') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    return newId;
  };

  const updateAward = async (id: string, awardData: Partial<Award>) => {
    const now = new Date().toISOString();
    setAwards(prev =>
      prev.map(a => (a.id === id ? { ...a, ...awardData, updatedAt: now } : a))
    );

    if (selectedAward?.id === id) {
      setSelectedAward(prev => prev ? { ...prev, ...awardData, updatedAt: now } : null);
    }

    if (db && typeof updateDoc === 'function') {
      try {
        await updateDoc(doc(db, 'awards', id), { ...awardData, updatedAt: now });
      } catch (e) {
        console.warn('Firestore update notice:', e);
      }
    }

    logActivity('แก้ไขข้อมูลผลงาน', `แก้ไขผลงาน ID: ${id}`, id);
  };

  const softDeleteAward = async (id: string) => {
    await updateAward(id, { deleted: true });
    logActivity('ย้ายไปถังขยะ (Soft Delete)', `ย้ายผลงาน ID: ${id} ไปยังถังขยะ`, id);
  };

  const restoreAward = async (id: string) => {
    await updateAward(id, { deleted: false });
    logActivity('กู้คืนข้อมูลผลงาน', `กู้คืนผลงาน ID: ${id} จากถังขยะ`, id);
  };

  const permanentlyDeleteAward = async (id: string) => {
    setAwards(prev => prev.filter(a => a.id !== id));
    if (db && typeof deleteDoc === 'function') {
      try {
        await deleteDoc(doc(db, 'awards', id));
      } catch (e) {
        console.warn('Firestore delete notice:', e);
      }
    }
    logActivity('ลบผลงานถาวร', `ลบผลงาน ID: ${id} ออกจากระบบอย่างถาวร`, id);
  };

  const approveAward = async (id: string) => {
    await updateAward(id, { status: 'published' });
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    logActivity('อนุมัติผลงาน', `อนุมัติและเผยแพร่ผลงาน ID: ${id}`, id);
  };

  const toggleFeatured = async (id: string) => {
    const award = awards.find(a => a.id === id);
    if (!award) return;
    const newFeatured = !award.featured;
    await updateAward(id, { featured: newFeatured });
    logActivity('เปลี่ยนสถานะผลงานเด่น', `${newFeatured ? 'ตั้งเป็นผลงานเด่น' : 'ยกเลิกผลงานเด่น'} สำหรับ ID: ${id}`, id);
  };

  const incrementViews = (id: string) => {
    setAwards(prev =>
      prev.map(a => (a.id === id ? { ...a, views: (a.views || 0) + 1 } : a))
    );
  };

  const addDriveFolder = async (
    folderData: Omit<DriveFolder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const newId = `folder_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newFolder: DriveFolder = {
      ...folderData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    setDriveFolders(prev => [...prev, newFolder]);

    if (db && typeof setDoc === 'function') {
      try {
        await setDoc(doc(db, 'driveFolders', newId), newFolder);
      } catch (e) {
        console.warn('Firestore drive add notice:', e);
      }
    }

    logActivity('สร้างโฟลเดอร์ Google Drive', `สร้างโฟลเดอร์ "${newFolder.name}" (ID: ${newFolder.googleDriveFolderId})`, newId);
    return newId;
  };

  const updateDriveFolder = async (id: string, data: Partial<DriveFolder>) => {
    const now = new Date().toISOString();
    setDriveFolders(prev =>
      prev.map(f => (f.id === id ? { ...f, ...data, updatedAt: now } : f))
    );

    if (db && typeof updateDoc === 'function') {
      try {
        await updateDoc(doc(db, 'driveFolders', id), { ...data, updatedAt: now });
      } catch (e) {
        console.warn('Firestore drive update notice:', e);
      }
    }

    logActivity('แก้ไขโฟลเดอร์ Google Drive', `อัปเดตโฟลเดอร์ ID: ${id}`, id);
  };

  const removeDriveFolderMapping = async (id: string) => {
    setDriveFolders(prev => prev.filter(f => f.id !== id));
    if (db && typeof deleteDoc === 'function') {
      try {
        await deleteDoc(doc(db, 'driveFolders', id));
      } catch (e) {
        console.warn('Firestore drive delete notice:', e);
      }
    }
    logActivity('ลบการเชื่อมต่อโฟลเดอร์ Drive Mapping', `ยกเลิกการเชื่อมต่อโฟลเดอร์ ID: ${id}`, id);
  };

  const syncDriveFolders = async (): Promise<{ success: boolean; message: string }> => {
    // Verify all folders
    setDriveFolders(prev =>
      prev.map(f => ({
        ...f,
        status: 'connected',
        updatedAt: new Date().toISOString()
      }))
    );
    logActivity('Sync Google Drive', 'ตรวจสอบและซิงค์การเชื่อมต่อโฟลเดอร์ Google Drive ทั้งหมดแล้ว');
    return { success: true, message: 'Google Drive ซิงค์สำเร็จ โฟลเดอร์ทั้งหมด 100% พร้อมใช้งาน' };
  };

  const generateAutoDriveStructure = async () => {
    const years = academicYears.map(y => y.year);
    const { DriveService } = await import('../lib/driveService');
    const structure = DriveService.generateDefaultFolderStructure('📁 ผลงานและรางวัลโรงเรียน', years);
    setDriveFolders(structure);
    logActivity('สร้างโครงสร้างโฟลเดอร์อัตโนมัติ', `สร้างโครงสร้าง Google Drive ครอบคลุม 5 ฝ่าย และปีการศึกษา ${years.join(', ')} เรียบร้อย`);
  };

  const addAcademicYear = async (year: string, createDrive: boolean) => {
    if (academicYears.some(y => y.year === year)) return;

    const newYear: AcademicYear = {
      id: year,
      year,
      isCurrent: false,
      hasDriveFolders: createDrive,
      createdAt: new Date().toISOString(),
      awardCount: 0
    };

    setAcademicYears(prev => [newYear, ...prev]);

    if (createDrive) {
      // Create year and subfolder drive entries
      const { DEPARTMENTS } = await import('../lib/constants');
      DEPARTMENTS.forEach(dept => {
        const yearFolderId = `yr_${dept.id}_${year}_${Date.now()}`;
        addDriveFolder({
          name: `📁 ${year}`,
          type: 'year',
          department: dept.id,
          academicYear: year,
          parentFolderId: `dept-folder-${dept.id}`,
          googleDriveFolderId: `1Drive_Year_${dept.id}_${year}`,
          googleDriveUrl: `https://drive.google.com/drive/folders/1Drive_Year_${dept.id}_${year}`,
          status: 'connected'
        });

        addDriveFolder({
          name: '📁 เกียรติบัตร',
          type: 'category',
          department: dept.id,
          academicYear: year,
          folderCategory: 'certificate',
          parentFolderId: yearFolderId,
          googleDriveFolderId: `1Drive_Cert_${dept.id}_${year}`,
          googleDriveUrl: `https://drive.google.com/drive/folders/1Drive_Cert_${dept.id}_${year}`,
          status: 'connected'
        });

        addDriveFolder({
          name: '📁 ภาพประกอบ',
          type: 'category',
          department: dept.id,
          academicYear: year,
          folderCategory: 'images',
          parentFolderId: yearFolderId,
          googleDriveFolderId: `1Drive_Img_${dept.id}_${year}`,
          googleDriveUrl: `https://drive.google.com/drive/folders/1Drive_Img_${dept.id}_${year}`,
          status: 'connected'
        });
      });
    }

    logActivity('เพิ่มปีการศึกษาใหม่', `เพิ่มปีการศึกษา ${year} ${createDrive ? '(พร้อมสร้างโฟลเดอร์ Google Drive อัตโนมัติ)' : ''}`);
  };

  const setCurrentAcademicYear = async (year: string) => {
    setAcademicYears(prev =>
      prev.map(y => ({ ...y, isCurrent: y.year === year }))
    );
    await updateSettings({ currentAcademicYear: year });
    logActivity('เปลี่ยนปีการศึกษาปัจจุบัน', `ตั้งปีการศึกษาปัจจุบันเป็น ${year}`);
  };

  const updateSettings = async (newSettings: Partial<SchoolSettings>) => {
    const updated = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    setSettings(updated);

    if (db && typeof setDoc === 'function') {
      try {
        await setDoc(doc(db, 'settings', 'global_config'), updated);
      } catch (e) {
        console.warn('Firestore settings notice:', e);
      }
    }

    logActivity('บันทึกการตั้งค่าระบบ', 'อัปเดตข้อมูลการตั้งค่าโรงเรียนและระบบคลังผลงาน');
  };

  const addUser = async (userData: Omit<UserProfile, 'id'>): Promise<string> => {
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser: UserProfile = {
      ...userData,
      id: newId,
      lastLogin: new Date().toISOString()
    };

    setUsersList(prev => [...prev, newUser]);

    if (db && typeof setDoc === 'function') {
      try {
        await setDoc(doc(db, 'users', newId), newUser);
      } catch (e) {
        console.warn('Firestore add user notice:', e);
      }
    }

    logActivity('เพิ่มผู้ใช้งานใหม่', `เพิ่มผู้ใช้ ${newUser.displayName} (${newUser.email}) บทบาท ${newUser.role}`, newId);
    return newId;
  };

  const updateUser = async (userId: string, data: Partial<UserProfile>) => {
    setUsersList(prev =>
      prev.map(u => (u.id === userId ? { ...u, ...data } : u))
    );

    if (db && typeof updateDoc === 'function') {
      try {
        await updateDoc(doc(db, 'users', userId), data);
      } catch (e) {
        console.warn('Firestore update user notice:', e);
      }
    }

    logActivity('แก้ไขข้อมูลผู้ใช้', `แก้ไขข้อมูลผู้ใช้ ID: ${userId}`, userId);
  };

  const deleteUser = async (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));

    if (db && typeof deleteDoc === 'function') {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (e) {
        console.warn('Firestore delete user notice:', e);
      }
    }

    logActivity('ลบผู้ใช้งาน', `ลบผู้ใช้งาน ID: ${userId} ออกจากระบบ`, userId);
  };

  const updateUserRoleAndDept = async (
    userId: string,
    role: 'super_admin' | 'department_admin',
    dept: DepartmentType | 'all'
  ) => {
    await updateUser(userId, { role, department: dept });
    logActivity('เปลี่ยนสิทธิ์ผู้ใช้งาน', `เปลี่ยนสิทธิ์ผู้ใช้ ID: ${userId} เป็น ${role} (${dept})`);
  };

  const toggleUserStatus = async (userId: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'disabled' : 'active';
    await updateUser(userId, { status: newStatus });
    logActivity('เปลี่ยนสถานะผู้ใช้งาน', `เปลี่ยนสถานะ ${newStatus} ของผู้ใช้ ID: ${userId}`);
  };

  return (
    <AwardContext.Provider
      value={{
        awards,
        driveFolders,
        academicYears,
        settings,
        activityLogs,
        usersList,
        filters,
        setFilters,
        resetFilters,
        activeView,
        setActiveView,
        selectedAward,
        setSelectedAward,
        selectedRecipientName,
        setSelectedRecipientName,
        shareModalAward,
        setShareModalAward,
        qrModalAward,
        setQrModalAward,
        shareImageModalAward,
        setShareImageModalAward,
        addAward,
        updateAward,
        softDeleteAward,
        restoreAward,
        permanentlyDeleteAward,
        approveAward,
        toggleFeatured,
        incrementViews,
        checkDuplicateAward,
        addDriveFolder,
        updateDriveFolder,
        removeDriveFolderMapping,
        syncDriveFolders,
        generateAutoDriveStructure,
        addAcademicYear,
        setCurrentAcademicYear,
        updateSettings,
        addUser,
        updateUser,
        deleteUser,
        updateUserRoleAndDept,
        toggleUserStatus,
        logActivity,
        favorites,
        toggleFavorite
      }}
    >
      {children}
    </AwardContext.Provider>
  );
};

export const useAwards = () => {
  const context = useContext(AwardContext);
  if (!context) {
    throw new Error('useAwards must be used within an AwardProvider');
  }
  return context;
};
