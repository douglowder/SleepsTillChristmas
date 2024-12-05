import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import { Text, View, Pressable, Platform, Dimensions } from 'react-native';
import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

import '../global.css';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

const { width } = Dimensions.get('screen');

const theme = vars({});

import '../global.css';
import { useAppState } from '@/hooks/useAppState';

const fractionCompleteFromPosition = (
  position: number | undefined,
  duration: number | undefined,
) => {
  return duration !== undefined ? (position ?? 0) / duration : 0;
};

export default function Index() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [fractionComplete, setFractionComplete] = useState(0);

  const player = useAudioPlayer(audioSource, 1000);
  const status = useAudioPlayerStatus(player);

  useAppState((activating) => {
    if (activating && wasPlaying) {
      player.play();
    }
    if (!activating) {
      player.pause();
    }
  });

  useEffect(() => {
    if (status.playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
    setFractionComplete(
      fractionCompleteFromPosition(status.currentTime, player.duration),
    );
  }, [status.playing, status.currentTime]);

  useEffect(() => {
    if (fractionComplete > 0.99) {
      player.seekTo(0);
    }
  }, [fractionComplete]);

  const togglePlayer = () => {
    if (isPlaying) {
      player.pause();
      setWasPlaying(false);
    } else {
      player.play();
      setWasPlaying(true);
    }
  };

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
              {wasPlaying ? 'Pause Music' : 'Play Music'}
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
              {isPlaying ? 'Pause Music' : 'Play Music'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const mainViewStyle = Platform.isTV
  ? 'flex-1 flex-row justify-center items-center bg-[#ffffcc] px-[200]'
  : 'flex-1 justify-center items-center bg-[#ffffcc] py-[150]';

const imageStyle = 'flex-1 justify-center';
const imageSpacerStyle = Platform.isTV ? 'flex-1 h-screen' : 'flex-1 w-screen';

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
