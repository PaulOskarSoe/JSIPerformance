import React, {FC, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useSharedValue} from 'react-native-reanimated';
import RunTestButton from '../components/RunTestButton';
import {Label} from '../jsi/Label';

interface IBridgeCamera {}

const BridgeCamera: FC<IBridgeCamera> = () => {
  const camera = useRef(null);

  const testResults = useSharedValue<any>([]);
  const currentResult = useSharedValue<any>([]);

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
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          console.log(barcodes);
        }}
        faceDetectionMode={'fast'}
        onFaceDetectionError={err => console.error('error:', err)}
        onFacesDetected={facesResponse => {
          const {faces} = facesResponse;
          if (faces.length > 0) {
            currentResult.value = faces;
            testResults.value = faces;
          }
        }}
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
