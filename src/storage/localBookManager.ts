import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Book } from '../types/books';

const BOOKS_DIR = Platform.OS === 'web' ? '' : `${FileSystem.documentDirectory}books/`;

export function bookDir(bookId: string): string {
  return `${BOOKS_DIR}${bookId}/`;
}

export async function ensureBooksDir(): Promise<void> {
  if (Platform.OS === 'web') return;
  const info = await FileSystem.getInfoAsync(BOOKS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(BOOKS_DIR, { intermediates: true });
  }
}

// التحقق الحقيقي من وجود المصحف محليًا (غير متاح على الويب لعدم وجود نظام ملفات حقيقي هناك)
export async function isBookDownloaded(bookId: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const info = await FileSystem.getInfoAsync(`${bookDir(bookId)}0001.jpg`);
  return info.exists;
}

export function getLocalPageUri(bookId: string, pageNumber: number): string {
  const padded = String(pageNumber).padStart(4, '0');
  return `${bookDir(bookId)}${padded}.jpg`;
}

export async function deleteLocalBook(bookId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const info = await FileSystem.getInfoAsync(bookDir(bookId));
  if (info.exists) {
    await FileSystem.deleteAsync(bookDir(bookId), { idempotent: true });
  }
}

// export async function getLocalBookMeta(bookId: string): Promise<Book | null> {
//   if (Platform.OS === 'web') return null;
//   try {
//     const raw = await FileSystem.readAsStringAsync(`${bookDir(bookId)}meta.json`);
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// }