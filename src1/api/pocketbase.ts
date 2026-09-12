import { Client, Databases, Storage, Query } from 'react-native-appwrite';
import { appwriteConfig } from '../config';
import { Book } from '../types/books';

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

// خريطة كاملة "اسم الملف → ID الحقيقي" تُحمّل مرة واحدة فقط طوال الجلسة
let fileMapCache: Record<string, string> | null = null;

async function getSharedFileMap(): Promise<Record<string, string>> {
  if (fileMapCache) return fileMapCache;

  const response = await storage.listFiles(appwriteConfig.mushafsBucketId, [
    Query.limit(5000),
  ]);

  const map: Record<string, string> = {};
  for (const file of response.files) {
    map[file.name] = file.$id;
  }

  fileMapCache = map;
  return map;
}

export async function fetchBooks(): Promise<Book[]> {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.booksCollectionId,
    [Query.equal('is_active', true), Query.orderAsc('sort_order')]
  );
  return response.documents as unknown as Book[];
}

export async function getPageUrl(book: Book, pageNumber: number): Promise<string> {
  const padded = String(pageNumber).padStart(4, '0');
  const filename = `${book.folder}_${padded}.jpg`;

  const map = await getSharedFileMap();
  const fileId = map[filename];

  if (!fileId) {
    throw new Error(`الملف "${filename}" غير موجود في Storage`);
  }

  // مهم جدًا: getFileView بترجع Promise، لازم await قبل toString
  const url = await storage.getFileView(appwriteConfig.mushafsBucketId, fileId);
  return url.toString();
}

export async function getIndexUrl(book: Book): Promise<string | null> {
  const filename = `${book.folder}_index.json`;
  const map = await getSharedFileMap();
  const fileId = map[filename];
  if (!fileId) return null;

  const url = await storage.getFileView(appwriteConfig.mushafsBucketId, fileId);
  return url.toString();
}