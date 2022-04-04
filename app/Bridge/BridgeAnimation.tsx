import {useRoute} from '@react-navigation/native';
import React, {FC} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import AnimatedImage from './AnimatedImage';

const COUNT = 50;

interface IBridgeAnimation {}

const BridgeAnimation: FC<IBridgeAnimation> = () => {
  const {params} = useRoute<any>();

  const imageCount = params.imageCount || COUNT;

  const renderArray = [];

  for (let index = 0; index < imageCount; index++) {
    renderArray.push(<AnimatedImage key={index} />);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderArray.map(x => x)}
    </ScrollView>
  );
};

export default BridgeAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
