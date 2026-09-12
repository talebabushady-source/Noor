// import { useEffect, useState, useLayoutEffect } from 'react';
// import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../../App';
// import MushafPage, { ZoomMode } from '../components/MushafPage';
// import SurahIndexModal from '../components/SurahIndexModal';
 
// import { fetchBooks, getPageImageUrl  , fetchSurahIndex  } from '../api/pocketbase';
//  import { Book } from '../types/books';
// import { Surah } from '../types/surah';
// import {
//   saveLastPage,
//   getLastPage,
//   saveBookmark,
//   clearBookmark,
//   getBookmark,
//   getNightMode,
//   setNightMode as persistNightMode,
// } from '../storage/userPreferences';
// import { isBookDownloaded, getLocalPageUri } from '../storage/localBookManager';import { colors, spacing, radii } from '../theme';
// import { fonts } from '../theme';
// type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

// export default function ReaderScreen({ route, navigation }: Props) {
//   const { bookId, jumpToPage } = route.params;

//   const [book, setBook] = useState<Book | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [mode, setMode] = useState<ZoomMode>('qiraat');
//   const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
//   const [surahs, setSurahs] = useState<Surah[]>([]);
//   const [indexVisible, setIndexVisible] = useState(false);
//   const [downloaded, setDownloaded] = useState(false);
//   const [nightMode, setNightModeState] = useState(false);
//   const [controlsVisible, setControlsVisible] = useState(true);
 
//   useEffect(() => {
//     fetchBooks().then(async (books) => {
//       const found = books.find((b) => b.id === bookId);
//       setBook(found ?? null);
//       if (!found) return;

//       const isDownloaded = await isBookDownloaded(found.id);
//       setDownloaded(isDownloaded);

//       const savedBookmark = await getBookmark(bookId);
//       setBookmarkedPage(savedBookmark);

//       if (jumpToPage) {
//         setPageNumber(jumpToPage);
//       } else {
//         const savedPage = await getLastPage(bookId);
//         if (savedPage) setPageNumber(savedPage);
//       }

//       setSurahs(await fetchSurahIndex(found));
//       setNightModeState(await getNightMode());
//     });
//   }, [bookId, jumpToPage]);
  
// /* useEffect(() => {
//   const load = async () => {
//     const isDownloaded = await isBookDownloaded(bookId);
//     setDownloaded(isDownloaded);

//     let found: Book | null = null;

//     if (isDownloaded) {
//       // القراءة بالكامل بدون إنترنت لو المصحف محمّل بالفعل
//       found = await getLocalBookMeta(bookId);
//     } else {
//       // نحتاج الإنترنت هنا فقط لو المصحف لسه مش محمّل
//       const books = await fetchBooks();
//       found = books.find((b) => b.id === bookId) ?? null;
//     }

//     setBook(found);
//     if (!found) return;

//     const savedBookmark = await getBookmark(bookId);
//     setBookmarkedPage(savedBookmark);

//     if (jumpToPage) {
//       setPageNumber(jumpToPage);
//     } else {
//       const savedPage = await getLastPage(bookId);
//       if (savedPage) setPageNumber(savedPage);
//     }
//   };

//   load();
// }, [bookId, jumpToPage]); */

//   useEffect(() => {
//     saveLastPage(bookId, pageNumber);
//   }, [pageNumber, bookId]);

//   useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: controlsVisible });
//   }, [controlsVisible, navigation]);

//   const toggleBookmark = async () => {
//     if (bookmarkedPage === pageNumber) {
//       await clearBookmark(bookId);
//       setBookmarkedPage(null);
//     } else {
//       await saveBookmark(bookId, pageNumber);
//       setBookmarkedPage(pageNumber);
//     }
//   };

//   const toggleNightMode = async (value: boolean) => {
//     setNightModeState(value);
//     await persistNightMode(value);
//   };

//   if (!book) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.centerText}>جارِ التحميل...</Text>
//       </View>
//     );
//   }

