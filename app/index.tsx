import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { DateTime, Interval } from 'luxon';

export default function Index() {
  const date = DateTime.now();
  const christmas = DateTime.local(2024, 12, 25, 0, 0);
  const interval = Interval.fromDateTimes(date, christmas);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{`${date.toLocaleString()}`}</Text>
      <Text>{`${
        Math.floor(interval.length('days')) + 1
      } sleeps until Christmas`}</Text>
    </View>
  );
}
