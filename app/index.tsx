import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import { Text, View, Pressable, Platform } from 'react-native';
import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';

import '../global.css';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

const theme = vars({});

import '../global.css';

export default function Index() {
  const [playing, setPlaying] = useState(false);
  const player = useAudioPlayer(audioSource);
  useEffect(() => {
    const subscription = player.addListener(
      'playbackStatusUpdate',
      (status) => {
        if (status.playing && status.currentTime > 0.98 * player.duration) {
          player.pause();
          player.seekTo(0);
          player.play();
        }
      },
    );
    return () => {
      subscription.remove();
    };
  }, [player]);

  const togglePlayer = useCallback(() => {
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      player.play();
      setPlaying(true);
    }
  }, [player]);

  const { days, hours, minutes, seconds } = useTimeTillChristmas();
  return (
    <View style={theme} className={mainViewStyle}>
      <View className={textContainerStyle}>
        <Text className={sleepsTextStyle}>{`Only ${
          days + 1
        } sleeps until Christmas!`}</Text>
        <Text
          className={timeTextStyle}
        >{`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
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
  : 'flex-1 justify-center items-center bg-[#ffffcc] px-[0] py-[100]';

const imageStyle = 'flex-1 justify-center';
const imageSpacerStyle = Platform.isTV ? 'flex-1 w-[700]' : 'flex-1 w-screen';

const sleepsTextStyle = Platform.isTV
  ? 'm-[10] text-red-600 font-bold text-6xl text-center'
  : 'm-[10] text-red-600 font-bold text-2xl text-center';
const timeTextStyle = Platform.isTV
  ? 'm-[10] text-green-600 text-4xl text-center'
  : 'm-[10] text-green-600 text-xl text-center';

const textContainerStyle = 'justify-center items-center';

const pressableStyle =
  'transition duration-500 hover:scale-110 focus:scale-110 active:scale-125';
const pressableTextStyle = Platform.isTV
  ? 'text-green-800 font-bold text-6xl text-center m-[100]'
  : 'text-green-800 font-bold text-2xl text-center';
