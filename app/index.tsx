import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { ImageBackground } from 'expo-image';
import { DateTime, Interval } from 'luxon';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useInterval } from '@/hooks/useInterval';

const image = require('@/assets/images/morriscropped.jpg');

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft: () => TimeLeft = () => {
  const date = DateTime.now();
  const christmas = DateTime.local(2024, 12, 25, 0, 0);
  const interval = Interval.fromDateTimes(date, christmas);
  const days = Math.floor(interval.length('days'));
  const hours = Math.floor(interval.length('hours') - 24 * days);
  const minutes = Math.floor(
    interval.length('minutes') - 60 * hours - 24 * 60 * days,
  );
  const seconds = Math.floor(
    interval.length('seconds') -
      60 * minutes -
      60 * 60 * hours -
      24 * 60 * 60 * days,
  );
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

const useTimeLeft = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  useInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, 1000);
  return timeLeft;
};

export default function Index() {
  const { days, hours, minutes, seconds } = useTimeLeft();
  return (
    <View style={styles.container}>
      <ImageBackground contentFit="contain" style={styles.image} source={image}>
        <Text style={styles.titleText}>{`Only ${
          days + 1
        } sleeps until Christmas!`}</Text>
        <Text
          style={styles.text}
        >{`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffcc',
    alignItems: 'center',
    paddingTop: 100,
  },
  titleText: {
    color: 'red',
    fontSize: 18,
  },
  text: {
    color: 'green',
    fontSize: 12,
  },
});
