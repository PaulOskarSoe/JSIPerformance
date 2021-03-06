/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useContext, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Reanimated, {useSharedValue} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import {scanFaces} from 'vision-camera-face-detector';
import RunTestButton from '../components/RunTestButton';
import {MainContext} from '../context/MainContext';
import {recognizeText} from './frame-processors/recognizeText';
import {Label} from './Label';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const JSICamera: FC = () => {
  const {mode} = useContext(MainContext);

  const camera = useRef<Camera>(null);

  const devices = useCameraDevices('wide-angle-camera');
  const currentLabel = useSharedValue('');
  const testResults = useSharedValue<any>([]);
  const device = devices.back;

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(res => {
      if (res === 'denied') {
        Camera.requestCameraPermission();
      }
    });
    Camera.getMicrophonePermissionStatus();
  }, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (mode === 'barcode_scan') {
        const scannedCodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS]);

        testResults.value = scannedCodes;
        if (scannedCodes && scannedCodes.length > 0) {
          currentLabel.value = JSON.stringify(scannedCodes);
        }
      } else if (mode === 'text_regocnizition') {
        const recognizedText = recognizeText(frame);

        testResults.value = [recognizedText];
        if (recognizedText) {
          currentLabel.value = JSON.stringify(recognizedText.text);
        }
      } else if (mode === 'face_detection') {
        const detectedFaces = scanFaces(frame);
        testResults.value = detectedFaces;
        if (detectedFaces && detectedFaces.length > 0) {
          currentLabel.value = JSON.stringify(detectedFaces);
        }
      }
    },
    [mode],
  );

  return (
    <View style={styles.container}>
      {device && (
        <ReanimatedCamera
          frameProcessor={mode && frameProcessor}
          frameProcessorFps={60}
          fps={60}
          style={styles.camera}
          isActive
          ref={camera}
          device={device}
        />
      )}
      <Label sharedValue={currentLabel} />
      <RunTestButton
        architecture="jsi"
        testResults={testResults}
        onRunTest={() => null}
      />
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
