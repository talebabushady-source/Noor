import AsyncStorage from '@react-native-async-storage/async-storage';

const lastPageKey = (bookId: string) => `last_page_${bookId}`;
const bookmarkKey = (bookId: string) => `bookmark_${bookId}`;
const LAST_OPENED_BOOK_KEY = 'last_opened_book';

export async function saveLastPage(bookId: string, page: number): Promise<void> {
  await AsyncStorage.setItem(lastPageKey(bookId), String(page));
  await AsyncStorage.setItem(LAST_OPENED_BOOK_KEY, bookId);
}

export async function getLastPage(bookId: string): Promise<number | null> {
  const value = await AsyncStorage.getItem(lastPageKey(bookId));
  return value ? parseInt(value, 10) : null;
}

export async function saveBookmark(bookId: string, page: number): Promise<void> {
  await AsyncStorage.setItem(bookmarkKey(bookId), String(page));
}

export async function clearBookmark(bookId: string): Promise<void> {
  await AsyncStorage.removeItem(bookmarkKey(bookId));
}

export async function getBookmark(bookId: string): Promise<number | null> {
  const value = await AsyncStorage.getItem(bookmarkKey(bookId));
  return value ? parseInt(value, 10) : null;
}

export async function getLastOpenedBook(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_OPENED_BOOK_KEY);
}


const NIGHT_MODE_KEY = 'night_mode';

export async function getNightMode(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NIGHT_MODE_KEY);
  return value === 'true';
}

export async function setNightMode(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NIGHT_MODE_KEY, String(enabled));
}
export interface BookmarkEntry {
  bookId: string;
  page: number;
}

// جلب كل علامات القراءة المحفوظة عبر كل المصاحف (للاستخدام في شاشة الإعدادات)
export async function getAllBookmarks(): Promise<BookmarkEntry[]> {
  const keys = await AsyncStorage.getAllKeys();
  const bookmarkKeys = keys.filter((k) => k.startsWith('bookmark_'));
  const entries = await AsyncStorage.multiGet(bookmarkKeys);

  return entries
    .map(([key, value]) => ({
      bookId: key.replace('bookmark_', ''),
      page: value ? parseInt(value, 10) : 0,
    }))
    .filter((e) => e.page > 0);
}