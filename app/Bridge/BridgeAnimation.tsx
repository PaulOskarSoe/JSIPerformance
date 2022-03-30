import {ScrollView, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import AnimatedImage from './AnimatedImage';

const COUNT = 350;

interface IBridgeAnimation {}

const BridgeAnimation: FC<IBridgeAnimation> = () => {
  const renderArray = [];

  for (let index = 0; index < COUNT; index++) {
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
