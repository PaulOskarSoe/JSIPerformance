import React, {FC, useEffect, useRef} from 'react';
import {Image, Animated, Easing} from 'react-native';

interface IAnimatedImage {}

const AnimatedImage: FC<IAnimatedImage> = () => {
  const spinAim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.exp,
      }),
    ).start();
  }, [spinAim]);

  const spin = spinAim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: spin}]}}>
      <Image
        source={require('./../assets/react-native-logo.png')}
        style={{width: 30, height: 30}}
      />
    </Animated.View>
  );
};

export default AnimatedImage;
