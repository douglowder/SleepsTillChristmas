import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Platform,
} from 'react-native';
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
    <View style={theme} className={mainViewStyle}>
      <View className={textContainerStyle}>
        <Text className="text-red-600 font-bold text-2xl text-center">{`Only ${
          days + 1
        } sleeps until Christmas!`}</Text>
        <Text className="text-green-600 text-xl text-center">{`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
        {Platform.isTV && (
          <Pressable onPress={togglePlayer} className={pressableStyle}>
            <Text className={pressableTextStyle}>
              {playing ? 'Pause Music' : 'Play Music'}
            </Text>
          </Pressable>
        )}
      </View>
      <ImageBackground
        contentFit="contain"
        className={imageStyle}
        source={image}
      >
        <View className={imageSpacerStyle} />
      </ImageBackground>
      {!Platform.isTV && (
        <View className={textContainerStyle}>
          <Pressable onPress={togglePlayer} className={pressableStyle}>
            <Text className={pressableTextStyle}>
              {playing ? 'Pause Music' : 'Play Music'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const mainViewStyle = Platform.isTV
  ? 'flex-1 flex-row justify-center items-center bg-[#ffffcc] px-[200] py-[0]'
  : 'flex-1 justify-center items-center bg-[#ffffcc] px-[0] py-[150]';

const imageStyle = 'flex-1 justify-center';
const imageSpacerStyle = Platform.isTV ? 'flex-1 w-[700]' : 'flex-1 w-screen';

const textContainerStyle = 'm-[20] justify-center';

const pressableStyle =
  'transition duration-500 hover:scale-110 focus:scale-110 active:scale-125';
const pressableTextStyle = 'text-green-800 font-bold text-2xl text-center';