//  const imageUrl = getLocalPageUri(book.id, pageNumber);
//   const isBookmarked = bookmarkedPage === pageNumber;
//   const isMushafMode = mode === 'mushaf';
//   const nextPage = () => setPageNumber((p) => Math.min(book.page_count, p + 1));
//   const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden={!controlsVisible} style="light" />

//       {controlsVisible && (
//         <View style={styles.topBar}>
//           <View style={styles.switchGroup}>
//             <Text style={styles.switchLabel}>قراءات</Text>
//             <Switch
//               value={isMushafMode}
//               onValueChange={(v) => setMode(v ? 'mushaf' : 'qiraat')}
//               trackColor={{ true: colors.gold, false: colors.bgPanelLight }}
//               thumbColor={colors.goldBright}
//             />
//             <Text style={styles.switchLabel}>مصحف</Text>
//           </View>
//  <Pressable onPress={() => setIndexVisible(true)}>
//             <Text style={styles.button}>الفهرس</Text>
//           </Pressable>
//           <Pressable onPress={toggleBookmark}>
//             <Text style={styles.iconText}>{isBookmarked ? '🔖 زالة العلامة ' : '📑 إ ضع علامة'}</Text>
            
//           </Pressable>

//           {/*  <View style={styles.switchGroup}>
//             <Text style={styles.switchLabel}>🌙</Text>
//            <Switch
//               value={nightMode}
//               onValueChange={toggleNightMode}
//               trackColor={{ true: colors.gold, false: colors.bgPanelLight }}
//               thumbColor={colors.goldBright}
//             /> 
//           </View>*/}
//         </View>
//       )}

//       <MushafPage
//         imageUrl={imageUrl}
//         pageNumber={pageNumber}
//         mode={mode}
//         nightMode={nightMode}
//         onSwipeNext={nextPage}
//         onSwipePrev={prevPage}
//         onTap={() => setControlsVisible((v) => !v)}
//       />

//       {controlsVisible && (
//         <View style={styles.toolbar}>
//           <Pressable onPress={prevPage}>
//             <Text style={styles.button}>السابق</Text>
//           </Pressable>

//           <Pressable onPress={() => setIndexVisible(true)}>
//             <Text style={styles.button}>الفهرس</Text>
//           </Pressable>

//           <Text style={styles.pageInfo}>
//             {pageNumber} / {book.page_count}
//           </Text>


//           <Pressable onPress={nextPage}>
//             <Text style={styles.button}>التالي</Text>
//           </Pressable>
//         </View>
//       )}

//       <SurahIndexModal
//         visible={indexVisible}
//         surahs={surahs}
//         onClose={() => setIndexVisible(false)}
//         onSelectSurah={(page) => setPageNumber(page)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bgDeep },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgDeep },
//   centerText: { color: colors.cream },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: spacing.md,
//     paddingVertical: 10,
//     backgroundColor: colors.bgPanel,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   switchGroup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
// switchLabel: { color: colors.cream, fontSize: 13, fontFamily: fonts.regular },
//   toolbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//     backgroundColor: colors.bgPanel,
//   },
// button: { fontSize: 14, color: colors.gold, padding: 6, fontFamily: fonts.medium },
// pageInfo: { fontSize: 13, color: colors.cream, fontFamily: fonts.regular },  iconText: { fontSize: 17, color: colors.gold },
// });

import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import MushafPage, { ZoomMode } from '../components/MushafPage';
import SurahIndexModal from '../components/SurahIndexModal';
import { fetchBooks, getPageUrl, getIndexUrl } from '../api/pocketbase';
import { Book } from '../types/books';
import { Surah } from '../types/surah';
import { saveLastPage, getLastPage, saveBookmark, clearBookmark, getBookmark } from '../storage/userPreferences';
import { isBookDownloaded, getLocalPageUri } from '../storage/localBookManager';
import { colors, spacing, radii } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

