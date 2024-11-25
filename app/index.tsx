import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';

import '../global.css';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

const theme = vars({});

import '../global.css';

export default function Index() {
  const player = useAudioPlayer(audioSource);
  const [playing, setPlaying] = useState(false);

  const { days, hours, minutes, seconds } = useTimeTillChristmas();
  return (
    <View
      style={theme}
      className="flex-1 justify-center w-screen items-center bg-[#ffffcc] px-[0] py-[100]"
    >
      <ImageBackground
        contentFit="contain"
        className="justify-start items-center w-screen"
        source={image}
      >
        <Text className="text-red-600 text-2xl text-center">{`Only ${
          days + 1
        } sleeps until Christmas!`}</Text>
        <Text className="text-green-600 text-xl text-center">{`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
        <View className="flex-1 w-screen" />
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
    fontSize: 20,
  },
  text: {
    color: 'green',
    fontSize: 14,
  },
});
