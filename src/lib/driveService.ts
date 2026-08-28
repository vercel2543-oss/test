import { DriveFolder, DepartmentType } from '../types';
import { DEPARTMENTS } from './constants';

export class DriveService {
  /**
   * Generates the standard full Google Drive folder tree
   * Structure: Root -> 5 Departments -> Years (e.g. 2569, 2568) -> (เกียรติบัตร, ภาพประกอบ)
   */
  static generateDefaultFolderStructure(
    rootName: string = '📁 ผลงานและรางวัลโรงเรียน',
    years: string[] = ['2569', '2568', '2567']
  ): DriveFolder[] {
    const folders: DriveFolder[] = [];
    const rootId = `root_${Date.now()}`;

    // 1. Root Folder
    folders.push({
      id: rootId,
      name: rootName,
      type: 'root',
      department: 'all',
      parentFolderId: null,
      googleDriveFolderId: `1Root_${Math.random().toString(36).substring(2, 10)}`,
      googleDriveUrl: `https://drive.google.com/drive/folders/1Root_School_Achievements`,
      status: 'connected',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subfolderCount: DEPARTMENTS.length
    });

    // 2. 5 Department Folders
    DEPARTMENTS.forEach((dept) => {
      const deptFolderId = `dept_${dept.id}`;
      folders.push({
        id: deptFolderId,
        name: `📁 ${dept.code}`,
        type: 'department',
        department: dept.id,
        parentFolderId: rootId,
        googleDriveFolderId: `1Dept_${dept.id}_${Math.random().toString(36).substring(2, 8)}`,
        googleDriveUrl: `https://drive.google.com/drive/folders/1Dept_${dept.id}`,
        status: 'connected',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subfolderCount: years.length
      });

      // 3. Year Folders per Department
      years.forEach((yr) => {
        const yearFolderId = `year_${dept.id}_${yr}`;
        folders.push({
          id: yearFolderId,
          name: `📁 ${yr}`,
          type: 'year',
          department: dept.id,
          academicYear: yr,
          parentFolderId: deptFolderId,
          googleDriveFolderId: `1Year_${dept.id}_${yr}_${Math.random().toString(36).substring(2, 8)}`,
          googleDriveUrl: `https://drive.google.com/drive/folders/1Year_${dept.id}_${yr}`,
          status: 'connected',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subfolderCount: 2
        });

        // 4. Category Folders (เกียรติบัตร and ภาพประกอบ)
        folders.push({
          id: `cat_${dept.id}_${yr}_cert`,
          name: '📁 เกียรติบัตร',
          type: 'category',
          department: dept.id,
          academicYear: yr,
          folderCategory: 'certificate',
          parentFolderId: yearFolderId,
          googleDriveFolderId: `1Cert_${dept.id}_${yr}_${Math.random().toString(36).substring(2, 8)}`,
          googleDriveUrl: `https://drive.google.com/drive/folders/1Cert_${dept.id}_${yr}`,
          status: 'connected',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subfolderCount: 0
        });

        folders.push({
          id: `cat_${dept.id}_${yr}_img`,
          name: '📁 ภาพประกอบ',
          type: 'category',
          department: dept.id,
          academicYear: yr,
          folderCategory: 'images',
          parentFolderId: yearFolderId,
          googleDriveFolderId: `1Img_${dept.id}_${yr}_${Math.random().toString(36).substring(2, 8)}`,
          googleDriveUrl: `https://drive.google.com/drive/folders/1Img_${dept.id}_${yr}`,
          status: 'connected',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subfolderCount: 0
        });
      });
    });

    return folders;
  }

  /**
   * Find or resolve target Google Drive folder for an upload
   */
  static resolveUploadPath(
    folders: DriveFolder[],
    department: DepartmentType,
    academicYear: string,
    category: 'certificate' | 'images'
  ): { folder: DriveFolder | undefined; pathString: string } {
    const deptInfo = DEPARTMENTS.find(d => d.id === department);
    const categoryName = category === 'certificate' ? 'เกียรติบัตร' : 'ภาพประกอบ';
    const pathString = `📁 ผลงานและรางวัลโรงเรียน / ${deptInfo?.code || department} / ${academicYear} / ${categoryName}`;

    const folder = folders.find(
      f =>
        f.department === department &&
        f.academicYear === academicYear &&
        f.folderCategory === category
    );

    return { folder, pathString };
  }

  /**
   * Simulates/executes file upload to Google Drive with realistic IDs
   */
  static async uploadFileToDrive(
    file: File | Blob,
    fileName: string,
    folderId?: string
  ): Promise<{ fileId: string; url: string; thumbnailUrl: string; mimeType: string; fileSize: number }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const fileId = `drive_file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        resolve({
          fileId,
          url: dataUrl,
          thumbnailUrl: dataUrl,
          mimeType: file.type || 'image/jpeg',
          fileSize: file.size || 1024000
        });
      };
      reader.readAsDataURL(file);
    });
  }
}
