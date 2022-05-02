import {useNavigation} from '@react-navigation/native';
import React, {FC, useContext, useMemo, useRef, useState} from 'react';
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainContext, MLMode} from '../context/MainContext';
import {Colors} from '../theme';
import {
  runBridgeStorageBenchmark,
  runCustomBridgeNativeModule,
  runCustomJsiNativeModule,
  runJsiStorageBenchmark,
} from './benchmarks';
import ArchitectureTabs from './components/ArchitectureTabs';
import {storage} from '../jsiStorage';

interface IBenchMarkScreen {}

interface IMLOptions {
  label: string;
  value: MLMode;
}

const options: IMLOptions[] = [
  {label: 'Barcode scanning', value: 'barcode_scan'},
  {label: 'Text recognizition', value: 'text_regocnizition'},
  {label: 'Face detection', value: 'face_detection'},
];

export type RootStackParamList = {
  JsiAnimationScreen: undefined;
  Home: undefined;
};

type architectures = 'jsi' | 'bridge';

const BenchMarkScreen: FC<IBenchMarkScreen> = () => {
  const {mode, setMode} = useContext(MainContext);
  const {navigate} = useNavigation();

  const [storageCounter, setStorageCounter] = useState<number>(1000);
  const [customModuleCounter, setCustomModuleCounter] = useState<number>(1000);
  const [mlKitModalVisible, setMlKitModalVisible] = useState<boolean>(false);
  const [imageCount, setImageCount] = useState<number>(100);

  const storageArchitecture = useRef<architectures>('jsi');
  const customNativeModuleArchitecture = useRef<architectures>('jsi');

  const allMlKitResults = useMemo<string[]>(() => {
    const keys = storage.getAllKeys();

    const values: string[] = [];

    keys.forEach((key: string) => {
      const value = storage.getString(key);
      if (value) {
        const parsedValue: any = JSON.parse(value);

        if (parsedValue?.results) {
          let totalResultCount = 0;

          parsedValue.results.forEach((result: any) => {
            totalResultCount += result.detected_by_frame as unknown as number;
          });
          parsedValue.totalResultCount = totalResultCount;
        }

        values.push(parsedValue);
      }
    });

    return values;
  }, []);

  const currentMLKit = useMemo<string | undefined>(() => {
    return options.find(option => option.value === mode)?.label;
  }, [mode]);

  const runStorageBenchmark = () => {
    if (storageArchitecture.current === 'jsi') {
      runJsiStorageBenchmark(storageCounter);
    } else {
      runBridgeStorageBenchmark(storageCounter);
    }
  };

  const runCustomNativeModuleBenchmark = () => {
    if (customNativeModuleArchitecture.current === 'jsi') {
      runCustomJsiNativeModule(customModuleCounter);
    } else {
      runCustomBridgeNativeModule(customModuleCounter);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={styles.settingsCard}>
          <Text style={styles.cardHeaderText}>Google ML kit performance</Text>
          <RNPickerSelect
            style={{
              viewContainer: styles.picker,
              inputAndroidContainer: styles.picker,
            }}
            items={options}
            onValueChange={val => setMode(val)}
            value={mode}>
            <Text style={styles.mlKitText}>
              {currentMLKit ? `${currentMLKit}` : 'Select ML kit'}
            </Text>
          </RNPickerSelect>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => {
                setMlKitModalVisible(true);
              }}
              style={styles.actionButton}
              hitSlop={{bottom: 50, left: 50, right: 50, top: 20}}>
              <Text style={styles.actionText}>SHOW RESULTS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardHeaderText}>MMKV storage operations</Text>

          <ArchitectureTabs
            onChange={(newArchitecture: architectures) => {
              storageArchitecture.current = newArchitecture;
            }}
          />

          <TextInput
            style={styles.textInput}
            onChangeText={e => setStorageCounter(parseInt(e, 10))}
            placeholder="Operation counter"
            keyboardType="numeric"
            defaultValue={storageCounter.toString()}
          />
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={runStorageBenchmark}
              style={styles.actionButton}
              hitSlop={{bottom: 50, left: 50, right: 50, top: 20}}>
              <Text style={styles.actionText}>RUN TEST</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardHeaderText}>
            Custom Native Module performance
          </Text>
          <ArchitectureTabs
            onChange={(newArchitecture: architectures) => {
              customNativeModuleArchitecture.current = newArchitecture;
            }}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={e => setCustomModuleCounter(parseInt(e, 10))}
            placeholder="Operation counter"
            keyboardType="numeric"
            defaultValue={customModuleCounter.toString()}
          />
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={runCustomNativeModuleBenchmark}
              style={styles.actionButton}
              hitSlop={{bottom: 50, left: 50, right: 50, top: 20}}>
              <Text style={styles.actionText}>SHOW RESULTS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardHeaderText}>Animation performance</Text>
          <Text>Insert image count for animations</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={e => setImageCount(parseInt(e, 10))}
            placeholder="Operation counter"
            keyboardType="numeric"
            defaultValue={imageCount.toString()}
          />
          <View style={styles.cardFooter}>
            <View style={styles.row}>
              <Button
                title="JSI"
                onPress={() =>
                  navigate('JsiAnimationScreen' as never, {imageCount} as never)
                }
              />
              <Button
                title="Bridge"
                onPress={() =>
                  navigate(
                    'BridgeAnimationScreen' as never,
                    {imageCount} as never,
                  )
                }
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Modal
        transparent
        animationType="slide"
        visible={mlKitModalVisible}
        onRequestClose={() => setMlKitModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalInnerContainer}>
            <ScrollView>
              {allMlKitResults.map((result: any, index) => {
                return (
                  <View key={index} style={{marginBottom: 10}}>
                    <Text style={{fontSize: 20}}>
                      Architecture:{' '}
                      <Text style={{fontSize: 20}}>{result.architecture}</Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      mode: <Text style={{fontSize: 20}}>{result.mode}</Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      time:{' '}
                      <Text
                        style={{fontSize: 20}}>{`${result.testTime} s`}</Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      Results without value{' '}
                      <Text style={{fontSize: 20}}>{`${
                        result?.nullResults || 0
                      }`}</Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      Results with value{' '}
                      <Text style={{fontSize: 20}}>{`${
                        (result?.totalResults || 0) - result?.nullResults || 0
                      }`}</Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      Total results found:
                      <Text style={{fontSize: 20}}>
                        {' '}
                        {`${result.totalResults}`}
                      </Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      Total results count:
                      <Text style={{fontSize: 20}}>
                        {' '}
                        {`${result.totalResultCount}`}
                      </Text>
                    </Text>
                    <Text style={{fontSize: 20}}>
                      Frames found per second
                      <Text style={{fontSize: 20}}>
                        {' '}
                        {`${result?.totalResults / result.testTime || 0}`}
                      </Text>{' '}
                    </Text>
                    <Text style={{fontSize: 20}}>
                      Results without value{' '}
                      <Text style={{fontSize: 20}}>{`${
                        result?.nullResults || 0
                      }`}</Text>
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setMlKitModalVisible(false)}>
              <Text style={styles.actionText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default BenchMarkScreen;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 20,
    flex: 1,
    height: '100%',
  },
  cardHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
  },
  actionButton: {
    marginTop: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  actionText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  mlKitText: {
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: Colors.card,
    borderBottomColor: Colors.background,
    borderBottomWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  runTestText: {
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '500',
  },
  checkbox: {
    paddingBottom: 20,
  },
  checkboxText: {
    color: 'black',
    fontWeight: '600',
  },
  textInput: {
    marginTop: 20,
    height: 45,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderColor: Colors.border,
    borderRadius: 5,
  },
  picker: {
    marginTop: 20,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    justifyContent: 'center',
  },
  resultContainer: {
    marginTop: 30,
  },
  labelTextStyle: {
    textDecorationLine: 'none',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  result: {
    paddingBottom: 15,
  },
  modalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  modalInnerContainer: {
    width: '80%',
    height: '70%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 20,
    margin: 20,
  },
  navigationOptions: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
  },
  navigationOption: {
    height: 47,
    justifyContent: 'center',
    marginLeft: 16,
  },
  navigationOptionText: {
    color: '#353D48',
    fontSize: 16,
    fontWeight: '400',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderRadius: 100,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    bottom: 10,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
  },
});
