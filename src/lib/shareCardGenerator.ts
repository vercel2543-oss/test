import { toPng } from 'html-to-image';
import { downloadFile } from './qrCodeHelper';

export async function captureAndDownloadElement(
  elementId: string,
  filename: string = 'school-achievement-card.png'
): Promise<string | null> {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element #${elementId} not found`);
    return null;
  }

  try {
    const dataUrl = await toPng(node, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#ffffff'
    });
    downloadFile(dataUrl, filename);
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate image card:', error);
    return null;
  }
}
