import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Client, Databases, Storage, Query } from 'react-native-appwrite';
import { appwriteConfig } from '../config';

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

export default function DebugScreen() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    const runDiagnostics = async () => {
      addLog('=== بدء التشخيص ===');
      addLog(`Endpoint: ${appwriteConfig.endpoint}`);
      addLog(`Project ID: ${appwriteConfig.projectId}`);
      addLog(`Database ID: ${appwriteConfig.databaseId}`);
      addLog(`Books Collection ID: ${appwriteConfig.booksCollectionId}`);
      addLog(`Mushafs Bucket ID: ${appwriteConfig.mushafsBucketId}`);

      addLog('\n--- اختبار 1: جلب الكتب من Database ---');
      try {
        const booksResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.booksCollectionId
        );
        addLog(`✅ نجح. عدد الكتب: ${booksResponse.documents.length}`);
        booksResponse.documents.forEach((doc: any) => {
          addLog(`  - id: ${doc.$id}, name: ${doc.name}, folder: "${doc.folder}", is_active: ${doc.is_active}, page_count: ${doc.page_count}`);
        });

        if (booksResponse.documents.length === 0) {
          addLog('⚠️ لا يوجد أي كتب. تأكد من is_active = true');
        }

        addLog('\n--- اختبار 2: جلب قائمة الملفات من Storage ---');
        const filesResponse = await storage.listFiles(
          appwriteConfig.mushafsBucketId,
          [Query.limit(20)]
        );
        addLog(`✅ نجح. عدد الملفات (أول 20): ${filesResponse.files.length}`);
        filesResponse.files.forEach((file) => {
          addLog(`  - name: "${file.name}", id: ${file.$id}`);
        });

        if (booksResponse.documents.length > 0) {
          const firstBook: any = booksResponse.documents[0];
          const expectedFilename = `${firstBook.folder}_0001.jpg`;
          addLog(`\n--- اختبار 3: البحث عن "${expectedFilename}" ---`);

          const matched = filesResponse.files.find((f) => f.name === expectedFilename);
          if (matched) {
            addLog(`✅ الملف موجود! ID: ${matched.$id}`);
const urlResult = await storage.getFileView(appwriteConfig.mushafsBucketId, matched.$id);
const url = urlResult.toString();
            addLog(`رابط الصورة: ${url}`);

            addLog('\n--- اختبار 4: تحميل الرابط فعليًا ---');
            try {
              const imgResponse = await fetch(url);
              addLog(`حالة الاستجابة: ${imgResponse.status}`);
              addLog(`Content-Type: ${imgResponse.headers.get('content-type')}`);
              if (imgResponse.ok) {
                addLog('✅ الرابط شغّال ويرجع بيانات فعلية');
              } else {
                addLog('❌ الرابط رجع خطأ - على الأرجح مشكلة صلاحيات (Permissions)');
              }
            } catch (fetchErr: any) {
              addLog(`❌ فشل تحميل الرابط: ${fetchErr.message}`);
            }
          } else {
            addLog(`❌ لم يتم العثور على ملف بهذا الاسم بالضبط`);
            addLog('قارن مع الأسماء الفعلية في القائمة فوق - هل فيه اختلاف في الأحرف الكبيرة/الصغيرة أو مسافات؟');
          }
        }
      } catch (error: any) {
        addLog(`❌ خطأ: ${error.message}`);
        addLog(`تفاصيل: ${JSON.stringify(error, null, 2)}`);
      }

      addLog('\n=== انتهى التشخيص ===');
    };

    runDiagnostics();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {logs.map((log, i) => (
        <Text key={i} style={styles.logText} selectable>
          {log}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  logText: { color: '#0f0', fontSize: 12, fontFamily: 'monospace', marginBottom: 2 },
});