export default function ReaderScreen({ route }: Props) {
  const { bookId, jumpToPage } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [mode, setMode] = useState<ZoomMode>('qiraat');
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [indexVisible, setIndexVisible] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    fetchBooks().then(async (books) => {
      const found = books.find((b) => b.id === bookId);
      setBook(found ?? null);
      if (!found) return;

      const isDownloaded = await isBookDownloaded(found.id);
      setDownloaded(isDownloaded);

      const savedBookmark = await getBookmark(bookId);
      setBookmarkedPage(savedBookmark);

      if (jumpToPage) setPageNumber(jumpToPage);
      else {
        const savedPage = await getLastPage(bookId);
        if (savedPage) setPageNumber(savedPage);
      }

      try {
        const res = await fetch(getIndexUrl(found));
        setSurahs(res.ok ? await res.json() : []);
      } catch {
        setSurahs([]);
      }
    });
  }, [bookId, jumpToPage]);

  useEffect(() => {
    saveLastPage(bookId, pageNumber);
  }, [pageNumber, bookId]);

  const toggleBookmark = async () => {
    if (bookmarkedPage === pageNumber) {
      await clearBookmark(bookId);
      setBookmarkedPage(null);
    } else {
      await saveBookmark(bookId, pageNumber);
      setBookmarkedPage(pageNumber);
    }
  };

  if (!book) {
    return <View style={styles.center}><Text style={styles.centerText}>جارِ التحميل...</Text></View>;
  }

  // رابط مباشر: محلي لو محمّل، أو مباشرة من Appwrite لو أونلاين — بدون أي فك ضغط
  const imageUrl = downloaded ? getLocalPageUri(book.id, pageNumber) : getPageUrl(book, pageNumber);
  const isBookmarked = bookmarkedPage === pageNumber;
  const isMushafMode = mode === 'mushaf';
  const nextPage = () => setPageNumber((p) => Math.min(book.page_count, p + 1));
  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>قراءات</Text>
          <Switch
            value={isMushafMode}
            onValueChange={(v) => setMode(v ? 'mushaf' : 'qiraat')}
            trackColor={{ true: colors.gold, false: colors.bgPanelLight }}
            thumbColor={colors.goldBright}
          />
          <Text style={styles.switchLabel}>مصحف</Text>
        </View>
        {!downloaded && <Text style={styles.networkBadge}>قراءة أونلاين</Text>}
      </View>

      <MushafPage
        imageUrl={imageUrl}
        pageNumber={pageNumber}
        mode={mode}
        nightMode={false}
        onSwipeNext={nextPage}
        onSwipePrev={prevPage}
        onTap={() => {}}
      />

      <View style={styles.toolbar}>
        <Pressable onPress={prevPage}><Text style={styles.button}>السابق</Text></Pressable>
        <Pressable onPress={() => setIndexVisible(true)}><Text style={styles.button}>الفهرس</Text></Pressable>
        <Text style={styles.pageInfo}>{pageNumber} / {book.page_count}</Text>
        <Pressable onPress={toggleBookmark}>
          <Text style={styles.iconText}>{isBookmarked ? '🔖' : '📑'}</Text>
        </Pressable>
        <Pressable onPress={nextPage}><Text style={styles.button}>التالي</Text></Pressable>
      </View>

      <SurahIndexModal visible={indexVisible} surahs={surahs} onClose={() => setIndexVisible(false)} onSelectSurah={(page) => setPageNumber(page)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDeep },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgDeep },
  centerText: { color: colors.cream },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 10, backgroundColor: colors.bgPanel, borderBottomWidth: 1, borderBottomColor: colors.border },
  switchGroup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  switchLabel: { color: colors.cream, fontSize: 13 },
  networkBadge: { color: colors.mutedText, fontSize: 11, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 2 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgPanel },
  button: { fontSize: 14, color: colors.gold, padding: 6, fontWeight: '600' },
  pageInfo: { fontSize: 13, color: colors.cream },
  iconText: { fontSize: 17, color: colors.gold },
});