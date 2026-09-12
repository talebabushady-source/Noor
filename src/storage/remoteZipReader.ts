import JSZip from 'jszip';

// كاش بسيط في الذاكرة، عشان ملف الـ ZIP يتحمّل مرة واحدة بس لكل مصحف خلال نفس الجلسة
const zipCache = new Map<string, JSZip>();

export async function loadRemoteZip(bookId: string, zipUrl: string): Promise<JSZip> {
  const cached = zipCache.get(bookId);
  if (cached) return cached;

  const response = await fetch(zipUrl);
  if (!response.ok) throw new Error('فشل تحميل ملف المصحف من السيرفر');

  const arrayBuffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  zipCache.set(bookId, zip);
  return zip;
}

// استخراج صفحة معيّنة من الملف المضغوط المحمّل بالفعل في الذاكرة، وتحويلها لرابط صورة قابل للعرض
export async function getRemotePageBlobUrl(zip: JSZip, pageNumber: number): Promise<string> {
  const padded = String(pageNumber).padStart(4, '0');
  const file = zip.file(`${padded}.jpg`);
  if (!file) throw new Error(`الصفحة ${padded} غير موجودة داخل الملف`);

  const blob = await file.async('blob');
  return URL.createObjectURL(blob);
}

// استخراج فهرس السور من نفس الملف المضغوط (بدل جلبه بطلب شبكة منفصل)
export async function getRemoteIndexJson(zip: JSZip): Promise<any[]> {
  const file = zip.file('index.json');
  if (!file) return [];
  const text = await file.async('text');
  return JSON.parse(text);
}