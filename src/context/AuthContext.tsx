import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, DepartmentType } from '../types';
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  currentRole: UserRole;
  currentDepartment: DepartmentType | 'all';
  loginAsDemoUser: (role: UserRole, department?: DepartmentType | 'all', name?: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  canManageDepartment: (dept: DepartmentType) => boolean;
}

const DEFAULT_SUPER_ADMIN: UserProfile = {
  id: 'usr_super_admin',
  email: 'superadmin@school.ac.th',
  displayName: 'ผอ.ดร.วิชาญ พัฒนศึกษา (Super Admin)',
  role: 'super_admin',
  department: 'all',
  status: 'active',
  lastLogin: new Date().toISOString(),
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('school_award_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SUPER_ADMIN;
      }
    }
    return DEFAULT_SUPER_ADMIN;
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (auth && typeof onAuthStateChanged === 'function') {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setFirebaseUser(user);
          if (user) {
            // Determine role: vercel2543 or email matching
            const isRootAdmin = user.email === 'vercel2543@gmail.com' || user.email?.includes('admin');
            const profile: UserProfile = {
              id: user.uid,
              email: user.email || 'user@school.ac.th',
              displayName: user.displayName || user.email?.split('@')[0] || 'Admin User',
              role: isRootAdmin ? 'super_admin' : 'department_admin',
              department: isRootAdmin ? 'all' : 'academic',
              status: 'active',
              lastLogin: new Date().toISOString(),
              avatarUrl: user.photoURL || undefined
            };
            setCurrentUser(profile);
            localStorage.setItem('school_award_current_user', JSON.stringify(profile));
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const loginAsDemoUser = (role: UserRole, department: DepartmentType | 'all' = 'academic', customName?: string) => {
    let name = customName;
    if (!name) {
      if (role === 'super_admin') {
        name = 'ผอ.ดร.วิชาญ พัฒนศึกษา (Super Admin)';
      } else {
        const deptNames: Record<DepartmentType, string> = {
          academic: 'ครูดาวใจ สอนดี (ฝ่ายวิชาการ)',
          affairs: 'ครูพงษ์ศักดิ์ รักษ์ศิลป์ (ฝ่ายกิจการ)',
          general: 'นายอนุชา บริหารดี (ฝ่ายทั่วไป)',
          personnel: 'นางสุภาภรณ์ ทรัพย์เจริญ (ฝ่ายบุคคล)',
          budget: 'นางนภาพร การเงินมั่นคง (ฝ่ายงบประมาณ)'
        };
        name = deptNames[department as DepartmentType] || 'Department Admin';
      }
    }

    const demoUser: UserProfile = {
      id: `usr_${role}_${department}`,
      email: `${department === 'all' ? 'superadmin' : department}@school.ac.th`,
      displayName: name,
      role,
      department,
      status: 'active',
      lastLogin: new Date().toISOString()
    };

    setCurrentUser(demoUser);
    localStorage.setItem('school_award_current_user', JSON.stringify(demoUser));
  };

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setFirebaseUser(user);
      }
    } catch (err) {
      console.error('Google Sign In failed:', err);
    }
  };

  const logout = async () => {
    await signOutUser();
    setCurrentUser(null);
    localStorage.removeItem('school_award_current_user');
  };

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.department === 'all';

  const canManageDepartment = (dept: DepartmentType): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    return currentUser.role === 'department_admin' && currentUser.department === dept;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isSuperAdmin,
        currentRole: currentUser?.role || 'department_admin',
        currentDepartment: currentUser?.department || 'academic',
        loginAsDemoUser,
        loginWithGoogle,
        logout,
        canManageDepartment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
