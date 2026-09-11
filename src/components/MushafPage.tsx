import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { ActivityIndicator, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export type ZoomMode = 'mushaf' | 'qiraat';

interface MushafPageProps {
  imageUrl: string;
  pageNumber: number;
  mode: ZoomMode;
  nightMode: boolean;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onTap: () => void;
}

export default function MushafPage({
  imageUrl,
  pageNumber,
  mode,
  nightMode,
  onSwipeNext,
  onSwipePrev,
  onTap,
}: MushafPageProps) {
  const isOddPage = pageNumber % 2 !== 0;
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setStatus('loading');
  }, [imageUrl]);

  const zoomStyle =
    mode === 'mushaf'
      ? {
          transform: [{ scale: 1.5 as const }],
          transformOrigin: isOddPage ? ('top left' as const) : ('top right' as const),
        }
      : { transform: [{ scale: 1 as const }] };

  const moved = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        moved.current = false;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10) moved.current = true;
        return Math.abs(gesture.dx) > 20 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 60) onSwipePrev();
        else if (gesture.dx < -60) onSwipeNext();
        else if (!moved.current) onTap();
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, zoomStyle, nightMode && styles.nightImage]}
        contentFit="contain"
        transition={150}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />

      {status === 'loading' && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      )}

      {status === 'error' && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>تعذّر تحميل الصفحة</Text>
          <Pressable style={styles.retryButton} onPress={() => setStatus('loading')}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', backgroundColor: colors.bgDeep },
  image: { width: '100%', height: '100%' },
  nightImage: { opacity: 0.82 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: { fontSize: 15, color: colors.cream },
  retryButton: { backgroundColor: colors.gold, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  retryText: { color: colors.bgDeep, fontWeight: '700' },
});