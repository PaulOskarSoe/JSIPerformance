/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Reanimated from 'react-native-reanimated';

interface IJSICamera {}

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const JSICamera: FC<IJSICamera> = () => {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  console.log('device:', device);

  return (
    <View style={styles.container}>
      {device && (
        <ReanimatedCamera
          style={StyleSheet.absoluteFill}
          isActive
          ref={camera}
          device={device}
          photo
          video
        />
      )}
    </View>
  );
};

export default JSICamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
