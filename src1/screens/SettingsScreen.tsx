import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { fetchBooks } from '../api/pocketbase';
import { Book } from '../types/books';
import { getNightMode, setNightMode, getAllBookmarks, BookmarkEntry } from '../storage/userPreferences';
import { colors, spacing, radii } from '../theme';
import { fonts } from '../theme';
type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [nightMode, setNightModeState] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getNightMode().then(setNightModeState);
    getAllBookmarks().then(setBookmarks);
    fetchBooks().then(setBooks).catch(() => {});
  }, []);

  const toggleNight = async (value: boolean) => {
    setNightModeState(value);
    await setNightMode(value);
  };

  const bookName = (bookId: string) => books.find((b) => b.id === bookId)?.name ?? bookId;

  return (
    <View style={styles.screen}>
      <View style={styles.row}>
        <Switch value={nightMode} onValueChange={toggleNight} trackColor={{ true: colors.gold }} />
        <Text style={styles.rowLabel}>الوضع الليلي</Text>
      </View>

      <Text style={styles.sectionTitle}>العلامات المحفوظة</Text>

      {bookmarks.length === 0 ? (
        <Text style={styles.emptyText}>لا توجد علامات قراءة محفوظة بعد</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.bookId}
          renderItem={({ item }) => (
            <Pressable
              style={styles.bookmarkRow}
              onPress={() => navigation.navigate('Reader', { bookId: item.bookId, jumpToPage: item.page })}
            >
              <Text style={styles.bookmarkBook}>{bookName(item.bookId)}</Text>
              <Text style={styles.bookmarkPage}>صفحة {item.page}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDeep, padding: spacing.lg },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
   emptyText: { color: colors.mutedText, textAlign: 'right' },
  bookmarkRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    backgroundColor: colors.bgPanel,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
rowLabel: { color: colors.cream, fontSize: 16, fontFamily: fonts.regular },
sectionTitle: { color: colors.gold, fontSize: 15, fontFamily: fonts.bold, marginBottom: spacing.sm, textAlign: 'right' },
bookmarkBook: { color: colors.cream, fontFamily: fonts.medium },  bookmarkPage: { color: colors.mutedText },
});