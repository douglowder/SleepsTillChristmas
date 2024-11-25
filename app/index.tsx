import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useAudioPlayer } from 'expo-audio';
import { useCallback, useState } from 'react';

import '../global.css';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

const theme = vars({});

import '../global.css';

export default function Index() {
  const player = useAudioPlayer(audioSource);
  const [playing, setPlaying] = useState(false);
  const togglePlayer = useCallback(() => {
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      player.play();
      setPlaying(true);
    }
  }, [player, playing]);

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
        <Text className="text-red-600 font-bold text-2xl text-center">{`Only ${
          days + 1
        } sleeps until Christmas!`}</Text>
        <Text className="text-green-600 text-xl text-center">{`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
        <View className="flex-1 w-screen" />
        <Pressable
          onPress={togglePlayer}
          className="transition duration-500 focus:scale-105 active:scale-110"
        >
          <Text className="text-green-600 text-2xl text-center font-bold">
            {playing ? 'Pause Music' : 'Play Music'}
          </Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
}
