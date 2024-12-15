import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import { Text, View, Pressable, SafeAreaView } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

import { useTimeTillChristmas } from '@/hooks/useTimeTillChristmas';
import { useScaling } from '@/hooks/useScaling';

import '../global.css';

const image = require('@/assets/images/morriscropped.jpg');
const audioSource = require('@/assets/audio/o-christmas-tree.mp3');

import '../global.css';
import { useAppState } from '@/hooks/useAppState';

const fractionCompleteFromPosition = (
  position: number | undefined,
  duration: number | undefined,
) => {
  return duration !== undefined ? (position ?? 0) / duration : 0;
};

function ViewWrapper(props: {
  direction: 'row' | 'column';
  children: any;
  style: any;
}) {
  return props.direction === 'row' ? (
    <SafeAreaView
      style={props.style}
      className="flex-1 flex-row justify-center items-start bg-[#ffffcc]"
    >
      {props.children}
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={props.style}
      className="flex-1 justify-center items-start bg-[#ffffcc]"
    >
      {props.children}
    </SafeAreaView>
  );
}

function SleepsView() {
  const { days } = useTimeTillChristmas(60.0);
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-600 font-bold text-2xl text-center">{`Only ${
        days + 1
      } sleeps until Christmas!`}</Text>
    </View>
  );
}

function CountdownView() {
  const { days, hours, minutes, seconds } = useTimeTillChristmas();
  return (
    <View className="mx-[20] p-[10] flex-1 justify-start items-start">
      <Text className="text-green-600 text-xl text-start">{`${days} days`}</Text>
      <Text className="text-green-600 text-xl text-start">{`${hours} hours`}</Text>
      <Text className="text-green-600 text-xl text-start">{`${minutes} minutes`}</Text>
      <Text className="text-green-600 text-xl text-start">{`${seconds} seconds`}</Text>
    </View>
  );
}
export default function Index() {
  const { imageWidth, imageHeight, starTop, starRight, starSize, landscape } =
    useScaling();

  const theme = vars({
    '--image-height': imageWidth,
    '--image-width': imageHeight,
    '--star-top': starTop,
    '--star-right': starRight,
    '--star-size': starSize,
    '--star-radius': starSize / 2,
  });

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

  return (
    <ViewWrapper style={theme} direction={landscape ? 'row' : 'column'}>
      <View className="flex-1 justify-center w-full">
        <SleepsView />
      </View>
      <ImageBackground
        style={{ width: imageWidth, height: imageHeight }}
        contentFit="cover"
        source={image}
      >
        <View className="h-[--star-size] w-[--star-size] rounded-[--star-radius] bg-[#ffffcc] animate-throb absolute top-[--star-top] right-[--star-right]" />
        <CountdownView />
      </ImageBackground>
      <View className="flex-1 flex-column h-screen justify-center items-center w-screen">
        <Pressable
          onPress={togglePlayer}
          className="transition duration-500 hover:scale-110 focus:scale-110 active:scale-125"
        >
          <Text className="text-green-800 font-bold text-2xl text-center">
            {wasPlaying ? 'Pause Music' : 'Play Music'}
          </Text>
        </Pressable>
      </View>
    </ViewWrapper>
  );
}
