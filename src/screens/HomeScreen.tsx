import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { fetchBooks } from '../api/pocketbase';
import { Book } from '../types/books';
import { getLastOpenedBook } from '../storage/userPreferences';
import { isBookDownloaded, deleteLocalBook } from '../storage/localBookManager';
import { downloadBook } from '../storage/downloadManager';
import DownloadButton, { DownloadStatus } from '../components/DownloadButton';
import { colors,fonts,  spacing, radii } from '../theme';
import { coverAssets } from '../coverAssets';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DownloadState = { status: DownloadStatus; percent?: number };

export default function HomeScreen({ navigation }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastOpenedBookId, setLastOpenedBookId] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<Record<string, DownloadState>>({});

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBooks();
      setBooks(result);

      const states: Record<string, DownloadState> = {};
      for (const book of result) {
        states[book.id] = { status: (await isBookDownloaded(book.id)) ? 'downloaded' : 'idle' };
      }
      setDownloadState(states);
    } catch (e: any) {
      setError(e.message ?? 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    getLastOpenedBook().then(setLastOpenedBookId);
  }, []);

  const handleDownloadPress = async (book: Book) => {
    const current = downloadState[book.id];

    if (current?.status === 'downloading') return;

    if (current?.status === 'downloaded') {
      Alert.alert('حذف المصحف', `هل تريد حذف نسخة "${book.name}" المحمّلة محليًا؟`, [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            await deleteLocalBook(book.id);
            setDownloadState((prev) => ({ ...prev, [book.id]: { status: 'idle' } }));
          },
        },
      ]);
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('غير متاح على الويب', 'التحميل للقراءة بدون إنترنت متاح فقط على تطبيق Android الحقيقي.');
      return;
    }

    setDownloadState((prev) => ({ ...prev, [book.id]: { status: 'downloading', percent: 0 } }));

    await downloadBook(book, (progress) => {
      if (progress.stage === 'downloading' || progress.stage === 'extracting') {
        setDownloadState((prev) => ({ ...prev, [book.id]: { status: 'downloading', percent: progress.percent } }));
      } else if (progress.stage === 'done') {
        setDownloadState((prev) => ({ ...prev, [book.id]: { status: 'downloaded' } }));
      } else if (progress.stage === 'error') {
        setDownloadState((prev) => ({ ...prev, [book.id]: { status: 'error' } }));
        Alert.alert('فشل التحميل', progress.message);
      }
    });
  };

  const lastOpenedBook = books.find((b) => b.id === lastOpenedBookId);

  return (
    <ImageBackground
      source={require('../../assets/b.jpg')}
      style={styles.screen}
    >
     
    <View style={styles.screen}>
       <View style={styles.screeno}>
  <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10}>
          <Text style={styles.gearIcon}>⚙</Text>
        </Pressable></View>
  
{/* 
                  <View style={styles.logo}>  
        <Text style={styles.headerTitle}>    مصاحف نور   </Text>         <Image source={require('../../assets/favicon.png')}  contentFit="cover" />

        <Image source={require('../../assets/o.jpg')} 
          style={styles.logoimg}   contentFit="cover" />  
         
          </View>  */}

<View style={styles.wrap}>
{/* <Image source={require('../../assets/logo.png')}
 style={styles.logo}
 resizeMode="contain"/>;  */}</View>



      <View style={styles.header}>

        {/* <Text style={styles.headerTitle}>    مصاحف نور   </Text>      */}
       <Image source={require('../../assets/favicon.png')}  contentFit="cover" />
       

     
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>حصل خطأ: {error}</Text>
          <Pressable style={styles.retryButton} onPress={loadBooks}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && (
        <>
          {lastOpenedBook && (
            <Pressable
              style={styles.continueBanner}
              onPress={() => navigation.navigate('Reader', { bookId: lastOpenedBook.id })}
            >
              <Text style={styles.continueText}>متابعة قراءة {lastOpenedBook.name}</Text>
            </Pressable>
          )}

          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
const coverSource = coverAssets[item.cover_key];
              const state = downloadState[item.id] ?? { status: 'idle' as DownloadStatus };

              return (

                <Pressable
                  style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                  onPress={() => navigation.navigate('Reader', { bookId: item.id })}
                > 


                <View style={styles.cardTextBlock}>

              {coverSource ? (
  <Image source={coverSource} style={StyleSheet.absoluteFill} contentFit="cover" />
) : (
  <View style={[StyleSheet.absoluteFill, styles.coverFallback]} />
)}


                <DownloadButton
                    status={state.status}
                    percent={state.percent}
                    onPress={() => handleDownloadPress(item)}           /> 

                    <Text style={styles.title}> ⚙ {item.name}</Text>
                    <Text style={styles.subtitle}>{item.riwayah}</Text>
 
                  </View>
 
                  {/* <View style={styles.pagesBadge}>
                    <Text style={styles.pagesBadgeText}>{item.page_count}</Text>
                  </View> */}
                </Pressable>
              );
            }}
          />
        </>
      )}
    </View>  </ImageBackground>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop:  50,
    paddingBottom: spacing.md,
  },
  headerTitle: { color: colors.goldBright, fontSize: 32,
     fontWeight: '700' , flex: 1, textAlign: 'center', alignItems: 'center' },
  gearIcon: { color: colors.gold, fontSize: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  continueBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  continueText: { color: colors.gold, fontWeight: '700', textAlign: 'center' },
  card: {
paddingVertical: 1,    borderRadius: radii.md,
    borderWidth: 0,
    borderColor: colors.border,
    overflow: 'hidden',
    marginVertical: 2, 
 paddingHorizontal:20,
    backgroundColor: 'rgba(32, 14, 33, 0.04)',

    justifyContent: 'flex-end', 
  },
  cardPressed: { opacity: 0.35 },
  coverFallback: {  
     position: 'absolute', flex:1, 
    },
      cover : {  
     position: 'absolute',
    top: 10,
    right: 10,  },
  //  overlayTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%', backgroundColor: 'rgba(11,38,32,0.15)' },
  //  overlayBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', backgroundColor: 'rgba(11,38,32,0.9)' },
  cardTextBlock: { padding: spacing.md },
  title: { fontSize: 18, fontWeight: '700', color: colors.cream, textAlign: 'right',fontFamily: fonts.regular, },
  subtitle: { fontSize: 13, color: colors.mutedText, marginTop: 2, textAlign: 'right' },
  pagesBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(11,38,32,0.7)',
  },
  pagesBadgeText: { color: colors.gold, fontSize: 12, fontWeight: '700' },
  errorText: { color: colors.cream, marginBottom: spacing.md },
  retryButton: { backgroundColor: colors.gold, paddingVertical: 10, paddingHorizontal: 24, borderRadius: radii.sm },
  retryButtonText: { color: colors.bgDeep, fontWeight: '700' },
   screen:{flex:1,      },
  
     screeno:{   flexDirection:'row-reverse', padding:5,   },



    wrap:{alignItems:'center',
      justifyContent:'center',
      height:115  ,  paddingTop:  170,
},
      
      logo:{width:230,height:230}
});

