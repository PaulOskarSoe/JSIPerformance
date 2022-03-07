import React, {FC, useContext, useMemo, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainContext, MLMode} from '../context/MainContext';
import {Colors} from '../theme';
import DeviceJsi from 'react-native-device-jsi';
import ArchitectureTabs from './components/ArchitectureTabs';
import {
  runBridgeStorageBenchmark,
  runCustomBridgeNativeModule,
  runCustomJsiNativeModule,
  runJsiStorageBenchmark,
} from './benchmarks';

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

type architectures = 'jsi' | 'bridge';

const BenchMarkScreen: FC<IBenchMarkScreen> = () => {
  const {mode, setMode} = useContext(MainContext);

  const [storageCounter, setStorageCounter] = useState<number>(1000);
  const [customModuleCounter, setCustomModuleCounter] = useState<number>(1000);

  const storageArchitecture = useRef<architectures>('jsi');
  const customNativeModuleArchitecture = useRef<architectures>('jsi');

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
    <ScrollView style={styles.scrollView}>
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
              {currentMLKit
                ? `Current ML kit: ${currentMLKit}`
                : 'Select ML kit'}
            </Text>
          </RNPickerSelect>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={async () => {
                DeviceJsi.getDeviceName();
              }}
              style={styles.actionButton}
              hitSlop={{bottom: 50, left: 50, right: 50, top: 20}}>
              <Text style={styles.actionText}>SHOW RESULTS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardHeaderText}>
            Cache CRUD operation performance
          </Text>

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
      </SafeAreaView>
    </ScrollView>
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
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
  },
  settingsCard: {
    backgroundColor: Colors.card,
    borderBottomColor: Colors.background,
    borderBottomWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
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
});
