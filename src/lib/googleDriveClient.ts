// Google Drive Client-Side OAuth & REST API Integration
// Uses Google Identity Services (GSI) initTokenClient + Drive v3 API

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

export interface GoogleDriveFileResult {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink?: string;
  mimeType: string;
  size?: string;
}

export interface GoogleDriveFolderResult {
  id: string;
  name: string;
  webViewLink: string;
}

class GoogleDriveManager {
  private tokenClient: any = null;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private clientId: string = '';

  constructor() {
    // Read from localStorage if available
    const savedToken = localStorage.getItem('gdrive_access_token');
    const savedExpires = localStorage.getItem('gdrive_token_expires');
    if (savedToken && savedExpires && Number(savedExpires) > Date.now()) {
      this.accessToken = savedToken;
      this.tokenExpiresAt = Number(savedExpires);
    }
  }

  public setClientId(clientId: string) {
    this.clientId = clientId;
  }

  public isConnected(): boolean {
    return !!this.accessToken && this.tokenExpiresAt > Date.now();
  }

  public getAccessToken(): string | null {
    if (this.isConnected()) {
      return this.accessToken;
    }
    return null;
  }

  public disconnect() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    localStorage.removeItem('gdrive_access_token');
    localStorage.removeItem('gdrive_token_expires');
    if (this.accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {});
    }
  }

  /**
   * Request user OAuth Access Token for Google Drive API
   */
  public async authorize(): Promise<string> {
    return new Promise((resolve, reject) => {
      // If already connected with valid token
      if (this.isConnected()) {
        return resolve(this.accessToken!);
      }

      // Check if GSI is loaded
      if (!window.google?.accounts?.oauth2) {
        // Dynamically load Google Identity Services script if missing
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.initAndRequestToken(resolve, reject);
        };
        script.onerror = () => {
          reject(new Error('ไม่สามารถโหลด Google Identity Services ได้'));
        };
        document.body.appendChild(script);
      } else {
        this.initAndRequestToken(resolve, reject);
      }
    });
  }

  private initAndRequestToken(resolve: (token: string) => void, reject: (err: any) => void) {
    try {
      // Try to get client ID from config or parameter
      const clientId = this.clientId || '736654092449-hbr8op5aia0uknt6d426oo8s6lq6ekjj.apps.googleusercontent.com';

      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: (resp: any) => {
          if (resp.error) {
            reject(new Error(resp.error_description || resp.error));
            return;
          }
          if (resp.access_token) {
            this.accessToken = resp.access_token;
            // expires_in in seconds (usually 3599)
            const expiresInMs = (resp.expires_in ? Number(resp.expires_in) : 3600) * 1000;
            this.tokenExpiresAt = Date.now() + expiresInMs;
            localStorage.setItem('gdrive_access_token', resp.access_token);
            localStorage.setItem('gdrive_token_expires', String(this.tokenExpiresAt));
            resolve(resp.access_token);
          } else {
            reject(new Error('ไม่ได้รับ Access Token จาก Google'));
          }
        },
      });

      this.tokenClient.requestAccessToken({ prompt: '' });
    } catch (e) {
      reject(e);
    }
  }

  /**
   * Create or find a folder on Google Drive
   */
  public async createFolder(folderName: string, parentFolderId?: string): Promise<GoogleDriveFolderResult> {
    const token = await this.authorize();

    const metadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId && parentFolderId !== 'root' && !parentFolderId.startsWith('1Root_')) {
      metadata.parents = [parentFolderId];
    }

    const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'สร้างโฟลเดอร์ Google Drive ไม่สำเร็จ');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      webViewLink: data.webViewLink || `https://drive.google.com/drive/folders/${data.id}`,
    };
  }

  /**
   * Set folder/file permissions to anyone with link can view (so images can be rendered in web pages)
   */
  public async makeFileReadable(fileId: string): Promise<boolean> {
    try {
      const token = await this.authorize();
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Upload file (Image or PDF) directly to Google Drive via multipart upload
   */
  public async uploadFile(
    fileBlob: Blob,
    fileName: string,
    mimeType: string = 'image/jpeg',
    parentFolderId?: string
  ): Promise<GoogleDriveFileResult & { directImageUrl: string }> {
    const token = await this.authorize();

    const metadata: any = {
      name: fileName,
      mimeType: mimeType,
    };

    if (parentFolderId && parentFolderId !== 'root' && !parentFolderId.startsWith('1Root_') && !parentFolderId.startsWith('root_')) {
      metadata.parents = [parentFolderId];
    }

    // Multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const reader = new FileReader();
    const base64Data = await new Promise<string>((resolve) => {
      reader.onload = () => {
        const res = reader.result as string;
        const b64 = res.split(',')[1] || res;
        resolve(b64);
      };
      reader.readAsDataURL(fileBlob);
    });

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n` +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      base64Data +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,thumbnailLink,mimeType,size',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'อัปโหลดไฟล์ขึ้น Google Drive ไม่สำเร็จ');
    }

    const data = await response.json();
    
    // Set file permission to readable so images can display on web
    await this.makeFileReadable(data.id);

    const directImageUrl = `https://lh3.googleusercontent.com/d/${data.id}`;

    return {
      id: data.id,
      name: data.name,
      webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
      thumbnailLink: directImageUrl,
      directImageUrl,
      mimeType: data.mimeType || mimeType,
      size: data.size,
    };
  }
}

export const googleDriveClient = new GoogleDriveManager();
