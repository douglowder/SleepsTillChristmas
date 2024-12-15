import { scale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

export type Scaling = {
  width: number;
  height: number;
  imageHeight: number;
  imageWidth: number;
  landscape: boolean;
  starTop: number;
  starRight: number;
  starSize: number;
};

const computeScaling = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const originalImageWidth = 798;
  const originalImageHeight = 926;

  const landscape = width > height;

  let imageHeight;
  let imageWidth;

  if (landscape) {
    imageHeight = height;
    imageWidth = Math.floor(
      (height * originalImageWidth) / originalImageHeight,
    );
  } else {
    imageWidth = width;
    imageHeight = Math.floor(
      (width * originalImageHeight) / originalImageWidth,
    );
  }

  const starTop = Math.floor((imageHeight * 20) / 435);
  const starRight = Math.floor((imageWidth * 85) / 375);
  const starSize = Math.floor((imageWidth * 40) / 375);

  const scaling = {
    height,
    width,
    imageHeight,
    imageWidth,
    starTop,
    starRight,
    starSize,
    landscape,
  } as Scaling;
  console.log(`scaling = ${JSON.stringify(scaling, null, 2)}`);
  return scaling;
};

export const useScaling = () => {
  const { width, height } = Dimensions.get('screen');
  const [scaling, setScaling] = useState<Scaling>(
    computeScaling({ width, height }),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setScaling(
        computeScaling({ width: screen.width, height: screen.height }),
      );
    });
    return () => subscription.remove();
  }, []);

  return scaling;
};
