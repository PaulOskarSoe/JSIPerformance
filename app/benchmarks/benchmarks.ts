import dayjs from 'dayjs';
import {storage as jsiStorage} from '../jsiStorage';
import {bridgeStorage} from '../bridgeStorage';
import uuid from 'react-native-uuid';
import {Alert, NativeModules} from 'react-native';
import DeviceJsi from 'react-native-device-jsi';

export const runJsiStorageBenchmark = (storageCounter: number) => {
  jsiStorage.clearAll();

  const testStartedAt = dayjs();

  // creation
  const itemsCreationsStartedAt = dayjs();
  for (let index = 0; index < storageCounter; index++) {
    jsiStorage.set(`JSI-${index}-${uuid.v4()}`, `${uuid.v4()}`);
  }
  const itemsCreationsFinishedAt = dayjs();

  const allKeys = jsiStorage.getAllKeys();

  // read
  const readingStartedAt = dayjs();
  allKeys.forEach(key => {
    jsiStorage.getString(key);
  });
  const readtingFinishedAt = dayjs();

  // delete
  const deletionStartedAt = dayjs();
  allKeys.forEach(key => {
    jsiStorage.delete(key);
  });
  const deletionFinishedAt = dayjs();

  const testFinishedAt = dayjs();

  const result = `
      Total test time: ${testFinishedAt.diff(testStartedAt, 'milliseconds')}
      Creation time: ${itemsCreationsFinishedAt.diff(
        itemsCreationsStartedAt,
        'milliseconds',
      )}
      Reading time: ${readtingFinishedAt.diff(readingStartedAt, 'milliseconds')}
      Deletion test: ${deletionFinishedAt.diff(
        deletionStartedAt,
        'milliseconds',
      )}
      `;

  Alert.alert('Result', result);
};

export const runBridgeStorageBenchmark = async (storageCounter: number) => {
  await bridgeStorage.clearStore();

  // pre create all the keys
  const keys: string[] = [];

  for (let index = 0; index < storageCounter; index++) {
    keys.push(`JSI-${index}-${uuid.v4()}`);
  }

  /**
   * BENCHMARK LOGIC STARTS
   */

  const testStartedAt = dayjs();

  // create
  const itemsCreationsStartedAt = dayjs();

  keys.forEach(async (key: string) => {
    await bridgeStorage.setStringAsync(key, `${uuid.v4()}`);
  });

  const itemsCreationsFinishedAt = dayjs();

  // read
  const readingStartedAt = dayjs();
  keys.forEach(async key => {
    await bridgeStorage.getStringAsync(key);
  });
  const readtingFinishedAt = dayjs();

  // delete
  const deletionStartedAt = dayjs();
  keys.forEach(async key => {
    await bridgeStorage.removeItem(key);
  });
  const deletionFinishedAt = dayjs();

  const testFinishedAt = dayjs();

  const result = `
      Total test time: ${testFinishedAt.diff(testStartedAt, 'milliseconds')}
      Creation time: ${itemsCreationsFinishedAt.diff(
        itemsCreationsStartedAt,
        'milliseconds',
      )}
      Reading time: ${readtingFinishedAt.diff(readingStartedAt, 'milliseconds')}
      Deletion test: ${deletionFinishedAt.diff(
        deletionStartedAt,
        'milliseconds',
      )}
      `;

  Alert.alert('Result', result);
};

export const runCustomJsiNativeModule = (counter: number) => {
  const {getDeviceName} = DeviceJsi;
  const testStartedAt = dayjs();

  for (let index = 0; index < counter; index++) {
    getDeviceName();
  }

  const testFinishedAt = dayjs();

  const result = `
  Total test time: ${testFinishedAt.diff(testStartedAt, 'milliseconds')}
  `;

  Alert.alert('Result', result);
};

export const runCustomBridgeNativeModule = async (counter: number) => {
  const {DeviceInformationModule} = NativeModules;
  const {getModel} = DeviceInformationModule;
  const testStartedAt = dayjs();

  for (let index = 0; index < counter; index++) {
    await getModel();
  }

  const testFinishedAt = dayjs();

  const result = `
  Total test time: ${testFinishedAt.diff(testStartedAt, 'milliseconds')}
  `;

  Alert.alert('Result', result);
};
