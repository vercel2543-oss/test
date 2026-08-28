// Global TypeScript definitions for School Achievement & Award Management System

export type DepartmentType = 'academic' | 'affairs' | 'general' | 'personnel' | 'budget';

export type AwardLevelType = 'international' | 'national' | 'regional' | 'provincial' | 'area' | 'school';

export type AwardStatusType = 'draft' | 'pending' | 'approved' | 'published' | 'archived';

export type RecipientType = 'student' | 'teacher' | 'staff' | 'team' | 'school';

export type UserRole = 'super_admin' | 'department_admin';

export interface CertificateFile {
  fileId: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  fileSize?: number;
  drivePath?: string;
}

export interface ActivityImage {
  id: string;
  fileId: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  order: number;
  caption?: string;
}

export interface Award {
  id: string;
  awardName: string;
  recipientName: string;
  recipientType: RecipientType;
  recipientId?: string; // e.g. student/teacher ID
  department: DepartmentType;
  level: AwardLevelType;
  academicYear: string; // e.g. "2569", "2568"
  awardDate: string; // YYYY-MM-DD
  organization: string; // e.g. "กระทรวงศึกษาธิการ", "สพฐ."
  description: string;
  certificate?: CertificateFile;
  images: ActivityImage[];
  coverImage: string;
  status: AwardStatusType;
  featured: boolean;
  views: number;
  likes?: number;
  deleted: boolean;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  googleDriveFolderId?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  type: 'root' | 'department' | 'year' | 'category' | 'custom' | 'award';
  department?: DepartmentType | 'all';
  academicYear?: string;
  folderCategory?: 'certificate' | 'images' | 'general';
  parentFolderId: string | null;
  googleDriveFolderId: string;
  googleDriveUrl: string;
  status: 'connected' | 'warning' | 'error';
  createdAt: string;
  updatedAt: string;
  subfolderCount?: number;
}

export interface AcademicYear {
  id: string;
  year: string; // e.g. "2569"
  isCurrent: boolean;
  hasDriveFolders: boolean;
  createdAt: string;
  awardCount?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: DepartmentType | 'all';
  status: 'active' | 'disabled';
  lastLogin?: string;
  avatarUrl?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  userEmail: string;
  userRole: string;
  department?: string;
  timestamp: string;
  targetId?: string;
}

export interface SchoolSettings {
  schoolNameTh: string;
  schoolNameEn: string;
  schoolLogo: string;
  schoolMotto?: string;
  requireApproval: boolean;
  allowPublicDownload: boolean;
  currentAcademicYear: string;
  driveRootFolderId: string;
  driveRootFolderName: string;
  driveRootFolderUrl: string;
  folderStructureType: 'dept_year_type' | 'dept_type_year' | 'per_award';
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  lineUrl: string;
  websiteUrl: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  department: DepartmentType | 'all';
  level: AwardLevelType | 'all';
  academicYear: string | 'all';
  recipientType: RecipientType | 'all';
  status: AwardStatusType | 'all';
  sortBy: 'date_desc' | 'date_asc' | 'views_desc' | 'level_rank' | 'name_asc';
  onlyFeatured: boolean;
}
