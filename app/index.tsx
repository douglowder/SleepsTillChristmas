import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import {
  Text,
  View,
  Pressable,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

import '../global.css';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

const { width } = Dimensions.get('screen');

const imageWidth = 798;
const imageHeight = 926;

const scaledHeight = Math.floor((width * imageHeight) / imageWidth);

const theme = vars({
  '--image-height': scaledHeight,
  '--image-width': width,
});

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
    <SafeAreaView
      style={theme}
      className="flex-1 justify-center items-start bg-[#ffffcc]"
    >
      <View className="flex-1 justify-center w-screen">
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-600 font-bold text-2xl text-center">{`Only ${
            days + 1
          } sleeps until Christmas!`}</Text>
        </View>
      </View>
      <ImageBackground contentFit="contain" source={image}>
        <View className="h-[--image-height] w-[--image-width]">
          <View className="mx-[20] p-[10] flex-1 justify-start items-start">
            <Text className="text-green-600 text-xl text-start">{`${days} days`}</Text>
            <Text className="text-green-600 text-xl text-start">{`${hours} hours`}</Text>
            <Text className="text-green-600 text-xl text-start">{`${minutes} minutes`}</Text>
            <Text className="text-green-600 text-xl text-start">{`${seconds} seconds`}</Text>
          </View>
        </View>
      </ImageBackground>
      <View className="flex-1 justify-center w-screen">
        <Pressable
          onPress={togglePlayer}
          className="transition duration-500 hover:scale-110 focus:scale-110 active:scale-125"
        >
          <Text className="text-green-800 font-bold text-2xl text-center">
            {wasPlaying ? 'Pause Music' : 'Play Music'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
