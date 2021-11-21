/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useCallback, useContext, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import RunTestButton from '../components/RunTestButton';

type CameraPosition = 'front' | 'back';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const JSICamera: FC = () => {
  const {mode} = useContext(MainContext);

  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');

  const camera = useRef<Camera>(null);

  const devices = useCameraDevices('wide-angle-camera');
  const currentLabel = useSharedValue('');
  const testResults = useSharedValue<any>([]);
  const device = devices[cameraPosition];

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    if (mode === 'image_label') {
      testResults.value = labelImage(frame);
      if (testResults.value?.[0]) {
        currentLabel.value = testResults.value[0].label;
      }
    } else if (mode === 'barcode_scan') {
      const response = scanQRCodes(frame);
      if (response) {
        testResults.value = response;
        // runOnJS(onResultsDetected)(response);

        if (response?.[0]?.content) {
          currentLabel.value = JSON.stringify(response[0].content);
        }
      }
    } else if (mode === 'text_regocnizition') {
      const results = recognizeText(frame);
    }
  }, []);

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
      <RunTestButton testResults={testResults} onRunTest={() => null} />
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
