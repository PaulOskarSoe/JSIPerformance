/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {scanFaces, Face} from 'vision-camera-face-detector';

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

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (mode === 'image_label') {
        const labeledImages = labelImage(frame);

        if (labeledImages.length > 0) {
          if (testResults.value?.[0]) {
            currentLabel.value = testResults.value[0].label;
          }
        }
      } else if (mode === 'barcode_scan') {
        const scannedCodes = scanQRCodes(frame);

        if (scannedCodes.length > 0) {
          if (testResults.value?.[0]?.content) {
            currentLabel.value = JSON.stringify(testResults.value[0].content);
          }
        }
        // TODO needs implementation
      } else if (mode === 'text_regocnizition') {
        const results = recognizeText(frame);
      } else if (mode === 'face_detection') {
        const detectedFaces = scanFaces(frame);

        if (detectedFaces.length > 0) {
          testResults.value = scanFaces(frame);
          currentLabel.value = `Smiling => ${detectedFaces[0].smilingProbability}, Left eye open => ${detectedFaces[0].leftEyeOpenProbability} Right eye open => ${detectedFaces[0].rightEyeOpenProbability} `;
        }
      }
    },
    [mode],
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
