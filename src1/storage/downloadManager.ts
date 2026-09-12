import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Book } from '../types/books';
import { bookDir, ensureBooksDir } from './localBookManager';
import { getPageUrl } from '../api/pocketbase';

export type DownloadProgress =
  | { stage: 'downloading'; percent: number }
  | { stage: 'done' }
  | { stage: 'error'; message: string };

export async function downloadBook(
  book: Book,
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  if (Platform.OS === 'web') {
    onProgress({ stage: 'error', message: 'التحميل للقراءة بدون إنترنت غير متاح على متصفح الويب' });
    return;
  }

  try {
    await ensureBooksDir();
    const targetDir = bookDir(book.id);
    await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });

    for (let page = 1; page <= book.page_count; page++) {
      const padded = String(page).padStart(4, '0');
      const url = getPageUrl(book, page);
      await FileSystem.downloadAsync(url, `${targetDir}${padded}.jpg`);
      onProgress({ stage: 'downloading', percent: Math.round((page / book.page_count) * 100) });
    }

    // حفظ بيانات المصحف الوصفية محليًا للقراءة بدون إنترنت لاحقًا
    await FileSystem.writeAsStringAsync(`${targetDir}meta.json`, JSON.stringify(book));

    onProgress({ stage: 'done' });
  } catch (e: any) {
    onProgress({ stage: 'error', message: e.message ?? 'خطأ غير معروف' });
  }
}