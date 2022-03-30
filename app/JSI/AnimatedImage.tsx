import React, {FC} from 'react';
import {Image} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface IAnimatedImage {}

const AnimatedImage: FC<IAnimatedImage> = () => {
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withRepeat(
            withSequence(
              withTiming(360 + 'deg', {duration: 1000, easing: Easing.exp}),
              withTiming(0 + 'deg', {duration: 1000, easing: Easing.exp}),
            ),
            -1,
            false,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[style]}>
      <Image
        source={require('./../assets/react-native-logo.png')}
        style={{width: 35, height: 35}}
      />
    </Animated.View>
  );
};

export default AnimatedImage;
