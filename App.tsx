// import { NavigationContainer, DarkTheme } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './src/screens/HomeScreen';
// import ReaderScreen from './src/screens/ReaderScreen';
// import SettingsScreen from './src/screens/SettingsScreen';
// import { colors } from './src/theme';
// import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
// import { Tajawal_400Regular, Tajawal_500Medium, Tajawal_700Bold } from '@expo-google-fonts/tajawal';
// // أضف هذا السطر في أعلى ملف App.tsx تماماً
// import 'react-native-url-polyfill/auto';

// export type RootStackParamList = {
//   Home: undefined;
//   Reader: { bookId: string; jumpToPage?: number };
//   Settings: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const navTheme = {
//   ...DarkTheme,
//   colors: {
//     ...DarkTheme.colors,
//     background: colors.bgDeep,
//     card: colors.bgPanel,
//     text: colors.cream,
//     border: colors.border,
//     primary: colors.gold,
//   },
// };
// export default function App() {
//   const [fontsLoaded] = useFonts({
//     Amiri_400Regular,
//     Amiri_700Bold,
//     Tajawal_400Regular,
//     Tajawal_500Medium,
//     Tajawal_700Bold,
//   });


 

//   return (
//     <NavigationContainer theme={navTheme}>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: 'قراءة' }} />
//         <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// أضف هذا السطر في أعلى ملف App.tsx تماماً
import 'react-native-url-polyfill/auto';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { Tajawal_400Regular, Tajawal_500Medium, Tajawal_700Bold } from '@expo-google-fonts/tajawal';
import HomeScreen from './src/screens/HomeScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DebugScreen from './src/screens/DebugScreen';
import { colors } from './src/theme';

export type RootStackParamList = {
  Home: undefined;
  Reader: { bookId: string; jumpToPage?: number };
  Settings: undefined;
  Debug: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bgDeep,
    card: colors.bgPanel,
    text: colors.cream,
    border: colors.border,
    primary: colors.gold,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  // نستنى تحميل الخطوط الأول، عشان مانورّيش واجهة بخط النظام الافتراضي لحظة قبل ما يتبدّل
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: 'قراءة' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
        <Stack.Screen name="Debug" component={DebugScreen} options={{ title: 'تشخيص' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

 