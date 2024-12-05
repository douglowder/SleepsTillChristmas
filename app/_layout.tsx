import { Stack } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

preventAutoHideAsync();

export default function RootLayout() {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

  hideAsync();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Merry Christmas',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
