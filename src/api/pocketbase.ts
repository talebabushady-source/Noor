import { Client, Databases, Storage, Query } from 'react-native-appwrite';
import { appwriteConfig } from '../config';
import { Book } from '../types/books';

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

export async function fetchBooks(): Promise<Book[]> {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.booksCollectionId,
    [Query.equal('is_active', true), Query.orderAsc('sort_order')]
  );
  return response.documents as unknown as Book[];
}

// رابط صفحة معيّنة (مثال: hafs_0125) — مباشر وقابل للتوقع بدون أي طلب إضافي
export function getPageUrl(book: Book, pageNumber: number): string {
  const padded = String(pageNumber).padStart(4, '0');
  const fileId = `${book.folder}_${padded}`;
  return storage.getFileView(appwriteConfig.mushafsBucketId, fileId).toString();
}

export function getIndexUrl(book: Book): string {
  return storage.getFileView(appwriteConfig.mushafsBucketId, `${book.folder}_index`).toString();
}