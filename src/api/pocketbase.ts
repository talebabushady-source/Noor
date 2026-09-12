import { Client, Databases, Storage, Query } from 'react-native-appwrite';
import { appwriteConfig } from '../config';
import { Book } from '../types/books';

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

// ذاكرة كاش لتخزين المعرفات الحقيقية لأسماء الملفات (Filename -> File ID)
const fileIdCache = new Map<string, string>();

/**
 * جلب قائمة الكتب المفعلة من قاعدة البيانات
 */
export async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      [Query.equal('is_active', true), Query.orderAsc('sort_order')]
    );
    return response.documents as unknown as Book[];
  } catch (error) {
    console.error('خطأ أثناء جلب الكتب:', error);
    return [];
  }
}

/**
 * جلب رابط الصورة المباشر لصفحة معينة
 */
export async function getPageUrl(book: Book, pageNumber: number): Promise<string> {
  const padded = String(pageNumber).padStart(4, '0');
  const folder = book.folder || 'hafs';
  const filename = `${folder}_${padded}.jpg`;

  try {
    let fileId = fileIdCache.get(filename);

    // البحث عن ID الملف في Appwrite Storage إذا لم يكن مسجلاً في الكاش المحلي
    if (!fileId) {
      const response = await storage.listFiles(
        appwriteConfig.mushafsBucketId,
        [Query.equal('name', filename), Query.limit(1)]
      );

      if (!response.files || response.files.length === 0) {
        throw new Error(`الملف ${filename} غير موجود في Storage`);
      }

      fileId = response.files[0].$id;
      fileIdCache.set(filename, fileId);
    }

    // بناء الرابط المباشر الصريح لتفادي مشاكل الـ Redirect والجلسات في الويب والمحاكي
    const directImageUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.mushafsBucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;

    return directImageUrl;
  } catch (error) {
    console.error(`خطأ أثناء تحميل الصفحة (${filename}):`, error);
    throw new Error(`تعذر تحميل الصفحة ${pageNumber}`);
  }
}

/**
 * جلب رابط ملف الفهرس hafs_index.json
 */
export async function getIndexUrl(book: Book): Promise<string | null> {
  const folder = book.folder || 'hafs';
  const filename = `${folder}_index.json`;

  try {
    let fileId = fileIdCache.get(filename);

    if (!fileId) {
      const response = await storage.listFiles(
        appwriteConfig.mushafsBucketId,
        [Query.equal('name', filename), Query.limit(1)]
      );

      if (!response.files || response.files.length === 0) return null;

      fileId = response.files[0].$id;
      fileIdCache.set(filename, fileId);
    }

    return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.mushafsBucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  } catch (error) {
    console.error('خطأ في جلب ملف الفهرس:', error);
    return null;
  }
}
