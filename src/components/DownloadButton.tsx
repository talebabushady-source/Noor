import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export type DownloadStatus = 'idle' | 'downloading' | 'downloaded' | 'error';

interface DownloadButtonProps {
  status: DownloadStatus;
  percent?: number;
  onPress: () => void;
}

export default function DownloadButton({ status, percent, onPress }: DownloadButtonProps) {
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  const label =
    status === 'downloading' ? `${percent ?? 0}%` : status === 'downloaded' ? '✓' : status === 'error' ? '!' : '⬇';

  return (
    <Pressable onPress={onPress} style={styles.wrapper} hitSlop={10}>
      <Animated.View style={[styles.glow, { opacity: status === 'idle' ? glow : 0.15 }]} />
      <View style={[styles.circle, status === 'downloaded' && styles.circleDone]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // glow: {
  //   position: 'absolute',
  //   width: 44,
  //   height: 44,
  //   borderRadius: 22,
  //   backgroundColor: colors.goldBright,
  // },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: 'rgba(123,78,78,0.05)',
    borderWidth: 1.5,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDone: { borderColor: colors.goldBright },
  label: { color: colors.goldBright, fontSize: 11, fontWeight: '700' },
});