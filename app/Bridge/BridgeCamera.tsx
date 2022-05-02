import React, {FC, useContext, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useSharedValue} from 'react-native-reanimated';
import RunTestButton from '../components/RunTestButton';
import {MainContext} from '../context/MainContext';
import {Label} from '../jsi/Label';

interface IBridgeCamera {}

const BridgeCamera: FC<IBridgeCamera> = () => {
  const camera = useRef(null);
  const {mode} = useContext(MainContext);

  const testResults = useSharedValue<any>([]);
  const currentResult = useSharedValue<any>([]);

  const props = useMemo(() => {
    if (mode === 'barcode_scan') {
      return {
        onGoogleVisionBarcodesDetected: ({barcodes}: {barcodes: any}) => {
          testResults.value = barcodes;
          if (barcodes.length > 0) {
            currentResult.value = barcodes;
          }
        },
      };
    } else if (mode === 'text_regocnizition') {
      return {
        onTextRecognized: (text: any) => {
          testResults.value = [text];
          if (text.textBlocks.length > 0) {
            currentResult.value = JSON.stringify(text.textBlocks);
          }
        },
      };
    } else if (mode === 'face_detection') {
      return {
        onFacesDetected: (facesResponse: any) => {
          const {faces} = facesResponse;
          testResults.value = faces;
          if (faces.length > 0) {
            currentResult.value = faces;
          }
        },
      };
    }
  }, [currentResult, mode, testResults]);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        {...props}
      />
      <RunTestButton
        architecture="bridge"
        testResults={testResults}
        onRunTest={() => null}
      />
      <Label sharedValue={currentResult} key="bridge" />
    </View>
  );
};

export default BridgeCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
