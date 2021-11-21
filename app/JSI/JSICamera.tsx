/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useContext, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import Reanimated from 'react-native-reanimated';
import {useSharedValue} from 'react-native-reanimated';
import {Label} from './Label';
import {MainContext} from '../context/MainContext';

// frame processors
import {labelImage} from './frame-processors/labelImage';
import {scanQRCodes} from 'vision-camera-qrcode-scanner';
import {recognizeText} from './frame-processors/recognizeText';

interface IJSICamera {}

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const JSICamera: FC<IJSICamera> = () => {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const {mode} = useContext(MainContext);

  const currentLabel = useSharedValue('');

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (mode === 'image_label') {
        const labels = labelImage(frame);
        currentLabel.value = labels[0]?.label;
      } else if (mode === 'barcode_scan') {
        const results = scanQRCodes(frame);

        if (results[0]?.content) {
          currentLabel.value = JSON.stringify(results[0]?.content);
        }
      } else if (mode === 'text_regocnizition') {
        const results = recognizeText(frame);
      }
    },
    [currentLabel],
  );

  return (
    <View style={styles.container}>
      {device && (
        <ReanimatedCamera
          frameProcessor={frameProcessor}
          frameProcessorFps={3}
          fps={60}
          style={styles.camera}
          isActive
          ref={camera}
          device={device}
        />
      )}
      <Label sharedValue={currentLabel} />
    </View>
  );
};

export default JSICamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  foundItem: {
    position: 'absolute',
    top: 50,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
    fontWeight: 600,
  },
});
