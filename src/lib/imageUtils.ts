/**
 * Client-side image compression and processing helper
 * Ensures high quality for certificates while optimizing bandwidth & file size
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.85
): Promise<{ blob: Blob; dataUrl: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    // If PDF, return without canvas compression
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          blob: file,
          dataUrl: reader.result as string,
          originalSize: file.size,
          compressedSize: file.size
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }
            const compressedDataUrl = canvas.toDataURL(mimeType, quality);
            resolve({
              blob,
              dataUrl: compressedDataUrl,
              originalSize: file.size,
              compressedSize: blob.size
            });
          },
          mimeType,
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
