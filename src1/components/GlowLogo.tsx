import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface GlowLogoProps {
  fontLoaded: boolean;
}

export default function GlowLogo({ fontLoaded }: GlowLogoProps) {
  return (
    <View style={styles.container}>
      {/* طبقات دائرية متدرجة الشفافية تحاكي توهّج الضوء خلف الاسم */}
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />
      <Text style={styles.subtitleText}>مصاحف</Text>
      <Text style={[styles.logoText, fontLoaded && styles.logoFont]}>نور</Text>
      {/* زخرفة هندسية بسيطة مستوحاة من الفن الإسلامي، تفصل اللوجو عن باقي الواجهة */}
      <View style={styles.ornamentRow}>
        <View style={styles.ornamentLine} />
        <View style={styles.ornamentDiamond} />
        <View style={styles.ornamentLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center',
     paddingVertical: 32, paddingTop: 48 },
  glowOuter: {
    position: 'absolute',
    top: 10,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.goldBright,
    opacity: 0.06,
  },
  glowInner: {
    position: 'absolute',
    top: 35,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.goldBright,
    opacity: 0.1,
  },
  logoText: {
    fontSize: 70,
    fontWeight: '700',
    color: colors.goldBright,
    // توهّج نصّي حقيقي حوالين الحروف نفسها
    textShadowColor: colors.gold,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  logoFont: { fontFamily: 'Amiri_700Bold' },
  subtitleText: {
    fontSize: 14,
    color: colors.mutedText,
    letterSpacing: 4,
    marginTop: 2,
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  ornamentLine: { width: 40, height: 1, backgroundColor: colors.border },
  ornamentDiamond: {
    width: 8,
    height: 8,
    backgroundColor: colors.gold,
    transform: [{ rotate: '45deg' }],
  },
});