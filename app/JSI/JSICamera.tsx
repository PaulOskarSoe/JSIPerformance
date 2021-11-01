import React, {FC, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Camera} from 'react-native-vision-camera';

interface IJSICamera {}

const JSICamera: FC<IJSICamera> = () => {
  const camera = useRef<Camera>(null);

  return (
    <View style={styles.container}>
      <Text>JSI camera</Text>
    </View>
  );
};

export default JSICamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
