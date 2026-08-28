import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(text: string, options: { width?: number; margin?: number; color?: { dark: string; light: string } } = {}): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#0f172a',
        light: options.color?.light || '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('QR Code generation error:', err);
    return '';
  }
}

export function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
