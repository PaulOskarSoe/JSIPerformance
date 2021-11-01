import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface IBridgeCamera {}

const BridgeCamera: FC<IBridgeCamera> = () => {
  return (
    <View style={styles.container}>
      <Text />
    </View>
  );
};

export default BridgeCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
