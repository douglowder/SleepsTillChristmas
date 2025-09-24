import { vars } from 'nativewind';
import { ImageBackground } from 'expo-image';
import { Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

import {
  sleepsTillChristmasString,
  useTimeTillChristmas,
} from '@/hooks/useTimeTillChristmas';
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
  const timeLeft = useTimeTillChristmas(5.0);
  const { landscape } = useScaling();
  return (
    <View className="flex-1 justify-center items-center">
      <Text
        className={`text-red-600 font-bold ${
          landscape ? 'text-[3vw]' : 'text-[3vh]'
        } text-center`}
      >
        {sleepsTillChristmasString(timeLeft)}
      </Text>
    </View>
  );
}

function PlayMusicView(props: {
  togglePlayer: () => void;
  wasPlaying: boolean;
}) {
  const { landscape } = useScaling();
  const { togglePlayer, wasPlaying } = props;
  return (
    <View className="flex-1 justify-center items-center">
      <Pressable
        accessibilityRole="button"
        tvParallaxProperties={{ enabled: false }}
        onPress={togglePlayer}
        className="transition duration-500 hover:scale-110 focus:scale-110 active:scale-125"
      >
        <Text
          className={`text-green-800 font-bold ${
            landscape ? 'text-[3vw]' : 'text-[3vh]'
          } text-center`}
        >
          {wasPlaying ? 'Pause Music' : 'Play Music'}
        </Text>
      </Pressable>
    </View>
  );
}

function CountdownView() {
  const { landscape } = useScaling();
  const { days, hours, minutes, seconds, isChristmas } = useTimeTillChristmas();
  if (isChristmas) {
    return null;
  }
  const className = `text-green-600 ${
    landscape ? 'text-[1.75vw]' : 'text-[2vh]'
  } text-[3vw] text-start`;
  return (
    <View className="mx-[20] p-[10] flex-1 justify-start items-start">
      <Text className={className}>{`${days} days`}</Text>
      <Text className={className}>{`${hours} hours`}</Text>
      <Text className={className}>{`${minutes} minutes`}</Text>
      <Text className={className}>{`${seconds} seconds`}</Text>
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

  const player = useAudioPlayer(audioSource, {
    updateInterval: 1000,
  });
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
        <PlayMusicView togglePlayer={togglePlayer} wasPlaying={wasPlaying} />
      </View>
    </ViewWrapper>
  );
}
