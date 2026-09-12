import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Surah } from '../types/surah';
 import { colors, spacing, radii, fonts } from '../theme';
interface SurahIndexModalProps {
  visible: boolean;
  surahs: Surah[];
  onClose: () => void;
  onSelectSurah: (page: number) => void;
}

export default function SurahIndexModal({ visible, surahs, onClose, onSelectSurah }: SurahIndexModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
            <Text style={styles.title}>فهرس السور</Text>
          </View>

          <View style={styles.divider} />

          <FlatList
            data={surahs}
            keyExtractor={(item) => String(item.number)}
            ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => {
                  onSelectSurah(item.page);
                  onClose();
                }}
              >
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{item.number}</Text>
                </View>
                <Text style={styles.surahName}>{item.name}</Text>
                <Text style={styles.surahPage}>صفحة {item.page}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bgPanel,
    maxHeight: '75%',
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
title: { fontSize: 18, fontFamily: fonts.amiriBold, color: colors.goldBright },
surahName: { flex: 1, color: colors.cream, fontSize: 17, textAlign: 'right', fontFamily: fonts.amiriRegular },
surahPage: { color: colors.mutedText, fontSize: 13, fontFamily: fonts.regular },  closeButton: { fontSize: 18, color: colors.mutedText },
  divider: { height: 1, backgroundColor: colors.border },
  rowSeparator: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  rowPressed: { backgroundColor: colors.bgPanelLight },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: { color: colors.gold, fontSize: 11, fontWeight: '700' },
 
});