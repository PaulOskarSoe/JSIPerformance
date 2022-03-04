import dayjs from 'dayjs';
import React, {FC, useContext, useMemo, useState} from 'react';
import {
  Alert,
  AsyncStorage,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import {MainContext, MLMode} from '../context/MainContext';
import {storage} from '../storage';
import {Colors} from '../theme';

interface ISettingsScreen {}

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

const SettingsScreen: FC<ISettingsScreen> = () => {
  const {DeviceInformationModule} = NativeModules;

  const {mode, setMode} = useContext(MainContext);

  const [counter, setCounter] = useState<number>(1000);
  const [architecture, setArchitecture] = useState<architectures>('jsi');

  const currentMLKit = useMemo<string | undefined>(() => {
    return options.find(option => option.value === mode)?.label;
  }, [mode]);

  const runJsiTest = () => {
    storage.clearAll();

    const jsiTestStartedAt = dayjs();

    // creation
    const jsiItemsCreationsStartedAt = dayjs();
    for (let index = 0; index < counter; index++) {
      storage.set(`JSI-${index}-${uuid.v4()}`, `${uuid.v4()}`);
    }
    const jsiItemsCreationsFinishedAt = dayjs();

    const allKeys = storage.getAllKeys();

    // read
    const jsiReadingStartedAt = dayjs();
    allKeys.forEach(key => {
      storage.getString(key);
    });
    const jsiReadingFinishedAt = dayjs();

    // update
    const jsiUpdateStartedAt = dayjs();
    allKeys.forEach(key => {
      storage.set(key, `${uuid.v4()}`);
    });
    const jsiUpdateCompletedAt = dayjs();

    // delete
    const jsiDeletionStartedAt = dayjs();
    allKeys.forEach(key => {
      storage.delete(key);
    });
    const jsiDeletionFinishedAt = dayjs();

    const jsiTestFinishedAt = dayjs();

    const result = `
      Total test time: ${jsiTestFinishedAt.diff(
        jsiTestStartedAt,
        'milliseconds',
      )}
      Creation time: ${jsiItemsCreationsFinishedAt.diff(
        jsiItemsCreationsStartedAt,
        'milliseconds',
      )}
      Reading time: ${jsiReadingFinishedAt.diff(
        jsiReadingStartedAt,
        'milliseconds',
      )}
      Update time: ${jsiUpdateCompletedAt.diff(
        jsiUpdateStartedAt,
        'milliseconds',
      )}
      Deletion test: ${jsiDeletionFinishedAt.diff(
        jsiDeletionStartedAt,
        'milliseconds',
      )}
      `;

    Alert.alert('Result', result);
  };

  const runBridgeTest = async () => {
    const keysToDelete = await AsyncStorage.getAllKeys();

    await AsyncStorage.multiRemove(keysToDelete);

    // creation
    let arrayOfKeys = [];
    for (let index = 0; index < counter; index++) {
      arrayOfKeys.push(`bridge-${index}-${uuid.v4()}`);
    }

    const bridgeTestStartedAt = dayjs();
    const bridgeItemsCreationsStartedAt = dayjs();

    await Promise.all(
      arrayOfKeys.map(key => AsyncStorage.setItem(key, `${uuid.v4()}`)),
    )
      .then(val => JSON.stringify(val))
      .catch(err => {
        console.error('err:', err);
      });

    const bridgeItemsCreationsFinishedAt = dayjs();

    const allKeys = await AsyncStorage.getAllKeys();

    // read
    const bridgeReadingStartedAt = dayjs();
    await Promise.all(allKeys.map(key => AsyncStorage.getItem(key)));
    const bridgeReadingFinishedAt = dayjs();

    // update
    const bridgeUpdateStartedAt = dayjs();
    await Promise.all(
      allKeys.map(key => AsyncStorage.setItem(key, `${uuid.v4}`)),
    );
    const bridgeUpdateCompletedAt = dayjs();

    // delete
    const bridgeDeletionStartedAt = dayjs();
    await Promise.all(allKeys.map(key => AsyncStorage.removeItem(key)));
    const bridgeDeletionFinishedAt = dayjs();

    const bridgeTestFinishedAt = dayjs();

    const result = `
    Total test time: ${bridgeTestFinishedAt.diff(
      bridgeTestStartedAt,
      'milliseconds',
    )}
    Creation time: ${bridgeItemsCreationsFinishedAt.diff(
      bridgeItemsCreationsStartedAt,
      'milliseconds',
    )}
    Reading time: ${bridgeReadingFinishedAt.diff(
      bridgeReadingStartedAt,
      'milliseconds',
    )}
    Update time: ${bridgeUpdateCompletedAt.diff(
      bridgeUpdateStartedAt,
      'milliseconds',
    )}
    Deletion test: ${bridgeDeletionFinishedAt.diff(
      bridgeDeletionStartedAt,
      'milliseconds',
    )}
    `;

    Alert.alert('Result', result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsCard}>
        <Text style={styles.cardHeaderText}>
          Cache CRUD operation performance
        </Text>

        <View style={styles.architecureTabs}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setArchitecture('jsi')}
            style={architecture === 'jsi' ? styles.activeTab : styles.tab}>
            <Text
              style={
                architecture === 'jsi' ? styles.activeTabText : styles.tabText
              }>
              JSI
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setArchitecture('bridge')}
            style={architecture === 'bridge' ? styles.activeTab : styles.tab}>
            <Text
              style={
                architecture === 'bridge'
                  ? styles.activeTabText
                  : styles.tabText
              }>
              BRIDGE
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textInput}
          onChangeText={e => setCounter(parseInt(e, 10))}
          placeholder="Operation counter"
          keyboardType="numeric"
          defaultValue={counter.toString()}
        />
        <View style={styles.cardFooter}>
          <TouchableOpacity
            onPress={() => {
              if (architecture === 'jsi') {
                runJsiTest();
              } else {
                runBridgeTest();
              }
            }}
            style={styles.actionButton}
            hitSlop={{bottom: 50, left: 50, right: 50, top: 20}}>
            <Text style={styles.actionText}>RUN TEST</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          <Text>
            {currentMLKit
              ? `Current ML kit: ${currentMLKit}`
              : 'Select a ML kit'}
          </Text>
        </RNPickerSelect>
        <View style={styles.cardFooter}>
          <TouchableOpacity
            onPress={async () => {
              DeviceInformationModule.getModel(val => {
                console.log('val:', val);
              });

              // console.log('Device:', DeviceInformationModule.getModel());
              // DeviceInformationModule.getModel().then(res => {
              //   console.log('res:', res);
              // });
            }}
            style={styles.actionButton}
            hitSlop={{bottom: 50, left: 50, right: 50, top: 20}}>
            <Text style={styles.actionText}>SHOW RESULTS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
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
    backgroundColor: Colors.background,
    height: '100%',
    padding: 20,
  },
  settingsCard: {
    backgroundColor: Colors.card,
    borderBottomColor: Colors.background,
    borderBottomWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  architecureTabs: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  activeTab: {
    width: '50%',

    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    lineHeight: 30,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 30,
  },
  tab: {
    width: '50%',
    borderBottomWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
