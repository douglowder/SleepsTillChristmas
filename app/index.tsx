import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { ImageBackground } from 'expo-image';
import { StyleSheet, Button } from 'react-native';
import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

export default function Index() {
  const player = useAudioPlayer(audioSource);
  const [playing, setPlaying] = useState(false);

  const { days, hours, minutes, seconds, sleeps } = useTimeTillChristmas();
  return (
    <View style={styles.container}>
      <ImageBackground contentFit="contain" style={styles.image} source={image}>
        <Text
          style={styles.titleText}
        >{`Only ${sleeps} sleeps until Christmas!`}</Text>
        <Text
          style={styles.text}
        >{`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
        <View style={{ flex: 1 }} />
        <Button
          title={playing ? 'Pause Music' : 'Play Music'}
          onPress={() => {
            if (playing) {
              player.pause();
              setPlaying(false);
            } else {
              player.play();
              setPlaying(true);
            }
          }}
        />
        <View style={{ height: 100 }} />
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
