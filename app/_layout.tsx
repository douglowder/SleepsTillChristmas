import { Stack } from 'expo-router';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

export default function RootLayout() {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

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
